import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthorInfo } from "./author-info";
import { CategoryBadge } from "./category-badge";

type ArticleCardFeaturedProps = {
  article: {
    slug: string;
    title: string;
    excerpt?: string | null;
    featuredImageUrl?: string | null;
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
};

export const ArticleCardFeatured = ({
  article,
  className,
}: ArticleCardFeaturedProps) => {
  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;

  return (
    <article
      className={cn(
        "group overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      <Link className="block" href={`/articles/${article.slug}`}>
        {article.featuredImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              alt={article.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={article.featuredImageUrl}
            />
          </div>
        )}
        <div className="p-6">
          {primaryCategory && (
            <div className="mb-3">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h2 className="mb-3 font-semibold text-gray-900 text-xl leading-tight tracking-tight md:text-2xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mb-4 line-clamp-2 text-base text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
              date={article.publishedAt}
              readTime={article.readTime}
              showAvatar={false}
            />
          )}
        </div>
      </Link>
    </article>
  );
};
