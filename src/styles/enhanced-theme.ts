/**
 * Enhanced Theme Configuration for EdPsych-AI-Education-Platform
 * 
 * This file configures the enhanced theme using the improved design tokens
 * and provides theme utilities for consistent application across the platform.
 */

import { enhancedDesignTokens } from './enhanced-tokens';

// Enhanced theme configuration with improved light and dark mode variants
export const enhancedTheme = {
  light: {
    colors: {
      background: enhancedDesignTokens.colors.background.light,
      foreground: enhancedDesignTokens.colors.neutral[900],
      primary: enhancedDesignTokens.colors.primary[500],
      primaryForeground: enhancedDesignTokens.colors.neutral[50],
      secondary: enhancedDesignTokens.colors.secondary[500],
      secondaryForeground: enhancedDesignTokens.colors.neutral[50],
      accent: enhancedDesignTokens.colors.accent[500],
      accentForeground: enhancedDesignTokens.colors.neutral[50],
      muted: enhancedDesignTokens.colors.neutral[100],
      mutedForeground: enhancedDesignTokens.colors.neutral[600],
      border: enhancedDesignTokens.colors.border.light,
      input: enhancedDesignTokens.colors.border.light,
      card: enhancedDesignTokens.colors.surface.light,
      cardForeground: enhancedDesignTokens.colors.neutral[900],
      popover: enhancedDesignTokens.colors.surface.light,
      popoverForeground: enhancedDesignTokens.colors.neutral[900],
      success: enhancedDesignTokens.colors.success.DEFAULT,
      warning: enhancedDesignTokens.colors.warning.DEFAULT,
      error: enhancedDesignTokens.colors.error.DEFAULT,
      info: enhancedDesignTokens.colors.info.DEFAULT,
      
      // Educational theme colors
      mathLight: enhancedDesignTokens.colors.education.math.light,
      math: enhancedDesignTokens.colors.education.math.DEFAULT,
      mathDark: enhancedDesignTokens.colors.education.math.dark,
      
      scienceLight: enhancedDesignTokens.colors.education.science.light,
      science: enhancedDesignTokens.colors.education.science.DEFAULT,
      scienceDark: enhancedDesignTokens.colors.education.science.dark,
      
      languageLight: enhancedDesignTokens.colors.education.language.light,
      language: enhancedDesignTokens.colors.education.language.DEFAULT,
      languageDark: enhancedDesignTokens.colors.education.language.dark,
      
      humanitiesLight: enhancedDesignTokens.colors.education.humanities.light,
      humanities: enhancedDesignTokens.colors.education.humanities.DEFAULT,
      humanitiesDark: enhancedDesignTokens.colors.education.humanities.dark,
      
      artsLight: enhancedDesignTokens.colors.education.arts.light,
      arts: enhancedDesignTokens.colors.education.arts.DEFAULT,
      artsDark: enhancedDesignTokens.colors.education.arts.dark,
      
      // Age-appropriate colors
      nurseryLight: enhancedDesignTokens.colors.ageGroup.nursery.light,
      nursery: enhancedDesignTokens.colors.ageGroup.nursery.DEFAULT,
      nurseryDark: enhancedDesignTokens.colors.ageGroup.nursery.dark,
      
      primaryLight: enhancedDesignTokens.colors.ageGroup.primary.light,
      primaryAge: enhancedDesignTokens.colors.ageGroup.primary.DEFAULT,
      primaryAgeDark: enhancedDesignTokens.colors.ageGroup.primary.dark,
      
      secondaryLight: enhancedDesignTokens.colors.ageGroup.secondary.light,
      secondaryAge: enhancedDesignTokens.colors.ageGroup.secondary.DEFAULT,
      secondaryAgeDark: enhancedDesignTokens.colors.ageGroup.secondary.dark,
    },
    shadows: {
      sm: enhancedDesignTokens.shadows.sm,
      DEFAULT: enhancedDesignTokens.shadows.DEFAULT,
      md: enhancedDesignTokens.shadows.md,
      lg: enhancedDesignTokens.shadows.lg,
      xl: enhancedDesignTokens.shadows.xl,
      '2xl': enhancedDesignTokens.shadows['2xl'],
      inner: enhancedDesignTokens.shadows.inner,
      'soft-sm': enhancedDesignTokens.shadows['soft-sm'],
      'soft-md': enhancedDesignTokens.shadows['soft-md'],
      'soft-lg': enhancedDesignTokens.shadows['soft-lg'],
      'elevation-1': enhancedDesignTokens.shadows['elevation-1'],
      'elevation-2': enhancedDesignTokens.shadows['elevation-2'],
      'elevation-3': enhancedDesignTokens.shadows['elevation-3'],
      'elevation-4': enhancedDesignTokens.shadows['elevation-4'],
      'elevation-5': enhancedDesignTokens.shadows['elevation-5'],
    },
  },
  dark: {
    colors: {
      background: enhancedDesignTokens.colors.background.dark,
      foreground: enhancedDesignTokens.colors.neutral[100],
      primary: enhancedDesignTokens.colors.primary[400],
      primaryForeground: enhancedDesignTokens.colors.neutral[900],
      secondary: enhancedDesignTokens.colors.secondary[400],
      secondaryForeground: enhancedDesignTokens.colors.neutral[900],
      accent: enhancedDesignTokens.colors.accent[400],
      accentForeground: enhancedDesignTokens.colors.neutral[900],
      muted: enhancedDesignTokens.colors.neutral[800],
      mutedForeground: enhancedDesignTokens.colors.neutral[400],
      border: enhancedDesignTokens.colors.border.dark,
      input: enhancedDesignTokens.colors.border.dark,
      card: enhancedDesignTokens.colors.surface.dark,
      cardForeground: enhancedDesignTokens.colors.neutral[100],
      popover: enhancedDesignTokens.colors.surface.dark,
      popoverForeground: enhancedDesignTokens.colors.neutral[100],
      success: enhancedDesignTokens.colors.success.dark,
      warning: enhancedDesignTokens.colors.warning.dark,
      error: enhancedDesignTokens.colors.error.dark,
      info: enhancedDesignTokens.colors.info.dark,
      
      // Educational theme colors - dark mode variants
      mathLight: enhancedDesignTokens.colors.education.math.DEFAULT,
      math: enhancedDesignTokens.colors.education.math.light,
      mathDark: enhancedDesignTokens.colors.education.math.DEFAULT,
      
      scienceLight: enhancedDesignTokens.colors.education.science.DEFAULT,
      science: enhancedDesignTokens.colors.education.science.light,
      scienceDark: enhancedDesignTokens.colors.education.science.DEFAULT,
      
      languageLight: enhancedDesignTokens.colors.education.language.DEFAULT,
      language: enhancedDesignTokens.colors.education.language.light,
      languageDark: enhancedDesignTokens.colors.education.language.DEFAULT,
      
      humanitiesLight: enhancedDesignTokens.colors.education.humanities.DEFAULT,
      humanities: enhancedDesignTokens.colors.education.humanities.light,
      humanitiesDark: enhancedDesignTokens.colors.education.humanities.DEFAULT,
      
      artsLight: enhancedDesignTokens.colors.education.arts.DEFAULT,
      arts: enhancedDesignTokens.colors.education.arts.light,
      artsDark: enhancedDesignTokens.colors.education.arts.DEFAULT,
      
      // Age-appropriate colors - dark mode variants
      nurseryLight: enhancedDesignTokens.colors.ageGroup.nursery.DEFAULT,
      nursery: enhancedDesignTokens.colors.ageGroup.nursery.light,
      nurseryDark: enhancedDesignTokens.colors.ageGroup.nursery.DEFAULT,
      
      primaryLight: enhancedDesignTokens.colors.ageGroup.primary.DEFAULT,
      primaryAge: enhancedDesignTokens.colors.ageGroup.primary.light,
      primaryAgeDark: enhancedDesignTokens.colors.ageGroup.primary.DEFAULT,
      
      secondaryLight: enhancedDesignTokens.colors.ageGroup.secondary.DEFAULT,
      secondaryAge: enhancedDesignTokens.colors.ageGroup.secondary.light,
      secondaryAgeDark: enhancedDesignTokens.colors.ageGroup.secondary.DEFAULT,
    },
    shadows: {
      // Adjusted shadows for dark mode with reduced opacity
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.16)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.16)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.14)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.16)',
      'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      'soft-md': '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.08)',
      'soft-lg': '0 12px 20px -6px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
      'elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      'elevation-2': '0 3px 6px -1px rgba(0, 0, 0, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.1)',
      'elevation-3': '0 6px 12px -2px rgba(0, 0, 0, 0.2), 0 3px 6px -2px rgba(0, 0, 0, 0.15)',
      'elevation-4': '0 12px 24px -4px rgba(0, 0, 0, 0.25), 0 6px 12px -4px rgba(0, 0, 0, 0.2)',
      'elevation-5': '0 20px 32px -6px rgba(0, 0, 0, 0.3), 0 10px 20px -6px rgba(0, 0, 0, 0.25)',
    },
  },
  // Shared properties across light and dark modes
  shared: {
    typography: enhancedDesignTokens.typography,
    spacing: enhancedDesignTokens.spacing,
    borderRadius: enhancedDesignTokens.borderRadius,
    animation: enhancedDesignTokens.animation,
    zIndex: enhancedDesignTokens.zIndex,
    breakpoints: enhancedDesignTokens.breakpoints,
    mediaQueries: enhancedDesignTokens.mediaQueries,
  },
};

