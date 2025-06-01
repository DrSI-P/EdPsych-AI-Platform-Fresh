/**
 * This script fixes UK spelling in package names back to US spelling
 * to ensure compatibility with npm registry.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const packageLockPath = path.join(rootDir, 'package-lock.json');

// UK to US spelling mappings for package names
const packageNameMap = {
  'colour': 'color',
  'd3-colour': 'd3-color', // Special case for d3-color package
  'dialogue': 'dialog',
  'behaviour': 'behavior',
  'customise': 'customize',
  'optimise': 'optimize',
  'visualise': 'visualize',
  'analyse': 'analyze',
  'organise': 'organize',
  'recognise': 'recognize',
  'centre': 'center',
  'fibre': 'fiber',
  'licence': 'license',
  'defence': 'defense',
  'offence': 'offense',
  'practise': 'practice',
  'programme': 'program',
  'standardise': 'standardize',
  'synchronise': 'synchronize',
  'theatre': 'theater',
  'traveller': 'traveler',
  'travelling': 'traveling',
  'travelled': 'traveled',
  'labelling': 'labeling',
  'labelled': 'labeled',
  'modelling': 'modeling',
  'modelled': 'modeled',
  'cancelled': 'canceled',
  'cancelling': 'canceling',
  'fulfil': 'fulfill',
  'fulfilment': 'fulfillment',
  'enrolment': 'enrollment',
  'instalment': 'installment',
  'skilful': 'skillful',
  'wilful': 'willful',
  'grey': 'gray'
};

// Process package-lock.json to fix package names
function fixPackageLock() {
  console.log('Checking for package-lock.json...');
  
  if (!fs.existsSync(packageLockPath)) {
    console.log('package-lock.json not found. Skipping.');
    return false;
  }
  
  console.log('Processing package-lock.json...');
  
  let content = fs.readFileSync(packageLockPath, 'utf8');
  let updated = false;
  
  // Special case for d3-colour
  if (content.includes('"d3-colour"') || content.includes('@types/d3-colour')) {
    console.log('  Found d3-colour package references');
    content = content.replace(/d3-colour/g, 'd3-color');
    console.log('  Replaced d3-colour with d3-color');
    updated = true;
  }
  
  // Special case for @zag-js/colour-picker and @zag-js/colour-utils
  if (content.includes('@zag-js/colour-picker') || content.includes('@zag-js/colour-utils')) {
    console.log('  Found @zag-js/colour-* package references');
    content = content.replace(/@zag-js\/colour-/g, '@zag-js/color-');
    console.log('  Replaced @zag-js/colour- with @zag-js/color-');
    updated = true;
  }
  
  // Special case for @zag-js/dialogue
  if (content.includes('@zag-js/dialogue')) {
    console.log('  Found @zag-js/dialogue package references');
    content = content.replace(/@zag-js\/dialogue/g, '@zag-js/dialog');
    console.log('  Replaced @zag-js/dialogue with @zag-js/dialog');
    updated = true;
  }
  
  // Special case for @radix-ui/react-dialogue
  if (content.includes('@radix-ui/react-dialogue')) {
    console.log('  Found @radix-ui/react-dialogue package references');
    content = content.replace(/@radix-ui\/react-dialogue/g, '@radix-ui/react-dialog');
    console.log('  Replaced @radix-ui/react-dialogue with @radix-ui/react-dialog');
    updated = true;
  }
  
  // Special case for @radix-ui/react-alert-dialogue
  if (content.includes('@radix-ui/react-alert-dialogue')) {
    console.log('  Found @radix-ui/react-alert-dialogue package references');
    content = content.replace(/@radix-ui\/react-alert-dialogue/g, '@radix-ui/react-alert-dialog');
    console.log('  Replaced @radix-ui/react-alert-dialogue with @radix-ui/react-alert-dialog');
    updated = true;
  }
  
  // Fix resolved URLs for @zag-js packages - direct replacements for the specific URLs
  if (content.includes('registry.npmjs.org/@zag-js/color-picker/-/colour-picker') ||
      content.includes('registry.npmjs.org/@zag-js/color-utils/-/colour-utils')) {
    console.log('  Found @zag-js resolved URLs with UK spelling');
    
    // Direct replacement for color-picker URL
    if (content.includes('registry.npmjs.org/@zag-js/color-picker/-/colour-picker')) {
      content = content.replace(
        'https://registry.npmjs.org/@zag-js/color-picker/-/colour-picker-1.12.2.tgz',
        'https://registry.npmjs.org/@zag-js/color-picker/-/color-picker-1.12.2.tgz'
      );
      console.log('  Fixed @zag-js/color-picker resolved URL');
    }
    
    // Direct replacement for color-utils URL
    if (content.includes('registry.npmjs.org/@zag-js/color-utils/-/colour-utils')) {
      content = content.replace(
        'https://registry.npmjs.org/@zag-js/color-utils/-/colour-utils-1.12.2.tgz',
        'https://registry.npmjs.org/@zag-js/color-utils/-/color-utils-1.12.2.tgz'
      );
      console.log('  Fixed @zag-js/color-utils resolved URL');
    }
    
    updated = true;
  }
  
  // Special case for colour-support
  if (content.includes('"colour-support"')) {
    console.log('  Found colour-support package references');
    content = content.replace(/colour-support/g, 'color-support');
    console.log('  Replaced colour-support with color-support');
    updated = true;
  }
  
  // Fix resolved URLs for @radix-ui and @zag-js packages
  if (content.includes('registry.npmjs.org/@radix-ui/react-dialog/-/react-dialogue') ||
      content.includes('registry.npmjs.org/@radix-ui/react-alert-dialog/-/react-alert-dialogue') ||
      content.includes('registry.npmjs.org/@zag-js/dialog/-/dialogue')) {
    console.log('  Found resolved URLs with UK spelling');
    
    // Generic replacement for react-dialog URLs with any version number
    const reactDialogRegex = /https:\/\/registry\.npmjs\.org\/@radix-ui\/react-dialog\/-\/react-dialogue-([0-9]+\.[0-9]+\.[0-9]+)\.tgz/g;
    if (reactDialogRegex.test(content)) {
      content = content.replace(reactDialogRegex, (match, version) => {
        console.log(`  Fixed @radix-ui/react-dialog resolved URL for version ${version}`);
        return `https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-${version}.tgz`;
      });
    }
    
    // Generic replacement for react-alert-dialog URLs with any version number
    const reactAlertDialogRegex = /https:\/\/registry\.npmjs\.org\/@radix-ui\/react-alert-dialog\/-\/react-alert-dialogue-([0-9]+\.[0-9]+\.[0-9]+)\.tgz/g;
    if (reactAlertDialogRegex.test(content)) {
      content = content.replace(reactAlertDialogRegex, (match, version) => {
        console.log(`  Fixed @radix-ui/react-alert-dialog resolved URL for version ${version}`);
        return `https://registry.npmjs.org/@radix-ui/react-alert-dialog/-/react-alert-dialog-${version}.tgz`;
      });
    }
    
    // Generic replacement for @zag-js/dialog URLs with any version number
    const zagJsDialogRegex = /https:\/\/registry\.npmjs\.org\/@zag-js\/dialog\/-\/dialogue-([0-9]+\.[0-9]+\.[0-9]+)\.tgz/g;
    if (zagJsDialogRegex.test(content)) {
      content = content.replace(zagJsDialogRegex, (match, version) => {
        console.log(`  Fixed @zag-js/dialog resolved URL for version ${version}`);
        return `https://registry.npmjs.org/@zag-js/dialog/-/dialog-${version}.tgz`;
      });
    }
    
    updated = true;
  }
  
  // Replace UK spellings with US spellings in package names
  for (const [uk, us] of Object.entries(packageNameMap)) {
    // Skip d3-colour as it's handled separately
    if (uk === 'd3-colour') continue;
    
    // Check for direct package name match (e.g., "colour" itself)
    const directPattern = new RegExp(`"${uk}"`, 'g');
    if (directPattern.test(content)) {
      console.log(`  Found direct UK spelling package name: ${uk}`);
      content = content.replace(directPattern, (match) => {
        console.log(`  Replacing with US spelling: "${us}"`);
        return `"${us}"`;
      });
      updated = true;
    }
    
    // Create regex patterns to match package names with UK spelling
    const patterns = [
      new RegExp(`"${uk}-name"`, 'g'),
      new RegExp(`"${uk}-convert"`, 'g'),
      new RegExp(`"${uk}-string"`, 'g'),
      new RegExp(`"${uk}-space"`, 'g'),
      new RegExp(`"supports-${uk}"`, 'g'),
      new RegExp(`"${uk}-picker"`, 'g'),
      new RegExp(`"${uk}-scheme"`, 'g'),
      new RegExp(`"${uk}-keywords"`, 'g'),
      new RegExp(`"${uk}-hash"`, 'g'),
      new RegExp(`"${uk}-fill"`, 'g'),
      new RegExp(`"${uk}-convert"`, 'g'),
      new RegExp(`"${uk}-adjust"`, 'g'),
      new RegExp(`"${uk}-parse"`, 'g'),
      new RegExp(`"${uk}-js"`, 'g'),
      new RegExp(`"${uk}-rgba"`, 'g'),
      new RegExp(`"${uk}-hex"`, 'g'),
      new RegExp(`"${uk}-alpha"`, 'g'),
      new RegExp(`"${uk}-modes"`, 'g'),
      new RegExp(`"${uk}-interpolate"`, 'g'),
      new RegExp(`"${uk}-diff"`, 'g'),
      new RegExp(`"${uk}-map"`, 'g'),
      new RegExp(`"${uk}-scale"`, 'g'),
      new RegExp(`"${uk}-temperature"`, 'g'),
      new RegExp(`"${uk}-contrast"`, 'g'),
      new RegExp(`"${uk}-luminance"`, 'g'),
      new RegExp(`"${uk}-convert"`, 'g'),
      new RegExp(`"${uk}-string"`, 'g'),
      new RegExp(`"${uk}-space"`, 'g'),
      new RegExp(`"${uk}-namer"`, 'g'),
      new RegExp(`"${uk}-blind"`, 'g'),
      new RegExp(`"${uk}-picker"`, 'g'),
      new RegExp(`"${uk}-scheme"`, 'g'),
      new RegExp(`"${uk}-keywords"`, 'g'),
      new RegExp(`"${uk}-hash"`, 'g'),
      new RegExp(`"${uk}-fill"`, 'g'),
      new RegExp(`"${uk}-convert"`, 'g'),
      new RegExp(`"${uk}-adjust"`, 'g'),
      new RegExp(`"${uk}-parse"`, 'g'),
      new RegExp(`"${uk}-js"`, 'g'),
      new RegExp(`"${uk}-rgba"`, 'g'),
      new RegExp(`"${uk}-hex"`, 'g'),
      new RegExp(`"${uk}-alpha"`, 'g'),
      new RegExp(`"${uk}-modes"`, 'g'),
      new RegExp(`"${uk}-interpolate"`, 'g'),
      new RegExp(`"${uk}-diff"`, 'g'),
      new RegExp(`"${uk}-map"`, 'g'),
      new RegExp(`"${uk}-scale"`, 'g'),
      new RegExp(`"${uk}-temperature"`, 'g'),
      new RegExp(`"${uk}-contrast"`, 'g'),
      new RegExp(`"${uk}-luminance"`, 'g')
    ];
    
    for (const pattern of patterns) {
      const usPattern = pattern.source.replace(uk, us);
      const usRegex = new RegExp(usPattern.substring(1, usPattern.length - 1), 'g');
      
      if (pattern.test(content)) {
        console.log(`  Found UK spelling in package name: ${pattern.source}`);
        content = content.replace(pattern, (match) => {
          console.log(`  Replacing with US spelling: ${match.replace(uk, us)}`);
          return match.replace(uk, us);
        });
        updated = true;
      }
    }
  }
  
  // Also fix URLs to npm registry
  for (const [uk, us] of Object.entries(packageNameMap)) {
    // Fix direct package URLs (e.g., https://registry.npmjs.org/colour/-/colour-3.2.1.tgz)
    const directUrlPattern = new RegExp(`https://registry.npmjs.org/${uk}/-/${uk}-`, 'g');
    if (directUrlPattern.test(content)) {
      console.log(`  Found direct UK spelling in npm URL: ${uk}`);
      content = content.replace(directUrlPattern, (match) => {
        const newUrl = match.replace(new RegExp(uk, 'g'), us);
        console.log(`  Replacing with US spelling URL: ${newUrl}`);
        return newUrl;
      });
      updated = true;
    }
    
    // Fix package URLs with prefixes
    const urlPattern = new RegExp(`https://registry.npmjs.org/${uk}-([^/]+)/-/${uk}-`, 'g');
    if (urlPattern.test(content)) {
      console.log(`  Found UK spelling in npm URL: ${uk}`);
      content = content.replace(urlPattern, (match) => {
        const newUrl = match.replace(new RegExp(uk, 'g'), us);
        console.log(`  Replacing with US spelling URL: ${newUrl}`);
        return newUrl;
      });
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(packageLockPath, content, 'utf8');
    console.log(`  Updated package-lock.json`);
    return true;
  }
  
  console.log('  No package name issues found in package-lock.json');
  return false;
}

// Process yarn.lock if it exists
function fixYarnLock() {
  const yarnLockPath = path.join(rootDir, 'yarn.lock');
  
  console.log('Checking for yarn.lock...');
  
  if (!fs.existsSync(yarnLockPath)) {
    console.log('yarn.lock not found. Skipping.');
    return false;
  }
  
  console.log('Processing yarn.lock...');
  
  let content = fs.readFileSync(yarnLockPath, 'utf8');
  let updated = false;
  
  // Replace UK spellings with US spellings in package names
  for (const [uk, us] of Object.entries(packageNameMap)) {
    // Check for direct package name
    const directPattern = new RegExp(`${uk}@`, 'g');
    if (directPattern.test(content)) {
      console.log(`  Found direct UK spelling in package name: ${uk}`);
      content = content.replace(directPattern, (match) => {
        const newName = match.replace(uk, us);
        console.log(`  Replacing with US spelling: ${newName}`);
        return newName;
      });
      updated = true;
    }
    
    // Check for package names with prefixes
    const pattern = new RegExp(`${uk}-([a-zA-Z0-9-]+)@`, 'g');
    if (pattern.test(content)) {
      console.log(`  Found UK spelling in package name: ${uk}`);
      content = content.replace(pattern, (match) => {
        const newName = match.replace(uk, us);
        console.log(`  Replacing with US spelling: ${newName}`);
        return newName;
      });
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(yarnLockPath, content, 'utf8');
    console.log(`  Updated yarn.lock`);
    return true;
  }
  
  console.log('  No package name issues found in yarn.lock');
  return false;
}

// Main function
function main() {
  console.log('Starting package name fix...');
  
  const packageLockUpdated = fixPackageLock();
  const yarnLockUpdated = fixYarnLock();
  
  if (packageLockUpdated || yarnLockUpdated) {
    console.log('\nPackage name fix completed successfully.');
    console.log('Please run npm install or yarn install to update your dependencies.');
  } else {
    console.log('\nNo package name issues found.');
  }
}

// Run the script
main();