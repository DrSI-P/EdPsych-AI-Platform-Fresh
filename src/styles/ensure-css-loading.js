/**
 * This file ensures that enhanced CSS files are properly included in the build
 * It creates explicit imports that prevent tree-shaking of CSS files
 */

// Import CSS files to ensure they're included in the build
import '../styles/enhanced-globals.css';
import '../styles/enhanced-brand.css';

// Export a dummy function to prevent the file from being tree-shaken
export function ensureCssLoading() {
  console.log('Enhanced CSS files loaded');
  return true;
}
