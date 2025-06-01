'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle } from 'lucide-react';

type CustomErrorPageProps = {
  statusCode?: number;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  className?: string;
};

/**
 * Custom Error Page Component
 * 
 * This component provides a user-friendly error page that can be used
 * for 404 errors and other error states.
 */
export default function CustomErrorPage({
  statusCode = 404,
  title = 'Page Not Found',
  description = 'The page you are looking for doesn\'t exist or has been moved.',
  showHomeButton = true,
  showBackButton = true,
  className = '',
}: CustomErrorPageProps) {
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Get error icon based on status code
  const getErrorIcon = () => {
    if (statusCode >= 500) {
      return <AlertTriangle className="h-12 w-12 text-red-500" />;
    } else if (statusCode >= 400) {
      return <AlertCircle className="h-12 w-12 text-amber-500" />;
    } else {
      return <AlertCircle className="h-12 w-12 text-blue-500" />;
    }
  };
  
  // Get error title based on status code
  useEffect(() => {
    // In a real implementation, this could fetch more details about the error
    if (statusCode === 404) {
      setErrorDetails('The requested URL was not found on this server.');
    } else if (statusCode === 403) {
      setErrorDetails('You don\'t have permission to access this resource.');
    } else if (statusCode === 500) {
      setErrorDetails('The server encountered an internal error and was unable to complete your request.');
    } else if (statusCode === 503) {
      setErrorDetails('The service is temporarily unavailable. Please try again later.');
    }
  }, [statusCode]);
  
  // Handle navigation
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  const handleGoBack = () => {
    window.history.back();
  };
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getErrorIcon()}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertTitle>Error {statusCode}</AlertTitle>
            <AlertDescription>
              {errorDetails || 'An error occurred while processing your request.'}
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            <p>If you believe this is an error, please try the following:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check the URL for typos</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try accessing the page later</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          {showBackButton && (
            <Button variant="outline" onClick={handleGoBack}>
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={handleGoHome}>
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
