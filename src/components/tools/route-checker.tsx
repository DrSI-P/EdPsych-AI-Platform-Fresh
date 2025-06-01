'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type RouteCheckerProps = {
  routes: string[];
  onComplete: (results: RouteCheckResult[]) => void;
};

type RouteCheckResult = {
  route: string;
  status: 'success' | 'error';
  statusCode?: number;
  message?: string;
};

/**
 * Route Checker Component
 * 
 * This component checks the validity of routes by making HEAD requests
 * to each route and reporting the results.
 */
export default function RouteChecker({ routes, onComplete }: RouteCheckerProps) {
  const [checking, setChecking] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<RouteCheckResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Start checking routes
  const startCheck = async () => {
    setChecking(true);
    setProgress(0);
    setResults([]);
    setError(null);
    
    const checkResults: RouteCheckResult[] = [];
    
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      
      try {
        // Make a HEAD request to check if the route exists
        const response = await fetch(route, { method: 'HEAD' });
        
        checkResults.push({
          route,
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          message: response.ok ? 'Route exists' : `Error: ${response.status} ${response.statusText}`
        });
      } catch (err) {
        checkResults.push({
          route,
          status: 'error',
          message: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        });
      }
      
      // Update progress
      setProgress(Math.round(((i + 1) / routes.length) * 100));
      setResults([...checkResults]);
    }
    
    setChecking(false);
    onComplete(checkResults);
  };
  
  return (
    <div className="route-checker">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Route Checker</h2>
        <p className="text-muted-foreground">
          Check {routes.length} routes for validity
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4">
        <Button 
          onClick={startCheck} 
          disabled={checking}
        >
          {checking ? `Checking Routes (${progress}%)` : 'Start Route Check'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="route-results">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 rounded ${
                  result.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{result.route}</span>
                  <span className={result.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {result.status === 'success' ? 'OK' : 'Error'}
                    {result.statusCode && ` (${result.statusCode})`}
                  </span>
                </div>
                {result.message && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {result.message}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Success: {results.filter(r => r.status === 'success').length}</span>
              <span>Error: {results.filter(r => r.status === 'error').length}</span>
              <span>Total: {results.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
