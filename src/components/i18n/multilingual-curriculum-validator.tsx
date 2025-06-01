/**
 * Curriculum Alignment Validator for Multilingual Content
 * 
 * This component validates that translated content maintains alignment
 * with UK curriculum standards across all supported languages.
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { useI18n } from './i18n-provider';
import { SupportedLanguage } from '@/lib/i18n/types';
import { I18nService } from '@/lib/i18n/i18nService';

// Curriculum issue types
enum IssueType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Curriculum issue interface
interface CurriculumIssue {
  type: IssueType;
  message: string;
  element?: string;
  language: SupportedLanguage;
  curriculumReference?: string;
  recommendation?: string;
}

// Validation result interface
interface CurriculumValidationResult {
  language: SupportedLanguage;
  issueCount: {
    error: number;
    warning: number;
    info: number;
  };
  score: number; // 0-100
  issues: CurriculumIssue[];
  passedChecks: string[];
}

interface MultilingualCurriculumValidatorProps {
  contentId?: string;
  autoValidate?: boolean;
  className?: string;
}

export const MultilingualCurriculumValidator: React.FC<MultilingualCurriculumValidatorProps> = ({
  contentId,
  autoValidate = false,
  className = ''
}) => {
  const { t, currentLanguage } = useI18n();
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<CurriculumValidationResult[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const i18nService = I18nService.getInstance();
  
  // Run validation when component mounts if autoValidate is true
  useEffect(() => {
    if (autoValidate) {
      runValidation();
    }
  }, [autoValidate]);
  
  // Calculate overall score when results change
  useEffect(() => {
    if (results.length > 0) {
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      setOverallScore(Math.round(totalScore / results.length));
    } else {
      setOverallScore(0);
    }
  }, [results]);
  
  // Run validation for all enabled languages
  const runValidation = async () => {
    try {
      setIsValidating(true);
      setError(null);
      
      const enabledLanguages = i18nService.getEnabledLanguages();
      const validationResults: CurriculumValidationResult[] = [];
      
      // In a real implementation, this would perform actual validation
      // For now, we'll use mock data
      for (const language of enabledLanguages) {
        // Simulate validation delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock validation result
        const mockResult = generateMockValidationResult(language);
        validationResults.push(mockResult);
      }
      
      setResults(validationResults);
      setSelectedLanguage(currentLanguage);
      setIsValidating(false);
    } catch (err) {
      console.error('Error validating curriculum alignment:', err);
      setError(t('validation_error', 'curriculum'));
      setIsValidating(false);
    }
  };
  
  // Generate mock validation result for a language
  const generateMockValidationResult = (language: SupportedLanguage): CurriculumValidationResult => {
    // For demo purposes, English has the best score, others have random scores
    const isEnglish = language === SupportedLanguage.ENGLISH_UK;
    const isWelsh = language === SupportedLanguage.WELSH;
    
    // Generate random scores, with English having fewer issues
    const errorCount = isEnglish ? 0 : Math.floor(Math.random() * 3);
    const warningCount = isEnglish ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5);
    const infoCount = Math.floor(Math.random() * 4);
    
    // Calculate score (0-100)
    const score = Math.max(0, Math.min(100, 100 - (errorCount * 15) - (warningCount * 5)));
    
    // Generate mock issues
    const issues: CurriculumIssue[] = [];
    
    // Add Welsh-specific issues if applicable (Welsh language has specific curriculum requirements)
    if (isWelsh) {
      issues.push({
        type: IssueType.INFO,
        message: 'Welsh language curriculum terminology needs review',
        element: 'section.key-stage-description',
        language,
        curriculumReference: 'Curriculum for Wales',
        recommendation: 'Ensure Welsh curriculum terminology aligns with official Curriculum for Wales documentation'
      });
    }
    
    // Add some common curriculum issues
    if (errorCount > 0) {
      issues.push({
        type: IssueType.ERROR,
        message: 'Key Stage terminology inconsistency',
        element: 'div.curriculum-section',
        language,
        curriculumReference: 'UK National Curriculum KS2',
        recommendation: 'Ensure Key Stage terminology is consistent with UK National Curriculum'
      });
    }
    
    if (warningCount > 0) {
      issues.push({
        type: IssueType.WARNING,
        message: 'Subject-specific vocabulary translation needs review',
        element: '.science-terms',
        language,
        curriculumReference: 'Science Programme of Study',
        recommendation: 'Review science terminology translation with subject matter experts'
      });
    }
    
    if (!isEnglish) {
      issues.push({
        type: IssueType.WARNING,
        message: 'Assessment criteria translation may not reflect UK standards',
        element: '.assessment-criteria',
        language,
        curriculumReference: 'Assessment Framework',
        recommendation: 'Ensure assessment criteria translations maintain alignment with UK standards'
      });
    }
    
    // Add some passed checks
    const passedChecks = [
      'Year group designations correctly translated',
      'Subject names properly aligned with curriculum',
      'Learning objectives maintain curriculum intent',
      'Educational standards terminology is consistent',
      'Progression pathways maintain correct sequence'
    ];
    
    return {
      language,
      issueCount: {
        error: errorCount,
        warning: warningCount,
        info: infoCount
      },
      score,
      issues,
      passedChecks
    };
  };
  
  // Get selected language result
  const getSelectedResult = (): CurriculumValidationResult | undefined => {
    return results.find(result => result.language === selectedLanguage);
  };
  
  // Get score colour based on value
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get progress colour based on score
  const getProgressColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Get language name
  const getLanguageName = (code: SupportedLanguage): string => {
    const metadata = i18nService.getLanguageMetadata(code);
    return metadata ? metadata.englishName : code;
  };
  
  // Render issue badge
  const renderIssueBadge = (type: IssueType, count: number) => {
    if (count === 0) return null;
    
    let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
    let icon = null;
    
    switch (type) {
      case IssueType.ERROR:
        variant = 'destructive';
        icon = <AlertCircle className="h-3 w-3 mr-1" />;
        break;
      case IssueType.WARNING:
        variant = 'secondary';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      case IssueType.INFO:
        variant = 'outline';
        break;
    }
    
    return (
      <Badge variant={variant} className="ml-2 flex items-centre">
        {icon}
        {count}
      </Badge>
    );
  };
  
  // If validating, show loading state
  if (isValidating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('curriculum_validator', 'curriculum')}</CardTitle>
          <CardDescription>
            {t('curriculum_validator_description', 'curriculum')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-centre justify-centre p-6 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <div className="text-centre">
            <p>{t('validating_curriculum', 'curriculum')}</p>
            <p className="text-sm text-muted-foreground">
              {t('validating_languages', 'curriculum')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get selected result
  const selectedResult = getSelectedResult();
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-centre justify-between">
          <div>
            <CardTitle>{t('curriculum_validator', 'curriculum')}</CardTitle>
            <CardDescription>
              {t('curriculum_validator_description', 'curriculum')}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runValidation}
            disabled={isValidating}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('run_validation', 'curriculum')}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="flex items-centre text-destructive p-4 border border-destructive/20 rounded-md bg-destructive/10">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-centre justify-centre p-6 space-y-4 text-centre">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <div>
              <p>{t('no_validation_results', 'curriculum')}</p>
              <p className="text-sm text-muted-foreground">
                {t('run_validation_prompt', 'curriculum')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall score */}
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <h3 className="text-lg font-medium">
                  {t('overall_score', 'curriculum')}
                </h3>
                <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}/100
                </span>
              </div>
              <Progress value={overallScore} className={getProgressColor(overallScore)} />
              <p className="text-sm text-muted-foreground">
                {overallScore >= 90
                  ? t('excellent_alignment', 'curriculum')
                  : overallScore >= 70
                  ? t('good_alignment', 'curriculum')
                  : t('poor_alignment', 'curriculum')}
              </p>
            </div>
            
            {/* Language tabs */}
            <Tabs 
              value={selectedLanguage} 
              onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
              className="w-full"
            >
              <TabsList className="w-full overflow-x-auto flex-wrap">
                {results.map(result => (
                  <TabsTrigger key={result.language} value={result.language} className="flex items-centre">
                    {getLanguageName(result.language)}
                    {renderIssueBadge(IssueType.ERROR, result.issueCount.error)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {results.map(result => (
                <TabsContent key={result.language} value={result.language} className="space-y-4">
                  {/* Language score */}
                  <div className="flex items-centre justify-between">
                    <h3 className="font-medium">
                      {t('language_score', 'curriculum')}
                    </h3>
                    <span className={`text-xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </span>
                  </div>
                  
                  {/* Issues summary */}
                  <div className="flex items-centre space-x-4">
                    <div className="flex items-centre">
                      <span className="text-destructive mr-1">{t('errors', 'curriculum')}:</span>
                      <span className="font-medium">{result.issueCount.error}</span>
                    </div>
                    <div className="flex items-centre">
                      <span className="text-amber-500 mr-1">{t('warnings', 'curriculum')}:</span>
                      <span className="font-medium">{result.issueCount.warning}</span>
                    </div>
                    <div className="flex items-centre">
                      <span className="text-muted-foreground mr-1">{t('info', 'curriculum')}:</span>
                      <span className="font-medium">{result.issueCount.info}</span>
                    </div>
                  </div>
                  
                  {/* Issues list */}
                  {result.issues.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">{t('issues_found', 'curriculum')}</h4>
                      <div className="space-y-2">
                        {result.issues.map((issue, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md ${
                              issue.type === IssueType.ERROR 
                                ? 'bg-destructive/10 border border-destructive/20' 
                                : issue.type === IssueType.WARNING
                                ? 'bg-amber-500/10 border border-amber-500/20'
                                : 'bg-muted border border-muted-foreground/20'
                            }`}
                          >
                            <div className="flex items-start">
                              {issue.type === IssueType.ERROR ? (
                                <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                              ) : issue.type === IssueType.WARNING ? (
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                              ) : (
                                <span className="h-5 w-5 mr-2" />
                              )}
                              <div className="space-y-1">
                                <p className="font-medium">{issue.message}</p>
                                {issue.element && (
                                  <p className="text-sm">
                                    <span className="font-medium">{t('element', 'curriculum')}:</span> {issue.element}
                                  </p>
                                )}
                                {issue.curriculumReference && (
                                  <p className="text-sm">
                                    <span className="font-medium">{t('reference', 'curriculum')}:</span> {issue.curriculumReference}
                                  </p>
                                )}
                                {issue.recommendation && (
                                  <p className="text-sm">
                                    <span className="font-medium">{t('recommendation', 'curriculum')}:</span> {issue.recommendation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-centre text-green-500 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>{t('no_issues_found', 'curriculum')}</span>
                    </div>
                  )}
                  
                  {/* Passed checks */}
                  <div className="space-y-2">
                    <h4 className="font-medium">{t('passed_checks', 'curriculum')}</h4>
                    <div className="space-y-1">
                      {result.passedChecks.map((check, index) => (
                        <div key={index} className="flex items-centre">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {t('uk_curriculum_compliance_note', 'curriculum')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MultilingualCurriculumValidator;
