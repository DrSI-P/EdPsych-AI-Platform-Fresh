/**
 * Mobile Application Types
 * 
 * This file defines the core types and interfaces for the mobile application features,
 * including device detection, offline capabilities, and push notifications.
 */

// Device types
export enum DeviceType {
  MOBILE_PHONE = 'mobile_phone',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  UNKNOWN = 'unknown'
}

// Operating system types
export enum OperatingSystem {
  IOS = 'ios',
  ANDROID = 'android',
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  CHROME_OS = 'chrome_os',
  UNKNOWN = 'unknown'
}

// Browser types
export enum BrowserType {
  CHROME = 'chrome',
  SAFARI = 'safari',
  FIREFOX = 'firefox',
  EDGE = 'edge',
  OPERA = 'opera',
  SAMSUNG = 'samsung',
  UC = 'uc',
  UNKNOWN = 'unknown'
}

// Connection status
export enum ConnectionStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SLOW = 'slow', // Low bandwidth
  METERED = 'metered', // Limited data plan
  UNKNOWN = 'unknown'
}

// Device information interface
export interface DeviceInfo {
  id: string; // Unique device identifier
  type: DeviceType;
  os: OperatingSystem;
  osVersion: string;
  browser: BrowserType;
  browserVersion: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  touchSupport: boolean;
  orientation: 'portrait' | 'landscape';
  connectionType?: string; // wifi, cellular, etc.
  connectionStatus: ConnectionStatus;
  batteryLevel?: number; // 0-100
  batteryCharging?: boolean;
  lastSeen: Date;
  capabilities: {
    pushNotifications: boolean;
    locationServices: boolean;
    camera: boolean;
    microphone: boolean;
    storage: boolean;
    vibration: boolean;
    bluetooth: boolean;
    nfc: boolean;
  };
}

// Offline sync status
export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFLICT = 'conflict'
}

// Offline data item
export interface OfflineDataItem<T> {
  id: string;
  entityType: string; // e.g., 'document', 'assessment', 'profile'
  data: T;
  lastModified: Date;
  syncStatus: SyncStatus;
  syncAttempts: number;
  syncError?: string;
  priority: 'high' | 'medium' | 'low';
  expiresAt?: Date; // Optional expiration date for cached data
}

// Offline sync queue item
export interface SyncQueueItem {
  id: string;
  entityId: string;
  entityType: string;
  operation: 'create' | 'update' | 'delete';
  data;
  timestamp: Date;
  attempts: number;
  lastAttempt?: Date;
  error?: string;
  priority: 'high' | 'medium' | 'low';
}

// Push notification types
export enum NotificationType {
  GENERAL = 'general',
  ASSESSMENT = 'assessment',
  COLLABORATION = 'collaboration',
  LEARNING_PATH = 'learning_path',
  ACHIEVEMENT = 'achievement',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}

// Push notification
export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data?: {
    url?: string;
    entityId?: string;
    entityType?: string;
    action?: string;
    [key: string];
  };
  sentAt: Date;
  expiresAt?: Date;
  read: boolean;
  readAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  priority: 'high' | 'normal' | 'low';
  channels: any[]; // e.g., 'assessment', 'collaboration', 'system'
  userId: string;
  deviceId?: string; // If targeted to a specific device
}

// Notification preferences
export interface NotificationPreferences {
  userId: string;
  channels: {
    [key: string]: {
      enabled: boolean;
      pushEnabled: boolean;
      emailEnabled: boolean;
      inAppEnabled: boolean;
      quietHoursEnabled: boolean;
      quietHoursStart?: string; // HH:MM format
      quietHoursEnd?: string; // HH:MM format
    };
  };
  devices: {
    [deviceId: string]: {
      enabled: boolean;
      token?: string; // Push notification token
      lastRegistered: Date;
    };
  };
}

// Mobile view mode
export enum MobileViewMode {
  STANDARD = 'standard',
  COMPACT = 'compact',
  READER = 'reader', // Simplified reading view
  FOCUS = 'focus', // Distraction-free mode
  ACCESSIBILITY = 'accessibility' // Enhanced accessibility mode
}

// Mobile settings
export interface MobileSettings {
  userId: string;
  deviceId: string;
  viewMode: MobileViewMode;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  offlineMode: {
    enabled: boolean;
    maxStorageSize: number; // in MB
    autoDownloadContent: boolean;
    contentTypes: any[]; // Types of content to cache
    syncOnWifiOnly: boolean;
  };
  dataUsage: {
    saveData: boolean;
    highQualityMedia: boolean;
    autoPlayMedia: boolean;
    preloadResources: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeTargets: boolean;
    screenReader: boolean;
    voiceControl: boolean;
  };
  lastUpdated: Date;
}

// Mobile navigation history item
export interface NavigationHistoryItem {
  path: string;
  title: string;
  timestamp: Date;
  params?: Record<string, string>;
  state?;
}

// Mobile navigation history
export interface NavigationHistory {
  userId: string;
  deviceId: string;
  items: any[];
  currentIndex: number;
  lastUpdated: Date;
}

// Mobile download item
export interface DownloadItem {
  id: string;
  userId: string;
  deviceId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number; // in bytes
  progress: number; // 0-100
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'canceled';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  localPath?: string;
  metadata?: {
    title?: string;
    description?: string;
    entityId?: string;
    entityType?: string;
    [key: string];
  };
}

// Mobile upload item
export interface UploadItem {
  id: string;
  userId: string;
  deviceId: string;
  filename: string;
  mimeType: string;
  size: number; // in bytes
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'failed' | 'canceled';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  localPath: string;
  destinationUrl?: string;
  metadata?: {
    title?: string;
    description?: string;
    entityId?: string;
    entityType?: string;
    [key: string];
  };
}

// Mobile gesture types
export enum GestureType {
  TAP = 'tap',
  DOUBLE_TAP = 'double_tap',
  LONG_PRESS = 'long_press',
  SWIPE = 'swipe',
  PINCH = 'pinch',
  ROTATE = 'rotate'
}

// Mobile gesture configuration
export interface GestureConfig {
  userId: string;
  deviceId: string;
  gestures: {
    [key in GestureType]?: {
      enabled: boolean;
      customAction?: string;
      sensitivity?: number; // 1-10
    };
  };
  lastUpdated: Date;
}

// Mobile performance metrics
export interface MobilePerformanceMetrics {
  deviceId: string;
  timestamp: Date;
  appVersion: string;
  sessionId: string;
  metrics: {
    loadTime: number; // milliseconds
    timeToInteractive: number; // milliseconds
    memoryUsage: number; // MB
    batteryImpact: number; // 1-10 scale
    frameRate: number; // FPS
    networkRequests: number;
    errors: number;
    crashes: number;
  };
  screenMetrics: {
    [screenName: string]: {
      renderTime: number; // milliseconds
      interactionDelay: number; // milliseconds
      memoryImpact: number; // MB
    };
  };
}

// Mobile feature flags
export interface MobileFeatureFlags {
  deviceId: string;
  flags: {
    [featureKey: string]: {
      enabled: boolean;
      rolloutPercentage: number; // 0-100
      validFrom?: Date;
      validTo?: Date;
      targetGroups?: string[]; // e.g., 'beta-testers', 'teachers', 'students'
    };
  };
  lastUpdated: Date;
}
