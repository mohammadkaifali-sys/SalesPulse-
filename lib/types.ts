export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface User {
  id: string;
  name: string | null;
  email: string;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  role: Role;
  userId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesRecord {
  id: string;
  organizationId: string;
  datasetId?: string | null;
  date: Date;
  customerName: string;
  productCategory: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}
