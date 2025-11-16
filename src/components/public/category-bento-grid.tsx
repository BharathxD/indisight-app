"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  articleCount: number;
};

type CategoryBentoGridProps = {
  categories: Category[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

export const CategoryBentoGrid = ({ categories }: CategoryBentoGridProps) => {
  const displayCategories = categories.slice(0, 3);
  const [featured, ...rest] = displayCategories;

  if (!featured) return null;

  return (
    <motion.div
      animate="show"
      className="grid auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      variants={container}
    >
      <motion.div className="md:col-span-2 lg:row-span-2" variants={item}>
        <Link
          className="group relative flex size-full flex-col justify-end overflow-hidden border border-border bg-muted transition-colors hover:border-foreground"
          href={`/categories/${featured.slug}`}
        >
          {featured.imageUrl && (
            <div className="absolute inset-0">
              <Image
                alt={featured.name}
                className="object-cover object-top transition-all duration-500 group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                src={featured.imageUrl}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          )}
          <div className="relative z-10 p-8">
            <div className="mb-3 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1 text-white text-xs backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-white" />
              {featured.articleCount} Articles
            </div>
            <h3 className="mb-3 font-bold text-3xl text-white tracking-tight md:text-4xl">
              {featured.name}
            </h3>
            {featured.description && (
              <p className="mb-4 max-w-xl text-base text-white/90 leading-relaxed">
                {featured.description}
              </p>
            )}
            <div className="flex items-center font-medium text-sm text-white transition-transform group-hover:translate-x-1">
              Explore Category
              <svg
                aria-hidden="true"
                className="ml-2 size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>

      {rest.map((category) => (
        <motion.div key={category.slug} variants={item}>
          <Link
            className="group relative flex size-full flex-col justify-end overflow-hidden border border-border bg-muted transition-colors hover:border-foreground"
            href={`/categories/${category.slug}`}
          >
            {category.imageUrl && (
              <div className="absolute inset-0">
                <Image
                  alt={category.name}
                  className="object-cover object-top transition-all duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={category.imageUrl}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              </div>
            )}
            <div className="relative z-10 p-6">
              <div className="mb-2 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-2.5 py-1 text-white text-xs backdrop-blur-sm">
                <span className="size-1 rounded-full bg-white" />
                {category.articleCount}
              </div>
              <h3 className="mb-2 font-semibold text-white text-xl tracking-tight">
                {category.name}
              </h3>
              {category.description && (
                <p className="mb-3 line-clamp-2 text-sm text-white/80 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="flex items-center font-medium text-sm text-white transition-transform group-hover:translate-x-1">
                Explore
                <svg
                  aria-hidden="true"
                  className="ml-1 size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
