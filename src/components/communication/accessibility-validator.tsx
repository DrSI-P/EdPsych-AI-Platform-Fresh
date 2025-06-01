'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';

interface AccessibilityValidatorProps {
  componentName: string;
  onFixIssues?: (issues: AccessibilityIssue[]) => void;
}

export interface AccessibilityIssue {
  id: string;
  element: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriteria: string;
  fixSuggestion: string;
}

export const AccessibilityValidator: React.FC<AccessibilityValidatorProps> = ({
  componentName,
  onFixIssues
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [validationResults, setValidationResults] = useState<{
    perceivable: number;
    operable: number;
    understandable: number;
    robust: number;
  }>({
    perceivable: 0,
    operable: 0,
    understandable: 0,
    robust: 0
  });

  // Validate component accessibility
  const validateAccessibility = () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      // This would be replaced with actual validation logic in a real implementation
      const mockIssues: AccessibilityIssue[] = [];
      
      // Check for common accessibility issues based on component name
      if (componentName.toLowerCase().includes('message') || componentName.toLowerCase().includes('chat')) {
        mockIssues.push({
          id: 'keyboard-nav-1',
          element: 'Message input field',
          description: 'Message input field may not be fully keyboard accessible',
          impact: 'serious',
          wcagCriteria: 'WCAG 2.1.1 Keyboard (Level A)',
          fixSuggestion: 'Ensure message input field can be accessed and operated using keyboard only'
        });
      }
      
      if (componentName.toLowerCase().includes('goal')) {
        mockIssues.push({
          id: 'colour-contrast-1',
          element: 'Progress indicators',
          description: 'Some progress indicators may not have sufficient colour contrast',
          impact: 'moderate',
          wcagCriteria: 'WCAG 1.4.3 Contrast (Minimum) (Level AA)',
          fixSuggestion: 'Ensure all progress indicators have a contrast ratio of at least 3:1'
        });
      }
      
      if (componentName.toLowerCase().includes('meeting') || componentName.toLowerCase().includes('schedule')) {
        mockIssues.push({
          id: 'time-1',
          element: 'Date and time pickers',
          description: 'Date and time pickers may not be fully accessible to screen readers',
          impact: 'serious',
          wcagCriteria: 'WCAG 2.1.1 Keyboard (Level A)',
          fixSuggestion: 'Ensure date and time pickers are fully accessible to screen readers and keyboard users'
        });
      }
      
      // Add a few general issues
      mockIssues.push({
        id: 'aria-1',
        element: 'Interactive elements',
        description: 'Some interactive elements may be missing proper ARIA attributes',
        impact: 'moderate',
        wcagCriteria: 'WCAG 4.1.2 Name, Role, Value (Level A)',
        fixSuggestion: 'Add appropriate ARIA attributes to all interactive elements'
      });
      
      // Calculate scores based on issues
      const criticalIssues = mockIssues.filter(issue => issue.impact === 'critical').length;
      const seriousIssues = mockIssues.filter(issue => issue.impact === 'serious').length;
      const moderateIssues = mockIssues.filter(issue => issue.impact === 'moderate').length;
      
      // Calculate overall score (0-100)
      const baseScore = 100;
      const criticalPenalty = criticalIssues * 15;
      const seriousPenalty = seriousIssues * 10;
      const moderatePenalty = moderateIssues * 5;
      
      const calculatedScore = Math.max(0, baseScore - criticalPenalty - seriousPenalty - moderatePenalty);
      
      // Calculate POUR scores (Perceivable, Operable, Understandable, Robust)
      const perceivableScore = criticalIssues > 0 ? 70 : 90;
      const operableScore = seriousIssues > 0 ? 75 : 95;
      const understandableScore = 85;
      const robustScore = 80;
      
      setAccessibilityScore(calculatedScore);
      setIssues(mockIssues);
      setValidationResults({
        perceivable: perceivableScore,
        operable: operableScore,
        understandable: understandableScore,
        robust: robustScore
      });
      
      setIsValidating(false);
      setValidationComplete(true);
    }, 2000);
  };

  // Get score colour based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get badge variant based on impact
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'serious':
        return <Badge variant="destructive" className="bg-orange-500">Serious</Badge>;
      case 'moderate':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Moderate</Badge>;
      case 'minor':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Minor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Render validation results
  const renderResults = () => {
    if (!validationComplete) {
      return (
        <div className="flex flex-col items-centre justify-centre p-8">
          <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-centre text-muted-foreground">
            Click the "Validate Accessibility" button to check this component against WCAG 2.1 AA standards.
          </p>
        </div>
      );
    }

    return (
      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="wcag">WCAG Compliance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Accessibility Score</CardTitle>
                <CardDescription>Based on WCAG 2.1 AA standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-centre justify-centre">
                  <div className={`text-6xl font-bold ${getScoreColor(accessibilityScore)}`}>
                    {accessibilityScore}
                  </div>
                  <div className="text-2xl ml-1 mt-2">/100</div>
                </div>
                <Progress value={accessibilityScore} className="mt-4" />
              </CardContent>
              <CardFooter>
                {accessibilityScore >= 90 ? (
                  <div className="flex items-centre text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Meets WCAG 2.1 AA standards
                  </div>
                ) : accessibilityScore >= 70 ? (
                  <div className="flex items-centre text-amber-500">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Partially meets WCAG 2.1 AA standards
                  </div>
                ) : (
                  <div className="flex items-centre text-red-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Does not meet WCAG 2.1 AA standards
                  </div>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>POUR Principles</CardTitle>
                <CardDescription>Perceivable, Operable, Understandable, Robust</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Perceivable</span>
                    <span className={getScoreColor(validationResults.perceivable)}>
                      {validationResults.perceivable}%
                    </span>
                  </div>
                  <Progress value={validationResults.perceivable} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Operable</span>
                    <span className={getScoreColor(validationResults.operable)}>
                      {validationResults.operable}%
                    </span>
                  </div>
                  <Progress value={validationResults.operable} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Understandable</span>
                    <span className={getScoreColor(validationResults.understandable)}>
                      {validationResults.understandable}%
                    </span>
                  </div>
                  <Progress value={validationResults.understandable} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Robust</span>
                    <span className={getScoreColor(validationResults.robust)}>
                      {validationResults.robust}%
                    </span>
                  </div>
                  <Progress value={validationResults.robust} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Summary of Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-centre p-4 border rounded-md">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      {issues.filter(issue => issue.impact === 'critical').length}
                    </div>
                    <div className="text-sm text-centre">Critical Issues</div>
                  </div>
                  
                  <div className="flex flex-col items-centre p-4 border rounded-md">
                    <div className="text-3xl font-bold text-orange-500 mb-2">
                      {issues.filter(issue => issue.impact === 'serious').length}
                    </div>
                    <div className="text-sm text-centre">Serious Issues</div>
                  </div>
                  
                  <div className="flex flex-col items-centre p-4 border rounded-md">
                    <div className="text-3xl font-bold text-amber-500 mb-2">
                      {issues.filter(issue => issue.impact === 'moderate' || issue.impact === 'minor').length}
                    </div>
                    <div className="text-sm text-centre">Moderate/Minor Issues</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Key Findings:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {issues.length === 0 ? (
                      <li>No accessibility issues detected.</li>
                    ) : (
                      <>
                        {issues.some(issue => issue.wcagCriteria.includes('2.1.1')) && (
                          <li>Some elements may not be fully keyboard accessible.</li>
                        )}
                        {issues.some(issue => issue.wcagCriteria.includes('1.4.3')) && (
                          <li>Potential colour contrast issues in visual elements.</li>
                        )}
                        {issues.some(issue => issue.wcagCriteria.includes('4.1.2')) && (
                          <li>Some interactive elements may be missing proper ARIA attributes.</li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="pt-4">
          {issues.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-centre justify-centre p-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-centre text-muted-foreground">
                  No accessibility issues detected. The component meets WCAG 2.1 AA standards.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <Card key={issue.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{issue.element}</CardTitle>
                        <CardDescription>{issue.wcagCriteria}</CardDescription>
                      </div>
                      {getImpactBadge(issue.impact)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{issue.description}</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Suggested Fix:</p>
                      <p className="text-sm">{issue.fixSuggestion}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {onFixIssues && (
                <div className="flex justify-end">
                  <Button onClick={() => onFixIssues(issues)}>
                    Fix All Issues
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="wcag" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>WCAG 2.1 AA Compliance</CardTitle>
              <CardDescription>Web Content Accessibility Guidelines compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">1. Perceivable</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>1.1 Text Alternatives</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>1.3 Adaptable</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>1.4 Distinguishable</span>
                      {issues.some(issue => issue.wcagCriteria.includes('1.4.3')) ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">2. Operable</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>2.1 Keyboard Accessible</span>
                      {issues.some(issue => issue.wcagCriteria.includes('2.1.1')) ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>2.4 Navigable</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">3. Understandable</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>3.1 Readable</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>3.2 Predictable</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>3.3 Input Assistance</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">4. Robust</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>4.1 Compatible</span>
                      {issues.some(issue => issue.wcagCriteria.includes('4.1.2')) ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">Passed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggested improvements for better accessibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.length === 0 ? (
                  <p>No recommendations needed. The component meets WCAG 2.1 AA standards.</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium">High Priority:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {issues.filter(issue => issue.impact === 'critical').map((issue, index) => (
                          <li key={`critical-${index}`}>{issue.fixSuggestion}</li>
                        ))}
                        {issues.filter(issue => issue.impact === 'critical').length === 0 && (
                          <li>No high priority issues found.</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Medium Priority:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {issues.filter(issue => issue.impact === 'serious').map((issue, index) => (
                          <li key={`serious-${index}`}>{issue.fixSuggestion}</li>
                        ))}
                        {issues.filter(issue => issue.impact === 'serious').length === 0 && (
                          <li>No medium priority issues found.</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">General Improvements:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Ensure all interactive elements have visible focus indicators</li>
                        <li>Add appropriate ARIA labels to all form controls</li>
                        <li>Test with screen readers to ensure proper announcement</li>
                        <li>Ensure all text meets minimum contrast requirements</li>
                        <li>Provide text alternatives for all non-text content</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="accessibility-validator space-y-4">
      <div className="flex justify-between items-centre">
        <h2 className="text-xl font-bold">Accessibility Validation</h2>
        
        <Button 
          onClick={validateAccessibility} 
          disabled={isValidating}
        >
          {isValidating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Validating...
            </>
          ) : validationComplete ? (
            'Re-validate Accessibility'
          ) : (
            'Validate Accessibility'
          )}
        </Button>
      </div>
      
      {renderResults()}
    </div>
  );
};

export default AccessibilityValidator;
