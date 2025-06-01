'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  FileText, 
  Filter, 
  Search,
  RefreshCw,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "@/components/ui/use-toast";

// Mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const teachingEffectivenessData = [
  { subject: 'Mathematics', effectiveness: 85, engagement: 80, progress: 82 },
  { subject: 'English', effectiveness: 78, engagement: 82, progress: 80 },
  { subject: 'Science', effectiveness: 82, engagement: 85, progress: 78 },
  { subject: 'History', effectiveness: 75, engagement: 78, progress: 76 },
  { subject: 'Geography', effectiveness: 80, engagement: 75, progress: 78 },
  { subject: 'Art', effectiveness: 88, engagement: 90, progress: 85 },
];

const timeAllocationData = [
  { name: 'Direct Teaching', value: 40 },
  { name: 'Assessment & Feedback', value: 20 },
  { name: 'Planning & Preparation', value: 15 },
  { name: 'Administrative Tasks', value: 10 },
  { name: 'Parent Communication', value: 8 },
  { name: 'Professional Development', value: 7 },
];

const studentProgressTrendData = [
  { month: 'Sep', avgProgress: 65 },
  { month: 'Oct', avgProgress: 68 },
  { month: 'Nov', avgProgress: 72 },
  { month: 'Dec', avgProgress: 70 },
  { month: 'Jan', avgProgress: 73 },
  { month: 'Feb', avgProgress: 75 },
  { month: 'Mar', avgProgress: 78 },
  { month: 'Apr', avgProgress: 80 },
  { month: 'May', avgProgress: 82 },
];

const teachingStrategiesData = [
  { subject: 'Direct Instruction', A: 80, fullMark: 100 },
  { subject: 'Inquiry-Based', A: 65, fullMark: 100 },
  { subject: 'Collaborative', A: 85, fullMark: 100 },
  { subject: 'Differentiated', A: 90, fullMark: 100 },
  { subject: 'Technology-Enhanced', A: 75, fullMark: 100 },
  { subject: 'Assessment for Learning', A: 85, fullMark: 100 },
];

const mockEducators = [
  { id: 'johnson', name: 'Ms. Johnson', role: 'Year 4 Teacher', effectiveness: 85, trend: 'up' },
  { id: 'smith', name: 'Mr. Smith', role: 'Year 5 Teacher', effectiveness: 78, trend: 'stable' },
  { id: 'davis', name: 'Mrs. Davis', role: 'Year 3 Teacher', effectiveness: 82, trend: 'up' },
  { id: 'wilson', name: 'Mr. Wilson', role: 'Year 6 Teacher', effectiveness: 75, trend: 'down' },
  { id: 'thompson', name: 'Ms. Thompson', role: 'SENCO', effectiveness: 88, trend: 'up' },
];

const resourceEffectivenessData = [
  { resource: 'Interactive Whiteboard', effectiveness: 85, usage: 90 },
  { resource: 'Digital Worksheets', effectiveness: 75, usage: 85 },
  { resource: 'Educational Videos', effectiveness: 80, usage: 70 },
  { resource: 'Physical Manipulatives', effectiveness: 85, usage: 65 },
  { resource: 'Assessment Tools', effectiveness: 90, usage: 80 },
];

const professionalDevelopmentData = [
  { date: '2025-01-10', hours: 3, topic: 'Differentiated Instruction' },
  { date: '2025-02-15', hours: 4, topic: 'Technology Integration' },
  { date: '2025-03-05', hours: 2, topic: 'Assessment Strategies' },
  { date: '2025-04-12', hours: 5, topic: 'Behaviour Management' },
  { date: '2025-05-08', hours: 3, topic: 'SEND Support' },
];

const EducatorAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEducator, setSelectedEducator] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState({ from: new Date(2024, 8, 1), to: new Date() });
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Educator analytics data has been updated to the latest available information.",
      });
    }, 1200);
  };

  const handleExport = (format) => {
    toast({
      title: `Exporting Analytics as ${format.toUpperCase()}`,
      description: "Your export is being prepared and will download shortly.",
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-centre space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );

  const renderEducatorList = () => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {mockEducators.map((educator) => (
          <div 
            key={educator.id}
            className={`p-3 rounded-md cursor-pointer flex justify-between items-centre ${
              selectedEducator === educator.id ? 'bg-muted' : 'hover:bg-muted/50'
            }`}
            onClick={() => setSelectedEducator(educator.id)}
          >
            <div className="flex items-centre space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-centre justify-centre">
                {educator.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{educator.name}</p>
                <p className="text-sm text-muted-foreground">{educator.role}</p>
              </div>
            </div>
            <div className="flex items-centre space-x-3">
              <div className="text-right">
                <p className="font-medium">{educator.effectiveness}%</p>
                <div className="flex items-centre text-sm">
                  {educator.trend === 'up' && (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  {educator.trend === 'down' && (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={
                    educator.trend === 'up' 
                      ? 'text-green-500' 
                      : educator.trend === 'down' 
                        ? 'text-red-500' 
                        : 'text-muted-foreground'
                  }>
                    {educator.trend === 'up' && '+4%'}
                    {educator.trend === 'down' && '-2%'}
                    {educator.trend === 'stable' && '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderEducatorDetail = () => {
    if (!selectedEducator) {
      return (
        <div className="h-full flex items-centre justify-centre border border-dashed rounded-md p-8">
          <div className="text-centre">
            <h3 className="text-lg font-medium">No Educator Selected</h3>
            <p className="text-muted-foreground">Select an educator from the list to view detailed analytics</p>
          </div>
        </div>
      );
    }

    const educator = mockEducators.find(e => e.id === selectedEducator);

    return (
      <div className="space-y-6">
        <div className="flex items-centre justify-between">
          <div className="flex items-centre space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-centre justify-centre text-lg font-medium">
              {educator.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{educator.name}</h2>
              <p className="text-muted-foreground">{educator.role}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teaching">Teaching</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Effectiveness</CardTitle>
                <CardDescription>
                  Performance across different subjects and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teachingEffectivenessData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="effectiveness" name="Teaching Effectiveness" fill="#8884d8" />
                      <Bar dataKey="engagement" name="Student Engagement" fill="#82ca9d" />
                      <Bar dataKey="progress" name="Student Progress" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Time Allocation</CardTitle>
                  <CardDescription>
                    How teaching time is distributed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeAllocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {timeAllocationData.map((entry, index) => (
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
                  <CardTitle>Student Progress Trend</CardTitle>
                  <CardDescription>
                    Average student progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={studentProgressTrendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 90]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgProgress" 
                          name="Average Progress" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{educator.effectiveness}%</div>
                  <p className="text-xs text-muted-foreground">
                    {educator.trend === 'up' && (
                      <span className="text-green-500 flex items-centre">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        4% from last term
                      </span>
                    )}
                    {educator.trend === 'down' && (
                      <span className="text-red-500 flex items-centre">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        2% from last term
                      </span>
                    )}
                    {educator.trend === 'stable' && (
                      <span className="text-muted-foreground">
                        No change from last term
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Students Supported</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-centre">
                      <Users className="h-3 w-3 mr-1" />
                      Current class size
                    </span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resources Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-centre">
                      <BookOpen className="h-3 w-3 mr-1" />
                      This academic year
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teaching" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Strategies</CardTitle>
                <CardDescription>
                  Effectiveness of different teaching approaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teachingStrategiesData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Effectiveness" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Observations</CardTitle>
                  <CardDescription>
                    Recent formal observations and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Mathematics - Fractions</h4>
                            <p className="text-sm text-muted-foreground">April 15, 2025</p>
                          </div>
                          <Badge className="bg-green-500">Outstanding</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Strengths: Excellent differentiation, clear explanations, effective questioning</p>
                          <p className="text-sm text-muted-foreground">Areas for development: Pace could be adjusted for higher ability students</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">English - Creative Writing</h4>
                            <p className="text-sm text-muted-foreground">March 10, 2025</p>
                          </div>
                          <Badge className="bg-green-500">Good</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Strengths: Engaging starter, good use of resources, positive learning environment</p>
                          <p className="text-sm text-muted-foreground">Areas for development: More opportunities for peer assessment</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Science - Forces</h4>
                            <p className="text-sm text-muted-foreground">February 5, 2025</p>
                          </div>
                          <Badge className="bg-green-500">Outstanding</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Strengths: Excellent practical activities, clear explanations, effective questioning</p>
                          <p className="text-sm text-muted-foreground">Areas for development: More challenge for most able students</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Quality</CardTitle>
                  <CardDescription>
                    Analysis of feedback provided to students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Timeliness</p>
                        <p className="text-sm font-medium">90%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Specificity</p>
                        <p className="text-sm font-medium">85%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Actionability</p>
                        <p className="text-sm font-medium">80%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Student Response</p>
                        <p className="text-sm font-medium">75%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Impact on Progress</p>
                        <p className="text-sm font-medium">85%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Distribution</CardTitle>
                <CardDescription>
                  Distribution of progress across student cohort
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { range: '0-20%', count: 0 },
                        { range: '21-40%', count: 2 },
                        { range: '41-60%', count: 5 },
                        { range: '61-80%', count: 15 },
                        { range: '81-100%', count: 10 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Students" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Groups Performance</CardTitle>
                  <CardDescription>
                    Progress comparison across different student groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { group: 'All Students', progress: 78 },
                          { group: 'Pupil Premium', progress: 72 },
                          { group: 'SEND', progress: 70 },
                          { group: 'EAL', progress: 75 },
                          { group: 'High Ability', progress: 85 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="group" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="progress" name="Average Progress %" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Intervention Effectiveness</CardTitle>
                  <CardDescription>
                    Impact of interventions on student progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { week: 'Week 1', before: 65, after: 65 },
                          { week: 'Week 2', before: 66, after: 68 },
                          { week: 'Week 3', before: 67, after: 72 },
                          { week: 'Week 4', before: 68, after: 75 },
                          { week: 'Week 5', before: 69, after: 79 },
                          { week: 'Week 6', before: 70, after: 82 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[60, 90]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="before" 
                          name="Projected (No Intervention)" 
                          stroke="#8884d8" 
                          strokeDasharray="5 5"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="after" 
                          name="Actual (With Intervention)" 
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Effectiveness</CardTitle>
                <CardDescription>
                  Impact and usage of different teaching resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={resourceEffectivenessData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="resource" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="effectiveness" name="Effectiveness" fill="#8884d8" />
                      <Bar dataKey="usage" name="Usage Frequency" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Creation</CardTitle>
                  <CardDescription>
                    Resources created and shared by subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Mathematics', value: 15 },
                            { name: 'English', value: 12 },
                            { name: 'Science', value: 8 },
                            { name: 'History', value: 5 },
                            { name: 'Geography', value: 4 },
                            { name: 'Art', value: 4 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {timeAllocationData.map((entry, index) => (
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
                  <CardTitle>Top Resources</CardTitle>
                  <CardDescription>
                    Most effective resources by student impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Fractions Visual Manipulatives</h4>
                            <p className="text-sm text-muted-foreground">Mathematics</p>
                          </div>
                          <Badge className="bg-green-500">95% Effective</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Used by 28 students • Shared with 5 colleagues</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Interactive Grammar Game</h4>
                            <p className="text-sm text-muted-foreground">English</p>
                          </div>
                          <Badge className="bg-green-500">90% Effective</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Used by 32 students • Shared with 8 colleagues</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Forces Experiment Guide</h4>
                            <p className="text-sm text-muted-foreground">Science</p>
                          </div>
                          <Badge className="bg-green-500">88% Effective</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Used by 30 students • Shared with 4 colleagues</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Historical Sources Analysis</h4>
                            <p className="text-sm text-muted-foreground">History</p>
                          </div>
                          <Badge className="bg-amber-500">85% Effective</Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Used by 25 students • Shared with 3 colleagues</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="development" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Development</CardTitle>
                <CardDescription>
                  CPD activities and impact on teaching practise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={professionalDevelopmentData.map(item => ({
                        ...item,
                        date: new Date(item.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [`${value} hours`, 'Duration']} />
                      <Legend />
                      <Bar dataKey="hours" name="CPD Hours" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>CPD Activities</CardTitle>
                  <CardDescription>
                    Recent professional development activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      {professionalDevelopmentData.map((item, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.topic}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.date).toLocaleDateString('en-GB', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <Badge variant="outline">{item.hours} hours</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-centre space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <p className="text-sm">Completed</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Development Goals</CardTitle>
                  <CardDescription>
                    Current professional development targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Differentiation Strategies</p>
                        <p className="text-sm font-medium">75%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Target completion: June 2025</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Technology Integration</p>
                        <p className="text-sm font-medium">60%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Target completion: July 2025</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Assessment for Learning</p>
                        <p className="text-sm font-medium">85%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Target completion: May 2025</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">SEND Support Strategies</p>
                        <p className="text-sm font-medium">50%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Target completion: August 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Educator Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis of teaching effectiveness and professional development.
          </p>
        </div>
        <div className="flex items-centre gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Educators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              In current school
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +3% from last term
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              CPD Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">428</div>
            <p className="text-xs text-muted-foreground">
              This academic year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resources Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">356</div>
            <p className="text-xs text-muted-foreground">
              This academic year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-centre justify-between">
              <CardTitle>Educators</CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search educators..."
                  className="pl-8 w-full md:w-[200px]"
                />
              </div>
            </div>
            <CardDescription>
              Select an educator to view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              renderEducatorList()
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Educator Detail</CardTitle>
            <CardDescription>
              Comprehensive analytics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              renderSkeleton()
            ) : (
              renderEducatorDetail()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducatorAnalytics;
