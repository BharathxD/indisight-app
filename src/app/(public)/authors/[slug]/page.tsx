import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCardStandard } from "@/components/public/articles";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const caller = await trpc();
  const slugs = await caller.cms.author.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: AuthorPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const caller = await trpc();
    const author = await caller.cms.author.getBySlugPublic({ slug });

    return {
      title: `${author.name} - Author`,
      description: author.bio || `Articles by ${author.name}`,
      openGraph: {
        title: author.name,
        description: author.bio || undefined,
        type: "profile",
        siteName: siteConfig.name,
        images: author.profileImageUrl ? [author.profileImageUrl] : undefined,
      },
      alternates: {
        canonical: `${siteConfig.url}/authors/${slug}`,
      },
    };
  } catch {
    return {
      title: "Author Not Found",
    };
  }
};

const AuthorPage = async ({ params }: AuthorPageProps) => {
  const { slug } = await params;
  const caller = await trpc();

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
      caller.cms.article.getByAuthor({ authorSlug: slug, limit: 12 }),
    ]);
  } catch {
    notFound();
  }

  const { articles } = articlesData;
  const socialLinks = author.socialLinks as {
    twitter?: string;
    linkedin?: string;
    website?: string;
  } | null;

  return (
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

        {articles.length > 0 ? (
          <section>
            <h2 className="mb-6 font-bold text-2xl text-foreground">
              Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCardStandard
                  article={article}
                  key={article.id}
                  layout="vertical"
                />
              ))}
            </div>
          </section>
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
  );
};

export default AuthorPage;
