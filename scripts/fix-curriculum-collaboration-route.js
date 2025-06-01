/**
 * This script specifically fixes the case sensitivity issue in the
 * src/app/api/curriculum/collaboration/route.ts file, which is causing
 * the build failure in Vercel.
 */

const fs = require('fs');
const path = require('path');

// File path
const filePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'curriculum', 'collaboration', 'route.ts');

// Search pattern
const searchPattern = /\bcurriculumPlanCollaborator\b/g;
const replacement = 'CurriculumPlanCollaborator';

// Main function
function main() {
  console.log('Starting targeted fix for curriculum collaboration route...');
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace occurrences
  const newContent = content.replace(searchPattern, replacement);
  
  // Check if any replacements were made
  if (content === newContent) {
    console.log('No replacements needed in the file.');
    process.exit(0);
  }
  
  // Write updated content back to file
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log('Successfully updated the file.');
  console.log('Please run the TypeScript compiler to verify the fix.');
}

// Run the script
main();