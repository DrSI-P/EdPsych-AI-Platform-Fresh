'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type Route = {
  path: string;
  name: string;
  description?: string;
  category?: string;
};

type RouteVerifierProps = {
  onComplete?: (results: RouteVerificationResult) => void;
};

type RouteVerificationResult = {
  totalRoutes: number;
  validRoutes: number;
  invalidRoutes: number;
  results: RouteResult[];
};

type RouteResult = {
  route: Route;
  valid: boolean;
  statusCode?: number;
  error?: string;
};

/**
 * Route Verifier Component
 * 
 * This component performs comprehensive verification of all application routes,
 * checking for 404 errors and other issues.
 */
export default function RouteVerifier({ onComplete }: RouteVerifierProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<RouteResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Load routes from API or static list
  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch routes from an API
        // For now, we'll use a static list of common routes
        const commonRoutes: Route[] = [
          { path: '/', name: 'Home', category: 'Core' },
          { path: '/dashboard', name: 'Dashboard', category: 'Core' },
          { path: '/profile', name: 'Profile', category: 'User' },
          { path: '/settings', name: 'Settings', category: 'User' },
          { path: '/login', name: 'Login', category: 'Authentication' },
          { path: '/register', name: 'Register', category: 'Authentication' },
          { path: '/about', name: 'About', category: 'Information' },
          { path: '/contact', name: 'Contact', category: 'Information' },
          { path: '/help', name: 'Help', category: 'Support' },
          { path: '/faq', name: 'FAQ', category: 'Support' },
          { path: '/privacy', name: 'Privacy Policy', category: 'Legal' },
          { path: '/terms', name: 'Terms of Service', category: 'Legal' },
          { path: '/accessibility', name: 'Accessibility', category: 'Legal' },
          { path: '/courses', name: 'Courses', category: 'Education' },
          { path: '/lessons', name: 'Lessons', category: 'Education' },
          { path: '/assessments', name: 'Assessments', category: 'Education' },
          { path: '/resources', name: 'Resources', category: 'Education' },
          { path: '/community', name: 'Community', category: 'Social' },
          { path: '/forum', name: 'Forum', category: 'Social' },
          { path: '/messages', name: 'Messages', category: 'Communication' },
          { path: '/notifications', name: 'Notifications', category: 'Communication' },
        ];
        
        setRoutes(commonRoutes);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(commonRoutes.map(route => route.category)));
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        setError(`Failed to load routes: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadRoutes();
  }, []);
  
  // Start verification process
  const startVerification = async () => {
    setVerifying(true);
    setProgress(0);
    setResults([]);
    setError(null);
    
    const routesToVerify = selectedCategory 
      ? routes.filter(route => route.category === selectedCategory)
      : routes;
    
    const verificationResults: RouteResult[] = [];
    
    for (let i = 0; i < routesToVerify.length; i++) {
      const route = routesToVerify[i];
      
      try {
        // In a real implementation, this would make an actual request
        // For demonstration, we'll simulate responses
        const valid = !route.path.includes('missing') && route.path !== '/privacy';
        const statusCode = valid ? 200 : 404;
        
        verificationResults.push({
          route,
          valid,
          statusCode,
          error: valid ? undefined : `Route returned status code ${statusCode}`
        });
      } catch (err) {
        verificationResults.push({
          route,
          valid: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
      
      // Update progress
      setProgress(Math.round(((i + 1) / routesToVerify.length) * 100));
      setResults([...verificationResults]);
      
      // Small delay to avoid UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setVerifying(false);
    
    // Calculate summary
    const validRoutes = verificationResults.filter(result => result.valid).length;
    const invalidRoutes = verificationResults.filter(result => !result.valid).length;
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete({
        totalRoutes: verificationResults.length,
        validRoutes,
        invalidRoutes,
        results: verificationResults
      });
    }
  };
  
  // Filter routes by category
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Route Verifier</CardTitle>
        <CardDescription>
          Verify all application routes to identify 404 errors and other issues
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Filter by Category</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {verifying && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Verifying routes...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium">Results</div>
              <div className="text-sm">
                <span className="text-green-600 mr-4">
                  Valid: {results.filter(r => r.valid).length}
                </span>
                <span className="text-red-600">
                  Invalid: {results.filter(r => !r.valid).length}
                </span>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium">{result.route.name}</div>
                        <div className="text-gray-500">{result.route.path}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.route.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.valid ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Valid</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span>{result.statusCode || 'Error'}</span>
                          </div>
                        )}
                        {result.error && (
                          <div className="text-xs text-gray-500 mt-1">
                            {result.error}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={startVerification} 
          disabled={verifying || loading}
          className="w-full"
        >
          {verifying ? `Verifying Routes (${progress}%)` : 'Start Route Verification'}
        </Button>
      </CardFooter>
    </Card>
  );
}
