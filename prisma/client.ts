import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit.
 * Learn more: https://pris.ly/d/help/next-js-best-practices
 */

// Add prisma to the NodeJS global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance with logging configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Prevent multiple instances of Prisma Client in development
// Use existing instance if available, otherwise create a new one
export const prisma = global.prisma || createPrismaClient();

// Save the client instance in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export as default
export default prisma;