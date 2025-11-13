import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  name: string;
  color?: string;
  className?: string;
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "CXO Series": {
    bg: "bg-purple-100/50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  "Quiet Architects": {
    bg: "bg-blue-100/50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  "Editorial Archive": {
    bg: "bg-orange-100/50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  Events: {
    bg: "bg-red-100/50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  Technology: {
    bg: "bg-green-100/50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  Business: {
    bg: "bg-indigo-100/50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  default: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

export const CategoryBadge = ({ name, className }: CategoryBadgeProps) => {
  const colors = CATEGORY_COLORS[name] || CATEGORY_COLORS.default;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border px-2.5 py-0.5 font-medium text-[11px] tracking-tight transition-colors duration-150",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {name}
    </span>
  );
};
