/**
 * Progressive Web App Service
 * 
 * This service provides comprehensive PWA functionality including:
 * - Offline capabilities
 * - Installation experience
 * - Background sync
 * - Push notifications
 * - Content caching strategies
 */

// Service worker registration status
export enum ServiceWorkerStatus {
  PENDING = 'pending',
  REGISTERED = 'registered',
  FAILED = 'failed',
  UPDATING = 'updating',
  UPDATED = 'updated',
  REDUNDANT = 'redundant'
}

// Cache strategy types
export enum CacheStrategy {
  CACHE_FIRST = 'cache_first',
  NETWORK_FIRST = 'network_first',
  STALE_WHILE_REVALIDATE = 'stale_while_revalidate',
  NETWORK_ONLY = 'network_only',
  CACHE_ONLY = 'cache_only'
}

// Sync status
export enum SyncStatus {
  PENDING = 'pending',
  SYNCING = 'syncing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// PWA installation status
export enum InstallationStatus {
  NOT_INSTALLABLE = 'not_installable',
  INSTALLABLE = 'installable',
  INSTALLED = 'installed',
  INSTALLATION_REJECTED = 'installation_rejected'
}

// Offline content type
export enum OfflineContentType {
  CURRICULUM = 'curriculum',
  ASSESSMENT = 'assessment',
  ACTIVITY = 'activity',
  RESOURCE = 'resource',
  USER_DATA = 'user_data',
  MEDIA = 'media'
}

// Offline content item
export interface OfflineContentItem {
  id: string;
  type: OfflineContentType;
  title: string;
  description: string;
  url: string;
  size: number; // in bytes
  lastUpdated: Date;
  expiresAt?: Date;
  dependencies?: string[]; // IDs of other content items this depends on
  syncStatus: SyncStatus;
  accessCount: number;
  lastAccessed?: Date;
}

// PWA configuration
export interface PWAConfig {
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'natural' | 'portrait' | 'landscape';
  iconSizes: number[];
  startUrl: string;
  scope: string;
  offlineEnabled: boolean;
  installPromptEnabled: boolean;
  notificationsEnabled: boolean;
  automaticBackgroundSync: boolean;
  periodicSyncInterval: number; // in minutes
  maxOfflineStorage: number; // in MB
  defaultCacheStrategy: CacheStrategy;
  cacheExpirationDays: number;
}

// Default PWA configuration
const defaultConfig: PWAConfig = {
  appName: 'EdPsych Connect',
  shortName: 'EdPsych',
  description: 'Personalized learning platform for children and young people',
  themeColor: '#4a86e8',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'any',
  iconSizes: [72, 96, 128, 144, 152, 192, 384, 512],
  startUrl: '/',
  scope: '/',
  offlineEnabled: true,
  installPromptEnabled: true,
  notificationsEnabled: true,
  automaticBackgroundSync: true,
  periodicSyncInterval: 60,
  maxOfflineStorage: 500,
  defaultCacheStrategy: CacheStrategy.STALE_WHILE_REVALIDATE,
  cacheExpirationDays: 30
};

/**
 * Progressive Web App Service
 */
export class ProgressiveWebAppService {
  private static instance: ProgressiveWebAppService;
  private config: PWAConfig;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private serviceWorkerStatus: ServiceWorkerStatus = ServiceWorkerStatus.PENDING;
  private installPromptEvent: any = null;
  private installationStatus: InstallationStatus = InstallationStatus.NOT_INSTALLABLE;
  private offlineContent: Map<string, OfflineContentItem> = new Map();
  private syncQueue: Map<string, any> = new Map();
  private isOnline: boolean = true;
  private storageEstimate: { usage: number; quota: number } = { usage: 0, quota: 0 };
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor(config?: Partial<PWAConfig>) {
    this.config = { ...defaultConfig, ...config };
    this.initializeEventListeners();
  }

