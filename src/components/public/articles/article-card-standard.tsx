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
          "group overflow-hidden border border-border bg-background transition-shadow duration-200 hover:shadow-lg",
          className
        )}
      >
        <Link className="block" href={`/articles/${article.slug}`}>
          {article.thumbnailUrl && (
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
              <Image
                alt={article.title}
                className="object-cover transition-opacity duration-200 group-hover:opacity-90"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={article.thumbnailUrl}
              />
            </div>
          )}
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
        {article.thumbnailUrl && (
          <div className="relative h-[140px] w-[200px] shrink-0 overflow-hidden bg-muted">
            <Image
              alt={article.title}
              className="object-cover transition-opacity duration-200 group-hover:opacity-90"
              fill
              sizes="200px"
              src={article.thumbnailUrl}
            />
          </div>
        )}
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
