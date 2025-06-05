import { VoiceReadableHeading, VoiceReadableText } from '@/components/accessibility';
import { AvatarVideoPlayer } from '@/components/avatar/AvatarVideoSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Smartphone, 
  Users, 
  Brain,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function PlatformOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <VoiceReadableHeading level={1} className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            EdPsych Connect Platform Overview
          </VoiceReadableHeading>
          <VoiceReadableText className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Discover how our comprehensive educational psychology platform transforms learning 
            through AI-powered tools, evidence-based practices, and personalized support.
          </VoiceReadableText>
        </div>

        {/* Platform Demo Video */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
              <CardTitle className="text-2xl">Platform Demonstration</CardTitle>
              <p className="text-blue-100">Watch Dr. Scott guide you through the platform features</p>
            </CardHeader>
            <CardContent className="p-0">
              <AvatarVideoPlayer
                scriptId="navigation-guide"
                autoPlay={false}
                showControls={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Key Features Grid */}
        <div className="mb-16">
          <VoiceReadableHeading level={2} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Platform Capabilities
          </VoiceReadableHeading>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>200+ Features</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText>
                  Comprehensive suite of tools covering every aspect of educational psychology practice
                </VoiceReadableText>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText>
                  Advanced artificial intelligence for personalized learning and intelligent assessment
                </VoiceReadableText>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Evidence-Based</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText>
                  All tools grounded in current educational psychology research and best practices
                </VoiceReadableText>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle>Accessible</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText>
                  Full accessibility features including voice navigation and screen reader support
                </VoiceReadableText>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mb-16">
          <VoiceReadableHeading level={2} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Designed for Everyone
          </VoiceReadableHeading>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-blue-100 text-blue-800 mb-4">Students</Badge>
                <CardTitle>Personalized Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Learning path optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Assessment tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Study resources
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-4">Educators</Badge>
                <CardTitle>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Classroom management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Curriculum planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Assessment builder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Data analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-pink-100 text-pink-800 mb-4">Parents</Badge>
                <CardTitle>Family Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Progress monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Communication tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Home strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Advocacy guidance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-purple-100 text-purple-800 mb-4">Professionals</Badge>
                <CardTitle>Expert Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Advanced assessments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Research tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Collaboration features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    CPD tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <VoiceReadableHeading level={2} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Built with Modern Technology
          </VoiceReadableHeading>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-blue-600" />
                    Frontend Technologies
                  </h3>
                  <div className="space-y-2">
                    <Badge variant="outline">Next.js 15</Badge>
                    <Badge variant="outline">React 18</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Shadcn/ui</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    Backend & AI
                  </h3>
                  <div className="space-y-2">
                    <Badge variant="outline">PostgreSQL</Badge>
                    <Badge variant="outline">Prisma ORM</Badge>
                    <Badge variant="outline">NextAuth.js</Badge>
                    <Badge variant="outline">OpenAI API</Badge>
                    <Badge variant="outline">HeyGen AI</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <VoiceReadableHeading level={3} className="text-2xl font-bold mb-4">
                Ready to Experience EdPsych Connect?
              </VoiceReadableHeading>
              <VoiceReadableText className="mb-6 text-blue-100">
                Join thousands of educators, students, and professionals who are already 
                transforming educational psychology practice with our platform.
              </VoiceReadableText>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/meet-dr-scott">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    <Play className="mr-2 w-5 h-5" />
                    Meet Dr. Scott
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

