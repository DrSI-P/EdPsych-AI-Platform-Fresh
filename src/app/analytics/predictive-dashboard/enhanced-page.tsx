import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  User,
  Users,
  BookOpen,
  FileText,
  Brain,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target
} from 'lucide-react';

// Import analytics types and services
import { 
  PredictiveModel, 
  PredictionResult, 
  PerformanceTrend,
  RiskLevel,
  InterventionRecommendation
} from '@/lib/analytics/predictiveTypes';
import { getStudentPredictions, getClassPredictions } from '@/lib/analytics/predictiveModels';
import { AnalyticsTimeframe, AnalyticsMetric } from '@/lib/analytics/analyticsService';

// Mock data for demonstration
const mockStudents = [
  {
    id: 's1',
    firstName: 'Emma',
    lastName: 'Johnson',
    yearGroup: 5,
    keyStage: 'KS2',
    class: 'Oak',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/student-1.png',
    learningStyle: 'VISUAL',
    currentPerformance: {
      english: 78,
      mathematics: 82,
      science: 75,
      overall: 78
    },
    predictedPerformance: {
      english: 82,
      mathematics: 85,
      science: 79,
      overall: 82
    },
    performanceTrend: 'IMPROVING',
    engagementLevel: 'HIGH',
    attendanceRate: 96,
    completionRate: 92,
    learningGaps: [
      {
        subject: 'Mathematics',
        topic: 'Fractions',
        severity: 'MEDIUM',
        recommendation: 'Additional practice with equivalent fractions'
      },
      {
        subject: 'English',
        topic: 'Comprehension',
        severity: 'LOW',
        recommendation: 'Reading more complex texts with inference questions'
      }
    ],
    riskLevel: 'LOW',
    interventions: [
      {
        id: 'i1',
        type: 'ADDITIONAL_SUPPORT',
        subject: 'Mathematics',
        topic: 'Fractions',
        status: 'IN_PROGRESS',
        startDate: new Date('2025-05-15'),
        effectiveness: 'MEDIUM'
      }
    ]
  },
  {
    id: 's2',
    firstName: 'James',
    lastName: 'Smith',
    yearGroup: 5,
    keyStage: 'KS2',
    class: 'Oak',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/student-2.png',
    learningStyle: 'KINESTHETIC',
    currentPerformance: {
      english: 65,
      mathematics: 58,
      science: 70,
      overall: 64
    },
    predictedPerformance: {
      english: 68,
      mathematics: 62,
      science: 72,
      overall: 67
    },
    performanceTrend: 'STABLE',
    engagementLevel: 'MEDIUM',
    attendanceRate: 92,
    completionRate: 78,
    learningGaps: [
      {
        subject: 'Mathematics',
        topic: 'Multiplication',
        severity: 'HIGH',
        recommendation: 'Targeted intervention with multiplication tables'
      },
      {
        subject: 'Mathematics',
        topic: 'Problem Solving',
        severity: 'MEDIUM',
        recommendation: 'Structured approach to word problems'
      },
      {
        subject: 'English',
        topic: 'Writing',
        severity: 'MEDIUM',
        recommendation: 'Sentence structure and paragraph organization'
      }
    ],
    riskLevel: 'MEDIUM',
    interventions: [
      {
        id: 'i2',
        type: 'TARGETED_INTERVENTION',
        subject: 'Mathematics',
        topic: 'Multiplication',
        status: 'SCHEDULED',
        startDate: new Date('2025-06-01'),
        effectiveness: null
      }
    ]
  },
  {
    id: 's3',
    firstName: 'Sophia',
    lastName: 'Williams',
    yearGroup: 5,
    keyStage: 'KS2',
    class: 'Oak',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/student-3.png',
    learningStyle: 'AUDITORY',
    currentPerformance: {
      english: 88,
      mathematics: 92,
      science: 90,
      overall: 90
    },
    predictedPerformance: {
      english: 90,
      mathematics: 94,
      science: 92,
      overall: 92
    },
    performanceTrend: 'IMPROVING',
    engagementLevel: 'HIGH',
    attendanceRate: 98,
    completionRate: 96,
    learningGaps: [],
    riskLevel: 'LOW',
    interventions: []
  },
  {
    id: 's4',
    firstName: 'Ethan',
    lastName: 'Brown',
    yearGroup: 5,
    keyStage: 'KS2',
    class: 'Oak',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/student-4.png',
    learningStyle: 'READ_WRITE',
    currentPerformance: {
      english: 72,
      mathematics: 68,
      science: 75,
      overall: 72
    },
    predictedPerformance: {
      english: 70,
      mathematics: 65,
      science: 73,
      overall: 69
    },
    performanceTrend: 'DECLINING',
    engagementLevel: 'LOW',
    attendanceRate: 88,
    completionRate: 75,
    learningGaps: [
      {
        subject: 'Mathematics',
        topic: 'Decimals',
        severity: 'MEDIUM',
        recommendation: 'Visual representations of decimal concepts'
      },
      {
        subject: 'English',
        topic: 'Spelling',
        severity: 'HIGH',
        recommendation: 'Regular practice with high-frequency words'
      },
      {
        subject: 'Science',
        topic: 'Scientific Inquiry',
        severity: 'LOW',
        recommendation: 'More hands-on experiments'
      }
    ],
    riskLevel: 'HIGH',
    interventions: [
      {
        id: 'i3',
        type: 'PARENT_TEACHER_MEETING',
        subject: 'General',
        topic: 'Engagement and Attendance',
        status: 'COMPLETED',
        startDate: new Date('2025-05-10'),
        effectiveness: 'LOW'
      },
      {
        id: 'i4',
        type: 'TARGETED_INTERVENTION',
        subject: 'English',
        topic: 'Spelling',
        status: 'IN_PROGRESS',
        startDate: new Date('2025-05-20'),
        effectiveness: 'MEDIUM'
      }
    ]
  },
  {
    id: 's5',
    firstName: 'Olivia',
    lastName: 'Jones',
    yearGroup: 5,
    keyStage: 'KS2',
    class: 'Oak',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/student-5.png',
    learningStyle: 'VISUAL',
    currentPerformance: {
      english: 85,
      mathematics: 78,
      science: 82,
      overall: 82
    },
    predictedPerformance: {
      english: 87,
      mathematics: 80,
      science: 84,
      overall: 84
    },
    performanceTrend: 'IMPROVING',
    engagementLevel: 'HIGH',
    attendanceRate: 95,
    completionRate: 90,
    learningGaps: [
      {
        subject: 'Mathematics',
        topic: 'Geometry',
        severity: 'LOW',
        recommendation: 'Additional practice with angles and shapes'
      }
    ],
    riskLevel: 'LOW',
    interventions: []
  }
];

