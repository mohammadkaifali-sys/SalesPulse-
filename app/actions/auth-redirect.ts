"use server";

import { getUserOrganizations } from "@/lib/org-scope";
import { auth } from "@/auth";

/**
 * Determines where to redirect a user after successful authentication:
 * - If user has no organization -> /onboarding
 * - If user has at least one organization -> /[org-slug]/dashboard
 */
export async function getPostAuthRedirect(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    return "/login";
  }

  const orgs = await getUserOrganizations(session.user.id);

  if (!orgs || orgs.length === 0) {
    return "/onboarding";
  }

  return `/${orgs[0].slug}/dashboard`;
}
