'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, PieChart, LineChart, AreaChart, 
  Calendar, Download, Filter, Share2, 
  ArrowUpRight, ChevronRight, Settings, 
  Info, RefreshCw, Maximize2, PlusCircle,
  FileText, Users, MessageSquare, CheckCircle,
  Clock, AlertTriangle, Zap, Target
} from "lucide-react";

// Import chart components from a charting library like recharts
// This is a simplified implementation that would need to be connected to actual chart components
const BarChartComponent = ({ data, title }) => (
  <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
    <div className="text-centre">
      <BarChart className="h-10 w-10 mx-auto text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Bar Chart: {title}</p>
      <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
    </div>
  </div>
);

const LineChartComponent = ({ data, title }) => (
  <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
    <div className="text-centre">
      <LineChart className="h-10 w-10 mx-auto text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Line Chart: {title}</p>
      <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
    </div>
  </div>
);

const PieChartComponent = ({ data, title }) => (
  <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
    <div className="text-centre">
      <PieChart className="h-10 w-10 mx-auto text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Pie Chart: {title}</p>
      <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
    </div>
  </div>
);

const AreaChartComponent = ({ data, title }) => (
  <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
    <div className="text-centre">
      <AreaChart className="h-10 w-10 mx-auto text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Area Chart: {title}</p>
      <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
    </div>
  </div>
);

