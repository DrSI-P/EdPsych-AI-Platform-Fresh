/**
 * API Security Validation Report
 * 
 * This file contains validation tests for API security and multi-tenant isolation.
 */

import { ApiSecurityValidator } from './security-validator';
import { ApiVersionService } from './api-version-service';
import { ApiPermission } from './types';

/**
 * Run security validation tests
 */
export async function validateApiSecurity() {
  const results = {
    authenticationTests: await runAuthenticationTests(),
    tenantIsolationTests: await runTenantIsolationTests(),
    permissionTests: await runPermissionTests(),
    versioningTests: await runVersioningTests(),
    corsTests: await runCorsTests()
  };
  
  return results;
}

/**
 * Run authentication tests
 */
async function runAuthenticationTests() {
  const securityValidator = ApiSecurityValidator.getInstance();
  const tests = [
    {
      name: 'Valid API Key Authentication',
      result: await securityValidator.validateAuthHeader('Bearer valid_api_key_token') !== null,
      expected: true
    },
    {
      name: 'Valid OAuth Authentication',
      result: await securityValidator.validateAuthHeader('Bearer valid_oauth_token') !== null,
      expected: true
    },
    {
      name: 'Invalid Token',
      result: await securityValidator.validateAuthHeader('Bearer invalid_token') === null,
      expected: true
    },
    {
      name: 'Missing Bearer Prefix',
      result: await securityValidator.validateAuthHeader('invalid_format') === null,
      expected: true
    },
    {
      name: 'Null Authorization Header',
      result: await securityValidator.validateAuthHeader(null) === null,
      expected: true
    }
  ];
  
  return {
    passed: tests.every(test => test.result === test.expected),
    tests
  };
}

/**
 * Run tenant isolation tests
 */
async function runTenantIsolationTests() {
  const securityValidator = ApiSecurityValidator.getInstance();
  const mockPayload = {
    keyId: 'test-key-id',
    tenantId: 'tenant-1',
    permissions: [ApiPermission.CONTENT_READ],
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };
  
  const tests = [
    {
      name: 'Same Tenant ID',
      result: securityValidator.validateTenantIsolation(mockPayload, 'tenant-1'),
      expected: true
    },
    {
      name: 'Different Tenant ID',
      result: securityValidator.validateTenantIsolation(mockPayload, 'tenant-2'),
      expected: false
    },
    {
      name: 'Case Sensitivity',
      result: securityValidator.validateTenantIsolation(mockPayload, 'Tenant-1'),
      expected: false
    }
  ];
  
  return {
    passed: tests.every(test => test.result === test.expected),
    tests
  };
}

/**
 * Run permission tests
 */
async function runPermissionTests() {
  const securityValidator = ApiSecurityValidator.getInstance();
  const mockPayload = {
    keyId: 'test-key-id',
    tenantId: 'tenant-1',
    permissions: [
      ApiPermission.CONTENT_READ,
      ApiPermission.ASSESSMENT_READ,
      ApiPermission.USER_READ
    ],
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };
  
  const tests = [
    {
      name: 'Single Permission - Has Permission',
      result: securityValidator.validatePermissions(mockPayload, [ApiPermission.CONTENT_READ]),
      expected: true
    },
    {
      name: 'Single Permission - Missing Permission',
      result: securityValidator.validatePermissions(mockPayload, [ApiPermission.CONTENT_WRITE]),
      expected: false
    },
    {
      name: 'Multiple Permissions - Has All',
      result: securityValidator.validatePermissions(mockPayload, [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ
      ]),
      expected: true
    },
    {
      name: 'Multiple Permissions - Missing One',
      result: securityValidator.validatePermissions(mockPayload, [
        ApiPermission.CONTENT_READ,
        ApiPermission.CONTENT_WRITE
      ]),
      expected: false
    },
    {
      name: 'No Required Permissions',
      result: securityValidator.validatePermissions(mockPayload, []),
      expected: true
    }
  ];
  
  return {
    passed: tests.every(test => test.result === test.expected),
    tests
  };
}

/**
 * Run versioning tests
 */
async function runVersioningTests() {
  const versionService = ApiVersionService.getInstance();
  
  const tests = [
    {
      name: 'Current Version',
      result: versionService.getCurrentVersion() === 'v1',
      expected: true
    },
    {
      name: 'Version Support Check - Valid',
      result: versionService.isVersionSupported('v1'),
      expected: true
    },
    {
      name: 'Version Support Check - Invalid',
      result: versionService.isVersionSupported('v3'),
      expected: false
    },
    {
      name: 'Version Headers - Standard Endpoint',
      result: versionService.getVersionHeaders('/api/developer/keys/{tenantId}')['X-API-Version'] === 'v1',
      expected: true
    },
    {
      name: 'Version Headers - Deprecated Endpoint',
      result: versionService.getVersionHeaders('/api/developer/legacy/keys/{tenantId}').hasOwnProperty('Deprecation'),
      expected: true
    }
  ];
  
  return {
    passed: tests.every(test => test.result === test.expected),
    tests
  };
}

/**
 * Run CORS tests
 */
async function runCorsTests() {
  const securityValidator = ApiSecurityValidator.getInstance();
  
  const tests = [
    {
      name: 'Valid Origin - Exact Match',
      result: await securityValidator.validateCorsOrigin('https://edpsych-connect.com', 'tenant-1'),
      expected: true
    },
    {
      name: 'Valid Origin - Tenant Subdomain',
      result: await securityValidator.validateCorsOrigin('https://tenant-1.edpsych-connect.com', 'tenant-1'),
      expected: true
    },
    {
      name: 'Valid Origin - Wildcard Subdomain',
      result: await securityValidator.validateCorsOrigin('https://app.edpsych-connect.com', 'tenant-1'),
      expected: true
    },
    {
      name: 'Valid Origin - Localhost',
      result: await securityValidator.validateCorsOrigin('http://localhost:3000', 'tenant-1'),
      expected: true
    },
    {
      name: 'Invalid Origin',
      result: await securityValidator.validateCorsOrigin('https://malicious-site.com', 'tenant-1'),
      expected: false
    },
    {
      name: 'Null Origin',
      result: await securityValidator.validateCorsOrigin(null, 'tenant-1'),
      expected: false
    }
  ];
  
  return {
    passed: tests.every(test => test.result === test.expected),
    tests
  };
}
