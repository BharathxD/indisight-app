import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {currentPage > 1 ? (
        <Link
          aria-label="Go to previous page"
          className="inline-flex size-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground hover:bg-muted"
          href={getPageUrl(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex size-10 items-center justify-center border border-border bg-muted text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Link
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
              className={cn(
                "inline-flex size-10 items-center justify-center border text-sm transition-colors",
                page === currentPage
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground hover:bg-muted"
              )}
              href={getPageUrl(page)}
              key={`page-${page}`}
            >
              {page}
            </Link>
          ) : (
            <span
              className="inline-flex size-10 items-center justify-center text-muted-foreground text-sm"
              key={`ellipsis-${index.toString()}`}
            >
              {page}
            </span>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          aria-label="Go to next page"
          className="inline-flex size-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground hover:bg-muted"
          href={getPageUrl(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex size-10 items-center justify-center border border-border bg-muted text-muted-foreground"
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
};
