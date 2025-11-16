import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

export const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type PrismaClientWithoutTransactions = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export const validateSlugUnique = async (
  db: PrismaClientWithoutTransactions,
  model: "author" | "article" | "category" | "tag" | "person",
  slug: string,
  excludeId?: string
): Promise<void> => {
  let existing: { id: string } | null = null;

  switch (model) {
    case "author":
      existing = await db.author.findUnique({
        where: { slug },
        select: { id: true },
      });
      break;
    case "article":
      existing = await db.article.findUnique({
        where: { slug },
        select: { id: true },
      });
      break;
    case "category":
      existing = await db.category.findUnique({
        where: { slug },
        select: { id: true },
      });
      break;
    case "tag":
      existing = await db.tag.findUnique({
        where: { slug },
        select: { id: true },
      });
      break;
    case "person":
      existing = await db.person.findUnique({
        where: { slug },
        select: { id: true },
      });
      break;
    default:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid model: ${model}`,
      });
  }

  if (existing && existing.id !== excludeId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `A ${model} with slug "${slug}" already exists`,
    });
  }
};

export const updateAuthorArticleCount = async (
  db: PrismaClientWithoutTransactions,
  authorId: string
): Promise<void> => {
  const count = await db.articleAuthor.count({
    where: { authorId },
  });

  await db.author.update({
    where: { id: authorId },
    data: { articleCount: count },
  });
};

export const updateCategoryArticleCount = async (
  db: PrismaClientWithoutTransactions,
  categoryId: string
): Promise<void> => {
  const count = await db.articleCategory.count({
    where: { categoryId },
  });

  await db.category.update({
    where: { id: categoryId },
    data: { articleCount: count },
  });
};

export const updateTagUsageCount = async (
  db: PrismaClientWithoutTransactions,
  tagId: string
): Promise<void> => {
  const count = await db.articleTag.count({
    where: { tagId },
  });

  await db.tag.update({
    where: { id: tagId },
    data: { usageCount: count },
  });
};

export const validateCircularHierarchy = async (
  db: PrismaClientWithoutTransactions,
  categoryId: string,
  parentId: string
): Promise<void> => {
  if (categoryId === parentId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A category cannot be its own parent",
    });
  }

  let currentId: string | null = parentId;
  const visited = new Set<string>([categoryId]);
  let depth = 0;
  const maxDepth = 3;

  while (currentId) {
    if (visited.has(currentId)) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Circular hierarchy detected",
      });
    }

    visited.add(currentId);
    depth += 1;

    if (depth > maxDepth) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category hierarchy cannot exceed ${maxDepth} levels`,
      });
    }

    const parentCategory: { parentId: string | null } | null =
      await db.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

    currentId = parentCategory?.parentId ?? null;
  }
};
