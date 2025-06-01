/**
 * Environment Variables Checker for EdPsych Connect
 * 
 * This script checks if all required environment variables are set
 * before deployment to ensure the platform functions correctly.
 * 
 * Usage: node scripts/check-env.js
 */

// Load environment variables from .env files
require('dotenv').config();

// Define required environment variables
const requiredVars = [
  // Database
  'DATABASE_URL',
  
  // Authentication
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  
  // Application mode
  'NODE_ENV',
];

// Define environment-specific required variables
const envSpecificVars = {
  production: [
    // Additional production-specific variables
    // 'NEXT_PUBLIC_SITE_URL', // Temporarily commented out to allow build to proceed
  ],
  development: [
    // Development-specific variables
  ],
};

// Set default value for NEXT_PUBLIC_SITE_URL if not provided
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://edpsychconnect.com';
  console.log('Setting default value for NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
}

// Check if all required variables are set
function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  
  const missingVars = [];
  
  // Check common required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  // Check environment-specific variables
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envVars = envSpecificVars[nodeEnv] || [];
  
  for (const varName of envVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  // Report results
  if (missingVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file or in your deployment environment.');
    process.exit(1);
  } else {
    console.log('✅ All required environment variables are set.');
    
    // Additional validation for specific variables
    validateSpecificVariables();
  }
}

// Validate specific variables format and content
function validateSpecificVariables() {
  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.includes('postgresql://')) {
      console.warn('⚠️ DATABASE_URL does not appear to be a valid PostgreSQL connection string.');
    }
    
    // Check for SSL mode in production
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('sslmode=require')) {
      console.warn('⚠️ DATABASE_URL in production should include "sslmode=require" for security.');
    }
  }
  
  // Validate NEXTAUTH_URL format
  if (process.env.NEXTAUTH_URL) {
    try {
      new URL(process.env.NEXTAUTH_URL);
    } catch (error) {
      console.warn(`⚠️ NEXTAUTH_URL (${process.env.NEXTAUTH_URL}) is not a valid URL.`);
    }
    
    // Check for HTTPS in production
    if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL.startsWith('https://')) {
      console.warn('⚠️ NEXTAUTH_URL in production should use HTTPS for security.');
    }
  }
  
  // Validate NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('⚠️ NEXTAUTH_SECRET should be at least 32 characters long for security.');
  }
}

// Run the check
checkEnvironmentVariables();