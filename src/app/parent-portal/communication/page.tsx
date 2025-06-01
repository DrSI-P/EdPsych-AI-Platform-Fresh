'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Clock, 
  User, 
  Calendar, 
  Video,
  FileText
} from 'lucide-react';

import { ParentEducatorMessage } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockMessages: ParentEducatorMessage[] = [
  {
    id: 'm1',
    senderId: 'e1',
    senderType: 'educator',
    recipientId: 'p1',
    recipientType: 'parent',
    childId: 'c1',
    subject: 'Weekly Progress Update',
    content: "Hello Mrs. Johnson, I wanted to share an update on Emma's progress this week. She's been doing exceptionally well in her reading comprehension exercises and has shown great improvement in her fractions work. She's also been very helpful to her classmates during group activities. However, I've noticed she's still struggling a bit with her spelling accuracy. Perhaps you could help her practice the words on her spelling list at home? Let me know if you have any questions.",
    timestamp: new Date('2025-05-15T14:30:00'),
    read: true,
    attachments: []
  },
  {
    id: 'm2',
    senderId: 'p1',
    senderType: 'parent',
    recipientId: 'e1',
    recipientType: 'educator',
    childId: 'c1',
    subject: 'Re: Weekly Progress Update',
    content: "Thank you for the update, Ms. Wilson. It's great to hear that Emma is doing well in reading and maths. We've been reading together every evening, which she seems to enjoy. I'll definitely help her practice her spelling words. Is there a particular method you recommend for spelling practice that would align with how you're teaching in class?",
    timestamp: new Date('2025-05-15T18:45:00'),
    read: true,
    replyToId: 'm1',
    attachments: []
  },
  {
    id: 'm3',
    senderId: 'e1',
    senderType: 'educator',
    recipientId: 'p1',
    recipientType: 'parent',
    childId: 'c1',
    subject: 'Re: Weekly Progress Update',
    content: "That's wonderful to hear about the reading at home! For spelling practice, we use a method called 'Look, Cover, Write, Check' in class. First, Emma should look at the word carefully, then cover it, write it from memory, and finally check if she got it right. Doing this for about 10 minutes each day can really help. I've attached a document with this week's spelling words and some additional exercises that might be helpful.",
    timestamp: new Date('2025-05-16T09:15:00'),
    read: false,
    replyToId: 'm2',
    attachments: [
      {
        id: 'a1',
        fileName: 'Week12_SpellingWords.pdf',
        fileType: 'application/pdf',
        fileSize: 245000,
        url: '/files/Week12_SpellingWords.pdf'
      }
    ]
  },
  {
    id: 'm4',
    senderId: 'e2',
    senderType: 'educator',
    recipientId: 'p1',
    recipientType: 'parent',
    childId: 'c1',
    subject: 'Science Museum Trip Permission',
    content: "Dear Mrs. Johnson, Our class is planning a trip to the Science Museum on 12th June as part of our science curriculum. The trip will run from 9:00 AM to 3:00 PM. Students will need to bring a packed lunch and wear their school uniform. Please complete the attached permission form and return it by 31st May. There is a £5 contribution for transportation. Let me know if you have any questions.",
    timestamp: new Date('2025-05-14T11:20:00'),
    read: true,
    attachments: [
      {
        id: 'a2',
        fileName: 'ScienceMuseumPermission.pdf',
        fileType: 'application/pdf',
        fileSize: 320000,
        url: '/files/ScienceMuseumPermission.pdf'
      }
    ]
  }
];

// Mock educators for demonstration
const mockEducators = [
  {
    id: 'e1',
    name: 'Ms. Wilson',
    role: 'Class Teacher',
    avatarUrl: '/images/avatars/teacher-1.png'
  },
  {
    id: 'e2',
    name: 'Mr. Thomas',
    role: 'Science Teacher',
    avatarUrl: '/images/avatars/teacher-2.png'
  },
  {
    id: 'e3',
    name: 'Mrs. Johnson',
    role: 'Head of Year 5',
    avatarUrl: '/images/avatars/teacher-3.png'
  }
];

