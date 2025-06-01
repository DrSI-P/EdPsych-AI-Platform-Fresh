'use client';

import React, { useEffect, useState } from 'react';
import { deviceDetection } from '@/lib/mobile/mobileService';
import { DeviceType, MobileViewMode } from '@/lib/mobile/mobileTypes';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveLayout Component
 * 
 * A wrapper component that provides responsive layout capabilities for mobile devices.
 * It automatically detects device type and orientation, and applies appropriate styles.
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children,
  className = ''
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.DESKTOP);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [viewMode, setViewMode] = useState<MobileViewMode>(MobileViewMode.STANDARD);
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Get device info
    const deviceInfo = deviceDetection.getDeviceInfo();
    if (deviceInfo) {
      setDeviceType(deviceInfo.type);
      setOrientation(deviceInfo.orientation);
    }
    
    // Listen for orientation changes
    const handleOrientationChange = () => {
      const updatedDeviceInfo = deviceDetection.getDeviceInfo();
      if (updatedDeviceInfo) {
        setOrientation(updatedDeviceInfo.orientation);
      }
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    }
  }, []);
  
  // Generate class names based on device type and orientation
  const deviceClass = `device-${deviceType.toLowerCase()}`;
  const orientationClass = `orientation-${orientation}`;
  const viewModeClass = `view-mode-${viewMode.toLowerCase()}`;
  
  return (
    <div className={`responsive-layout ${deviceClass} ${orientationClass} ${viewModeClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * MobileContainer Component
 * 
 * A container component specifically designed for mobile views.
 * It provides appropriate padding, spacing, and touch-friendly UI elements.
 */
export const MobileContainer: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Check if device is mobile
    setIsMobile(deviceDetection.isMobileDevice());
  }, []);
  
  // If not on a mobile device, render with standard container
  if (!isMobile) {
    return <div className={`standard-container ${className}`}>{children}</div>;
  }
  
  return (
    <div className={`mobile-container touch-optimised ${className}`}>
      {children}
    </div>
  );
}

/**
 * TabletLayout Component
 * 
 * A layout component specifically designed for tablet devices.
 * It provides a hybrid experience between mobile and desktop.
 */
export const TabletLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = ''
}) => {
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Check if device is tablet
    setIsTablet(deviceDetection.isTablet());
    
    // Get orientation
    const deviceInfo = deviceDetection.getDeviceInfo();
    if (deviceInfo) {
      setOrientation(deviceInfo.orientation);
    }
    
    // Listen for orientation changes
    const handleOrientationChange = () => {
      const updatedDeviceInfo = deviceDetection.getDeviceInfo();
      if (updatedDeviceInfo) {
        setOrientation(updatedDeviceInfo.orientation);
      }
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    }
  }, []);
  
  // If not on a tablet, render with standard container
  if (!isTablet) {
    return <div className={`standard-container ${className}`}>{children}</div>;
  }
  
  const orientationClass = `tablet-${orientation}`;
  
  return (
    <div className={`tablet-container touch-optimised ${orientationClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * TouchOptimizedButton Component
 * 
 * A button component optimised for touch interactions on mobile devices.
 * It provides larger touch targets and appropriate feedback.
 */
interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left'
}) => {
  const [isTouching, setIsTouching] = useState(false);
  
  // Handle touch start
  const handleTouchStart = () => {
    if (!disabled) {
      setIsTouching(true);
    }
  }
  
  // Handle touch end
  const handleTouchEnd = () => {
    setIsTouching(false);
  }
  
  // Generate class names
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const touchingClass = isTouching ? 'touching' : '';
  const disabledClass = disabled ? 'disabled' : '';
  
  return (
    <button
      className={`touch-optimised-button ${variantClass} ${sizeClass} ${widthClass} ${touchingClass} ${disabledClass} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {icon && iconPosition === 'left' && <span className="button-icon left">{icon}</span>}
      <span className="button-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="button-icon right">{icon}</span>}
    </button>
  );
}

/**
 * SwipeableContainer Component
 * 
 * A container that supports swipe gestures for mobile interactions.
 */
interface SwipeableContainerProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for a swipe to be registered
}

export const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  className = '',
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }
  
  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Determine if the swipe was horizontal or vertical
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontalSwipe) {
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      if (deltaY > threshold && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < -threshold && onSwipeUp) {
        onSwipeUp();
      }
    }
    
    setTouchStart(null);
  }
  
  return (
    <div
      className={`swipeable-container ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

/**
 * MobileNavigation Component
 * 
 * A navigation component optimised for mobile devices.
 * It provides a bottom navigation bar for easy thumb access.
 */
interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

interface MobileNavigationProps {
  items: any[];
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Check if device is mobile
    setIsMobile(deviceDetection.isMobileDevice());
  }, []);
  
  // If not on a mobile device, don't render
  if (!isMobile) {
    return null;
  }
  
  return (
    <nav className={`mobile-navigation ${className}`}>
      <ul className="nav-items">
        {items.map((item, index) => (
          <li key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
            <a href={item.href} className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * MobileHeader Component
 * 
 * A header component optimised for mobile devices.
 * It provides a fixed header with appropriate navigation controls.
 */
interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onBack,
  actions,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Check if device is mobile
    setIsMobile(deviceDetection.isMobileDevice());
  }, []);
  
  // If not on a mobile device, don't render
  if (!isMobile) {
    return null;
  }
  
  return (
    <header className={`mobile-header ${className}`}>
      {onBack && (
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
        </button>
      )}
      <h1 className="header-title">{title}</h1>
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  );
}

/**
 * MobileDrawer Component
 * 
 * A drawer component for mobile devices.
 * It provides a slide-in panel for additional content or navigation.
 */
interface MobileDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  children,
  isOpen,
  onClose,
  position = 'left',
  className = ''
}) => {
  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  }
  
  // Handle drawer click (prevent propagation)
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }
  
  return (
    <div className={`mobile-drawer-container ${isOpen ? 'open' : ''} ${className}`}>
      <div className="drawer-backdrop" onClick={handleBackdropClick} />
      <div 
        className={`drawer-content drawer-${position}`} 
        onClick={handleDrawerClick}
      >
        <button className="drawer-close" onClick={onClose}>
          <span className="close-icon">×</span>
        </button>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileTabView Component
 * 
 * A tab view component optimised for mobile devices.
 * It provides swipeable tabs for easy navigation.
 */
interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface MobileTabViewProps {
  tabs: any[];
  initialTab?: number;
  className?: string;
}

export const MobileTabView: React.FC<MobileTabViewProps> = ({
  tabs,
  initialTab = 0,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Handle swipe left (next tab)
  const handleSwipeLeft = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  }
  
  // Handle swipe right (previous tab)
  const handleSwipeRight = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  }
  
  return (
    <div className={`mobile-tab-view ${className}`}>
      <div className="tab-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <SwipeableContainer
        className="tab-content"
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      >
        {tabs[activeTab].content}
      </SwipeableContainer>
    </div>
  );
}

/**
 * MobileFAB Component
 * 
 * A Floating Action Button component for mobile devices.
 * It provides a prominent action button that floats above the content.
 */
interface MobileFABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  colour?: 'primary' | 'secondary' | 'success' | 'danger';
}

