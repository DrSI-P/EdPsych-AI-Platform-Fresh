'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  BarChart, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  Award, 
  Layers, 
  RefreshCw,
  Eye,
  Download,
  Share2
} from 'lucide-react';

import { 
  LearnerProfile, 
  LearningPath, 
  SubjectArea, 
  LearningStyle, 
  KeyStage 
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

export default function LearningPathRecommendations() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectArea>(SubjectArea.SCIENCE);
  const [duration, setDuration] = useState<number>(4); // weeks
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(mockLearnerProfile);
  
  // Generate learning path
  const generateLearningPath = async () => {
    setIsLoading(true);
    
    try {
      const guidanceService = getAIGuidanceService();
      const path = await guidanceService.generateLearningPath(
        learnerProfile,
        selectedSubject,
        duration
      );
      
      setLearningPath(path);
      
      toast({
        title: "Learning Path Generated",
        description: `Your personalised ${getSubjectName(selectedSubject)} learning path is ready.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to generate learning path:', error);
      toast({
        title: "Error",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
      case LearningStyle.VISUAL: return '👁️';
      case LearningStyle.AUDITORY: return '👂';
      case LearningStyle.READING_WRITING: return '📝';
      case LearningStyle.KINESTHETIC: return '🤸';
      case LearningStyle.MULTIMODAL: return '🔄';
      default: return '❓';
    }
  };
  
  // Get difficulty level name
  const getDifficultyName = (level: number): string => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Elementary';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };
  
  // Mock function to start learning path
  const startLearningPath = () => {
    toast({
      title: "Learning Path Started",
      description: "You've started your personalised learning journey.",
      duration: 3000,
    });
  };
  
  // Mock function to save learning path
  const saveLearningPath = () => {
    toast({
      title: "Learning Path Saved",
      description: "Your personalised learning path has been saved.",
      duration: 3000,
    });
  };
  
  // Mock function to share learning path
  const shareLearningPath = () => {
    toast({
      title: "Learning Path Shared",
      description: "Your personalised learning path has been shared with your teacher.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Personalised Learning Path Recommendations</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Your Learning Path</CardTitle>
          <CardDescription>
            Our AI will create a personalised learning path tailored to your learning style, strengths, and interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as SubjectArea)}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SubjectArea.ENGLISH}>English</SelectItem>
                    <SelectItem value={SubjectArea.MATHEMATICS}>Mathematics</SelectItem>
                    <SelectItem value={SubjectArea.SCIENCE}>Science</SelectItem>
                    <SelectItem value={SubjectArea.COMPUTING}>Computing</SelectItem>
                    <SelectItem value={SubjectArea.HISTORY}>History</SelectItem>
                    <SelectItem value={SubjectArea.GEOGRAPHY}>Geography</SelectItem>
                    <SelectItem value={SubjectArea.ART_AND_DESIGN}>Art and Design</SelectItem>
                    <SelectItem value={SubjectArea.MUSIC}>Music</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 week</SelectItem>
                    <SelectItem value="2">2 weeks</SelectItem>
                    <SelectItem value="4">4 weeks</SelectItem>
                    <SelectItem value="6">6 weeks</SelectItem>
                    <SelectItem value="8">8 weeks</SelectItem>
                    <SelectItem value="12">12 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateLearningPath} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Learning Path
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-2">Your Learning Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Dominant Learning Style</p>
                  <div className="flex items-centre space-x-2">
                    <span className="text-xl">{getLearningStyleIcon(LearningStyle.VISUAL)}</span>
                    <span>{getLearningStyleName(LearningStyle.VISUAL)}</span>
                    <Progress value={60} className="h-2 w-20" />
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Top Subject Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      Science 80%
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      English 75%
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      History 70%
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Top Interests</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      Science
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      Computing
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      History
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {learningPath && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{learningPath.title}</CardTitle>
                <CardDescription>{learningPath.description}</CardDescription>
              </div>
              <div className="flex items-centre space-x-2">
                <Button variant="outline" size="sm" onClick={saveLearningPath}>
                  <Download className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={shareLearningPath}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-centre space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p>{getSubjectName(learningPath.subject)}</p>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p>{learningPath.estimatedDuration} hours ({duration} weeks)</p>
                </div>
              </div>
              
              <div className="flex items-centre space-x-2">
                <BarChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Difficulty</p>
                  <p>{getDifficultyName(learningPath.difficulty)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Learning Style Alignment</h3>
                <div className="flex items-centre space-x-2">
                  <span className="text-xl">{getLearningStyleIcon(learningPath.alignedToLearningStyle)}</span>
                  <span>{getLearningStyleName(learningPath.alignedToLearningStyle)}</span>
                  <Badge className="ml-2 bg-primary/20 text-primary border-primary/20">
                    Primary Style
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This learning path is optimised for your {getLearningStyleName(learningPath.alignedToLearningStyle)} learning style, 
                  with content and activities designed to match how you learn best.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Learning Objectives</h3>
                <ul className="space-y-2">
                  {learningPath.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Sample Learning Modules</h3>
                
                <div className="space-y-4">
                  {/* Sample modules - in a real implementation, these would come from the learning path */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Module 1: Introduction to {getSubjectName(learningPath.subject)}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        An introduction to key concepts in {getSubjectName(learningPath.subject)}, 
                        tailored to your {getLearningStyleName(learningPath.alignedToLearningStyle)} learning style.
                      </p>
                      <div className="flex items-centre justify-between mt-2">
                        <div className="flex items-centre space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">2 hours</span>
                        </div>
                        <Badge variant="outline">{getDifficultyName(1)}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Preview
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Module 2: Core Principles and Applications</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        Explore the fundamental principles of {getSubjectName(learningPath.subject)} 
                        and how they apply to real-world scenarios.
                      </p>
                      <div className="flex items-centre justify-between mt-2">
                        <div className="flex items-centre space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">3 hours</span>
                        </div>
                        <Badge variant="outline">{getDifficultyName(2)}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Preview
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Module 3: Advanced Concepts</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        Delve deeper into advanced topics in {getSubjectName(learningPath.subject)}, 
                        building on your existing knowledge.
                      </p>
                      <div className="flex items-centre justify-between mt-2">
                        <div className="flex items-centre space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">4 hours</span>
                        </div>
                        <Badge variant="outline">{getDifficultyName(3)}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Preview
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                <p className="text-sm mb-3">
                  This learning path is aligned with the UK National Curriculum for Key Stage {learningPath.keyStage.replace('ks', '')} {getSubjectName(learningPath.subject)}.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    KS{learningPath.keyStage.replace('ks', '')} {getSubjectName(learningPath.subject)}
                  </Badge>
                  <Badge variant="outline">
                    National Curriculum
                  </Badge>
                  <Badge variant="outline">
                    UK Standards
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={startLearningPath} className="w-full">
              <Award className="mr-2 h-4 w-4" />
              Start Learning Path
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
