"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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

type SpotlightSectionProps = {
  title: string;
  articles: Article[];
  className?: string;
  horizontalTitle?: boolean;
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

const ArticleCard = ({ article }: { article: Article }) => {
  const primaryCategory = article.articleCategories.find((ac) => ac.isPrimary);
  const primaryAuthor = article.articleAuthors[0]?.author;

  return (
    <motion.article className="group flex flex-col" variants={item}>
      <Link className="flex h-full flex-col" href={`/articles/${article.slug}`}>
        {/* Image */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden bg-muted">
          {article.thumbnailUrl && (
            <Image
              alt={article.title}
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="25vw"
              src={article.thumbnailUrl}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Category */}
          {primaryCategory && (
            <div className="mb-2 flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <span className="size-1.5 shrink-0 bg-foreground" />
              {primaryCategory.category.name}
            </div>
          )}

          {/* Title */}
          <h3 className="mb-2 font-bold text-base text-foreground leading-tight">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mb-3 line-clamp-3 text-muted-foreground text-xs leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author */}
          {primaryAuthor && (
            <div className="mt-auto font-bold text-foreground text-xs">
              {primaryAuthor.name}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export const SpotlightSection = ({
  title,
  articles,
  className,
  horizontalTitle = false,
}: SpotlightSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (articles.length === 0) return null;

  const displayArticles = articles.slice(0, 4);

  return (
    <motion.div
      animate={isInView ? "show" : "hidden"}
      className={`${className}`}
      initial="hidden"
      ref={ref}
      variants={container}
    >
      {/* Desktop Horizontal Title Layout */}
      {horizontalTitle && (
        <div className="hidden lg:block">
          <h2 className="mb-8 font-black text-4xl text-foreground tracking-tight">
            {title}
          </h2>
          <div className="grid grid-cols-4 gap-8">
            {displayArticles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Vertical Title Layout */}
      {!horizontalTitle && (
        <div className="hidden lg:flex lg:gap-12">
          {/* Vertical Title */}
          <div className="flex flex-col justify-start pt-2">
            <h2
              className="font-black text-8xl text-foreground tracking-tighter"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {title}
            </h2>
          </div>

          {/* Articles Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-8">
              {displayArticles.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <h2 className="mb-6 font-bold text-4xl text-foreground tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {displayArticles.map((article) => {
            const primaryCategory = article.articleCategories.find(
              (ac) => ac.isPrimary
            );
            const primaryAuthor = article.articleAuthors[0]?.author;

            return (
              <motion.article
                className="group flex flex-col"
                key={article.slug}
                variants={item}
              >
                <Link
                  className="flex h-full flex-col"
                  href={`/articles/${article.slug}`}
                >
                  {/* Image */}
                  <div className="relative mb-3 aspect-square w-full overflow-hidden bg-muted">
                    {article.thumbnailUrl && (
                      <Image
                        alt={article.title}
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        src={article.thumbnailUrl}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    {/* Category */}
                    {primaryCategory && (
                      <div className="mb-1.5 flex items-center gap-1.5 font-bold text-foreground text-xs uppercase tracking-wider">
                        <span className="size-1 shrink-0 bg-foreground" />
                        {primaryCategory.category.name}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="mb-2 font-bold text-foreground text-sm leading-tight">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="mb-2 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Author */}
                    {primaryAuthor && (
                      <div className="mt-auto font-bold text-foreground text-xs">
                        {primaryAuthor.name}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
