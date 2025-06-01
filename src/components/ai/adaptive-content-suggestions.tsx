'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  ExternalLink,
  Bookmark,
  Filter,
  Lightbulb,
  Eye,
  Headphones,
  FileText,
  Zap
} from 'lucide-react';

import { 
  LearnerProfile, 
  LearningPath, 
  SubjectArea, 
  LearningStyle, 
  KeyStage,
  ContentSuggestion
} from '@/lib/ai/guidanceTypes';
import { getAIGuidanceService } from '@/lib/ai/guidanceService';

// Mock learner profile for demonstration
const mockLearnerProfile: LearnerProfile = {
  id: 'learner-1',
  name: 'Alex Johnson',
  age: 12,
  keyStage: KeyStage.KS3,
  learningStyles: {
    [LearningStyle.VISUAL]: 60,
    [LearningStyle.AUDITORY]: 30,
    [LearningStyle.READING_WRITING]: 45,
    [LearningStyle.KINESTHETIC]: 40
  },
  subjectStrengths: {
    [SubjectArea.ENGLISH]: 75,
    [SubjectArea.MATHEMATICS]: 65,
    [SubjectArea.SCIENCE]: 80,
    [SubjectArea.HISTORY]: 70,
    [SubjectArea.GEOGRAPHY]: 60
  },
  subjectInterests: {
    [SubjectArea.SCIENCE]: 90,
    [SubjectArea.COMPUTING]: 85,
    [SubjectArea.HISTORY]: 75,
    [SubjectArea.ART_AND_DESIGN]: 65
  },
  previousAssessments: [],
  learningGoals: [],
  engagementMetrics: {
    averageSessionDuration: 25,
    sessionsPerWeek: 4,
    completionRate: 85,
    responseTime: 3.5,
    focusScore: 75,
    preferredTimeOfDay: 'afternoon',
    preferredContentTypes: ['videos', 'interactive'],
    challengeLevel: 3
  },
  lastUpdated: new Date()
};

// Mock learning path for demonstration
const mockLearningPath: LearningPath = {
  id: 'path-1',
  learnerId: 'learner-1',
  title: 'Personalised Science Learning Path',
  description: 'A customised learning journey for Science tailored to your Visual learning style.',
  subject: SubjectArea.SCIENCE,
  keyStage: KeyStage.KS3,
  objectives: [
    'Understand the scientific method and its applications',
    'Explore key concepts in biology, chemistry, and physics',
    'Develop practical scientific skills through experiments'
  ],
  estimatedDuration: 20,
  difficulty: 3,
  modules: [],
  adaptivityRules: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  completionStatus: 25,
  alignedToLearningStyle: LearningStyle.VISUAL
};

