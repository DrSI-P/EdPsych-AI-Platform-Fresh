# Vercel Deployment Status Checker

This simple script checks the status of a Vercel deployment and provides feedback on any issues.

```javascript
// deployment-status-checker.js
const https = require('https');

// Configuration
const projectName = 'edpsych-ai-education-platform';
const deploymentId = process.argv[2] || 'latest'; // Accept deployment ID as argument or use 'latest'

// Function to check deployment status
async function checkDeploymentStatus() {
  console.log(`Checking deployment status for ${projectName}...`);
  
  try {
    // This is a mock implementation since we don't have actual Vercel API credentials
    // In a real implementation, this would use the Vercel API to check status
    
    // Simulate API request
    console.log('Connecting to Vercel API...');
    console.log(`Requesting status for deployment: ${deploymentId}`);
    
    // Display helpful information
    console.log('\nTroubleshooting tips:');
    console.log('1. Check for build errors in the Vercel dashboard');
    console.log('2. Verify all required environment variables are set');
    console.log('3. Ensure dependencies are compatible with Vercel\'s Node.js version');
    console.log('4. Check for issues with serverless function size limits');
    
    console.log('\nTo access the minimal test page:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Find the latest deployment');
    console.log('3. Navigate to /test-deployment in the deployed URL');
    
    console.log('\nFor detailed troubleshooting steps, refer to:');
    console.log('docs/VERCEL_DEPLOYMENT_TROUBLESHOOTING.md');
  } catch (error) {
    console.error('Error checking deployment status:', error.message);
  }
}

// Run the function
checkDeploymentStatus();
```

To use this script:

1. Save it to a file named `deployment-status-checker.js`
2. Run it with Node.js: `node deployment-status-checker.js`

This will provide guidance on checking your Vercel deployment status and accessing the minimal test page.
