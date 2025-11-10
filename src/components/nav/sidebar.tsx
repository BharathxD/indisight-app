"use client";

import { FileText, LayoutDashboard, LogOut, User, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/lib/config";
import { formatEnumLabel } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    title: "Authors",
    href: "/admin/authors",
    icon: Users,
  },
];

export const Sidebar = () => (
  <SidebarPrimitive collapsible="icon">
    <SidebarHeader className="flex flex-row items-center gap-2 px-2.5">
      <SidebarTrigger />
      <span className="truncate font-semibold text-lg group-data-[collapsible=icon]:hidden">
        {siteConfig.name} Dashboard
      </span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <Profile />
    </SidebarFooter>
  </SidebarPrimitive>
);

const Profile = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3 rounded-md p-2">
        <div className="size-8 animate-pulse rounded-full bg-sidebar-accent" />
        <div className="flex flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
          <div className="h-3.5 w-20 animate-pulse rounded bg-sidebar-accent" />
          <div className="h-3 w-32 animate-pulse rounded bg-sidebar-accent" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          type="button"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="font-medium text-sm">{initials}</span>
          </div>
          <div className="flex min-w-0 flex-col items-start group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium text-sm">
              {session.user.name}
            </span>
            <span className="truncate text-sidebar-foreground/70 text-xs">
              {session.user.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-60" side="top">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">{session.user.name}</span>
            <span className="text-muted-foreground text-xs">
              {session.user.email}
            </span>
            {session.user.role && (
              <span className="truncate text-sidebar-foreground/70 text-xs">
                {formatEnumLabel(session.user.role)}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profile">
            <User className="size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
