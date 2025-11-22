import { unstable_cache } from "next/cache";
import { db } from "@/db";

export const getCachedCategories = unstable_cache(
  async () =>
    db.category.findMany({
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
    }),
  ["categories-all"],
  {
    revalidate: 3600, // 1 hour
    tags: ["categories"],
  }
);
