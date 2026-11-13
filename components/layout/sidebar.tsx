"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Database,
  FileText,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Organization, Role } from "@/lib/types";
import { hasPermission, type Permission } from "@/lib/permissions";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileOpen: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const toggleCollapsed = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobileOpen = React.useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

const NAV_ITEMS: Array<{
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission?: Permission;
}> = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "analytics", icon: LineChart },
  { label: "Data", href: "data", icon: Database },
  { label: "Reports", href: "reports", icon: FileText },
  { label: "Team", href: "team", icon: Users, permission: "canInviteMembers" },
  { label: "Billing", href: "billing", icon: CreditCard, permission: "canManageBilling" },
  { label: "Settings", href: "settings", icon: Settings, permission: "canManageSettings" },
];

interface SidebarProps {
  currentOrg?: Organization;
  role?: Role;
}

export function Sidebar({ currentOrg, role }: SidebarProps = {}) {
  const { isCollapsed, toggleCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();
  const pathname = usePathname();
  const params = useParams();
  const org = currentOrg?.slug || (params?.org as string);
  const orgName = currentOrg?.name || "SalesPulse";

  const renderNavLinks = (collapsed: boolean, onItemClick?: () => void) => {
    return (
      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.filter((item) => !item.permission || (role && hasPermission(role, item.permission))).map((item) => {
          const itemHref = org ? `/${org}/${item.href}` : "/onboarding";
          const isActive =
            pathname === itemHref || pathname?.startsWith(`${itemHref}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={itemHref}
              onClick={onItemClick}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out shrink-0",
          isCollapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Brand / Logo Area */}
        <div
          className={cn(
            "flex h-[56px] items-center border-b border-sidebar-border px-4",
            isCollapsed ? "justify-center px-2" : "justify-between"
          )}
        >
          <Link
            href={org ? `/${org}/dashboard` : "/onboarding"}
            className="flex items-center gap-2 font-semibold tracking-tight min-w-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shrink-0">
              <Activity className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-bold text-foreground truncate">
                {orgName}
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        {renderNavLinks(isCollapsed)}

        {/* Collapse Toggle Footer */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn(
              "w-full flex items-center gap-2 text-muted-foreground hover:text-foreground",
              isCollapsed ? "justify-center px-2" : "justify-start px-3"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-[260px] p-0 flex flex-col bg-sidebar">
          <SheetHeader className="h-[56px] flex flex-row items-center justify-start border-b border-sidebar-border px-4 py-0 space-y-0">
            <Link
              href={org ? `/${org}/dashboard` : "/onboarding"}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <SheetTitle className="text-base font-bold text-foreground truncate">
                {orgName}
              </SheetTitle>
            </Link>
          </SheetHeader>
          {renderNavLinks(false, () => setIsMobileOpen(false))}
        </SheetContent>
      </Sheet>
    </>
  );
}
