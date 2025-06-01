// Script to fix the failed PasswordReset migration
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixFailedMigration() {
  console.log('Starting migration fix script...');
  
  try {
    // Connect to the database directly to execute raw SQL
    const migrationId = '20250521020000_add_password_reset_model';
    
    // Check if the migration exists and is marked as failed
    const existingMigration = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations WHERE migration_name = ${migrationId}
    `;
    
    console.log('Existing migration:', existingMigration);
    
    if (existingMigration.length > 0) {
      // If the migration exists, update it to mark as applied successfully
      console.log(`Marking migration ${migrationId} as applied successfully...`);
      
      await prisma.$executeRaw`
        UPDATE _prisma_migrations 
        SET applied = 1, 
            rolled_back = 0, 
            rolled_back_at = NULL 
        WHERE migration_name = ${migrationId}
      `;
      
      console.log('Migration marked as applied successfully.');
    } else {
      // If the migration doesn't exist, insert it as a successfully applied migration
      console.log(`Adding migration ${migrationId} as applied successfully...`);
      
      await prisma.$executeRaw`
        INSERT INTO _prisma_migrations (
          id, 
          checksum, 
          finished_at, 
          migration_name, 
          logs, 
          rolled_back_at, 
          started_at, 
          applied_steps_count
        ) VALUES (
          gen_random_uuid(), 
          'manually-fixed-migration', 
          NOW(), 
          ${migrationId}, 
          'Migration manually marked as applied', 
          NULL, 
          NOW(), 
          1
        )
      `;
      
      console.log('Migration added as applied successfully.');
    }
    
    console.log('Migration fix completed successfully!');
  } catch (error) {
    console.error('Error fixing migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixFailedMigration();