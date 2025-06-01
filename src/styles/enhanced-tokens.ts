/**
 * Enhanced Color System for EdPsych-AI-Education-Platform
 * 
 * This file defines an enhanced color system with improved accessibility,
 * contrast ratios, and semantic meaning for the platform's visual design.
 */

// Primary palette - educational psychology inspired with improved contrast
export const colors = {
  // Primary palette - educational psychology inspired with improved contrast
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Primary brand color
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Secondary palette - warm, engaging colors with improved contrast
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },
  
  // Accent palette - for highlights and calls to action with improved contrast
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Neutral palette - for text, backgrounds, and UI elements with improved contrast
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Semantic colors with improved contrast
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fed7aa',
    DEFAULT: '#f97316',
    dark: '#c2410c',
  },
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#bae6fd',
    DEFAULT: '#0ea5e9',
    dark: '#0369a1',
  },
  
  // Educational theme colors - new palette for subject areas
  education: {
    math: {
      light: '#93c5fd',
      DEFAULT: '#3b82f6',
      dark: '#1d4ed8',
    },
    science: {
      light: '#a5f3fc',
      DEFAULT: '#06b6d4',
      dark: '#0e7490',
    },
    language: {
      light: '#fbcfe8',
      DEFAULT: '#ec4899',
      dark: '#be185d',
    },
    humanities: {
      light: '#fde68a',
      DEFAULT: '#f59e0b',
      dark: '#b45309',
    },
    arts: {
      light: '#c4b5fd',
      DEFAULT: '#8b5cf6',
      dark: '#6d28d9',
    },
  },
  
  // Age-appropriate colors for different educational levels
  ageGroup: {
    nursery: {
      light: '#fecdd3',
      DEFAULT: '#f43f5e',
      dark: '#be123c',
    },
    primary: {
      light: '#a5b4fc',
      DEFAULT: '#6366f1',
      dark: '#4338ca',
    },
    secondary: {
      light: '#a7f3d0',
      DEFAULT: '#10b981',
      dark: '#047857',
    },
  },
  
  // Special purpose colors with improved contrast
  background: {
    light: '#ffffff',
    DEFAULT: '#f8fafc',
    dark: '#0f172a',
  },
  surface: {
    light: '#ffffff',
    DEFAULT: '#ffffff',
    dark: '#1e293b',
  },
  border: {
    light: '#e2e8f0',
    DEFAULT: '#cbd5e1',
    dark: '#334155',
  },
};

// Enhanced typography system with improved readability
export const typography = {
  // Font families with improved accessibility
  fontFamily: {
    // Dyslexia-friendly sans-serif for body text
    sans: [
      'Lexend', // Dyslexia-friendly
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    // Clean, professional serif for headings
    serif: [
      'Literata', // Educational, professional
      'Georgia',
      'Cambria',
      '"Times New Roman"',
      'Times',
      'serif',
    ],
    // Monospace for code examples with improved readability
    mono: [
      'JetBrains Mono',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace',
    ],
  },
  
  // Font sizes with improved responsive scaling
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.16' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
    '7xl': ['4.5rem', { lineHeight: '1.05' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  
  // Font weights with improved accessibility
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights with improved readability
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    // New line heights for improved readability
    dyslexic: '1.8',
    heading: '1.2',
  },
  
  // Letter spacing with improved readability
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    // New letter spacing for improved readability
    dyslexic: '0.05em',
  },
};

// Enhanced spacing system based on 4px grid
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Enhanced border radius with improved consistency
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
};

// Enhanced shadows with improved depth perception
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  // New shadows for improved depth perception
  'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.03)',
  'soft-md': '0 4px 8px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  'soft-lg': '0 12px 20px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
  'elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'elevation-2': '0 3px 6px -1px rgba(0, 0, 0, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
  'elevation-3': '0 6px 12px -2px rgba(0, 0, 0, 0.1), 0 3px 6px -2px rgba(0, 0, 0, 0.06)',
  'elevation-4': '0 12px 24px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -4px rgba(0, 0, 0, 0.08)',
  'elevation-5': '0 20px 32px -6px rgba(0, 0, 0, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.1)',
};

// Enhanced animation timing with improved performance
export const animation = {
  duration: {
    fastest: '100ms',
    faster: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '400ms',
    slower: '500ms',
    slowest: '700ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // New easing functions for improved animations
    'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'soft-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
    'emphasis': 'cubic-bezier(0.2, 0.6, 0.4, 1)',
  },
  // New animation presets
  presets: {
    fadeIn: 'fadeIn var(--duration-normal) var(--ease-out)',
    fadeInSlow: 'fadeIn var(--duration-slow) var(--ease-out)',
    slideUp: 'slideUp var(--duration-normal) var(--ease-out)',
    slideDown: 'slideDown var(--duration-normal) var(--ease-out)',
    slideLeft: 'slideLeft var(--duration-normal) var(--ease-out)',
    slideRight: 'slideRight var(--duration-normal) var(--ease-out)',
    scale: 'scale var(--duration-normal) var(--ease-out)',
    scaleSoft: 'scale var(--duration-normal) var(--ease-soft-out)',
    bounce: 'scale var(--duration-normal) var(--ease-bounce-out)',
    spin: 'spin var(--duration-normal) linear infinite',
    pulse: 'pulse 2s var(--ease-in-out) infinite',
  },
};

// Enhanced z-index scale with improved organization
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  // New z-index values for improved organization
  'below': '-10',
  'base': '1',
  'above': '10',
  'navigation': '100',
  'overlay': '200',
  'dialog': '300',
  'notification': '400',
  'max': '9999',
};

// Enhanced breakpoints for responsive design
export const breakpoints = {
  xs: '320px',   // Small mobile
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
};

// Enhanced media queries with improved accessibility
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: more)',
  lowContrast: '@media (prefers-contrast: less)',
  hover: '@media (hover: hover)',
  noHover: '@media (hover: none)',
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
};

// Export all enhanced tokens as a unified design system
export const enhancedDesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  zIndex,
  breakpoints,
  mediaQueries,
};

export default enhancedDesignTokens;
