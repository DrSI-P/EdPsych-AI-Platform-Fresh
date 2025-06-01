'use client';

import React from 'react';
import { usePWA } from './PWAProvider';
import Link from 'next/link';

/**
 * Offline Content Manager Component
 * 
 * This component provides a UI for managing offline content:
 * - Viewing saved offline content
 * - Adding new content for offline access
 * - Removing offline content
 * - Viewing storage usage
 */
export function OfflineContentManager() {
  const { 
    offlineContent, 
    removeOfflineContent,
    isOfflineSupported,
    isOnline
  } = usePWA();
  
  // Group content by type
  const contentByType = offlineContent.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});
  
  // Format bytes to human-readable size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Calculate total size
  const totalSize = offlineContent.reduce((total, item) => total + item.size, 0);
  
  // Handle remove content
  const handleRemove = async (id: string) => {
    await removeOfflineContent(id);
  };
  
  if (!isOfflineSupported) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Offline Support Not Available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your browser doesn't support offline capabilities. Try using a modern browser like Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Storage usage */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Offline Storage</h3>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Used Space</span>
            <span>{formatBytes(totalSize)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Content management */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Saved Content</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your saved content for offline access.
          </p>
        </div>
        
        {offlineContent.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No saved content</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Save content for offline access to view it here.
            </p>
            <div className="mt-6">
              <Link href="/resources" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Browse Resources
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(contentByType).map(([type, items]) => (
              <div key={type} className="p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 capitalize mb-3">
                  {type.replace('_', ' ')}
                </h4>
                <ul className="space-y-3">
                  {items.map((item: any) => (
                    <li key={item.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatBytes(item.size)}</span>
                            <span className="mx-2">•</span>
                            <span>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                            {item.accessCount > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Accessed {item.accessCount} times</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          disabled={!isOnline}
                          title={!isOnline ? "Cannot remove while offline" : "Remove from offline storage"}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Sync status */}
      {!isOnline && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                You are currently offline. Changes to offline content will be synced when you reconnect.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfflineContentManager;
