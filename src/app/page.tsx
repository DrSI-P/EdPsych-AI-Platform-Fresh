'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarMinimized, setAvatarMinimized] = useState(false);

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
      title: "Curriculum Planning",
      description: "Evidence-based curriculum design aligned with UK Department for Education standards and requirements.",
      color: "bg-purple-500"
    },
    {
      icon: FileText,
      title: "Assessment Tools",
      description: "Comprehensive assessment and evaluation systems for measuring learning outcomes and progress.",
      color: "bg-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced algorithms that personalise education to each student's unique needs and learning style.",
      color: "bg-indigo-500"
    },
    {
      icon: Heart,
      title: "Restorative Justice",
      description: "Building relationships and understanding through restorative practices and community healing approaches.",
      color: "bg-pink-500"
    }
  ];

  const coreValues = [
    {
      icon: GraduationCap,
      title: "Evidence-Based Practice",
      description: "All strategies and interventions are grounded in the latest educational psychology research and proven methodologies.",
      color: "bg-blue-600"
    },
    {
      icon: Shield,
      title: "Inclusive Education",
      description: "Supporting all learners with comprehensive accessibility features and personalised accommodations for diverse needs.",
      color: "bg-green-600"
    },
    {
      icon: Target,
      title: "Outcome-Focused",
      description: "Data-driven approaches that track progress and ensure measurable improvements in learning and wellbeing.",
      color: "bg-purple-600"
    },
    {
      icon: Users,
      title: "Collaborative Support",
      description: "Connecting students, teachers, parents, and professionals in a unified support network for holistic development.",
      color: "bg-orange-600"
    }
  ];

  const userGroups = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Personalised learning paths, progress tracking, and support for academic and personal development.",
      features: ["Individual learning plans", "Progress monitoring", "Peer collaboration tools", "Wellbeing support"]
    },
    {
      icon: BookOpen,
      title: "Educators",
      description: "Professional development, classroom management tools, and evidence-based teaching strategies.",
      features: ["Professional dashboard", "Student analytics", "Curriculum resources", "Assessment tools"]
    },
    {
      icon: Heart,
      title: "Parents & Families",
      description: "Insights into child's progress, communication tools, and guidance for supporting learning at home.",
      features: ["Progress reports", "Communication portal", "Home support strategies", "Family engagement tools"]
    },
    {
      icon: Brain,
      title: "Professionals",
      description: "Advanced analytics, research tools, and collaborative platforms for educational psychology practice.",
      features: ["Research insights", "Case management", "Professional networking", "Evidence-based interventions"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Comprehensive Educational Psychology Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              EdPsych Connect
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Bringing sunshine and ease to schools through evidence-based educational psychology, 
              comprehensive platform tools, and restorative justice practices.
            </p>
            
            {/* Professional Credentials */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto border border-blue-200/50 shadow-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Founded by Dr. Scott I-Patrick
                </h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium">Qualified Chartered Educational Psychologist</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium">HCPC Registered: PYL042340</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">20+ Years Education Experience</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="font-medium">12+ Years Educational Psychology</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Specialising in child and adolescent educational psychology with evidence-based practice
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.location.href = '/innovations/educator-dashboard'}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
                onClick={() => setShowAvatar(true)}
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
              Supporting Every Member of the Educational Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences and tools designed specifically for the unique needs 
              of students, educators, families, and educational professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userGroups.map((group, index) => {
              const IconComponent = group.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {group.title}
                      </CardTitle>
                    </div>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {group.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Founded on Educational Psychology Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is built on proven educational psychology principles, 
              ensuring every feature serves the goal of improved learning outcomes and wellbeing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mr-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how our comprehensive platform can support learning, wellbeing, 
            and professional development in your educational setting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/innovations/educator-dashboard'}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Explore Platform Features
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
              onClick={() => setShowAvatar(true)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Get Expert Guidance
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Avatar Component - Subtle Integration */}
      {showAvatar && (
        <InteractiveAvatar
          isMinimized={avatarMinimized}
          onToggleMinimize={() => setAvatarMinimized(!avatarMinimized)}
          onClose={() => setShowAvatar(false)}
          defaultRole="student"
          showRoleSelector={true}
          className="z-50"
        />
      )}
    </div>
  );
}

