/**
 * API Endpoint Tests
 * 
 * This file contains tests for the external developer API endpoints.
 */

import fetch from 'node-fetch';
import { ApiPermission } from '@/lib/integration/developer-api/types';

// Test configuration
const config = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  tenantId: process.env.TEST_TENANT_ID || 'test-tenant',
  apiKey: '',
  apiSecret: '',
  token: '',
  oauthClientId: '',
  oauthClientSecret: '',
  webhookId: ''
};

/**
 * Run all API endpoint tests
 */
export async function runApiTests() {
  console.log('Starting API endpoint tests...');
  
  try {
    // Authentication tests
    await testAuthentication();
    
    // API key management tests
    await testApiKeyManagement();
    
    // OAuth tests
    await testOAuth();
    
    // Webhook tests
    await testWebhooks();
    
    // Documentation tests
    await testDocumentation();
    
    console.log('All tests completed successfully!');
    return { success: true, message: 'All tests passed' };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Test authentication endpoints
 */
async function testAuthentication() {
  console.log('\nTesting authentication endpoints...');
  
  // Test API key authentication
  console.log('Testing API key authentication...');
  
  // Create test data
  const authData = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret'
  };
  
  // Test successful authentication
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/auth/${config.tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authData)
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.token) {
      throw new Error('Authentication response missing token');
    }
    
    console.log('Authentication successful');
    config.token = data.token;
  } catch (error) {
    console.error('Authentication test failed:', error);
    throw error;
  }
  
  // Test authentication with invalid credentials
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/auth/${config.tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: 'invalid-key',
        apiSecret: 'invalid-secret'
      })
    });
    
    if (response.status !== 401) {
      throw new Error(`Expected 401 status for invalid credentials, got ${response.status}`);
    }
    
    console.log('Invalid credentials test passed');
  } catch (error) {
    console.error('Invalid credentials test failed:', error);
    throw error;
  }
  
  // Test authentication with missing parameters
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/auth/${config.tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: 'test-api-key'
        // Missing apiSecret
      })
    });
    
    if (response.status !== 400) {
      throw new Error(`Expected 400 status for missing parameters, got ${response.status}`);
    }
    
    console.log('Missing parameters test passed');
  } catch (error) {
    console.error('Missing parameters test failed:', error);
    throw error;
  }
  
  console.log('Authentication endpoint tests completed');
}

/**
 * Test API key management endpoints
 */
async function testApiKeyManagement() {
  console.log('\nTesting API key management endpoints...');
  
  // Test listing API keys
  console.log('Testing list API keys...');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/keys/${config.tenantId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`List API keys failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data.keys)) {
      throw new Error('List API keys response missing keys array');
    }
    
    console.log(`Found ${data.keys.length} API keys`);
  } catch (error) {
    console.error('List API keys test failed:', error);
    throw error;
  }
  
  // Test creating API key
  console.log('Testing create API key...');
  
  try {
    const keyData = {
      name: 'Test API Key',
      permissions: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ
      ]
    };
    
    const response = await fetch(`${config.baseUrl}/api/developer/keys/${config.tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`
      },
      body: JSON.stringify(keyData)
    });
    
    if (!response.ok) {
      throw new Error(`Create API key failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.apiKey || !data.apiKey.key || !data.apiKey.secret) {
      throw new Error('Create API key response missing key or secret');
    }
    
    console.log('API key created successfully');
    config.apiKey = data.apiKey.key;
    config.apiSecret = data.apiKey.secret;
  } catch (error) {
    console.error('Create API key test failed:', error);
    throw error;
  }
  
  // Test creating API key with invalid permissions
  try {
    const keyData = {
      name: 'Test API Key',
      permissions: [
        'invalid:permission'
      ]
    };
    
    const response = await fetch(`${config.baseUrl}/api/developer/keys/${config.tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`
      },
      body: JSON.stringify(keyData)
    });
    
    if (response.status !== 400) {
      throw new Error(`Expected 400 status for invalid permissions, got ${response.status}`);
    }
    
    console.log('Invalid permissions test passed');
  } catch (error) {
    console.error('Invalid permissions test failed:', error);
    throw error;
  }
  
  console.log('API key management endpoint tests completed');
}

/**
 * Test OAuth endpoints
 */
