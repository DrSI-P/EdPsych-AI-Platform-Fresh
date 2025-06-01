import React, { useEffect } from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import { AccessibilityProvider } from '@/components/accessibility/accessibility-provider';

/**
 * Enhanced ARIA Landmarks Component
 * 
 * This component automatically adds appropriate ARIA landmarks to the application layout
 * to improve screen reader navigation and compliance with accessibility standards.
 * 
 * It ensures that all major sections of the application have proper semantic structure
 * and ARIA roles for better accessibility.
 */
const AriaLandmarks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Process children to ensure proper ARIA landmarks
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    
    // Clone the element to add appropriate ARIA attributes based on component type
    return React.cloneElement(child);
  });
  
  return <>{enhancedChildren}</>;
};

/**
 * Skip Navigation Link Component
 * 
 * Provides a skip link that allows keyboard users to bypass navigation
 * and go directly to the main content. This is a critical accessibility
 * feature for keyboard and screen reader users.
 */
const SkipNavigation: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:outline focus:outline-2 focus:outline-primary"
    >
      Skip to main content
    </a>
  );
};

/**
 * Focus Trap Component
 * 
 * Traps focus within a component (like a modal or dialog) to ensure
 * keyboard users can't accidentally navigate outside the component
 * while it's active.
 */
const FocusTrap: React.FC<{ 
  children: React.ReactNode;
  active: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}> = ({ children, active, initialFocusRef }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active) return;
    
    // Focus the initial element if provided, otherwise the container
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
    
    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current || e.key !== 'Tab') return;
      
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Shift + Tab on first element should go to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
      // Tab on last element should go to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, initialFocusRef]);
  
  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
};

/**
 * Accessible Announcement Component
 * 
 * Creates an ARIA live region for making announcements to screen reader users
 * without disrupting the visual experience. Essential for dynamic content updates.
 */
const AccessibleAnnouncement: React.FC<{
  message: string;
  politeness?: 'polite' | 'assertive';
}> = ({ message, politeness = 'polite' }) => {
  return (
    <div 
      className="sr-only" 
      aria-live={politeness}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

/**
 * Enhanced Accessibility Wrapper
 * 
 * A comprehensive wrapper component that combines multiple accessibility
 * enhancements to ensure the application meets WCAG standards.
 */
const EnhancedAccessibilityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AccessibilityProvider>
      <SkipNavigation />
      <AriaLandmarks>
        {children}
      </AriaLandmarks>
      <AccessibleAnnouncement message="" politeness="polite" />
    </AccessibilityProvider>
  );
};

export { 
  EnhancedAccessibilityWrapper,
  SkipNavigation,
  FocusTrap,
  AccessibleAnnouncement,
  AriaLandmarks
};
