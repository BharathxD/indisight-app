import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const caller = trpc();
  const [articleData, categoryData, authorData, tagData] = await Promise.all([
    caller.cms.article.getAllPublishedForSitemap(),
    caller.cms.category.getAllForSitemap(),
    caller.cms.author.getAllForSitemap(),
    caller.cms.tag.getAllForSitemap(),
  ]);

  const articles: MetadataRoute.Sitemap = articleData.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
    images: article.thumbnailUrl ? [article.thumbnailUrl] : undefined,
  }));

  const categories: MetadataRoute.Sitemap = categoryData.map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const authors: MetadataRoute.Sitemap = authorData.map((author) => ({
    url: `${siteConfig.url}/authors/${author.slug}`,
    lastModified: author.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = tagData.map((tag) => ({
    url: `${siteConfig.url}/tags/${tag.slug}`,
    lastModified: tag.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/why`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/nominate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/attribution`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/press`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticPages,
    ...articles,
    ...categories,
    ...authors,
    ...tags,
  ];
};

export default sitemap;
