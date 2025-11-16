import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthorInfo } from "./author-info";
import { CategoryBadge } from "./category-badge";

type ArticleCardStandardProps = {
  article: {
    slug: string;
    title: string;
    excerpt?: string | null;
    thumbnailUrl?: string | null;
    publishedAt?: Date | null;
    readTime?: number | null;
    articleAuthors: Array<{
      author: {
        name: string;
        slug: string;
        profileImageUrl?: string | null;
      };
    }>;
    articleCategories: Array<{
      isPrimary: boolean;
      category: {
        name: string;
      };
    }>;
  };
  className?: string;
  layout?: "horizontal" | "vertical";
};

export const ArticleCardStandard = ({
  article,
  className,
  layout = "horizontal",
}: ArticleCardStandardProps) => {
  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;

  if (layout === "vertical") {
    return (
      <article
        className={cn(
          "group overflow-hidden border border-border bg-background transition-colors hover:border-foreground",
          className
        )}
      >
        <Link className="block" href={`/articles/${article.slug}`}>
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {article.thumbnailUrl ? (
              <Image
                alt={article.title}
                className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={article.thumbnailUrl}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-linear-to-br from-muted via-muted to-muted/80">
                <div className="flex flex-col items-center gap-3 opacity-40">
                  <svg
                    aria-label="Placeholder icon"
                    className="size-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <title>Placeholder icon</title>
                    <path
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium text-muted-foreground text-sm tracking-tight">
                    IndiSight
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            {primaryCategory && (
              <div className="mb-3">
                <CategoryBadge name={primaryCategory.category.name} />
              </div>
            )}
            <h3 className="mb-3 font-semibold text-foreground text-lg leading-snug tracking-tight">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                {article.excerpt}
              </p>
            )}
            {primaryAuthor && (
              <AuthorInfo
                author={primaryAuthor}
                className="text-xs"
                date={article.publishedAt}
                disableLinks
                readTime={article.readTime}
                showAvatar={false}
              />
            )}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex gap-6 border-border border-b bg-background pb-6 last:border-0",
        className
      )}
    >
      <Link className="flex flex-1 gap-6" href={`/articles/${article.slug}`}>
        <div className="relative size-[160px] shrink-0 overflow-hidden bg-muted">
          {article.thumbnailUrl ? (
            <Image
              alt={article.title}
              className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
              fill
              sizes="160px"
              src={article.thumbnailUrl}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-muted via-muted to-muted/80">
              <div className="flex flex-col items-center gap-2 opacity-40">
                <svg
                  aria-label="Placeholder icon"
                  className="size-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <title>Placeholder icon</title>
                  <path
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-muted-foreground text-xs tracking-tight">
                  IndiSight
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center">
          {primaryCategory && (
            <div className="mb-3">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h3 className="mb-3 font-semibold text-foreground text-lg leading-snug tracking-tight">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
              className="text-xs"
              date={article.publishedAt}
              disableLinks
              readTime={article.readTime}
              showAvatar={false}
            />
          )}
        </div>
      </Link>
    </article>
  );
};
