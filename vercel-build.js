/**
 * Simplified Vercel Build Script for EdPsych Connect Platform
 * Ensures clean build with proper environment setup
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
async function buildPlatform() {
  try {
    log('🚀 Starting EdPsych Connect Platform build...', colors.cyan);
    
    // Set essential environment variables
    process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = 'default';
    process.env.BUILD_TENANT_CONTEXT_SET = 'true';
    process.env.TENANT_CONTEXT_BYPASS_DB = 'true';
    process.env.SKIP_DB_OPERATIONS = 'true';
    process.env.NODE_ENV = 'production';
    
    log('✅ Environment variables configured', colors.green);
    
    // Generate Prisma client
    log('🔧 Generating Prisma client...', colors.cyan);
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      log('✅ Prisma client generated successfully', colors.green);
    } catch (error) {
      log('⚠️ Prisma generation failed, continuing with build...', colors.yellow);
    }
    
    // Run Next.js build
    log('🏗️ Building Next.js application...', colors.cyan);
    execSync('npx next build', { stdio: 'inherit' });
    log('✅ Next.js build completed successfully', colors.green);
    
    // Verify build output
    const buildDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(buildDir)) {
      log('✅ Build output verified - .next directory exists', colors.green);
      
      // Check for static files
      const staticDir = path.join(buildDir, 'static');
      if (fs.existsSync(staticDir)) {
        log('✅ Static assets generated successfully', colors.green);
      }
      
      // Check for server files
      const serverDir = path.join(buildDir, 'server');
      if (fs.existsSync(serverDir)) {
        log('✅ Server files generated successfully', colors.green);
      }
    } else {
      throw new Error('Build output directory not found');
    }
    
    log('🎉 EdPsych Connect Platform build completed successfully!', colors.green);
    
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

// Run the build
buildPlatform();

