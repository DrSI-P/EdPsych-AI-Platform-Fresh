'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Download,
  Share,
  Filter,
  RefreshCw,
  Zap
} from 'lucide-react';

/**
 * EnhancedAnalytics Component
 * 
 * This component provides advanced analytics and data visualization
 * for the Educator Dashboard, with UK curriculum-aligned metrics
 * and customizable reporting options.
 */
export function EnhancedAnalytics() {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('term');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const performanceData = {
    overview: {
      averageScore: 72,
      completionRate: 86,
      improvementRate: 8.3,
      participationRate: 94,
      subjectBreakdown: [
        { subject: 'Mathematics', score: 68, trend: 'up' },
        { subject: 'English', score: 76, trend: 'stable' },
        { subject: 'Science', score: 74, trend: 'up' },
        { subject: 'History', score: 71, trend: 'down' },
        { subject: 'Geography', score: 69, trend: 'stable' }
      ],
      yearGroupBreakdown: [
        { year: 'Year 7', score: 74, students: 58 },
        { year: 'Year 8', score: 71, students: 62 },
        { year: 'Year 9', score: 69, students: 60 },
        { year: 'Year 10', score: 73, students: 56 },
        { year: 'Year 11', score: 76, students: 54 }
      ]
    },
    progress: {
      weeklyProgress: [
        { week: 'Week 1', progress: 62 },
        { week: 'Week 2', progress: 65 },
        { week: 'Week 3', progress: 68 },
        { week: 'Week 4', progress: 71 },
        { week: 'Week 5', progress: 73 },
        { week: 'Week 6', progress: 72 }
      ],
      learningObjectives: {
        completed: 68,
        inProgress: 24,
        notStarted: 8
      },
      keyCompetencies: [
        { competency: 'Critical Thinking', mastery: 72 },
        { competency: 'Problem Solving', mastery: 68 },
        { competency: 'Communication', mastery: 76 },
        { competency: 'Collaboration', mastery: 82 },
        { competency: 'Creativity', mastery: 74 }
      ]
    },
    engagement: {
      resourceUsage: [
        { resource: 'Interactive Lessons', usage: 86 },
        { resource: 'Video Content', usage: 78 },
        { resource: 'Practice Exercises', usage: 92 },
        { resource: 'Reading Materials', usage: 64 },
        { resource: 'Collaborative Tasks', usage: 72 }
      ],
      timeSpent: {
        average: 42, // minutes per session
        distribution: [
          { range: '0-15 min', percentage: 12 },
          { range: '15-30 min', percentage: 24 },
          { range: '30-45 min', percentage: 38 },
          { range: '45-60 min', percentage: 18 },
          { range: '60+ min', percentage: 8 }
        ]
      },
      participationTrend: [
        { month: 'Jan', participation: 88 },
        { month: 'Feb', participation: 90 },
        { month: 'Mar', participation: 92 },
        { month: 'Apr', participation: 94 },
        { month: 'May', participation: 93 }
      ]
    },
    interventions: {
      atRiskStudents: 14,
      interventionSuccess: 76,
      supportCategories: [
        { category: 'Academic Support', students: 8 },
        { category: 'Attendance Support', students: 4 },
        { category: 'Behavioural Support', students: 3 },
        { category: 'Wellbeing Support', students: 5 }
      ],
      improvementMetrics: [
        { metric: 'Assignment Completion', before: 62, after: 78 },
        { metric: 'Test Scores', before: 58, after: 72 },
        { metric: 'Participation', before: 64, after: 82 },
        { metric: 'Attendance', before: 76, after: 88 }
      ]
    }
  };

  // Simulate data loading
  useEffect(() => {
    if (selectedTimeframe !== 'term' || selectedSubject !== 'all' || selectedYearGroup !== 'all') {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedTimeframe, selectedSubject, selectedYearGroup]);

  // Helper function to get trend badge color
  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights aligned with UK curriculum standards
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]" aria-label="Select timeframe">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="term">This Term</SelectItem>
              <SelectItem value="year">This Academic Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[140px]" aria-label="Select subject">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="geography">Geography</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
            <SelectTrigger className="w-[140px]" aria-label="Select year group">
              <SelectValue placeholder="Year Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="year7">Year 7</SelectItem>
              <SelectItem value="year8">Year 8</SelectItem>
              <SelectItem value="year9">Year 9</SelectItem>
              <SelectItem value="year10">Year 10</SelectItem>
              <SelectItem value="year11">Year 11</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" aria-label="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {selectedTimeframe === 'custom' && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <DateRangePicker />
          </CardContent>
        </Card>
      )}
      
      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{performanceData.overview.averageScore}%</div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{performanceData.overview.completionRate}%</div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">+{performanceData.overview.improvementRate}%</div>
                      <p className="text-sm text-muted-foreground">Improvement Rate</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{performanceData.overview.participationRate}%</div>
                      <p className="text-sm text-muted-foreground">Participation Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Subject Performance
                    </CardTitle>
                    <CardDescription>
                      Average scores across subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart 
                        data={performanceData.overview.subjectBreakdown.map(item => ({
                          name: item.subject,
                          value: item.score
                        }))}
                        xAxisKey="name"
                        yAxisKey="value"
                        categories={["value"]}
                        colors={["#3b82f6"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-4">
                      {performanceData.overview.subjectBreakdown.map(subject => (
                        <Badge key={subject.subject} className={getTrendColor(subject.trend)}>
                          {subject.subject.substring(0, 3)} {subject.trend === 'up' ? '↑' : subject.trend === 'down' ? '↓' : '→'}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Year Group Distribution
                    </CardTitle>
                    <CardDescription>
                      Performance by year group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <PieChart 
                        data={performanceData.overview.yearGroupBreakdown.map(item => ({
                          name: item.year,
                          value: item.score
                        }))}
                        category="value"
                        index="name"
                        valueFormatter={(value) => `${value}%`}
                        colors={["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full grid grid-cols-5 gap-2 text-center text-xs">
                      {performanceData.overview.yearGroupBreakdown.map(year => (
                        <div key={year.year}>
                          <div className="font-medium">{year.year}</div>
                          <div className="text-muted-foreground">{year.students} students</div>
                        </div>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Weekly Progress Trend
                  </CardTitle>
                  <CardDescription>
                    Average progress over the last 6 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <LineChart 
                      data={performanceData.progress.weeklyProgress.map(item => ({
                        name: item.week,
                        value: item.progress
                      }))}
                      categories={["value"]}
                      index="name"
                      colors={["#3b82f6"]}
                      valueFormatter={(value) => `${value}%`}
                      showLegend={false}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Learning Objectives
                    </CardTitle>
                    <CardDescription>
                      Progress against UK curriculum objectives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <PieChart 
                        data={[
                          { name: "Completed", value: performanceData.progress.learningObjectives.completed },
                          { name: "In Progress", value: performanceData.progress.learningObjectives.inProgress },
                          { name: "Not Started", value: performanceData.progress.learningObjectives.notStarted }
                        ]}
                        category="value"
                        index="name"
                        valueFormatter={(value) => `${value}%`}
                        colors={["#22c55e", "#f59e0b", "#ef4444"]}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm">
                    <div>
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Completed: {performanceData.progress.learningObjectives.completed}%
                    </div>
                    <div>
                      <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                      In Progress: {performanceData.progress.learningObjectives.inProgress}%
                    </div>
                    <div>
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Not Started: {performanceData.progress.learningObjectives.notStarted}%
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Key Competencies
                    </CardTitle>
                    <CardDescription>
                      Mastery of essential skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <BarChart 
                        data={performanceData.progress.keyCompetencies.map(item => ({
                          name: item.competency,
                          value: item.mastery
                        }))}
                        xAxisKey="name"
                        yAxisKey="value"
                        categories={["value"]}
                        colors={["#3b82f6"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          {/* Engagement tab content would go here */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource usage chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Resource Usage
                </CardTitle>
                <CardDescription>
                  Engagement with different learning resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BarChart 
                    data={performanceData.engagement.resourceUsage.map(item => ({
                      name: item.resource,
                      value: item.usage
                    }))}
                    xAxisKey="name"
                    yAxisKey="value"
                    categories={["value"]}
                    colors={["#3b82f6"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Resources
                </Button>
              </CardFooter>
            </Card>
            
            {/* Time spent distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Time Spent Distribution
                </CardTitle>
                <CardDescription>
                  Average session duration: {performanceData.engagement.timeSpent.average} minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart 
                    data={performanceData.engagement.timeSpent.distribution.map(item => ({
                      name: item.range,
                      value: item.percentage
                    }))}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value}%`}
                    colors={["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm">
                <div>
                  Most common: 30-45 min ({performanceData.engagement.timeSpent.distribution[2].percentage}%)
                </div>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Participation trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
                Participation Trend
              </CardTitle>
              <CardDescription>
                Student engagement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <LineChart 
                  data={performanceData.engagement.participationTrend.map(item => ({
                    name: item.month,
                    value: item.participation
                  }))}
                  categories={["value"]}
                  index="name"
                  colors={["#3b82f6"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={false}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="interventions" className="space-y-6">
          {/* Interventions tab content would go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceData.interventions.atRiskStudents}</div>
                  <p className="text-sm text-muted-foreground">At-Risk Students</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceData.interventions.interventionSuccess}%</div>
                  <p className="text-sm text-muted-foreground">Intervention Success Rate</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceData.interventions.supportCategories.reduce((sum, cat) => sum + cat.students, 0)}</div>
                  <p className="text-sm text-muted-foreground">Students Receiving Support</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Support Categories
                </CardTitle>
                <CardDescription>
                  Distribution of intervention types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart 
                    data={performanceData.interventions.supportCategories.map(item => ({
                      name: item.category,
                      value: item.students
                    }))}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value} students`}
                    colors={["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm">
                <div>
                  Total: {performanceData.interventions.supportCategories.reduce((sum, cat) => sum + cat.students, 0)} students
                </div>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Improvement Metrics
                </CardTitle>
                <CardDescription>
                  Before and after intervention comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BarChart 
                    data={performanceData.interventions.improvementMetrics.flatMap(item => [
                      { name: item.metric, category: 'Before', value: item.before },
                      { name: item.metric, category: 'After', value: item.after }
                    ])}
                    xAxisKey="name"
                    yAxisKey="value"
                    categories={["value"]}
                    colors={["#94a3b8", "#3b82f6"]}
                    valueFormatter={(value) => `${value}%`}
                    stack
                    groupBy="category"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-slate-400 rounded-full mr-2"></span>
                    Before
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    After
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All Data
        </Button>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Generate Comprehensive Report
        </Button>
      </div>
    </div>
  );
}
