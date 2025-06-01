'use client';

import React, { useState, useEffect } from 'react';
import { ImmersiveControls } from './immersive-controls';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';

interface ImmersiveContentViewerProps {
  contentUrl?: string;
  contentType: 'image' | 'video' | 'audio' | 'document' | '3d-model';
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

/**
 * Immersive Content Viewer Component
 * 
 * A component for viewing various types of content in an immersive context
 * with appropriate controls and accessibility features.
 */
export function ImmersiveContentViewer({
  contentUrl,
  contentType,
  title,
  description,
  className = '',
  children,
  onBack
}: ImmersiveContentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Simulate content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentUrl) {
        setIsLoading(false);
      } else if (!children) {
        setError('No content provided');
      } else {
        setIsLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [contentUrl, children]);
  
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
  
  // Handle reset
  const handleReset = () => {
    setZoomLevel(1);
  };
  
  // Render content based on type
  const renderContent = () => {
    if (children) {
      return children;
    }
    
    if (!contentUrl) {
      return (
        <div className="flex items-centre justify-centre h-full">
          <div className="text-centre p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <p className="text-grey-600">No content available</p>
          </div>
        </div>
      );
    }
    
    switch (contentType) {
      case 'image':
        return (
          <div className="flex items-centre justify-centre h-full">
            <img 
              src={contentUrl} 
              alt={title || 'Immersive content'} 
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        );
      case 'video':
        return (
          <div className="flex items-centre justify-centre h-full">
            <video 
              src={contentUrl} 
              controls 
              className="max-w-full max-h-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-centre justify-centre h-full">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">{title || 'Audio Content'}</h3>
              {description && <p className="mb-4 text-grey-600">{description}</p>}
              <audio src={contentUrl} controls className="w-full">
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        );
      case 'document':
        return (
          <div className="flex items-centre justify-centre h-full">
            <iframe 
              src={contentUrl} 
              title={title || 'Document viewer'} 
              className="w-full h-full border-0"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        );
      case '3d-model':
        return (
          <div className="flex items-centre justify-centre h-full">
            <div className="text-centre p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <p className="text-grey-600">
                3D model viewer would be integrated here using Three.js or similar library
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-centre justify-centre h-full">
            <div className="text-centre p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <p className="text-grey-600">Unsupported content type</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className={`immersive-content-viewer relative w-full h-full overflow-hidden ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-centre justify-centre bg-grey-900/50 z-20">
          <div className="text-centre text-white">
            <Spinner size="lg" className="text-white" />
            <p className="mt-4">Loading content...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-centre justify-centre bg-red-900/50 z-20">
          <div className="bg-white rounded-lg p-6 max-w-md text-centre">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-grey-900 mb-2">Error Loading Content</h3>
            <p className="text-grey-700 mb-4">{error}</p>
            <Button onClick={() => setError(null)}>Dismiss</Button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="content-container w-full h-full">
        {!isLoading && !error && renderContent()}
      </div>
      
      {/* Controls */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 right-4 z-10">
          <ImmersiveControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
          />
        </div>
      )}
      
      {/* Back button */}
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Button>
      )}
      
      {/* Title and description overlay */}
      {(title || description) && !isLoading && !error && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
          <div className="text-white">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {description && <p className="mt-1 text-sm opacity-80">{description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
