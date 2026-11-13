import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "./db";
import { Dataset, SalesRecord, Organization, Membership } from "./types";
import type { User, Role } from "./types";
import type { Prisma } from "@/generated/prisma/client";

export interface CurrentMembership {
  user: User;
  organization: Organization;
  membership: Membership;
  role: Role;
}

type PrismaSalesRecord = Prisma.SalesRecordGetPayload<{
  select: {
    id: true;
    organizationId: true;
    datasetId: true;
    date: true;
    customerName: true;
    productCategory: true;
    productName: true;
    quantity: true;
    unitPrice: true;
    totalAmount: true;
    status: true;
    createdAt: true;
  };
}>;

function toSalesRecord(record: PrismaSalesRecord): SalesRecord {
  return {
    ...record,
    unitPrice: record.unitPrice.toNumber(),
    totalAmount: record.totalAmount.toNumber(),
  };
}

/**
 * Resolves the authenticated user and verifies membership in the requested org.
 * This is the server-side authorization boundary for organization routes.
 */
export async function getCurrentMembership(orgSlug: string): Promise<CurrentMembership> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const normalizedSlug = orgSlug.trim().toLowerCase();
  if (!normalizedSlug) {
    notFound();
  }

  const organization = await db.organization.findUnique({
    where: { slug: normalizedSlug },
  });
  if (!organization) {
    notFound();
  }

  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      organizationId: organization.id,
    },
  });
  if (!membership) {
    notFound();
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login");
  }

  return {
    user,
    organization,
    membership,
    role: membership.role,
  };
}

/**
 * Creates an organization-scoped database accessor where every query
 * is strictly filtered and bound to the specified organizationId.
 *
 * Rule: No tenant query can run without an organizationId filter.
 */
export function getOrgScopedDb(organizationId: string) {
  if (!organizationId || typeof organizationId !== "string" || organizationId.trim() === "") {
    throw new Error("Security Violation: organizationId is strictly required for all tenant queries.");
  }

  const scopedOrgId = organizationId.trim();

  return {
    organizationId: scopedOrgId,

    /**
     * Get details for the current scoped organization
     */
    async getOrganization(): Promise<Organization | null> {
      return db.organization.findUnique({
        where: { id: scopedOrgId },
      });
    },

    /**
     * Scoped Dataset operations
     */
    dataset: {
      async list(): Promise<Dataset[]> {
        return db.dataset.findMany({
          where: { organizationId: scopedOrgId },
        });
      },

      async create(data: { name: string; description?: string; createdById: string }): Promise<Dataset> {
        return db.dataset.create({
          data: {
            ...data,
            organizationId: scopedOrgId,
          },
        });
      },
    },

    /**
     * Scoped SalesRecord operations
     */
    salesRecord: {
      async list(options?: {
        dateRange?: { start?: Date; end?: Date };
        limit?: number;
        offset?: number;
      }): Promise<SalesRecord[]> {
        const records = await db.salesRecord.findMany({
          where: {
            organizationId: scopedOrgId,
            date: {
              gte: options?.dateRange?.start,
              lte: options?.dateRange?.end,
            },
          },
          take: options?.limit,
          skip: options?.offset,
        });
        return records.map(toSalesRecord);
      },

      async create(data: {
        date: Date;
        customerName: string;
        productCategory: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        status?: string;
        datasetId?: string;
      }): Promise<SalesRecord> {
        const record = await db.salesRecord.create({
          data: {
            ...data,
            status: data.status || "COMPLETED",
            organizationId: scopedOrgId,
          },
        });
        return toSalesRecord(record);
      },
    },

    /**
     * Scoped Membership operations
     */
    membership: {
      async listMembers(): Promise<Membership[]> {
        return db.membership.findMany({
          where: { organizationId: scopedOrgId },
        });
      },
    },
  };
}

/**
 * Standalone tenant query helper: List all datasets for a specific organization
 */
export async function listDatasets(organizationId: string): Promise<Dataset[]> {
  const scopedDb = getOrgScopedDb(organizationId);
  return scopedDb.dataset.list();
}

/**
 * Standalone tenant query helper: List sales records for an organization
 */
export async function listSalesRecords(
  organizationId: string,
  options?: { limit?: number; offset?: number }
): Promise<SalesRecord[]> {
  const scopedDb = getOrgScopedDb(organizationId);
  return scopedDb.salesRecord.list(options);
}

/**
 * Fetch all organizations a user belongs to
 */
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  if (!userId) return [];
  const memberships: Membership[] = await db.membership.findMany({
    where: { userId },
  });
  const orgIds = memberships.map((m: Membership) => m.organizationId);
  if (orgIds.length === 0) return [];
  return db.organization.findMany({
    where: {
      id: { in: orgIds },
    },
  });
}
