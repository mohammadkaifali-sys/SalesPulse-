import * as React from "react";
import { type LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction | React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 min-h-[220px] w-full rounded-xl border border-dashed border-border bg-card/40",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {React.isValidElement(Icon) ? (
          Icon
        ) : typeof Icon === "function" ? (
          <Icon className="h-6 w-6" />
        ) : (
          <Inbox className="h-6 w-6" />
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {React.isValidElement(action) ? (
            action
          ) : typeof action === "object" && "label" in action ? (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              size="sm"
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
