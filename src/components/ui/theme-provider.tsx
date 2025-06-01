"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useTheme as useNextTheme } from "next-themes";

/**
 * Enhanced ThemeProvider component that provides theme context to the application
 * 
 * This component wraps the Next.js ThemeProvider and adds support for:
 * - Light/dark mode
 * - High contrast mode
 * - Dyslexia-friendly mode
 * - Reduced motion preferences
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);
  
  // Effect to handle system preference changes
  React.useEffect(() => {
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(highContrastQuery.matches);
    
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(reducedMotionQuery.matches);
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    
    // Set mounted state to enable client-side rendering
    setMounted(true);
    
    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  // Toggle high contrast mode
  const toggleHighContrast = React.useCallback(() => {
    setHighContrast(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('high-contrast', newValue);
      return newValue;
    });
  }, []);
  
  // Toggle dyslexia-friendly mode
  const toggleDyslexiaFriendly = React.useCallback(() => {
    setDyslexiaFriendly(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dyslexia-friendly', newValue);
      return newValue;
    });
  }, []);
  
  // Apply high contrast class based on state
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('high-contrast', highContrast);
    }
  }, [highContrast, mounted]);
  
  // Apply dyslexia-friendly class based on state
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dyslexia-friendly', dyslexiaFriendly);
    }
  }, [dyslexiaFriendly, mounted]);
  
  // Apply font size
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize, mounted]);
  
  // Apply reduced motion
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('reduce-motion', isReducedMotion);
    }
  }, [isReducedMotion, mounted]);
  
  // Create context value
  const accessibilityContextValue = React.useMemo(() => ({
    highContrast,
    dyslexiaFriendly,
    toggleHighContrast,
    toggleDyslexiaFriendly,
    fontSize,
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
    isDyslexicFont: dyslexiaFriendly,
    setIsDyslexicFont: setDyslexiaFriendly
  }), [highContrast, dyslexiaFriendly, toggleHighContrast, toggleDyslexiaFriendly, fontSize, isReducedMotion]);
  
  return (
    <AccessibilityContext.Provider value={accessibilityContextValue}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </AccessibilityContext.Provider>
  );
}

// Create context for accessibility features
export interface AccessibilityContextType {
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  toggleHighContrast: () => void;
  toggleDyslexiaFriendly: () => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  isReducedMotion: boolean;
  setIsReducedMotion: React.Dispatch<React.SetStateAction<boolean>>;
  isDyslexicFont: boolean;
  setIsDyslexicFont: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccessibilityContext = React.createContext<AccessibilityContextType>({
  highContrast: false,
  dyslexiaFriendly: false,
  toggleHighContrast: () => {},
  toggleDyslexiaFriendly: () => {},
  fontSize: 16,
  setFontSize: () => {},
  isReducedMotion: false,
  setIsReducedMotion: () => {},
  isDyslexicFont: false,
  setIsDyslexicFont: () => {}
});

// Custom hook to use accessibility features
export const useAccessibility = () => React.useContext(AccessibilityContext);

// Export useTheme hook that combines next-themes with our accessibility features
export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  const {
    fontSize,
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
    isDyslexicFont,
    setIsDyslexicFont
  } = useAccessibility();
  
  return {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
    isDyslexicFont,
    setIsDyslexicFont
  };
};
