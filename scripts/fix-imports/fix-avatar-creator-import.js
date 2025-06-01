/**
 * Script to fix AvatarCreator and VideoGenerator imports in the EdPsych-AI-Education-Platform
 * This script updates import statements in the ai-avatar page
 */

const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(process.cwd(), 'src/app/ai-avatar/page.tsx');

// Function to fix the imports
function fixImports() {
  console.log(`Processing ${filePath}...`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist.`);
    return false;
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update import statements
  let modified = false;
  
  // Fix AvatarCreator import
  if (content.includes('import AvatarCreator from')) {
    content = content.replace(
      /import\s+AvatarCreator\s+from\s+['"]@\/components\/ai-avatar\/avatar-creator['"]/g,
      "import { AvatarCreator } from '@/components/ai-avatar/avatar-creator'"
    );
    modified = true;
    console.log('  Updated AvatarCreator import to use named import');
  }
  
  // Fix VideoGenerator import
  if (content.includes('import VideoGenerator from')) {
    content = content.replace(
      /import\s+VideoGenerator\s+from\s+['"]@\/components\/ai-avatar\/video-generator['"]/g,
      "import { VideoGenerator } from '@/components/ai-avatar/video-generator'"
    );
    modified = true;
    console.log('  Updated VideoGenerator import to use named import');
  }
  
  // Write the updated content back to the file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Saved changes to ${filePath}`);
    return true;
  }
  
  console.log('  No changes needed');
  return false;
}

// Run the script
fixImports();
