import RSS from "rss";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

export const revalidate = 3600;

export const GET = async () => {
  const caller = await trpc();
  const articles = await caller.cms.article.getLatest({ limit: 50 });

  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/feed.xml`,
    language: "en",
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
    generator: "Next.js",
  });

  for (const article of articles) {
    const primaryAuthor = article.articleAuthors[0]?.author;
    const primaryCategory = article.articleCategories.find(
      (ac) => ac.isPrimary
    );

    feed.item({
      title: article.title,
      description: article.excerpt || "",
      url: `${siteConfig.url}/articles/${article.slug}`,
      guid: article.id,
      categories: article.articleCategories.map((ac) => ac.category.name),
      author: primaryAuthor?.name,
      date: article.publishedAt || article.createdAt,
      enclosure: article.featuredImageUrl
        ? {
            url: article.featuredImageUrl,
            type: "image/jpeg",
          }
        : undefined,
      custom_elements: [
        { "content:encoded": article.content as string },
        ...(primaryCategory
          ? [{ category: primaryCategory.category.name }]
          : []),
      ],
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
