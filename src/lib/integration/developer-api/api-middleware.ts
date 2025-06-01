/**
 * API Middleware for Security and Versioning
 * 
 * This middleware handles security validation and versioning for the external developer API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiSecurityValidator } from './security-validator';
import { ApiVersionService } from './api-version-service';
import { ApiPermission } from './types';

export interface ApiMiddlewareOptions {
  requiredPermissions?: ApiPermission[];
  skipAuth?: boolean;
  validateTenant?: boolean;
}

export function createApiMiddleware(options: ApiMiddlewareOptions = {}) {
  const {
    requiredPermissions = [],
    skipAuth = false,
    validateTenant = true
  } = options;
  
  return async function apiMiddleware(
    req: NextRequest,
    { params }: { params: { tenantId: string } },
    next: () => Promise<NextResponse>
  ) {
    try {
      // Add versioning headers
      const versionService = ApiVersionService.getInstance();
      const path = req.nextUrl.pathname;
      const versionHeaders = versionService.getVersionHeaders(path);
      
      // Skip auth if specified
      if (skipAuth) {
        const response = await next();
        
        // Add version headers to response
        Object.entries(versionHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }
      
      // Validate security
      const securityValidator = ApiSecurityValidator.getInstance();
      const authHeader = req.headers.get('Authorization');
      const tenantId = params.tenantId;
      
      const validationResult = await securityValidator.validateRequest(
        authHeader,
        validateTenant ? tenantId : 'any',
        requiredPermissions
      );
      
      if (!validationResult.isValid) {
        return NextResponse.json(
          { error: { code: 'unauthorized', message: validationResult.error || 'Unauthorized' } },
          { 
            status: 401,
            headers: versionHeaders
          }
        );
      }
      
      // Add token payload to request context
      // In a real implementation, we would use a request context mechanism
      // For now, we'll pass it through the response
      
      const response = await next();
      
      // Add version headers to response
      Object.entries(versionHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('API middleware error:', error);
      
      return NextResponse.json(
        { error: { code: 'internal_error', message: 'Internal server error' } },
        { status: 500 }
      );
    }
  };
}
