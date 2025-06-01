'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subMonths } from "date-fns";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon, 
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Sliders, 
  BarChart as BarChartIcon, Layers, Save, Plus, Edit, Trash2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for student progress tracking
const studentProgressData = [
  { name: 'Term 1', reading: 65, writing: 70, maths: 60, science: 68, average: 65.75 },
  { name: 'Term 2', reading: 68, writing: 72, maths: 62, science: 70, average: 68 },
  { name: 'Term 3', reading: 75, writing: 71, maths: 65, science: 72, average: 70.75 },
  { name: 'Term 4', reading: 78, writing: 74, maths: 70, science: 75, average: 74.25 },
  { name: 'Term 5', reading: 82, writing: 76, maths: 73, science: 78, average: 77.25 },
  { name: 'Term 6', reading: 85, writing: 80, maths: 75, science: 82, average: 80.5 },
];

// Sample data for cohort comparison
const cohortComparisonData = [
  { name: 'Reading', currentCohort: 82, previousCohort: 78, nationalAverage: 80 },
  { name: 'Writing', currentCohort: 76, previousCohort: 72, nationalAverage: 74 },
  { name: 'Maths', currentCohort: 73, previousCohort: 70, nationalAverage: 75 },
  { name: 'Science', currentCohort: 78, previousCohort: 75, nationalAverage: 77 },
];

// Sample data for educator performance
const educatorPerformanceData = [
  { name: 'Student Progress', value: 85, target: 80 },
  { name: 'Resource Utilization', value: 78, target: 75 },
  { name: 'Parent Engagement', value: 72, target: 70 },
  { name: 'Assessment Quality', value: 88, target: 85 },
  { name: 'Differentiation', value: 82, target: 80 },
];

// Sample data for time allocation
const timeAllocationData = [
  { name: 'Teaching', actual: 45, optimal: 55 },
  { name: 'Planning', actual: 20, optimal: 15 },
  { name: 'Assessment', actual: 15, optimal: 10 },
  { name: 'Meetings', actual: 10, optimal: 5 },
  { name: 'Admin', actual: 10, optimal: 5 },
  { name: 'Professional Development', actual: 0, optimal: 10 },
];

// Sample data for resource usage
const resourceUsageData = [
  { name: 'Lesson Plans', downloads: 120, views: 350, engagement: 85, effectiveness: 78 },
  { name: 'Worksheets', downloads: 200, views: 420, engagement: 75, effectiveness: 72 },
  { name: 'Videos', downloads: 80, views: 280, engagement: 90, effectiveness: 85 },
  { name: 'Interactive', downloads: 65, views: 180, engagement: 95, effectiveness: 88 },
  { name: 'Assessments', downloads: 110, views: 220, engagement: 70, effectiveness: 75 },
];

// Sample data for assessment analytics
const assessmentAnalyticsData = [
  { name: 'Q1', difficulty: 0.35, discrimination: 0.68, guessing: 0.12 },
  { name: 'Q2', difficulty: 0.42, discrimination: 0.72, guessing: 0.08 },
  { name: 'Q3', difficulty: 0.65, discrimination: 0.45, guessing: 0.15 },
  { name: 'Q4', difficulty: 0.28, discrimination: 0.82, guessing: 0.05 },
  { name: 'Q5', difficulty: 0.75, discrimination: 0.38, guessing: 0.18 },
  { name: 'Q6', difficulty: 0.50, discrimination: 0.65, guessing: 0.10 },
  { name: 'Q7', difficulty: 0.38, discrimination: 0.75, guessing: 0.07 },
  { name: 'Q8', difficulty: 0.60, discrimination: 0.55, guessing: 0.14 },
];

