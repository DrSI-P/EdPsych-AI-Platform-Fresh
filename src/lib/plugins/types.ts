/**
 * Plugin System Types
 * 
 * This file defines the core types for the EdPsych-AI-Education-Platform plugin system.
 * The plugin architecture is designed to allow third-party integrations while maintaining
 * security, stability, and admin control.
 */

import { z } from 'zod';

/**
 * Plugin metadata schema
 */
export const PluginMetadataSchema = z.object({
  id: z.string().min(3).max(50),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  author: z.string().min(2).max(100),
  website: z.string().url().optional(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
  supportedFeatures: z.array(z.string()),
  requiredPermissions: z.array(z.string()),
  settings: z.record(z.any()).optional(),
  compatibilityVersion: z.string().regex(/^\d+\.\d+$/),
});

export type PluginMetadata = z.infer<typeof PluginMetadataSchema>;

/**
 * Plugin status enum
 */
export enum PluginStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  ERROR = 'error',
  PENDING_APPROVAL = 'pending_approval',
  INCOMPATIBLE = 'incompatible',
}

/**
 * Plugin instance schema with runtime status
 */
export const PluginInstanceSchema = z.object({
  metadata: PluginMetadataSchema,
  status: z.nativeEnum(PluginStatus),
  installedAt: z.date(),
  updatedAt: z.date(),
  errorMessage: z.string().optional(),
  configuredSettings: z.record(z.any()).optional(),
  usageMetrics: z.object({
    lastUsed: z.date().optional(),
    totalUsageCount: z.number().default(0),
    averageResponseTime: z.number().optional(),
  }).optional(),
});

export type PluginInstance = z.infer<typeof PluginInstanceSchema>;

/**
 * Plugin capability interfaces
 */

// Base plugin interface that all plugins must implement
export interface BasePlugin {
  initialize: () => Promise<boolean>;
  shutdown: () => Promise<void>;
  getMetadata: () => PluginMetadata;
  getStatus: () => PluginStatus;
  configure: (settings: Record<string, any>) => Promise<boolean>;
}

// Assessment tool plugin interface
export interface AssessmentToolPlugin extends BasePlugin {
  createAssessment: (params) => Promise<any>;
  scoreAssessment: (assessmentId: string, responses) => Promise<any>;
  getResults: (assessmentId: string) => Promise<any>;
}

// Content provider plugin interface
export interface ContentProviderPlugin extends BasePlugin {
  searchContent: (query: string, filters?) => Promise<any[]>;
  getContent: (contentId: string) => Promise<any>;
  listCategories: () => Promise<string[]>;
}

// Accessibility tool plugin interface
export interface AccessibilityToolPlugin extends BasePlugin {
  enhanceContent: (content) => Promise<any>;
  getAccessibilityFeatures: () => Promise<string[]>;
  checkAccessibility: (content) => Promise<any>;
}

// Data integration plugin interface
export interface DataIntegrationPlugin extends BasePlugin {
  importData: (source) => Promise<any>;
  exportData: (target) => Promise<any>;
  syncData: (source, target) => Promise<any>;
}

/**
 * Plugin registry for managing installed plugins
 */
export interface PluginRegistry {
  registerPlugin: (plugin: BasePlugin) => Promise<boolean>;
  unregisterPlugin: (pluginId: string) => Promise<boolean>;
  getPlugin: (pluginId: string) => BasePlugin | null;
  listPlugins: (status?: PluginStatus) => PluginInstance[];
  enablePlugin: (pluginId: string) => Promise<boolean>;
  disablePlugin: (pluginId: string) => Promise<boolean>;
  updatePluginSettings: (pluginId: string, settings: Record<string, any>) => Promise<boolean>;
}

/**
 * Plugin permission levels
 */
export enum PluginPermission {
  READ_CONTENT = 'read_content',
  WRITE_CONTENT = 'write_content',
  READ_USER_DATA = 'read_user_data',
  WRITE_USER_DATA = 'write_user_data',
  READ_ASSESSMENT = 'read_assessment',
  WRITE_ASSESSMENT = 'write_assessment',
  SYSTEM_INTEGRATION = 'system_integration',
  EXTERNAL_API = 'external_api',
}

/**
 * Plugin event types for the event system
 */
export enum PluginEventType {
  INSTALLED = 'plugin_installed',
  UNINSTALLED = 'plugin_uninstalled',
  ENABLED = 'plugin_enabled',
  DISABLED = 'plugin_disabled',
  ERROR = 'plugin_error',
  SETTINGS_UPDATED = 'plugin_settings_updated',
  DATA_PROCESSED = 'plugin_data_processed',
}

export interface PluginEvent {
  type: PluginEventType;
  pluginId: string;
  timestamp: Date;
  data?;
}
