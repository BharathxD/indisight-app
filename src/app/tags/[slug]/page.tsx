import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCardStandard } from "@/components/public/articles";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";
import { trpc } from "@/trpc/server-client";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const caller = await trpc();
  const slugs = await caller.cms.tag.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: TagPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const caller = await trpc();
    const tag = await caller.cms.tag.getBySlugPublic({ slug });

    return {
      title: `${tag.name} - Tag`,
      description: tag.description || `Articles tagged with ${tag.name}`,
      openGraph: {
        title: tag.name,
        description: tag.description || undefined,
        type: "website",
        siteName: siteConfig.name,
      },
      alternates: {
        canonical: `${siteConfig.url}/tags/${slug}`,
      },
    };
  } catch {
    return {
      title: "Tag Not Found",
    };
  }
};

const TagPage = async ({ params }: TagPageProps) => {
  const { slug } = await params;
  const caller = await trpc();

  let tag: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof trpc>>["cms"]["tag"]["getBySlugPublic"]
    >
  >;
  let articlesData: Awaited<
    ReturnType<Awaited<ReturnType<typeof trpc>>["cms"]["article"]["getByTag"]>
  >;

  try {
    [tag, articlesData] = await Promise.all([
      caller.cms.tag.getBySlugPublic({ slug }),
      caller.cms.article.getByTag({ tagSlug: slug, limit: 12 }),
    ]);
  } catch {
    notFound();
  }

  const { articles } = articlesData;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-12 border-border border-b pb-8">
            <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              #{tag.name}
            </h1>
            {tag.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {tag.description}
              </p>
            )}
            <p className="mt-4 text-muted-foreground text-sm">
              {tag.usageCount} {tag.usageCount === 1 ? "article" : "articles"}
            </p>
          </div>

          {articles.length > 0 ? (
            <section>
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
                  Check back soon for articles with this tag.
                </p>
              </div>
            </div>
          )}

          <section className="mt-16 border-border border-t pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="border border-border bg-muted p-8 md:p-12">
                <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
                  Stay in the Loop
                </h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Get weekly articles and insights on topics you care about
                  delivered to your inbox.
                </p>
                <Link
                  className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-8 py-4 font-medium text-background transition-colors hover:bg-foreground/90"
                  href="https://tally.so/r/w2YgzD"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Subscribe to Newsletter
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TagPage;
