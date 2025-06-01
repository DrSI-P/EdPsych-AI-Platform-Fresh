'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Clock, 
  Moon, 
  Sun, 
  Smile, 
  Frown,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';

import { WellbeingCheckIn } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockWellbeingData = {
  recentCheckIns: [
    {
      id: 'w1',
      childId: 'c1',
      date: new Date('2025-05-30'),
      mood: 'happy',
      sleepQuality: 'good',
      energyLevel: 'medium',
      anxiety: 'none',
      notes: 'Emma had a good day at school and was excited about her science project.',
      parentId: 'p1'
    },
    {
      id: 'w2',
      childId: 'c1',
      date: new Date('2025-05-29'),
      mood: 'neutral',
      sleepQuality: 'fair',
      energyLevel: 'medium',
      anxiety: 'mild',
      notes: 'Emma seemed a bit worried about her upcoming spelling test.',
      parentId: 'p1'
    },
    {
      id: 'w3',
      childId: 'c1',
      date: new Date('2025-05-28'),
      mood: 'happy',
      sleepQuality: 'good',
      energyLevel: 'high',
      anxiety: 'none',
      notes: 'Emma had a great day and enjoyed her swimming lesson after school.',
      parentId: 'p1'
    },
    {
      id: 'w4',
      childId: 'c1',
      date: new Date('2025-05-27'),
      mood: 'sad',
      sleepQuality: 'poor',
      energyLevel: 'low',
      anxiety: 'moderate',
      notes: 'Emma had trouble sleeping and was worried about a disagreement with a friend.',
      parentId: 'p1'
    },
    {
      id: 'w5',
      childId: 'c1',
      date: new Date('2025-05-26'),
      mood: 'neutral',
      sleepQuality: 'fair',
      energyLevel: 'medium',
      anxiety: 'mild',
      notes: 'Normal day, but Emma mentioned feeling a bit tired in the afternoon.',
      parentId: 'p1'
    },
    {
      id: 'w6',
      childId: 'c1',
      date: new Date('2025-05-25'),
      mood: 'happy',
      sleepQuality: 'excellent',
      energyLevel: 'high',
      anxiety: 'none',
      notes: 'Weekend day with lots of outdoor play and family time.',
      parentId: 'p1'
    },
    {
      id: 'w7',
      childId: 'c1',
      date: new Date('2025-05-24'),
      mood: 'very_happy',
      sleepQuality: 'good',
      energyLevel: 'high',
      anxiety: 'none',
      notes: 'Birthday party day! Emma was very excited and had a wonderful time.',
      parentId: 'p1'
    }
  ],
  weeklyAverages: {
    mood: 'happy',
    sleepQuality: 'good',
    energyLevel: 'medium',
    anxiety: 'mild'
  },
  trends: {
    mood: 'improving',
    sleepQuality: 'steady',
    energyLevel: 'improving',
    anxiety: 'improving'
  },
  behaviorRecords: [
    {
      id: 'b1',
      childId: 'c1',
      date: new Date('2025-05-29'),
      type: 'positive',
      category: 'Helpfulness',
      description: 'Emma helped a classmate who was struggling with their maths work.',
      location: 'Classroom',
      educatorId: 'e1',
      points: 5,
      parentNotified: true
    },
    {
      id: 'b2',
      childId: 'c1',
      date: new Date('2025-05-27'),
      type: 'negative',
      category: 'Disruption',
      description: 'Emma was talking during quiet reading time despite reminders.',
      location: 'Library',
      educatorId: 'e1',
      points: -2,
      parentNotified: true,
      resolutionStatus: 'resolved'
    },
    {
      id: 'b3',
      childId: 'c1',
      date: new Date('2025-05-26'),
      type: 'positive',
      category: 'Effort',
      description: 'Emma showed exceptional effort on her science project.',
      location: 'Classroom',
      educatorId: 'e2',
      points: 10,
      parentNotified: true
    }
  ]
};

