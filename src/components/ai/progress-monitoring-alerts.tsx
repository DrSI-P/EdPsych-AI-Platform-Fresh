'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  ChevronRight,
  BarChart,
  TrendingDown,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  Bell,
  BellOff,
  Filter,
  ArrowUpRight
} from 'lucide-react';

import { 
  LearnerProfile, 
  LearningPath, 
  SubjectArea, 
  KeyStage,
  InterventionAlert,
  ProgressReport
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

// Mock learning paths for demonstration
const mockLearningPaths: any[] = [
  {
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
  },
  {
    id: 'path-2',
    learnerId: 'learner-1',
    title: 'Mathematics Foundations',
    description: 'Build strong mathematical foundations with this personalised learning path.',
    subject: SubjectArea.MATHEMATICS,
    keyStage: KeyStage.KS3,
    objectives: [
      'Master algebraic concepts and equations',
      'Develop problem-solving skills with real-world applications',
      'Build confidence in mathematical reasoning'
    ],
    estimatedDuration: 15,
    difficulty: 3,
    modules: [],
    adaptivityRules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    completionStatus: 10,
    alignedToLearningStyle: LearningStyle.VISUAL
  }
];

// Mock recent activities for demonstration
const mockRecentActivities = [
  {
    id: 'activity-1',
    type: 'assessment',
    title: 'Science Quiz: Forces and Motion',
    subject: SubjectArea.SCIENCE,
    score: 65,
    timeSpent: 25, // minutes
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: 'activity-2',
    type: 'interactive',
    title: 'Interactive Lab: Chemical Reactions',
    subject: SubjectArea.SCIENCE,
    score: null,
    timeSpent: 35, // minutes
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: 'activity-3',
    type: 'assessment',
    title: 'Mathematics Quiz: Algebra Basics',
    subject: SubjectArea.MATHEMATICS,
    score: 55,
    timeSpent: 30, // minutes
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];

// Mock intervention alerts for demonstration
const mockInterventionAlerts: any[] = [
  {
    id: 'alert-1',
    learnerId: 'learner-1',
    alertType: 'performance_drop',
    severity: 'medium',
    title: 'Performance Alert: Mathematics',
    description: 'There has been a medium drop in performance in Mathematics.',
    metrics: {
      previousScore: 75,
      currentScore: 55,
      dropPercentage: 26.7
    },
    suggestedActions: [
      {
        actionType: 'review',
        description: 'Review Algebra concepts that are causing difficulty.',
        resources: ['Algebra Basics', 'Equation Solving']
      },
      {
        actionType: 'practise',
        description: 'Complete additional practise exercises in Mathematics.'
      }
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    acknowledged: false
  },
  {
    id: 'alert-2',
    learnerId: 'learner-1',
    alertType: 'goal_at_risk',
    severity: 'high',
    title: 'Goal Alert: Complete Mathematics Path',
    description: 'The goal "Complete Mathematics Foundations" is at risk of not being completed by the target date.',
    metrics: {
      currentProgress: 10,
      daysRemaining: 14,
      requiredDailyProgress: 6.4
    },
    suggestedActions: [
      {
        actionType: 'schedule_adjustment',
        description: 'Allocate more time to Mathematics activities.'
      },
      {
        actionType: 'goal_adjustment',
        description: 'Consider adjusting the target date or scope of the goal.'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    acknowledged: false
  },
  {
    id: 'alert-3',
    learnerId: 'learner-1',
    alertType: 'achievement',
    severity: 'low',
    title: 'Achievement: Science Progress',
    description: 'Congratulations! You\'ve made excellent progress in your Science learning path.',
    metrics: {
      completionRate: 25,
      timeSpent: 180, // minutes
      activitiesCompleted: 5
    },
    suggestedActions: [
      {
        actionType: 'celebration',
        description: 'Take a moment to celebrate your progress!'
      },
      {
        actionType: 'next_steps',
        description: 'Continue with the next module in your Science learning path.'
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    acknowledged: true
  }
];

// Mock progress report for demonstration
const mockProgressReport: ProgressReport = {
  id: 'report-1',
  learnerId: 'learner-1',
  period: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  },
  overallProgress: 65,
  subjectProgress: {
    [SubjectArea.ENGLISH]: 70,
    [SubjectArea.MATHEMATICS]: 60,
    [SubjectArea.SCIENCE]: 75
  },
  goalsAchieved: 2,
  goalsInProgress: 3,
  timeSpent: 15, // hours
  strengths: [
    {
      subject: SubjectArea.SCIENCE,
      conceptsStrong: ['Scientific Method', 'Classification'],
      evidence: 'Consistently high scores in science assessments'
    }
  ],
  areasForImprovement: [
    {
      subject: SubjectArea.MATHEMATICS,
      conceptsToImprove: ['Fractions', 'Algebra'],
      suggestedActivities: ['Fraction Practise', 'Algebra Basics']
    }
  ],
  nextSteps: [
    'Focus on improving mathematics skills, particularly fractions and algebra',
    'Continue building on strengths in science',
    'Set specific goals for English improvement'
  ],
  generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
};

// Define learning style enum for component
enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

export default function ProgressMonitoringAlerts() {
  const [activeTab, setActiveTab] = useState<string>('alerts');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interventionAlerts, setInterventionAlerts] = useState<InterventionAlert[]>(mockInterventionAlerts);
  const [progressReport, setProgressReport] = useState<ProgressReport | null>(mockProgressReport);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(mockLearnerProfile);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [recentActivities, setRecentActivities] = useState<any[]>(mockRecentActivities);
  
  // Monitor progress and generate alerts
  const monitorProgress = async () => {
    setIsLoading(true);
    
    try {
      const guidanceService = getAIGuidanceService();
      const alerts = await guidanceService.monitorProgress(
        learnerProfile,
        recentActivities,
        learningPaths
      );
      
      // In a real implementation, we would merge these with existing alerts
      // For demo purposes, we'll just use the mock data
      setInterventionAlerts([...mockInterventionAlerts]);
      
      toast({
        title: "Progress Monitored",
        description: "Your learning progress has been analysed.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to monitor progress:', error);
      toast({
        title: "Error",
        description: "Failed to monitor progress. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate progress report
  const generateProgressReport = async () => {
    setIsLoading(true);
    
    try {
      const guidanceService = getAIGuidanceService();
      const report = await guidanceService.generateProgressReport(
        learnerProfile,
        {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          end: new Date()
        }
      );
      
      // For demo purposes, we'll just use the mock data
      setProgressReport(mockProgressReport);
      
      toast({
        title: "Progress Report Generated",
        description: "Your learning progress report is ready.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to generate progress report:', error);
      toast({
        title: "Error",
        description: "Failed to generate progress report. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    // In a real implementation, we would fetch data from the server
    // For demo purposes, we'll just use the mock data
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
  
  // Get alert icon based on type and severity
  const getAlertIcon = (alert: InterventionAlert) => {
    if (alert.alertType === 'achievement') {
      return <Award className="h-5 w-5 text-green-500" />;
    }
    
    switch (alert.severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Get alert colour based on type and severity
  const getAlertColor = (alert: InterventionAlert): string => {
    if (alert.alertType === 'achievement') {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30';
    }
    
    switch (alert.severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30';
      default:
        return '';
    }
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  };
  
  // Mock function to acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setInterventionAlerts(interventionAlerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged.",
      duration: 3000,
    });
  };
  
  // Mock function to take action on alert
  const takeAction = (alert: InterventionAlert, actionIndex: number) => {
    const action = alert.suggestedActions[actionIndex];
    
    toast({
      title: "Action Taken",
      description: `You've chosen to ${action.description}`,
      duration: 3000,
    });
  };
  
  // Mock function to dismiss alert
  const dismissAlert = (alertId: string) => {
    setInterventionAlerts(interventionAlerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Alert Dismissed",
      description: "The alert has been dismissed.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Progress Monitoring & Alerts</h1>
      
      <div className="flex justify-between items-centre mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="progress">Progress Report</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <Button 
            onClick={monitorProgress} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analysing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Analyse Progress
              </>
            )}
          </Button>
          
          <Button 
            onClick={generateProgressReport} 
            variant="outline"
            disabled={isLoading}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <TabsContent value="alerts" className="mt-0">
        <div className="space-y-4">
          {interventionAlerts.length > 0 ? (
            interventionAlerts.map((alert) => (
              <Alert key={alert.id} className={`${getAlertColor(alert)}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-centre mb-1">
                      {getAlertIcon(alert)}
                      <AlertTitle className="ml-2">{alert.title}</AlertTitle>
                      {!alert.acknowledged && (
                        <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          New
                        </Badge>
                      )}
                    </div>
                    <AlertDescription className="mt-1">
                      {alert.description}
                    </AlertDescription>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Alert metrics */}
                      <div className="bg-background/50 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Details</h4>
                        {alert.alertType === 'performance_drop' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Previous Score:</span>
                              <span className="font-medium">{alert.metrics.previousScore}%</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Current Score:</span>
                              <span className="font-medium">{alert.metrics.currentScore}%</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Change:</span>
                              <span className="font-medium flex items-centre text-red-500">
                                <TrendingDown className="h-4 w-4 mr-1" />
                                {alert.metrics.dropPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {alert.alertType === 'goal_at_risk' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Current Progress:</span>
                              <span className="font-medium">{alert.metrics.currentProgress}%</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Days Remaining:</span>
                              <span className="font-medium">{alert.metrics.daysRemaining}</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Required Daily Progress:</span>
                              <span className="font-medium">{alert.metrics.requiredDailyProgress.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}
                        
                        {alert.alertType === 'achievement' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Completion Rate:</span>
                              <span className="font-medium">{alert.metrics.completionRate}%</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Time Spent:</span>
                              <span className="font-medium">{alert.metrics.timeSpent} minutes</span>
                            </div>
                            <div className="flex justify-between items-centre">
                              <span className="text-sm">Activities Completed:</span>
                              <span className="font-medium">{alert.metrics.activitiesCompleted}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-muted-foreground">
                          {formatTimeAgo(alert.createdAt)}
                        </div>
                      </div>
                      
                      {/* Suggested actions */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Suggested Actions</h4>
                        <div className="space-y-2">
                          {alert.suggestedActions.map((action, index) => (
                            <div key={index} className="flex items-start">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-1 justify-start"
                                onClick={() => takeAction(alert, index)}
                              >
                                <ArrowUpRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="text-left">{action.description}</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
                    {!alert.acknowledged ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        Acknowledged
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))
          ) : (
            <div className="flex flex-col items-centre justify-centre py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Alerts</h3>
              <p className="text-muted-foreground text-centre max-w-md">
                You don't have any alerts at the moment. We'll notify you when there's something that needs your attention.
              </p>
              <Button 
                onClick={monitorProgress} 
                className="mt-4"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Check for Alerts
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="progress" className="mt-0">
        {progressReport ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Learning Progress Report</CardTitle>
                  <CardDescription>
                    {formatDate(progressReport.period.start)} - {formatDate(progressReport.period.end)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-centre">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatTimeAgo(progressReport.generatedAt)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-centre space-x-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Overall Progress</p>
                    <p>{progressReport.overallProgress}%</p>
                  </div>
                </div>
                
                <div className="flex items-centre space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Goals</p>
                    <p>{progressReport.goalsAchieved} achieved, {progressReport.goalsInProgress} in progress</p>
                  </div>
                </div>
                
                <div className="flex items-centre space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Time Spent</p>
                    <p>{progressReport.timeSpent} hours</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Subject Progress</h3>
                  <div className="space-y-4">
                    {Object.entries(progressReport.subjectProgress).map(([subject, progress]) => (
                      <div key={subject} className="space-y-1">
                        <div className="flex justify-between items-centre">
                          <span>{getSubjectName(subject as SubjectArea)}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Strengths</h3>
                    {progressReport.strengths.map((strength, index) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-md p-4 mb-3">
                        <h4 className="font-medium">{getSubjectName(strength.subject)}</h4>
                        <p className="text-sm mt-1">{strength.evidence}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {strength.conceptsStrong.map((concept, i) => (
                            <Badge key={i} variant="outline" className="bg-green-100 dark:bg-green-900/30">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
                    {progressReport.areasForImprovement.map((area, index) => (
                      <div key={index} className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-4 mb-3">
                        <h4 className="font-medium">{getSubjectName(area.subject)}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {area.conceptsToImprove.map((concept, i) => (
                            <Badge key={i} variant="outline" className="bg-amber-100 dark:bg-amber-900/30">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium">Suggested Activities:</p>
                          <ul className="text-sm mt-1 space-y-1">
                            {area.suggestedActivities.map((activity, i) => (
                              <li key={i} className="flex items-centre">
                                <ArrowUpRight className="h-4 w-4 mr-1 text-amber-600" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Next Steps</h3>
                  <ul className="space-y-2">
                    {progressReport.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-muted rounded-lg p-4 mt-6">
                  <h3 className="font-medium mb-2">UK Curriculum Alignment</h3>
                  <p className="text-sm">
                    This progress report is aligned with the UK National Curriculum for Key Stage {learnerProfile.keyStage.replace('ks', '')}.
                    All assessments and activities are mapped to curriculum standards to ensure comprehensive coverage.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline">
                  Download Report
                </Button>
                <Button>
                  View Detailed Analytics
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col items-centre justify-centre py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Progress Report</h3>
            <p className="text-muted-foreground text-centre max-w-md">
              You don't have a progress report yet. Generate one to see your learning progress.
            </p>
            <Button 
              onClick={generateProgressReport} 
              className="mt-4"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Generate Progress Report
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="activities" className="mt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Learning Activities</h3>
          
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{activity.title}</CardTitle>
                    <Badge variant="outline">
                      {getSubjectName(activity.subject)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-centre">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm">{activity.timeSpent} minutes</span>
                    </div>
                    
                    {activity.score !== null && (
                      <div className="flex items-centre">
                        <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Score: {activity.score}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-centre">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm">{formatTimeAgo(activity.completedAt)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-centre justify-centre py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recent Activities</h3>
              <p className="text-muted-foreground text-centre max-w-md">
                You haven't completed any learning activities recently. Start a learning path to track your progress.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <div className="mt-8 bg-muted rounded-lg p-4">
        <h3 className="font-medium mb-2">How Progress Monitoring Works</h3>
        <p className="text-sm mb-4">
          Our AI-powered progress monitoring system helps you stay on track with your learning goals:
        </p>
        <ul className="text-sm space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Continuously analyzes your learning activities and performance</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Identifies patterns and trends in your learning journey</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Provides timely alerts when intervention might be helpful</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Celebrates achievements and progress milestones</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Generates comprehensive reports aligned with UK curriculum standards</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
