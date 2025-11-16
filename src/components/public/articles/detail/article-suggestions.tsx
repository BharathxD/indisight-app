import { BookOpen, ChevronsRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "../category-badge";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  thumbnailUrl: string | null;
  articleCategories: Array<{
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

type ArticleSuggestionsProps = {
  articles: Article[];
};

export const ArticleSuggestions = ({ articles }: ArticleSuggestionsProps) => (
  <section className="bg-muted/30 py-16 md:py-20 lg:py-24">
    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
      <div className="mb-12 text-center">
        <h2 className="mb-3 font-semibold text-2xl text-foreground tracking-tight md:text-3xl">
          Our Suggestions to Read
        </h2>
        <p className="text-base text-muted-foreground md:text-lg">
          Discover The Leaders Shaping India&apos;s Business Landscape.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-muted p-3">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground text-sm">
                No suggestions available
              </p>
              <p className="text-muted-foreground text-xs">
                Check back soon for more articles
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const imageUrl = article.featuredImageUrl || article.thumbnailUrl;
            const categories = article.articleCategories
              .filter((ac) => ac.isPrimary)
              .slice(0, 2);

            return (
              <article
                className="group flex flex-col overflow-hidden border border-border bg-background transition-colors hover:border-foreground"
                key={article.id}
              >
                <Link
                  className="flex h-full flex-col"
                  href={`/articles/${article.slug}`}
                >
                  {imageUrl && (
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        alt={article.title}
                        className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        src={imageUrl}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {categories.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {categories.map((ac) => (
                          <CategoryBadge
                            key={ac.category.id}
                            name={ac.category.name}
                          />
                        ))}
                      </div>
                    )}
                    <h3 className="mb-3 line-clamp-2 font-semibold text-foreground text-lg leading-snug tracking-tight">
                      {article.title}
                    </h3>
                    <p className="mb-5 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
                      {article.excerpt || ""}
                    </p>
                    <div className="mt-auto pt-2">
                      <span className="flex items-center gap-2 font-medium text-foreground text-sm transition-colors group-hover:text-foreground/70">
                        Read Full Story <ChevronsRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  </section>
);
