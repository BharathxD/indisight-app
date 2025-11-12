"use client";

import { UserRole } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Mail,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/auth/client";
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
import { formatEnumLabel } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  _count: {
    sessions: number;
    authors: number;
  };
};

type UsersTableProps = {
  users: UserType[];
  pageCount: number;
  onEdit: (user: UserType) => void;
};

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "destructive";
    case UserRole.EDITOR:
      return "default";
    case UserRole.VIEWER:
      return "secondary";
    default:
      return "secondary";
  }
};

export const UsersTable = ({ users, pageCount, onEdit }: UsersTableProps) => {
  const { invalidateUserGraph } = useTrpcInvalidations();
  const { data: session } = useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [searchInput, setSearchInput] = useState(search);

  const deleteUser = trpc.cms.user.delete.useMutation({
    onSuccess: async () => {
      toast.success("User deleted successfully");
      await invalidateUserGraph();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (user: UserType) => {
    if (user._count.authors > 0) {
      toast.error(
        `Cannot delete user with ${user._count.authors} associated author(s)`
      );
      return;
    }

    toast(`Delete "${user.name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingId(user.id);
          deleteUser.mutate({ id: user.id });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          return;
        },
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput || null);
  };

  const columns: ColumnDef<UserType>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => {
        const initials = row.original.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-accent">
              <span className="font-medium text-xs">{initials}</span>
            </div>
            <span className="font-medium">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Mail className="size-3.5" />
          {row.original.email}
        </div>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ row }) => (
        <Badge variant={getRoleBadgeVariant(row.original.role)}>
          {formatEnumLabel(row.original.role)}
        </Badge>
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
          <Badge className="gap-1 text-xs" variant="outline">
            <CheckCircle2 className="size-3 text-emerald-500" />
            Active
          </Badge>
        ) : (
          <Badge className="gap-1 text-xs" variant="outline">
            <XCircle className="size-3 text-red-500" />
            Inactive
          </Badge>
        ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isDeleting = deletingId === row.original.id;
        const isSelf = session?.user?.id === row.original.id;

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
              {!isSelf && (
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => handleDelete(row.original)}
                >
                  <Trash2 />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              )}
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
    data: users,
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
