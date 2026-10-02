/**
 * Centralized Prisma client (architecture §41).
 *
 * A single client is created per process. Creating a client per request
 * exhausts the connection pool, so this module must be the only place
 * `new PrismaClient()` appears.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Avoid opening a new pool on every hot reload in development.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
export * from '@prisma/client';
