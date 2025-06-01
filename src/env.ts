/**
 * Environment Configuration
 * 
 * This module provides type-safe environment variables for the application.
 */

// Define environment variable schema
export const env = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY || "",
  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT || "",
  AZURE_COGNITIVE_KEY: process.env.AZURE_COGNITIVE_KEY || "",
  AZURE_COGNITIVE_ENDPOINT: process.env.AZURE_COGNITIVE_ENDPOINT || "",
  AZURE_COGNITIVE_REGION: process.env.AZURE_COGNITIVE_REGION || "",
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || "",
  HEYGEN_API_KEY: process.env.HEYGEN_API_KEY || "",
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",
  
  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  
  // Public variables (accessible in browser)
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  NEXT_PUBLIC_HEYGEN_API_URL: process.env.NEXT_PUBLIC_HEYGEN_API_URL || "",
};

// Export default
export default env;
