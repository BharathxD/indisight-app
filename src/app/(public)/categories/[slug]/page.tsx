import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CollectionPage, WithContext } from "schema-dts";
import {
  ArticleCardHero,
  ArticleCardStandard,
} from "@/components/public/articles";
import { Pagination } from "@/components/public/pagination";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const caller = trpc();
  const slugs = await caller.cms.category.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number.parseInt(pageParam || "1", 10);

  try {
    const caller = trpc();
    const category = await caller.cms.category.getBySlugPublic({ slug });

    const ogImageUrl = `${siteConfig.url}/api/og?type=category&title=${encodeURIComponent(category.name)}${category.description ? `&subtitle=${encodeURIComponent(category.description)}` : ""}${category.imageUrl ? `&image=${encodeURIComponent(category.imageUrl)}` : ""}&metadata=${category.articleCount}`;

    const baseUrl = `${siteConfig.url}/categories/${slug}`;
    const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

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
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: category.name,
          },
        ],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch {
    return {
      title: "Category Not Found",
    };
  }
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number.parseInt(pageParam || "1", 10);
  const articlesPerPage = 12;

  const caller = trpc();

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
      caller.cms.article.getByCategory({
        categorySlug: slug,
        limit: articlesPerPage + 1,
      }),
    ]);
  } catch {
    notFound();
  }

  const { articles } = articlesData;
  const hasNextPage = articles.length > articlesPerPage;
  const displayArticles = hasNextPage ? articles.slice(0, -1) : articles;
  const totalPages = Math.ceil(category.articleCount / articlesPerPage);
  const featuredArticle = currentPage === 1 ? displayArticles[0] : null;
  const restArticles =
    currentPage === 1 ? displayArticles.slice(1) : displayArticles;

  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || undefined,
    url: `${siteConfig.url}/categories/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: displayArticles.map((article, index) => ({
        "@type": "ListItem",
        position: (currentPage - 1) * articlesPerPage + index + 1,
        url: `${siteConfig.url}/articles/${article.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        type="application/ld+json"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          {
            name: category.name,
            url: `${siteConfig.url}/categories/${slug}`,
          },
        ]}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-12">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                baseUrl={`${siteConfig.url}/categories/${slug}`}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}

          {displayArticles.length === 0 && (
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
    </>
  );
};

export default CategoryPage;
