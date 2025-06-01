'use client';

import React from 'react';
import CustomErrorPage from '@/components/error/custom-error-page';

/**
 * Not Found Page
 * 
 * This page is automatically displayed when a route is not found (404 error).
 * It uses the CustomErrorPage component to provide a user-friendly error experience.
 */
export default function NotFound() {
  return (
    <CustomErrorPage 
      statusCode={404}
      title="Page Not Found"
      description="The page you are looking for doesn't exist or has been moved."
      showHomeButton={true}
      showBackButton={true}
    />
  );
}
