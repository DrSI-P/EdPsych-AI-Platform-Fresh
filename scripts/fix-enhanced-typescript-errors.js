const fs = require('fs');
const path = require('path');

// Files with specific issues that need fixing
const filesToFix = [
  {
    path: 'src/components/admin/admin-dashboard.tsx',
    issues: ['json-comment']
  },
  {
    path: 'src/components/avatar/avatar-video-integration.tsx',
    issues: ['template-literal', 'curly-apostrophe']
  },
  {
    path: 'src/components/avatar/video-library.tsx',
    issues: ['curly-apostrophe']
  },
  {
    path: 'src/components/analytics/resource-and-assessment-analytics.tsx',
    issues: ['html-syntax']
  },
  {
    path: 'src/components/restorative-justice/outcome-measurement/outcome-measurement-tools.tsx',
    issues: ['curly-apostrophe']
  },
  {
    path: 'src/lib/assessment/feedbackGeneratorService.ts',
    issues: ['curly-apostrophe']
  }
];

// Function to fix specific issues in a file
function fixFile(filePath, issues) {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read the file content
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Fix JSON comments
    if (issues.includes('json-comment')) {
      // Replace JavaScript comments in JSON strings with valid JSON
      const jsonCommentRegex = /(["']?\w+["']?\s*:\s*["']?\{[^}]*)(\/\/[^"'\n]*)(["']?[^}]*\}["']?)/g;
      const newContent = content.replace(jsonCommentRegex, (match, before, comment, after) => {
        return `${before}/* ${comment.substring(2).trim()} */${after}`;
      });
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    // Fix template literals with curly braces
    if (issues.includes('template-literal')) {
      // Replace template literals in string properties that might be confused with JSX
      const templateLiteralRegex = /(['"])(.*?\{\{.*?\}\}.*?)(['"])/g;
      const newContent = content.replace(templateLiteralRegex, (match, openQuote, content, closeQuote) => {
        // Escape the curly braces by doubling them
        const escapedContent = content.replace(/\{\{/g, '{{"{{"}}').replace(/\}\}/g, '{{"}}"}}}');
        return `${openQuote}${escapedContent}${closeQuote}`;
      });
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    // Fix curly apostrophes
    if (issues.includes('curly-apostrophe')) {
      // Replace curly apostrophes with straight apostrophes
      const curlyApostropheRegex = /[']/g;
      const newContent = content.replace(curlyApostropheRegex, "'");
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    // Fix HTML-like syntax in strings
    if (issues.includes('html-syntax')) {
      // Replace HTML-like syntax in strings that might be confused with JSX
      const htmlSyntaxRegex = /(['"])(.*?<.*?>.*?)(['"])/g;
      const newContent = content.replace(htmlSyntaxRegex, (match, openQuote, content, closeQuote) => {
        // Escape the angle brackets
        const escapedContent = content
          .replace(/</g, '{\'<\'}')
          .replace(/>/g, '{\'>\'}}');
        return `${openQuote}${escapedContent}${closeQuote}`;
      });
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    // Write the updated content back to the file
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`  Updated ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function to fix all files
function fixAllFiles() {
  console.log('Starting enhanced TypeScript error fixes...');
  
  for (const file of filesToFix) {
    fixFile(file.path, file.issues);
  }
  
  console.log('Finished enhanced TypeScript error fixes.');
}

// Run the fix
fixAllFiles();