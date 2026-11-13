import * as React from "react";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number | {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  changeLabel?: string;
  icon?: LucideIcon | React.ReactNode;
  isLoading?: boolean;
}

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon: Icon,
  isLoading = false,
  className,
  ...props
}: KpiCardProps) {
  if (isLoading) {
    return <KpiCardSkeleton className={className} />;
  }

  // Parse change value and direction
  let isPositive: boolean | null = null;
  let formattedChange: string = "";
  let labelText = changeLabel;

  if (typeof change === "number") {
    isPositive = change > 0;
    formattedChange = `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  } else if (change && typeof change === "object") {
    if (typeof change.value === "number") {
      isPositive = change.isPositive ?? change.value > 0;
      formattedChange = `${change.value > 0 ? "+" : ""}${change.value.toFixed(1)}%`;
    } else {
      formattedChange = String(change.value);
      isPositive = change.isPositive ?? !formattedChange.startsWith("-");
    }
    if (change.label) {
      labelText = change.label;
    }
  }

  return (
    <Card
      className={cn("overflow-hidden transition-shadow hover:shadow-xs", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate">
          {title}
        </CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            {React.isValidElement(Icon) ? (
              Icon
            ) : typeof Icon === "function" ? (
              <Icon className="h-4 w-4" />
            ) : null}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold",
                isPositive === true
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isPositive === false
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              )}
            >
              {isPositive === true ? (
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              ) : isPositive === false ? (
                <TrendingDown className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Minus className="h-3.5 w-3.5 shrink-0" />
              )}
              {formattedChange}
            </span>
            {labelText && (
              <span className="text-muted-foreground truncate">
                {labelText}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

KpiCard.Skeleton = KpiCardSkeleton;
