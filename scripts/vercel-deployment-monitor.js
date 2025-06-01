#!/usr/bin/env node

/**
 * Vercel Deployment Monitor
 * 
 * This script helps monitor and troubleshoot Vercel deployments for the
 * EdPsych-AI-Education-Platform by providing guidance and checking for
 * common deployment issues.
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const projectName = 'edpsych-ai-education-platform';
const deploymentId = process.argv[2] || 'latest';
const configFiles = [
  'vercel.json',
  'next.config.js',
  'package.json'
];

// ANSI colour codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Main function to run the deployment monitor
 */
async function monitorDeployment() {
  console.log(`${colors.bright}${colors.blue}EdPsych-AI-Education-Platform${colors.reset}`);
  console.log(`${colors.bright}Vercel Deployment Monitor${colors.reset}\n`);
  
  // Check for configuration files
  checkConfigurationFiles();
  
  // Check package.json for potential issues
  checkPackageJson();
  
  // Check Next.js configuration
  checkNextConfig();
  
  // Check Vercel configuration
  checkVercelConfig();
  
  // Display deployment status information
  displayDeploymentStatus();
  
  // Provide troubleshooting guidance
  provideTroubleshootingGuidance();
}

/**
 * Check if all required configuration files exist
 */
function checkConfigurationFiles() {
  console.log(`${colors.cyan}Checking configuration files...${colors.reset}`);
  
  let allFilesExist = true;
  
  configFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`  ${colors.green}✓${colors.reset} ${file} found`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} ${file} not found`);
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.log(`\n  ${colors.yellow}Warning:${colors.reset} Some configuration files are missing.`);
    console.log(`  This may cause deployment failures.`);
  }
  
  console.log('');
}

/**
 * Check package.json for potential issues
 */
function checkPackageJson() {
  console.log(`${colors.cyan}Analysing package.json...${colors.reset}`);
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check Node.js version
    if (packageJson.engines && packageJson.engines.node) {
      console.log(`  ${colors.green}✓${colors.reset} Node.js version specified: ${packageJson.engines.node}`);
    } else {
      console.log(`  ${colors.yellow}!${colors.reset} No Node.js version specified in engines field`);
      console.log(`    Consider adding: "engines": { "node": ">=16.x" }`);
    }
    
    // Check build script
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log(`  ${colors.green}✓${colors.reset} Build script found: "${packageJson.scripts.build}"`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} No build script found in package.json`);
      console.log(`    This will cause deployment failure. Add: "scripts": { "build": "next build" }`);
    }
    
    // Check for excessive dependencies
    const depsCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepsCount = Object.keys(packageJson.devDependencies || {}).length;
    
    if (depsCount > 50) {
      console.log(`  ${colors.yellow}!${colors.reset} Large number of dependencies (${depsCount})`);
      console.log(`    This may increase build time and complexity`);
    } else {
      console.log(`  ${colors.green}✓${colors.reset} Reasonable number of dependencies (${depsCount})`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ${colors.red}Error analysing package.json:${colors.reset} ${error.message}\n`);
  }
}

/**
 * Check Next.js configuration for potential issues
 */
function checkNextConfig() {
  console.log(`${colors.cyan}Analysing Next.js configuration...${colors.reset}`);
  
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for potential issues in next.config.js
      if (nextConfigContent.includes('experimental')) {
        console.log(`  ${colors.yellow}!${colors.reset} Experimental features detected in next.config.js`);
        console.log(`    These may cause deployment issues on Vercel`);
      } else {
        console.log(`  ${colors.green}✓${colors.reset} No experimental features detected`);
      }
      
      if (nextConfigContent.includes('webpack')) {
        console.log(`  ${colors.yellow}!${colors.reset} Custom webpack configuration detected`);
        console.log(`    Complex webpack configurations may cause build issues`);
      } else {
        console.log(`  ${colors.green}✓${colors.reset} No custom webpack configuration detected`);
      }
      
      // Check for internationalization
      if (nextConfigContent.includes('i18n')) {
        console.log(`  ${colors.green}✓${colors.reset} Internationalization (i18n) configuration found`);
      }
    } else {
      console.log(`  ${colors.yellow}!${colors.reset} next.config.js not found, using default configuration`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ${colors.red}Error analysing Next.js configuration:${colors.reset} ${error.message}\n`);
  }
}

/**
 * Check Vercel configuration for potential issues
 */
