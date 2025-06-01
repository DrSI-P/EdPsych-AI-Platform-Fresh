'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function VoiceInputTestError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-medium text-red-700">Voice Input Test Error</h2>
        </div>
        <p className="text-gray-700 mb-4">
          There was an error loading the voice input test components. This might be due to browser 
          compatibility issues or missing permissions.
        </p>
        <div className="text-sm bg-red-100 p-3 rounded mb-4 overflow-auto max-h-32">
          <code>{error.message}</code>
        </div>
        <div className="flex justify-end">
          <Button onClick={reset} variant="outline" className="mr-2">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
