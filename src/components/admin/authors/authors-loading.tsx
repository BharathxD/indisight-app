import { Skeleton } from "@/components/ui/skeleton";

export const AuthorsLoading = () => (
  <div className="flex w-full flex-col gap-2.5">
    <div className="flex items-center justify-between gap-2 p-1">
      <div className="flex flex-1 gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>

    <div className="overflow-hidden rounded-md border">
      <div className="w-full">
        <div className="border-b bg-muted/50">
          <div className="flex h-12 items-center gap-4 px-4">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto size-4" />
          </div>
        </div>

        <div className="divide-y">
          {Array.from({ length: 10 }, (_, i) => i).map((index) => (
            <div
              className="flex h-16 items-center gap-4 px-4"
              key={`skeleton-${index}`}
            >
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="ml-auto size-8" />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);
