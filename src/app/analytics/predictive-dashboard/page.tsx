'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  RadarChart,
  ScatterChart
} from '@/components/ui/charts';
import { 
  AlertTriangle,
  BarChart2, 
  BookOpen, 
  Brain,
  ChevronDown,
  Download,
  FileText, 
  Filter,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Settings,
  Share2,
  TrendingUp, 
  TrendingDown,
  Users,
  Zap
} from 'lucide-react';

import { getAnalyticsService } from '@/lib/analytics/analyticsService';
import { getPredictiveAnalyticsService } from '@/lib/analytics/predictiveModels';
import { 
  LearningGapPrediction, 
  ProgressForecast, 
  InterventionRecommendation 
} from '@/lib/analytics/predictiveTypes';

export default function PredictiveAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('learning-gaps');
  const [isLoading, setIsLoading] = useState(true);
  const [learningGaps, setLearningGaps] = useState<LearningGapPrediction[]>([]);
  const [progressForecasts, setProgressForecasts] = useState<ProgressForecast[]>([]);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('student-1');
  const [selectedSubject, setSelectedSubject] = useState('MATHEMATICS');
  const [timeframe, setTimeframe] = useState(4); // weeks
  
  // Mock student data for demonstration
  const students = [
    { id: 'student-1', name: 'Emma Johnson', yearGroup: 5 },
    { id: 'student-2', name: 'James Smith', yearGroup: 5 },
    { id: 'student-3', name: 'Sophia Williams', yearGroup: 5 }
  ];
  
  const subjects = [
    { id: 'MATHEMATICS', name: 'Mathematics' },
    { id: 'ENGLISH', name: 'English' },
    { id: 'SCIENCE', name: 'Science' }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const predictiveService = getPredictiveAnalyticsService();
        
        // Fetch learning gaps
        const gaps = await predictiveService.predictLearningGaps(
          selectedStudent,
          selectedSubject,
          timeframe
        );
        setLearningGaps(gaps);
        
        // Fetch progress forecasts
        const forecasts = await predictiveService.forecastProgress(
          selectedStudent,
          [selectedSubject],
          12 // 12 weeks forecast
        );
        setProgressForecasts(forecasts);
        
        // Fetch intervention recommendations
        const interventions = await predictiveService.recommendInterventions(
          selectedStudent,
          gaps
        );
        setRecommendations(interventions);
      } catch (error) {
        console.error('Error fetching predictive analytics data:', error);
        // In a real application, we would show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedStudent, selectedSubject, timeframe]);
  
  // Mock data for charts
  const mockLearningGapData = {
    labels: ['Number Operations', 'Fractions', 'Geometry', 'Measurement', 'Statistics'],
    datasets: [
      {
        label: 'Gap Probability',
        data: [0.2, 0.7, 0.3, 0.1, 0.5],
        backgroundColor: 'rgba(67, 97, 238, 0.5)',
        borderColor: 'rgb(67, 97, 238)',
        borderWidth: 1
      }
    ]
  };
  
  const mockProgressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Projected Progress',
        data: [65, 68, 70, 72, 75, 78, 80, 83],
        borderColor: 'rgb(67, 97, 238)',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Upper Confidence',
        data: [65, 70, 73, 76, 80, 84, 87, 90],
        borderColor: 'rgba(67, 97, 238, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Lower Confidence',
        data: [65, 66, 67, 68, 70, 72, 73, 75],
        borderColor: 'rgba(67, 97, 238, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };
  
  const mockInterventionImpactData = {
    labels: ['Additional Practice', 'Visual Aids', 'Peer Learning', 'Interactive Games', 'Parent Support'],
    datasets: [
      {
        label: 'Expected Impact',
        data: [0.8, 0.6, 0.7, 0.9, 0.5],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(114, 9, 183, 0.7)',
          'rgba(247, 37, 133, 0.7)',
          'rgba(76, 201, 240, 0.7)',
          'rgba(58, 12, 163, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const getConfidenceLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Predictive Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Identify potential learning gaps and forecast student progress
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Student Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Select Student</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} (Year {student.yearGroup})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Select Subject</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Prediction Timeframe</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={timeframe}
                  onChange={(e) => setTimeframe(parseInt(e.target.value))}
                >
                  <option value={2}>2 weeks</option>
                  <option value={4}>4 weeks</option>
                  <option value={8}>8 weeks</option>
                  <option value={12}>12 weeks</option>
                </select>
              </div>
              
              <Button className="w-full">
                Update Predictions
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prediction Summary</CardTitle>
            <CardDescription>Key insights from predictive models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Learning Gaps</h4>
                </div>
                <p className="text-2xl font-bold mb-1">3</p>
                <p className="text-sm text-muted-foreground">Potential gaps identified</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Progress</h4>
                </div>
                <p className="text-2xl font-bold mb-1">+12%</p>
                <p className="text-sm text-muted-foreground">Projected improvement</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Interventions</h4>
                </div>
                <p className="text-2xl font-bold mb-1">5</p>
                <p className="text-sm text-muted-foreground">Recommended actions</p>
              </div>
            </div>
            
            <Alert className="mt-4 border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Attention Required</AlertTitle>
              <AlertDescription className="text-amber-700">
                Fractions concepts show a high probability (70%) of becoming a learning gap in the next 4 weeks.
                Consider implementing the recommended interventions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="learning-gaps">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Learning Gap Prediction
          </TabsTrigger>
          <TabsTrigger value="progress-forecast">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progress Forecast
          </TabsTrigger>
          <TabsTrigger value="interventions">
            <Zap className="h-4 w-4 mr-2" />
            Recommended Interventions
          </TabsTrigger>
          <TabsTrigger value="cohort-analysis">
            <Users className="h-4 w-4 mr-2" />
            Cohort Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning-gaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Potential Learning Gaps</CardTitle>
              <CardDescription>
                Areas where the student may develop gaps in understanding over the next {timeframe} weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <BarChart 
                  data={mockLearningGapData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                          display: true,
                          text: 'Gap Probability'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Curriculum Topics'
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Fractions</h4>
                      <p className="text-sm text-muted-foreground">Understanding equivalent fractions and operations</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceLevelColor('HIGH')}`}>
                      High Confidence
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gap Probability</span>
                      <span>70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-sm">
                      <strong>Related concepts:</strong> Decimal equivalents, percentages, ratio
                    </p>
                    <p className="text-sm">
                      <strong>Curriculum standards:</strong> KS2 Mathematics - Number and Place Value
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Statistics</h4>
                      <p className="text-sm text-muted-foreground">Interpreting data and graphs</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceLevelColor('MEDIUM')}`}>
                      Medium Confidence
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gap Probability</span>
                      <span>50%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-sm">
                      <strong>Related concepts:</strong> Mean, median, mode, range, data representation
                    </p>
                    <p className="text-sm">
                      <strong>Curriculum standards:</strong> KS2 Mathematics - Statistics
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Geometry</h4>
                      <p className="text-sm text-muted-foreground">Properties of shapes and spatial reasoning</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceLevelColor('MEDIUM')}`}>
                      Medium Confidence
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gap Probability</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-sm">
                      <strong>Related concepts:</strong> Angles, symmetry, coordinates, transformations
                    </p>
                    <p className="text-sm">
                      <strong>Curriculum standards:</strong> KS2 Mathematics - Geometry
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress-forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Forecast</CardTitle>
              <CardDescription>
                Projected learning progress over the next 8 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <LineChart 
                  data={mockProgressData}
                  options={{
                    scales: {
                      y: {
                        min: 60,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Progress Score'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Time Period'
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Level</span>
                        <span>5C</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target Level</span>
                        <span>5B</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Forecast Summary</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Forecasted Level (8 weeks)</span>
                        <span>5B</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Probability of Reaching Target</span>
                        <span>83%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Confidence Level</span>
                        <span className="font-medium text-green-600">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Key Factors Influencing Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Strong engagement with interactive resources</p>
                      <p className="text-xs text-muted-foreground">Positive impact: High</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Consistent completion of practice exercises</p>
                      <p className="text-xs text-muted-foreground">Positive impact: Medium</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Difficulty with word problems</p>
                      <p className="text-xs text-muted-foreground">Negative impact: Medium</p>
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
              <CardTitle>Recommended Interventions</CardTitle>
              <CardDescription>
                Personalized strategies to address potential learning gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="h-80">
                  <PieChart 
                    data={mockInterventionImpactData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        title: {
                          display: true,
                          text: 'Expected Impact of Interventions'
                        }
                      }
                    }}
                  />
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Intervention Effectiveness</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Interactive Games</span>
                        <span>90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Additional Practice</span>
                        <span>80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Peer Learning</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Visual Aids</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Parent Support</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Interactive Fraction Games</h4>
                      <p className="text-sm text-muted-foreground">Visual and interactive approach to learning fractions</p>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      High Impact
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    Recommended to address potential gaps in understanding equivalent fractions and operations.
                    Aligns with the student's visual learning style.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Time required:</strong> 15-20 minutes, 3 times per week</p>
                    <p className="text-sm"><strong>Implementation steps:</strong></p>
                    <ol className="text-sm list-decimal list-inside space-y-1 pl-2">
                      <li>Start with the "Fraction Explorer" game in the resources section</li>
                      <li>Progress to "Fraction Operations" once basic concepts are mastered</li>
                      <li>Use the built-in assessment to track understanding</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">
                      View Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Peer Learning Group</h4>
                      <p className="text-sm text-muted-foreground">Collaborative learning with peers</p>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      Medium Impact
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    Recommended to reinforce understanding through explanation and discussion.
                    Particularly effective for statistics and data interpretation.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Time required:</strong> 30 minutes, once per week</p>
                    <p className="text-sm"><strong>Implementation steps:</strong></p>
                    <ol className="text-sm list-decimal list-inside space-y-1 pl-2">
                      <li>Form a group of 3-4 students with mixed abilities</li>
                      <li>Assign specific roles (explainer, questioner, recorder)</li>
                      <li>Provide structured problems for the group to solve together</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">
                      View Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Visual Fraction Models</h4>
                      <p className="text-sm text-muted-foreground">Physical and digital manipulatives</p>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      Medium Impact
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    Recommended to build concrete understanding before moving to abstract concepts.
                    Supports visual and kinesthetic learning styles.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Time required:</strong> 15 minutes, 2 times per week</p>
                    <p className="text-sm"><strong>Implementation steps:</strong></p>
                    <ol className="text-sm list-decimal list-inside space-y-1 pl-2">
                      <li>Begin with physical fraction circles and bars</li>
                      <li>Progress to digital manipulatives in the app</li>
                      <li>Have student create their own visual models</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">
                      View Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cohort-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Analysis</CardTitle>
              <CardDescription>
                Comparison with peer groups and identification of patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <RadarChart 
                  data={{
                    labels: ['Number', 'Fractions', 'Geometry', 'Measurement', 'Statistics', 'Algebra'],
                    datasets: [
                      {
                        label: 'Selected Student',
                        data: [80, 60, 75, 85, 65, 70],
                        backgroundColor: 'rgba(67, 97, 238, 0.2)',
                        borderColor: 'rgb(67, 97, 238)',
                        pointBackgroundColor: 'rgb(67, 97, 238)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(67, 97, 238)'
                      },
                      {
                        label: 'Class Average',
                        data: [75, 70, 72, 78, 68, 65],
                        backgroundColor: 'rgba(114, 9, 183, 0.2)',
                        borderColor: 'rgb(114, 9, 183)',
                        pointBackgroundColor: 'rgb(114, 9, 183)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(114, 9, 183)'
                      }
                    ]
                  }}
                  options={{
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Performance Relative to Peers</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall</span>
                        <span>Percentile: 68th</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Number</span>
                        <span>Percentile: 82nd</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fractions</span>
                        <span>Percentile: 45th</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Geometry</span>
                        <span>Percentile: 65th</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Learning Style Comparison</h4>
                  <p className="text-sm mb-4">
                    Comparison with other visual learners in the same year group
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resource Engagement</span>
                        <span>Above Average</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Time on Task</span>
                        <span>Average</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress Rate</span>
                        <span>Above Average</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Insights from Cohort Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Stronger performance in visual-based topics compared to peers</p>
                      <p className="text-xs text-muted-foreground">Suggests effective use of visual learning style</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Lower performance in fractions compared to both personal average and peers</p>
                      <p className="text-xs text-muted-foreground">Confirms prediction of potential learning gap</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Higher engagement with interactive resources than similar learners</p>
                      <p className="text-xs text-muted-foreground">Supports recommendation for interactive intervention approaches</p>
                    </div>
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
