/**
 * Mobile Service
 * 
 * This service provides core functionality for mobile application features,
 * including device detection, offline capabilities, and push notifications.
 */

import { 
  DeviceType, 
  OperatingSystem, 
  BrowserType, 
  ConnectionStatus,
  DeviceInfo,
  SyncStatus,
  OfflineDataItem,
  SyncQueueItem,
  NotificationType,
  PushNotification,
  NotificationPreferences,
  MobileViewMode,
  MobileSettings
} from './mobileTypes';

/**
 * Mobile Device Detection Service
 * Detects device information and capabilities
 */
export class DeviceDetectionService {
  private static instance: DeviceDetectionService;
  private deviceInfo: DeviceInfo | null = null;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): DeviceDetectionService {
    if (!DeviceDetectionService.instance) {
      DeviceDetectionService.instance = new DeviceDetectionService();
    }
    return DeviceDetectionService.instance;
  }
  
  /**
   * Initialize device detection
   */
  public initialize(): void {
    this.detectDeviceInfo();
    this.setupEventListeners();
  }
  
  /**
   * Detect device information
   */
  private detectDeviceInfo(): void {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Generate a persistent device ID or retrieve from storage
    const deviceId = this.getOrCreateDeviceId();
    
    // Detect device type
    const deviceType = this.detectDeviceType(userAgent);
    
    // Detect operating system
    const { os, osVersion } = this.detectOperatingSystem(userAgent, platform);
    
    // Detect browser
    const { browser, browserVersion } = this.detectBrowser(userAgent);
    
    // Get screen information
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Detect touch support
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detect orientation
    const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
    
    // Detect connection status
    const connectionStatus = this.detectConnectionStatus();
    
    // Detect capabilities
    const capabilities = {
      pushNotifications: 'Notification' in window && Notification.permission !== 'denied',
      locationServices: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      storage: 'localStorage' in window && 'indexedDB' in window,
      vibration: 'vibrate' in navigator,
      bluetooth: 'bluetooth' in navigator,
      nfc: 'nfc' in navigator
    };
    
    // Create device info object
    this.deviceInfo = {
      id: deviceId,
      type: deviceType,
      os,
      osVersion,
      browser,
      browserVersion,
      screenWidth,
      screenHeight,
      pixelRatio,
      touchSupport,
      orientation,
      connectionStatus,
      lastSeen: new Date(),
      capabilities
    };
    
    // Detect battery if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery) => {
        if (this.deviceInfo) {
          this.deviceInfo.batteryLevel = battery.level * 100;
          this.deviceInfo.batteryCharging = battery.charging;
          
          // Set up battery event listeners
          battery.addEventListener('levelchange', () => {
            if (this.deviceInfo) {
              this.deviceInfo.batteryLevel = battery.level * 100;
            }
          });
          
          battery.addEventListener('chargingchange', () => {
            if (this.deviceInfo) {
              this.deviceInfo.batteryCharging = battery.charging;
            }
          });
        }
      });
    }
    
    // Detect connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (this.deviceInfo && connection) {
        this.deviceInfo.connectionType = connection.effectiveType;
        
        // Set up connection event listeners
        connection.addEventListener('change', () => {
          if (this.deviceInfo) {
            this.deviceInfo.connectionType = connection.effectiveType;
            this.deviceInfo.connectionStatus = this.detectConnectionStatus();
          }
        });
      }
    }
  }
  
  /**
   * Set up event listeners for device changes
   */
  private setupEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      if (this.deviceInfo) {
        this.deviceInfo.connectionStatus = this.detectConnectionStatus();
      }
    });
    
    window.addEventListener('offline', () => {
      if (this.deviceInfo) {
        this.deviceInfo.connectionStatus = ConnectionStatus.OFFLINE;
      }
    });
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      if (this.deviceInfo) {
        this.deviceInfo.orientation = window.screen.width > window.screen.height ? 'landscape' : 'portrait';
      }
    });
    
    // Update last seen timestamp periodically
    setInterval(() => {
      if (this.deviceInfo) {
        this.deviceInfo.lastSeen = new Date();
      }
    }, 60000); // Every minute
  }
  
  /**
   * Get or create a persistent device ID
   */
  private getOrCreateDeviceId(): string {
    const storageKey = 'edpsych_device_id';
    let deviceId = localStorage.getItem(storageKey);
    
    if (!deviceId) {
      // Generate a UUID
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      localStorage.setItem(storageKey, deviceId);
    }
    
    return deviceId;
  }
  
  /**
   * Detect device type based on user agent
   */
  private detectDeviceType(userAgent: string): DeviceType {
    // Check for tablets first (some tablets identify as both mobile and tablet)
    if (/iPad|Android(?!.*Mobile)|Tablet|PlayBook/i.test(userAgent)) {
      return DeviceType.TABLET;
    }
    
    // Check for mobile phones
    if (/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return DeviceType.MOBILE_PHONE;
    }
    
    // Default to desktop
    return DeviceType.DESKTOP;
  }
  
  /**
   * Detect operating system and version
   */
  private detectOperatingSystem(userAgent: string, platform: string): { os: OperatingSystem, osVersion: string } {
    let os = OperatingSystem.UNKNOWN;
    let osVersion = '';
    
    // iOS detection
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      os = OperatingSystem.IOS;
      const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (match) {
        osVersion = `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}`;
      }
    }
    // Android detection
    else if (/Android/.test(userAgent)) {
      os = OperatingSystem.ANDROID;
      const match = userAgent.match(/Android (\d+(?:\.\d+)+)/);
      if (match) {
        osVersion = match[1];
      }
    }
    // Windows detection
    else if (/Windows NT/.test(userAgent)) {
      os = OperatingSystem.WINDOWS;
      const match = userAgent.match(/Windows NT (\d+\.\d+)/);
      if (match) {
        const ntVersion = match[1];
        // Map NT version to Windows version
        const versionMap: { [key: string]: string } = {
          '10.0': '10',
          '6.3': '8.1',
          '6.2': '8',
          '6.1': '7',
          '6.0': 'Vista',
          '5.2': 'XP',
          '5.1': 'XP'
        };
        osVersion = versionMap[ntVersion] || ntVersion;
      }
    }
    // macOS detection
    else if (/Mac OS X/.test(userAgent)) {
      os = OperatingSystem.MACOS;
      const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      }
    }
    // Linux detection
    else if (/Linux/.test(userAgent) || /Linux/.test(platform)) {
      os = OperatingSystem.LINUX;
      // Linux version is generally not available in user agent
    }
    // Chrome OS detection
    else if (/CrOS/.test(userAgent)) {
      os = OperatingSystem.CHROME_OS;
      const match = userAgent.match(/CrOS\s+\w+\s+(\d+\.\d+\.\d+)/);
      if (match) {
        osVersion = match[1];
      }
    }
    
    return { os, osVersion };
  }
  
  /**
   * Detect browser and version
   */
  private detectBrowser(userAgent: string): { browser: BrowserType, browserVersion: string } {
    let browser = BrowserType.UNKNOWN;
    let browserVersion = '';
    
    // Edge detection (must be before Chrome)
    if (/Edg/.test(userAgent)) {
      browser = BrowserType.EDGE;
      const match = userAgent.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Chrome detection
    else if (/Chrome/.test(userAgent)) {
      browser = BrowserType.CHROME;
      const match = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Safari detection
    else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      browser = BrowserType.SAFARI;
      const match = userAgent.match(/Version\/(\d+\.\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Firefox detection
    else if (/Firefox/.test(userAgent)) {
      browser = BrowserType.FIREFOX;
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Opera detection
    else if (/OPR/.test(userAgent) || /Opera/.test(userAgent)) {
      browser = BrowserType.OPERA;
      const match = userAgent.match(/(?:OPR|Opera)\/(\d+\.\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Samsung Internet detection
    else if (/SamsungBrowser/.test(userAgent)) {
      browser = BrowserType.SAMSUNG;
      const match = userAgent.match(/SamsungBrowser\/(\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // UC Browser detection
    else if (/UCBrowser/.test(userAgent)) {
      browser = BrowserType.UC;
      const match = userAgent.match(/UCBrowser\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    
    return { browser, browserVersion };
  }
  
  /**
   * Detect connection status
   */
  private detectConnectionStatus(): ConnectionStatus {
    if (!navigator.onLine) {
      return ConnectionStatus.OFFLINE;
    }
    
    // Check for slow connection if Network Information API is available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.saveData) {
          return ConnectionStatus.METERED;
        }
        
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          return ConnectionStatus.SLOW;
        }
      }
    }
    
    return ConnectionStatus.ONLINE;
  }
  
  /**
   * Get device information
   */
  public getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }
  
  /**
   * Check if device is mobile (phone or tablet)
   */
  public isMobileDevice(): boolean {
    return this.deviceInfo?.type === DeviceType.MOBILE_PHONE || this.deviceInfo?.type === DeviceType.TABLET;
  }
  
  /**
   * Check if device is a tablet
   */
  public isTablet(): boolean {
    return this.deviceInfo?.type === DeviceType.TABLET;
  }
  
  /**
   * Check if device is a mobile phone
   */
  public isMobilePhone(): boolean {
    return this.deviceInfo?.type === DeviceType.MOBILE_PHONE;
  }
  
  /**
   * Check if device is a desktop
   */
  public isDesktop(): boolean {
    return this.deviceInfo?.type === DeviceType.DESKTOP;
  }
  
  /**
   * Check if device is online
   */
  public isOnline(): boolean {
    return this.deviceInfo?.connectionStatus === ConnectionStatus.ONLINE;
  }
  
  /**
   * Check if device has touch support
   */
  public hasTouchSupport(): boolean {
    return this.deviceInfo?.touchSupport || false;
  }
  
  /**
   * Get device orientation
   */
  public getOrientation(): 'portrait' | 'landscape' {
    return this.deviceInfo?.orientation || 'portrait';
  }
}

/**
 * Offline Storage Service
 * Manages offline data storage and synchronization
 */
export class OfflineStorageService {
  private static instance: OfflineStorageService;
  private db: IDBDatabase | null = null;
  private syncQueue: any[] = [];
  private isSyncing: boolean = false;
  private syncInterval: number = 30000; // 30 seconds
  private syncIntervalId: number | null = null;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }
  
  /**
   * Initialize offline storage
   */
  public async initialize(): Promise<boolean> {
    try {
      await this.openDatabase();
      this.setupSyncInterval();
      this.setupOnlineListener();
      return true;
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
      return false;
    }
  }
  
  /**
   * Open IndexedDB database
   */
  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EdPsychOfflineDB', 1);
      
      request.onerror = (event) => {
        reject(new Error('Failed to open offline database'));
      };
      
      request.onsuccess = (event) => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineDataStore = db.createObjectStore('offlineData', { keyPath: 'id' });
          offlineDataStore.createIndex('entityType', 'entityType', { unique: false });
          offlineDataStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncQueueStore.createIndex('entityType', 'entityType', { unique: false });
          syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }
  
  /**
   * Set up sync interval
   */
  private setupSyncInterval(): void {
    // Clear existing interval if any
    if (this.syncIntervalId !== null) {
      window.clearInterval(this.syncIntervalId);
    }
    
    // Set up new interval
    this.syncIntervalId = window.setInterval(() => {
      this.syncWithServer();
    }, this.syncInterval);
  }
  
  /**
   * Set up online event listener
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.syncWithServer();
    });
  }
  
  /**
   * Store data for offline use
   */
  public async storeOfflineData<T>(entityType: string, data: T, id?: string): Promise<string> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const itemId = id || `${entityType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const offlineItem: OfflineDataItem<T> = {
      id: itemId,
      entityType,
      data,
      lastModified: new Date(),
      syncStatus: SyncStatus.PENDING,
      syncAttempts: 0,
      priority: 'medium'
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.put(offlineItem);
      
      request.onsuccess = () => {
        // Add to sync queue
        this.addToSyncQueue({
          id: `sync-${itemId}`,
          entityId: itemId,
          entityType,
          operation: 'create',
          data,
          timestamp: new Date(),
          attempts: 0,
          priority: 'medium'
        });
        
        resolve(itemId);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to store offline data'));
      };
    });
  }
  
  /**
   * Retrieve offline data
   */
  public async getOfflineData<T>(id: string): Promise<OfflineDataItem<T> | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve offline data'));
      };
    });
  }
  
  /**
   * Retrieve all offline data of a specific type
   */
  public async getAllOfflineData<T>(entityType: string): Promise<OfflineDataItem<T>[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('entityType');
      const request = index.getAll(entityType);
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve offline data'));
      };
    });
  }
  
  /**
   * Update offline data
   */
  public async updateOfflineData<T>(id: string, data: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    // First get the existing item
    const existingItem = await this.getOfflineData<T>(id);
    
    if (!existingItem) {
      throw new Error('Offline data not found');
    }
    
    // Update the item
    const updatedItem: OfflineDataItem<T> = {
      ...existingItem,
      data,
      lastModified: new Date(),
      syncStatus: SyncStatus.PENDING,
      syncAttempts: 0
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        // Add to sync queue
        this.addToSyncQueue({
          id: `sync-${id}-${Date.now()}`,
          entityId: id,
          entityType: existingItem.entityType,
          operation: 'update',
          data,
          timestamp: new Date(),
          attempts: 0,
          priority: 'medium'
        });
        
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to update offline data'));
      };
    });
  }
  
  /**
   * Delete offline data
   */
  public async deleteOfflineData(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    // First get the existing item to know its type
    const existingItem = await this.getOfflineData(id);
    
    if (!existingItem) {
      throw new Error('Offline data not found');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        // Add to sync queue
        this.addToSyncQueue({
          id: `sync-delete-${id}-${Date.now()}`,
          entityId: id,
          entityType: existingItem.entityType,
          operation: 'delete',
          data: null,
          timestamp: new Date(),
          attempts: 0,
          priority: 'high' // Prioritize deletions
        });
        
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to delete offline data'));
      };
    });
  }
  
  /**
   * Add item to sync queue
   */
  private async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(item);
      
      request.onsuccess = () => {
        this.syncQueue.push(item);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to add item to sync queue'));
      };
    });
  }
  
  /**
   * Sync with server
   */
  public async syncWithServer(): Promise<void> {
    // Skip if already syncing or offline
    if (this.isSyncing || !navigator.onLine) {
      return;
    }
    
    this.isSyncing = true;
    
    try {
      // Load sync queue from IndexedDB if empty
      if (this.syncQueue.length === 0) {
        await this.loadSyncQueue();
      }
      
      // Sort queue by priority and timestamp
      this.syncQueue.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
      
      // Process queue items
      for (const item of this.syncQueue) {
        try {
          await this.processSyncItem(item);
          await this.removeSyncItem(item.id);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          await this.updateSyncItemAttempt(item.id);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }
  
  /**
   * Load sync queue from IndexedDB
   */
  private async loadSyncQueue(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();
      
      request.onsuccess = () => {
        this.syncQueue = request.result || [];
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to load sync queue'));
      };
    });
  }
  
  /**
   * Process a sync queue item
   */
  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    // In a real implementation, this would make API calls to the server
    // For now, we'll simulate successful syncing
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the sync status of the corresponding offline data item
    if (item.operation !== 'delete') {
      await this.updateOfflineDataSyncStatus(item.entityId, SyncStatus.SYNCED);
    }
  }
  
  /**
   * Update offline data sync status
   */
  private async updateOfflineDataSyncStatus(id: string, status: SyncStatus): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    // First get the existing item
    const existingItem = await this.getOfflineData(id);
    
    if (!existingItem) {
      return; // Item might have been deleted
    }
    
    // Update the sync status
    const updatedItem = {
      ...existingItem,
      syncStatus: status,
      lastModified: new Date()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to update offline data sync status'));
      };
    });
  }
  
  /**
   * Remove item from sync queue
   */
  private async removeSyncItem(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        // Also remove from memory queue
        this.syncQueue = this.syncQueue.filter(item => item.id !== id);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to remove sync item'));
      };
    });
  }
  
  /**
   * Update sync item attempt count
   */
  private async updateSyncItemAttempt(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    // Find the item in memory
    const itemIndex = this.syncQueue.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const item = this.syncQueue[itemIndex];
    const updatedItem = {
      ...item,
      attempts: item.attempts + 1,
      lastAttempt: new Date()
    };
    
    // Update in memory
    this.syncQueue[itemIndex] = updatedItem;
    
    // Update in IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to update sync item attempt'));
      };
    });
  }
  
  /**
   * Clear all offline data
   */
  public async clearAllOfflineData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData', 'syncQueue'], 'readwrite');
      const offlineDataStore = transaction.objectStore('offlineData');
      const syncQueueStore = transaction.objectStore('syncQueue');
      
      const clearOfflineData = offlineDataStore.clear();
      const clearSyncQueue = syncQueueStore.clear();
      
      clearSyncQueue.onsuccess = () => {
        this.syncQueue = [];
      };
      
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = () => {
        reject(new Error('Failed to clear offline data'));
      };
    });
  }
}

/**
 * Push Notification Service
 * Manages push notification registration and handling
 */
export class PushNotificationService {
  private static instance: PushNotificationService;
  private isInitialized: boolean = false;
  private notificationPermission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private pushSubscription: PushSubscription | null = null;
  private deviceToken: string | null = null;
  private userId: string | null = null;
  private deviceId: string | null = null;
  private apiUrl: string | null = null;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }
  
  /**
   * Initialize push notification service
   */
  public async initialize(apiUrl: string, userId: string, deviceId: string): Promise<boolean> {
    // Check if push notifications are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }
    
    this.apiUrl = apiUrl;
    this.userId = userId;
    this.deviceId = deviceId;
    
    try {
      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js');
      
      // Check permission
      this.notificationPermission = Notification.permission;
      
      // If already granted, subscribe
      if (this.notificationPermission === 'granted') {
        await this.subscribeToNotifications();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }
  
  /**
   * Request notification permission
   */
  public async requestPermission(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Push notification service not initialized');
    }
    
    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      
      if (permission === 'granted') {
        await this.subscribeToNotifications();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }
  
  /**
   * Subscribe to push notifications
   */
  private async subscribeToNotifications(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      throw new Error('Service worker not registered');
    }
    
    try {
      // Get existing subscription or create new one
      this.pushSubscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      
      if (!this.pushSubscription) {
        // Create new subscription
        const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
        
        this.pushSubscription = await this.serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey)
        });
      }
      
      // Extract device token
      const subscription = this.pushSubscription.toJSON();
      this.deviceToken = JSON.stringify(subscription);
      
      // Register with server
      await this.registerWithServer();
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }
  
  /**
   * Register with notification server
   */
  private async registerWithServer(): Promise<void> {
    if (!this.apiUrl || !this.userId || !this.deviceId || !this.deviceToken) {
      throw new Error('Missing required information for server registration');
    }
    
    try {
      // In a real implementation, this would make an API call to register the device
      console.log('Registering device with server:', {
        userId: this.userId,
        deviceId: this.deviceId,
        deviceToken: this.deviceToken
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to register with notification server:', error);
      throw error;
    }
  }
  
  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribe(): Promise<boolean> {
    if (!this.pushSubscription) {
      return true; // Already unsubscribed
    }
    
    try {
      const success = await this.pushSubscription.unsubscribe();
      
      if (success) {
        this.pushSubscription = null;
        this.deviceToken = null;
        
        // Unregister from server
        await this.unregisterFromServer();
      }
      
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }
  
  /**
   * Unregister from notification server
   */
  private async unregisterFromServer(): Promise<void> {
    if (!this.apiUrl || !this.userId || !this.deviceId) {
      throw new Error('Missing required information for server unregistration');
    }
    
    try {
      // In a real implementation, this would make an API call to unregister the device
      console.log('Unregistering device from server:', {
        userId: this.userId,
        deviceId: this.deviceId
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to unregister from notification server:', error);
      throw error;
    }
  }
  
  /**
   * Update notification preferences
   */
  public async updateNotificationPreferences(preferences: NotificationPreferences): Promise<void> {
    if (!this.apiUrl || !this.userId) {
      throw new Error('Missing required information for updating preferences');
    }
    
    try {
      // In a real implementation, this would make an API call to update preferences
      console.log('Updating notification preferences:', preferences);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }
  
  /**
   * Show a local notification
   */
  public async showLocalNotification(title: string, options: NotificationOptions): Promise<boolean> {
    if (!this.isInitialized || this.notificationPermission !== 'granted') {
      return false;
    }
    
    try {
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(title, options);
      } else {
        new Notification(title, options);
      }
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }
  
  /**
   * Convert base64 string to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  /**
   * Get notification permission status
   */
  public getPermissionStatus(): NotificationPermission {
    return this.notificationPermission;
  }
  
  /**
   * Check if push notifications are supported
   */
  public static isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
}

/**
 * Mobile Settings Service
 * Manages mobile-specific settings and preferences
 */
export class MobileSettingsService {
  private static instance: MobileSettingsService;
  private settings: MobileSettings | null = null;
  private userId: string | null = null;
  private deviceId: string | null = null;
  private apiUrl: string | null = null;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): MobileSettingsService {
    if (!MobileSettingsService.instance) {
      MobileSettingsService.instance = new MobileSettingsService();
    }
    return MobileSettingsService.instance;
  }
  
  /**
   * Initialize mobile settings service
   */
  public async initialize(apiUrl: string, userId: string, deviceId: string): Promise<boolean> {
    this.apiUrl = apiUrl;
    this.userId = userId;
    this.deviceId = deviceId;
    
    try {
      // Load settings from local storage
      await this.loadSettings();
      
      // If no settings found, create default settings
      if (!this.settings) {
        await this.createDefaultSettings();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize mobile settings:', error);
      return false;
    }
  }
  
  /**
   * Load settings from local storage
   */
  private async loadSettings(): Promise<void> {
    if (!this.userId || !this.deviceId) {
      throw new Error('User ID and Device ID are required');
    }
    
    const storageKey = `edpsych_mobile_settings_${this.userId}_${this.deviceId}`;
    const settingsJson = localStorage.getItem(storageKey);
    
    if (settingsJson) {
      try {
        const parsedSettings = JSON.parse(settingsJson);
        
        // Convert date strings to Date objects
        parsedSettings.lastUpdated = new Date(parsedSettings.lastUpdated);
        
        this.settings = parsedSettings;
      } catch (error) {
        console.error('Failed to parse settings from local storage:', error);
        // Will create default settings instead
      }
    }
  }
  
  /**
   * Create default settings
   */
  private async createDefaultSettings(): Promise<void> {
    if (!this.userId || !this.deviceId) {
      throw new Error('User ID and Device ID are required');
    }
    
    // Create default settings
    this.settings = {
      userId: this.userId,
      deviceId: this.deviceId,
      viewMode: MobileViewMode.STANDARD,
      theme: 'system',
      fontSize: 'medium',
      offlineMode: {
        enabled: true,
        maxStorageSize: 100, // 100 MB
        autoDownloadContent: false,
        contentTypes: ['documents', 'assessments'],
        syncOnWifiOnly: true
      },
      dataUsage: {
        saveData: false,
        highQualityMedia: true,
        autoPlayMedia: true,
        preloadResources: true
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        largeTargets: false,
        screenReader: false,
        voiceControl: false
      },
      lastUpdated: new Date()
    };
    
    // Save to local storage
    await this.saveSettings();
  }
  
  /**
   * Save settings to local storage
   */
  private async saveSettings(): Promise<void> {
    if (!this.settings || !this.userId || !this.deviceId) {
      throw new Error('Settings, User ID, and Device ID are required');
    }
    
    const storageKey = `edpsych_mobile_settings_${this.userId}_${this.deviceId}`;
    
    try {
      // Update last updated timestamp
      this.settings.lastUpdated = new Date();
      
      // Save to local storage
      localStorage.setItem(storageKey, JSON.stringify(this.settings));
      
      // Sync with server if online
      if (navigator.onLine) {
        await this.syncSettingsWithServer();
      }
    } catch (error) {
      console.error('Failed to save settings to local storage:', error);
      throw error;
    }
  }
  
  /**
   * Sync settings with server
   */
  private async syncSettingsWithServer(): Promise<void> {
    if (!this.settings || !this.apiUrl) {
      throw new Error('Settings and API URL are required');
    }
    
    try {
      // In a real implementation, this would make an API call to sync settings
      console.log('Syncing settings with server:', this.settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to sync settings with server:', error);
      // Don't throw error, as this is a background operation
    }
  }
  
  /**
   * Get current settings
   */
  public getSettings(): MobileSettings | null {
    return this.settings;
  }
  
  /**
   * Update settings
   */
  public async updateSettings(updatedSettings: Partial<MobileSettings>): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not initialized');
    }
    
    // Update settings
    this.settings = {
      ...this.settings,
      ...updatedSettings,
      lastUpdated: new Date()
    };
    
    // Save to local storage
    await this.saveSettings();
  }
  
  /**
   * Update view mode
   */
  public async updateViewMode(viewMode: MobileViewMode): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not initialized');
    }
    
    this.settings.viewMode = viewMode;
    await this.saveSettings();
    
    // Apply view mode changes
    this.applyViewMode(viewMode);
  }
  
  /**
   * Apply view mode changes
   */
  private applyViewMode(viewMode: MobileViewMode): void {
    // Remove existing view mode classes
    document.documentElement.classList.remove(
      'view-mode-standard',
      'view-mode-compact',
      'view-mode-reader',
      'view-mode-focus',
      'view-mode-accessibility'
    );
    
    // Add new view mode class
    document.documentElement.classList.add(`view-mode-${viewMode}`);
    
    // Apply specific view mode settings
    switch (viewMode) {
      case MobileViewMode.COMPACT:
        // Reduce padding and margins
        break;
      case MobileViewMode.READER:
        // Increase font size, improve contrast
        break;
      case MobileViewMode.FOCUS:
        // Hide non-essential elements
        break;
      case MobileViewMode.ACCESSIBILITY:
        // Apply accessibility enhancements
        if (this.settings) {
          this.settings.accessibility.largeTargets = true;
          this.settings.fontSize = 'large';
        }
        break;
    }
  }
  
  /**
   * Update theme
   */
  public async updateTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not initialized');
    }
    
    this.settings.theme = theme;
    await this.saveSettings();
    
    // Apply theme changes
    this.applyTheme(theme);
  }
  
  /**
   * Apply theme changes
   */
  private applyTheme(theme: 'light' | 'dark' | 'system'): void {
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-colour-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      // Use explicit theme
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }
  
  /**
   * Update font size
   */
  public async updateFontSize(fontSize: 'small' | 'medium' | 'large' | 'x-large'): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not initialized');
    }
    
    this.settings.fontSize = fontSize;
    await this.saveSettings();
    
    // Apply font size changes
    this.applyFontSize(fontSize);
  }
  
  /**
   * Apply font size changes
   */
  private applyFontSize(fontSize: 'small' | 'medium' | 'large' | 'x-large'): void {
    // Remove existing font size classes
    document.documentElement.classList.remove(
      'font-size-small',
      'font-size-medium',
      'font-size-large',
      'font-size-x-large'
    );
    
    // Add new font size class
    document.documentElement.classList.add(`font-size-${fontSize}`);
    
    // Set CSS variable for font size scale
    let scale = 1;
    switch (fontSize) {
      case 'small': scale = 0.9; break;
      case 'medium': scale = 1; break;
      case 'large': scale = 1.2; break;
      case 'x-large': scale = 1.4; break;
    }
    
    document.documentElement.style.setProperty('--font-size-scale', scale.toString());
  }
  
  /**
   * Update accessibility settings
   */
  public async updateAccessibilitySettings(settings: Partial<MobileSettings['accessibility']>): Promise<void> {
    if (!this.settings) {
      throw new Error('Settings not initialized');
    }
    
    this.settings.accessibility = {
      ...this.settings.accessibility,
      ...settings
    };
    
    await this.saveSettings();
    
    // Apply accessibility changes
    this.applyAccessibilitySettings(this.settings.accessibility);
  }
  
  /**
   * Apply accessibility settings
   */
  private applyAccessibilitySettings(settings: MobileSettings['accessibility']): void {
    // Apply reduce motion
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    
    // Apply large targets
    document.documentElement.classList.toggle('large-targets', settings.largeTargets);
    
    // Apply screen reader optimizations
    document.documentElement.classList.toggle('screen-reader-optimised', settings.screenReader);
    
    // Apply voice control optimizations
    document.documentElement.classList.toggle('voice-control-optimised', settings.voiceControl);
  }
  
  /**
   * Reset settings to default
   */
  public async resetSettings(): Promise<void> {
    await this.createDefaultSettings();
    
    // Apply all settings
    if (this.settings) {
      this.applyViewMode(this.settings.viewMode);
      this.applyTheme(this.settings.theme);
      this.applyFontSize(this.settings.fontSize);
      this.applyAccessibilitySettings(this.settings.accessibility);
    }
  }
}

// Export singleton instances
export const deviceDetection = DeviceDetectionService.getInstance();
export const offlineStorage = OfflineStorageService.getInstance();
export const pushNotifications = PushNotificationService.getInstance();
export const mobileSettings = MobileSettingsService.getInstance();
