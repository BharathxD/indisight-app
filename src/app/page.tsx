import {
  ArticleCardFeatured,
  ArticleCardHero,
  ArticleCardStandard,
} from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { trpc } from "@/trpc/server-client";

export const revalidate = 30;

const HomePage = async () => {
  const caller = await trpc();
  const [featuredArticles, latestArticles] = await Promise.all([
    caller.cms.article.getFeatured({ limit: 7 }),
    caller.cms.article.getLatest({ limit: 12 }),
  ]);

  const heroArticle = featuredArticles[0];
  const featuredGrid = featuredArticles.slice(1, 7);
  const latestList = latestArticles;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-[1280px] px-6 py-8 md:px-12 md:py-12">
          {heroArticle && (
            <section className="mb-12 md:mb-16">
              <ArticleCardHero article={heroArticle} />
            </section>
          )}

          {featuredGrid.length > 0 && (
            <section className="mb-12 md:mb-16">
              <div className="mb-6 flex items-center justify-between border-gray-200 border-b pb-4">
                <h2 className="font-bold text-2xl text-gray-900 tracking-tight">
                  Featured Stories
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredGrid.map((article) => (
                  <ArticleCardFeatured article={article} key={article.id} />
                ))}
              </div>
            </section>
          )}

          {latestList.length > 0 && (
            <section>
              <div className="mb-6 flex items-center justify-between border-gray-200 border-b pb-4">
                <h2 className="font-bold text-2xl text-gray-900 tracking-tight">
                  Latest Articles
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {latestList.map((article) => (
                  <ArticleCardStandard
                    article={article}
                    key={article.id}
                    layout="vertical"
                  />
                ))}
              </div>
            </section>
          )}

          {!heroArticle &&
            featuredGrid.length === 0 &&
            latestList.length === 0 && (
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
        </main>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