// Mock class data
const mockClassData = {
  id: 'c1',
  name: 'Oak',
  yearGroup: 5,
  keyStage: 'KS2',
  school: 'Oakwood Primary School',
  teacherName: 'Ms. Wilson',
  studentCount: 28,
  averagePerformance: {
    english: 76,
    mathematics: 74,
    science: 78,
    overall: 76
  },
  performanceDistribution: {
    high: 32, // percentage
    medium: 45, // percentage
    low: 23 // percentage
  },
  attendanceRate: 94,
  completionRate: 86,
  learningGapHotspots: [
    {
      subject: 'Mathematics',
      topic: 'Fractions',
      affectedPercentage: 35,
      averageSeverity: 'MEDIUM'
    },
    {
      subject: 'English',
      topic: 'Comprehension',
      affectedPercentage: 28,
      averageSeverity: 'MEDIUM'
    },
    {
      subject: 'Mathematics',
      topic: 'Problem Solving',
      affectedPercentage: 42,
      averageSeverity: 'MEDIUM'
    }
  ],
  riskDistribution: {
    high: 15, // percentage
    medium: 25, // percentage
    low: 60 // percentage
  },
  interventionEffectiveness: {
    high: 40, // percentage
    medium: 35, // percentage
    low: 25 // percentage
  }
};

// Mock historical performance data for trend analysis
const mockHistoricalData = {
  timeframes: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
  performance: {
    english: [72, 73, 74, 75, 74, 75, 76, 77, 76],
    mathematics: [70, 71, 72, 73, 73, 74, 74, 75, 74],
    science: [74, 75, 76, 77, 77, 78, 78, 79, 78],
    overall: [72, 73, 74, 75, 75, 76, 76, 77, 76]
  },
  attendance: [92, 93, 94, 93, 92, 93, 94, 95, 94],
  completion: [84, 85, 85, 86, 85, 86, 87, 87, 86],
  engagement: {
    high: [30, 31, 32, 32, 31, 32, 33, 34, 32],
    medium: [45, 45, 44, 45, 46, 45, 44, 43, 45],
    low: [25, 24, 24, 23, 23, 23, 23, 23, 23]
  }
};

