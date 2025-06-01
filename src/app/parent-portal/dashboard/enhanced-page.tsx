import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  User,
  Settings,
  PlusCircle,
  X,
  Move,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Bookmark,
  LayoutDashboard
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

import { Child, ChildProgressSummary, UKSubject } from '@/lib/parent-portal/types';

// Enhanced mock data for demonstration
const mockChildren: Child[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: new Date('2015-05-10'),
    yearGroup: 5,
    keyStage: 'KS2',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/child-1.png',
    learningStyle: 'VISUAL'
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Johnson',
    dateOfBirth: new Date('2017-08-22'),
    yearGroup: 3,
    keyStage: 'KS2',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/child-2.png',
    learningStyle: 'KINESTHETIC'
  }
];

// Mock progress summaries for each child
const mockProgressSummaries = {
  '1': {
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
  },
  '2': {
    childId: '2',
    overallProgress: 72,
    subjectProgress: [
      { subject: 'ENGLISH', progress: 68, trend: 'steady', currentLevel: '3A', targetLevel: '4C' },
      { subject: 'MATHEMATICS', progress: 80, trend: 'improving', currentLevel: '4C', targetLevel: '4B' },
      { subject: 'SCIENCE', progress: 75, trend: 'steady', currentLevel: '3A', targetLevel: '4C' },
      { subject: 'HISTORY', progress: 65, trend: 'steady', currentLevel: '3B', targetLevel: '3A' },
      { subject: 'ART', progress: 90, trend: 'improving', currentLevel: '4A', targetLevel: '5C' }
    ],
    recentAssessments: [
      {
        id: 'a3',
        title: 'Phonics Assessment',
        subject: 'ENGLISH',
        date: new Date('2025-05-18'),
        score: 38,
        maxScore: 45,
        percentile: 78
      },
      {
        id: 'a4',
        title: 'Addition and Subtraction',
        subject: 'MATHEMATICS',
        date: new Date('2025-05-14'),
        score: 22,
        maxScore: 25,
        percentile: 88
      }
    ],
    learningPathProgress: 70,
    curriculumCoverage: [
      { subject: 'ENGLISH', keyStage: 'KS2', topicsCovered: 12, totalTopics: 20, coverage: 60 },
      { subject: 'MATHEMATICS', keyStage: 'KS2', topicsCovered: 14, totalTopics: 18, coverage: 78 },
      { subject: 'SCIENCE', keyStage: 'KS2', topicsCovered: 10, totalTopics: 15, coverage: 67 }
    ],
    strengths: [
      'Mathematical reasoning',
      'Artistic expression',
      'Hands-on activities',
      'Group collaboration'
    ],
    areasForImprovement: [
      'Reading fluency',
      'Handwriting',
      'Attention to detail'
    ],
    recentAchievements: [
      {
        id: 'ach3',
        title: 'Maths Star',
        description: 'Top marks in weekly maths challenge',
        date: new Date('2025-05-12'),
        type: 'academic'
      },
      {
        id: 'ach4',
        title: 'Art Exhibition',
        description: 'Artwork selected for school exhibition',
        date: new Date('2025-05-08'),
        type: 'creative'
      }
    ],
    upcomingMilestones: [
      {
        id: 'm3',
        title: 'Reading Fluency',
        description: 'Reach target reading speed of 90 words per minute',
        targetDate: new Date('2025-06-10'),
        progress: 75,
        subject: 'ENGLISH'
      },
      {
        id: 'm4',
        title: 'Times Tables',
        description: 'Master multiplication tables up to 10',
        targetDate: new Date('2025-06-30'),
        progress: 85,
        subject: 'MATHEMATICS'
      }
    ]
  }
};

