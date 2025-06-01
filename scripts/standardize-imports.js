/**
 * Import Standardization Utility
 * 
 * This utility helps standardize imports across the codebase
 * by converting relative imports to absolute imports using path aliases.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Path mappings from tsconfig.json
const PATH_MAPPINGS = {
  '@/components': './src/components',
  '@/lib': './src/lib',
  '@/styles': './src/styles',
  '@/utils': './src/utils',
  '@/hooks': './src/hooks',
  '@/types': './src/types',
  '@/contexts': './src/contexts',
  '@/constants': './src/constants',
  '@/services': './src/services',
  '@/assets': './public/assets',
  '@': './src'
};

// File extensions to process
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Find all TypeScript and JavaScript files
const findFiles = () => {
  const files = [];
  
  FILE_EXTENSIONS.forEach(ext => {
    const pattern = `./src/**/*${ext}`;
    const matches = glob.sync(pattern);
    files.push(...matches);
  });
  
  return files;
};

// Process a file to standardize imports
const processFile = (filePath) => {
  console.log(`Processing ${filePath}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Get directory of the file relative to src
  const fileDir = path.dirname(filePath);
  const relativeToSrc = path.relative('./src', fileDir);
  
  // Regular expression to match relative imports
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+[^;]+|[^;{]*)\s+from\s+['"]([\.\/][^'"]+)['"]/g;
  
  // Replace relative imports with absolute imports
  content = content.replace(importRegex, (match, importPath) => {
    // Skip if the import is a package or already uses an alias
    if (!importPath.startsWith('.') || importPath.startsWith('@/')) {
      return match;
    }
    
    // Resolve the absolute path of the import
    const absolutePath = path.resolve(fileDir, importPath);
    
    // Convert to path relative to project root
    const relativeToRoot = path.relative('.', absolutePath);
    
    // Find the best matching path alias
    let bestMatch = null;
    let bestMatchLength = 0;
    
    for (const [alias, aliasPath] of Object.entries(PATH_MAPPINGS)) {
      const normalizedAliasPath = aliasPath.replace(/^\.\//, '');
      
      if (relativeToRoot.startsWith(normalizedAliasPath) && normalizedAliasPath.length > bestMatchLength) {
        bestMatch = alias;
        bestMatchLength = normalizedAliasPath.length;
      }
    }
    
    // If a matching alias was found, replace the import
    if (bestMatch) {
      const remainingPath = relativeToRoot.slice(bestMatchLength);
      const newImportPath = `${bestMatch}${remainingPath}`;
      
      // Replace the import path in the match
      return match.replace(importPath, newImportPath);
    }
    
    return match;
  });
  
  // Only write to the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
    return true;
  }
  
  return false;
};

// Main function
const main = () => {
  console.log('Starting import standardization...');
  
  const files = findFiles();
  console.log(`Found ${files.length} files to process`);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`Completed import standardization. Updated ${updatedCount} files.`);
};

// Run the script
main();
