"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Calendar,
  ArrowLeft,
  Play,
  Pause,
  BarChart3,
  BookMarked,
  Brain
} from 'lucide-react';
import { 
  LearningPath, 
  LearningPathUnit,
  TopicStatus,
  ProficiencyLevel,
  LearningResource
} from '@/lib/learning-path/types';
import { fetchLearningPath, updateUnitStatus } from '@/lib/learning-path/api';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

interface LearningPathViewProps {
  pathId: string;
  userId: string;
}

export function LearningPathView({ pathId, userId }: LearningPathViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    loadLearningPath();
  }, [pathId, userId]);
  
  const loadLearningPath = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch the path from the API
      // For now, we'll create some mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock learning path
      const mockPath: LearningPath = {
        id: pathId,
        userId,
        subjectId: 'maths',
        keyStage: 'ks2',
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
            resources: [
              {
                id: 'resource-1',
                title: 'Introduction to Place Value',
                description: 'Learn about the value of digits in numbers',
                type: 'video',
                url: '/resources/place-value-intro.mp4',
                topicIds: ['topic-1'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 10,
                difficulty: 3
              },
              {
                id: 'resource-2',
                title: 'Place Value Practice',
                description: 'Practice exercises for place value',
                type: 'interactive',
                url: '/resources/place-value-practice.html',
                topicIds: ['topic-1'],
                keyStages: ['ks2'],
                learningStyles: ['kinesthetic'],
                interestCategories: ['maths', 'games'],
                duration: 15,
                difficulty: 4
              }
            ],
            assessments: ['assessment-1'],
            estimatedDuration: 120,
            actualDuration: 105,
            startedAt: new Date('2025-05-15'),
            completedAt: new Date('2025-05-20'),
            proficiencyLevel: ProficiencyLevel.SECURE,
            nextReviewDate: new Date('2025-06-20')
          },
          {
            id: 'unit-2',
            title: 'Addition and Subtraction',
            description: 'Adding and subtracting numbers up to 1000',
            topicId: 'topic-2',
            status: TopicStatus.IN_PROGRESS,
            progress: 65,
            resources: [
              {
                id: 'resource-3',
                title: 'Addition Strategies',
                description: 'Learn different strategies for addition',
                type: 'video',
                url: '/resources/addition-strategies.mp4',
                topicIds: ['topic-2'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 12,
                difficulty: 4
              },
              {
                id: 'resource-4',
                title: 'Subtraction Strategies',
                description: 'Learn different strategies for subtraction',
                type: 'video',
                url: '/resources/subtraction-strategies.mp4',
                topicIds: ['topic-2'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 12,
                difficulty: 4
              },
              {
                id: 'resource-5',
                title: 'Addition and Subtraction Practice',
                description: 'Practice exercises for addition and subtraction',
                type: 'interactive',
                url: '/resources/addition-subtraction-practice.html',
                topicIds: ['topic-2'],
                keyStages: ['ks2'],
                learningStyles: ['kinesthetic'],
                interestCategories: ['maths', 'games'],
                duration: 20,
                difficulty: 5
              }
            ],
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
            resources: [
              {
                id: 'resource-6',
                title: 'Multiplication Strategies',
                description: 'Learn different strategies for multiplication',
                type: 'video',
                url: '/resources/multiplication-strategies.mp4',
                topicIds: ['topic-3'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 15,
                difficulty: 5
              },
              {
                id: 'resource-7',
                title: 'Division Strategies',
                description: 'Learn different strategies for division',
                type: 'video',
                url: '/resources/division-strategies.mp4',
                topicIds: ['topic-3'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 15,
                difficulty: 5
              },
              {
                id: 'resource-8',
                title: 'Multiplication and Division Practice',
                description: 'Practice exercises for multiplication and division',
                type: 'interactive',
                url: '/resources/multiplication-division-practice.html',
                topicIds: ['topic-3'],
                keyStages: ['ks2'],
                learningStyles: ['kinesthetic'],
                interestCategories: ['maths', 'games'],
                duration: 25,
                difficulty: 6
              }
            ],
            assessments: ['assessment-3'],
            estimatedDuration: 180,
            actualDuration: 0,
            startedAt: null,
            completedAt: null,
            proficiencyLevel: null,
            nextReviewDate: null
          },
          {
            id: 'unit-4',
            title: 'Fractions',
            description: 'Understanding and working with fractions',
            topicId: 'topic-4',
            status: TopicStatus.LOCKED,
            progress: 0,
            resources: [
              {
                id: 'resource-9',
                title: 'Introduction to Fractions',
                description: 'Learn about fractions and their representations',
                type: 'video',
                url: '/resources/fractions-intro.mp4',
                topicIds: ['topic-4'],
                keyStages: ['ks2'],
                learningStyles: ['visual', 'auditory'],
                interestCategories: ['maths'],
                duration: 15,
                difficulty: 6
              }
            ],
            assessments: ['assessment-4'],
            estimatedDuration: 200,
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
      };
      
      setPath(mockPath);
      
      // Set active unit to the first in-progress or available unit
      const activeUnit = mockPath.units.find(unit => 
        unit.status === TopicStatus.IN_PROGRESS || unit.status === TopicStatus.AVAILABLE
      );
      
      if (activeUnit) {
        setActiveUnitId(activeUnit.id);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading learning path:', error);
      setError('Failed to load learning path. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleStartUnit = async (unitId: string) => {
    if (!path) return;
    
    try {
      setIsUpdating(true);
      
      // Find the unit
      const unitIndex = path.units.findIndex(unit => unit.id === unitId);
      if (unitIndex === -1) return;
      
      // Update unit status
      const updatedUnit = {
        ...path.units[unitIndex],
        status: TopicStatus.IN_PROGRESS,
        progress: 0,
        startedAt: new Date()
      };
      
      // In a real implementation, we would call the API
      // await updateUnitStatus(path.id, unitId, TopicStatus.IN_PROGRESS, 0);
      
      // Update local state
      const updatedUnits = [...path.units];
      updatedUnits[unitIndex] = updatedUnit;
      
      setPath({
        ...path,
        units: updatedUnits,
        updatedAt: new Date()
      });
      
      setActiveUnitId(unitId);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error starting unit:', error);
      setError('Failed to start unit. Please try again.');
      setIsUpdating(false);
    }
  };
  
  const handleCompleteUnit = async (unitId: string) => {
    if (!path) return;
    
    try {
      setIsUpdating(true);
      
      // Find the unit
      const unitIndex = path.units.findIndex(unit => unit.id === unitId);
      if (unitIndex === -1) return;
      
      // Update unit status
      const updatedUnit = {
        ...path.units[unitIndex],
        status: TopicStatus.COMPLETED,
        progress: 100,
        completedAt: new Date(),
        proficiencyLevel: ProficiencyLevel.SECURE
      };
      
      // In a real implementation, we would call the API
      // await updateUnitStatus(path.id, unitId, TopicStatus.COMPLETED, 100);
      
      // Update local state
      const updatedUnits = [...path.units];
      updatedUnits[unitIndex] = updatedUnit;
      
      // Unlock next unit if available
      if (unitIndex < path.units.length - 1 && path.units[unitIndex + 1].status === TopicStatus.LOCKED) {
        updatedUnits[unitIndex + 1] = {
          ...updatedUnits[unitIndex + 1],
          status: TopicStatus.AVAILABLE
        };
      }
      
      // Calculate new overall progress
      const completedUnits = updatedUnits.filter(
        unit => unit.status === TopicStatus.COMPLETED || unit.status === TopicStatus.MASTERED
      ).length;
      const overallProgress = Math.round((completedUnits / updatedUnits.length) * 100);
      
      setPath({
        ...path,
        units: updatedUnits,
        updatedAt: new Date(),
        overallProgress
      });
      
      // Set active unit to the next available unit
      const nextUnit = updatedUnits.find(unit => 
        unit.status === TopicStatus.IN_PROGRESS || unit.status === TopicStatus.AVAILABLE
      );
      
      if (nextUnit) {
        setActiveUnitId(nextUnit.id);
      }
      
      setIsUpdating(false);
    } catch (error) {
      console.error('Error completing unit:', error);
      setError('Failed to complete unit. Please try again.');
      setIsUpdating(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };
  
  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case TopicStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>;
      case TopicStatus.IN_PROGRESS:
        return <Badge>In Progress</Badge>;
      case TopicStatus.AVAILABLE:
        return <Badge variant="outline">Available</Badge>;
      case TopicStatus.LOCKED:
        return <Badge variant="secondary">Locked</Badge>;
      case TopicStatus.MASTERED:
        return <Badge variant="success">Mastered</Badge>;
      case TopicStatus.NEEDS_REVIEW:
        return <Badge variant="destructive">Needs Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'interactive':
        return <Brain className="h-4 w-4" />;
      case 'quiz':
        return <BarChart3 className="h-4 w-4" />;
      case 'worksheet':
        return <BookMarked className="h-4 w-4" />;
      case 'game':
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  const getActiveUnit = () => {
    if (!path || !activeUnitId) return null;
    return path.units.find(unit => unit.id === activeUnitId) || null;
  };
  
  const getProficiencyLevelLabel = (level: ProficiencyLevel | null) => {
    if (!level) return 'Not assessed';
    
    switch (level) {
      case ProficiencyLevel.BEGINNER:
        return 'Beginner';
      case ProficiencyLevel.DEVELOPING:
        return 'Developing';
      case ProficiencyLevel.SECURE:
        return 'Secure';
      case ProficiencyLevel.EXCEEDING:
        return 'Exceeding';
      case ProficiencyLevel.MASTERY:
        return 'Mastery';
      default:
        return level;
    }
  };
  
  const activeUnit = getActiveUnit();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-3xl font-bold tracking-tight">{path?.title || 'Learning Path'}</h1>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !path ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The learning path could not be found.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Path Overview</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{path.overallProgress}%</span>
                  </div>
                  <Progress value={path.overallProgress} />
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Created: {formatDate(path.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Est. completion: {formatDate(path.estimatedCompletionDate)}</span>
                  </div>
                  {path.lastAssessmentDate && (
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Last assessment: {formatDate(path.lastAssessmentDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Units</CardTitle>
                <CardDescription>Your personalized learning journey</CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {path.units.map((unit, index) => (
                    <div 
                      key={unit.id}
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        unit.id === activeUnitId ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        if (unit.status !== TopicStatus.LOCKED) {
                          setActiveUnitId(unit.id);
                        }
                      }}
                      style={{ cursor: unit.status !== TopicStatus.LOCKED ? 'pointer' : 'default' }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{unit.title}</div>
                          <div className="text-xs text-muted-foreground">{formatDuration(unit.estimatedDuration)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(unit.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <AvatarVideo 
              title="Your Learning Path"
              description="This personalized learning path is designed to help you progress through the curriculum at your own pace, focusing on your specific needs and interests."
            />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            {activeUnit ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{activeUnit.title}</CardTitle>
                      <CardDescription>{activeUnit.description}</CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(activeUnit.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {activeUnit.status === TopicStatus.IN_PROGRESS && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Unit Progress</span>
                        <span>{activeUnit.progress}%</span>
                      </div>
                      <Progress value={activeUnit.progress} />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Estimated time: {formatDuration(activeUnit.estimatedDuration)}</span>
                    </div>
                    {activeUnit.startedAt && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Started: {formatDate(activeUnit.startedAt)}</span>
                      </div>
                    )}
                    {activeUnit.completedAt && (
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Completed: {formatDate(activeUnit.completedAt)}</span>
                      </div>
                    )}
                    {activeUnit.proficiencyLevel && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Proficiency: {getProficiencyLevelLabel(activeUnit.proficiencyLevel)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Learning Resources</h3>
                    
                    {activeUnit.resources.length === 0 ? (
                      <p className="text-muted-foreground">No resources available for this unit.</p>
                    ) : (
                      <div className="space-y-3">
                        {activeUnit.resources.map((resource) => (
                          <Card key={resource.id}>
                            <CardHeader className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div>
                                    <CardTitle className="text-base">{resource.title}</CardTitle>
                                    <CardDescription className="text-xs">{resource.description}</CardDescription>
                                  </div>
                                </div>
                                <Badge variant="outline">{resource.type}</Badge>
                              </div>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDuration(resource.duration)}</span>
                              </div>
                              <Button size="sm">
                                Start Learning
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  {activeUnit.status === TopicStatus.AVAILABLE ? (
                    <Button 
                      onClick={() => handleStartUnit(activeUnit.id)}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Unit
                    </Button>
                  ) : activeUnit.status === TopicStatus.IN_PROGRESS ? (
                    <Button 
                      onClick={() => handleCompleteUnit(activeUnit.id)}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete Unit
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      className="w-full"
                      disabled={activeUnit.status === TopicStatus.LOCKED}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Review Unit
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No unit selected</h3>
                  <p className="text-muted-foreground mt-2">
                    Select a unit from the list to view its details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
