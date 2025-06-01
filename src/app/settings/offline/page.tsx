'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OfflineManager } from '@/components/offline/offline-manager';

/**
 * Offline Settings Page
 * 
 * This page allows users to manage offline capabilities, including
 * content downloading, storage management, and synchronization settings.
 */
export default function OfflineSettingsPage() {
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  useEffect(() => {
    // Check if service workers are supported
    const checkServiceWorkerSupport = async () => {
      const supported = 'serviceWorker' in navigator;
      setIsServiceWorkerSupported(supported);
      
      if (supported) {
        try {
          // Check if service worker is already registered
          const registration = await navigator.serviceWorker.getRegistration();
          setIsRegistered(!!registration);
        } catch (error) {
          console.error('Error checking service worker registration:', error);
        }
      }
    };
    
    checkServiceWorkerSupport();
  }, []);
  
  // Register service worker
  const handleRegisterServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      setIsRegistered(true);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-2">Offline Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your offline access and synchronization settings
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <OfflineManager />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Available Offline Content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Learning Resources */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Mathematics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Key Stage 2 curriculum resources
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      Downloaded
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Assessment */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Reading Assessment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehension and vocabulary
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                      Downloaded
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Learning Path */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Science Path</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Materials and properties
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      Downloaded
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Offline Access</h2>
              
              {!isServiceWorkerSupported ? (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                  <p className="text-sm text-amber-800">
                    Your browser doesn't support offline capabilities. Please use a modern browser like Chrome, Firefox, or Edge.
                  </p>
                </div>
              ) : !isRegistered ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enable offline access to use EdPsych Connect without an internet connection.
                  </p>
                  <Button onClick={handleRegisterServiceWorker} className="w-full">
                    Enable Offline Access
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm text-green-800">
                      Offline access is enabled. You can now use EdPsych Connect without an internet connection.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Automatic Sync</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sync when online</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Storage Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Download over Wi-Fi only</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-delete old content</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Offline Tips</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Download content before going offline for best experience</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Your progress will automatically sync when you're back online</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Clear storage regularly to free up space on your device</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                  <span>Assessment results are saved offline and will sync when connected</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
