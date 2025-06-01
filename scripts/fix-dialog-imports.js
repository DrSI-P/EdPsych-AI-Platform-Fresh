const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Function to recursively find all .tsx files
async function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = await findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to fix UK spelling in imports
async function fixDialogImports(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Fix @/components/ui/dialogue imports
    if (content.includes('@/components/ui/dialogue')) {
      content = content.replace(/@\/components\/ui\/dialogue/g, '@/components/ui/dialog');
      modified = true;
      console.log(`Fixed dialogue import in ${filePath}`);
    }
    
    // Fix @/components/ui/alert-dialogue imports
    if (content.includes('@/components/ui/alert-dialogue')) {
      content = content.replace(/@\/components\/ui\/alert-dialogue/g, '@/components/ui/alert-dialog');
      modified = true;
      console.log(`Fixed alert-dialogue import in ${filePath}`);
    }
    
    // Fix Dialogue component references
    if (content.includes('Dialogue')) {
      content = content.replace(/Dialogue/g, 'Dialog');
      modified = true;
      console.log(`Fixed Dialogue component references in ${filePath}`);
    }
    
    // Fix AlertDialogue component references
    if (content.includes('AlertDialogue')) {
      content = content.replace(/AlertDialogue/g, 'AlertDialog');
      modified = true;
      console.log(`Fixed AlertDialogue component references in ${filePath}`);
    }
    
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const tsxFiles = await findTsxFiles(srcDir);
  
  console.log(`Found ${tsxFiles.length} .tsx/.ts files to process`);
  
  let fixedFiles = 0;
  
  for (const file of tsxFiles) {
    const fixed = await fixDialogImports(file);
    if (fixed) {
      fixedFiles++;
    }
  }
  
  console.log(`\nFixed UK spelling in ${fixedFiles} files`);
}

main().catch(console.error);