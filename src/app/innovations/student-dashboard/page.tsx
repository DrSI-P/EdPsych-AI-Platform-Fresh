'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Bell, BookOpen, Calendar, CheckCircle, Clock, FileText, Home, MessageSquare, Search, Settings, Star, Trophy } from "lucide-react";

const subjectProgress = [
  { name: 'English', progress: 75, target: 85 },
  { name: 'Mathematics', progress: 82, target: 85 },
  { name: 'Science', progress: 68, target: 80 },
  { name: 'History', progress: 90, target: 85 },
  { name: 'Geography', progress: 72, target: 80 },
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.1 },
  { day: 'Sat', hours: 1.2 },
  { day: 'Sun', hours: 0.8 },
];

const learningStyleData = [
  { name: 'Visual', value: 40 },
  { name: 'Auditory', value: 25 },
  { name: 'Reading/Writing', value: 20 },
  { name: 'Kinesthetic', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-centre">
              <Avatar className="h-20 w-20 my-2">
                <AvatarImage src="/images/avatars/student-avatar.png" alt="Student Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">Jamie Davies</h2>
              <p className="text-muted-foreground">Year 5 - Maple Class</p>
              <div className="flex items-centre mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2 text-sm font-medium">4.2</span>
              </div>
              <Button className="w-full mt-4">Edit Profile</Button>
            </CardContent>
            <Separator />
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                <Button 
                  variant={activeTab === "dashboard" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "subjects" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("subjects")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Subjects
                </Button>
                <Button 
                  variant={activeTab === "assignments" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("assignments")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Assignments
                </Button>
                <Button 
                  variant={activeTab === "goals" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("goals")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Goals
                </Button>
                <Button 
                  variant={activeTab === "messages" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button 
                  variant={activeTab === "calendar" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Learning Style</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={learningStyleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {learningStyleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-centre text-muted-foreground mt-2">
                Based on your learning activities and preferences
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-centre mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">
                Track your progress, manage assignments, and set learning goals
              </p>
            </div>
            <div className="flex items-centre gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] rounded-full bg-background pl-8 py-2 text-sm ring-1 ring-slate-200 dark:ring-slate-800"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Overall Progress
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <Progress value={78} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Assignments Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24/30</div>
                    <Progress value={80} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      6 assignments remaining
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Learning Hours
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">16.1h</div>
                    <Progress value={65} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      This week (target: 25h)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Achievement Badges
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <Progress value={60} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      8 more to reach next level
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>
                      Your current progress across all subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={subjectProgress}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="progress" fill="#8884d8" name="Current Progress" />
                          <Bar dataKey="target" fill="#82ca9d" name="Target" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                    <CardDescription>
                      Hours spent learning each day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weeklyActivity}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="hours"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Hours"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Upcoming Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>
                    Your pending tasks and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Mathematics Problem Set", subject: "Mathematics", due: "Tomorrow", status: "Not Started", priority: "High" },
                      { title: "Book Report", subject: "English", due: "3 days", status: "In Progress", priority: "Medium" },
                      { title: "Science Experiment", subject: "Science", due: "5 days", status: "Not Started", priority: "Medium" },
                      { title: "History Timeline", subject: "History", due: "1 week", status: "In Progress", priority: "Low" },
                    ].map((assignment, i) => (
                      <div key={i} className="flex items-centre justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.due}</div>
                        </div>
                        <div className="flex items-centre gap-3">
                          <Badge variant={
                            assignment.status === "Not Started" ? "outline" : 
                            assignment.status === "In Progress" ? "secondary" : "default"
                          }>
                            {assignment.status}
                          </Badge>
                          <Badge variant={
                            assignment.priority === "High" ? "destructive" : 
                            assignment.priority === "Medium" ? "default" : "outline"
                          }>
                            {assignment.priority}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Assignments
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>
                    Badges and milestones you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Math Master", description: "Completed all algebra exercises with 90%+ accuracy", date: "2 days ago" },
                      { name: "Bookworm", description: "Read 5 books this month", date: "1 week ago" },
                      { name: "Science Explorer", description: "Completed all science experiments", date: "2 weeks ago" },
                      { name: "Consistent Learner", description: "Logged in for 14 consecutive days", date: "3 weeks ago" },
                    ].map((achievement, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-primary h-2"></div>
                        <CardHeader className="p-4">
                          <div className="flex justify-centre mb-2">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <CardTitle className="text-centre text-sm">{achievement.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-xs text-centre text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-centre mt-2 font-medium">{achievement.date}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab !== "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
                <CardDescription>
                  This section is under development. Please check back soon for updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-centre justify-centre py-10">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  <Settings className="h-10 w-10 text-primary animate-spin-slow" />
                </div>
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-centre text-muted-foreground max-w-md">
                  We're working hard to bring you the best {activeTab} experience. 
                  This feature will be available in the next update.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("dashboard")}>
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
