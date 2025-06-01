/**
 * Script to fix import/export mismatches in the EdPsych-AI-Education-Platform
 * This script addresses two main issues:
 * 1. Default vs Named Export Mismatches
 * 2. Missing Exports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files with components that need default exports
const componentsNeedingDefaultExports = [
  {
    path: 'src/components/ai/adaptive-complexity/adaptive-complexity-engine.tsx',
    componentName: 'AdaptiveComplexityEngine'
  },
  {
    path: 'src/components/heygen/heygen-video-generation.tsx',
    componentName: 'HeyGenVideoGeneration'
  },
  {
    path: 'src/components/heygen/heygen-video-library.tsx',
    componentName: 'HeyGenVideoLibrary'
  },
  // These files might not exist yet, but we'll check and create stubs if needed
  {
    path: 'src/components/blog/educational-ai-blog.tsx',
    componentName: 'EducationalAIBlog',
    createStub: true
  },
  {
    path: 'src/components/educator/smart-lesson-planning.tsx',
    componentName: 'SmartLessonPlanning',
    createStub: true
  },
  {
    path: 'src/components/special-needs/emotional-regulation/emotional-regulation-engine.tsx',
    componentName: 'EmotionalRegulationEngine',
    createStub: true
  },
  {
    path: 'src/components/special-needs/personalized-interventions/personalized-interventions-engine.tsx',
    componentName: 'PersonalizedInterventionsEngine',
    createStub: true
  },
  {
    path: 'src/components/special-needs/progress-monitoring/progress-monitoring-engine.tsx',
    componentName: 'ProgressMonitoringEngine',
    createStub: true
  }
];

// Files with missing exports
const missingExports = [
  {
    path: 'src/lib/adaptive-complexity/types.ts',
    exportName: 'ComplexityLevel',
    exportType: 'type',
    defaultValue: `
export enum ComplexityLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}`
  },
  {
    path: 'src/services/ai-avatar-video-service.ts',
    exportName: 'AIAvatarVideoService',
    exportType: 'class'
  }
];

// Add useToast to UI components
const uiComponentsToUpdate = [
  {
    path: 'src/components/ui/index.ts',
    importToAdd: "import { useToast } from './use-toast';",
    exportToAdd: 'useToast,'
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

// Function to add default export to a component file
function addDefaultExport(filePath, componentName, createStub = false) {
  console.log(`Processing ${filePath} for ${componentName}...`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    if (createStub) {
      console.log(`  Creating stub for ${filePath}`);
      ensureDirectoryExists(filePath);
      
      // Create a stub component with both named and default export
      const stubContent = `"use client";

import React from 'react';

interface ${componentName}Props {
  // Add props as needed
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">${componentName}</h2>
      <p>This is a stub component for ${componentName}.</p>
      <p>This component will be implemented in future updates.</p>
    </div>
  );
};

export default ${componentName};`;
      
      fs.writeFileSync(filePath, stubContent, 'utf8');
      console.log(`  Created stub for ${componentName}`);
      return true;
    } else {
      console.log(`  File ${filePath} does not exist. Skipping.`);
      return false;
    }
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if default export already exists
  if (content.includes(`export default ${componentName}`)) {
    console.log(`  Default export already exists for ${componentName}`);
    return false;
  }
  
  // Check if named export exists
  if (!content.includes(`export const ${componentName}`)) {
    console.log(`  Named export not found for ${componentName}. Cannot add default export.`);
    return false;
  }
  
  // Add default export at the end of the file
  content += `\nexport default ${componentName};`;
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Added default export for ${componentName}`);
  
  return true;
}

// Function to add missing exports
function addMissingExport(filePath, exportName, exportType, defaultValue = null) {
  console.log(`Processing ${filePath} for ${exportName}...`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    if (defaultValue) {
      console.log(`  Creating file with default export for ${exportName}`);
      ensureDirectoryExists(filePath);
      fs.writeFileSync(filePath, defaultValue, 'utf8');
      console.log(`  Created file with export for ${exportName}`);
      return true;
    } else {
      console.log(`  File ${filePath} does not exist and no default value provided. Skipping.`);
      return false;
    }
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if export already exists
  if (content.includes(`export ${exportType === 'type' ? 'type ' : ''}${exportName}`)) {
    console.log(`  Export already exists for ${exportName}`);
    return false;
  }
  
  // If it's a class, check if the class exists but isn't exported
  if (exportType === 'class' && content.includes(`class ${exportName}`)) {
    // Add export keyword to the class definition
    content = content.replace(
      new RegExp(`class\\s+${exportName}`),
      `export class ${exportName}`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Added export keyword to class ${exportName}`);
    return true;
  }
  
  // If we have a default value and the export doesn't exist, add it
  if (defaultValue) {
    // Add the export at the end of the file
    content += `\n${defaultValue}\n`;
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Added export for ${exportName}`);
    return true;
  }
  
  console.log(`  Could not add export for ${exportName}. No default value provided.`);
  return false;
}

// Function to update UI components
function updateUIComponents(filePath, importToAdd, exportToAdd) {
  console.log(`Processing ${filePath}...`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`  File ${filePath} does not exist. Skipping.`);
    return false;
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if import already exists
  if (!content.includes(importToAdd)) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;
    
    // Insert the new import after the last import
    content = content.slice(0, lastImportEndIndex) + '\n' + importToAdd + content.slice(lastImportEndIndex);
    console.log(`  Added import: ${importToAdd}`);
  }
  
  // Check if export already exists
  if (!content.includes(exportToAdd)) {
    // Find the export block
    const exportBlockStart = content.lastIndexOf('export {');
    const exportBlockEnd = content.indexOf('}', exportBlockStart);
    
    // Insert the new export before the closing brace
    content = content.slice(0, exportBlockEnd) + '\n  ' + exportToAdd + content.slice(exportBlockEnd);
    console.log(`  Added export: ${exportToAdd}`);
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Updated ${filePath}`);
  
  return true;
}

// Function to create use-toast.tsx if it doesn't exist
function createUseToastIfNeeded() {
  const filePath = path.join(process.cwd(), 'src/components/ui/use-toast.tsx');
  
  if (fs.existsSync(filePath)) {
    console.log(`use-toast.tsx already exists.`);
    return;
  }
  
  console.log(`Creating use-toast.tsx...`);
  
  const content = `"use client";

import * as React from "react";

import { ToastActionElement, ToastProps } from "./toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

export { useToast, toast };`;
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created use-toast.tsx`);
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
    
    // Fix import statements for components with default exports
    for (const component of componentsNeedingDefaultExports) {
      const importRegex = new RegExp(`import\\s+${component.componentName}\\s+from\\s+['"]([^'"]+)['"]`, 'g');
      if (importRegex.test(content)) {
        content = content.replace(importRegex, (match, importPath) => {
          return `import ${component.componentName} from '${importPath}'`;
        });
        modified = true;
        console.log(`  Fixed import for ${component.componentName} in ${pagePath}`);
      }
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
  console.log('Starting to fix import/export mismatches...');
  
  // Add default exports to components
  for (const component of componentsNeedingDefaultExports) {
    addDefaultExport(component.path, component.componentName, component.createStub);
  }
  
  // Add missing exports
  for (const exportInfo of missingExports) {
    addMissingExport(exportInfo.path, exportInfo.exportName, exportInfo.exportType, exportInfo.defaultValue);
  }
  
  // Create use-toast.tsx if needed
  createUseToastIfNeeded();
  
  // Update UI components
  for (const uiComponent of uiComponentsToUpdate) {
    updateUIComponents(uiComponent.path, uiComponent.importToAdd, uiComponent.exportToAdd);
  }
  
  // Fix import statements in app pages
  fixImportStatements();
  
  console.log('Finished fixing import/export mismatches.');
}

// Run all fixes
runAllFixes();
