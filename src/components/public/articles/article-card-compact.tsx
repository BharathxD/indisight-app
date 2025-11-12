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
      "group flex gap-3 border-gray-200 border-b pb-3 last:border-0",
      className
    )}
  >
    <Link className="flex flex-1 gap-3" href={`/articles/${article.slug}`}>
      {showImage && article.thumbnailUrl && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-gray-100">
          <Image
            alt={article.title}
            className="object-cover"
            fill
            sizes="64px"
            src={article.thumbnailUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        <h4 className="mb-1 line-clamp-2 font-semibold text-gray-900 text-sm leading-tight group-hover:text-gray-600">
          {article.title}
        </h4>
        {article.publishedAt && (
          <time
            className="text-gray-500 text-xs"
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
