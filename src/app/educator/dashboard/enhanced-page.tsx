import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Lightbulb,
  UserCog,
  BookOpen as BookOpenIcon,
  GraduationCap,
  LineChart,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/lib/multi-tenant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EnhancedEducatorDashboard() {
  const router = useRouter();
  const { currentTenant, currentUser, isTenantFeatureEnabled, hasPermission } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for the dashboard
  const classStats = {
    totalStudents: 28,
    attendanceRate: 94,
    assignmentsCompleted: 87,
    averageProgress: 72,
    atRiskStudents: 3,
    improvingStudents: 8
  };

  const recentActivities = [
    { id: 1, type: 'assignment', title: 'Maths Quiz: Equations', status: 'completed', time: '2 hours ago', students: 26 },
    { id: 2, type: 'feedback', title: 'English Essays Feedback', status: 'in-progress', time: 'Yesterday', students: 18 },
    { id: 3, type: 'resource', title: 'Science Video: Forces', status: 'published', time: '3 days ago', students: 28 },
    { id: 4, type: 'assessment', title: 'End of Unit Assessment', status: 'scheduled', time: 'Tomorrow', students: 28 }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Year 7 Parents Evening', date: 'Tomorrow, 17:00-19:00', priority: 'high' },
    { id: 2, title: 'Submit Term Assessment Reports', date: 'Friday, 15:00', priority: 'high' },
    { id: 3, title: 'Department Meeting', date: 'Next Monday, 09:00', priority: 'medium' },
    { id: 4, title: 'Curriculum Planning Session', date: 'Next Wednesday, 14:00', priority: 'medium' }
  ];

  const studentAlerts = [
    { id: 1, student: 'Emma Thompson', issue: 'Missing 3 consecutive assignments', priority: 'high', action: 'Contact parent' },
    { id: 2, student: 'James Wilson', issue: 'Attendance below 80% this month', priority: 'high', action: 'Schedule meeting' },
    { id: 3, student: 'Sarah Johnson', issue: 'Test scores declining in Mathematics', priority: 'medium', action: 'Provide support' },
    { id: 4, student: 'Michael Brown', issue: 'Significant improvement in Science', priority: 'positive', action: 'Recognize achievement' }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', progress: 76, trend: 'up', gap: 12 },
    { subject: 'English', progress: 68, trend: 'stable', gap: 8 },
    { subject: 'Science', progress: 82, trend: 'up', gap: 5 },
    { subject: 'History', progress: 71, trend: 'down', gap: 15 }
  ];
  
  const learningPathsData = [
    { id: 1, name: 'Algebra Foundations', students: 12, completion: 68, status: 'active' },
    { id: 2, name: 'Creative Writing', students: 15, completion: 42, status: 'active' },
    { id: 3, name: 'Scientific Method', students: 28, completion: 91, status: 'completed' }
  ];
  
  const resourceRecommendations = [
    { id: 1, title: 'Interactive Fractions Game', type: 'interactive', relevance: 'high', subject: 'Mathematics' },
    { id: 2, title: 'Essay Structure Templates', type: 'worksheet', relevance: 'medium', subject: 'English' },
    { id: 3, title: 'Periodic Table Quiz', type: 'assessment', relevance: 'high', subject: 'Science' }
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
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
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
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Helper function to get resource type icon
  const getResourceTypeIcon = (type) => {
    switch(type) {
      case 'interactive':
        return <Zap className="h-4 w-4 text-purple-500" />;
      case 'worksheet':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'assessment':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <BookOpenIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Check if advanced analytics is enabled for the current tenant
  const hasAdvancedAnalytics = currentTenant && 
    isTenantFeatureEnabled('advancedAnalytics');
  
  // Check if AI features are enabled for the current tenant
  const hasAIFeatures = currentTenant && 
    isTenantFeatureEnabled('aiTutoring');
  
  // Check if the user has permission to view student data
  const canViewStudentData = currentUser && 
    hasPermission('view:students');
  
  // Check if the user has permission to manage classes
  const canManageClasses = currentUser && 
    hasPermission('edit:classes');
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Loading Dashboard</h1>
          <p className="text-muted-foreground mb-4">Preparing your personalized educator dashboard...</p>
          <div className="w-64 mx-auto">
            <Progress value={80} className="h-2" />
          </div>
        </div>
      </div>
    );
  }
  
  // Render subscription warning if needed
  const renderSubscriptionWarning = () => {
    if (!currentTenant) return null;
    
    if (currentTenant.subscriptionTier === 'free') {
      return (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Limited Features Available</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're using the free tier with limited features. 
            <Button variant="link" className="p-0 h-auto text-amber-700 font-semibold" 
              onClick={() => router.push(`/admin/tenants/${currentTenant.id}/subscription/pricing`)}>
              Upgrade your subscription
            </Button> to access advanced analytics, AI features, and more.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Educator Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back{currentUser ? `, ${currentUser.name}` : ''}! Here's an overview of your teaching activities.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center" asChild>
              <Link href="/educator/classes">
                <Users className="mr-2 h-4 w-4" />
                Manage Classes
              </Link>
            </Button>
            <Button className="flex items-center" asChild>
              <Link href="/educator/resources">
                <BookOpenIcon className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Subscription warning */}
      {renderSubscriptionWarning()}

      {/* Class Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
          
          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardContent className="card-body p-6 flex flex-col items-center justify-center text-center">
              <LineChart className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-3xl font-bold">{classStats.improvingStudents}</div>
              <p className="text-sm text-muted-foreground">Improving Students</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Learning Paths
                </CardTitle>
                <CardDescription className="card-description">
                  Personalized learning journeys for your students
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <ul className="space-y-4">
                  {learningPathsData.map(path => (
                    <li key={path.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{path.name}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2 badge badge-outline capitalize">
                              {path.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {path.students} students
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8" asChild>
                          <Link href={`/educator/learning-paths/${path.id}`}>
                            <span className="sr-only">View details</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span className="font-medium">{path.completion}%</span>
                        </div>
                        <Progress value={path.completion} className="h-2" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/learning-paths">
                    Manage Learning Paths
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
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
            transition={{ delay: 0.4, duration: 0.5 }}
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
                      {hasAdvancedAnalytics && (
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Learning gap: {subject.gap}%</span>
                          <Link href={`/educator/analytics/subjects/${subject.subject.toLowerCase()}`} className="text-primary hover:underline">
                            View detailed analysis
                          </Link>
                        </div>
                      )}
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
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Student Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Student Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                {canViewStudentData ? (
                  <ul className="space-y-3">
                    {studentAlerts.map(alert => (
                      <li key={alert.id} className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          alert.priority === 'high' ? 'bg-red-100' : 
                          alert.priority === 'medium' ? 'bg-amber-100' : 
                          alert.priority === 'positive' ? 'bg-green-100' : 
                          'bg-muted'
                        }`}>
                          {alert.priority === 'high' ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : alert.priority === 'medium' ? (
                            <Bell className="h-4 w-4 text-amber-500" />
                          ) : alert.priority === 'positive' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Bell className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{alert.student}</p>
                          <p className="text-sm text-muted-foreground">{alert.issue}</p>
                          <div className="flex items-center mt-1">
                            <Badge className={`text-xs mr-2 badge ${getPriorityColor(alert.priority)}`}>
                              {alert.priority}
                            </Badge>
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                              <Link href={`/educator/students/${alert.student.toLowerCase().replace(' ', '-')}`}>
                                {alert.action}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      You don't have permission to view student data.
                    </p>
                    <Button variant="link" className="mt-2" asChild>
                      <Link href="/educator/permissions">
                        Request Access
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/students">
                    View All Students
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
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

          {/* Resource Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-primary" />
                  Recommended Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <ul className="space-y-3">
                  {resourceRecommendations.map(resource => (
                    <li key={resource.id} className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {getResourceTypeIcon(resource.type)}
                      </div>
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs mr-2">
                            {resource.subject}
                          </Badge>
                          <Badge className={`text-xs ${
                            resource.relevance === 'high' ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {resource.relevance} relevance
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="card-footer">
                <Button variant="outline" className="w-full btn btn-outline" asChild>
                  <Link href="/educator/resources">
                    Browse All Resources
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* AI Teaching Assistant */}
          {hasAIFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <CardTitle className="card-title flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                    AI Teaching Assistant
                  </CardTitle>
                  <CardDescription className="card-description">
                    Automated tools to reduce your workload
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
          )}
        </div>
      </div>
    </div>
  );
}
