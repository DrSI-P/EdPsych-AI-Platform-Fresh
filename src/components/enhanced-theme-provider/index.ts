/**
 * Enhanced Theme Provider
 * Exports theme provider and hooks for use throughout the application
 */

// Direct re-export of the theme provider from the parent directory
import { EnhancedThemeProvider, useEnhancedTheme, Theme, AgeGroup, cn } from '../enhanced-theme-provider.tsx';

// Export with the expected names
export const ThemeProvider = EnhancedThemeProvider;
export const useTheme = useEnhancedTheme;
export type { Theme, AgeGroup };
export { cn };

// Also export the original names for backward compatibility
export { EnhancedThemeProvider, useEnhancedTheme };