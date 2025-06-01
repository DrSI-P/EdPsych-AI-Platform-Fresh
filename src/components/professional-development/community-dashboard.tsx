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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  School, 
  FileText, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Award, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Activity, 
  Target, 
  UserCheck, 
  Share2, 
  Download, 
  Printer, 
  Mail, 
  Clock, 
  Globe, 
  Map, 
  Zap, 
  BookOpen, 
  Lightbulb, 
  ThumbsUp, 
  Heart, 
  Star, 
  Flag,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";

// Mock data for community analytics
const MOCK_COMMUNITY_GROWTH = [
  { month: 'Jan', members: 45, schools: 12 },
  { month: 'Feb', members: 58, schools: 15 },
  { month: 'Mar', members: 72, schools: 18 },
  { month: 'Apr', members: 89, schools: 22 },
  { month: 'May', members: 102, schools: 27 },
  { month: 'Jun', members: 128, schools: 32 },
];

const MOCK_ACTIVITY_TRENDS = [
  { month: 'Jan', discussions: 24, resources: 12, events: 3, collaborations: 1 },
  { month: 'Feb', discussions: 32, resources: 18, events: 4, collaborations: 2 },
  { month: 'Mar', discussions: 45, resources: 22, events: 5, collaborations: 3 },
  { month: 'Apr', discussions: 38, resources: 28, events: 6, collaborations: 3 },
  { month: 'May', discussions: 52, resources: 35, events: 7, collaborations: 4 },
  { month: 'Jun', discussions: 68, resources: 42, events: 8, collaborations: 5 },
];

const MOCK_ENGAGEMENT_METRICS = [
  { name: 'Active Members', value: 86, total: 128, color: '#4f46e5' },
  { name: 'Resource Downloads', value: 342, total: 500, color: '#10b981' },
  { name: 'Discussion Participation', value: 156, total: 200, color: '#f59e0b' },
  { name: 'Event Attendance', value: 48, total: 60, color: '#8b5cf6' },
];

const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Literacy', value: 28 },
  { name: 'Mathematics', value: 22 },
  { name: 'SEND', value: 18 },
  { name: 'Behaviour', value: 15 },
  { name: 'Assessment', value: 12 },
  { name: 'EdTech', value: 10 },
  { name: 'Other', value: 5 },
];

const MOCK_SCHOOL_PARTICIPATION = [
  { name: 'Oakwood Primary', discussions: 18, resources: 12, events: 5, collaborations: 3 },
  { name: 'St. Mary\'s Primary', discussions: 15, resources: 8, events: 4, collaborations: 2 },
  { name: 'Riverside Academy', discussions: 22, resources: 15, events: 6, collaborations: 4 },
  { name: 'Meadowview School', discussions: 12, resources: 10, events: 3, collaborations: 1 },
  { name: 'Highfield Primary', discussions: 8, resources: 5, events: 2, collaborations: 1 },
];

const MOCK_IMPACT_METRICS = [
  { name: 'Knowledge Transfer', before: 3.2, after: 4.5 },
  { name: 'Resource Quality', before: 3.5, after: 4.7 },
  { name: 'Collaboration Skills', before: 2.8, after: 4.2 },
  { name: 'Innovation', before: 3.0, after: 4.3 },
  { name: 'Professional Confidence', before: 3.3, after: 4.6 },
];

const MOCK_EXPERTISE_DISTRIBUTION = [
  { subject: 'Literacy', value: 85 },
  { subject: 'Mathematics', value: 70 },
  { subject: 'SEND', value: 65 },
  { subject: 'Behaviour', value: 60 },
  { subject: 'Assessment', value: 55 },
  { subject: 'EdTech', value: 50 },
  { subject: 'Curriculum Design', value: 45 },
  { subject: 'Leadership', value: 40 },
];

const MOCK_TOP_CONTRIBUTORS = [
  { name: 'Sarah Johnson', school: 'Oakwood Primary', contributions: 42, expertise: ['Literacy', 'EYFS'] },
  { name: 'David Wilson', school: 'St. Mary\'s Primary', contributions: 38, expertise: ['Assessment', 'Mathematics'] },
  { name: 'Emma Thompson', school: 'Meadowview School', contributions: 35, expertise: ['SEND', 'Inclusion'] },
  { name: 'Michael Chen', school: 'Riverside Academy', contributions: 32, expertise: ['EdTech', 'Science'] },
  { name: 'Priya Patel', school: 'Highfield Primary', contributions: 28, expertise: ['EAL', 'Literacy'] },
];

