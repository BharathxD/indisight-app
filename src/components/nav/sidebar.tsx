"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
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
  FileTextIcon,
  type FileTextIconHandle,
} from "@/components/ui/icons/file-text";
import { HashIcon, type HashIconHandle } from "@/components/ui/icons/hash";
import { HomeIcon, type HomeIconHandle } from "@/components/ui/icons/home";
import {
  SettingsIcon,
  type SettingsIconHandle,
} from "@/components/ui/icons/settings";
import { UsersIcon, type UsersIconHandle } from "@/components/ui/icons/users";
import {
  WorkflowIcon,
  type WorkflowIconHandle,
} from "@/components/ui/icons/workflow";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/lib/config";
import { formatEnumLabel } from "@/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const homeIconRef = useRef<HomeIconHandle>(null);
  const articlesIconRef = useRef<FileTextIconHandle>(null);
  const authorsIconRef = useRef<UsersIconHandle>(null);
  const categoriesIconRef = useRef<WorkflowIconHandle>(null);
  const tagsIconRef = useRef<HashIconHandle>(null);
  const usersIconRef = useRef<UsersIconHandle>(null);
  const settingsIconRef = useRef<SettingsIconHandle>(null);

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 px-2.5">
        <SidebarTrigger />
        <span className="truncate font-semibold text-lg group-data-[collapsible=icon]:hidden">
          {siteConfig.name} <i>CMS</i>
        </span>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarSeparator className="m-0" />

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin"}
                  tooltip="Dashboard"
                >
                  <Link
                    href="/admin"
                    onMouseEnter={() => homeIconRef.current?.startAnimation()}
                    onMouseLeave={() => homeIconRef.current?.stopAnimation()}
                  >
                    <HomeIcon ref={homeIconRef} size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/articles"}
                  tooltip="Articles"
                >
                  <Link
                    href="/admin/articles"
                    onMouseEnter={() =>
                      articlesIconRef.current?.startAnimation()
                    }
                    onMouseLeave={() =>
                      articlesIconRef.current?.stopAnimation()
                    }
                  >
                    <FileTextIcon ref={articlesIconRef} size={18} />
                    <span>Articles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/authors"}
                  tooltip="Authors"
                >
                  <Link
                    href="/admin/authors"
                    onMouseEnter={() =>
                      authorsIconRef.current?.startAnimation()
                    }
                    onMouseLeave={() => authorsIconRef.current?.stopAnimation()}
                  >
                    <UsersIcon ref={authorsIconRef} size={18} />
                    <span>Authors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="m-0" />
        <SidebarGroup>
          <SidebarGroupLabel>Taxonomy</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/categories"}
                  tooltip="Categories"
                >
                  <Link
                    href="/admin/categories"
                    onMouseEnter={() =>
                      categoriesIconRef.current?.startAnimation()
                    }
                    onMouseLeave={() =>
                      categoriesIconRef.current?.stopAnimation()
                    }
                  >
                    <WorkflowIcon ref={categoriesIconRef} size={18} />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/tags"}
                  tooltip="Tags"
                >
                  <Link
                    href="/admin/tags"
                    onMouseEnter={() => tagsIconRef.current?.startAnimation()}
                    onMouseLeave={() => tagsIconRef.current?.stopAnimation()}
                  >
                    <HashIcon ref={tagsIconRef} size={18} />
                    <span>Tags</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-0 mt-0" />
        {session?.user?.role === "SUPER_ADMIN" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/admin/users"}
                      tooltip="Users"
                    >
                      <Link
                        href="/admin/users"
                        onMouseEnter={() =>
                          usersIconRef.current?.startAnimation()
                        }
                        onMouseLeave={() =>
                          usersIconRef.current?.stopAnimation()
                        }
                      >
                        <UsersIcon ref={usersIconRef} size={18} />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/admin/profile"}
                      tooltip="Settings"
                    >
                      <Link
                        href="/admin/profile"
                        onMouseEnter={() =>
                          settingsIconRef.current?.startAnimation()
                        }
                        onMouseLeave={() =>
                          settingsIconRef.current?.stopAnimation()
                        }
                      >
                        <SettingsIcon ref={settingsIconRef} size={18} />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator className="m-0" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t px-0">
        <div className="px-2">
          <ThemeToggle />
        </div>
        <SidebarSeparator className="m-0" />
        <div className="px-2 group-data-[collapsible=icon]:px-1">
          <Profile />
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
};

const Profile = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3 overflow-hidden rounded-md p-2">
        <div className="size-8 shrink-0 animate-pulse rounded-full bg-sidebar-accent" />
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
          className="mx-auto flex w-full items-center gap-3 overflow-hidden rounded-md p-2 hover:bg-sidebar-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:p-1"
          type="button"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="font-medium text-sm group-data-[collapsible=icon]:text-xs">
              {initials}
            </span>
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
