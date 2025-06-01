'use client';

import React, { useState, useEffect } from 'react';
import { ImmersiveControls } from './immersive-controls';
import { Button } from '@/components/ui/button';

interface ThreeDSceneProps {
  children?: React.ReactNode;
  showControls?: boolean;
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  onSceneLoaded?: () => void;
  onSceneError?: (error: Error) => void;
}

/**
 * 3D Scene Component
 * 
 * A component for rendering 3D content with navigation controls
 * and accessibility features.
 */
export function ThreeDScene({
  children,
  showControls = true,
  controlsPosition = 'bottom-right',
  className = '',
  onSceneLoaded,
  onSceneError
}: ThreeDSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Simulate scene loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onSceneLoaded?.();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [onSceneLoaded]);
  
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
  };
  
  // Get controls position classes
  const getControlsPositionClasses = () => {
    switch (controlsPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  return (
    <div className={`three-d-scene relative w-full h-full overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-centre justify-centre bg-grey-900/50 z-20">
          <div className="text-centre text-white">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-lg font-medium">Loading 3D scene...</p>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-centre justify-centre bg-red-900/50 z-20 p-6">
          <div className="bg-white rounded-lg p-6 max-w-md text-centre">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-grey-900 mb-2">Error Loading Scene</h3>
            <p className="text-grey-700 mb-4">{error.message}</p>
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
      
      {/* Controls */}
      {showControls && !isLoading && !error && (
        <div className={`absolute ${getControlsPositionClasses()} z-10`}>
          <ImmersiveControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
            onReset={handleReset}
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
          />
        </div>
      )}
      
      {/* Fullscreen toggle */}
      {!isLoading && !error && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleFullscreen}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
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
      )}
    </div>
  );
}
