"use client";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FancySwitch } from "@/components/ui/fancy-switch";
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
    <div className="space-y-6 border-border">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 md:max-w-md">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="rounded-none pr-10 pl-10 [&::-webkit-search-cancel-button]:appearance-none"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search articles, authors..."
            type="search"
            value={searchInput}
          />
          {(searchInput || isSearching) && (
            <button
              className="-translate-y-1/2 absolute top-1/2 right-3 rounded-none text-muted-foreground transition-colors hover:text-foreground"
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

        <Select
          onValueChange={(value) =>
            onCategoryChange(value === "all" ? null : value)
          }
          value={categoryId || "all"}
        >
          <SelectTrigger className="w-[180px] rounded-none">
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

        <Select onValueChange={onSortByChange} value={sortBy}>
          <SelectTrigger className="w-[160px] rounded-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 pr-1.5">
          <FancySwitch
            checked={isFeatured === true}
            id="featured-filter"
            onCheckedChange={(checked) =>
              onFeaturedChange(checked ? true : null)
            }
          />
          <Label className="cursor-pointer text-sm" htmlFor="featured-filter">
            Featured only
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <FancySwitch
            checked={isTrending === true}
            id="trending-filter"
            onCheckedChange={(checked) =>
              onTrendingChange(checked ? true : null)
            }
          />
          <Label className="cursor-pointer text-sm" htmlFor="trending-filter">
            Trending only
          </Label>
        </div>

        {hasActiveFilters && (
          <Button onClick={handleClearAll} size="sm" variant="ghost">
            Clear all
          </Button>
        )}
      </div>

      {resultsCount !== undefined && (
        <div className="flex items-center justify-between border-border">
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
