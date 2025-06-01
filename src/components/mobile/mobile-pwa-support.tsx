import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Smartphone, Tablet, Laptop, Monitor, Check, RefreshCw, Download, Upload, Wifi, WifiOff } from 'lucide-react';

/**
 * Mobile & PWA Support component for EdPsych Connect
 * Provides responsive design and progressive web app features
 */
const MobilePWASupport = () => {
  const { data: session } = useSession();
  const [deviceType, setDeviceType] = useState('desktop');
  const [isOnline, setIsOnline] = useState(true);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, pending
  const [offlineContent, setOfflineContent] = useState([]);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [storageUsage, setStorageUsage] = useState({
    used: 0,
    quota: 0,
    percentage: 0
  });
  
  // Detect device type on component mount
  useEffect(() => {
    const detectDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else if (width < 1280) {
        setDeviceType('laptop');
      } else {
        setDeviceType('desktop');
      }
    };
    
    detectDeviceType();
    window.addEventListener('resize', detectDeviceType);
    
    return () => {
      window.removeEventListener('resize', detectDeviceType);
    };
  }, []);
  
  // Check online status and set up event listeners
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        syncOfflineChanges();
      }
    };
    
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Check if PWA is installed
  useEffect(() => {
    const checkPWAInstalled = () => {
      // Check if running as standalone PWA
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsPWAInstalled(true);
      }
    };
    
    checkPWAInstalled();
    
    // Listen for beforeinstallprompt event to capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Check storage usage
  useEffect(() => {
    const checkStorageUsage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
          
          setStorageUsage({
            used: formatBytes(used),
            quota: formatBytes(quota),
            percentage
          });
        } catch (error) {
          console.error('Error checking storage usage:', error);
        }
      }
    };
    
    checkStorageUsage();
  }, []);
  
  // Format bytes to human-readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Sync offline changes when back online
  const syncOfflineChanges = async () => {
    // This would be implemented with actual sync logic in a real application
    if (offlineContent.length > 0) {
      setSyncStatus('syncing');
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear offline content after sync
      setOfflineContent([]);
      setSyncStatus('synced');
    }
  };
  
  // Install PWA
  const installPWA = async () => {
    if (!installPromptEvent) {
      alert('Installation not available. Please use your browser\'s "Add to Home Screen" option.');
      return;
    }
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsPWAInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPromptEvent(null);
  };
  
  // Manage offline content
  const toggleOfflineAvailability = async (contentId, contentType, title) => {
    // This would be implemented with actual caching logic in a real application
    const isAlreadySaved = offlineContent.some(item => item.id === contentId);
    
    if (isAlreadySaved) {
      // Remove from offline content
      setOfflineContent(prev => prev.filter(item => item.id !== contentId));
    } else {
      // Add to offline content
      setOfflineContent(prev => [...prev, { id: contentId, type: contentType, title }]);
    }
  };
  
  // Get device icon based on detected device type
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-6 w-6" />;
      case 'tablet':
        return <Tablet className="h-6 w-6" />;
      case 'laptop':
        return <Laptop className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };
  
  // Sample content for demonstration
  const sampleContent = [
    { id: '1', type: 'lesson', title: 'Introduction to Fractions', size: '2.5 MB' },
    { id: '2', type: 'video', title: 'Understanding Emotions', size: '15 MB' },
    { id: '3', type: 'resource', title: 'Reading Comprehension Worksheet', size: '1.2 MB' },
    { id: '4', type: 'assessment', title: 'Weekly Math Quiz', size: '0.8 MB' },
    { id: '5', type: 'interactive', title: 'Interactive Periodic Table', size: '4.5 MB' }
  ];
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mobile & PWA Support</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Access EdPsych Connect on any device, online or offline
            </p>
          </div>
          <div className="flex items-center">
            {getDeviceIcon()}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {deviceType}
            </span>
          </div>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center">
          {syncStatus === 'syncing' && (
            <>
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin mr-2" />
              <span className="text-xs text-blue-500">Syncing...</span>
            </>
          )}
          {syncStatus === 'pending' && (
            <>
              <Upload className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-xs text-yellow-500">Changes pending sync</span>
            </>
          )}
          {syncStatus === 'synced' && isOnline && (
            <>
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-xs text-green-500">All changes synced</span>
            </>
          )}
        </div>
      </div>
      
      {/* PWA Installation */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">App Installation</h3>
        
        {isPWAInstalled ? (
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  EdPsych Connect is installed
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>You're using the installed app version for the best experience.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3 flex-grow">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Install EdPsych Connect
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Install the app on your device for faster access and offline capabilities.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={installPWA}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Install App
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Offline Content */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Offline Content</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {storageUsage.used} / {storageUsage.quota} ({storageUsage.percentage}%)
          </span>
        </div>
        
        <div className="mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${storageUsage.percentage}%` }}
          ></div>
        </div>
        
        <div className="space-y-4">
          {sampleContent.map(content => {
            const isAvailableOffline = offlineContent.some(item => item.id === content.id);
            
            return (
              <div 
                key={content.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-750 rounded-md"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {content.title}
                  </h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {content.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {content.size}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleOfflineAvailability(content.id, content.type, content.title)}
                  className={`p-2 rounded-md ${
                    isAvailableOffline
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={isAvailableOffline ? 'Remove from offline content' : 'Save for offline use'}
                >
                  {isAvailableOffline ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        {offlineContent.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>{offlineContent.length} items available offline</p>
          </div>
        )}
        
        {offlineContent.length === 0 && (
          <div className="mt-4 text-center py-6">
            <Download className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No offline content</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Save content for offline use to access it when you don't have an internet connection.
            </p>
          </div>
        )}
      </div>
      
      {/* Device-Specific Features */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Device-Specific Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Touch Optimization
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Interface elements are automatically adjusted for touch input on mobile devices.
            </p>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${
                deviceType === 'mobile' || deviceType === 'tablet'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {deviceType === 'mobile' || deviceType === 'tablet' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Responsive Layout
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Content layout adapts automatically to your screen size and orientation.
            </p>
            <div className="flex items-center">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Push Notifications
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Receive important updates even when the app is not open.
            </p>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${
                isPWAInstalled
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {isPWAInstalled ? 'Active' : 'Available after installation'}
              </span>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Cross-Device Sync
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your progress and settings are synchronized across all your devices.
            </p>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${
                isOnline
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {isOnline ? 'Active' : 'Requires internet connection'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePWASupport;
