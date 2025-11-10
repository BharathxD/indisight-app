import { ArticleStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";
import {
  generateSlug,
  updateAuthorArticleCount,
  updateCategoryArticleCount,
  updateTagUsageCount,
  validateSlugUnique,
} from "./utils";

const createArticleSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.any(),
  featuredImageUrl: z.string().url().optional(),
  featuredImageAlt: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailAlt: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  status: z.enum(ArticleStatus).default(ArticleStatus.DRAFT),
  readTime: z.number().int().optional(),
  scheduledAt: z.date().optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  authorIds: z.array(z.string()).min(1),
  primaryAuthorId: z.string(),
  categoryIds: z.array(z.string()).min(1),
  primaryCategoryId: z.string(),
  tagIds: z.array(z.string()).default([]),
});

const updateArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.any().optional(),
  featuredImageUrl: z.string().url().optional(),
  featuredImageAlt: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailAlt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  status: z.enum(ArticleStatus).optional(),
  readTime: z.number().int().optional(),
  scheduledAt: z.date().optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  authorIds: z.array(z.string()).optional(),
  primaryAuthorId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  primaryCategoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

const listArticlesSchema = z.object({
  status: z.enum(ArticleStatus).optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  tagId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

const validatePublishRequirements = (article: {
  title: string;
  excerpt?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: content is any
  content: any;
  authorIds: string[];
  categoryIds: string[];
}) => {
  if (!article.title) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Title is required for published articles",
    });
  }

  if (!article.excerpt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Excerpt is required for published articles",
    });
  }

  if (!article.content) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Content is required for published articles",
    });
  }

  if (article.authorIds.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least one author is required for published articles",
    });
  }

  if (article.categoryIds.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least one category is required for published articles",
    });
  }
};

