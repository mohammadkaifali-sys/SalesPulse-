import { getCurrentMembership } from "@/lib/org-scope";
import { PermissionDeniedError, requirePermission } from "@/lib/permissions";
import { ForbiddenState } from "@/components/authorization/forbidden-state";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const { role } = await getCurrentMembership(org);

  try {
    requirePermission(role, "canManageSettings");
  } catch (error) {
    if (error instanceof PermissionDeniedError) {
      return <ForbiddenState orgSlug={org} />;
    }
    throw error;
  }

  return <div>Workspace settings will be available soon.</div>;
}
