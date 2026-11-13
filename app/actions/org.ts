"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name cannot exceed 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. acme-corp)"
    ),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export async function createOrganizationAction(input: CreateWorkspaceInput) {
  // 1. Validate input strictly with Zod on the server
  const parseResult = createWorkspaceSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid input parameters",
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to create a workspace.",
    };
  }

  const targetUserId = session.user.id;
  const { name, slug } = parseResult.data;
  const normalizedSlug = slug.toLowerCase().trim();

  try {
    // 3. Create Organization and Membership in a single atomic transaction
    const newOrganization = await db.$transaction(async (tx) => {
      const existingOrg = await tx.organization.findUnique({
        where: { slug: normalizedSlug },
      });
      if (existingOrg) {
        throw new Error("ORGANIZATION_SLUG_TAKEN");
      }

      const org = await tx.organization.create({
        data: {
          name: name.trim(),
          slug: normalizedSlug,
        },
      });

      await tx.membership.create({
        data: {
          userId: targetUserId,
          organizationId: org.id,
          role: "OWNER",
        },
      });

      return org;
    });

    return {
      success: true,
      slug: newOrganization.slug,
      orgId: newOrganization.id,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "ORGANIZATION_SLUG_TAKEN") {
      return {
        success: false,
        error: `A workspace with the URL slug "${normalizedSlug}" already exists. Please choose another slug.`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while creating your workspace. Please try again.",
    };
  }
}
