'use client';

import React, { useEffect, useState } from 'react';
import { offlineStorage } from '@/lib/mobile/mobileService';
import { SyncStatus } from '@/lib/mobile/mobileTypes';

interface OfflineManagerProps {
  children: React.ReactNode;
  onSyncStatusChange?: (isOnline: boolean, pendingItems: number) => void;
}

/**
 * OfflineManager Component
 * 
 * A component that manages offline functionality for the application.
 * It initializes offline storage, monitors network status, and handles data synchronization.
 */
export const OfflineManager: React.FC<OfflineManagerProps> = ({
  children,
  onSyncStatusChange
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingSyncItems, setPendingSyncItems] = useState(0);
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Initialize offline storage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const success = await offlineStorage.initialize();
        setIsInitialized(success);
        
        if (success) {
          // Initial sync if online
          if (navigator.onLine) {
            syncData();
          }
        }
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };
    
    initializeStorage();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync data with server
  const syncData = async () => {
    if (!isInitialized || syncInProgress) return;
    
    setSyncInProgress(true);
    
    try {
      await offlineStorage.syncWithServer();
      
      // Update pending sync items count
      updatePendingSyncItems();
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  // Update pending sync items count
  const updatePendingSyncItems = async () => {
    try {
      // This is a simplified example - in a real app, you would query the actual pending items
      // For now, we'll simulate it with a random number
      const pendingItems = Math.floor(Math.random() * 5); // 0-4 pending items
      setPendingSyncItems(pendingItems);
      
      // Notify parent component
      if (onSyncStatusChange) {
        onSyncStatusChange(isOnline, pendingItems);
      }
    } catch (error) {
      console.error('Failed to update pending sync items:', error);
    }
  };

  return (
    <div className="offline-manager">
      {!isOnline && (
        <div className="offline-indicator">
          <span className="offline-icon">⚠️</span>
          <span className="offline-text">You are currently offline. Changes will be saved and synced when you reconnect.</span>
        </div>
      )}
      
      {isOnline && pendingSyncItems > 0 && (
        <div className="syncing-indicator">
          <span className="syncing-icon">↻</span>
          <span className="syncing-text">Syncing {pendingSyncItems} item{pendingSyncItems !== 1 ? 's' : ''}...</span>
        </div>
      )}
      
      {children}
    </div>
  );
};

interface OfflineAwareProps<T> {
  entityType: string;
  id?: string;
  data: T;
  onSave: (data: T) => Promise<string>;
  children: (props: {
    data: T;
    isOffline: boolean;
    isSyncing: boolean;
    syncStatus: SyncStatus;
    saveData: (updatedData: T) => Promise<void>;
  }) => React.ReactNode;
}

/**
 * OfflineAware Component
 * 
 * A higher-order component that makes any component offline-aware.
 * It handles saving data locally when offline and syncing when online.
 */
export function OfflineAware<T>({
  entityType,
  id,
  data,
  onSave,
  children
}: OfflineAwareProps<T>) {
  const [localData, setLocalData] = useState<T>(data);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.SYNCED);
  const [localId, setLocalId] = useState<string | undefined>(id);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize with data from props
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Save data (works both online and offline)
  const saveData = async (updatedData: T) => {
    setLocalData(updatedData);
    
    try {
      if (isOffline) {
        // Save locally
        setSyncStatus(SyncStatus.PENDING);
        
        if (localId) {
          // Update existing data
          await offlineStorage.updateOfflineData(localId, updatedData);
        } else {
          // Store new data
          const newId = await offlineStorage.storeOfflineData(entityType, updatedData);
          setLocalId(newId);
        }
      } else {
        // Try to save online
        setIsSyncing(true);
        
        try {
          const savedId = await onSave(updatedData);
          setLocalId(savedId);
          setSyncStatus(SyncStatus.SYNCED);
        } catch (error) {
          console.error('Failed to save online, falling back to offline storage:', error);
          
          // Fall back to offline storage
          setSyncStatus(SyncStatus.PENDING);
          
          if (localId) {
            // Update existing data
            await offlineStorage.updateOfflineData(localId, updatedData);
          } else {
            // Store new data
            const newId = await offlineStorage.storeOfflineData(entityType, updatedData);
            setLocalId(newId);
          }
        }
        
        setIsSyncing(false);
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      setSyncStatus(SyncStatus.FAILED);
    }
  };

  return (
    <>
      {children({
        data: localData,
        isOffline,
        isSyncing,
        syncStatus,
        saveData
      })}
    </>
  );
}

interface OfflineCacheProps {
  urls: any[];
  children: React.ReactNode;
}

/**
 * OfflineCache Component
 * 
 * A component that caches specified URLs for offline use.
 * It uses the Cache API to store responses for later use when offline.
 */
export const OfflineCache: React.FC<OfflineCacheProps> = ({
  urls,
  children
}) => {
  const [isCaching, setIsCaching] = useState(false);
  const [cachedUrls, setCachedUrls] = useState<string[]>([]);

  // Cache URLs when component mounts
  useEffect(() => {
    const cacheUrls = async () => {
      if (!('caches' in window)) {
        console.warn('Cache API not supported');
        return;
      }
      
      setIsCaching(true);
      
      try {
        const cache = await caches.open('edpsych-offline-cache');
        const newlyCachedUrls: any[] = [];
        
        for (const url of urls) {
          try {
            // Check if already cached
            const match = await cache.match(url);
            
            if (!match) {
              // Fetch and cache
              const response = await fetch(url);
              await cache.put(url, response.clone());
              newlyCachedUrls.push(url);
            } else {
              newlyCachedUrls.push(url);
            }
          } catch (error) {
            console.error(`Failed to cache URL ${url}:`, error);
          }
        }
        
        setCachedUrls(newlyCachedUrls);
      } catch (error) {
        console.error('Failed to cache URLs:', error);
      } finally {
        setIsCaching(false);
      }
    };
    
    if (urls.length > 0) {
      cacheUrls();
    }
  }, [urls]);

  return (
    <>
      {isCaching && (
        <div className="caching-indicator">
          <span className="caching-icon">💾</span>
          <span className="caching-text">Caching content for offline use...</span>
        </div>
      )}
      {children}
    </>
  );
};

export default OfflineManager;
