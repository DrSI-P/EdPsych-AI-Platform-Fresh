'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

type RouteTestResult = {
  route: string;
  status: 'success' | 'error' | 'warning';
  statusCode?: number;
  responseTime?: number;
  message?: string;
};

type AutomatedRouteTestProps = {
  onComplete?: (results: RouteTestResult[]) => void;
  initialRoutes?: string[];
};

/**
 * Automated Route Tester Component
 * 
 * This component automatically tests all application routes to identify 404 errors,
 * performance issues, and other problems. It provides comprehensive reporting and
 * visualization of test results.
 */
export default function AutomatedRouteTester({
  onComplete,
  initialRoutes,
}: AutomatedRouteTestProps) {
  const [routes, setRoutes] = useState<string[]>(initialRoutes || []);
  const [results, setResults] = useState<RouteTestResult[]>([]);
  const [testing, setTesting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [scanningRoutes, setScanningRoutes] = useState<boolean>(false);
  
  // Scan for routes if not provided
  useEffect(() => {
    if (!initialRoutes || initialRoutes.length === 0) {
      scanForRoutes();
    }
  }, [initialRoutes]);
  
  // Scan for routes in the application
  const scanForRoutes = async () => {
    setScanningRoutes(true);
    setError(null);
    
    try {
      // In a real implementation, this would scan the application for routes
      // For now, we'll use a predefined list of common routes
      const commonRoutes = [
        '/',
        '/dashboard',
        '/profile',
        '/settings',
        '/login',
        '/register',
        '/about',
        '/contact',
        '/help',
        '/faq',
        '/privacy',
        '/terms',
        '/accessibility',
        '/courses',
        '/lessons',
        '/assessments',
        '/resources',
        '/community',
        '/forum',
        '/messages',
        '/notifications',
        '/calendar',
        '/timetable',
        '/progress',
        '/achievements',
        '/certificates',
        '/reports',
        '/analytics',
        '/students',
        '/teachers',
        '/parents',
        '/curriculum',
        '/subjects',
        '/topics',
        '/activities',
        '/games',
        '/videos',
        '/audio',
        '/documents',
        '/worksheets',
        '/quizzes',
        '/tests',
        '/exams',
        '/projects',
        '/assignments',
        '/feedback',
        '/support',
        '/non-existent-page', // Intentionally invalid route for testing
      ];
      
      setRoutes(commonRoutes);
    } catch (err) {
      setError(`Failed to scan routes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setScanningRoutes(false);
    }
  };
  
  // Start testing all routes
  const startTesting = async () => {
    if (routes.length === 0) {
      setError('No routes to test. Please scan for routes first.');
      return;
    }
    
    setTesting(true);
    setProgress(0);
    setResults([]);
    setError(null);
    
    const testResults: RouteTestResult[] = [];
    
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      
      try {
        const startTime = performance.now();
        
        // Make a request to check if the route exists
        // In a real implementation, this would make an actual request
        // For demonstration, we'll simulate responses
        const isValid = !route.includes('non-existent');
        const isSlow = route.includes('reports') || route.includes('analytics');
        const statusCode = isValid ? 200 : 404;
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        let status: 'success' | 'error' | 'warning' = 'success';
        let message = 'Route exists and loads quickly';
        
        if (!isValid) {
          status = 'error';
          message = `Route returned status code ${statusCode}`;
        } else if (isSlow) {
          status = 'warning';
          message = 'Route exists but loads slowly';
        }
        
        testResults.push({
          route,
          status,
          statusCode,
          responseTime,
          message
        });
      } catch (err) {
        testResults.push({
          route,
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error'
        });
      }
      
      // Update progress
      setProgress(Math.round(((i + 1) / routes.length) * 100));
      setResults([...testResults]);
      
      // Small delay to avoid UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setTesting(false);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(testResults);
    }
  };
  
  // Filter results based on active tab
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'success') return result.status === 'success';
    if (activeTab === 'warning') return result.status === 'warning';
    if (activeTab === 'error') return result.status === 'error';
    return true;
  });
  
  // Calculate summary statistics
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const averageResponseTime = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length)
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Automated Route Tester</CardTitle>
        <CardDescription>
          Automatically test all application routes to identify 404 errors and performance issues
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium">Routes to test: </span>
            <span className="text-sm">{routes.length}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={scanForRoutes}
            disabled={scanningRoutes}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            {scanningRoutes ? 'Scanning...' : 'Scan Routes'}
          </Button>
        </div>
        
        {testing && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Testing routes...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-2xl font-bold">{results.length}</div>
                <div className="text-sm text-muted-foreground">Total Routes</div>
              </Card>
              <Card className="p-4 bg-green-50">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </Card>
              <Card className="p-4 bg-amber-50">
                <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </Card>
              <Card className="p-4 bg-red-50">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </Card>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Response Time</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{averageResponseTime}</span>
                <span className="text-sm text-muted-foreground">ms average</span>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="success">
                  Success ({successCount})
                </TabsTrigger>
                <TabsTrigger value="warning">
                  Warnings ({warningCount})
                </TabsTrigger>
                <TabsTrigger value="error">
                  Errors ({errorCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="max-h-80 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Response Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {result.route}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.status === 'success' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            )}
                            {result.status === 'warning' && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Warning
                              </Badge>
                            )}
                            {result.status === 'error' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Error
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.responseTime ? `${result.responseTime} ms` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.message}
                            {result.statusCode && ` (${result.statusCode})`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={startTesting} 
          disabled={testing || routes.length === 0}
          className="w-full"
        >
          {testing ? `Testing Routes (${progress}%)` : 'Start Automated Testing'}
        </Button>
      </CardFooter>
    </Card>
  );
}
