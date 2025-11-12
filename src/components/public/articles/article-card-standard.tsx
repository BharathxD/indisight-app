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
          "group overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md",
          className
        )}
      >
        <Link className="block" href={`/articles/${article.slug}`}>
          {article.thumbnailUrl && (
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Image
                alt={article.title}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={article.thumbnailUrl}
              />
            </div>
          )}
          <div className="p-4">
            {primaryCategory && (
              <div className="mb-2">
                <CategoryBadge name={primaryCategory.category.name} />
              </div>
            )}
            <h3 className="mb-2 font-semibold text-gray-900 text-lg leading-tight">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="mb-3 line-clamp-2 text-gray-600 text-sm leading-relaxed">
                {article.excerpt}
              </p>
            )}
            {primaryAuthor && (
              <AuthorInfo
                author={primaryAuthor}
                className="text-xs"
                date={article.publishedAt}
                readTime={article.readTime}
                showAvatar={false}
                disableLinks
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
        "group flex gap-4 overflow-hidden border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      <Link className="flex flex-1 gap-4" href={`/articles/${article.slug}`}>
        {article.thumbnailUrl && (
          <div className="relative h-[120px] w-[160px] flex-shrink-0 overflow-hidden bg-gray-100">
            <Image
              alt={article.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="160px"
              src={article.thumbnailUrl}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center">
          {primaryCategory && (
            <div className="mb-2">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h3 className="mb-2 font-semibold text-gray-900 text-lg leading-tight">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mb-3 line-clamp-2 text-gray-600 text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
              className="text-xs"
              date={article.publishedAt}
              readTime={article.readTime}
              showAvatar={false}
              disableLinks
            />
          )}
        </div>
      </Link>
    </article>
  );
};
