"use client";

/**
 * AvatarVideo Component for Working Memory Support
 * 
 * This component provides a placeholder for AI avatar videos that will explain
 * working memory concepts and provide guidance on using the tools and exercises.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/components/i18n';

interface AvatarVideoProps {
  title: string;
  description: string;
}

export default function AvatarVideo({ title, description }: AvatarVideoProps) {
  const { t } = useTranslation('working-memory');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  return (
    <div className="avatar-video-container p-4 border-2 border-blue-200 bg-blue-50 rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-medium">{title}</h4>
      </div>
      
      <div className="relative bg-gray-200 rounded-md aspect-video flex items-center justify-center">
        {/* This is a placeholder for the actual video that will be added later */}
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">
            AI Avatar Video Placeholder
          </p>
          <p className="text-sm text-gray-500 mt-1">
            The actual video will be added in production
          </p>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p>{description}</p>
      </div>
    </div>
  );
}
