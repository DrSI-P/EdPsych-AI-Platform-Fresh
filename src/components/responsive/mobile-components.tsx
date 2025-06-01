'use client';

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

/**
 * MobileNavigation component
 * 
 * A responsive navigation component that adapts to mobile, tablet, and desktop views.
 * Provides a hamburger menu on mobile and expands to full navigation on larger screens.
 */
export function MobileNavigation({ children, className = '', ...props }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Close menu when switching from mobile to desktop
  React.useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);
  
  // Handle toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle close menu
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <nav className={`relative ${className}`} {...props}>
      {isMobile ? (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg z-50 py-2">
              {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                  onClick: closeMenu,
                  className: `block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${child.props.className || ''}`
                });
              })}
            </div>
          )}
        </>
      ) : (
        <div className="hidden md:flex items-center space-x-4">
          {children}
        </div>
      )}
    </nav>
  );
}

/**
 * TouchFriendlyButton component
 * 
 * A button component optimized for touch interactions on mobile devices.
 * Provides larger touch targets and appropriate feedback.
 */
export function TouchFriendlyButton({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Adjust size for mobile
  const mobileSize = size === 'sm' ? 'default' : size;
  const activeSize = isMobile ? mobileSize : size;
  
  // Add touch-friendly classes for mobile
  const touchClasses = isMobile ? 'min-h-[44px] min-w-[44px]' : '';
  
  return (
    <Button
      size={activeSize}
      className={`${touchClasses} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * CollapsiblePanel component
 * 
 * A panel that collapses on mobile devices to save space,
 * but expands on larger screens.
 */
export function CollapsiblePanel({
  title,
  children,
  className = '',
  defaultExpanded = false,
  ...props
}) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Auto-expand on desktop
  React.useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true);
    } else if (!defaultExpanded) {
      setIsExpanded(false);
    }
  }, [isMobile, defaultExpanded]);
  
  // Toggle panel expansion
  const togglePanel = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`} {...props}>
      <div 
        className={`bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center ${isMobile ? 'cursor-pointer' : ''}`}
        onClick={togglePanel}
      >
        <h3 className="font-medium">{title}</h3>
        {isMobile && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <X size={16} /> : <Menu size={16} />}
          </Button>
        )}
      </div>
      
      {(isExpanded || !isMobile) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * AdaptiveLayout component
 * 
 * A layout component that changes its structure based on screen size.
 * Supports different layouts for mobile, tablet, and desktop.
 */
export function AdaptiveLayout({
  children,
  className = '',
  mobileLayout = 'stack',
  tabletLayout = 'grid',
  desktopLayout = 'grid',
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  // Determine active layout
  const activeLayout = isMobile ? mobileLayout : 
                      isTablet ? tabletLayout : 
                      desktopLayout;
  
  // Map layouts to classes
  const layoutClasses = {
    stack: 'flex flex-col space-y-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    sidebar: 'grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4',
    split: 'grid grid-cols-1 md:grid-cols-2 gap-4'
  };
  
  const layoutClass = layoutClasses[activeLayout] || layoutClasses.stack;
  
  return (
    <div className={`${layoutClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * BottomNavigation component
 * 
 * A mobile-friendly bottom navigation bar that appears on small screens
 * and transforms to a different navigation style on larger screens.
 */
export function BottomNavigation({
  items,
  className = '',
  activeIndex = 0,
  onItemClick,
  ...props
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!isMobile) {
    return null;
  }
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-50 ${className}`}
      {...props}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            index === activeIndex ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => onItemClick && onItemClick(index)}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
