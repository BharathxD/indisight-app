"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
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

type TagSelectorProps = {
  value: string[];
  onChange: (tagIds: string[]) => void;
};

export const TagSelector = ({ value, onChange }: TagSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: tagsData } = trpc.cms.tag.list.useQuery({ limit: 100 });
  const tags = tagsData?.tags || [];

  const selectedTags = tags.filter((t) => value.includes(t.id));

  const toggleTag = (tagId: string) => {
    const newValue = value.includes(tagId)
      ? value.filter((id) => id !== tagId)
      : [...value, tagId];

    onChange(newValue);
  };

  const removeTag = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-between",
              !value.length && "text-muted-foreground"
            )}
            variant="outline"
          >
            {value.length > 0 ? (
              <span className="truncate">{value.length} selected</span>
            ) : (
              "Select tags"
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => toggleTag(tag.id)}
                    value={tag.name}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge className="gap-1" key={tag.id} variant="outline">
              {tag.name}
              <X
                className="size-3 cursor-pointer"
                onClick={() => removeTag(tag.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      <p className="text-muted-foreground text-xs">
        Optional: Add relevant tags to improve discoverability
      </p>
    </div>
  );
};
