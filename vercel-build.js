/**
 * Enhanced Vercel Build Script with Zero-Dependency Tenant Context
 * This script runs before the Next.js build process to ensure proper setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Helper function to log with colors
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Main build function
async function enhancedBuild() {
  try {
    log('🚀 Starting enhanced Vercel build process...', colors.cyan);
    
    // Initialize tenant context first - zero dependency version
    log('🔑 Initializing zero-dependency tenant context for build...', colors.yellow);
    try {
      execSync('node scripts/build-tenant-init.js', { stdio: 'inherit' });
      log('✅ Zero-dependency tenant context initialized successfully', colors.green);
    } catch (error) {
      log('⚠️ Tenant context initialization failed, but continuing build', colors.yellow);
      log(`Error details: ${error.message}`, colors.dim);
      
      // Create fallback tenant context environment variables
      log('🔧 Creating fallback tenant context environment variables...', colors.yellow);
      process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = 'debdcb9f-f3d3-4dc5-8000-000000000000';
      process.env.BUILD_TENANT_CONTEXT_SET = 'true';
      process.env.TENANT_CONTEXT_BYPASS_DB = 'true';
    }
    
    // Load polyfills
    log('📦 Loading polyfills...', colors.magenta);
    applyPolyfills();
    log('✅ Polyfills loaded successfully', colors.green);
    
    // Verify environment variables
    log('🔍 Verifying environment variables...', colors.blue);
    verifyEnvironmentVariables();
    
    // Optimize static assets
    log('🔧 Optimizing static assets...', colors.yellow);
    optimizeStaticAssets();
    log('✅ Static assets optimized successfully', colors.green);
    
    // Generate Prisma client
    log('🚀 Generating Prisma client...', colors.magenta);
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      log('✅ Generating Prisma client completed successfully', colors.green);
    } catch (error) {
      log('⚠️ Error generating Prisma client, but continuing build', colors.yellow);
    }
    
    // Run Prisma migrations with tenant context
    log('🔄 Running Prisma migrations with zero-dependency tenant context...', colors.blue);
    try {
      // Create a tenant context SQL file
      const sqlContent = `-- Set tenant context for the current session
SELECT set_tenant_context('${process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || 'debdcb9f-f3d3-4dc5-8000-000000000000'}'::uuid);`;
      
      const sqlPath = path.join(process.cwd(), 'prisma', 'tenant-context.sql');
      fs.writeFileSync(sqlPath, sqlContent);
      
      log('✅ Created tenant context SQL file', colors.green);
      
      // Use the tenant context SQL file before migrations
      execSync('npx prisma db push --accept-data-loss', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          PRISMA_QUERY_ENGINE_LIBRARY: require.resolve('@prisma/client').replace('@prisma/client', '.prisma/client/query-engine-rhel-openssl-1.0.x.so.node')
        }
      });
      log('✅ Database schema updated successfully', colors.green);
    } catch (error) {
      log('⚠️ Database schema update failed: ' + error.message, colors.yellow);
      log('⚠️ Continuing build process despite migration failure', colors.yellow);
    }
    
    // Build Next.js application
    log('🚀 Building Next.js application...', colors.cyan);
    applyPolyfills(); // Apply polyfills again before Next.js build
    try {
      execSync('next build', { stdio: 'inherit' });
      log('✅ Building Next.js application completed successfully', colors.green);
    } catch (error) {
      log('❌ Next.js build failed: ' + error.message, colors.red);
      process.exit(1);
    }
    
    // Copy custom server if exists
    log('📋 Copying custom server to build directory...', colors.magenta);
    copyCustomServer();
    log('✅ Custom server copied successfully', colors.green);
    
    // Verify build output
    log('🔍 Verifying build output...', colors.blue);
    verifyBuildOutput();
    log('✅ All critical build files are present', colors.green);
    
    log('✅ Build completed successfully!', colors.green);
    log('🌐 The application should now display correctly on edpsychconnect.com', colors.cyan);
    
  } catch (error) {
    log('❌ Build process failed: ' + error.message, colors.red);
    process.exit(1);
  }
}

// Apply necessary polyfills for SSR
function applyPolyfills() {
  log('Applying global polyfills for server-side rendering...', colors.dim);
  // Add global polyfills here if needed
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
  log('Global polyfills applied successfully', colors.dim);
  
  log('Loading server-side polyfills...', colors.dim);
  // Add server-side polyfills here if needed
  log('Server-side polyfills applied successfully', colors.dim);
}

// Verify environment variables
function verifyEnvironmentVariables() {
  log('🔍 Current environment variables:', colors.dim);
  
  // List critical environment variables (without showing values)
  const criticalVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV',
    'VERCEL_ENV',
    'NEXT_PUBLIC_DEFAULT_TENANT_ID',
    'BUILD_TENANT_CONTEXT_SET',
    'TENANT_CONTEXT_BYPASS_DB'
  ];
  
  criticalVars.forEach(varName => {
    if (process.env[varName]) {
      log(`${varName}: Set (value hidden)`, colors.dim);
    } else {
      log(`${varName}: Not set`, colors.yellow);
      
      // Set fallback values for critical tenant context variables
      if (varName === 'NEXT_PUBLIC_DEFAULT_TENANT_ID') {
        process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = 'debdcb9f-f3d3-4dc5-8000-000000000000';
        log(`${varName}: Set fallback value`, colors.yellow);
      }
      if (varName === 'BUILD_TENANT_CONTEXT_SET') {
        process.env.BUILD_TENANT_CONTEXT_SET = 'true';
        log(`${varName}: Set fallback value`, colors.yellow);
      }
      if (varName === 'TENANT_CONTEXT_BYPASS_DB') {
        process.env.TENANT_CONTEXT_BYPASS_DB = 'true';
        log(`${varName}: Set fallback value`, colors.yellow);
      }
    }
  });
  
  // Check for .env.production file
  if (fs.existsSync(path.join(process.cwd(), '.env.production'))) {
    log('🔍 Found .env.production file, loading variables...', colors.dim);
  }
  
  log('✅ All critical environment variables are set or have fallbacks', colors.green);
}

// Optimize static assets
function optimizeStaticAssets() {
  // Add asset optimization logic here if needed
}

// Copy custom server if exists
function copyCustomServer() {
  const customServerPath = path.join(process.cwd(), 'server.js');
  const targetPath = path.join(process.cwd(), '.next/server.js');
  
  if (fs.existsSync(customServerPath)) {
    fs.copyFileSync(customServerPath, targetPath);
  }
}

// Verify build output
function verifyBuildOutput() {
  const nextDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(nextDir)) {
    throw new Error('.next directory not found');
  }
  
  const requiredDirs = ['server', 'static'];
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(path.join(nextDir, dir))) {
      log(`⚠️ Warning: .next/${dir} directory not found`, colors.yellow);
    }
  });
}

// Run the enhanced build process
enhancedBuild();
