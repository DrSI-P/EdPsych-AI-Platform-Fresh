'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImmersiveControls } from './immersive-controls';

interface ImmersiveViewerProps {
  contentUrl?: string;
  contentType?: '3d' | 'vr' | 'ar';
  title?: string;
  description?: string;
  isVRSupported?: boolean;
  onBack?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Immersive Viewer Component
 * 
 * A component for viewing 3D, VR, and AR content with appropriate controls
 * and accessibility features.
 */
export function ImmersiveViewer({
  contentUrl,
  contentType = '3d',
  title,
  description,
  isVRSupported = false,
  onBack,
  className = '',
  children
}: ImmersiveViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isVRActive, setIsVRActive] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  
  // Simulate content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [contentUrl]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle zoom change
  const handleZoomChange = (value: number) => {
    setZoomLevel(value);
  };
  
  // Handle rotation
  const handleRotate = (degrees: number) => {
    setRotation(prev => prev + degrees);
  };
  
  // Handle reset
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  
  // Handle VR toggle
  const handleToggleVR = () => {
    setIsVRActive(prev => !prev);
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };
  
  // Toggle info visibility
  const toggleInfo = () => {
    setShowInfo(prev => !prev);
  };
  
  return (
    <div className={`immersive-viewer relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      {/* Main content area */}
      <div 
        className={`immersive-content relative w-full h-full bg-grey-100 ${
          isVRActive ? 'vr-mode' : ''
        }`}
      >
        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-centre justify-centre bg-grey-900/50 z-20"
            >
              <div className="text-centre text-white">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-4 text-lg font-medium">Loading {contentType.toUpperCase()} content...</p>
                {title && <p className="mt-2 text-sm opacity-80">{title}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-centre justify-centre bg-red-900/50 z-20 p-6">
            <div className="bg-white rounded-lg p-6 max-w-md text-centre">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-bold text-grey-900 mb-2">Error Loading Content</h3>
              <p className="text-grey-700 mb-4">{error}</p>
              <div className="flex justify-centre space-x-3">
                <button 
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-grey-200 hover:bg-grey-300 rounded-md transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content container with transformations */}
        <div 
          className="content-container w-full h-full"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {children}
        </div>
        
        {/* Info overlay */}
        <AnimatePresence>
          {showInfo && title && !isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10"
            >
              <div className="text-white">
                <h2 className="text-xl font-bold">{title}</h2>
                {description && (
                  <p className="mt-1 text-sm opacity-80">{description}</p>
                )}
              </div>
              <button 
                onClick={toggleInfo}
                className="absolute top-4 right-4 text-white opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Hide information"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Controls */}
        <AnimatePresence>
          {showControls && !isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 z-10"
            >
              <ImmersiveControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onRotate={handleRotate}
                onReset={handleReset}
                onToggleVR={handleToggleVR}
                isVRSupported={isVRSupported && contentType === 'vr'}
                isVRActive={isVRActive}
                zoomLevel={zoomLevel}
                onZoomChange={handleZoomChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Controls toggle button */}
        {!isLoading && !error && (
          <button
            onClick={toggleControls}
            className="absolute bottom-4 left-4 z-10 w-10 h-10 flex items-centre justify-centre rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {showControls ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        )}
        
        {/* Back button */}
        {onBack && !isLoading && !error && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-centre justify-centre rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
