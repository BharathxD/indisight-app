"use client";

import { Mail, Shield, User } from "lucide-react";
import { useSession } from "@/auth/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEnumLabel } from "@/lib/utils";

export const ProfileInfo = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-[38px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-[38px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-[38px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium text-sm">
            <User className="size-4 text-muted-foreground" />
            <span>Name</span>
          </div>
          <div className="cursor-not-allowed rounded-md border bg-muted px-3 py-2 text-muted-foreground text-sm">
            {session.user.name}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span>Email</span>
          </div>
          <div className="cursor-not-allowed rounded-md border bg-muted px-3 py-2 text-muted-foreground text-sm">
            {session.user.email}
          </div>
        </div>
        {session.user.role && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Shield className="size-4 text-muted-foreground" />
              <span>Role</span>
            </div>
            <div className="cursor-not-allowed rounded-md border bg-muted px-3 py-2 text-muted-foreground text-sm">
              {formatEnumLabel(session.user.role)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
