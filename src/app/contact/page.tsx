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
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Shield,
  Award,
  CheckCircle,
  AlertCircle,
  Calendar,
  Globe,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        role: '',
        organization: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "dr.scott@edpsychconnect.com",
      description: "Professional inquiries and consultations",
      action: "mailto:dr.scott@edpsychconnect.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+44 (0) 20 7946 0958",
      description: "Direct line for urgent matters",
      action: "tel:+442079460958"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "United Kingdom",
      description: "Serving schools and families across the UK",
      action: null
    },
    {
      icon: Clock,
      title: "Hours",
      value: "Mon-Fri 9:00-17:00",
      description: "GMT/BST timezone",
      action: null
    }
  ];

  const serviceAreas = [
    "Educational Psychology Assessments",
    "Learning Difficulties Support",
    "Behavioral Intervention Planning",
    "School Consultation Services",
    "Family Support and Guidance",
    "Professional Training and Development",
    "Research and Evaluation Projects",
    "Platform Implementation Support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Dr. Scott</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get in touch for professional educational psychology support, platform inquiries, 
              or collaboration opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Multiple ways to connect with Dr. Scott I-Patrick for professional support and guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">{method.value}</p>
                    <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                    {method.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(method.action!, '_blank')}
                        className="w-full"
                      >
                        Contact Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Professional Credentials Reminder */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
              </h3>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Chartered Educational Psychologist
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  HCPC Registered: PYL042340
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  20+ Years Experience
                </Badge>
              </div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Qualified professional with extensive experience in educational psychology, 
                registered with the Health and Care Professions Council, and committed to 
                evidence-based practice and ethical standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Service Areas */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <p className="text-gray-600 mb-8">
                Use this form to get in touch about professional services, platform inquiries, 
                or collaboration opportunities. All messages are reviewed personally by Dr. Scott.
              </p>

              {submitStatus === 'success' && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Thank you for your message! Dr. Scott will respond within 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your role</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent/Guardian</option>
                      <option value="teacher">Teacher/Educator</option>
                      <option value="headteacher">Headteacher/Senior Leader</option>
                      <option value="senco">SENCO</option>
                      <option value="psychologist">Educational Psychologist</option>
                      <option value="researcher">Researcher</option>
                      <option value="other">Other Professional</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                      Organization/School
                    </label>
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Your school or organization"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide details about your inquiry, including any specific questions or support needs..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Service Areas */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Areas</h2>
              <p className="text-gray-600 mb-8">
                Dr. Scott provides comprehensive educational psychology services across these key areas:
              </p>

              <div className="space-y-4 mb-8">
                {serviceAreas.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{service}</span>
                  </div>
                ))}
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Emergency Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 mb-4">
                    For urgent educational psychology matters requiring immediate attention, 
                    please contact Dr. Scott directly by phone during business hours.
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => window.open('tel:+442079460958', '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore the EdPsych Connect platform or learn more about our comprehensive 
            educational psychology services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/platform-overview'}
            >
              <Globe className="w-5 h-5 mr-2" />
              Explore Platform
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/about'}
            >
              <Award className="w-5 h-5 mr-2" />
              Learn More About Dr. Scott
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

