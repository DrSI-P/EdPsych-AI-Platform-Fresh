'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define learning style types
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'multimodal' | 'unknown';

// Define age groups for age-appropriate adaptations
export type AgeGroup = 'nursery' | 'primary' | 'secondary' | 'adult';

interface LearningStyleContextType {
  learningStyle: LearningStyle;
  ageGroup: AgeGroup;
  confidence: number; // 0-100 confidence in the learning style detection
  setLearningStyle: (style: LearningStyle) => void;
  setAgeGroup: (age: AgeGroup) => void;
  setConfidence: (confidence: number) => void;
  resetLearningStyle: () => void;
  isDetecting: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  adaptContent: (content: any) => any; // Function to adapt content based on learning style
}

const LearningStyleContext = createContext<LearningStyleContextType | undefined>(undefined);

export const useLearningStyle = () => {
  const context = useContext(LearningStyleContext);
  if (context === undefined) {
    throw new Error('useLearningStyle must be used within a LearningStyleProvider');
  }
  return context;
};

interface LearningStyleProviderProps {
  children: ReactNode;
  initialStyle?: LearningStyle;
  initialAgeGroup?: AgeGroup;
}

export const LearningStyleProvider: React.FC<LearningStyleProviderProps> = ({
  children,
  initialStyle = 'unknown',
  initialAgeGroup = 'primary',
}) => {
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(initialStyle);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialAgeGroup);
  const [confidence, setConfidence] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  // Load saved learning style from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStyle = localStorage.getItem('edpsych_learning_style');
      const savedAgeGroup = localStorage.getItem('edpsych_age_group');
      const savedConfidence = localStorage.getItem('edpsych_learning_style_confidence');

      if (savedStyle) {
        setLearningStyle(savedStyle as LearningStyle);
      }
      
      if (savedAgeGroup) {
        setAgeGroup(savedAgeGroup as AgeGroup);
      }
      
      if (savedConfidence) {
        setConfidence(parseInt(savedConfidence, 10));
      }
    }
  }, []);

  // Save learning style to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && learningStyle !== 'unknown') {
      localStorage.setItem('edpsych_learning_style', learningStyle);
      localStorage.setItem('edpsych_age_group', ageGroup);
      localStorage.setItem('edpsych_learning_style_confidence', confidence.toString());
    }
  }, [learningStyle, ageGroup, confidence]);

  const resetLearningStyle = () => {
    setLearningStyle('unknown');
    setConfidence(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('edpsych_learning_style');
      localStorage.removeItem('edpsych_learning_style_confidence');
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    // In a real implementation, this would start monitoring user interactions
    // to determine their learning style
  };

  const stopDetection = () => {
    setIsDetecting(false);
  };

  // Function to adapt content based on learning style and age group
  const adaptContent = (content: any) => {
    if (learningStyle === 'unknown') {
      return content; // Return original content if learning style is unknown
    }

    // Clone the content to avoid mutating the original
    const adaptedContent = { ...content };

    // Apply adaptations based on learning style
    switch (learningStyle) {
      case 'visual':
        // Enhance visual elements, add diagrams, reduce text density
        adaptedContent.visualEnhanced = true;
        break;
      case 'auditory':
        // Add audio elements, text-to-speech options
        adaptedContent.audioEnhanced = true;
        break;
      case 'reading':
        // Enhance text structure, add summaries, improve readability
        adaptedContent.textEnhanced = true;
        break;
      case 'kinesthetic':
        // Add interactive elements, hands-on activities
        adaptedContent.interactiveEnhanced = true;
        break;
      case 'multimodal':
        // Balanced approach with multiple modalities
        adaptedContent.multimodalEnhanced = true;
        break;
    }

    // Apply age-appropriate adaptations
    switch (ageGroup) {
      case 'nursery':
        // Simplify language, increase visuals, reduce text
        adaptedContent.complexityLevel = 'very-simple';
        adaptedContent.visualRatio = 0.8; // 80% visual, 20% text
        break;
      case 'primary':
        // Balance visuals and text, use simple language
        adaptedContent.complexityLevel = 'simple';
        adaptedContent.visualRatio = 0.6; // 60% visual, 40% text
        break;
      case 'secondary':
        // More complex content, balanced approach
        adaptedContent.complexityLevel = 'moderate';
        adaptedContent.visualRatio = 0.4; // 40% visual, 60% text
        break;
      case 'adult':
        // Full complexity, professional presentation
        adaptedContent.complexityLevel = 'advanced';
        adaptedContent.visualRatio = 0.3; // 30% visual, 70% text
        break;
    }

    return adaptedContent;
  };

  const value = {
    learningStyle,
    ageGroup,
    confidence,
    setLearningStyle,
    setAgeGroup,
    setConfidence,
    resetLearningStyle,
    isDetecting,
    startDetection,
    stopDetection,
    adaptContent,
  };

  return (
    <LearningStyleContext.Provider value={value}>
      {children}
    </LearningStyleContext.Provider>
  );
};

export default LearningStyleProvider;
