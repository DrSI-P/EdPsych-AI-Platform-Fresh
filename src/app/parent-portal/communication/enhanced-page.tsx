import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Video, 
  Calendar, 
  Clock, 
  User,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  FileText,
  Image,
  Mic,
  Smile,
  MoreHorizontal,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

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

// Mock teachers
const mockTeachers = [
  {
    id: 't1',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'Class Teacher',
    subject: 'Primary',
    profileImageUrl: '/images/avatars/teacher-1.png',
    childId: '1'
  },
  {
    id: 't2',
    firstName: 'David',
    lastName: 'Thompson',
    role: 'Mathematics Specialist',
    subject: 'Mathematics',
    profileImageUrl: '/images/avatars/teacher-2.png',
    childId: '1'
  },
  {
    id: 't3',
    firstName: 'Jessica',
    lastName: 'Brown',
    role: 'Class Teacher',
    subject: 'Primary',
    profileImageUrl: '/images/avatars/teacher-3.png',
    childId: '2'
  },
  {
    id: 't4',
    firstName: 'Michael',
    lastName: 'Clark',
    role: 'Special Educational Needs Coordinator',
    subject: 'SEN',
    profileImageUrl: '/images/avatars/teacher-4.png',
    childId: '1'
  }
];

// Mock conversations
const mockConversations = [
  {
    id: 'c1',
    teacherId: 't1',
    childId: '1',
    lastMessage: {
      id: 'm1-5',
      senderId: 't1',
      content: 'Emma has been doing really well in her reading comprehension exercises this week.',
      timestamp: new Date('2025-05-30T14:30:00'),
      read: true
    },
    messages: [
      {
        id: 'm1-1',
        senderId: 'p1', // parent
        content: 'Hello Ms. Wilson, I wanted to check in on Emma\'s progress with her reading assignments.',
        timestamp: new Date('2025-05-30T09:15:00'),
        read: true
      },
      {
        id: 'm1-2',
        senderId: 't1',
        content: 'Good morning! Emma has been making excellent progress with her reading. She\'s currently working through the Level 5 books and showing good comprehension skills.',
        timestamp: new Date('2025-05-30T10:20:00'),
        read: true
      },
      {
        id: 'm1-3',
        senderId: 'p1',
        content: 'That\'s great to hear! She\'s been reading more at home too. Is there anything specific we should be focusing on to support her?',
        timestamp: new Date('2025-05-30T11:05:00'),
        read: true
      },
      {
        id: 'm1-4',
        senderId: 't1',
        content: 'I\'d recommend practicing inference skills - asking her questions about why characters might be feeling certain ways or what might happen next based on the information given.',
        timestamp: new Date('2025-05-30T11:30:00'),
        read: true,
        attachments: [
          {
            id: 'a1',
            name: 'Reading Comprehension Guide.pdf',
            type: 'pdf',
            url: '/documents/reading-guide.pdf',
            size: '1.2 MB'
          }
        ]
      },
      {
        id: 'm1-5',
        senderId: 't1',
        content: 'Emma has been doing really well in her reading comprehension exercises this week.',
        timestamp: new Date('2025-05-30T14:30:00'),
        read: true
      }
    ]
  },
  {
    id: 'c2',
    teacherId: 't2',
    childId: '1',
    lastMessage: {
      id: 'm2-2',
      senderId: 'p1',
      content: 'Thank you for the resources, we\'ll work on these with Emma this weekend.',
      timestamp: new Date('2025-05-29T16:45:00'),
      read: true
    },
    messages: [
      {
        id: 'm2-1',
        senderId: 't2',
        content: 'I wanted to share some additional resources for Emma to practice her fractions work at home. She\'s been finding the concept of equivalent fractions challenging.',
        timestamp: new Date('2025-05-29T15:20:00'),
        read: true,
        attachments: [
          {
            id: 'a2',
            name: 'Fractions Worksheet.pdf',
            type: 'pdf',
            url: '/documents/fractions-worksheet.pdf',
            size: '850 KB'
          },
          {
            id: 'a3',
            name: 'Fractions Game Instructions.pdf',
            type: 'pdf',
            url: '/documents/fractions-game.pdf',
            size: '1.5 MB'
          }
        ]
      },
      {
        id: 'm2-2',
        senderId: 'p1',
        content: 'Thank you for the resources, we\'ll work on these with Emma this weekend.',
        timestamp: new Date('2025-05-29T16:45:00'),
        read: true
      }
    ]
  },
  {
    id: 'c3',
    teacherId: 't3',
    childId: '2',
    lastMessage: {
      id: 'm3-3',
      senderId: 't3',
      content: 'James did really well in his phonics assessment today! He\'s making great progress.',
      timestamp: new Date('2025-05-30T15:10:00'),
      read: false
    },
    messages: [
      {
        id: 'm3-1',
        senderId: 't3',
        content: 'Just wanted to let you know that James will be having his phonics assessment tomorrow. He\'s been practicing well in class.',
        timestamp: new Date('2025-05-29T14:20:00'),
        read: true
      },
      {
        id: 'm3-2',
        senderId: 'p1',
        content: 'Thanks for letting me know. We\'ve been practicing his sounds at home too. He seems more confident now.',
        timestamp: new Date('2025-05-29T18:30:00'),
        read: true
      },
      {
        id: 'm3-3',
        senderId: 't3',
        content: 'James did really well in his phonics assessment today! He\'s making great progress.',
        timestamp: new Date('2025-05-30T15:10:00'),
        read: false
      }
    ]
  },
  {
    id: 'c4',
    teacherId: 't4',
    childId: '1',
    lastMessage: {
      id: 'm4-1',
      senderId: 't4',
      content: 'I\'d like to schedule a meeting to discuss Emma\'s progress and some strategies we can implement to support her learning style. Would you be available next Tuesday at 4pm?',
      timestamp: new Date('2025-05-30T11:45:00'),
      read: false
    },
    messages: [
      {
        id: 'm4-1',
        senderId: 't4',
        content: 'I\'d like to schedule a meeting to discuss Emma\'s progress and some strategies we can implement to support her learning style. Would you be available next Tuesday at 4pm?',
        timestamp: new Date('2025-05-30T11:45:00'),
        read: false
      }
    ]
  }
];

