'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  BarChart,
  CheckCircle,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Target,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

// Types for type safety
interface Goal {
  id: string;
  name: string;
  description: string;
  category: string;
  targetDate: Date;
  baseline: number;
  target: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'achieved' | 'discontinued';
  notes: any[];
}

interface DataPoint {
  id: string;
  date: Date;
  value: number;
  notes: string;
}

export function ProgressMonitoringEngine() {
  const { toast } = useToast();
  
  // State for goals and data points
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  
  // State for UI
  const [activeTab, setActiveTab] = useState('goals');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sample goals data
  const sampleGoals: any[] = [
    {
      id: 'goal1',
      name: 'Reading Fluency',
      description: 'Increase reading fluency from 60 words per minute to 90 words per minute with 95% accuracy.',
      category: 'academic',
      targetDate: new Date(2025, 7, 15),
      baseline: 60,
      target: 90,
      progress: 75,
      status: 'in-progress',
      notes: [
        'Initial assessment completed on May 1, 2025',
        'Using repeated reading strategy with visual tracking support',
        'Mid-point check shows 25% improvement'
      ]
    },
    {
      id: 'goal2',
      name: 'Task Completion',
      description: 'Increase independent task completion from 40% to 80% of assigned classwork.',
      category: 'executive-function',
      targetDate: new Date(2025, 5, 30),
      baseline: 40,
      target: 80,
      progress: 65,
      status: 'in-progress',
      notes: [
        'Using visual checklist and timer',
        'Breaking tasks into smaller steps',
        'Reinforcement system in place'
      ]
    },
    {
      id: 'goal3',
      name: 'Social Interaction',
      description: 'Initiate positive peer interactions during unstructured time from 2 to 5 times per day.',
      category: 'social',
      targetDate: new Date(2025, 6, 20),
      baseline: 2,
      target: 5,
      progress: 100,
      status: 'achieved',
      notes: [
        'Social stories used as preparation',
        'Peer buddy system implemented',
        'Goal achieved on June 10, 2025'
      ]
    },
    {
      id: 'goal4',
      name: 'Math Problem Solving',
      description: 'Increase accuracy in multi-step math problems from 50% to 85%.',
      category: 'academic',
      targetDate: new Date(2025, 8, 10),
      baseline: 50,
      target: 85,
      progress: 30,
      status: 'in-progress',
      notes: [
        'Using visual problem-solving template',
        'Explicit strategy instruction in place',
        'Weekly progress monitoring'
      ]
    },
    {
      id: 'goal5',
      name: 'Emotional Regulation',
      description: 'Reduce emotional outbursts from 5 per week to 1 per week using self-regulation strategies.',
      category: 'behavioral',
      targetDate: new Date(2025, 7, 25),
      baseline: 5,
      target: 1,
      progress: 60,
      status: 'in-progress',
      notes: [
        'Using zones of regulation framework',
        'Self-monitoring chart implemented',
        'Calming corner established in classroom'
      ]
    }
  ];
  
  // Sample data points for the first goal
  const sampleDataPoints: any[] = [
    {
      id: 'dp1',
      date: new Date(2025, 4, 1),
      value: 60,
      notes: 'Baseline assessment'
    },
    {
      id: 'dp2',
      date: new Date(2025, 4, 8),
      value: 63,
      notes: 'First week of intervention'
    },
    {
      id: 'dp3',
      date: new Date(2025, 4, 15),
      value: 67,
      notes: 'Showing steady improvement'
    },
    {
      id: 'dp4',
      date: new Date(2025, 4, 22),
      value: 70,
      notes: 'Consistent practice at home and school'
    },
    {
      id: 'dp5',
      date: new Date(2025, 4, 29),
      value: 75,
      notes: 'Implemented additional visual supports'
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    // Simulate API call to load goals
    const loadGoals = async () => {
      try {
        // In a real implementation, this would be an API call
        setTimeout(() => {
          setGoals(sampleGoals);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load goals. Please try again.',
          variant: 'destructive'
        });
      }
    };
    
    loadGoals();
  }, [toast]);
  
  // Load data points when a goal is selected
  useEffect(() => {
    if (selectedGoal) {
      setIsLoading(true);
      // Simulate API call to load data points for the selected goal
      setTimeout(() => {
        setDataPoints(sampleDataPoints);
        setIsLoading(false);
      }, 800);
    }
  }, [selectedGoal]);
  
  // Handle goal selection
  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setActiveTab('progress');
  };
  
  // Filter goals based on search query and filters
  const filteredGoals = goals.filter(goal => {
    // Search query filter
    if (searchQuery && !goal.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !goal.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && goal.category !== categoryFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && goal.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'achieved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-600';
    if (progress < 70) return 'bg-yellow-600';
    return 'bg-green-600';
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="progress">Progress Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Goals Dashboard
              </CardTitle>
              <CardDescription>
                Create, view, and manage personalized learning and development goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search goals..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="executive-function">Executive Function</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="achieved">Achieved</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredGoals.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredGoals.map((goal) => (
                    <Card 
                      key={goal.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleGoalSelect(goal)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                            <div className="flex space-x-2 mt-1">
                              <Badge>{goal.category}</Badge>
                              <Badge className={getStatusColor(goal.status)}>
                                {goal.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Target Date</p>
                            <p className="text-sm font-medium">{formatDate(goal.targetDate)}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm mb-3">{goal.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress: {goal.baseline} → {goal.target}</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoalSelect(goal);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGoal(goal);
                            setActiveTab('progress');
                          }}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Track Progress
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-muted/50 rounded-md">
                  <p className="text-muted-foreground mb-4">No goals found matching your filters</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Goal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Progress Monitoring Tab */}
        <TabsContent value="progress" className="space-y-4">
          {selectedGoal ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedGoal.name}</CardTitle>
                      <CardDescription>
                        Track and monitor progress toward this goal
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge>{selectedGoal.category}</Badge>
                      <Badge className={getStatusColor(selectedGoal.status)}>
                        {selectedGoal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Goal Description</h3>
                    <p className="text-sm">{selectedGoal.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <h4 className="text-xs text-muted-foreground">Baseline</h4>
                        <p className="text-2xl font-bold">{selectedGoal.baseline}</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <h4 className="text-xs text-muted-foreground">Current</h4>
                        <p className="text-2xl font-bold">
                          {Math.round(selectedGoal.baseline + (selectedGoal.target - selectedGoal.baseline) * (selectedGoal.progress / 100))}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <h4 className="text-xs text-muted-foreground">Target</h4>
                        <p className="text-2xl font-bold">{selectedGoal.target}</p>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Overall Progress</span>
                      <span>{selectedGoal.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressColor(selectedGoal.progress)}`}
                        style={{ width: `${selectedGoal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Notes</h3>
                    <div className="space-y-2">
                      {selectedGoal.notes.map((note, index) => (
                        <div key={index} className="bg-muted p-2 rounded-md text-sm">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progress Data</CardTitle>
                  <CardDescription>
                    Record and visualize progress data points
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <LineChart className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Progress trend visualization</span>
                      </div>
                      
                      <div className="border rounded-md">
                        <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted font-medium text-sm">
                          <div>Date</div>
                          <div>Value</div>
                          <div>Change</div>
                          <div>Notes</div>
                        </div>
                        <div className="divide-y">
                          {dataPoints.map((dataPoint, index) => {
                            const prevValue = index > 0 ? dataPoints[index - 1].value : selectedGoal.baseline;
                            const change = dataPoint.value - prevValue;
                            const changePercent = ((change / prevValue) * 100).toFixed(1);
                            
                            return (
                              <div key={dataPoint.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                                <div className="text-sm">{formatDate(dataPoint.date)}</div>
                                <div className="font-medium">{dataPoint.value}</div>
                                <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {change >= 0 ? '+' : ''}{change} ({change >= 0 ? '+' : ''}{changePercent}%)
                                </div>
                                <div className="text-sm">{dataPoint.notes}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data Point
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add New Data Point</CardTitle>
                  <CardDescription>
                    Record a new measurement for this goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <DatePicker />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Value</Label>
                        <Input id="value" type="number" placeholder="Enter measurement value" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Add notes about this data point..." />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Data Point</Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[400px]">
                <p className="text-muted-foreground mb-4">Select a goal to monitor progress</p>
                <Button onClick={() => setActiveTab('goals')}>View Goals</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Reports & Analysis Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Progress Analysis
              </CardTitle>
              <CardDescription>
                Analyze progress data and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Goal Achievement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Pie chart visualization</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Achieved (20%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">In Progress (60%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                        <span className="text-sm">Not Started (15%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Discontinued (5%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Progress by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <BarChart className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Bar chart visualization</span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Academic</span>
                          <span>68%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Behavioral</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Social</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Executive Function</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Line chart visualization</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Generate Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select defaultValue="progress">
                        <SelectTrigger id="reportType">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="progress">Progress Summary</SelectItem>
                          <SelectItem value="detailed">Detailed Analysis</SelectItem>
                          <SelectItem value="comparison">Comparison Report</SelectItem>
                          <SelectItem value="trend">Trend Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select defaultValue="30days">
                        <SelectTrigger id="dateRange">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 days</SelectItem>
                          <SelectItem value="30days">Last 30 days</SelectItem>
                          <SelectItem value="90days">Last 90 days</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="format">Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoTrack">Automatic Tracking</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically track progress from connected systems
                        </p>
                      </div>
                      <Switch id="autoTrack" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Progress Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive alerts for significant progress changes
                        </p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sharing">Data Sharing</Label>
                        <p className="text-xs text-muted-foreground">
                          Share progress data with authorized team members
                        </p>
                      </div>
                      <Switch id="sharing" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reminders">Tracking Reminders</Label>
                        <p className="text-xs text-muted-foreground">
                          Send reminders for scheduled progress monitoring
                        </p>
                      </div>
                      <Switch id="reminders" defaultChecked />
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProgressMonitoringEngine;
