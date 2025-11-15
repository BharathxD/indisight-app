import Link from "next/link";
import {
  ArticleCardFeatured,
  ArticleCardStandard,
} from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { ScatteredPortraits } from "@/components/public/scattered-portraits";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

export const revalidate = 30;

const HomePage = async () => {
  const caller = await trpc();
  const [featuredArticles, latestArticles] = await Promise.all([
    caller.cms.article.getFeatured({ limit: 6 }),
    caller.cms.article.getLatest({ limit: 6 }),
  ]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden border-border border-b bg-background">
          <ScatteredPortraits />
          <div className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-32 lg:py-40">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-muted-foreground text-sm shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-muted-foreground/50 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-muted-foreground" />
                </span>
                Editorial Platform for Leaders & Innovators
              </div>

              <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight md:text-7xl md:leading-tight">
                Capturing the minds shaping{" "}
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  meaningful change
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
                {siteConfig.description}
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center border border-foreground bg-foreground px-8 py-3 font-medium text-background text-sm transition-all hover:bg-muted-foreground"
                  href="/articles"
                >
                  Explore Articles
                  <svg
                    aria-hidden="true"
                    className="ml-2 size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  className="inline-flex items-center justify-center border border-border bg-muted px-8 py-3 font-medium text-foreground text-sm transition-all hover:border-foreground hover:bg-background"
                  href="/about"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-border border-b bg-background py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="grid gap-8 md:grid-cols-3">
              {siteConfig.categories.slice(1, 4).map((category) => (
                <Link
                  className="group hover:-translate-y-1 border border-border bg-muted p-6 transition-all hover:shadow-lg"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                >
                  <h3 className="mb-2 font-semibold text-foreground text-lg tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                    Explore
                    <svg
                      aria-hidden="true"
                      className="ml-1 size-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
          {featuredArticles.length > 0 && (
            <section className="mb-20">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="mb-2 font-bold text-3xl text-foreground tracking-tight">
                    Featured Stories
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Handpicked insights from industry leaders
                  </p>
                </div>
                <Link
                  className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href="/articles"
                >
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredArticles.map((article) => (
                  <ArticleCardFeatured article={article} key={article.id} />
                ))}
              </div>
            </section>
          )}

          {latestArticles.length > 0 && (
            <section>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="mb-2 font-bold text-3xl text-foreground tracking-tight">
                    Latest Articles
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Fresh perspectives on leadership and innovation
                  </p>
                </div>
                <Link
                  className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href="/articles"
                >
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {latestArticles.map((article) => (
                  <ArticleCardStandard
                    article={article}
                    key={article.id}
                    layout="vertical"
                  />
                ))}
              </div>
            </section>
          )}

          {featuredArticles.length === 0 && latestArticles.length === 0 && (
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
        </main>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
