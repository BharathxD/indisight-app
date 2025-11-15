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
        "group hover:-translate-y-0.5 overflow-hidden border border-border bg-background transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      <Link className="block" href={`/articles/${article.slug}`}>
        {article.featuredImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              alt={article.title}
              className="object-cover transition-opacity duration-200 group-hover:opacity-90"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={article.featuredImageUrl}
            />
          </div>
        )}
        <div className="p-8">
          {primaryCategory && (
            <div className="mb-4">
              <CategoryBadge name={primaryCategory.category.name} />
            </div>
          )}
          <h2 className="mb-4 font-semibold text-foreground text-xl leading-snug tracking-tight md:text-2xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mb-5 line-clamp-2 text-base text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}
          {primaryAuthor && (
            <AuthorInfo
              author={primaryAuthor}
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
