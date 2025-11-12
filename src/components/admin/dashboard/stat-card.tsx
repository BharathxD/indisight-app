import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  className?: string;
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  className,
}: StatCardProps) => (
  <Card className={cn("shadow-none", className)}>
    <CardContent className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="font-semibold text-3xl tracking-tight">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);
