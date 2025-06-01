/**
 * Comprehensive script to fix all remaining export issues in the EdPsych-AI-Education-Platform
 * This script addresses:
 * 1. UI Component Export Issues (AlertTitle, TableCaption, ToastAction, etc.)
 * 2. Layout Component Issues (Navbar, Footer)
 * 3. Utility Module Issues (db)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// UI components that need both named and default exports
const uiComponentsToFix = [
  {
    path: 'src/components/ui/alert.tsx',
    namedExports: ['AlertTitle'],
    defaultImplementation: `
export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";`
  },
  {
    path: 'src/components/ui/table.tsx',
    namedExports: ['TableCaption'],
    defaultImplementation: `
export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";`
  },
  {
    path: 'src/components/ui/toast.tsx',
    namedExports: ['ToastAction'],
    defaultImplementation: `
export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitiveAction>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitiveAction>
>(({ className, ...props }, ref) => (
  <ToastPrimitiveAction
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:focus:ring-slate-300",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitiveAction.displayName;`
  },
  {
    path: 'src/components/ui/enhanced-achievement-card.tsx',
    componentName: 'EnhancedAchievementCard',
    createStub: true
  },
  {
    path: 'src/components/ui/enhanced-celebration-overlay.tsx',
    componentName: 'EnhancedCelebrationOverlay',
    createStub: true
  },
  {
    path: 'src/components/ui/AccessibilityControls.tsx',
    componentName: 'AccessibilityControls',
    createStub: true
  },
  {
    path: 'src/components/ui/MultilingualSupport.tsx',
    componentName: 'MultilingualSupport',
    createStub: true
  },
  {
    path: 'src/components/ui/VoiceInput.tsx',
    componentName: 'VoiceInput',
    createStub: true
  }
];

// Layout components that need default exports
const layoutComponentsToFix = [
  {
    path: 'src/components/layout/Navbar.tsx',
    componentName: 'Navbar',
    createStub: true
  },
  {
    path: 'src/components/layout/Footer.tsx',
    componentName: 'Footer',
    createStub: true
  }
];

// Utility modules that need exports
const utilityModulesToFix = [
  {
    path: 'src/lib/db.ts',
    exportName: 'db',
    createStub: true,
    stubContent: `
// Simple in-memory database for development
export const db = {
  users: [],
  sessions: [],
  
  // User methods
  async getUser(id) {
    return this.users.find(user => user.id === id);
  },
  
  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  },
  
  async createUser(userData) {
    const newUser = { id: Date.now().toString(), ...userData };
    this.users.push(newUser);
    return newUser;
  },
  
  async updateUser(id, userData) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    }
    return null;
  },
  
  async deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  },
  
  // Session methods
  async createSession(sessionData) {
    const newSession = { id: Date.now().toString(), ...sessionData };
    this.sessions.push(newSession);
    return newSession;
  },
  
  async getSession(id) {
    return this.sessions.find(session => session.id === id);
  },
  
  async deleteSession(id) {
    const index = this.sessions.findIndex(session => session.id === id);
    if (index !== -1) {
      const deletedSession = this.sessions[index];
      this.sessions.splice(index, 1);
      return deletedSession;
    }
    return null;
  }
};

export default db;`
  }
];

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Function to fix UI component exports
function fixUIComponentExports(componentInfo) {
  console.log(`Processing ${componentInfo.path}...`);
  
  // Check if file exists
  if (!fs.existsSync(componentInfo.path)) {
    if (componentInfo.createStub && componentInfo.componentName) {
      console.log(`  Creating stub for ${componentInfo.path}`);
      ensureDirectoryExists(componentInfo.path);
      
      // Create a stub component with both named and default export
      const stubContent = `"use client";

import React from 'react';

interface ${componentInfo.componentName}Props {
  // Add props as needed
}

export const ${componentInfo.componentName}: React.FC<${componentInfo.componentName}Props> = (props) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">${componentInfo.componentName}</h2>
      <p>This is a stub component for ${componentInfo.componentName}.</p>
      <p>This component will be implemented in future updates.</p>
    </div>
  );
};

export default ${componentInfo.componentName};`;
      
      fs.writeFileSync(componentInfo.path, stubContent, 'utf8');
      console.log(`  Created stub for ${componentInfo.componentName}`);
      return true;
    } else {
      console.log(`  File ${componentInfo.path} does not exist. Skipping.`);
      return false;
    }
  }
  
  // Read the file content
  let content = fs.readFileSync(componentInfo.path, 'utf8');
  let modified = false;
  
  // Add named exports if specified
  if (componentInfo.namedExports && componentInfo.namedExports.length > 0) {
    for (const exportName of componentInfo.namedExports) {
      if (!content.includes(`export const ${exportName}`)) {
        // Add the implementation before the last export
        const lastExportIndex = content.lastIndexOf('export');
        if (lastExportIndex !== -1) {
          content = content.slice(0, lastExportIndex) + 
                   componentInfo.defaultImplementation + 
                   '\n\n' + 
                   content.slice(lastExportIndex);
          console.log(`  Added named export for ${exportName}`);
          modified = true;
        }
      }
    }
  }
  
  // Add default export if it's a component
  if (componentInfo.componentName && !content.includes(`export default ${componentInfo.componentName}`)) {
    // Check if named export exists
    if (content.includes(`export const ${componentInfo.componentName}`)) {
      // Add default export at the end of the file
      content += `\nexport default ${componentInfo.componentName};`;
      console.log(`  Added default export for ${componentInfo.componentName}`);
      modified = true;
    }
  }
  
  // Write the updated content back to the file if modified
  if (modified) {
    fs.writeFileSync(componentInfo.path, content, 'utf8');
    console.log(`  Updated ${componentInfo.path}`);
  } else {
    console.log(`  No changes needed for ${componentInfo.path}`);
  }
  
  return modified;
}

// Function to fix layout component exports
function fixLayoutComponentExports(componentInfo) {
  console.log(`Processing ${componentInfo.path}...`);
  
  // Check if file exists
  if (!fs.existsSync(componentInfo.path)) {
    if (componentInfo.createStub) {
      console.log(`  Creating stub for ${componentInfo.path}`);
      ensureDirectoryExists(componentInfo.path);
      
      // Create a stub component with both named and default export
      const stubContent = `"use client";

import React from 'react';

interface ${componentInfo.componentName}Props {
  // Add props as needed
}

const ${componentInfo.componentName}: React.FC<${componentInfo.componentName}Props> = (props) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">${componentInfo.componentName}</h2>
      <p>This is a stub component for ${componentInfo.componentName}.</p>
    </div>
  );
};

export default ${componentInfo.componentName};`;
      
      fs.writeFileSync(componentInfo.path, stubContent, 'utf8');
      console.log(`  Created stub for ${componentInfo.componentName}`);
      return true;
    } else {
      console.log(`  File ${componentInfo.path} does not exist. Skipping.`);
      return false;
    }
  }
  
  // Read the file content
  let content = fs.readFileSync(componentInfo.path, 'utf8');
  
  // Check if default export already exists
  if (content.includes(`export default ${componentInfo.componentName}`)) {
    console.log(`  Default export already exists for ${componentInfo.componentName}`);
    return false;
  }
  
  // Add default export at the end of the file
  content += `\nexport default ${componentInfo.componentName};`;
  
  // Write the updated content back to the file
  fs.writeFileSync(componentInfo.path, content, 'utf8');
  console.log(`  Added default export for ${componentInfo.componentName}`);
  
  return true;
}

// Function to fix utility module exports
function fixUtilityModuleExports(moduleInfo) {
  console.log(`Processing ${moduleInfo.path}...`);
  
  // Check if file exists
  if (!fs.existsSync(moduleInfo.path)) {
    if (moduleInfo.createStub) {
      console.log(`  Creating stub for ${moduleInfo.path}`);
      ensureDirectoryExists(moduleInfo.path);
      
      // Create a stub module with the required export
      fs.writeFileSync(moduleInfo.path, moduleInfo.stubContent, 'utf8');
      console.log(`  Created stub for ${moduleInfo.path} with export ${moduleInfo.exportName}`);
      return true;
    } else {
      console.log(`  File ${moduleInfo.path} does not exist. Skipping.`);
      return false;
    }
  }
  
  // Read the file content
  let content = fs.readFileSync(moduleInfo.path, 'utf8');
  
  // Check if export already exists
  if (content.includes(`export const ${moduleInfo.exportName}`) || 
      content.includes(`export let ${moduleInfo.exportName}`) || 
      content.includes(`export var ${moduleInfo.exportName}`)) {
    console.log(`  Export already exists for ${moduleInfo.exportName}`);
    return false;
  }
  
  // Add export at the end of the file
  content += `\n${moduleInfo.stubContent}\n`;
  
  // Write the updated content back to the file
  fs.writeFileSync(moduleInfo.path, content, 'utf8');
  console.log(`  Added export for ${moduleInfo.exportName}`);
  
  return true;
}

// Function to update UI index.ts to correctly re-export components
function updateUIIndex() {
  const indexPath = 'src/components/ui/index.ts';
  console.log(`Updating ${indexPath}...`);
  
  if (!fs.existsSync(indexPath)) {
    console.log(`  File ${indexPath} does not exist. Skipping.`);
    return false;
  }
  
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Fix imports for components with default exports
  const componentsWithDefaultExports = [
    'EnhancedAchievementCard',
    'EnhancedCelebrationOverlay',
    'AccessibilityControls',
    'MultilingualSupport',
    'VoiceInput'
  ];
  
  for (const componentName of componentsWithDefaultExports) {
    const importRegex = new RegExp(`import\\s+{\\s*${componentName}\\s*}\\s+from\\s+['"]\\./[^'"]+['"]`, 'g');
    if (importRegex.test(content)) {
      content = content.replace(importRegex, `import ${componentName} from './${componentName}'`);
      console.log(`  Fixed import for ${componentName}`);
    }
  }
  
  // Ensure useToast is imported and exported
  if (!content.includes("import { useToast }")) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;
    
    // Insert the new import after the last import
    content = content.slice(0, lastImportEndIndex) + 
              "\nimport { useToast, toast } from './use-toast';" + 
              content.slice(lastImportEndIndex);
    console.log(`  Added import for useToast`);
  }
  
  // Ensure useToast is exported
  if (!content.includes("useToast,")) {
    // Find the export block
    const exportBlockStart = content.lastIndexOf('export {');
    const exportBlockEnd = content.indexOf('}', exportBlockStart);
    
    // Insert the new export before the closing brace
    content = content.slice(0, exportBlockEnd) + 
              '\n  useToast,\n  toast,' + 
              content.slice(exportBlockEnd);
    console.log(`  Added export for useToast and toast`);
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`  Updated ${indexPath}`);
  
  return true;
}

// Function to fix import statements in app pages
function fixImportStatements() {
  console.log('Fixing import statements in app pages...');
  
  // Find all app page files
  const appPages = glob.sync('src/app/**/*.tsx');
  
  for (const pagePath of appPages) {
    console.log(`Processing ${pagePath}...`);
    
    // Read the file content
    let content = fs.readFileSync(pagePath, 'utf8');
    let modified = false;
    
    // Fix import for useToast from UI components
    const useToastImportRegex = /import\s+{\s*[^}]*useToast[^}]*}\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\/ui['"]/g;
    if (useToastImportRegex.test(content)) {
      content = content.replace(useToastImportRegex, (match) => {
        return match.replace('useToast', '').replace(/{[\s,]*}/, '{ }');
      });
      content = content.replace(/import\s+{\s*}\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\/ui['"];?\n?/g, '');
      content += `\nimport { useToast } from '@/components/ui/use-toast';`;
      modified = true;
      console.log(`  Fixed useToast import in ${pagePath}`);
    }
    
    // Write the updated content back to the file if modified
    if (modified) {
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log(`  Updated ${pagePath}`);
    }
  }
}

// Main function to run all fixes
function runAllFixes() {
  console.log('Starting to fix all remaining export issues...');
  
  // Fix UI component exports
  for (const component of uiComponentsToFix) {
    fixUIComponentExports(component);
  }
  
  // Fix layout component exports
  for (const component of layoutComponentsToFix) {
    fixLayoutComponentExports(component);
  }
  
  // Fix utility module exports
  for (const module of utilityModulesToFix) {
    fixUtilityModuleExports(module);
  }
  
  // Update UI index.ts
  updateUIIndex();
  
  // Fix import statements in app pages
  fixImportStatements();
  
  console.log('Finished fixing all remaining export issues.');
}

// Run all fixes
runAllFixes();
