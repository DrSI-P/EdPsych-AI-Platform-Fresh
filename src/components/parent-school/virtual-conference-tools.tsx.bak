'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, Clock, Video, Users, MessageSquare, Globe, Check, X, Calendar as CalendarComponent, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Star, Award, Camera, Download, Share2, Sparkles, FileText, Mic, Settings, Bell, Clipboard, PlusCircle, Trash2, Edit, ExternalLink, Copy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Mock data for upcoming conferences
const MOCK_CONFERENCES = [
  {
    id: '1',
    title: 'Parents\' Evening',
    description: 'Discuss Oliver\'s progress and next steps',
    date: '2025-07-15',
    time: '16:00',
    duration: 20,
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    type: 'video',
    status: 'confirmed',
    link: 'https://meet.edpsychconnect.com/parents-evening/oliver-johnson',
    notes: 'We\'ll discuss reading progress and math confidence',
    documents: [
      { id: '1', name: 'Term Progress Report', type: 'pdf', url: '/documents/progress_report.pdf' }
    ],
    translation: {
      enabled: false,
      language: null
    }
  },
  {
    id: '2',
    title: 'SEND Review Meeting',
    description: 'Annual review of Oliver\'s support plan',
    date: '2025-07-22',
    time: '14:30',
    duration: 45,
    teacher: {
      id: 'teacher_2',
      name: 'Mrs. Patel',
      role: 'SENCO',
      avatar: '/avatars/teacher2.png'
    },
    type: 'in-person',
    status: 'confirmed',
    location: 'Meeting Room 3',
    notes: 'Please bring any external reports or assessments',
    documents: [
      { id: '1', name: 'Current Support Plan', type: 'pdf', url: '/documents/support_plan.pdf' },
      { id: '2', name: 'Progress Review Form', type: 'pdf', url: '/documents/progress_review.pdf' }
    ],
    translation: {
      enabled: false,
      language: null
    }
  },
  {
    id: '3',
    title: 'End of Year Celebration',
    description: 'Celebrate Oliver\'s achievements this year',
    date: '2025-07-25',
    time: '15:00',
    duration: 30,
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    type: 'video',
    status: 'pending',
    link: null,
    notes: 'We\'ll review achievements and celebrate progress',
    documents: [],
    translation: {
      enabled: false,
      language: null
    }
  }
];

// Mock data for celebration items
const MOCK_CELEBRATIONS = [
  {
    id: '1',
    title: 'Reading Fluency Milestone',
    description: 'Oliver has reached 100 words per minute with 95% accuracy!',
    date: '2025-06-10',
    type: 'achievement',
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: {
      type: 'image',
      url: '/celebrations/reading_certificate.jpg'
    },
    reactions: {
      likes: 5,
      comments: 3
    },
    comments: [
      { id: '1', author: 'Parent', text: 'We\'re so proud of Oliver\'s progress!', date: '2025-06-10' },
      { id: '2', author: 'Ms. Johnson', text: 'Oliver has been working so hard on this goal. Well deserved!', date: '2025-06-11' }
    ],
    isPublic: true
  },
  {
    id: '2',
    title: 'Math Problem-Solving Award',
    description: 'Oliver demonstrated exceptional problem-solving skills in our math challenge week.',
    date: '2025-05-20',
    type: 'award',
    teacher: {
      id: 'teacher_3',
      name: 'Mr. Williams',
      role: 'Maths Coordinator',
      avatar: '/avatars/teacher3.png'
    },
    media: {
      type: 'image',
      url: '/celebrations/math_award.jpg'
    },
    reactions: {
      likes: 7,
      comments: 2
    },
    comments: [
      { id: '1', author: 'Mr. Williams', text: 'Oliver approached complex problems with creativity and persistence.', date: '2025-05-20' },
      { id: '2', author: 'Parent', text: 'Thank you for recognising Oliver\'s efforts!', date: '2025-05-21' }
    ],
    isPublic: true
  },
  {
    id: '3',
    title: 'Social Skills Progress',
    description: 'Oliver has made significant progress in turn-taking and collaborative work.',
    date: '2025-06-05',
    type: 'progress',
    teacher: {
      id: 'teacher_1',
      name: 'Ms. Johnson',
      role: 'Year 4 Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: {
      type: 'video',
      url: '/celebrations/social_skills.mp4'
    },
    reactions: {
      likes: 4,
      comments: 1
    },
    comments: [
      { id: '1', author: 'Ms. Johnson', text: 'Oliver has been consistently demonstrating these skills in group activities.', date: '2025-06-05' }
    ],
    isPublic: false
  }
];

