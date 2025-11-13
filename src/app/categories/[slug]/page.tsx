import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleCardHero,
  ArticleCardStandard,
} from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const caller = await trpc();
  const slugs = await caller.cms.category.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const caller = await trpc();
    const category = await caller.cms.category.getBySlugPublic({ slug });

    return {
      title: category.seoMetaTitle || `${category.name} Articles`,
      description:
        category.seoMetaDescription ||
        category.description ||
        `Browse articles in ${category.name}`,
      openGraph: {
        title: category.name,
        description: category.description || undefined,
        type: "website",
        siteName: siteConfig.name,
        images: category.imageUrl ? [category.imageUrl] : undefined,
      },
      alternates: {
        canonical: `${siteConfig.url}/categories/${slug}`,
      },
    };
  } catch {
    return {
      title: "Category Not Found",
    };
  }
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const caller = await trpc();

  let category: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["category"]["getBySlugPublic"]
    >
  >;
  let articlesData: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["article"]["getByCategory"]
    >
  >;

  try {
    [category, articlesData] = await Promise.all([
      caller.cms.category.getBySlugPublic({ slug }),
      caller.cms.article.getByCategory({ categorySlug: slug, limit: 13 }),
    ]);
  } catch {
    notFound();
  }

  const { articles } = articlesData;
  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-12 border-border border-b pb-8">
            <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            )}
            <p className="mt-4 text-muted-foreground text-sm">
              {category.articleCount}{" "}
              {category.articleCount === 1 ? "article" : "articles"}
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
                  Check back soon for new content in this category.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CategoryPage;
