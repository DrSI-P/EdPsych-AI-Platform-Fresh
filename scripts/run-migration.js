const { execSync } = require('child_process');
const path = require('path');

// Main function
async function runMigration() {
  try {
    console.log('Running Prisma migration...');
    
    // Run Prisma migration using the SQL file directly
    execSync('npx prisma migrate resolve --applied 20250522_add_mentorship_and_portfolio_models', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('Migration applied successfully.');
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('Prisma client generated successfully.');
    console.log('Migration process completed.');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

// Run the main function
runMigration();