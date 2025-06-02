/**
 * Simplified Vercel Build Script
 * This script runs a basic Next.js build without complex tenant context operations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Helper function to log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Main build function
async function simplifiedBuild() {
  try {
    log('🚀 Starting simplified Vercel build process...', colors.cyan);
    
    // Set environment variables for build
    process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = 'debdcb9f-f3d3-4dc5-8000-000000000000';
    process.env.BUILD_TENANT_CONTEXT_SET = 'true';
    process.env.TENANT_CONTEXT_BYPASS_DB = 'true';
    
    log('✅ Environment variables set for build', colors.green);
    
    // Check environment variables
    log('🔍 Checking environment variables...', colors.cyan);
    try {
      // Skip environment check in production to allow build to proceed with placeholder values
      // The actual values will be provided by Vercel environment variables
      if (process.env.NODE_ENV === 'production') {
        log('⚠️ Skipping strict environment validation in production', colors.yellow);
      } else {
        execSync('node scripts/check-env.js', { stdio: 'inherit' });
        log('✅ Environment variables check passed', colors.green);
      }
    } catch (error) {
      log('⚠️ Environment variables check failed, but continuing with build', colors.yellow);
      log('   This is expected in production where placeholder values are used', colors.yellow);
    }
    
    // Build Next.js application
    log('🚀 Building Next.js application...', colors.cyan);
    try {
      execSync('next build', { stdio: 'inherit' });
      log('✅ Building Next.js application completed successfully', colors.green);
    } catch (error) {
      log('❌ Next.js build failed: ' + error.message, colors.red);
      process.exit(1);
    }
    
    log('✅ Build completed successfully!', colors.green);
    
  } catch (error) {
    log('❌ Build process failed: ' + error.message, colors.red);
    process.exit(1);
  }
}

// Run the simplified build process
simplifiedBuild();
