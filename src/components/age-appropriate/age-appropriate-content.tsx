'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup, ComplexityLevel } from './age-appropriate-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AgeAppropriateContentProps {
  children: React.ReactNode;
  contentType?: 'lesson' | 'activity' | 'assessment' | 'resource';
  minAge?: AgeGroup;
  maxAge?: AgeGroup;
  className?: string;
  showBadges?: boolean;
}

export const AgeAppropriateContent: React.FC<AgeAppropriateContentProps> = ({
  children,
  contentType = 'lesson',
  minAge = 'nursery',
  maxAge,
  className = '',
  showBadges = true,
}) => {
  const { ageGroup, complexityLevel, isAgeAppropriate, getAgeRangeText } = useAgeAppropriate();
  
  // Check if content is appropriate for current age group
  const appropriate = isAgeAppropriate(minAge, maxAge);
  
  // Apply age-specific CSS classes
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
  
  // Apply complexity-specific CSS classes
  const getComplexityClasses = (): string => {
    switch (complexityLevel) {
      case 'very-simple':
        return 'complexity-very-simple';
      case 'simple':
        return 'complexity-simple';
      case 'moderate':
        return 'complexity-moderate';
      case 'advanced':
        return 'complexity-advanced';
      default:
        return '';
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
  
  // Get age group icon
  const getAgeGroupIcon = (): string => {
    switch (ageGroup) {
      case 'nursery':
        return '🧸';
      case 'primary':
        return '📚';
      case 'secondary':
        return '🎒';
      case 'adult':
        return '👨‍🎓';
      default:
        return '👤';
    }
  };
  
  // If content is not appropriate for the current age group, show a warning
  if (!appropriate) {
    return (
      <Card className="age-inappropriate-warning">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-medium">Age-Appropriate Content Notice</h3>
          </div>
          <p>
            This content is designed for {getAgeRangeText(minAge)}
            {maxAge && ` to ${getAgeRangeText(maxAge)}`}.
          </p>
          <p className="mt-2">
            Your current profile is set to {getAgeRangeText(ageGroup)}.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`age-appropriate-content ${getAgeClasses()} ${getComplexityClasses()} ${className}`}>
      {showBadges && (
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <span>{getAgeGroupIcon()}</span>
            <span className="capitalize">{ageGroup}</span>
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

export default AgeAppropriateContent;
