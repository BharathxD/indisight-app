"use client";

import { Check, ChevronsUpDown, User } from "lucide-react";
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
import { trpc } from "@/trpc/client";

type AuthorSelectorProps = {
  value: string[];
  primaryAuthorId?: string;
  onChange: (authorIds: string[]) => void;
  onPrimaryChange: (authorId: string) => void;
  error?: string;
};

export const AuthorSelector = ({
  value,
  primaryAuthorId,
  onChange,
  onPrimaryChange,
  error,
}: AuthorSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: authorsData } = trpc.cms.author.list.useQuery({ limit: 100 });
  const authors = authorsData?.authors || [];

  const selectedAuthors = authors.filter((a) => value.includes(a.id));

  const toggleAuthor = (authorId: string) => {
    const newValue = value.includes(authorId)
      ? value.filter((id) => id !== authorId)
      : [...value, authorId];

    onChange(newValue);

    if (newValue.length === 1) {
      onPrimaryChange(newValue[0]);
    } else if (primaryAuthorId === authorId && !newValue.includes(authorId)) {
      onPrimaryChange(newValue[0] || "");
    }
  };

  return (
    <div className="space-y-3">
      <Label className="font-medium text-sm">
        Authors <span className="text-destructive">*</span>
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
              "Select authors"
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search authors..." />
            <CommandList>
              <CommandEmpty>No authors found.</CommandEmpty>
              <CommandGroup>
                {authors.map((author) => (
                  <CommandItem
                    key={author.id}
                    onSelect={() => toggleAuthor(author.id)}
                    value={author.name}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(author.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {author.profileImageUrl ? (
                        <div className="size-5 overflow-hidden rounded-full">
                          <div
                            className="size-full bg-center bg-cover"
                            style={{
                              backgroundImage: `url(${author.profileImageUrl})`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex size-5 items-center justify-center rounded-full bg-accent">
                          <User className="size-3" />
                        </div>
                      )}
                      <span>{author.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedAuthors.length > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          <AnimatePresence mode="popLayout">
            {selectedAuthors.map((author) => (
              <motion.div
                animate="animate"
                exit="exit"
                initial="initial"
                key={author.id}
                layout
                variants={animationVariants.badge}
                whileHover="hover"
              >
                <Badge
                  className="cursor-pointer gap-1.5"
                  onClick={() => onPrimaryChange(author.id)}
                  variant={
                    author.id === primaryAuthorId ? "default" : "outline"
                  }
                >
                  {author.profileImageUrl ? (
                    <div className="size-3.5 overflow-hidden rounded-full">
                      <div
                        className="size-full bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${author.profileImageUrl})`,
                        }}
                      />
                    </div>
                  ) : (
                    <User className="size-3.5" />
                  )}
                  {author.name}
                  {author.id === primaryAuthorId && (
                    <span className="text-xs opacity-70">(Primary)</span>
                  )}
                </Badge>
              </motion.div>
            ))}
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
      <p className="text-muted-foreground text-xs">
        Click a badge to set as primary author
      </p>
    </div>
  );
};
