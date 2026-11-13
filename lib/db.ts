import { User, Organization, Membership, Dataset, SalesRecord, Role } from "./types";

interface DbStore {
  users: User[];
  organizations: Organization[];
  memberships: Membership[];
  datasets: Dataset[];
  salesRecords: SalesRecord[];
}

export interface DatabaseClient {
  user: {
    findUnique(args: { where: { id?: string; email?: string } }): Promise<User | null>;
    findFirst(args: { where: { email?: string } }): Promise<User | null>;
    create(args: { data: Omit<User, "id" | "createdAt" | "updatedAt"> & { id?: string } }): Promise<User>;
    findMany(): Promise<User[]>;
  };
  organization: {
    findUnique(args: { where: { id?: string; slug?: string } }): Promise<Organization | null>;
    findFirst(args: { where: { slug?: string } }): Promise<Organization | null>;
    findMany(args?: { where?: { id?: { in?: string[] } } }): Promise<Organization[]>;
    create(args: { data: { name: string; slug: string; id?: string } }): Promise<Organization>;
  };
  membership: {
    findMany(args: { where: { userId?: string; organizationId?: string } }): Promise<Membership[]>;
    findFirst(args: { where: { userId: string; organizationId: string } }): Promise<Membership | null>;
    create(args: { data: { userId: string; organizationId: string; role?: Role; id?: string } }): Promise<Membership>;
  };
  dataset: {
    findMany(args: { where: { organizationId: string } }): Promise<Dataset[]>;
    create(args: { data: Omit<Dataset, "id" | "createdAt" | "updatedAt"> & { id?: string } }): Promise<Dataset>;
  };
  salesRecord: {
    findMany(args: {
      where: { organizationId: string; date?: { gte?: Date; lte?: Date } };
      take?: number;
      skip?: number;
    }): Promise<SalesRecord[]>;
    create(args: { data: Omit<SalesRecord, "id" | "createdAt"> & { id?: string } }): Promise<SalesRecord>;
  };
  $transaction<T>(fn: (tx: DatabaseClient) => Promise<T>): Promise<T>;
}