// Mock intervention recommendations
const mockInterventionRecommendations = [
  {
    id: 'ir1',
    targetGroup: 'HIGH_RISK',
    subject: 'Mathematics',
    topic: 'Multiplication and Division',
    description: 'Targeted small group intervention focusing on multiplication and division concepts for students at high risk.',
    expectedImpact: 'HIGH',
    resourceRequirements: 'Teacher or teaching assistant, 3 sessions per week, 30 minutes per session',
    affectedStudentCount: 4
  },
  {
    id: 'ir2',
    targetGroup: 'MEDIUM_RISK',
    subject: 'English',
    topic: 'Reading Comprehension',
    description: 'Guided reading sessions with focus on inference and deduction skills for medium risk students.',
    expectedImpact: 'MEDIUM',
    resourceRequirements: 'Teacher, 2 sessions per week, 20 minutes per session',
    affectedStudentCount: 7
  },
  {
    id: 'ir3',
    targetGroup: 'SPECIFIC_TOPIC',
    subject: 'Mathematics',
    topic: 'Fractions',
    description: 'Additional practice and visual representations of fraction concepts for students struggling with this topic.',
    expectedImpact: 'HIGH',
    resourceRequirements: 'Teaching assistant, 2 sessions per week, 20 minutes per session',
    affectedStudentCount: 10
  },
  {
    id: 'ir4',
    targetGroup: 'ENGAGEMENT',
    subject: 'General',
    topic: 'Engagement and Motivation',
    description: 'Implement gamification elements and personalized learning paths to increase engagement for disengaged students.',
    expectedImpact: 'MEDIUM',
    resourceRequirements: 'Digital resources, teacher monitoring',
    affectedStudentCount: 6
  },
  {
    id: 'ir5',
    targetGroup: 'ATTENDANCE',
    subject: 'General',
    topic: 'Attendance',
    description: 'Parent communication and incentive system for students with attendance concerns.',
    expectedImpact: 'MEDIUM',
    resourceRequirements: 'Administrative support, teacher time for parent communication',
    affectedStudentCount: 3
  }
];