// Mock scheduled meetings
const mockMeetings = [
  {
    id: 'm1',
    title: 'Parent-Teacher Conference',
    teacherId: 't1',
    childId: '1',
    date: new Date('2025-06-05'),
    startTime: '16:00',
    endTime: '16:30',
    location: 'Classroom 3B',
    type: 'in-person',
    description: 'Regular end-of-term progress discussion',
    status: 'confirmed'
  },
  {
    id: 'm2',
    title: 'SEN Support Discussion',
    teacherId: 't4',
    childId: '1',
    date: new Date('2025-06-10'),
    startTime: '15:30',
    endTime: '16:00',
    location: 'Video Call',
    type: 'virtual',
    description: 'Discussion about additional learning support strategies',
    status: 'pending'
  },
  {
    id: 'm3',
    title: 'Parent-Teacher Conference',
    teacherId: 't3',
    childId: '2',
    date: new Date('2025-06-05'),
    startTime: '16:30',
    endTime: '17:00',
    location: 'Classroom 2A',
    type: 'in-person',
    description: 'Regular end-of-term progress discussion',
    status: 'confirmed'
  }
];

// Mock announcements
const mockAnnouncements = [
  {
    id: 'a1',
    title: 'End of Term Arrangements',
    content: 'Please note that the last day of term will be Friday, July 23rd. School will finish at 1:30pm on this day.',
    date: new Date('2025-05-28'),
    sender: 'School Admin',
    priority: 'high',
    childId: 'all'
  },
  {
    id: 'a2',
    title: 'Year 5 Science Museum Trip',
    content: 'Year 5 will be visiting the Science Museum on Thursday, June 12th. Please ensure your child brings a packed lunch and wears school uniform.',
    date: new Date('2025-05-25'),
    sender: 'Year 5 Team',
    priority: 'medium',
    childId: '1'
  },
  {
    id: 'a3',
    title: 'Sports Day Information',
    content: 'Sports Day will be held on Wednesday, June 18th. Parents are welcome to attend from 1:00pm. Please ensure your child has appropriate PE kit, sun hat, and water bottle.',
    date: new Date('2025-05-20'),
    sender: 'PE Department',
    priority: 'medium',
    childId: 'all'
  }
];

