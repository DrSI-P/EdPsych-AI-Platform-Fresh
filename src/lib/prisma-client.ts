/**
 * Re-export the Prisma client from the root prisma/client.ts file
 * This provides a consistent import path for all components and pages
 */

// Import the Prisma client from the root prisma/client.ts file
import prismaClient from '../../prisma/client';

// Export the Prisma client as default
export default prismaClient;