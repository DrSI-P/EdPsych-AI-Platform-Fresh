/**
 * Script to standardize component exports in the EdPsych-AI-Education-Platform
 * This script removes default exports while keeping named exports to ensure consistency
 */

const fs = require('fs');
const path = require('path');

// Directories to scan for components with export issues
const directoriesToScan = [
  'src/components/ai-avatar',
  'src/components/ai/adaptive-complexity',
  'src/components/heygen'
];

// Function to process a file and standardize its exports
function standardizeExports(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file has both named and default exports
  const hasNamedExport = /export\s+const\s+\w+/g.test(content);
  const hasDefaultExport = /export\s+default\s+\w+/g.test(content);
  
  if (hasNamedExport && hasDefaultExport) {
    console.log(`  Found both named and default exports in ${filePath}`);
    
    // Remove the default export line
    content = content.replace(/export\s+default\s+\w+;?/g, '');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Removed default export from ${filePath}`);
    
    return true;
  }
  
  return false;
}

// Function to scan directories and process files
function scanAndFix() {
  let totalFixed = 0;
  
  directoriesToScan.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Directory ${fullPath} does not exist, skipping...`);
      return;
    }
    
    console.log(`Scanning directory: ${fullPath}`);
    
    const files = fs.readdirSync(fullPath);
    
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(fullPath, file);
        const fixed = standardizeExports(filePath);
        if (fixed) totalFixed++;
      }
    });
  });
  
  console.log(`\nStandardization complete. Fixed ${totalFixed} files.`);
}

// Run the script
scanAndFix();
