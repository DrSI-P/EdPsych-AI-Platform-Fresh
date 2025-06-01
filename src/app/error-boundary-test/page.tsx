'use client';

import React from 'react';
import ErrorBoundaryTest from '@/components/error-boundary/error-boundary-test';

/**
 * Error Boundary Test Page
 * 
 * This page provides a testing environment for the error boundary components,
 * allowing developers to validate error handling across different scenarios.
 */
export default function ErrorBoundaryTestPage() {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundaryTest />
    </div>
  );
}
