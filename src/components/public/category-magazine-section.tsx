"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

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

type CategoryMagazineSectionProps = {
  title: string;
  articles: Article[];
  className?: string;
  align?: "left" | "right";
  viewAllLink?: string;
};

export const CategoryMagazineSection = ({
  title,
  articles,
  className,
  align = "left",
  viewAllLink,
}: CategoryMagazineSectionProps) => {
  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 4);

  return (
    <section className={className}>
      {/* Header */}
      <div className="mb-10 flex items-end justify-between border-border border-b pb-6">
        <h2 className="font-black text-3xl text-foreground tracking-tight md:text-4xl">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            className="group flex items-center gap-2 font-bold text-muted-foreground text-sm transition-colors hover:text-foreground"
            href={viewAllLink}
          >
            View All
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Featured Article - Takes 7 columns */}
        <motion.div
          className={`group relative flex flex-col lg:col-span-7 ${
            align === "right" ? "lg:order-2" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Link
            className="flex h-full flex-col"
            href={`/articles/${featuredArticle.slug}`}
          >
            <div className="relative mb-6 aspect-3/2 w-full overflow-hidden bg-muted">
              {featuredArticle.thumbnailUrl && (
                <Image
                  alt={featuredArticle.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={featuredArticle.thumbnailUrl}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wider">
                <span className="size-2 bg-primary" />
                {featuredArticle.articleCategories.find((c) => c.isPrimary)
                  ?.category.name || "Article"}
              </div>
              <h3 className="mb-4 font-bold text-3xl text-foreground leading-tight transition-colors group-hover:text-primary md:text-4xl">
                {featuredArticle.title}
              </h3>
              {featuredArticle.excerpt && (
                <p className="mb-6 line-clamp-3 text-lg text-muted-foreground leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              )}
              <div className="mt-auto flex items-center gap-3 text-sm">
                <div className="font-semibold text-foreground">
                  {featuredArticle.articleAuthors[0]?.author.name}
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="text-muted-foreground">
                  {featuredArticle.readTime
                    ? `${featuredArticle.readTime} min read`
                    : "Read now"}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Sidebar Articles - Takes 5 columns */}
        <div
          className={`flex flex-col lg:col-span-5 ${
            align === "right" ? "lg:order-1" : ""
          }`}
        >
          <div className="flex flex-col divide-y divide-border">
            {sidebarArticles.map((article, index) => (
              <motion.div
                className="py-6 first:pt-0 last:pb-0"
                initial={{ opacity: 0, x: 20 }}
                key={article.slug}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Link
                  className="group grid grid-cols-[1fr_auto] gap-6"
                  href={`/articles/${article.slug}`}
                >
                  <div className="flex flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2 font-bold text-[10px] text-primary uppercase tracking-wider">
                      {article.articleCategories.find((c) => c.isPrimary)
                        ?.category.name || "Article"}
                    </div>
                    <h4 className="mb-2 line-clamp-2 font-bold text-foreground text-lg leading-snug transition-colors group-hover:text-primary">
                      {article.title}
                    </h4>
                    <div className="mt-auto text-muted-foreground text-xs">
                      {article.articleAuthors[0]?.author.name}
                    </div>
                  </div>
                  <div className="relative aspect-4/3 w-32 shrink-0 overflow-hidden bg-muted">
                    {article.thumbnailUrl && (
                      <Image
                        alt={article.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="150px"
                        src={article.thumbnailUrl}
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
