/**
 * EdPsych-AI-Education-Platform Theme Configuration
 * 
 * This file configures the theme for the platform, integrating the brand design system
 * and ensuring a cohesive visual identity across all components.
 */

'use client';

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define theme types
export type Theme = "light" | "dark" | "system" | "high-contrast";
export type AgeGroup = "nursery" | "early-primary" | "late-primary" | "secondary";

// Theme context type
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  isDyslexicFont: boolean;
  setIsDyslexicFont: (isDyslexicFont: boolean) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  isReducedMotion: boolean;
  setIsReducedMotion: (isReducedMotion: boolean) => void;
};

// Create context
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  ageGroup: "late-primary",
  setAgeGroup: () => null,
  isDyslexicFont: false,
  setIsDyslexicFont: () => null,
  fontSize: 16,
  setFontSize: () => null,
  isReducedMotion: false,
  setIsReducedMotion: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to merge class names
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Theme provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultAgeGroup = "late-primary",
  defaultDyslexicFont = false,
  defaultFontSize = 16,
  defaultReducedMotion = false,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAgeGroup?: AgeGroup;
  defaultDyslexicFont?: boolean;
  defaultFontSize?: number;
  defaultReducedMotion?: boolean;
  [key: string];
}) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      if (typeof window !== 'undefined') {
        return (localStorage?.getItem("theme") as Theme) || defaultTheme;
      }
      return defaultTheme;
    }
  );
  
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(
    () => {
      if (typeof window !== 'undefined') {
        return (localStorage?.getItem("ageGroup") as AgeGroup) || defaultAgeGroup;
      }
      return defaultAgeGroup;
    }
  );
  
  const [isDyslexicFont, setIsDyslexicFont] = useState<boolean>(
    () => {
      if (typeof window !== 'undefined') {
        return localStorage?.getItem("dyslexicFont") === "true" || defaultDyslexicFont;
      }
      return defaultDyslexicFont;
    }
  );
  
  const [fontSize, setFontSize] = useState<number>(
    () => {
      if (typeof window !== 'undefined') {
        return parseInt(localStorage?.getItem("fontSize") || defaultFontSize.toString());
      }
      return defaultFontSize;
    }
  );
  
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(
    () => {
      if (typeof window !== 'undefined') {
        return localStorage?.getItem("reducedMotion") === "true" || defaultReducedMotion;
      }
      return defaultReducedMotion;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Remove age group classes
    root.classList.remove("nursery-theme", "early-primary-theme", "late-primary-theme", "secondary-theme");
    
    // Remove accessibility classes
    root.classList.remove("dyslexic-font", "reduced-motion");
    
    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-colour-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      document.body.setAttribute("data-theme", systemTheme);
    } else {
      root.classList.add(theme);
      document.body.setAttribute("data-theme", theme);
    }
    
    // Apply age group
    root.classList.add(`${ageGroup}-theme`);
    document.body.setAttribute("data-age-group", ageGroup);
    
    // Apply accessibility settings
    if (isDyslexicFont) {
      root.classList.add("dyslexic-font");
    }
    
    if (isReducedMotion) {
      root.classList.add("reduced-motion");
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Save preferences to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", theme);
      localStorage.setItem("ageGroup", ageGroup);
      localStorage.setItem("dyslexicFont", isDyslexicFont.toString());
      localStorage.setItem("fontSize", fontSize.toString());
      localStorage.setItem("reducedMotion", isReducedMotion.toString());
    }
  }, [theme, ageGroup, isDyslexicFont, fontSize, isReducedMotion]);

  const value = {
    theme,
    setTheme,
    ageGroup,
    setAgeGroup,
    isDyslexicFont,
    setIsDyslexicFont,
    fontSize,
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
