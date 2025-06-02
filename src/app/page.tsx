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
  Target
} from 'lucide-react';

export default function Home() {
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarMinimized, setAvatarMinimized] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Adaptive algorithms that personalize education to each student's unique needs and learning style.",
      color: "bg-blue-500"
    },
    {
      icon: GraduationCap,
      title: "Evidence-Based Practice",
      description: "All strategies and interventions are grounded in the latest educational psychology research.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Collaborative Support",
      description: "Connecting students, teachers, parents, and professionals in a unified support network.",
      color: "bg-purple-500"
    },
    {
      icon: Heart,
      title: "Restorative Justice",
      description: "Building relationships and understanding through restorative practices and community healing.",
      color: "bg-pink-500"
    },
    {
      icon: Shield,
      title: "Inclusive Education",
      description: "Supporting all learners with comprehensive accessibility features and personalized accommodations.",
      color: "bg-indigo-500"
    },
    {
      icon: Target,
      title: "Outcome-Focused",
      description: "Data-driven approaches that track progress and ensure measurable improvements in learning.",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { label: "Students Supported", value: "10,000+", icon: GraduationCap },
    { label: "Educators Trained", value: "2,500+", icon: BookOpen },
    { label: "Success Rate", value: "94%", icon: Star },
    { label: "Research Studies", value: "150+", icon: Award }
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
                Revolutionary Educational Psychology Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              EdPsych Connect
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bringing sunshine and ease to schools through evidence-based educational psychology, 
              AI-powered personalization, and restorative justice practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowAvatar(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Dr. Scott
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
            </div>

            {/* Interactive Avatar Introduction */}
            <Card className="max-w-2xl mx-auto mb-12 border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-center text-xl">
                  <Zap className="w-6 h-6 mr-2" />
                  Meet Dr. Scott's Interactive Avatar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  Experience the future of educational psychology support! Dr. Scott I-Patrick's Interactive Avatar 
                  provides 24/7 expert guidance, personalized to your role and needs.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <span className="text-sm font-medium">Teachers</span>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <span className="text-sm font-medium">Parents</span>
                  </div>
                  <div className="text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Professionals</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Real-time conversations • Evidence-based guidance • Restorative justice expertise
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Education Through Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with evidence-based educational psychology 
              to create personalized learning experiences that truly make a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
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

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators, students, and families who are already experiencing 
            the power of evidence-based educational psychology.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => setShowAvatar(true)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Your Journey with Dr. Scott
          </Button>
        </div>
      </div>

      {/* Interactive Avatar Component */}
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

