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
import { format, subDays, subMonths, subYears } from "date-fns";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Treemap
} from 'recharts';
import {
  Download, Filter, RefreshCw, Settings, Share2, Calendar as CalendarIcon,
  ChevronDown, Maximize2, HelpCircle, BookOpen, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, Users, BookOpen as BookOpenIcon, Clock,
  Award, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Sliders,
  BarChart as BarChartIcon, Layers, Save, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  ArrowRight, Target, Eye, EyeOff, Zap, Flag, User, UserPlus, UserCheck, Star,
  Lightbulb, Clipboard, Briefcase, Heart, ThumbsUp, MessageSquare, School, GraduationCap,
  FileQuestion, BookMarked, Laptop, Tablet, Smartphone, Printer, Database, Search,
  Library, Book, Video, Music, Image, File, FilePlus, FileCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for resource usage
const resourceUsageData = [
  { month: 'Sep', digital: 245, print: 120, interactive: 85, total: 450 },
  { month: 'Oct', digital: 280, print: 110, interactive: 95, total: 485 },
  { month: 'Nov', digital: 310, print: 100, interactive: 105, total: 515 },
  { month: 'Dec', digital: 290, print: 90, interactive: 100, total: 480 },
  { month: 'Jan', digital: 320, print: 85, interactive: 115, total: 520 },
  { month: 'Feb', digital: 350, print: 80, interactive: 125, total: 555 },
  { month: 'Mar', digital: 380, print: 75, interactive: 135, total: 590 },
  { month: 'Apr', digital: 400, print: 70, interactive: 145, total: 615 },
  { month: 'May', digital: 420, print: 65, interactive: 155, total: 640 },
  { month: 'Jun', digital: 440, print: 60, interactive: 165, total: 665 },
  { month: 'Jul', digital: 460, print: 55, interactive: 175, total: 690 },
];

// Sample data for resource effectiveness
const resourceEffectivenessData = [
  { name: 'Digital Textbooks', effectiveness: 85, usage: 420, cost: 2500 },
  { name: 'Interactive Simulations', effectiveness: 92, usage: 175, cost: 1800 },
  { name: 'Educational Videos', effectiveness: 88, usage: 320, cost: 2200 },
  { name: 'Practice Worksheets', effectiveness: 75, usage: 280, cost: 1200 },
  { name: 'Assessment Tools', effectiveness: 90, usage: 210, cost: 1900 },
  { name: 'Learning Games', effectiveness: 86, usage: 150, cost: 1600 },
  { name: 'Reference Materials', effectiveness: 78, usage: 190, cost: 1400 },
];

// Sample data for resource distribution by subject
const resourceDistributionData = [
  { subject: 'English', digital: 28, print: 12, interactive: 15 },
  { subject: 'Maths', digital: 32, print: 10, interactive: 18 },
  { subject: 'Science', digital: 30, print: 8, interactive: 22 },
  { subject: 'Humanities', digital: 25, print: 15, interactive: 10 },
  { subject: 'Arts', digital: 20, print: 18, interactive: 12 },
  { subject: 'PE', digital: 15, print: 5, interactive: 8 },
  { subject: 'Computing', digital: 35, print: 2, interactive: 25 },
];

// Sample data for assessment types
const assessmentTypesData = [
  { name: 'Formative', value: 45, color: '#8884d8' },
  { name: 'Summative', value: 30, color: '#82ca9d' },
  { name: 'Diagnostic', value: 15, color: '#ffc658' },
  { name: 'Self-Assessment', value: 10, color: '#ff8042' },
];

// Sample data for assessment frequency
const assessmentFrequencyData = [
  { month: 'Sep', formative: 25, summative: 5, diagnostic: 8 },
  { month: 'Oct', formative: 28, summative: 2, diagnostic: 3 },
  { month: 'Nov', formative: 30, summative: 8, diagnostic: 2 },
  { month: 'Dec', formative: 22, summative: 12, diagnostic: 1 },
  { month: 'Jan', formative: 26, summative: 3, diagnostic: 10 },
  { month: 'Feb', formative: 32, summative: 2, diagnostic: 2 },
  { month: 'Mar', formative: 35, summative: 4, diagnostic: 3 },
  { month: 'Apr', formative: 30, summative: 10, diagnostic: 2 },
  { month: 'May', formative: 28, summative: 15, diagnostic: 1 },
  { month: 'Jun', formative: 25, summative: 18, diagnostic: 5 },
  { month: 'Jul', formative: 20, summative: 5, diagnostic: 2 },
];

// Sample data for assessment quality
const assessmentQualityData = [
  { category: 'Validity', score: 88, target: 90 },
  { category: 'Reliability', score: 85, target: 90 },
  { category: 'Fairness', score: 92, target: 90 },
  { category: 'Efficiency', score: 80, target: 85 },
  { category: 'Engagement', score: 86, target: 85 },
  { category: 'Feedback Quality', score: 90, target: 90 },
];

// Sample data for assessment impact
const assessmentImpactData = [
  { assessment: 'Weekly Quizzes', beforeAfterGap: 15, studentEngagement: 85, teacherValue: 80 },
  { assessment: 'Unit Tests', beforeAfterGap: 18, studentEngagement: 70, teacherValue: 85 },
  { assessment: 'Project Evaluations', beforeAfterGap: 20, studentEngagement: 90, teacherValue: 88 },
  { assessment: 'Peer Assessments', beforeAfterGap: 12, studentEngagement: 88, teacherValue: 75 },
  { assessment: 'Self-Reflections', beforeAfterGap: 10, studentEngagement: 92, teacherValue: 78 },
  { assessment: 'End of Term Exams', beforeAfterGap: 22, studentEngagement: 65, teacherValue: 90 },
];

// Sample data for popular resources
const popularResourcesData = [
  { name: 'Interactive Maths Games', downloads: 1250, rating: 4.8, type: 'Interactive' },
  { name: 'Science Experiment Videos', downloads: 980, rating: 4.7, type: 'Digital' },
  { name: 'Reading Comprehension Worksheets', downloads: 850, rating: 4.5, type: 'Print' },
  { name: 'Historical Timeline Interactive', downloads: 780, rating: 4.6, type: 'Interactive' },
  { name: 'Grammar Practice Activities', downloads: 720, rating: 4.4, type: 'Digital' },
  { name: 'Physics Simulation Lab', downloads: 680, rating: 4.9, type: 'Interactive' },
  { name: 'Creative Writing Prompts', downloads: 650, rating: 4.3, type: 'Print' },
  { name: 'Geography Map Quizzes', downloads: 620, rating: 4.5, type: 'Digital' },
];

// Sample data for resource categories
const resourceCategoriesData = [
  {
    name: 'Digital',
    children: [
      { name: 'E-books', size: 1200 },
      { name: 'Videos', size: 980 },
      { name: 'Presentations', size: 850 },
      { name: 'Audio', size: 620 },
      { name: 'Websites', size: 780 },
    ],
  },
  {
    name: 'Print',
    children: [
      { name: 'Worksheets', size: 850 },
      { name: 'Textbooks', size: 720 },
      { name: 'Activity Cards', size: 480 },
      { name: 'Posters', size: 350 },
      { name: 'Handouts', size: 520 },
    ],
  },
  {
    name: 'Interactive',
    children: [
      { name: 'Games', size: 680 },
      { name: 'Simulations', size: 780 },
      { name: 'Quizzes', size: 620 },
      { name: 'Virtual Tours', size: 450 },
      { name: 'Interactive Whiteboards', size: 580 },
    ],
  },
];

export function ResourceAndAssessmentAnalytics() {
  // State for tracking configuration
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('academic-year');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 10),
    to: new Date(),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
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
        case 'three-year':
          setDateRange({ from: subYears(now, 3), to: now });
          break;
      }
    }
  }, [selectedTimePeriod]);
  
  // Render component header with controls
  const renderHeader = () => (
    <div className="flex flex-col space-y-4 md:flex-row md:items-centre md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource & Assessment Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into resource usage and assessment effectiveness
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
          Add Resource
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
        
        <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="print">Print</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="maths">Maths</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="humanities">Humanities</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="pe">PE</SelectItem>
            <SelectItem value="computing">Computing</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Year group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="eyfs">EYFS</SelectItem>
            <SelectItem value="year1">Year 1</SelectItem>
            <SelectItem value="year2">Year 2</SelectItem>
            <SelectItem value="year3">Year 3</SelectItem>
            <SelectItem value="year4">Year 4</SelectItem>
            <SelectItem value="year5">Year 5</SelectItem>
            <SelectItem value="year6">Year 6</SelectItem>
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
  
  // Render main tabs
  const renderTabs = () => (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="resources">Resource Usage</TabsTrigger>
        <TabsTrigger value="effectiveness">Resource Effectiveness</TabsTrigger>
        <TabsTrigger value="assessments">Assessment Types</TabsTrigger>
        <TabsTrigger value="impact">Assessment Impact</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        {renderOverviewTab()}
      </TabsContent>
      
      <TabsContent value="resources" className="mt-6 space-y-6">
        {renderResourceUsageTab()}
      </TabsContent>
      
      <TabsContent value="effectiveness" className="mt-6 space-y-6">
        {renderResourceEffectivenessTab()}
      </TabsContent>
      
      <TabsContent value="assessments" className="mt-6 space-y-6">
        {renderAssessmentTypesTab()}
      </TabsContent>
      
      <TabsContent value="impact" className="mt-6 space-y-6">
        {renderAssessmentImpactTab()}
      </TabsContent>
      
      <TabsContent value="recommendations" className="mt-6 space-y-6">
        {renderRecommendationsTab()}
      </TabsContent>
    </Tabs>
  );
  
  // Render overview tab
  const renderOverviewTab = () => (
    <>
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,742</div>
            <p className="text-xs text-muted-foreground">
              +12% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Usage
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,580</div>
            <p className="text-xs text-muted-foreground">
              +18% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "82%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assessment Completion
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "95%" }} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resource Effectiveness
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">
              +4% from previous term
            </p>
            <div className="mt-4 h-1 w-full bg-primary/10">
              <div className="h-1 bg-primary" style={{ width: "86%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource usage trend */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Usage Trend</CardTitle>
            <CardDescription>
              Usage metrics over the academic year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={resourceUsageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="digital"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Digital"
                  />
                  <Area
                    type="monotone"
                    dataKey="print"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Print"
                  />
                  <Area
                    type="monotone"
                    dataKey="interactive"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Interactive"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Types</CardTitle>
            <CardDescription>
              Distribution by assessment category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assessmentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resource effectiveness and assessment frequency */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Effectiveness</CardTitle>
            <CardDescription>
              Effectiveness vs. usage analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="usage" 
                    name="Usage" 
                    label={{ value: 'Usage', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="effectiveness" 
                    name="Effectiveness" 
                    label={{ value: 'Effectiveness (%)', angle: -90, position: 'left' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Resources" data={resourceEffectivenessData} fill="#8884d8">
                    {resourceEffectivenessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Frequency</CardTitle>
            <CardDescription>
              Monthly assessment distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentFrequencyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="formative" stackId="a" fill="#8884d8" name="Formative" />
                  <Bar dataKey="summative" stackId="a" fill="#82ca9d" name="Summative" />
                  <Bar dataKey="diagnostic" stackId="a" fill="#ffc658" name="Diagnostic" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Popular resources and assessment quality */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Resources</CardTitle>
            <CardDescription>
              Most frequently used teaching resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularResourcesData.slice(0, 5).map((resource, index) => (
                <div key={index} className="flex items-centre justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{resource.name}</p>
                    <div className="flex items-centre text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {resource.type}
                      </Badge>
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                  <Badge>{resource.downloads} uses</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Resources
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Quality</CardTitle>
            <CardDescription>
              Quality metrics for assessment tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={assessmentQualityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  // Render resource usage tab
  const renderResourceUsageTab = () => (
    <div>Resource Usage Content</div>
  );
  
  // Render resource effectiveness tab
  const renderResourceEffectivenessTab = () => (
    <div>Resource Effectiveness Content</div>
  );
  
  // Render assessment types tab
  const renderAssessmentTypesTab = () => (
    <div>Assessment Types Content</div>
  );
  
  // Render assessment impact tab
  const renderAssessmentImpactTab = () => (
    <div>Assessment Impact Content</div>
  );
  
  // Render recommendations tab
  const renderRecommendationsTab = () => (
    <div>Recommendations Content</div>
  );
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {renderHeader()}
      {renderFilterBar()}
      {renderTabs()}
    </div>
  );
}
