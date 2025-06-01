/**
 * Enhanced Theme Provider
 * Exports theme provider and hooks for use throughout the application
 */

import { EnhancedThemeProvider, useEnhancedTheme, Theme, AgeGroup, cn } from '../enhanced-theme-provider';

// Re-export with the expected names
export { EnhancedThemeProvider as ThemeProvider, cn };
export type { Theme, AgeGroup };

// Export the hook with both names for compatibility
export const useTheme = useEnhancedTheme;
export { useEnhancedTheme };