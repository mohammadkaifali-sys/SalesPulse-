import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set before seeding.");
}

export const demoPassword = "SalesPulseDemo2026!";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const organizations = [
  {
    id: "org_abc_1",
    name: "ABC Electronics",
    slug: "abc-electronics",
    user: { id: "usr_abc_owner", name: "ABC Electronics Owner", email: "abc.owner@salespulse.demo" },
    datasetId: "dataset_abc_sales",
    planCode: "FREE",
  },
  {
    id: "org_xyz_2",
    name: "XYZ Traders",
    slug: "xyz-traders",
    user: { id: "usr_xyz_owner", name: "XYZ Traders Owner", email: "xyz.owner@salespulse.demo" },
    datasetId: "dataset_xyz_sales",
    planCode: "PRO",
  },
] as const;

const products = [
  { name: "LED TV", category: "Television", min: 220, max: 900 },
  { name: "Ceiling Fan", category: "Cooling", min: 45, max: 140 },
  { name: "Cooler", category: "Cooling", min: 90, max: 280 },
  { name: "Stand Fan", category: "Cooling", min: 35, max: 110 },
];

function amount(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function saleDate(index: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - (index % 12));
  date.setDate(1 + ((index * 7) % 27));
  date.setHours(12, 0, 0, 0);
  return date;
}

export async function seed() {
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  await prisma.$transaction(async (tx) => {
    await tx.plan.upsert({
      where: { code: "FREE" },
      update: {},
      create: {
        id: "plan_free", name: "Free", code: "FREE", maxUsers: 3, maxRows: 10000,
        features: { exports: true }, priceMonthly: 0, priceYearly: 0,
      },
    });
    await tx.plan.upsert({
      where: { code: "PRO" },
      update: {},
      create: {
        id: "plan_pro", name: "Pro", code: "PRO", maxUsers: 25, maxRows: 100000,
        features: { exports: true, scheduledReports: true }, priceMonthly: 49, priceYearly: 490,
      },
    });

    for (const organization of organizations) {
      await tx.user.upsert({
        where: { email: organization.user.email },
        update: { name: organization.user.name, passwordHash },
        create: { id: organization.user.id, name: organization.user.name, email: organization.user.email, passwordHash },
      });

      const org = await tx.organization.upsert({
        where: { slug: organization.slug },
        update: { name: organization.name },
        create: { id: organization.id, name: organization.name, slug: organization.slug },
      });
      const user = await tx.user.findUniqueOrThrow({ where: { email: organization.user.email } });

      await tx.membership.upsert({
        where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
        update: { role: "OWNER" },
        create: { userId: user.id, organizationId: org.id, role: "OWNER" },
      });

      await tx.dataset.upsert({
        where: { id: organization.datasetId },
        update: { name: `${organization.name} Sales`, organizationId: org.id },
        create: {
          id: organization.datasetId,
          name: `${organization.name} Sales`,
          description: `Seeded sales dataset for ${organization.name}`,
          organizationId: org.id,
          createdById: user.id,
        },
      });

      await tx.salesRecord.deleteMany({ where: { organizationId: org.id } });
      for (let index = 0; index < 200; index += 1) {
        const product = products[index % products.length];
        const quantity = 1 + (index % 8);
        const unitPrice = amount(product.min, product.max);
        await tx.salesRecord.create({
          data: {
            organizationId: org.id,
            datasetId: organization.datasetId,
            date: saleDate(index),
            customerName: `${organization.name} Customer ${index + 1}`,
            productCategory: product.category,
            productName: product.name,
            quantity,
            unitPrice,
            totalAmount: Math.round(unitPrice * quantity * 100) / 100,
            status: index % 17 === 0 ? "REFUNDED" : "COMPLETED",
          },
        });
      }

      const plan = await tx.plan.findUniqueOrThrow({ where: { code: organization.planCode } });
      await tx.subscription.upsert({
        where: { organizationId: org.id },
        update: { planId: plan.id, status: "ACTIVE" },
        create: {
          organizationId: org.id,
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  });
}

seed()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
