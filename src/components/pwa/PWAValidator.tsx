import React, { useEffect, useState } from 'react';

export function PWAValidator() {
  const [validationResults, setValidationResults] = useState({
    serviceWorker: 'checking',
    manifest: 'checking',
    installable: 'checking',
    offlineReady: 'checking',
    caching: 'checking',
  });
  
  useEffect(() => {
    // Check if service worker is registered
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          setValidationResults(prev => ({
            ...prev,
            serviceWorker: registrations.length > 0 ? 'passed' : 'failed'
          }));
        } catch (error) {
          setValidationResults(prev => ({
            ...prev,
            serviceWorker: 'failed'
          }));
        }
      } else {
        setValidationResults(prev => ({
          ...prev,
          serviceWorker: 'unsupported'
        }));
      }
    };
    
    // Check if manifest is valid
    const checkManifest = async () => {
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
          setValidationResults(prev => ({
            ...prev,
            manifest: 'failed'
          }));
          return;
        }
        
        const manifestUrl = manifestLink.getAttribute('href');
        const response = await fetch(manifestUrl);
        if (response.ok) {
          const manifest = await response.json();
          const requiredFields = ['name', 'short_name', 'icons', 'start_url', 'display'];
          const hasRequiredFields = requiredFields.every(field => manifest[field]);
          
          setValidationResults(prev => ({
            ...prev,
            manifest: hasRequiredFields ? 'passed' : 'failed'
          }));
        } else {
          setValidationResults(prev => ({
            ...prev,
            manifest: 'failed'
          }));
        }
      } catch (error) {
        setValidationResults(prev => ({
          ...prev,
          manifest: 'failed'
        }));
      }
    };
    
    // Check if app is installable
    const checkInstallable = () => {
      if ('BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window) {
        setValidationResults(prev => ({
          ...prev,
          installable: 'passed'
        }));
      } else {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
          setValidationResults(prev => ({
            ...prev,
            installable: 'installed'
          }));
        } else {
          setValidationResults(prev => ({
            ...prev,
            installable: 'unknown'
          }));
        }
      }
    };
    
    // Check if app is offline ready
    const checkOfflineReady = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await window.caches.keys();
          const hasCaches = cacheNames.length > 0;
          
          setValidationResults(prev => ({
            ...prev,
            offlineReady: hasCaches ? 'passed' : 'failed'
          }));
        } catch (error) {
          setValidationResults(prev => ({
            ...prev,
            offlineReady: 'failed'
          }));
        }
      } else {
        setValidationResults(prev => ({
          ...prev,
          offlineReady: 'unsupported'
        }));
      }
    };
    
    // Check if caching is working
    const checkCaching = async () => {
      if ('caches' in window) {
        try {
          // Try to fetch a cached resource
          const cache = await window.caches.open('static-js-assets');
          const cachedResources = await cache.keys();
          
          setValidationResults(prev => ({
            ...prev,
            caching: cachedResources.length > 0 ? 'passed' : 'pending'
          }));
        } catch (error) {
          setValidationResults(prev => ({
            ...prev,
            caching: 'failed'
          }));
        }
      } else {
        setValidationResults(prev => ({
          ...prev,
          caching: 'unsupported'
        }));
      }
    };
    
    // Run all checks
    checkServiceWorker();
    checkManifest();
    checkInstallable();
    checkOfflineReady();
    checkCaching();
    
    // Re-check caching after a delay to allow service worker to initialize
    const cacheCheckTimeout = setTimeout(() => {
      checkCaching();
    }, 3000);
    
    return () => {
      clearTimeout(cacheCheckTimeout);
    };
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'unsupported':
        return 'text-yellow-500';
      case 'installed':
        return 'text-blue-500';
      case 'unknown':
        return 'text-gray-500';
      case 'pending':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return '✓';
      case 'failed':
        return '✗';
      case 'unsupported':
        return '!';
      case 'installed':
        return '✓';
      case 'unknown':
        return '?';
      case 'pending':
        return '⟳';
      default:
        return '⋯';
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-16 mb-16">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          PWA Validation Results
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Checking Progressive Web App capabilities
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <dl>
          {Object.entries(validationResults).map(([key, value], index) => (
            <div key={key} className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${
              index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'
            }`}>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`font-medium ${getStatusColor(value)}`}>
                  <span className="mr-2">{getStatusIcon(value)}</span>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