  /**
   * Get the singleton instance of the Progressive Web App Service
   */
  public static getInstance(config?: Partial<PWAConfig>): ProgressiveWebAppService {
    if (!ProgressiveWebAppService.instance) {
      ProgressiveWebAppService.instance = new ProgressiveWebAppService(config);
    } else if (config) {
      ProgressiveWebAppService.instance.updateConfig(config);
    }
    return ProgressiveWebAppService.instance;
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    if (typeof window !== 'undefined') {
      // Online/offline status
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.dispatchEvent('online', { timestamp: new Date() });
        this.processSyncQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.dispatchEvent('offline', { timestamp: new Date() });
      });

      // Installation prompt
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        this.installPromptEvent = event;
        this.installationStatus = InstallationStatus.INSTALLABLE;
        this.dispatchEvent('installable', { timestamp: new Date() });
      });

      // App installed
      window.addEventListener('appinstalled', () => {
        this.installationStatus = InstallationStatus.INSTALLED;
        this.dispatchEvent('installed', { timestamp: new Date() });
      });
    }
  }

  /**
   * Register service worker
   */
  public async registerServiceWorker(): Promise<ServiceWorkerStatus> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      this.serviceWorkerStatus = ServiceWorkerStatus.FAILED;
      return this.serviceWorkerStatus;
    }

    try {
      this.serviceWorkerStatus = ServiceWorkerStatus.PENDING;
      this.dispatchEvent('serviceWorkerStatusChange', { status: this.serviceWorkerStatus });

      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: this.config.scope
      });

      this.serviceWorkerRegistration = registration;

      // Set up service worker update listeners
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                this.serviceWorkerStatus = ServiceWorkerStatus.UPDATED;
              } else {
                this.serviceWorkerStatus = ServiceWorkerStatus.REGISTERED;
              }
              this.dispatchEvent('serviceWorkerStatusChange', { status: this.serviceWorkerStatus });
            }
          });
        }
      });

      // Check for updates
      if (registration.active) {
        this.serviceWorkerStatus = ServiceWorkerStatus.REGISTERED;
        this.dispatchEvent('serviceWorkerStatusChange', { status: this.serviceWorkerStatus });
      }

      return this.serviceWorkerStatus;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      this.serviceWorkerStatus = ServiceWorkerStatus.FAILED;
      this.dispatchEvent('serviceWorkerStatusChange', { status: this.serviceWorkerStatus });
      return this.serviceWorkerStatus;
    }
  }

  /**
   * Update service worker
   */
  public async updateServiceWorker(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    try {
      this.serviceWorkerStatus = ServiceWorkerStatus.UPDATING;
      this.dispatchEvent('serviceWorkerStatusChange', { status: this.serviceWorkerStatus });

      await this.serviceWorkerRegistration.update();
      return true;
    } catch (error) {
      console.error('Service worker update failed:', error);
      return false;
    }
  }

  /**
   * Show installation prompt
   */
  public async showInstallPrompt(): Promise<InstallationStatus> {
    if (!this.installPromptEvent) {
      return this.installationStatus;
    }

    try {
      const result = await this.installPromptEvent.prompt();
      
      if (result.outcome === 'accepted') {
        this.installationStatus = InstallationStatus.INSTALLED;
      } else {
        this.installationStatus = InstallationStatus.INSTALLATION_REJECTED;
      }
      
      this.installPromptEvent = null;
      return this.installationStatus;
    } catch (error) {
      console.error('Installation prompt failed:', error);
      return this.installationStatus;
    }
  }

  /**
   * Check if app is installable
   */
  public isInstallable(): boolean {
    return this.installationStatus === InstallationStatus.INSTALLABLE;
  }

  /**
   * Check if app is installed
   */
  public isInstalled(): boolean {
    return this.installationStatus === InstallationStatus.INSTALLED;
  }

  /**
   * Check if app is running in standalone mode (installed PWA)
   */
  public isRunningAsStandalone(): boolean {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone === true;
    }
    return false;
  }

  /**
   * Check if offline mode is supported
   */
  public isOfflineSupported(): boolean {
    return this.serviceWorkerStatus === ServiceWorkerStatus.REGISTERED ||
           this.serviceWorkerStatus === ServiceWorkerStatus.UPDATED;
  }

  /**
   * Check if device is online
   */
  public isDeviceOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Add content for offline access
   * 
   * @param item Offline content item
   */
  public async addOfflineContent(item: Omit<OfflineContentItem, 'syncStatus' | 'accessCount' | 'lastAccessed'>): Promise<boolean> {
    if (!this.isOfflineSupported()) {
      return false;
    }

    try {
      // Check storage quota
      await this.updateStorageEstimate();
      const availableStorage = this.storageEstimate.quota - this.storageEstimate.usage;
      
      if (item.size > availableStorage) {
        console.error('Not enough storage space for offline content');
        return false;
      }

      // Add to cache via service worker
      if (this.serviceWorkerRegistration && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'ADD_TO_CACHE',
          url: item.url,
          id: item.id
        });
      }

      // Add to offline content registry
      const contentItem: OfflineContentItem = {
        ...item,
        syncStatus: SyncStatus.COMPLETED,
        accessCount: 0,
        lastUpdated: new Date()
      };

      this.offlineContent.set(item.id, contentItem);
      this.dispatchEvent('offlineContentAdded', { item: contentItem });

      return true;
    } catch (error) {
      console.error('Failed to add offline content:', error);
      return false;
    }
  }

  /**
   * Remove content from offline access
   * 
   * @param id Content item ID
   */
  public async removeOfflineContent(id: string): Promise<boolean> {
    if (!this.offlineContent.has(id)) {
      return false;
    }

    try {
      const item = this.offlineContent.get(id)!;

      // Remove from cache via service worker
      if (this.serviceWorkerRegistration && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'REMOVE_FROM_CACHE',
          url: item.url,
          id: item.id
        });
      }

      // Remove from offline content registry
      this.offlineContent.delete(id);
      this.dispatchEvent('offlineContentRemoved', { id });

      return true;
    } catch (error) {
      console.error('Failed to remove offline content:', error);
      return false;
    }
  }

  /**
   * Get all offline content
   */
  public getOfflineContent(): OfflineContentItem[] {
    return Array.from(this.offlineContent.values());
  }

  /**
   * Get offline content by ID
   * 
   * @param id Content item ID
   */
  public getOfflineContentById(id: string): OfflineContentItem | undefined {
    return this.offlineContent.get(id);
  }

  /**
   * Get offline content by type
   * 
   * @param type Content type
   */
  public getOfflineContentByType(type: OfflineContentType): OfflineContentItem[] {
    return Array.from(this.offlineContent.values()).filter(item => item.type === type);
  }

  /**
   * Track offline content access
   * 
   * @param id Content item ID
   */
  public trackContentAccess(id: string): void {
    const item = this.offlineContent.get(id);
    if (item) {
      item.accessCount++;
      item.lastAccessed = new Date();
      this.offlineContent.set(id, item);
    }
  }

  /**
   * Add item to sync queue
   * 
   * @param id Unique identifier for the sync item
   * @param data Data to be synced
   */
  public addToSyncQueue(id: string, data: any): void {
    this.syncQueue.set(id, {
      data,
      timestamp: new Date(),
      attempts: 0
    });

    this.dispatchEvent('syncQueueUpdated', { 
      queueSize: this.syncQueue.size 
    });

    // If online, process the queue immediately
    if (this.isOnline) {
      this.processSyncQueue();
    } else if (this.config.automaticBackgroundSync && 'serviceWorker' in navigator && 'SyncManager' in window) {
      // Register for background sync
      this.registerBackgroundSync();
    }
  }

  /**
   * Process sync queue
   */
  public async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.size === 0) {
      return;
    }

    this.dispatchEvent('syncStarted', { 
      queueSize: this.syncQueue.size 
    });

    const syncPromises: Promise<boolean>[] = [];

    for (const [id, item] of this.syncQueue.entries()) {
      syncPromises.push(this.syncItem(id, item));
    }

    await Promise.all(syncPromises);

    this.dispatchEvent('syncCompleted', { 
      successCount: syncPromises.filter(p => p).length,
      failureCount: syncPromises.filter(p => !p).length
    });
  }

  /**
   * Sync a single item
   * 
   * @param id Item ID
   * @param item Sync item
   */
  private async syncItem(id: string, item: any): Promise<boolean> {
    try {
      // In a real implementation, this would send the data to the server
      // For this example, we'll simulate a successful sync after a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove from queue after successful sync
      this.syncQueue.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to sync item ${id}:`, error);
      
      // Increment attempt count
      item.attempts++;
      
      // Remove from queue if too many attempts
      if (item.attempts >= 5) {
        this.syncQueue.delete(id);
      }
      
      return false;
    }
  }

  /**
   * Register for background sync
   */
  private async registerBackgroundSync(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
      return;
    }

    try {
      if (!this.serviceWorkerRegistration) {
        await this.registerServiceWorker();
      }

      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.sync.register('sync-data');
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  /**
   * Register for periodic background sync
   */
  public async registerPeriodicSync(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PeriodicSyncManager' in window)) {
      return false;
    }

    try {
      if (!this.serviceWorkerRegistration) {
        await this.registerServiceWorker();
      }

      if (this.serviceWorkerRegistration && 'periodicSync' in this.serviceWorkerRegistration) {
        const periodicSync = (this.serviceWorkerRegistration as any).periodicSync;
        
        // Check permission
        const status = await periodicSync.permissionState();
        if (status !== 'granted') {
          return false;
        }

        // Register periodic sync
        await periodicSync.register('content-update', {
          minInterval: this.config.periodicSyncInterval * 60 * 1000 // Convert to milliseconds
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
      return false;
    }
  }

  /**
   * Update storage estimate
   */
  private async updateStorageEstimate(): Promise<void> {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return;
    }

    try {
      const estimate = await navigator.storage.estimate();
      this.storageEstimate = {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    } catch (error) {
      console.error('Failed to get storage estimate:', error);
    }
  }

  /**
   * Get storage usage information
   */
  public async getStorageUsage(): Promise<{ usage: number; quota: number; percentUsed: number }> {
    await this.updateStorageEstimate();
    
    return {
      usage: this.storageEstimate.usage,
      quota: this.storageEstimate.quota,
      percentUsed: this.storageEstimate.quota > 0 
        ? (this.storageEstimate.usage / this.storageEstimate.quota) * 100 
        : 0
    };
  }

  /**
   * Request persistent storage
   */
  public async requestPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator) || !('persist' in navigator.storage)) {
      return false;
    }

    try {
      return await navigator.storage.persist();
    } catch (error) {
      console.error('Failed to request persistent storage:', error);
      return false;
    }
  }

  /**
   * Check if storage is persistent
   */
  public async isPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator) || !('persisted' in navigator.storage)) {
      return false;
    }

    try {
      return await navigator.storage.persisted();
    } catch (error) {
      console.error('Failed to check persistent storage:', error);
      return false;
    }
  }

  /**
   * Clear all caches
   */
  public async clearAllCaches(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      // Clear offline content registry
      this.offlineContent.clear();
      this.dispatchEvent('cachesCleared', { timestamp: new Date() });
      
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return false;
    }
  }

  /**
   * Update PWA configuration
   * 
   * @param config Partial PWA configuration
   */
  public updateConfig(config: Partial<PWAConfig>): void {
    this.config = { ...this.config, ...config };
    this.dispatchEvent('configUpdated', { config: this.config });
  }

  /**
   * Get current PWA configuration
   */
  public getConfig(): PWAConfig {
    return { ...this.config };
  }

  /**
   * Generate Web App Manifest
   */
  public generateManifest(): any {
    return {
      name: this.config.appName,
      short_name: this.config.shortName,
      description: this.config.description,
      start_url: this.config.startUrl,
      display: this.config.display,
      background_color: this.config.backgroundColor,
      theme_color: this.config.themeColor,
      orientation: this.config.orientation,
      scope: this.config.scope,
      icons: this.config.iconSizes.map(size => ({
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable'
      }))
    };
  }

  /**
   * Generate basic service worker code
   */
  public generateServiceWorkerCode(): string {
    const cacheVersion = `v1-${Date.now()}`;
    const cacheStrategy = this.config.defaultCacheStrategy;
    
    return `
      // EdPsych Connect Service Worker
      const CACHE_NAME = '${cacheVersion}';
      const OFFLINE_URL = '/offline.html';

      // Install event - cache core assets
      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
              OFFLINE_URL,
              '/',
              '/index.html',
              '/styles.css',
              '/main.js',
              '/icons/icon-192x192.png'
            ]);
          })
        );
      });

      // Activate event - clean up old caches
      self.addEventListener('activate', (event) => {
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames
                .filter((name) => name.startsWith('v1-') && name !== CACHE_NAME)
                .map((name) => caches.delete(name))
            );
          })
        );
      });

      // Fetch event - handle network requests
      self.addEventListener('fetch', (event) => {
        const strategy = '${cacheStrategy}';
        
        if (event.request.mode === 'navigate') {
          event.respondWith(
            fetch(event.request).catch(() => {
              return caches.match(OFFLINE_URL);
            })
          );
          return;
        }
        
        if (strategy === 'cache_first') {
          event.respondWith(
            caches.match(event.request).then((response) => {
              return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
              });
            })
          );
        } else if (strategy === 'network_first') {
          event.respondWith(
            fetch(event.request).then((response) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
            }).catch(() => {
              return caches.match(event.request);
            })
          );
        } else if (strategy === 'stale_while_revalidate') {
          event.respondWith(
            caches.match(event.request).then((response) => {
              const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
              });
              return response || fetchPromise;
            })
          );
        } else {
          // network_only or other strategies
          event.respondWith(fetch(event.request));
        }
      });

      // Message event - handle messages from clients
      self.addEventListener('message', (event) => {
        if (event.data.type === 'ADD_TO_CACHE') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.add(event.data.url);
          });
        } else if (event.data.type === 'REMOVE_FROM_CACHE') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.delete(event.data.url);
          });
        }
      });

      // Sync event - handle background sync
      self.addEventListener('sync', (event) => {
        if (event.tag === 'sync-data') {
          event.waitUntil(syncData());
        }
      });

      // Periodic sync event - handle periodic background sync
      self.addEventListener('periodicsync', (event) => {
        if (event.tag === 'content-update') {
          event.waitUntil(updateContent());
        }
      });

      // Push event - handle push notifications
      self.addEventListener('push', (event) => {
        const data = event.data.json();
        
        const options = {
          body: data.body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          data: data.data
        };
        
        event.waitUntil(
          self.registration.showNotification(data.title, options)
        );
      });

      // Notification click event - handle notification clicks
      self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        
        if (event.notification.data && event.notification.data.url) {
          event.waitUntil(
            clients.openWindow(event.notification.data.url)
          );
        }
      });

      // Helper function for sync
      async function syncData() {
        // In a real implementation, this would sync data with the server
        console.log('Background sync executed');
        return Promise.resolve();
      }

      // Helper function for periodic sync
      async function updateContent() {
        // In a real implementation, this would update cached content
        console.log('Periodic sync executed');
        return Promise.resolve();
      }
    `;
  }

  /**
   * Add event listener
   * 
   * @param event Event name
   * @param callback Callback function
   */
  public addEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  /**
   * Remove event listener
   * 
   * @param event Event name
   * @param callback Callback function
   */
  public removeEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }

  /**
   * Dispatch event
   * 
   * @param event Event name
   * @param data Event data
   */
  private dispatchEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }
}

// Export singleton instance
export const progressiveWebApp = ProgressiveWebAppService.getInstance();
