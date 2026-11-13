import { getCurrentMembership } from "@/lib/org-scope";
import { PermissionDeniedError, requirePermission } from "@/lib/permissions";
import { ForbiddenState } from "@/components/authorization/forbidden-state";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const { role } = await getCurrentMembership(org);

  try {
    requirePermission(role, "canManageBilling");
  } catch (error) {
    if (error instanceof PermissionDeniedError) {
      return <ForbiddenState orgSlug={org} />;
    }
    throw error;
  }

  return <div>Billing management will be available soon.</div>;
}