export default function PredictiveDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('term');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [selectedSubject, setSelectedSubject] = useState('overall');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filter students based on search query and risk level
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = searchQuery === '' || 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = selectedRiskLevel === 'all' || 
      (selectedRiskLevel === 'high' && student.riskLevel === 'HIGH') ||
      (selectedRiskLevel === 'medium' && student.riskLevel === 'MEDIUM') ||
      (selectedRiskLevel === 'low' && student.riskLevel === 'LOW');
    
    return matchesSearch && matchesRisk;
  });
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Get trend icon based on performance trend
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'IMPROVING':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'DECLINING':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'STABLE':
      default:
        return <ArrowRight className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get risk level badge
  const getRiskBadge = (level) => {
    switch (level) {
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Risk</Badge>;
      case 'LOW':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get severity badge
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'LOW':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get intervention status badge
  const getInterventionStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'SCHEDULED':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Scheduled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get effectiveness badge
  const getEffectivenessBadge = (effectiveness) => {
    if (effectiveness === null) return null;
    
    switch (effectiveness) {
      case 'HIGH':
        return <Badge className="bg-green-100 text-green-800 border-green-200">High Impact</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium Impact</Badge>;
      case 'LOW':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low Impact</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Get expected impact badge
  const getExpectedImpactBadge = (impact) => {
    switch (impact) {
      case 'HIGH':
        return <Badge className="bg-green-100 text-green-800 border-green-200">High Impact</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium Impact</Badge>;
      case 'LOW':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low Impact</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };
  
  // Calculate performance difference
  const getPerformanceDifference = (current, predicted) => {
    const diff = predicted - current;
    if (diff > 0) {
      return <span className="text-green-600 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" />+{diff.toFixed(1)}</span>;
    } else if (diff < 0) {
      return <span className="text-red-600 flex items-center"><ArrowDownRight className="h-3 w-3 mr-1" />{diff.toFixed(1)}</span>;
    } else {
      return <span className="text-blue-600 flex items-center"><ArrowRight className="h-3 w-3 mr-1" />0</span>;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Predictive Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Advanced analytics and predictions to support student success
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">{mockClassData.averagePerformance[selectedSubject]}%</div>
              <div className="text-sm text-muted-foreground mb-4">Current Average</div>
              
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${mockClassData.averagePerformance[selectedSubject]}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600">+2.5%</span>
                <span className="text-muted-foreground ml-1">predicted improvement</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></span>
                    High Risk
                  </span>
                  <span className="text-sm font-medium">{mockClassData.riskDistribution.high}%</span>
                </div>
                <Progress value={mockClassData.riskDistribution.high} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block mr-2"></span>
                    Medium Risk
                  </span>
                  <span className="text-sm font-medium">{mockClassData.riskDistribution.medium}%</span>
                </div>
                <Progress value={mockClassData.riskDistribution.medium} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
                    Low Risk
                  </span>
                  <span className="text-sm font-medium">{mockClassData.riskDistribution.low}%</span>
                </div>
                <Progress value={mockClassData.riskDistribution.low} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Learning Gap Hotspots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockClassData.learningGapHotspots.map((hotspot, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{hotspot.subject}: {hotspot.topic}</span>
                    <span className="text-sm font-medium">{hotspot.affectedPercentage}%</span>
                  </div>
                  <Progress 
                    value={hotspot.affectedPercentage} 
                    className={`h-2 ${
                      hotspot.averageSeverity === 'HIGH' ? 'bg-red-100' : 
                      hotspot.averageSeverity === 'MEDIUM' ? 'bg-amber-100' : 
                      'bg-blue-100'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Intervention Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="10" 
                    strokeDasharray={`${mockClassData.interventionEffectiveness.high * 2.83} 283`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{mockClassData.interventionEffectiveness.high}%</span>
                </div>
              </div>
              <p className="text-sm text-center">
                {mockClassData.interventionEffectiveness.high}% of interventions show high effectiveness
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Student Predictions
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="interventions">
            <Target className="h-4 w-4 mr-2" />
            Intervention Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Overview</CardTitle>
              <CardDescription>
                Current and predicted performance metrics for {mockClassData.name} class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Subject Performance</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">English</span>
                          <span className="text-sm font-medium">{mockClassData.averagePerformance.english}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.averagePerformance.english}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Mathematics</span>
                          <span className="text-sm font-medium">{mockClassData.averagePerformance.mathematics}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.averagePerformance.mathematics}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Science</span>
                          <span className="text-sm font-medium">{mockClassData.averagePerformance.science}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.averagePerformance.science}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Overall</span>
                          <span className="text-sm font-medium">{mockClassData.averagePerformance.overall}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.averagePerformance.overall}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Performance Distribution</h3>
                    
                    <div className="h-40 bg-slate-50 rounded-lg border p-4 flex items-end justify-around">
                      <div className="flex flex-col items-center">
                        <div 
                          className="bg-green-500 w-16 rounded-t-sm" 
                          style={{ height: `${mockClassData.performanceDistribution.high * 1.2}px` }}
                        ></div>
                        <span className="text-xs mt-1">High</span>
                        <span className="text-xs font-medium">{mockClassData.performanceDistribution.high}%</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 w-16 rounded-t-sm" 
                          style={{ height: `${mockClassData.performanceDistribution.medium * 1.2}px` }}
                        ></div>
                        <span className="text-xs mt-1">Medium</span>
                        <span className="text-xs font-medium">{mockClassData.performanceDistribution.medium}%</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className="bg-amber-500 w-16 rounded-t-sm" 
                          style={{ height: `${mockClassData.performanceDistribution.low * 1.2}px` }}
                        ></div>
                        <span className="text-xs mt-1">Low</span>
                        <span className="text-xs font-medium">{mockClassData.performanceDistribution.low}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Engagement Metrics</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Attendance Rate</span>
                          <span className="text-sm font-medium">{mockClassData.attendanceRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Completion Rate</span>
                          <span className="text-sm font-medium">{mockClassData.completionRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mockClassData.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Key Insight
                        </h5>
                        <p className="text-sm">
                          Students with attendance rates below 90% show a 15% lower performance prediction on average. Consider targeted interventions for attendance improvement.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Risk Analysis</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">High Risk Students</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{Math.round(mockClassData.riskDistribution.high * mockClassData.studentCount / 100)} students</span>
                          <span className="text-sm font-medium">{mockClassData.riskDistribution.high}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Medium Risk Students</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{Math.round(mockClassData.riskDistribution.medium * mockClassData.studentCount / 100)} students</span>
                          <span className="text-sm font-medium">{mockClassData.riskDistribution.medium}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg border p-3">
                        <h5 className="text-sm font-medium mb-2">Low Risk Students</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{Math.round(mockClassData.riskDistribution.low * mockClassData.studentCount / 100)} students</span>
                          <span className="text-sm font-medium">{mockClassData.riskDistribution.low}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Key Areas for Attention
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Mathematics: Fractions</h4>
                      <p className="text-sm">
                        35% of students show gaps in understanding fractions concepts, particularly with equivalent fractions and operations.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Mathematics: Problem Solving</h4>
                      <p className="text-sm">
                        42% of students struggle with applying mathematical concepts to word problems and real-world scenarios.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">English: Comprehension</h4>
                      <p className="text-sm">
                        28% of students show difficulties with inference and deduction in reading comprehension tasks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 rounded-full p-1">
                        <User className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.firstName} {student.lastName}</CardTitle>
                        <CardDescription>Year {student.yearGroup}, {student.class} Class</CardDescription>
                      </div>
                    </div>
                    <div>
                      {getRiskBadge(student.riskLevel)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Performance Prediction</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg border p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Current</span>
                            <span className="text-xs text-muted-foreground">Predicted</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">{student.currentPerformance[selectedSubject]}%</span>
                            <span className="text-sm">
                              {getPerformanceDifference(
                                student.currentPerformance[selectedSubject], 
                                student.predictedPerformance[selectedSubject]
                              )}
                            </span>
                            <span className="text-lg font-medium">{student.predictedPerformance[selectedSubject]}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full mt-2">
                            <div 
                              className={`h-1 rounded-full ${
                                student.performanceTrend === 'IMPROVING' ? 'bg-green-500' : 
                                student.performanceTrend === 'DECLINING' ? 'bg-red-500' : 
                                'bg-blue-500'
                              }`} 
                              style={{ width: `${student.currentPerformance[selectedSubject]}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg border p-3">
                          <h5 className="text-xs text-muted-foreground mb-1">Trend</h5>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(student.performanceTrend)}
                            <span className="font-medium">
                              {student.performanceTrend === 'IMPROVING' ? 'Improving' : 
                               student.performanceTrend === 'DECLINING' ? 'Declining' : 
                               'Stable'}
                            </span>
                          </div>
                          <div className="mt-2 text-xs">
                            <div className="flex justify-between">
                              <span>Engagement: {student.engagementLevel}</span>
                              <span>Attendance: {student.attendanceRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {student.learningGaps.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Learning Gaps</h4>
                        <div className="space-y-2">
                          {student.learningGaps.map((gap, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded-lg border p-2">
                              <div>
                                <span className="text-sm">{gap.subject}: {gap.topic}</span>
                              </div>
                              <div>
                                {getSeverityBadge(gap.severity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedStudent && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Detailed Analysis: {selectedStudent.firstName} {selectedStudent.lastName}</CardTitle>
                    <CardDescription>Comprehensive prediction and intervention analysis</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Performance Predictions</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">English</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{selectedStudent.currentPerformance.english}%</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="text-sm font-medium">{selectedStudent.predictedPerformance.english}%</span>
                              {getPerformanceDifference(
                                selectedStudent.currentPerformance.english, 
                                selectedStudent.predictedPerformance.english
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={selectedStudent.currentPerformance.english} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Mathematics</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{selectedStudent.currentPerformance.mathematics}%</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="text-sm font-medium">{selectedStudent.predictedPerformance.mathematics}%</span>
                              {getPerformanceDifference(
                                selectedStudent.currentPerformance.mathematics, 
                                selectedStudent.predictedPerformance.mathematics
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={selectedStudent.currentPerformance.mathematics} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Science</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{selectedStudent.currentPerformance.science}%</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="text-sm font-medium">{selectedStudent.predictedPerformance.science}%</span>
                              {getPerformanceDifference(
                                selectedStudent.currentPerformance.science, 
                                selectedStudent.predictedPerformance.science
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={selectedStudent.currentPerformance.science} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Overall</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{selectedStudent.currentPerformance.overall}%</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="text-sm font-medium">{selectedStudent.predictedPerformance.overall}%</span>
                              {getPerformanceDifference(
                                selectedStudent.currentPerformance.overall, 
                                selectedStudent.predictedPerformance.overall
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={selectedStudent.currentPerformance.overall} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-slate-50 rounded-lg border p-3">
                        <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Attendance:</span>
                            <span className="font-medium ml-1">{selectedStudent.attendanceRate}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completion:</span>
                            <span className="font-medium ml-1">{selectedStudent.completionRate}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Engagement:</span>
                            <span className="font-medium ml-1">{selectedStudent.engagementLevel}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Learning Style:</span>
                            <span className="font-medium ml-1">{selectedStudent.learningStyle.replace('_', '/')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Learning Gaps</h3>
                      
                      {selectedStudent.learningGaps.length > 0 ? (
                        <div className="space-y-3">
                          {selectedStudent.learningGaps.map((gap, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg border p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-medium">{gap.subject}: {gap.topic}</h4>
                                {getSeverityBadge(gap.severity)}
                              </div>
                              <p className="text-sm mb-2">{gap.recommendation}</p>
                              <div className="flex justify-end">
                                <Button variant="outline" size="sm">
                                  <Target className="h-3 w-3 mr-1" />
                                  Create Intervention
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <h4 className="text-sm font-medium">No Significant Learning Gaps</h4>
                          </div>
                          <p className="text-sm">
                            {selectedStudent.firstName} is performing well across all subjects with no significant learning gaps identified.
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Prediction Factors</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm">
                            {selectedStudent.firstName}'s performance predictions are based on:
                          </p>
                          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>Historical performance data</li>
                            <li>Engagement patterns</li>
                            <li>Completion rates for assignments</li>
                            <li>Learning style alignment with content</li>
                            <li>Attendance patterns</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Interventions</h3>
                      
                      {selectedStudent.interventions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedStudent.interventions.map((intervention, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg border p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-medium">
                                  {intervention.subject}: {intervention.topic}
                                </h4>
                                {getInterventionStatusBadge(intervention.status)}
                              </div>
                              <div className="text-sm mb-2">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Type: {intervention.type.replace(/_/g, ' ')}</span>
                                  <span>Started: {formatDate(intervention.startDate)}</span>
                                </div>
                              </div>
                              {intervention.effectiveness && (
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm">Effectiveness:</span>
                                  {getEffectivenessBadge(intervention.effectiveness)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 border rounded-lg p-3">
                          <p className="text-sm">
                            No interventions are currently in place for {selectedStudent.firstName}.
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          {selectedStudent.riskLevel === 'HIGH' ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                <h5 className="text-sm font-medium">High Risk - Immediate Action Recommended</h5>
                              </div>
                              <p className="text-sm mb-2">
                                Based on current predictions, {selectedStudent.firstName} would benefit from:
                              </p>
                              <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
                                <li>Targeted intervention for identified learning gaps</li>
                                <li>Parent-teacher meeting to discuss support strategies</li>
                                <li>Regular progress monitoring (weekly check-ins)</li>
                              </ul>
                            </>
                          ) : selectedStudent.riskLevel === 'MEDIUM' ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                <h5 className="text-sm font-medium">Medium Risk - Monitoring Recommended</h5>
                              </div>
                              <p className="text-sm mb-2">
                                Based on current predictions, {selectedStudent.firstName} would benefit from:
                              </p>
                              <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
                                <li>Focused support for specific learning gaps</li>
                                <li>Regular progress monitoring (bi-weekly check-ins)</li>
                                <li>Learning style-aligned resources</li>
                              </ul>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <h5 className="text-sm font-medium">Low Risk - Enrichment Recommended</h5>
                              </div>
                              <p className="text-sm mb-2">
                                {selectedStudent.firstName} is on track for good progress. Consider:
                              </p>
                              <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
                                <li>Extension activities to further develop strengths</li>
                                <li>Peer support opportunities</li>
                                <li>Continued monitoring of progress</li>
                              </ul>
                            </>
                          )}
                          
                          <Button className="w-full">
                            <Zap className="h-4 w-4 mr-2" />
                            Create Action Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Historical performance data and trend analysis for {mockClassData.name} class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedMetric === 'performance' && (
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overall">Overall</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="h-64 bg-slate-50 rounded-lg border p-4">
                  {selectedMetric === 'performance' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-end">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-8 bg-blue-500 rounded-t-sm" 
                              style={{ 
                                height: `${mockHistoricalData.performance[selectedSubject][index] * 0.6}%` 
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-6 flex">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 text-center">
                            <span className="text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMetric === 'attendance' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-end">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-8 bg-green-500 rounded-t-sm" 
                              style={{ 
                                height: `${mockHistoricalData.attendance[index] * 0.6}%` 
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-6 flex">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 text-center">
                            <span className="text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMetric === 'completion' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-end">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-8 bg-amber-500 rounded-t-sm" 
                              style={{ 
                                height: `${mockHistoricalData.completion[index] * 0.6}%` 
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-6 flex">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 text-center">
                            <span className="text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMetric === 'engagement' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-end">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="flex flex-col items-center w-12">
                              <div 
                                className="w-full bg-red-500 rounded-t-sm" 
                                style={{ 
                                  height: `${mockHistoricalData.engagement.low[index] * 0.6}%` 
                                }}
                              ></div>
                              <div 
                                className="w-full bg-amber-500" 
                                style={{ 
                                  height: `${mockHistoricalData.engagement.medium[index] * 0.6}%` 
                                }}
                              ></div>
                              <div 
                                className="w-full bg-green-500" 
                                style={{ 
                                  height: `${mockHistoricalData.engagement.high[index] * 0.6}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-6 flex">
                        {mockHistoricalData.timeframes.map((month, index) => (
                          <div key={index} className="flex-1 text-center">
                            <span className="text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-blue-500" />
                      Trend Analysis
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Performance Trend</h4>
                        <p className="text-sm">
                          Overall class performance has shown a steady improvement of 4% over the current term, with the most significant gains in Mathematics (5.7%).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Correlation Analysis</h4>
                        <p className="text-sm">
                          Strong positive correlation (0.82) between attendance rates and performance scores. Students with consistent attendance show 12% higher performance on average.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Intervention Impact</h4>
                        <p className="text-sm">
                          Targeted interventions implemented in February show a measurable impact, with affected students improving by an average of 8% in targeted subject areas.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-500" />
                      Predictive Insights
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">End of Year Projection</h4>
                        <p className="text-sm">
                          Based on current trends, the class is projected to achieve an overall performance of 79% by the end of the academic year, exceeding the target of 75%.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Risk Reduction Opportunity</h4>
                        <p className="text-sm">
                          Focused interventions on Mathematics: Problem Solving could reduce the high-risk student percentage from 15% to approximately 8% by the end of term.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Learning Gap Closure</h4>
                        <p className="text-sm">
                          With targeted support, 65% of identified learning gaps could be significantly reduced or closed by the end of the academic year.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Recommendations</CardTitle>
              <CardDescription>
                AI-powered recommendations for targeted interventions based on predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockInterventionRecommendations.map((recommendation, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{recommendation.subject}: {recommendation.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          Target: {recommendation.targetGroup.replace(/_/g, ' ')} • {recommendation.affectedStudentCount} students affected
                        </p>
                      </div>
                      <div>
                        {getExpectedImpactBadge(recommendation.expectedImpact)}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-4">{recommendation.description}</p>
                      
                      <div className="bg-slate-50 rounded-lg border p-3 mb-4">
                        <h5 className="text-sm font-medium mb-1">Resource Requirements</h5>
                        <p className="text-sm">{recommendation.resourceRequirements}</p>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          View Affected Students
                        </Button>
                        <Button>
                          <Zap className="h-4 w-4 mr-2" />
                          Implement Intervention
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    About Intervention Recommendations
                  </h3>
                  
                  <p className="text-sm mb-3">
                    These recommendations are generated using advanced predictive analytics based on:
                  </p>
                  
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Historical performance data and trends</li>
                    <li>Identified learning gaps across the class</li>
                    <li>Individual student risk assessments</li>
                    <li>Effectiveness of previous similar interventions</li>
                    <li>Resource availability and constraints</li>
                  </ul>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Comprehensive Intervention Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
