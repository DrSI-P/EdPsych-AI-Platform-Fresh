'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup, ComplexityLevel } from '@/components/age-appropriate';
import { useTheme } from '@/components/ui/theme-provider';
import { useLearningStyle } from '@/components/learning-style';

interface AgeAppropriateWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AgeAppropriateWrapper: React.FC<AgeAppropriateWrapperProps> = ({
  children,
  className = '',
}) => {
  const { ageGroup, complexityLevel } = useAgeAppropriate();
  const { theme } = useTheme();
  const { learningStyle } = useLearningStyle();
  
  // Get age-specific class
  const ageClass = `age-${ageGroup}`;
  
  // Get complexity class
  const complexityClass = `complexity-${complexityLevel}`;
  
  // Get learning style class if available
  const learningStyleClass = learningStyle ? `learning-style-${learningStyle}` : '';
  
  // Get theme class
  const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
  
  return (
    <div className={`age-appropriate-wrapper ${ageClass} ${complexityClass} ${learningStyleClass} ${themeClass} ${className}`}>
      {children}
    </div>
  );
};

export default AgeAppropriateWrapper;
