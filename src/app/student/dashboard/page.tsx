'use client';

import { AvatarVideoPlayer } from '@/components/avatar/AvatarVideoSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  Users,
  Target,
  Brain,
  Star,
  Calendar,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Lightbulb,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
  // Mock data for demonstration
  const studentData = {
    name: "Alex Johnson",
    grade: "Year 10",
    currentLevel: "Intermediate",
    completedModules: 12,
    totalModules: 20,
    streakDays: 7,
    points: 2450,
    nextGoal: "Complete Advanced Reading Module"
  };

  const recentActivities = [
    {
      id: 1,
      title: "Mathematics Problem Solving",
      type: "lesson",
      completed: true,
      score: 85,
      timeSpent: "45 min",
      date: "Today"
    },
    {
      id: 2,
      title: "Reading Comprehension Assessment",
      type: "assessment",
      completed: true,
      score: 92,
      timeSpent: "30 min",
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Science Experiment: Chemical Reactions",
      type: "activity",
      completed: false,
      score: null,
      timeSpent: null,
      date: "Pending"
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "History Essay: World War II",
      dueDate: "Tomorrow",
      priority: "high",
      subject: "History"
    },
    {
      id: 2,
      title: "Math Quiz: Algebra",
      dueDate: "Friday",
      priority: "medium",
      subject: "Mathematics"
    },
    {
      id: 3,
      title: "Science Lab Report",
      dueDate: "Next Week",
      priority: "low",
      subject: "Science"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Reading Champion",
      description: "Completed 10 reading modules",
      icon: BookOpen,
      earned: true,
      date: "Last week"
    },
    {
      id: 2,
      title: "Math Wizard",
      description: "Scored 90+ on 5 math assessments",
      icon: Brain,
      earned: true,
      date: "2 weeks ago"
    },
    {
      id: 3,
      title: "Consistency Star",
      description: "7-day learning streak",
      icon: Star,
      earned: true,
      date: "Today"
    },
    {
      id: 4,
      title: "Science Explorer",
      description: "Complete all science modules",
      icon: Lightbulb,
      earned: false,
      date: null
    }
  ];

  const progressData = [
    { subject: "Mathematics", progress: 75, color: "bg-blue-500" },
    { subject: "English", progress: 85, color: "bg-green-500" },
    { subject: "Science", progress: 60, color: "bg-purple-500" },
    { subject: "History", progress: 70, color: "bg-orange-500" },
    { subject: "Geography", progress: 55, color: "bg-teal-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {studentData.name}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Ready to continue your learning journey? You're doing great!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    <div>
                      <p className="text-sm opacity-90">Current Level</p>
                      <p className="text-xl font-bold">{studentData.currentLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8" />
                    <div>
                      <p className="text-sm opacity-90">Total Points</p>
                      <p className="text-xl font-bold">{studentData.points.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {studentData.completedModules}/{studentData.totalModules}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learning Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {studentData.streakDays} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2h 15m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">#3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Subject Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {subject.subject}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.progress}%
                        </span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        activity.completed ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"
                      )}>
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          {activity.completed && (
                            <>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Score: {activity.score}%
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {activity.timeSpent}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.date}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dr. Scott's Avatar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Message from Dr. Scott
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Great progress this week, {studentData.name}!
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        I've noticed your consistent effort in mathematics and reading. Your 7-day learning streak shows real dedication. Keep up the excellent work!
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Chat with Dr. Scott
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {task.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {task.subject}
                          </p>
                        </div>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div key={achievement.id} className={cn(
                        "p-3 rounded-lg border",
                        achievement.earned 
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" 
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      )}>
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            achievement.earned 
                              ? "bg-yellow-100 dark:bg-yellow-900" 
                              : "bg-gray-100 dark:bg-gray-700"
                          )}>
                            <IconComponent className={cn(
                              "w-4 h-4",
                              achievement.earned 
                                ? "text-yellow-600 dark:text-yellow-400" 
                                : "text-gray-600 dark:text-gray-400"
                            )} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {achievement.description}
                            </p>
                            {achievement.earned && achievement.date && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                Earned {achievement.date}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Progress Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Group
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

