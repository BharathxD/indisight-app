import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CollectionPage, WithContext } from "schema-dts";
import { ArticleCardStandard } from "@/components/public/articles";
import { Pagination } from "@/components/public/pagination";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const caller = trpc();
  const slugs = await caller.cms.author.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
  searchParams,
}: AuthorPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number.parseInt(pageParam || "1", 10);

  try {
    const caller = trpc();
    const author = await caller.cms.author.getBySlugPublic({ slug });

    const ogImageUrl = `${siteConfig.url}/api/og?type=author&title=${encodeURIComponent(author.name)}${author.bio ? `&subtitle=${encodeURIComponent(author.bio)}` : ""}${author.profileImageUrl ? `&image=${encodeURIComponent(author.profileImageUrl)}` : ""}&metadata=${author.articleCount}`;

    const baseUrl = `${siteConfig.url}/authors/${slug}`;
    const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

    return {
      title: `${author.name} - Author`,
      description: author.bio || `Articles by ${author.name}`,
      openGraph: {
        title: author.name,
        description: author.bio || undefined,
        type: "profile",
        siteName: siteConfig.name,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: author.name,
          },
        ],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch {
    return {
      title: "Author Not Found",
    };
  }
};

const AuthorPage = async ({ params, searchParams }: AuthorPageProps) => {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number.parseInt(pageParam || "1", 10);
  const articlesPerPage = 12;

  const caller = trpc();

  let author: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["author"]["getBySlugPublic"]
    >
  >;
  let articlesData: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["article"]["getByAuthor"]
    >
  >;

  try {
    [author, articlesData] = await Promise.all([
      caller.cms.author.getBySlugPublic({ slug }),
      caller.cms.article.getByAuthor({
        authorSlug: slug,
        limit: articlesPerPage + 1,
      }),
    ]);
  } catch {
    notFound();
  }

  const { articles } = articlesData;
  const hasNextPage = articles.length > articlesPerPage;
  const displayArticles = hasNextPage ? articles.slice(0, -1) : articles;
  const totalPages = Math.ceil(author.articleCount / articlesPerPage);
  const socialLinks = author.socialLinks as {
    twitter?: string;
    linkedin?: string;
    website?: string;
  } | null;

  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Articles by ${author.name}`,
    description: author.bio || undefined,
    url: `${siteConfig.url}/authors/${slug}`,
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
          { name: "Authors", url: `${siteConfig.url}/authors` },
          { name: author.name, url: `${siteConfig.url}/authors/${slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-12 border-border border-b pb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              {author.profileImageUrl ? (
                <Image
                  alt={author.name}
                  className="size-[120px] shrink-0 object-cover object-top"
                  height={120}
                  src={author.profileImageUrl}
                  width={120}
                />
              ) : (
                <div className="flex size-[120px] shrink-0 items-center justify-center bg-muted font-semibold text-3xl text-muted-foreground">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight">
                  {author.name}
                </h1>
                {author.bio && (
                  <p className="mb-4 text-lg text-muted-foreground leading-relaxed">
                    {author.bio}
                  </p>
                )}
                <p className="mb-4 text-muted-foreground text-sm">
                  {author.articleCount}{" "}
                  {author.articleCount === 1 ? "article" : "articles"}
                </p>
                {socialLinks && (
                  <div className="flex gap-4">
                    {socialLinks.twitter && (
                      <Link
                        className="font-medium text-muted-foreground text-sm hover:text-foreground"
                        href={socialLinks.twitter}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Twitter
                      </Link>
                    )}
                    {socialLinks.linkedin && (
                      <Link
                        className="font-medium text-muted-foreground text-sm hover:text-foreground"
                        href={socialLinks.linkedin}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        LinkedIn
                      </Link>
                    )}
                    {socialLinks.website && (
                      <Link
                        className="font-medium text-muted-foreground text-sm hover:text-foreground"
                        href={socialLinks.website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Website
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {displayArticles.length > 0 ? (
            <>
              <section>
                <h2 className="mb-6 font-bold text-2xl text-foreground">
                  Articles
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {displayArticles.map((article) => (
                    <ArticleCardStandard
                      article={article}
                      key={article.id}
                      layout="vertical"
                    />
                  ))}
                </div>
              </section>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    baseUrl={`${siteConfig.url}/authors/${slug}`}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <h2 className="mb-2 font-bold text-2xl text-foreground">
                  No articles yet
                </h2>
                <p className="text-muted-foreground">
                  Check back soon for articles by this author.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthorPage;
