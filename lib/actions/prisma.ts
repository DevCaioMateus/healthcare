// packages
import { PrismaClient } from "@prisma/client";
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ||
  new PrismaClient(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.env.NODE_ENV === "development" ? { log: ["error"] } : ({} as any)
  );

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };
