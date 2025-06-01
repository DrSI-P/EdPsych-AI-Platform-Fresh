'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, RefreshCw, Download, Upload } from 'lucide-react';

/**
 * OfflineManager component
 * 
 * This component provides user interface for managing offline capabilities,
 * including status indicators, sync controls, and storage management.
 */
export function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [offlineContent, setOfflineContent] = useState({
    assessments: 0,
    learningPaths: 0,
    resources: 0
  });
  const [storageUsage, setStorageUsage] = useState({
    used: 0,
    total: 0,
    percentage: 0
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check offline content and storage usage
    checkOfflineContent();
    checkStorageUsage();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check offline content
  const checkOfflineContent = async () => {
    try {
      // In a real implementation, this would query IndexedDB or Cache API
      // Mock data for demonstration
      setOfflineContent({
        assessments: 5,
        learningPaths: 3,
        resources: 12
      });
    } catch (error) {
      console.error('Error checking offline content:', error);
    }
  };

  // Check storage usage
  const checkStorageUsage = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const total = estimate.quota || 0;
        const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

        setStorageUsage({
          used: Math.round(used / (1024 * 1024)), // Convert to MB
          total: Math.round(total / (1024 * 1024)), // Convert to MB
          percentage
        });
      }
    } catch (error) {
      console.error('Error checking storage usage:', error);
    }
  };

  // Trigger manual sync
  const handleSync = async () => {
    try {
      setSyncStatus('syncing');

      // In a real implementation, this would trigger service worker sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-all');
        
        // Simulate sync delay
        setTimeout(() => {
          setSyncStatus('success');
          checkOfflineContent();
          
          // Reset status after a delay
          setTimeout(() => setSyncStatus('idle'), 3000);
        }, 2000);
      } else {
        // Fallback for browsers without background sync
        // Implement manual sync logic here
        
        // Simulate sync delay
        setTimeout(() => {
          setSyncStatus('success');
          checkOfflineContent();
          
          // Reset status after a delay
          setTimeout(() => setSyncStatus('idle'), 3000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
      setSyncStatus('error');
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Download content for offline use
  const handleDownloadContent = async () => {
    try {
      // In a real implementation, this would trigger caching of specific content
      // For demonstration, we'll just update the UI
      setSyncStatus('downloading');
      
      // Simulate download delay
      setTimeout(() => {
        setSyncStatus('success');
        setOfflineContent(prev => ({
          ...prev,
          resources: prev.resources + 3
        }));
        checkStorageUsage();
        
        // Reset status after a delay
        setTimeout(() => setSyncStatus('idle'), 3000);
      }, 2000);
    } catch (error) {
      console.error('Error downloading content:', error);
      setSyncStatus('error');
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Clear offline storage
  const handleClearStorage = async () => {
    try {
      // In a real implementation, this would clear caches and IndexedDB
      setSyncStatus('clearing');
      
      // Simulate clearing delay
      setTimeout(() => {
        setSyncStatus('success');
        setOfflineContent({
          assessments: 0,
          learningPaths: 0,
          resources: 0
        });
        checkStorageUsage();
        
        // Reset status after a delay
        setTimeout(() => setSyncStatus('idle'), 3000);
      }, 2000);
    } catch (error) {
      console.error('Error clearing storage:', error);
      setSyncStatus('error');
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Offline Access</CardTitle>
          {isOnline ? (
            <div className="flex items-center text-green-600">
              <Wifi className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Online</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
        <CardDescription>
          Manage your offline content and synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Offline Content</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-xl font-bold text-blue-700">{offlineContent.assessments}</p>
              <p className="text-xs text-blue-600">Assessments</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-xl font-bold text-purple-700">{offlineContent.learningPaths}</p>
              <p className="text-xs text-purple-600">Learning Paths</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-xl font-bold text-green-700">{offlineContent.resources}</p>
              <p className="text-xs text-green-600">Resources</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Storage Usage</h3>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${storageUsage.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{storageUsage.used} MB used</span>
              <span>{storageUsage.total} MB available</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Sync Status</h3>
          <div className="flex items-center space-x-2">
            {syncStatus === 'idle' && (
              <span className="text-sm text-gray-500">All data is up to date</span>
            )}
            {syncStatus === 'syncing' && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-600">Syncing data...</span>
              </>
            )}
            {syncStatus === 'downloading' && (
              <>
                <Download className="h-4 w-4 animate-pulse text-blue-600" />
                <span className="text-sm text-blue-600">Downloading content...</span>
              </>
            )}
            {syncStatus === 'clearing' && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                <span className="text-sm text-amber-600">Clearing storage...</span>
              </>
            )}
            {syncStatus === 'success' && (
              <span className="text-sm text-green-600">Operation completed successfully</span>
            )}
            {syncStatus === 'error' && (
              <span className="text-sm text-red-600">Error occurred during operation</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            onClick={handleSync}
            disabled={syncStatus !== 'idle' || !isOnline}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button 
            onClick={handleDownloadContent}
            disabled={syncStatus !== 'idle' || !isOnline}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Content
          </Button>
        </div>
        <Button 
          onClick={handleClearStorage}
          disabled={syncStatus !== 'idle'}
          variant="destructive"
          className="w-full"
        >
          Clear Offline Storage
        </Button>
      </CardFooter>
    </Card>
  );
}
