import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";
import { generateSlug, validateSlugUnique } from "./utils";

const socialLinksSchema = z
  .object({
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
  })
  .optional();

const createAuthorSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  profileImageUrl: z.string().url().optional(),
  profileImageAlt: z.string().optional(),
  socialLinks: socialLinksSchema,
  isFeatured: z.boolean().default(false),
  userId: z.string().optional(),
});

const updateAuthorSchema = createAuthorSchema.partial().extend({
  id: z.string(),
});

const listAuthorsSchema = z.object({
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export const authorRouter = router({
  list: adminProcedure
    .input(listAuthorsSchema)
    .query(async ({ input, ctx }) => {
      const { isFeatured, search, limit, cursor } = input;

      const where = {
        ...(isFeatured !== undefined && { isFeatured }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const authors = await ctx.db.author.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (authors.length > limit) {
        const nextItem = authors.pop();
        nextCursor = nextItem?.id;
      }

      return { authors, nextCursor };
    }),

  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const author = await ctx.db.author.findUnique({
        where: { slug: input.slug },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!author) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Author not found",
        });
      }

      return author;
    }),

  create: adminProcedure
    .input(createAuthorSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = input.slug || generateSlug(input.name);
      await validateSlugUnique(ctx.db, "author", slug);

      if (input.userId) {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
      }

      return ctx.db.author.create({
        data: {
          ...input,
          slug,
          articleCount: 0,
        },
      });
    }),

  update: adminProcedure
    .input(updateAuthorSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.author.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Author not found",
        });
      }

      if (data.slug) {
        await validateSlugUnique(ctx.db, "author", data.slug, id);
      }

      if (data.userId) {
        const user = await ctx.db.user.findUnique({
          where: { id: data.userId },
          select: { id: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
      }

      return ctx.db.author.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const author = await ctx.db.author.findUnique({
        where: { id: input.id },
        select: { articleCount: true },
      });

      if (!author) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Author not found",
        });
      }

      if (author.articleCount > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete author with ${author.articleCount} articles`,
        });
      }

      await ctx.db.author.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