export const MobileFAB: React.FC<MobileFABProps> = ({
  icon,
  onClick,
  label,
  position = 'bottom-right',
  className = '',
  colour = 'primary'
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initialize device detection
    deviceDetection.initialize();
    
    // Check if device is mobile
    setIsMobile(deviceDetection.isMobileDevice());
  }, []);
  
  // If not on a mobile device, don't render
  if (!isMobile) {
    return null;
  }
  
  return (
    <button
      className={`mobile-fab fab-${position} fab-${colour} ${className}`}
      onClick={onClick}
      aria-label={label || 'Action button'}
    >
      <span className="fab-icon">{icon}</span>
      {label && <span className="fab-label">{label}</span>}
    </button>
  );
}

/**
 * MobileList Component
 * 
 * A list component optimised for mobile devices.
 * It provides touch-friendly list items with appropriate spacing and feedback.
 */
interface ListItem {
  id: string;
  primary: string;
  secondary?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}

interface MobileListProps {
  items: any[];
  className?: string;
}

export const MobileList: React.FC<MobileListProps> = ({
  items,
  className = ''
}) => {
  return (
    <ul className={`mobile-list ${className}`}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`list-item ${item.onClick ? 'clickable' : ''}`}
          onClick={item.onClick}
        >
          {item.icon && <div className="item-icon">{item.icon}</div>}
          <div className="item-content">
            <div className="item-primary">{item.primary}</div>
            {item.secondary && <div className="item-secondary">{item.secondary}</div>}
          </div>
          {item.rightElement && <div className="item-right">{item.rightElement}</div>}
        </li>
      ))}
    </ul>
  );
}

