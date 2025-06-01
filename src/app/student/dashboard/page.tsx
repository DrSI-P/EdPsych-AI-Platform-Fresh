'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  BarChart3, 
  MessageSquare, 
  Lightbulb,
  Bookmark,
  ChevronRight,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  // Mock data for the dashboard
  const courses = [
    { 
      id: 1, 
      title: 'Mathematics - Year 7', 
      progress: 68, 
      lastActivity: '2 days ago',
      nextLesson: 'Algebraic Expressions',
      image: '/images/subjects/maths.jpg'
    },
    { 
      id: 2, 
      title: 'English Literature - Year 7', 
      progress: 42, 
      lastActivity: 'Yesterday',
      nextLesson: 'Poetry Analysis',
      image: '/images/subjects/english.jpg'
    },
    { 
      id: 3, 
      title: 'Science - Year 7', 
      progress: 89, 
      lastActivity: 'Today',
      nextLesson: 'Forces and Motion',
      image: '/images/subjects/science.jpg'
    }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Maths Quiz: Equations', dueDate: 'Tomorrow, 3:00 PM', subject: 'Mathematics' },
    { id: 2, title: 'Book Report: Oliver Twist', dueDate: 'Friday, 5:00 PM', subject: 'English' },
    { id: 3, title: 'Lab Report: Plant Growth', dueDate: 'Next Monday, 9:00 AM', subject: 'Science' }
  ];

  const achievements = [
    { id: 1, title: 'Maths Master', description: 'Completed 10 maths lessons in a row', date: '3 days ago' },
    { id: 2, title: 'Reading Champion', description: 'Read 5 books this term', date: '1 week ago' },
    { id: 3, title: 'Science Explorer', description: 'Completed all Year 7 science modules', date: '2 weeks ago' }
  ];

  const notifications = [
    { id: 1, title: 'New feedback available', description: 'Your English teacher has provided feedback on your essay', time: '1 hour ago' },
    { id: 2, title: 'Assignment reminder', description: 'Your maths homework is due tomorrow', time: '3 hours ago' },
    { id: 3, title: 'New resource available', description: 'A new science video has been added to your resources', time: '1 day ago' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's an overview of your learning journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow h-full">
            <CardHeader className="card-header pb-2">
              <CardTitle className="card-title text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="card-body">
              <div className="text-3xl font-bold text-primary">67%</div>
              <p className="text-sm text-muted-foreground">Overall completion for Year 7</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mathematics</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2 mb-3" />
                
                <div className="flex justify-between text-sm mb-1">
                  <span>English</span>
                  <span className="font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2 mb-3" />
                
                <div className="flex justify-between text-sm mb-1">
                  <span>Science</span>
                  <span className="font-medium">89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost" asChild>
                <Link href="/student/learning-path">
                  View Learning Path <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow h-full">
            <CardHeader className="card-header pb-2">
              <CardTitle className="card-title text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="card-body">
              <ul className="space-y-3">
                {upcomingAssignments.map(assignment => (
                  <li key={assignment.id} className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{assignment.title}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs mr-2">
                          {assignment.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due: {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost" asChild>
                <Link href="/student/assignments">
                  View All Assignments <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow h-full">
            <CardHeader className="card-header pb-2">
              <CardTitle className="card-title text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="card-body">
              <ul className="space-y-3">
                {notifications.map(notification => (
                  <li key={notification.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {notification.time}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost" asChild>
                <Link href="/student/notifications">
                  View All Notifications <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Courses Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Button variant="outline" size="sm" className="btn btn-sm btn-outline" asChild>
            <Link href="/student/courses">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="card-title">{course.title}</CardTitle>
                  <Badge className="badge badge-primary">{course.progress}%</Badge>
                </div>
                <CardDescription className="card-description">
                  Last activity: {course.lastActivity}
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <p className="text-sm">
                  <span className="font-medium">Next lesson:</span> {course.nextLesson}
                </p>
              </CardContent>
              <CardFooter className="card-footer pt-0">
                <Button className="w-full btn btn-primary" asChild>
                  <Link href={`/student/courses/${course.id}`}>
                    Continue Learning
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="card-body">
              <ul className="space-y-4">
                {achievements.map(achievement => (
                  <li key={achievement.id} className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned {achievement.date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="card-footer">
              <Button variant="outline" className="w-full btn btn-outline" asChild>
                <Link href="/student/achievements">
                  View All Achievements
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* AI Learning Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                AI Learning Assistant
              </CardTitle>
              <CardDescription className="card-description">
                Get personalised help with your studies
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              <Tabs defaultValue="ask" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="ask">Ask a Question</TabsTrigger>
                  <TabsTrigger value="explain">Explain a Topic</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>
                <TabsContent value="ask" className="p-4 bg-muted/50 rounded-md">
                  <p className="text-sm mb-4">
                    Ask any question about your coursework and get immediate help.
                  </p>
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-assistant?mode=ask">
                      Ask AI Assistant
                    </Link>
                  </Button>
                </TabsContent>
                <TabsContent value="explain" className="p-4 bg-muted/50 rounded-md">
                  <p className="text-sm mb-4">
                    Get any topic explained in a way that's easy to understand.
                  </p>
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-assistant?mode=explain">
                      Get Explanations
                    </Link>
                  </Button>
                </TabsContent>
                <TabsContent value="practice" className="p-4 bg-muted/50 rounded-md">
                  <p className="text-sm mb-4">
                    Generate practice questions to test your knowledge.
                  </p>
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-assistant?mode=practice">
                      Practice with AI
                    </Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Voice Input Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Voice Input Available
              </h3>
              <p className="text-muted-foreground">
                Having trouble typing? Use our voice input feature to interact with the platform using just your voice.
                Perfect for all learners, especially those with dyslexia or motor difficulties.
              </p>
            </div>
            <Button size="lg" className="btn btn-lg btn-primary whitespace-nowrap" asChild>
              <Link href="/speech-recognition">
                Try Voice Input
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recommended Resources</h2>
          <Button variant="outline" size="sm" className="btn btn-sm btn-outline" asChild>
            <Link href="/student/resources">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardHeader className="card-header pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="card-title text-lg">Maths Revision Guide</CardTitle>
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription className="card-description">
                Year 7 - Key concepts and practice questions
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              <p className="text-sm text-muted-foreground">
                A comprehensive guide covering all Year 7 maths topics with practice questions and worked examples.
              </p>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="outline" className="w-full btn btn-outline" asChild>
                <Link href="/student/resources/maths-revision">
                  View Resource
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardHeader className="card-header pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="card-title text-lg">English Writing Tips</CardTitle>
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription className="card-description">
                Improve your essay writing skills
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              <p className="text-sm text-muted-foreground">
                Learn how to structure essays, use literary techniques, and develop your writing style for better marks.
              </p>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="outline" className="w-full btn btn-outline" asChild>
                <Link href="/student/resources/english-writing">
                  View Resource
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="card card-bordered hover:shadow-md transition-shadow">
            <CardHeader className="card-header pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="card-title text-lg">Science Experiments</CardTitle>
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription className="card-description">
                Interactive videos and simulations
              </CardDescription>
            </CardHeader>
            <CardContent className="card-body">
              <p className="text-sm text-muted-foreground">
                Watch and interact with science experiments covering key Year 7 topics in biology, chemistry and physics.
              </p>
            </CardContent>
            <CardFooter className="card-footer pt-0">
              <Button variant="outline" className="w-full btn btn-outline" asChild>
                <Link href="/student/resources/science-experiments">
                  View Resource
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
