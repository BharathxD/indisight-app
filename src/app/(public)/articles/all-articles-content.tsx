"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";
import {
  ArticleCardHero,
  ArticleCardStandard,
} from "@/components/public/articles";
import { ArticlesFilters } from "@/components/public/articles/articles-filters";
import { ArticlesSkeleton } from "@/components/public/articles/articles-skeleton";
import { Pagination } from "@/components/public/pagination";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { trpc } from "@/trpc/client";

export const AllArticlesContent = () => {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withOptions({ shallow: true, history: "replace" })
  );
  const [categoryId, setCategoryId] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: true, history: "replace" })
  );
  const [isFeatured, setIsFeatured] = useQueryState(
    "featured",
    parseAsBoolean.withOptions({ shallow: true, history: "replace" })
  );
  const [isTrending, setIsTrending] = useQueryState(
    "trending",
    parseAsBoolean.withOptions({ shallow: true, history: "replace" })
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString
      .withDefault("newest")
      .withOptions({ shallow: true, history: "replace" })
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: true, history: "push" })
  );

  const [searchInput, setSearchInput] = useState(search || "");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
    setPage(1);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  const limit = 12; // 12 articles per page
  const offset = (page - 1) * limit;

  const {
    data: articlesData,
    isLoading,
    isFetching,
  } = trpc.cms.article.getLatest.useQuery({
    limit,
    offset,
    search: search || undefined,
    categoryId: categoryId || undefined,
    isFeatured: isFeatured || undefined,
    isTrending: isTrending || undefined,
    sortBy: (sortBy as "newest" | "oldest") || "newest",
  });

  const { data: categories } = trpc.cms.category.getAll.useQuery();

  const showSkeleton = isLoading;
  const articles = articlesData?.articles || [];
  const total = articlesData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const featuredArticle = page === 1 ? articles[0] : null;
  const restArticles = page === 1 ? articles.slice(1) : articles;

  const hasActiveFilters =
    search || categoryId || isFeatured !== null || isTrending !== null;

  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearch(null);
    setCategoryId(null);
    setIsFeatured(null);
    setIsTrending(null);
    setSortBy("newest");
    setPage(1);
  };

  const handleFilterChange = <T,>(
    setter: (value: T | null) => void,
    value: T | null
  ) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-12">
        <div className="mb-6 border-border border-b pb-8">
          <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
            All Articles
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our complete collection of articles on leadership,
            innovation, and meaningful change.
          </p>
        </div>

        <ArticlesFilters
          categories={categories || []}
          categoryId={categoryId}
          isFeatured={isFeatured}
          isLoading={isFetching}
          isTrending={isTrending}
          onCategoryChange={(val) => handleFilterChange(setCategoryId, val)}
          onFeaturedChange={(val) => handleFilterChange(setIsFeatured, val)}
          onSearchChange={setSearchInput}
          onSortByChange={(val) => handleFilterChange(setSortBy, val)}
          onTrendingChange={(val) => handleFilterChange(setIsTrending, val)}
          resultsCount={total}
          search={searchInput}
          sortBy={sortBy}
        />

        <div className="mt-12">
          {showSkeleton ? (
            <ArticlesSkeleton gridCount={12} heroCount={1} />
          ) : articles.length > 0 ? (
            <>
              {featuredArticle && (
                <section className="mb-12">
                  <ArticleCardHero article={featuredArticle} />
                </section>
              )}

              {restArticles.length > 0 && (
                <section>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {restArticles.map((article) => (
                      <ArticleCardStandard
                        article={article}
                        key={article.id}
                        layout="vertical"
                      />
                    ))}
                  </div>
                </section>
              )}

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    baseUrl="/articles"
                    currentPage={page}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-muted p-4">
                  <BookOpen className="size-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-bold text-2xl text-foreground">
                    No articles found
                  </h2>
                  <p className="text-muted-foreground">
                    {hasActiveFilters
                      ? "Try adjusting your filters or search terms."
                      : "Check back soon for new content."}
                  </p>
                </div>
                {hasActiveFilters && (
                  <Button onClick={handleClearAllFilters} variant="outline">
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="mt-16 border-border border-t pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="border border-border bg-muted p-8 md:p-12">
              <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
                Never Miss an Update
              </h2>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Get new articles, insights, and research delivered weekly to
                your inbox.
              </p>
              <Link
                className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-8 py-4 font-medium text-background transition-colors hover:bg-foreground/90"
                href="https://tally.so/r/w2YgzD"
                rel="noopener noreferrer"
                target="_blank"
              >
                Subscribe to Newsletter
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
