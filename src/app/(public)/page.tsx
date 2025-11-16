import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AnimatedHero } from "@/components/public/animated-hero";
import { CategoryBentoGrid } from "@/components/public/category-bento-grid";
import { FeaturedEditorialGrid } from "@/components/public/featured-editorial-grid";
import { LatestArticlesMixed } from "@/components/public/latest-articles-mixed";
import { NewsletterEnhanced } from "@/components/public/newsletter-enhanced";
import { ScatteredPortraits } from "@/components/public/scattered-portraits";
import { StatsSection } from "@/components/public/stats-section";
import { TeamPreview } from "@/components/public/team-preview";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

export const revalidate = 30;

const HomePage = async () => {
  const caller = trpc();
  const [featuredArticles, latestArticles, categories, analytics] =
    await Promise.all([
      caller.cms.article.getFeatured({ limit: 6 }),
      caller.cms.article.getLatest({ limit: 6 }),
      caller.cms.category.getAll(),
      caller.analytics.getOverview(),
    ]);

  const categoriesWithImages = categories.filter(
    (cat: (typeof categories)[number]) => cat.imageUrl && cat.articleCount > 0
  );

  const stats = [
    {
      label: "Articles Published",
      value: analytics.statusCounts.PUBLISHED,
    },
    {
      label: "Active Categories",
      value: analytics.totalCategories,
    },
    {
      label: "Global Cities",
      value: siteConfig.locations.length,
    },
    {
      label: "Newsletter Readers",
      value: 2000,
      suffix: "+",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[calc(100vh-65px)] overflow-hidden border-border border-b bg-background">
        <ScatteredPortraits />
        <div className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50" />

        <div className="relative z-10 m-auto flex min-h-[calc(100vh-65px)] max-w-[1400px] items-center px-6 md:px-12">
          <AnimatedHero />
        </div>
      </section>

      {categoriesWithImages.length > 0 && (
        <section className="border-border border-b bg-background py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <CategoryBentoGrid categories={categoriesWithImages} />
          </div>
        </section>
      )}

      <StatsSection stats={stats} />

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
                View all <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <FeaturedEditorialGrid articles={featuredArticles} />
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
            <LatestArticlesMixed articles={latestArticles} />
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

      <TeamPreview team={siteConfig.team} />

      <NewsletterEnhanced signupUrl={siteConfig.newsletter.signupUrl} />
    </div>
  );
};

export default HomePage;
