/**
 * This script fixes TypeScript errors related to apostrophes in string literals
 * by replacing straight apostrophes with escaped apostrophes in string literals.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];
const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

// Find all files with the specified extensions
function findFiles(dir, extensions) {
  let results = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (stat.isFile() && extensions.includes(path.extname(filePath))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Process a file to fix apostrophes in string literals
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace apostrophes in string literals
  // This regex looks for string literals with apostrophes and fixes them
  const singleQuoteRegex = /'([^']*)'([^']*)'([^']*)'/g;
  const newContent = content.replace(singleQuoteRegex, (match, before, middle, after) => {
    return `'${before}'${middle.replace(/'/g, "\\'")}'${after}'`;
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  Updated ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Starting apostrophe fix for TypeScript string literals...');
  
  // Find all relevant files
  const files = findFiles(rootDir, fileExtensions);
  console.log(`Found ${files.length} files to check.`);
  
  // Process each file
  let updatedCount = 0;
  for (const file of files) {
    const updated = processFile(file);
    if (updated) {
      updatedCount++;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`- Checked ${files.length} files`);
  console.log(`- Updated ${updatedCount} files`);
  
  if (updatedCount > 0) {
    console.log(`\nFix completed successfully. Please run the TypeScript compiler to verify the changes.`);
  } else {
    console.log(`\nNo files needed updating.`);
  }
}

// Run the script
main();