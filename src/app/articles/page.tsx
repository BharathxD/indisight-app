import type { Metadata } from "next";
import {
  ArticleCardHero,
  ArticleCardStandard,
} from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

export const revalidate = 60;

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

const AllArticlesPage = async () => {
  const caller = trpc();
  const articles = await caller.cms.article.getLatest({ limit: 50 });

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-12 border-gray-200 border-b pb-8">
            <h1 className="mb-4 font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
              All Articles
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Explore our complete collection of articles on leadership,
              innovation, and meaningful change.
            </p>
            <p className="mt-4 text-gray-500 text-sm">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {featuredArticle && (
            <section className="mb-12">
              <ArticleCardHero article={featuredArticle} />
            </section>
          )}

          {restArticles.length > 0 && (
            <section>
              <div className="grid gap-6 md:grid-cols-2">
                {restArticles.map((article) => (
                  <ArticleCardStandard
                    article={article}
                    key={article.id}
                    layout="vertical"
                  />
                ))}
              </div>
            </section>
          )}

          {articles.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <h2 className="mb-2 font-bold text-2xl text-gray-900">
                  No articles yet
                </h2>
                <p className="text-gray-600">
                  Check back soon for new content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default AllArticlesPage;
