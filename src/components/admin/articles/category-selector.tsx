"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  const [open, setOpen] = useState(false);
  const { data: categoriesData } = trpc.cms.category.list.useQuery({});
  const categories = categoriesData || [];

  const selectedCategories = categories.filter((c: { id: string }) =>
    value.includes(c.id)
  );

  const toggleCategory = (categoryId: string) => {
    const newValue = value.includes(categoryId)
      ? value.filter((id) => id !== categoryId)
      : [...value, categoryId];

    onChange(newValue);

    if (newValue.length === 1) {
      onPrimaryChange(newValue[0]);
    } else if (
      primaryCategoryId === categoryId &&
      !newValue.includes(categoryId)
    ) {
      onPrimaryChange(newValue[0] || "");
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        Categories <span className="text-destructive">*</span>
      </Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-between",
              !value.length && "text-muted-foreground",
              error && "border-destructive"
            )}
            variant="outline"
          >
            {value.length > 0 ? (
              <span className="truncate">{value.length} selected</span>
            ) : (
              "Select categories"
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category: { id: string; name: string }) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => toggleCategory(category.id)}
                    value={category.name}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(category.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category: { id: string; name: string }) => (
            <Badge
              className="cursor-pointer"
              key={category.id}
              onClick={() => onPrimaryChange(category.id)}
              variant={
                category.id === primaryCategoryId ? "default" : "outline"
              }
            >
              {category.name}
              {category.id === primaryCategoryId && " (Primary)"}
            </Badge>
          ))}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
      <p className="text-muted-foreground text-xs">
        Click a badge to set as primary category
      </p>
    </div>
  );
};
