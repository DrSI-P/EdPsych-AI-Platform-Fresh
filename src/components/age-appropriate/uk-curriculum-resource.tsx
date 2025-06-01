'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup } from './age-appropriate-provider';
import { UKKeyStage, UKSubject, getKeyStageText, getSubjectDisplayName } from './uk-curriculum-mapper';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UKCurriculumResourceProps {
  children: React.ReactNode;
  title: string;
  keyStage: UKKeyStage;
  subject?: UKSubject;
  description?: string;
  resourceType?: 'lesson' | 'activity' | 'assessment' | 'worksheet' | 'guide';
  className?: string;
  footer?: React.ReactNode;
}

// Helper function to get resource type icon
const getResourceTypeIcon = (resourceType: string): string => {
  switch (resourceType) {
    case 'lesson':
      return '📖';
    case 'activity':
      return '🎯';
    case 'assessment':
      return '✅';
    case 'worksheet':
      return '📝';
    case 'guide':
      return '📋';
    default:
      return '📄';
  }
};

// Helper function to get key stage class
const getKeyStageClass = (keyStage: UKKeyStage): string => {
  switch (keyStage) {
    case 'early-years':
      return 'eyfs-resource';
    case 'ks1':
      return 'ks1-resource';
    case 'ks2':
      return 'ks2-resource';
    case 'ks3':
      return 'ks3-resource';
    case 'ks4':
      return 'ks4-resource';
    case 'ks5':
      return 'ks5-resource';
    default:
      return '';
  }
};

export const UKCurriculumResource: React.FC<UKCurriculumResourceProps> = ({
  children,
  title,
  keyStage,
  subject,
  description,
  resourceType = 'lesson',
  className = '',
  footer,
}) => {
  const { ageGroup, complexityLevel } = useAgeAppropriate();
  
  // Get key stage class
  const keyStageClass = getKeyStageClass(keyStage);
  
  // Apply complexity class
  const complexityClass = `complexity-${complexityLevel}`;
  
  return (
    <Card className={`uk-curriculum-resource ${keyStageClass} ${complexityClass} ${className}`}>
      <CardHeader className="uk-curriculum-resource-header">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{getResourceTypeIcon(resourceType)}</span>
            <span>{title}</span>
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="key-stage-badge">
            {getKeyStageText(keyStage)}
          </Badge>
          {subject && (
            <Badge variant="outline" className={`subject-badge subject-${subject}`}>
              {getSubjectDisplayName(subject)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="uk-curriculum-resource-content">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="uk-curriculum-resource-footer">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default UKCurriculumResource;
