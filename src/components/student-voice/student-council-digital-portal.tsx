'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Users, UserPlus, Calendar, FileText, MessageSquare, 
  CheckCircle, AlertCircle, Clock, BarChart2, Vote,
  Clipboard, Settings, ChevronRight, PlusCircle, 
  Edit, Trash2, Eye, Download, Share2, Search,
  Flag, Award, Bell, Menu, Filter, ArrowUpRight
} from "lucide-react";

export default function StudentCouncilDigitalPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Sample council data
  const councilData = {
    name: "Oakwood Secondary School Student Council",
    academicYear: "2024-2025",
    members: [
      { id: 1, name: "Emma Johnson", role: "President", avatar: "/avatars/emma.jpg" },
      { id: 2, name: "Daniel Smith", role: "Vice President", avatar: "/avatars/daniel.jpg" },
      { id: 3, name: "Sophia Chen", role: "Secretary", avatar: "/avatars/sophia.jpg" },
      { id: 4, name: "Lucas Williams", role: "Treasurer", avatar: "/avatars/lucas.jpg" },
      { id: 5, name: "Olivia Brown", role: "Communications Officer", avatar: "/avatars/olivia.jpg" },
      { id: 6, name: "Ms. Rebecca Taylor", role: "Faculty Advisor", avatar: "/avatars/rebecca.jpg" }
    ],
    committees: [
      { id: 1, name: "Events Committee", members: 8, activeProjects: 3 },
      { id: 2, name: "Academic Affairs", members: 6, activeProjects: 2 },
      { id: 3, name: "Wellbeing Initiative", members: 7, activeProjects: 2 },
      { id: 4, name: "Sustainability Team", members: 5, activeProjects: 1 }
    ]
  };
  
  // Sample upcoming meetings
  const upcomingMeetings = [
    {
      id: 1,
      title: "Full Council Meeting",
      date: "May 20, 2025",
      time: "15:30 - 16:30",
      location: "Room 204",
      agenda: [
        "Budget approval for end-of-year event",
        "Committee progress reports",
        "New initiative proposals",
        "Election planning for next year"
      ]
    },
    {
      id: 2,
      title: "Events Committee",
      date: "May 18, 2025",
      time: "12:15 - 12:45",
      location: "Library Conference Room",
      agenda: [
        "End-of-year celebration planning",
        "Budget finalization",
        "Volunteer assignments"
      ]
    },
    {
      id: 3,
      title: "Executive Board Meeting",
      date: "May 22, 2025",
      time: "16:00 - 17:00",
      location: "Online (Teams)",
      agenda: [
        "Strategic planning for next year",
        "Transition planning for new officers",
        "Annual report preparation"
      ]
    }
  ];
  
  // Sample active initiatives
  const activeInitiatives = [
    {
      id: 1,
      title: "End-of-Year Celebration",
      committee: "Events Committee",
      status: "In Progress",
      progress: 65,
      dueDate: "June 15, 2025",
      description: "Planning and organising the end-of-year celebration event for all students."
    },
    {
      id: 2,
      title: "Study Support Programme",
      committee: "Academic Affairs",
      status: "In Progress",
      progress: 80,
      dueDate: "May 25, 2025",
      description: "Peer tutoring and study resources for final exams period."
    },
    {
      id: 3,
      title: "Mental Health Awareness Week",
      committee: "Wellbeing Initiative",
      status: "In Progress",
      progress: 40,
      dueDate: "June 5, 2025",
      description: "Series of events and resources focused on student mental health and wellbeing."
    },
    {
      id: 4,
      title: "School Garden Expansion",
      committee: "Sustainability Team",
      status: "Planning",
      progress: 25,
      dueDate: "June 20, 2025",
      description: "Expanding the school garden with new vegetable beds and seating area."
    }
  ];
  
  // Sample recent feedback
  const recentFeedback = [
    {
      id: 1,
      topic: "Cafeteria Menu Options",
      date: "May 15, 2025",
      status: "Under Review",
      votes: 47,
      comments: 12,
      summary: "Students requesting more vegetarian and vegan options in the cafeteria menu."
    },
    {
      id: 2,
      topic: "Extended Library Hours",
      date: "May 12, 2025",
      status: "In Progress",
      votes: 68,
      comments: 15,
      summary: "Request to extend library hours during exam periods for additional study space."
    },
    {
      id: 3,
      topic: "Outdoor Seating Areas",
      date: "May 10, 2025",
      status: "Approved",
      votes: 92,
      comments: 23,
      summary: "Proposal to add more outdoor seating areas for lunch and free periods."
    }
  ];
  
  // Sample announcements
  const announcements = [
    {
      id: 1,
      title: "Election Nominations Open",
      date: "May 16, 2025",
      author: "Emma Johnson",
      content: "Nominations for next year's Student Council positions are now open. Submit your nomination by May 25th."
    },
    {
      id: 2,
      title: "Feedback Survey Results",
      date: "May 14, 2025",
      author: "Olivia Brown",
      content: "Results from the recent student satisfaction survey are now available. Thank you to everyone who participated."
    },
    {
      id: 3,
      title: "Committee Applications",
      date: "May 12, 2025",
      author: "Daniel Smith",
      content: "Applications for committee membership for the next academic year are now open. Apply by June 1st."
    }
  ];
  
  // Get status badge colour
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-amber-100 text-amber-800";
      case "Planning":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <Users className="mr-2 h-5 w-5" />
            Student Council Digital Portal
          </CardTitle>
          <CardDescription>
            Empowering student leadership and amplifying student voice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-centre">
                <div>
                  <h2 className="text-2xl font-bold">{councilData.name}</h2>
                  <p className="text-muted-foreground">Academic Year: {councilData.academicYear}</p>
                </div>
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Council Settings
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <div className="flex items-centre">
                        <Users className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Council Members</span>
                      </div>
                      <Badge variant="outline">{councilData.members.length}</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <div className="flex items-centre">
                        <UserPlus className="mr-2 h-4 w-4 text-green-500" />
                        <span>Committees</span>
                      </div>
                      <Badge variant="outline">{councilData.committees.length}</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <div className="flex items-centre">
                        <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Upcoming Meetings</span>
                      </div>
                      <Badge variant="outline">{upcomingMeetings.length}</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <div className="flex items-centre">
                        <FileText className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Active Initiatives</span>
                      </div>
                      <Badge variant="outline">{activeInitiatives.length}</Badge>
                    </div>
                    <div className="flex justify-between items-centre">
                      <div className="flex items-centre">
                        <MessageSquare className="mr-2 h-4 w-4 text-red-500" />
                        <span>Recent Feedback Items</span>
                      </div>
                      <Badge variant="outline">{recentFeedback.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Next Meeting */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <Calendar className="mr-2 h-4 w-4" />
                      Next Meeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-base">{upcomingMeetings[0].title}</h3>
                      <div className="flex items-centre text-sm text-muted-foreground mt-1">
                        <Clock className="mr-1 h-4 w-4" />
                        {upcomingMeetings[0].date} • {upcomingMeetings[0].time}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Location: {upcomingMeetings[0].location}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Agenda</h4>
                      <ul className="space-y-1">
                        {upcomingMeetings[0].agenda.map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <CheckCircle className="mr-2 h-3 w-3 mt-1 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Agenda
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Announcements */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <Bell className="mr-2 h-4 w-4" />
                      Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="space-y-1">
                        <h3 className="font-medium text-base">{announcement.title}</h3>
                        <div className="flex items-centre text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {announcement.date} • by {announcement.author}
                        </div>
                        <p className="text-sm mt-1">{announcement.content}</p>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Announcements
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Initiatives */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <FileText className="mr-2 h-4 w-4" />
                      Active Initiatives
                    </CardTitle>
                    <CardDescription>
                      Current projects and initiatives in progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeInitiatives.slice(0, 3).map((initiative) => (
                      <div key={initiative.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{initiative.title}</h3>
                          <Badge className={getStatusBadgeColor(initiative.status)}>
                            {initiative.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {initiative.committee} • Due: {initiative.dueDate}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{initiative.progress}%</span>
                          </div>
                          <Progress value={initiative.progress} className="h-2" />
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Initiatives
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recent Feedback */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Recent Feedback
                    </CardTitle>
                    <CardDescription>
                      Latest feedback and suggestions from students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentFeedback.map((feedback) => (
                      <div key={feedback.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{feedback.topic}</h3>
                          <Badge className={getStatusBadgeColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{feedback.summary}</p>
                        <div className="flex items-centre text-sm text-muted-foreground">
                          <div className="flex items-centre mr-4">
                            <Vote className="mr-1 h-3 w-3" />
                            {feedback.votes} votes
                          </div>
                          <div className="flex items-centre">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {feedback.comments} comments
                          </div>
                          <div className="ml-auto text-sm">
                            {feedback.date}
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Feedback
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Council Members */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <Users className="mr-2 h-4 w-4" />
                      Council Members
                    </CardTitle>
                    <CardDescription>
                      Current student council representatives and officers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {councilData.members.map((member) => (
                        <div key={member.id} className="flex items-centre space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Committees */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Committees
                    </CardTitle>
                    <CardDescription>
                      Specialised working groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {councilData.committees.map((committee) => (
                      <div key={committee.id} className="flex justify-between items-centre">
                        <div>
                          <p className="font-medium">{committee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {committee.members} members • {committee.activeProjects} projects
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Committee
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-bold">Council Meetings</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-centre space-x-2">
                  <Input placeholder="Search meetings..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meetings</SelectItem>
                      <SelectItem value="full">Full Council</SelectItem>
                      <SelectItem value="executive">Executive Board</SelectItem>
                      <SelectItem value="committee">Committee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Meetings</CardTitle>
                    <CardDescription>
                      Scheduled council and committee meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingMeetings.map((meeting) => (
                        <Card key={meeting.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{meeting.title}</CardTitle>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="mr-2 h-3 w-3" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-3 w-3" />
                                  View
                                </Button>
                              </div>
                            </div>
                            <CardDescription>
                              {meeting.date} • {meeting.time} • {meeting.location}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h4 className="text-sm font-medium mb-2">Agenda</h4>
                            <ul className="space-y-1">
                              {meeting.agenda.map((item, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <CheckCircle className="mr-2 h-3 w-3 mt-1 text-green-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              6 members attending
                            </div>
                            <Button size="sm">
                              Prepare Minutes
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Past Meetings</CardTitle>
                    <CardDescription>
                      Previous council and committee meetings with minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Full Council Meeting</h3>
                          <p className="text-sm text-muted-foreground">May 6, 2025 • 15:30 - 16:30</p>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline">Minutes Available</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Minutes
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Executive Board Meeting</h3>
                          <p className="text-sm text-muted-foreground">April 22, 2025 • 16:00 - 17:00</p>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline">Minutes Available</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Minutes
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Events Committee</h3>
                          <p className="text-sm text-muted-foreground">April 18, 2025 • 12:15 - 12:45</p>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline">Minutes Available</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Minutes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Past Meetings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Initiatives Tab */}
            <TabsContent value="initiatives" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-bold">Council Initiatives</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Initiative
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-centre space-x-2">
                  <Input placeholder="Search initiatives..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-committees">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Committee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-committees">All Committees</SelectItem>
                      {councilData.committees.map((committee) => (
                        <SelectItem key={committee.id} value={committee.id.toString()}>
                          {committee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {activeInitiatives.map((initiative) => (
                    <Card key={initiative.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{initiative.title}</CardTitle>
                          <Badge className={getStatusBadgeColor(initiative.status)}>
                            {initiative.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {initiative.committee} • Due: {initiative.dueDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>{initiative.description}</p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{initiative.progress}%</span>
                          </div>
                          <Progress value={initiative.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Team Members</h4>
                            <div className="flex -space-x-2">
                              <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>EJ</AvatarFallback>
                              </Avatar>
                              <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>DS</AvatarFallback>
                              </Avatar>
                              <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>SC</AvatarFallback>
                              </Avatar>
                              <Avatar className="border-2 border-background h-8 w-8">
                                <AvatarFallback>+2</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Milestones</h4>
                            <div className="text-sm">
                              <div className="flex items-centre">
                                <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                Planning completed
                              </div>
                              <div className="flex items-centre">
                                <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                Resources allocated
                              </div>
                              <div className="flex items-centre">
                                <AlertCircle className="mr-2 h-3 w-3 text-amber-500" />
                                Implementation in progress
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Clipboard className="mr-2 h-4 w-4" />
                          View Tasks
                        </Button>
                        <Button size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Update Progress
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Initiatives</CardTitle>
                    <CardDescription>
                      Successfully completed council projects and initiatives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Spring Charity Fundraiser</h3>
                          <p className="text-sm text-muted-foreground">Events Committee • Completed April 15, 2025</p>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3 w-3" />
                            View Report
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Curriculum Feedback Collection</h3>
                          <p className="text-sm text-muted-foreground">Academic Affairs • Completed March 30, 2025</p>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3 w-3" />
                            View Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Completed Initiatives
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-bold">Student Feedback</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Feedback Items</CardTitle>
                      <CardDescription>
                        Current feedback and suggestions from students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {recentFeedback.map((feedback) => (
                        <Card key={feedback.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{feedback.topic}</CardTitle>
                              <Badge className={getStatusBadgeColor(feedback.status)}>
                                {feedback.status}
                              </Badge>
                            </div>
                            <CardDescription>
                              Submitted on {feedback.date}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p>{feedback.summary}</p>
                            
                            <div className="flex items-centre space-x-4">
                              <div className="flex items-centre">
                                <Vote className="mr-1 h-4 w-4 text-blue-500" />
                                <span className="font-medium">{feedback.votes}</span>
                                <span className="text-muted-foreground ml-1">votes</span>
                              </div>
                              <div className="flex items-centre">
                                <MessageSquare className="mr-1 h-4 w-4 text-green-500" />
                                <span className="font-medium">{feedback.comments}</span>
                                <span className="text-muted-foreground ml-1">comments</span>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-auto">
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                Vote
                              </Button>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Add Comment
                            </Button>
                            <Button size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Feedback
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Feedback</CardTitle>
                      <CardDescription>
                        Share your ideas and suggestions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="feedback-topic">Topic</Label>
                        <Input id="feedback-topic" placeholder="Enter a clear topic title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="facilities">Facilities</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="wellbeing">Wellbeing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-description">Description</Label>
                        <Textarea 
                          id="feedback-description" 
                          placeholder="Describe your feedback or suggestion in detail"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-centre space-x-2">
                        <input type="checkbox" id="anonymous" className="rounded" />
                        <Label htmlFor="anonymous">Submit anonymously</Label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Submit Feedback
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Feedback Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <Flag className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Total Feedback</span>
                        </div>
                        <Badge variant="outline">42</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>Implemented</span>
                        </div>
                        <Badge variant="outline">15</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <Clock className="mr-2 h-4 w-4 text-amber-500" />
                          <span>In Progress</span>
                        </div>
                        <Badge variant="outline">18</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Under Review</span>
                        </div>
                        <Badge variant="outline">9</Badge>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">Top Categories</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span>Facilities</span>
                            <span>35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Academic</span>
                            <span>28%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Events</span>
                            <span>22%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wellbeing</span>
                            <span>15%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-bold">Council Resources</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Document Library</CardTitle>
                      <CardDescription>
                        Council documents, templates, and resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Council Governance</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Student Council Constitution</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Council Bylaws</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Officer Role Descriptions</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Meeting Templates</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-green-500" />
                              <span>Meeting Agenda Template</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-green-500" />
                              <span>Meeting Minutes Template</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-green-500" />
                              <span>Action Item Tracker</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Initiative Planning</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-purple-500" />
                              <span>Project Proposal Template</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-purple-500" />
                              <span>Budget Request Form</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-centre p-3 border rounded-lg">
                            <div className="flex items-centre">
                              <FileText className="mr-2 h-4 w-4 text-purple-500" />
                              <span>Event Planning Checklist</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Training Resources</CardTitle>
                      <CardDescription>
                        Leadership development materials
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre p-3 border rounded-lg">
                        <div className="flex items-centre">
                          <Award className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Leadership Skills Workshop</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-centre p-3 border rounded-lg">
                        <div className="flex items-centre">
                          <Award className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Public Speaking Guide</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-centre p-3 border rounded-lg">
                        <div className="flex items-centre">
                          <Award className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Conflict Resolution Training</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-centre p-3 border rounded-lg">
                        <div className="flex items-centre">
                          <Award className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Team Building Activities</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Training Resources
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        School Calendar
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        School Directory
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        School Policies
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Communication Tools
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Share2 className="mr-2 h-4 w-4" />
                        Social Media Guidelines
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
