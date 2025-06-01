/**
 * This script fixes Prisma model case issues in the codebase
 * Prisma models should be accessed with camelCase, not PascalCase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('Starting Prisma model case fixes...');

// Find all files that might have Prisma model case issues
let files = [];
try {
  // Use grep to find files containing potential Prisma model case issues
  // Look for patterns like prisma.ModelName with capital letters
  const grepCommand = `grep -r "prisma\\.[A-Z]" ${srcDir} --include="*.ts" --include="*.tsx"`;
  const grepResult = execSync(grepCommand, { encoding: 'utf8' });
  
  // Parse grep results to get file paths
  files = grepResult.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(':')[0])
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  console.log(`Found ${files.length} files with potential Prisma model case issues.`);
} catch (error) {
  // If grep returns no results, it will exit with code 1
  if (error.status !== 1) {
    console.error('Error searching for files:', error.message);
  } else {
    console.log('No files found with Prisma model case issues.');
  }
}

// Known Prisma models that need to be fixed
const modelMappings = {
  'CurriculumPlanCollaborator': 'curriculumPlanCollaborator',
  // Add more mappings as needed
};

// Process each file
let fixedFiles = 0;
for (const filePath of files) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace PascalCase model references with camelCase
    Object.entries(modelMappings).forEach(([pascalCase, camelCase]) => {
      const regex = new RegExp(`prisma\\.${pascalCase}\\b`, 'g');
      content = content.replace(regex, `prisma.${camelCase}`);
    });
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Prisma model case in ${filePath}`);
      fixedFiles++;
    } else {
      console.log(`No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nPrisma model case fixes completed. Fixed ${fixedFiles} files.`);