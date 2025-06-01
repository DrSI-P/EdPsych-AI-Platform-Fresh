// Mobile optimization utilities for EdPsych-AI-Education-Platform
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for detecting device type and screen size
 * @returns {Object} - Device information
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPortrait: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    touchEnabled: false
  });

  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    setDeviceInfo({
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isPortrait,
      isLandscape: !isPortrait,
      screenWidth: width,
      screenHeight: height,
      touchEnabled: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    });
  }, []);

  useEffect(() => {
    // Initial detection
    updateDeviceInfo();
    
    // Update on resize
    window.addEventListener('resize', updateDeviceInfo);
    
    // Update on orientation change
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, [updateDeviceInfo]);

  return deviceInfo;
};

/**
 * Custom hook for implementing touch gestures
 * @param {Object} options - Gesture options
 * @returns {Object} - Gesture handlers
 */
export const useTouchGestures = (options = {}) => {
  const [touchState, setTouchState] = useState({
    isTouching: false,
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    endX: 0,
    endY: 0,
    swipeDirection: null,
    pinchScale: 1
  });
  
  const defaultOptions = {
    swipeThreshold: 50,
    tapThreshold: 10,
    longPressDelay: 500,
    doubleTapDelay: 300
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const [lastTap, setLastTap] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState(null);
  
  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    setTouchState({
      ...touchState,
      isTouching: true,
      startX,
      startY,
      moveX: startX,
      moveY: startY
    });
    
    // Start long press timer
    const timer = setTimeout(() => {
      if (options.onLongPress) {
        options.onLongPress(e);
      }
    }, mergedOptions.longPressDelay);
    
    setLongPressTimer(timer);
  }, [touchState, options, mergedOptions.longPressDelay]);
  
  const onTouchMove = useCallback((e) => {
    if (!touchState.isTouching) return;
    
    const touch = e.touches[0];
    const moveX = touch.clientX;
    const moveY = touch.clientY;
    
    setTouchState({
      ...touchState,
      moveX,
      moveY
    });
    
    // Cancel long press if moved too much
    const deltaX = Math.abs(moveX - touchState.startX);
    const deltaY = Math.abs(moveY - touchState.startY);
    
    if (deltaX > mergedOptions.tapThreshold || deltaY > mergedOptions.tapThreshold) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Handle pinch gesture
    if (e.touches.length === 2 && options.onPinch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const dist = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const initialDist = Math.hypot(
        touchState.startX - touchState.startX2,
        touchState.startY - touchState.startY2
      );
      
      const scale = dist / initialDist;
      
      setTouchState({
        ...touchState,
        pinchScale: scale
      });
      
      options.onPinch({
        scale,
        centre: {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }
      });
    }
  }, [touchState, options, mergedOptions.tapThreshold, longPressTimer]);
  
  const onTouchEnd = useCallback((e) => {
    if (!touchState.isTouching) return;
    
    const endX = touchState.moveX;
    const endY = touchState.moveY;
    
    const deltaX = endX - touchState.startX;
    const deltaY = endY - touchState.startY;
    
    // Clear long press timer
    clearTimeout(longPressTimer);
    setLongPressTimer(null);
    
    // Detect swipe
    if (Math.abs(deltaX) > mergedOptions.swipeThreshold || Math.abs(deltaY) > mergedOptions.swipeThreshold) {
      let swipeDirection = null;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        swipeDirection = deltaX > 0 ? 'right' : 'left';
      } else {
        swipeDirection = deltaY > 0 ? 'down' : 'up';
      }
      
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY,
        swipeDirection
      });
      
      if (options.onSwipe) {
        options.onSwipe({
          direction: swipeDirection,
          distance: Math.max(Math.abs(deltaX), Math.abs(deltaY))
        });
      }
    } 
    // Detect tap
    else if (Math.abs(deltaX) < mergedOptions.tapThreshold && Math.abs(deltaY) < mergedOptions.tapThreshold) {
      const now = Date.now();
      const timeDiff = now - lastTap;
      
      // Detect double tap
      if (timeDiff < mergedOptions.doubleTapDelay && options.onDoubleTap) {
        options.onDoubleTap(e);
        setLastTap(0); // Reset last tap
      } 
      // Single tap
      else {
        setLastTap(now);
        
        if (options.onTap) {
          options.onTap(e);
        }
      }
      
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY
      });
    }
    // Reset touch state
    else {
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY
      });
    }
  }, [touchState, options, mergedOptions, lastTap, longPressTimer]);
  
  return {
    touchState,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: onTouchEnd
    }
  };
};

