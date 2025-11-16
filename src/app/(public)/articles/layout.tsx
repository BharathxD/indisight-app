import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Browse all articles from IndiSight - insights on leadership, innovation, and business.",
  openGraph: {
    title: "All Articles",
    description:
      "Browse all articles from IndiSight - insights on leadership, innovation, and business.",
    type: "website",
    siteName: siteConfig.name,
  },
  alternates: {
    canonical: `${siteConfig.url}/articles`,
  },
};

const ArticlesLayout = ({ children }: { children: React.ReactNode }) =>
  children;

export default ArticlesLayout;
