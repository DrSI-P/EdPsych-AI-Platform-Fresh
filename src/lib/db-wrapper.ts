import { PrismaClient } from '@prisma/client';

// Create a new PrismaClient instance for the wrapper
// This avoids circular dependencies with db.ts
const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Extend the Prisma client with custom methods
const db = {
  ...prismaClient,
  user: {
    ...prismaClient.user,
    // Find a user by ID
    findById: async (id: string) => {
      return prismaClient.user.findUnique({
        where: { id }
      });
    },
    // Find a user by email
    findByEmail: async (email: string) => {
      return prismaClient.user.findUnique({
        where: { email }
      });
    },
    // Update a user by ID
    update: async (id: string, data: any) => {
      return prismaClient.user.update({
        where: { id },
        data
      });
    },
    // Delete a user by ID
    delete: async (id: string) => {
      return prismaClient.user.delete({
        where: { id }
      });
    },
    // Create a new user
    create: async (data: any) => {
      return prismaClient.user.create({
        data
      });
    },
    // Find many users with optional filters
    findMany: async (options: any = {}) => {
      return prismaClient.user.findMany(options);
    }
  },
  // Add other models as needed
  prisma: prismaClient
};

// Export the extended db object
export { db };
export default db;