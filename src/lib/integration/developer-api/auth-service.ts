/**
 * API Authentication Service
 * 
 * This service handles authentication and authorization for the external developer API.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ApiKey, ApiKeyStatus, ApiPermission, ApiTokenPayload } from './types';

export class ApiAuthService {
  private static instance: ApiAuthService;
  private jwtSecret: string;
  
  private constructor() {
    // Private constructor for singleton pattern
    this.jwtSecret = process.env.API_JWT_SECRET || 'edpsych-connect-api-secret';
  }
  
  /**
   * Get the singleton instance of the API Authentication service
   */
  public static getInstance(): ApiAuthService {
    if (!ApiAuthService.instance) {
      ApiAuthService.instance = new ApiAuthService();
    }
    return ApiAuthService.instance;
  }
  
  /**
   * Authenticate API credentials and generate a JWT token
   * 
   * @param apiKey The API key
   * @param apiSecret The API secret
   * @param tenantId The tenant ID
   */
  public async authenticate(apiKey: string, apiSecret: string, tenantId: string): Promise<string> {
    try {
      // Find API key in database
      const keyData = await this.findApiKey(apiKey, tenantId);
      
      if (!keyData) {
        throw new Error('Invalid API key');
      }
      
      if (keyData.status !== ApiKeyStatus.ACTIVE) {
        throw new Error('API key is not active');
      }
      
      // Verify API secret
      const isValidSecret = await this.verifyApiSecret(apiSecret, keyData);
      
      if (!isValidSecret) {
        throw new Error('Invalid API secret');
      }
      
      // Generate JWT token
      const token = this.generateToken(keyData);
      
      // Update last used timestamp
      await this.updateApiKeyLastUsed(keyData.id);
      
      return token;
    } catch (error) {
      console.error('API authentication error:', error);
      throw new Error('Authentication failed');
    }
  }
  
  /**
   * Verify JWT token and extract payload
   * 
   * @param token The JWT token
   */
  public verifyToken(token: string): ApiTokenPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as ApiTokenPayload;
      return payload;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }
  
  /**
   * Check if token has required permission
   * 
   * @param payload The token payload
   * @param requiredPermission The required permission
   */
  public hasPermission(payload: ApiTokenPayload, requiredPermission: ApiPermission): boolean {
    return payload.permissions.includes(requiredPermission);
  }
  
  /**
   * Generate a new API key and secret
   * 
   * @param tenantId The tenant ID
   * @param name The API key name
   * @param permissions The API permissions
   * @param createdBy The user ID who created the key
   */
  public async generateApiKey(
    tenantId: string,
    name: string,
    permissions: ApiPermission[],
    createdBy: string
  ): Promise<ApiKey> {
    try {
      // Generate key and secret
      const key = this.generateRandomString(32);
      const secret = this.generateRandomString(64);
      
      // Hash secret for storage
      const hashedSecret = this.hashSecret(secret);
      
      // Store API key in database
      const apiKey: ApiKey = {
        id: crypto.randomUUID(),
        tenantId,
        name,
        key,
        secret, // Only returned when key is created
        permissions,
        status: ApiKeyStatus.ACTIVE,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await this.storeApiKey({
        ...apiKey,
        secret: hashedSecret // Store hashed secret
      });
      
      return apiKey;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw new Error('Failed to generate API key');
    }
  }
  
  /**
   * Revoke an API key
   * 
   * @param keyId The API key ID
   * @param tenantId The tenant ID
   */
  public async revokeApiKey(keyId: string, tenantId: string): Promise<boolean> {
    try {
      // Find API key in database
      const keyData = await this.findApiKeyById(keyId, tenantId);
      
      if (!keyData) {
        throw new Error('API key not found');
      }
      
      // Update API key status
      await this.updateApiKeyStatus(keyId, ApiKeyStatus.REVOKED);
      
      return true;
    } catch (error) {
      console.error('Error revoking API key:', error);
      throw new Error('Failed to revoke API key');
    }
  }
  
  /**
   * List API keys for a tenant
   * 
   * @param tenantId The tenant ID
   */
  public async listApiKeys(tenantId: string): Promise<ApiKey[]> {
    try {
      // Find API keys in database
      const keys = await this.findApiKeysByTenant(tenantId);
      
      // Remove secret from response
      return keys.map(key => {
        const { secret, ...keyWithoutSecret } = key;
        return keyWithoutSecret;
      });
    } catch (error) {
      console.error('Error listing API keys:', error);
      throw new Error('Failed to list API keys');
    }
  }
  
  // Private helper methods
  
  private generateToken(apiKey: ApiKey): string {
    const payload: ApiTokenPayload = {
      keyId: apiKey.id,
      tenantId: apiKey.tenantId,
      permissions: apiKey.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };
    
    return jwt.sign(payload, this.jwtSecret);
  }
  
  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  private hashSecret(secret: string): string {
    return crypto.createHash('sha256').update(secret).digest('hex');
  }
  
  private async verifyApiSecret(providedSecret: string, apiKey: any): Promise<boolean> {
    const hashedProvidedSecret = this.hashSecret(providedSecret);
    return hashedProvidedSecret === apiKey.secret;
  }
  
  private async findApiKey(key: string, tenantId: string): Promise<any> {
    // Implementation would query database
    return {
      id: 'mock-api-key-id',
      tenantId,
      key,
      secret: this.hashSecret('mock-secret'),
      permissions: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ,
        ApiPermission.USER_READ
      ],
      status: ApiKeyStatus.ACTIVE,
      createdBy: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  private async findApiKeyById(id: string, tenantId: string): Promise<any> {
    // Implementation would query database
    return {
      id,
      tenantId,
      key: 'mock-api-key',
      secret: this.hashSecret('mock-secret'),
      permissions: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ,
        ApiPermission.USER_READ
      ],
      status: ApiKeyStatus.ACTIVE,
      createdBy: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  private async findApiKeysByTenant(tenantId: string): Promise<any[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-api-key-id-1',
        tenantId,
        key: 'mock-api-key-1',
        permissions: [
          ApiPermission.CONTENT_READ,
          ApiPermission.ASSESSMENT_READ,
          ApiPermission.USER_READ
        ],
        status: ApiKeyStatus.ACTIVE,
        createdBy: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mock-api-key-id-2',
        tenantId,
        key: 'mock-api-key-2',
        permissions: [
          ApiPermission.CONTENT_READ,
          ApiPermission.CONTENT_WRITE
        ],
        status: ApiKeyStatus.ACTIVE,
        createdBy: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  private async storeApiKey(apiKey: any): Promise<void> {
    // Implementation would store in database
  }
  
  private async updateApiKeyStatus(keyId: string, status: ApiKeyStatus): Promise<void> {
    // Implementation would update database
  }
  
  private async updateApiKeyLastUsed(keyId: string): Promise<void> {
    // Implementation would update database
  }
}
