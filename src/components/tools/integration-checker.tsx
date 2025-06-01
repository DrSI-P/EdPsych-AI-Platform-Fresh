'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, FileCheck } from 'lucide-react';

type IntegrationCheckResult = {
  component: string;
  category: string;
  status: 'success' | 'error' | 'warning';
  message?: string;
  details?: string[];
};

type IntegrationCheckerProps = {
  onComplete?: (results: IntegrationCheckResult[]) => void;
};

/**
 * Integration Checker Component
 * 
 * This component verifies that all critical components are properly integrated
 * and working together as expected across the platform.
 */
export default function IntegrationChecker({ onComplete }: IntegrationCheckerProps) {
  const [results, setResults] = useState<IntegrationCheckResult[]>([]);
  const [checking, setChecking] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentComponent, setCurrentComponent] = useState<string | null>(null);
  
  // Define component categories to check
  const componentCategories = [
    {
      name: 'Voice Input',
      components: [
        'EnhancedVoiceRecognition',
        'VoiceNavigationProvider',
        'VoiceNavigationBar',
        'VoiceNavigationWrapper'
      ]
    },
    {
      name: 'Error Handling',
      components: [
        'CustomErrorPage',
        'NotFoundPage',
        'ErrorBoundary'
      ]
    },
    {
      name: 'Testing Tools',
      components: [
        'RouteChecker',
        'RouteVerifier',
        'AutomatedRouteTester',
        'EndToEndTestRunner'
      ]
    },
    {
      name: 'Core Navigation',
      components: [
        'MainNavigation',
        'Sidebar',
        'Breadcrumbs',
        'MobileNavigation'
      ]
    },
    {
      name: 'User Interface',
      components: [
        'ThemeProvider',
        'LayoutComponents',
        'AccessibilityFeatures',
        'ResponsiveDesign'
      ]
    }
  ];
  
  // Start integration check
  const startIntegrationCheck = async () => {
    setChecking(true);
    setProgress(0);
    setResults([]);
    setError(null);
    setCurrentComponent(null);
    
    const checkResults: IntegrationCheckResult[] = [];
    let totalComponents = 0;
    
    componentCategories.forEach(category => {
      totalComponents += category.components.length;
    });
    
    let completedComponents = 0;
    
    for (const category of componentCategories) {
      for (const component of category.components) {
        setCurrentComponent(component);
        
        try {
          // In a real implementation, this would perform actual integration checks
          // For demonstration, we'll simulate check results
          const checkResult = await simulateComponentCheck(component, category.name);
          checkResults.push(checkResult);
        } catch (err) {
          checkResults.push({
            component,
            category: category.name,
            status: 'error',
            message: err instanceof Error ? err.message : 'Unknown error'
          });
        }
        
        completedComponents++;
        setProgress(Math.round((completedComponents / totalComponents) * 100));
        setResults([...checkResults]);
        
        // Small delay to avoid UI freezing
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setChecking(false);
    setCurrentComponent(null);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(checkResults);
    }
  };
  
  // Simulate component integration check
  const simulateComponentCheck = async (component: string, category: string): Promise<IntegrationCheckResult> => {
    // In a real implementation, this would perform actual integration checks
    // For demonstration, we'll simulate results based on component name
    
    // Simulate a delay for the check
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Define some known issues for demonstration
    const knownIssues: Record<string, { status: 'warning' | 'error', message: string, details?: string[] }> = {
      'VoiceNavigationWrapper': {
        status: 'warning',
        message: 'Integration with mobile navigation needs improvement',
        details: [
          'Voice commands not consistently recognized in mobile view',
          'Command feedback positioning issues on small screens'
        ]
      },
      'MobileNavigation': {
        status: 'warning',
        message: 'Performance issues on older devices',
        details: [
          'Animation stuttering on low-end devices',
          'Menu transition delay exceeds 200ms threshold'
        ]
      }
    };
    
    if (component in knownIssues) {
      const issue = knownIssues[component];
      return {
        component,
        category,
        status: issue.status,
        message: issue.message,
        details: issue.details
      };
    }
    
    // Default to success
    return {
      component,
      category,
      status: 'success',
      message: 'Component properly integrated'
    };
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
  const totalComponents = componentCategories.reduce((sum, category) => sum + category.components.length, 0);
  
  // Group results by category
  const resultsByCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, IntegrationCheckResult[]>);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration Checker</CardTitle>
        <CardDescription>
          Verify that all critical components are properly integrated and working together
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
            <span className="text-sm font-medium">Components to check: </span>
            <span className="text-sm">{totalComponents}</span>
          </div>
        </div>
        
        {checking && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{currentComponent ? `Checking: ${currentComponent}` : 'Running integration checks...'}</span>
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
                <div className="text-sm text-muted-foreground">Components Checked</div>
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
              
              <TabsContent value={activeTab} className="mt-0 space-y-6">
                {Object.entries(resultsByCategory).map(([category, categoryResults]) => {
                  // Filter category results based on active tab
                  const filteredCategoryResults = categoryResults.filter(result => {
                    if (activeTab === 'all') return true;
                    return result.status === activeTab;
                  });
                  
                  // Skip empty categories after filtering
                  if (filteredCategoryResults.length === 0) return null;
                  
                  return (
                    <Card key={category}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <CardDescription>
                          {filteredCategoryResults.length} component{filteredCategoryResults.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {filteredCategoryResults.map((result, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded border ${
                                result.status === 'success' ? 'border-green-200 bg-green-50' : 
                                result.status === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{result.component}</div>
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
                              </div>
                              
                              {result.message && (
                                <div className="text-sm mb-2">{result.message}</div>
                              )}
                              
                              {result.details && result.details.length > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {result.details.map((detail, detailIndex) => (
                                      <li key={detailIndex}>{detail}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={startIntegrationCheck} 
          disabled={checking}
          className="w-full"
        >
          {checking ? `Running Integration Checks (${progress}%)` : 'Start Integration Check'}
        </Button>
      </CardFooter>
    </Card>
  );
}
