import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesSkeleton } from "@/components/public/articles/articles-skeleton";
import { siteConfig } from "@/lib/config";
import { AllArticlesContent } from "./all-articles-content";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Explore our complete collection of articles on leadership, innovation, and meaningful change.",
  openGraph: {
    title: "All Articles - IndiSight",
    description:
      "Explore our complete collection of articles on leadership, innovation, and meaningful change.",
    type: "website",
    url: `${siteConfig.url}/articles`,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Articles - IndiSight",
    description:
      "Explore our complete collection of articles on leadership, innovation, and meaningful change.",
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/articles`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

const AllArticlesPage = () => (
  <Suspense fallback={<ArticlesSkeleton gridCount={50} heroCount={0} />}>
    <AllArticlesContent />
  </Suspense>
);

export default AllArticlesPage;
