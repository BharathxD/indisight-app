import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthorInfo } from "./author-info";
import { CategoryBadge } from "./category-badge";

type ArticleCardHeroProps = {
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

export const ArticleCardHero = ({
  article,
  className,
}: ArticleCardHeroProps) => {
  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;

  return (
    <article
      className={cn(
        "group relative overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      <Link className="block" href={`/articles/${article.slug}`}>
        {article.featuredImageUrl && (
          <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 md:h-[500px]">
            <Image
              alt={article.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              src={article.featuredImageUrl}
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          {primaryCategory && (
            <div className="mb-4">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h1 className="mb-4 font-bold text-3xl text-gray-900 leading-tight tracking-tight md:text-5xl md:leading-tight md:tracking-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mb-6 line-clamp-3 text-base text-gray-600 leading-relaxed md:text-lg">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
              date={article.publishedAt}
              readTime={article.readTime}
            />
          )}
        </div>
      </Link>
    </article>
  );
};