// Mock notifications
const mockNotifications = [
  {
    id: 'n1',
    childId: '1',
    title: 'New Assessment Result',
    description: 'Emma has completed the Reading Comprehension assessment',
    date: new Date('2025-05-15'),
    read: false,
    type: 'assessment',
    priority: 'medium'
  },
  {
    id: 'n2',
    childId: '1',
    title: 'Teacher Message',
    description: 'Ms. Wilson has sent you a message',
    date: new Date('2025-05-14'),
    read: true,
    type: 'message',
    priority: 'high'
  },
  {
    id: 'n3',
    childId: '1',
    title: 'Achievement Unlocked',
    description: 'Emma has earned the Reading Champion badge',
    date: new Date('2025-05-10'),
    read: true,
    type: 'achievement',
    priority: 'low'
  },
  {
    id: 'n4',
    childId: '2',
    title: 'New Assessment Result',
    description: 'James has completed the Addition and Subtraction assessment',
    date: new Date('2025-05-14'),
    read: false,
    type: 'assessment',
    priority: 'medium'
  },
  {
    id: 'n5',
    childId: '2',
    title: 'Achievement Unlocked',
    description: 'James has earned the Maths Star badge',
    date: new Date('2025-05-12'),
    read: false,
    type: 'achievement',
    priority: 'low'
  }
];

// Mock upcoming events
const mockEvents = [
  {
    id: 'e1',
    childId: '1',
    title: 'Parent-Teacher Meeting',
    date: new Date('2025-06-05'),
    time: '16:00 - 16:30',
    location: 'Classroom 3B'
  },
  {
    id: 'e2',
    childId: '1',
    title: 'School Trip - Science Museum',
    date: new Date('2025-06-12'),
    time: '09:00 - 15:00',
    location: 'London Science Museum'
  },
  {
    id: 'e3',
    childId: '2',
    title: 'Parent-Teacher Meeting',
    date: new Date('2025-06-05'),
    time: '16:30 - 17:00',
    location: 'Classroom 2A'
  },
  {
    id: 'e4',
    childId: '2',
    title: 'Sports Day',
    date: new Date('2025-06-18'),
    time: '13:00 - 15:30',
    location: 'School Playing Field'
  }
];

// Default widget configuration
const defaultWidgets = [
  { id: 'child-profile', title: 'Child Profile', enabled: true, order: 1, size: 'small' },
  { id: 'quick-overview', title: 'Quick Overview', enabled: true, order: 2, size: 'large' },
  { id: 'recent-assessments', title: 'Recent Assessments', enabled: true, order: 3, size: 'medium' },
  { id: 'upcoming-events', title: 'Upcoming Events', enabled: true, order: 4, size: 'small' },
  { id: 'strengths-improvements', title: 'Strengths & Areas for Improvement', enabled: true, order: 5, size: 'medium' },
  { id: 'subject-progress', title: 'Subject Progress', enabled: true, order: 6, size: 'medium' },
  { id: 'achievements', title: 'Recent Achievements', enabled: true, order: 7, size: 'small' },
  { id: 'curriculum-coverage', title: 'Curriculum Coverage', enabled: true, order: 8, size: 'medium' },
  { id: 'wellbeing-summary', title: 'Wellbeing Summary', enabled: true, order: 9, size: 'small' }
];

