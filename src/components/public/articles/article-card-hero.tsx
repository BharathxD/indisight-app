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
        "group relative overflow-hidden border border-border bg-background",
        className
      )}
    >
      <Link className="block" href={`/articles/${article.slug}`}>
        {article.featuredImageUrl && (
          <div className="relative h-[480px] w-full overflow-hidden bg-muted md:h-[560px]">
            <Image
              alt={article.title}
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              src={article.featuredImageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        <div className="p-8 md:p-12">
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
              readTime={article.readTime}
            />
          )}
        </div>
      </Link>
    </article>
  );
};
