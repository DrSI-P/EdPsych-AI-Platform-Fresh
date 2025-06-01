/**
 * Deployment Verification Script for EdPsych Connect
 * 
 * This script performs a series of checks to verify that the platform
 * is displaying correctly on edpsychconnect.com after deployment.
 * 
 * Usage: node scripts/verify-deployment.js [domain]
 * Example: node scripts/verify-deployment.js https://edpsychconnect.com
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { execSync } = require('child_process');

// Default domain to check
const DEFAULT_DOMAIN = 'https://edpsychconnect.com';

// Get domain from command line arguments or use default
const domain = process.argv[2] || DEFAULT_DOMAIN;

// Critical pages to check
const criticalPages = [
  '/',                  // Home page
  '/blog',              // Blog index
  '/resources',         // Resources page
  '/about',             // About page
  '/contact',           // Contact page
  '/auth/signin',       // Sign in page
  '/sitemap.xml',       // Sitemap
  '/robots.txt',        // Robots.txt
];

// Expected content markers for each page
const contentMarkers = {
  '/': ['EdPsych Connect', 'educational psychology'],
  '/blog': ['Blog', 'articles', 'posts'],
  '/resources': ['Resources', 'educational'],
  '/about': ['About', 'mission', 'vision'],
  '/contact': ['Contact', 'email', 'message'],
  '/auth/signin': ['Sign in', 'login', 'email'],
  '/sitemap.xml': ['urlset', 'sitemap'],
  '/robots.txt': ['User-agent', 'Allow', 'Disallow'],
};

// Headers to check
const requiredHeaders = [
  'content-type',
  'cache-control',
  'x-content-type-options',
];

// Function to make HTTP request and return response
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'EdPsych-Connect-Deployment-Verifier/1.0',
      },
    };
    
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to check if response contains expected content
function containsExpectedContent(body, markers) {
  if (!markers || !Array.isArray(markers)) return true;
  
  return markers.some(marker => 
    body.toLowerCase().includes(marker.toLowerCase())
  );
}

// Function to check if response has required headers
function hasRequiredHeaders(headers) {
  return requiredHeaders.every(header => 
    Object.keys(headers).some(h => h.toLowerCase() === header.toLowerCase())
  );
}

// Function to check a single page
async function checkPage(path) {
  const url = `${domain}${path}`;
  console.log(`\n🔍 Checking ${url}...`);
  
  try {
    const response = await makeRequest(url);
    
    // Check status code
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`✅ Status: ${response.statusCode} OK`);
    } else {
      console.error(`❌ Status: ${response.statusCode} Failed`);
      return false;
    }
    
    // Check headers
    if (hasRequiredHeaders(response.headers)) {
      console.log('✅ Required headers present');
    } else {
      console.warn('⚠️ Some required headers are missing');
    }
    
    // Check content
    const markers = contentMarkers[path];
    if (containsExpectedContent(response.body, markers)) {
      console.log('✅ Expected content found');
    } else {
      console.error('❌ Expected content not found');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error checking ${url}:`, error.message);
    return false;
  }
}

// Main function to check all pages
async function verifyDeployment() {
  console.log(`🚀 Verifying deployment on ${domain}...`);
  
  let successCount = 0;
  let failureCount = 0;
  
  // Check each critical page
  for (const page of criticalPages) {
    const success = await checkPage(page);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }
  
  // Print summary
  console.log('\n📊 Verification Summary:');
  console.log(`✅ ${successCount} pages verified successfully`);
  console.log(`❌ ${failureCount} pages failed verification`);
  
  if (failureCount === 0) {
    console.log('\n🎉 Deployment verification successful! The platform is displaying correctly.');
    return true;
  } else {
    console.error('\n⚠️ Deployment verification failed. Some pages are not displaying correctly.');
    return false;
  }
}

// Run the verification
verifyDeployment()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Unhandled error during verification:', error);
    process.exit(1);
  });