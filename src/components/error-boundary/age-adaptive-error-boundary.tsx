'use client';

import React from 'react';
import ErrorBoundary from './error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bug, Lightbulb, RefreshCw } from 'lucide-react';
import { AgeGroup } from '@/lib/types';

interface AgeAdaptiveErrorBoundaryProps {
  children: React.ReactNode;
  ageGroup?: AgeGroup;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: any[];
}

/**
 * AgeAdaptiveErrorBoundary Component
 * 
 * An extension of the base ErrorBoundary that provides age-appropriate
 * error messages and UI for different age groups.
 * 
 * Features:
 * - Age-appropriate error messages and visuals
 * - Simplified UI for younger users
 * - More detailed information for older users
 * - Consistent error handling across the platform
 */
const AgeAdaptiveErrorBoundary: React.FC<AgeAdaptiveErrorBoundaryProps> = ({
  children,
  ageGroup = 'late-primary',
  onError,
  resetKeys
}) => {
  // Render age-appropriate fallback UI based on age group
  const renderFallbackUI = () => {
    switch (ageGroup) {
      case 'nursery':
        return <NurseryErrorFallback />;
      case 'early-primary':
        return <EarlyPrimaryErrorFallback />;
      case 'late-primary':
        return <LatePrimaryErrorFallback />;
      case 'secondary':
        return <SecondaryErrorFallback />;
      default:
        return null; // Use default ErrorBoundary fallback
    }
  };

  return (
    <ErrorBoundary
      fallback={renderFallbackUI()}
      onError={onError}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  );
};

// Nursery Error Fallback (3-5 years)
// Very simple, visual, and reassuring
const NurseryErrorFallback: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-8 border-4 border-yellow-300 rounded-xl bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-centre text-2xl font-bold text-yellow-700">
          Oops! Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="text-centre">
        <div className="flex justify-centre mb-4">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-centre justify-centre">
            <span className="text-5xl">😕</span>
          </div>
        </div>
        
        <p className="text-xl text-yellow-700 mb-6">
          Let's try again!
        </p>
        
        <div className="flex justify-centre">
          <Button 
            size="lg"
            className="h-14 px-6 rounded-full bg-green-500 hover:bg-green-600 text-white text-lg"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-6 w-6 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Early Primary Error Fallback (5-8 years)
// Simple but with a bit more explanation
const EarlyPrimaryErrorFallback: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-8 border-2 border-blue-300 rounded-lg bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-centre text-xl font-bold text-blue-700">
          Oops! We hit a bump
        </CardTitle>
      </CardHeader>
      <CardContent className="text-centre">
        <div className="flex justify-centre mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-centre justify-centre">
            <Bug className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        
        <p className="text-lg text-blue-700 mb-4">
          Something went wrong with this page.
        </p>
        
        <p className="text-md text-blue-600 mb-6">
          Don't worry! Let's try again or go back home.
        </p>
        
        <div className="flex justify-centre gap-4">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            className="border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-lg"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Late Primary Error Fallback (8-11 years)
// More detailed with simple explanation
const LatePrimaryErrorFallback: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-8 shadow-md">
      <CardHeader className="bg-purple-50 border-b border-purple-100">
        <CardTitle className="text-purple-800 flex items-centre gap-2">
          <AlertCircle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-centre justify-centre flex-shrink-0">
            <Bug className="h-6 w-6 text-purple-500" />
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">We found a problem</h3>
            <p className="text-grey-600 mb-2">
              The page couldn't load properly. This happens sometimes when computers get confused.
            </p>
            <div className="bg-purple-50 p-3 rounded-md border border-purple-100 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-700">
                  You can try refreshing the page or going back to the home page. If the problem continues, you might want to ask for help.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-centre gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Secondary Error Fallback (11+ years)
// More technical and detailed
const SecondaryErrorFallback: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
      <CardHeader className="bg-grey-50 border-b">
        <CardTitle className="text-grey-800 flex items-centre gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Application Error
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
          <h3 className="font-medium text-red-800 mb-1">Error Details</h3>
          <p className="text-red-700 text-sm">
            An unexpected error occurred while rendering this component. The application has recovered, but the requested content could not be displayed.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-grey-800 mb-2">Possible Solutions:</h3>
          <ul className="list-disc pl-5 text-sm text-grey-700 space-y-1">
            <li>Refresh the page to reload the application</li>
            <li>Clear your browser cache and try again</li>
            <li>Return to the home page and navigate back to this section</li>
            <li>If the problem persists, contact support for assistance</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              This error has been logged and our team has been notified. We're working to fix the issue as quickly as possible.
            </p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-centre gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          
          <Button 
            variant="default"
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeAdaptiveErrorBoundary;
