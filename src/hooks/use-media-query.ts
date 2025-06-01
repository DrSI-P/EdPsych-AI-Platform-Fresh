'use client';

import React from 'react';

/**
 * Custom hook for media queries
 * Provides a way to respond to screen size changes
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Set initial value
      setMatches(media.matches);
      
      // Define listener function
      const listener = (event) => {
        setMatches(event.matches);
      };
      
      // Add listener
      media.addEventListener('change', listener);
      
      // Clean up
      return () => {
        media.removeEventListener('change', listener);
      };
    }
    
    // Default to false on server-side
    return () => {};
  }, [query]);
  
  return matches;
}
