'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Home, 
  BookOpen, 
  Calendar, 
  BarChart, 
  MessageSquare,
  Bell,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Award,
  Zap,
  ArrowRight,
  PlusCircle,
  Search,
  ChevronRight,
  Mail,
  Phone,
  User,
  Lock
} from 'lucide-react';

// Parent Portal prototype
// This component demonstrates the concept of a comprehensive parent engagement system

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  yearGroup: string;
  avatar: string;
}

interface ActivityUpdate {
  id: string;
  childId: string;
  type: 'achievement' | 'assessment' | 'behaviour' | 'attendance' | 'homework';
  title: string;
  description: string;
  date: string;
  status?: 'positive' | 'neutral' | 'needs-attention';
  subject?: string;
  score?: number;
  teacherName?: string;
  teacherMessage?: string;
  acknowledged: boolean;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'parent-evening' | 'school-event' | 'deadline' | 'meeting';
  childId?: string;
}

interface HomeworkItem {
  id: string;
  childId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'submitted' | 'late' | 'graded';
  grade?: string;
  feedback?: string;
  attachments?: string[];
}

interface MessageThread {
  id: string;
  with: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
}

export default function ParentPortalPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for selected child
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  // State for notification filter
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for message input
  const [messageInput, setMessageInput] = useState('');
  
  // State for selected message thread
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  // Children profiles
  const [children, setChildren] = useState<ChildProfile[]>([
    {
      id: 'child1',
      name: 'Emily Johnson',
      age: 9,
      yearGroup: 'Year 5',
      avatar: '👧'
    },
    {
      id: 'child2',
      name: 'James Johnson',
      age: 12,
      yearGroup: 'Year 8',
      avatar: '👦'
    }
  ]);
  
  // Activity updates
  const [activityUpdates, setActivityUpdates] = useState<ActivityUpdate[]>([
    {
      id: 'act1',
      childId: 'child1',
      type: 'achievement',
      title: 'Star of the Week',
      description: 'Emily was awarded Star of the Week for her excellent work in Mathematics.',
      date: '2025-05-17',
      status: 'positive',
      teacherName: 'Ms. Williams',
      acknowledged: false
    },
    {
      id: 'act2',
      childId: 'child1',
      type: 'assessment',
      title: 'Mathematics Assessment',
      description: 'End of unit assessment on fractions and decimals.',
      date: '2025-05-15',
      status: 'positive',
      subject: 'Mathematics',
      score: 92,
      teacherName: 'Ms. Williams',
      teacherMessage: 'Emily demonstrated excellent understanding of equivalent fractions and decimal conversion.',
      acknowledged: true
    },
    {
      id: 'act3',
      childId: 'child1',
      type: 'homework',
      title: 'Reading Comprehension',
      description: 'Complete pages 45-47 in the reading workbook.',
      date: '2025-05-16',
      status: 'neutral',
      subject: 'English',
      acknowledged: false
    },
    {
      id: 'act4',
      childId: 'child2',
      type: 'behaviour',
      title: 'Positive Behaviour Note',
      description: 'James helped a classmate who was struggling with their work.',
      date: '2025-05-17',
      status: 'positive',
      teacherName: 'Mr. Thompson',
      acknowledged: false
    },
    {
      id: 'act5',
      childId: 'child2',
      type: 'assessment',
      title: 'Science Quiz',
      description: 'Quiz on the solar system and space exploration.',
      date: '2025-05-14',
      status: 'needs-attention',
      subject: 'Science',
      score: 65,
      teacherName: 'Dr. Martinez',
      teacherMessage: 'James struggled with some concepts about planetary motion. Some additional review at home would be beneficial.',
      acknowledged: true
    },
    {
      id: 'act6',
      childId: 'child2',
      type: 'attendance',
      title: 'Late Arrival',
      description: 'James arrived 15 minutes late to school.',
      date: '2025-05-16',
      status: 'needs-attention',
      acknowledged: true
    }
  ]);
  
  // Upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: 'event1',
      title: 'Parent-Teacher Evening',
      date: '2025-05-25',
      time: '16:00 - 19:00',
      location: 'School Main Hall',
      description: 'Opportunity to discuss your child\'s progress with their teachers.',
      type: 'parent-evening'
    },
    {
      id: 'event2',
      title: 'School Sports Day',
      date: '2025-06-10',
      time: '09:30 - 15:00',
      location: 'School Playing Fields',
      description: 'Annual sports day event. Parents are welcome to attend and cheer on the children.',
      type: 'school-event'
    },
    {
      id: 'event3',
      title: 'Mathematics Project Deadline',
      date: '2025-05-30',
      time: '15:30',
      location: 'N/A',
      description: 'Final deadline for the term\'s mathematics project.',
      type: 'deadline',
      childId: 'child1'
    },
    {
      id: 'event4',
      title: 'Science Fair',
      date: '2025-06-15',
      time: '13:00 - 16:00',
      location: 'School Science Block',
      description: 'Annual science fair where students present their projects.',
      type: 'school-event',
      childId: 'child2'
    },
    {
      id: 'event5',
      title: 'Special Educational Needs Review',
      date: '2025-05-28',
      time: '14:00 - 15:00',
      location: 'Meeting Room 3',
      description: 'Regular review meeting to discuss support strategies.',
      type: 'meeting',
      childId: 'child2'
    }
  ]);
  
  // Homework items
  const [homeworkItems, setHomeworkItems] = useState<HomeworkItem[]>([
    {
      id: 'hw1',
      childId: 'child1',
      subject: 'Mathematics',
      title: 'Fractions Worksheet',
      description: 'Complete the worksheet on adding and subtracting fractions with different denominators.',
      dueDate: '2025-05-22',
      status: 'not-started'
    },
    {
      id: 'hw2',
      childId: 'child1',
      subject: 'English',
      title: 'Book Report',
      description: 'Write a 500-word report on the book "Charlotte\'s Web".',
      dueDate: '2025-05-29',
      status: 'in-progress'
    },
    {
      id: 'hw3',
      childId: 'child1',
      subject: 'Science',
      title: 'Plant Growth Experiment',
      description: 'Record the daily growth of your bean plant and prepare a short presentation.',
      dueDate: '2025-06-05',
      status: 'not-started'
    },
    {
      id: 'hw4',
      childId: 'child2',
      subject: 'History',
      title: 'Tudor Dynasty Research',
      description: 'Research and create a timeline of the Tudor dynasty, highlighting key events.',
      dueDate: '2025-05-23',
      status: 'completed'
    },
    {
      id: 'hw5',
      childId: 'child2',
      subject: 'Science',
      title: 'Forces and Motion Quiz',
      description: 'Complete the online quiz on forces and motion.',
      dueDate: '2025-05-20',
      status: 'submitted',
      grade: 'B+',
      feedback: 'Good understanding of Newton\'s laws, but some confusion about friction concepts.'
    },
    {
      id: 'hw6',
      childId: 'child2',
      subject: 'Mathematics',
      title: 'Algebra Practise',
      description: 'Complete exercises 5-10 on page 78 of the textbook.',
      dueDate: '2025-05-18',
      status: 'late'
    }
  ]);
  
  // Message threads
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([
    {
      id: 'msg1',
      with: 'Ms. Williams',
      role: 'Class Teacher - Year 5',
      avatar: '👩‍🏫',
      lastMessage: 'Emily has been making excellent progress with her reading comprehension skills.',
      lastMessageDate: '2025-05-17',
      unread: 1
    },
    {
      id: 'msg2',
      with: 'Mr. Thompson',
      role: 'Form Tutor - Year 8',
      avatar: '👨‍🏫',
      lastMessage: "I'd like to discuss James's recent science assessment results with you.",
      lastMessageDate: '2025-05-16',
      unread: 0
    },
    {
      id: 'msg3',
      with: 'Dr. Martinez',
      role: 'Science Teacher',
      avatar: '👨‍🔬',
      lastMessage: 'James might benefit from some additional support with the upcoming astronomy unit.',
      lastMessageDate: '2025-05-15',
      unread: 0
    },
    {
      id: 'msg4',
      with: 'Mrs. Johnson',
      role: 'SENCO',
      avatar: '👩‍💼',
      lastMessage: "I've prepared some additional resources for James that you can use at home.",
      lastMessageDate: '2025-05-14',
      unread: 0
    },
    {
      id: 'msg5',
      with: 'School Office',
      role: 'Administration',
      avatar: '🏫',
      lastMessage: 'This is a reminder about the upcoming parent-teacher evening on May 25th.',
      lastMessageDate: '2025-05-13',
      unread: 0
    }
  ]);
  
  // Set initial selected child
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);
  
  // Get selected child
  const getSelectedChild = () => {
    return children.find(child => child.id === selectedChildId);
  };
  
  // Get filtered activity updates
  const getFilteredActivityUpdates = () => {
    let filtered = activityUpdates;
    
    // Filter by child if selected
    if (selectedChildId) {
      filtered = filtered.filter(update => update.childId === selectedChildId);
    }
    
    // Filter by type if not 'all'
    if (notificationFilter !== 'all') {
      filtered = filtered.filter(update => update.type === notificationFilter);
    }
    
    // Sort by date (most recent first)
    filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return filtered;
  };
  
  // Get child-specific upcoming events
  const getChildEvents = () => {
    if (!selectedChildId) return upcomingEvents;
    
    return upcomingEvents.filter(event => 
      !event.childId || event.childId === selectedChildId
    );
  };
  
  // Get child-specific homework
  const getChildHomework = () => {
    if (!selectedChildId) return homeworkItems;
    
    return homeworkItems.filter(item => item.childId === selectedChildId);
  };
  
  // Get status colour
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'positive':
        return 'text-green-500';
      case 'needs-attention':
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };
  
  // Get homework status colour and icon
  const getHomeworkStatusInfo = (status: string) => {
    switch(status) {
      case 'not-started':
        return { color: 'text-red-500', icon: <AlertCircle className="h-4 w-4" /> };
      case 'in-progress':
        return { color: 'text-amber-500', icon: <Clock className="h-4 w-4" /> };
      case 'completed':
        return { color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" /> };
      case 'submitted':
        return { color: 'text-blue-500', icon: <CheckCircle className="h-4 w-4" /> };
      case 'late':
        return { color: 'text-red-500', icon: <AlertCircle className="h-4 w-4" /> };
      case 'graded':
        return { color: 'text-green-500', icon: <Star className="h-4 w-4" /> };
      default:
        return { color: 'text-muted-foreground', icon: <Clock className="h-4 w-4" /> };
    }
  };
  
  // Get event type badge
  const getEventTypeBadge = (type: string) => {
    switch(type) {
      case 'parent-evening':
        return <Badge className="bg-blue-500">Parent Evening</Badge>;
      case 'school-event':
        return <Badge className="bg-green-500">School Event</Badge>;
      case 'deadline':
        return <Badge className="bg-red-500">Deadline</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-500">Meeting</Badge>;
      default:
        return <Badge>Event</Badge>;
    }
  };
  
  // Handle acknowledging an update
  const handleAcknowledgeUpdate = (updateId: string) => {
    setActivityUpdates(prev => 
      prev.map(update => 
        update.id === updateId 
          ? { ...update, acknowledged: true } 
          : update
      )
    );
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedThreadId) return;
    
    // In a real implementation, this would send the message to the backend
    // For now, we'll just update the UI to simulate sending a message
    
    setMessageThreads(prev => 
      prev.map(thread => 
        thread.id === selectedThreadId
          ? { 
              ...thread, 
              lastMessage: `You: ${messageInput}`,
              lastMessageDate: new Date().toISOString().split('T')[0]
            }
          : thread
      )
    );
    
    setMessageInput('');
  };
  
  // Get selected message thread
  const getSelectedThread = () => {
    return messageThreads.find(thread => thread.id === selectedThreadId);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Parent Portal</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay connected with your child's educational journey through our comprehensive parent engagement system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Parent Dashboard</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-centre">
                    <h3 className="font-medium">Your Children</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {children.map((child) => (
                      <div 
                        key={child.id}
                        className={`p-3 rounded-lg cursor-pointer flex items-centre ${
                          selectedChildId === child.id ? 'bg-primary/10' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedChildId(child.id)}
                      >
                        <div className="mr-3 text-2xl">{child.avatar}</div>
                        <div>
                          <p className="font-medium">{child.name}</p>
                          <p className="text-sm text-muted-foreground">{child.yearGroup}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button 
                  variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === 'academics' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('academics')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Academics
                </Button>
                <Button 
                  variant={activeTab === 'calendar' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('calendar')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button 
                  variant={activeTab === 'messages' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                  {messageThreads.some(thread => thread.unread > 0) && (
                    <Badge className="ml-auto">
                      {messageThreads.reduce((acc, thread) => acc + thread.unread, 0)}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant={activeTab === 'reports' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('reports')}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Reports
                </Button>
                <Button 
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getSelectedChild()?.name}'s Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-centre mb-2">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Achievements</h3>
                      </div>
                      <p className="text-2xl font-bold">
                        {activityUpdates.filter(update => 
                          update.childId === selectedChildId && 
                          update.type === 'achievement'
                        ).length}
                      </p>
                      <p className="text-sm text-muted-foreground">This term</p>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-centre mb-2">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Homework</h3>
                      </div>
                      <p className="text-2xl font-bold">
                        {homeworkItems.filter(item => 
                          item.childId === selectedChildId && 
                          (item.status === 'not-started' || item.status === 'in-progress')
                        ).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-centre mb-2">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Upcoming</h3>
                      </div>
                      <p className="text-2xl font-bold">
                        {upcomingEvents.filter(event => 
                          !event.childId || event.childId === selectedChildId
                        ).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-centre justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Tabs 
                      value={notificationFilter} 
                      onValueChange={setNotificationFilter}
                      className="w-[400px]"
                    >
                      <TabsList className="grid grid-cols-5">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="achievement">Awards</TabsTrigger>
                        <TabsTrigger value="assessment">Tests</TabsTrigger>
                        <TabsTrigger value="homework">Homework</TabsTrigger>
                        <TabsTrigger value="behaviour">Behaviour</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getFilteredActivityUpdates().slice(0, 5).map((update) => (
                        <div key={update.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50">
                          <div className={`mt-0.5 ${getStatusColor(update.status || 'neutral')}`}>
                            {update.type === 'achievement' && <Award className="h-5 w-5" />}
                            {update.type === 'assessment' && <FileText className="h-5 w-5" />}
                            {update.type === 'behaviour' && <User className="h-5 w-5" />}
                            {update.type === 'attendance' && <Clock className="h-5 w-5" />}
                            {update.type === 'homework' && <BookOpen className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{update.title}</h4>
                              <span className="text-sm text-muted-foreground">{update.date}</span>
                            </div>
                            <p className="text-sm mt-1">{update.description}</p>
                            {update.teacherMessage && (
                              <p className="text-sm mt-2 italic">"{update.teacherMessage}"</p>
                            )}
                            {update.teacherName && (
                              <p className="text-sm mt-1 text-muted-foreground">- {update.teacherName}</p>
                            )}
                            {!update.acknowledged && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleAcknowledgeUpdate(update.id)}
                              >
                                Acknowledge
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {getFilteredActivityUpdates().length === 0 && (
                        <div className="text-centre py-6">
                          <p className="text-muted-foreground">No activities found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getChildEvents().slice(0, 3).map((event) => (
                        <div key={event.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <div className="mt-2 flex items-centre text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            <p>{event.location}</p>
                          </div>
                          <p className="mt-2 text-sm">{event.description}</p>
                        </div>
                      ))}
                      
                      {getChildEvents().length === 0 && (
                        <div className="text-centre py-6">
                          <p className="text-muted-foreground">No upcoming events</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Calendar
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Homework Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getChildHomework().slice(0, 3).map((item) => {
                      const statusInfo = getHomeworkStatusInfo(item.status);
                      return (
                        <div key={item.id} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.subject}</p>
                            </div>
                            <div className={`flex items-centre ${statusInfo.colour}`}>
                              {statusInfo.icon}
                              <span className="ml-1 text-sm capitalize">{item.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{item.description}</p>
                          <div className="mt-3 flex justify-between items-centre">
                            <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                            {item.status === 'not-started' || item.status === 'in-progress' ? (
                              <Button size="sm">
                                {item.status === 'not-started' ? 'Start' : 'Continue'}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                    
                    {getChildHomework().length === 0 && (
                      <div className="text-centre py-6">
                        <p className="text-muted-foreground">No homework assigned</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Homework
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <Card className="h-[calc(100vh-200px)] min-h-[500px]">
              <div className="grid h-full" style={{ gridTemplateColumns: selectedThreadId ? '300px 1fr' : '1fr' }}>
                {/* Message List */}
                <div className="border-r">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search messages..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-auto h-[calc(100%-73px)]">
                    {messageThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                          selectedThreadId === thread.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedThreadId(thread.id)}
                      >
                        <div className="flex items-centre justify-between">
                          <div className="flex items-centre">
                            <div className="mr-3 text-2xl">{thread.avatar}</div>
                            <div>
                              <h4 className="font-medium">{thread.with}</h4>
                              <p className="text-xs text-muted-foreground">{thread.role}</p>
                            </div>
                          </div>
                          {thread.unread > 0 && (
                            <Badge>{thread.unread}</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm line-clamp-1">{thread.lastMessage}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{thread.lastMessageDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Message Thread */}
                {selectedThreadId ? (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex items-centre">
                      <div className="mr-3 text-2xl">{getSelectedThread()?.avatar}</div>
                      <div>
                        <h3 className="font-medium">{getSelectedThread()?.with}</h3>
                        <p className="text-sm text-muted-foreground">{getSelectedThread()?.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-auto">
                      <div className="space-y-4">
                        {/* This would be populated with actual messages in a real implementation */}
                        <div className="bg-muted/50 p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">{getSelectedThread()?.lastMessage}</p>
                          <p className="text-xs text-muted-foreground mt-1">{getSelectedThread()?.lastMessageDate}</p>
                        </div>
                        
                        <div className="bg-primary/10 p-3 rounded-lg max-w-[80%] ml-auto">
                          <p className="text-sm">Thank you for letting me know. I'll discuss this with them at home.</p>
                          <p className="text-xs text-muted-foreground mt-1">2025-05-17</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your message..."
                          className="min-h-[80px]"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-centre justify-centre h-full">
                    <div className="text-centre">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Select a conversation</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Sarah Johnson" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="sarah.johnson@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+44 7700 900123" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to Children</Label>
                      <Input id="relationship" defaultValue="Mother" />
                    </div>
                  </div>
                  
                  <Button>Update Profile</Button>
                </div>
                
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-centre justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive urgent updates via SMS</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
