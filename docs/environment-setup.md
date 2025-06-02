# Environment Setup

This document outlines the required environment variables for the EdPsych AI Platform.

## Required Environment Variables

### Stripe Configuration

The application requires both production and test Stripe API keys:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: The publishable key used for client-side Stripe integration (must start with `pk_`)
- `STRIPE_SECRET_KEY`: The secret key used for server-side Stripe API calls (must start with `sk_`)
- `STRIPE_TEST_SECRET_KEY`: The test secret key used for testing Stripe integration (must start with `sk_test_`)
- `STRIPE_WEBHOOK_SECRET`: The webhook secret for verifying Stripe webhook events (must start with `whsec_`)

### Supabase Database Configuration

- `DATABASE_URL`: The connection URL for the Supabase PostgreSQL database
  - Format: `postgresql://postgres:password@host:5432/postgres`
  - Current configuration: `postgresql://postgres:Kanopatrick1@db.vrailhsvlqdavpbrkx:5432/postgres`

### HEYGEN API Configuration

- `NEXT_PUBLIC_HEYGEN_API_KEY`: The API key for HEYGEN integration
- `NEXT_PUBLIC_HEYGEN_API_URL`: The base URL for HEYGEN API calls

### Application Settings

- `NEXT_PUBLIC_APP_URL`: The public URL of the application (must start with `http`)
- `NEXT_PUBLIC_APP_NAME`: The name of the application

## Optional Environment Variables

### OpenAI Integration

- `OPENAI_API_KEY`: The API key for OpenAI integration (used for blog generation)

### GitHub Access (for CI/CD)

- `GITHUB_PAT`: GitHub Personal Access Token
- `GITHUB_WORKFLOW_TOKEN`: GitHub Workflow Token

## Deployment on Vercel

When deploying to Vercel, ensure all required environment variables are added in the Vercel project settings:

1. Go to your Vercel dashboard
2. Select the EdPsych-AI-Platform-Fresh project
3. Go to the "Settings" tab
4. Navigate to the "Environment Variables" section
5. Add all required environment variables
6. Make sure they're applied to all environments (Production, Preview, and Development)
7. Save the changes and redeploy

## Recent Changes

- Added `STRIPE_TEST_SECRET_KEY` to fix deployment issues (June 2, 2025)
- Updated `DATABASE_URL` with correct Supabase credentials (June 2, 2025)
- Added documentation for all required environment variables (June 2, 2025)