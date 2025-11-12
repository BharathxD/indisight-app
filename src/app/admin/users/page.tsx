"use client";

import type { UserRole } from "@prisma/client";
import { Info, Plus, Users } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { UserDialog } from "@/components/admin/users/user-dialog";
import { UsersError } from "@/components/admin/users/users-error";
import { UsersLoading } from "@/components/admin/users/users-loading";
import { UsersTable } from "@/components/admin/users/users-table";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

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

const UsersPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.user.list.useQuery({
    limit: 50,
    search: search || undefined,
  });

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  };

  return (
    <DashboardContainer
      description="Manage system users and permissions"
      icon={Users}
      title="Users"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-blue-900 text-sm dark:text-blue-100">
            Only Super Admins have access to this CMS.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All Users</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${data.users.length} user${data.users.length !== 1 ? "s" : ""}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            Create User
          </Button>
        </div>

        {isLoading && <UsersLoading />}

        {error && (
          <UsersError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <UsersTable onEdit={handleEdit} pageCount={1} users={data.users} />
        )}

        <UserDialog
          onOpenChange={handleDialogClose}
          open={dialogOpen}
          user={selectedUser}
        />
      </div>
    </DashboardContainer>
  );
};

export default UsersPage;
