/**
 * This script fixes issues with the curriculum collaboration models migration.
 * It can be used if the migration fails but the tables already exist in the database.
 * 
 * The script connects to the database and either:
 * 1. Updates a failed migration record to mark it as successfully applied
 * 2. Inserts a new record marking the migration as successfully applied
 * 
 * Since the database is hosted on Supabase and not accessible locally,
 * you'll need to execute SQL commands directly on the database using
 * the Supabase dashboard or another database administration tool.
 */

// SQL commands to fix the failed migration:

/*
-- Check if the migration exists
SELECT * FROM _prisma_migrations WHERE migration_name = '20250521040000_add_curriculum_collaboration_models';

-- If it exists and is marked as failed, update it to mark as applied successfully
UPDATE _prisma_migrations
SET applied = 1,
    rolled_back = 0,
    rolled_back_at = NULL
WHERE migration_name = '20250521040000_add_curriculum_collaboration_models';

-- If it doesn't exist, insert it as a successfully applied migration
INSERT INTO _prisma_migrations (
  id,
  checksum,
  finished_at,
  migration_name,
  logs,
  rolled_back_at,
  started_at,
  applied_steps_count
)
SELECT
  gen_random_uuid(),
  'manually-fixed-migration',
  NOW(),
  '20250521040000_add_curriculum_collaboration_models',
  'Migration manually marked as applied',
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM _prisma_migrations WHERE migration_name = '20250521040000_add_curriculum_collaboration_models'
);
*/

console.log(`
To fix the curriculum collaboration models migration issue, execute the following SQL commands
on your database using the Supabase dashboard or another database administration tool:

-- Check if the migration exists
SELECT * FROM _prisma_migrations WHERE migration_name = '20250521040000_add_curriculum_collaboration_models';

-- If it exists and is marked as failed, update it to mark as applied successfully
UPDATE _prisma_migrations
SET applied = 1,
    rolled_back = 0,
    rolled_back_at = NULL
WHERE migration_name = '20250521040000_add_curriculum_collaboration_models';

-- If it doesn't exist, insert it as a successfully applied migration
INSERT INTO _prisma_migrations (
  id,
  checksum,
  finished_at,
  migration_name,
  logs,
  rolled_back_at,
  started_at,
  applied_steps_count
)
SELECT
  gen_random_uuid(),
  'manually-fixed-migration',
  NOW(),
  '20250521040000_add_curriculum_collaboration_models',
  'Migration manually marked as applied',
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM _prisma_migrations WHERE migration_name = '20250521040000_add_curriculum_collaboration_models'
);
`);