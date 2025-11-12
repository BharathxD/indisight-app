import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type UsersErrorProps = {
  error: Error;
  onRetry: () => void;
};

export const UsersError = ({ error, onRetry }: UsersErrorProps) => (
  <Card className="flex flex-col items-center justify-center gap-4 p-8">
    <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="size-6 text-destructive" />
    </div>
    <div className="space-y-1 text-center">
      <h3 className="font-semibold text-lg">Failed to load users</h3>
      <p className="text-muted-foreground text-sm">{error.message}</p>
    </div>
    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </Card>
);
