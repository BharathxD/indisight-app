"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AuthorInfo } from "./articles/author-info";
import { CategoryBadge } from "./articles/category-badge";

type Article = {
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

type FeaturedEditorialGridProps = {
  articles: Article[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const FeaturedEditorialGrid = ({
  articles,
}: FeaturedEditorialGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;
  const primaryCategory = hero.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = hero.articleAuthors[0]?.author;

  return (
    <motion.div
      animate={isInView ? "show" : "hidden"}
      className="grid gap-6 lg:grid-cols-3"
      initial="hidden"
      ref={ref}
      variants={container}
    >
      <motion.article className="lg:col-span-2 lg:row-span-2" variants={item}>
        <Link
          className="group flex size-full flex-col overflow-hidden border border-border bg-background transition-colors hover:border-foreground"
          href={`/articles/${hero.slug}`}
        >
          {hero.featuredImageUrl && (
            <div className="relative aspect-square w-full overflow-hidden bg-muted lg:aspect-4/5">
              <Image
                alt={hero.title}
                className="object-cover object-top transition-all duration-500 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                src={hero.featuredImageUrl}
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-8">
            {primaryCategory && (
              <div className="mb-4">
                <CategoryBadge name={primaryCategory.category.name} />
              </div>
            )}
            <h2 className="mb-4 font-bold text-2xl text-foreground leading-tight tracking-tight md:text-3xl md:leading-tight">
              {hero.title}
            </h2>
            {hero.excerpt && (
              <p className="mb-6 line-clamp-3 text-base text-muted-foreground leading-relaxed">
                {hero.excerpt}
              </p>
            )}
            <div className="mt-auto">
              {primaryAuthor && (
                <AuthorInfo
                  author={primaryAuthor}
                  date={hero.publishedAt}
                  disableLinks
                  readTime={hero.readTime}
                  showAvatar={false}
                />
              )}
            </div>
          </div>
        </Link>
      </motion.article>

      {rest.slice(0, 4).map((article) => {
        const category = article.articleCategories.find((ac) => ac.isPrimary);
        const author = article.articleAuthors[0]?.author;

        return (
          <motion.article key={article.slug} variants={item}>
            <Link
              className="group flex size-full flex-col overflow-hidden border border-border bg-background transition-colors hover:border-foreground"
              href={`/articles/${article.slug}`}
            >
              {article.featuredImageUrl && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    alt={article.title}
                    className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    src={article.featuredImageUrl}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {category && (
                  <div className="mb-3">
                    <CategoryBadge name={category.category.name} />
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
                <div className="mt-auto">
                  {author && (
                    <AuthorInfo
                      author={author}
                      className="text-xs"
                      date={article.publishedAt}
                      disableLinks
                      readTime={article.readTime}
                      showAvatar={false}
                    />
                  )}
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </motion.div>
  );
};
