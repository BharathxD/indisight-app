"use client";

import { ArticleStatus } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/articles/status-badge";
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
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  isTrending: boolean;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  articleAuthors: Array<{
    authorOrder: number;
    author: {
      id: string;
      name: string;
      profileImageUrl: string | null;
    };
  }>;
  articleCategories: Array<{
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
    };
  }>;
};

type ArticlesTableProps = {
  articles: Article[];
  pageCount: number;
};

export const ArticlesTable = ({ articles, pageCount }: ArticlesTableProps) => {
  const router = useRouter();
  const { invalidateArticleGraph } = useTrpcInvalidations();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deleteArticle = trpc.cms.article.delete.useMutation({
    onSuccess: async () => {
      toast.success("Article deleted successfully");
      await invalidateArticleGraph();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete article");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (article: Article) => {
    if (article.status === ArticleStatus.PUBLISHED) {
      toast.error("Cannot delete published articles. Archive it first.");
      return;
    }

    toast(`Delete "${article.title}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(article.id);
          deleteArticle.mutate({ id: article.id });
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

  const columns: ColumnDef<Article>[] = [
    {
      id: "thumbnail",
      header: "",
      cell: ({ row }) => (
        <div className="size-12 overflow-hidden rounded bg-accent">
          {row.original.thumbnailUrl ? (
            <div
              className="size-full bg-center bg-cover"
              style={{ backgroundImage: `url(${row.original.thumbnailUrl})` }}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <FileText className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
      size: 60,
      enableSorting: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Title" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-2">
            <span className="line-clamp-1 font-medium">
              {row.original.title}
            </span>
            {row.original.isFeatured && (
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            )}
            {row.original.isTrending && (
              <TrendingUp className="size-3.5 text-blue-500" />
            )}
          </div>
          {row.original.excerpt && (
            <span className="line-clamp-1 text-muted-foreground text-xs">
              {row.original.excerpt}
            </span>
          )}
        </div>
      ),
      minSize: 300,
    },
    {
      id: "authors",
      header: "Authors",
      cell: ({ row }) => {
        const authors = row.original.articleAuthors
          .sort((a, b) => a.authorOrder - b.authorOrder)
          .map((aa) => aa.author.name);

        return (
          <span className="line-clamp-1 text-sm">
            {authors.join(", ") || "—"}
          </span>
        );
      },
      size: 150,
      enableSorting: false,
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => {
        const primary = row.original.articleCategories.find(
          (ac) => ac.isPrimary
        );

        return primary ? (
          <Badge className="text-xs" variant="outline">
            {primary.category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      size: 100,
    },
    {
      id: "published",
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Published" />
      ),
      cell: ({ row }) => {
        const date = row.original.publishedAt;

        return date ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="size-3.5" />
            {new Date(date).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
      size: 120,
    },
    {
      id: "views",
      accessorKey: "viewCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Views" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Eye className="size-3.5" />
          {row.original.viewCount.toLocaleString()}
        </div>
      ),
      size: 100,
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
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/articles/${row.original.id}/edit`)
                }
              >
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
    data: articles,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
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
            <FileText className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <input
              className="h-8 w-full rounded-md border border-input bg-transparent pr-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
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
