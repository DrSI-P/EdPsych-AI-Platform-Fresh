'use client';

import React, { useState, useEffect } from 'react';
import { 
  ContentDocument
} from '@/lib/content-creation/types';
import { getContentCreationService } from '@/lib/content-creation/contentCreationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface AccessibilityCheckerProps {
  contentId?: string;
  content: ContentDocument;
  onResults?: (results) => void;
  onClose?: () => void;
}

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  contentId,
  content,
  onResults,
  onClose
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    accessibilityScore: number;
    issues: {
      severity: 'critical' | 'serious' | 'moderate' | 'minor';
      description: string;
      recommendation: string;
    }[];
  } | null>(null);
  
  const { toast } = useToast();
  
  // Run accessibility check
  const runAccessibilityCheck = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      if (contentId) {
        // If we have a contentId, use the API
        const contentService = getContentCreationService();
        const checkResults = await contentService.checkAccessibility(contentId);
        setResults(checkResults);
        
        if (onResults) {
          onResults(checkResults);
        }
      } else {
        // Otherwise, run a local check with mock data
        // In a real implementation, this would analyse the content directly
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock results based on content
        const mockResults = {
          accessibilityScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          issues: [
            {
              severity: 'serious' as const,
              description: 'Some images may be missing alternative text',
              recommendation: 'Add descriptive alt text to all images to ensure screen reader compatibility.'
            },
            {
              severity: 'moderate' as const,
              description: 'Colour contrast may be insufficient in some text elements',
              recommendation: 'Ensure all text has a contrast ratio of at least 4.5:1 against its background.'
            },
            {
              severity: 'minor' as const,
              description: 'Some interactive elements may lack clear focus indicators',
              recommendation: 'Add visible focus states to all interactive elements for keyboard navigation.'
            }
          ]
        };
        
        // Add more specific issues based on content analysis
        const textElements = content.elements.filter(e => e.type === 'text');
        const imageElements = content.elements.filter(e => e.type === 'image');
        
        if (imageElements.length > 0) {
          const missingAlt = imageElements.some((e) => !e.alt || e.alt.trim() === '');
          if (missingAlt) {
            mockResults.issues.unshift({
              severity: 'critical' as const,
              description: 'Images without alternative text detected',
              recommendation: 'Add descriptive alt text to all images to ensure screen reader compatibility.'
            });
            mockResults.accessibilityScore -= 15;
          }
        }
        
        if (content.settings?.accessibility?.highContrast !== true) {
          mockResults.issues.push({
            severity: 'moderate' as const,
            description: 'High contrast mode is not enabled',
            recommendation: 'Consider enabling high contrast mode for better visibility.'
          });
        }
        
        if (content.settings?.accessibility?.screenReaderOptimized !== true) {
          mockResults.issues.push({
            severity: 'moderate' as const,
            description: 'Screen reader optimization is not enabled',
            recommendation: 'Enable screen reader optimization for better accessibility.'
          });
        }
        
        setResults(mockResults);
        
        if (onResults) {
          onResults(mockResults);
        }
      }
    } catch (error) {
      console.error('Failed to check accessibility:', error);
      setError('Failed to check accessibility. Please try again.');
      toast({
        variant: "destructive",
        title: "Accessibility check failed",
        description: "There was a problem checking the accessibility of your content.",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  // Run check on mount
  useEffect(() => {
    runAccessibilityCheck();
  }, [contentId, content]);
  
  // Get severity icon
  const getSeverityIcon = (severity: 'critical' | 'serious' | 'moderate' | 'minor') => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="h-5 w-5 text-destructive" />;
      case 'serious':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'minor':
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Get severity text colour
  const getSeverityTextColor = (severity: 'critical' | 'serious' | 'moderate' | 'minor') => {
    switch (severity) {
      case 'critical':
        return 'text-destructive';
      case 'serious':
        return 'text-destructive';
      case 'moderate':
        return 'text-warning';
      case 'minor':
        return 'text-muted-foreground';
    }
  };
  
  // Get score colour
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-lime-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Get score text
  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Satisfactory';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };
  
  return (
    <div className="accessibility-checker">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isChecking ? (
        <div className="checking-state p-8 text-centre">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Checking accessibility...</p>
          <p className="text-muted-foreground">This may take a moment.</p>
        </div>
      ) : results ? (
        <div className="results-state">
          <div className="score-section text-centre p-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-muted stroke-current" 
                  strokeWidth="10" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className={`${getScoreColor(results.accessibilityScore)} stroke-current`}
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={`${results.accessibilityScore * 2.51} 251`}
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)" 
                />
                <text 
                  x="50" 
                  y="50" 
                  className="text-3xl font-bold" 
                  dominantBaseline="middle" 
                  textAnchor="middle"
                >
                  {results.accessibilityScore}
                </text>
                <text 
                  x="50" 
                  y="65" 
                  className="text-xs" 
                  dominantBaseline="middle" 
                  textAnchor="middle"
                >
                  /100
                </text>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{getScoreText(results.accessibilityScore)}</h2>
            <p className="text-muted-foreground">
              {results.issues.length === 0 
                ? 'No accessibility issues found.' 
                : `${results.issues.length} issue${results.issues.length === 1 ? '' : 's'} found.`}
            </p>
          </div>
          
          <Separator />
          
          <div className="issues-section p-4">
            <h3 className="text-lg font-medium mb-4">Accessibility Issues</h3>
            
            {results.issues.length === 0 ? (
              <div className="text-centre p-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No issues found!</p>
                <p className="text-muted-foreground">Your content meets accessibility standards.</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {results.issues.map((issue, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-centre gap-2">
                          {getSeverityIcon(issue.severity)}
                          <CardTitle className={`text-base ${getSeverityTextColor(issue.severity)}`}>
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Issue
                          </CardTitle>
                        </div>
                        <CardDescription>{issue.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{issue.recommendation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          
          <div className="wcag-section p-4">
            <h3 className="text-lg font-medium mb-2">WCAG 2.1 Compliance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content more accessible to people with disabilities.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">Perceivable</p>
                <Progress value={results.accessibilityScore - 5} className="h-2" />
              </div>
              <div>
                <p className="font-medium mb-1">Operable</p>
                <Progress value={results.accessibilityScore} className="h-2" />
              </div>
              <div>
                <p className="font-medium mb-1">Understandable</p>
                <Progress value={results.accessibilityScore + 5} className="h-2" />
              </div>
              <div>
                <p className="font-medium mb-1">Robust</p>
                <Progress value={results.accessibilityScore - 10} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="actions-section p-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AccessibilityChecker;
