# Environment Setup

This document outlines the required environment variables for the EdPsych AI Platform.

## Stripe Configuration

The application requires both production and test Stripe API keys:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: The publishable key used for client-side Stripe integration
- `STRIPE_SECRET_KEY`: The secret key used for server-side Stripe API calls
- `STRIPE_TEST_SECRET_KEY`: The test secret key used for testing Stripe integration
- `STRIPE_WEBHOOK_SECRET`: The webhook secret for verifying Stripe webhook events

Note: The test secret key must start with `sk_test_` to pass validation.

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