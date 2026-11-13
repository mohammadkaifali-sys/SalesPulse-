import * as React from "react";
import { type LucideIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, type EmptyStateAction } from "@/components/common/empty-state";

export interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  filter?: React.ReactNode;
  timeFilter?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon | React.ReactNode;
  emptyAction?: EmptyStateAction | React.ReactNode;
}

export function ChartCard({
  title,
  description,
  filter,
  timeFilter,
  children,
  isLoading = false,
  isEmpty = false,
  emptyTitle = "No data available",
  emptyDescription = "There is no chart data to display for the selected period.",
  emptyIcon = BarChart3,
  emptyAction,
  className,
  ...props
}: ChartCardProps) {
  const filterSlot = filter ?? timeFilter;

  return (
    <Card className={cn("overflow-hidden flex flex-col", className)} {...props}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-semibold text-foreground">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {filterSlot && (
          <div className="flex items-center gap-1.5 shrink-0">
            {filterSlot}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-[280px]">
        {isLoading ? (
          <div className="flex h-[260px] w-full flex-col justify-end gap-3 p-2">
            <div className="flex h-full w-full items-end gap-3 px-2">
              <Skeleton className="h-[35%] flex-1 rounded-sm" />
              <Skeleton className="h-[65%] flex-1 rounded-sm" />
              <Skeleton className="h-[45%] flex-1 rounded-sm" />
              <Skeleton className="h-[85%] flex-1 rounded-sm" />
              <Skeleton className="h-[55%] flex-1 rounded-sm" />
              <Skeleton className="h-[95%] flex-1 rounded-sm" />
              <Skeleton className="h-[70%] flex-1 rounded-sm" />
            </div>
            <Skeleton className="h-3 w-full rounded-sm" />
          </div>
        ) : isEmpty ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className="border-none bg-transparent min-h-[240px] p-4"
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
