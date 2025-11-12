"use client";

import { motion } from "motion/react";
import { EntitySelector } from "@/components/admin/articles/entity-selector";
import { Badge } from "@/components/ui/badge";
import { animationVariants } from "@/lib/animation-variants";
import { trpc } from "@/trpc/client";

type CategorySelectorProps = {
  value: string[];
  primaryCategoryId?: string;
  onChange: (categoryIds: string[]) => void;
  onPrimaryChange: (categoryId: string) => void;
  error?: string;
};

export const CategorySelector = ({
  value,
  primaryCategoryId,
  onChange,
  onPrimaryChange,
  error,
}: CategorySelectorProps) => {
  const { data: categoriesData } = trpc.cms.category.list.useQuery({});
  const categories = categoriesData || [];

  return (
    <EntitySelector
      emptyText="No categories found."
      entities={categories}
      error={error}
      helperText="Click a badge to set as primary category"
      label="Categories"
      onChange={onChange}
      onPrimaryChange={onPrimaryChange}
      placeholder="Select categories"
      primaryId={primaryCategoryId}
      renderBadge={(category) => (
        <motion.div variants={animationVariants.badge} whileHover="hover">
          <Badge
            className="cursor-pointer"
            onClick={() => onPrimaryChange(category.id)}
            variant={category.id === primaryCategoryId ? "default" : "outline"}
          >
            {category.name}
            {category.id === primaryCategoryId && (
              <span className="ml-1 text-xs opacity-70">(Primary)</span>
            )}
          </Badge>
        </motion.div>
      )}
      required
      searchPlaceholder="Search categories..."
      value={value}
    />
  );
};