/**
 * MobileCard Component
 * 
 * A card component optimised for mobile devices.
 * It provides a touch-friendly card with appropriate spacing and feedback.
 */
interface MobileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={`mobile-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * MobileSearchBar Component
 * 
 * A search bar component optimised for mobile devices.
 * It provides a touch-friendly search input with appropriate feedback.
 */
interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  className = ''
}) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  }
  
  return (
    <form className={`mobile-search-bar ${className}`} onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <button type="submit" className="search-button">
        <span className="search-icon">🔍</span>
      </button>
    </form>
  );
}

/**
 * MobileBottomSheet Component
 * 
 * A bottom sheet component for mobile devices.
 * It provides a slide-up panel for additional content or actions.
 */
interface MobileBottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  snapPoints?: string[]; // CSS height values for snap points
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  snapPoints = ['50%', '100%']
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [sheetHeight, setSheetHeight] = useState<number | null>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  
  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  }
  
  // Handle sheet click (prevent propagation)
  const handleSheetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !sheetRef.current || sheetHeight === null) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - touchStart;
    
    // Prevent scrolling up beyond the highest snap point
    if (diff < 0 && currentSnapPoint === snapPoints.length - 1) return;
    
    // Apply the transform
    sheetRef.current.style.transform = `translateY(${diff}px)`;
  }
  
  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !sheetRef.current || sheetHeight === null) return;
    
    const currentTouch = e.changedTouches[0].clientY;
    const diff = currentTouch - touchStart;
    
    // Determine whether to close, snap to next point, or snap to previous point
    if (diff > sheetHeight / 3) {
      // Close if dragged down significantly
      onClose();
    } else if (diff > 50 && currentSnapPoint > 0) {
      // Snap to previous point if dragged down a bit
      setCurrentSnapPoint(currentSnapPoint - 1);
    } else if (diff < -50 && currentSnapPoint < snapPoints.length - 1) {
      // Snap to next point if dragged up a bit
      setCurrentSnapPoint(currentSnapPoint + 1);
    }
    
    // Reset transform
    sheetRef.current.style.transform = '';
    setTouchStart(null);
  }
  
  // Measure sheet height on mount and when snap point changes
  useEffect(() => {
    if (sheetRef.current) {
      setSheetHeight(sheetRef.current.clientHeight);
    }
  }, [isOpen, currentSnapPoint]);
  
  return (
    <div className={`mobile-bottom-sheet-container ${isOpen ? 'open' : ''} ${className}`}>
      <div className="sheet-backdrop" onClick={handleBackdropClick} />
      <div 
        ref={sheetRef}
        className="sheet-content"
        style={{ height: snapPoints[currentSnapPoint] }}
        onClick={handleSheetClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sheet-handle" />
        <div className="sheet-body">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * MobilePullToRefresh Component
 * 
 * A pull-to-refresh component for mobile devices.
 * It provides a way to refresh content by pulling down.
 */
interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export const MobilePullToRefresh: React.FC<MobilePullToRefreshProps> = ({
  children,
  onRefresh,
  className = ''
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Constants
  const THRESHOLD = 80; // Distance in pixels to trigger refresh
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh when scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  }
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isRefreshing) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - touchStart;
    
    // Only allow pulling down
    if (diff > 0) {
      setIsPulling(true);
      // Apply resistance to make it harder to pull
      const resistance = 0.4;
      setPullDistance(diff * resistance);
      
      // Prevent default scrolling behaviour
      e.preventDefault();
    }
  }
  
  // Handle touch end
  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;
    
    if (pullDistance >= THRESHOLD) {
      // Trigger refresh
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    // Reset state
    setIsPulling(false);
    setPullDistance(0);
    setTouchStart(null);
  }
  
  return (
    <div
      ref={containerRef}
      className={`mobile-pull-to-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="refresh-indicator"
        style={{ 
          transform: `translateY(${isPulling ? pullDistance - 50 : -50}px)`,
          opacity: isPulling ? Math.min(pullDistance / THRESHOLD, 1) : 0
        }}
      >
        {isRefreshing ? (
          <div className="refresh-spinner" />
        ) : (
          <div className="refresh-arrow" style={{ 
            transform: `rotate(${Math.min(pullDistance / THRESHOLD * 180, 180)}deg)`
          }} />
        )}
      </div>
      <div 
        className="content-container"
        style={{ transform: isPulling ? `translateY(${pullDistance}px)` : 'none' }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * MobileGesture Component
 * 
 * A component that detects and responds to mobile gestures.
 * It provides support for tap, double tap, long press, swipe, pinch, and rotate.
 */
interface MobileGestureProps {
  children: React.ReactNode;
  onTap?: (position: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', distance: number) => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  className?: string;
}

export const MobileGesture: React.FC<MobileGestureProps> = ({
  children,
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  onPinch,
  onRotate,
  className = ''
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTap, setLastTap] = useState<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const initialTouchesRef = React.useRef<Touch[]>([]);
  
  // Constants
  const DOUBLE_TAP_DELAY = 300; // ms
  const LONG_PRESS_DELAY = 500; // ms
  const SWIPE_THRESHOLD = 50; // px
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: now
    });
    
    // Store initial touches for pinch/rotate
    if (e.touches.length === 2) {
      initialTouchesRef.current = Array.from(e.touches);
    }
    
    // Set up long press timeout
    if (onLongPress) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      
      longPressTimeoutRef.current = setTimeout(() => {
        if (touchStart) {
          onLongPress({ x: touch.clientX, y: touch.clientY });
        }
      }, LONG_PRESS_DELAY);
    }
  }
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press on move
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    // Handle pinch
    if (onPinch && e.touches.length === 2 && initialTouchesRef.current.length === 2) {
      const initialDistance = getDistance(
        initialTouchesRef.current[0].clientX,
        initialTouchesRef.current[0].clientY,
        initialTouchesRef.current[1].clientX,
        initialTouchesRef.current[1].clientY
      );
      
      const currentDistance = getDistance(
        e.touches[0].clientX,
        e.touches[0].clientY,
        e.touches[1].clientX,
        e.touches[1].clientY
      );
      
      const scale = currentDistance / initialDistance;
      onPinch(scale);
    }
    
    // Handle rotate
    if (onRotate && e.touches.length === 2 && initialTouchesRef.current.length === 2) {
      const initialAngle = getAngle(
        initialTouchesRef.current[0].clientX,
        initialTouchesRef.current[0].clientY,
        initialTouchesRef.current[1].clientX,
        initialTouchesRef.current[1].clientY
      );
      
      const currentAngle = getAngle(
        e.touches[0].clientX,
        e.touches[0].clientY,
        e.touches[1].clientX,
        e.touches[1].clientY
      );
      
      const angle = currentAngle - initialAngle;
      onRotate(angle);
    }
  }
  
  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Cancel long press
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const now = Date.now();
    const deltaTime = now - touchStart.time;
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Handle swipe
    if (onSwipe && (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD)) {
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      
      if (isHorizontalSwipe) {
        onSwipe(deltaX > 0 ? 'right' : 'left', Math.abs(deltaX));
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up', Math.abs(deltaY));
      }
    }
    // Handle tap and double tap
    else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const tapPosition = { x: touch.clientX, y: touch.clientY }
      
      // Check for double tap
      if (onDoubleTap && lastTap && now - lastTap.time < DOUBLE_TAP_DELAY) {
        onDoubleTap(tapPosition);
        setLastTap(null); // Reset last tap
      } else {
        // Single tap
        if (onTap) {
          onTap(tapPosition);
        }
        
        // Store last tap for double tap detection
        setLastTap({
          x: touch.clientX,
          y: touch.clientY,
          time: now
        });
      }
    }
    
    setTouchStart(null);
    initialTouchesRef.current = [];
  }
  
  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  // Calculate angle between two points
  const getAngle = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  }
  
  return (
    <div
      className={`mobile-gesture ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </div>
  );
}

export default ResponsiveLayout;
