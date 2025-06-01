'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button 
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  FileText,
  MessageSquare,
  Calendar,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Star,
  Download,
  Share2
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

// Sample webinar data
const SAMPLE_UPCOMING_WEBINARS = [
  {
    id: 'web-001',
    title: 'Trauma-Informed Approaches in the Classroom',
    description: 'Learn practical strategies for creating a trauma-sensitive learning environment that supports all students.',
    presenter: {
      name: 'Dr. Emma Thompson',
      role: 'Educational Psychologist',
      image: '/avatars/emma-thompson.jpg'
    },
    date: new Date(2025, 5, 25, 15, 0), // June 25, 2025, 3:00 PM
    duration: 90, // minutes
    capacity: 100,
    registered: 78,
    topics: ['Trauma-Informed Practise', 'Classroom Management', 'Student Wellbeing'],
    level: 'Intermediate'
  },
  {
    id: 'web-002',
    title: 'Supporting Pupils with Autism Spectrum Condition',
    description: 'Explore evidence-based strategies for creating inclusive learning environments for students with ASC.',
    presenter: {
      name: 'Sarah Williams',
      role: 'SEND Specialist',
      image: '/avatars/sarah-williams.jpg'
    },
    date: new Date(2025, 5, 28, 16, 0), // June 28, 2025, 4:00 PM
    duration: 60, // minutes
    capacity: 75,
    registered: 62,
    topics: ['Autism', 'Inclusive Education', 'Differentiation'],
    level: 'All Levels'
  },
  {
    id: 'web-003',
    title: 'Effective Implementation of Restorative Justice Practices',
    description: 'Discover how to successfully implement and sustain restorative approaches in your educational setting.',
    presenter: {
      name: 'Dr. James Wilson',
      role: 'Restorative Practise Consultant',
      image: '/avatars/james-wilson.jpg'
    },
    date: new Date(2025, 6, 5, 14, 0), // July 5, 2025, 2:00 PM
    duration: 120, // minutes
    capacity: 50,
    registered: 43,
    topics: ['Restorative Justice', 'Behaviour Management', 'School Culture'],
    level: 'Advanced'
  },
  {
    id: 'web-004',
    title: 'Promoting Student Voice and Agency',
    description: 'Learn strategies for amplifying student voice and developing genuine student agency in educational settings.',
    presenter: {
      name: 'Michelle Parker',
      role: 'Student Voice Specialist',
      image: '/avatars/michelle-parker.jpg'
    },
    date: new Date(2025, 6, 12, 15, 30), // July 12, 2025, 3:30 PM
    duration: 75, // minutes
    capacity: 80,
    registered: 35,
    topics: ['Student Voice', 'Student Leadership', 'School Democracy'],
    level: 'Beginner'
  }
];

const SAMPLE_PAST_WEBINARS = [
  {
    id: 'web-101',
    title: 'Understanding and Supporting Executive Function Skills',
    description: 'Explore the science of executive function and practical strategies to support students who struggle with these skills.',
    presenter: {
      name: 'Dr. Robert Chen',
      role: 'Cognitive Development Specialist',
      image: '/avatars/robert-chen.jpg'
    },
    date: new Date(2025, 4, 15, 16, 0), // May 15, 2025, 4:00 PM
    duration: 90, // minutes
    attendees: 86,
    rating: 4.8,
    recordingAvailable: true,
    topics: ['Executive Function', 'Cognitive Development', 'Learning Support'],
    level: 'Intermediate'
  },
  {
    id: 'web-102',
    title: 'Building Effective Home-School Partnerships',
    description: 'Learn strategies for creating strong, collaborative relationships between schools and families.',
    presenter: {
      name: 'Alicia Gomez',
      role: 'Family Engagement Specialist',
      image: '/avatars/alicia-gomez.jpg'
    },
    date: new Date(2025, 4, 8, 17, 0), // May 8, 2025, 5:00 PM
    duration: 60, // minutes
    attendees: 72,
    rating: 4.6,
    recordingAvailable: true,
    topics: ['Parent Engagement', 'Communication', 'Community Building'],
    level: 'All Levels'
  },
  {
    id: 'web-103',
    title: 'Addressing Maths Anxiety in the Classroom',
    description: 'Understand the causes of maths anxiety and learn practical approaches to help students overcome it.',
    presenter: {
      name: 'Dr. Thomas Wright',
      role: 'Mathematics Education Specialist',
      image: '/avatars/thomas-wright.jpg'
    },
    date: new Date(2025, 3, 22, 15, 30), // April 22, 2025, 3:30 PM
    duration: 75, // minutes
    attendees: 65,
    rating: 4.7,
    recordingAvailable: true,
    topics: ['Mathematics', 'Anxiety', 'Teaching Strategies'],
    level: 'Beginner'
  }
];

