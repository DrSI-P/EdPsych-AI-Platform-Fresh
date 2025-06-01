'use client';

import React from 'react';
import { usePWA } from './PWAProvider';
import { InstallationStatus } from '@/lib/pwa/progressive-web-app-service';

interface OfflineBannerProps {
  className?: string;
}

/**
 * Offline Banner Component
 * 
 * This component displays a banner when the user is offline,
 * providing information about offline capabilities and access to cached content.
 */
export function OfflineBanner({ className = '' }: OfflineBannerProps) {
  const { isOnline, isOfflineSupported, offlineContent } = usePWA();
  
  // Don't show the banner if online or if offline support is not available
  if (isOnline || !isOfflineSupported) return null;
  
  // Count offline content by type
  const contentCounts = offlineContent.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 dark:text-yellow-200">
            You are currently offline. {offlineContent.length > 0 ? (
              `You have access to ${offlineContent.length} saved items.`
            ) : (
              'Limited functionality is available.'
            )}
          </p>
          {offlineContent.length > 0 && (
            <div className="mt-2 text-sm">
              <a href="/offline" className="font-medium text-yellow-700 dark:text-yellow-200 underline hover:text-yellow-600">
                View all offline content
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfflineBanner;