export default function EnhancedParentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0].id);
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [progressSummary, setProgressSummary] = useState(mockProgressSummaries[selectedChildId]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [events, setEvents] = useState(mockEvents);
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [showAllChildren, setShowAllChildren] = useState(false);
  
  // Update selected child and progress summary when selectedChildId changes
  useEffect(() => {
    const child = mockChildren.find(c => c.id === selectedChildId);
    if (child) {
      setSelectedChild(child);
      setProgressSummary(mockProgressSummaries[selectedChildId]);
    }
  }, [selectedChildId]);
  
  // Filter notifications based on selected child and filter
  const filteredNotifications = notifications.filter(notification => {
    if (notificationFilter === 'all') {
      return showAllChildren ? true : notification.childId === selectedChildId;
    } else {
      return (showAllChildren ? true : notification.childId === selectedChildId) && 
             notification.type === notificationFilter;
    }
  });
  
  // Filter events based on selected child
  const filteredEvents = events.filter(event => {
    return showAllChildren ? true : event.childId === selectedChildId;
  });
  
  // Get trend icon
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
  
  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Format short date for display
  const formatShortDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  };
  
  // Handle widget reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setWidgets(updatedItems);
  };
  
  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };
  
  // Change widget size
  const changeWidgetSize = (widgetId, size) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, size } : widget
    ));
  };
  
  // Reset widget configuration to default
  const resetWidgetConfiguration = () => {
    setWidgets(defaultWidgets);
  };
  
  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'assessment':
        return <FileText className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />;
      case 'message':
        return <MessageSquare className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />;
      case 'achievement':
        return <Star className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />;
      default:
        return <Bell className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />;
    }
  };
  
  // Get child name by ID
  const getChildName = (childId) => {
    const child = mockChildren.find(c => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : 'Unknown Child';
  };
  
  // Render widget based on ID and size
  const renderWidget = (widget) => {
    if (!widget.enabled) return null;
    
    const widgetClasses = {
      small: 'col-span-1',
      medium: 'col-span-1 md:col-span-2',
      large: 'col-span-1 md:col-span-3'
    };
    
    switch (widget.id) {
      case 'child-profile':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Child Profile</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
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
                    {selectedChild.learningStyle.replace('_', '/')} Learner
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
        );
        
      case 'quick-overview':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Quick Overview</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
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
                  <p className="text-2xl font-bold mb-1">
                    {notifications.filter(n => n.childId === selectedChild.id && n.type === 'message' && !n.read).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Unread messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'recent-assessments':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Recent Assessments</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Latest assessment results for {selectedChild.firstName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressSummary.recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{assessment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assessment.subject.replace('_', ' ')} • {formatDate(assessment.date)}</p>
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
        );
        
      case 'upcoming-events':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Upcoming Events</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Important dates and events
                {showAllChildren && <span className="ml-1">for all children</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 items-start">
                    <div className="bg-blue-100 text-blue-700 rounded-lg p-2 text-center min-w-[50px]">
                      <p className="text-xs font-medium">{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(event.date)}</p>
                      <p className="text-lg font-bold">{event.date.getDate()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {showAllChildren && (
                        <p className="text-xs font-medium text-blue-600">
                          {getChildName(event.childId)}
                        </p>
                      )}
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
        );
        
      case 'strengths-improvements':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Strengths & Areas for Improvement</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Based on recent assessments and teacher feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {progressSummary.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {progressSummary.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Upcoming Milestones</h4>
                <div className="space-y-4">
                  {progressSummary.upcomingMilestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{milestone.title}</h5>
                          <p className="text-sm text-muted-foreground">
                            {milestone.subject.replace('_', ' ')} • Due {formatDate(milestone.targetDate)}
                          </p>
                        </div>
                        <Badge variant="outline">{milestone.progress}%</Badge>
                      </div>
                      <p className="text-sm mb-2">{milestone.description}</p>
                      <Progress value={milestone.progress} className={getProgressColor(milestone.progress)} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'subject-progress':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Subject Progress</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressSummary.subjectProgress.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{subject.subject.replace('_', ' ')}</h4>
                        <p className="text-xs text-muted-foreground">
                          Current Level: {subject.currentLevel} • Target: {subject.targetLevel}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{subject.progress}%</span>
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                    <Progress value={subject.progress} className={getProgressColor(subject.progress)} />
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'achievements':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Recent Achievements</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Badges and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressSummary.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Star className="h-5 w-5 text-purple-500" />
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
        );
        
      case 'curriculum-coverage':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Curriculum Coverage</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Progress through the curriculum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressSummary.curriculumCoverage.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{subject.subject.replace('_', ' ')}</h4>
                      <span className="text-sm">{subject.coverage}%</span>
                    </div>
                    <Progress value={subject.coverage} className={getProgressColor(subject.coverage)} />
                    <p className="text-xs text-muted-foreground">
                      {subject.topicsCovered} of {subject.totalTopics} topics covered
                    </p>
                  </div>
                ))}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                    Upcoming Topics
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <div>
                        <span className="font-medium">Fractions and Decimals</span>
                        <span className="text-muted-foreground ml-2">Mathematics</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <div>
                        <span className="font-medium">Persuasive Writing</span>
                        <span className="text-muted-foreground ml-2">English</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <div>
                        <span className="font-medium">Forces and Motion</span>
                        <span className="text-muted-foreground ml-2">Science</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Full Curriculum Map
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'wellbeing-summary':
        return (
          <Card className={widgetClasses[widget.size]}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Wellbeing Summary</span>
                {isCustomizing && (
                  <div className="flex items-center gap-2">
                    <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleWidgetVisibility(widget.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Weekly wellbeing overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Mood</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🙂</span>
                    <span className="text-sm font-medium flex items-center">
                      Good
                      <span className="text-green-500 ml-1">↑</span>
                    </span>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Sleep</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">😴</span>
                    <span className="text-sm font-medium flex items-center">
                      Good
                      <span className="text-amber-500 ml-1">→</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Behavior</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Helpfulness</p>
                      <p className="text-xs text-muted-foreground">Helped a classmate with their work</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Attention</p>
                      <p className="text-xs text-muted-foreground">Occasional difficulty focusing</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Heart className="h-4 w-4 mr-2" />
                View Wellbeing Details
              </Button>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
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
            <Button variant="outline" size="icon" onClick={() => setNotificationFilter('all')}>
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/images/avatars/parent.png" alt="Parent" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Parent Account</p>
              <p className="text-xs text-muted-foreground">Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {mockChildren.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="show-all-children" 
                checked={showAllChildren}
                onCheckedChange={setShowAllChildren}
              />
              <Label htmlFor="show-all-children">Show all children</Label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCustomizing(!isCustomizing)}>
            <Settings className="h-4 w-4 mr-2" />
            {isCustomizing ? 'Done Customizing' : 'Customize Dashboard'}
          </Button>
          
          {isCustomizing && (
            <Button variant="outline" onClick={resetWidgetConfiguration}>
              Reset Layout
            </Button>
          )}
        </div>
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
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {isCustomizing ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Customization</CardTitle>
                  <CardDescription>
                    Drag and drop widgets to reorder, toggle visibility, or change size
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="widgets">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {widgets
                            .sort((a, b) => a.order - b.order)
                            .map((widget, index) => (
                              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border rounded-lg p-3 bg-white flex justify-between items-center"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div {...provided.dragHandleProps} className="cursor-move">
                                        <Move className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch 
                                          id={`widget-${widget.id}`}
                                          checked={widget.enabled}
                                          onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                                        />
                                        <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                                          {widget.title}
                                        </Label>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Select value={widget.size} onValueChange={(value) => changeWidgetSize(widget.id, value)}>
                                        <SelectTrigger className="w-[100px]">
                                          <SelectValue placeholder="Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="small">Small</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetWidgetConfiguration}>
                    Reset to Default
                  </Button>
                  <Button onClick={() => setIsCustomizing(false)}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {widgets
                  .filter(widget => widget.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map(widget => renderWidget(widget))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {widgets
                .filter(widget => widget.enabled)
                .sort((a, b) => a.order - b.order)
                .map(widget => renderWidget(widget))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated with important information about {showAllChildren ? 'your children' : selectedChild.firstName}
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={notificationFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNotificationFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={notificationFilter === 'message' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNotificationFilter('message')}
                >
                  Messages
                </Button>
                <Button 
                  variant={notificationFilter === 'assessment' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNotificationFilter('assessment')}
                >
                  Assessments
                </Button>
                <Button 
                  variant={notificationFilter === 'achievement' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNotificationFilter('achievement')}
                >
                  Achievements
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100' : 
                          notification.priority === 'medium' ? 'bg-amber-100' : 
                          'bg-blue-100'
                        }`}>
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{notification.title}</h4>
                              {showAllChildren && (
                                <p className="text-xs font-medium text-blue-600">
                                  {getChildName(notification.childId)}
                                </p>
                              )}
                              <p className="text-sm">{notification.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatShortDate(notification.date)}
                            </span>
                          </div>
                          
                          {!notification.read && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto text-blue-600"
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would be implemented similarly */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>
                Detailed view of {selectedChild.firstName}'s academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Academic Progress content will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>
                Stay connected with {selectedChild.firstName}'s educators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Communication content will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing</CardTitle>
              <CardDescription>
                Monitor and support {selectedChild.firstName}'s wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Wellbeing content will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Learning resources to support {selectedChild.firstName} at home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Resources content will be implemented in the next phase
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
