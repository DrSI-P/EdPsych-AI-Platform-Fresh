'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  MessageCircle,
  Send,
  Phone,
  Mail,
  Calendar,
  Award,
  Shield,
  CheckCircle,
  User,
  Clock,
  Star,
  BookOpen,
  Brain,
  Heart,
  Lightbulb,
  Users,
  Target,
  Zap,
  Globe
} from 'lucide-react';

export default function MeetDrScottPage() {
  const [questionForm, setQuestionForm] = useState({
    name: '',
    email: '',
    role: '',
    question: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/ask-dr-scott', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionForm),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setQuestionForm({
          name: '',
          email: '',
          role: '',
          question: '',
          category: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('Submission failed:', result.message);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questionCategories = [
    { value: 'learning-difficulties', label: 'Learning Difficulties & SEND' },
    { value: 'behavior-support', label: 'Behavior Support & Intervention' },
    { value: 'assessment', label: 'Educational Psychology Assessment' },
    { value: 'school-consultation', label: 'School Consultation' },
    { value: 'family-support', label: 'Family Support & Guidance' },
    { value: 'platform-help', label: 'Platform Features & Help' },
    { value: 'research', label: 'Research & Evidence-Based Practice' },
    { value: 'professional-development', label: 'Professional Development' },
    { value: 'other', label: 'Other Educational Psychology Topics' }
  ];

  const expertiseAreas = [
    {
      icon: Brain,
      title: "Learning & Cognition",
      description: "Understanding how children learn and process information"
    },
    {
      icon: Heart,
      title: "Social-Emotional Development",
      description: "Supporting emotional wellbeing and social skills"
    },
    {
      icon: Target,
      title: "Behavioral Interventions",
      description: "Evidence-based strategies for challenging behaviors"
    },
    {
      icon: BookOpen,
      title: "Educational Assessment",
      description: "Comprehensive evaluations and recommendations"
    },
    {
      icon: Users,
      title: "Family & School Collaboration",
      description: "Building effective partnerships for student success"
    },
    {
      icon: Lightbulb,
      title: "Innovation in Education",
      description: "Integrating technology with psychological principles"
    }
  ];

  const quickTopics = [
    "How can I support a child with dyslexia?",
    "What are effective strategies for ADHD in the classroom?",
    "How do I request an educational psychology assessment?",
    "What is the difference between autism and ADHD?",
    "How can schools better support anxious students?",
    "What are the signs of learning difficulties?",
    "How do I implement positive behavior support?",
    "What resources are available for SEND families?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Ask Dr. Scott</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Get expert guidance from Dr. Scott I-Patrick, Chartered Educational Psychologist 
                with over 20 years of experience supporting children, families, and schools.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white text-blue-600 px-4 py-2 text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  DEdPsych BSc CPsychol MBPSs
                </Badge>
                <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  HCPC Registered: PYL042340
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img 
                  src="/images/team/Scott.jpg" 
                  alt="Dr. Scott I-Patrick"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Dr. Scott I-Patrick</h3>
              <p className="text-blue-100">Founder & Educational Psychologist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Form */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ask Your Question</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Submit your educational psychology questions and receive expert guidance from Dr. Scott. 
              All questions are reviewed personally and responses are provided within 24-48 hours.
            </p>
          </div>

          {submitStatus === 'success' && (
            <Alert className="mb-8 border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for your question! Dr. Scott will review it personally and respond within 24-48 hours.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                There was an error submitting your question. Please try again or contact Dr. Scott directly.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <MessageCircle className="w-6 h-6 mr-3" />
                Submit Your Question to Dr. Scott
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={questionForm.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={questionForm.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={questionForm.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your role</option>
                      <option value="parent">Parent/Guardian</option>
                      <option value="teacher">Teacher/Educator</option>
                      <option value="headteacher">Headteacher/Senior Leader</option>
                      <option value="senco">SENCO</option>
                      <option value="student">Student</option>
                      <option value="psychologist">Educational Psychologist</option>
                      <option value="researcher">Researcher</option>
                      <option value="other">Other Professional</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Question Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={questionForm.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {questionCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question *
                  </label>
                  <Textarea
                    id="question"
                    name="question"
                    required
                    rows={6}
                    value={questionForm.question}
                    onChange={handleInputChange}
                    placeholder="Please provide as much detail as possible about your question or situation. Include relevant background information, specific challenges, and what kind of guidance you're seeking..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    The more detail you provide, the more specific and helpful Dr. Scott's response can be.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting Question...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Ask Dr. Scott
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Questions</h2>
            <p className="text-lg text-gray-600">
              Common topics that Dr. Scott frequently addresses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTopics.map((topic, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-900 font-medium">{topic}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Expertise Areas */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dr. Scott's Expertise</h2>
            <p className="text-lg text-gray-600">
              Areas of specialization and professional focus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{area.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Immediate Support?</h2>
          <p className="text-xl text-blue-100 mb-8">
            For urgent matters or to schedule a consultation, contact Dr. Scott directly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.open('tel:+447376113640', '_blank')}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: +44 (0) 7376113640
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.open('mailto:scott.ipatrick@edpsychconnect.app', '_blank')}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Dr. Scott
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

