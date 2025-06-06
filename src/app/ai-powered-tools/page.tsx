'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  Cpu,
  Zap,
  Brain,
  Lightbulb,
  Target,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket,
  Settings,
  BarChart3
} from 'lucide-react';

export default function AIPoweredToolsPage() {
  const aiTools = [
    {
      icon: Brain,
      title: "AI Learning Assistant",
      description: "Intelligent tutoring system that adapts to individual learning styles and provides personalized guidance",
      features: ["Personalized learning paths", "Adaptive questioning", "Real-time feedback", "Progress optimization"]
    },
    {
      icon: Zap,
      title: "Smart Content Generation",
      description: "AI-powered content creation that generates educational materials tailored to specific learning objectives",
      features: ["Curriculum-aligned content", "Difficulty adaptation", "Multi-format resources", "Assessment generation"]
    },
    {
      icon: Target,
      title: "Predictive Analytics",
      description: "Advanced algorithms that predict learning outcomes and identify potential challenges before they occur",
      features: ["Early intervention alerts", "Performance predictions", "Risk assessment", "Success probability modeling"]
    },
    {
      icon: Lightbulb,
      title: "Intelligent Recommendations",
      description: "AI-driven recommendation engine that suggests optimal learning resources and strategies",
      features: ["Resource recommendations", "Study strategy suggestions", "Skill gap identification", "Learning path optimization"]
    },
    {
      icon: Settings,
      title: "Automated Assessment",
      description: "AI-powered assessment tools that provide instant feedback and detailed performance analysis",
      features: ["Instant grading", "Detailed feedback", "Progress tracking", "Competency mapping"]
    },
    {
      icon: Users,
      title: "Collaborative AI",
      description: "AI tools that facilitate collaboration and peer learning through intelligent matching and group formation",
      features: ["Peer matching", "Group optimization", "Collaboration insights", "Social learning analytics"]
    }
  ];

  const aiCapabilities = [
    {
      category: "Natural Language Processing",
      capabilities: [
        "Intelligent text analysis and comprehension",
        "Automated essay scoring and feedback",
        "Language learning support and correction",
        "Voice-to-text transcription and analysis"
      ]
    },
    {
      category: "Machine Learning",
      capabilities: [
        "Adaptive learning algorithm optimization",
        "Pattern recognition in learning behaviors",
        "Predictive modeling for educational outcomes",
        "Personalization engine development"
      ]
    },
    {
      category: "Computer Vision",
      capabilities: [
        "Visual learning material analysis",
        "Handwriting recognition and assessment",
        "Image-based problem solving support",
        "Visual accessibility enhancements"
      ]
    },
    {
      category: "Data Analytics",
      capabilities: [
        "Real-time learning analytics processing",
        "Educational data mining and insights",
        "Performance trend analysis",
        "Behavioral pattern identification"
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI-Powered Tools</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Harness the power of artificial intelligence to create personalized, adaptive, 
              and intelligent learning experiences that transform education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white text-blue-600 px-4 py-2 text-sm">
                <Cpu className="w-4 h-4 mr-2" />
                Advanced AI
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Intelligent Automation
              </Badge>
              <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">
                <Rocket className="w-4 h-4 mr-2" />
                Cutting-Edge Technology
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Educational Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered tools leverage cutting-edge technology to provide intelligent, 
              adaptive, and personalized educational experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <ul className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
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

      {/* AI Capabilities */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Capabilities</h2>
            <p className="text-lg text-gray-600">
              Advanced artificial intelligence technologies powering educational innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiCapabilities.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center">
                    <Brain className="w-6 h-6 mr-3" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {category.capabilities.map((capability, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AI-Powered Education?</h2>
            <p className="text-lg text-gray-600">
              Discover the transformative benefits of integrating AI into educational practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Personalized Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI adapts to individual learning styles, pace, and preferences to create 
                  truly personalized educational experiences for every student.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Data-Driven Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced analytics provide deep insights into learning patterns, 
                  progress, and areas for improvement with actionable recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Enhanced Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automate routine tasks, streamline assessment processes, and optimize 
                  learning workflows to focus on what matters most - student success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience AI-Powered Education?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how artificial intelligence can transform learning outcomes and 
            educational experiences in your setting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/platform-overview'}
            >
              <Rocket className="w-5 h-5 mr-2" />
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

