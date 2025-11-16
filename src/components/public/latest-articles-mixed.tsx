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

type LatestArticlesMixedProps = {
  articles: Article[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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

export const LatestArticlesMixed = ({ articles }: LatestArticlesMixedProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (articles.length === 0) return null;

  const horizontalArticles = articles.slice(0, 2);
  const gridArticles = articles.slice(2, 6);

  return (
    <motion.div
      animate={isInView ? "show" : "hidden"}
      className="space-y-6"
      initial="hidden"
      ref={ref}
      variants={container}
    >
      <div className="space-y-6">
        {horizontalArticles.map((article, index) => {
          const primaryCategory = article.articleCategories.find(
            (ac) => ac.isPrimary
          );
          const primaryAuthor = article.articleAuthors[0]?.author;
          const isEven = index % 2 === 0;

          return (
            <motion.article
              className={`group flex flex-col gap-6 overflow-hidden border border-border ${isEven ? "bg-background" : "bg-muted"} p-6 transition-colors hover:border-foreground md:flex-row`}
              key={article.slug}
              variants={item}
            >
              <Link
                className="flex flex-1 gap-6"
                href={`/articles/${article.slug}`}
              >
                {article.thumbnailUrl && (
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted md:size-[280px]">
                    <Image
                      alt={article.title}
                      className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      src={article.thumbnailUrl}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center">
                  {primaryCategory && (
                    <div className="mb-3">
                      <CategoryBadge name={primaryCategory.category.name} />
                    </div>
                  )}
                  <h3 className="mb-3 font-semibold text-foreground text-xl leading-snug tracking-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  {primaryAuthor && (
                    <div className="flex items-center gap-4">
                      <AuthorInfo
                        author={primaryAuthor}
                        className="text-xs"
                        date={article.publishedAt}
                        disableLinks
                        readTime={article.readTime}
                        showAvatar={false}
                      />
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      {gridArticles.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {gridArticles.map((article) => {
            const primaryCategory = article.articleCategories.find(
              (ac) => ac.isPrimary
            );
            const primaryAuthor = article.articleAuthors[0]?.author;

            return (
              <motion.article
                className="group flex gap-4 overflow-hidden border border-border bg-background p-4 transition-colors hover:border-foreground"
                key={article.slug}
                variants={item}
              >
                <Link
                  className="flex flex-1 gap-4"
                  href={`/articles/${article.slug}`}
                >
                  {article.thumbnailUrl && (
                    <div className="relative size-[120px] shrink-0 overflow-hidden bg-muted">
                      <Image
                        alt={article.title}
                        className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                        fill
                        sizes="120px"
                        src={article.thumbnailUrl}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    {primaryCategory && (
                      <div className="mb-2">
                        <CategoryBadge name={primaryCategory.category.name} />
                      </div>
                    )}
                    <h3 className="mb-2 line-clamp-2 font-semibold text-base text-foreground leading-snug tracking-tight">
                      {article.title}
                    </h3>
                    {primaryAuthor && (
                      <div className="mt-auto">
                        <AuthorInfo
                          author={primaryAuthor}
                          className="text-xs"
                          date={article.publishedAt}
                          disableLinks
                          readTime={article.readTime}
                          showAvatar={false}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
