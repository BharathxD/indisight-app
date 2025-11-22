import { env } from "@/env";

export const siteConfig = {
  name: "IndiSight",
  title: "IndiSight - Insights for Leaders & Innovators",
  description:
    "IndiSight captures the minds shaping meaningful change. We document people, institutions, and ideas through the lens of intent, resilience, and quiet conviction. Not for headlines, but for those who care how things are truly built.",
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
  newsletter: {
    frequency: "Weekly",
    signupUrl: "https://tally.so/r/w2YgzD",
  },
  team: [
    {
      name: "Anshul Dubey",
      role: "Founder & CEO",
      linkedin: "https://www.linkedin.com/in/anshul-dubey/",
      image: "/team/anshul-dubey.png",
      bio: "Anshul founded IndiSight with a bold vision: to build a media platform that captures the intelligence, intent, and invisible decisions behind the world's most impactful people, institutions, and ideas. With a strong foundation in strategic consulting and ecosystem thinking, he brings a deep understanding of how decisions shape outcomes, how systems evolve, and how enduring impact is built.",
    },
    {
      name: "Poulami Mukherjee",
      role: "Co-founder & Chief Editor",
      linkedin: "https://www.linkedin.com/in/poulami-mukherjee-8496bb28a/",
      image: "/team/poulami-mukherjee.jpg",
      bio: "Poulami brings a quiet intensity to IndiSight's editorial spirit. For over a decade, she has worked at the intersection of communication, institutional narratives, and human insight — not to simply report stories, but to uncover the forces, doubts, and convictions behind them. She believes the most powerful shifts don't begin in headlines, but in private decisions, unspoken dilemmas, and the way people carry their questions over time.",
    },
  ],
  locations: [
    { city: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867 },
    { city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
    { city: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
    { city: "Delhi", country: "India", lat: 28.7041, lng: 77.1025 },
    { city: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
    { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
    { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
