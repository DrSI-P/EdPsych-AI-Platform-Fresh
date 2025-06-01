'use client';

import React, { useEffect, useState } from 'react';
import { usePWA } from './PWAProvider';
import { ServiceWorkerStatus } from '@/lib/pwa/progressive-web-app-service';

/**
 * PWA Service Worker Manager Component
 * 
 * This component handles service worker registration, updates, and notifications.
 * It should be included in the root layout to ensure service worker functionality
 * is properly managed throughout the application lifecycle.
 */
export function PWAServiceWorkerManager() {
  const { 
    serviceWorkerStatus, 
    updateServiceWorker,
    isOfflineSupported
  } = usePWA();
  
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  
  // Handle service worker updates
  useEffect(() => {
    if (serviceWorkerStatus === ServiceWorkerStatus.UPDATED) {
      setShowUpdateNotification(true);
    }
  }, [serviceWorkerStatus]);
  
  // Handle update notification dismissal
  const handleDismissUpdate = () => {
    setShowUpdateNotification(false);
  };
  
  // Handle update application
  const handleUpdate = async () => {
    await updateServiceWorker();
    window.location.reload();
  };
  
  if (!isOfflineSupported) return null;
  
  return (
    <>
      {/* Service worker update notification */}
      {showUpdateNotification && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Update Available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A new version of EdPsych Connect is available. Update now for the latest features and improvements.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Now
                </button>
                <button
                  type="button"
                  onClick={handleDismissUpdate}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PWAServiceWorkerManager;
