import React from 'react';

interface OfflineFallbackProps {
  resourceType: string;
}

export function OfflineFallback({ resourceType }: OfflineFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">You're currently offline</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {resourceType === 'general' && "You're currently offline and this content isn't available. Please check your connection and try again."}
        {resourceType === 'educational' && "You're currently offline. Some educational resources are still available below from your previous sessions."}
        {resourceType === 'blog' && "You're currently offline. Some previously viewed blog posts are available below."}
        {resourceType === 'assessment' && "You're currently offline. Your assessment data will be saved and synchronized when you're back online."}
      </p>
      
      {resourceType === 'educational' && (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
          <h3 className="font-semibold text-lg mb-3">Available Offline Resources</h3>
          <ul className="space-y-2">
            <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <a href="/resources/cached/executive-dysfunction" className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Executive Dysfunction Guide
              </a>
            </li>
            <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <a href="/resources/cached/semh-support" className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                SEMH Support Materials
              </a>
            </li>
            <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded opacity-50">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Professional Development (Not available offline)
              </span>
            </li>
          </ul>
        </div>
      )}
      
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
