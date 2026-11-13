import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  inCard?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this data. Please try again.",
  onRetry,
  retryLabel = "Retry",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 min-h-[220px] w-full rounded-xl border border-destructive/20 bg-destructive/5 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5 border-border hover:bg-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  );
}