export default function AdaptiveContentSuggestions() {
  const [activeTab, setActiveTab] = useState<string>('for-you');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(mockLearnerProfile);
  const [currentLearningPath, setCurrentLearningPath] = useState<LearningPath | null>(mockLearningPath);
  
  // Generate content suggestions
  const generateContentSuggestions = async () => {
    setIsLoading(true);
    
    try {
      const guidanceService = getAIGuidanceService();
      const suggestions = await guidanceService.generateContentSuggestions(
        learnerProfile,
        currentLearningPath || undefined,
        6
      );
      
      setContentSuggestions(suggestions);
      
      toast({
        title: "Content Suggestions Generated",
        description: "Your personalised content suggestions are ready.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to generate content suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate content suggestions. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial suggestions
  useEffect(() => {
    generateContentSuggestions();
  }, []);
  
  // Get human-readable subject name
  const getSubjectName = (subject: SubjectArea): string => {
    switch (subject) {
      case SubjectArea.ENGLISH: return 'English';
      case SubjectArea.MATHEMATICS: return 'Mathematics';
      case SubjectArea.SCIENCE: return 'Science';
      case SubjectArea.COMPUTING: return 'Computing';
      case SubjectArea.HISTORY: return 'History';
      case SubjectArea.GEOGRAPHY: return 'Geography';
      case SubjectArea.LANGUAGES: return 'Languages';
      case SubjectArea.ART_AND_DESIGN: return 'Art and Design';
      case SubjectArea.MUSIC: return 'Music';
      case SubjectArea.PHYSICAL_EDUCATION: return 'Physical Education';
      case SubjectArea.DESIGN_AND_TECHNOLOGY: return 'Design and Technology';
      case SubjectArea.CITIZENSHIP: return 'Citizenship';
      case SubjectArea.PSHE: return 'PSHE';
      case SubjectArea.RELIGIOUS_EDUCATION: return 'Religious Education';
      default: return 'Unknown Subject';
    }
  };
  
  // Get human-readable learning style name
  const getLearningStyleName = (style: LearningStyle): string => {
    switch (style) {
      case LearningStyle.VISUAL: return 'Visual';
      case LearningStyle.AUDITORY: return 'Auditory';
      case LearningStyle.READING_WRITING: return 'Reading/Writing';
      case LearningStyle.KINESTHETIC: return 'Kinesthetic';
      case LearningStyle.MULTIMODAL: return 'Multimodal';
      default: return 'Unknown Style';
    }
  };
  
  // Get learning style icon
  const getLearningStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL: return <Eye className="h-4 w-4" />;
      case LearningStyle.AUDITORY: return <Headphones className="h-4 w-4" />;
      case LearningStyle.READING_WRITING: return <FileText className="h-4 w-4" />;
      case LearningStyle.KINESTHETIC: return <Zap className="h-4 w-4" />;
      case LearningStyle.MULTIMODAL: return <RefreshCw className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Eye className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'interactive': return <Zap className="h-4 w-4" />;
      case 'assessment': return <BookOpen className="h-4 w-4" />;
      case 'practise': return <RefreshCw className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  // Mock function to view content
  const viewContent = (suggestion: ContentSuggestion) => {
    toast({
      title: "Opening Content",
      description: `Opening ${suggestion.title}`,
      duration: 3000,
    });
  };
  
  // Mock function to save content
  const saveContent = (suggestion: ContentSuggestion) => {
    toast({
      title: "Content Saved",
      description: `${suggestion.title} has been saved to your library.`,
      duration: 3000,
    });
  };
  
  // Mock function to provide feedback
  const provideFeedback = (suggestion: ContentSuggestion, helpful: boolean) => {
    toast({
      title: "Feedback Recorded",
      description: `Thank you for your feedback. We'll use it to improve your suggestions.`,
      duration: 3000,
    });
  };
  
  // Get dominant learning style from suggestion
  const getDominantLearningStyle = (suggestion: ContentSuggestion): LearningStyle => {
    if (!suggestion.learningStyleAlignment || Object.keys(suggestion.learningStyleAlignment).length === 0) {
      return LearningStyle.MULTIMODAL;
    }
    
    let dominantStyle = LearningStyle.MULTIMODAL;
    let highestAlignment = 0;
    
    Object.entries(suggestion.learningStyleAlignment).forEach(([style, alignment]) => {
      if (alignment && alignment > highestAlignment) {
        highestAlignment = alignment;
        dominantStyle = style as LearningStyle;
      }
    });
    
    return dominantStyle;
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Adaptive Content Suggestions</h1>
      
      <div className="flex justify-between items-centre mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="by-subject">By Subject</TabsTrigger>
            <TabsTrigger value="by-style">By Learning Style</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          onClick={generateContentSuggestions} 
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Suggestions
            </>
          )}
        </Button>
      </div>
      
      {currentLearningPath && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Learning Path</CardTitle>
            <CardDescription>
              Content suggestions are tailored to complement your current learning journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-centre">
              <div>
                <h3 className="font-medium">{currentLearningPath.title}</h3>
                <p className="text-sm text-muted-foreground">{getSubjectName(currentLearningPath.subject)} • Key Stage {currentLearningPath.keyStage.replace('ks', '')}</p>
              </div>
              <div className="text-right">
                <div className="flex items-centre space-x-2">
                  <span className="text-sm font-medium">Progress:</span>
                  <Progress value={currentLearningPath.completionStatus} className="h-2 w-20" />
                  <span className="text-sm">{currentLearningPath.completionStatus}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <TabsContent value="for-you" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-20 bg-muted rounded mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : contentSuggestions.length > 0 ? (
            contentSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {getSubjectName(suggestion.subject)}
                    </Badge>
                  </div>
                  <CardDescription>{suggestion.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="flex items-centre gap-1">
                      {getContentTypeIcon(suggestion.contentType)}
                      {suggestion.contentType.charAt(0).toUpperCase() + suggestion.contentType.slice(1)}
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-centre gap-1">
                      {getLearningStyleIcon(getDominantLearningStyle(suggestion))}
                      {getLearningStyleName(getDominantLearningStyle(suggestion))}
                    </Badge>
                  </div>
                  
                  <div className="flex items-centre justify-between text-sm">
                    <div className="flex items-centre">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{suggestion.relevanceScore}% match</span>
                    </div>
                    <span className="text-muted-foreground">KS{suggestion.keyStage.replace('ks', '')}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Why this is suggested:</span> {suggestion.reason}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => provideFeedback(suggestion, true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => provideFeedback(suggestion, false)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Not for me
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => saveContent(suggestion)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => viewContent(suggestion)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-centre justify-centre py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Suggestions Yet</h3>
              <p className="text-muted-foreground text-centre max-w-md">
                We're still learning about your preferences. Complete more activities or refresh to get personalized content suggestions.
              </p>
              <Button 
                onClick={generateContentSuggestions} 
                className="mt-4"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Suggestions
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="by-subject" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Filter by subject UI would go here */}
          <div className="col-span-3 flex flex-col items-centre justify-centre py-12">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Subject Filtering</h3>
            <p className="text-muted-foreground text-centre max-w-md">
              In the full implementation, this tab would allow filtering content suggestions by subject area.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="by-style" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Filter by learning style UI would go here */}
          <div className="col-span-3 flex flex-col items-centre justify-centre py-12">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Learning Style Filtering</h3>
            <p className="text-muted-foreground text-centre max-w-md">
              In the full implementation, this tab would allow filtering content suggestions by learning style.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <div className="mt-8 bg-muted rounded-lg p-4">
        <h3 className="font-medium mb-2">How Content Suggestions Work</h3>
        <p className="text-sm mb-4">
          Our AI analyses your learning profile, current progress, and interests to suggest content that:
        </p>
        <ul className="text-sm space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Matches your dominant learning style ({getLearningStyleName(LearningStyle.VISUAL)})</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Aligns with UK curriculum for Key Stage {learnerProfile.keyStage.replace('ks', '')}</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Complements your current learning path</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Adapts based on your feedback and engagement</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
