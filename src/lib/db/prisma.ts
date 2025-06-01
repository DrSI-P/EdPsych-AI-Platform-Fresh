// This file is deprecated and should not be used.
// Import Prisma client from '../prisma.ts' instead.

import prismaClient, { prisma, db } from '../prisma';

// Re-export for backward compatibility
export { prisma, db };
export default prisma;
