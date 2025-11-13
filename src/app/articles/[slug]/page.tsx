import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article, WithContext } from "schema-dts";
import {
  ArticleCardCompact,
  CategoryBadge,
} from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";
import { jsonToHtml } from "@/lib/editor-utils";
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

  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;
  const relatedArticles = await caller.cms.article.getRelated({
    articleId: article.id,
    limit: 3,
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

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
        <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-12 md:py-12">
          <div className="mx-auto max-w-[720px]">
            {primaryCategory && (
              <div className="mb-4">
                <CategoryBadge name={primaryCategory.category.name} />
              </div>
            )}

            <h1 className="mb-6 font-bold text-4xl text-foreground leading-tight tracking-tight md:text-5xl md:leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mb-8 text-muted-foreground text-xl leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="mb-8 flex items-center gap-4 border-border border-t border-b py-4">
              {primaryAuthor && (
                <Link
                  className="flex items-center gap-3"
                  href={`/authors/${primaryAuthor.slug}`}
                >
                  {primaryAuthor.profileImageUrl ? (
                    <Image
                      alt={primaryAuthor.name}
                      className="size-12 object-cover"
                      height={48}
                      src={primaryAuthor.profileImageUrl}
                      width={48}
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center bg-muted font-semibold text-muted-foreground text-sm">
                      {primaryAuthor.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground hover:text-muted-foreground">
                      {primaryAuthor.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatDate(article.publishedAt)}
                      {article.readTime && ` · ${article.readTime} min read`}
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {article.featuredImageUrl && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden bg-muted">
                <Image
                  alt={article.featuredImageAlt || article.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, 720px"
                  src={article.featuredImageUrl}
                />
              </div>
            )}

            <div className="minimal-tiptap-editor">
              <div
                className="ProseMirror"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: content is trusted
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {article.articleTags.length > 0 && (
              <div className="mt-12 border-border border-t pt-8">
                <h3 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.articleTags.map(({ tag }) => (
                    <Link
                      className="border border-border bg-muted px-3 py-1 text-foreground text-sm transition-colors hover:border-foreground hover:text-foreground"
                      href={`/tags/${tag.slug}`}
                      key={tag.id}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {primaryAuthor?.bio && (
              <div className="mt-12 border border-border bg-muted p-6">
                <div className="flex gap-4">
                  {primaryAuthor.profileImageUrl ? (
                    <Image
                      alt={primaryAuthor.name}
                      className="size-20 shrink-0 object-cover"
                      height={80}
                      src={primaryAuthor.profileImageUrl}
                      width={80}
                    />
                  ) : (
                    <div className="flex size-20 shrink-0 items-center justify-center bg-muted font-semibold text-muted-foreground text-xl">
                      {primaryAuthor.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="mb-2 font-bold text-foreground text-lg">
                      About {primaryAuthor.name}
                    </h3>
                    <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                      {primaryAuthor.bio}
                    </p>
                    <Link
                      className="font-medium text-foreground text-sm hover:text-muted-foreground"
                      href={`/authors/${primaryAuthor.slug}`}
                    >
                      View all articles <ArrowRightIcon className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {relatedArticles.length > 0 && (
            <div className="mx-auto mt-16 max-w-[720px]">
              <h2 className="mb-6 font-bold text-2xl text-foreground">
                Related Articles
              </h2>
              <div className="space-y-4 border-border border-t pt-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCardCompact
                    article={relatedArticle}
                    key={relatedArticle.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PublicLayout>
  );
};

export default ArticlePage;
