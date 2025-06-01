'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImmersiveViewer } from './immersive-viewer';
import { Button } from '@/components/ui/button';
import { VrHeadset } from '@/components/icons';

interface ImmersiveLayoutProps {
  title?: string;
  description?: string;
  isVR?: boolean;
  isAR?: boolean;
  is3D?: boolean;
  onBack?: () => void;
  onToggleFullscreen?: () => void;
  onToggleVR?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Immersive Layout Component
 * 
 * A layout component for immersive learning experiences that provides
 * consistent structure, navigation, and accessibility features.
 */
export function ImmersiveLayout({
  title,
  description,
  isVR = false,
  isAR = false,
  is3D = true,
  onBack,
  onToggleFullscreen,
  onToggleVR,
  className = '',
  children
}: ImmersiveLayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  
  // Check for user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    
    onToggleFullscreen?.();
  };
  
  // Handle VR mode toggle
  const handleToggleVR = () => {
    setIsVRMode(!isVRMode);
    onToggleVR?.();
  };
  
  // Handle high contrast toggle
  const handleToggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    // Apply high contrast mode to the document
    document.documentElement.classList.toggle('high-contrast-mode', !isHighContrast);
  };
  
  // Handle reduced motion toggle
  const handleToggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    // Apply reduced motion mode to the document
    document.documentElement.classList.toggle('reduced-motion', !isReducedMotion);
  };
  
  // Toggle accessibility menu
  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };
  
  return (
    <div 
      className={`immersive-layout relative w-full h-full overflow-hidden ${
        isHighContrast ? 'high-contrast-mode' : ''
      } ${
        isReducedMotion ? 'reduced-motion' : ''
      } ${className}`}
    >
      {/* Main content area */}
      <div className="immersive-content-area w-full h-full">
        <ImmersiveViewer
          title={title}
          description={description}
          contentType={isVR ? 'vr' : isAR ? 'ar' : '3d'}
          isVRSupported={isVR}
          onBack={onBack}
          className="w-full h-full"
        >
          {children}
        </ImmersiveViewer>
      </div>
      
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-centre space-x-2">
        {/* Accessibility menu toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAccessibilityMenu}
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
          aria-label="Accessibility options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zM6.75 6.75a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zM6.75 12.75a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
          </svg>
        </Button>
        
        {/* Fullscreen toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleFullscreen}
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {isFullscreen ? (
              <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v4a1 1 0 01-2 0V5a3 3 0 013-3h4a1 1 0 010 2H5zm10 8a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 001-1v-4a1 1 0 012 0zm-10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 000-2H5a1 1 0 01-1-1v-4a1 1 0 00-2 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            )}
          </svg>
        </Button>
        
        {/* VR mode toggle (only if VR is supported) */}
        {isVR && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVR}
            className={`${
              isVRMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white/90 backdrop-blur-sm hover:bg-white'
            }`}
            aria-label={isVRMode ? "Exit VR mode" : "Enter VR mode"}
          >
            <VrHeadset className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Accessibility menu */}
      <AnimatePresence>
        {showAccessibilityMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-lg p-4 w-64"
          >
            <div className="flex justify-between items-centre mb-4">
              <h3 className="font-semibold">Accessibility Options</h3>
              <button
                onClick={toggleAccessibilityMenu}
                className="text-grey-500 hover:text-grey-700"
                aria-label="Close accessibility menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* High contrast mode */}
              <div className="flex items-centre justify-between">
                <label htmlFor="high-contrast" className="text-sm">
                  High Contrast Mode
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="high-contrast"
                    checked={isHighContrast}
                    onChange={handleToggleHighContrast}
                    className="sr-only"
                  />
                  <div className={`block h-6 rounded-full w-10 ${isHighContrast ? 'bg-blue-600' : 'bg-grey-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isHighContrast ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
              
              {/* Reduced motion */}
              <div className="flex items-centre justify-between">
                <label htmlFor="reduced-motion" className="text-sm">
                  Reduced Motion
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="reduced-motion"
                    checked={isReducedMotion}
                    onChange={handleToggleReducedMotion}
                    className="sr-only"
                  />
                  <div className={`block h-6 rounded-full w-10 ${isReducedMotion ? 'bg-blue-600' : 'bg-grey-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isReducedMotion ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
              
              {/* Keyboard shortcuts */}
              <div className="pt-2 border-t border-grey-200">
                <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
                <ul className="text-xs space-y-1 text-grey-600">
                  <li><span className="font-mono bg-grey-100 px-1 rounded">F</span> - Toggle fullscreen</li>
                  <li><span className="font-mono bg-grey-100 px-1 rounded">Esc</span> - Exit fullscreen or go back</li>
                  <li><span className="font-mono bg-grey-100 px-1 rounded">+</span> / <span className="font-mono bg-grey-100 px-1 rounded">-</span> - Zoom in/out</li>
                  <li><span className="font-mono bg-grey-100 px-1 rounded">R</span> - Reset view</li>
                  <li><span className="font-mono bg-grey-100 px-1 rounded">A</span> - Toggle accessibility menu</li>
                  {isVR && <li><span className="font-mono bg-grey-100 px-1 rounded">V</span> - Toggle VR mode</li>}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Keyboard event listeners */}
      <div className="sr-only" aria-live="polite">
        {/* This div is for screen readers to announce keyboard shortcuts */}
        Keyboard shortcuts available. Press A to open accessibility menu.
      </div>
    </div>
  );
}
