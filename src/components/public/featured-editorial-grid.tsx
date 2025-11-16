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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const FeaturedEditorialGrid = ({
  articles,
}: FeaturedEditorialGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (articles.length === 0) return null;

  const topThree = articles.slice(0, 3);
  const remaining = articles.slice(3, 6);

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        animate={isInView ? "show" : "hidden"}
        className="grid gap-4 md:gap-6 lg:grid-cols-3"
        initial="hidden"
        ref={ref}
        variants={container}
      >
        {topThree.map((article) => {
          const category = article.articleCategories.find((ac) => ac.isPrimary);
          const author = article.articleAuthors[0]?.author;

          return (
            <motion.article key={article.slug} variants={item}>
              <Link
                className="group flex size-full flex-col overflow-hidden rounded-lg border border-border bg-background transition-all hover:border-foreground hover:shadow-lg"
                href={`/articles/${article.slug}`}
              >
                {article.featuredImageUrl && (
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      alt={article.title}
                      className="object-cover object-top transition-all duration-300 group-hover:scale-105"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      src={article.featuredImageUrl}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  {category && (
                    <div className="mb-2">
                      <CategoryBadge name={category.category.name} />
                    </div>
                  )}
                  <h3 className="mb-2 line-clamp-2 font-semibold text-base text-foreground leading-snug tracking-tight md:text-lg">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mb-3 line-clamp-2 text-muted-foreground text-xs leading-relaxed md:text-sm">
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

      {remaining.length > 0 && (
        <motion.div
          animate={isInView ? "show" : "hidden"}
          className="grid gap-4 md:gap-6 lg:grid-cols-3"
          initial="hidden"
          variants={container}
        >
          {remaining.map((article) => {
            const category = article.articleCategories.find(
              (ac) => ac.isPrimary
            );
            const author = article.articleAuthors[0]?.author;

            return (
              <motion.article key={article.slug} variants={item}>
                <Link
                  className="group flex size-full flex-col overflow-hidden rounded-lg border border-border bg-background transition-all hover:border-foreground hover:shadow-lg"
                  href={`/articles/${article.slug}`}
                >
                  {article.featuredImageUrl && (
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        alt={article.title}
                        className="object-cover object-top transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        src={article.featuredImageUrl}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    {category && (
                      <div className="mb-2">
                        <CategoryBadge name={category.category.name} />
                      </div>
                    )}
                    <h3 className="mb-2 line-clamp-2 font-semibold text-base text-foreground leading-snug tracking-tight md:text-lg">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mb-3 line-clamp-2 text-muted-foreground text-xs leading-relaxed md:text-sm">
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
      )}
    </div>
  );
};
