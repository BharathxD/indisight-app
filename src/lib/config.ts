import { env } from "@/env";

export const siteConfig = {
  name: "IndiSight",
  title: "IndiSight - Insights for Leaders & Innovators",
  description:
    "IndiSight captures the minds shaping meaningful change. We document people, institutions, and ideas through the lens of intent, resilience, and quiet conviction. Not for headlines — but for those who care how things are truly built.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/opengraph-image.jpg`,
  links: {
    twitter: "https://x.com/indisightmedia",
    linkedin: "https://www.linkedin.com/company/indisight-media",
  },
  creator: {
    name: "IndiSight",
    url: env.NEXT_PUBLIC_APP_URL,
  },
  keywords: [
    "CXO Series",
    "Quiet Architects",
    "Business Leadership",
    "Editorial Content",
    "Innovation",
    "Thought Leadership",
    "Executive Insights",
  ],
  authors: [
    {
      name: "IndiSight Editorial Team",
      url: `https://${env.NEXT_PUBLIC_APP_URL}`,
    },
  ],
  categories: [
    {
      name: "All Articles",
      slug: "all-articles",
      description: "Browse all published articles",
    },
    {
      name: "CXO Series",
      slug: "cxo-series",
      description: "Insights from top executives and business leaders",
    },
    {
      name: "Quiet Architects",
      slug: "quiet-architects",
      description: "Stories of unsung heroes building the future",
    },
    {
      name: "Editorial Archive",
      slug: "editorial-archive",
      description: "Curated editorial content and analysis",
    },
    {
      name: "Events",
      slug: "events",
      description: "Coverage of industry events and gatherings",
    },
  ],
  features: {
    newsletter: true,
    search: true,
    comments: false,
    likes: false,
    bookmarks: false,
    darkMode: true,
  },
  seo: {
    defaultTitle: "IndiSight - Insights for Leaders & Innovators",
    titleTemplate: "%s | IndiSight",
    defaultDescription:
      "Editorial content platform featuring CXO Series, Quiet Architects, and thought leadership articles for business leaders and innovators.",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "IndiSight",
    },
    twitter: {
      handle: "@indisight",
      site: "@indisight",
      cardType: "summary_large_image",
    },
  },
  analytics: {
    googleAnalyticsId: env.NEXT_PUBLIC_GA_ID,
  },
  contact: {
    email: "hello@indisight.com",
    supportEmail: "support@indisight.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
