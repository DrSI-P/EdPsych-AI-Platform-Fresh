// Performance optimization utilities for EdPsych-AI-Education-Platform
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for implementing image lazy loading
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - Current image source to display
 */
export const useLazyImage = (src: string, placeholder: string = '/images/placeholder.svg') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      // Keep placeholder on error
    };
  }, [src]);

  return { imageSrc, isLoaded };
};

/**
 * Custom hook for implementing component lazy loading
 * @param {Function} importFunc - Dynamic import function
 * @returns {Object} - Component and loading state
 */
export const useLazyComponent = (importFunc) => {
  const [component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    importFunc()
      .then((module) => {
        setComponent(module.default || module);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load component:', err);
        setError(err);
        setIsLoading(false);
      });
  }, [importFunc]);

  return { component, isLoading, error };
};

/**
 * Custom hook for implementing data caching
 * @param {string} key - Cache key
 * @param {Function} fetchFunc - Function to fetch data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Object} - Data and loading state
 */
export const useDataCache = (key, fetchFunc, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check cache first
        const cachedData = localStorage.getItem(`cache_${key}`);
        if (cachedData) {
          const { data: cachedValue, timestamp } = JSON.parse(cachedData);
          const isValid = Date.now() - timestamp < ttl;
          
          if (isValid) {
            setData(cachedValue);
            setIsLoading(false);
            return;
          }
        }
        
        // Fetch fresh data
        const freshData = await fetchFunc();
        setData(freshData);
        
        // Update cache
        localStorage.setItem(
          `cache_${key}`,
          JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          })
        );
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFunc, ttl]);

  // Function to force refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshData = await fetchFunc();
      setData(freshData);
      
      // Update cache
      localStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data: freshData,
          timestamp: Date.now()
        })
      );
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchFunc]);

  return { data, isLoading, error, refreshData };
};

/**
 * Utility for code splitting and dynamic imports
 * @param {string} componentPath - Path to component
 * @returns {Promise} - Promise resolving to component
 */
export const loadComponent = (componentPath) => {
  return import(`@/components/${componentPath}`);
};

/**
 * Utility for debouncing function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Utility for throttling function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Utility for memoizing expensive calculations
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Utility for optimising animations with requestAnimationFrame
 * @param {Function} callback - Animation callback
 * @returns {Object} - Animation control functions
 */
export const useAnimationFrame = (callback) => {
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const [isRunning, setIsRunning] = useState(false);
  
  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  const start = useCallback(() => {
    if (!isRunning) {
      requestRef.current = requestAnimationFrame(animate);
      setIsRunning(true);
    }
  }, [animate, isRunning]);
  
  const stop = useCallback(() => {
    if (isRunning) {
      cancelAnimationFrame(requestRef.current);
      setIsRunning(false);
    }
  }, [isRunning]);
  
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  return { start, stop, isRunning };
};

/**
 * Utility for optimising resource loading based on network conditions
 * @returns {Object} - Network condition information
 */
export const useNetworkAwareness = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  });
  
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    };
    
    updateNetworkInfo();
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo);
      return () => {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);
  
  return networkInfo;
};

/**
 * Utility for implementing virtual scrolling for large lists
 * @param {number} itemCount - Total number of items
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} windowHeight - Visible window height in pixels
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} - Virtual list information
 */
export const useVirtualScroll = (itemCount, itemHeight, windowHeight, overscan = 3) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + windowHeight) / itemHeight) + overscan
  );
  
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      style: {
        position: 'absolute',
        top: `${i * itemHeight}px`,
        height: `${itemHeight}px`,
        left: 0,
        right: 0
      }
    });
  }
  
  const totalHeight = itemCount * itemHeight;
  
  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    onScroll
  };
};

/**
 * Utility for implementing intersection observer for lazy loading
 * @param {Object} options - Intersection observer options
 * @returns {Object} - Ref and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options, ref]);
  
  return { ref, isIntersecting };
};
