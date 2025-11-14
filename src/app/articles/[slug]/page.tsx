import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Article, WithContext } from "schema-dts";
import { ArticleAuthorBio } from "@/components/public/articles/detail/article-author-bio";
import { ArticleContent } from "@/components/public/articles/detail/article-content";
import { ArticleHeader } from "@/components/public/articles/detail/article-header";
import { ArticleMeta } from "@/components/public/articles/detail/article-meta";
import { ArticleSidebar } from "@/components/public/articles/detail/article-sidebar";
import { ArticleTags } from "@/components/public/articles/detail/article-tags";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";
import { extractHeadings, jsonToHtml } from "@/lib/editor-utils";
import { trpc } from "@/trpc/server-client";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export const generateStaticParams = async () => {
  const caller = trpc();
  const slugs = await caller.cms.article.getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: ArticlePageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const caller = trpc();
    const article = await caller.cms.article.getBySlugPublic({ slug });
    const _primaryCategory = article.articleCategories.find(
      (ac) => ac.isPrimary
    );
    const authors = article.articleAuthors.map((aa) => aa.author.name);

    return {
      title: article.seoMetaTitle || article.title,
      description: article.seoMetaDescription || article.excerpt || undefined,
      keywords: article.seoKeywords || undefined,
      authors: authors.map((name) => ({ name })),
      openGraph: {
        title: article.title,
        description: article.excerpt || undefined,
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
        authors,
        images: article.featuredImageUrl
          ? [
              {
                url: article.featuredImageUrl,
                alt: article.featuredImageAlt || article.title,
              },
            ]
          : undefined,
        siteName: siteConfig.name,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt || undefined,
        images: article.featuredImageUrl
          ? [article.featuredImageUrl]
          : undefined,
      },
      alternates: {
        canonical: `${siteConfig.url}/articles/${slug}`,
      },
    };
  } catch {
    return {
      title: "Article Not Found",
    };
  }
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params;
  const caller = trpc();

  let article: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["article"]["getBySlugPublic"]
    >
  >;
  try {
    article = await caller.cms.article.getBySlugPublic({ slug });
  } catch {
    notFound();
  }

  const htmlContent = await jsonToHtml(article.content);
  const headings = extractHeadings(htmlContent);

  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;
  const relatedArticles = await caller.cms.article.getRelated({
    articleId: article.id,
    limit: 3,
  });
  const popularCategories = await caller.cms.category.getTopByArticleCount({
    limit: 8,
  });

  const articleUrl = `${siteConfig.url}/articles/${slug}`;

  // Structured data for SEO (typed with schema-dts)
  const structuredData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.featuredImageUrl || undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: article.articleAuthors.map((aa) => ({
      "@type": "Person",
      name: aa.author.name,
      url: `${siteConfig.url}/authors/${aa.author.slug}`,
    })),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${slug}`,
    },
  };

  return (
    <PublicLayout>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: content is trusted
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <article className="bg-background">
        <ArticleHeader
          excerpt={article.excerpt}
          featuredImageAlt={article.featuredImageAlt}
          featuredImageUrl={article.featuredImageUrl}
          primaryCategory={primaryCategory || null}
          title={article.title}
        />

        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-16 lg:py-20">
          <div className="article-grid grid grid-cols-1 gap-10 md:gap-12 xl:gap-16">
            <div className="min-w-0">
              {primaryAuthor && (
                <ArticleMeta
                  author={primaryAuthor}
                  publishedAt={article.publishedAt}
                  readTime={article.readTime}
                />
              )}

              <ArticleContent htmlContent={htmlContent} />

              <ArticleTags tags={article.articleTags} />

              {primaryAuthor && <ArticleAuthorBio author={primaryAuthor} />}
            </div>

            <ArticleSidebar
              headings={headings}
              popularCategories={popularCategories}
              relatedArticles={relatedArticles}
              shareTitle={article.title}
              shareUrl={articleUrl}
            />
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};

export default ArticlePage;
