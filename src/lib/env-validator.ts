/**
 * Environment Variable Validator for EdPsych AI Education Platform
 * 
 * This module validates the presence and format of required environment variables
 * and provides a type-safe way to access them throughout the application.
 */

// Define the shape of our validated environment
export interface ValidatedEnv {
  // Stripe API Keys
  stripe: {
    publishableKey: string;
    secretKey: string;
    testSecretKey: string;
    webhookSecret: string;
  };
  
  // HEYGEN API Configuration
  heygen: {
    apiKey: string;
    apiUrl: string;
  };
  
  // GitHub Access (for CI/CD)
  github?: {
    pat?: string;
    workflowToken?: string;
  };
  
  // Database Configuration
  database: {
    url: string;
  };
  
  // Application Settings
  app: {
    url: string;
    name: string;
  };
  
  // OpenAI API Key (for blog generation)
  openai?: {
    apiKey?: string;
  };
}

// Error class for environment validation failures
export class EnvironmentValidationError extends Error {
  constructor(message: string) {
    super(`Environment Validation Error: ${message}`);
    this.name = 'EnvironmentValidationError';
  }
}

/**
 * Validate that a required environment variable exists
 */
function validateRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new EnvironmentValidationError(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Validate that an optional environment variable exists, or return undefined
 */
function validateOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

/**
 * Validate all required environment variables and return a typed object
 */
export function validateEnv(): ValidatedEnv {
  // Validate Stripe variables
  const stripePublishableKey = validateRequiredEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  if (!stripePublishableKey.startsWith('pk_')) {
    throw new EnvironmentValidationError('Invalid Stripe publishable key format');
  }
  
  const stripeSecretKey = validateRequiredEnv('STRIPE_SECRET_KEY');
  if (!stripeSecretKey.startsWith('sk_')) {
    throw new EnvironmentValidationError('Invalid Stripe secret key format');
  }
  
  const stripeTestSecretKey = validateRequiredEnv('STRIPE_TEST_SECRET_KEY');
  if (!stripeTestSecretKey.startsWith('sk_test_')) {
    throw new EnvironmentValidationError('Invalid Stripe test secret key format');
  }
  
  const stripeWebhookSecret = validateRequiredEnv('STRIPE_WEBHOOK_SECRET');
  if (!stripeWebhookSecret.startsWith('whsec_')) {
    throw new EnvironmentValidationError('Invalid Stripe webhook secret format');
  }
  
  // Validate HEYGEN variables
  const heygenApiKey = validateRequiredEnv('NEXT_PUBLIC_HEYGEN_API_KEY');
  const heygenApiUrl = validateRequiredEnv('NEXT_PUBLIC_HEYGEN_API_URL');
  
  // Validate database URL
  const databaseUrl = validateRequiredEnv('DATABASE_URL');
  if (!databaseUrl.includes('://')) {
    throw new EnvironmentValidationError('Invalid database URL format');
  }
  
  // Validate application settings
  const appUrl = validateRequiredEnv('NEXT_PUBLIC_APP_URL');
  if (!appUrl.startsWith('http')) {
    throw new EnvironmentValidationError('Invalid application URL format');
  }
  
  const appName = validateRequiredEnv('NEXT_PUBLIC_APP_NAME');
  
  // Optional variables
  const githubPat = validateOptionalEnv('GITHUB_PAT');
  const githubWorkflowToken = validateOptionalEnv('GITHUB_WORKFLOW_TOKEN');
  const openaiApiKey = validateOptionalEnv('OPENAI_API_KEY');
  
  // Return the validated environment
  return {
    stripe: {
      publishableKey: stripePublishableKey,
      secretKey: stripeSecretKey,
      testSecretKey: stripeTestSecretKey,
      webhookSecret: stripeWebhookSecret,
    },
    heygen: {
      apiKey: heygenApiKey,
      apiUrl: heygenApiUrl,
    },
    github: githubPat || githubWorkflowToken ? {
      pat: githubPat,
      workflowToken: githubWorkflowToken,
    } : undefined,
    database: {
      url: databaseUrl,
    },
    app: {
      url: appUrl,
      name: appName,
    },
    openai: openaiApiKey ? {
      apiKey: openaiApiKey,
    } : undefined,
  };
}

// Singleton instance of validated environment
let validatedEnv: ValidatedEnv | null = null;

/**
 * Get the validated environment, validating it if not already done
 */
export function getEnv(): ValidatedEnv {
  if (!validatedEnv) {
    validatedEnv = validateEnv();
  }
  return validatedEnv;
}

/**
 * Reset the validated environment (useful for testing)
 */
export function resetEnv(): void {
  validatedEnv = null;
}

export default getEnv;
