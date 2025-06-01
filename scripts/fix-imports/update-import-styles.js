/**
 * Script to update import styles in the EdPsych-AI-Education-Platform
 * This script updates import statements to use named imports instead of default imports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Components that need import style updates
const componentsToFix = {
  '@/components/ai/adaptive-complexity/adaptive-complexity-engine': 'AdaptiveComplexityEngine',
  '@/components/heygen/heygen-video-generation': 'HeyGenVideoGeneration',
  '@/components/heygen/heygen-video-library': 'HeyGenVideoLibrary',
  '@/components/ai-avatar/avatar-creator': 'AvatarCreator',
  '@/components/ai-avatar/video-generator': 'VideoGenerator',
};

// Function to update import statements in a file
function updateImports(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check for each component that needs fixing
  Object.entries(componentsToFix).forEach(([importPath, componentName]) => {
    // Match default import pattern
    const defaultImportRegex = new RegExp(`import\\s+${componentName}\\s+from\\s+['"]${importPath.replace('/', '\\/')}['"]`, 'g');
    
    if (defaultImportRegex.test(content)) {
      console.log(`  Found default import of ${componentName} from ${importPath} in ${filePath}`);
      
      // Replace with named import
      content = content.replace(
        defaultImportRegex,
        `import { ${componentName} } from '${importPath}'`
      );
      
      modified = true;
      console.log(`  Updated to named import in ${filePath}`);
    }
  });
  
  // Write the updated content back to the file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Saved changes to ${filePath}`);
    return true;
  }
  
  return false;
}

// Function to scan directories and process files
function scanAndFix() {
  // Install glob if not already installed
  try {
    require.resolve('glob');
  } catch (e) {
    console.log('Installing glob package...');
    require('child_process').execSync('npm install glob --no-save', { stdio: 'inherit' });
  }
  
  let totalFixed = 0;
  
  // Find all TypeScript and JavaScript files in the src/app directory
  const files = glob.sync('src/app/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });
  
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const fixed = updateImports(filePath);
    if (fixed) totalFixed++;
  });
  
  console.log(`\nImport style update complete. Fixed ${totalFixed} files.`);
}

// Run the script
scanAndFix();
