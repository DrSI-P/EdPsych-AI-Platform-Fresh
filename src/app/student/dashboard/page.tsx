import { VoiceReadableHeading, VoiceReadableText } from '@/components/accessibility';
import { AvatarVideoPlayer } from '@/components/avatar/AvatarVideoSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar,
  Target,
  Brain,
  Users,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <VoiceReadableHeading level={1} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Student!
          </VoiceReadableHeading>
          <VoiceReadableText className="text-gray-600 dark:text-gray-300">
            Continue your personalized learning journey with EdPsych Connect
          </VoiceReadableText>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dr. Scott's Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Dr. Scott's Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AvatarVideoPlayer
                  scriptId="student-dashboard"
                  autoPlay={false}
                  showControls={true}
                />
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Mathematics</span>
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">English Language Arts</span>
                    <span className="text-sm text-gray-600">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Science</span>
                    <span className="text-sm text-gray-600">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Social Studies</span>
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Current Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Current Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Algebra Fundamentals</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Master basic algebraic concepts and problem-solving
                      </p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">Reading Comprehension</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Improve critical reading and analysis skills
                      </p>
                    </div>
                    <Badge variant="outline">Next</Badge>
                  </div>
                </div>
                
                <Link href="/student/learning-path">
                  <Button className="w-full mt-4">
                    View Full Learning Path
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lessons Completed</span>
                  <Badge variant="secondary">47</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assessments Taken</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Achievements</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Streak</span>
                  <Badge className="bg-green-600">5 days</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Math Master</div>
                    <div className="text-xs text-gray-600">Completed 10 math lessons</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Bookworm</div>
                    <div className="text-xs text-gray-600">Read 5 articles this week</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Goal Getter</div>
                    <div className="text-xs text-gray-600">Reached weekly goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-medium text-sm">Math Assessment</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Tomorrow, 2:00 PM</div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium text-sm">Study Group</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Friday, 3:30 PM</div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-medium text-sm">Progress Review</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Next Monday</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/student/assessment">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 w-4 h-4" />
                    Take Assessment
                  </Button>
                </Link>
                
                <Link href="/student/resources">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="mr-2 w-4 h-4" />
                    Study Resources
                  </Button>
                </Link>
                
                <Link href="/student-voice">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    Student Voice
                  </Button>
                </Link>
                
                <Link href="/interactive-avatar">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 w-4 h-4" />
                    Chat with Dr. Scott
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

