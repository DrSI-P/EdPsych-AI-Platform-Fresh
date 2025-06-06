'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Building,
  Users,
  Award,
  Heart
} from 'lucide-react';

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    enquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        enquiryType: ''
      });
    }, 2000);
  };

  const enquiryTypes = [
    { value: 'general', label: 'General Enquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'media', label: 'Media & Press' },
    { value: 'careers', label: 'Careers & Opportunities' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+44 (0) 7376113640",
      description: "Monday to Friday, 9:00 AM - 5:00 PM GMT",
      action: "tel:+447376113640"
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@edpsychconnect.com",
      description: "We typically respond within 24 hours",
      action: "mailto:hello@edpsychconnect.com"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "EdPsych Connect Limited",
      description: "United Kingdom",
      action: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 5:00 PM",
      description: "Weekend support available for urgent matters",
      action: null
    }
  ];

  const teamHighlights = [
    {
      icon: Award,
      title: "Expert Team",
      description: "Led by Dr. Scott I-Patrick, Chartered Educational Psychologist with 20+ years experience"
    },
    {
      icon: Users,
      title: "Collaborative Approach",
      description: "Working together with educators, families, and students to create positive change"
    },
    {
      icon: Heart,
      title: "Passionate Support",
      description: "Dedicated to improving educational outcomes for all learners"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get in touch with our team for support, partnerships, or general enquiries about the EdPsych Connect platform.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">Message sent successfully!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

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
                        value={contactForm.name}
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
                        value={contactForm.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Enquiry Type *
                      </label>
                      <select
                        id="enquiryType"
                        name="enquiryType"
                        required
                        value={contactForm.enquiryType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select enquiry type</option>
                        {enquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
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
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        placeholder="Brief subject line"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
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
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your enquiry..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{method.title}</h3>
                            {method.action ? (
                              <a 
                                href={method.action}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {method.details}
                              </a>
                            ) : (
                              <p className="text-gray-900 font-medium">{method.details}</p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Team Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose EdPsych Connect?</h2>
              <div className="space-y-4">
                {teamHighlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                        <p className="text-gray-600 text-sm">{highlight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/meet-dr-scott" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Ask Dr. Scott a Question
                  </a>
                  <a href="/about/team" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Meet Our Team
                  </a>
                  <a href="/platform-overview" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Explore Platform Features
                  </a>
                  <a href="/accessibility" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Accessibility Support
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

