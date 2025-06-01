'use client';

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * ResponsiveContainer component
 * 
 * A wrapper component that provides responsive behavior based on screen size
 * and helps implement mobile-first design patterns.
 */
export function ResponsiveContainer({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  mobileOnly,
  tabletOnly,
  desktopOnly,
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  // If component should only render on specific device types
  if (mobileOnly && !isMobile) return null;
  if (tabletOnly && !isTablet) return null;
  if (desktopOnly && !isDesktop) return null;

  // Determine which className to apply based on screen size
  let responsiveClassName = className;
  if (isMobile && mobileClassName) {
    responsiveClassName = `${className} ${mobileClassName}`.trim();
  } else if (isTablet && tabletClassName) {
    responsiveClassName = `${className} ${tabletClassName}`.trim();
  } else if (isDesktop && desktopClassName) {
    responsiveClassName = `${className} ${desktopClassName}`.trim();
  }

  return (
    <div className={responsiveClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * ResponsiveGrid component
 * 
 * A responsive grid layout that adapts to different screen sizes.
 */
export function ResponsiveGrid({
  children,
  className = '',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  gap = {
    mobile: 4,
    tablet: 6,
    desktop: 8
  },
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  // Determine columns and gap based on screen size
  const activeColumns = isMobile ? columns.mobile : isTablet ? columns.tablet : columns.desktop;
  const activeGap = isMobile ? gap.mobile : isTablet ? gap.tablet : gap.desktop;

  const gridClassName = `grid grid-cols-${activeColumns} gap-${activeGap} ${className}`.trim();

  return (
    <div className={gridClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * ResponsiveText component
 * 
 * A text component that adjusts size and styling based on screen size.
 */
export function ResponsiveText({
  children,
  className = '',
  variant = 'body',
  mobileVariant,
  tabletVariant,
  desktopVariant,
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  // Determine which variant to use based on screen size
  const activeVariant = isMobile && mobileVariant ? mobileVariant : 
                        isTablet && tabletVariant ? tabletVariant : 
                        desktopVariant || variant;

  // Map variant to appropriate text styles
  const variantStyles = {
    h1: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h2: 'text-2xl md:text-3xl lg:text-4xl font-bold',
    h3: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    h4: 'text-lg md:text-xl font-semibold',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs'
  };

  const textClassName = `${variantStyles[activeVariant] || variantStyles.body} ${className}`.trim();

  return (
    <div className={textClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * ResponsiveImage component
 * 
 * An image component that adapts to different screen sizes and
 * implements responsive loading strategies.
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  mobileSrc,
  tabletSrc,
  desktopSrc,
  width,
  height,
  priority = false,
  loading = 'lazy',
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  // Determine which image source to use based on screen size
  const activeSrc = isMobile && mobileSrc ? mobileSrc : 
                    isTablet && tabletSrc ? tabletSrc : 
                    desktopSrc || src;

  // Default image loading strategy
  const imageLoading = priority ? 'eager' : loading;

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={imageLoading}
      {...props}
    />
  );
}

/**
 * ResponsiveLayout component
 * 
 * A layout component that changes structure based on screen size.
 */
export function ResponsiveLayout({
  children,
  className = '',
  layout = {
    mobile: 'stack',
    tablet: 'split',
    desktop: 'split'
  },
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  // Determine layout based on screen size
  const activeLayout = isMobile ? layout.mobile : isTablet ? layout.tablet : layout.desktop;

  // Map layout to appropriate styles
  const layoutStyles = {
    stack: 'flex flex-col',
    split: 'flex flex-row',
    grid: 'grid grid-cols-2'
  };

  const layoutClassName = `${layoutStyles[activeLayout] || layoutStyles.stack} ${className}`.trim();

  return (
    <div className={layoutClassName} {...props}>
      {children}
    </div>
  );
}
