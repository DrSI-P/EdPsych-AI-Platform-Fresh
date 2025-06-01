'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BarChart, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare,
  Bell,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Settings,
  PieChart,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function EducatorDashboard() {
  // Mock data for the dashboard
  const classStats = {
    totalStudents: 28,
    attendanceRate: 94,
    assignmentsCompleted: 87,
    averageProgress: 72,
    atRiskStudents: 3
  };

  const recentActivities = [
    { id: 1, type: 'assignment', title: 'Maths Quiz: Equations', status: 'completed', time: '2 hours ago', students: 26 },
    { id: 2, type: 'feedback', title: 'English Essays Feedback', status: 'in-progress', time: 'Yesterday', students: 18 },
    { id: 3, type: 'resource', title: 'Science Video: Forces', status: 'published', time: '3 days ago', students: 28 }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Year 7 Parents Evening', date: 'Tomorrow, 17:00-19:00', priority: 'high' },
    { id: 2, title: 'Submit Term Assessment Reports', date: 'Friday, 15:00', priority: 'high' },
    { id: 3, title: 'Department Meeting', date: 'Next Monday, 09:00', priority: 'medium' }
  ];

  const studentAlerts = [
    { id: 1, student: 'Emma Thompson', issue: 'Missing 3 consecutive assignments', priority: 'high' },
    { id: 2, student: 'James Wilson', issue: 'Attendance below 80% this month', priority: 'high' },
    { id: 3, student: 'Sarah Johnson', issue: 'Test scores declining in Mathematics', priority: 'medium' }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', progress: 76, trend: 'up' },
    { subject: 'English', progress: 68, trend: 'stable' },
    { subject: 'Science', progress: 82, trend: 'up' },
    { subject: 'History', progress: 71, trend: 'down' }
  ];

  // Helper function to get priority badge color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Helper function to get activity status icon
  const getActivityStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'published':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Educator Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's an overview of your class and teaching activities.
        </p>
      </motion.div>

      {/* Class Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{classStats.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{classStats.attendanceRate}%</div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </CardContent>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{classStats.assignmentsCompleted}%</div>
              <p className="text-sm text-muted-foreground">Assignments Completed</p>
            </CardContent>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <BarChart className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{classStats.averageProgress}%</div>
              <p className="text-sm text-muted-foreground">Average Progress</p>
            </CardContent>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <div className="text-3xl font-bold">{classStats.atRiskStudents}</div>
              <p className="text-sm text-muted-foreground">At-Risk Students</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Recent Activities
                </CardTitle>
                <CardDescription className="card-description">
                  Your latest teaching activities and their status
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <ul className="space-y-4">
                  {recentActivities.map(activity => (
                    <li key={activity.id} className="flex items-start">
                      <div className="mr-3">
                        {getActivityStatusIcon(activity.status)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2 badge badge-outline capitalize">
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {activity.students} students
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/activities">
                    View All Activities
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Subject Performance
                </CardTitle>
                <CardDescription className="card-description">
                  Average class performance by subject
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="space-y-4">
                  {subjectPerformance.map(subject => (
                    <div key={subject.subject}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">{subject.subject}</span>
                          {subject.trend === 'up' && (
                            <span className="ml-2 text-green-500 text-sm">↑</span>
                          )}
                          {subject.trend === 'down' && (
                            <span className="ml-2 text-red-500 text-sm">↓</span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{subject.progress}%</span>
                      </div>
                      <Progress 
                        value={subject.progress} 
                        className={`h-2 ${
                          subject.trend === 'up' ? 'bg-green-100' : 
                          subject.trend === 'down' ? 'bg-red-100' : 
                          'bg-amber-100'
                        }`} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/analytics">
                    View Detailed Analytics
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* AI Teaching Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  AI Teaching Assistant
                </CardTitle>
                <CardDescription className="card-description">
                  Automated tools to reduce your administrative workload
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                    <TabsTrigger value="automate">Automate</TabsTrigger>
                    <TabsTrigger value="analyse">Analyse</TabsTrigger>
                  </TabsList>
                  <TabsContent value="generate" className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm mb-4">
                      Generate lesson plans, worksheets, and assessments aligned with the UK curriculum.
                    </p>
                    <Button className="w-full btn btn-primary" asChild>
                      <Link href="/educator/ai-assistant/generate">
                        Generate Materials
                      </Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="automate" className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm mb-4">
                      Automate marking, feedback, and administrative tasks to save time.
                    </p>
                    <Button className="w-full btn btn-primary" asChild>
                      <Link href="/educator/ai-assistant/automate">
                        Automate Tasks
                      </Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="analyse" className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm mb-4">
                      Analyse student performance data to identify patterns and areas for improvement.
                    </p>
                    <Button className="w-full btn btn-primary" asChild>
                      <Link href="/educator/ai-assistant/analyse">
                        Analyse Data
                      </Link>
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <ul className="space-y-3">
                  {upcomingTasks.map(task => (
                    <li key={task.id} className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <div className="flex items-center mt-1">
                          <Badge className={`text-xs mr-2 badge ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {task.date}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/calendar">
                    View Calendar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Student Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Student Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <ul className="space-y-3">
                  {studentAlerts.map(alert => (
                    <li key={alert.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <p className="font-medium">{alert.student}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.issue}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge className={`text-xs badge ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </Badge>
                        <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost" asChild>
                          <Link href={`/educator/students/${alert.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/alerts">
                    View All Alerts
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="btn btn-primary" asChild>
                    <Link href="/educator/attendance">
                      Take Attendance
                    </Link>
                  </Button>
                  <Button className="btn btn-primary" asChild>
                    <Link href="/educator/assignments/create">
                      Create Assignment
                    </Link>
                  </Button>
                  <Button className="btn btn-primary" asChild>
                    <Link href="/educator/parent-communication">
                      Message Parents
                    </Link>
                  </Button>
                  <Button className="btn btn-primary" asChild>
                    <Link href="/educator/resources">
                      Add Resources
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Input Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card card-bordered bg-muted/30 hover:shadow-md transition-shadow">
              <CardContent className="card-body p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Voice Input Available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use voice commands to navigate the platform, create content, and manage your classroom.
                </p>
                <Button size="sm" className="w-full btn btn-sm btn-primary" asChild>
                  <Link href="/speech-recognition?redirect=/educator/dashboard">
                    Try Voice Input
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Administrative Automation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Administrative Automation
            </CardTitle>
            <CardDescription className="card-description">
              Reduce your workload with these automated tools
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Report Generation</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    Automatically generate progress reports, attendance summaries, and performance analytics.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/educator/administrative-automation/reports">
                      Generate Reports
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Marking Assistant</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    AI-powered marking assistance for assignments, with customisable feedback templates.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/educator/administrative-automation/marking">
                      Start Marking
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Parent Communications</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    Schedule and automate parent communications, including progress updates and meeting reminders.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/educator/administrative-automation/communications">
                      Manage Communications
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* UK Curriculum Alignment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                UK Curriculum Alignment Tools
              </h3>
              <p className="text-muted-foreground">
                Access tools to ensure your teaching materials align with the UK National Curriculum, GCSE, and A-Level requirements.
              </p>
            </div>
            <Button size="lg" className="btn btn-lg btn-primary whitespace-nowrap" asChild>
              <Link href="/educator/uk-curriculum-tools">
                Explore Curriculum Tools
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/educator/data-visualisation">
            View Detailed Analytics <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
