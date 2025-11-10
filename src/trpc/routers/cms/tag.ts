import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";
import { generateSlug, updateTagUsageCount, validateSlugUnique } from "./utils";

const createTagSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  isTrending: z.boolean().default(false),
});

const updateTagSchema = createTagSchema.partial().extend({
  id: z.string(),
});

const listTagsSchema = z.object({
  isTrending: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export const tagRouter = router({
  list: adminProcedure.input(listTagsSchema).query(async ({ input, ctx }) => {
    const { isTrending, search, limit, cursor } = input;

    const where = {
      ...(isTrending !== undefined && { isTrending }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const tags = await ctx.db.tag.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { usageCount: "desc" },
    });

    let nextCursor: string | undefined;
    if (tags.length > limit) {
      const nextItem = tags.pop();
      nextCursor = nextItem?.id;
    }

    return { tags, nextCursor };
  }),

  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const tag = await ctx.db.tag.findUnique({
        where: { slug: input.slug },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      return tag;
    }),

  create: adminProcedure
    .input(createTagSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = input.slug || generateSlug(input.name);
      await validateSlugUnique(ctx.db, "tag", slug);

      return ctx.db.tag.create({
        data: {
          ...input,
          slug,
          usageCount: 0,
        },
      });
    }),

  update: adminProcedure
    .input(updateTagSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.tag.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      if (data.slug) {
        await validateSlugUnique(ctx.db, "tag", data.slug, id);
      }

      return ctx.db.tag.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const tag = await ctx.db.tag.findUnique({
        where: { id: input.id },
        select: { usageCount: true },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      if (tag.usageCount > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete tag with ${tag.usageCount} articles`,
        });
      }

      await ctx.db.tag.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  mergeTags: adminProcedure
    .input(
      z.object({
        sourceTagIds: z.array(z.string()).min(1),
        targetTagId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { sourceTagIds, targetTagId } = input;

      if (sourceTagIds.includes(targetTagId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Target tag cannot be in source tags list",
        });
      }

      const targetTag = await ctx.db.tag.findUnique({
        where: { id: targetTagId },
        select: { id: true },
      });

      if (!targetTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target tag not found",
        });
      }

      const sourceTags = await ctx.db.tag.findMany({
        where: { id: { in: sourceTagIds } },
        select: { id: true },
      });

      if (sourceTags.length !== sourceTagIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more source tags not found",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        const articleTags = await tx.articleTag.findMany({
          where: { tagId: { in: sourceTagIds } },
          select: { articleId: true, tagId: true },
        });

        for (const articleTag of articleTags) {
          const existingLink = await tx.articleTag.findUnique({
            where: {
              articleId_tagId: {
                articleId: articleTag.articleId,
                tagId: targetTagId,
              },
            },
          });

          if (!existingLink) {
            await tx.articleTag.create({
              data: {
                articleId: articleTag.articleId,
                tagId: targetTagId,
              },
            });
          }
        }

        await tx.articleTag.deleteMany({
          where: { tagId: { in: sourceTagIds } },
        });

        await tx.tag.deleteMany({
          where: { id: { in: sourceTagIds } },
        });

        await updateTagUsageCount(tx as PrismaClient, targetTagId);
      });

      return { success: true };
    }),
});
