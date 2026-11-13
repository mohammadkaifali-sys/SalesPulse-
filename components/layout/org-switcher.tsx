"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { Organization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrgSwitcherProps {
  currentOrg: Organization;
  organizations: Organization[];
  collapsed?: boolean;
}

export function OrgSwitcher({
  currentOrg,
  organizations = [],
  collapsed = false,
}: OrgSwitcherProps) {
  const router = useRouter();

  const handleSelectOrg = (slug: string) => {
    if (slug !== currentOrg.slug) {
      router.push(`/${slug}/dashboard`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-2 h-9 text-left font-normal hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-popup-open:bg-sidebar-accent"
            aria-label="Select workspace"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold leading-none truncate text-foreground">
                    {currentOrg.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate">
                    /{currentOrg.slug}
                  </span>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56 p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-medium">
          Workspaces
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {organizations.map((org) => {
            const isSelected = org.slug === currentOrg.slug;
            return (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSelectOrg(org.slug)}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5 px-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-muted text-muted-foreground shrink-0">
                    <Building2 className="h-3 w-3" />
                  </div>
                  <span className="font-medium truncate">{org.name}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/onboarding")}
          className="flex items-center gap-2 text-xs text-primary font-medium cursor-pointer py-1.5 px-2"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
