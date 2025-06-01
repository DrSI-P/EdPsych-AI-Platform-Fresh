const fs = require('fs');
const path = require('path');

// Paths
const srcDir = path.join(__dirname, '..', 'src');
const educatorDir = path.join(srcDir, 'app', 'educator');
const ukDirPath = path.join(educatorDir, 'calendar-optimisation');
const usDirPath = path.join(educatorDir, 'calendar-optimization');

// Check if UK spelling directory exists
if (fs.existsSync(ukDirPath)) {
  console.log('Found UK spelling directory:', ukDirPath);
  
  // Check if US spelling directory already exists
  if (fs.existsSync(usDirPath)) {
    console.log('US spelling directory already exists:', usDirPath);
    
    // Copy the content from UK to US if US already exists
    const ukPagePath = path.join(ukDirPath, 'page.tsx');
    const usPagePath = path.join(usDirPath, 'page.tsx');
    
    if (fs.existsSync(ukPagePath)) {
      console.log('Copying content from UK page to US page...');
      fs.copyFileSync(ukPagePath, usPagePath);
      console.log('Content copied successfully.');
    }
  } else {
    // Rename the directory from UK to US spelling
    console.log('Renaming directory from UK to US spelling...');
    fs.renameSync(ukDirPath, usDirPath);
    console.log('Directory renamed successfully.');
  }
  
  console.log('Calendar optimization path fix completed.');
} else {
  console.log('UK spelling directory not found:', ukDirPath);
}