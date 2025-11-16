import { cn } from "@/lib/utils";

type ArticlesSkeletonProps = {
  heroCount?: number;
  gridCount?: number;
  className?: string;
};

const HeroCardSkeleton = () => (
  <article className="group relative overflow-hidden border border-border bg-background">
    <div className="flex flex-col md:flex-row">
      <div className="relative aspect-square w-full shrink-0 animate-pulse bg-muted md:w-[480px]" />
      <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
        <div className="mb-5 h-6 w-24 animate-pulse bg-muted" />
        <div className="mb-5 space-y-3">
          <div className="h-10 w-full animate-pulse bg-muted" />
          <div className="h-10 w-5/6 animate-pulse bg-muted" />
        </div>
        <div className="mb-8 space-y-2">
          <div className="h-5 w-full animate-pulse bg-muted" />
          <div className="h-5 w-full animate-pulse bg-muted" />
          <div className="h-5 w-3/4 animate-pulse bg-muted" />
        </div>
        <div className="flex items-center gap-3">
          <div className="size-11 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse bg-muted" />
            <div className="h-3 w-24 animate-pulse bg-muted" />
          </div>
        </div>
      </div>
    </div>
  </article>
);

const StandardCardSkeleton = () => (
  <article className="group overflow-hidden border border-border bg-background">
    <div className="relative aspect-square w-full animate-pulse overflow-hidden bg-muted" />
    <div className="p-6">
      <div className="mb-3 h-6 w-24 animate-pulse bg-muted" />
      <div className="mb-3 space-y-2">
        <div className="h-6 w-full animate-pulse bg-muted" />
        <div className="h-6 w-4/5 animate-pulse bg-muted" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full animate-pulse bg-muted" />
        <div className="h-4 w-full animate-pulse bg-muted" />
        <div className="h-4 w-3/4 animate-pulse bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-32 animate-pulse bg-muted" />
        <div className="h-3 w-1 animate-pulse bg-muted" />
        <div className="h-3 w-20 animate-pulse bg-muted" />
      </div>
    </div>
  </article>
);

export const ArticlesSkeleton = ({
  heroCount = 0,
  gridCount = 0,
  className,
}: ArticlesSkeletonProps) => (
  <div className={cn("space-y-12", className)}>
    {heroCount > 0 && (
      <section>
        {Array.from({ length: heroCount }).map((_, index) => (
          <HeroCardSkeleton key={`hero-skeleton-${index}`} />
        ))}
      </section>
    )}

    {gridCount > 0 && (
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: gridCount }).map((_, index) => (
            <StandardCardSkeleton key={`grid-skeleton-${index}`} />
          ))}
        </div>
      </section>
    )}
  </div>
);

