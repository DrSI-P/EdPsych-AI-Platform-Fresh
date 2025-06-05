'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MasterNavigation from '@/components/navigation/master-navigation';
import InteractiveAvatar from '@/components/heygen/interactive-avatar';
import {
  GraduationCap,
  BookOpen,
  Users,
  Brain,
  Sparkles,
  MessageCircle,
  Star,
  Award,
  Heart,
  Shield,
  Zap,
  Target,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function Home() {
  // State for avatar visibility
  const [showAvatar, setShowAvatar] = useState<boolean>(false);
  const [avatarMinimized, setAvatarMinimized] = useState<boolean>(false);

  const platformFeatures = [
    {
      icon: BarChart3,
      title: "Educator Dashboard",
      description: "Comprehensive analytics and insights for tracking student progress, attendance trends, and curriculum completion.",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Sophisticated tools for managing student profiles, learning paths, and individualised support plans.",
      color: "bg-green-500"
    },
    {
      icon: BookOpen,
      title: "Curriculum Design",
      description: "Evidence-based curriculum design aligned with UK Department for Education standards and requirements.",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Assessment Tools",
      description: "Comprehensive assessment and evaluation systems for measuring learning outcomes and progress.",
      color: "bg-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced algorithms that personalise education to each student's unique needs and learning style.",
      color: "bg-pink-500"
    },
    {
      icon: Heart,
      title: "Restorative Justice",
      description: "Building relationships and understanding through restorative practices and community healing approaches.",
      color: "bg-red-500"
    }
  ];

  const userGroups = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Personalised learning experiences with adaptive content and progress tracking",
      features: ["Learning Analytics", "Progress Tracking", "Personalised Content", "Peer Collaboration"]
    },
    {
      icon: Users,
      title: "Educators",
      description: "Professional tools for curriculum design, assessment, and student support",
      features: ["Curriculum Tools", "Assessment Systems", "Student Analytics", "Professional Development"]
    },
    {
      icon: Heart,
      title: "Parents",
      description: "Insights into your child's learning journey and ways to support their development",
      features: ["Progress Reports", "Communication Tools", "Home Learning", "Support Resources"]
    },
    {
      icon: Award,
      title: "Professionals",
      description: "Advanced tools for educational psychology practice and research",
      features: ["Assessment Tools", "Intervention Planning", "Research Analytics", "Case Management"]
    }
  ];

  // Handle Ask Dr. Scott button click
  const handleAskDrScott = () => {
    try {
      // Redirect to Meet Dr. Scott page instead of showing avatar popup
      window.location.href = '/meet-dr-scott';
    } catch (error) {
      console.error('Error navigating to Dr. Scott page:', error);
      // Fallback: show avatar if navigation fails
      setShowAvatar(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MasterNavigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
                🧠 Comprehensive Educational Psychology Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EdPsych Connect
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Bringing sunshine and ease to schools through evidence-based educational 
              psychology, comprehensive platform tools, and restorative justice practices.
            </p>

            {/* Founder Credentials */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-4xl mx-auto border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Founded by Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Qualified Chartered Educational Psychologist</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">HCPC Registered: PYL042340</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">20+ Years Education Experience</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">12+ Years Educational Psychology</span>
                </div>
              </div>
              
              <p className="mt-6 text-gray-600 text-center">
                Specialising in child and adolescent educational psychology with evidence-based practice
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.location.href = '/platform-overview'}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
                onClick={handleAskDrScott}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask Dr. Scott
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Educational Psychology Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete suite of tools designed by educational psychology experts to support 
              learning, wellbeing, and professional development across all educational settings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Groups Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Designed for Every Educational Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a student, educator, parent, or professional, EdPsych Connect 
              provides tailored tools and insights to support your educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userGroups.map((group, index) => {
              const IconComponent = group.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {group.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <div className="space-y-2">
                      {group.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Avatar Modal */}
      {showAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Ask Dr. Scott</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAvatar(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <InteractiveAvatar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