// Mock children for demonstration
const mockChildren = [
  {
    id: 'c1',
    name: 'Emma Johnson',
    yearGroup: 5,
    avatarUrl: '/images/avatars/child-1.png'
  }
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = React.useState('messages');
  const [selectedMessage, setSelectedMessage] = React.useState<ParentEducatorMessage | null>(null);
  const [replyContent, setReplyContent] = React.useState('');
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format short date for message list
  const formatShortDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  };
  
  // Get sender name from ID
  const getSenderName = (senderId: string, senderType: 'parent' | 'educator') => {
    if (senderType === 'educator') {
      const educator = mockEducators.find(e => e.id === senderId);
      return educator ? educator.name : 'Unknown Educator';
    } else {
      return 'You';
    }
  };
  
  // Get avatar for sender
  const getSenderAvatar = (senderId: string, senderType: 'parent' | 'educator') => {
    if (senderType === 'educator') {
      const educator = mockEducators.find(e => e.id === senderId);
      return educator ? educator.avatarUrl : '';
    } else {
      return '/images/avatars/parent.png';
    }
  };
  
  // Get child name from ID
  const getChildName = (childId: string) => {
    const child = mockChildren.find(c => c.id === childId);
    return child ? child.name : 'Unknown Child';
  };
  
  // Handle sending a reply
  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) return;
    
    // In a real application, this would call an API to send the message
    console.log('Sending reply:', {
      replyToId: selectedMessage.id,
      content: replyContent,
      childId: selectedMessage.childId,
      recipientId: selectedMessage.senderId
    });
    
    // Clear the reply content
    setReplyContent('');
    
    // Show success message or update UI
    alert('Reply sent successfully!');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Communication</h1>
          <p className="text-muted-foreground mt-1">
            Stay connected with your child's educators
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="h-4 w-4 mr-2" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <FileText className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Messages</CardTitle>
                <CardDescription>
                  Communication with educators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Input placeholder="Search messages..." className="pl-8" />
                    <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    {mockMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 border rounded-lg cursor-pointer ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : 
                          !message.read && message.senderType === 'educator' ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium line-clamp-1">{message.subject}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatShortDate(message.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getSenderAvatar(message.senderId, message.senderType)} alt={getSenderName(message.senderId, message.senderType)} />
                            <AvatarFallback>{getSenderName(message.senderId, message.senderType).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{getSenderName(message.senderId, message.senderType)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {message.content}
                        </p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription>
                          Regarding {getChildName(selectedMessage.childId)}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                        Back to Messages
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={getSenderAvatar(selectedMessage.senderId, selectedMessage.senderType)} alt={getSenderName(selectedMessage.senderId, selectedMessage.senderType)} />
                            <AvatarFallback>{getSenderName(selectedMessage.senderId, selectedMessage.senderType).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{getSenderName(selectedMessage.senderId, selectedMessage.senderType)}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(selectedMessage.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {selectedMessage.senderType === 'educator' ? 'Educator' : 'Parent'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="prose max-w-none text-sm">
                            {selectedMessage.content.split('\n').map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                          
                          {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2">Attachments</h5>
                              <div className="space-y-2">
                                {selectedMessage.attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{attachment.fileName}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(attachment.fileSize / 1000).toFixed(0)} KB
                                      </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Reply</h4>
                        <Textarea 
                          placeholder="Type your reply here..." 
                          className="min-h-[150px]"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-between">
                          <Button variant="outline">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach File
                          </Button>
                          <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Message</h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose a message from the list to view its contents and reply to the sender.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meetings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
                <CardDescription>
                  Scheduled parent-teacher meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex gap-4 items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-lg p-2 text-center min-w-[50px]">
                        <p className="text-xs font-medium">Jun</p>
                        <p className="text-lg font-bold">05</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Parent-Teacher Meeting</h4>
                        <p className="text-sm text-muted-foreground">16:00 - 16:30</p>
                        <p className="text-sm">Classroom 3B</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/images/avatars/teacher-1.png" alt="Ms. Wilson" />
                            <AvatarFallback>MW</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Ms. Wilson</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Online
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex gap-4 items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-lg p-2 text-center min-w-[50px]">
                        <p className="text-xs font-medium">Jun</p>
                        <p className="text-lg font-bold">12</p>
                      </div>
                      <div>
                        <h4 className="font-medium">School Trip - Science Museum</h4>
                        <p className="text-sm text-muted-foreground">09:00 - 15:00</p>
                        <p className="text-sm">London Science Museum</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/images/avatars/teacher-2.png" alt="Mr. Thomas" />
                            <AvatarFallback>MT</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Mr. Thomas</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Permission Slip Submitted</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Schedule a Meeting</CardTitle>
                <CardDescription>
                  Request a meeting with your child's educators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Child</label>
                      <select className="w-full border rounded-md p-2">
                        <option value="c1">Emma Johnson - Year 5</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Educator</label>
                      <select className="w-full border rounded-md p-2">
                        <option value="">Select an educator</option>
                        <option value="e1">Ms. Wilson - Class Teacher</option>
                        <option value="e2">Mr. Thomas - Science Teacher</option>
                        <option value="e3">Mrs. Johnson - Head of Year 5</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Meeting Type</label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input type="radio" id="in-person" name="meeting-type" className="mr-2" />
                          <label htmlFor="in-person" className="text-sm">In-person</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="virtual" name="meeting-type" className="mr-2" />
                          <label htmlFor="virtual" className="text-sm">Virtual</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Reason for Meeting</label>
                      <Textarea placeholder="Please provide a brief description of what you'd like to discuss..." />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">School Announcements</CardTitle>
              <CardDescription>
                Important updates from the school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">End of Term Assembly</h4>
                    <Badge>Important</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    The end of term assembly will take place on Friday, 19th July at 10:00 AM in the school hall. Parents are welcome to attend. Students should wear full school uniform.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Posted on 20 May 2025</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Sports Day</h4>
                    <Badge variant="outline">Event</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    Sports Day will be held on Wednesday, 25th June, weather permitting. Students should come to school in their PE kit and bring a water bottle, sun hat, and sun cream. Parents are invited to attend from 1:00 PM.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Posted on 15 May 2025</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Summer Fair Volunteers Needed</h4>
                    <Badge variant="outline">Community</Badge>
                  </div>
                  <p className="text-sm mt-1">
                    We are looking for parent volunteers to help run stalls at our Summer Fair on Saturday, 5th July. If you are able to help, please contact the school office or complete the online form.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Posted on 10 May 2025</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Volunteer Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
