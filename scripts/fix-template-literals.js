/**
 * This script fixes TypeScript errors related to template literals and multi-line strings
 * by properly formatting template literals and fixing syntax issues.
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

// Process a file to fix template literals and multi-line strings
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Fix 1: Fix single quotes with No' pattern (common in ternary expressions)
  const noQuoteRegex = /: '(.*?)' : 'No'/g;
  if (noQuoteRegex.test(content)) {
    content = content.replace(noQuoteRegex, ": '$1' : 'No'");
    updated = true;
  }
  
  // Fix 2: Fix unterminated template literals
  // Look for template literals that might be malformed
  const lines = content.split('\n');
  let inTemplateLiteral = false;
  let templateStartLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Count backticks in this line
    const backtickCount = (line.match(/`/g) || []).length;
    
    if (!inTemplateLiteral && backtickCount % 2 === 1) {
      // Start of a template literal
      inTemplateLiteral = true;
      templateStartLine = i;
    } else if (inTemplateLiteral && backtickCount % 2 === 1) {
      // End of a template literal
      inTemplateLiteral = false;
      templateStartLine = -1;
    }
    
    // If we're at the end of the file and still in a template literal, it's unterminated
    if (i === lines.length - 1 && inTemplateLiteral && templateStartLine !== -1) {
      lines[i] += '`';
      updated = true;
      console.log(`  Fixed unterminated template literal at line ${templateStartLine + 1}`);
    }
  }
  
  // Fix 3: Fix specific issues in adaptive-complexity route file
  if (filePath.includes('adaptive-complexity/route.ts')) {
    // Replace problematic ternary with proper quotes
    content = content.replace(
      /\${settings\.autoAssessComprehension \? 'Yes' : No'}/g,
      "${settings.autoAssessComprehension ? 'Yes' : 'No'}"
    );
    
    // Fix template literal formatting
    content = content.replace(
      /\${performanceMetrics \? `\n/g,
      "${performanceMetrics ? `\n"
    );
    
    updated = true;
  }
  
  // If we made line-by-line changes, reconstruct the content
  if (updated && lines.join('\n') !== content) {
    content = lines.join('\n');
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
  console.log('Starting template literals and multi-line strings fix...');
  
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