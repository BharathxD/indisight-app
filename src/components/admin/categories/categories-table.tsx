"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Folder,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  XCircle,
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

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  icon: string | null;
  isActive: boolean;
  displayOrder: number;
  articleCount: number;
  parentId: string | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: { id: string; name: string; slug: string } | null;
  children?: { id: string; name: string; slug: string }[];
};

type CategoriesTableProps = {
  categories: Category[];
  pageCount: number;
  onEdit: (category: Category) => void;
};

export const CategoriesTable = ({
  categories,
  pageCount,
  onEdit,
}: CategoriesTableProps) => {
  const utils = trpc.useUtils();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deleteCategory = trpc.cms.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Category deleted successfully");
      utils.cms.category.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (category: Category) => {
    if (category.articleCount > 0) {
      toast.error(
        `Cannot delete category with ${category.articleCount} articles`
      );
      return;
    }

    if (category.children && category.children.length > 0) {
      toast.error(
        `Cannot delete category with ${category.children.length} child categories`
      );
      return;
    }

    toast(`Delete "${category.name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(category.id);
          deleteCategory.mutate({ id: category.id });
        },
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput || null);
  };

  const columns: ColumnDef<Category>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent">
            {row.original.icon ? (
              <span className="text-sm">{row.original.icon}</span>
            ) : (
              <Folder className="size-4 text-muted-foreground" />
            )}
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
      id: "parent",
      accessorKey: "parent",
      header: "Parent",
      cell: ({ row }) =>
        row.original.parent ? (
          <Badge className="gap-1 text-xs" variant="outline">
            <Folder className="size-3" />
            {row.original.parent.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
      enableSorting: false,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="line-clamp-1 text-muted-foreground text-sm">
          {row.original.description || "—"}
        </span>
      ),
      enableSorting: false,
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
      id: "isActive",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge className="gap-1 text-xs" variant="default">
            <CheckCircle2 className="size-3" />
            Active
          </Badge>
        ) : (
          <Badge className="gap-1 text-xs" variant="outline">
            <XCircle className="size-3" />
            Inactive
          </Badge>
        ),
    },
    {
      id: "displayOrder",
      accessorKey: "displayOrder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Order" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.displayOrder}</span>
      ),
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
    data: categories,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "displayOrder", desc: false }],
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
              placeholder="Search categories..."
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
