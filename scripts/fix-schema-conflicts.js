const fs = require('fs');
const path = require('path');

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup.conflicts');
const schemaAdditionsPath = path.join(__dirname, '..', 'prisma', 'schema-additions.prisma');

// Function to read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Function to check if a model is already defined in the schema
function isModelDefined(schema, modelName) {
  const regex = new RegExp(`model\\s+${modelName}\\s+\\{`, 'i');
  return regex.test(schema);
}

// Function to extract model names from schema
function extractModelNames(schema) {
  const modelRegex = /model\s+(\w+)\s+\{/g;
  const models = [];
  let match;
  
  while ((match = modelRegex.exec(schema)) !== null) {
    models.push(match[1]);
  }
  
  return models;
}

// Main function
async function fixSchemaConflicts() {
  try {
    console.log('Starting schema conflict resolution...');
    
    // Create a backup of the current schema
    console.log('Creating backup of current schema...');
    const currentSchema = readFile(schemaPath);
    writeFile(backupSchemaPath, currentSchema);
    console.log('Backup created at:', backupSchemaPath);
    
    // Fix the schema by resolving merge conflicts
    console.log('Resolving merge conflicts...');
    
    // Split the schema into lines
    const lines = currentSchema.split('\n');
    const fixedLines = [];
    
    // Variables to track conflict state
    let inConflict = false;
    let ourLines = [];
    let theirLines = [];
    let currentSection = null;
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('<<<<<<< HEAD')) {
        // Start of conflict
        inConflict = true;
        currentSection = 'ours';
        continue;
      } else if (line.includes('=======')) {
        // Switch from our changes to their changes
        currentSection = 'theirs';
        continue;
      } else if (line.includes('>>>>>>> c0c8ddf')) {
        // End of conflict
        inConflict = false;
        currentSection = null;
        
        // Resolve the conflict
        // For User model relations, keep both our and their changes
        if (ourLines.some(l => l.includes('// New relations for Mentorship models')) &&
            theirLines.some(l => l.includes('// Portfolio model relations'))) {
          // Keep our mentorship relations and their portfolio relations comment
          const mentorshipLines = ourLines.filter(l => !l.includes('// New relations for Portfolio models'));
          const portfolioComment = theirLines.filter(l => l.includes('// Portfolio model relations'));
          fixedLines.push(...mentorshipLines);
          fixedLines.push(...portfolioComment);
        }
        // For certificates relation, keep our changes
        else if (ourLines.some(l => l.includes('certificates')) && 
                 theirLines.length === 0) {
          fixedLines.push(...ourLines);
        }
        // For portfolio models, merge the two versions
        else if (ourLines.some(l => l.includes('model PortfolioProfile')) && 
                 theirLines.some(l => l.includes('model PortfolioProfile'))) {
          // Keep their version with @db.Text annotations
          fixedLines.push(...theirLines);
        }
        // For portfolio evidence, merge the two versions
        else if (ourLines.some(l => l.includes('model PortfolioEvidence')) && 
                 theirLines.some(l => l.includes('model PortfolioEvidence'))) {
          // Keep their version with @db.Text annotations
          fixedLines.push(...theirLines);
        }
        // For portfolio evidence achievement, merge the two versions
        else if (ourLines.some(l => l.includes('model PortfolioEvidenceAchievement')) && 
                 theirLines.some(l => l.includes('model PortfolioEvidenceAchievement'))) {
          // Keep our version with createdAt field
          const ourVersion = ourLines.filter(l => !l.includes('evidence') && !l.includes('achievement'));
          const theirRelations = theirLines.filter(l => l.includes('evidence') || l.includes('achievement'));
          fixedLines.push(...ourVersion);
          fixedLines.push(...theirRelations);
        }
        // For portfolio reflection, merge the two versions
        else if (ourLines.some(l => l.includes('model PortfolioReflection')) && 
                 theirLines.some(l => l.includes('model PortfolioReflection'))) {
          // Keep their version with @db.Text annotations
          fixedLines.push(...theirLines);
        }
        // For portfolio reflection evidence, merge the two versions
        else if (ourLines.some(l => l.includes('model PortfolioReflectionEvidence')) && 
                 theirLines.some(l => l.includes('model PortfolioReflectionEvidence'))) {
          // Keep our version with createdAt field
          const ourVersion = ourLines.filter(l => !l.includes('reflection') && !l.includes('evidence'));
          const theirRelations = theirLines.filter(l => l.includes('reflection') || l.includes('evidence'));
          fixedLines.push(...ourVersion);
          fixedLines.push(...theirRelations);
        }
        // For certificate model, keep our changes
        else if (ourLines.some(l => l.includes('model Certificate')) && 
                 !theirLines.some(l => l.includes('model Certificate'))) {
          fixedLines.push(...ourLines);
        }
        // Default: keep our changes
        else {
          fixedLines.push(...ourLines);
        }
        
        // Reset conflict sections
        ourLines = [];
        theirLines = [];
        continue;
      }
      
      if (inConflict) {
        // Collect lines from each section
        if (currentSection === 'ours') {
          ourLines.push(line);
        } else if (currentSection === 'theirs') {
          theirLines.push(line);
        }
      } else {
        // Not in a conflict, keep the line
        fixedLines.push(line);
      }
    }
    
    // Write the fixed schema back to the file
    let fixedSchema = fixedLines.join('\n');
    
    // Read the schema additions file
    console.log('Reading schema additions...');
    const schemaAdditions = readFile(schemaAdditionsPath);
    
    // Extract model names from the fixed schema
    const existingModels = extractModelNames(fixedSchema);
    console.log('Existing models:', existingModels.join(', '));
    
    // Check if the required models are already in the schema
    const requiredModels = [
      'MentorProfile', 'MentorshipRequest', 'Mentorship', 'MentorshipFeedback',
      'CPDProfile', 'PortfolioProfile', 'PortfolioQualification', 'PortfolioAchievement',
      'PortfolioEvidence', 'PortfolioEvidenceAchievement', 'PortfolioReflection',
      'PortfolioReflectionEvidence', 'Certificate'
    ];
    
    const missingModels = requiredModels.filter(model => !existingModels.includes(model));
    
    if (missingModels.length > 0) {
      console.log('Missing models:', missingModels.join(', '));
      console.log('Adding missing models from schema additions...');
      
      // Extract only the missing models from schema additions
      const additionsLines = schemaAdditions.split('\n');
      let modelSection = null;
      let modelLines = [];
      let modelsToAdd = [];
      
      for (let i = 0; i < additionsLines.length; i++) {
        const line = additionsLines[i];
        const modelMatch = line.match(/model\s+(\w+)\s+\{/);
        
        if (modelMatch) {
          // If we were collecting lines for a previous model, add them if the model is missing
          if (modelSection && missingModels.includes(modelSection)) {
            modelsToAdd.push(...modelLines);
          }
          
          // Start collecting lines for a new model
          modelSection = modelMatch[1];
          modelLines = [line];
        } else if (modelSection) {
          modelLines.push(line);
          
          // If this is the end of a model definition, check if we need to add it
          if (line.trim() === '}') {
            if (missingModels.includes(modelSection)) {
              modelsToAdd.push(...modelLines);
            }
            
            // Reset for the next model
            modelSection = null;
            modelLines = [];
          }
        } else {
          // Not in a model definition, could be comments or blank lines
          // Only add if we're not between model definitions
          if (modelLines.length === 0) {
            modelsToAdd.push(line);
          }
        }
      }
      
      // Add the missing models to the schema
      fixedSchema += '\n' + modelsToAdd.join('\n');
    } else {
      console.log('All required models are already defined in the schema.');
    }
    
    // Write the final schema back to the file
    writeFile(schemaPath, fixedSchema);
    console.log('Schema conflicts resolved successfully.');
    
    console.log('\nNext steps:');
    console.log('1. Verify the schema changes');
    console.log('2. Run npx prisma generate to update the Prisma client');
    console.log('3. Commit and push these changes to GitHub');
    
  } catch (error) {
    console.error('Error fixing schema conflicts:', error);
    process.exit(1);
  }
}

// Run the main function
fixSchemaConflicts();