const SAMPLE_MY_WEBINARS = [
  {
    id: 'web-001',
    title: 'Trauma-Informed Approaches in the Classroom',
    date: new Date(2025, 5, 25, 15, 0), // June 25, 2025, 3:00 PM
    status: 'upcoming',
    presenter: 'Dr. Emma Thompson',
    addedToCalendar: true
  },
  {
    id: 'web-003',
    title: 'Effective Implementation of Restorative Justice Practices',
    date: new Date(2025, 6, 5, 14, 0), // July 5, 2025, 2:00 PM
    status: 'upcoming',
    presenter: 'Dr. James Wilson',
    addedToCalendar: false
  },
  {
    id: 'web-101',
    title: 'Understanding and Supporting Executive Function Skills',
    date: new Date(2025, 4, 15, 16, 0), // May 15, 2025, 4:00 PM
    status: 'attended',
    presenter: 'Dr. Robert Chen',
    certificateAvailable: true
  },
  {
    id: 'web-102',
    title: 'Building Effective Home-School Partnerships',
    date: new Date(2025, 4, 8, 17, 0), // May 8, 2025, 5:00 PM
    status: 'attended',
    presenter: 'Alicia Gomez',
    certificateAvailable: true
  }
];

export default function WebinarIntegration() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  
  // Function to handle webinar registration
  const handleRegister = (webinarId: string, webinarTitle: string) => {
    // In a real implementation, this would call an API to register the user
    toast({
      title: "Registration Successful",
      description: `You have been registered for "${webinarTitle}". A confirmation email has been sent to your inbox.`,
      duration: 5000,
    });
  };
  
  // Function to handle adding webinar to calendar
  const handleAddToCalendar = (webinarId: string, webinarTitle: string) => {
    // In a real implementation, this would integrate with the calendar system
    toast({
      title: "Added to Calendar",
      description: `"${webinarTitle}" has been added to your calendar.`,
      duration: 3000,
    });
  };
  
  // Function to handle downloading certificate
  const handleDownloadCertificate = (webinarId: string, webinarTitle: string) => {
    // In a real implementation, this would generate and download a certificate
    toast({
      title: "Certificate Downloaded",
      description: `Your certificate for "${webinarTitle}" has been downloaded.`,
      duration: 3000,
    });
  };
  
  // Function to handle watching recording
  const handleWatchRecording = (webinarId: string, webinarTitle: string) => {
    // In a real implementation, this would open the recording player
    toast({
      title: "Opening Recording",
      description: `Loading recording for "${webinarTitle}"...`,
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6 gap-4">
        <h1 className="text-3xl font-bold">Professional Development Webinars</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-centre gap-2">
              <Plus className="h-4 w-4" />
              Host a Webinar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Host a New Webinar</DialogTitle>
              <DialogDescription>
                Create a new professional development webinar for the educational community.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <FormLabel htmlFor="title">Webinar Title</FormLabel>
                <Input id="title" placeholder="Enter a descriptive title" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea id="description" placeholder="Provide a detailed description of the webinar content and learning objectives" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <FormLabel htmlFor="date">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <FormLabel htmlFor="time">Time</FormLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="75">75 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <FormLabel htmlFor="capacity">Capacity</FormLabel>
                  <Input id="capacity" type="number" placeholder="Maximum participants" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormLabel htmlFor="topics">Topics (comma separated)</FormLabel>
                <Input id="topics" placeholder="e.g., SEND, Behaviour Management, Assessment" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <FormLabel htmlFor="level">Experience Level</FormLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => {
                toast({
                  title: "Webinar Created",
                  description: "Your webinar has been scheduled successfully.",
                  duration: 5000,
                });
              }}>Schedule Webinar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search webinars..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Topics</SelectItem>
              <SelectItem value="trauma">Trauma-Informed Practise</SelectItem>
              <SelectItem value="autism">Autism</SelectItem>
              <SelectItem value="restorative">Restorative Justice</SelectItem>
              <SelectItem value="voice">Student Voice</SelectItem>
              <SelectItem value="executive">Executive Function</SelectItem>
              <SelectItem value="parent">Parent Engagement</SelectItem>
              <SelectItem value="maths">Mathematics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Webinars</TabsTrigger>
          <TabsTrigger value="past">Past Webinars</TabsTrigger>
          <TabsTrigger value="my">My Webinars</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Webinars Tab */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_UPCOMING_WEBINARS.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{webinar.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {format(webinar.date, "EEEE, MMMM d, yyyy")} • {format(webinar.date, "h:mm a")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {webinar.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-centre mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={webinar.presenter.image} alt={webinar.presenter.name} />
                      <AvatarFallback>{webinar.presenter.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{webinar.presenter.name}</p>
                      <p className="text-sm text-muted-foreground">{webinar.presenter.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{webinar.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {webinar.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-centre justify-between text-sm text-muted-foreground">
                    <div className="flex items-centre">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{webinar.duration} minutes</span>
                    </div>
                    <div className="flex items-centre">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{webinar.registered}/{webinar.capacity} registered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleAddToCalendar(webinar.id, webinar.title)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button 
                    onClick={() => handleRegister(webinar.id, webinar.title)}
                    disabled={webinar.registered >= webinar.capacity}
                  >
                    {webinar.registered >= webinar.capacity ? "Fully Booked" : "Register"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Past Webinars Tab */}
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_PAST_WEBINARS.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{webinar.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {format(webinar.date, "EEEE, MMMM d, yyyy")} • {format(webinar.date, "h:mm a")}
                      </CardDescription>
                    </div>
                    <div className="flex items-centre">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(webinar.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} 
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium">{webinar.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-centre mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={webinar.presenter.image} alt={webinar.presenter.name} />
                      <AvatarFallback>{webinar.presenter.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{webinar.presenter.name}</p>
                      <p className="text-sm text-muted-foreground">{webinar.presenter.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{webinar.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {webinar.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-centre justify-between text-sm text-muted-foreground">
                    <div className="flex items-centre">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{webinar.duration} minutes</span>
                    </div>
                    <div className="flex items-centre">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{webinar.attendees} attendees</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadCertificate(webinar.id, webinar.title)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Certificate
                  </Button>
                  {webinar.recordingAvailable && (
                    <Button 
                      onClick={() => handleWatchRecording(webinar.id, webinar.title)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Watch Recording
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* My Webinars Tab */}
        <TabsContent value="my">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Webinars</CardTitle>
                <CardDescription>Webinars you have registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {SAMPLE_MY_WEBINARS.filter(w => w.status === 'upcoming').map((webinar, index) => (
                    <div key={webinar.id} className="mb-4">
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{webinar.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(webinar.date, "EEEE, MMMM d, yyyy")} • {format(webinar.date, "h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground">Presenter: {webinar.presenter}</p>
                        </div>
                        <div className="flex gap-2">
                          {!webinar.addedToCalendar && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddToCalendar(webinar.id, webinar.title)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Joining Information",
                                description: "Joining information has been sent to your email.",
                                duration: 3000,
                              });
                            }}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Info
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attended Webinars</CardTitle>
                <CardDescription>Webinars you have attended</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {SAMPLE_MY_WEBINARS.filter(w => w.status === 'attended').map((webinar, index) => (
                    <div key={webinar.id} className="mb-4">
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{webinar.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(webinar.date, "EEEE, MMMM d, yyyy")} • {format(webinar.date, "h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground">Presenter: {webinar.presenter}</p>
                        </div>
                        <div className="flex gap-2">
                          {webinar.certificateAvailable && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadCertificate(webinar.id, webinar.title)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Certificate
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleWatchRecording(webinar.id, webinar.title)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Recording
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
