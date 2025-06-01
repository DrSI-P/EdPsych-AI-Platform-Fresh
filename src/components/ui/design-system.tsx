'use client';

import React from 'react';

// Define spacing scale
export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Define typography scale
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Colour Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Colour Emoji")',
    serif: 'var(--font-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
  },
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
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Define consistent section spacing
export const sectionSpacing = {
  sm: 'py-4 md:py-6',
  md: 'py-6 md:py-8 lg:py-10',
  lg: 'py-8 md:py-12 lg:py-16',
  xl: 'py-12 md:py-16 lg:py-20',
};

// Define consistent container widths
export const containerWidths = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

// Define consistent card spacing
export const cardSpacing = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  xl: 'p-6',
};

// Define consistent heading styles
export const headingStyles = {
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
  h2: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
  h3: 'text-xl md:text-2xl lg:text-3xl font-semibold',
  h4: 'text-lg md:text-xl font-semibold',
  h5: 'text-base md:text-lg font-medium',
  h6: 'text-sm md:text-base font-medium',
};

// Define consistent text styles
export const textStyles = {
  lead: 'text-lg md:text-xl text-grey-600 leading-relaxed',
  body: 'text-base text-grey-700 leading-normal',
  small: 'text-sm text-grey-500 leading-normal',
  tiny: 'text-xs text-grey-400 leading-tight',
};

// Define consistent button sizes
export const buttonSizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
  xl: 'px-6 py-3 text-xl',
};

// Define consistent form element sizes
export const formElementSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-5 text-lg',
};

// Define consistent border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Define consistent shadow styles
export const shadowStyles = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-md',
  xl: 'shadow-lg',
  '2xl': 'shadow-xl',
  '3xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
};

// Define consistent transition styles
export const transitionStyles = {
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
};

// Define consistent grid layouts
export const gridLayouts = {
  cards: {
    sm: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    md: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
    lg: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
  },
  features: {
    sm: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
    md: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8',
    lg: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8',
  },
};

// Define consistent flex layouts
export const flexLayouts = {
  centre: 'flex items-centre justify-centre',
  between: 'flex items-centre justify-between',
  start: 'flex items-start justify-start',
  end: 'flex items-end justify-end',
  column: 'flex flex-col',
  columnCenter: 'flex flex-col items-centre',
};

// Define consistent spacing utilities
export const spacingUtilities = {
  section: 'mb-12 md:mb-16 lg:mb-20',
  subsection: 'mb-8 md:mb-10 lg:mb-12',
  paragraph: 'mb-4',
  listItem: 'mb-2',
};

// Define consistent colour palette
export const colorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
};

// Typography component for consistent text styling
interface TypographyProps {
  variant?: keyof typeof textStyles | keyof typeof headingStyles;
  children: React.ReactNode;
  className?: string;
}

export function Typography({ 
  variant = 'body', 
  children, 
  className = '' 
}: TypographyProps) {
  const style = 
    variant in headingStyles 
      ? headingStyles[variant as keyof typeof headingStyles]
      : textStyles[variant as keyof typeof textStyles];
  
  const Element = 
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    variant === 'h5' ? 'h5' :
    variant === 'h6' ? 'h6' :
    variant === 'lead' ? 'p' :
    variant === 'body' ? 'p' :
    variant === 'small' ? 'p' :
    variant === 'tiny' ? 'span' : 'p';
  
  return React.createElement(
    Element,
    { className: `${style} ${className}` },
    children
  );
}

// Container component for consistent width constraints
interface ContainerProps {
  size?: keyof typeof containerWidths;
  className?: string;
  children: React.ReactNode;
}

export function Container({ 
  size = 'lg', 
  className = '', 
  children 
}: ContainerProps) {
  return (
    <div className={`mx-auto px-4 ${containerWidths[size]} ${className}`}>
      {children}
    </div>
  );
}

// Section component for consistent vertical spacing
interface SectionProps {
  size?: keyof typeof sectionSpacing;
  className?: string;
  children: React.ReactNode;
}

export function Section({ 
  size = 'md', 
  className = '', 
  children 
}: SectionProps) {
  return (
    <section className={`${sectionSpacing[size]} ${className}`}>
      {children}
    </section>
  );
}

// Grid component for consistent grid layouts
interface GridProps {
  variant?: keyof typeof gridLayouts;
  size?: keyof typeof gridLayouts.cards;
  className?: string;
  children: React.ReactNode;
}

export function Grid({ 
  variant = 'cards', 
  size = 'md', 
  className = '', 
  children 
}: GridProps) {
  return (
    <div className={`${gridLayouts[variant][size]} ${className}`}>
      {children}
    </div>
  );
}

// Flex component for consistent flex layouts
interface FlexProps {
  variant?: keyof typeof flexLayouts;
  className?: string;
  children: React.ReactNode;
}

export function Flex({ 
  variant = 'centre', 
  className = '', 
  children 
}: FlexProps) {
  return (
    <div className={`${flexLayouts[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Spacer component for consistent vertical spacing
interface SpacerProps {
  size?: keyof typeof spacing;
  className?: string;
}

export function Spacer({ 
  size = '4', 
  className = '' 
}: SpacerProps) {
  return (
    <div className={`h-[${spacing[size as keyof typeof spacing]}] ${className}`} />
  );
}
