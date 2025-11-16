"use client";

import { Check, ChevronsUpDown, Plus, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import slugify from "slugify";
import { useState } from "react";
import { toast } from "sonner";
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
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

type PersonSelectorProps = {
  value: string[];
  onChange: (personIds: string[]) => void;
};

export const PersonSelector = ({ value, onChange }: PersonSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { utils } = useTrpcInvalidations();
  const { data: peopleData } = trpc.cms.person.list.useQuery({ limit: 100 });
  const people = peopleData?.people || [];

  const selectedPeople = people.filter((p) => value.includes(p.id));

  const createPerson = trpc.cms.person.create.useMutation({
    onMutate: async (newPerson) => {
      await utils.cms.person.list.cancel();
      const previousData = utils.cms.person.list.getData({ limit: 100 });

      const optimisticPerson = {
        id: `temp-${Date.now()}`,
        name: newPerson.name,
        slug: newPerson.slug,
        tagline: null,
        jobTitle: null,
        company: null,
        description: null,
        imageUrl: null,
        imageAlt: null,
        linkedinUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      utils.cms.person.list.setData({ limit: 100 }, (old) => ({
        people: [...(old?.people || []), optimisticPerson],
        nextCursor: old?.nextCursor,
      }));

      onChange([...value, optimisticPerson.id]);

      return { previousData, optimisticPerson };
    },
    onSuccess: (data, _, context) => {
      const newValue = value.map((id) =>
        id === context.optimisticPerson.id ? data.id : id
      );
      onChange(newValue);
      toast.success(`Person "${data.name}" created`);
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        utils.cms.person.list.setData({ limit: 100 }, context.previousData);
      }
      onChange(value.filter((id) => id !== context?.optimisticPerson.id));
      toast.error(error.message || "Failed to create person");
    },
    onSettled: async () => {
      await utils.cms.person.list.invalidate();
    },
  });

  const togglePerson = (personId: string) => {
    const newValue = value.includes(personId)
      ? value.filter((id) => id !== personId)
      : [...value, personId];

    onChange(newValue);
  };

  const removePerson = (personId: string) => {
    onChange(value.filter((id) => id !== personId));
  };

  const handleCreate = () => {
    if (!searchValue.trim() || createPerson.isPending) return;
    const slug = slugify(searchValue.trim(), { lower: true, strict: true });
    createPerson.mutate({ name: searchValue.trim(), slug });
    setSearchValue("");
  };

  const showCreateOption =
    searchValue.trim() &&
    !people.some((p) => p.name.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className="space-y-3">
      <Label className="font-medium text-sm">Featured People</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "h-10 w-full justify-between",
              !value.length && "text-muted-foreground"
            )}
            variant="outline"
          >
            {value.length > 0 ? (
              <span className="truncate">{value.length} selected</span>
            ) : (
              "Select people"
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setSearchValue}
              placeholder="Search people..."
              value={searchValue}
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {showCreateOption && (
                  <CommandItem
                    disabled={createPerson.isPending}
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
                {people
                  .filter((person) =>
                    person.name.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((person) => (
                  <CommandItem
                    key={person.id}
                    onSelect={() => togglePerson(person.id)}
                    value={person.name}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(person.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {person.imageUrl ? (
                        <div className="size-5 overflow-hidden rounded-full">
                          <div
                            className="size-full bg-center bg-cover"
                            style={{
                              backgroundImage: `url(${person.imageUrl})`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex size-5 items-center justify-center rounded-full bg-accent">
                          <User className="size-3" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm">{person.name}</span>
                        {(person.jobTitle || person.company) && (
                          <span className="text-muted-foreground text-xs">
                            {[person.jobTitle, person.company]
                              .filter(Boolean)
                              .join(" at ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedPeople.length > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          <AnimatePresence mode="popLayout">
            {selectedPeople.map((person) => (
              <motion.div
                animate="animate"
                exit="exit"
                initial="initial"
                key={person.id}
                layout
                variants={animationVariants.badge}
                whileHover="hover"
              >
                <Badge className="gap-1.5 pr-1" variant="outline">
                  {person.imageUrl ? (
                    <div className="size-3.5 overflow-hidden rounded-full">
                      <div
                        className="size-full bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${person.imageUrl})`,
                        }}
                      />
                    </div>
                  ) : (
                    <User className="size-3.5" />
                  )}
                  <span className="max-w-[150px] truncate">{person.name}</span>
                  <button
                    className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      removePerson(person.id);
                    }}
                    type="button"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="text-muted-foreground text-xs">
        Select people featured in this article (optional)
      </p>
    </div>
  );
};
