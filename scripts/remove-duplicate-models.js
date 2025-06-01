const fs = require('fs');
const path = require('path');

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup.duplicates');

// Function to read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Main function
async function removeDuplicateModels() {
  try {
    console.log('Starting duplicate model removal...');
    
    // Create a backup of the current schema
    console.log('Creating backup of current schema...');
    const currentSchema = readFile(schemaPath);
    writeFile(backupSchemaPath, currentSchema);
    console.log('Backup created at:', backupSchemaPath);
    
    // Process the schema to remove duplicate model definitions
    console.log('Removing duplicate model definitions...');
    
    // Split the schema into lines
    const lines = currentSchema.split('\n');
    const processedLines = [];
    const modelDefinitions = new Map(); // Map to track model definitions
    
    let currentModel = null;
    let currentModelLines = [];
    let inModelDefinition = false;
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const modelMatch = line.match(/model\s+(\w+)\s+\{/);
      
      if (modelMatch) {
        // Start of a model definition
        if (inModelDefinition) {
          // We were already in a model definition, so save it
          if (!modelDefinitions.has(currentModel)) {
            modelDefinitions.set(currentModel, currentModelLines);
            processedLines.push(...currentModelLines);
          } else {
            console.log(`Skipping duplicate model definition for ${currentModel}`);
          }
        }
        
        // Start tracking a new model
        currentModel = modelMatch[1];
        currentModelLines = [line];
        inModelDefinition = true;
      } else if (inModelDefinition) {
        // Continue collecting lines for the current model
        currentModelLines.push(line);
        
        // Check if this is the end of the model definition
        if (line.trim() === '}') {
          // End of model definition
          if (!modelDefinitions.has(currentModel)) {
            modelDefinitions.set(currentModel, currentModelLines);
            processedLines.push(...currentModelLines);
          } else {
            console.log(`Skipping duplicate model definition for ${currentModel}`);
          }
          
          // Reset for the next model
          currentModel = null;
          currentModelLines = [];
          inModelDefinition = false;
        }
      } else {
        // Not in a model definition, keep the line
        processedLines.push(line);
      }
    }
    
    // Handle the case where the last model definition doesn't end properly
    if (inModelDefinition && currentModel && !modelDefinitions.has(currentModel)) {
      processedLines.push(...currentModelLines);
    }
    
    // Write the processed schema back to the file
    const processedSchema = processedLines.join('\n');
    writeFile(schemaPath, processedSchema);
    
    console.log('Duplicate model definitions removed successfully.');
    console.log(`Processed ${modelDefinitions.size} unique model definitions.`);
    
    console.log('\nNext steps:');
    console.log('1. Verify the schema changes');
    console.log('2. Run npx prisma generate to update the Prisma client');
    console.log('3. Commit and push these changes to GitHub');
    
  } catch (error) {
    console.error('Error removing duplicate models:', error);
    process.exit(1);
  }
}

// Run the main function
removeDuplicateModels();