// Mood emoji mapping
const moodEmojis = {
  very_happy: '😄',
  happy: '🙂',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢'
};

// Sleep quality mapping
const sleepQualityLabels = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  very_poor: 'Very Poor'
};

// Energy level mapping
const energyLevelLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low'
};

// Anxiety level mapping
const anxietyLevelLabels = {
  none: 'None',
  mild: 'Mild',
  moderate: 'Moderate',
  high: 'High'
};

export default function WellbeingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [newCheckIn, setNewCheckIn] = useState<Partial<WellbeingCheckIn>>({
    childId: 'c1',
    date: new Date(),
    mood: 'neutral',
    sleepQuality: 'good',
    energyLevel: 'medium',
    anxiety: 'none',
    notes: '',
    parentId: 'p1'
  });
  
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
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };
  
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
  
  // Handle check-in submission
  const handleSubmitCheckIn = () => {
    // In a real application, this would call an API to submit the check-in
    console.log('Submitting check-in:', newCheckIn);
    
    // Show success message or update UI
    alert('Check-in submitted successfully!');
    
    // Reset form
    setNewCheckIn({
      childId: 'c1',
      date: new Date(),
      mood: 'neutral',
      sleepQuality: 'good',
      energyLevel: 'medium',
      anxiety: 'none',
      notes: '',
      parentId: 'p1'
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wellbeing Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Track and support your child's emotional wellbeing
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Heart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="check-in">
            <Activity className="h-4 w-4 mr-2" />
            Daily Check-in
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="behavior">
            <Smile className="h-4 w-4 mr-2" />
            Behaviour Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Wellbeing Summary</CardTitle>
                <CardDescription>
                  Overview of Emma's wellbeing over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Mood</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {moodEmojis[mockWellbeingData.weeklyAverages.mood as keyof typeof moodEmojis]}
                        </span>
                        <span className="text-sm font-medium flex items-center">
                          {mockWellbeingData.weeklyAverages.mood.replace('_', ' ')}
                          {getTrendIcon(mockWellbeingData.trends.mood)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-700 mb-2">Sleep</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {mockWellbeingData.weeklyAverages.sleepQuality === 'excellent' || mockWellbeingData.weeklyAverages.sleepQuality === 'good' ? '😴' : '😫'}
                        </span>
                        <span className="text-sm font-medium flex items-center">
                          {sleepQualityLabels[mockWellbeingData.weeklyAverages.sleepQuality as keyof typeof sleepQualityLabels]}
                          {getTrendIcon(mockWellbeingData.trends.sleepQuality)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-700 mb-2">Energy</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {mockWellbeingData.weeklyAverages.energyLevel === 'high' ? '⚡' : mockWellbeingData.weeklyAverages.energyLevel === 'medium' ? '🔋' : '🔌'}
                        </span>
                        <span className="text-sm font-medium flex items-center">
                          {energyLevelLabels[mockWellbeingData.weeklyAverages.energyLevel as keyof typeof energyLevelLabels]}
                          {getTrendIcon(mockWellbeingData.trends.energyLevel)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-700 mb-2">Anxiety</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {mockWellbeingData.weeklyAverages.anxiety === 'none' ? '😌' : mockWellbeingData.weeklyAverages.anxiety === 'mild' ? '😟' : '😰'}
                        </span>
                        <span className="text-sm font-medium flex items-center">
                          {anxietyLevelLabels[mockWellbeingData.weeklyAverages.anxiety as keyof typeof anxietyLevelLabels]}
                          {getTrendIcon(mockWellbeingData.trends.anxiety)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Weekly Mood Tracking</h4>
                    <div className="flex gap-1 h-20">
                      {mockWellbeingData.recentCheckIns.slice().reverse().map((checkIn) => (
                        <div key={checkIn.id} className="flex-1 flex flex-col items-center">
                          <div className="flex-1 flex items-end">
                            <div 
                              className={`w-full ${
                                checkIn.mood === 'very_happy' ? 'bg-green-500 h-full' :
                                checkIn.mood === 'happy' ? 'bg-green-400 h-4/5' :
                                checkIn.mood === 'neutral' ? 'bg-blue-400 h-3/5' :
                                checkIn.mood === 'sad' ? 'bg-amber-400 h-2/5' :
                                'bg-red-400 h-1/5'
                              } rounded-t-sm`}
                            ></div>
                          </div>
                          <div className="text-xs mt-1">{checkIn.date.getDate()}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatShortDate(mockWellbeingData.recentCheckIns[mockWellbeingData.recentCheckIns.length - 1].date)}</span>
                      <span>{formatShortDate(mockWellbeingData.recentCheckIns[0].date)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Sleep Quality</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last 7 days average</span>
                        <span>{sleepQualityLabels[mockWellbeingData.weeklyAverages.sleepQuality as keyof typeof sleepQualityLabels]}</span>
                      </div>
                      <div className="flex gap-1">
                        {mockWellbeingData.recentCheckIns.slice().reverse().map((checkIn) => (
                          <div 
                            key={checkIn.id} 
                            className={`h-2 flex-1 rounded-full ${
                              checkIn.sleepQuality === 'excellent' ? 'bg-green-500' :
                              checkIn.sleepQuality === 'good' ? 'bg-green-400' :
                              checkIn.sleepQuality === 'fair' ? 'bg-amber-400' :
                              checkIn.sleepQuality === 'poor' ? 'bg-red-400' :
                              'bg-red-500'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-3">Energy Level</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Last 7 days average</span>
                          <span>{energyLevelLabels[mockWellbeingData.weeklyAverages.energyLevel as keyof typeof energyLevelLabels]}</span>
                        </div>
                        <div className="flex gap-1">
                          {mockWellbeingData.recentCheckIns.slice().reverse().map((checkIn) => (
                            <div 
                              key={checkIn.id} 
                              className={`h-2 flex-1 rounded-full ${
                                checkIn.energyLevel === 'high' ? 'bg-green-500' :
                                checkIn.energyLevel === 'medium' ? 'bg-blue-500' :
                                'bg-amber-500'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Anxiety Level</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Last 7 days average</span>
                          <span>{anxietyLevelLabels[mockWellbeingData.weeklyAverages.anxiety as keyof typeof anxietyLevelLabels]}</span>
                        </div>
                        <div className="flex gap-1">
                          {mockWellbeingData.recentCheckIns.slice().reverse().map((checkIn) => (
                            <div 
                              key={checkIn.id} 
                              className={`h-2 flex-1 rounded-full ${
                                checkIn.anxiety === 'none' ? 'bg-green-500' :
                                checkIn.anxiety === 'mild' ? 'bg-amber-400' :
                                checkIn.anxiety === 'moderate' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Latest Check-in</CardTitle>
                <CardDescription>
                  {formatDate(mockWellbeingData.recentCheckIns[0].date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                      {moodEmojis[mockWellbeingData.recentCheckIns[0].mood as keyof typeof moodEmojis]}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <div className="flex flex-col items-center">
                        <Moon className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Sleep</span>
                        <span className="text-sm font-medium">
                          {sleepQualityLabels[mockWellbeingData.recentCheckIns[0].sleepQuality as keyof typeof sleepQualityLabels]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-green-50 rounded-lg">
                      <div className="flex flex-col items-center">
                        <Activity className="h-5 w-5 text-green-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Energy</span>
                        <span className="text-sm font-medium">
                          {energyLevelLabels[mockWellbeingData.recentCheckIns[0].energyLevel as keyof typeof energyLevelLabels]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-amber-50 rounded-lg col-span-2">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-xs text-muted-foreground">Anxiety</span>
                        <span className="text-sm font-medium">
                          {anxietyLevelLabels[mockWellbeingData.recentCheckIns[0].anxiety as keyof typeof anxietyLevelLabels]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {mockWellbeingData.recentCheckIns[0].notes && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm">{mockWellbeingData.recentCheckIns[0].notes}</p>
                    </div>
                  )}
                  
                  <Button className="w-full" onClick={() => setActiveTab('check-in')}>
                    <Activity className="h-4 w-4 mr-2" />
                    New Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Behaviour Records</CardTitle>
              <CardDescription>
                Behaviour notes from school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWellbeingData.behaviorRecords.map((record) => (
                  <div 
                    key={record.id} 
                    className={`border-l-4 ${
                      record.type === 'positive' ? 'border-green-500' : 'border-amber-500'
                    } pl-4 py-2`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{record.category}</h4>
                      <Badge variant="outline" className={
                        record.type === 'positive' ? 'bg-green-50' : 'bg-amber-50'
                      }>
                        {record.type === 'positive' ? 'Positive' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <p className="text-sm">{record.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">{formatDate(record.date)} • {record.location}</p>
                      {record.points && (
                        <Badge variant="outline" className={
                          record.points > 0 ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
                        }>
                          {record.points > 0 ? '+' : ''}{record.points} points
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('behavior')}>
                  View All Behaviour Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check-in" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Wellbeing Check-in</CardTitle>
              <CardDescription>
                Record how Emma is feeling today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">How is Emma feeling today?</h4>
                  <div className="flex justify-between items-center">
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.mood === 'very_sad' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, mood: 'very_sad'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1 text-2xl">
                        😢
                      </div>
                      <span className="text-xs">Very Sad</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.mood === 'sad' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, mood: 'sad'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1 text-2xl">
                        😔
                      </div>
                      <span className="text-xs">Sad</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.mood === 'neutral' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, mood: 'neutral'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1 text-2xl">
                        😐
                      </div>
                      <span className="text-xs">Neutral</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.mood === 'happy' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, mood: 'happy'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1 text-2xl">
                        🙂
                      </div>
                      <span className="text-xs">Happy</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.mood === 'very_happy' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, mood: 'very_happy'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1 text-2xl">
                        😄
                      </div>
                      <span className="text-xs">Very Happy</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">How did Emma sleep last night?</h4>
                  <div className="flex justify-between items-center">
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.sleepQuality === 'very_poor' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, sleepQuality: 'very_poor'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Moon className="h-6 w-6 text-red-500" />
                      </div>
                      <span className="text-xs">Very Poor</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.sleepQuality === 'poor' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, sleepQuality: 'poor'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Moon className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="text-xs">Poor</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.sleepQuality === 'fair' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, sleepQuality: 'fair'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Moon className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-xs">Fair</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.sleepQuality === 'good' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, sleepQuality: 'good'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Moon className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-xs">Good</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.sleepQuality === 'excellent' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, sleepQuality: 'excellent'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Moon className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-xs">Excellent</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">What is Emma's energy level today?</h4>
                  <div className="flex justify-around items-center">
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.energyLevel === 'low' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, energyLevel: 'low'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Activity className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="text-xs">Low</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.energyLevel === 'medium' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, energyLevel: 'medium'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Activity className="h-6 w-6 text-blue-500" />
                      </div>
                      <span className="text-xs">Medium</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.energyLevel === 'high' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, energyLevel: 'high'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Activity className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-xs">High</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Is Emma feeling anxious today?</h4>
                  <div className="flex justify-around items-center">
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.anxiety === 'none' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, anxiety: 'none'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <Smile className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-xs">None</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.anxiety === 'mild' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, anxiety: 'mild'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <AlertCircle className="h-6 w-6 text-amber-400" />
                      </div>
                      <span className="text-xs">Mild</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.anxiety === 'moderate' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, anxiety: 'moderate'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="text-xs">Moderate</span>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center ${newCheckIn.anxiety === 'high' ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setNewCheckIn({...newCheckIn, anxiety: 'high'})}
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-1">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                      <span className="text-xs">High</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Additional Notes</h4>
                  <textarea 
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    placeholder="Add any additional notes about Emma's wellbeing today..."
                    value={newCheckIn.notes || ''}
                    onChange={(e) => setNewCheckIn({...newCheckIn, notes: e.target.value})}
                  ></textarea>
                </div>
                
                <Button className="w-full" onClick={handleSubmitCheckIn}>
                  Submit Check-in
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing History</CardTitle>
              <CardDescription>
                Past check-ins and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Recent Check-ins</h4>
                  <div className="flex items-center gap-2">
                    <select className="border rounded-md p-1 text-sm">
                      <option value="7">Last 7 days</option>
                      <option value="14">Last 14 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockWellbeingData.recentCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            {moodEmojis[checkIn.mood as keyof typeof moodEmojis]}
                          </div>
                          <div>
                            <h4 className="font-medium">{formatDate(checkIn.date)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {sleepQualityLabels[checkIn.sleepQuality as keyof typeof sleepQualityLabels]} sleep • 
                              {energyLevelLabels[checkIn.energyLevel as keyof typeof energyLevelLabels]} energy • 
                              {anxietyLevelLabels[checkIn.anxiety as keyof typeof anxietyLevelLabels]} anxiety
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {checkIn.mood.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {checkIn.notes && (
                        <div className="mt-3 text-sm">
                          <p>{checkIn.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Behaviour Records</CardTitle>
                <CardDescription>
                  Records from school about Emma's behaviour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">All Records</h4>
                    <div className="flex items-center gap-2">
                      <select className="border rounded-md p-1 text-sm">
                        <option value="all">All Types</option>
                        <option value="positive">Positive Only</option>
                        <option value="negative">Needs Improvement</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mockWellbeingData.behaviorRecords.map((record) => (
                      <div 
                        key={record.id} 
                        className={`border-l-4 ${
                          record.type === 'positive' ? 'border-green-500' : 'border-amber-500'
                        } pl-4 py-2`}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{record.category}</h4>
                          <Badge variant="outline" className={
                            record.type === 'positive' ? 'bg-green-50' : 'bg-amber-50'
                          }>
                            {record.type === 'positive' ? 'Positive' : 'Needs Improvement'}
                          </Badge>
                        </div>
                        <p className="text-sm">{record.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{formatDate(record.date)} • {record.location}</p>
                          {record.points && (
                            <Badge variant="outline" className={
                              record.points > 0 ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
                            }>
                              {record.points > 0 ? '+' : ''}{record.points} points
                            </Badge>
                          )}
                        </div>
                        {record.resolutionStatus && (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-800">
                              {record.resolutionStatus.charAt(0).toUpperCase() + record.resolutionStatus.slice(1).replace('_', ' ')}
                            </Badge>
                            {record.resolutionStatus === 'resolved' && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> Resolved
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Behaviour Summary</CardTitle>
                <CardDescription>
                  Overview of Emma's behaviour records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl font-bold">80%</div>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset="50.24"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm">
                    <span className="font-medium">80%</span> of Emma's behaviour records are positive
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        Positive
                      </span>
                      <span>4</span>
                    </div>
                    <Progress value={80} className="bg-green-500" />
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-amber-500" />
                        Needs Improvement
                      </span>
                      <span>1</span>
                    </div>
                    <Progress value={20} className="bg-amber-500" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Top Positive Categories</h4>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-center justify-between">
                        <span>Helpfulness</span>
                        <Badge variant="outline" className="bg-green-50 text-green-800">2</Badge>
                      </li>
                      <li className="text-sm flex items-center justify-between">
                        <span>Effort</span>
                        <Badge variant="outline" className="bg-green-50 text-green-800">1</Badge>
                      </li>
                      <li className="text-sm flex items-center justify-between">
                        <span>Teamwork</span>
                        <Badge variant="outline" className="bg-green-50 text-green-800">1</Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
