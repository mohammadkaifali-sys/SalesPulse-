import Link from "next/link";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30 dark:bg-background">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold">SalesPulse</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
