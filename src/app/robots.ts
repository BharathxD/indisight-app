import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
  ],
  sitemap: `${siteConfig.url}/sitemap.xml`,
  host: siteConfig.url,
});

export default robots;
