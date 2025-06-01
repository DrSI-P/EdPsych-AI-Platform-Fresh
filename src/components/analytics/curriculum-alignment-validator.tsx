'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { DashboardConfig } from '@/lib/analytics/types';

interface CurriculumAlignmentValidatorProps {
  dashboard: DashboardConfig;
  onFixIssues?: (issues: CurriculumAlignmentIssue[]) => void;
}

export interface CurriculumAlignmentIssue {
  id: string;
  element: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  curriculumArea: string;
  fixSuggestion: string;
}

export const CurriculumAlignmentValidator: React.FC<CurriculumAlignmentValidatorProps> = ({
  dashboard,
  onFixIssues
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [alignmentScore, setAlignmentScore] = useState(0);
  const [issues, setIssues] = useState<CurriculumAlignmentIssue[]>([]);
  const [validationResults, setValidationResults] = useState<{
    keyStageAlignment: number;
    subjectCoverage: number;
    assessmentStandards: number;
    progressTracking: number;
  }>({
    keyStageAlignment: 0,
    subjectCoverage: 0,
    assessmentStandards: 0,
    progressTracking: 0
  });

  // Validate dashboard curriculum alignment
  const validateCurriculumAlignment = () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      // This would be replaced with actual validation logic in a real implementation
      const mockIssues: CurriculumAlignmentIssue[] = [];
      
      // Check for missing curriculum metadata
      dashboard.widgets.forEach(widget => {
        if (!widget.metricConfig?.description?.toLowerCase().includes('curriculum') && 
            !widget.chartConfig?.title?.toLowerCase().includes('curriculum')) {
          mockIssues.push({
            id: `curriculum-metadata-${widget.id}`,
            element: `Widget "${widget.title}"`,
            description: 'Missing curriculum metadata or references',
            impact: 'moderate',
            curriculumArea: 'General Curriculum Alignment',
            fixSuggestion: 'Add specific curriculum references to widget metadata and descriptions'
          });
        }
      });
      
      // Check for Key Stage alignment
      const hasKeyStageData = dashboard.widgets.some(widget => 
        widget.title.toLowerCase().includes('key stage') || 
        widget.description?.toLowerCase().includes('key stage')
      );
      
      if (!hasKeyStageData) {
        mockIssues.push({
          id: 'key-stage-alignment',
          element: 'Dashboard',
          description: 'Limited or missing Key Stage alignment in visualizations',
          impact: 'serious',
          curriculumArea: 'Key Stage Framework',
          fixSuggestion: 'Add Key Stage specific filters and visualizations to align with UK curriculum structure'
        });
      }
      
      // Check for subject coverage
      const subjectReferences = ['english', 'maths', 'mathematics', 'science', 'history', 'geography'];
      const hasSubjectData = dashboard.widgets.some(widget => 
        subjectReferences.some(subject => 
          widget.title.toLowerCase().includes(subject) || 
          widget.description?.toLowerCase().includes(subject)
        )
      );
      
      if (!hasSubjectData) {
        mockIssues.push({
          id: 'subject-coverage',
          element: 'Dashboard',
          description: 'Limited or missing subject-specific data visualizations',
          impact: 'serious',
          curriculumArea: 'Subject Coverage',
          fixSuggestion: 'Add subject-specific visualizations aligned with National Curriculum subjects'
        });
      }
      
      // Check for assessment standards
      const hasAssessmentData = dashboard.widgets.some(widget => 
        widget.title.toLowerCase().includes('assessment') || 
        widget.description?.toLowerCase().includes('assessment') ||
        widget.title.toLowerCase().includes('progress') || 
        widget.description?.toLowerCase().includes('progress')
      );
      
      if (!hasAssessmentData) {
        mockIssues.push({
          id: 'assessment-standards',
          element: 'Dashboard',
          description: 'Missing alignment with UK assessment standards',
          impact: 'critical',
          curriculumArea: 'Assessment Framework',
          fixSuggestion: 'Add visualizations that track progress against UK assessment standards and frameworks'
        });
      }
      
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
      
      // Calculate component scores
      const keyStageAlignmentScore = hasKeyStageData ? 90 : 60;
      const subjectCoverageScore = hasSubjectData ? 85 : 65;
      const assessmentStandardsScore = hasAssessmentData ? 95 : 50;
      const progressTrackingScore = 75; // Default value
      
      setAlignmentScore(calculatedScore);
      setIssues(mockIssues);
      setValidationResults({
        keyStageAlignment: keyStageAlignmentScore,
        subjectCoverage: subjectCoverageScore,
        assessmentStandards: assessmentStandardsScore,
        progressTracking: progressTrackingScore
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
            Click the "Validate Curriculum Alignment" button to check this dashboard against UK curriculum standards.
          </p>
        </div>
      );
    }

    return (
      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum Coverage</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Curriculum Alignment Score</CardTitle>
                <CardDescription>Based on UK National Curriculum standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-centre justify-centre">
                  <div className={`text-6xl font-bold ${getScoreColor(alignmentScore)}`}>
                    {alignmentScore}
                  </div>
                  <div className="text-2xl ml-1 mt-2">/100</div>
                </div>
                <Progress value={alignmentScore} className="mt-4" />
              </CardContent>
              <CardFooter>
                {alignmentScore >= 90 ? (
                  <div className="flex items-centre text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Well aligned with UK curriculum standards
                  </div>
                ) : alignmentScore >= 70 ? (
                  <div className="flex items-centre text-amber-500">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Partially aligned with UK curriculum standards
                  </div>
                ) : (
                  <div className="flex items-centre text-red-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Limited alignment with UK curriculum standards
                  </div>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Curriculum Components</CardTitle>
                <CardDescription>Key areas of curriculum alignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Key Stage Alignment</span>
                    <span className={getScoreColor(validationResults.keyStageAlignment)}>
                      {validationResults.keyStageAlignment}%
                    </span>
                  </div>
                  <Progress value={validationResults.keyStageAlignment} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Subject Coverage</span>
                    <span className={getScoreColor(validationResults.subjectCoverage)}>
                      {validationResults.subjectCoverage}%
                    </span>
                  </div>
                  <Progress value={validationResults.subjectCoverage} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Assessment Standards</span>
                    <span className={getScoreColor(validationResults.assessmentStandards)}>
                      {validationResults.assessmentStandards}%
                    </span>
                  </div>
                  <Progress value={validationResults.assessmentStandards} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Progress Tracking</span>
                    <span className={getScoreColor(validationResults.progressTracking)}>
                      {validationResults.progressTracking}%
                    </span>
                  </div>
                  <Progress value={validationResults.progressTracking} />
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
                      <li>No curriculum alignment issues detected.</li>
                    ) : (
                      <>
                        {issues.some(issue => issue.curriculumArea.includes('Key Stage')) && (
                          <li>Limited alignment with UK Key Stage framework.</li>
                        )}
                        {issues.some(issue => issue.curriculumArea.includes('Subject')) && (
                          <li>Insufficient subject-specific data visualizations.</li>
                        )}
                        {issues.some(issue => issue.curriculumArea.includes('Assessment')) && (
                          <li>Missing alignment with UK assessment standards.</li>
                        )}
                        {issues.some(issue => issue.description.includes('metadata')) && (
                          <li>Missing curriculum metadata in dashboard widgets.</li>
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
                  No curriculum alignment issues detected. The dashboard is well aligned with UK curriculum standards.
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
                        <CardDescription>{issue.curriculumArea}</CardDescription>
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
        
        <TabsContent value="curriculum" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>UK Curriculum Coverage</CardTitle>
              <CardDescription>National Curriculum alignment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">Key Stage Coverage</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>Early Years Foundation Stage</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Key Stage 1 (Years 1-2)</span>
                      {validationResults.keyStageAlignment > 70 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Key Stage 2 (Years 3-6)</span>
                      {validationResults.keyStageAlignment > 70 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Key Stage 3 (Years 7-9)</span>
                      {validationResults.keyStageAlignment > 70 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Key Stage 4 (Years 10-11)</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Key Stage 5 (Years 12-13)</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">Core Subject Coverage</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>English</span>
                      {validationResults.subjectCoverage > 80 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Mathematics</span>
                      {validationResults.subjectCoverage > 80 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Science</span>
                      {validationResults.subjectCoverage > 80 ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Good</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">Foundation Subject Coverage</div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-centre">
                      <span>Art and Design</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Computing</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Design and Technology</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Geography</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>History</span>
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Partial</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Languages</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Music</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span>Physical Education</span>
                      <Badge variant="outline" className="border-red-500 text-red-500">Limited</Badge>
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
              <CardDescription>Suggested improvements for better curriculum alignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.length === 0 ? (
                  <p>No recommendations needed. The dashboard is well aligned with UK curriculum standards.</p>
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
                        <li>Add Key Stage filters to all relevant visualizations</li>
                        <li>Include subject-specific dashboards for core curriculum areas</li>
                        <li>Add progress tracking against National Curriculum attainment targets</li>
                        <li>Include visualizations for special educational needs progress</li>
                        <li>Add curriculum metadata to all dashboard widgets</li>
                        <li>Create comparison views between current performance and expected standards</li>
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
    <div className="curriculum-alignment-validator space-y-4">
      <div className="flex justify-between items-centre">
        <h2 className="text-xl font-bold">Curriculum Alignment Validation</h2>
        
        <Button 
          onClick={validateCurriculumAlignment} 
          disabled={isValidating}
        >
          {isValidating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Validating...
            </>
          ) : validationComplete ? (
            'Re-validate Curriculum Alignment'
          ) : (
            'Validate Curriculum Alignment'
          )}
        </Button>
      </div>
      
      {renderResults()}
    </div>
  );
};

export default CurriculumAlignmentValidator;
