'use client';

import { useEffect } from 'react';
import { initializeMonitoring } from '@/lib/monitoring';

/**
 * Monitoring Provider Component
 * 
 * This component initializes and provides monitoring functionality to the application.
 * It should be included near the root of the component tree.
 */
export function MonitoringProvider({ children }) {
  useEffect(() => {
    // Initialize monitoring on client-side
    if (typeof window !== 'undefined') {
      const monitoring = initializeMonitoring();
      
      // Set up performance monitoring for page navigation
      const handleRouteChangeStart = (url) => {
        monitoring.performance.measure(`Navigation to ${url}`).start();
      };
      
      const handleRouteChangeComplete = (url) => {
        const measure = monitoring.performance.measure(`Navigation to ${url}`);
        const duration = measure.end();
        monitoring.performance.trackPageLoad(url, duration);
      };
      
      // Clean up on unmount
      return () => {
        // Any cleanup needed
      };
    }
  }, []);
  
  return <>{children}</>;
}

export default MonitoringProvider;
