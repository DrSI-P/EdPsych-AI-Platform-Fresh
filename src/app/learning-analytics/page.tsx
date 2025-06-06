'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Award,
  Brain,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

export default function LearningAnalyticsPage() {
  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Comprehensive tracking of student learning progress across all subjects and skills",
      features: ["Real-time progress monitoring", "Milestone achievement tracking", "Learning curve analysis"]
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Detailed analysis of student performance patterns and learning outcomes",
      features: ["Performance trend analysis", "Comparative assessments", "Achievement predictions"]
    },
    {
      icon: PieChart,
      title: "Learning Style Analysis",
      description: "Identification and analysis of individual learning preferences and styles",
      features: ["Learning style assessment", "Preference mapping", "Adaptation recommendations"]
    },
    {
      icon: Target,
      title: "Goal Setting & Monitoring",
      description: "Set, track, and achieve personalized learning goals with data-driven insights",
      features: ["SMART goal creation", "Progress milestones", "Achievement celebrations"]
    },
    {
      icon: Brain,
      title: "Cognitive Assessment",
      description: "Advanced cognitive assessment tools to understand learning capabilities",
      features: ["Cognitive profiling", "Strength identification", "Development areas"]
    },
    {
      icon: Activity,
      title: "Engagement Metrics",
      description: "Monitor student engagement levels and participation across activities",
      features: ["Engagement scoring", "Participation tracking", "Motivation analysis"]
    }
  ];

  const benefitsForRoles = [
    {
      role: "Students",
      benefits: [
        "Understand your learning progress and achievements",
        "Identify your strongest learning styles and preferences",
        "Set and track personalized learning goals",
        "Celebrate milestones and improvements"
      ]
    },
    {
      role: "Educators",
      benefits: [
        "Monitor class-wide and individual student progress",
        "Identify students who need additional support",
        "Adapt teaching methods based on learning analytics",
        "Generate detailed progress reports for parents"
      ]
    },
    {
      role: "Parents",
      benefits: [
        "Track your child's learning journey and achievements",
        "Understand their learning strengths and challenges",
        "Support home learning with data-driven insights",
        "Celebrate progress and milestones together"
      ]
    },
    {
      role: "School Leaders",
      benefits: [
        "Monitor school-wide learning outcomes and trends",
        "Identify areas for curriculum improvement",
        "Support teacher professional development",
        "Demonstrate educational impact to stakeholders"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Learning Analytics</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Transform educational data into actionable insights that drive personalized learning 
              and improved outcomes for every student.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white text-blue-600 px-4 py-2 text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Real-time Analytics
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                <Brain className="w-4 h-4 mr-2" />
                Evidence-Based Insights
              </Badge>
              <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">
                <Target className="w-4 h-4 mr-2" />
                Personalized Learning
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Analytics Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our learning analytics platform provides deep insights into student progress, 
              learning patterns, and educational outcomes through advanced data analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyticsFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
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

      {/* Benefits by Role */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits for Every Role</h2>
            <p className="text-lg text-gray-600">
              Learning analytics provides valuable insights tailored to different educational stakeholders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefitsForRoles.map((roleData, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center">
                    <Users className="w-6 h-6 mr-3" />
                    {roleData.role}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {roleData.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Learning with Data?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how learning analytics can revolutionize educational outcomes in your setting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/platform-overview'}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Explore Platform
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/contact'}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

