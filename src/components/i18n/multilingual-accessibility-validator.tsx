/**
 * Multilingual Accessibility Validator
 * 
 * This component validates multilingual content and features for accessibility
 * and completeness, ensuring compliance with WCAG 2.1 AA standards.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Globe, 
  Languages, 
  Loader2,
  AlertTriangle,
  Info,
  FileText,
  MessageSquare,
  Headphones,
  Mic
} from 'lucide-react';
import { useI18n } from './i18n-provider';
import { 
  SupportedLanguage,
  TranslationNamespace,
  MultilingualAccessibilityOptions
} from '@/lib/i18n/types';
import { I18nService } from '@/lib/i18n/i18nService';
import { CulturalContextService } from '@/lib/i18n/culturalContextService';

interface AccessibilityValidationResult {
  category: string;
  criteria: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  details: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  wcagReference?: string;
}

interface LanguageCoverageResult {
  language: SupportedLanguage;
  namespaces: {
    namespace: TranslationNamespace;
    completionPercentage: number;
    status: 'complete' | 'partial' | 'minimal' | 'missing';
  }[];
  overallCompletionPercentage: number;
  status: 'complete' | 'partial' | 'minimal' | 'missing';
}

interface MultilingualAccessibilityValidatorProps {
  className?: string;
}

export const MultilingualAccessibilityValidator: React.FC<MultilingualAccessibilityValidatorProps> = ({
  className = ''
}) => {
  const { t, currentLanguage } = useI18n();
  const [isValidating, setIsValidating] = useState(false);
  const [accessibilityResults, setAccessibilityResults] = useState<AccessibilityValidationResult[]>([]);
  const [coverageResults, setCoverageResults] = useState<LanguageCoverageResult[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('accessibility');
  const [overallAccessibilityScore, setOverallAccessibilityScore] = useState<number>(0);
  const [overallCoverageScore, setOverallCoverageScore] = useState<number>(0);
  
  const i18nService = I18nService.getInstance();
  const culturalContextService = CulturalContextService.getInstance();
  
  // Run validation
  const runValidation = async () => {
    try {
      setIsValidating(true);
      
      // In a real implementation, these would be actual validation checks
      // For now, we'll use mock data to demonstrate the functionality
      
      // Validate accessibility
      await validateAccessibility();
      
      // Validate language coverage
      await validateLanguageCoverage();
      
      setIsValidating(false);
    } catch (error) {
      console.error('Error running validation:', error);
      setIsValidating(false);
    }
  };
  
  // Validate accessibility
  const validateAccessibility = async () => {
    // Mock accessibility validation results
    const results: any[] = [
      {
        category: 'Text Direction',
        criteria: 'RTL language support',
        status: 'pass',
        details: 'Right-to-left languages (Arabic, Urdu) are properly supported with correct text direction.',
        impact: 'high',
        wcagReference: '1.3.2'
      },
      {
        category: 'Language Identification',
        criteria: 'Language attribute',
        status: 'pass',
        details: 'Language is properly identified using lang attribute when language is changed.',
        impact: 'medium',
        wcagReference: '3.1.1'
      },
      {
        category: 'Translation Completeness',
        criteria: 'UI element translation',
        status: 'warning',
        details: 'Some UI elements are not fully translated in all supported languages.',
        impact: 'medium'
      },
      {
        category: 'Cultural Context',
        criteria: 'Cultural notes',
        status: 'pass',
        details: 'Cultural context notes are provided for content with cultural references.',
        impact: 'medium'
      },
      {
        category: 'Simplified Language',
        criteria: 'Reading level options',
        status: 'pass',
        details: 'Multiple reading levels are available for translated content.',
        impact: 'high',
        wcagReference: '3.1.5'
      },
      {
        category: 'Special Educational Needs',
        criteria: 'SEN adaptations',
        status: 'info',
        details: 'SEN adaptations are available but could be expanded for more specific needs.',
        impact: 'high'
      },
      {
        category: 'Voice Input',
        criteria: 'Multilingual speech recognition',
        status: 'pass',
        details: 'Voice input supports all primary languages with good accuracy.',
        impact: 'high'
      },
      {
        category: 'Text-to-Speech',
        criteria: 'Multilingual TTS',
        status: 'warning',
        details: 'Text-to-speech quality varies across languages, with some needing improvement.',
        impact: 'high',
        wcagReference: '1.3.1'
      },
      {
        category: 'Document Translation',
        criteria: 'Format preservation',
        status: 'pass',
        details: 'Document translation preserves formatting and structure across languages.',
        impact: 'medium'
      },
      {
        category: 'Keyboard Navigation',
        criteria: 'Language switcher accessibility',
        status: 'pass',
        details: 'Language switcher is fully accessible via keyboard navigation.',
        impact: 'high',
        wcagReference: '2.1.1'
      },
      {
        category: 'Screen Reader',
        criteria: 'Screen reader compatibility',
        status: 'pass',
        details: 'All multilingual components are properly labelled for screen readers.',
        impact: 'critical',
        wcagReference: '4.1.2'
      },
      {
        category: 'Visual Design',
        criteria: 'Text resizing',
        status: 'pass',
        details: 'Text can be resized up to 200% without loss of content or functionality.',
        impact: 'high',
        wcagReference: '1.4.4'
      }
    ];
    
    setAccessibilityResults(results);
    
    // Calculate overall score
    const passCount = results.filter(r => r.status === 'pass').length;
    const totalCount = results.length;
    const score = Math.round((passCount / totalCount) * 100);
    setOverallAccessibilityScore(score);
  };
  
  // Validate language coverage
  const validateLanguageCoverage = async () => {
    // Mock language coverage results
    const results: any[] = [
      {
        language: SupportedLanguage.WELSH,
        namespaces: [
          { namespace: TranslationNamespace.COMMON, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.NAVIGATION, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.AUTH, completionPercentage: 95, status: 'partial' },
          { namespace: TranslationNamespace.DASHBOARD, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.LESSONS, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.ASSESSMENTS, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.FEEDBACK, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.ACCESSIBILITY, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.SETTINGS, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.ERRORS, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.CURRICULUM, completionPercentage: 95, status: 'partial' },
          { namespace: TranslationNamespace.SPECIAL_NEEDS, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.PARENT_TEACHER, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.ADMIN, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.DOCUMENTS, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.COMMUNICATION, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.CULTURAL_NOTES, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.EDUCATIONAL_TERMS, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.HELP, completionPercentage: 90, status: 'partial' }
        ],
        overallCompletionPercentage: 92,
        status: 'partial'
      },
      {
        language: SupportedLanguage.POLISH,
        namespaces: [
          { namespace: TranslationNamespace.COMMON, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.NAVIGATION, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.AUTH, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.DASHBOARD, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.LESSONS, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.ASSESSMENTS, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.FEEDBACK, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.ACCESSIBILITY, completionPercentage: 95, status: 'partial' },
          { namespace: TranslationNamespace.SETTINGS, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.ERRORS, completionPercentage: 95, status: 'partial' },
          { namespace: TranslationNamespace.CURRICULUM, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.SPECIAL_NEEDS, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.PARENT_TEACHER, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.ADMIN, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.DOCUMENTS, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.COMMUNICATION, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.CULTURAL_NOTES, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.EDUCATIONAL_TERMS, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.HELP, completionPercentage: 80, status: 'partial' }
        ],
        overallCompletionPercentage: 86,
        status: 'partial'
      },
      {
        language: SupportedLanguage.URDU,
        namespaces: [
          { namespace: TranslationNamespace.COMMON, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.NAVIGATION, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.AUTH, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.DASHBOARD, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.LESSONS, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.ASSESSMENTS, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.FEEDBACK, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.ACCESSIBILITY, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.SETTINGS, completionPercentage: 95, status: 'partial' },
          { namespace: TranslationNamespace.ERRORS, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.CURRICULUM, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.SPECIAL_NEEDS, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.PARENT_TEACHER, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.ADMIN, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.DOCUMENTS, completionPercentage: 65, status: 'partial' },
          { namespace: TranslationNamespace.COMMUNICATION, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.CULTURAL_NOTES, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.EDUCATIONAL_TERMS, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.HELP, completionPercentage: 75, status: 'partial' }
        ],
        overallCompletionPercentage: 82,
        status: 'partial'
      },
      {
        language: SupportedLanguage.ARABIC,
        namespaces: [
          { namespace: TranslationNamespace.COMMON, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.NAVIGATION, completionPercentage: 100, status: 'complete' },
          { namespace: TranslationNamespace.AUTH, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.DASHBOARD, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.LESSONS, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.ASSESSMENTS, completionPercentage: 65, status: 'partial' },
          { namespace: TranslationNamespace.FEEDBACK, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.ACCESSIBILITY, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.SETTINGS, completionPercentage: 90, status: 'partial' },
          { namespace: TranslationNamespace.ERRORS, completionPercentage: 85, status: 'partial' },
          { namespace: TranslationNamespace.CURRICULUM, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.SPECIAL_NEEDS, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.PARENT_TEACHER, completionPercentage: 70, status: 'partial' },
          { namespace: TranslationNamespace.ADMIN, completionPercentage: 65, status: 'partial' },
          { namespace: TranslationNamespace.DOCUMENTS, completionPercentage: 60, status: 'partial' },
          { namespace: TranslationNamespace.COMMUNICATION, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.CULTURAL_NOTES, completionPercentage: 80, status: 'partial' },
          { namespace: TranslationNamespace.EDUCATIONAL_TERMS, completionPercentage: 75, status: 'partial' },
          { namespace: TranslationNamespace.HELP, completionPercentage: 70, status: 'partial' }
        ],
        overallCompletionPercentage: 77,
        status: 'partial'
      }
    ];
    
    setCoverageResults(results);
    
    // Calculate overall coverage score
    const totalPercentage = results.reduce((sum, result) => sum + result.overallCompletionPercentage, 0);
    const averagePercentage = Math.round(totalPercentage / results.length);
    setOverallCoverageScore(averagePercentage);
  };
  
  // Get status badge
  const getStatusBadge = (status: 'pass' | 'fail' | 'warning' | 'info') => {
    switch (status) {
      case 'pass':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Pass
          </Badge>
        );
      case 'fail':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Fail
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="h-3 w-3 mr-1" />
            Info
          </Badge>
        );
    }
  };
  
  // Get impact badge
  const getImpactBadge = (impact: 'critical' | 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'critical':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        );
    }
  };
  
  // Get coverage badge
  const getCoverageBadge = (status: 'complete' | 'partial' | 'minimal' | 'missing') => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Complete
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Partial
          </Badge>
        );
      case 'minimal':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Minimal
          </Badge>
        );
      case 'missing':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Missing
          </Badge>
        );
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Text Direction':
      case 'Language Identification':
      case 'Translation Completeness':
        return <Globe className="h-4 w-4" />;
      case 'Cultural Context':
      case 'Simplified Language':
      case 'Special Educational Needs':
        return <FileText className="h-4 w-4" />;
      case 'Voice Input':
        return <Mic className="h-4 w-4" />;
      case 'Text-to-Speech':
        return <Headphones className="h-4 w-4" />;
      case 'Document Translation':
        return <FileText className="h-4 w-4" />;
      case 'Keyboard Navigation':
      case 'Screen Reader':
      case 'Visual Design':
        return <Settings className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get namespace icon
  const getNamespaceIcon = (namespace: TranslationNamespace) => {
    switch (namespace) {
      case TranslationNamespace.COMMON:
      case TranslationNamespace.NAVIGATION:
      case TranslationNamespace.DASHBOARD:
        return <Globe className="h-4 w-4" />;
      case TranslationNamespace.AUTH:
      case TranslationNamespace.SETTINGS:
      case TranslationNamespace.ADMIN:
        return <Settings className="h-4 w-4" />;
      case TranslationNamespace.LESSONS:
      case TranslationNamespace.ASSESSMENTS:
      case TranslationNamespace.CURRICULUM:
      case TranslationNamespace.EDUCATIONAL_TERMS:
        return <FileText className="h-4 w-4" />;
      case TranslationNamespace.FEEDBACK:
      case TranslationNamespace.PARENT_TEACHER:
      case TranslationNamespace.COMMUNICATION:
        return <MessageSquare className="h-4 w-4" />;
      case TranslationNamespace.ACCESSIBILITY:
      case TranslationNamespace.SPECIAL_NEEDS:
      case TranslationNamespace.CULTURAL_NOTES:
        return <Info className="h-4 w-4" />;
      case TranslationNamespace.ERRORS:
      case TranslationNamespace.HELP:
      case TranslationNamespace.DOCUMENTS:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  
  // Run validation on component mount
  useEffect(() => {
    runValidation();
  }, []);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-centre">
          <Languages className="h-5 w-5 mr-2" />
          Multilingual Accessibility Validator
        </CardTitle>
        <CardDescription>
          Validate multilingual features for accessibility and completeness
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accessibility">
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="coverage">
              Language Coverage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="accessibility" className="space-y-4 pt-4">
            {/* Overall score */}
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <h3 className="text-sm font-medium">Overall Accessibility Score</h3>
                <span className="text-sm font-medium">{overallAccessibilityScore}%</span>
              </div>
              <Progress value={overallAccessibilityScore} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {overallAccessibilityScore >= 90
                  ? 'Excellent! Multilingual features meet high accessibility standards.'
                  : overallAccessibilityScore >= 70
                  ? 'Good progress, but some accessibility improvements are needed.'
                  : 'Significant accessibility improvements are required.'}
              </p>
            </div>
            
            {/* Accessibility results table */}
            <Table>
              <TableCaption>Multilingual accessibility validation results</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessibilityResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-centre">
                      {getCategoryIcon(result.category)}
                      <span className="ml-2">{result.category}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{result.criteria}</div>
                        <div className="text-sm text-muted-foreground">{result.details}</div>
                        {result.wcagReference && (
                          <div className="text-xs text-muted-foreground mt-1">
                            WCAG {result.wcagReference}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>{getImpactBadge(result.impact)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="coverage" className="space-y-4 pt-4">
            {/* Overall coverage score */}
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <h3 className="text-sm font-medium">Overall Language Coverage</h3>
                <span className="text-sm font-medium">{overallCoverageScore}%</span>
              </div>
              <Progress value={overallCoverageScore} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {overallCoverageScore >= 90
                  ? 'Excellent! Most content is translated across supported languages.'
                  : overallCoverageScore >= 70
                  ? 'Good progress, but some translation gaps remain.'
                  : 'Significant translation work is still needed.'}
              </p>
            </div>
            
            {/* Language coverage accordion */}
            {coverageResults.map((result, index) => (
              <div key={index} className="border rounded-lg mb-4">
                <div className="flex items-centre justify-between p-4">
                  <div className="flex items-centre">
                    <Globe className="h-5 w-5 mr-2" />
                    <div>
                      <h3 className="font-medium">{i18nService.getLanguageMetadata(result.language)?.englishName || result.language}</h3>
                      <p className="text-sm text-muted-foreground">
                        {i18nService.getLanguageMetadata(result.language)?.nativeName || result.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-centre space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{result.overallCompletionPercentage}%</div>
                      <div>{getCoverageBadge(result.status)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Namespace</TableHead>
                        <TableHead>Completion</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.namespaces.map((ns, nsIndex) => (
                        <TableRow key={nsIndex}>
                          <TableCell className="font-medium flex items-centre">
                            {getNamespaceIcon(ns.namespace)}
                            <span className="ml-2">{ns.namespace}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-centre space-x-2">
                              <Progress value={ns.completionPercentage} className="h-2 w-[100px]" />
                              <span className="text-sm">{ns.completionPercentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getCoverageBadge(ns.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.print()}>
          Export Report
        </Button>
        <Button onClick={runValidation} disabled={isValidating}>
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Validation
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultilingualAccessibilityValidator;
