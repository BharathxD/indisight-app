import type { Metadata } from "next";
import { AnimatedHero } from "@/components/public/animated-hero";
import { CategoryBentoGrid } from "@/components/public/category-bento-grid";
import { HomeSpotlightGrid } from "@/components/public/home-spotlight-grid";
import { NewsletterEnhanced } from "@/components/public/newsletter-enhanced";
import { ScatteredPortraits } from "@/components/public/scattered-portraits";
import { SpotlightSection } from "@/components/public/spotlight-section";
import { StatsSection } from "@/components/public/stats-section";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

export const revalidate = 30;

const spotlightGridConfig = {
  col1Row1: {
    categorySlug: "cxo-series",
    title: "CXO Series",
  },
  col1Row2: {
    categorySlug: "editorial-archive",
    title: "Editorial Archive",
  },
  col1Row3ColSpan2: {
    categorySlug: "quiet-architects",
    title: "Quiet Architects",
  },
} as const;

const categorySectionsConfig = {
  cxo: {
    categorySlug: "cxo-series",
    title: "CXO Series",
    description: "Insights from India's top executives and leaders",
  },
  quietArchitects: {
    categorySlug: "quiet-architects",
    title: "Quiet Architects",
    description: "Stories of founders building tomorrow's innovations",
  },
} as const;

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const HomePage = async () => {
  const caller = trpc();

  const [
    col1Row1Category,
    col1Row2Category,
    col1Row3ColSpan2Category,
    featuredArticles,
    latestArticles,
    categories,
    analytics,
  ] = await Promise.all([
    caller.cms.category
      .getBySlugPublic({ slug: spotlightGridConfig.col1Row1.categorySlug })
      .catch(() => null),
    caller.cms.category
      .getBySlugPublic({ slug: spotlightGridConfig.col1Row2.categorySlug })
      .catch(() => null),
    caller.cms.category
      .getBySlugPublic({
        slug: spotlightGridConfig.col1Row3ColSpan2.categorySlug,
      })
      .catch(() => null),
    caller.cms.article.getFeatured({ limit: 6 }),
    caller.cms.article.getLatest({ limit: 12 }),
    caller.cms.category.getAll(),
    caller.analytics.getOverview(),
  ]);

  const [
    col1Row1Articles,
    col1Row2Articles,
    col1Row3ColSpan2Articles,
    cxoSectionArticles,
    quietArchitectsSectionArticles,
  ] = await Promise.all([
    col1Row1Category
      ? caller.cms.article.getLatest({
          limit: 1,
          categoryId: col1Row1Category.id,
        })
      : Promise.resolve([]),
    col1Row2Category
      ? caller.cms.article.getLatest({
          limit: 1,
          categoryId: col1Row2Category.id,
        })
      : Promise.resolve([]),
    col1Row3ColSpan2Category
      ? caller.cms.article.getLatest({
          limit: 2,
          categoryId: col1Row3ColSpan2Category.id,
        })
      : Promise.resolve([]),
    col1Row1Category
      ? caller.cms.article.getLatest({
          limit: 6,
          categoryId: col1Row1Category.id,
        })
      : Promise.resolve([]),
    col1Row3ColSpan2Category
      ? caller.cms.article.getLatest({
          limit: 6,
          categoryId: col1Row3ColSpan2Category.id,
        })
      : Promise.resolve([]),
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
        {(featuredArticles.length > 0 ||
          col1Row1Articles.length > 0 ||
          col1Row2Articles.length > 0) && (
          <section className="my-auto mb-20 min-h-screen">
            <HomeSpotlightGrid
              col1Row1Article={col1Row1Articles[0] || null}
              col1Row1CategorySlug={col1Row1Category?.slug}
              col1Row1Title={spotlightGridConfig.col1Row1.title}
              col1Row2Article={col1Row2Articles[0] || null}
              col1Row2CategorySlug={col1Row2Category?.slug}
              col1Row2Title={spotlightGridConfig.col1Row2.title}
              col1Row3ColSpan2Articles={col1Row3ColSpan2Articles}
              col1Row3ColSpan2CategorySlug={col1Row3ColSpan2Category?.slug}
              col1Row3ColSpan2Title={spotlightGridConfig.col1Row3ColSpan2.title}
              col2Row12Article={featuredArticles[0] || null}
              col3Row14Articles={latestArticles.slice(0, 7)}
            />
          </section>
        )}
        {cxoSectionArticles.length > 0 && col1Row1Category && (
          <section className="mb-20 md:mb-80">
            <SpotlightSection
              articles={cxoSectionArticles}
              title={categorySectionsConfig.cxo.title}
            />
          </section>
        )}

        {quietArchitectsSectionArticles.length > 0 &&
          col1Row3ColSpan2Category && (
            <section className="mb-20 md:mb-80">
              <SpotlightSection
                articles={quietArchitectsSectionArticles}
                horizontalTitle
                title={categorySectionsConfig.quietArchitects.title}
              />
            </section>
          )}
      </main>

      <NewsletterEnhanced signupUrl={siteConfig.newsletter.signupUrl} />
    </div>
  );
};

export default HomePage;
