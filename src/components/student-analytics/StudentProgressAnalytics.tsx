"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Download, Filter, RefreshCw, Calendar as CalendarIcon, 
  HelpCircle, BookOpen, Award, TrendingUp, AlertTriangle, 
  CheckCircle, Info, FileText, ArrowUp, ArrowDown
} from 'lucide-react';
import { StudentProgressTracking } from '../analytics/student-progress-tracking';

/**
 * StudentProgressAnalytics Component
 * 
 * A comprehensive analytics dashboard for tracking student progress
 * aligned with UK curriculum standards and educational psychology principles.
 * Provides personalized insights for both educators and students.
 */
export default function StudentProgressAnalytics() {
  const [viewMode, setViewMode] = useState<'educator' | 'student'>('educator');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('term');
  
  // Sample data for curriculum coverage
  const curriculumCoverageData = [
    { subject: 'Mathematics', covered: 78, target: 85 },
    { subject: 'English', covered: 82, target: 80 },
    { subject: 'Science', covered: 65, target: 75 },
    { subject: 'History', covered: 70, target: 70 },
    { subject: 'Geography', covered: 60, target: 65 },
  ];
  
  // Sample data for learning style effectiveness
  const learningStyleData = [
    { name: 'Visual', value: 35, color: '#4ade80' },
    { name: 'Auditory', value: 25, color: '#facc15' },
    { name: 'Kinesthetic', value: 20, color: '#fb923c' },
    { name: 'Reading/Writing', value: 20, color: '#f87171' },
  ];
  
  // Sample data for progress over time
  const progressTimeData = [
    { month: 'Sep', score: 65, average: 68 },
    { month: 'Oct', score: 68, average: 70 },
    { month: 'Nov', score: 72, average: 71 },
    { month: 'Dec', score: 76, average: 73 },
    { month: 'Jan', score: 78, average: 75 },
    { month: 'Feb', score: 82, average: 78 },
  ];
  
  // Sample data for areas of strength and improvement
  const strengthsWeaknessesData = [
    { area: 'Problem Solving', score: 85, benchmark: 75 },
    { area: 'Critical Thinking', score: 78, benchmark: 75 },
    { area: 'Communication', score: 65, benchmark: 75 },
    { area: 'Collaboration', score: 72, benchmark: 75 },
    { area: 'Creativity', score: 80, benchmark: 75 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Progress Analytics</h1>
          <p className="text-muted-foreground">
            Evidence-based insights aligned with UK curriculum standards
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <Select value={viewMode} onValueChange={(value: 'educator' | 'student') => setViewMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educator">Educator View</SelectItem>
              <SelectItem value="student">Student View</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* AI Avatar Video Placeholder */}
      <Card className="mb-6 border-dashed border-2 border-primary/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">AI Avatar Video Guide</CardTitle>
          <CardDescription>
            This video explains how to use the Student Progress Analytics features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="bg-muted/50 rounded-lg p-8 text-center w-full">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Avatar Video Placeholder</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This video will guide users through the analytics features, explaining how to interpret data and use insights to improve learning outcomes.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum Coverage</TabsTrigger>
          <TabsTrigger value="learning-styles">Learning Styles</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from previous term
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "78%" }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Curriculum Coverage
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">
                  Target: 75% for this term
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "72%" }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Learning Objectives Met
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42/55</div>
                <p className="text-xs text-muted-foreground">
                  76% completion rate
                </p>
                <div className="mt-4 h-1 w-full bg-primary/10">
                  <div className="h-1 bg-primary" style={{ width: "76%" }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Areas Needing Focus
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Down from 5 last term
                </p>
                <div className="mt-4 flex space-x-1">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Fractions</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Essay Writing</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Scientific Inquiry</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>
                  Performance trend across the academic term
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        name="Student Score" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#94a3b8" 
                        strokeDasharray="5 5" 
                        name="Class Average" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Strengths & Areas for Improvement</CardTitle>
                <CardDescription>
                  Comparison against key competency benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strengthsWeaknessesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#3b82f6" name="Student Score" />
                      <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium">Strengths:</span>
                    </div>
                    <span className="text-sm">Problem Solving, Creativity</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm font-medium">Focus Areas:</span>
                    </div>
                    <span className="text-sm">Communication</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Curriculum Coverage Tab */}
        <TabsContent value="curriculum" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UK Curriculum Coverage</CardTitle>
              <CardDescription>
                Progress against national curriculum objectives by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={curriculumCoverageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="covered" fill="#3b82f6" name="Covered" />
                    <Bar dataKey="target" fill="#94a3b8" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">English</p>
                    <p className="text-xs text-muted-foreground">Above target</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Mathematics</p>
                    <p className="text-xs text-muted-foreground">Near target</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Science</p>
                    <p className="text-xs text-muted-foreground">Below target</p>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Stage Objectives</CardTitle>
              <CardDescription>
                Detailed breakdown of curriculum objectives by key stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Key Stage 1 (Years 1-2)</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Key Stage 2 (Years 3-6)</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Key Stage 3 (Years 7-9)</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-amber-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Key Stage 4 (Years 10-11)</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Full Curriculum Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Learning Styles Tab */}
        <TabsContent value="learning-styles" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Style Effectiveness</CardTitle>
              <CardDescription>
                Analysis of engagement and performance across different learning styles
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={learningStyleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {learningStyleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6">
                <h4 className="text-lg font-medium mb-4">Learning Style Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 mt-1 rounded-full bg-[#4ade80]" />
                    <div>
                      <p className="font-medium">Visual Learning (35%)</p>
                      <p className="text-sm text-muted-foreground">
                        Strongest learning style. Responds well to diagrams, charts, and visual demonstrations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 mt-1 rounded-full bg-[#facc15]" />
                    <div>
                      <p className="font-medium">Auditory Learning (25%)</p>
                      <p className="text-sm text-muted-foreground">
                        Good comprehension through discussions and verbal explanations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 mt-1 rounded-full bg-[#fb923c]" />
                    <div>
                      <p className="font-medium">Kinesthetic Learning (20%)</p>
                      <p className="text-sm text-muted-foreground">
                        Benefits from hands-on activities and practical applications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 mt-1 rounded-full bg-[#f87171]" />
                    <div>
                      <p className="font-medium">Reading/Writing (20%)</p>
                      <p className="text-sm text-muted-foreground">
                        Shows good engagement with text-based materials and written exercises.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Personalized Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  Based on learning style analysis, we recommend increasing visual learning materials and incorporating more interactive diagrams and video content to maximize engagement and comprehension.
                </p>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Adaptation Effectiveness</CardTitle>
              <CardDescription>
                Performance comparison across different content presentation styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Visual Content</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    High engagement with diagrams, charts, and visual demonstrations
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Audio Content</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: "72%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Good comprehension of lectures and discussions
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Interactive Content</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strong engagement with hands-on activities and simulations
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Text-Based Content</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full">
                    <div className="h-2 bg-amber-500 rounded-full" style={{ width: "68%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moderate engagement with reading materials and written exercises
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Detailed Analytics Tab */}
        <TabsContent value="detailed" className="mt-6">
          <StudentProgressTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
}