export default function VirtualConferenceTools() {
  const [activeTab, setActiveTab] = useState('conferences');
  const [selectedConference, setSelectedConference] = useState(MOCK_CONFERENCES[0]);
  const [selectedCelebration, setSelectedCelebration] = useState(MOCK_CELEBRATIONS[0]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCelebrationForm, setShowCelebrationForm] = useState(false);
  const [date, setDate] = useState(new Date());
  const [newComment, setNewComment] = useState('');
  
  // Handle submitting a new comment
  const handleSubmitComment = () => {
    if (newComment.trim() === '') return;
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the celebration.",
    });
    
    setNewComment('');
  };
  
  // Handle requesting a new conference
  const handleRequestConference = () => {
    toast({
      title: "Conference Requested",
      description: "Your conference request has been sent to the teacher.",
    });
    
    setShowRequestForm(false);
  };
  
  // Handle sharing a celebration
  const handleShareCelebration = () => {
    toast({
      title: "Celebration Shared",
      description: "The celebration has been shared with your family.",
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent-Teacher Collaboration</h1>
          <p className="text-muted-foreground">
            Schedule conferences and celebrate progress together
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'conferences' && (
            <Button onClick={() => setShowRequestForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Conference
            </Button>
          )}
          {activeTab === 'celebrations' && (
            <Button onClick={() => setShowCelebrationForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Celebration
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="conferences" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
          <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conferences" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Conferences</CardTitle>
                  <CardDescription>
                    Scheduled meetings with teachers
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {MOCK_CONFERENCES.map((conference: any) => (
                      <div 
                        key={conference.id}
                        className={`p-4 border-b hover:bg-muted cursor-pointer ${selectedConference.id === conference.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedConference(conference)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{conference.title}</h3>
                            <p className="text-sm text-muted-foreground">{conference.teacher.name}</p>
                          </div>
                          {conference.status === 'confirmed' ? (
                            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-centre text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{new Date(conference.date).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{conference.time}</span>
                          <span className="mx-1">•</span>
                          {conference.type === 'video' ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : (
                            <Users className="h-3 w-3 mr-1" />
                          )}
                          <span>{conference.type === 'video' ? 'Video' : 'In-person'}</span>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conference Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Events on {format(date, 'PPP')}</h3>
                    {MOCK_CONFERENCES.some(conf => conf.date === format(date, 'yyyy-MM-dd')) ? (
                      MOCK_CONFERENCES
                        .filter(conf => conf.date === format(date, 'yyyy-MM-dd'))
                        .map(conf => (
                          <div 
                            key={conf.id}
                            className="p-2 border-l-2 border-primary mb-2 hover:bg-muted cursor-pointer"
                            onClick={() => setSelectedConference(conf)}
                          >
                            <p className="font-medium text-sm">{conf.title}</p>
                            <div className="flex items-centre text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{conf.time}</span>
                              <span className="mx-1">•</span>
                              <span>{conf.teacher.name}</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No events scheduled</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-centre">
                        <CardTitle>{selectedConference.title}</CardTitle>
                        <Badge className="ml-2" variant={selectedConference.status === 'confirmed' ? 'default' : 'outline'}>
                          {selectedConference.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {selectedConference.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {selectedConference.status === 'confirmed' && (
                          <>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </DropdownMenuItem>
                            {selectedConference.type === 'video' && (
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Meeting Link
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Request Change
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Conference
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(selectedConference.date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedConference.time}</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium">{selectedConference.duration} minutes</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{selectedConference.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-centre">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={selectedConference.teacher.avatar} />
                        <AvatarFallback>{selectedConference.teacher.name.charAt(0: any)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedConference.teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedConference.teacher.role}</p>
                      </div>
                    </div>
                    
                    {selectedConference.type === 'video' && selectedConference.status === 'confirmed' && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-centre">
                          <div>
                            <h3 className="text-sm font-medium">Video Conference Link</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Click the button to join the meeting at the scheduled time
                            </p>
                          </div>
                          <Button>
                            <Video className="mr-2 h-4 w-4" />
                            Join Meeting
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedConference.type === 'in-person' && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-centre">
                          <div>
                            <h3 className="text-sm font-medium">Meeting Location</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedConference.location}
                            </p>
                          </div>
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Map
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Conference Notes</h3>
                      <p className="text-sm">{selectedConference.notes}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <h3 className="text-sm font-medium">Translation Options</h3>
                        <Select defaultValue={selectedConference.translation.enabled ? selectedConference.translation.language : "none"}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Translation</SelectItem>
                            <SelectItem value="welsh">Welsh</SelectItem>
                            <SelectItem value="polish">Polish</SelectItem>
                            <SelectItem value="urdu">Urdu</SelectItem>
                            <SelectItem value="arabic">Arabic</SelectItem>
                            <SelectItem value="romanian">Romanian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Live translation is available for video conferences. For in-person meetings, a translator can be arranged.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <h3 className="text-sm font-medium">Documents</h3>
                        <Button variant="ghost" size="sm">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add Document
                        </Button>
                      </div>
                      
                      {selectedConference.documents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedConference.documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-centre p-3 bg-muted rounded-lg">
                              <FileText className="h-5 w-5 mr-3 text-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()}</p>
                              </div>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No documents attached</p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Accessibility Options</h3>
                      <div className="space-y-2">
                        <div className="flex items-centre">
                          <input type="checkbox" id="captions" className="mr-2" />
                          <Label htmlFor="captions" className="text-sm">Enable live captions</Label>
                        </div>
                        <div className="flex items-centre">
                          <input type="checkbox" id="recording" className="mr-2" />
                          <Label htmlFor="recording" className="text-sm">Record meeting for later review</Label>
                        </div>
                        <div className="flex items-centre">
                          <input type="checkbox" id="notes" className="mr-2" />
                          <Label htmlFor="notes" className="text-sm">Request written summary notes</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Add to Calendar
                      </Button>
                      
                      {selectedConference.status === 'confirmed' && selectedConference.type === 'video' && (
                        <Button>
                          <Video className="mr-2 h-4 w-4" />
                          Join Conference
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showRequestForm && (
            <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
              <div className="bg-background rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Request Conference</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teacher">Teacher</Label>
                    <Select defaultValue="teacher_1">
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher_1">Ms. Johnson (Year 4 Teacher: any)</SelectItem>
                        <SelectItem value="teacher_2">Mrs. Patel (SENCO: any)</SelectItem>
                        <SelectItem value="teacher_3">Mr. Williams (Maths Coordinator: any)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select defaultValue="progress">
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progress Discussion</SelectItem>
                        <SelectItem value="concern">Discuss a Concern</SelectItem>
                        <SelectItem value="send">SEND Support Review</SelectItem>
                        <SelectItem value="behaviour">Behaviour Discussion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Conference Type</Label>
                    <Select defaultValue="video">
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Conference</SelectItem>
                        <SelectItem value="in-person">In-Person Meeting</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Preferred Dates</Label>
                    <div className="border rounded-md p-3 mt-1">
                      <Calendar
                        mode="multiple"
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="times">Preferred Times</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {['Morning', 'Afternoon', 'After School'].map((time: any) => (
                        <div key={time} className="flex items-centre space-x-2">
                          <input type="checkbox" id={time} />
                          <Label htmlFor={time} className="text-sm">{time}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Please provide any additional information..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={() => setShowRequestForm(false: any)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestConference}>
                      Submit Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="celebrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Celebrations</CardTitle>
                  <CardDescription>
                    Achievements and progress milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {MOCK_CELEBRATIONS.map((celebration: any) => (
                      <div 
                        key={celebration.id}
                        className={`p-4 border-b hover:bg-muted cursor-pointer ${selectedCelebration.id === celebration.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedCelebration(celebration: any)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{celebration.title}</h3>
                            <p className="text-sm text-muted-foreground">{celebration.teacher.name}</p>
                          </div>
                          {celebration.type === 'achievement' ? (
                            <Badge className="bg-amber-100 text-amber-800">Achievement</Badge>
                          ) : celebration.type === 'award' ? (
                            <Badge className="bg-blue-100 text-blue-800">Award</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Progress</Badge>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-centre text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{new Date(celebration.date: any).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          {celebration.media.type === 'image' ? (
                            <Camera className="h-3 w-3 mr-1" />
                          ) : (
                            <Video className="h-3 w-3 mr-1" />
                          )}
                          <span>{celebration.media.type}</span>
                          <span className="mx-1">•</span>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>{celebration.comments.length} comments</span>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Celebration Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-3 text-centre">
                        <h4 className="text-sm font-medium text-muted-foreground">Achievements</h4>
                        <p className="text-2xl font-bold mt-1">12</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3 text-centre">
                        <h4 className="text-sm font-medium text-muted-foreground">Awards</h4>
                        <p className="text-2xl font-bold mt-1">5</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Categories</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-centre mb-1">
                            <span className="text-sm">Literacy</span>
                            <span className="text-sm text-muted-foreground">40%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-centre mb-1">
                            <span className="text-sm">Numeracy</span>
                            <span className="text-sm text-muted-foreground">30%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-centre mb-1">
                            <span className="text-sm">Social Skills</span>
                            <span className="text-sm text-muted-foreground">20%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-centre mb-1">
                            <span className="text-sm">Other</span>
                            <span className="text-sm text-muted-foreground">10%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-centre">
                        <CardTitle>{selectedCelebration.title}</CardTitle>
                        {selectedCelebration.type === 'achievement' ? (
                          <Badge className="ml-2 bg-amber-100 text-amber-800">Achievement</Badge>
                        ) : selectedCelebration.type === 'award' ? (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">Award</Badge>
                        ) : (
                          <Badge className="ml-2 bg-green-100 text-green-800">Progress</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {selectedCelebration.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleShareCelebration}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Celebration
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Media
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Certificate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Privacy Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {selectedCelebration.media.url ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={selectedCelebration.media.url} 
                            alt={selectedCelebration.title} 
                            className="w-full h-full object-cover" 
                          />
                          {selectedCelebration.media.type === 'video' && (
                            <div className="absolute inset-0 flex items-centre justify-centre">
                              <Button size="icon" className="h-12 w-12 rounded-full bg-primary/90 hover:bg-primary">
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-centre justify-centre h-full">
                          {selectedCelebration.type === 'achievement' ? (
                            <Star className="h-16 w-16 text-amber-500" />
                          ) : selectedCelebration.type === 'award' ? (
                            <Award className="h-16 w-16 text-blue-500" />
                          ) : (
                            <Sparkles className="h-16 w-16 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={selectedCelebration.teacher.avatar} />
                          <AvatarFallback>{selectedCelebration.teacher.name.charAt(0: any)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedCelebration.teacher.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedCelebration.teacher.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-centre space-x-4">
                        <div className="flex items-centre">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(selectedCelebration.date: any).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-centre">
                          {selectedCelebration.isPublic ? (
                            <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                          ) : (
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {selectedCelebration.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <h3 className="text-sm font-medium">Related Goals</h3>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-centre">
                          <Target className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Reading Fluency</p>
                            <div className="flex items-centre mt-1">
                              <div className="w-24 h-2 bg-background rounded-full overflow-hidden mr-2">
                                <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                              </div>
                              <span className="text-xs text-muted-foreground">65% complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <h3 className="text-sm font-medium">Reactions</h3>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-centre">
                          <Heart className="h-4 w-4 mr-1 text-rose-500" />
                          <span>{selectedCelebration.reactions.likes}</span>
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          🎉 Celebrate
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          👏 Applaud
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          🌟 Proud
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-centre mb-2">
                        <h3 className="text-sm font-medium">Comments</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea 
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e: any) => setNewComment(e.target.value: any)}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end mt-2">
                              <Button size="sm" onClick={handleSubmitComment}>
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {selectedCelebration.comments.map((comment: any) => (
                          <div key={comment.id} className="flex">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{comment.author.charAt(0: any)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted p-3 rounded-lg">
                              <div className="flex justify-between items-centre">
                                <p className="font-medium text-sm">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.date: any).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleShareCelebration}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showCelebrationForm && (
            <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
              <div className="bg-background rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add Celebration</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter celebration title" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the achievement or progress..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Celebration Type</Label>
                    <Select defaultValue="achievement">
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="progress">Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Media</Label>
                    <div className="border border-dashed rounded-lg p-6 mt-1 text-centre">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Drag and drop an image or video, or click to browse
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upload File
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="privacy">Privacy Setting</Label>
                    <Select defaultValue="private">
                      <SelectTrigger id="privacy">
                        <SelectValue placeholder="Select privacy setting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private (Family Only: any)</SelectItem>
                        <SelectItem value="school">School Community</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={() => setShowCelebrationForm(false: any)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Celebration Added",
                        description: "Your celebration has been added successfully.",
                      });
                      setShowCelebrationForm(false: any);
                    }}>
                      Add Celebration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
