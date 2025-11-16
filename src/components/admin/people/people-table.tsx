"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Search, Trash2, User } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/trpc/client";
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

type Person = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  jobTitle: string | null;
  company: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PeopleTableProps = {
  people: Person[];
  pageCount: number;
  onEdit: (person: Person) => void;
};

export const PeopleTable = ({
  people,
  pageCount,
  onEdit,
}: PeopleTableProps) => {
  const { invalidateArticleGraph } = useTrpcInvalidations();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deletePerson = trpc.cms.person.delete.useMutation({
    onSuccess: async () => {
      toast.success("Person deleted successfully");
      await invalidateArticleGraph();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete person");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (person: Person) => {
    toast(`Delete "${person.name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(person.id);
          deletePerson.mutate({ id: person.id });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          // do nothing
        },
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput || null);
  };

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => {
        const person = row.original;
        return (
          <div className="flex items-center gap-3">
            {person.imageUrl ? (
              <div className="size-8 overflow-hidden rounded-full">
                <div
                  className="size-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${person.imageUrl})` }}
                />
              </div>
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-accent">
                <User className="size-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{person.name}</span>
              {person.tagline && (
                <span className="text-muted-foreground text-xs">
                  {person.tagline}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "jobTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Job Title" />
      ),
      cell: ({ row }) => {
        const jobTitle = row.getValue("jobTitle") as string | null;
        return jobTitle ? (
          <span className="text-sm">{jobTitle}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Company" />
      ),
      cell: ({ row }) => {
        const company = row.getValue("company") as string | null;
        return company ? (
          <span className="text-sm">{company}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Slug" />
      ),
      cell: ({ row }) => (
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.getValue("slug")}
        </code>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const person = row.original;
        const isDeleting = deletingId === person.id;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isDeleting} size="icon" variant="ghost">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(person)}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={isDeleting}
                  onClick={() => handleDelete(person)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const { table } = useDataTable({
    data: people,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <DataTable table={table}>
      <div className="flex items-center justify-between gap-2 p-1">
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={handleSearchSubmit}
        >
          <div className="relative max-w-sm flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <input
              className="h-8 w-full rounded-md border border-input bg-transparent pr-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name..."
              type="text"
              value={searchInput}
            />
          </div>
          {search && (
            <Button
              className="h-8"
              onClick={() => {
                setSearchInput("");
                setSearch(null);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              Clear
            </Button>
          )}
        </form>
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  );
};
