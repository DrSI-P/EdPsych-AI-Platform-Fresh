'use client';

import React, { useState, useEffect } from 'react';
import { 
  ContentDocument,
  KeyStage
} from '@/lib/content-creation/types';
import { getContentCreationService } from '@/lib/content-creation/contentCreationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, AlertTriangle, CheckCircle2, BookOpen, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface CurriculumAlignmentCheckerProps {
  contentId?: string;
  content: ContentDocument;
  onResults?: (results: any) => void;
  onClose?: () => void;
}

export const CurriculumAlignmentChecker: React.FC<CurriculumAlignmentCheckerProps> = ({
  contentId,
  content,
  onResults,
  onClose
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    alignmentScore: number;
    suggestions: string[];
    curriculumLinks: string[];
  } | null>(null);
  
  const { toast } = useToast();
  
  // Run curriculum alignment check
  const runCurriculumCheck = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      if (contentId) {
        // If we have a contentId, use the API
        const contentService = getContentCreationService();
        const checkResults = await contentService.checkCurriculumAlignment(contentId);
        setResults(checkResults);
        
        if (onResults) {
          onResults(checkResults);
        }
      } else {
        // Otherwise, run a local check with mock data
        // In a real implementation, this would analyse the content directly
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get curriculum links based on key stage
        const curriculumLinks = getCurriculumLinks(content.metadata.keyStage);
        
        // Mock results based on content
        const mockResults = {
          alignmentScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          suggestions: [
            'Consider adding more explicit links to curriculum objectives',
            'Include assessment criteria aligned with national standards',
            'Add differentiation strategies for various ability levels'
          ],
          curriculumLinks
        }
        
        // Add more specific suggestions based on content analysis
        if (content.elements.length < 5) {
          mockResults.suggestions.push('Add more content to fully cover the curriculum requirements');
          mockResults.alignmentScore -= 5;
        }
        
        if (!content.metadata.learningObjectives || content.metadata.learningObjectives.length === 0) {
          mockResults.suggestions.push('Define clear learning objectives aligned with the curriculum');
          mockResults.alignmentScore -= 10;
        }
        
        setResults(mockResults);
        
        if (onResults) {
          onResults(mockResults);
        }
      }
    } catch (error) {
      console.error('Failed to check curriculum alignment:', error);
      setError('Failed to check curriculum alignment. Please try again.');
      toast({
        variant: "destructive",
        title: "Curriculum check failed",
        description: "There was a problem checking the curriculum alignment of your content.",
      });
    } finally {
      setIsChecking(false);
    }
  }
  
  // Get curriculum links based on key stage
  const getCurriculumLinks = (keyStage: KeyStage): string[] => {
    switch (keyStage) {
      case KeyStage.EARLY_YEARS:
        return [
          'Early Years Foundation Stage (EYFS) Framework',
          'Communication and Language',
          'Physical Development',
          'Personal, Social and Emotional Development',
          'Literacy',
          'Mathematics',
          'Understanding the World',
          'Expressive Arts and Design'
        ];
      case KeyStage.KS1:
        return [
          'National Curriculum Key Stage 1',
          'English - Reading, Writing, Spoken Language',
          'Mathematics - Number, Measurement, Geometry',
          'Science - Plants, Animals, Materials, Seasonal Changes',
          'Computing - Algorithms, Creating Programs, Safe Technology Use',
          'Design and Technology - Design, Make, Evaluate',
          'History - Changes within Living Memory, Significant Events',
          'Geography - Locational Knowledge, Place Knowledge'
        ];
      case KeyStage.KS2:
        return [
          'National Curriculum Key Stage 2',
          'English - Reading, Writing, Grammar, Punctuation',
          'Mathematics - Number, Calculation, Fractions, Measurement',
          'Science - Living Things, Materials, Physical Processes',
          'Computing - Networks, Programming, Data',
          'History - Ancient Civilisations, British History',
          'Geography - Maps, Fieldwork, Human and Physical Geography',
          'Languages - Listening, Speaking, Reading, Writing'
        ];
      case KeyStage.KS3:
        return [
          'National Curriculum Key Stage 3',
          'English - Reading, Writing, Grammar, Literature',
          'Mathematics - Number, Algebra, Geometry, Probability',
          'Science - Biology, Chemistry, Physics',
          'Computing - Programming, Digital Literacy, IT',
          'History - Medieval to Modern History',
          'Geography - Physical, Human, Environmental',
          'Modern Foreign Languages - Communication, Culture'
        ];
      case KeyStage.KS4:
        return [
          'GCSE Curriculum Framework',
          'English Language and Literature',
          'Mathematics - Foundation and Higher',
          'Science - Combined or Separate Sciences',
          'Computing and Computer Science',
          'History - Thematic Studies, Period Studies',
          'Geography - Physical, Human, Fieldwork',
          'Modern Foreign Languages - Listening, Speaking, Reading, Writing'
        ];
      case KeyStage.KS5:
        return [
          'A-Level Curriculum Framework',
          'Subject-Specific Content and Assessment Objectives',
          'Independent Research and Extended Project',
          'Critical Thinking and Analysis',
          'Academic Writing and Communication',
          'Preparation for Higher Education',
          'Specialist Subject Knowledge',
          'Advanced Skills Development'
        ];
      default:
        return [
          'National Curriculum Framework',
          'Subject-Specific Content and Skills',
          'Assessment Standards and Criteria'
        ];
    }
  }
  
  // Run check on mount
  useEffect(() => {
    runCurriculumCheck();
  }, [contentId, content]);
  
  // Get score colour
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-lime-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  }
  
  // Get score text
  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent Alignment';
    if (score >= 80) return 'Good Alignment';
    if (score >= 70) return 'Satisfactory Alignment';
    if (score >= 60) return 'Partial Alignment';
    return 'Poor Alignment';
  }
  
  return (
    <div className="curriculum-alignment-checker">
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
          <p className="text-lg font-medium">Checking curriculum alignment...</p>
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
                  className={`${getScoreColor(results.alignmentScore)} stroke-current`}
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={`${results.alignmentScore * 2.51} 251`}
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
                  {results.alignmentScore}
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
            <h2 className="text-2xl font-bold">{getScoreText(results.alignmentScore)}</h2>
            <p className="text-muted-foreground">
              {results.suggestions.length === 0 
                ? 'No improvement suggestions found.' 
                : `${results.suggestions.length} suggestion${results.suggestions.length === 1 ? '' : 's'} for improvement.`}
            </p>
          </div>
          
          <Separator />
          
          <div className="suggestions-section p-4">
            <h3 className="text-lg font-medium mb-4">Improvement Suggestions</h3>
            
            {results.suggestions.length === 0 ? (
              <div className="text-centre p-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Perfect alignment!</p>
                <p className="text-muted-foreground">Your content is well-aligned with curriculum standards.</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {results.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          
          <div className="curriculum-links-section p-4">
            <h3 className="text-lg font-medium mb-4">Curriculum Links</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your content aligns with the following curriculum areas for {content.metadata.keyStage.replace('_', ' ')}:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.curriculumLinks.map((link, index) => (
                <div key={index} className="flex items-centre gap-2 p-2 border rounded-md">
                  {index === 0 ? (
                    <BookOpen className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <p className={index === 0 ? 'font-medium' : ''}>{link}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="key-stage-section p-4">
            <h3 className="text-lg font-medium mb-2">Key Stage Appropriateness</h3>
            
            <div className="grid grid-cols-6 gap-1 mb-4">
              {Object.values(KeyStage).map((stage) => (
                <Badge 
                  key={stage} 
                  variant={content.metadata.keyStage === stage ? "default" : "outline"}
                  className="justify-centre"
                >
                  {stage.replace('_', ' ')}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm">
              This content is designed for <span className="font-medium">{content.metadata.keyStage.replace('_', ' ')}</span> students.
              {content.metadata.keyStage === KeyStage.KS1 && ' Ages 5-7, Years 1-2.'}
              {content.metadata.keyStage === KeyStage.KS2 && ' Ages 7-11, Years 3-6.'}
              {content.metadata.keyStage === KeyStage.KS3 && ' Ages 11-14, Years 7-9.'}
              {content.metadata.keyStage === KeyStage.KS4 && ' Ages 14-16, Years 10-11.'}
              {content.metadata.keyStage === KeyStage.KS5 && ' Ages 16-18, Years 12-13.'}
              {content.metadata.keyStage === KeyStage.EARLY_YEARS && ' Ages 3-5, Reception.'}
            </p>
          </div>
          
          <div className="actions-section p-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CurriculumAlignmentChecker;