function checkVercelConfig() {
  console.log(`${colors.cyan}Analysing Vercel configuration...${colors.reset}`);
  
  try {
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    if (fs.existsSync(vercelConfigPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      // Check for version
      if (vercelConfig.version === 2) {
        console.log(`  ${colors.green}✓${colors.reset} Vercel configuration version 2 detected`);
      } else {
        console.log(`  ${colors.yellow}!${colors.reset} Vercel configuration version should be 2`);
      }
      
      // Check for framework
      if (vercelConfig.framework === 'nextjs') {
        console.log(`  ${colors.green}✓${colors.reset} Framework correctly set to nextjs`);
      } else if (vercelConfig.framework) {
        console.log(`  ${colors.yellow}!${colors.reset} Framework set to ${vercelConfig.framework}, should be nextjs`);
      } else {
        console.log(`  ${colors.yellow}!${colors.reset} No framework specified in vercel.json`);
      }
      
      // Check for complex configuration
      const configKeys = Object.keys(vercelConfig);
      const complexKeys = ['routes', 'builds', 'functions', 'rewrites', 'cleanUrls', 'trailingSlash', 'redirects', 'headers'];
      const hasComplexConfig = complexKeys.some(key => configKeys.includes(key));
      
      if (hasComplexConfig) {
        console.log(`  ${colors.yellow}!${colors.reset} Complex configuration detected in vercel.json`);
        console.log(`    Consider simplifying for initial deployment`);
      } else {
        console.log(`  ${colors.green}✓${colors.reset} Simple configuration detected in vercel.json`);
      }
    } else {
      console.log(`  ${colors.yellow}!${colors.reset} vercel.json not found, using default configuration`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ${colors.red}Error analysing Vercel configuration:${colors.reset} ${error.message}\n`);
  }
}

/**
 * Display deployment status information
 */
function displayDeploymentStatus() {
  console.log(`${colors.cyan}Deployment Status Information${colors.reset}`);
  console.log(`  Project: ${colors.bright}${projectName}${colors.reset}`);
  console.log(`  Deployment ID: ${deploymentId}`);
  console.log(`  Minimal Test Page: ${colors.bright}/test-deployment${colors.reset}`);
  console.log('');
  
  console.log(`${colors.yellow}Note:${colors.reset} This script cannot directly access Vercel deployment status.`);
  console.log(`To check actual deployment status, please visit the Vercel dashboard.`);
  console.log('');
}

/**
 * Provide troubleshooting guidance
 */
function provideTroubleshootingGuidance() {
  console.log(`${colors.cyan}${colors.bright}Troubleshooting Guidance${colors.reset}`);
  
  console.log(`\n${colors.bright}Common Deployment Issues:${colors.reset}`);
  console.log(`  1. ${colors.yellow}Build Failures${colors.reset}`);
  console.log(`     • Check build logs in Vercel dashboard`);
  console.log(`     • Verify Node.js version compatibility`);
  console.log(`     • Check for missing dependencies`);
  
  console.log(`\n  2. ${colors.yellow}Environment Variables${colors.reset}`);
  console.log(`     • Ensure all required environment variables are set in Vercel`);
  console.log(`     • Check for client-side vs. server-side variable access`);
  
  console.log(`\n  3. ${colors.yellow}API Route Failures${colors.reset}`);
  console.log(`     • Verify API routes follow Next.js conventions`);
  console.log(`     • Check for serverless function size limits`);
  
  console.log(`\n  4. ${colors.yellow}Static Asset Issues${colors.reset}`);
  console.log(`     • Use relative paths or the public directory for static assets`);
  console.log(`     • Optimise large assets`);
  
  console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
  console.log(`  1. Check if the minimal test page deploys successfully`);
  console.log(`  2. If successful, gradually reintroduce features to identify problematic components`);
  console.log(`  3. If unsuccessful, review Vercel build logs for specific errors`);
  console.log(`  4. Refer to the detailed troubleshooting guide: ${colors.bright}docs/VERCEL_DEPLOYMENT_TROUBLESHOOTING.md${colors.reset}`);
  
  console.log(`\n${colors.bright}For Detailed Analysis:${colors.reset}`);
  console.log(`  Run: ${colors.green}vercel logs${colors.reset} (requires Vercel CLI)`);
  console.log(`  Run: ${colors.green}vercel build --debug${colors.reset} (for local build debugging)`);
  
  console.log('');
}

// Run the monitor
monitorDeployment().catch(error => {
  console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
});
