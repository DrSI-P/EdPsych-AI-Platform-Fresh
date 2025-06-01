'use client';

import React from 'react';
import { cn } from '@/components/enhanced-theme-provider';

// Define typography variants
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextVariant = 'lead' | 'body' | 'small' | 'tiny' | 'label';
type TypographyVariant = HeadingLevel | TextVariant;

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'muted';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * Enhanced Typography Component
 * 
 * A comprehensive typography component that implements the brand style guide
 * with consistent text styling, accessibility features, and responsive design.
 */
export function Typography({
  variant = 'body',
  children,
  className = '',
  color = 'default',
  align = 'left',
  weight = 'normal',
  transform = 'none',
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) {
  // Map variant to appropriate HTML element
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
    variant === 'tiny' ? 'span' :
    variant === 'label' ? 'label' : 'p';
  
  // Define base styles for each variant
  const variantStyles = {
    h1: 'text-4xl font-semibold leading-tight tracking-tight',
    h2: 'text-3xl font-semibold leading-tight tracking-tight',
    h3: 'text-2xl font-semibold leading-snug',
    h4: 'text-xl font-semibold leading-snug',
    h5: 'text-lg font-semibold leading-snug',
    h6: 'text-base font-semibold leading-normal',
    lead: 'text-xl leading-relaxed',
    body: 'text-base leading-normal',
    small: 'text-sm leading-normal',
    tiny: 'text-xs leading-normal',
    label: 'text-sm font-medium leading-none',
  };
  
  // Define color styles
  const colorStyles = {
    default: 'text-text-primary',
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-text-secondary',
  };
  
  // Define alignment styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  // Define font weight styles
  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  // Define text transform styles
  const transformStyles = {
    none: 'normal-case',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    variantStyles[variant as keyof typeof variantStyles],
    colorStyles[color],
    alignStyles[align],
    weightStyles[weight],
    transformStyles[transform],
    className
  );
  
  return React.createElement(
    Element,
    {
      className: combinedStyles,
      ...props
    },
    children
  );
}

/**
 * Container Component
 * 
 * A responsive container component that implements the brand style guide
 * with consistent width constraints and spacing.
 */
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  as?: React.ElementType;
  centered?: boolean;
  padding?: boolean;
}

export function Container({
  children,
  size = 'lg',
  className = '',
  as: Component = 'div',
  centered = false,
  padding = true,
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement>) {
  // Define container width styles
  const sizeStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    sizeStyles[size],
    padding ? 'px-4 sm:px-6 md:px-8' : '',
    centered ? 'mx-auto' : '',
    className
  );
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  );
}

/**
 * Section Component
 * 
 * A component for consistent vertical spacing and section structure
 * that implements the brand style guide.
 */
interface SectionProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export function Section({
  children,
  size = 'md',
  className = '',
  as: Component = 'section',
  id,
  ...props
}: SectionProps & React.HTMLAttributes<HTMLElement>) {
  // Define section spacing styles
  const sizeStyles = {
    sm: 'py-4 md:py-6',
    md: 'py-8 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-24',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    sizeStyles[size],
    className
  );
  
  return (
    <Component id={id} className={combinedStyles} {...props}>
      {children}
    </Component>
  );
}

/**
 * Card Component
 * 
 * A versatile card component that implements the brand style guide
 * with consistent styling, hover states, and accessibility features.
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'filled' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  as?: React.ElementType;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  rounded = 'md',
  as: Component = 'div',
  ...props
}: CardProps & React.HTMLAttributes<HTMLElement>) {
  // Define variant styles
  const variantStyles = {
    default: 'bg-background border border-border',
    outline: 'border border-border bg-transparent',
    filled: 'bg-primary/5 border border-primary/10',
    interactive: 'bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200',
  };
  
  // Define padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  // Define shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Define rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    variantStyles[variant],
    paddingStyles[padding],
    shadowStyles[shadow],
    roundedStyles[rounded],
    className
  );
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  );
}

/**
 * Grid Component
 * 
 * A responsive grid component that implements the brand style guide
 * with consistent spacing and layout options.
 */
interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

export function Grid({
  children,
  className = '',
  cols = 3,
  gap = 'md',
  as: Component = 'div',
  ...props
}: GridProps & React.HTMLAttributes<HTMLElement>) {
  // Define columns styles
  const colsStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  // Define gap styles
  const gapStyles = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    'grid',
    colsStyles[cols],
    gapStyles[gap],
    className
  );
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  );
}

/**
 * Flex Component
 * 
 * A flexible layout component that implements the brand style guide
 * with consistent alignment and spacing options.
 */
interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

export function Flex({
  children,
  className = '',
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'none',
  as: Component = 'div',
  ...props
}: FlexProps & React.HTMLAttributes<HTMLElement>) {
  // Define direction styles
  const directionStyles = {
    row: 'flex-row',
    col: 'flex-col',
  };
  
  // Define align styles
  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };
  
  // Define justify styles
  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  // Define gap styles
  const gapStyles = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    'flex',
    directionStyles[direction],
    alignStyles[align],
    justifyStyles[justify],
    wrap ? 'flex-wrap' : 'flex-nowrap',
    gapStyles[gap],
    className
  );
  
  return (
    <Component className={combinedStyles} {...props}>
      {children}
    </Component>
  );
}

/**
 * Spacer Component
 * 
 * A utility component for adding consistent vertical spacing
 * that implements the brand style guide.
 */
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Spacer({
  size = 'md',
  className = '',
  ...props
}: SpacerProps & React.HTMLAttributes<HTMLDivElement>) {
  // Define size styles
  const sizeStyles = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-24',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    sizeStyles[size],
    className
  );
  
  return <div className={combinedStyles} {...props} />;
}
