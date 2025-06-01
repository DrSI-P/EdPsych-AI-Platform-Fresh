"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the accessibility context type
interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  colorBlindMode: string;
  setColorBlindMode: (mode: string) => void;
  voiceInput: boolean;
  setVoiceInput: (value: boolean) => void;
}

// Create the context with default values
const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  setHighContrast: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  colorBlindMode: 'none',
  setColorBlindMode: () => {},
  voiceInput: false,
  setVoiceInput: () => {}
});

// Hook to use the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

// Provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState('none');
  const [voiceInput, setVoiceInput] = useState(false);
  
  // Create the context value
  const contextValue = {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    colorBlindMode,
    setColorBlindMode,
    voiceInput,
    setVoiceInput
  };
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}
