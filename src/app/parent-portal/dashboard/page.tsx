'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Heart, 
  Home, 
  MessageSquare, 
  Star, 
  User 
} from 'lucide-react';

import { Child, ChildProgressSummary, UKSubject } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockChild: Child = {
  id: '1',
  firstName: 'Emma',
  lastName: 'Johnson',
  dateOfBirth: new Date('2015-05-10'),
  yearGroup: 5,
  keyStage: 'KS2',
  school: 'Oakwood Primary School',
  profileImageUrl: '/images/avatars/child-1.png',
  learningStyle: 'VISUAL'
};

const mockProgressSummary: ChildProgressSummary = {
  childId: '1',
  overallProgress: 78,
  subjectProgress: [
    { subject: 'ENGLISH', progress: 82, trend: 'improving', currentLevel: '5B', targetLevel: '5A' },
    { subject: 'MATHEMATICS', progress: 75, trend: 'steady', currentLevel: '5C', targetLevel: '5B' },
    { subject: 'SCIENCE', progress: 88, trend: 'improving', currentLevel: '5A', targetLevel: '6C' },
    { subject: 'HISTORY', progress: 70, trend: 'steady', currentLevel: '5C', targetLevel: '5B' },
    { subject: 'GEOGRAPHY', progress: 65, trend: 'declining', currentLevel: '4A', targetLevel: '5C' }
  ],
  recentAssessments: [
    {
      id: 'a1',
      title: 'Reading Comprehension',
      subject: 'ENGLISH',
      date: new Date('2025-05-15'),
      score: 42,
      maxScore: 50,
      percentile: 84
    },
    {
      id: 'a2',
      title: 'Number and Place Value',
      subject: 'MATHEMATICS',
      date: new Date('2025-05-12'),
      score: 18,
      maxScore: 25,
      percentile: 72
    }
  ],
  learningPathProgress: 65,
  curriculumCoverage: [
    { subject: 'ENGLISH', keyStage: 'KS2', topicsCovered: 18, totalTopics: 24, coverage: 75 },
    { subject: 'MATHEMATICS', keyStage: 'KS2', topicsCovered: 15, totalTopics: 22, coverage: 68 },
    { subject: 'SCIENCE', keyStage: 'KS2', topicsCovered: 12, totalTopics: 15, coverage: 80 }
  ],
  strengths: [
    'Reading comprehension',
    'Scientific investigation',
    'Creative writing',
    'Problem solving'
  ],
  areasForImprovement: [
    'Spelling accuracy',
    'Times tables recall',
    'Geography map skills'
  ],
  recentAchievements: [
    {
      id: 'ach1',
      title: 'Reading Champion',
      description: 'Read 10 books this term',
      date: new Date('2025-05-10'),
      type: 'academic'
    },
    {
      id: 'ach2',
      title: 'Science Star',
      description: 'Outstanding science project',
      date: new Date('2025-05-05'),
      type: 'academic'
    }
  ],
  upcomingMilestones: [
    {
      id: 'm1',
      title: 'Fractions Mastery',
      description: 'Complete all fractions modules',
      targetDate: new Date('2025-06-15'),
      progress: 60,
      subject: 'MATHEMATICS'
    },
    {
      id: 'm2',
      title: 'Reading Challenge',
      description: 'Complete 15 books this term',
      targetDate: new Date('2025-07-20'),
      progress: 70,
      subject: 'ENGLISH'
    }
  ]
};

// Mock notifications
const mockNotifications = [
  {
    id: 'n1',
    title: 'New Assessment Result',
    description: 'Emma has completed the Reading Comprehension assessment',
    date: new Date('2025-05-15'),
    read: false,
    type: 'assessment'
  },
  {
    id: 'n2',
    title: 'Teacher Message',
    description: 'Ms. Wilson has sent you a message',
    date: new Date('2025-05-14'),
    read: true,
    type: 'message'
  },
  {
    id: 'n3',
    title: 'Achievement Unlocked',
    description: 'Emma has earned the Reading Champion badge',
    date: new Date('2025-05-10'),
    read: true,
    type: 'achievement'
  }
];

