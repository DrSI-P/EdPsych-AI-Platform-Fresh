/**
 * Enhanced Theme Provider
 * Exports theme provider and hooks for use throughout the application
 */

export {
  EnhancedThemeProvider as ThemeProvider,
  useEnhancedTheme as useTheme,
  Theme,
  AgeGroup,
  cn
} from '../enhanced-theme-provider';

// Also export the original names for backward compatibility
export {
  EnhancedThemeProvider,
  useEnhancedTheme
} from '../enhanced-theme-provider';