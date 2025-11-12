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
    bg: "bg-purple-100/50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Quiet Architects": {
    bg: "bg-blue-100/50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Editorial Archive": {
    bg: "bg-orange-100/50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  Events: {
    bg: "bg-red-100/50",
    text: "text-red-700",
    border: "border-red-200",
  },
  Technology: {
    bg: "bg-green-100/50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Business: {
    bg: "bg-indigo-100/50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  default: {
    bg: "bg-neutral-100/50",
    text: "text-neutral-700",
    border: "border-neutral-200",
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
