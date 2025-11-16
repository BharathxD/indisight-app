import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type PeopleErrorProps = {
  error: Error;
  onRetry: () => void;
};

export const PeopleError = ({ error, onRetry }: PeopleErrorProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
    <AlertCircle className="mb-4 size-10 text-destructive" />
    <h3 className="mb-2 font-semibold text-lg">Failed to load people</h3>
    <p className="mb-4 text-muted-foreground text-sm">{error.message}</p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="size-4" />
      Try Again
    </Button>
  </div>
);
