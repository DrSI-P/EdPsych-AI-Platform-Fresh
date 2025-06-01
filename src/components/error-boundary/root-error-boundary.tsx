'use client';

import React from 'react';
import ErrorBoundary from './error-boundary';
import { usePathname } from 'next/navigation';

/**
 * RootErrorBoundary Component
 * 
 * A high-level error boundary component designed to wrap the entire application
 * or major sections to provide resilience against unexpected errors.
 * 
 * Features:
 * - Catches errors at the application level
 * - Reports errors to monitoring services
 * - Provides user-friendly error messages
 * - Preserves navigation context
 */
const RootErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();
  
  // Handle errors at the application level
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log the error to console in development
    console.error('Application error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // In a production environment, this would send the error to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example of how this would be implemented with a service like Sentry
      // Sentry.captureException(error, {
      //   extra: {
      //     componentStack: errorInfo.componentStack,
      //     pathname
      //   }
      // });
      
      // For now, we'll just log to console with a note
      console.log('In production, this error would be reported to monitoring services');
    }
  };
  
  return (
    <ErrorBoundary
      onError={handleError}
      resetKeys={[pathname]} // Reset the error boundary when the path changes
    >
      {children}
    </ErrorBoundary>
  );
};

export default RootErrorBoundary;