export const articleRouter = router({
  list: adminProcedure
    .input(listArticlesSchema)
    .query(async ({ input, ctx }) => {
      const {
        status,
        categoryId,
        authorId,
        tagId,
        isFeatured,
        isTrending,
        search,
        limit,
        cursor,
      } = input;

      const where = {
        ...(status && { status }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isTrending !== undefined && { isTrending }),
        ...(categoryId && {
          articleCategories: { some: { categoryId } },
        }),
        ...(authorId && {
          articleAuthors: { some: { authorId } },
        }),
        ...(tagId && {
          articleTags: { some: { tagId } },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const articles = await ctx.db.article.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { createdAt: "desc" },
        include: {
          articleAuthors: {
            include: { author: true },
            orderBy: { authorOrder: "asc" },
          },
          articleCategories: {
            include: { category: true },
          },
          articleTags: {
            include: { tag: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (articles.length > limit) {
        const nextItem = articles.pop();
        nextCursor = nextItem?.id;
      }

      return { articles, nextCursor };
    }),

  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: { slug: input.slug },
        include: {
          articleAuthors: {
            include: { author: true },
            orderBy: { authorOrder: "asc" },
          },
          articleCategories: {
            include: { category: true },
          },
          articleTags: {
            include: { tag: true },
          },
          relatedArticles: {
            include: {
              relatedArticle: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  excerpt: true,
                  featuredImageUrl: true,
                },
              },
            },
            orderBy: { relevanceScore: "desc" },
          },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      return article;
    }),

  create: adminProcedure
    .input(createArticleSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        authorIds,
        primaryAuthorId,
        categoryIds,
        primaryCategoryId,
        tagIds,
        scheduledAt,
        status,
        ...articleData
      } = input;

      const slug = input.slug || generateSlug(input.title);
      await validateSlugUnique(ctx.db, "article", slug);

      if (!authorIds.includes(primaryAuthorId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Primary author must be in authors list",
        });
      }

      if (!categoryIds.includes(primaryCategoryId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Primary category must be in categories list",
        });
      }

      if (scheduledAt && scheduledAt <= new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scheduled date must be in the future",
        });
      }

      if (status === ArticleStatus.PUBLISHED) {
        validatePublishRequirements({
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          authorIds,
          categoryIds,
        });
      }

      const authors = await ctx.db.author.findMany({
        where: { id: { in: authorIds } },
        select: { id: true },
      });

      if (authors.length !== authorIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more authors not found",
        });
      }

      const categories = await ctx.db.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, isActive: true },
      });

      if (categories.length !== categoryIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more categories not found",
        });
      }

      const inactiveCategory = categories.find((c) => !c.isActive);
      if (inactiveCategory) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot assign article to inactive category",
        });
      }

      if (tagIds.length > 0) {
        const tags = await ctx.db.tag.findMany({
          where: { id: { in: tagIds } },
          select: { id: true },
        });

        if (tags.length !== tagIds.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "One or more tags not found",
          });
        }
      }

      return ctx.db.$transaction(async (tx) => {
        const article = await tx.article.create({
          data: {
            ...articleData,
            slug,
            status,
            scheduledAt,
            publishedAt: status === ArticleStatus.PUBLISHED ? new Date() : null,
            viewCount: 0,
          },
        });

        await tx.articleAuthor.createMany({
          data: authorIds.map((authorId, index) => ({
            articleId: article.id,
            authorId,
            authorOrder: index,
            isPrimary: authorId === primaryAuthorId,
          })),
        });

        await tx.articleCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            articleId: article.id,
            categoryId,
            isPrimary: categoryId === primaryCategoryId,
          })),
        });

        if (tagIds.length > 0) {
          await tx.articleTag.createMany({
            data: tagIds.map((tagId) => ({
              articleId: article.id,
              tagId,
            })),
          });
        }

        for (const authorId of authorIds) {
          await updateAuthorArticleCount(tx, authorId);
        }

        for (const categoryId of categoryIds) {
          await updateCategoryArticleCount(tx, categoryId);
        }

        for (const tagId of tagIds) {
          await updateTagUsageCount(tx, tagId);
        }

        return article;
      });
    }),

  update: adminProcedure
    .input(updateArticleSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        authorIds,
        primaryAuthorId,
        categoryIds,
        primaryCategoryId,
        tagIds,
        scheduledAt,
        status,
        ...articleData
      } = input;

      const existing = await ctx.db.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          status: true,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (articleData.slug) {
        await validateSlugUnique(ctx.db, "article", articleData.slug, id);
      }

      if (scheduledAt && scheduledAt <= new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scheduled date must be in the future",
        });
      }

      if (
        status === ArticleStatus.PUBLISHED ||
        existing.status === ArticleStatus.PUBLISHED
      ) {
        const currentAuthors =
          authorIds ||
          (
            await ctx.db.articleAuthor.findMany({
              where: { articleId: id },
              select: { authorId: true },
            })
          ).map((a) => a.authorId);

        const currentCategories =
          categoryIds ||
          (
            await ctx.db.articleCategory.findMany({
              where: { articleId: id },
              select: { categoryId: true },
            })
          ).map((c) => c.categoryId);

        validatePublishRequirements({
          title: articleData.title ?? existing.title,
          excerpt: articleData.excerpt ?? existing.excerpt,
          content: articleData.content ?? existing.content,
          authorIds: currentAuthors,
          categoryIds: currentCategories,
        });
      }

      if (
        authorIds &&
        primaryAuthorId &&
        !authorIds.includes(primaryAuthorId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Primary author must be in authors list",
        });
      }

      if (
        categoryIds &&
        primaryCategoryId &&
        !categoryIds.includes(primaryCategoryId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Primary category must be in categories list",
        });
      }

      return ctx.db.$transaction(async (tx) => {
        const article = await tx.article.update({
          where: { id },
          data: {
            ...articleData,
            ...(status && { status }),
            ...(scheduledAt !== undefined && { scheduledAt }),
            ...(status === ArticleStatus.PUBLISHED &&
              existing.status !== ArticleStatus.PUBLISHED && {
                publishedAt: new Date(),
              }),
          },
        });

        if (authorIds) {
          const oldAuthors = await tx.articleAuthor.findMany({
            where: { articleId: id },
            select: { authorId: true },
          });

          await tx.articleAuthor.deleteMany({
            where: { articleId: id },
          });

          await tx.articleAuthor.createMany({
            data: authorIds.map((authorId, index) => ({
              articleId: id,
              authorId,
              authorOrder: index,
              isPrimary: authorId === primaryAuthorId,
            })),
          });

          const allAffectedAuthors = new Set([
            ...oldAuthors.map((a) => a.authorId),
            ...authorIds,
          ]);

          for (const authorId of allAffectedAuthors) {
            await updateAuthorArticleCount(tx, authorId);
          }
        }

        if (categoryIds) {
          const oldCategories = await tx.articleCategory.findMany({
            where: { articleId: id },
            select: { categoryId: true },
          });

          await tx.articleCategory.deleteMany({
            where: { articleId: id },
          });

          await tx.articleCategory.createMany({
            data: categoryIds.map((categoryId) => ({
              articleId: id,
              categoryId,
              isPrimary: categoryId === primaryCategoryId,
            })),
          });

          const allAffectedCategories = new Set([
            ...oldCategories.map((c) => c.categoryId),
            ...categoryIds,
          ]);

          for (const categoryId of allAffectedCategories) {
            await updateCategoryArticleCount(tx, categoryId);
          }
        }

        if (tagIds) {
          const oldTags = await tx.articleTag.findMany({
            where: { articleId: id },
            select: { tagId: true },
          });

          await tx.articleTag.deleteMany({
            where: { articleId: id },
          });

          if (tagIds.length > 0) {
            await tx.articleTag.createMany({
              data: tagIds.map((tagId) => ({
                articleId: id,
                tagId,
              })),
            });
          }

          const allAffectedTags = new Set([
            ...oldTags.map((t) => t.tagId),
            ...tagIds,
          ]);

          for (const tagId of allAffectedTags) {
            await updateTagUsageCount(tx, tagId);
          }
        }

        return article;
      });
    }),

  publish: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: { id: input.id },
        select: {
          status: true,
          title: true,
          excerpt: true,
          content: true,
          articleAuthors: { select: { authorId: true } },
          articleCategories: { select: { categoryId: true } },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      validatePublishRequirements({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        authorIds: article.articleAuthors.map((a) => a.authorId),
        categoryIds: article.articleCategories.map((c) => c.categoryId),
      });

      return ctx.db.article.update({
        where: { id: input.id },
        data: {
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
    }),

  unpublish: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      return ctx.db.article.update({
        where: { id: input.id },
        data: { status: ArticleStatus.ARCHIVED },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: { id: input.id },
        select: {
          articleAuthors: { select: { authorId: true } },
          articleCategories: { select: { categoryId: true } },
          articleTags: { select: { tagId: true } },
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      return ctx.db.$transaction(async (tx) => {
        await tx.article.delete({
          where: { id: input.id },
        });

        for (const { authorId } of article.articleAuthors) {
          await updateAuthorArticleCount(tx, authorId);
        }

        for (const { categoryId } of article.articleCategories) {
          await updateCategoryArticleCount(tx, categoryId);
        }

        for (const { tagId } of article.articleTags) {
          await updateTagUsageCount(tx, tagId);
        }
      });
    }),

  incrementViewCount: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) =>
      ctx.db.article.update({
        where: { id: input.id },
        data: { viewCount: { increment: 1 } },
      })
    ),
});