const MOCK_RESOURCE_IMPACT = [
  { name: 'Teaching Strategies', downloads: 156, ratings: 4.8, implementations: 78 },
  { name: 'Assessment Tools', downloads: 124, ratings: 4.6, implementations: 62 },
  { name: 'Classroom Resources', downloads: 98, ratings: 4.5, implementations: 49 },
  { name: 'Professional Guides', downloads: 86, ratings: 4.7, implementations: 43 },
  { name: 'Research Summaries', downloads: 72, ratings: 4.4, implementations: 36 },
];

const MOCK_COLLABORATION_OUTCOMES = [
  { name: 'Resource Development', completed: 8, ongoing: 3, planned: 2 },
  { name: 'Research Projects', completed: 5, ongoing: 4, planned: 3 },
  { name: 'Curriculum Design', completed: 6, ongoing: 2, planned: 1 },
  { name: 'Assessment Frameworks', completed: 4, ongoing: 3, planned: 2 },
  { name: 'Professional Development', completed: 7, ongoing: 2, planned: 3 },
];

const MOCK_COMMUNITY_HEALTH = [
  { month: 'Jan', newMembers: 12, activeMembers: 32, inactiveMembers: 5 },
  { month: 'Feb', newMembers: 15, activeMembers: 38, inactiveMembers: 8 },
  { month: 'Mar', newMembers: 18, activeMembers: 45, inactiveMembers: 10 },
  { month: 'Apr', newMembers: 14, activeMembers: 52, inactiveMembers: 12 },
  { month: 'May', newMembers: 22, activeMembers: 65, inactiveMembers: 15 },
  { month: 'Jun', newMembers: 28, activeMembers: 78, inactiveMembers: 18 },
];

// Colors for charts
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

