/**
 * This script fixes TypeScript errors in the prisma/seed.ts file
 * by correcting string literals and syntax issues.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const seedFilePath = path.resolve(__dirname, '..', 'prisma', 'seed.ts');

// Process the seed file to fix string literals and syntax issues
function processSeedFile() {
  console.log(`Processing ${seedFilePath}...`);
  
  if (!fs.existsSync(seedFilePath)) {
    console.error(`Error: File not found: ${seedFilePath}`);
    return false;
  }
  
  let content = fs.readFileSync(seedFilePath, 'utf8');
  let updated = false;
  
  // Fix 1: Fix email string literals
  if (content.includes("email: parent2@edpsychconnect.com'")) {
    content = content.replace(/email: parent2@edpsychconnect.com'/g, "email: 'parent2@edpsychconnect.com'");
    updated = true;
  }
  
  // Fix 2: Fix name string literals
  if (content.includes("name: Mary Johnson'")) {
    content = content.replace(/name: Mary Johnson'/g, "name: 'Mary Johnson'");
    updated = true;
  }
  
  // Fix 3: Fix image path string literals
  if (content.includes("image: /avatars/parent2-avatar.png'")) {
    content = content.replace(/image: \/avatars\/parent2-avatar.png'/g, "image: '/avatars/parent2-avatar.png'");
    updated = true;
  }
  
  // Fix 4: Fix credentials string literals
  if (content.includes("type: 'credentials,")) {
    content = content.replace(/type: 'credentials,/g, "type: 'credentials',");
    updated = true;
  }
  
  // Fix 5: Fix provider account ID string literals
  if (content.includes("providerAccountId: 'parent2@edpsychconnect.com,")) {
    content = content.replace(/providerAccountId: 'parent2@edpsychconnect.com,/g, "providerAccountId: 'parent2@edpsychconnect.com',");
    updated = true;
  }
  
  // Fix 6: Fix id_token syntax
  if (content.includes("id_token: parentPassword")) {
    content = content.replace(/id_token: parentPassword/g, "id_token: 'parentPassword'");
    updated = true;
  }
  
  // Fix 7: Add password field to user creation
  if (content.includes("// password field removed as it's not in the schema")) {
    content = content.replace(/\/\/ password field removed as it's not in the schema/g, "password: await hash('password123', 10), // Added password field");
    updated = true;
  }
  
  // Write the fixed content back to the file
  if (updated) {
    fs.writeFileSync(seedFilePath, content, 'utf8');
    console.log(`  Updated ${seedFilePath}`);
    return true;
  }
  
  console.log(`  No issues found in ${seedFilePath}`);
  return false;
}

// Main function
function main() {
  console.log('Starting seed.ts fix...');
  
  const updated = processSeedFile();
  
  if (updated) {
    console.log('\nSeed file fix completed successfully. Please run the TypeScript compiler to verify the changes.');
  } else {
    console.log('\nNo updates were made to the seed file.');
  }
}

// Run the script
main();