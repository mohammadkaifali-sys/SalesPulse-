"use client";

import * as React from "react";
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  PageHeader,
  KpiCard,
  ChartCard,
  ErrorState,
} from "@/components/common";

export default function DashboardPage() {
  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Dashboard"
        description="Key performance indicators and sales analytics overview."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Last 30 Days</span>
            </Button>
            <Button size="sm" className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        }
      />

      {/* 2. 4 KpiCards with dummy data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value="$128,430"
          change={12.5}
          changeLabel="vs last month"
          icon={DollarSign}
        />
        <KpiCard
          title="Active Customers"
          value="2,420"
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
        />
        <KpiCard
          title="Average Order Value"
          value="$342"
          change={-2.4}
          changeLabel="vs last month"
          icon={CreditCard}
        />
        <KpiCard
          title="Conversion Rate"
          value="3.48%"
          change={1.1}
          changeLabel="vs last month"
          icon={Activity}
        />
      </div>

      {/* 3. One ChartCard showing an EmptyState & One Card showing an ErrorState */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ChartCard with EmptyState */}
        <ChartCard
          title="Revenue Over Time"
          description="Monthly recurring revenue and expansion breakdown"
          isEmpty={true}
          emptyTitle="No revenue data available"
          emptyDescription="Connect your billing data source or adjust the date range to view revenue analytics."
          emptyAction={{
            label: "Connect Data Source",
            onClick: () => {},
          }}
          timeFilter={
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 text-xs bg-muted/40">
              <span className="px-2 py-0.5 rounded font-medium bg-background text-foreground shadow-xs">
                30D
              </span>
              <span className="px-2 py-0.5 text-muted-foreground hover:text-foreground cursor-pointer">
                90D
              </span>
              <span className="px-2 py-0.5 text-muted-foreground hover:text-foreground cursor-pointer">
                12M
              </span>
            </div>
          }
        />

        {/* Card showing an ErrorState */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Conversion Pipeline
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Funnel progression from lead to closed customer
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-4">
            <ErrorState
              title="Failed to load conversion metrics"
              message={`Unable to retrieve conversion pipeline data from the reporting service. Please check your network connection and retry.${
                retryCount > 0 ? ` (Retried ${retryCount} time${retryCount > 1 ? "s" : ""})` : ""
              }`}
              onRetry={handleRetry}
              className="border-none bg-transparent"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
