// Fixed database utility with proper Prisma methods
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const client =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

// Create database utility with proper Prisma methods
export const db = {
  // User operations
  user: {
    create: async (data: any) => {
      return await client.user.create({ data });
    },
    
    findByEmail: async (email: string) => {
      return await client.user.findUnique({
        where: { email }
      });
    },
    
    findById: async (id: string) => {
      return await client.user.findUnique({
        where: { id }
      });
    },
    
    update: async (id: string, data: any) => {
      return await client.user.update({
        where: { id },
        data
      });
    },
    
    findMany: async (options: any = {}) => {
      return await client.user.findMany(options);
    },
    
    delete: async (id: string) => {
      return await client.user.delete({
        where: { id }
      });
    }
  },
  
  // Blog operations
  blog: {
    create: async (data: any) => {
      return await client.blogPost.create({ data });
    },
    
    findMany: async (options: any = {}) => {
      return await client.blogPost.findMany(options);
    },
    
    findById: async (id: string) => {
      return await client.blogPost.findUnique({
        where: { id }
      });
    },
    
    update: async (id: string, data: any) => {
      return await client.blogPost.update({
        where: { id },
        data
      });
    },
    
    delete: async (id: string) => {
      return await client.blogPost.delete({
        where: { id }
      });
    }
  },
  
  // Learning path operations
  learningPath: {
    create: async (data: any) => {
      return await client.learningPath.create({ data });
    },
    
    findMany: async (options: any = {}) => {
      return await client.learningPath.findMany(options);
    },
    
    findById: async (id: string) => {
      return await client.learningPath.findUnique({
        where: { id }
      });
    },
    
    update: async (id: string, data: any) => {
      return await client.learningPath.update({
        where: { id },
        data
      });
    }
  },
  
  // Assessment operations
  assessment: {
    create: async (data: any) => {
      return await client.assessment.create({ data });
    },
    
    findMany: async (options: any = {}) => {
      return await client.assessment.findMany(options);
    },
    
    findById: async (id: string) => {
      return await client.assessment.findUnique({
        where: { id }
      });
    }
  },
  
  // Direct Prisma client access for complex queries
  $transaction: client.$transaction.bind(client),
  $connect: client.$connect.bind(client),
  $disconnect: client.$disconnect.bind(client),
};

// Export Prisma client for direct access when needed
export { client as prisma };
export default client;

