import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => vi.fn());

vi.mock("@/auth", () => ({
  auth: authMock,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  },
}));

import {
  getCurrentMembership,
  getOrgScopedDb,
  listDatasets,
  listSalesRecords,
} from "@/lib/org-scope";
import { PermissionDeniedError, requirePermission } from "@/lib/permissions";

describe("tenant isolation with Prisma-backed helpers", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("returns only ABC Electronics records for the ABC organization scope", async () => {
    const abcDatasets = await listDatasets("org_abc_1");
    const abcSalesRecords = await listSalesRecords("org_abc_1");

    expect(abcDatasets).toHaveLength(1);
    expect(abcDatasets[0]?.name).toBe("ABC Electronics Sales");
    expect(abcDatasets.every((dataset) => dataset.organizationId === "org_abc_1")).toBe(true);

    expect(abcSalesRecords).toHaveLength(200);
    expect(abcSalesRecords.every((record) => record.organizationId === "org_abc_1")).toBe(true);
    expect(abcSalesRecords.some((record) => record.organizationId === "org_xyz_2")).toBe(false);
  });

  it("returns only XYZ Traders records and cannot cross-read ABC data", async () => {
    const xyzDb = getOrgScopedDb("org_xyz_2");
    const xyzDatasets = await xyzDb.dataset.list();
    const xyzSalesRecords = await xyzDb.salesRecord.list();

    expect(xyzDatasets).toHaveLength(1);
    expect(xyzDatasets[0]?.name).toBe("XYZ Traders Sales");
    expect(xyzSalesRecords).toHaveLength(200);
    expect(xyzSalesRecords.every((record) => record.organizationId === "org_xyz_2")).toBe(true);
    expect(xyzSalesRecords.some((record) => record.organizationId === "org_abc_1")).toBe(false);
  });

  it("rejects a user who is not a member of the requested organization", async () => {
    authMock.mockResolvedValue({
      user: { id: "usr_abc_owner", name: "ABC Electronics Owner", email: "abc.owner@salespulse.demo" },
    });

    await expect(getCurrentMembership("xyz-traders")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("role permissions", () => {
  it("rejects Viewer upload and invite permissions", () => {
    expect(() => requirePermission("VIEWER", "canUploadData")).toThrow(PermissionDeniedError);
    expect(() => requirePermission("VIEWER", "canInviteMembers")).toThrow(PermissionDeniedError);
  });

  it("rejects Member billing and invite permissions", () => {
    expect(() => requirePermission("MEMBER", "canManageBilling")).toThrow(PermissionDeniedError);
    expect(() => requirePermission("MEMBER", "canInviteMembers")).toThrow(PermissionDeniedError);
  });
});
