'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Video, 
  Share2, 
  Settings, 
  Plus,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  UserPlus,
  Copy,
  Download,
  Clock,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { 
  CollaborationSession,
  CollaborationSessionType,
  CollaborationRole,
  CollaborationParticipant,
  CollaborativeDocument
} from '@/lib/collaboration/types';
import { getCollaborationService } from '@/lib/collaboration/collaborationService';

// Mock user for demonstration
const mockUser = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: '/avatars/alex.jpg'
};

// Mock session for demonstration
const mockSession: CollaborationSession = {
  id: 'session-1',
  type: CollaborationSessionType.DOCUMENT,
  title: 'Science Project Collaboration',
  description: 'Collaborative workspace for our KS3 Science project on ecosystems',
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  updatedAt: new Date(),
  ownerId: 'user-2',
  participants: [
    {
      userId: 'user-1',
      name: 'Alex Johnson',
      role: CollaborationRole.EDITOR,
      joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'online',
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canInvite: true,
        canExport: true
      }
    },
    {
      userId: 'user-2',
      name: 'Sarah Williams',
      role: CollaborationRole.OWNER,
      joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'online',
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canInvite: true,
        canExport: true
      }
    },
    {
      userId: 'user-3',
      name: 'Michael Brown',
      role: CollaborationRole.EDITOR,
      joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'offline',
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: false,
        canInvite: false,
        canExport: true
      }
    },
    {
      userId: 'user-4',
      name: 'Emma Davis',
      role: CollaborationRole.VIEWER,
      joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'away',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: {
        canEdit: false,
        canComment: true,
        canShare: false,
        canInvite: false,
        canExport: true
      }
    }
  ],
  status: 'active',
  settings: {
    isPublic: false,
    allowJoinRequests: true,
    allowAnonymousViewers: false,
    requireApprovalToJoin: true,
    enableChat: true,
    enableVideoConference: true,
    enableRealTimeEditing: true,
    enableVersionHistory: true,
    maxParticipants: 10,
    autoSaveInterval: 30,
    inactivityTimeout: 30,
    moderationSettings: {
      enableContentFiltering: true,
      enableProfanityFilter: true,
      requireApprovalForExternalContent: true
    },
    accessibilitySettings: {
      enableHighContrast: false,
      enableScreenReaderSupport: true,
      enableKeyboardNavigation: true,
      enableTextToSpeech: true,
      enableVoiceInput: true
    }
  },
  content: {
    documentId: 'doc-1'
  },
  metadata: {
    subject: 'Science',
    keyStage: 'KS3',
    tags: ['ecosystem', 'biology', 'group project'],
    educationalObjectives: [
      'Understand the interactions within ecosystems',
      'Analyse the impact of human activity on biodiversity',
      'Develop collaborative research skills'
    ]
  }
};

// Mock document for demonstration
const mockDocument: CollaborativeDocument = {
  id: 'doc-1',
  sessionId: 'session-1',
  title: 'Ecosystem Research Project',
  content: `# Ecosystem Research Project

## Introduction
Our team is researching the impact of climate change on local ecosystems. This collaborative document will serve as our main workspace for organising research, sharing findings, and preparing our final presentation.

## Research Questions
1. How are local ecosystems responding to temperature changes?
2. What species are most affected by habitat changes?
3. What conservation strategies have been most effective?

## Team Responsibilities
- Alex: Research on temperature data and trends
- Sarah: Species impact analysis
- Michael: Conservation strategies
- Emma: Data visualisation and presentation

## Timeline
- Week 1: Initial research and data collection
- Week 2: Analysis and findings
- Week 3: Prepare presentation and report

## Resources
- Local climate data from Met Office
- Species surveys from Wildlife Trust
- Conservation reports from Natural England

## Notes from Team Meeting (15 May)
We discussed the approach for data collection and agreed to focus on three local ecosystems: woodland, wetland, and meadow habitats. Each team member will gather data on their assigned area and we'll combine findings next week.`,
  format: 'markdown',
  version: 5,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  createdBy: 'user-2',
  lastEditedBy: 'user-1',
  contributors: ['user-1', 'user-2', 'user-3'],
  comments: [
    {
      id: 'comment-1',
      documentId: 'doc-1',
      userId: 'user-3',
      userName: 'Michael Brown',
      content: 'I found some great conservation reports we can use. Will add them to the resources section.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      position: {
        startIndex: 500,
        endIndex: 550
      },
      resolved: false,
      replies: [],
      mentions: []
    },
    {
      id: 'comment-2',
      documentId: 'doc-1',
      userId: 'user-2',
      userName: 'Sarah Williams',
      content: 'Should we add a section on methodology?',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      position: {
        startIndex: 200,
        endIndex: 250
      },
      resolved: true,
      resolvedBy: 'user-1',
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      replies: [
        {
          id: 'comment-3',
          documentId: 'doc-1',
          userId: 'user-1',
          userName: 'Alex Johnson',
          content: 'Good idea! I\'ll add that section tomorrow.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          position: {
            startIndex: 200,
            endIndex: 250
          },
          resolved: false,
          replies: [],
          mentions: ['user-2']
        }
      ],
      mentions: []
    }
  ],
  versionHistory: [
    {
      id: 'version-1',
      documentId: 'doc-1',
      version: 1,
      content: '# Ecosystem Research Project\n\n## Introduction\nOur team is researching the impact of climate change on local ecosystems.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdBy: 'user-2',
      comment: 'Initial document creation',
      changes: {
        additions: 100,
        deletions: 0,
        changedSections: []
      }
    },
    {
      id: 'version-2',
      documentId: 'doc-1',
      version: 2,
      content: '# Ecosystem Research Project\n\n## Introduction\nOur team is researching the impact of climate change on local ecosystems.\n\n## Research Questions\n1. How are local ecosystems responding to temperature changes?\n2. What species are most affected by habitat changes?\n3. What conservation strategies have been most effective?',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdBy: 'user-2',
      comment: 'Added research questions',
      changes: {
        additions: 200,
        deletions: 0,
        changedSections: []
      }
    }
  ],
  currentEditors: ['user-1'],
  status: 'draft',
  metadata: {
    wordCount: 250,
    readingTime: 2
  }
};