// Enhanced helper functions for theme usage
export const enhancedThemeHelpers = {
  // Get responsive value based on breakpoint
  responsive: (values: Record<string, string | number>) => {
    const breakpointKeys = Object.keys(enhancedDesignTokens.breakpoints);
    return Object.entries(values).reduce((acc, [key, value]) => {
      const breakpointIndex = breakpointKeys.indexOf(key);
      if (breakpointIndex !== -1) {
        const mediaQuery = enhancedDesignTokens.mediaQueries[key as keyof typeof enhancedDesignTokens.mediaQueries];
        acc[mediaQuery] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);
  },
  
  // Get color with opacity
  colorWithOpacity: (color: string, opacity: number) => {
    // Convert hex to rgba
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // Handle rgba
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\((.+?),\s*[\d.]+\)/, `rgba($1, ${opacity})`);
    }
    // Handle rgb
    if (color.startsWith('rgb')) {
      return color.replace(/rgb\((.+?)\)/, `rgba($1, ${opacity})`);
    }
    return color;
  },
  
  // Get font stack as CSS string
  fontStack: (fontType: 'sans' | 'serif' | 'mono') => {
    return enhancedDesignTokens.typography.fontFamily[fontType].join(', ');
  },
  
  // Create fluid typography that scales between min and max viewport widths
  fluidTypography: (
    minFontSize: number,
    maxFontSize: number,
    minViewportWidth: number = 320,
    maxViewportWidth: number = 1280
  ) => {
    const fontSizeRange = maxFontSize - minFontSize;
    const viewportRange = maxViewportWidth - minViewportWidth;
    const slope = fontSizeRange / viewportRange;
    const yAxisIntersection = -minViewportWidth * slope + minFontSize;
    
    return {
      fontSize: `clamp(${minFontSize}px, ${yAxisIntersection.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw, ${maxFontSize}px)`,
    };
  },
  
  // Create spacing that scales with viewport
  fluidSpacing: (
    minSpace: number,
    maxSpace: number,
    minViewportWidth: number = 320,
    maxViewportWidth: number = 1280
  ) => {
    const spaceRange = maxSpace - minSpace;
    const viewportRange = maxViewportWidth - minViewportWidth;
    const slope = spaceRange / viewportRange;
    const yAxisIntersection = -minViewportWidth * slope + minSpace;
    
    return `clamp(${minSpace}px, ${yAxisIntersection.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw, ${maxSpace}px)`;
  },
  
  // Get color for specific educational subject
  getSubjectColor: (subject: 'math' | 'science' | 'language' | 'humanities' | 'arts', variant: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT') => {
    return enhancedDesignTokens.colors.education[subject][variant];
  },
  
  // Get color for specific age group
  getAgeGroupColor: (ageGroup: 'nursery' | 'primary' | 'secondary', variant: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT') => {
    return enhancedDesignTokens.colors.ageGroup[ageGroup][variant];
  },
  
  // Get accessible text color based on background color
  getAccessibleTextColor: (backgroundColor: string) => {
    // Convert hex to rgb
    let r, g, b;
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.slice(1);
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (backgroundColor.startsWith('rgb')) {
      const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return enhancedDesignTokens.colors.neutral[900]; // Default to dark text
      }
    } else {
      return enhancedDesignTokens.colors.neutral[900]; // Default to dark text
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark backgrounds, black text for light backgrounds
    return luminance > 0.5 ? enhancedDesignTokens.colors.neutral[900] : enhancedDesignTokens.colors.neutral[50];
  },
  
  // Get animation preset
  getAnimation: (preset: keyof typeof enhancedDesignTokens.animation.presets) => {
    return enhancedDesignTokens.animation.presets[preset];
  },
  
  // Get shadow with custom color
  getShadowWithColor: (shadow: keyof typeof enhancedDesignTokens.shadows, color: string, opacity: number = 0.2) => {
    const rgbaColor = this.colorWithOpacity(color, opacity);
    return enhancedDesignTokens.shadows[shadow].replace(/rgba\([^)]+\)/g, rgbaColor);
  },
};

export default enhancedTheme;