// Initial Seed Data
const initialUsers: User[] = [
  {
    id: "usr_abc123",
    name: "Kaif Ali",
    email: "kaif@example.com",
    avatarUrl: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "usr_xyz789",
    name: "Demo Owner",
    email: "owner@salespulse.app",
    avatarUrl: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

const initialOrgs: Organization[] = [
  {
    id: "org_abc_1",
    name: "ABC Electronics",
    slug: "abc-electronics",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "org_xyz_2",
    name: "XYZ Traders",
    slug: "xyz-traders",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
];

const initialMemberships: Membership[] = [
  {
    id: "mem_1",
    role: "OWNER",
    userId: "usr_abc123",
    organizationId: "org_abc_1",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "mem_2",
    role: "OWNER",
    userId: "usr_abc123",
    organizationId: "org_xyz_2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
];

const initialDatasets: Dataset[] = [
  {
    id: "dataset_abc_sales",
    name: "ABC Electronics Sales",
    description: "Seeded sales dataset for ABC Electronics",
    organizationId: "org_abc_1",
    createdById: "usr_abc123",
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
  },
  {
    id: "dataset_xyz_sales",
    name: "XYZ Traders Sales",
    description: "Seeded sales dataset for XYZ Traders",
    organizationId: "org_xyz_2",
    createdById: "usr_abc123",
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-05"),
  },
];

const initialSalesRecords: SalesRecord[] = [
  {
    id: "record_abc_1",
    organizationId: "org_abc_1",
    datasetId: "dataset_abc_sales",
    date: new Date("2026-01-21"),
    customerName: "ABC Customer",
    productCategory: "Electronics",
    productName: "ABC Monitor",
    quantity: 2,
    unitPrice: 300,
    totalAmount: 600,
    status: "COMPLETED",
    createdAt: new Date("2026-01-21"),
  },
  {
    id: "record_xyz_1",
    organizationId: "org_xyz_2",
    datasetId: "dataset_xyz_sales",
    date: new Date("2026-02-06"),
    customerName: "XYZ Customer",
    productCategory: "Accessories",
    productName: "XYZ Keyboard",
    quantity: 4,
    unitPrice: 75,
    totalAmount: 300,
    status: "COMPLETED",
    createdAt: new Date("2026-02-06"),
  },
];

// In Next.js development, preserve data across hot reloads using globalThis
const globalForDb = globalThis as unknown as {
  salespulseDb: DbStore | undefined;
};

const store: DbStore = globalForDb.salespulseDb || {
  users: [...initialUsers],
  organizations: [...initialOrgs],
  memberships: [...initialMemberships],
  datasets: [...initialDatasets],
  salesRecords: [...initialSalesRecords],
};

if (process.env.NODE_ENV !== "production") {
  globalForDb.salespulseDb = store;
}

export const db: DatabaseClient = {
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      if (where.id) return store.users.find((u) => u.id === where.id) || null;
      if (where.email)
        return (
          store.users.find(
            (u) => u.email.toLowerCase() === where.email?.toLowerCase()
          ) || null
        );
      return null;
    },
    async findFirst({ where }: { where: { email?: string } }) {
      return this.findUnique({ where });
    },
    async create({ data }: { data: Omit<User, "id" | "createdAt" | "updatedAt"> & { id?: string } }) {
      const newUser: User = {
        id: data.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: data.name ?? null,
        email: data.email,
        passwordHash: data.passwordHash ?? null,
        avatarUrl: data.avatarUrl ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.push(newUser);
      return newUser;
    },
    async findMany() {
      return [...store.users];
    },
  },

  organization: {
    async findUnique({ where }: { where: { id?: string; slug?: string } }) {
      if (where.id) return store.organizations.find((o) => o.id === where.id) || null;
      if (where.slug)
        return (
          store.organizations.find(
            (o) => o.slug.toLowerCase() === where.slug?.toLowerCase()
          ) || null
        );
      return null;
    },
    async findFirst({ where }: { where: { slug?: string } }) {
      return this.findUnique({ where });
    },
    async findMany(args?: { where?: { id?: { in?: string[] } } }) {
      if (args?.where?.id?.in) {
        const ids = new Set(args.where.id.in);
        return store.organizations.filter((o) => ids.has(o.id));
      }
      return [...store.organizations];
    },
    async create({ data }: { data: { name: string; slug: string; id?: string } }) {
      const newOrg: Organization = {
        id: data.id || `org_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: data.name,
        slug: data.slug.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.organizations.push(newOrg);
      return newOrg;
    },
  },

  membership: {
    async findMany({ where }: { where: { userId?: string; organizationId?: string } }) {
      return store.memberships.filter((m) => {
        if (where.userId && m.userId !== where.userId) return false;
        if (where.organizationId && m.organizationId !== where.organizationId) return false;
        return true;
      });
    },
    async findFirst({ where }: { where: { userId: string; organizationId: string } }) {
      return (
        store.memberships.find(
          (m) => m.userId === where.userId && m.organizationId === where.organizationId
        ) || null
      );
    },
    async create({
      data,
    }: {
      data: { userId: string; organizationId: string; role?: Role; id?: string };
    }) {
      const newMembership: Membership = {
        id: data.id || `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role || "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.memberships.push(newMembership);
      return newMembership;
    },
  },

  dataset: {
    async findMany({ where }: { where: { organizationId: string } }) {
      return store.datasets.filter((d) => d.organizationId === where.organizationId);
    },
    async create({
      data,
    }: {
      data: Omit<Dataset, "id" | "createdAt" | "updatedAt"> & { id?: string };
    }) {
      const newDataset: Dataset = {
        id: data.id || `ds_${Date.now()}`,
        name: data.name,
        description: data.description ?? null,
        organizationId: data.organizationId,
        createdById: data.createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.datasets.push(newDataset);
      return newDataset;
    },
  },

  salesRecord: {
    async findMany({
      where,
      take,
      skip,
    }: {
      where: { organizationId: string; date?: { gte?: Date; lte?: Date } };
      take?: number;
      skip?: number;
    }) {
      let filtered = store.salesRecords.filter((r) => r.organizationId === where.organizationId);
      if (where.date?.gte) {
        filtered = filtered.filter((r) => r.date >= (where.date?.gte as Date));
      }
      if (where.date?.lte) {
        filtered = filtered.filter((r) => r.date <= (where.date?.lte as Date));
      }
      const startIndex = skip || 0;
      return take ? filtered.slice(startIndex, startIndex + take) : filtered.slice(startIndex);
    },
    async create({
      data,
    }: {
      data: Omit<SalesRecord, "id" | "createdAt"> & { id?: string };
    }) {
      const newRecord: SalesRecord = {
        id: data.id || `sr_${Date.now()}`,
        organizationId: data.organizationId,
        datasetId: data.datasetId ?? null,
        date: data.date,
        customerName: data.customerName,
        productCategory: data.productCategory,
        productName: data.productName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: data.totalAmount,
        status: data.status || "COMPLETED",
        createdAt: new Date(),
      };
      store.salesRecords.push(newRecord);
      return newRecord;
    },
  },

  /**
   * Execute transactional operations sequentially
   */
  async $transaction<T>(fn: (tx: DatabaseClient) => Promise<T>): Promise<T> {
    const snapshot = {
      users: [...store.users],
      organizations: [...store.organizations],
      memberships: [...store.memberships],
      datasets: [...store.datasets],
      salesRecords: [...store.salesRecords],
    };

    try {
      return await fn(db);
    } catch (error) {
      store.users = snapshot.users;
      store.organizations = snapshot.organizations;
      store.memberships = snapshot.memberships;
      store.datasets = snapshot.datasets;
      store.salesRecords = snapshot.salesRecords;
      throw error;
    }
  },
};
