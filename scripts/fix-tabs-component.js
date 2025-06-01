const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Files to update
const filesToUpdate = [
  'src/app/assessment/templates/page.tsx',
  'src/app/assessment/templates/create/page.tsx',
  'src/app/assessment/preview/[id]/page.tsx',
  'src/app/assessment/results/[id]/page.tsx',
  'src/app/assessment/pupil-voice/results/[id]/page.tsx',
  'src/app/assessment/pupil-voice/preview/[id]/page.tsx',
  'src/app/assessment/create/page.tsx',
  'src/app/assessment/curriculum/page.tsx',
  'src/app/assessment/ai-generate/page.tsx'
];

async function updateFile(filePath) {
  try {
    // Read the file
    const fullPath = path.join(process.cwd(), filePath);
    const content = await readFile(fullPath, 'utf8');

    // Update the import
    let updatedContent = content.replace(
      /import\s*{\s*([^}]*)\bTabs\b([^}]*)\s*}\s*from\s*['"]@\/components\/ui\/tabs['"];/,
      'import { $1SimpleTabs$2 } from \'@/components/ui/tabs\';'
    );

    // Update the component usage
    updatedContent = updatedContent.replace(
      /<Tabs(\s+)tabs={/g,
      '<SimpleTabs$1tabs={'
    );

    // Write the updated content back to the file
    await writeFile(fullPath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Updating Tabs component usage...');
  
  for (const file of filesToUpdate) {
    await updateFile(file);
  }
  
  console.log('Done!');
}

main().catch(console.error);