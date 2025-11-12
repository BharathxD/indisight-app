import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  name: string;
  color?: string;
  className?: string;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "CXO Series": { bg: "bg-purple-50", text: "text-purple-700" },
  "Quiet Architects": { bg: "bg-blue-50", text: "text-blue-700" },
  "Editorial Archive": { bg: "bg-orange-50", text: "text-orange-700" },
  Events: { bg: "bg-red-50", text: "text-red-700" },
  Technology: { bg: "bg-green-50", text: "text-green-700" },
  Business: { bg: "bg-indigo-50", text: "text-indigo-700" },
  default: { bg: "bg-gray-50", text: "text-gray-700" },
};

export const CategoryBadge = ({ name, className }: CategoryBadgeProps) => {
  const colors = CATEGORY_COLORS[name] || CATEGORY_COLORS.default;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 font-semibold text-xs uppercase tracking-wider",
        "border-0 transition-colors duration-150",
        colors.bg,
        colors.text,
        className
      )}
    >
      {name}
    </span>
  );
};
