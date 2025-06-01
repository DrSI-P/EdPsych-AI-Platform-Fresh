/**
 * This script fixes imports of the CalendarOptimisation component
 * by replacing UK spelling with US spelling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('Starting calendar component import fixes...');

// Find all files that might import the calendar component
let files = [];
try {
  // Use grep to find files containing the UK spelling import
  const grepCommand = `grep -r "import.*CalendarOptimisation.*from.*@/components/educator/calendar-optimisation" ${srcDir} --include="*.tsx" --include="*.ts"`;
  const grepResult = execSync(grepCommand, { encoding: 'utf8' });
  
  // Parse grep results to get file paths
  files = grepResult.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(':')[0]);
  
  console.log(`Found ${files.length} files with UK spelling imports.`);
} catch (error) {
  // If grep returns no results, it will exit with code 1
  if (error.status !== 1) {
    console.error('Error searching for files:', error.message);
  } else {
    console.log('No files found with UK spelling imports.');
  }
}

// Process each file
let fixedFiles = 0;
for (const filePath of files) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace UK spelling imports with US spelling
    const ukImportRegex = /import\s+{([^}]*)CalendarOptimisation([^}]*?)}\s+from\s+['"]@\/components\/educator\/calendar-optimisation['"]/g;
    const newContent = content.replace(ukImportRegex, 'import {$1CalendarOptimization$2} from \'@/components/educator/calendar-optimization\'');
    
    // Replace UK component usage in JSX
    const ukComponentRegex = /<CalendarOptimisation(\s+[^>]*)?>/g;
    const finalContent = newContent.replace(ukComponentRegex, '<CalendarOptimization$1>');
    
    // Replace closing tags if any
    const ukClosingTagRegex = /<\/CalendarOptimisation>/g;
    const veryFinalContent = finalContent.replace(ukClosingTagRegex, '</CalendarOptimization>');
    
    // Only write if changes were made
    if (content !== veryFinalContent) {
      fs.writeFileSync(filePath, veryFinalContent, 'utf8');
      console.log(`✅ Fixed imports in ${filePath}`);
      fixedFiles++;
    } else {
      console.log(`No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nCalendar component import fixes completed. Fixed ${fixedFiles} files.`);