/**
 * External Developer API Types and Interfaces
 * 
 * This file defines the types and interfaces used in the external developer API
 * for the EdPsych Connect platform.
 */

/**
 * API Key Status
 */
export enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REVOKED = 'revoked'
}

/**
 * API Permission
 */
export enum ApiPermission {
  // Content permissions
  CONTENT_READ = 'content:read',
  CONTENT_WRITE = 'content:write',
  
  // Assessment permissions
  ASSESSMENT_READ = 'assessment:read',
  ASSESSMENT_WRITE = 'assessment:write',
  
  // User permissions
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  
  // Learning path permissions
  LEARNING_PATH_READ = 'learning_path:read',
  LEARNING_PATH_WRITE = 'learning_path:write',
  
  // Analytics permissions
  ANALYTICS_READ = 'analytics:read',
  
  // Webhook permissions
  WEBHOOK_MANAGE = 'webhook:manage'
}

/**
 * API Key
 */
export interface ApiKey {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  secret?: string; // Only returned when key is created
  permissions: ApiPermission[];
  status: ApiKeyStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

/**
 * API Usage Limit
 */
export interface ApiUsageLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

/**
 * API Usage
 */
export interface ApiUsage {
  apiKeyId: string;
  tenantId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

/**
 * API Webhook
 */
export interface ApiWebhook {
  id: string;
  tenantId: string;
  apiKeyId: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
  failureCount: number;
}

/**
 * API Webhook Event
 */
export interface ApiWebhookEvent {
  id: string;
  webhookId: string;
  tenantId: string;
  event: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  lastAttemptAt?: Date;
  createdAt: Date;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * API Pagination
 */
export interface ApiPagination {
  limit: number;
  offset: number;
  total: number;
}

/**
 * API Response with Pagination
 */
export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: ApiPagination;
}

/**
 * API Authentication Request
 */
export interface ApiAuthRequest {
  apiKey: string;
  apiSecret: string;
}

/**
 * API Authentication Response
 */
export interface ApiAuthResponse {
  token: string;
  expiresAt: string;
}

/**
 * API Token Payload
 */
export interface ApiTokenPayload {
  keyId: string;
  tenantId: string;
  permissions: ApiPermission[];
  exp: number;
  iat: number;
}

/**
 * API Documentation Section
 */
export interface ApiDocumentationSection {
  id: string;
  title: string;
  description: string;
  order: number;
  endpoints?: ApiDocumentationEndpoint[];
}

/**
 * API Documentation Endpoint
 */
export interface ApiDocumentationEndpoint {
  id: string;
  path: string;
  method: string;
  title: string;
  description: string;
  requestSchema?: any;
  responseSchema?: any;
  parameters?: ApiDocumentationParameter[];
  examples?: ApiDocumentationExample[];
}

/**
 * API Documentation Parameter
 */
export interface ApiDocumentationParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  location: 'path' | 'query' | 'header' | 'body';
}

/**
 * API Documentation Example
 */
export interface ApiDocumentationExample {
  title: string;
  request: any;
  response: any;
}