export default function CommunityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  
  // Format percentage for engagement metrics
  const formatPercentage = (value, total) => {
    return `${Math.round((value / total) * 100)}%`;
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics and insights for learning communities
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select community" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Communities</SelectItem>
              <SelectItem value="literacy">Early Years Literacy</SelectItem>
              <SelectItem value="mathematics">Secondary Mathematics</SelectItem>
              <SelectItem value="send">SEND Coordination</SelectItem>
              <SelectItem value="leadership">School Leadership</SelectItem>
              <SelectItem value="behaviour">Behaviour Management</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-centre">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          
          <Button variant="outline">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold">128</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Participating Schools</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <School className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Communities</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shared Resources</p>
                <p className="text-3xl font-bold">536</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+42</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="health">Community Health</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <TrendingUp className="mr-2 h-5 w-5" /> Community Growth
                </CardTitle>
                <CardDescription>
                  Member and school growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MOCK_COMMUNITY_GROWTH}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="members"
                        stroke="#4f46e5"
                        activeDot={{ r: 8 }}
                        name="Members"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="schools"
                        stroke="#10b981"
                        name="Schools"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Activity className="mr-2 h-5 w-5" /> Activity Trends
                </CardTitle>
                <CardDescription>
                  Community activity by type over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={MOCK_ACTIVITY_TRENDS}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="discussions"
                        stackId="1"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        name="Discussions"
                      />
                      <Area
                        type="monotone"
                        dataKey="resources"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        name="Resources"
                      />
                      <Area
                        type="monotone"
                        dataKey="events"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        name="Events"
                      />
                      <Area
                        type="monotone"
                        dataKey="collaborations"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        name="Collaborations"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <PieChartIcon className="mr-2 h-5 w-5" /> Category Distribution
                </CardTitle>
                <CardDescription>
                  Content distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_CATEGORY_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Award className="mr-2 h-5 w-5" /> Top Contributors
                </CardTitle>
                <CardDescription>
                  Most active community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_TOP_CONTRIBUTORS.slice(0, 5).map((contributor, index) => (
                    <div key={index} className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-3">
                        <div className="flex-shrink-0">
                          <Avatar>
                            <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="font-medium">{contributor.name}</p>
                          <p className="text-sm text-muted-foreground">{contributor.school}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{contributor.contributions}</p>
                        <p className="text-sm text-muted-foreground">contributions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Target className="mr-2 h-5 w-5" /> Expertise Distribution
                </CardTitle>
                <CardDescription>
                  Community expertise by subject area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_EXPERTISE_DISTRIBUTION}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Expertise Level"
                        dataKey="value"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BarChart2 className="mr-2 h-5 w-5" /> Engagement Metrics
                </CardTitle>
                <CardDescription>
                  Key engagement indicators and targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_ENGAGEMENT_METRICS.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {metric.value} / {metric.total} ({formatPercentage(metric.value, metric.total)})
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ width: `${(metric.value / metric.total) * 100}%`, backgroundColor: metric.colour }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <MessageSquare className="mr-2 h-5 w-5" /> Discussion Activity
                </CardTitle>
                <CardDescription>
                  Participation in community discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_ACTIVITY_TRENDS}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="discussions" name="New Discussions" fill="#4f46e5" />
                      <Bar dataKey="resources" name="New Resources" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Clock className="mr-2 h-5 w-5" /> Time of Day Activity
                </CardTitle>
                <CardDescription>
                  When members are most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { time: '6am', activity: 5 },
                        { time: '8am', activity: 25 },
                        { time: '10am', activity: 45 },
                        { time: '12pm', activity: 35 },
                        { time: '2pm', activity: 40 },
                        { time: '4pm', activity: 65 },
                        { time: '6pm', activity: 85 },
                        { time: '8pm', activity: 45 },
                        { time: '10pm', activity: 15 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="activity" stroke="#4f46e5" fill="#4f46e5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Calendar className="mr-2 h-5 w-5" /> Event Participation
                </CardTitle>
                <CardDescription>
                  Attendance at community events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="font-medium">Phonics Teaching Masterclass</p>
                      <p className="text-sm text-muted-foreground">15 June 2025</p>
                    </div>
                    <Badge className="bg-green-500">42/50</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="font-medium">Early Reading Research Discussion</p>
                      <p className="text-sm text-muted-foreground">22 June 2025</p>
                    </div>
                    <Badge className="bg-amber-500">28/40</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="font-medium">Phonics Resources Showcase</p>
                      <p className="text-sm text-muted-foreground">5 July 2025</p>
                    </div>
                    <Badge className="bg-blue-500">35/60</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="font-medium">EAL Support Strategies Workshop</p>
                      <p className="text-sm text-muted-foreground">18 July 2025</p>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Share2 className="mr-2 h-5 w-5" /> Resource Sharing
                </CardTitle>
                <CardDescription>
                  Most shared and downloaded resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_RESOURCE_IMPACT.slice(0, 4).map((resource, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium">{resource.name}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-centre">
                          <Download className="h-3 w-3 mr-1" /> {resource.downloads}
                        </span>
                        <span className="flex items-centre">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" /> {resource.ratings}
                        </span>
                        <span className="flex items-centre">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> {resource.implementations}
                        </span>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <TrendingUp className="mr-2 h-5 w-5" /> Before/After Impact
                </CardTitle>
                <CardDescription>
                  Measured improvement in key areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_IMPACT_METRICS}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="before" name="Before" fill="#94a3b8" />
                      <Bar dataKey="after" name="After" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Target className="mr-2 h-5 w-5" /> Collaboration Outcomes
                </CardTitle>
                <CardDescription>
                  Results from cross-school collaborations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_COLLABORATION_OUTCOMES}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
                      <Bar dataKey="ongoing" name="Ongoing" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="planned" name="Planned" stackId="a" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <BookOpen className="mr-2 h-5 w-5" /> Knowledge Transfer
                </CardTitle>
                <CardDescription>
                  Effectiveness of knowledge sharing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-centre">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 flex items-centre justify-centre">
                        <p className="text-4xl font-bold">86%</p>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ name: 'Value', value: 86 }, { name: 'Remaining', value: 14 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell fill="#4f46e5" />
                            <Cell fill="#e2e8f0" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-centre">
                    <p className="text-sm text-muted-foreground">
                      86% of members report applying knowledge gained from communities in their practise
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resource Implementation</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discussion Insights</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Event Learnings</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Lightbulb className="mr-2 h-5 w-5" /> Innovation Impact
                </CardTitle>
                <CardDescription>
                  New approaches developed through collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phonics Assessment Framework</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Collaborative development by 3 schools, now adopted by 18 schools across the platform
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">EAL Phonics Support Strategies</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Research project findings implemented in 12 schools with significant improvement in outcomes
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Restorative Practise Toolkit</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed through community collaboration, now featured in DfE best practise guidance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <ThumbsUp className="mr-2 h-5 w-5" /> Satisfaction Metrics
                </CardTitle>
                <CardDescription>
                  Member satisfaction with community value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div className="flex items-centre">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      <span>Overall Satisfaction</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-grey-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between items-centre">
                      <span className="text-sm">Resource Quality</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-grey-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm">Discussion Value</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-grey-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm">Collaboration Quality</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-grey-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm">Event Usefulness</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-grey-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-centre">
                    <p className="text-sm font-medium">Net Promoter Score</p>
                    <p className="text-3xl font-bold text-green-500 mt-1">+68</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Schools Tab */}
        <TabsContent value="schools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <School className="mr-2 h-5 w-5" /> School Participation
                </CardTitle>
                <CardDescription>
                  Activity breakdown by school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MOCK_SCHOOL_PARTICIPATION}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="discussions" name="Discussions" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="resources" name="Resources" stackId="a" fill="#10b981" />
                      <Bar dataKey="events" name="Events" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="collaborations" name="Collaborations" stackId="a" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Map className="mr-2 h-5 w-5" /> Geographical Distribution
                </CardTitle>
                <CardDescription>
                  School participation by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'London', value: 12 },
                          { name: 'South East', value: 8 },
                          { name: 'South West', value: 5 },
                          { name: 'Midlands', value: 7 },
                          { name: 'North West', value: 6 },
                          { name: 'North East', value: 4 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <UserCheck className="mr-2 h-5 w-5" /> School Engagement Leaderboard
              </CardTitle>
              <CardDescription>
                Most active schools across all communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Rank</th>
                      <th scope="col" className="px-6 py-3">School</th>
                      <th scope="col" className="px-6 py-3">Members</th>
                      <th scope="col" className="px-6 py-3">Communities</th>
                      <th scope="col" className="px-6 py-3">Discussions</th>
                      <th scope="col" className="px-6 py-3">Resources</th>
                      <th scope="col" className="px-6 py-3">Events</th>
                      <th scope="col" className="px-6 py-3">Collaborations</th>
                      <th scope="col" className="px-6 py-3">Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">1</td>
                      <td className="px-6 py-4">Riverside Academy</td>
                      <td className="px-6 py-4">12</td>
                      <td className="px-6 py-4">6</td>
                      <td className="px-6 py-4">22</td>
                      <td className="px-6 py-4">15</td>
                      <td className="px-6 py-4">6</td>
                      <td className="px-6 py-4">4</td>
                      <td className="px-6 py-4 font-medium">142</td>
                    </tr>
                    <tr className="bg-muted/50 border-b">
                      <td className="px-6 py-4 font-medium">2</td>
                      <td className="px-6 py-4">Oakwood Primary</td>
                      <td className="px-6 py-4">10</td>
                      <td className="px-6 py-4">5</td>
                      <td className="px-6 py-4">18</td>
                      <td className="px-6 py-4">12</td>
                      <td className="px-6 py-4">5</td>
                      <td className="px-6 py-4">3</td>
                      <td className="px-6 py-4 font-medium">128</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">3</td>
                      <td className="px-6 py-4">St. Mary's Primary</td>
                      <td className="px-6 py-4">8</td>
                      <td className="px-6 py-4">4</td>
                      <td className="px-6 py-4">15</td>
                      <td className="px-6 py-4">8</td>
                      <td className="px-6 py-4">4</td>
                      <td className="px-6 py-4">2</td>
                      <td className="px-6 py-4 font-medium">98</td>
                    </tr>
                    <tr className="bg-muted/50 border-b">
                      <td className="px-6 py-4 font-medium">4</td>
                      <td className="px-6 py-4">Meadowview School</td>
                      <td className="px-6 py-4">7</td>
                      <td className="px-6 py-4">3</td>
                      <td className="px-6 py-4">12</td>
                      <td className="px-6 py-4">10</td>
                      <td className="px-6 py-4">3</td>
                      <td className="px-6 py-4">1</td>
                      <td className="px-6 py-4 font-medium">85</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">5</td>
                      <td className="px-6 py-4">Highfield Primary</td>
                      <td className="px-6 py-4">6</td>
                      <td className="px-6 py-4">3</td>
                      <td className="px-6 py-4">8</td>
                      <td className="px-6 py-4">5</td>
                      <td className="px-6 py-4">2</td>
                      <td className="px-6 py-4">1</td>
                      <td className="px-6 py-4 font-medium">62</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Globe className="mr-2 h-5 w-5" /> Cross-School Connections
                </CardTitle>
                <CardDescription>
                  Collaboration network strength
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-centre">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 flex items-centre justify-centre">
                        <p className="text-4xl font-bold">78%</p>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ name: 'Value', value: 78 }, { name: 'Remaining', value: 22 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell fill="#4f46e5" />
                            <Cell fill="#e2e8f0" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-centre">
                    <p className="text-sm text-muted-foreground">
                      78% of schools have active collaborations with at least 3 other schools
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Joint Projects</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Resource Co-Creation</span>
                      <span className="font-medium">36</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cross-School Mentoring</span>
                      <span className="font-medium">18</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Flag className="mr-2 h-5 w-5" /> School Type Distribution
                </CardTitle>
                <CardDescription>
                  Participation by school type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Primary', value: 24 },
                          { name: 'Secondary', value: 12 },
                          { name: 'Special', value: 6 },
                          { name: 'All-through', value: 4 },
                          { name: 'Alternative Provision', value: 2 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Engagement Gaps
                </CardTitle>
                <CardDescription>
                  Schools with low participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Westside Academy</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Member of 2 communities but no activity in last 30 days
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Northgate School</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Joined platform but not participating in any communities
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Southview Primary</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Low resource sharing and no collaboration participation
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Engagement Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Community Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Activity className="mr-2 h-5 w-5" /> Community Health Trends
                </CardTitle>
                <CardDescription>
                  Member activity and engagement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={MOCK_COMMUNITY_HEALTH}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="newMembers"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        name="New Members"
                      />
                      <Area
                        type="monotone"
                        dataKey="activeMembers"
                        stackId="2"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        name="Active Members"
                      />
                      <Area
                        type="monotone"
                        dataKey="inactiveMembers"
                        stackId="3"
                        stroke="#f43f5e"
                        fill="#f43f5e"
                        name="Inactive Members"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <MessageSquare className="mr-2 h-5 w-5" /> Discussion Health
                </CardTitle>
                <CardDescription>
                  Quality and engagement in community discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: 'Response Rate', A: 85, B: 65, fullMark: 100 },
                      { subject: 'Depth', A: 78, B: 60, fullMark: 100 },
                      { subject: 'Civility', A: 95, B: 90, fullMark: 100 },
                      { subject: 'Evidence-Based', A: 82, B: 70, fullMark: 100 },
                      { subject: 'Inclusivity', A: 88, B: 75, fullMark: 100 },
                      { subject: 'Actionability', A: 75, B: 55, fullMark: 100 },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Current Period"
                        dataKey="A"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Previous Period"
                        dataKey="B"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <HelpCircle className="mr-2 h-5 w-5" /> Support Requests
                </CardTitle>
                <CardDescription>
                  Community support and moderation needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div className="flex items-centre">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Resolved</span>
                    </div>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-centre justify-between">
                    <div className="flex items-centre">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>In Progress</span>
                    </div>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-centre justify-between">
                    <div className="flex items-centre">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Pending</span>
                    </div>
                    <span className="font-medium">3</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Request Types</p>
                    <div className="flex justify-between text-sm">
                      <span>Technical Issues</span>
                      <span>42%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content Moderation</span>
                      <span>28%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Privacy Concerns</span>
                      <span>18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Feature Requests</span>
                      <span>12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <Info className="mr-2 h-5 w-5" /> Content Quality
                </CardTitle>
                <CardDescription>
                  Resource and discussion quality metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-centre">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 flex items-centre justify-centre">
                        <p className="text-4xl font-bold">92%</p>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{ name: 'Value', value: 92 }, { name: 'Remaining', value: 8 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#e2e8f0" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-centre">
                    <p className="text-sm text-muted-foreground">
                      92% of shared content meets quality standards
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Evidence-Based</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Practical Application</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accessibility</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>UK Curriculum Alignment</span>
                      <span className="font-medium">96%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre">
                  <CheckCircle className="mr-2 h-5 w-5" /> Privacy Compliance
                </CardTitle>
                <CardDescription>
                  Data protection and privacy metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Anonymization Rate</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          98% of shared content with sensitive information was properly anonymized
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Content Review</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          100% of flagged content was reviewed within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Privacy Training</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          82% of community facilitators completed advanced privacy training
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Privacy Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