export default function ImpactVisualizationTools() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("academic-year");
  const [category, setCategory] = useState("all");
  
  // Sample impact data
  const impactData = {
    summary: {
      totalInitiatives: 42,
      implementedChanges: 28,
      inProgressChanges: 10,
      pendingReview: 4,
      studentParticipation: 68, // percentage
      overallSatisfaction: 82, // percentage
    },
    categories: [
      { id: "policy", name: "Policy Influence", count: 12, successRate: 75 },
      { id: "environment", name: "Environmental Improvements", count: 8, successRate: 88 },
      { id: "culture", name: "Cultural Shifts", count: 10, successRate: 60 },
      { id: "academic", name: "Academic Enhancements", count: 7, successRate: 71 },
      { id: "wellbeing", name: "Wellbeing Indicators", count: 5, successRate: 80 },
    ],
    recentImpacts: [
      {
        id: 1,
        title: "Extended Library Hours",
        category: "Academic Enhancements",
        status: "Implemented",
        date: "April 15, 2025",
        impact: "High",
        description: "Library hours extended by 2 hours daily during exam periods based on student feedback.",
        metrics: [
          { name: "Student Usage", before: 45, after: 72, unit: "%" },
          { name: "Study Space Satisfaction", before: 58, after: 87, unit: "%" },
          { name: "Resource Accessibility", before: 62, after: 85, unit: "%" },
        ]
      },
      {
        id: 2,
        title: "Cafeteria Menu Expansion",
        category: "Wellbeing Indicators",
        status: "Implemented",
        date: "March 28, 2025",
        impact: "Medium",
        description: "Added vegetarian and vegan options to daily cafeteria menu based on student council proposal.",
        metrics: [
          { name: "Menu Satisfaction", before: 52, after: 78, unit: "%" },
          { name: "Dietary Needs Met", before: 45, after: 92, unit: "%" },
          { name: "Food Waste", before: 35, after: 18, unit: "%" },
        ]
      },
      {
        id: 3,
        title: "Anti-Bullying Initiative",
        category: "Cultural Shifts",
        status: "In Progress",
        date: "May 5, 2025",
        impact: "Medium",
        description: "Peer-led anti-bullying program implemented based on student feedback and design.",
        metrics: [
          { name: "Reported Incidents", before: 24, after: 10, unit: "per month" },
          { name: "Bystander Intervention", before: 30, after: 65, unit: "%" },
          { name: "School Safety Rating", before: 68, after: 84, unit: "%" },
        ]
      },
      {
        id: 4,
        title: "Outdoor Seating Areas",
        category: "Environmental Improvements",
        status: "Implemented",
        date: "April 2, 2025",
        impact: "Medium",
        description: "Added additional outdoor seating and study spaces based on student design competition.",
        metrics: [
          { name: "Space Utilization", before: 40, after: 85, unit: "%" },
          { name: "Student Satisfaction", before: 55, after: 90, unit: "%" },
          { name: "Outdoor Time", before: 22, after: 45, unit: "min/day avg" },
        ]
      },
      {
        id: 5,
        title: "Homework Policy Revision",
        category: "Policy Influence",
        status: "Implemented",
        date: "February 15, 2025",
        impact: "High",
        description: "Revised homework policy to better balance workload across subjects based on student feedback.",
        metrics: [
          { name: "Workload Balance", before: 42, after: 78, unit: "%" },
          { name: "Stress Levels", before: 72, after: 45, unit: "%" },
          { name: "Assignment Completion", before: 68, after: 85, unit: "%" },
        ]
      }
    ],
    trends: {
      participationTrend: [
        { month: "Sep", value: 45 },
        { month: "Oct", value: 48 },
        { month: "Nov", value: 52 },
        { month: "Dec", value: 55 },
        { month: "Jan", value: 58 },
        { month: "Feb", value: 62 },
        { month: "Mar", value: 65 },
        { month: "Apr", value: 68 },
        { month: "May", value: 72 },
      ],
      implementationTrend: [
        { month: "Sep", value: 2 },
        { month: "Oct", value: 5 },
        { month: "Nov", value: 8 },
        { month: "Dec", value: 12 },
        { month: "Jan", value: 15 },
        { month: "Feb", value: 18 },
        { month: "Mar", value: 22 },
        { month: "Apr", value: 25 },
        { month: "May", value: 28 },
      ],
      satisfactionTrend: [
        { month: "Sep", value: 65 },
        { month: "Oct", value: 68 },
        { month: "Nov", value: 70 },
        { month: "Dec", value: 72 },
        { month: "Jan", value: 74 },
        { month: "Feb", value: 76 },
        { month: "Mar", value: 78 },
        { month: "Apr", value: 80 },
        { month: "May", value: 82 },
      ]
    }
  };
  
  // Get status badge colour
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Implemented":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending Review":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };
  
  // Get impact badge colour
  const getImpactBadgeColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-purple-100 text-purple-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-grey-100 text-grey-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <BarChart className="mr-2 h-5 w-5" />
            Impact Visualisation Tools
          </CardTitle>
          <CardDescription>
            Measuring and visualising the impact of student voice initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="initiatives">Initiative Impact</TabsTrigger>
              <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-2xl font-bold">Impact Dashboard</h2>
                <div className="flex space-x-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic-year">Academic Year</SelectItem>
                      <SelectItem value="term">Current Term</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Implementation Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <Target className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Total Initiatives</span>
                        </div>
                        <Badge variant="outline">{impactData.summary.totalInitiatives}</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>Implemented Changes</span>
                        </div>
                        <Badge variant="outline">{impactData.summary.implementedChanges}</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <Clock className="mr-2 h-4 w-4 text-amber-500" />
                          <span>In Progress</span>
                        </div>
                        <Badge variant="outline">{impactData.summary.inProgressChanges}</Badge>
                      </div>
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre">
                          <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Pending Review</span>
                        </div>
                        <Badge variant="outline">{impactData.summary.pendingReview}</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <PieChartComponent 
                        data={[
                          { name: "Implemented", value: impactData.summary.implementedChanges },
                          { name: "In Progress", value: impactData.summary.inProgressChanges },
                          { name: "Pending", value: impactData.summary.pendingReview }
                        ]}
                        title="Implementation Status"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Participation & Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Student Participation</span>
                          <span className="text-sm font-medium">{impactData.summary.studentParticipation}%</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${impactData.summary.studentParticipation}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall Satisfaction</span>
                          <span className="text-sm font-medium">{impactData.summary.overallSatisfaction}%</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${impactData.summary.overallSatisfaction}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <LineChartComponent 
                          data={impactData.trends.satisfactionTrend}
                          title="Satisfaction Trend"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Impact by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {impactData.categories.map((category) => (
                        <div key={category.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm font-medium">{category.successRate}%</span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2.5">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${category.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-6">
                        <BarChartComponent 
                          data={impactData.categories}
                          title="Impact by Category"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Impacts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Impacts</CardTitle>
                  <CardDescription>
                    Latest changes implemented from student voice initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {impactData.recentImpacts.slice(0, 3).map((impact) => (
                      <Card key={impact.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{impact.title}</CardTitle>
                            <div className="flex space-x-2">
                              <Badge className={getStatusBadgeColor(impact.status)}>
                                {impact.status}
                              </Badge>
                              <Badge className={getImpactBadgeColor(impact.impact)}>
                                {impact.impact} Impact
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>
                            {impact.category} • {impact.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>{impact.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {impact.metrics.map((metric, index) => (
                              <div key={index} className="bg-muted/20 p-3 rounded-lg">
                                <h4 className="text-sm font-medium">{metric.name}</h4>
                                <div className="flex items-end mt-1">
                                  <div className="text-2xl font-bold">{metric.after}</div>
                                  <div className="text-sm text-muted-foreground ml-1">{metric.unit}</div>
                                </div>
                                <div className="flex items-centre text-sm mt-1">
                                  <span className="text-muted-foreground">From {metric.before} {metric.unit}</span>
                                  {metric.after > metric.before ? (
                                    <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                                  ) : (
                                    <ArrowUpRight className="ml-1 h-3 w-3 text-red-500 transform rotate-90" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="ml-auto">
                            View Full Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Impacts
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Initiative Impact Tab */}
            <TabsContent value="initiatives" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-2xl font-bold">Initiative Impact Analysis</h2>
                <div className="flex space-x-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {impactData.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {impactData.recentImpacts.map((impact) => (
                  <Card key={impact.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{impact.title}</CardTitle>
                          <CardDescription>
                            {impact.category} • {impact.date}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusBadgeColor(impact.status)}>
                            {impact.status}
                          </Badge>
                          <Badge className={getImpactBadgeColor(impact.impact)}>
                            {impact.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Initiative Overview</h3>
                          <p className="mb-4">{impact.description}</p>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-centre">
                              <div className="flex items-centre">
                                <Users className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Student Participation</span>
                              </div>
                              <Badge variant="outline">85%</Badge>
                            </div>
                            <div className="flex justify-between items-centre">
                              <div className="flex items-centre">
                                <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
                                <span>Feedback Collected</span>
                              </div>
                              <Badge variant="outline">124 responses</Badge>
                            </div>
                            <div className="flex justify-between items-centre">
                              <div className="flex items-centre">
                                <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                                <span>Implementation Time</span>
                              </div>
                              <Badge variant="outline">45 days</Badge>
                            </div>
                            <div className="flex justify-between items-centre">
                              <div className="flex items-centre">
                                <Zap className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Resources Required</span>
                              </div>
                              <Badge variant="outline">Medium</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Impact Metrics</h3>
                          <div className="space-y-6">
                            {impact.metrics.map((metric, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{metric.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {metric.before} → {metric.after} {metric.unit}
                                  </span>
                                </div>
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-centre justify-between">
                                    <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-grey-200">
                                      Before
                                    </div>
                                    <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200">
                                      After
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-grey-200">
                                    <div style={{ width: `${metric.before}%` }} className="shadow-none flex flex-col text-centre whitespace-nowrap text-white justify-centre bg-grey-500"></div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${metric.after}%` }} className="shadow-none flex flex-col text-centre whitespace-nowrap text-white justify-centre bg-blue-500"></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Comparative Analysis</h3>
                        <BarChartComponent 
                          data={impact.metrics.map(m => ({ name: m.name, before: m.before, after: m.after }))}
                          title="Before vs. After Comparison"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                      <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Results
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Trend Analysis Tab */}
            <TabsContent value="trends" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-2xl font-bold">Trend Analysis</h2>
                <div className="flex space-x-2">
                  <Select defaultValue="academic-year">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic-year">Academic Year</SelectItem>
                      <SelectItem value="term">Current Term</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Participation Trend</CardTitle>
                    <CardDescription>
                      Percentage of students participating in voice initiatives over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent 
                      data={impactData.trends.participationTrend}
                      title="Student Participation"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Current: </span>
                      {impactData.summary.studentParticipation}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Change: </span>
                      <span className="text-green-600">+27%</span> since September
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Progress</CardTitle>
                    <CardDescription>
                      Cumulative number of implemented changes over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent 
                      data={impactData.trends.implementationTrend}
                      title="Implementation Progress"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Current: </span>
                      {impactData.summary.implementedChanges} changes
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Rate: </span>
                      <span className="text-green-600">3.2</span> per month
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Satisfaction Trend</CardTitle>
                    <CardDescription>
                      Overall student satisfaction with voice initiatives over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent 
                      data={impactData.trends.satisfactionTrend}
                      title="Satisfaction Trend"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Current: </span>
                      {impactData.summary.overallSatisfaction}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Change: </span>
                      <span className="text-green-600">+17%</span> since September
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>
                      Distribution of initiatives across impact categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent 
                      data={impactData.categories.map(c => ({ name: c.name, value: c.count }))}
                      title="Category Distribution"
                    />
                  </CardContent>
                  <CardFooter>
                    <div className="w-full grid grid-cols-2 gap-2">
                      {impactData.categories.map((category) => (
                        <div key={category.id} className="flex justify-between">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm font-medium">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comparative Analysis</CardTitle>
                  <CardDescription>
                    Compare impact metrics across different categories and time periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-1/3">
                        <Label htmlFor="metric1">Primary Metric</Label>
                        <Select defaultValue="participation">
                          <SelectTrigger>
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="participation">Student Participation</SelectItem>
                            <SelectItem value="implementation">Implementation Rate</SelectItem>
                            <SelectItem value="satisfaction">Satisfaction</SelectItem>
                            <SelectItem value="impact">Overall Impact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/3">
                        <Label htmlFor="metric2">Comparison Metric</Label>
                        <Select defaultValue="satisfaction">
                          <SelectTrigger>
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="participation">Student Participation</SelectItem>
                            <SelectItem value="implementation">Implementation Rate</SelectItem>
                            <SelectItem value="satisfaction">Satisfaction</SelectItem>
                            <SelectItem value="impact">Overall Impact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/3">
                        <Label htmlFor="timeperiod">Time Period</Label>
                        <Select defaultValue="academic-year">
                          <SelectTrigger>
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic-year">Academic Year</SelectItem>
                            <SelectItem value="term">Current Term</SelectItem>
                            <SelectItem value="month">Past Month</SelectItem>
                            <SelectItem value="all-time">All Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <BarChartComponent 
                        data={impactData.categories.map(c => ({ 
                          name: c.name, 
                          participation: Math.round(Math.random() * 30) + 50, 
                          satisfaction: Math.round(Math.random() * 30) + 50
                        }))}
                        title="Participation vs. Satisfaction by Category"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="ml-auto">
                    <Maximize2 className="mr-2 h-4 w-4" />
                    View Full Analysis
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex justify-between items-centre">
                <h2 className="text-2xl font-bold">Impact Reports</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Report Settings
                  </Button>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Report
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Reports</CardTitle>
                      <CardDescription>
                        Generated reports on student voice impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Annual Impact Summary</h3>
                          <p className="text-sm text-muted-foreground">Academic Year 2024-2025</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Comprehensive</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Term 2 Progress Report</h3>
                          <p className="text-sm text-muted-foreground">January - March 2025</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Quarterly</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Environmental Improvements Analysis</h3>
                          <p className="text-sm text-muted-foreground">Category-specific report</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Category</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Student Participation Trends</h3>
                          <p className="text-sm text-muted-foreground">September 2024 - May 2025</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Trend Analysis</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-centre p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Policy Impact Assessment</h3>
                          <p className="text-sm text-muted-foreground">Category-specific report</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Category</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-title">Report Title</Label>
                        <Input id="report-title" placeholder="Enter report title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comprehensive">Comprehensive</SelectItem>
                            <SelectItem value="category">Category-specific</SelectItem>
                            <SelectItem value="initiative">Initiative-specific</SelectItem>
                            <SelectItem value="trend">Trend Analysis</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time-period">Time Period</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic-year">Academic Year</SelectItem>
                            <SelectItem value="term">Current Term</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="include-sections">Include Sections</Label>
                        <div className="space-y-2">
                          <div className="flex items-centre space-x-2">
                            <input type="checkbox" id="summary" className="rounded" defaultChecked />
                            <Label htmlFor="summary">Executive Summary</Label>
                          </div>
                          <div className="flex items-centre space-x-2">
                            <input type="checkbox" id="metrics" className="rounded" defaultChecked />
                            <Label htmlFor="metrics">Key Metrics</Label>
                          </div>
                          <div className="flex items-centre space-x-2">
                            <input type="checkbox" id="initiatives" className="rounded" defaultChecked />
                            <Label htmlFor="initiatives">Initiative Details</Label>
                          </div>
                          <div className="flex items-centre space-x-2">
                            <input type="checkbox" id="trends" className="rounded" defaultChecked />
                            <Label htmlFor="trends">Trend Analysis</Label>
                          </div>
                          <div className="flex items-centre space-x-2">
                            <input type="checkbox" id="recommendations" className="rounded" defaultChecked />
                            <Label htmlFor="recommendations">Recommendations</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div>
                          <p className="font-medium">Monthly Summary</p>
                          <p className="text-sm text-muted-foreground">End of each month</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-centre">
                        <div>
                          <p className="font-medium">Term Report</p>
                          <p className="text-sm text-muted-foreground">End of each term</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-centre">
                        <div>
                          <p className="font-medium">Annual Impact Report</p>
                          <p className="text-sm text-muted-foreground">End of academic year</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Manage Scheduled Reports
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
