'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button, Input, Select, Textarea } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Contact information
  const contactInfo = [
    {
      title: "General Inquiries",
      email: "info@edpsychconnect.com",
      phone: "+44 (0) 20 1234 5678"
    },
    {
      title: "Technical Support",
      email: "support@edpsychconnect.com",
      phone: "+44 (0) 20 1234 5679"
    },
    {
      title: "Sales",
      email: "sales@edpsychconnect.com",
      phone: "+44 (0) 20 1234 5680"
    }
  ];
  
  // Office locations
  const officeLocations = [
    {
      city: "London",
      address: "123 Education Lane\nLondon, EC1A 1BB\nUnited Kingdom",
      image: "/images/contact/london-office.jpg"
    },
    {
      city: "Manchester",
      address: "456 Learning Street\nManchester, M1 1AA\nUnited Kingdom",
      image: "/images/contact/manchester-office.jpg"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h1" className="mb-4">
                Contact Us
              </Typography>
              <Typography variant="lead" className="mb-6">
                We're here to help with any questions you may have about EdPsych Connect.
              </Typography>
              <Typography variant="body">
                Our team of educational psychology experts and technical specialists are ready to assist you with any inquiries, support needs, or feedback.
              </Typography>
            </div>
          </Container>
        </section>
        
        {/* Contact Form Section */}
        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Typography variant="h2" className="mb-6">
                  Get in Touch
                </Typography>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="First Name" 
                      placeholder="Enter your first name" 
                      isFullWidth 
                      required
                    />
                    <Input 
                      label="Last Name" 
                      placeholder="Enter your last name" 
                      isFullWidth 
                      required
                    />
                  </div>
                  
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    isFullWidth 
                    required
                  />
                  
                  <Input 
                    label="Phone" 
                    type="tel" 
                    placeholder="Enter your phone number (optional)" 
                    isFullWidth 
                  />
                  
                  <Select 
                    label="Inquiry Type" 
                    options={[
                      { value: "", label: "Select an inquiry type" },
                      { value: "general", label: "General Information" },
                      { value: "support", label: "Technical Support" },
                      { value: "sales", label: "Sales Inquiry" },
                      { value: "feedback", label: "Feedback" },
                      { value: "other", label: "Other" }
                    ]} 
                    isFullWidth 
                    required
                  />
                  
                  <Textarea 
                    label="Message" 
                    placeholder="How can we help you?" 
                    rows={5} 
                    isFullWidth 
                    required
                  />
                  
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="privacy-consent" 
                      className="mt-1" 
                      required
                    />
                    <label htmlFor="privacy-consent" className="text-sm">
                      I consent to EdPsych Connect collecting and storing my data in accordance with the <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>
                  
                  <Button variant="primary" size="lg" className="w-full md:w-auto">
                    Submit Inquiry
                  </Button>
                </form>
              </div>
              
              <div>
                <Typography variant="h2" className="mb-6">
                  Contact Information
                </Typography>
                
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="p-6">
                      <Typography variant="h4" className="mb-4">
                        {info.title}
                      </Typography>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <Typography variant="small" color="muted">
                              Email
                            </Typography>
                            <Typography variant="body">
                              {info.email}
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <Typography variant="small" color="muted">
                              Phone
                            </Typography>
                            <Typography variant="body">
                              {info.phone}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Typography variant="h4" className="mt-8 mb-4">
                  Business Hours
                </Typography>
                <Card className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="body">Monday - Friday</Typography>
                      <Typography variant="body">9:00 AM - 5:30 PM</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="body">Saturday</Typography>
                      <Typography variant="body">10:00 AM - 2:00 PM</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="body">Sunday</Typography>
                      <Typography variant="body">Closed</Typography>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Office Locations */}
        <section className="py-16 bg-background">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Our Offices
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {officeLocations.map((office, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={office.image}
                      alt={`${office.city} Office`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Typography variant="h4" className="mb-2">
                      {office.city} Office
                    </Typography>
                    <Typography variant="body" className="whitespace-pre-line">
                      {office.address}
                    </Typography>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Typography variant="h2" className="mb-8 text-center">
                Frequently Asked Questions
              </Typography>
              
              <div className="space-y-6">
                <Card className="p-6">
                  <Typography variant="h5" className="mb-2">
                    How quickly can I expect a response to my inquiry?
                  </Typography>
                  <Typography variant="body">
                    We aim to respond to all inquiries within 24 hours during business days. For urgent technical support issues, we prioritize responses and typically reply within a few hours.
                  </Typography>
                </Card>
                
                <Card className="p-6">
                  <Typography variant="h5" className="mb-2">
                    Can I schedule a demo of the platform?
                  </Typography>
                  <Typography variant="body">
                    Yes, we offer personalized demos for schools, educational institutions, and organizations. Please select "Sales Inquiry" in the contact form and mention that you're interested in a demo, or contact our sales team directly.
                  </Typography>
                </Card>
                
                <Card className="p-6">
                  <Typography variant="h5" className="mb-2">
                    How can I provide feedback about the platform?
                  </Typography>
                  <Typography variant="body">
                    We welcome all feedback! You can use the contact form above and select "Feedback" as the inquiry type. Alternatively, existing users can provide feedback directly through the platform using the feedback button in the user dashboard.
                  </Typography>
                </Card>
                
                <Card className="p-6">
                  <Typography variant="h5" className="mb-2">
                    Do you offer in-person training for schools?
                  </Typography>
                  <Typography variant="body">
                    Yes, we offer in-person training sessions for schools and educational institutions in the UK. These can be arranged through our professional development team. Please contact us for more information about availability and pricing.
                  </Typography>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