// Mock upcoming events
const mockEvents = [
  {
    id: 'e1',
    title: 'Parent-Teacher Meeting',
    date: new Date('2025-06-05'),
    time: '16:00 - 16:30',
    location: 'Classroom 3B'
  },
  {
    id: 'e2',
    title: 'School Trip - Science Museum',
    date: new Date('2025-06-12'),
    time: '09:00 - 15:00',
    location: 'London Science Museum'
  }
];

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(mockChild);
  const [progressSummary, setProgressSummary] = useState(mockProgressSummary);
  
  // In a real application, these would be fetched from the API
  // useEffect(() => {
  //   const fetchChildData = async () => {
  //     const childData = await getChildProfile(selectedChild.id);
  //     const progressData = await getChildProgressSummary(selectedChild.id);
  //     setSelectedChild(childData);
  //     setProgressSummary(progressData);
  //   };
  //   
  //   fetchChildData();
  // }, [selectedChild.id]);
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <span className="text-green-500">↑</span>;
      case 'declining':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-amber-500">→</span>;
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your child's progress and stay connected with their education
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/images/avatars/parent.png" alt="Parent" />
              <AvatarFallback>PJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Parent Account</p>
              <p className="text-xs text-muted-foreground">Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Child Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={selectedChild.profileImageUrl} alt={`${selectedChild.firstName} ${selectedChild.lastName}`} />
                <AvatarFallback>{selectedChild.firstName.charAt(0)}{selectedChild.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-bold mb-1">{selectedChild.firstName} {selectedChild.lastName}</h3>
              <p className="text-sm text-muted-foreground mb-2">Year {selectedChild.yearGroup} • {selectedChild.keyStage}</p>
              <p className="text-sm mb-4">{selectedChild.school}</p>
              
              {selectedChild.learningStyle && (
                <Badge variant="outline" className="mb-4">
                  {selectedChild.learningStyle} Learner
                </Badge>
              )}
              
              <div className="w-full space-y-2">
                <p className="text-sm font-medium">Overall Progress</p>
                <Progress value={progressSummary.overallProgress} className={getProgressColor(progressSummary.overallProgress)} />
                <p className="text-xs text-right text-muted-foreground">{progressSummary.overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Overview</CardTitle>
            <CardDescription>Key information about {selectedChild.firstName}'s education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Learning Path</h4>
                </div>
                <p className="text-2xl font-bold mb-1">{progressSummary.learningPathProgress}%</p>
                <p className="text-sm text-muted-foreground">Progress complete</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Curriculum</h4>
                </div>
                <p className="text-2xl font-bold mb-1">
                  {Math.round(progressSummary.curriculumCoverage.reduce((sum, item) => sum + item.coverage, 0) / progressSummary.curriculumCoverage.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Coverage across subjects</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Achievements</h4>
                </div>
                <p className="text-2xl font-bold mb-1">{progressSummary.recentAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Recent achievements</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Messages</h4>
                </div>
                <p className="text-2xl font-bold mb-1">2</p>
                <p className="text-sm text-muted-foreground">Unread messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Home className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="progress">
            <BarChart className="h-4 w-4 mr-2" />
            Academic Progress
          </TabsTrigger>
          <TabsTrigger value="communication">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="wellbeing">
            <Heart className="h-4 w-4 mr-2" />
            Wellbeing
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Latest assessment results for {selectedChild.firstName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressSummary.recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{assessment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assessment.subject} • {formatDate(assessment.date)}</p>
                        </div>
                        <Badge>{assessment.score}/{assessment.maxScore}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Score</span>
                          <span>{Math.round((assessment.score / assessment.maxScore) * 100)}%</span>
                        </div>
                        <Progress value={(assessment.score / assessment.maxScore) * 100} className={getProgressColor((assessment.score / assessment.maxScore) * 100)} />
                        {assessment.percentile && (
                          <p className="text-xs text-muted-foreground">
                            Percentile: {assessment.percentile}% (better than {assessment.percentile}% of peers)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Assessments
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important dates and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-lg p-2 text-center min-w-[50px]">
                        <p className="text-xs font-medium">{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(event.date)}</p>
                        <p className="text-lg font-bold">{event.date.getDate()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                        <p className="text-sm">{event.location}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strengths & Areas for Improvement</CardTitle>
                <CardDescription>Based on recent assessments and teacher feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {progressSummary.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-amber-600 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {progressSummary.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Celebrating {selectedChild.firstName}'s successes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressSummary.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(achievement.date)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Performance across curriculum subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressSummary.subjectProgress.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{subject.subject}</h4>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{subject.progress}%</span>
                        {subject.currentLevel && subject.targetLevel && (
                          <span className="text-muted-foreground ml-2">
                            Level: {subject.currentLevel} → {subject.targetLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress value={subject.progress} className={getProgressColor(subject.progress)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Coverage</CardTitle>
                <CardDescription>Progress through the UK curriculum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progressSummary.curriculumCoverage.map((curriculum) => (
                    <div key={curriculum.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{curriculum.subject}</h4>
                        <span className="text-sm font-medium">{curriculum.coverage}%</span>
                      </div>
                      <Progress value={curriculum.coverage} className={getProgressColor(curriculum.coverage)} />
                      <p className="text-xs text-muted-foreground">
                        {curriculum.topicsCovered} of {curriculum.totalTopics} topics covered
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
                <CardDescription>Learning goals and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressSummary.upcomingMilestones.map((milestone) => (
                    <div key={milestone.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge variant="outline">{milestone.subject}</Badge>
                      </div>
                      <p className="text-sm">{milestone.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: {formatDate(milestone.targetDate)}</span>
                        <span>{milestone.progress}% complete</span>
                      </div>
                      <Progress value={milestone.progress} className={getProgressColor(milestone.progress)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="communication">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communication with teachers and staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg divide-y">
                    {mockNotifications.filter(n => n.type === 'message').map((notification) => (
                      <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                              {notification.title}
                            </h4>
                            <p className="text-sm">{notification.description}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">
                      View All Messages
                    </Button>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      New Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className={`p-3 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <p className="text-sm">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.date)}</p>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellbeing Check-in</CardTitle>
                <CardDescription>Monitor {selectedChild.firstName}'s emotional wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Today's Check-in</h4>
                    <p className="text-sm mb-4">How is {selectedChild.firstName} feeling today?</p>
                    
                    <div className="flex justify-between items-center mb-6">
                      <button className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-1">
                          😢
                        </div>
                        <span className="text-xs">Very Sad</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-1">
                          😔
                        </div>
                        <span className="text-xs">Sad</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-1">
                          😐
                        </div>
                        <span className="text-xs">Neutral</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-1">
                          🙂
                        </div>
                        <span className="text-xs">Happy</span>
                      </button>
                      
                      <button className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-1">
                          😄
                        </div>
                        <span className="text-xs">Very Happy</span>
                      </button>
                    </div>
                    
                    <Button className="w-full">Submit Check-in</Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sleep Quality</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last 7 days average</span>
                        <span>Good</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 bg-green-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-green-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-green-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-amber-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-green-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-green-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-amber-500 rounded-full flex-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Energy Level</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last 7 days average</span>
                        <span>Medium</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 bg-blue-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-blue-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-amber-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-blue-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-amber-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-blue-500 rounded-full flex-1"></div>
                        <div className="h-2 bg-blue-500 rounded-full flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Behaviour Records</CardTitle>
                <CardDescription>Recent behaviour notes and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Excellent Teamwork</h4>
                      <Badge variant="outline" className="bg-green-50">Positive</Badge>
                    </div>
                    <p className="text-sm">Emma showed excellent collaboration skills during the group science project.</p>
                    <p className="text-xs text-muted-foreground mt-1">15 May 2025 • Ms. Wilson</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Helping Others</h4>
                      <Badge variant="outline" className="bg-green-50">Positive</Badge>
                    </div>
                    <p className="text-sm">Emma helped a classmate who was struggling with their maths work.</p>
                    <p className="text-xs text-muted-foreground mt-1">10 May 2025 • Mr. Thomas</p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Homework Reminder</h4>
                      <Badge variant="outline" className="bg-amber-50">Note</Badge>
                    </div>
                    <p className="text-sm">Emma forgot to complete her geography homework. Please ensure it's completed for tomorrow.</p>
                    <p className="text-xs text-muted-foreground mt-1">8 May 2025 • Mrs. Johnson</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View All Behaviour Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
                <CardDescription>Personalized learning resources for {selectedChild.firstName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-blue-100 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-blue-500" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Fractions Made Easy</h4>
                          <Badge>Maths</Badge>
                        </div>
                        <p className="text-sm mb-2">Interactive lessons on fractions with visual examples.</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>20 minutes</span>
                          <span>Visual Learning</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-green-100 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-green-500" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Spelling Practice</h4>
                          <Badge>English</Badge>
                        </div>
                        <p className="text-sm mb-2">Interactive spelling games focusing on common mistakes.</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>15 minutes</span>
                          <span>Interactive</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-purple-100 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-purple-500" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Map Skills Tutorial</h4>
                          <Badge>Geography</Badge>
                        </div>
                        <p className="text-sm mb-2">Video tutorial on reading and interpreting different maps.</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>10 minutes</span>
                          <span>Visual Learning</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-amber-100 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-amber-500" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Times Tables Practice</h4>
                          <Badge>Maths</Badge>
                        </div>
                        <p className="text-sm mb-2">Interactive games to improve times tables recall.</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>15 minutes</span>
                          <span>Interactive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View All Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Style Support</CardTitle>
                <CardDescription>How to support {selectedChild.firstName}'s learning style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Visual Learner
                    </h4>
                    <p className="text-sm mb-4">
                      {selectedChild.firstName} learns best through visual aids, diagrams, and demonstrations.
                    </p>
                    
                    <h5 className="text-sm font-medium mb-2">How to support at home:</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Use diagrams and charts when explaining concepts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Encourage mind mapping for organizing ideas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Provide colourful visual aids for key information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Use videos and demonstrations when teaching new skills</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Learning Style Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
