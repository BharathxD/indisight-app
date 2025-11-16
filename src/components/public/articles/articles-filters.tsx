"use client";

import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

type Category = {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
};

type ArticlesFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string | null;
  onCategoryChange: (value: string | null) => void;
  isFeatured: boolean | null;
  onFeaturedChange: (value: boolean | null) => void;
  isTrending: boolean | null;
  onTrendingChange: (value: boolean | null) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  categories: Category[];
  isLoading?: boolean;
  resultsCount?: number;
};

export const ArticlesFilters = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  isFeatured,
  onFeaturedChange,
  isTrending,
  onTrendingChange,
  sortBy,
  onSortByChange,
  categories,
  isLoading = false,
  resultsCount,
}: ArticlesFiltersProps) => {
  const [searchInput, setSearchInput] = useState(search);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    onSearchChange(value);
    setIsSearching(false);
  }, 300);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setIsSearching(true);
    debouncedSetSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onSearchChange("");
    setIsSearching(false);
  };

  const hasActiveFilters =
    search || categoryId || isFeatured !== null || isTrending !== null;

  const handleClearAll = () => {
    setSearchInput("");
    onSearchChange("");
    onCategoryChange(null);
    onFeaturedChange(null);
    onTrendingChange(null);
    onSortByChange("newest");
    setIsSearching(false);
  };

  return (
    <div className="space-y-6 border-border border-b pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10 pr-10"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search articles, authors..."
            type="search"
            value={searchInput}
          />
          {(searchInput || isSearching) && (
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={handleClearSearch}
              type="button"
            >
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Filters</span>
          {hasActiveFilters && (
            <Button
              onClick={handleClearAll}
              size="sm"
              variant="ghost"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-sm" htmlFor="category-select">
            Category
          </Label>
          <Select
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? null : value)
            }
            value={categoryId || "all"}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.articleCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm" htmlFor="sort-select">
            Sort by
          </Label>
          <Select onValueChange={onSortByChange} value={sortBy}>
            <SelectTrigger id="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Checkbox
            checked={isFeatured === true}
            id="featured-filter"
            onCheckedChange={(checked) =>
              onFeaturedChange(checked === true ? true : null)
            }
          />
          <Label
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="featured-filter"
          >
            Featured only
          </Label>
        </div>

        <div className="flex items-end space-x-2">
          <Checkbox
            checked={isTrending === true}
            id="trending-filter"
            onCheckedChange={(checked) =>
              onTrendingChange(checked === true ? true : null)
            }
          />
          <Label
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="trending-filter"
          >
            Trending only
          </Label>
        </div>
      </div>

      {resultsCount !== undefined && (
        <div className="flex items-center justify-between border-border border-t pt-4">
          <p className="text-muted-foreground text-sm">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3 animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                {resultsCount} {resultsCount === 1 ? "article" : "articles"}{" "}
                found
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

