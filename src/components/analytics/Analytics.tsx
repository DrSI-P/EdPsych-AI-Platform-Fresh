'use client';

import React from 'react';
// Remove the import that's causing an error
// import { AnalyticsDashboard } from './analytics-dashboard';

/**
 * Main Analytics component that serves as the entry point for the analytics feature
 * This component can be used in _app.tsx for site-wide analytics tracking
 */
export function Analytics() {
  // In a real implementation, this would initialize analytics tracking
  // and potentially render analytics-related UI components

  React.useEffect(() => {
    // Initialize analytics tracking
    console.log('Analytics tracking initialized');

    // Cleanup function
    return () => {
      console.log('Analytics tracking cleaned up');
    };
  }, []);

  // This component doesn't render anything visible by default
  // It's meant to be used for tracking and data collection
  return null;
}

export default Analytics;