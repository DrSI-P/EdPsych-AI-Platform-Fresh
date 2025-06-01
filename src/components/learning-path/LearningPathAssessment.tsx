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
  BarChart3, 
  Brain, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Info, 
  RefreshCw,
  Settings
} from 'lucide-react';
import { 
  AssessmentResult,
  ProficiencyLevel,
  Subject,
  KeyStage
} from '@/lib/learning-path/types';
import { fetchAssessmentResults } from '@/lib/learning-path/api';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

interface LearningPathAssessmentProps {
  userId: string;
  pathId?: string;
  subjectId?: string;
  keyStage?: KeyStage;
  onComplete?: (results: AssessmentResult) => void;
}

export function LearningPathAssessment({ 
  userId, 
  pathId, 
  subjectId, 
  keyStage,
  onComplete 
}: LearningPathAssessmentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAssessing, setIsAssessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  
  useEffect(() => {
    loadAssessmentData();
  }, [userId, subjectId]);
  
  const loadAssessmentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch assessment data from the API
      // For now, we'll create some mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock assessment results
      const mockResults: AssessmentResult[] = [
        {
          id: 'assessment-1',
          userId,
          subjectId: 'maths',
          topicId: 'topic-1',
          score: 85,
          proficiencyLevel: ProficiencyLevel.SECURE,
          completedAt: new Date('2025-05-20'),
          timeSpent: 1200,
          attemptsCount: 1,
          correctAnswers: 17,
          totalQuestions: 20
        },
        {
          id: 'assessment-2',
          userId,
          subjectId: 'english',
          topicId: 'topic-4',
          score: 72,
          proficiencyLevel: ProficiencyLevel.DEVELOPING,
          completedAt: new Date('2025-05-15'),
          timeSpent: 1500,
          attemptsCount: 1,
          correctAnswers: 18,
          totalQuestions: 25
        }
      ];
      
      // Mock current assessment
      const mockCurrentAssessment = {
        id: 'new-assessment',
        title: subjectId === 'maths' ? 'Mathematics Assessment' : 'Subject Assessment',
        description: 'This assessment will help determine your current understanding and proficiency level.',
        subject: subjectId || 'general',
        keyStage: keyStage || 'ks2',
        estimatedDuration: 20,
        questions: [
          {
            id: 'q1',
            text: 'What is 7 × 8?',
            options: ['54', '56', '64', '72'],
            correctAnswer: '56'
          },
          {
            id: 'q2',
            text: 'What is 125 ÷ 5?',
            options: ['20', '25', '30', '35'],
            correctAnswer: '25'
          },
          {
            id: 'q3',
            text: 'What is 3/4 of 60?',
            options: ['15', '30', '45', '75'],
            correctAnswer: '45'
          },
          {
            id: 'q4',
            text: 'What is the area of a rectangle with length 8cm and width 5cm?',
            options: ['13cm²', '26cm²', '40cm²', '80cm²'],
            correctAnswer: '40cm²'
          },
          {
            id: 'q5',
            text: 'What is the perimeter of a square with sides of 9cm?',
            options: ['18cm', '27cm', '36cm', '81cm'],
            correctAnswer: '36cm'
          }
        ]
      };
      
      setAssessmentResults(mockResults);
      setCurrentAssessment(mockCurrentAssessment);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading assessment data:', error);
      setError('Failed to load assessment data. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleStartAssessment = () => {
    setIsAssessing(true);
    setCurrentQuestion(0);
    setAnswers({});
    setActiveTab('assessment');
  };
  
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const completeAssessment = () => {
    // Calculate results
    const totalQuestions = currentAssessment.questions.length;
    let correctCount = 0;
    
    currentAssessment.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Determine proficiency level
    let proficiencyLevel: ProficiencyLevel;
    if (score >= 90) {
      proficiencyLevel = ProficiencyLevel.MASTERY;
    } else if (score >= 80) {
      proficiencyLevel = ProficiencyLevel.EXCEEDING;
    } else if (score >= 65) {
      proficiencyLevel = ProficiencyLevel.SECURE;
    } else if (score >= 50) {
      proficiencyLevel = ProficiencyLevel.DEVELOPING;
    } else {
      proficiencyLevel = ProficiencyLevel.BEGINNER;
    }
    
    // Create result object
    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId,
      subjectId: currentAssessment.subject,
      topicId: pathId || 'general',
      score,
      proficiencyLevel,
      completedAt: new Date(),
      timeSpent: Math.floor(Math.random() * 1200) + 600, // Random time between 10-30 minutes
      attemptsCount: 1,
      correctAnswers: correctCount,
      totalQuestions
    };
    
    setAssessmentResult(result);
    setAssessmentComplete(true);
    setActiveTab('results');
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(result);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const getProficiencyLevelLabel = (level: ProficiencyLevel) => {
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
  
  const getProficiencyLevelColor = (level: ProficiencyLevel) => {
    switch (level) {
      case ProficiencyLevel.BEGINNER:
        return 'text-red-500';
      case ProficiencyLevel.DEVELOPING:
        return 'text-orange-500';
      case ProficiencyLevel.SECURE:
        return 'text-green-500';
      case ProficiencyLevel.EXCEEDING:
        return 'text-blue-500';
      case ProficiencyLevel.MASTERY:
        return 'text-purple-500';
      default:
        return '';
    }
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Learning Assessment</CardTitle>
            <CardDescription>
              Assess your understanding and track your progress
            </CardDescription>
          </div>
          {!isAssessing && (
            <Button variant="outline" size="sm" onClick={() => router.push('/learning-path')}>
              <Settings className="h-4 w-4 mr-2" />
              Assessment Settings
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {!isAssessing ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">Assessment History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 py-4">
                  <AvatarVideo 
                    title="Learning Assessment"
                    description="Assessments help us understand your current knowledge and skills, so we can personalize your learning path to meet your specific needs."
                  />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ready for Assessment?</CardTitle>
                      <CardDescription>
                        This assessment will help determine your current understanding and proficiency level.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{currentAssessment?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {currentAssessment?.questions.length} questions • Approximately {currentAssessment?.estimatedDuration} minutes
                          </p>
                        </div>
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Assessment Information</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>You can take your time - there is no time limit</li>
                            <li>You can review and change your answers before submitting</li>
                            <li>Results will be used to personalize your learning path</li>
                            <li>This assessment covers {getSubjectLabel(currentAssessment?.subject || '')} topics</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    
                    <CardFooter>
                      <Button className="w-full" onClick={handleStartAssessment}>
                        Start Assessment
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {assessmentResults.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Recent Assessment Results</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessmentResults.slice(0, 2).map((result) => (
                          <Card key={result.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{getSubjectLabel(result.subjectId)}</CardTitle>
                                <Badge>{formatDate(result.completedAt)}</Badge>
                              </div>
                              <CardDescription>
                                {result.correctAnswers} of {result.totalQuestions} correct
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pb-2">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Score</span>
                                  <span>{result.score}%</span>
                                </div>
                                <Progress value={result.score} />
                                
                                <div className="flex justify-between items-center text-sm pt-2">
                                  <span>Proficiency Level:</span>
                                  <span className={getProficiencyLevelColor(result.proficiencyLevel)}>
                                    {getProficiencyLevelLabel(result.proficiencyLevel)}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4 py-4">
                  <h3 className="text-lg font-medium">Assessment History</h3>
                  
                  {assessmentResults.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No assessment history</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Complete your first assessment to see your results here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assessmentResults.map((result) => (
                        <Card key={result.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{getSubjectLabel(result.subjectId)}</CardTitle>
                                <CardDescription>
                                  Completed on {formatDate(result.completedAt)}
                                </CardDescription>
                              </div>
                              <Badge variant={result.score >= 65 ? "success" : "outline"}>
                                {result.score}%
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center">
                                <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Proficiency: {getProficiencyLevelLabel(result.proficiencyLevel)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Time spent: {formatDuration(result.timeSpent)}</span>
                              </div>
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Correct: {result.correctAnswers}/{result.totalQuestions}</span>
                              </div>
                              <div className="flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Attempts: {result.attemptsCount}</span>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter>
                            <Button variant="outline" className="w-full">
                              View Detailed Results
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="results" className="space-y-4 py-4">
                  {assessmentResult && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Assessment Complete!</h2>
                        <p className="text-muted-foreground">
                          You've completed the {getSubjectLabel(assessmentResult.subjectId)} assessment
                        </p>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Results</CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="flex justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  className="text-muted stroke-current"
                                  strokeWidth="10"
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                />
                                <circle
                                  className="text-primary stroke-current"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 40}`}
                                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessmentResult.score / 100)}`}
                                  transform="rotate(-90 50 50)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{assessmentResult.score}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted p-4 rounded-lg text-center">
                              <h4 className="text-sm font-medium text-muted-foreground">Proficiency Level</h4>
                              <p className={`text-lg font-bold ${getProficiencyLevelColor(assessmentResult.proficiencyLevel)}`}>
                                {getProficiencyLevelLabel(assessmentResult.proficiencyLevel)}
                              </p>
                            </div>
                            
                            <div className="bg-muted p-4 rounded-lg text-center">
                              <h4 className="text-sm font-medium text-muted-foreground">Correct Answers</h4>
                              <p className="text-lg font-bold">
                                {assessmentResult.correctAnswers} / {assessmentResult.totalQuestions}
                              </p>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">What This Means</h4>
                            <p className="text-sm text-muted-foreground">
                              {assessmentResult.proficiencyLevel === ProficiencyLevel.BEGINNER && (
                                "You're at the beginning of your learning journey. Your learning path will focus on building foundational knowledge."
                              )}
                              {assessmentResult.proficiencyLevel === ProficiencyLevel.DEVELOPING && (
                                "You're developing your understanding. Your learning path will reinforce key concepts and introduce new ones."
                              )}
                              {assessmentResult.proficiencyLevel === ProficiencyLevel.SECURE && (
                                "You have a secure understanding of the subject. Your learning path will deepen your knowledge and introduce more complex concepts."
                              )}
                              {assessmentResult.proficiencyLevel === ProficiencyLevel.EXCEEDING && (
                                "You're exceeding expectations! Your learning path will challenge you with advanced concepts and applications."
                              )}
                              {assessmentResult.proficiencyLevel === ProficiencyLevel.MASTERY && (
                                "You've achieved mastery of this subject! Your learning path will focus on applying your knowledge in complex scenarios."
                              )}
                            </p>
                          </div>
                        </CardContent>
                        
                        <CardFooter>
                          <Button className="w-full" onClick={() => router.push('/learning-path')}>
                            Return to Learning Paths
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                {!assessmentComplete ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{currentAssessment.title}</h3>
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {currentAssessment.questions.length}
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={((currentQuestion + 1) / currentAssessment.questions.length) * 100} 
                      className="h-2"
                    />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {currentAssessment.questions[currentQuestion].text}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2">
                          {currentAssessment.questions[currentQuestion].options.map((option: string, index: number) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                                answers[currentQuestion] === option
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleAnswerSelect(currentQuestion, option)}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  answers[currentQuestion] === option
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-muted-foreground'
                                }`}>
                                  {answers[currentQuestion] === option && (
                                    <CheckCircle2 className="h-3 w-3" />
                                  )}
                                </div>
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                        
                        <Button
                          onClick={handleNextQuestion}
                          disabled={answers[currentQuestion] === undefined}
                        >
                          {currentQuestion < currentAssessment.questions.length - 1 ? 'Next' : 'Complete'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-4">Calculating your results...</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
