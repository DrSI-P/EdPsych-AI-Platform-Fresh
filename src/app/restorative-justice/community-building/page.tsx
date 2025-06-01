'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  BarChart,
  PieChart,
  LineChart,
  CheckSquare,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Heart,
  Share2,
  Zap,
  Award,
  Star,
  MessageCircle,
  Smile,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function CommunityBuildingPage() {
  const [activeTab, setActiveTab] = useState('visualizations');
  const [selectedClass, setSelectedClass] = useState('year5');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample class data
  const classData = {
    year5: {
      name: "Year 5 Oak",
      teacher: "Ms. Johnson",
      students: 28,
      connections: 87,
      positiveInteractions: 156,
      communityScore: 78,
      weeklyTrend: "+12%",
      activities: [
        { 
          id: 1, 
          name: "Circle Time Reflections", 
          date: "Monday, 26 May", 
          participation: 92, 
          impact: "High",
          notes: "Students shared personal achievements and offered support to peers."
        },
        { 
          id: 2, 
          name: "Collaborative Art Project", 
          date: "Wednesday, 28 May", 
          participation: 100, 
          impact: "Very High",
          notes: "All students contributed to the community mural, showing excellent cooperation."
        },
        { 
          id: 3, 
          name: "Peer Recognition Session", 
          date: "Friday, 30 May", 
          participation: 85, 
          impact: "Medium",
          notes: "Students recognized peers for helpful actions throughout the week."
        }
      ],
      strengths: ["Collaboration", "Empathy", "Communication"],
      growthAreas: ["Conflict Resolution", "Inclusive Practices"],
      connectionMap: [
        // Simplified connection data for visualization
        { from: "Student 1", to: "Student 2", strength: 3 },
        { from: "Student 1", to: "Student 5", strength: 2 },
        { from: "Student 2", to: "Student 3", strength: 4 },
        { from: "Student 3", to: "Student 4", strength: 1 },
        { from: "Student 4", to: "Student 5", strength: 3 },
        { from: "Student 5", to: "Student 6", strength: 2 },
        { from: "Student 6", to: "Student 1", strength: 3 },
      ]
    },
    year7: {
      name: "Year 7 Maple",
      teacher: "Mr. Thompson",
      students: 32,
      connections: 104,
      positiveInteractions: 189,
      communityScore: 72,
      weeklyTrend: "+8%",
      activities: [
        { 
          id: 1, 
          name: "Team Building Challenge", 
          date: "Tuesday, 27 May", 
          participation: 94, 
          impact: "High",
          notes: "Students worked in mixed groups to solve complex problems."
        },
        { 
          id: 2, 
          name: "Community Values Workshop", 
          date: "Thursday, 29 May", 
          participation: 88, 
          impact: "Medium",
          notes: "Students collaborated to define shared classroom values."
        },
        { 
          id: 3, 
          name: "Peer Support Training", 
          date: "Friday, 30 May", 
          participation: 75, 
          impact: "High",
          notes: "Selected students received training to support peers with challenges."
        }
      ],
      strengths: ["Leadership", "Problem-solving", "Teamwork"],
      growthAreas: ["Active Listening", "Emotional Awareness"],
      connectionMap: [
        // Simplified connection data for visualization
        { from: "Student 1", to: "Student 2", strength: 2 },
        { from: "Student 1", to: "Student 7", strength: 3 },
        { from: "Student 2", to: "Student 3", strength: 2 },
        { from: "Student 3", to: "Student 4", strength: 4 },
        { from: "Student 4", to: "Student 5", strength: 1 },
        { from: "Student 5", to: "Student 6", strength: 3 },
        { from: "Student 6", to: "Student 7", strength: 2 },
        { from: "Student 7", to: "Student 1", strength: 3 },
      ]
    },
    year10: {
      name: "Year 10 Birch",
      teacher: "Dr. Williams",
      students: 30,
      connections: 95,
      positiveInteractions: 142,
      communityScore: 65,
      weeklyTrend: "+5%",
      activities: [
        { 
          id: 1, 
          name: "Peer Mentoring Session", 
          date: "Monday, 26 May", 
          participation: 80, 
          impact: "High",
          notes: "Older students mentored younger students on academic and social challenges."
        },
        { 
          id: 2, 
          name: "Community Project Planning", 
          date: "Wednesday, 28 May", 
          participation: 90, 
          impact: "Medium",
          notes: "Students planned a community service project to benefit local primary school."
        },
        { 
          id: 3, 
          name: "Restorative Circle", 
          date: "Thursday, 29 May", 
          participation: 70, 
          impact: "Very High",
          notes: "Students addressed recent tensions and developed shared solutions."
        }
      ],
      strengths: ["Critical Thinking", "Responsibility", "Initiative"],
      growthAreas: ["Group Cohesion", "Respectful Disagreement"],
      connectionMap: [
        // Simplified connection data for visualization
        { from: "Student 1", to: "Student 2", strength: 1 },
        { from: "Student 1", to: "Student 8", strength: 3 },
        { from: "Student 2", to: "Student 3", strength: 2 },
        { from: "Student 3", to: "Student 4", strength: 3 },
        { from: "Student 4", to: "Student 5", strength: 1 },
        { from: "Student 5", to: "Student 6", strength: 2 },
        { from: "Student 6", to: "Student 7", strength: 3 },
        { from: "Student 7", to: "Student 8", strength: 4 },
        { from: "Student 8", to: "Student 1", strength: 2 },
      ]
    }
  };
  
  // Get current class data
  const currentClass = classData[selectedClass];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Impact badge color mapping
  const getImpactColor = (impact) => {
    switch(impact.toLowerCase()) {
      case 'very high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Community score color mapping
  const getCommunityScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Community Building Visualizations</h1>
        <p className="text-muted-foreground text-lg">
          Visual tools to strengthen classroom and school community connections
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <Tabs defaultValue="visualizations" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            {/* Visualizations Tab */}
            <TabsContent value="visualizations">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Community Connection Map</CardTitle>
                        <CardDescription>
                          Visual representation of classroom community connections
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="class-select" className="text-sm font-medium">Class:</label>
                        <select 
                          id="class-select"
                          className="border rounded-md p-2 text-sm"
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value="year5">Year 5 Oak</option>
                          <option value="year7">Year 7 Maple</option>
                          <option value="year10">Year 10 Birch</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{currentClass.name}</h3>
                          <p className="text-sm text-muted-foreground">Teacher: {currentClass.teacher}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {currentClass.students} Students
                          </Badge>
                          <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                            {currentClass.connections} Connections
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Connection Visualization */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex justify-center items-center h-64">
                          {/* This would be replaced with an actual D3.js or similar visualization */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 mb-4">
                              {/* Simplified visual representation */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary/30"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-primary/50"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-primary/70"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary"></div>
                              
                              {/* Connection nodes */}
                              <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-blue-500"></div>
                              <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-green-500"></div>
                              <div className="absolute bottom-1/4 left-1/4 w-4 h-4 rounded-full bg-amber-500"></div>
                              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-purple-500"></div>
                              
                              {/* Connection lines */}
                              <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-blue-300 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                              <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-green-300 transform -translate-x-1/2 -translate-y-1/2 rotate-135"></div>
                              <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-amber-300 transform -translate-x-1/2 -translate-y-1/2 rotate-225"></div>
                              <div className="absolute top-1/2 left-1/2 w-16 h-1 bg-purple-300 transform -translate-x-1/2 -translate-y-1/2 rotate-315"></div>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                              Interactive visualization showing student connections and relationship strength.
                              <br />
                              <span className="text-xs">Note: This is a simplified representation. The actual tool would use D3.js for interactive network visualization.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold">{currentClass.connections}</div>
                                <div className="text-sm text-muted-foreground">Total Connections</div>
                              </div>
                              <Share2 className="h-8 w-8 text-primary/40" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-green-700">{currentClass.positiveInteractions}</div>
                                <div className="text-sm text-green-600">Positive Interactions</div>
                              </div>
                              <Heart className="h-8 w-8 text-green-300" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-blue-700">{currentClass.communityScore}</div>
                                <div className="text-sm text-blue-600">Community Score</div>
                              </div>
                              <Users className="h-8 w-8 text-blue-300" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-amber-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-amber-700">{currentClass.weeklyTrend}</div>
                                <div className="text-sm text-amber-600">Weekly Trend</div>
                              </div>
                              <Activity className="h-8 w-8 text-amber-300" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Community Strengths and Growth Areas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Community Strengths</h3>
                          <div className="space-y-2">
                            {currentClass.strengths.map((strength, index) => (
                              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                                <Star className="h-5 w-5 text-green-500 mr-3" />
                                <span>{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Growth Areas</h3>
                          <div className="space-y-2">
                            {currentClass.growthAreas.map((area, index) => (
                              <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg">
                                <Zap className="h-5 w-5 text-amber-500 mr-3" />
                                <span>{area}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Activities Tab */}
            <TabsContent value="activities">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Community Building Activities</CardTitle>
                        <CardDescription>
                          Interactive activities to strengthen classroom community
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" /> New Activity
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Class Selector */}
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Search activities..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="activity-class-select" className="text-sm font-medium">Class:</label>
                          <select 
                            id="activity-class-select"
                            className="border rounded-md p-2 text-sm"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                          >
                            <option value="year5">Year 5 Oak</option>
                            <option value="year7">Year 7 Maple</option>
                            <option value="year10">Year 10 Birch</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Recent Activities */}
                    <motion.div variants={itemVariants}>
                      <h3 className="font-medium mb-4">Recent Activities</h3>
                      <div className="space-y-4">
                        {currentClass.activities.map((activity) => (
                          <Card key={activity.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.date}
                                  </p>
                                </div>
                                <Badge className={getImpactColor(activity.impact)}>
                                  {activity.impact} Impact
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Participation</span>
                                  <span className="text-xs font-medium">{activity.participation}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full bg-blue-500"
                                    style={{ width: `${activity.participation}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <p className="text-sm">{activity.notes}</p>
                              </div>
                              
                              <div className="flex justify-end items-center mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary text-xs"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Activity Library */}
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Activity Library</h3>
                          <Button variant="outline" size="sm">
                            Browse All
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Users className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">Circle Time Activities</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Structured activities for building trust and communication during circle time.
                              </p>
                              <Button variant="outline" size="sm" className="w-full">
                                View Activities
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <MessageCircle className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">Collaborative Projects</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Group projects designed to foster cooperation and shared responsibility.
                              </p>
                              <Button variant="outline" size="sm" className="w-full">
                                View Activities
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Award className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">Recognition Practices</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Activities for acknowledging contributions and celebrating community success.
                              </p>
                              <Button variant="outline" size="sm" className="w-full">
                                View Activities
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Community Progress Tracking</CardTitle>
                    <CardDescription>
                      Monitor and visualize community building progress over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Class Selector */}
                      <motion.div variants={itemVariants} className="flex items-center gap-2">
                        <label htmlFor="progress-class-select" className="text-sm font-medium">Class:</label>
                        <select 
                          id="progress-class-select"
                          className="border rounded-md p-2 text-sm"
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value="year5">Year 5 Oak</option>
                          <option value="year7">Year 7 Maple</option>
                          <option value="year10">Year 10 Birch</option>
                        </select>
                      </motion.div>
                      
                      {/* Community Score */}
                      <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Community Score</h3>
                          <span className="text-sm font-medium">{currentClass.communityScore}/100</span>
                        </div>
                        <Progress 
                          value={currentClass.communityScore} 
                          className={`h-2 ${getCommunityScoreColor(currentClass.communityScore)}`} 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Developing</span>
                          <span>Established</span>
                          <span>Thriving</span>
                        </div>
                      </motion.div>
                      
                      {/* Progress Over Time */}
                      <motion.div variants={itemVariants}>
                        <h3 className="font-medium mb-4">Progress Over Time</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                              <LineChart className="h-32 w-32 text-primary mb-4" />
                              <p className="text-center text-sm text-muted-foreground">
                                This chart shows community score progress over the term.
                                <br />
                                The trend indicates steady improvement in classroom cohesion.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Key Metrics */}
                      <motion.div variants={itemVariants}>
                        <h3 className="font-medium mb-4">Key Community Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Share2 className="h-5 w-5 text-blue-500 mr-2" />
                                <h4 className="font-medium">Connection Density</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">78%</div>
                                <Badge className="bg-green-100 text-green-800">
                                  +12% this term
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Percentage of possible connections that are active
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Heart className="h-5 w-5 text-red-500 mr-2" />
                                <h4 className="font-medium">Positive Interaction Rate</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">85%</div>
                                <Badge className="bg-green-100 text-green-800">
                                  +8% this term
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Percentage of interactions rated as positive
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <Users className="h-5 w-5 text-purple-500 mr-2" />
                                <h4 className="font-medium">Inclusion Index</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">72%</div>
                                <Badge className="bg-amber-100 text-amber-800">
                                  +5% this term
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Measure of how included all students feel
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-3">
                                <MessageCircle className="h-5 w-5 text-green-500 mr-2" />
                                <h4 className="font-medium">Communication Quality</h4>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">81%</div>
                                <Badge className="bg-green-100 text-green-800">
                                  +15% this term
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Rating of effective and respectful communication
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                      
                      {/* Report Actions */}
                      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" /> Generate Progress Report
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                        <Button variant="ghost">
                          <Calendar className="h-4 w-4 mr-2" /> Schedule Reports
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-8">
          {/* UK Educational Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UK Educational Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Community building visualizations support UK educational frameworks for social and emotional development.
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">UK Curriculum Alignment:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports PSHE curriculum objectives for relationships</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Aligns with Ofsted framework for personal development</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Complements DfE guidance on character education</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" /> Create New Activity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Activity Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" /> Export Visualizations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" /> Manage Class Groups
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Implementation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Start with Strengths</p>
                      <p className="text-muted-foreground">Begin by identifying and building on existing community strengths</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Student Voice</p>
                      <p className="text-muted-foreground">Involve students in selecting and leading community activities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Visual Progress</p>
                      <p className="text-muted-foreground">Share visualizations with students to celebrate growth</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Consistent Practice</p>
                      <p className="text-muted-foreground">Schedule regular community building activities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Community Building Resources</CardTitle>
            <CardDescription>
              Tools and resources to support effective community building
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Activity Library</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Age-appropriate community building activities for different educational contexts.
                  </p>
                  <Button variant="outline" className="w-full">Access Activities</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Visual Resources</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Printable visualizations, classroom displays, and other resources for community building.
                  </p>
                  <Button variant="outline" className="w-full">Download Resources</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Research Evidence</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    UK-based research on effective community building practices in educational settings.
                  </p>
                  <Button variant="outline" className="w-full">View Research</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/agreement-tracking">
            Agreement Tracking
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/reflection-prompts">
            Reflection Prompts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
