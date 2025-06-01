const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaAdditionsPath = path.join(__dirname, '..', 'prisma', 'schema-additions.prisma');
const userModelUpdatesPath = path.join(__dirname, '..', 'prisma', 'user-model-updates.prisma');

// Function to read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Main function
async function applySchemaUpdates() {
  try {
    console.log('Starting schema update process...');
    
    // Read the current schema
    const currentSchema = readFile(schemaPath);
    
    // Read the schema additions
    const schemaAdditions = readFile(schemaAdditionsPath);
    
    // Read the user model updates
    const userModelUpdates = readFile(userModelUpdatesPath);
    
    // Replace the User model in the current schema with the updated one
    const userModelRegex = /(model User \{[\s\S]*?\})/;
    const updatedSchema = currentSchema.replace(userModelRegex, userModelUpdates);
    
    // Add the new models to the end of the schema
    const finalSchema = updatedSchema + '\n\n' + schemaAdditions;
    
    // Write the updated schema back to the file
    writeFile(schemaPath, finalSchema);
    console.log('Schema file updated successfully.');
    
    // Run Prisma migration
    console.log('Running Prisma migration...');
    execSync('npx prisma migrate dev --name add_mentorship_and_portfolio_models', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('Migration completed successfully.');
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('Prisma client generated successfully.');
    console.log('Schema update process completed.');
    
  } catch (error) {
    console.error('Error applying schema updates:', error);
    process.exit(1);
  }
}

// Run the main function
applySchemaUpdates();