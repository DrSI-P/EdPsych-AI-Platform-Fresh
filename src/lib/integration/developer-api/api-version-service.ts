/**
 * API Version Service
 * 
 * This service handles API versioning for the external developer API.
 */

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2'
}

export interface VersionedEndpoint {
  path: string;
  version: ApiVersion;
  deprecated: boolean;
  deprecationDate?: Date;
  sunsetDate?: Date;
}

export class ApiVersionService {
  private static instance: ApiVersionService;
  private endpoints: Map<string, VersionedEndpoint>;
  private currentVersion: ApiVersion = ApiVersion.V1;
  
  private constructor() {
    // Private constructor for singleton pattern
    this.endpoints = new Map<string, VersionedEndpoint>();
    this.initializeEndpoints();
  }
  
  /**
   * Get the singleton instance of the API Version service
   */
  public static getInstance(): ApiVersionService {
    if (!ApiVersionService.instance) {
      ApiVersionService.instance = new ApiVersionService();
    }
    return ApiVersionService.instance;
  }
  
  /**
   * Get the current API version
   */
  public getCurrentVersion(): ApiVersion {
    return this.currentVersion;
  }
  
  /**
   * Get all API versions
   */
  public getAllVersions(): ApiVersion[] {
    return Object.values(ApiVersion);
  }
  
  /**
   * Check if an API version is supported
   * 
   * @param version The API version to check
   */
  public isVersionSupported(version: string): boolean {
    return Object.values(ApiVersion).includes(version as ApiVersion);
  }
  
  /**
   * Get all endpoints for a specific version
   * 
   * @param version The API version
   */
  public getEndpointsForVersion(version: ApiVersion): VersionedEndpoint[] {
    const endpoints: VersionedEndpoint[] = [];
    
    this.endpoints.forEach(endpoint => {
      if (endpoint.version === version) {
        endpoints.push(endpoint);
      }
    });
    
    return endpoints;
  }
  
  /**
   * Get all deprecated endpoints
   */
  public getDeprecatedEndpoints(): VersionedEndpoint[] {
    const endpoints: VersionedEndpoint[] = [];
    
    this.endpoints.forEach(endpoint => {
      if (endpoint.deprecated) {
        endpoints.push(endpoint);
      }
    });
    
    return endpoints;
  }
  
  /**
   * Register a new endpoint
   * 
   * @param path The endpoint path
   * @param version The API version
   * @param deprecated Whether the endpoint is deprecated
   * @param deprecationDate The deprecation date
   * @param sunsetDate The sunset date
   */
  public registerEndpoint(
    path: string,
    version: ApiVersion,
    deprecated: boolean = false,
    deprecationDate?: Date,
    sunsetDate?: Date
  ): void {
    this.endpoints.set(path, {
      path,
      version,
      deprecated,
      deprecationDate,
      sunsetDate
    });
  }
  
  /**
   * Mark an endpoint as deprecated
   * 
   * @param path The endpoint path
   * @param deprecationDate The deprecation date
   * @param sunsetDate The sunset date
   */
  public deprecateEndpoint(
    path: string,
    deprecationDate: Date,
    sunsetDate: Date
  ): void {
    const endpoint = this.endpoints.get(path);
    
    if (endpoint) {
      endpoint.deprecated = true;
      endpoint.deprecationDate = deprecationDate;
      endpoint.sunsetDate = sunsetDate;
      
      this.endpoints.set(path, endpoint);
    }
  }
  
  /**
   * Get version headers for a response
   * 
   * @param path The endpoint path
   */
  public getVersionHeaders(path: string): Record<string, string> {
    const headers: Record<string, string> = {
      'X-API-Version': this.currentVersion
    };
    
    const endpoint = this.endpoints.get(path);
    
    if (endpoint && endpoint.deprecated) {
      headers['Deprecation'] = endpoint.deprecationDate ? 
        endpoint.deprecationDate.toISOString() : 
        'true';
      
      if (endpoint.sunsetDate) {
        headers['Sunset'] = endpoint.sunsetDate.toISOString();
      }
      
      // Add link to documentation
      headers['Link'] = '</api/developer/docs/deprecation>; rel="deprecation"';
    }
    
    return headers;
  }
  
  // Private helper methods
  
  private initializeEndpoints(): void {
    // Register all endpoints with their versions
    // This would be populated with all API endpoints
    
    // Auth endpoints
    this.registerEndpoint('/api/developer/auth/{tenantId}', ApiVersion.V1);
    
    // Key management endpoints
    this.registerEndpoint('/api/developer/keys/{tenantId}', ApiVersion.V1);
    this.registerEndpoint('/api/developer/keys/{tenantId}/{keyId}', ApiVersion.V1);
    
    // Webhook endpoints
    this.registerEndpoint('/api/developer/webhooks/{tenantId}/{apiKeyId}', ApiVersion.V1);
    this.registerEndpoint('/api/developer/webhooks/{tenantId}/webhook/{webhookId}', ApiVersion.V1);
    
    // OAuth endpoints
    this.registerEndpoint('/api/developer/oauth/{tenantId}/authorize', ApiVersion.V1);
    this.registerEndpoint('/api/developer/oauth/{tenantId}/token', ApiVersion.V1);
    this.registerEndpoint('/api/developer/oauth/{tenantId}/clients', ApiVersion.V1);
    this.registerEndpoint('/api/developer/oauth/{tenantId}/clients/{clientId}', ApiVersion.V1);
    
    // Documentation endpoints
    this.registerEndpoint('/api/developer/docs', ApiVersion.V1);
    this.registerEndpoint('/api/developer/docs/{section}', ApiVersion.V1);
    
    // Example of a deprecated endpoint
    this.registerEndpoint(
      '/api/developer/legacy/keys/{tenantId}', 
      ApiVersion.V1,
      true,
      new Date('2025-01-01'),
      new Date('2025-07-01')
    );
  }
}
