import { ArticleStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ArticleStatus;
  className?: string;
};

const statusConfig = {
  [ArticleStatus.DRAFT]: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  [ArticleStatus.REVIEW]: {
    label: "Review",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  [ArticleStatus.PUBLISHED]: {
    label: "Published",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  [ArticleStatus.ARCHIVED]: {
    label: "Archived",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
} as const;

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)} variant="outline">
      {config.label}
    </Badge>
  );
};
