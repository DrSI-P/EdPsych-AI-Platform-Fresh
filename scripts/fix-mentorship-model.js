const fs = require('fs');
const path = require('path');

// Paths
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup.fix');

// Function to read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Main function
async function fixMentorshipModel() {
  try {
    console.log('Starting Mentorship model fix...');
    
    // Create a backup of the current schema
    console.log('Creating backup of current schema...');
    const currentSchema = readFile(schemaPath);
    writeFile(backupSchemaPath, currentSchema);
    console.log('Backup created at:', backupSchemaPath);
    
    // Find the first occurrence of the Mentorship model
    const mentorshipModelPattern = /model Mentorship \{[\s\S]*?requestId\s+String\?[\s\S]*?\}/;
    const mentorshipModelMatch = currentSchema.match(mentorshipModelPattern);
    
    if (!mentorshipModelMatch) {
      console.log('Mentorship model not found in the schema.');
      return;
    }
    
    // Check if the requestId field already has the @unique attribute
    const requestIdPattern = /requestId\s+String\?\s+@unique/;
    if (requestIdPattern.test(mentorshipModelMatch[0])) {
      console.log('The requestId field already has the @unique attribute. No fix needed.');
      return;
    }
    
    // Add the @unique attribute to the requestId field
    const fixedMentorshipModel = mentorshipModelMatch[0].replace(
      /requestId\s+String\?/,
      'requestId    String?             @unique'
    );
    
    // Replace the Mentorship model in the schema
    const fixedSchema = currentSchema.replace(mentorshipModelPattern, fixedMentorshipModel);
    
    // Write the fixed schema back to the file
    writeFile(schemaPath, fixedSchema);
    console.log('Mentorship model fixed successfully. Added @unique attribute to requestId field.');
    
    console.log('\nNext steps:');
    console.log('1. Verify the schema changes');
    console.log('2. Run npx prisma generate to update the Prisma client');
    console.log('3. Commit and push these changes to GitHub');
    
  } catch (error) {
    console.error('Error fixing Mentorship model:', error);
    process.exit(1);
  }
}

// Run the main function
fixMentorshipModel();