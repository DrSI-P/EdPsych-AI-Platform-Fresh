/**
 * API Security Validator
 * 
 * This service provides security validation for the external developer API.
 */

import { ApiTokenPayload, ApiPermission } from './types';
import { ApiAuthService } from './auth-service';
import { OAuthService } from './oauth-service';

export class ApiSecurityValidator {
  private static instance: ApiSecurityValidator;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get the singleton instance of the API Security Validator
   */
  public static getInstance(): ApiSecurityValidator {
    if (!ApiSecurityValidator.instance) {
      ApiSecurityValidator.instance = new ApiSecurityValidator();
    }
    return ApiSecurityValidator.instance;
  }
  
  /**
   * Validate tenant isolation
   * 
   * @param tokenPayload The token payload
   * @param tenantId The tenant ID from the request
   */
  public validateTenantIsolation(tokenPayload: ApiTokenPayload, tenantId: string): boolean {
    // Ensure tenant ID in token matches tenant ID in request
    return tokenPayload.tenantId === tenantId;
  }
  
  /**
   * Validate required permissions
   * 
   * @param tokenPayload The token payload
   * @param requiredPermissions The required permissions
   */
  public validatePermissions(tokenPayload: ApiTokenPayload, requiredPermissions: ApiPermission[]): boolean {
    // Check if token has all required permissions
    return requiredPermissions.every(permission => 
      tokenPayload.permissions.includes(permission)
    );
  }
  
  /**
   * Extract and validate token from authorization header
   * 
   * @param authHeader The authorization header
   */
  public async validateAuthHeader(authHeader: string | null): Promise<ApiTokenPayload | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Try API key authentication first
      const authService = ApiAuthService.getInstance();
      return authService.verifyToken(token);
    } catch (error) {
      try {
        // Try OAuth authentication if API key authentication fails
        const oauthService = OAuthService.getInstance();
        return oauthService.verifyAccessToken(token);
      } catch (innerError) {
        return null;
      }
    }
  }
  
  /**
   * Comprehensive security validation
   * 
   * @param authHeader The authorization header
   * @param tenantId The tenant ID from the request
   * @param requiredPermissions The required permissions
   */
  public async validateRequest(
    authHeader: string | null,
    tenantId: string,
    requiredPermissions: ApiPermission[] = []
  ): Promise<{ isValid: boolean; tokenPayload?: ApiTokenPayload; error?: string }> {
    // Validate authorization header
    const tokenPayload = await this.validateAuthHeader(authHeader);
    
    if (!tokenPayload) {
      return { isValid: false, error: 'Invalid or missing authorization token' };
    }
    
    // Validate tenant isolation
    if (!this.validateTenantIsolation(tokenPayload, tenantId)) {
      return { isValid: false, error: 'Tenant ID mismatch' };
    }
    
    // Validate permissions if required
    if (requiredPermissions.length > 0 && !this.validatePermissions(tokenPayload, requiredPermissions)) {
      return { isValid: false, error: 'Insufficient permissions' };
    }
    
    return { isValid: true, tokenPayload };
  }
  
  /**
   * Validate CORS origins
   * 
   * @param origin The request origin
   * @param tenantId The tenant ID
   */
  public async validateCorsOrigin(origin: string | null, tenantId: string): Promise<boolean> {
    if (!origin) {
      return false;
    }
    
    // Get allowed origins for tenant
    const allowedOrigins = await this.getAllowedOriginsForTenant(tenantId);
    
    // Check if origin is allowed
    return allowedOrigins.some(allowedOrigin => {
      // Support wildcard subdomains
      if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.substring(2);
        return origin.endsWith(domain) && origin.includes('://') && 
               origin.substring(origin.indexOf('://') + 3).indexOf('.') < 
               origin.substring(origin.indexOf('://') + 3).indexOf(domain);
      }
      
      return origin === allowedOrigin;
    });
  }
  
  // Private helper methods
  
  private async getAllowedOriginsForTenant(tenantId: string): Promise<string[]> {
    // Implementation would query database for tenant's allowed origins
    // For now, return some default allowed origins
    return [
      'https://edpsych-connect.com',
      `https://${tenantId}.edpsych-connect.com`,
      '*.edpsych-connect.com',
      'http://localhost:3000'
    ];
  }
}
