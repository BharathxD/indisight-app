"use client";

import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import { animationVariants } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

type Entity = {
  id: string;
  name: string;
};

type EntitySelectorProps<T extends Entity> = {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  value: string[];
  entities: T[];
  onChange: (ids: string[]) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  allowCreate?: boolean;
  isCreating?: boolean;
  onCreate?: (name: string) => void;
  renderBadge?: (entity: T, onRemove: () => void) => React.ReactNode;
  primaryId?: string;
  onPrimaryChange?: (id: string) => void;
};

export const EntitySelector = <T extends Entity>({
  label,
  placeholder,
  searchPlaceholder,
  emptyText,
  value,
  entities,
  onChange,
  error,
  helperText,
  required = false,
  allowCreate = false,
  isCreating = false,
  onCreate,
  renderBadge,
  primaryId,
  onPrimaryChange,
}: EntitySelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedEntities = entities.filter((e) => value.includes(e.id));

  const toggleEntity = (entityId: string) => {
    const newValue = value.includes(entityId)
      ? value.filter((id) => id !== entityId)
      : [...value, entityId];

    onChange(newValue);

    if (onPrimaryChange) {
      if (newValue.length === 1) {
        onPrimaryChange(newValue[0]);
      } else if (primaryId === entityId && !newValue.includes(entityId)) {
        onPrimaryChange(newValue[0] || "");
      }
    }
  };

  const removeEntity = (entityId: string) => {
    const newValue = value.filter((id) => id !== entityId);
    onChange(newValue);

    if (onPrimaryChange && primaryId === entityId && newValue.length > 0) {
      onPrimaryChange(newValue[0]);
    }
  };

  const handleCreate = () => {
    if (!(onCreate && searchValue.trim()) || isCreating) return;
    onCreate(searchValue.trim());
    setSearchValue("");
  };

  const showCreateOption =
    allowCreate &&
    searchValue.trim() &&
    !entities.some((e) => e.name.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className="space-y-3">
      <Label className="font-medium text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "h-10 w-full justify-between",
              !value.length && "text-muted-foreground",
              error && "border-destructive"
            )}
            variant="outline"
          >
            {value.length > 0 ? (
              <span className="truncate">{value.length} selected</span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setSearchValue}
              placeholder={searchPlaceholder}
              value={searchValue}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {showCreateOption && (
                  <CommandItem
                    disabled={isCreating}
                    onSelect={handleCreate}
                    value={`__create__${searchValue}`}
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <Plus className="mr-2 size-4" />
                      Create "{searchValue}"
                    </motion.div>
                  </CommandItem>
                )}
                {entities
                  .filter((entity) =>
                    entity.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((entity) => (
                    <CommandItem
                      key={entity.id}
                      onSelect={() => toggleEntity(entity.id)}
                      value={entity.name}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value.includes(entity.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {entity.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedEntities.length > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          <AnimatePresence mode="popLayout">
            {selectedEntities.map((entity) =>
              renderBadge ? (
                <motion.div
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  key={entity.id}
                  layout
                  variants={animationVariants.badge}
                >
                  {renderBadge(entity, () => removeEntity(entity.id))}
                </motion.div>
              ) : (
                <motion.div
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  key={entity.id}
                  layout
                  variants={animationVariants.badge}
                >
                  <Badge className="gap-1.5" variant="outline">
                    {entity.name}
                    <motion.button
                      className="inline-flex items-center"
                      onClick={() => removeEntity(entity.id)}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="size-3" />
                    </motion.button>
                  </Badge>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {error && (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm"
          initial={{ opacity: 0, y: -4 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
};
