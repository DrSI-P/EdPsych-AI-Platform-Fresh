'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProgressiveWebAppService, ServiceWorkerStatus, InstallationStatus } from '@/lib/pwa/progressive-web-app-service';

// Define the PWA context type
interface PWAContextType {
  isOfflineSupported: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  serviceWorkerStatus: ServiceWorkerStatus;
  installationStatus: InstallationStatus;
  offlineContent: any[];
  showInstallPrompt: () => Promise<InstallationStatus>;
  updateServiceWorker: () => Promise<boolean>;
  addOfflineContent: (item: any) => Promise<boolean>;
  removeOfflineContent: (id: string) => Promise<boolean>;
}

// Create the context with default values
const PWAContext = createContext<PWAContextType>({
  isOfflineSupported: false,
  isInstallable: false,
  isInstalled: false,
  isStandalone: false,
  isOnline: true,
  serviceWorkerStatus: ServiceWorkerStatus.PENDING,
  installationStatus: InstallationStatus.NOT_INSTALLABLE,
  offlineContent: [],
  showInstallPrompt: async () => InstallationStatus.NOT_INSTALLABLE,
  updateServiceWorker: async () => false,
  addOfflineContent: async () => false,
  removeOfflineContent: async () => false,
});

/**
 * PWA Provider Component
 * 
 * This component provides Progressive Web App functionality throughout the application:
 * - Service worker registration and management
 * - Installation experience
 * - Offline capabilities
 * - Background sync
 * 
 * It should be added to the root layout to ensure PWA features are available globally.
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  // Initialize the PWA service
  const [pwaService, setPwaService] = useState<ProgressiveWebAppService | null>(null);
  
  // State for PWA features
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<ServiceWorkerStatus>(ServiceWorkerStatus.PENDING);
  const [installationStatus, setInstallationStatus] = useState<InstallationStatus>(InstallationStatus.NOT_INSTALLABLE);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineContent, setOfflineContent] = useState<any[]>([]);
  
  // Initialize the PWA service on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const service = ProgressiveWebAppService.getInstance();
      setPwaService(service);
      
      // Register service worker
      service.registerServiceWorker().then(status => {
        setServiceWorkerStatus(status);
      });
      
      // Set initial states
      setIsOnline(service.isDeviceOnline());
      setInstallationStatus(
        service.isInstalled() 
          ? InstallationStatus.INSTALLED 
          : service.isInstallable() 
            ? InstallationStatus.INSTALLABLE 
            : InstallationStatus.NOT_INSTALLABLE
      );
      setOfflineContent(service.getOfflineContent());
      
      // Set up event listeners
      const onServiceWorkerStatusChange = (event: any) => {
        setServiceWorkerStatus(event.status);
      };
      
      const onOnline = () => {
        setIsOnline(true);
      };
      
      const onOffline = () => {
        setIsOnline(false);
      };
      
      const onInstallable = () => {
        setInstallationStatus(InstallationStatus.INSTALLABLE);
      };
      
      const onInstalled = () => {
        setInstallationStatus(InstallationStatus.INSTALLED);
      };
      
      const onOfflineContentAdded = () => {
        setOfflineContent(service.getOfflineContent());
      };
      
      const onOfflineContentRemoved = () => {
        setOfflineContent(service.getOfflineContent());
      };
      
      // Add event listeners
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      
      // Clean up event listeners
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    }
  }, []);
  
  // Show installation prompt
  const showInstallPrompt = async (): Promise<InstallationStatus> => {
    if (!pwaService) return InstallationStatus.NOT_INSTALLABLE;
    return await pwaService.showInstallPrompt();
  };
  
  // Update service worker
  const updateServiceWorker = async (): Promise<boolean> => {
    if (!pwaService) return false;
    return await pwaService.updateServiceWorker();
  };
  
  // Add offline content
  const addOfflineContent = async (item: any): Promise<boolean> => {
    if (!pwaService) return false;
    const result = await pwaService.addOfflineContent(item);
    if (result) {
      setOfflineContent(pwaService.getOfflineContent());
    }
    return result;
  };
  
  // Remove offline content
  const removeOfflineContent = async (id: string): Promise<boolean> => {
    if (!pwaService) return false;
    const result = await pwaService.removeOfflineContent(id);
    if (result) {
      setOfflineContent(pwaService.getOfflineContent());
    }
    return result;
  };
  
  // Context value
  const contextValue: PWAContextType = {
    isOfflineSupported: pwaService?.isOfflineSupported() || false,
    isInstallable: pwaService?.isInstallable() || false,
    isInstalled: pwaService?.isInstalled() || false,
    isStandalone: pwaService?.isRunningAsStandalone() || false,
    isOnline,
    serviceWorkerStatus,
    installationStatus,
    offlineContent,
    showInstallPrompt,
    updateServiceWorker,
    addOfflineContent,
    removeOfflineContent,
  };
  
  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
}

// Custom hook to use the PWA context
export const usePWA = () => useContext(PWAContext);

export default PWAProvider;
