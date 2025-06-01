// Route Validation Script for EdPsych-AI Platform
// This script checks all routes for potential 404 errors and validates asset references

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://edpsychconnect.com';
const PAGES_DIR = path.join(process.cwd(), 'src/app');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(process.cwd(), 'route-validation-report.json');

// Types
interface ValidationResult {
  route: string;
  status: 'success' | 'error' | 'warning';
  statusCode?: number;
  message: string;
  assetReferences?: AssetReference[];
}

interface AssetReference {
  path: string;
  exists: boolean;
  type: 'image' | 'script' | 'stylesheet' | 'other';
}

// Helper functions
function getAllRoutes() {
  const routes: string[] = [];
  
  function scanDirectory(dir: string, basePath: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip special Next.js directories
        if (entry.name.startsWith('_') || entry.name === 'api') continue;
        
        // Handle dynamic routes
        const routePart = entry.name.startsWith('[') && entry.name.endsWith(']') 
          ? 'example-id' // Replace dynamic parts with example values
          : entry.name;
          
        scanDirectory(fullPath, `${basePath}/${routePart}`);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
        routes.push(basePath || '/');
      }
    }
  }
  
  scanDirectory(PAGES_DIR);
  return routes;
}

function checkAssetExists(assetPath: string): boolean {
  // Handle absolute URLs
  if (assetPath.startsWith('http')) {
    return true; // We'll assume external URLs are valid
  }
  
  // Handle relative paths
  const normalizedPath = assetPath.startsWith('/') 
    ? assetPath.substring(1) 
    : assetPath;
    
  return fs.existsSync(path.join(PUBLIC_DIR, normalizedPath));
}

function extractAssetReferences(html: string): AssetReference[] {
  const root = parse(html);
  const assets: AssetReference[] = [];
  
  // Check images
  root.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      assets.push({
        path: src,
        exists: checkAssetExists(src),
        type: 'image'
      });
    }
  });
  
  // Check stylesheets
  root.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      assets.push({
        path: href,
        exists: checkAssetExists(href),
        type: 'stylesheet'
      });
    }
  });
  
  // Check scripts
  root.querySelectorAll('script').forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      assets.push({
        path: src,
        exists: checkAssetExists(src),
        type: 'script'
      });
    }
  });
  
  return assets;
}

// Main validation function
async function validateRoutes() {
  const routes = getAllRoutes();
  const results: ValidationResult[] = [];
  
  console.log(`Found ${routes.length} routes to validate`);
  
  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`Validating route: ${url}`);
    
    try {
      const response = await fetch(url);
      const statusCode = response.status;
      
      if (statusCode === 200) {
        const html = await response.text();
        const assetReferences = extractAssetReferences(html);
        const missingAssets = assetReferences.filter(asset => !asset.exists);
        
        if (missingAssets.length > 0) {
          results.push({
            route,
            status: 'warning',
            statusCode,
            message: `Route accessible but has ${missingAssets.length} missing assets`,
            assetReferences
          });
        } else {
          results.push({
            route,
            status: 'success',
            statusCode,
            message: 'Route accessible with all assets verified',
            assetReferences
          });
        }
      } else {
        results.push({
          route,
          status: 'error',
          statusCode,
          message: `Route returned non-200 status code: ${statusCode}`
        });
      }
    } catch (error) {
      results.push({
        route,
        status: 'error',
        message: `Failed to fetch route: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
  
  // Write results to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  
  // Print summary
  const successful = results.filter(r => r.status === 'success').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log('\nValidation Summary:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`\nDetailed report written to ${OUTPUT_FILE}`);
  
  return results;
}

// Run validation if executed directly
if (require.main === module) {
  validateRoutes().catch(console.error);
}

export { validateRoutes };
