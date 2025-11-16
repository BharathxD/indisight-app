import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";
import { generateSlug, validateSlugUnique } from "./utils";

const createPersonSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  tagline: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.url().optional(),
  imageAlt: z.string().optional(),
  linkedinUrl: z.url().optional().or(z.literal("")),
});

const updatePersonSchema = createPersonSchema.partial().extend({
  id: z.string(),
});

const listPeopleSchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export const personRouter = router({
  getBySlugPublic: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const person = await ctx.db.person.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          jobTitle: true,
          company: true,
          description: true,
          imageUrl: true,
          imageAlt: true,
          linkedinUrl: true,
        },
      });

      if (!person) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Person not found",
        });
      }

      return person;
    }),

  getAllSlugs: publicProcedure.query(async ({ ctx }) => {
    const people = await ctx.db.person.findMany({
      select: { slug: true },
    });

    return people.map((p) => p.slug);
  }),

  list: adminProcedure.input(listPeopleSchema).query(async ({ input, ctx }) => {
    const { search, limit, cursor } = input;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
          { jobTitle: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const people = await ctx.db.person.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | undefined;
    if (people.length > limit) {
      const nextItem = people.pop();
      nextCursor = nextItem?.id;
    }

    return { people, nextCursor };
  }),

  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const person = await ctx.db.person.findUnique({
        where: { slug: input.slug },
      });

      if (!person) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Person not found",
        });
      }

      return person;
    }),

  create: adminProcedure
    .input(createPersonSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = input.slug || generateSlug(input.name);
      await validateSlugUnique(ctx.db, "person", slug);

      const person = await ctx.db.person.create({
        data: {
          name: input.name,
          slug,
          tagline: input.tagline,
          jobTitle: input.jobTitle,
          company: input.company,
          description: input.description,
          imageUrl: input.imageUrl,
          imageAlt: input.imageAlt,
          linkedinUrl: input.linkedinUrl || undefined,
        },
      });

      return person;
    }),

  update: adminProcedure
    .input(updatePersonSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const existingPerson = await ctx.db.person.findUnique({
        where: { id },
      });

      if (!existingPerson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Person not found",
        });
      }

      if (data.slug && data.slug !== existingPerson.slug) {
        await validateSlugUnique(ctx.db, "person", data.slug);
      }

      const updateData = Object.fromEntries(
        Object.entries(data)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, value === "" ? null : value])
      );

      const person = await ctx.db.person.update({
        where: { id },
        data: updateData,
      });

      return person;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const person = await ctx.db.person.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { articlePeople: true },
          },
        },
      });

      if (!person) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Person not found",
        });
      }

      if (person._count.articlePeople > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete person. They are featured in ${person._count.articlePeople} article(s).`,
        });
      }

      await ctx.db.person.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
