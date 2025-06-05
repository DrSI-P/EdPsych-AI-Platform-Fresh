'use client';

import { VoiceReadableHeading, VoiceReadableText } from '@/components/accessibility';
import { AvatarVideoPlayer } from '@/components/avatar/AvatarVideoSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  Brain, 
  Heart, 
  BookOpen,
  Award,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function MeetDrScottPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <VoiceReadableHeading level={1} className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Dr. Scott I-Patrick
          </VoiceReadableHeading>
          <VoiceReadableText className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Educational Psychologist, Platform Creator, and AI Innovation Pioneer
          </VoiceReadableText>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Dr. Scott's Introduction Video */}
          <div className="space-y-6">
            <AvatarVideoPlayer
              scriptId="welcome-intro"
              autoPlay={false}
              showControls={true}
              className="shadow-2xl"
            />
            
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
                    <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">Dr. Scott I-Patrick</h3>
                    <p className="text-blue-100">Educational Psychologist</p>
                  </div>
                </div>
                <VoiceReadableText className="text-blue-100 leading-relaxed">
                  "Welcome to EdPsych Connect! I created this platform to bridge the gap between 
                  educational psychology research and practical application, making evidence-based 
                  support accessible to everyone in the educational community."
                </VoiceReadableText>
              </CardContent>
            </Card>
          </div>

          {/* Professional Background */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Professional Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <VoiceReadableText>
                  Dr. Scott I-Patrick is a leading educational psychologist with over 15 years of experience 
                  in supporting students, educators, and families. His expertise spans assessment and evaluation, 
                  intervention planning, special educational needs, and restorative justice practices.
                </VoiceReadableText>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Students Supported</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Educational Psychology',
                    'Assessment & Evaluation', 
                    'Intervention Planning',
                    'Special Educational Needs',
                    'Restorative Justice',
                    'Inclusive Education',
                    'AI in Education',
                    'Professional Development'
                  ].map((expertise) => (
                    <Badge key={expertise} variant="secondary" className="justify-center py-2">
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Vision for EdPsych Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  "My vision is to create a platform that democratizes access to high-quality educational 
                  psychology support. By combining AI technology with evidence-based practices, we can 
                  provide personalized, scalable support that meets the diverse needs of our educational community."
                </VoiceReadableText>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium">Student-Centered Approach</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Every feature designed with student success at its core
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <div className="font-medium">Evidence-Based Practice</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        All tools grounded in current educational psychology research
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <div className="font-medium">Collaborative Community</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Bringing together students, educators, parents, and professionals
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Features */}
        <div className="mt-16">
          <VoiceReadableHeading level={2} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How Dr. Scott Can Help You
          </VoiceReadableHeading>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  Get personalized learning support, assessment guidance, and strategies 
                  to overcome learning challenges.
                </VoiceReadableText>
                <Link href="/student/dashboard">
                  <Button className="w-full">
                    Access Student Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Educators</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  Access professional development resources, classroom strategies, 
                  and evidence-based intervention tools.
                </VoiceReadableText>
                <Link href="/educator/dashboard">
                  <Button className="w-full">
                    Explore Educator Suite
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Parents</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  Learn how to support your child's learning at home and navigate 
                  the educational system effectively.
                </VoiceReadableText>
                <Link href="/parent/dashboard">
                  <Button className="w-full">
                    Visit Parent Portal
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8">
              <VoiceReadableHeading level={3} className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Connect with Dr. Scott
              </VoiceReadableHeading>
              <VoiceReadableText className="mb-6">
                Have questions about the platform or need personalized guidance? 
                Dr. Scott is here to help you make the most of EdPsych Connect.
              </VoiceReadableText>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">
                    Send a Message
                  </Button>
                </Link>
                <Link href="/interactive-avatar">
                  <Button variant="outline" size="lg">
                    Chat with AI Dr. Scott
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