// Mock chat messages for demonstration
const mockChatMessages = [
  {
    id: 'msg-1',
    userId: 'user-2',
    userName: 'Sarah Williams',
    content: 'Hi everyone! I\'ve created this workspace for our ecosystem project.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-2',
    userId: 'user-1',
    userName: 'Alex Johnson',
    content: 'Thanks Sarah! I\'ve started adding my research on temperature data.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-3',
    userId: 'user-3',
    userName: 'Michael Brown',
    content: 'I found some interesting conservation strategies we could include.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-4',
    userId: 'user-4',
    userName: 'Emma Davis',
    content: 'I\'ve been working on some data visualizations. Will share them soon!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-5',
    userId: 'user-2',
    userName: 'Sarah Williams',
    content: 'Let\'s schedule a video call to discuss our progress. How about tomorrow at 4pm?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-6',
    userId: 'user-1',
    userName: 'Alex Johnson',
    content: 'Works for me!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    isPrivate: false
  },
  {
    id: 'msg-7',
    userId: 'user-3',
    userName: 'Michael Brown',
    content: 'I can make it too.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    isPrivate: false
  }
];

export default function CollaborativeWorkspace() {
  const [activeTab, setActiveTab] = useState<string>('document');
  const [session, setSession] = useState<CollaborationSession>(mockSession);
  const [document, setDocument] = useState<CollaborativeDocument>(mockDocument);
  const [chatMessages, setChatMessages] = useState<any[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [documentContent, setDocumentContent] = useState<string>(mockDocument.content);
  const [participants, setParticipants] = useState<CollaborationParticipant[]>(mockSession.participants);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }, [chatMessages]);
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
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
  
  // Get status colour
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-grey-500';
      default:
        return 'bg-grey-500';
    }
  };
  
  // Get role badge colour
  const getRoleBadgeColor = (role: CollaborationRole): string => {
    switch (role) {
      case CollaborationRole.OWNER:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case CollaborationRole.EDITOR:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case CollaborationRole.COMMENTER:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case CollaborationRole.VIEWER:
        return 'bg-grey-100 text-grey-800 dark:bg-grey-900/30 dark:text-grey-300';
      default:
        return 'bg-grey-100 text-grey-800 dark:bg-grey-900/30 dark:text-grey-300';
    }
  };
  
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Send chat message
  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: `msg-${Date.now()}`,
      userId: mockUser.id,
      userName: mockUser.name,
      content: newMessage,
      timestamp: new Date(),
      isPrivate: false
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };
  
  // Toggle document editing
  const toggleEditing = () => {
    if (isEditing) {
      // Save document
      setDocument({
        ...document,
        content: documentContent,
        version: document.version + 1,
        updatedAt: new Date(),
        lastEditedBy: mockUser.id
      });
      
      toast({
        title: "Document Saved",
        description: "Your changes have been saved and shared with collaborators.",
        duration: 3000,
      });
    }
    
    setIsEditing(!isEditing);
  };
  
  // Start video call
  const startVideoCall = () => {
    toast({
      title: "Starting Video Call",
      description: "Connecting to video conference...",
      duration: 3000,
    });
    
    // In a real implementation, this would connect to a video conferencing service
    setTimeout(() => {
      setActiveTab('video');
    }, 1000);
  };
  
  // Share session
  const shareSession = () => {
    // Copy session link to clipboard
    navigator.clipboard.writeText(`https://edpsychconnect.com/collaboration/session/${session.id}`);
    
    toast({
      title: "Link Copied",
      description: "Collaboration session link copied to clipboard.",
      duration: 3000,
    });
  };
  
  // Invite participant
  const inviteParticipant = () => {
    toast({
      title: "Invite Sent",
      description: "Invitation has been sent to the participant.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold">{session.title}</h1>
          <p className="text-muted-foreground">{session.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={shareSession}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" onClick={startVideoCall}>
            <Video className="h-4 w-4 mr-2" />
            Video Call
          </Button>
          
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                {participants.length} collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.userId} className="flex items-centre justify-between">
                    <div className="flex items-centre">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(participant.status)}`}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{participant.name}</p>
                        <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(participant.role)}`}>
                          {participant.role}
                        </Badge>
                      </div>
                    </div>
                    
                    {participant.status === 'online' && participant.userId !== mockUser.id && (
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" onClick={inviteParticipant}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(session.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatTimeAgo(session.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{session.type.replace('_', ' ')}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p className="text-sm text-muted-foreground">{session.metadata.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Key Stage</p>
                  <p className="text-sm text-muted-foreground">{session.metadata.keyStage}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.metadata.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="document">
                <FileText className="h-4 w-4 mr-2" />
                Document
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-centre justify-between">
                  <div>
                    <CardTitle>{document.title}</CardTitle>
                    <CardDescription>
                      Last edited by {participants.find(p => p.userId === document.lastEditedBy)?.name || 'Unknown'} • {formatTimeAgo(document.createdAt)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      size="sm"
                      onClick={toggleEditing}
                    >
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <textarea
                      ref={editorRef}
                      className="w-full min-h-[500px] p-4 border rounded-md font-mono text-sm"
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                    />
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: documentContent
                          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/- (.*?)$/gm, '<li>$1</li>')
                      }} />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-centre text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Version {document.version} • {document.metadata.wordCount} words • {document.metadata.readingTime} min read</span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {document.contributors.map((contributorId) => {
                      const contributor = participants.find(p => p.userId === contributorId);
                      return contributor ? (
                        <Avatar key={contributorId} className="border-2 border-background">
                          <AvatarFallback>{getInitials(contributor.name)}</AvatarFallback>
                        </Avatar>
                      ) : null;
                    })}
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Comments</h3>
                
                <div className="space-y-4">
                  {document.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-centre">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{comment.userName}</p>
                              <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                            </div>
                          </div>
                          
                          {comment.resolved ? (
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{comment.content}</p>
                      </CardContent>
                      
                      {comment.replies.length > 0 && (
                        <div className="ml-8 border-l-2 pl-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="pt-2">
                              <div className="flex items-centre">
                                <Avatar className="h-5 w-5 mr-2">
                                  <AvatarFallback>{getInitials(reply.userName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{reply.userName}</p>
                                  <p className="text-xs text-muted-foreground">{formatTimeAgo(reply.createdAt)}</p>
                                </div>
                              </div>
                              <p className="text-sm mt-1">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {!comment.resolved && (
                        <CardFooter>
                          <div className="flex w-full">
                            <Input 
                              placeholder="Reply to comment..." 
                              className="text-sm"
                            />
                            <Button variant="ghost" size="sm" className="ml-2">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Group Chat</CardTitle>
                  <CardDescription>
                    {participants.filter(p => p.status === 'online').length} participants online
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.userId === mockUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.userId === mockUser.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            {message.userId !== mockUser.id && (
                              <p className="text-xs font-medium mb-1">{message.userName}</p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-right mt-1 opacity-70">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-centre space-x-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                    />
                    <Button variant="outline" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={sendChatMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="video" className="mt-4">
              <Card className="h-[600px]">
                <CardHeader>
                  <div className="flex justify-between items-centre">
                    <CardTitle>Video Conference</CardTitle>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      End Call
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-centre justify-centre h-[450px] bg-muted rounded-md">
                  <div className="text-centre">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Video Conference</h3>
                    <p className="text-muted-foreground mt-2">
                      In a real implementation, this would display the video conference interface.
                    </p>
                    <div className="flex justify-centre mt-6 space-x-4">
                      <Button variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                      <Button variant="outline">
                        <Mic className="h-4 w-4 mr-2" />
                        Microphone
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Screen
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-centre">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      00:00:00
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Participants
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
