"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Mail,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  User,
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

type Author = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  socialLinks: unknown;
  isFeatured: boolean;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type AuthorsTableProps = {
  authors: Author[];
  pageCount: number;
  onEdit: (author: Author) => void;
};

export const AuthorsTable = ({
  authors,
  pageCount,
  onEdit,
}: AuthorsTableProps) => {
  const utils = trpc.useUtils();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deleteAuthor = trpc.cms.author.delete.useMutation({
    onSuccess: () => {
      toast.success("Author deleted successfully");
      utils.cms.author.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete author");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (author: Author) => {
    if (author.articleCount > 0) {
      toast.error(`Cannot delete author with ${author.articleCount} articles`);
      return;
    }

    toast(`Delete "${author.name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(author.id);
          deleteAuthor.mutate({ id: author.id });
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

  const columns: ColumnDef<Author>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.profileImageUrl ? (
            <div className="relative size-8 overflow-hidden rounded-full">
              <div
                className="size-full bg-center bg-cover"
                style={{
                  backgroundImage: `url(${row.original.profileImageUrl})`,
                }}
              />
            </div>
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-accent">
              <User className="size-4 text-muted-foreground" />
            </div>
          )}
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
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          {row.original.email ? (
            <>
              <Mail className="size-3.5" />
              {row.original.email}
            </>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      id: "articleCount",
      accessorKey: "articleCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Articles" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.articleCount}</span>
      ),
    },
    {
      id: "isFeatured",
      accessorKey: "isFeatured",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Featured" />
      ),
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Badge className="gap-1 text-xs" variant="default">
            <CheckCircle2 className="size-3" />
            Featured
          </Badge>
        ) : null,
    },
    {
      id: "socialLinks",
      accessorKey: "socialLinks",
      header: "Social",
      cell: ({ row }) => {
        const links = row.original.socialLinks as Record<string, string> | null;
        if (!links)
          return <span className="text-muted-foreground text-sm">—</span>;

        const count = Object.keys(links).filter((key) => links[key]).length;
        return count > 0 ? (
          <span className="text-sm">
            {count} link{count !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
      enableSorting: false,
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
    data: authors,
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
              placeholder="Search by name or email..."
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
