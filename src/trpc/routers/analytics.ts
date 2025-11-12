import { z } from "zod";
import { db } from "@/db";
import { publicProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";

export const analyticsRouter = router({
  getOverview: publicProcedure.query(async () => {
    const [
      totalArticles,
      totalAuthors,
      totalCategories,
      totalTags,
      statusBreakdown,
    ] = await Promise.all([
      db.article.count(),
      db.author.count(),
      db.category.count(),
      db.tag.count(),
      db.article.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),
    ]);

    const statusCounts = {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    };

    for (const item of statusBreakdown) {
      if (
        item.status === "DRAFT" ||
        item.status === "PUBLISHED" ||
        item.status === "ARCHIVED"
      ) {
        statusCounts[item.status] = item._count.id;
      }
    }

    return {
      totalArticles,
      totalAuthors,
      totalCategories,
      totalTags,
      statusCounts,
    };
  }),

  getPublishedTimeSeries: publicProcedure
    .input(
      z.object({
        days: z.enum(["7", "30"]).default("7"),
      })
    )
    .query(async ({ input }) => {
      const days = +input.days;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const articles = await db.article.findMany({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            gte: startDate,
          },
        },
        select: {
          publishedAt: true,
        },
        orderBy: {
          publishedAt: "asc",
        },
      });

      const dateMap = new Map<string, number>();
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateKey = date.toISOString().split("T")[0];
        dateMap.set(dateKey, 0);
      }

      for (const article of articles) {
        if (article.publishedAt) {
          const dateKey = article.publishedAt.toISOString().split("T")[0];
          const current = dateMap.get(dateKey) || 0;
          dateMap.set(dateKey, current + 1);
        }
      }

      const data = Array.from(dateMap.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      return data;
    }),
});
