"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Search, Menu, User, Settings, LogOut, CreditCard } from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { OrgSwitcher } from "@/components/layout/org-switcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Organization, Role } from "@/lib/types";
import { hasPermission } from "@/lib/permissions";

interface HeaderProps {
  currentOrg: Organization;
  organizations: Organization[];
  role: Role;
}

export function Header({ currentOrg, organizations, role }: HeaderProps) {
  const router = useRouter();
  const { toggleMobileOpen } = useSidebar();
  const { data: session } = useSession();
  const displayName = session?.user?.name || "Account";
  const displayEmail = session?.user?.email || "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  return (
    <header className="sticky top-0 z-30 flex h-[56px] w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Left side: Mobile trigger + OrgSwitcher */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileOpen}
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Real Dynamic Workspace Switcher */}
        <OrgSwitcher currentOrg={currentOrg} organizations={organizations} />
      </div>

      {/* Middle: Search input (UI only) */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search analytics, metrics, reports..."
            className="h-8 pl-9 bg-muted/40 focus:bg-background w-full text-sm"
          />
        </div>
      </div>

      {/* Right side: Actions (Theme Toggle + User Avatar Dropdown) */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 p-0"
                aria-label="User account menu"
              >
                <Avatar size="sm" className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {initials || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {displayEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              {hasPermission(role, "canManageBilling") && (
                <DropdownMenuItem onClick={() => router.push(`/${currentOrg.slug}/billing`)}>
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Billing</span>
                </DropdownMenuItem>
              )}
              {hasPermission(role, "canManageSettings") && (
                <DropdownMenuItem onClick={() => router.push(`/${currentOrg.slug}/settings`)}>
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