// Sample data for report templates
const reportTemplates = [
  { id: 'student-progress', name: 'Student Progress Report', category: 'Academic', lastUsed: '2025-05-10' },
  { id: 'cohort-comparison', name: 'Cohort Comparison Report', category: 'Academic', lastUsed: '2025-05-05' },
  { id: 'resource-effectiveness', name: 'Resource Effectiveness Report', category: 'Resources', lastUsed: '2025-05-12' },
  { id: 'teacher-performance', name: 'Teacher Performance Summary', category: 'Staff', lastUsed: '2025-05-01' },
  { id: 'parent-engagement', name: 'Parent Engagement Analysis', category: 'Community', lastUsed: '2025-04-28' },
  { id: 'send-provision', name: 'SEND Provision Impact Report', category: 'Inclusion', lastUsed: '2025-05-08' },
  { id: 'curriculum-coverage', name: 'Curriculum Coverage Map', category: 'Curriculum', lastUsed: '2025-05-15' },
  { id: 'ofsted-ready', name: 'Ofsted-Ready Dashboard', category: 'Compliance', lastUsed: '2025-04-20' },
];

// Sample data for scheduled reports
const scheduledReports = [
  { 
    id: 'sr1', 
    name: 'Weekly Progress Summary', 
    template: 'Student Progress Report',
    frequency: 'Weekly',
    nextRun: '2025-05-20',
    recipients: 'All Teachers',
    format: 'PDF'
  },
  { 
    id: 'sr2', 
    name: 'Monthly SLT Dashboard', 
    template: 'Ofsted-Ready Dashboard',
    frequency: 'Monthly',
    nextRun: '2025-06-01',
    recipients: 'Senior Leadership Team',
    format: 'Interactive'
  },
  { 
    id: 'sr3', 
    name: 'Termly Governors Report', 
    template: 'Cohort Comparison Report',
    frequency: 'Termly',
    nextRun: '2025-07-15',
    recipients: 'Governors',
    format: 'PDF + Excel'
  },
];

