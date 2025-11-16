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
    thumbnailUrl?: string | null;
    publishedAt?: Date | null;
    readTime?: number | null;
    articleAuthors: {
      author: {
        name: string;
        slug: string;
        profileImageUrl?: string | null;
      };
    }[];
    articleCategories: {
      isPrimary: boolean;
      category: {
        name: string;
      };
    }[];
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
        "group relative overflow-hidden border border-border bg-background",
        className
      )}
    >
      <Link
        className="flex flex-col md:flex-row"
        href={`/articles/${article.slug}`}
      >
        {(article.thumbnailUrl || article.featuredImageUrl) && (
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted md:w-[480px]">
            <Image
              alt={article.title}
              className="object-cover object-top transition-opacity duration-300 group-hover:opacity-90"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              src={(article.thumbnailUrl || article.featuredImageUrl) as string}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
          {primaryCategory && (
            <div className="mb-5">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h1 className="mb-5 font-bold text-3xl text-foreground leading-tight tracking-tight md:text-5xl md:leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mb-8 line-clamp-3 text-base text-muted-foreground leading-relaxed md:text-lg md:leading-relaxed">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
              date={article.publishedAt}
              disableLinks
              readTime={article.readTime}
            />
          )}
        </div>
      </Link>
    </article>
  );
};
