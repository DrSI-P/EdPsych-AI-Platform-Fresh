/**
 * This script applies all fixes needed for successful Vercel deployment
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const scriptsDir = __dirname;

console.log('Starting application of all fixes...');

// Function to run a script and log its output
function runScript(scriptPath, description) {
  console.log(`\n=== Running ${description} ===`);
  try {
    const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error running ${description}:`);
    console.error(error.message);
    return false;
  }
}

// Run all fix scripts
const fixResults = [
  runScript(path.join(scriptsDir, 'fix-package-names.js'), 'Package Names Fix (UK to US spelling)'),
  runScript(path.join(scriptsDir, 'fix-apostrophes.js'), 'Apostrophes Fix'),
  runScript(path.join(scriptsDir, 'fix-template-literals.js'), 'Template Literals Fix'),
  runScript(path.join(scriptsDir, 'fix-import-statements.js'), 'Import Statements Fix'),
  runScript(path.join(scriptsDir, 'fix-tabs-component.js'), 'Tabs Component Fix'),
  runScript(path.join(scriptsDir, 'fix-dialog-imports.js'), 'Dialog Imports Fix (UK to US spelling)'),
  runScript(path.join(scriptsDir, 'fix-calendar-component-imports.js'), 'Calendar Component Imports Fix (UK to US spelling)'),
  runScript(path.join(scriptsDir, 'fix-calendar-optimization-path.js'), 'Calendar Optimization Path Fix (UK to US spelling)'),
  runScript(path.join(scriptsDir, 'fix-prisma-model-case.js'), 'Prisma Model Case Fix'),
  runScript(path.join(scriptsDir, 'fix-enhanced-typescript-errors.js'), 'Enhanced TypeScript Errors Fix'),
  runScript(path.join(scriptsDir, 'fix-remaining-typescript-errors.js'), 'Remaining TypeScript Errors Fix')
];

// Check if all scripts ran successfully
const allSuccessful = fixResults.every(result => result);

if (allSuccessful) {
  console.log('\n✅ All fixes applied successfully!');
  console.log('\nNext steps:');
  console.log('1. Run npm install to update dependencies');
  console.log('2. Commit and push changes to GitHub');
  console.log('3. Trigger a new Vercel deployment');
} else {
  console.log('\n⚠️ Some fixes failed to apply. Please check the logs above for details.');
}