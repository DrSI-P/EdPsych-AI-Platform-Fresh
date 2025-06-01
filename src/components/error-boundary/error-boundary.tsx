'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: any[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors anywhere in its
 * child component tree, logs those errors, and displays a fallback UI instead of
 * crashing the whole application.
 * 
 * Features:
 * - Catches errors in child components
 * - Provides detailed error information in development
 * - Shows user-friendly error messages in production
 * - Allows custom fallback UI
 * - Supports error reporting callbacks
 * - Implements reset functionality
 * - Age-appropriate error messages
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } 
    // Update state with error info
    this.setState({
      errorInfo
    });
  }

  componentDidUpdate(prevProps: Props): void {
    // If any of the resetKeys changed, reset the error boundary
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys[index])
    ) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-md mx-auto my-8 shadow-lg border-red-100">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-red-800 flex items-centre gap-2">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {process.env.NODE_ENV === 'development' 
                  ? this.state.error?.message || 'An unexpected error occurred'
                  : 'We encountered a problem while displaying this content'}
              </AlertDescription>
            </Alert>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Error Details:</h4>
                <pre className="bg-grey-100 p-3 rounded text-xs overflow-auto max-h-[200px]">
                  {this.state.error?.stack}
                </pre>
                <h4 className="text-sm font-medium mt-4 mb-2">Component Stack:</h4>
                <pre className="bg-grey-100 p-3 rounded text-xs overflow-auto max-h-[200px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-grey-50 border-t">
            <Button 
              variant="outline" 
              onClick={this.reset}
              className="flex items-centre gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="default"
              onClick={() => window.location.href = '/'}
              className="flex items-centre gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </CardFooter>
        </Card>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
