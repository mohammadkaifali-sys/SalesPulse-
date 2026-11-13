import * as React from "react";
import { SidebarProvider, Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getUserOrganizations } from "@/lib/org-scope";
import { getCurrentMembership } from "@/lib/org-scope";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}) {
  const { org: orgSlug } = await params;
  const { user, organization: currentOrg, role } =
    await getCurrentMembership(orgSlug);
  const organizations = await getUserOrganizations(user.id);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar currentOrg={currentOrg} role={role} />
        <div className="flex flex-1 flex-col min-w-0">
          <Header currentOrg={currentOrg} organizations={organizations} role={role} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1280px] p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
