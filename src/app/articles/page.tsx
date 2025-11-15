import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-12 border-border border-b pb-8">
            <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              All Articles
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our complete collection of articles on leadership,
              innovation, and meaningful change.
            </p>
            <p className="mt-4 text-muted-foreground text-sm">
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
                <h2 className="mb-2 font-bold text-2xl text-foreground">
                  No articles yet
                </h2>
                <p className="text-muted-foreground">
                  Check back soon for new content.
                </p>
              </div>
            </div>
          )}

          <section className="mt-16 border-border border-t pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="border border-border bg-muted p-8 md:p-12">
                <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
                  Never Miss an Update
                </h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Get new articles, insights, and research delivered weekly to
                  your inbox.
                </p>
                <Link
                  className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-8 py-4 font-medium text-background transition-colors hover:bg-foreground/90"
                  href="https://tally.so/r/w2YgzD"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Subscribe to Newsletter
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AllArticlesPage;