export default function AnalyticsAndReporting() {
  // State for dashboard configuration
  const [activeTab, setActiveTab] = useState('student-progress');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('academic-year');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 10),
    to: new Date(),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // State for report builder
  const [activeReportTab, setActiveReportTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Handle time period selection
  useEffect(() => {
    if (selectedTimePeriod === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      
      // Set appropriate date range based on selection
      const now = new Date();
      switch (selectedTimePeriod) {
        case 'term':
          setDateRange({ from: subMonths(now, 3), to: now });
          break;
        case 'academic-year':
          setDateRange({ from: subMonths(now, 10), to: now });
          break;
        case 'calendar-year':
          setDateRange({ from: new Date(now.getFullYear(), 0, 1), to: now });
          break;
        case 'three-year':
          setDateRange({ from: subMonths(now, 36), to: now });
          break;
      }
    }
  }, [selectedTimePeriod]);
  
  // Render dashboard header with controls
  const renderDashboardHeader = () => (
    <div className="flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive data insights and custom reporting tools
        </p>
      </div>
      <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>
    </div>
  );
  
  // Render filter bar
  const renderFilterBar = () => (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-centre md:space-x-2 md:space-y-0">
        <div className="flex items-centre space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term">Current Term</SelectItem>
            <SelectItem value="academic-year">Academic Year</SelectItem>
            <SelectItem value="calendar-year">Calendar Year</SelectItem>
            <SelectItem value="three-year">Three Year Trend</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {showCustomDateRange && (
          <div className="flex items-centre space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <Select value={selectedStudentGroup} onValueChange={setSelectedStudentGroup}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Student group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="year-groups">By Year Group</SelectItem>
            <SelectItem value="send">SEND Students</SelectItem>
            <SelectItem value="pp">Pupil Premium</SelectItem>
            <SelectItem value="eal">EAL Students</SelectItem>
            <SelectItem value="gender">By Gender</SelectItem>
            <SelectItem value="custom-group">Custom Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-centre space-x-2">
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save View
        </Button>
        <Button size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
  
  // Render main analytics tabs
  const renderAnalyticsTabs = () => (
    <Tabs defaultValue="student-progress" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
        <TabsTrigger value="educator-performance">Educator Analytics</TabsTrigger>
        <TabsTrigger value="resource-usage">Resource Analytics</TabsTrigger>
        <TabsTrigger value="assessment">Assessment Analytics</TabsTrigger>
        <TabsTrigger value="report-builder">Report Builder</TabsTrigger>
        <TabsTrigger value="scheduled-reports">Scheduled Reports</TabsTrigger>
        <TabsTrigger value="data-export">Data Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="student-progress" className="mt-6 space-y-6">
        {renderStudentProgressAnalytics()}
      </TabsContent>
      
      <TabsContent value="educator-performance" className="mt-6 space-y-6">
        {renderEducatorPerformanceAnalytics()}
      </TabsContent>
      
      <TabsContent value="resource-usage" className="mt-6 space-y-6">
        {renderResourceUsageAnalytics()}
      </TabsContent>
      
      <TabsContent value="assessment" className="mt-6 space-y-6">
        {renderAssessmentAnalytics()}
      </TabsContent>
      
      <TabsContent value="report-builder" className="mt-6 space-y-6">
        {renderReportBuilder()}
      </TabsContent>
      
      <TabsContent value="scheduled-reports" className="mt-6 space-y-6">
        {renderScheduledReports()}
      </TabsContent>
      
      <TabsContent value="data-export" className="mt-6 space-y-6">
        {renderDataExport()}
      </TabsContent>
    </Tabs>
  );
  
  // Render student progress analytics
  const renderStudentProgressAnalytics = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students Above Target
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "68%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attainment Gap (PP)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-8.3%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intervention Impact
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">
              +3.7% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Trends</CardTitle>
            <CardDescription>
              Average progress scores across core subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={studentProgressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reading" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="writing" 
                    stroke="#82ca9d"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="maths" 
                    stroke="#ffc658"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="science" 
                    stroke="#ff8042"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#ff0000"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cohort Comparison</CardTitle>
            <CardDescription>
              Current cohort vs previous cohort and national average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cohortComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentCohort" name="Current Cohort" fill="#8884d8" />
                  <Bar dataKey="previousCohort" name="Previous Cohort" fill="#82ca9d" />
                  <Bar dataKey="nationalAverage" name="National Average" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Progress by Student Group</CardTitle>
            <CardDescription>
              Comparative analysis across student demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={[
                  { subject: 'Reading', A: 85, B: 75, C: 65, fullMark: 100 },
                  { subject: 'Writing', A: 80, B: 70, C: 60, fullMark: 100 },
                  { subject: 'Maths', A: 75, B: 72, C: 68, fullMark: 100 },
                  { subject: 'Science', A: 82, B: 78, C: 70, fullMark: 100 },
                  { subject: 'Humanities', A: 78, B: 74, C: 65, fullMark: 100 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Non-PP" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Pupil Premium" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="SEND" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Predicted Outcomes</CardTitle>
            <CardDescription>
              AI-powered prediction of end-of-year results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Exceeding', current: 25, predicted: 30 },
                    { name: 'Meeting', current: 45, predicted: 48 },
                    { name: 'Working Towards', current: 20, predicted: 17 },
                    { name: 'Below', current: 10, predicted: 5 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="Current" fill="#8884d8" />
                  <Bar dataKey="predicted" name="Predicted" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>At-Risk Students</CardTitle>
            <CardDescription>
              Students requiring additional support
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Alex Thompson</p>
                    <p className="text-xs text-muted-foreground">Maths: -12% below target</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Samira Khan</p>
                    <p className="text-xs text-muted-foreground">Reading: -8% below target</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Jamie Wilson</p>
                    <p className="text-xs text-muted-foreground">Multiple subjects: -15% average</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Olivia Chen</p>
                    <p className="text-xs text-muted-foreground">Science: -7% below target</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render educator performance analytics
  const renderEducatorPerformanceAnalytics = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Teaching Effectiveness
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +3% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "85%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Utilization
            </CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "78%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Efficiency
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">
              +8% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "72%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Professional Development
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              +12% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "65%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance vs Targets</CardTitle>
            <CardDescription>
              Key performance indicators against targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={educatorPerformanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Time Allocation Analysis</CardTitle>
            <CardDescription>
              Actual vs optimal time allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeAllocationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="Actual %" fill="#8884d8" />
                  <Bar dataKey="optimal" name="Optimal %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Professional Development Impact</CardTitle>
            <CardDescription>
              Effect of CPD activities on teaching effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Sep', effectiveness: 72, cpd: 0 },
                    { month: 'Oct', effectiveness: 74, cpd: 5 },
                    { month: 'Nov', effectiveness: 78, cpd: 8 },
                    { month: 'Dec', effectiveness: 77, cpd: 8 },
                    { month: 'Jan', effectiveness: 80, cpd: 12 },
                    { month: 'Feb', effectiveness: 82, cpd: 15 },
                    { month: 'Mar', effectiveness: 85, cpd: 18 },
                    { month: 'Apr', effectiveness: 88, cpd: 22 },
                    { month: 'May', effectiveness: 90, cpd: 25 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 30]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="effectiveness" 
                    name="Teaching Effectiveness"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cpd" 
                    name="CPD Hours"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Development Areas</CardTitle>
            <CardDescription>
              AI-powered professional development recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Differentiation Strategies</p>
                    <p className="text-xs text-muted-foreground">High impact potential for SEN students</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Explore</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Assessment for Learning</p>
                    <p className="text-xs text-muted-foreground">Medium impact potential across all subjects</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Explore</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Digital Learning Tools</p>
                    <p className="text-xs text-muted-foreground">High efficiency potential for planning</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Explore</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Behaviour Management</p>
                    <p className="text-xs text-muted-foreground">Medium impact potential for engagement</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Explore</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render resource usage analytics
  const renderResourceUsageAnalytics = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +124 from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "85%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Usage
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <p className="text-xs text-muted-foreground">
              +18% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "78%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Effectiveness
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.6%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "80%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Curriculum Coverage
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <p className="text-xs text-muted-foreground">
              +4.5% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "92%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage and Effectiveness</CardTitle>
            <CardDescription>
              Usage metrics and effectiveness ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="downloads" name="Downloads" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="views" name="Views" fill="#82ca9d" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="effectiveness" 
                    name="Effectiveness %" 
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Coverage Map</CardTitle>
            <CardDescription>
              Resource distribution across curriculum areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'English', value: 25, fill: '#8884d8' },
                      { name: 'Maths', value: 22, fill: '#83a6ed' },
                      { name: 'Science', value: 18, fill: '#8dd1e1' },
                      { name: 'Humanities', value: 15, fill: '#82ca9d' },
                      { name: 'Arts', value: 10, fill: '#a4de6c' },
                      { name: 'PE', value: 5, fill: '#d0ed57' },
                      { name: 'Computing', value: 5, fill: '#ffc658' },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Gaps Analysis</CardTitle>
            <CardDescription>
              Curriculum areas with resource deficits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: 'Computing - Programming', coverage: 65, target: 100 },
                    { name: 'Science - Practical', coverage: 70, target: 100 },
                    { name: 'Maths - Problem Solving', coverage: 75, target: 100 },
                    { name: 'English - Speaking', coverage: 78, target: 100 },
                    { name: 'History - Primary Sources', coverage: 80, target: 100 },
                  ]}
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="coverage" name="Current Coverage %" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
            <CardDescription>
              AI-recommended resources based on usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Interactive Fractions Tool</p>
                    <p className="text-xs text-muted-foreground">High relevance for Year 4 Maths</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Scientific Method Simulation</p>
                    <p className="text-xs text-muted-foreground">Medium relevance for Year 5 Science</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Persuasive Writing Framework</p>
                    <p className="text-xs text-muted-foreground">High relevance for Year 6 English</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Historical Sources Database</p>
                    <p className="text-xs text-muted-foreground">Medium relevance for Year 5 History</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render assessment analytics
  const renderAssessmentAnalytics = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              +32 from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Reliability
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.82</div>
            <p className="text-xs text-muted-foreground">
              +0.03 from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "95%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.5%</div>
            <p className="text-xs text-muted-foreground">
              +3.8% from previous period
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "73%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Assessment charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Item Analysis</CardTitle>
            <CardDescription>
              Question difficulty, discrimination, and guessing metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="difficulty" 
                    name="Difficulty" 
                    domain={[0, 1]} 
                    label={{ value: 'Difficulty', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="discrimination" 
                    name="Discrimination" 
                    domain={[0, 1]}
                    label={{ value: 'Discrimination', angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Items" 
                    data={assessmentAnalyticsData} 
                    fill="#8884d8"
                  >
                    {assessmentAnalyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.discrimination > 0.6 ? '#82ca9d' : '#ff7300'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Types Effectiveness</CardTitle>
            <CardDescription>
              Comparative analysis of assessment formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Multiple Choice', reliability: 0.78, validity: 0.72, engagement: 0.65 },
                    { name: 'Short Answer', reliability: 0.75, validity: 0.80, engagement: 0.70 },
                    { name: 'Essay', reliability: 0.68, validity: 0.85, engagement: 0.75 },
                    { name: 'Project', reliability: 0.72, validity: 0.88, engagement: 0.90 },
                    { name: 'Presentation', reliability: 0.70, validity: 0.82, engagement: 0.85 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reliability" name="Reliability" fill="#8884d8" />
                  <Bar dataKey="validity" name="Validity" fill="#82ca9d" />
                  <Bar dataKey="engagement" name="Engagement" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Common Misconceptions</CardTitle>
            <CardDescription>
              Frequently identified misconceptions from assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Place Value in Decimals</p>
                    <p className="text-xs text-muted-foreground">Identified in 42% of Year 5 assessments</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Resources</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Subject-Verb Agreement</p>
                    <p className="text-xs text-muted-foreground">Identified in 38% of Year 4 assessments</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Resources</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">States of Matter</p>
                    <p className="text-xs text-muted-foreground">Identified in 35% of Year 3 assessments</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Resources</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Fraction Equivalence</p>
                    <p className="text-xs text-muted-foreground">Identified in 32% of Year 6 assessments</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Resources</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Recommendations</CardTitle>
            <CardDescription>
              AI-powered assessment improvement suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Increase Open-Ended Questions</p>
                    <p className="text-xs text-muted-foreground">Would improve validity in Maths assessments</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Apply</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Add Visual Elements</p>
                    <p className="text-xs text-muted-foreground">Would support EAL and visual learners</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Apply</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Revise Question 5 Wording</p>
                    <p className="text-xs text-muted-foreground">Currently has low discrimination value</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Apply</Button>
              </div>
              
              <div className="flex items-centre justify-between rounded-md bg-muted p-3">
                <div className="flex items-centre space-x-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Add Formative Checkpoints</p>
                    <p className="text-xs text-muted-foreground">Would improve ongoing assessment data</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render report builder
  const renderReportBuilder = () => (
    <>
      <Tabs defaultValue="templates" value={activeReportTab} onValueChange={setActiveReportTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6 space-y-6">
          <div className="flex items-centre justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">Report Templates</h3>
              <p className="text-sm text-muted-foreground">
                Pre-designed report templates for common reporting needs
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Template Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Last Used</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportTemplates.map((template) => (
                    <tr key={template.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{template.name}</td>
                      <td className="p-4 align-middle">{template.category}</td>
                      <td className="p-4 align-middle">{template.lastUsed}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-centre space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="builder" className="mt-6 space-y-6">
          <div className="flex items-centre justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">Custom Report Builder</h3>
              <p className="text-sm text-muted-foreground">
                Create customised reports with drag-and-drop components
              </p>
            </div>
            <div className="flex items-centre space-x-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>
                  Drag components to the report canvas
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-2">
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <BarChartIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Bar Chart</span>
                    </div>
                  </div>
                  
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Line Chart</span>
                    </div>
                  </div>
                  
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Pie Chart</span>
                    </div>
                  </div>
                  
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Data Table</span>
                    </div>
                  </div>
                  
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Text Block</span>
                    </div>
                  </div>
                  
                  <div className="flex items-centre justify-between rounded-md border border-dashed p-3 cursor-move">
                    <div className="flex items-centre space-x-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">KPI Card</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Report Canvas</CardTitle>
                <CardDescription>
                  Design your report layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[500px] rounded-md border border-dashed border-muted-foreground/50 p-6 text-centre">
                  <div className="flex flex-col items-centre justify-centre space-y-2 h-full">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Report Canvas</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop components here to build your report
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6 space-y-6">
          <div className="flex items-centre justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">Scheduled Reports</h3>
              <p className="text-sm text-muted-foreground">
                Automated report generation and distribution
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </div>
          
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Report Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Template</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Frequency</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Next Run</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Recipients</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Format</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledReports.map((report) => (
                    <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{report.name}</td>
                      <td className="p-4 align-middle">{report.template}</td>
                      <td className="p-4 align-middle">{report.frequency}</td>
                      <td className="p-4 align-middle">{report.nextRun}</td>
                      <td className="p-4 align-middle">{report.recipients}</td>
                      <td className="p-4 align-middle">{report.format}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-centre space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
  
  // Render scheduled reports
  const renderScheduledReports = () => (
    <div className="space-y-6">
      <div className="flex items-centre justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Scheduled Reports</h3>
          <p className="text-sm text-muted-foreground">
            Automated report generation and distribution
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Report
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Report Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Template</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Frequency</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Next Run</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Recipients</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Format</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports.map((report) => (
                <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{report.name}</td>
                  <td className="p-4 align-middle">{report.template}</td>
                  <td className="p-4 align-middle">{report.frequency}</td>
                  <td className="p-4 align-middle">{report.nextRun}</td>
                  <td className="p-4 align-middle">{report.recipients}</td>
                  <td className="p-4 align-middle">{report.format}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-centre space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  // Render data export
  const renderDataExport = () => (
    <div className="space-y-6">
      <div className="flex items-centre justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Data Export</h3>
          <p className="text-sm text-muted-foreground">
            Export data in various formats for external analysis
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>
              Select data and format for export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type</Label>
              <Select defaultValue="student-progress">
                <SelectTrigger id="data-type">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student-progress">Student Progress Data</SelectItem>
                  <SelectItem value="attendance">Attendance Data</SelectItem>
                  <SelectItem value="behaviour">Behaviour Data</SelectItem>
                  <SelectItem value="assessment">Assessment Data</SelectItem>
                  <SelectItem value="resource-usage">Resource Usage Data</SelectItem>
                  <SelectItem value="teacher-performance">Teacher Performance Data</SelectItem>
                  <SelectItem value="custom">Custom Query</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time-range">Time Range</Label>
              <Select defaultValue="academic-year">
                <SelectTrigger id="time-range">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Current Term</SelectItem>
                  <SelectItem value="academic-year">Academic Year</SelectItem>
                  <SelectItem value="calendar-year">Calendar Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select defaultValue="excel">
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aggregation">Data Aggregation</Label>
              <Select defaultValue="none">
                <SelectTrigger id="aggregation">
                  <SelectValue placeholder="Select aggregation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Aggregation (Raw Data)</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="termly">Termly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-centre space-x-2 pt-2">
              <Switch id="anonymize" />
              <Label htmlFor="anonymize">Anonymize Personal Data</Label>
            </div>
            
            <Button className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Export</CardTitle>
            <CardDescription>
              Custom queries and bulk exports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-query">Custom SQL Query</Label>
              <div className="relative">
                <textarea
                  id="custom-query"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="SELECT * FROM student_progress WHERE..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a custom query to extract specific data
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>Bulk Export Options</Label>
              <div className="space-y-2">
                <div className="flex items-centre space-x-2">
                  <Checkbox id="terms-all-students" />
                  <label
                    htmlFor="terms-all-students"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Student Data
                  </label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="terms-all-assessments" />
                  <label
                    htmlFor="terms-all-assessments"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Assessment Data
                  </label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="terms-all-resources" />
                  <label
                    htmlFor="terms-all-resources"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Resource Usage Data
                  </label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="terms-all-behaviour" />
                  <label
                    htmlFor="terms-all-behaviour"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Behaviour Data
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Label htmlFor="schedule-export">Schedule Regular Export</Label>
              <Select defaultValue="none">
                <SelectTrigger id="schedule-export">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Schedule (One-time)</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="termly">Termly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Advanced Export
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto py-6">
      {renderDashboardHeader()}
      {renderFilterBar()}
      {renderAnalyticsTabs()}
    </div>
  );
}
