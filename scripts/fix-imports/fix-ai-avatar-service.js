/**
 * Script to fix AIAvatarVideoService export in the EdPsych-AI-Education-Platform
 * This script adds the missing export to the ai-avatar-video-service.ts file
 */

const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(process.cwd(), 'src/services/ai-avatar-video-service.ts');

// Function to fix the export
function fixExport() {
  console.log(`Processing ${filePath}...`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist.`);
    return false;
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if AIAvatarVideoService is already exported
  if (content.includes('export class AIAvatarVideoService')) {
    console.log(`AIAvatarVideoService is already exported in ${filePath}`);
    return false;
  }
  
  // Add export to the class definition
  content = content.replace(
    /class\s+AIAvatarVideoService/g,
    'export class AIAvatarVideoService'
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added export to AIAvatarVideoService in ${filePath}`);
  
  return true;
}

// Run the script
fixExport();
