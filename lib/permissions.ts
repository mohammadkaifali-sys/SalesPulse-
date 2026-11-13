import type { Role } from "@/lib/types";

export type Permission =
  | "canUploadData"
  | "canInviteMembers"
  | "canManageBilling"
  | "canDeleteWorkspace"
  | "canManageSettings";

export const rolePermissions: Record<Role, Record<Permission, boolean>> = {
  OWNER: {
    canUploadData: true,
    canInviteMembers: true,
    canManageBilling: true,
    canDeleteWorkspace: true,
    canManageSettings: true,
  },
  ADMIN: {
    canUploadData: true,
    canInviteMembers: true,
    canManageBilling: false,
    canDeleteWorkspace: false,
    canManageSettings: true,
  },
  MEMBER: {
    canUploadData: true,
    canInviteMembers: false,
    canManageBilling: false,
    canDeleteWorkspace: false,
    canManageSettings: false,
  },
  VIEWER: {
    canUploadData: false,
    canInviteMembers: false,
    canManageBilling: false,
    canDeleteWorkspace: false,
    canManageSettings: false,
  },
};

export class PermissionDeniedError extends Error {
  readonly status = 403;

  constructor(permission: Permission) {
    super(`Permission denied: ${permission}`);
    this.name = "PermissionDeniedError";
  }
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role][permission];
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new PermissionDeniedError(permission);
  }
}
