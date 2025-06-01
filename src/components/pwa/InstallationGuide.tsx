'use client';

import React from 'react';
import { usePWA } from './PWAProvider';
import { InstallationStatus } from '@/lib/pwa/progressive-web-app-service';

interface InstallationGuideProps {
  className?: string;
}

/**
 * PWA Installation Guide Component
 * 
 * This component provides guidance for installing the PWA on different devices,
 * showing platform-specific instructions and benefits of installation.
 */
export function InstallationGuide({ className = '' }: InstallationGuideProps) {
  const { isInstallable, isInstalled, showInstallPrompt, installationStatus } = usePWA();
  
  // Don't show if already installed or not installable
  if (isInstalled || !isInstallable) return null;
  
  // Detect platform
  const getPlatform = () => {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    
    if (/android/i.test(userAgent)) return 'android';
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return 'ios';
    return 'desktop';
  };
  
  const platform = getPlatform();
  
  // Handle install click
  const handleInstall = async () => {
    await showInstallPrompt();
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Install EdPsych Connect</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Install our app for a better experience and offline access.
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Benefits of Installing</h4>
            <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Access educational resources offline</li>
              <li>Faster loading times</li>
              <li>Full-screen experience without browser controls</li>
              <li>Icon on your home screen for quick access</li>
              <li>Receive important notifications</li>
            </ul>
            
            {platform === 'desktop' && (
              <div className="mt-4">
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Install Now
                </button>
              </div>
            )}
            
            {platform === 'ios' && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">How to install on iOS:</p>
                <ol className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-decimal list-inside">
                  <li>Tap the share button <span className="inline-block w-5 h-5 align-text-bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </span> in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right corner</li>
                </ol>
              </div>
            )}
            
            {platform === 'android' && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">How to install on Android:</p>
                <ol className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-decimal list-inside">
                  <li>Tap the menu button in Chrome</li>
                  <li>Tap "Add to Home Screen"</li>
                  <li>Follow the on-screen instructions</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallationGuide;
