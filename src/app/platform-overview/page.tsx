'use client';

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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Overview
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive Educational Psychology Platform with 200+ Features
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Platform Demo Video */}
          <div className="space-y-6">
            <AvatarVideoPlayer
              scriptId="platform-overview"
              autoPlay={false}
              showControls={true}
              className="shadow-2xl"
            />
            
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Platform Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>200+ Educational Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>AI-Powered Learning Analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Evidence-Based Interventions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Comprehensive Accessibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Categories */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Student Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Comprehensive tools for student learning, progress tracking, and personalized support.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary">Learning Analytics</Badge>
                  <Badge variant="secondary">Progress Tracking</Badge>
                  <Badge variant="secondary">Assessment Tools</Badge>
                  <Badge variant="secondary">Learning Paths</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI Innovations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Advanced AI-powered features for personalized education and intelligent support.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary">AI Tutoring</Badge>
                  <Badge variant="secondary">Smart Analytics</Badge>
                  <Badge variant="secondary">Predictive Insights</Badge>
                  <Badge variant="secondary">Adaptive Learning</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Comprehensive accessibility tools ensuring inclusive education for all learners.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary">Voice Navigation</Badge>
                  <Badge variant="secondary">Screen Reader</Badge>
                  <Badge variant="secondary">Multi-Language</Badge>
                  <Badge variant="secondary">Learning Support</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Platform by the Numbers
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600 dark:text-gray-400">Educational Features</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">75</div>
                <div className="text-gray-600 dark:text-gray-400">Database Models</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">184</div>
                <div className="text-gray-600 dark:text-gray-400">Platform Pages</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-400">Accessibility Compliant</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Explore?
              </h3>
              <p className="mb-6">
                Discover how EdPsych Connect can transform your educational experience with 
                evidence-based tools and innovative technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/student/dashboard">
                  <Button size="lg">
                    Start Exploring
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
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

