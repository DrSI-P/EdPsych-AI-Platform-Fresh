'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button, Input, Select } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { ageGroup } = useEnhancedTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography variant="h1" className="mb-6">
              Privacy Policy
            </Typography>
            
            <Card className="mb-8 p-6">
              <Typography variant="body" className="mb-4">
                <strong>Last Updated:</strong> May 31, 2025
              </Typography>
              
              <Typography variant="lead" className="mb-6">
                At EdPsych Connect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </Typography>
              
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="collection">Information Collection</TabsTrigger>
                  <TabsTrigger value="usage">Information Usage</TabsTrigger>
                  <TabsTrigger value="sharing">Information Sharing</TabsTrigger>
                  <TabsTrigger value="rights">Your Rights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-6">
                  <Typography variant="h3" className="mb-4">
                    Overview
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    EdPsych Connect is committed to protecting the privacy of children and young people who use our platform. We comply with all applicable laws and regulations, including the General Data Protection Regulation (GDPR) and the UK Data Protection Act 2018.
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    This Privacy Policy applies to all information collected through our platform, including any associated mobile applications, websites, and features.
                  </Typography>
                  
                  <Typography variant="body">
                    If you have any questions or concerns about our privacy practices, please contact us at privacy@edpsychconnect.com.
                  </Typography>
                </TabsContent>
                
                <TabsContent value="collection" className="pt-6">
                  <Typography variant="h3" className="mb-4">
                    Information Collection
                  </Typography>
                  
                  <Typography variant="h5" className="mb-2">
                    Information You Provide to Us
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    We collect information that you voluntarily provide when using our platform, including:
                  </Typography>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <Typography variant="body">
                        Personal information such as name, email address, and date of birth when you register for an account
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Educational information including learning preferences, assessment results, and progress data
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Content you create, upload, or share through the platform
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Communications with us or other users through the platform
                      </Typography>
                    </li>
                  </ul>
                  
                  <Typography variant="h5" className="mb-2">
                    Information Automatically Collected
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    When you access our platform, we may automatically collect certain information, including:
                  </Typography>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <Typography variant="body">
                        Device information such as IP address, browser type, and operating system
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Usage data including pages visited, time spent on pages, and features used
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Learning analytics to personalize your educational experience
                      </Typography>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="usage" className="pt-6">
                  <Typography variant="h3" className="mb-4">
                    Information Usage
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    We use the information we collect for various purposes, including:
                  </Typography>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <Typography variant="body">
                        <strong>Providing and improving our services:</strong> To deliver personalized learning experiences, adapt content to your learning style, and enhance platform functionality
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Communication:</strong> To respond to your inquiries, provide support, and send important updates about the platform
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Research and development:</strong> To analyze usage patterns, identify trends, and improve educational outcomes
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Safety and security:</strong> To protect our users and the integrity of our platform
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Legal compliance:</strong> To comply with applicable laws, regulations, and legal processes
                      </Typography>
                    </li>
                  </ul>
                  
                  <Typography variant="body">
                    We process personal data only for the purposes for which it was collected and in accordance with this Privacy Policy. We maintain data accuracy and only keep personal data for as long as necessary for the purposes for which it was collected.
                  </Typography>
                </TabsContent>
                
                <TabsContent value="sharing" className="pt-6">
                  <Typography variant="h3" className="mb-4">
                    Information Sharing
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    We may share your information in the following circumstances:
                  </Typography>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <Typography variant="body">
                        <strong>With schools and educators:</strong> If you are using the platform through your school, we may share your information with authorized school officials and teachers
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>With service providers:</strong> We may share information with third-party vendors who perform services on our behalf, such as hosting, data analysis, and customer service
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>With your consent:</strong> We may share information when you have given us specific consent to do so
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>For legal reasons:</strong> We may disclose information if required by law or in response to valid legal requests
                      </Typography>
                    </li>
                  </ul>
                  
                  <Typography variant="body" className="mb-4">
                    We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes.
                  </Typography>
                </TabsContent>
                
                <TabsContent value="rights" className="pt-6">
                  <Typography variant="h3" className="mb-4">
                    Your Rights
                  </Typography>
                  
                  <Typography variant="body" className="mb-4">
                    Under the GDPR and UK data protection laws, you have certain rights regarding your personal data:
                  </Typography>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <Typography variant="body">
                        <strong>Right to access:</strong> You can request copies of your personal data
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Right to rectification:</strong> You can request that we correct inaccurate or incomplete information
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Right to erasure:</strong> You can request that we delete your personal data in certain circumstances
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Right to restrict processing:</strong> You can request that we limit the processing of your data
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Right to data portability:</strong> You can request to receive your data in a structured, commonly used format
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        <strong>Right to object:</strong> You can object to our processing of your personal data
                      </Typography>
                    </li>
                  </ul>
                  
                  <Typography variant="body" className="mb-4">
                    To exercise any of these rights, please contact us at privacy@edpsychconnect.com. We will respond to your request within 30 days.
                  </Typography>
                  
                  <Typography variant="body">
                    For users under the age of 16, we require parental consent for the collection and use of personal data. Parents and guardians can review, edit, and delete their child's information at any time.
                  </Typography>
                </TabsContent>
              </Tabs>
            </Card>
            
            <Card className="p-6">
              <Typography variant="h3" className="mb-4">
                Contact Us
              </Typography>
              
              <Typography variant="body" className="mb-6">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
              </Typography>
              
              <div className="space-y-4">
                <div>
                  <Typography variant="body" className="font-medium">
                    Email:
                  </Typography>
                  <Typography variant="body">
                    privacy@edpsychconnect.com
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body" className="font-medium">
                    Postal Address:
                  </Typography>
                  <Typography variant="body">
                    EdPsych Connect Limited<br />
                    123 Education Lane<br />
                    London, UK<br />
                    EC1A 1BB
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body" className="font-medium">
                    Data Protection Officer:
                  </Typography>
                  <Typography variant="body">
                    dpo@edpsychconnect.com
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
