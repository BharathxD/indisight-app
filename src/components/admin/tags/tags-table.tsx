"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Hash,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/trpc/client";

type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isTrending: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type TagsTableProps = {
  tags: Tag[];
  pageCount: number;
  onEdit: (tag: Tag) => void;
};

export const TagsTable = ({ tags, pageCount, onEdit }: TagsTableProps) => {
  const utils = trpc.useUtils();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deleteTag = trpc.cms.tag.delete.useMutation({
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      utils.cms.tag.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete tag");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (tag: Tag) => {
    if (tag.usageCount > 0) {
      toast.error(`Cannot delete tag with ${tag.usageCount} articles`);
      return;
    }

    toast(`Delete "${tag.name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(tag.id);
          deleteTag.mutate({ id: tag.id });
        },
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput || null);
  };

  const columns: ColumnDef<Tag>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent">
            <Hash className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.description || "—"}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "usageCount",
      accessorKey: "usageCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Usage" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.usageCount}</span>
      ),
    },
    {
      id: "isTrending",
      accessorKey: "isTrending",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Trending" />
      ),
      cell: ({ row }) =>
        row.original.isTrending ? (
          <Badge className="gap-1 text-xs" variant="default">
            <TrendingUp className="size-3" />
            Trending
          </Badge>
        ) : null,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isDeleting = deletingId === row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isDeleting} size="icon-sm" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isDeleting}
                onClick={() => handleDelete(row.original)}
              >
                <Trash2 />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const { table } = useDataTable({
    data: tags,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "usageCount", desc: true }],
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
              placeholder="Search tags..."
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
