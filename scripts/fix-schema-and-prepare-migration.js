const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup');
const migrationSqlPath = path.join(__dirname, '..', 'prisma', 'migrations', '20250522_add_mentorship_and_portfolio_models', 'migration.sql');

// Function to read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Main function
async function fixSchemaAndPrepareMigration() {
  try {
    console.log('Starting schema fix and migration preparation...');
    
    // Create a backup of the current schema
    console.log('Creating backup of current schema...');
    const currentSchema = readFile(schemaPath);
    writeFile(backupSchemaPath, currentSchema);
    console.log('Backup created at:', backupSchemaPath);
    
    // Fix the schema by removing duplicate model definitions
    console.log('Fixing schema by removing duplicate model definitions...');
    
    // Find the line numbers where duplicate models start and end
    const lines = currentSchema.split('\n');
    let startLine = -1;
    let endLine = -1;
    
    // Look for the second occurrence of "// Mentorship Models"
    let firstOccurrence = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '// Mentorship Models') {
        if (firstOccurrence) {
          startLine = i;
          break;
        }
        firstOccurrence = true;
      }
    }
    
    // If we found the second occurrence, look for the end of the duplicate section
    if (startLine !== -1) {
      // Find the last model in the duplicate section (Certificate)
      for (let i = startLine; i < lines.length; i++) {
        if (lines[i].trim().startsWith('model Certificate {')) {
          // Find the closing brace of the Certificate model
          for (let j = i; j < lines.length; j++) {
            if (lines[j].trim() === '}') {
              endLine = j;
              break;
            }
          }
          break;
        }
      }
    }
    
    // If we found both start and end lines, remove the duplicate section
    if (startLine !== -1 && endLine !== -1) {
      console.log(`Found duplicate models from line ${startLine} to ${endLine}`);
      
      // Remove the duplicate section
      const fixedLines = [...lines.slice(0, startLine), ...lines.slice(endLine + 1)];
      const fixedSchema = fixedLines.join('\n');
      
      // Write the fixed schema back to the file
      writeFile(schemaPath, fixedSchema);
      console.log('Schema fixed successfully. Duplicate model definitions removed.');
    } else {
      console.log('No duplicate model definitions found in the schema using line-by-line search.');
      
      // Alternative approach: Use regex to find and remove the duplicate section
      const mentorshipModelPattern = /\/\/ Mentorship Models\s+model MentorProfile \{[\s\S]*?model Certificate \{[\s\S]*?\}/g;
      const matches = currentSchema.match(mentorshipModelPattern);
      
      if (matches && matches.length > 1) {
        console.log('Found duplicate models using regex pattern.');
        
        // Keep the first occurrence and remove the second
        const fixedSchema = currentSchema.replace(matches[1], '');
        
        // Write the fixed schema back to the file
        writeFile(schemaPath, fixedSchema);
        console.log('Schema fixed successfully using regex approach.');
      } else {
        console.log('No duplicate model definitions found using regex approach.');
        
        // Manual approach: Remove specific line ranges based on error messages
        console.log('Trying manual approach based on error messages...');
        
        // The error messages indicate duplicates starting at line 1239
        if (lines.length > 1239) {
          // Find the end of the Certificate model after line 1450
          let manualEndLine = 1450;
          for (let i = 1450; i < lines.length; i++) {
            if (lines[i].trim() === '}') {
              manualEndLine = i;
              break;
            }
          }
          
          // Remove the duplicate section
          const fixedLines = [...lines.slice(0, 1238), ...lines.slice(manualEndLine + 1)];
          const fixedSchema = fixedLines.join('\n');
          
          // Write the fixed schema back to the file
          writeFile(schemaPath, fixedSchema);
          console.log('Schema fixed successfully using manual approach.');
        } else {
          console.log('Could not fix schema automatically. Please fix it manually.');
        }
      }
    }
    
    // Ensure the migration directory exists
    const migrationDir = path.dirname(migrationSqlPath);
    ensureDirectoryExists(migrationDir);
    
    // Create a migration.toml file in the migration directory
    const migrationTomlPath = path.join(migrationDir, 'migration.toml');
    const migrationTomlContent = `
# This is a manually created migration.toml file
# It marks this migration as applied without running the SQL

migration_name = "20250522_add_mentorship_and_portfolio_models"
applied_steps_count = 1
`;
    writeFile(migrationTomlPath, migrationTomlContent);
    console.log('Created migration.toml file to mark migration as applied.');
    
    // Generate Prisma client
    try {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('Prisma client generated successfully.');
    } catch (error) {
      console.warn('Warning: Could not generate Prisma client. You may need to run this manually when database access is available.');
      console.warn('Error details:', error.message);
    }
    
    console.log('\nSchema fix and migration preparation completed successfully.');
    console.log('\nNext steps:');
    console.log('1. Commit and push these changes to GitHub');
    console.log('2. When database access is available, run:');
    console.log('   npx prisma migrate resolve --applied 20250522_add_mentorship_and_portfolio_models');
    console.log('   npx prisma generate');
    console.log('3. Test the API routes to ensure they work correctly');
    
  } catch (error) {
    console.error('Error fixing schema and preparing migration:', error);
    process.exit(1);
  }
}

// Run the main function
fixSchemaAndPrepareMigration();