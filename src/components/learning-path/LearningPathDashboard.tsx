"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Award, 
  BarChart, 
  Plus,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { 
  LearningPath, 
  TopicStatus,
  Subject,
  KeyStage
} from '@/lib/learning-path/types';
import { fetchLearningPath } from '@/lib/learning-path/api';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

interface LearningPathDashboardProps {
  userId: string;
}

export function LearningPathDashboard({ userId }: LearningPathDashboardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePaths, setActivePaths] = useState<LearningPath[]>([]);
  const [completedPaths, setCompletedPaths] = useState<LearningPath[]>([]);
  
  useEffect(() => {
    loadLearningPaths();
  }, [userId]);
  
  const loadLearningPaths = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch all paths for the user
      // For now, we'll create some mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock active paths
      const mockActivePaths: LearningPath[] = [
        {
          id: 'path-1',
          userId,
          subjectId: Subject.MATHS,
          keyStage: KeyStage.KS2,
          title: 'Mathematics Learning Path',
          description: 'Personalized learning path for mathematics at Key Stage 2 level',
          units: [
            {
              id: 'unit-1',
              title: 'Number and Place Value',
              description: 'Understanding numbers up to 1000',
              topicId: 'topic-1',
              status: TopicStatus.COMPLETED,
              progress: 100,
              resources: [],
              assessments: ['assessment-1'],
              estimatedDuration: 120,
              actualDuration: 105,
              startedAt: new Date('2025-05-15'),
              completedAt: new Date('2025-05-20'),
              proficiencyLevel: 'secure',
              nextReviewDate: new Date('2025-06-20')
            },
            {
              id: 'unit-2',
              title: 'Addition and Subtraction',
              description: 'Adding and subtracting numbers up to 1000',
              topicId: 'topic-2',
              status: TopicStatus.IN_PROGRESS,
              progress: 65,
              resources: [],
              assessments: ['assessment-2'],
              estimatedDuration: 150,
              actualDuration: 90,
              startedAt: new Date('2025-05-22'),
              completedAt: null,
              proficiencyLevel: null,
              nextReviewDate: null
            },
            {
              id: 'unit-3',
              title: 'Multiplication and Division',
              description: 'Multiplying and dividing numbers up to 1000',
              topicId: 'topic-3',
              status: TopicStatus.AVAILABLE,
              progress: 0,
              resources: [],
              assessments: ['assessment-3'],
              estimatedDuration: 180,
              actualDuration: 0,
              startedAt: null,
              completedAt: null,
              proficiencyLevel: null,
              nextReviewDate: null
            }
          ],
          createdAt: new Date('2025-05-10'),
          updatedAt: new Date('2025-05-22'),
          overallProgress: 35,
          estimatedCompletionDate: new Date('2025-07-15'),
          adaptationLevel: 5,
          lastAssessmentDate: new Date('2025-05-20')
        },
        {
          id: 'path-2',
          userId,
          subjectId: Subject.ENGLISH,
          keyStage: KeyStage.KS2,
          title: 'English Learning Path',
          description: 'Personalized learning path for English at Key Stage 2 level',
          units: [
            {
              id: 'unit-4',
              title: 'Reading Comprehension',
              description: 'Understanding and analyzing texts',
              topicId: 'topic-4',
              status: TopicStatus.IN_PROGRESS,
              progress: 40,
              resources: [],
              assessments: ['assessment-4'],
              estimatedDuration: 120,
              actualDuration: 50,
              startedAt: new Date('2025-05-18'),
              completedAt: null,
              proficiencyLevel: null,
              nextReviewDate: null
            }
          ],
          createdAt: new Date('2025-05-12'),
          updatedAt: new Date('2025-05-18'),
          overallProgress: 20,
          estimatedCompletionDate: new Date('2025-07-30'),
          adaptationLevel: 4,
          lastAssessmentDate: null
        }
      ];
      
      // Mock completed paths
      const mockCompletedPaths: LearningPath[] = [
        {
          id: 'path-3',
          userId,
          subjectId: Subject.SCIENCE,
          keyStage: KeyStage.KS1,
          title: 'Science Learning Path',
          description: 'Personalized learning path for science at Key Stage 1 level',
          units: [
            {
              id: 'unit-5',
              title: 'Plants and Growth',
              description: 'Understanding how plants grow',
              topicId: 'topic-5',
              status: TopicStatus.COMPLETED,
              progress: 100,
              resources: [],
              assessments: ['assessment-5'],
              estimatedDuration: 90,
              actualDuration: 85,
              startedAt: new Date('2025-04-10'),
              completedAt: new Date('2025-04-15'),
              proficiencyLevel: 'mastery',
              nextReviewDate: new Date('2025-06-15')
            },
            {
              id: 'unit-6',
              title: 'Animals and Habitats',
              description: 'Understanding animals and their habitats',
              topicId: 'topic-6',
              status: TopicStatus.COMPLETED,
              progress: 100,
              resources: [],
              assessments: ['assessment-6'],
              estimatedDuration: 90,
              actualDuration: 95,
              startedAt: new Date('2025-04-20'),
              completedAt: new Date('2025-04-25'),
              proficiencyLevel: 'exceeding',
              nextReviewDate: new Date('2025-06-25')
            }
          ],
          createdAt: new Date('2025-04-05'),
          updatedAt: new Date('2025-04-25'),
          overallProgress: 100,
          estimatedCompletionDate: new Date('2025-04-30'),
          adaptationLevel: 3,
          lastAssessmentDate: new Date('2025-04-25')
        }
      ];
      
      setActivePaths(mockActivePaths);
      setCompletedPaths(mockCompletedPaths);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading learning paths:', error);
      setError('Failed to load learning paths. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleCreatePath = () => {
    router.push('/learning-path/create');
  };
  
  const handleViewPath = (pathId: string) => {
    router.push(`/learning-path/${pathId}`);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getSubjectLabel = (subjectId: string) => {
    const subjectMap: Record<string, string> = {
      [Subject.MATHS]: 'Mathematics',
      [Subject.ENGLISH]: 'English',
      [Subject.SCIENCE]: 'Science',
      [Subject.HISTORY]: 'History',
      [Subject.GEOGRAPHY]: 'Geography',
      [Subject.ART]: 'Art',
      [Subject.MUSIC]: 'Music',
      [Subject.PE]: 'Physical Education',
      [Subject.COMPUTING]: 'Computing',
      [Subject.LANGUAGES]: 'Languages'
    };
    
    return subjectMap[subjectId] || subjectId;
  };
  
  const getKeyStageLabel = (keyStage: string) => {
    const keyStageMap: Record<string, string> = {
      [KeyStage.NURSERY]: 'Nursery',
      [KeyStage.RECEPTION]: 'Reception',
      [KeyStage.KS1]: 'Key Stage 1',
      [KeyStage.KS2]: 'Key Stage 2',
      [KeyStage.KS3]: 'Key Stage 3',
      [KeyStage.KS4]: 'Key Stage 4'
    };
    
    return keyStageMap[keyStage] || keyStage;
  };
  
  const getNextUnit = (path: LearningPath) => {
    return path.units.find(unit => 
      unit.status === TopicStatus.IN_PROGRESS || unit.status === TopicStatus.AVAILABLE
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground">
            Track your personalized learning journey across subjects
          </p>
        </div>
        <Button onClick={handleCreatePath}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Path
        </Button>
      </div>
      
      <AvatarVideo 
        title="Personalized Learning Paths"
        description="Your personalized learning paths help you progress through the curriculum at your own pace, focusing on your specific needs and interests."
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Paths</TabsTrigger>
          <TabsTrigger value="completed">Completed Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activePaths.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No active learning paths</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a new learning path to start your personalized learning journey
              </p>
              <Button onClick={handleCreatePath} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create New Path
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activePaths.map((path) => {
                const nextUnit = getNextUnit(path);
                
                return (
                  <Card key={path.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{path.title}</CardTitle>
                          <CardDescription>{path.description}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{getSubjectLabel(path.subjectId)}</Badge>
                          <Badge variant="outline">{getKeyStageLabel(path.keyStage)}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{path.overallProgress}%</span>
                          </div>
                          <Progress value={path.overallProgress} />
                        </div>
                        
                        {nextUnit && (
                          <div className="bg-muted p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">Next Up: {nextUnit.title}</h4>
                                <p className="text-sm text-muted-foreground">{nextUnit.description}</p>
                              </div>
                              <Badge 
                                variant={nextUnit.status === TopicStatus.IN_PROGRESS ? "default" : "outline"}
                              >
                                {nextUnit.status === TopicStatus.IN_PROGRESS ? "In Progress" : "Available"}
                              </Badge>
                            </div>
                            
                            {nextUnit.status === TopicStatus.IN_PROGRESS && (
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Unit Progress</span>
                                  <span>{nextUnit.progress}%</span>
                                </div>
                                <Progress value={nextUnit.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Created: {formatDate(path.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Est. completion: {formatDate(path.estimatedCompletionDate)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewPath(path.id)}
                      >
                        Continue Learning
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : completedPaths.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No completed learning paths yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete your active learning paths to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {completedPaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{getSubjectLabel(path.subjectId)}</Badge>
                        <Badge variant="outline">{getKeyStageLabel(path.keyStage)}</Badge>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Completed: {formatDate(path.updatedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Units mastered: {path.units.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleViewPath(path.id)}
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
