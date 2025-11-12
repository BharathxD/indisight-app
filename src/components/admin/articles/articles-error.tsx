import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ArticlesErrorProps = {
  error: Error;
  onRetry?: () => void;
};

export const ArticlesError = ({ error, onRetry }: ArticlesErrorProps) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-md border border-dashed p-8 text-center">
    <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="size-6 text-destructive" />
    </div>
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Failed to load articles</h3>
      <p className="text-muted-foreground text-sm">
        {error.message || "An unexpected error occurred"}
      </p>
    </div>
    {onRetry && (
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    )}
  </div>
);
