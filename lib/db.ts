import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set before the database client is initialized.");
}

const globalForDb = globalThis as unknown as {
  salespulseDb: PrismaClient | undefined;
};

const adapter = new PrismaNeon({ connectionString });

export const db =
  globalForDb.salespulseDb ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.salespulseDb = db;
}
