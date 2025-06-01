/**
 * This script fixes malformed import statements in TypeScript files
 * by correcting quotation marks and ensuring proper syntax.
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

// Process a file to fix import statements
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Fix 1: Fix malformed import statements with missing or incorrect quotes
  // Pattern: import X from @/path'; -> import X from '@/path';
  const importRegex = /import\s+(?:\{[^\}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+([^'"@][^'"]*['"];?)/g;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, (match, importPath) => {
      // Check if the import path starts with @ but is missing the opening quote
      if (importPath.startsWith('@')) {
        return match.replace(/from\s+@/, "from '@");
      }
      return match;
    });
    updated = true;
  }
  
  // Fix 2: Fix unterminated string literals in import statements
  // Pattern: import X from 'path -> import X from ';path'
  const unterminatedImportRegex = /import\s+(?:\{[^\}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]*)['"']?;?/g;
  if (unterminatedImportRegex.test(content)) {
    content = content.replace(unterminatedImportRegex, (match, importPath) => {
      // If the match doesn't end with a quote and semicolon, fix it
      if (!match.endsWith("';") && !match.endsWith('";')) {
        if (match.includes("'")) {
          return match.replace(/['"]([^'"]*)['"']?;?/, "'$1';");
        } else {
          return match.replace(/['"]([^'"]*)['"']?;?/, '"$1";');
        }
      }
      return match;
    });
    updated = true;
  }
  
  // Fix 3: Fix specific issues with keyboard-navigation/page.tsx
  if (filePath.includes('keyboard-navigation/page.tsx')) {
    // Fix the blue' string literal
    content = content.replace(/focusIndicatorColor: blue'/, "focusIndicatorColor: 'blue'");
    
    // Fix the customFocusColor syntax
    content = content.replace(/customFocusColor: '#0066cc',/, "customFocusColor: '#0066cc',");
    
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Starting import statement fix...');
  
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