'use client';

import React, { useState, useEffect } from 'react';

// Define UK accent and dialect options
export const ukAccentOptions = [
  { value: 'uk_general', label: 'UK General', langCode: 'en-GB' },
  { value: 'uk_received', label: 'Received Pronunciation', langCode: 'en-GB' },
  { value: 'uk_scottish', label: 'Scottish', langCode: 'en-GB-Scotland' },
  { value: 'uk_welsh', label: 'Welsh', langCode: 'en-GB-Wales' },
  { value: 'uk_northern', label: 'Northern English', langCode: 'en-GB-North' },
  { value: 'uk_midlands', label: 'Midlands', langCode: 'en-GB' },
  { value: 'uk_west_country', label: 'West Country', langCode: 'en-GB' },
  { value: 'uk_london', label: 'London', langCode: 'en-GB-London' },
  { value: 'uk_children', label: 'Children\'s Speech', langCode: 'en-GB' },
];

// Define types for accent recognition
type AccentRecognitionOptions = {
  initialAccent?: string;
  adaptiveMode?: boolean;
  sensitivityLevel?: number;
};

/**
 * Hook for UK accent recognition optimization
 * 
 * This hook provides enhanced recognition for UK accents and dialects,
 * with special focus on children's speech patterns.
 * 
 * @param options Configuration options for accent recognition
 * @returns Accent recognition state and controls
 */
export function useUKAccentRecognition(options: AccentRecognitionOptions = {}) {
  // Default options
  const defaultOptions = {
    initialAccent: 'uk_general',
    adaptiveMode: true,
    sensitivityLevel: 75,
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // State
  const [selectedAccent, setSelectedAccent] = useState<string>(mergedOptions.initialAccent);
  const [adaptiveMode, setAdaptiveMode] = useState<boolean>(mergedOptions.adaptiveMode);
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(mergedOptions.sensitivityLevel);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  
  // Calculate confidence threshold based on sensitivity level
  useEffect(() => {
    // Map sensitivity (0-100) to confidence threshold (0.2-0.9)
    // Lower sensitivity = higher threshold (more strict)
    const threshold = 0.9 - (sensitivityLevel / 100) * 0.7;
    setConfidenceThreshold(threshold);
  }, [sensitivityLevel]);
  
  // Get language code for selected accent
  const getLanguageCode = (): string => {
    const accent = ukAccentOptions.find(option => option.value === selectedAccent);
    return accent ? accent.langCode : 'en-GB';
  };
  
  // Process recognition result with accent optimization
  const processRecognitionResult = (
    result: { transcript: string; confidence: number }[]
  ): { transcript: string; confidence: number } => {
    if (!result || result.length === 0) {
      return { transcript: '', confidence: 0 };
    }
    
    // If adaptive mode is enabled, use the result with highest confidence
    if (adaptiveMode) {
      // Sort results by confidence
      const sortedResults = [...result].sort((a, b) => b.confidence - a.confidence);
      
      // Return the result with highest confidence
      return sortedResults[0];
    }
    
    // If adaptive mode is disabled, use the first result if it meets the confidence threshold
    if (result[0].confidence >= confidenceThreshold) {
      return result[0];
    }
    
    // If confidence is too low, return empty result
    return { transcript: '', confidence: 0 };
  };
  
  // Apply children's speech pattern optimizations
  const applyChildrenSpeechOptimizations = (transcript: string): string => {
    // Only apply optimizations if children's speech is selected
    if (selectedAccent !== 'uk_children') {
      return transcript;
    }
    
    // Common children's speech pattern corrections
    let optimizedTranscript = transcript;
    
    // Correct common mispronunciations
    const childSpeechPatterns: Record<string, string> = {
      'wabbit': 'rabbit',
      'lellow': 'yellow',
      'fing': 'thing',
      'wif': 'with',
      'dat': 'that',
      'dis': 'this',
      'fink': 'think',
      'free': 'three',
      'bwue': 'blue',
      'wed': 'red',
      'pway': 'play',
      'twain': 'train',
      'skoo': 'school',
      'teef': 'teeth',
      'mouf': 'mouth',
      'birfday': 'birthday',
      'compooter': 'computer',
      'libwary': 'library',
      'aminal': 'animal',
      'pasghetti': 'spaghetti',
      'lellow': 'yellow',
      'choclat': 'chocolate',
      'brekfust': 'breakfast',
      'hospitel': 'hospital',
      'vegtable': 'vegetable',
      'elphant': 'elephant',
    };
    
    // Apply corrections
    Object.entries(childSpeechPatterns).forEach(([pattern, correction]) => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      optimizedTranscript = optimizedTranscript.replace(regex, correction);
    });
    
    return optimizedTranscript;
  };
  
  // Return accent recognition state and controls
  return {
    selectedAccent,
    setSelectedAccent,
    adaptiveMode,
    setAdaptiveMode,
    sensitivityLevel,
    setSensitivityLevel,
    confidenceThreshold,
    getLanguageCode,
    processRecognitionResult,
    applyChildrenSpeechOptimizations,
  };
}

/**
 * UK Accent Optimization Component
 * 
 * This component provides enhanced recognition for UK accents and dialects,
 * with special focus on children's speech patterns.
 */
export default function UKAccentOptimization({
  children,
  initialAccent = 'uk_general',
  adaptiveMode = true,
  sensitivityLevel = 75,
}: {
  children: React.ReactNode;
  initialAccent?: string;
  adaptiveMode?: boolean;
  sensitivityLevel?: number;
}) {
  const accentRecognition = useUKAccentRecognition({
    initialAccent,
    adaptiveMode,
    sensitivityLevel,
  });
  
  return (
    <div className="uk-accent-optimization">
      {children}
    </div>
  );
}
