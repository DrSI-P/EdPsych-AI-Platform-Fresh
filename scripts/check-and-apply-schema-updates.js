const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const migrationSqlPath = path.join(__dirname, '..', 'prisma', 'migrations', '20250522_add_mentorship_and_portfolio_models', 'migration.sql');
const tempMigrationPath = path.join(__dirname, '..', 'prisma', 'migrations', 'temp_migration.sql');

// Models to check for
const modelsToCheck = [
  'MentorProfile',
  'MentorshipRequest',
  'Mentorship',
  'MentorshipMeeting',
  'MentorshipResource',
  'MentorshipFeedback',
  'CPDProfile',
  'PortfolioProfile',
  'PortfolioQualification',
  'PortfolioAchievement',
  'PortfolioEvidence',
  'PortfolioEvidenceAchievement',
  'PortfolioReflection',
  'PortfolioReflectionEvidence',
  'Certificate'
];

// Main function
async function checkAndApplySchemaUpdates() {
  try {
    console.log('Starting schema update process...');
    
    // Check if models already exist in the database
    let existingModels = [];
    try {
      existingModels = await getExistingModels();
      console.log('Existing models:', existingModels);
    } catch (error) {
      console.error('Error getting existing models:', error);
      console.log('Proceeding with all models since we could not check existing ones.');
    }
    
    // Determine which models need to be added
    const modelsToAdd = modelsToCheck.filter(model => !existingModels.includes(model));
    console.log('Models to add:', modelsToAdd);
    
    if (modelsToAdd.length === 0) {
      console.log('All models already exist in the database. No migration needed.');
      return;
    }
    
    // Create a temporary migration file with only the missing models
    createTemporaryMigration(modelsToAdd);
    
    // Execute the migration SQL
    try {
      console.log('Executing migration SQL...');
      await prisma.$executeRawUnsafe(fs.readFileSync(tempMigrationPath, 'utf8'));
      console.log('Migration SQL executed successfully.');
    } catch (error) {
      console.error('Error executing migration SQL:', error);
      console.log('Trying alternative approach with Prisma migrate...');
      
      try {
        execSync('npx prisma migrate dev --name add_missing_models', { 
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
      } catch (migrateError) {
        console.error('Error running Prisma migration:', migrateError);
        console.log('Please run the migration manually when you have proper database access.');
        console.log(`You can use the SQL in the migration file: ${migrationSqlPath}`);
      }
    }
    
    // Generate Prisma client
    try {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      console.error('Error generating Prisma client:', error);
    }
    
    console.log('Schema update process completed.');
    
  } catch (error) {
    console.error('Error in schema update process:', error);
  } finally {
    await prisma.$disconnect();
    
    // Clean up temporary files
    if (fs.existsSync(tempMigrationPath)) {
      fs.unlinkSync(tempMigrationPath);
    }
  }
}

// Function to get existing models from the database
async function getExistingModels() {
  try {
    // Query the database to get a list of all tables
    const result = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;
    
    // Extract table names and convert to PascalCase for comparison with model names
    return result.map(row => {
      const tableName = row.tablename;
      // Convert snake_case to PascalCase
      return tableName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    });
  } catch (error) {
    throw error;
  }
}

// Function to create a temporary migration file with only the missing models
function createTemporaryMigration(modelsToAdd) {
  try {
    // Read the original migration SQL
    const migrationSql = fs.readFileSync(migrationSqlPath, 'utf8');
    
    // Create a new SQL file with only the statements for the missing models
    let tempSql = '';
    
    // For each model to add, extract the relevant SQL statements
    modelsToAdd.forEach(model => {
      // Extract CREATE TABLE statement
      const createTableRegex = new RegExp(`-- CreateTable\\s+CREATE TABLE "${model}"[\\s\\S]*?;`, 'g');
      const createTableMatch = migrationSql.match(createTableRegex);
      if (createTableMatch) {
        tempSql += createTableMatch[0] + '\n\n';
      }
      
      // Extract CREATE INDEX statements
      const createIndexRegex = new RegExp(`-- CreateIndex\\s+CREATE UNIQUE INDEX[\\s\\S]*?"${model}"[\\s\\S]*?;`, 'g');
      const createIndexMatches = migrationSql.match(createIndexRegex);
      if (createIndexMatches) {
        createIndexMatches.forEach(match => {
          tempSql += match + '\n\n';
        });
      }
      
      // Extract ADD FOREIGN KEY statements
      const addForeignKeyRegex = new RegExp(`-- AddForeignKey\\s+ALTER TABLE "${model}"[\\s\\S]*?;`, 'g');
      const addForeignKeyMatches = migrationSql.match(addForeignKeyRegex);
      if (addForeignKeyMatches) {
        addForeignKeyMatches.forEach(match => {
          tempSql += match + '\n\n';
        });
      }
      
      // Extract ADD FOREIGN KEY statements that reference this model
      const referenceForeignKeyRegex = new RegExp(`-- AddForeignKey\\s+ALTER TABLE[\\s\\S]*?REFERENCES "${model}"[\\s\\S]*?;`, 'g');
      const referenceForeignKeyMatches = migrationSql.match(referenceForeignKeyRegex);
      if (referenceForeignKeyMatches) {
        referenceForeignKeyMatches.forEach(match => {
          tempSql += match + '\n\n';
        });
      }
    });
    
    // Write the temporary migration file
    fs.writeFileSync(tempMigrationPath, tempSql);
    console.log('Created temporary migration file with only the missing models.');
    
  } catch (error) {
    console.error('Error creating temporary migration:', error);
    throw error;
  }
}

// Run the main function
checkAndApplySchemaUpdates();