async function testOAuth() {
  console.log('\nTesting OAuth endpoints...');
  
  // Test listing OAuth clients
  console.log('Testing list OAuth clients...');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/oauth/${config.tenantId}/clients`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`List OAuth clients failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data.clients)) {
      throw new Error('List OAuth clients response missing clients array');
    }
    
    console.log(`Found ${data.clients.length} OAuth clients`);
  } catch (error) {
    console.error('List OAuth clients test failed:', error);
    throw error;
  }
  
  // Test creating OAuth client
  console.log('Testing create OAuth client...');
  
  try {
    const clientData = {
      name: 'Test OAuth Client',
      description: 'A test OAuth client',
      redirectUris: ['https://example.com/callback'],
      allowedScopes: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ
      ]
    };
    
    const response = await fetch(`${config.baseUrl}/api/developer/oauth/${config.tenantId}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`
      },
      body: JSON.stringify(clientData)
    });
    
    if (!response.ok) {
      throw new Error(`Create OAuth client failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.client || !data.client.clientId || !data.client.clientSecret) {
      throw new Error('Create OAuth client response missing clientId or clientSecret');
    }
    
    console.log('OAuth client created successfully');
    config.oauthClientId = data.client.clientId;
    config.oauthClientSecret = data.client.clientSecret;
  } catch (error) {
    console.error('Create OAuth client test failed:', error);
    throw error;
  }
  
  // Test OAuth authorization endpoint
  console.log('Testing OAuth authorization endpoint...');
  
  try {
    const authUrl = new URL(`${config.baseUrl}/api/developer/oauth/${config.tenantId}/authorize`);
    authUrl.searchParams.set('client_id', config.oauthClientId);
    authUrl.searchParams.set('redirect_uri', 'https://example.com/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'content:read assessment:read');
    authUrl.searchParams.set('state', 'test-state');
    
    const response = await fetch(authUrl.toString(), {
      redirect: 'manual' // Don't follow redirects
    });
    
    if (response.status !== 302) {
      throw new Error(`Expected 302 redirect status, got ${response.status}`);
    }
    
    const location = response.headers.get('location');
    
    if (!location || !location.includes('/oauth/consent')) {
      throw new Error(`Expected redirect to consent page, got ${location}`);
    }
    
    console.log('OAuth authorization endpoint test passed');
  } catch (error) {
    console.error('OAuth authorization endpoint test failed:', error);
    throw error;
  }
  
  console.log('OAuth endpoint tests completed');
}

/**
 * Test webhook endpoints
 */
async function testWebhooks() {
  console.log('\nTesting webhook endpoints...');
  
  // Test listing webhooks
  console.log('Testing list webhooks...');
  
  try {
    // We need an API key ID for this test
    const keysResponse = await fetch(`${config.baseUrl}/api/developer/keys/${config.tenantId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    
    if (!keysResponse.ok) {
      throw new Error(`List API keys failed with status ${keysResponse.status}`);
    }
    
    const keysData = await keysResponse.json();
    
    if (!Array.isArray(keysData.keys) || keysData.keys.length === 0) {
      throw new Error('No API keys found for webhook test');
    }
    
    const apiKeyId = keysData.keys[0].id;
    
    const response = await fetch(`${config.baseUrl}/api/developer/webhooks/${config.tenantId}/${apiKeyId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`List webhooks failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data.webhooks)) {
      throw new Error('List webhooks response missing webhooks array');
    }
    
    console.log(`Found ${data.webhooks.length} webhooks`);
  } catch (error) {
    console.error('List webhooks test failed:', error);
    throw error;
  }
  
  // Test creating webhook
  console.log('Testing create webhook...');
  
  try {
    // We need an API key ID for this test
    const keysResponse = await fetch(`${config.baseUrl}/api/developer/keys/${config.tenantId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    
    if (!keysResponse.ok) {
      throw new Error(`List API keys failed with status ${keysResponse.status}`);
    }
    
    const keysData = await keysResponse.json();
    
    if (!Array.isArray(keysData.keys) || keysData.keys.length === 0) {
      throw new Error('No API keys found for webhook test');
    }
    
    const apiKeyId = keysData.keys[0].id;
    
    const webhookData = {
      url: 'https://example.com/webhook',
      events: ['content.created', 'content.updated']
    };
    
    const response = await fetch(`${config.baseUrl}/api/developer/webhooks/${config.tenantId}/${apiKeyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`
      },
      body: JSON.stringify(webhookData)
    });
    
    if (!response.ok) {
      throw new Error(`Create webhook failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.webhook || !data.webhook.id || !data.webhook.secret) {
      throw new Error('Create webhook response missing id or secret');
    }
    
    console.log('Webhook created successfully');
    config.webhookId = data.webhook.id;
  } catch (error) {
    console.error('Create webhook test failed:', error);
    throw error;
  }
  
  console.log('Webhook endpoint tests completed');
}

/**
 * Test documentation endpoints
 */
async function testDocumentation() {
  console.log('\nTesting documentation endpoints...');
  
  // Test OpenAPI documentation endpoint
  console.log('Testing OpenAPI documentation endpoint...');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/docs`);
    
    if (!response.ok) {
      throw new Error(`OpenAPI documentation failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.openapi || !data.info || !data.paths) {
      throw new Error('OpenAPI documentation missing required fields');
    }
    
    console.log('OpenAPI documentation endpoint test passed');
  } catch (error) {
    console.error('OpenAPI documentation endpoint test failed:', error);
    throw error;
  }
  
  // Test OpenAPI documentation with version parameter
  console.log('Testing OpenAPI documentation with version parameter...');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/docs?version=v1`);
    
    if (!response.ok) {
      throw new Error(`OpenAPI documentation with version failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.openapi || !data.info || !data.paths) {
      throw new Error('OpenAPI documentation missing required fields');
    }
    
    if (data.info.version !== 'v1') {
      throw new Error(`Expected version v1, got ${data.info.version}`);
    }
    
    console.log('OpenAPI documentation with version test passed');
  } catch (error) {
    console.error('OpenAPI documentation with version test failed:', error);
    throw error;
  }
  
  // Test OpenAPI documentation with invalid version
  console.log('Testing OpenAPI documentation with invalid version...');
  
  try {
    const response = await fetch(`${config.baseUrl}/api/developer/docs?version=invalid`);
    
    if (response.status !== 400) {
      throw new Error(`Expected 400 status for invalid version, got ${response.status}`);
    }
    
    console.log('OpenAPI documentation with invalid version test passed');
  } catch (error) {
    console.error('OpenAPI documentation with invalid version test failed:', error);
    throw error;
  }
  
  console.log('Documentation endpoint tests completed');
}

// Run tests if executed directly
if (require.main === module) {
  runApiTests().catch(console.error);
}
