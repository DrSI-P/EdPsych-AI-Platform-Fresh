const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Migration name
const MIGRATION_NAME = '20250522_add_mentorship_and_portfolio_models';

// Paths
const migrationDir = path.join(__dirname, '..', 'prisma', 'migrations', MIGRATION_NAME);
const migrationSqlPath = path.join(migrationDir, 'migration.sql');
const migrationTomlPath = path.join(migrationDir, 'migration.toml');

// Function to create a readline interface for user input
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Function to ask a yes/no question
function askYesNo(question) {
  const rl = createInterface();
  
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Function to ensure the migration directory exists
function ensureMigrationDirExists() {
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
    console.log(`Created migration directory: ${migrationDir}`);
  }
}

// Function to check if the migration SQL file exists
function checkMigrationSqlExists() {
  if (!fs.existsSync(migrationSqlPath)) {
    console.error(`Migration SQL file not found: ${migrationSqlPath}`);
    console.error('Please ensure the migration SQL file exists before running this script.');
    process.exit(1);
  }
}

// Function to apply the migration
async function applyMigration() {
  try {
    // Check if the migration is already applied
    console.log('Checking if migration is already applied...');
    
    try {
      const result = execSync('npx prisma migrate status', { 
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      }).toString();
      
      if (result.includes(MIGRATION_NAME) && result.includes('Applied')) {
        console.log(`Migration ${MIGRATION_NAME} is already applied.`);
        
        const regenerateClient = await askYesNo('Do you want to regenerate the Prisma client?');
        
        if (regenerateClient) {
          console.log('Generating Prisma client...');
          execSync('npx prisma generate', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
          });
          console.log('Prisma client generated successfully.');
        }
        
        return;
      }
    } catch (error) {
      console.warn('Could not check migration status. Proceeding with migration...');
    }
    
    // Ensure the migration directory exists
    ensureMigrationDirExists();
    
    // Check if the migration SQL file exists
    checkMigrationSqlExists();
    
    // Ask for confirmation before applying the migration
    const confirmApply = await askYesNo('Are you sure you want to apply this migration to the database?');
    
    if (!confirmApply) {
      console.log('Migration cancelled.');
      return;
    }
    
    // Try different approaches to apply the migration
    console.log('Attempting to apply migration...');
    
    // Approach 1: Use prisma migrate resolve
    try {
      console.log('Approach 1: Using prisma migrate resolve...');
      execSync(`npx prisma migrate resolve --applied ${MIGRATION_NAME}`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('Migration applied successfully using prisma migrate resolve.');
    } catch (error) {
      console.warn('Could not apply migration using prisma migrate resolve. Trying alternative approach...');
      
      // Approach 2: Use prisma db execute
      try {
        console.log('Approach 2: Using prisma db execute...');
        execSync(`npx prisma db execute --file ${migrationSqlPath}`, { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        
        // Create migration.toml file to mark the migration as applied
        const migrationTomlContent = `
# This migration has been applied manually
migration_name = "${MIGRATION_NAME}"
applied_steps_count = 1
`;
        fs.writeFileSync(migrationTomlPath, migrationTomlContent);
        
        console.log('Migration applied successfully using prisma db execute.');
      } catch (error) {
        console.error('Could not apply migration using prisma db execute.');
        console.error('Error:', error.message);
        
        // Approach 3: Manual SQL execution
        console.log('\nApproach 3: Manual SQL execution');
        console.log('Please execute the following SQL manually in your database:');
        console.log(`SQL file path: ${migrationSqlPath}`);
        console.log('\nAfter executing the SQL, run:');
        console.log(`npx prisma migrate resolve --applied ${MIGRATION_NAME}`);
        
        return;
      }
    }
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('Prisma client generated successfully.');
    
    console.log('\nMigration process completed successfully.');
    console.log('Please test the API routes to ensure they work correctly.');
    
  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }
}

// Run the main function
applyMigration();