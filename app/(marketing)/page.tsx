import Link from "next/link";
import { Activity, ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-lg">SalesPulse</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({ size: "sm" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Multi-Tenant SaaS Analytics</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              SalesPulse
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Unified SaaS analytics and revenue intelligence for high-growth teams.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className={buttonVariants({
                  size: "lg",
                  className: "gap-2 px-6",
                })}
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "px-6",
                })}
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Feature Cards */}
        <section className="border-t border-border/40 bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Engineered for data-driven decisions
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Everything you need to monitor, analyze, and accelerate your recurring revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-xs">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Real-Time Revenue Metrics</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-1">
                    Track MRR, ARR, churn, and contraction across billing cycles with automated data synchronizations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Continuous monitoring & instant alerts
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-xs">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Multi-Tenant Isolation</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-1">
                    Robust workspace partitioning ensuring each organization&apos;s records and telemetry remain strictly confidential.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Enterprise-grade isolation by design
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-xs">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Actionable Cohort Insights</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-1">
                    Uncover retention drivers and customer lifetime value patterns with customizable KPI breakdowns.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Deep funnel intelligence & retention
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="h-3 w-3" />
            </div>
            <span className="text-sm">SalesPulse</span>
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SalesPulse, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
            <Link href="/abc-electronics/dashboard" className="hover:text-foreground transition-colors">
              Live Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
