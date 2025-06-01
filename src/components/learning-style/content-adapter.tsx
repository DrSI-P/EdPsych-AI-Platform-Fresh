'use client';

import React from 'react';
import { useLearningStyle, LearningStyle } from './learning-style-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentAdapterProps {
  children: React.ReactNode;
  contentType?: 'lesson' | 'activity' | 'assessment' | 'resource';
  className?: string;
}

export const ContentAdapter: React.FC<ContentAdapterProps> = ({
  children,
  contentType = 'lesson',
  className = '',
}) => {
  const { learningStyle, ageGroup } = useLearningStyle();
  
  // Apply style-specific CSS classes based on learning style
  const getStyleClasses = (): string => {
    switch (learningStyle) {
      case 'visual':
        return 'learning-style-visual';
      case 'auditory':
        return 'learning-style-auditory';
      case 'reading':
        return 'learning-style-reading';
      case 'kinesthetic':
        return 'learning-style-kinesthetic';
      case 'multimodal':
        return 'learning-style-multimodal';
      default:
        return '';
    }
  };
  
  // Apply age-appropriate CSS classes
  const getAgeClasses = (): string => {
    switch (ageGroup) {
      case 'nursery':
        return 'age-nursery';
      case 'primary':
        return 'age-primary';
      case 'secondary':
        return 'age-secondary';
      case 'adult':
        return 'age-adult';
      default:
        return '';
    }
  };
  
  // Get style-specific icon
  const getStyleIcon = (): string => {
    switch (learningStyle) {
      case 'visual':
        return '👁️';
      case 'auditory':
        return '👂';
      case 'reading':
        return '📚';
      case 'kinesthetic':
        return '✋';
      case 'multimodal':
        return '🔄';
      default:
        return '📝';
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (): string => {
    switch (contentType) {
      case 'lesson':
        return '📖';
      case 'activity':
        return '🎯';
      case 'assessment':
        return '✅';
      case 'resource':
        return '📋';
      default:
        return '📄';
    }
  };
  
  return (
    <div className={`learning-style-content ${getStyleClasses()} ${getAgeClasses()} ${className}`}>
      {learningStyle !== 'unknown' && (
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <span>{getStyleIcon()}</span>
            <span className="capitalize">{learningStyle} optimized</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span>{getContentTypeIcon()}</span>
            <span className="capitalize">{contentType}</span>
          </Badge>
        </div>
      )}
      {children}
    </div>
  );
};

export default ContentAdapter;
