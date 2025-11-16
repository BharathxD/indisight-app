import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ArticleCardCompactProps = {
  article: {
    slug: string;
    title: string;
    thumbnailUrl?: string | null;
    publishedAt?: Date | null;
    articleCategories: Array<{
      isPrimary: boolean;
      category: {
        name: string;
      };
    }>;
  };
  className?: string;
  showImage?: boolean;
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
};

export const ArticleCardCompact = ({
  article,
  className,
  showImage = true,
}: ArticleCardCompactProps) => (
  <article
    className={cn(
      "group flex gap-4 border-border border-b pb-4 last:border-0",
      className
    )}
  >
    <Link className="flex flex-1 gap-4" href={`/articles/${article.slug}`}>
      {showImage && article.thumbnailUrl && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-muted">
          <Image
            alt={article.title}
            className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
            fill
            sizes="80px"
            src={article.thumbnailUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        <h4 className="mb-1.5 line-clamp-2 font-semibold text-foreground text-sm leading-snug tracking-tight transition-colors group-hover:text-muted-foreground">
          {article.title}
        </h4>
        {article.publishedAt && (
          <time
            className="text-muted-foreground text-sm opacity-80"
            dateTime={
              typeof article.publishedAt === "string"
                ? article.publishedAt
                : article.publishedAt.toISOString()
            }
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
      </div>
    </Link>
  </article>
);
