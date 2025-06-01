'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

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
  isHighContrast: boolean;
  setIsHighContrast: (isHighContrast: boolean) => void;
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
  isHighContrast: false,
  setIsHighContrast: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to merge class names
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Enhanced Theme provider component
export function EnhancedThemeProvider({
  children,
  defaultTheme = "system",
  defaultAgeGroup = "late-primary",
  defaultDyslexicFont = false,
  defaultFontSize = 16,
  defaultReducedMotion = false,
  defaultHighContrast = false,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAgeGroup?: AgeGroup;
  defaultDyslexicFont?: boolean;
  defaultFontSize?: number;
  defaultReducedMotion?: boolean;
  defaultHighContrast?: boolean;
  [key: string]: any;
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
  
  const [isHighContrast, setIsHighContrast] = useState<boolean>(
    () => {
      if (typeof window !== 'undefined') {
        return localStorage?.getItem("highContrast") === "true" || defaultHighContrast;
      }
      return defaultHighContrast;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Remove age group classes
    root.classList.remove("nursery-theme", "early-primary-theme", "late-primary-theme", "secondary-theme");
    
    // Remove accessibility classes
    root.classList.remove("dyslexic-font", "reduced-motion", "high-contrast");
    
    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
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
    
    if (isHighContrast || theme === "high-contrast") {
      root.classList.add("high-contrast");
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Apply CSS variables for the brand color palette
    applyBrandColorPalette(root, theme, isHighContrast, ageGroup);
    
    // Save preferences to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", theme);
      localStorage.setItem("ageGroup", ageGroup);
      localStorage.setItem("dyslexicFont", isDyslexicFont.toString());
      localStorage.setItem("fontSize", fontSize.toString());
      localStorage.setItem("reducedMotion", isReducedMotion.toString());
      localStorage.setItem("highContrast", isHighContrast.toString());
    }
  }, [theme, ageGroup, isDyslexicFont, fontSize, isReducedMotion, isHighContrast]);

  // Function to apply brand color palette as CSS variables
  const applyBrandColorPalette = (
    root: HTMLElement, 
    theme: Theme, 
    isHighContrast: boolean,
    ageGroup: AgeGroup
  ) => {
    // Base brand colors
    const brandColors = {
      primary: '#0369A1', // EdPsych Blue
      secondary: '#6D28D9', // EdPsych Purple
      success: '#15803D', // EdPsych Green
      warning: '#F59E0B', // Sunshine Yellow
      error: '#DC2626', // Coral Red
      info: '#0EA5E9', // Sky Blue
      accent: '#A78BFA', // Lavender
      
      // Neutrals
      textPrimary: '#1F2937', // Charcoal
      textSecondary: '#4B5563', // Slate
      disabled: '#9CA3AF', // Silver
      border: '#E5E7EB', // Platinum
      background: '#F9FAFB', // Snow
    };
    
    // Age-specific color adjustments
    const ageGroupAdjustments = {
      'nursery': {
        primary: '#38BDF8', // Lighter blue
        secondary: '#A78BFA', // Lighter purple
        background: '#FEFCE8', // Warm light background
      },
      'early-primary': {
        primary: '#0EA5E9', // Bright blue
        secondary: '#8B5CF6', // Bright purple
        background: '#F9FAFB', // Clean white background
      },
      'late-primary': {
        // Default colors
      },
      'secondary': {
        primary: '#0C4A6E', // Deeper blue
        secondary: '#5B21B6', // Deeper purple
        background: '#F8FAFC', // Crisp white background
      }
    };
    
    // Apply age-specific adjustments
    const colors = {
      ...brandColors,
      ...(ageGroupAdjustments[ageGroup] || {})
    };
    
    // Dark theme adjustments
    if (theme === 'dark' || (theme === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      colors.background = '#0F172A';
      colors.textPrimary = '#F9FAFB';
      colors.textSecondary = '#E5E7EB';
      colors.border = '#374151';
      
      // Brighten some colors for dark mode
      colors.primary = '#38BDF8';
      colors.info = '#7DD3FC';
      colors.accent = '#C4B5FD';
    }
    
    // High contrast adjustments
    if (isHighContrast || theme === 'high-contrast') {
      colors.primary = '#0284C7';
      colors.secondary = '#7E22CE';
      colors.textPrimary = theme === 'dark' ? '#FFFFFF' : '#000000';
      colors.textSecondary = theme === 'dark' ? '#F3F4F6' : '#1F2937';
      colors.background = theme === 'dark' ? '#000000' : '#FFFFFF';
      colors.border = theme === 'dark' ? '#FFFFFF' : '#000000';
    }
    
    // Apply colors as CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--color-${cssKey}`, value);
    });
    
    // Apply additional design tokens
    root.style.setProperty('--font-family', "'Nunito Sans', sans-serif");
    root.style.setProperty('--font-family-dyslexic', "'OpenDyslexic', sans-serif");
    
    // Spacing
    root.style.setProperty('--spacing-xs', '4px');
    root.style.setProperty('--spacing-sm', '8px');
    root.style.setProperty('--spacing-md', '16px');
    root.style.setProperty('--spacing-lg', '24px');
    root.style.setProperty('--spacing-xl', '32px');
    root.style.setProperty('--spacing-2xl', '48px');
    
    // Borders
    root.style.setProperty('--border-radius-sm', '4px');
    root.style.setProperty('--border-radius-md', '8px');
    root.style.setProperty('--border-radius-lg', '12px');
    root.style.setProperty('--border-width', '1px');
    
    // Shadows
    root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.05)');
    root.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.05)');
    root.style.setProperty('--shadow-lg', '0 10px 15px rgba(0, 0, 0, 0.05)');
  };

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
    isHighContrast,
    setIsHighContrast,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme
export const useEnhancedTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useEnhancedTheme must be used within an EnhancedThemeProvider");
  return context;
};
