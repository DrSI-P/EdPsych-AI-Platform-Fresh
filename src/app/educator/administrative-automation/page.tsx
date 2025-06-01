'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  FileText, 
  Clock,
  Calendar,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  AlertCircle,
  Download,
  Upload,
  BarChart
} from 'lucide-react';
import Link from 'next/link';

export default function AdministrativeAutomationPage() {
  const [activeTab, setActiveTab] = useState('reports');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Administrative Automation</h1>
        <p className="text-muted-foreground text-lg">
          Reduce your administrative workload with AI-powered automation tools.
        </p>
      </motion.div>

      {/* Automation Tools Tabs */}
      <Tabs defaultValue="reports" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="tabs-list mb-6">
          <TabsTrigger value="reports" className="tab">Report Generation</TabsTrigger>
          <TabsTrigger value="marking" className="tab">Marking Assistant</TabsTrigger>
          <TabsTrigger value="communications" className="tab">Communications</TabsTrigger>
          <TabsTrigger value="planning" className="tab">Lesson Planning</TabsTrigger>
        </TabsList>

        {/* Report Generation Tab */}
        <TabsContent value="reports" className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Generate Reports
                    </CardTitle>
                    <CardDescription className="card-description">
                      Automatically generate professional reports based on your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-6">
                      {/* Report Type Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Report Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="progress" 
                                name="reportType" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="progress" className="font-medium">Student Progress</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Detailed progress reports for individual students or classes
                            </p>
                          </div>
                          
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="attendance" 
                                name="reportType" 
                                className="mr-2"
                              />
                              <label htmlFor="attendance" className="font-medium">Attendance</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Attendance summaries and patterns for tracking
                            </p>
                          </div>
                          
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="behaviour" 
                                name="reportType" 
                                className="mr-2"
                              />
                              <label htmlFor="behaviour" className="font-medium">Behaviour</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Behaviour tracking and incident reports
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Report Parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Select Class/Group</label>
                          <select className="select select-bordered w-full">
                            <option value="all">All Classes</option>
                            <option value="year7a">Year 7A</option>
                            <option value="year7b">Year 7B</option>
                            <option value="year8a">Year 8A</option>
                            <option value="year8b">Year 8B</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Time Period</label>
                          <select className="select select-bordered w-full">
                            <option value="term">Current Term</option>
                            <option value="halfterm">Current Half Term</option>
                            <option value="month">Last Month</option>
                            <option value="custom">Custom Range</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Report Options */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Report Options</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="includeCharts" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="includeCharts">Include Charts & Visualisations</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="includeComments" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="includeComments">Include AI-Generated Comments</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="includeRecommendations" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="includeRecommendations">Include Recommendations</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="parentFriendly" 
                              className="mr-2"
                            />
                            <label htmlFor="parentFriendly">Parent-Friendly Format</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Report Format */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Report Format</label>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="pdf" 
                              name="reportFormat" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="pdf">PDF</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="word" 
                              name="reportFormat" 
                              className="mr-2"
                            />
                            <label htmlFor="word">Word Document</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="excel" 
                              name="reportFormat" 
                              className="mr-2"
                            />
                            <label htmlFor="excel">Excel Spreadsheet</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Generate Button */}
                      <div className="flex justify-end">
                        <Button className="btn btn-primary">
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Recent Reports */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8"
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Recent Reports
                    </CardTitle>
                    <CardDescription className="card-description">
                      Your recently generated reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4">Report Name</th>
                            <th className="text-left py-3 px-4">Type</th>
                            <th className="text-left py-3 px-4">Date Generated</th>
                            <th className="text-left py-3 px-4">Format</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-3 px-4">Year 7A Progress Report</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="badge badge-outline">
                                Progress
                              </Badge>
                            </td>
                            <td className="py-3 px-4">Yesterday</td>
                            <td className="py-3 px-4">PDF</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-3 px-4">Monthly Attendance Summary</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="badge badge-outline">
                                Attendance
                              </Badge>
                            </td>
                            <td className="py-3 px-4">3 days ago</td>
                            <td className="py-3 px-4">Excel</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4">Behaviour Incident Report</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="badge badge-outline">
                                Behaviour
                              </Badge>
                            </td>
                            <td className="py-3 px-4">1 week ago</td>
                            <td className="py-3 px-4">PDF</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              {/* Report Templates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Report Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        End of Term Progress Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Parent-Teacher Meeting Summary
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        SEN Support Plan
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      Manage Templates
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* AI Report Assistant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      AI Report Assistant
                    </CardTitle>
                    <CardDescription className="card-description">
                      Let AI help you create customised reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe the report you need</label>
                        <Textarea 
                          placeholder="E.g., I need a detailed progress report for a student with SEN needs, focusing on reading progress..." 
                          className="textarea textarea-bordered w-full min-h-[100px]"
                        />
                      </div>
                      <Button className="w-full btn btn-primary">
                        Generate Custom Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* UK Curriculum Alignment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardContent className="card-body p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">UK Curriculum Aligned</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          All reports are automatically aligned with UK National Curriculum standards and assessment frameworks.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Marking Assistant Tab */}
        <TabsContent value="marking" className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      AI Marking Assistant
                    </CardTitle>
                    <CardDescription className="card-description">
                      Reduce marking time with AI-powered assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-6">
                      {/* Assignment Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Assignment to Mark</label>
                        <select className="select select-bordered w-full">
                          <option value="">-- Select an assignment --</option>
                          <option value="1">Year 7 - English Essay: Character Analysis</option>
                          <option value="2">Year 8 - Science Report: Forces and Motion</option>
                          <option value="3">Year 9 - Mathematics: Algebraic Expressions</option>
                        </select>
                      </div>
                      
                      {/* Upload Student Work */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Student Work</label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, DOC, JPG, PNG (MAX. 20MB)</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          You can upload multiple files at once for batch marking
                        </p>
                      </div>
                      
                      {/* Marking Criteria */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Marking Criteria</label>
                        <div className="border border-border rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="useRubric" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="useRubric">Use Assignment Rubric</label>
                            </div>
                            
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="grammarCheck" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="grammarCheck">Check Grammar & Spelling</label>
                            </div>
                            
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="plagiarismCheck" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="plagiarismCheck">Check for Plagiarism</label>
                            </div>
                            
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="feedbackSuggestions" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="feedbackSuggestions">Generate Feedback Suggestions</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Feedback Style */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Feedback Style</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="detailed" 
                                name="feedbackStyle" 
                                defaultChecked
                                className="mr-2"
                              />
                              <label htmlFor="detailed" className="font-medium">Detailed</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Comprehensive feedback with specific suggestions
                            </p>
                          </div>
                          
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="concise" 
                                name="feedbackStyle" 
                                className="mr-2"
                              />
                              <label htmlFor="concise" className="font-medium">Concise</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Brief, focused feedback on key points
                            </p>
                          </div>
                          
                          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-center mb-2">
                              <input 
                                type="radio" 
                                id="encouraging" 
                                name="feedbackStyle" 
                                className="mr-2"
                              />
                              <label htmlFor="encouraging" className="font-medium">Encouraging</label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Positive, growth-mindset focused feedback
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Start Marking Button */}
                      <div className="flex justify-end">
                        <Button className="btn btn-primary">
                          Start AI-Assisted Marking
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Marking Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8"
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      Marking Statistics
                    </CardTitle>
                    <CardDescription className="card-description">
                      Your marking efficiency and time savings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">68%</div>
                        <div className="text-sm text-muted-foreground">Time Saved</div>
                        <div className="text-xs text-green-500 mt-1">Using AI Marking Assistant</div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">124</div>
                        <div className="text-sm text-muted-foreground">Assignments Marked</div>
                        <div className="text-xs text-muted-foreground mt-1">This Month</div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">4.8</div>
                        <div className="text-sm text-muted-foreground">Average Feedback Quality</div>
                        <div className="text-xs text-muted-foreground mt-1">Out of 5</div>
                      </div>
                    </div>
                    
                    {/* Placeholder for chart */}
                    <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Marking time comparison chart would appear here</p>
                        <p className="text-sm text-muted-foreground">Showing time savings with AI assistance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              {/* Feedback Templates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Feedback Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Essay Structure Feedback
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Mathematics Problem Solving
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Science Experiment Report
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      Manage Templates
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Recent Marking Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Recent Marking Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-4">
                      <div className="border-b border-border pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 8 Science Reports</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              28 assignments • Yesterday
                            </p>
                          </div>
                          <Badge className="badge bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="border-b border-border pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 7 English Essays</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              32 assignments • 3 days ago
                            </p>
                          </div>
                          <Badge className="badge bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 9 Maths Assessments</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              30 assignments • 1 week ago
                            </p>
                          </div>
                          <Badge className="badge bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* UK Assessment Standards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardContent className="card-body p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">UK Assessment Standards</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          All marking criteria are aligned with UK assessment standards, including National Curriculum levels, GCSE and A-Level grade boundaries.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="tab-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Communication Automation
                </CardTitle>
                <CardDescription className="card-description">
                  Set up automated communications to save time
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Automated Notifications */}
                  <Card className="card card-bordered hover:shadow-md transition-shadow">
                    <CardHeader className="card-header pb-2">
                      <CardTitle className="card-title text-lg">Automated Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="card-body">
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up automatic notifications for parents based on student performance, attendance, or behaviour.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="attendanceAlerts" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="attendanceAlerts">Attendance Alerts</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="gradingAlerts" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="gradingAlerts">Assignment Grading Alerts</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="behaviourAlerts" 
                            className="mr-2"
                          />
                          <label htmlFor="behaviourAlerts">Behaviour Incident Alerts</label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="card-footer pt-0">
                      <Button className="w-full btn btn-primary">
                        Configure Alerts
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Scheduled Communications */}
                  <Card className="card card-bordered hover:shadow-md transition-shadow">
                    <CardHeader className="card-header pb-2">
                      <CardTitle className="card-title text-lg">Scheduled Communications</CardTitle>
                    </CardHeader>
                    <CardContent className="card-body">
                      <p className="text-sm text-muted-foreground mb-4">
                        Schedule regular communications to parents, such as weekly updates or term summaries.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="weeklyUpdates" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="weeklyUpdates">Weekly Class Updates</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="homeworkReminders" 
                            className="mr-2"
                          />
                          <label htmlFor="homeworkReminders">Homework Reminders</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="termSummaries" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="termSummaries">End of Term Summaries</label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="card-footer pt-0">
                      <Button className="w-full btn btn-primary">
                        Manage Schedule
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Bulk Communications */}
                  <Card className="card card-bordered hover:shadow-md transition-shadow">
                    <CardHeader className="card-header pb-2">
                      <CardTitle className="card-title text-lg">Bulk Communications</CardTitle>
                    </CardHeader>
                    <CardContent className="card-body">
                      <p className="text-sm text-muted-foreground mb-4">
                        Send personalised messages to multiple parents at once with mail merge capabilities.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="personalisation" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="personalisation">Enable Personalisation</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="attachments" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="attachments">Include Attachments</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="deliveryTracking" 
                            defaultChecked
                            className="mr-2"
                          />
                          <label htmlFor="deliveryTracking">Track Delivery & Opens</label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="card-footer pt-0">
                      <Button className="w-full btn btn-primary">
                        Create Bulk Message
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Communication Templates */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Communication Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto py-3 btn btn-outline">
                      <div className="text-left">
                        <div className="font-medium">Weekly Update</div>
                        <div className="text-xs text-muted-foreground mt-1">Class progress and upcoming topics</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 btn btn-outline">
                      <div className="text-left">
                        <div className="font-medium">Absence Follow-up</div>
                        <div className="text-xs text-muted-foreground mt-1">Check-in after student absence</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 btn btn-outline">
                      <div className="text-left">
                        <div className="font-medium">Positive Behaviour</div>
                        <div className="text-xs text-muted-foreground mt-1">Recognition of good behaviour</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 btn btn-outline">
                      <div className="text-left">
                        <div className="font-medium">Assignment Reminder</div>
                        <div className="text-xs text-muted-foreground mt-1">Upcoming deadline notification</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                      View All Templates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* AI Communication Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  AI Communication Assistant
                </CardTitle>
                <CardDescription className="card-description">
                  Let AI help you draft professional communications
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">What would you like to communicate?</label>
                        <Textarea 
                          placeholder="E.g., I need to inform parents about an upcoming field trip to the Science Museum on June 15th..." 
                          className="textarea textarea-bordered w-full min-h-[150px]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Communication Style</label>
                        <select className="select select-bordered w-full">
                          <option value="formal">Formal</option>
                          <option value="friendly" selected>Friendly Professional</option>
                          <option value="simple">Simple & Clear</option>
                          <option value="encouraging">Encouraging</option>
                        </select>
                      </div>
                      
                      <Button className="w-full btn btn-primary">
                        Generate Communication
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg border border-border p-4">
                    <h3 className="font-medium mb-3">AI Generated Draft</h3>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Your AI-generated communication will appear here...</p>
                      <p>The assistant can help you craft professional, clear, and effective communications for parents, colleagues, and administrators.</p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="btn btn-sm btn-outline" disabled>
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* UK GDPR Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  UK GDPR Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    All automated communications through the EdPsych Connect platform comply with UK GDPR regulations. The following measures are in place:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>All communications are securely stored and encrypted</li>
                    <li>Parents can request access to their communication history at any time</li>
                    <li>Automatic data retention policies are in place (communications are archived after 2 years)</li>
                    <li>Personal data is only used for the specific purpose of school-parent communication</li>
                    <li>All communications include appropriate privacy notices</li>
                  </ul>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Best Practices</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Avoid including sensitive personal data in automated communications</li>
                      <li>Use secure channels for sharing confidential information</li>
                      <li>Always verify recipient details before setting up automated messages</li>
                      <li>Use BCC when sending to multiple recipients who don't know each other</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Lesson Planning Tab */}
        <TabsContent value="planning" className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      AI Lesson Planning Assistant
                    </CardTitle>
                    <CardDescription className="card-description">
                      Generate comprehensive lesson plans aligned with UK curriculum
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-6">
                      {/* Subject and Year Group */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Subject</label>
                          <select className="select select-bordered w-full">
                            <option value="">-- Select subject --</option>
                            <option value="english">English</option>
                            <option value="maths">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="history">History</option>
                            <option value="geography">Geography</option>
                            <option value="art">Art & Design</option>
                            <option value="computing">Computing</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Year Group</label>
                          <select className="select select-bordered w-full">
                            <option value="">-- Select year group --</option>
                            <option value="reception">Reception</option>
                            <option value="year1">Year 1</option>
                            <option value="year2">Year 2</option>
                            <option value="year3">Year 3</option>
                            <option value="year4">Year 4</option>
                            <option value="year5">Year 5</option>
                            <option value="year6">Year 6</option>
                            <option value="year7">Year 7</option>
                            <option value="year8">Year 8</option>
                            <option value="year9">Year 9</option>
                            <option value="year10">Year 10</option>
                            <option value="year11">Year 11</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Topic and Learning Objectives */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Topic</label>
                        <Input 
                          placeholder="E.g., Fractions, Shakespeare's Romeo and Juliet, Forces and Motion..." 
                          className="input input-bordered w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Learning Objectives</label>
                        <Textarea 
                          placeholder="What should students learn from this lesson? E.g., Understand how to add fractions with different denominators..." 
                          className="textarea textarea-bordered w-full min-h-[100px]"
                        />
                      </div>
                      
                      {/* Lesson Duration and Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Lesson Duration</label>
                          <select className="select select-bordered w-full">
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60" selected>60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Lesson Type</label>
                          <select className="select select-bordered w-full">
                            <option value="introduction">Introduction to New Topic</option>
                            <option value="development">Development of Existing Knowledge</option>
                            <option value="practice">Practice and Application</option>
                            <option value="assessment">Assessment and Review</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Additional Requirements */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="differentiation" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="differentiation">Include Differentiation</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="assessment" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="assessment">Include Assessment Strategies</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="resources" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="resources">Include Resource List</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="homework" 
                              className="mr-2"
                            />
                            <label htmlFor="homework">Include Homework Ideas</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Special Considerations */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Special Considerations (Optional)</label>
                        <Textarea 
                          placeholder="Any specific needs or considerations? E.g., SEN adaptations, EAL support, gifted and talented extension..." 
                          className="textarea textarea-bordered w-full min-h-[100px]"
                        />
                      </div>
                      
                      {/* Generate Button */}
                      <div className="flex justify-end">
                        <Button className="btn btn-primary">
                          Generate Lesson Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              {/* Saved Lesson Plans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Saved Lesson Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      <div className="border-b border-border pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 7 - Introduction to Algebra</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Mathematics • Created 2 days ago
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                            View
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-b border-border pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 9 - Forces and Motion</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Science • Created 1 week ago
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                            View
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Year 8 - Shakespeare's Sonnets</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              English • Created 2 weeks ago
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      View All Lesson Plans
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Lesson Plan Templates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Lesson Plan Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        5E Instructional Model
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Inquiry-Based Learning
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left btn btn-outline">
                        Direct Instruction
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      View All Templates
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* UK Curriculum Alignment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardContent className="card-body p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">UK Curriculum Aligned</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          All lesson plans are automatically aligned with the UK National Curriculum, ensuring coverage of required content and skills.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Voice Input Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered bg-muted/30 hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Voice Input Available
                </h3>
                <p className="text-muted-foreground">
                  Save time by using voice commands to generate reports, create lesson plans, and automate administrative tasks.
                </p>
              </div>
              <Button size="lg" className="btn btn-lg btn-primary whitespace-nowrap" asChild>
                <Link href={`/speech-recognition?redirect=/educator/administrative-automation/${activeTab}`}>
                  Try Voice Input
                </Link>
              </Button>
            </div>
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
          <Link href="/educator/parent-communication">
            Parent Communication <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
