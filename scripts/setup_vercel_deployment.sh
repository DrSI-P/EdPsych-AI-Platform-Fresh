#!/bin/bash

# Vercel deployment script for EdPsych-AI-Education-Platform
# This script sets up and configures Vercel deployment

# Configuration
PROJECT_DIR="/home/ubuntu/EdPsych-AI-Education-Platform"
LOG_FILE="$PROJECT_DIR/logs/vercel_deployment.log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Log function
log() {
  echo "$(date): $1" | tee -a "$LOG_FILE"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  log "Vercel CLI not found. Installing..."
  npm install -g vercel
  if [ $? -ne 0 ]; then
    log "Failed to install Vercel CLI. Exiting."
    exit 1
  fi
  log "Vercel CLI installed successfully."
else
  log "Vercel CLI already installed."
fi

# Check if project is already linked to Vercel
if [ -f "$PROJECT_DIR/.vercel/project.json" ]; then
  log "Project is already linked to Vercel."
else
  log "Project is not linked to Vercel. Please run 'vercel link' manually to link the project."
  log "Command: cd $PROJECT_DIR && vercel link"
fi

# Check for environment variables
if [ -f "$PROJECT_DIR/.env.local" ]; then
  log "Environment variables file found."
else
  log "Creating sample environment variables file..."
  cat > "$PROJECT_DIR/.env.local" << EOL
# EdPsych-AI-Education-Platform Environment Variables
# Replace these with your actual values

# API Keys
OPENAI_API_KEY=your_openai_api_key
AZURE_COGNITIVE_KEY=your_azure_cognitive_key
AZURE_COGNITIVE_ENDPOINT=your_azure_cognitive_endpoint
AZURE_COGNITIVE_REGION=your_azure_cognitive_region
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Database
DATABASE_URL=your_database_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Other Services
HEYGEN_API_KEY=your_heygen_api_key
EOL
  log "Sample environment variables file created at $PROJECT_DIR/.env.local"
  log "Please update with actual values before deployment."
fi

# Create Vercel configuration file if it doesn't exist
if [ ! -f "$PROJECT_DIR/vercel.json" ]; then
  log "Creating Vercel configuration file..."
  cat > "$PROJECT_DIR/vercel.json" << EOL
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["lhr1"],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key",
    "AZURE_COGNITIVE_KEY": "@azure-cognitive-key",
    "AZURE_COGNITIVE_ENDPOINT": "@azure-cognitive-endpoint",
    "AZURE_COGNITIVE_REGION": "@azure-cognitive-region",
    "HUGGINGFACE_API_KEY": "@huggingface-api-key",
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "HEYGEN_API_KEY": "@heygen-api-key"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_VERCEL_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOL
  log "Vercel configuration file created at $PROJECT_DIR/vercel.json"
fi

# Create deployment instructions
log "Creating deployment instructions..."
cat > "$PROJECT_DIR/VERCEL_DEPLOYMENT.md" << EOL
# Vercel Deployment Instructions

This document provides step-by-step instructions for deploying the EdPsych-AI-Education-Platform to Vercel.

## Prerequisites

1. A Vercel account
2. Vercel CLI installed (npm install -g vercel)
3. Environment variables set up

## Deployment Steps

### 1. Link your project to Vercel

If not already linked, run:

\`\`\`bash
cd $PROJECT_DIR
vercel link
\`\`\`

Follow the prompts to link to your Vercel account and project.

### 2. Set up environment variables

Make sure all required environment variables are set in the Vercel dashboard:

- OPENAI_API_KEY
- AZURE_COGNITIVE_KEY
- AZURE_COGNITIVE_ENDPOINT
- AZURE_COGNITIVE_REGION
- HUGGINGFACE_API_KEY
- DATABASE_URL
- NEXTAUTH_SECRET
- HEYGEN_API_KEY

You can set these by running:

\`\`\`bash
vercel env add
\`\`\`

### 3. Deploy to production

Run:

\`\`\`bash
vercel --prod
\`\`\`

### 4. Configure custom domain (optional)

In the Vercel dashboard:
1. Go to your project
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the instructions

## Troubleshooting

- If you encounter build errors, check the build logs in the Vercel dashboard
- Ensure all environment variables are correctly set
- Verify that the main branch is selected for deployment
- Check that the project structure follows Next.js conventions

## Continuous Deployment

Vercel automatically deploys when changes are pushed to the main branch of your GitHub repository.

To disable automatic deployments:
1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Git"
3. Disable "Auto Deploy"
EOL
log "Deployment instructions created at $PROJECT_DIR/VERCEL_DEPLOYMENT.md"

# Create a local test script
log "Creating local test script..."
cat > "$PROJECT_DIR/scripts/test_build.sh" << EOL
#!/bin/bash

# Test build script for EdPsych-AI-Education-Platform
# This script tests the build process locally before deployment

PROJECT_DIR="/home/ubuntu/EdPsych-AI-Education-Platform"
cd \$PROJECT_DIR

echo "Starting local build test..."
echo "Cleaning previous build artifacts..."
rm -rf .next

echo "Installing dependencies..."
npm install

echo "Running linting..."
npm run lint

echo "Building project..."
npm run build

if [ \$? -eq 0 ]; then
  echo "Build successful! The project is ready for deployment."
  echo "To test locally, run: npm run start"
else
  echo "Build failed. Please check the errors above."
  exit 1
fi
EOL
chmod +x "$PROJECT_DIR/scripts/test_build.sh"
log "Local test script created at $PROJECT_DIR/scripts/test_build.sh"

log "Vercel deployment setup completed. Please review the instructions in VERCEL_DEPLOYMENT.md"
log "Remember to update environment variables with actual values before deployment."
log "To test the build locally, run: $PROJECT_DIR/scripts/test_build.sh"

exit 0
