'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import Image from 'next/image';
import Link from 'next/link';

export default function AIAvatarVideoComponent() {
  const { ageGroup } = useEnhancedTheme();
  const [currentVideo, setCurrentVideo] = useState(null);
  
  // Function to handle video selection
  const handleVideoSelect = (videoId) => {
    // In a real implementation, this would load the actual video
    // For now, we're just showing the placeholder
    setCurrentVideo(videoId);
  };
  
  // This component can be embedded on any page to show relevant AI avatar videos
  return (
    <div className="ai-avatar-video-component">
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <Typography variant="h4">
            AI Avatar Guide
          </Typography>
        </div>
        
        {currentVideo ? (
          <div className="aspect-video bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <Typography variant="body" className="text-gray-500 text-center">
                This is a placeholder for the AI avatar video.
              </Typography>
              <Typography variant="small" className="text-gray-500 mt-2 text-center">
                The actual video will be uploaded by Dr. Scott I-Patrick.
              </Typography>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <Typography variant="body" className="text-gray-500 text-center">
                Select a video guide below to learn more about this feature.
              </Typography>
            </div>
          </div>
        )}
        
        <div className="p-4">
          <Typography variant="h5" className="mb-4">
            Available Video Guides
          </Typography>
          
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleVideoSelect('feature-overview')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Feature Overview
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleVideoSelect('how-to-use')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              How to Use This Feature
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleVideoSelect('tips-tricks')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Tips & Tricks
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Link href="/videos" className="text-primary hover:underline flex items-center">
              <span>View all video guides</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
