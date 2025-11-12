import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const caller = trpc();
  const [articleSlugs, categorySlugs, authorSlugs, tagSlugs] =
    await Promise.all([
      caller.cms.article.getAllPublishedSlugs(),
      caller.cms.category.getAllSlugs(),
      caller.cms.author.getAllSlugs(),
      caller.cms.tag.getAllSlugs(),
    ]);

  const articles: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${siteConfig.url}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${siteConfig.url}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const authors: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${siteConfig.url}/authors/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: `${siteConfig.url}/tags/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articles,
    ...categories,
    ...authors,
    ...tags,
  ];
};

export default sitemap;
