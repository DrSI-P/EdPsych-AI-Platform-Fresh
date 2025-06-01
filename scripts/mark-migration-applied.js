const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Migration name
const MIGRATION_NAME = '20250522_add_mentorship_and_portfolio_models';

// Paths
const migrationDir = path.join(__dirname, '..', 'prisma', 'migrations', MIGRATION_NAME);
const migrationTomlPath = path.join(migrationDir, 'migration.toml');

// Function to ensure the migration directory exists
function ensureMigrationDirExists() {
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
    console.log(`Created migration directory: ${migrationDir}`);
  }
}

// Function to create the migration.toml file
function createMigrationToml() {
  const migrationTomlContent = `
# This migration has been applied manually
migration_name = "${MIGRATION_NAME}"
applied_steps_count = 1
`;
  fs.writeFileSync(migrationTomlPath, migrationTomlContent);
  console.log(`Created migration.toml file at: ${migrationTomlPath}`);
}

// Function to mark the migration as applied
async function markMigrationAsApplied() {
  try {
    console.log(`Marking migration ${MIGRATION_NAME} as applied...`);
    
    // Ensure the migration directory exists
    ensureMigrationDirExists();
    
    // Create the migration.toml file
    createMigrationToml();
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    try {
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('Prisma client generated successfully.');
    } catch (error) {
      console.warn('Could not generate Prisma client. You may need to run it manually.');
      console.warn('Error:', error.message);
    }
    
    console.log(`\nMigration ${MIGRATION_NAME} has been marked as applied.`);
    console.log('Please verify that the database schema matches the Prisma schema.');
    
  } catch (error) {
    console.error('Error marking migration as applied:', error);
    process.exit(1);
  }
}

// Run the main function
markMigrationAsApplied();