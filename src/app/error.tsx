'use client';

import React from 'react';
import CustomErrorPage from '@/components/error/custom-error-page';

/**
 * Error Page
 * 
 * This page is automatically displayed when an error occurs during rendering.
 * It uses the CustomErrorPage component to provide a user-friendly error experience.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CustomErrorPage 
      statusCode={500}
      title="Something Went Wrong"
      description="An error occurred while processing your request."
      showHomeButton={true}
      showBackButton={true}
    />
  );
}
