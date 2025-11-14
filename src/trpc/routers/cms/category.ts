import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";
import {
  generateSlug,
  validateCircularHierarchy,
  validateSlugUnique,
} from "./utils";

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  parentId: z.string().optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
});

const listCategoriesSchema = z.object({
  isActive: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
  search: z.string().optional(),
});

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        icon: true,
        articleCount: true,
      },
    });

    return categories;
  }),

  getBySlugPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug, isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          imageAlt: true,
          icon: true,
          articleCount: true,
          seoMetaTitle: true,
          seoMetaDescription: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  getAllSlugs: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    return categories.map((c) => c.slug);
  }),

  getTopByArticleCount: publicProcedure
    .input(z.object({ limit: z.number().default(8) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.category.findMany({
        where: { isActive: true, articleCount: { gt: 0 } },
        orderBy: { articleCount: "desc" },
        take: input.limit,
        select: {
          id: true,
          name: true,
          slug: true,
          articleCount: true,
          icon: true,
        },
      });
    }),

  list: adminProcedure.input(listCategoriesSchema).query(({ input, ctx }) => {
    const { isActive, parentId, search } = input;

    const where = {
      ...(isActive !== undefined && { isActive }),
      ...(parentId !== undefined && { parentId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    return ctx.db.category.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }),

  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, isActive: true },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  getTree: adminProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        children: {
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
          include: {
            children: {
              orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
            },
          },
        },
      },
      where: { parentId: null },
    });

    return categories;
  }),

  create: adminProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const slug = input.slug || generateSlug(input.name);
      await validateSlugUnique(ctx.db, "category", slug);

      if (input.parentId) {
        const parent = await ctx.db.category.findUnique({
          where: { id: input.parentId },
          select: { id: true, isActive: true },
        });

        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }

        if (!parent.isActive && input.isActive) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot create active category under inactive parent",
          });
        }
      }

      return ctx.db.category.create({
        data: {
          ...input,
          slug,
          articleCount: 0,
        },
      });
    }),

  update: adminProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.category.findUnique({
        where: { id },
        select: { id: true, isActive: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (data.slug) {
        await validateSlugUnique(ctx.db, "category", data.slug, id);
      }

      if (data.parentId) {
        await validateCircularHierarchy(ctx.db, id, data.parentId);

        const parent = await ctx.db.category.findUnique({
          where: { id: data.parentId },
          select: { isActive: true },
        });

        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }

        if (!parent.isActive && (data.isActive ?? existing.isActive)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot set active category under inactive parent",
          });
        }
      }

      if (data.isActive === false) {
        const activeChildren = await ctx.db.category.count({
          where: { parentId: id, isActive: true },
        });

        if (activeChildren > 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Cannot deactivate category with ${activeChildren} active children`,
          });
        }
      }

      return ctx.db.category.update({
        where: { id },
        data,
      });
    }),

  reorder: adminProcedure
    .input(
      z.object({
        id: z.string(),
        newDisplayOrder: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return ctx.db.category.update({
        where: { id: input.id },
        data: { displayOrder: input.newDisplayOrder },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: {
          articleCount: true,
          children: { select: { id: true } },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (category.articleCount > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete category with ${category.articleCount} articles`,
        });
      }

      if (category.children.length > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete category with ${category.children.length} child categories`,
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
