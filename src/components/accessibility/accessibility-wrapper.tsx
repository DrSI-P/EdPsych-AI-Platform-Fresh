'use client';

import React, { ReactNode } from 'react';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import { useTheme } from '@/components/ui/theme-provider';

interface AccessibilityWrapperProps {
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * AccessibilityWrapper Component
 * 
 * A wrapper component that provides accessibility features to its children
 * and displays the AccessibilityControls panel for user adjustments.
 * 
 * This component ensures that accessibility settings are applied consistently
 * across the application and provides a unified interface for users to
 * adjust their accessibility preferences.
 */
const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  position = 'bottom-right'
}) => {
  const { 
    theme, 
    fontSize, 
    isReducedMotion,
    isDyslexicFont
  } = useTheme();
  
  // Apply accessibility classes to the wrapper
  const accessibilityClasses = [
    isReducedMotion ? 'reduce-motion' : '',
    isDyslexicFont ? 'dyslexic-font' : '',
  ].filter(Boolean).join(' ');
  
  // Apply font size as a style
  const accessibilityStyles = {
    fontSize: `${fontSize}px`,
  };
  
  return (
    <div className={accessibilityClasses} style={accessibilityStyles}>
      {children}
      <AccessibilityControls position={position} />
    </div>
  );
};

export default AccessibilityWrapper;
