/**
 * OAuth 2.0 Authentication Service
 * 
 * This service handles OAuth 2.0 authentication flows for the external developer API.
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ApiPermission, ApiTokenPayload } from './types';

export interface OAuthClient {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  allowedScopes: ApiPermission[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface OAuthAuthorizationCode {
  code: string;
  clientId: string;
  tenantId: string;
  userId: string;
  scopes: ApiPermission[];
  redirectUri: string;
  expiresAt: Date;
  used: boolean;
}

export interface OAuthAccessToken {
  token: string;
  clientId: string;
  tenantId: string;
  userId: string;
  scopes: ApiPermission[];
  expiresAt: Date;
  refreshToken?: string;
}

export interface OAuthRefreshToken {
  token: string;
  clientId: string;
  tenantId: string;
  userId: string;
  scopes: ApiPermission[];
  expiresAt: Date;
  revoked: boolean;
}

export class OAuthService {
  private static instance: OAuthService;
  private jwtSecret: string;
  
  private constructor() {
    // Private constructor for singleton pattern
    this.jwtSecret = process.env.OAUTH_JWT_SECRET || process.env.API_JWT_SECRET || 'edpsych-connect-oauth-secret';
  }
  
  /**
   * Get the singleton instance of the OAuth service
   */
  public static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }
  
  /**
   * Register a new OAuth client
   * 
   * @param tenantId The tenant ID
   * @param name The client name
   * @param description The client description
   * @param redirectUris The allowed redirect URIs
   * @param allowedScopes The allowed scopes
   * @param createdBy The user ID who created the client
   */
  public async registerClient(
    tenantId: string,
    name: string,
    description: string,
    redirectUris: string[],
    allowedScopes: ApiPermission[],
    createdBy: string
  ): Promise<OAuthClient> {
    try {
      // Validate redirect URIs
      redirectUris.forEach(uri => {
        if (!this.isValidRedirectUri(uri)) {
          throw new Error(`Invalid redirect URI: ${uri}`);
        }
      });
      
      // Generate client ID and secret
      const clientId = this.generateClientId();
      const clientSecret = this.generateClientSecret();
      
      // Create client
      const client: OAuthClient = {
        id: crypto.randomUUID(),
        tenantId,
        name,
        description,
        clientId,
        clientSecret,
        redirectUris,
        allowedScopes,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      };
      
      // Store client in database
      await this.storeOAuthClient(client);
      
      return client;
    } catch (error) {
      console.error('Error registering OAuth client:', error);
      throw new Error('Failed to register OAuth client');
    }
  }
  
  /**
   * Generate an authorization code
   * 
   * @param clientId The client ID
   * @param tenantId The tenant ID
   * @param userId The user ID
   * @param scopes The requested scopes
   * @param redirectUri The redirect URI
   */
  public async generateAuthorizationCode(
    clientId: string,
    tenantId: string,
    userId: string,
    scopes: ApiPermission[],
    redirectUri: string
  ): Promise<string> {
    try {
      // Find client
      const client = await this.findClientByClientId(clientId, tenantId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      if (!client.active) {
        throw new Error('Client is not active');
      }
      
      // Validate redirect URI
      if (!client.redirectUris.includes(redirectUri)) {
        throw new Error('Invalid redirect URI');
      }
      
      // Validate scopes
      scopes.forEach(scope => {
        if (!client.allowedScopes.includes(scope)) {
          throw new Error(`Scope not allowed: ${scope}`);
        }
      });
      
      // Generate code
      const code = this.generateRandomString(32);
      
      // Create authorization code
      const authCode: OAuthAuthorizationCode = {
        code,
        clientId,
        tenantId,
        userId,
        scopes,
        redirectUri,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        used: false
      };
      
      // Store authorization code in database
      await this.storeAuthorizationCode(authCode);
      
      return code;
    } catch (error) {
      console.error('Error generating authorization code:', error);
      throw new Error('Failed to generate authorization code');
    }
  }
  
  /**
   * Exchange authorization code for access token
   * 
   * @param code The authorization code
   * @param clientId The client ID
   * @param clientSecret The client secret
   * @param redirectUri The redirect URI
   */
  public async exchangeAuthorizationCode(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<OAuthAccessToken> {
    try {
      // Find authorization code
      const authCode = await this.findAuthorizationCode(code);
      
      if (!authCode) {
        throw new Error('Invalid authorization code');
      }
      
      if (authCode.used) {
        throw new Error('Authorization code already used');
      }
      
      if (authCode.expiresAt < new Date()) {
        throw new Error('Authorization code expired');
      }
      
      if (authCode.clientId !== clientId) {
        throw new Error('Client ID mismatch');
      }
      
      if (authCode.redirectUri !== redirectUri) {
        throw new Error('Redirect URI mismatch');
      }
      
      // Find client
      const client = await this.findClientByClientId(clientId, authCode.tenantId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      if (!client.active) {
        throw new Error('Client is not active');
      }
      
      if (client.clientSecret !== clientSecret) {
        throw new Error('Invalid client secret');
      }
      
      // Mark authorization code as used
      await this.markAuthorizationCodeAsUsed(code);
      
      // Generate access token
      const accessToken = await this.generateAccessToken(
        clientId,
        authCode.tenantId,
        authCode.userId,
        authCode.scopes
      );
      
      return accessToken;
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }
  
  /**
   * Generate an access token
   * 
   * @param clientId The client ID
   * @param tenantId The tenant ID
   * @param userId The user ID
   * @param scopes The requested scopes
   */
  public async generateAccessToken(
    clientId: string,
    tenantId: string,
    userId: string,
    scopes: ApiPermission[]
  ): Promise<OAuthAccessToken> {
    try {
      // Generate token
      const tokenPayload: ApiTokenPayload = {
        keyId: clientId,
        tenantId,
        permissions: scopes,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      };
      
      const token = jwt.sign(tokenPayload, this.jwtSecret);
      
      // Generate refresh token
      const refreshToken = this.generateRandomString(64);
      
      // Create access token
      const accessToken: OAuthAccessToken = {
        token,
        clientId,
        tenantId,
        userId,
        scopes,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        refreshToken
      };
      
      // Create refresh token
      const refreshTokenObj: OAuthRefreshToken = {
        token: refreshToken,
        clientId,
        tenantId,
        userId,
        scopes,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        revoked: false
      };
      
      // Store tokens in database
      await this.storeAccessToken(accessToken);
      await this.storeRefreshToken(refreshTokenObj);
      
      return accessToken;
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }
  
  /**
   * Refresh an access token
   * 
   * @param refreshToken The refresh token
   * @param clientId The client ID
   * @param clientSecret The client secret
   */
  public async refreshAccessToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<OAuthAccessToken> {
    try {
      // Find refresh token
      const refreshTokenObj = await this.findRefreshToken(refreshToken);
      
      if (!refreshTokenObj) {
        throw new Error('Invalid refresh token');
      }
      
      if (refreshTokenObj.revoked) {
        throw new Error('Refresh token revoked');
      }
      
      if (refreshTokenObj.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
      }
      
      if (refreshTokenObj.clientId !== clientId) {
        throw new Error('Client ID mismatch');
      }
      
      // Find client
      const client = await this.findClientByClientId(clientId, refreshTokenObj.tenantId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      if (!client.active) {
        throw new Error('Client is not active');
      }
      
      if (client.clientSecret !== clientSecret) {
        throw new Error('Invalid client secret');
      }
      
      // Generate new access token
      const accessToken = await this.generateAccessToken(
        clientId,
        refreshTokenObj.tenantId,
        refreshTokenObj.userId,
        refreshTokenObj.scopes
      );
      
      // Revoke old refresh token
      await this.revokeRefreshToken(refreshToken);
      
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }
  
  /**
   * Revoke a refresh token
   * 
   * @param token The refresh token
   */
  public async revokeRefreshToken(token: string): Promise<boolean> {
    try {
      // Find refresh token
      const refreshToken = await this.findRefreshToken(token);
      
      if (!refreshToken) {
        throw new Error('Invalid refresh token');
      }
      
      // Mark as revoked
      await this.markRefreshTokenAsRevoked(token);
      
      return true;
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw new Error('Failed to revoke refresh token');
    }
  }
  
  /**
   * Verify an access token
   * 
   * @param token The access token
   */
  public verifyAccessToken(token: string): ApiTokenPayload {
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
   * List OAuth clients for a tenant
   * 
   * @param tenantId The tenant ID
   */
  public async listClients(tenantId: string): Promise<OAuthClient[]> {
    try {
      // Find clients in database
      const clients = await this.findClientsByTenant(tenantId);
      
      // Remove client secret from response
      return clients.map(client => {
        const { clientSecret, ...clientWithoutSecret } = client;
        return clientWithoutSecret as OAuthClient;
      });
    } catch (error) {
      console.error('Error listing OAuth clients:', error);
      throw new Error('Failed to list OAuth clients');
    }
  }
  
  /**
   * Update an OAuth client
   * 
   * @param clientId The client ID
   * @param tenantId The tenant ID
   * @param updates The client updates
   */
  public async updateClient(
    clientId: string,
    tenantId: string,
    updates: Partial<OAuthClient>
  ): Promise<OAuthClient> {
    try {
      // Find client
      const client = await this.findClientByClientId(clientId, tenantId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Validate redirect URIs if provided
      if (updates.redirectUris) {
        updates.redirectUris.forEach(uri => {
          if (!this.isValidRedirectUri(uri)) {
            throw new Error(`Invalid redirect URI: ${uri}`);
          }
        });
      }
      
      // Update client
      const updatedClient: OAuthClient = {
        ...client,
        name: updates.name || client.name,
        description: updates.description !== undefined ? updates.description : client.description,
        redirectUris: updates.redirectUris || client.redirectUris,
        allowedScopes: updates.allowedScopes || client.allowedScopes,
        active: updates.active !== undefined ? updates.active : client.active,
        updatedAt: new Date()
      };
      
      // Store updated client in database
      await this.updateOAuthClientInDb(updatedClient);
      
      // Remove client secret from response
      const { clientSecret, ...clientWithoutSecret } = updatedClient;
      return clientWithoutSecret as OAuthClient;
    } catch (error) {
      console.error('Error updating OAuth client:', error);
      throw new Error('Failed to update OAuth client');
    }
  }
  
  /**
   * Delete an OAuth client
   * 
   * @param clientId The client ID
   * @param tenantId The tenant ID
   */
  public async deleteClient(clientId: string, tenantId: string): Promise<boolean> {
    try {
      // Find client
      const client = await this.findClientByClientId(clientId, tenantId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Delete client from database
      await this.deleteOAuthClientFromDb(clientId, tenantId);
      
      return true;
    } catch (error) {
      console.error('Error deleting OAuth client:', error);
      throw new Error('Failed to delete OAuth client');
    }
  }
  
  // Private helper methods
  
  private isValidRedirectUri(uri: string): boolean {
    try {
      const parsedUrl = new URL(uri);
      return parsedUrl.protocol === 'https:' || parsedUrl.hostname === 'localhost';
    } catch (error) {
      return false;
    }
  }
  
  private generateClientId(): string {
    return `edpsych_${this.generateRandomString(24)}`;
  }
  
  private generateClientSecret(): string {
    return this.generateRandomString(64);
  }
  
  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Database operations (to be implemented with actual database)
  
  private async storeOAuthClient(client: OAuthClient): Promise<void> {
    // Implementation would store in database
  }
  
  private async findClientByClientId(clientId: string, tenantId: string): Promise<OAuthClient | null> {
    // Implementation would query database
    // Mock implementation for development
    return {
      id: 'mock-client-id',
      tenantId,
      name: 'Mock Client',
      description: 'A mock OAuth client for development',
      clientId,
      clientSecret: 'mock-client-secret',
      redirectUris: ['https://example.com/callback'],
      allowedScopes: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ,
        ApiPermission.USER_READ
      ],
      createdBy: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true
    };
  }
  
  private async findClientsByTenant(tenantId: string): Promise<OAuthClient[]> {
    // Implementation would query database
    // Mock implementation for development
    return [
      {
        id: 'mock-client-id-1',
        tenantId,
        name: 'Mock Client 1',
        description: 'A mock OAuth client for development',
        clientId: 'edpsych_mock_client_id_1',
        clientSecret: 'mock-client-secret-1',
        redirectUris: ['https://example.com/callback'],
        allowedScopes: [
          ApiPermission.CONTENT_READ,
          ApiPermission.ASSESSMENT_READ,
          ApiPermission.USER_READ
        ],
        createdBy: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      },
      {
        id: 'mock-client-id-2',
        tenantId,
        name: 'Mock Client 2',
        description: 'Another mock OAuth client for development',
        clientId: 'edpsych_mock_client_id_2',
        clientSecret: 'mock-client-secret-2',
        redirectUris: ['https://example.com/callback'],
        allowedScopes: [
          ApiPermission.CONTENT_READ,
          ApiPermission.CONTENT_WRITE
        ],
        createdBy: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      }
    ];
  }
  
  private async updateOAuthClientInDb(client: OAuthClient): Promise<void> {
    // Implementation would update database
  }
  
  private async deleteOAuthClientFromDb(clientId: string, tenantId: string): Promise<void> {
    // Implementation would delete from database
  }
  
  private async storeAuthorizationCode(authCode: OAuthAuthorizationCode): Promise<void> {
    // Implementation would store in database
  }
  
  private async findAuthorizationCode(code: string): Promise<OAuthAuthorizationCode | null> {
    // Implementation would query database
    // Mock implementation for development
    return {
      code,
      clientId: 'edpsych_mock_client_id_1',
      tenantId: 'mock-tenant-id',
      userId: 'mock-user-id',
      scopes: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ,
        ApiPermission.USER_READ
      ],
      redirectUri: 'https://example.com/callback',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      used: false
    };
  }
  
  private async markAuthorizationCodeAsUsed(code: string): Promise<void> {
    // Implementation would update database
  }
  
  private async storeAccessToken(accessToken: OAuthAccessToken): Promise<void> {
    // Implementation would store in database
  }
  
  private async storeRefreshToken(refreshToken: OAuthRefreshToken): Promise<void> {
    // Implementation would store in database
  }
  
  private async findRefreshToken(token: string): Promise<OAuthRefreshToken | null> {
    // Implementation would query database
    // Mock implementation for development
    return {
      token,
      clientId: 'edpsych_mock_client_id_1',
      tenantId: 'mock-tenant-id',
      userId: 'mock-user-id',
      scopes: [
        ApiPermission.CONTENT_READ,
        ApiPermission.ASSESSMENT_READ,
        ApiPermission.USER_READ
      ],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      revoked: false
    };
  }
  
  private async markRefreshTokenAsRevoked(token: string): Promise<void> {
    // Implementation would update database
  }
}
