/**
 * Content Provider Types and Interfaces
 * 
 * This file defines the types and interfaces used in the third-party content provider
 * integration for the EdPsych Connect platform.
 */

/**
 * Content Provider Type
 */
export enum ContentProviderType {
  GENERAL = 'general',
  VIDEO = 'video',
  INTERACTIVE = 'interactive',
  ASSESSMENT = 'assessment',
  DOCUMENT = 'document',
  CURRICULUM = 'curriculum'
}

/**
 * Content Provider Status
 */
export enum ContentProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ERROR = 'error'
}

/**
 * Content Format
 */
export enum ContentFormat {
  HTML = 'html',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
  EMBED = 'embed',
  SCORM = 'scorm',
  XAPI = 'xapi'
}

/**
 * Content Provider
 */
export interface ContentProvider {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: ContentProviderType;
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthTokenUrl?: string;
  status: ContentProviderStatus;
  supportedFormats: ContentFormat[];
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content Item
 */
export interface ContentItem {
  id: string;
  tenantId: string;
  providerId: string;
  externalId: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  format: ContentFormat;
  duration?: number; // in seconds
  language?: string;
  subjects?: string[];
  keyStages?: string[];
  ageRange?: [number, number]; // min and max age
  tags?: string[];
  author?: string;
  license?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content Search Query
 */
export interface ContentSearchQuery {
  query?: string;
  providers?: string[];
  formats?: ContentFormat[];
  subjects?: string[];
  keyStages?: string[];
  ageRange?: [number, number];
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Content Search Result
 */
export interface ContentSearchResult {
  items: ContentItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Content Usage Record
 */
export interface ContentUsageRecord {
  id: string;
  tenantId: string;
  contentItemId: string;
  userId: string;
  contextId?: string; // e.g., class, course, or learning path ID
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  progress?: number; // 0-100
  score?: number; // 0-100
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content Recommendation
 */
export interface ContentRecommendation {
  id: string;
  tenantId: string;
  contentItemId: string;
  userId: string;
  reason: string;
  priority: number; // 1-10, higher is more important
  status: 'pending' | 'viewed' | 'accepted' | 'rejected';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content Provider Webhook Event
 */
export interface ContentProviderWebhookEvent {
  id: string;
  tenantId: string;
  providerId: string;
  eventType: string;
  payload: any;
  processedAt?: Date;
  status: 'pending' | 'processed' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
