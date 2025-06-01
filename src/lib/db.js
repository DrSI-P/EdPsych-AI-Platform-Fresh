// This is a direct export file to help with alias resolution
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Create a single PrismaClient instance
const client =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

// Export as both 'db' and 'prisma' to support different import styles
export const prisma = client;

// Export db as an object with prisma property to support imports like db.prisma
export const db = { prisma: client };

// Also export as default
export default client;
