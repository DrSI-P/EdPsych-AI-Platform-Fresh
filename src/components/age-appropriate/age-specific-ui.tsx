'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup } from './age-appropriate-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UKKeyStage, mapAgeGroupToKeyStage } from './uk-curriculum-mapper';

interface AgeSpecificUIProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'card' | 'section' | 'interactive';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

// Helper function to get age-specific UI class
const getAgeSpecificUIClass = (ageGroup: AgeGroup): string => {
  switch (ageGroup) {
    case 'nursery':
      return 'age-nursery-ui';
    case 'primary':
      return 'age-primary-ui';
    case 'secondary':
      return 'age-secondary-ui';
    case 'adult':
      return 'age-adult-ui';
    default:
      return 'age-primary-ui'; // Default to primary
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

// Helper function to get age-appropriate icons
const getAgeAppropriateIcon = (ageGroup: AgeGroup): string => {
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
      return '📚';
  }
};

export const AgeSpecificUI: React.FC<AgeSpecificUIProps> = ({
  children,
  className = '',
  variant = 'card',
  title,
  description,
  icon,
}) => {
  const { ageGroup, complexityLevel } = useAgeAppropriate();
  
  // Get age-specific UI class
  const ageUIClass = getAgeSpecificUIClass(ageGroup);
  
  // Get current key stages based on age group
  const keyStages = mapAgeGroupToKeyStage(ageGroup);
  
  // Get key stage class for the first key stage (primary styling)
  const keyStageClass = keyStages.length > 0 ? getKeyStageClass(keyStages[0]) : '';
  
  // Get default icon if not provided
  const displayIcon = icon || <span className="icon">{getAgeAppropriateIcon(ageGroup)}</span>;
  
  // Apply complexity class
  const complexityClass = `complexity-${complexityLevel}`;
  
  if (variant === 'card') {
    return (
      <Card className={`${ageUIClass} ${keyStageClass} ${complexityClass} ${className}`}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {displayIcon}
              <span>{title}</span>
            </CardTitle>
            {description && <p className="text-muted-foreground">{description}</p>}
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    );
  }
  
  if (variant === 'interactive') {
    return (
      <div className={`${ageUIClass} ${keyStageClass} ${complexityClass} ${className} interactive-element`}>
        {title && (
          <div className="interactive-header flex items-center gap-2 mb-4">
            {displayIcon}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        <div className="interactive-content">
          {children}
        </div>
      </div>
    );
  }
  
  // Default section variant
  return (
    <section className={`${ageUIClass} ${keyStageClass} ${complexityClass} ${className}`}>
      {title && (
        <div className="section-header flex items-center gap-2 mb-4">
          {displayIcon}
          <h2 className="text-xl font-medium">{title}</h2>
        </div>
      )}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      <div className="section-content">
        {children}
      </div>
    </section>
  );
};

export default AgeSpecificUI;
