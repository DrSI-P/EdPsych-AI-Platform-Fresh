'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import { AIAvatarVideoComponent } from '@/components/ai-avatar/ai-avatar-video-component';
import Image from 'next/image';
import Link from 'next/link';

export default function AIAvatarVideoIntegrationPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Sample pages that would have AI avatar videos
  const samplePages = [
    {
      title: "Homepage",
      description: "Welcome and platform overview",
      path: "/",
      videoId: "welcome"
    },
    {
      title: "Student Dashboard",
      description: "Student interface overview",
      path: "/dashboard/student",
      videoId: "student-dashboard"
    },
    {
      title: "Teacher Dashboard",
      description: "Teacher interface overview",
      path: "/dashboard/teacher",
      videoId: "teacher-dashboard"
    },
    {
      title: "Learning Path",
      description: "Personalized learning journey",
      path: "/learning-path",
      videoId: "learning-path"
    },
    {
      title: "Assessment",
      description: "Assessment tools and tracking",
      path: "/assessment",
      videoId: "assessment"
    },
    {
      title: "Professional Development",
      description: "Professional development resources",
      path: "/professional-development",
      videoId: "professional-development"
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
                AI Avatar Video Integration
              </Typography>
              <Typography variant="lead" className="mb-6">
                Seamless video guidance throughout the platform
              </Typography>
              <Typography variant="body">
                Our AI avatar videos provide contextual help and guidance on every page of the platform, ensuring users can easily understand and navigate all features.
              </Typography>
            </div>
          </Container>
        </section>
        
        {/* Integration Overview */}
        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h2" className="mb-6">
                  Contextual Video Guidance
                </Typography>
                <Typography variant="body" className="mb-4">
                  Every major page and feature in the EdPsych Connect platform includes contextual AI avatar videos that provide clear, concise explanations and guidance.
                </Typography>
                <Typography variant="body" className="mb-4">
                  These videos are tailored to different user types and age groups, ensuring that all users receive appropriate guidance regardless of their role or age.
                </Typography>
                <Typography variant="body" className="mb-6">
                  The videos feature Dr. Scott I-Patrick, providing expert educational psychology insights and guidance throughout the platform.
                </Typography>
                <Button variant="primary" size="lg" asChild>
                  <Link href="/videos">
                    Browse All Videos
                  </Link>
                </Button>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <AIAvatarVideoComponent />
              </div>
            </div>
          </Container>
        </section>
        
        {/* Sample Integrations */}
        <section className="py-16 bg-background">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Sample Page Integrations
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {samplePages.map((page, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-6">
                    <Typography variant="h4" className="mb-2">
                      {page.title}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                      {page.description}
                    </Typography>
                    <div className="aspect-video bg-gray-200 relative rounded-md mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild className="w-full">
                      <Link href={page.path}>
                        View Page Example
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Age-Appropriate Videos */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Typography variant="h2" className="mb-8 text-center">
                Age-Appropriate Video Adaptations
              </Typography>
              
              <div className="space-y-8">
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex items-center justify-center">
                      <div className="text-6xl">🧸</div>
                    </div>
                    <div className="md:w-3/4">
                      <Typography variant="h4" className="mb-2">
                        Early Years (Ages 3-7)
                      </Typography>
                      <Typography variant="body" className="mb-4">
                        Videos for our youngest users feature:
                      </Typography>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Simple, clear language with short sentences</li>
                        <li>Bright, engaging visuals with animated elements</li>
                        <li>Friendly, encouraging tone throughout</li>
                        <li>Interactive elements to maintain engagement</li>
                        <li>Character-based guidance with storytelling</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex items-center justify-center">
                      <div className="text-6xl">🏫</div>
                    </div>
                    <div className="md:w-3/4">
                      <Typography variant="h4" className="mb-2">
                        Primary (Ages 8-11)
                      </Typography>
                      <Typography variant="body" className="mb-4">
                        Videos for primary school students feature:
                      </Typography>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Clear explanations with age-appropriate vocabulary</li>
                        <li>Visual demonstrations of concepts</li>
                        <li>Relatable examples from school settings</li>
                        <li>Step-by-step instructions for complex tasks</li>
                        <li>Encouraging tone with growth mindset language</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex items-center justify-center">
                      <div className="text-6xl">🎒</div>
                    </div>
                    <div className="md:w-3/4">
                      <Typography variant="h4" className="mb-2">
                        Secondary (Ages 12-18)
                      </Typography>
                      <Typography variant="body" className="mb-4">
                        Videos for secondary school students feature:
                      </Typography>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>More sophisticated language and concepts</li>
                        <li>Real-world applications and examples</li>
                        <li>Subject-specific terminology when appropriate</li>
                        <li>Focus on independent learning strategies</li>
                        <li>Respectful tone that acknowledges autonomy</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex items-center justify-center">
                      <div className="text-6xl">👩‍🏫</div>
                    </div>
                    <div className="md:w-3/4">
                      <Typography variant="h4" className="mb-2">
                        Educators & Professionals
                      </Typography>
                      <Typography variant="body" className="mb-4">
                        Videos for educators and professionals feature:
                      </Typography>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Detailed explanations with professional terminology</li>
                        <li>Research-based approaches and methodologies</li>
                        <li>Classroom implementation strategies</li>
                        <li>Data analysis and interpretation guidance</li>
                        <li>Professional development frameworks</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Implementation Status */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Implementation Status
              </Typography>
              <Typography variant="body" className="mb-8">
                All video placeholders have been implemented across the platform. The actual videos will be created and uploaded by Dr. Scott I-Patrick based on the comprehensive scripts provided.
              </Typography>
              <Card className="p-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Typography variant="body">
                      <strong>Video Placeholders:</strong> All 48 video placeholders implemented
                    </Typography>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Typography variant="body">
                      <strong>Video Scripts:</strong> All 48 detailed scripts prepared
                    </Typography>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Typography variant="body">
                      <strong>Integration Component:</strong> Reusable video component created
                    </Typography>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Typography variant="body">
                      <strong>Video Library:</strong> Comprehensive video library page implemented
                    </Typography>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <Typography variant="body">
                      <strong>Video Production:</strong> Awaiting video creation by Dr. Scott I-Patrick
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
