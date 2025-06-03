'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Heart,
  Brain,
  BarChart3,
  GraduationCap,
  FileText,
  Settings,
  Sparkles,
  Target,
  Zap,
  Globe,
  Mic,
  Eye,
  Gamepad2,
  Languages,
  Activity
} from 'lucide-react';

export default function PlatformOverview() {
  const [selectedCategory, setSelectedCategory] = useState('dashboards');

  const dashboards = [
    {
      title: "Student Dashboard",
      description: "Personalised learning paths, progress tracking, and achievement management for students.",
      icon: GraduationCap,
      color: "bg-blue-500",
      link: "/innovations/student-dashboard",
      features: ["Progress tracking", "Learning paths", "Achievement badges", "Study planner"]
    },
    {
      title: "Educator Dashboard",
      description: "Comprehensive analytics, classroom management, and curriculum planning tools for teachers.",
      icon: BarChart3,
      color: "bg-green-500",
      link: "/innovations/educator-dashboard",
      features: ["Student analytics", "Curriculum planning", "Assessment tools", "Classroom insights"]
    },
    {
      title: "Parent Portal",
      description: "Family engagement tools, progress insights, and communication with educators.",
      icon: Heart,
      color: "bg-purple-500",
      link: "/innovations/parent-portal",
      features: ["Progress reports", "Communication tools", "Home support", "Family insights"]
    }
  ];

  const innovations = [
    {
      title: "AI-Powered Assessment",
      description: "Intelligent assessment tools that adapt to individual learning needs and provide instant feedback.",
      icon: Brain,
      color: "bg-indigo-500",
      link: "/innovations/ai-powered-assessment",
      features: ["Adaptive testing", "Instant feedback", "Learning analytics", "Personalised recommendations"]
    },
    {
      title: "Personalised Learning Pathways",
      description: "Dynamic learning paths that adapt to each student's pace, style, and interests.",
      icon: Target,
      color: "bg-orange-500",
      link: "/innovations/personalized-learning-pathways",
      features: ["Adaptive content", "Learning style detection", "Progress optimisation", "Interest-based learning"]
    },
    {
      title: "Immersive Learning Environments",
      description: "Virtual and augmented reality experiences that bring learning to life.",
      icon: Eye,
      color: "bg-pink-500",
      link: "/innovations/immersive-learning-environments",
      features: ["VR experiences", "AR overlays", "3D simulations", "Interactive environments"]
    },
    {
      title: "Neuroadaptive Interface",
      description: "Brain-computer interfaces that respond to cognitive load and emotional state.",
      icon: Zap,
      color: "bg-cyan-500",
      link: "/innovations/neuroadaptive-interface",
      features: ["Cognitive monitoring", "Stress detection", "Adaptive UI", "Biometric feedback"]
    },
    {
      title: "Digital Twin Companion",
      description: "AI companions that understand and support each student's unique learning journey.",
      icon: Sparkles,
      color: "bg-emerald-500",
      link: "/innovations/digital-twin-companion",
      features: ["AI mentoring", "Emotional support", "Learning guidance", "24/7 availability"]
    },
    {
      title: "Biofeedback Learning",
      description: "Real-time physiological monitoring to optimise learning conditions and reduce stress.",
      icon: Activity,
      color: "bg-red-500",
      link: "/innovations/biofeedback-learning",
      features: ["Stress monitoring", "Attention tracking", "Wellness insights", "Performance optimisation"]
    },
    {
      title: "Multilingual Support",
      description: "Comprehensive language support with real-time translation and cultural adaptation.",
      icon: Languages,
      color: "bg-violet-500",
      link: "/innovations/multilingual-support",
      features: ["Real-time translation", "Cultural adaptation", "Language learning", "Accessibility support"]
    }
  ];

  const categories = [
    { id: 'dashboards', label: 'Core Dashboards', icon: BarChart3 },
    { id: 'innovations', label: 'AI Innovations', icon: Brain },
    { id: 'overview', label: 'Platform Overview', icon: Globe }
  ];

  const renderFeatureCard = (item: any) => {
    const IconComponent = item.icon;
    return (
      <Card key={item.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedCategory === 'dashboards' ? 'Dashboard' : 'Innovation'}
            </Badge>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {item.title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {item.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                {feature}
              </div>
            ))}
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => window.location.href = item.link}
          >
            Explore {item.title}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              EdPsych Connect Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive educational psychology platform with revolutionary AI-powered tools, 
              personalised dashboards, and innovative learning technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedCategory === 'dashboards' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Dashboards</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive dashboards designed for students, educators, and families to track progress, 
                manage learning, and facilitate communication.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dashboards.map(renderFeatureCard)}
            </div>
          </div>
        )}

        {selectedCategory === 'innovations' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Innovations</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Cutting-edge AI technologies that personalise learning, enhance engagement, 
                and provide unprecedented insights into educational progress.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {innovations.map(renderFeatureCard)}
            </div>
          </div>
        )}

        {selectedCategory === 'overview' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Overview</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A comprehensive view of all platform capabilities, from core educational tools 
                to revolutionary AI innovations.
              </p>
            </div>
            
            {/* Platform Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Core Dashboards</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">AI Innovations</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
                  <div className="text-sm text-gray-600">Learning Paths</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Quick Access</CardTitle>
                  <CardDescription>Jump directly to the most popular features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/innovations/student-dashboard'}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Student Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/innovations/educator-dashboard'}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Educator Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/innovations/parent-portal'}>
                    <Heart className="w-4 h-4 mr-2" />
                    Parent Portal
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/innovations/ai-powered-assessment'}>
                    <Brain className="w-4 h-4 mr-2" />
                    AI Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Platform Features</CardTitle>
                  <CardDescription>Core capabilities that power the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Evidence-based educational psychology
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Personalised learning pathways
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Real-time progress tracking
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    AI-powered insights and recommendations
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mr-3"></div>
                    Comprehensive family engagement
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-cyan-600 rounded-full mr-3"></div>
                    Professional educator support
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of educational psychology with our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/innovations/student-dashboard'}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
              onClick={() => window.location.href = '/'}
            >
              <Heart className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

