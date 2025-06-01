import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Activity, 
  Smile, 
  Frown, 
  Meh,
  ThumbsUp,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronRight,
  User,
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

import { Child } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockChildren = [
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

// Mock wellbeing data
const mockWellbeingData = [
  {
    childId: '1',
    date: new Date('2025-05-30'),
    mood: 'happy',
    sleepHours: 8.5,
    physicalActivity: 'high',
    screenTime: 2.5,
    socialInteraction: 'good',
    anxietyLevel: 'low',
    notes: 'Emma had a great day at school and enjoyed her swimming lesson after school.',
    wellbeingScore: 85
  },
  {
    childId: '1',
    date: new Date('2025-05-29'),
    mood: 'neutral',
    sleepHours: 7.5,
    physicalActivity: 'medium',
    screenTime: 3,
    socialInteraction: 'moderate',
    anxietyLevel: 'medium',
    notes: 'Emma seemed a bit tired today, possibly due to less sleep last night.',
    wellbeingScore: 70
  },
  {
    childId: '1',
    date: new Date('2025-05-28'),
    mood: 'happy',
    sleepHours: 9,
    physicalActivity: 'high',
    screenTime: 2,
    socialInteraction: 'excellent',
    anxietyLevel: 'low',
    notes: 'Emma had a playdate after school and was very energetic and happy.',
    wellbeingScore: 90
  },
  {
    childId: '1',
    date: new Date('2025-05-27'),
    mood: 'sad',
    sleepHours: 7,
    physicalActivity: 'low',
    screenTime: 4,
    socialInteraction: 'poor',
    anxietyLevel: 'high',
    notes: 'Emma was upset about an argument with a friend at school.',
    wellbeingScore: 55
  },
  {
    childId: '1',
    date: new Date('2025-05-26'),
    mood: 'neutral',
    sleepHours: 8,
    physicalActivity: 'medium',
    screenTime: 2.5,
    socialInteraction: 'good',
    anxietyLevel: 'medium',
    notes: 'Normal day, Emma was a bit quiet but otherwise fine.',
    wellbeingScore: 75
  },
  {
    childId: '1',
    date: new Date('2025-05-25'),
    mood: 'happy',
    sleepHours: 8.5,
    physicalActivity: 'high',
    screenTime: 2,
    socialInteraction: 'good',
    anxietyLevel: 'low',
    notes: 'Weekend family outing to the park, Emma was very happy.',
    wellbeingScore: 88
  },
  {
    childId: '1',
    date: new Date('2025-05-24'),
    mood: 'happy',
    sleepHours: 9,
    physicalActivity: 'high',
    screenTime: 3,
    socialInteraction: 'excellent',
    anxietyLevel: 'low',
    notes: 'Birthday party for a friend, Emma had a great time.',
    wellbeingScore: 92
  },
  {
    childId: '2',
    date: new Date('2025-05-30'),
    mood: 'neutral',
    sleepHours: 8,
    physicalActivity: 'medium',
    screenTime: 2,
    socialInteraction: 'moderate',
    anxietyLevel: 'medium',
    notes: 'James was a bit tired after his football practice.',
    wellbeingScore: 72
  },
  {
    childId: '2',
    date: new Date('2025-05-29'),
    mood: 'happy',
    sleepHours: 8.5,
    physicalActivity: 'high',
    screenTime: 1.5,
    socialInteraction: 'good',
    anxietyLevel: 'low',
    notes: 'James had a good day at school and enjoyed his reading time.',
    wellbeingScore: 85
  },
  {
    childId: '2',
    date: new Date('2025-05-28'),
    mood: 'happy',
    sleepHours: 9,
    physicalActivity: 'high',
    screenTime: 1,
    socialInteraction: 'excellent',
    anxietyLevel: 'low',
    notes: 'James had a playdate and was very active and happy.',
    wellbeingScore: 90
  }
];

// Mock wellbeing insights
const mockWellbeingInsights = [
  {
    childId: '1',
    type: 'pattern',
    title: 'Sleep Pattern Impact',
    description: 'Emma\'s mood and wellbeing scores are consistently higher on days following 8+ hours of sleep.',
    recommendation: 'Maintaining a consistent bedtime routine could help improve overall wellbeing.',
    priority: 'medium',
    date: new Date('2025-05-30')
  },
  {
    childId: '1',
    type: 'alert',
    title: 'Social Interaction Concern',
    description: 'There was a notable drop in social interaction on May 27th, coinciding with lower mood and higher anxiety.',
    recommendation: 'Consider checking in about school friendships and providing additional support.',
    priority: 'high',
    date: new Date('2025-05-28')
  },
  {
    childId: '1',
    type: 'positive',
    title: 'Physical Activity Benefit',
    description: 'Days with high physical activity consistently show improved mood and lower anxiety levels.',
    recommendation: 'Continue encouraging regular physical activities that Emma enjoys.',
    priority: 'low',
    date: new Date('2025-05-30')
  },
  {
    childId: '2',
    type: 'pattern',
    title: 'Screen Time Balance',
    description: 'James shows better wellbeing scores on days with less than 2 hours of screen time.',
    recommendation: 'Consider maintaining current screen time limits and encouraging alternative activities.',
    priority: 'medium',
    date: new Date('2025-05-30')
  },
  {
    childId: '2',
    type: 'positive',
    title: 'Social Development',
    description: 'James shows excellent social interaction during playdates, which positively impacts his overall wellbeing.',
    recommendation: 'Continue providing opportunities for social interaction with peers.',
    priority: 'low',
    date: new Date('2025-05-29')
  }
];

// Mock wellbeing resources
const mockWellbeingResources = [
  {
    id: 'wr1',
    title: 'Supporting Emotional Wellbeing in Children',
    description: 'A guide for parents on how to support their child\'s emotional wellbeing and mental health.',
    type: 'guide',
    url: '/resources/emotional-wellbeing-guide.pdf',
    tags: ['emotional wellbeing', 'mental health', 'support'],
    relevance: 'high'
  },
  {
    id: 'wr2',
    title: 'Sleep Hygiene for School-Age Children',
    description: 'Practical tips and strategies for establishing healthy sleep routines for children.',
    type: 'article',
    url: '/resources/sleep-hygiene-children.pdf',
    tags: ['sleep', 'routines', 'health'],
    relevance: 'high'
  },
  {
    id: 'wr3',
    title: 'Managing Anxiety in Primary School Children',
    description: 'Strategies and techniques to help children manage and reduce anxiety.',
    type: 'guide',
    url: '/resources/managing-anxiety-children.pdf',
    tags: ['anxiety', 'mental health', 'coping strategies'],
    relevance: 'medium'
  },
  {
    id: 'wr4',
    title: 'Physical Activity and Mental Health',
    description: 'How physical activity contributes to better mental health and wellbeing in children.',
    type: 'article',
    url: '/resources/physical-activity-mental-health.pdf',
    tags: ['physical activity', 'mental health', 'wellbeing'],
    relevance: 'medium'
  },
  {
    id: 'wr5',
    title: 'Building Resilience in Children',
    description: 'Practical ways to help children develop resilience and cope with challenges.',
    type: 'guide',
    url: '/resources/building-resilience-children.pdf',
    tags: ['resilience', 'coping', 'emotional development'],
    relevance: 'medium'
  },
  {
    id: 'wr6',
    title: 'Screen Time and Wellbeing Balance',
    description: 'Finding the right balance between screen time and other activities for optimal wellbeing.',
    type: 'article',
    url: '/resources/screen-time-wellbeing.pdf',
    tags: ['screen time', 'balance', 'digital wellbeing'],
    relevance: 'high'
  }
];

// Mock wellbeing activities
const mockWellbeingActivities = [
  {
    id: 'wa1',
    title: 'Mindfulness Moments',
    description: 'Simple mindfulness exercises to do together with your child to promote calm and focus.',
    duration: '5-10 minutes',
    frequency: 'Daily',
    benefits: ['Reduces anxiety', 'Improves focus', 'Promotes emotional regulation'],
    materials: ['None required', 'Optional: quiet space'],
    instructions: 'Find a quiet space where you and your child can sit comfortably. Guide them through focusing on their breath, noticing sensations in their body, or paying attention to sounds around them.',
    ageRange: [5, 12],
    tags: ['mindfulness', 'calm', 'focus']
  },
  {
    id: 'wa2',
    title: 'Gratitude Journal',
    description: 'Help your child develop a habit of gratitude by recording things they\'re thankful for.',
    duration: '5 minutes',
    frequency: 'Daily or several times per week',
    benefits: ['Promotes positive thinking', 'Increases happiness', 'Develops appreciation'],
    materials: ['Notebook or journal', 'Pens or pencils', 'Optional: decorative materials'],
    instructions: 'Set aside time each day for your child to write or draw 3 things they\'re grateful for. These can be simple things like a sunny day or a favorite toy.',
    ageRange: [6, 12],
    tags: ['gratitude', 'journaling', 'positive thinking']
  },
  {
    id: 'wa3',
    title: 'Emotion Charades',
    description: 'A fun game to help children recognize and express different emotions.',
    duration: '15-20 minutes',
    frequency: 'Weekly',
    benefits: ['Emotional literacy', 'Expression skills', 'Family bonding'],
    materials: ['Cards with emotion words or pictures'],
    instructions: 'Take turns acting out different emotions while others guess. After guessing, discuss times when you might feel that emotion and healthy ways to express it.',
    ageRange: [4, 10],
    tags: ['emotions', 'expression', 'games']
  },
  {
    id: 'wa4',
    title: 'Nature Connection Walk',
    description: 'A mindful walk in nature to reduce stress and increase connection with the natural world.',
    duration: '30-60 minutes',
    frequency: 'Weekly',
    benefits: ['Reduces stress', 'Increases physical activity', 'Promotes environmental awareness'],
    materials: ['Comfortable walking shoes', 'Optional: magnifying glass, notebook'],
    instructions: 'Take a walk in a natural area and encourage your child to notice details around them. Ask open questions about what they see, hear, smell, and feel.',
    ageRange: [3, 12],
    tags: ['nature', 'mindfulness', 'physical activity']
  },
  {
    id: 'wa5',
    title: 'Worry Box',
    description: 'Create a special box where children can place their written worries to help manage anxiety.',
    duration: '30 minutes to create, 5 minutes to use',
    frequency: 'As needed',
    benefits: ['Anxiety management', 'Expression of concerns', 'Emotional processing'],
    materials: ['Small box', 'Decorative materials', 'Paper', 'Pens or pencils'],
    instructions: 'Decorate a box together. When your child feels worried, they can write or draw their worry and place it in the box. Set a regular time to look at the worries together and discuss strategies.',
    ageRange: [5, 12],
    tags: ['anxiety', 'coping strategies', 'emotional expression']
  }
];

export default function EnhancedWellbeingPage() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0].id);
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [wellbeingData, setWellbeingData] = useState(mockWellbeingData);
  const [wellbeingInsights, setWellbeingInsights] = useState(mockWellbeingInsights);
  const [wellbeingResources, setWellbeingResources] = useState(mockWellbeingResources);
  const [wellbeingActivities, setWellbeingActivities] = useState(mockWellbeingActivities);
  const [timeRange, setTimeRange] = useState('week');
  const [newEntry, setNewEntry] = useState({
    mood: 'neutral',
    sleepHours: 8,
    physicalActivity: 'medium',
    screenTime: 2,
    socialInteraction: 'moderate',
    anxietyLevel: 'medium',
    notes: ''
  });
  
  // Update selected child when selectedChildId changes
  useEffect(() => {
    const child = mockChildren.find(c => c.id === selectedChildId);
    if (child) {
      setSelectedChild(child);
    }
  }, [selectedChildId]);
  
  // Filter wellbeing data based on selected child and time range
  const getFilteredWellbeingData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'term':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 4); // Approximately a school term
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    return wellbeingData
      .filter(data => data.childId === selectedChildId && data.date >= startDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  // Get filtered insights for selected child
  const getFilteredInsights = () => {
    return wellbeingInsights
      .filter(insight => insight.childId === selectedChildId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  // Get relevant resources based on insights
  const getRelevantResources = () => {
    return wellbeingResources.sort((a, b) => {
      if (a.relevance === 'high' && b.relevance !== 'high') return -1;
      if (a.relevance !== 'high' && b.relevance === 'high') return 1;
      return 0;
    });
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Get mood icon
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'sad':
        return <Frown className="h-6 w-6 text-red-500" />;
      case 'neutral':
      default:
        return <Meh className="h-6 w-6 text-amber-500" />;
    }
  };
  
  // Get physical activity label
  const getActivityLabel = (level) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800 border-green-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get social interaction label
  const getSocialLabel = (level) => {
    switch (level) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Good</Badge>;
      case 'moderate':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Moderate</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get anxiety level label
  const getAnxietyLabel = (level) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get insight priority badge
  const getInsightPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low Priority</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Information</Badge>;
    }
  };
  
  // Get insight icon
  const getInsightIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pattern':
        return <LineChart className="h-5 w-5 text-blue-500" />;
      case 'positive':
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };
  
  // Handle adding a new wellbeing entry
  const handleAddEntry = () => {
    // Calculate wellbeing score based on factors
    const moodScore = newEntry.mood === 'happy' ? 30 : (newEntry.mood === 'neutral' ? 20 : 10);
    const sleepScore = Math.min(Math.max(newEntry.sleepHours - 5, 0) * 5, 20); // 0-20 points
    const activityScore = newEntry.physicalActivity === 'high' ? 15 : (newEntry.physicalActivity === 'medium' ? 10 : 5);
    const screenScore = Math.max(15 - (newEntry.screenTime * 3), 0); // 0-15 points
    const socialScore = newEntry.socialInteraction === 'excellent' ? 15 : 
                        (newEntry.socialInteraction === 'good' ? 12 : 
                         (newEntry.socialInteraction === 'moderate' ? 8 : 4));
    const anxietyScore = newEntry.anxietyLevel === 'low' ? 15 : (newEntry.anxietyLevel === 'medium' ? 8 : 0);
    
    const wellbeingScore = moodScore + sleepScore + activityScore + screenScore + socialScore + anxietyScore;
    
    const newWellbeingEntry = {
      childId: selectedChildId,
      date: new Date(),
      ...newEntry,
      wellbeingScore
    };
    
    setWellbeingData([newWellbeingEntry, ...wellbeingData]);
    
    // Reset form
    setNewEntry({
      mood: 'neutral',
      sleepHours: 8,
      physicalActivity: 'medium',
      screenTime: 2,
      socialInteraction: 'moderate',
      anxietyLevel: 'medium',
      notes: ''
    });
  };
  
  // Get average wellbeing score
  const getAverageWellbeingScore = () => {
    const filteredData = getFilteredWellbeingData();
    if (filteredData.length === 0) return 0;
    
    const sum = filteredData.reduce((total, entry) => total + entry.wellbeingScore, 0);
    return Math.round(sum / filteredData.length);
  };
  
  // Get wellbeing score trend
  const getWellbeingScoreTrend = () => {
    const filteredData = getFilteredWellbeingData();
    if (filteredData.length < 2) return 'stable';
    
    const latest = filteredData[0].wellbeingScore;
    const previous = filteredData[1].wellbeingScore;
    
    if (latest > previous + 5) return 'improving';
    if (latest < previous - 5) return 'declining';
    return 'stable';
  };
  
  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'stable':
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wellbeing</h1>
          <p className="text-muted-foreground mt-1">
            Track and support your child's emotional and mental wellbeing
          </p>
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
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="term">This term</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Wellbeing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{getAverageWellbeingScore()}</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={getAverageWellbeingScore() >= 80 ? "#22c55e" : 
                           getAverageWellbeingScore() >= 60 ? "#eab308" : 
                           "#ef4444"} 
                    strokeWidth="10" 
                    strokeDasharray={`${getAverageWellbeingScore() * 2.83} 283`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                {getTrendIcon(getWellbeingScoreTrend())}
                <span>
                  {getWellbeingScoreTrend() === 'improving' ? 'Improving' : 
                   getWellbeingScoreTrend() === 'declining' ? 'Declining' : 
                   'Stable'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {getFilteredWellbeingData().length > 0 ? (
                <>
                  <div className="mb-4">
                    {getMoodIcon(getFilteredWellbeingData()[0].mood)}
                  </div>
                  <p className="text-lg font-medium capitalize">
                    {getFilteredWellbeingData()[0].mood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last recorded: {formatDate(getFilteredWellbeingData()[0].date)}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">No mood data available</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Key Factors</CardTitle>
          </CardHeader>
          <CardContent>
            {getFilteredWellbeingData().length > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Sleep</span>
                    <span className="text-sm font-medium">{getFilteredWellbeingData()[0].sleepHours} hours</span>
                  </div>
                  <Progress value={getFilteredWellbeingData()[0].sleepHours * 10} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Physical Activity</span>
                    <span>{getActivityLabel(getFilteredWellbeingData()[0].physicalActivity)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Screen Time</span>
                    <span className="text-sm font-medium">{getFilteredWellbeingData()[0].screenTime} hours</span>
                  </div>
                  <Progress value={Math.max(100 - getFilteredWellbeingData()[0].screenTime * 20, 0)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Social Interaction</span>
                    <span>{getSocialLabel(getFilteredWellbeingData()[0].socialInteraction)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Anxiety Level</span>
                    <span>{getAnxietyLabel(getFilteredWellbeingData()[0].anxietyLevel)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No wellbeing data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracking">
            <Activity className="h-4 w-4 mr-2" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Brain className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Heart className="h-4 w-4 mr-2" />
            Activities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Wellbeing Entry</CardTitle>
              <CardDescription>
                Record your observations of {selectedChild.firstName}'s wellbeing today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mood</label>
                    <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({...newEntry, mood: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="sad">Sad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sleep (hours)</label>
                    <Input 
                      type="number" 
                      min="0" 
                      max="24" 
                      step="0.5" 
                      value={newEntry.sleepHours} 
                      onChange={(e) => setNewEntry({...newEntry, sleepHours: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Physical Activity</label>
                    <Select value={newEntry.physicalActivity} onValueChange={(value) => setNewEntry({...newEntry, physicalActivity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Screen Time (hours)</label>
                    <Input 
                      type="number" 
                      min="0" 
                      max="24" 
                      step="0.5" 
                      value={newEntry.screenTime} 
                      onChange={(e) => setNewEntry({...newEntry, screenTime: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Social Interaction</label>
                    <Select value={newEntry.socialInteraction} onValueChange={(value) => setNewEntry({...newEntry, socialInteraction: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Anxiety Level</label>
                    <Select value={newEntry.anxietyLevel} onValueChange={(value) => setNewEntry({...newEntry, anxietyLevel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Input 
                  placeholder="Any additional observations or notes" 
                  value={newEntry.notes} 
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                />
              </div>
              
              <Button className="mt-6" onClick={handleAddEntry}>
                Add Entry
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing History</CardTitle>
              <CardDescription>
                Previous wellbeing entries for {selectedChild.firstName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getFilteredWellbeingData().length > 0 ? (
                  getFilteredWellbeingData().map((entry, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-full p-2 border">
                            {getMoodIcon(entry.mood)}
                          </div>
                          <div>
                            <h4 className="font-medium">{formatDate(entry.date)}</h4>
                            <p className="text-sm text-muted-foreground">
                              Wellbeing Score: {entry.wellbeingScore}/100
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1">Sleep</h5>
                            <p className="text-sm">{entry.sleepHours} hours</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Physical Activity</h5>
                            <p className="text-sm capitalize">{entry.physicalActivity}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Screen Time</h5>
                            <p className="text-sm">{entry.screenTime} hours</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Social Interaction</h5>
                            <p className="text-sm capitalize">{entry.socialInteraction}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Anxiety Level</h5>
                            <p className="text-sm capitalize">{entry.anxietyLevel}</p>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div>
                            <h5 className="text-sm font-medium mb-1">Notes</h5>
                            <p className="text-sm">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No wellbeing data</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      There are no wellbeing entries for {selectedChild.firstName} in the selected time period. Use the form above to add a new entry.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing Insights</CardTitle>
              <CardDescription>
                Patterns, trends, and recommendations based on {selectedChild.firstName}'s wellbeing data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getFilteredInsights().length > 0 ? (
                  getFilteredInsights().map((insight, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-full p-2 border">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(insight.date)}
                            </p>
                          </div>
                        </div>
                        <div>
                          {getInsightPriorityBadge(insight.priority)}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm mb-4">{insight.description}</p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            Recommendation
                          </h5>
                          <p className="text-sm">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No insights available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      There are not enough wellbeing entries to generate insights for {selectedChild.firstName}. Continue tracking wellbeing to receive personalized insights and recommendations.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Pattern</CardTitle>
                <CardDescription>
                  Analysis of sleep duration and its impact on wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getFilteredWellbeingData().length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-40 bg-slate-50 rounded-lg border p-4 flex items-end justify-between">
                      {getFilteredWellbeingData().slice(0, 7).reverse().map((entry, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="bg-blue-500 w-8 rounded-t-sm" 
                            style={{ height: `${entry.sleepHours * 6}px` }}
                          ></div>
                          <span className="text-xs mt-1">{new Date(entry.date).getDate()}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="text-sm font-medium mb-1">Key Insight</h5>
                      <p className="text-sm">
                        {selectedChild.firstName}'s average sleep duration is {
                          getFilteredWellbeingData().reduce((sum, entry) => sum + entry.sleepHours, 0) / 
                          getFilteredWellbeingData().length
                        }.
                        {
                          getFilteredWellbeingData().reduce((sum, entry) => sum + entry.sleepHours, 0) / 
                          getFilteredWellbeingData().length >= 8 
                          ? ' This is within the recommended range for their age.'
                          : ' This is slightly below the recommended range for their age.'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not enough data to analyze sleep patterns</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mood Correlation</CardTitle>
                <CardDescription>
                  Factors that appear to influence {selectedChild.firstName}'s mood
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getFilteredWellbeingData().length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Physical Activity</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs">High correlation</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Sleep</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs">High correlation</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Screen Time</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-xs">Medium correlation</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Social Interaction</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs">High correlation</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="text-sm font-medium mb-1">Key Insight</h5>
                      <p className="text-sm">
                        Physical activity and social interaction appear to have the strongest positive influence on {selectedChild.firstName}'s mood and overall wellbeing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not enough data to analyze mood correlations</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing Resources</CardTitle>
              <CardDescription>
                Helpful resources to support {selectedChild.firstName}'s emotional and mental wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getRelevantResources().map((resource, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </p>
                        </div>
                        <Badge className={resource.relevance === 'high' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}>
                          {resource.relevance === 'high' ? 'Highly Relevant' : 'Relevant'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-4">{resource.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map(tag => (
                          <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        View Resource
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing Activities</CardTitle>
              <CardDescription>
                Activities you can do with {selectedChild.firstName} to support their emotional and mental wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {wellbeingActivities.map((activity, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-4 border-b bg-slate-50">
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {activity.frequency}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Ages {activity.ageRange[0]}-{activity.ageRange[1]}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-4">{activity.description}</p>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Benefits</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {activity.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Materials Needed</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {activity.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <h5 className="text-sm font-medium mb-1">Instructions</h5>
                        <p className="text-sm">{activity.instructions}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.map(tag => (
                          <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
