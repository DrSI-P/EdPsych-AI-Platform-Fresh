'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart2, 
  PieChart, 
  LineChart,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  AlertCircle,
  Download,
  Share2,
  Filter,
  ChevronRight,
  ChevronLeft,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function DataVisualisationPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('term');
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Mock data for visualisations
  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'year7a', name: 'Year 7A' },
    { id: 'year7b', name: 'Year 7B' },
    { id: 'year8a', name: 'Year 8A' },
    { id: 'year8b', name: 'Year 8B' }
  ];
  
  const timeframes = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'term', name: 'This Term' },
    { id: 'year', name: 'This Year' }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Data Visualisation</h1>
        <p className="text-muted-foreground text-lg">
          Analyse student performance and identify trends with interactive data visualisations.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="select select-bordered"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="select select-bordered"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.id} value={timeframe.id}>{timeframe.name}</option>
                  ))}
                </select>
                
                <Button variant="outline" className="btn btn-outline">
                  Apply Filters
                </Button>
              </div>
              
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" className="btn btn-sm btn-outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="btn btn-sm btn-outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription className="card-description">
              Overall performance metrics for {selectedClass === 'all' ? 'all classes' : selectedClass} during {selectedTimeframe === 'term' ? 'this term' : selectedTimeframe}
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">76%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
                <div className="text-xs text-green-500 mt-1">↑ 3% from previous {selectedTimeframe}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">92%</div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
                <div className="text-xs text-green-500 mt-1">↑ 1% from previous {selectedTimeframe}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">84%</div>
                <div className="text-sm text-muted-foreground">Assignment Completion</div>
                <div className="text-xs text-amber-500 mt-1">↓ 2% from previous {selectedTimeframe}</div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">68%</div>
                <div className="text-sm text-muted-foreground">Participation Rate</div>
                <div className="text-xs text-green-500 mt-1">↑ 5% from previous {selectedTimeframe}</div>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Performance trend chart would appear here</p>
                <p className="text-sm text-muted-foreground">Showing performance metrics over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow h-full">
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Subject Performance
              </CardTitle>
              <CardDescription className="card-description">
                Performance breakdown by subject
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              {/* Placeholder for chart */}
              <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Subject performance chart would appear here</p>
                  <p className="text-sm text-muted-foreground">Showing relative performance across subjects</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Mathematics</span>
                  </div>
                  <span className="font-medium">82%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>English</span>
                  </div>
                  <span className="font-medium">76%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span>Science</span>
                  </div>
                  <span className="font-medium">79%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>History</span>
                  </div>
                  <span className="font-medium">71%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Geography</span>
                  </div>
                  <span className="font-medium">68%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow h-full">
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Student Distribution
              </CardTitle>
              <CardDescription className="card-description">
                Performance distribution across student groups
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              {/* Placeholder for chart */}
              <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Student distribution chart would appear here</p>
                  <p className="text-sm text-muted-foreground">Showing performance distribution across students</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">18%</div>
                  <div className="text-sm text-muted-foreground">High Achievers</div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">62%</div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-amber-500">20%</div>
                  <div className="text-sm text-muted-foreground">Needs Support</div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/student-groups">
                    View Student Groups
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Attendance Trends
            </CardTitle>
            <CardDescription className="card-description">
              Attendance patterns over {selectedTimeframe}
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            {/* Placeholder for chart */}
            <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Attendance trend chart would appear here</p>
                <p className="text-sm text-muted-foreground">Showing attendance patterns over time</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">92%</div>
                <div className="text-sm text-muted-foreground">Overall Attendance</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-500">Monday</div>
                <div className="text-sm text-muted-foreground">Highest Attendance</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-500">Friday</div>
                <div className="text-sm text-muted-foreground">Lowest Attendance</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-500">3</div>
                <div className="text-sm text-muted-foreground">Chronic Absentees</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="card-footer">
            <Button variant="outline" className="w-full btn btn-outline" asChild>
              <Link href="/educator/attendance-records">
                View Detailed Attendance Records
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* At-Risk Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              At-Risk Students
            </CardTitle>
            <CardDescription className="card-description">
              Students who may need additional support
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Risk Factors</th>
                    <th className="text-left py-3 px-4">Attendance</th>
                    <th className="text-left py-3 px-4">Assignment Completion</th>
                    <th className="text-left py-3 px-4">Average Score</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Emma Thompson</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-red-100 text-red-800">Missing Assignments</Badge>
                    </td>
                    <td className="py-3 px-4">86%</td>
                    <td className="py-3 px-4 text-red-500">62%</td>
                    <td className="py-3 px-4">68%</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="btn btn-sm btn-outline" asChild>
                        <Link href="/educator/students/1">View</Link>
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">James Wilson</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-red-100 text-red-800">Low Attendance</Badge>
                    </td>
                    <td className="py-3 px-4 text-red-500">76%</td>
                    <td className="py-3 px-4">79%</td>
                    <td className="py-3 px-4">72%</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="btn btn-sm btn-outline" asChild>
                        <Link href="/educator/students/2">View</Link>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Sarah Johnson</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-amber-100 text-amber-800">Declining Scores</Badge>
                    </td>
                    <td className="py-3 px-4">92%</td>
                    <td className="py-3 px-4">88%</td>
                    <td className="py-3 px-4 text-amber-500">65%</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="btn btn-sm btn-outline" asChild>
                        <Link href="/educator/students/3">View</Link>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="card-footer">
            <Button variant="outline" className="w-full btn btn-outline" asChild>
              <Link href="/educator/at-risk-students">
                View All At-Risk Students
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              AI-Generated Insights
            </CardTitle>
            <CardDescription className="card-description">
              Automated analysis and recommendations based on your class data
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="space-y-4">
              <div className="bg-background p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Performance Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Mathematics scores show a positive trend this term, with a 3% increase in average scores. 
                  However, there's a noticeable dip in performance on Fridays, suggesting potential end-of-week fatigue.
                </p>
              </div>
              
              <div className="bg-background p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Learning Gap Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  18% of students are struggling with algebraic expressions in Mathematics. 
                  Consider providing additional resources or targeted interventions for this specific topic.
                </p>
              </div>
              
              <div className="bg-background p-4 rounded-lg border border-border">
                <h3 className="font-medium mb-2">Attendance Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Three students have shown declining attendance patterns over the past month. 
                  Early intervention may help prevent further attendance issues.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full btn btn-primary" asChild>
                <Link href="/educator/ai-insights">
                  Generate Detailed AI Analysis
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* UK Curriculum Alignment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              UK Curriculum Alignment
            </CardTitle>
            <CardDescription className="card-description">
              Performance analysis against UK National Curriculum standards
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <Tabs defaultValue="ks3" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="ks3">Key Stage 3</TabsTrigger>
                <TabsTrigger value="ks4">Key Stage 4</TabsTrigger>
                <TabsTrigger value="gcse">GCSE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ks3" className="p-4 bg-muted/50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Mathematics</span>
                      <span>78% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">English</span>
                      <span>82% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Science</span>
                      <span>75% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 btn btn-outline" asChild>
                  <Link href="/educator/curriculum-alignment/ks3">
                    View KS3 Curriculum Details
                  </Link>
                </Button>
              </TabsContent>
              
              <TabsContent value="ks4" className="p-4 bg-muted/50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Mathematics</span>
                      <span>72% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">English</span>
                      <span>68% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Science</span>
                      <span>70% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 btn btn-outline" asChild>
                  <Link href="/educator/curriculum-alignment/ks4">
                    View KS4 Curriculum Details
                  </Link>
                </Button>
              </TabsContent>
              
              <TabsContent value="gcse" className="p-4 bg-muted/50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Mathematics</span>
                      <span>65% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">English Language</span>
                      <span>62% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">English Literature</span>
                      <span>58% coverage</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 btn btn-outline" asChild>
                  <Link href="/educator/curriculum-alignment/gcse">
                    View GCSE Curriculum Details
                  </Link>
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/educator/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/educator/administrative-automation">
            Administrative Automation <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
