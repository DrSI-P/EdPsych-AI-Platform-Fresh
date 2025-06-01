'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define age groups
export type AgeGroup = 'nursery' | 'primary' | 'secondary' | 'adult';

// Define content complexity levels
export type ComplexityLevel = 'very-simple' | 'simple' | 'moderate' | 'advanced';

interface AgeAppropriateContextType {
  ageGroup: AgeGroup;
  complexityLevel: ComplexityLevel;
  setAgeGroup: (age: AgeGroup) => void;
  setComplexityLevel: (level: ComplexityLevel) => void;
  isAgeAppropriate: (minAge: AgeGroup, maxAge?: AgeGroup) => boolean;
  getAgeRangeText: (ageGroup: AgeGroup) => string;
}

const AgeAppropriateContext = createContext<AgeAppropriateContextType | undefined>(undefined);

export const useAgeAppropriate = () => {
  const context = useContext(AgeAppropriateContext);
  if (context === undefined) {
    throw new Error('useAgeAppropriate must be used within an AgeAppropriateProvider');
  }
  return context;
};

interface AgeAppropriateProviderProps {
  children: ReactNode;
  initialAgeGroup?: AgeGroup;
  initialComplexityLevel?: ComplexityLevel;
}

// Helper function to map age group to complexity level
const getDefaultComplexityForAge = (ageGroup: AgeGroup): ComplexityLevel => {
  switch (ageGroup) {
    case 'nursery':
      return 'very-simple';
    case 'primary':
      return 'simple';
    case 'secondary':
      return 'moderate';
    case 'adult':
      return 'advanced';
    default:
      return 'simple';
  }
};

// Helper function to determine age group order for comparison
const getAgeGroupOrder = (ageGroup: AgeGroup): number => {
  switch (ageGroup) {
    case 'nursery':
      return 1;
    case 'primary':
      return 2;
    case 'secondary':
      return 3;
    case 'adult':
      return 4;
    default:
      return 2;
  }
};

export const AgeAppropriateProvider: React.FC<AgeAppropriateProviderProps> = ({
  children,
  initialAgeGroup = 'primary',
  initialComplexityLevel,
}) => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialAgeGroup);
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>(
    initialComplexityLevel || getDefaultComplexityForAge(initialAgeGroup)
  );

  // Load saved age group from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAgeGroup = localStorage.getItem('edpsych_age_group');
      const savedComplexityLevel = localStorage.getItem('edpsych_complexity_level');

      if (savedAgeGroup) {
        setAgeGroup(savedAgeGroup as AgeGroup);
      }
      
      if (savedComplexityLevel) {
        setComplexityLevel(savedComplexityLevel as ComplexityLevel);
      } else if (savedAgeGroup) {
        // If we have age but no complexity, set default complexity for that age
        setComplexityLevel(getDefaultComplexityForAge(savedAgeGroup as AgeGroup));
      }
    }
  }, []);

  // Save age group to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edpsych_age_group', ageGroup);
      localStorage.setItem('edpsych_complexity_level', complexityLevel);
    }
  }, [ageGroup, complexityLevel]);

  // Function to check if content is appropriate for the current age group
  const isAgeAppropriate = (minAge: AgeGroup, maxAge?: AgeGroup): boolean => {
    const currentAgeOrder = getAgeGroupOrder(ageGroup);
    const minAgeOrder = getAgeGroupOrder(minAge);
    
    if (!maxAge) {
      // If no max age is specified, content is appropriate if current age is at least the minimum
      return currentAgeOrder >= minAgeOrder;
    }
    
    const maxAgeOrder = getAgeGroupOrder(maxAge);
    // Content is appropriate if current age is between min and max (inclusive)
    return currentAgeOrder >= minAgeOrder && currentAgeOrder <= maxAgeOrder;
  };

  // Function to get human-readable age range text
  const getAgeRangeText = (ageGroup: AgeGroup): string => {
    switch (ageGroup) {
      case 'nursery':
        return 'Ages 3-5';
      case 'primary':
        return 'Ages 5-11';
      case 'secondary':
        return 'Ages 11-18';
      case 'adult':
        return 'Ages 18+';
      default:
        return '';
    }
  };

  const value = {
    ageGroup,
    complexityLevel,
    setAgeGroup,
    setComplexityLevel,
    isAgeAppropriate,
    getAgeRangeText,
  };

  return (
    <AgeAppropriateContext.Provider value={value}>
      {children}
    </AgeAppropriateContext.Provider>
  );
};

export default AgeAppropriateProvider;
