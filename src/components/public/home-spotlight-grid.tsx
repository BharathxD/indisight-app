"use client";

import { ArrowRightIcon } from "lucide-react";
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

type HomeSpotlightGridProps = {
  col1Row1Article?: Article | null;
  col1Row2Article?: Article | null;
  col2Row12Article?: Article | null;
  col3Row14Articles: Article[];
  col1Row3ColSpan2Articles: Article[];
  col1Row1CategorySlug?: string;
  col1Row2CategorySlug?: string;
  col1Row3ColSpan2CategorySlug?: string;
  col1Row1Title?: string;
  col1Row2Title?: string;
  col1Row3ColSpan2Title?: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

type SectionHeaderProps = {
  title: string;
  viewAllHref?: string;
};

const SectionHeader = ({ title, viewAllHref }: SectionHeaderProps) => (
  <div className="mb-2.5 flex items-center justify-between">
    <h3 className="font-bold text-foreground text-lg tracking-tight">
      {title}
    </h3>
    {viewAllHref && (
      <Link
        className="flex items-center gap-1 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
        href={viewAllHref}
      >
        View all <ArrowRightIcon className="size-3" />
      </Link>
    )}
  </div>
);

const EmptyStateCard = ({
  categoryName,
  message,
}: {
  categoryName: string;
  message: string;
}) => (
  <div className="flex size-full flex-col items-center justify-center border border-muted-foreground/30 border-dashed bg-muted/20 p-8 text-center">
    <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
      {categoryName}
    </div>
    <p className="text-muted-foreground/80 text-sm">{message}</p>
  </div>
);

const CompactArticleCard = ({ article }: { article: Article }) => {
  const category = article.articleCategories.find((ac) => ac.isPrimary);
  const author = article.articleAuthors[0]?.author;
  const imageUrl = article.thumbnailUrl || article.featuredImageUrl;

  return (
    <Link
      className="group flex gap-4 overflow-hidden border border-border bg-background p-4 transition-all hover:border-foreground hover:shadow-lg lg:flex-col lg:gap-0 lg:p-0"
      href={`/articles/${article.slug}`}
    >
      {imageUrl && (
        <div className="relative size-24 shrink-0 overflow-hidden bg-muted lg:aspect-4/3 lg:size-auto lg:w-full">
          <Image
            alt={article.title}
            className="object-cover object-center transition-all duration-300 group-hover:scale-105 lg:object-top"
            fill
            sizes="(max-width: 1024px) 96px, 20vw"
            src={imageUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center lg:justify-start lg:p-4">
        {category && (
          <div className="mb-1.5 lg:mb-2">
            <CategoryBadge name={category.category.name} />
          </div>
        )}
        <h3 className="mb-1.5 line-clamp-2 font-semibold text-foreground text-sm leading-snug tracking-tight lg:mb-2">
          {article.title}
        </h3>
        {author && (
          <div className="mt-auto">
            <AuthorInfo
              author={author}
              className="text-xs"
              date={article.publishedAt}
              disableLinks
              showAvatar={false}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

const FeaturedSpotlight = ({ article }: { article: Article }) => {
  const category = article.articleCategories.find((ac) => ac.isPrimary);
  const author = article.articleAuthors[0]?.author;
  const imageUrl = article.featuredImageUrl || article.thumbnailUrl;

  return (
    <Link
      className="group flex size-full flex-col overflow-hidden border border-border bg-background transition-all hover:border-foreground hover:shadow-xl"
      href={`/articles/${article.slug}`}
    >
      {imageUrl && (
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Image
            alt={article.title}
            className="object-cover object-top transition-all duration-300 group-hover:scale-105"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
            src={imageUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <div className="mb-2">
            <CategoryBadge name={category.category.name} />
          </div>
        )}
        <h2 className="mb-2 line-clamp-2 font-bold text-foreground text-xl leading-tight tracking-tight">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mb-3 line-clamp-4 text-muted-foreground text-sm leading-relaxed">
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
  );
};

const EmptyFeaturedSpotlight = () => (
  <div className="flex size-full flex-col items-center justify-center border border-muted-foreground/30 border-dashed bg-muted/20 p-12 text-center">
    <div className="mb-3 font-semibold text-lg text-muted-foreground uppercase tracking-wider">
      Featured Spotlight
    </div>
    <p className="max-w-md text-muted-foreground/80 text-sm">
      No featured article available at the moment. Check back soon for
      compelling stories from industry leaders.
    </p>
  </div>
);

const EmptyLatestList = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
      No Recent Articles
    </div>
    <p className="text-muted-foreground/80 text-sm">New content coming soon</p>
  </div>
);

const LatestArticleItem = ({ article }: { article: Article }) => {
  const category = article.articleCategories.find((ac) => ac.isPrimary);
  const author = article.articleAuthors[0]?.author;
  const imageUrl = article.thumbnailUrl || article.featuredImageUrl;

  return (
    <Link
      className="group flex gap-3 border-border border-b px-4 pb-4 transition-colors last:border-b-0 last:pb-0 hover:opacity-80"
      href={`/articles/${article.slug}`}
    >
      {imageUrl && (
        <div className="relative size-[90px] shrink-0 overflow-hidden bg-muted">
          <Image
            alt={article.title}
            className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
            fill
            sizes="90px"
            src={imageUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-start">
        {category && (
          <div className="-mt-0.5 mb-1.5">
            <CategoryBadge name={category.category.name} />
          </div>
        )}
        <h4 className="mb-1.5 line-clamp-2 font-semibold text-foreground text-sm leading-snug tracking-tight">
          {article.title}
        </h4>
        {author && (
          <div className="text-muted-foreground text-xs">
            {author.name}
            {article.publishedAt && (
              <>
                {" · "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(new Date(article.publishedAt))}
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

const FoundersArticleCard = ({ article }: { article: Article }) => {
  const category = article.articleCategories.find((ac) => ac.isPrimary);
  const author = article.articleAuthors[0]?.author;
  const imageUrl = article.thumbnailUrl || article.featuredImageUrl;

  return (
    <Link
      className="group flex gap-4 overflow-hidden border border-border bg-background p-4 transition-colors hover:border-foreground"
      href={`/articles/${article.slug}`}
    >
      {imageUrl && (
        <div className="relative size-24 shrink-0 overflow-hidden bg-muted">
          <Image
            alt={article.title}
            className="object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
            fill
            sizes="96px"
            src={imageUrl}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        {category && (
          <div className="mb-1.5">
            <CategoryBadge name={category.category.name} />
          </div>
        )}
        <h3 className="mb-1.5 line-clamp-2 font-semibold text-base text-foreground leading-snug tracking-tight">
          {article.title}
        </h3>
        {author && (
          <div className="text-muted-foreground text-xs">
            {author.name} ·{" "}
            {article.publishedAt &&
              new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(new Date(article.publishedAt))}
          </div>
        )}
      </div>
    </Link>
  );
};

export const HomeSpotlightGrid = ({
  col1Row1Article,
  col1Row2Article,
  col2Row12Article,
  col3Row14Articles,
  col1Row3ColSpan2Articles,
  col1Row1CategorySlug,
  col1Row2CategorySlug,
  col1Row3ColSpan2CategorySlug,
  col1Row1Title = "CXO Series",
  col1Row2Title = "Youth Foundation",
  col1Row3ColSpan2Title = "Founders",
}: HomeSpotlightGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-[20%_47.5%_30%]"
      initial="hidden"
      ref={ref}
      variants={container}
    >
      <motion.div className="order-2 flex flex-col lg:order-1" variants={item}>
        <SectionHeader
          title={col1Row1Title}
          viewAllHref={
            col1Row1CategorySlug
              ? `/categories/${col1Row1CategorySlug}`
              : undefined
          }
        />
        {col1Row1Article ? (
          <CompactArticleCard article={col1Row1Article} />
        ) : (
          <EmptyStateCard
            categoryName={col1Row1Title}
            message="No articles yet"
          />
        )}
      </motion.div>

      <motion.div
        className="order-1 flex flex-col lg:order-2 lg:row-span-2"
        variants={item}
      >
        <SectionHeader title="Featured" viewAllHref="/articles" />
        {col2Row12Article ? (
          <FeaturedSpotlight article={col2Row12Article} />
        ) : (
          <EmptyFeaturedSpotlight />
        )}
      </motion.div>

      <motion.div
        className="order-4 flex flex-col border border-border bg-background lg:order-3 lg:row-span-4"
        variants={item}
      >
        <div className="border-border border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-lg tracking-tight">
              Just In
            </h3>
            <Link
              className="flex items-center gap-1 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              href="/articles"
            >
              View all <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col items-start justify-center gap-4 overflow-y-auto py-4">
          {col3Row14Articles.length > 0 ? (
            col3Row14Articles.map((article) => (
              <LatestArticleItem article={article} key={article.slug} />
            ))
          ) : (
            <EmptyLatestList />
          )}
        </div>
      </motion.div>

      <motion.div className="order-2 flex flex-col lg:order-4" variants={item}>
        <SectionHeader
          title={col1Row2Title}
          viewAllHref={
            col1Row2CategorySlug
              ? `/categories/${col1Row2CategorySlug}`
              : undefined
          }
        />
        {col1Row2Article ? (
          <CompactArticleCard article={col1Row2Article} />
        ) : (
          <EmptyStateCard categoryName={col1Row2Title} message="Coming soon" />
        )}
      </motion.div>

      <motion.div
        className="lg:-mb-4 order-3 flex flex-col lg:order-5 lg:col-span-2"
        variants={item}
      >
        <SectionHeader
          title={col1Row3ColSpan2Title}
          viewAllHref={
            col1Row3ColSpan2CategorySlug
              ? `/categories/${col1Row3ColSpan2CategorySlug}`
              : undefined
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {col1Row3ColSpan2Articles.length > 0 ? (
            col1Row3ColSpan2Articles.map((article) => (
              <FoundersArticleCard article={article} key={article.slug} />
            ))
          ) : (
            <div className="flex size-full flex-col items-center justify-center border border-muted-foreground/30 border-dashed bg-muted/20 p-12 text-center md:col-span-2">
              <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                {col1Row3ColSpan2Title}
              </div>
              <p className="text-muted-foreground/80 text-sm">
                No founder stories available yet
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
