// Railway Database Connection Test
import { PrismaClient } from '@prisma/client';

const RAILWAY_DATABASE_URL = "postgresql://postgres:cfrIRoriddjsJuEKMMHenOkSGveikIvb@hopper.proxy.rlwy.net:27107/railway";

export async function testRailwayConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: RAILWAY_DATABASE_URL
      }
    }
  });

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to Railway PostgreSQL database');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database version:', result);
    
    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Available tables:', tables);
    
    return {
      success: true,
      message: 'Railway database connection successful',
      tables: tables
    };
    
  } catch (error) {
    console.error('❌ Railway database connection failed:', error);
    return {
      success: false,
      message: 'Railway database connection failed',
      error: error
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Export Railway-specific Prisma client
export const railwayPrisma = new PrismaClient({
  datasources: {
    db: {
      url: RAILWAY_DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