export default function EnhancedCommunicationPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0].id);
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [meetings, setMeetings] = useState(mockMeetings);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showAllChildren, setShowAllChildren] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRichTextControls, setShowRichTextControls] = useState(false);
  
  // Update selected child when selectedChildId changes
  useEffect(() => {
    const child = mockChildren.find(c => c.id === selectedChildId);
    if (child) {
      setSelectedChild(child);
    }
  }, [selectedChildId]);
  
  // Filter conversations based on selected child
  const filteredConversations = conversations.filter(conversation => {
    return showAllChildren ? true : conversation.childId === selectedChildId;
  }).filter(conversation => {
    if (!searchQuery) return true;
    
    const teacher = mockTeachers.find(t => t.id === conversation.teacherId);
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    
    // Search in teacher name or last message content
    return teacherName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Filter meetings based on selected child
  const filteredMeetings = meetings.filter(meeting => {
    return showAllChildren ? true : meeting.childId === selectedChildId;
  });
  
  // Filter announcements based on selected child
  const filteredAnnouncements = announcements.filter(announcement => {
    return showAllChildren ? true : (announcement.childId === selectedChildId || announcement.childId === 'all');
  });
  
  // Get teacher by ID
  const getTeacher = (teacherId) => {
    return mockTeachers.find(teacher => teacher.id === teacherId);
  };
  
  // Get child name by ID
  const getChildName = (childId) => {
    const child = mockChildren.find(c => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : 'Unknown Child';
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Format time for display
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (timestamp.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (timestamp.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formatTime(timestamp)}`;
    } else {
      return `${formatDate(timestamp)}, ${formatTime(timestamp)}`;
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage = {
      id: `new-${Date.now()}`,
      senderId: 'p1', // parent
      content: newMessage,
      timestamp: new Date(),
      read: true
    };
    
    // Update the conversation with the new message
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === selectedConversation.id) {
        return {
          ...conversation,
          messages: [...conversation.messages, updatedMessage],
          lastMessage: updatedMessage
        };
      }
      return conversation;
    });
    
    setConversations(updatedConversations);
    setNewMessage('');
    
    // Update the selected conversation
    const updatedSelectedConversation = updatedConversations.find(
      conversation => conversation.id === selectedConversation.id
    );
    setSelectedConversation(updatedSelectedConversation);
  };
  
  // Mark conversation as read
  const markConversationAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === conversationId) {
        const updatedMessages = conversation.messages.map(message => ({
          ...message,
          read: true
        }));
        
        return {
          ...conversation,
          messages: updatedMessages,
          lastMessage: {
            ...conversation.lastMessage,
            read: true
          }
        };
      }
      return conversation;
    });
    
    setConversations(updatedConversations);
  };
  
  // Get unread message count for a conversation
  const getUnreadCount = (conversation) => {
    return conversation.messages.filter(message => !message.read && message.senderId !== 'p1').length;
  };
  
  // Get total unread message count
  const getTotalUnreadCount = () => {
    return conversations.reduce((count, conversation) => {
      return count + getUnreadCount(conversation);
    }, 0);
  };
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    markConversationAsRead(conversation.id);
  };
  
  // Handle key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Render message attachment
  const renderAttachment = (attachment) => {
    const getIcon = (type) => {
      switch (type) {
        case 'pdf':
          return <FileText className="h-4 w-4" />;
        case 'image':
          return <Image className="h-4 w-4" />;
        default:
          return <Paperclip className="h-4 w-4" />;
      }
    };
    
    return (
      <div key={attachment.id} className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
        {getIcon(attachment.type)}
        <span className="text-sm font-medium">{attachment.name}</span>
        <span className="text-xs text-muted-foreground">{attachment.size}</span>
      </div>
    );
  };
  
  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Communication</h1>
          <p className="text-muted-foreground mt-1">
            Stay connected with your child's educators and school
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
            
            <div className="flex items-center gap-2">
              <label htmlFor="show-all-children" className="text-sm">
                Show all children
              </label>
              <input 
                id="show-all-children" 
                type="checkbox" 
                checked={showAllChildren}
                onChange={(e) => setShowAllChildren(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {getTotalUnreadCount() > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalUnreadCount()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="h-4 w-4 mr-2" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <AlertCircle className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="h-[600px] overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => {
                    const teacher = getTeacher(conversation.teacherId);
                    const unreadCount = getUnreadCount(conversation);
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-slate-100' : ''
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={teacher.profileImageUrl} alt={`${teacher.firstName} ${teacher.lastName}`} />
                            <AvatarFallback>{teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium truncate">{teacher.firstName} {teacher.lastName}</h4>
                                {showAllChildren && (
                                  <p className="text-xs font-medium text-blue-600 truncate">
                                    {getChildName(conversation.childId)}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">{teacher.role}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(conversation.lastMessage.timestamp).split(',')[0]}
                                </span>
                                {unreadCount > 0 && (
                                  <span className="mt-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className={`text-sm mt-1 truncate ${!conversation.lastMessage.read && conversation.lastMessage.senderId !== 'p1' ? 'font-medium' : ''}`}>
                              {conversation.lastMessage.senderId === 'p1' ? 'You: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations found
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 border rounded-lg overflow-hidden">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={getTeacher(selectedConversation.teacherId).profileImageUrl} 
                            alt={`${getTeacher(selectedConversation.teacherId).firstName} ${getTeacher(selectedConversation.teacherId).lastName}`} 
                          />
                          <AvatarFallback>
                            {getTeacher(selectedConversation.teacherId).firstName.charAt(0)}
                            {getTeacher(selectedConversation.teacherId).lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {getTeacher(selectedConversation.teacherId).firstName} {getTeacher(selectedConversation.teacherId).lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {getTeacher(selectedConversation.teacherId).role}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[450px] overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map((message, index) => {
                      const isParent = message.senderId === 'p1';
                      const showDateHeader = index === 0 || 
                        new Date(message.timestamp).toDateString() !== 
                        new Date(selectedConversation.messages[index - 1].timestamp).toDateString();
                      
                      return (
                        <div key={message.id}>
                          {showDateHeader && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isParent ? 'bg-blue-500 text-white' : 'bg-slate-100'} rounded-lg p-3`}>
                              <p className="text-sm">{message.content}</p>
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map(attachment => renderAttachment(attachment))}
                                </div>
                              )}
                              <p className={`text-xs mt-1 ${isParent ? 'text-blue-100' : 'text-slate-500'}`}>
                                {formatTime(message.timestamp)}
                                {isParent && message.read && <span className="ml-1">✓</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 border-t">
                    {showRichTextControls && (
                      <div className="flex gap-2 mb-2 p-2 bg-slate-50 rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="font-bold">B</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="italic">I</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="underline">U</span>
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span>•</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span>1.</span>
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span>@</span>
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="min-h-[80px]"
                      />
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon" onClick={() => setShowRichTextControls(!showRichTextControls)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button size="icon" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center p-4">
                  <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Select a conversation from the list to view messages or start a new conversation with one of your child's teachers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Scheduled Meetings</span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardTitle>
              <CardDescription>
                Upcoming meetings with your child's educators
                {showAllChildren && <span className="ml-1">for all children</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map(meeting => {
                    const teacher = getTeacher(meeting.teacherId);
                    
                    return (
                      <div key={meeting.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-700 rounded-lg p-2 text-center min-w-[50px]">
                              <p className="text-xs font-medium">{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(meeting.date)}</p>
                              <p className="text-lg font-bold">{meeting.date.getDate()}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">{meeting.title}</h4>
                              {showAllChildren && (
                                <p className="text-xs font-medium text-blue-600">
                                  {getChildName(meeting.childId)}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {meeting.startTime} - {meeting.endTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant={meeting.status === 'confirmed' ? 'default' : 'outline'}>
                            {meeting.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">With</h5>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={teacher.profileImageUrl} alt={`${teacher.firstName} ${teacher.lastName}`} />
                                  <AvatarFallback>{teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{teacher.firstName} {teacher.lastName}</span>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Location</h5>
                              <div className="flex items-center gap-2">
                                {meeting.type === 'virtual' ? (
                                  <Video className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Users className="h-4 w-4 text-blue-500" />
                                )}
                                <span className="text-sm">{meeting.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          {meeting.description && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-1">Description</h5>
                              <p className="text-sm">{meeting.description}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            {meeting.status === 'pending' ? (
                              <>
                                <Button variant="default" className="flex-1">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <X className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                              </>
                            ) : (
                              <>
                                {meeting.type === 'virtual' && (
                                  <Button variant="default" className="flex-1">
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Meeting
                                  </Button>
                                )}
                                <Button variant="outline" className="flex-1">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Add to Calendar
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No meetings scheduled</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You don't have any meetings scheduled at the moment. Use the "Schedule Meeting" button to arrange a meeting with your child's educators.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>
                Important announcements from the school
                {showAllChildren && <span className="ml-1">for all children</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map(announcement => (
                    <div key={announcement.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {announcement.sender} • {formatDate(announcement.date)}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-sm">{announcement.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No announcements</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      There are no announcements at the moment. Check back later for updates from the school.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