/**
 * Custom hook for implementing responsive font sizing
 * @param {number} baseFontSize - Base font size in pixels
 * @param {number} minFontSize - Minimum font size in pixels
 * @param {number} maxFontSize - Maximum font size in pixels
 * @returns {number} - Calculated font size
 */
export const useResponsiveFontSize = (baseFontSize = 16, minFontSize = 14, maxFontSize = 24) => {
  const [fontSize, setFontSize] = useState(baseFontSize);
  
  useEffect(() => {
    const calculateFontSize = () => {
      const width = window.innerWidth;
      const calculatedSize = baseFontSize * (width / 1440); // 1440px is the reference width
      
      const clampedSize = Math.max(minFontSize, Math.min(calculatedSize, maxFontSize));
      setFontSize(clampedSize);
    };
    
    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);
    
    return () => {
      window.removeEventListener('resize', calculateFontSize);
    };
  }, [baseFontSize, minFontSize, maxFontSize]);
  
  return fontSize;
};

/**
 * Custom hook for implementing offline support
 * @returns {Object} - Online status and related functions
 */
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({});
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load offline data from storage
    const loadOfflineData = () => {
      try {
        const storedData = localStorage.getItem('offlineData');
        if (storedData) {
          setOfflineData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    };
    
    loadOfflineData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const saveForOffline = useCallback((key, data) => {
    try {
      const updatedData = { ...offlineData, [key]: data };
      setOfflineData(updatedData);
      localStorage.setItem('offlineData', JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  }, [offlineData]);
  
  const getOfflineData = useCallback((key) => {
    return offlineData[key] || null;
  }, [offlineData]);
  
  const clearOfflineData = useCallback((key) => {
    try {
      const updatedData = { ...offlineData };
      if (key) {
        delete updatedData[key];
      } else {
        // Clear all offline data
        setOfflineData({});
        localStorage.removeItem('offlineData');
        return true;
      }
      
      setOfflineData(updatedData);
      localStorage.setItem('offlineData', JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }, [offlineData]);
  
  return {
    isOnline,
    saveForOffline,
    getOfflineData,
    clearOfflineData
  };
};

/**
 * Custom hook for implementing responsive grid layouts
 * @param {number} baseColumnCount - Base number of columns
 * @returns {Object} - Grid layout information
 */
export const useResponsiveGrid = (baseColumnCount = 12) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  const getColumnCount = useCallback(() => {
    if (isMobile) return Math.min(baseColumnCount, 4);
    if (isTablet) return Math.min(baseColumnCount, 8);
    return baseColumnCount;
  }, [isMobile, isTablet, baseColumnCount]);
  
  const getColumnWidth = useCallback(() => {
    return `${100 / getColumnCount()}%`;
  }, [getColumnCount]);
  
  const getColumnSpan = useCallback((desktopSpan, tabletSpan, mobileSpan) => {
    if (isMobile) return mobileSpan || Math.min(getColumnCount(), desktopSpan);
    if (isTablet) return tabletSpan || Math.min(getColumnCount(), desktopSpan);
    return Math.min(getColumnCount(), desktopSpan);
  }, [isMobile, isTablet, getColumnCount]);
  
  return {
    columnCount: getColumnCount(),
    columnWidth: getColumnWidth(),
    getColumnSpan
  };
};

/**
 * Custom hook for implementing mobile-friendly forms
 * @returns {Object} - Form helpers
 */
export const useMobileFriendlyForms = () => {
  const { isMobile, touchEnabled } = useDeviceDetection();
  
  const getInputSize = useCallback(() => {
    return isMobile ? 'large' : 'medium';
  }, [isMobile]);
  
  const getFontSize = useCallback(() => {
    return isMobile ? '16px' : '14px'; // 16px prevents iOS zoom on focus
  }, [isMobile]);
  
  const getButtonSize = useCallback(() => {
    return isMobile ? 'large' : 'medium';
  }, [isMobile]);
  
  const getSpacing = useCallback(() => {
    return isMobile ? '20px' : '16px';
  }, [isMobile]);
  
  return {
    inputSize: getInputSize(),
    fontSize: getFontSize(),
    buttonSize: getButtonSize(),
    spacing: getSpacing(),
    useTouchUI: touchEnabled
  };
};

/**
 * Custom hook for implementing mobile navigation
 * @returns {Object} - Navigation state and handlers
 */
export const useMobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useDeviceDetection();
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);
  
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  
  useEffect(() => {
    // Close menu when switching to desktop
    if (!isMobile && isMenuOpen) {
      closeMenu();
    }
    
    // Prevent body scroll when menu is open on mobile
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMenuOpen, closeMenu]);
  
  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    isMobileView: isMobile
  };
};

/**
 * Custom hook for implementing mobile-optimised images
 * @param {string} desktopSrc - Desktop image source
 * @param {string} tabletSrc - Tablet image source
 * @param {string} mobileSrc - Mobile image source
 * @returns {string} - Appropriate image source
 */
export const useResponsiveImage = (desktopSrc, tabletSrc, mobileSrc) => {
  const { isMobile, isTablet } = useDeviceDetection();
  
  const getImageSrc = useCallback(() => {
    if (isMobile && mobileSrc) return mobileSrc;
    if (isTablet && tabletSrc) return tabletSrc;
    return desktopSrc;
  }, [isMobile, isTablet, desktopSrc, tabletSrc, mobileSrc]);
  
  return getImageSrc();
};

/**
 * Utility for generating responsive CSS
 * @param {Object} styles - Base styles
 * @param {Object} mobileStyles - Mobile-specific styles
 * @param {Object} tabletStyles - Tablet-specific styles
 * @returns {Object} - Combined styles object
 */
export const createResponsiveStyles = (styles, mobileStyles = {}, tabletStyles = {}) => {
  return {
    ...styles,
    '@media (max-width: 767px)': {
      ...mobileStyles
    },
    '@media (min-width: 768px) and (max-width: 1023px)': {
      ...tabletStyles
    }
  };
};

/**
 * Utility for creating mobile-friendly buttons
 * @param {boolean} isMobile - Whether device is mobile
 * @returns {Object} - Button styles
 */
export const getMobileButtonStyles = (isMobile) => {
  return {
    padding: isMobile ? '12px 20px' : '8px 16px',
    fontSize: isMobile ? '16px' : '14px',
    borderRadius: isMobile ? '8px' : '4px',
    minHeight: isMobile ? '48px' : '36px', // Ensure touch target size
    minWidth: isMobile ? '48px' : '36px'
  };
};

/**
 * Utility for creating mobile-friendly input styles
 * @param {boolean} isMobile - Whether device is mobile
 * @returns {Object} - Input styles
 */
export const getMobileInputStyles = (isMobile) => {
  return {
    padding: isMobile ? '12px 16px' : '8px 12px',
    fontSize: isMobile ? '16px' : '14px',
    borderRadius: isMobile ? '8px' : '4px',
    minHeight: isMobile ? '48px' : '36px' // Ensure touch target size
  };
};
