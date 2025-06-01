'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import Image from 'next/image';
import Link from 'next/link';

export default function AIAvatarVideoPage() {
  const { ageGroup } = useEnhancedTheme();
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Video categories based on platform sections
  const videoCategories = [
    {
      id: "introduction",
      title: "Introduction",
      description: "Welcome videos and platform overview",
      videos: [
        {
          id: "welcome",
          title: "Welcome to EdPsych Connect",
          description: "An introduction to the platform by Dr. Scott I-Patrick",
          thumbnail: "/images/videos/thumbnails/welcome.jpg",
          placeholder: true,
          duration: "3:45"
        }
      ]
    },
    {
      id: "core-platform",
      title: "Core Platform Features",
      description: "Videos explaining the main platform functionality",
      videos: [
        {
          id: "navigation",
          title: "Platform Navigation",
          description: "How to navigate through the EdPsych Connect platform",
          thumbnail: "/images/videos/thumbnails/navigation.jpg",
          placeholder: true,
          duration: "2:30"
        },
        {
          id: "personalization",
          title: "Personalization Features",
          description: "How to customize your learning experience",
          thumbnail: "/images/videos/thumbnails/personalization.jpg",
          placeholder: true,
          duration: "2:15"
        },
        {
          id: "accessibility",
          title: "Accessibility Features",
          description: "Overview of platform accessibility options",
          thumbnail: "/images/videos/thumbnails/accessibility.jpg",
          placeholder: true,
          duration: "2:00"
        }
      ]
    },
    {
      id: "educational-psychology",
      title: "Educational Psychology Features",
      description: "Videos explaining specialized educational psychology tools",
      videos: [
        {
          id: "learning-styles",
          title: "Learning Styles Adaptation",
          description: "How the platform adapts to different learning styles",
          thumbnail: "/images/videos/thumbnails/learning-styles.jpg",
          placeholder: true,
          duration: "3:10"
        },
        {
          id: "executive-function",
          title: "Executive Function Support",
          description: "Tools for developing executive function skills",
          thumbnail: "/images/videos/thumbnails/executive-function.jpg",
          placeholder: true,
          duration: "2:45"
        },
        {
          id: "behavior-support",
          title: "Behavior Support Tools",
          description: "Resources for positive behavior management",
          thumbnail: "/images/videos/thumbnails/behavior-support.jpg",
          placeholder: true,
          duration: "2:50"
        }
      ]
    },
    {
      id: "user-interfaces",
      title: "User Interfaces",
      description: "Videos for different user types",
      videos: [
        {
          id: "student-interface",
          title: "Student Dashboard",
          description: "Overview of the student interface",
          thumbnail: "/images/videos/thumbnails/student-interface.jpg",
          placeholder: true,
          duration: "2:20"
        },
        {
          id: "teacher-interface",
          title: "Teacher Dashboard",
          description: "Overview of the teacher interface",
          thumbnail: "/images/videos/thumbnails/teacher-interface.jpg",
          placeholder: true,
          duration: "2:35"
        },
        {
          id: "parent-interface",
          title: "Parent Dashboard",
          description: "Overview of the parent interface",
          thumbnail: "/images/videos/thumbnails/parent-interface.jpg",
          placeholder: true,
          duration: "2:15"
        }
      ]
    },
    {
      id: "professional-development",
      title: "Professional Development",
      description: "Videos about professional development resources",
      videos: [
        {
          id: "pd-overview",
          title: "Professional Development Overview",
          description: "Introduction to professional development offerings",
          thumbnail: "/images/videos/thumbnails/pd-overview.jpg",
          placeholder: true,
          duration: "3:00"
        },
        {
          id: "certification",
          title: "Certification Pathways",
          description: "Overview of available certification options",
          thumbnail: "/images/videos/thumbnails/certification.jpg",
          placeholder: true,
          duration: "2:40"
        }
      ]
    }
  ];
  
  // Function to handle video selection
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    // In a real implementation, this would load the actual video
    // For now, we're just showing the placeholder
  };
  
  // Function to close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h1" className="mb-4">
                AI Avatar Video Guides
              </Typography>
              <Typography variant="lead" className="mb-6">
                Learn how to use the EdPsych Connect platform with our helpful video guides
              </Typography>
              <Typography variant="body">
                Our AI avatar videos provide clear, concise explanations of platform features and functionality, making it easy to get started and make the most of your EdPsych Connect experience.
              </Typography>
            </div>
          </Container>
        </section>
        
        {/* Featured Video */}
        <section className="py-16">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Featured Video
            </Typography>
            
            <div className="max-w-4xl mx-auto">
              <div 
                className="aspect-video relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleVideoSelect(videoCategories[0].videos[0])}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <Typography variant="h4" className="text-gray-800">
                      Welcome to EdPsych Connect
                    </Typography>
                    <Typography variant="body" className="text-gray-600">
                      An introduction by Dr. Scott I-Patrick
                    </Typography>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  3:45
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Video Categories */}
        <section className="py-16 bg-background">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Video Library
            </Typography>
            
            <Tabs defaultValue={videoCategories[0].id} className="w-full">
              <TabsList className="mx-auto mb-8">
                {videoCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {videoCategories.map((category) => (
                <TabsContent 
                  key={category.id} 
                  value={category.id}
                >
                  <div className="mb-8 text-center">
                    <Typography variant="h3" className="mb-2">
                      {category.title}
                    </Typography>
                    <Typography variant="body" className="max-w-2xl mx-auto">
                      {category.description}
                    </Typography>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.videos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="aspect-video relative bg-gray-200">
                          {video.placeholder ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <Typography variant="h5" className="mb-1">
                            {video.title}
                          </Typography>
                          <Typography variant="body" className="text-gray-600">
                            {video.description}
                          </Typography>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Container>
        </section>
        
        {/* Age-Appropriate Videos */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Age-Appropriate Video Guides
              </Typography>
              <Typography variant="body" className="mb-8">
                Our videos are tailored to different age groups, ensuring that all users can understand and engage with the content.
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <div className="text-4xl mb-4">🧸</div>
                  <Typography variant="h4" className="mb-2">
                    Early Years
                  </Typography>
                  <Typography variant="body">
                    Simple, engaging videos for our youngest users
                  </Typography>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="text-4xl mb-4">🏫</div>
                  <Typography variant="h4" className="mb-2">
                    Primary
                  </Typography>
                  <Typography variant="body">
                    Clear, friendly videos for primary school students
                  </Typography>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="text-4xl mb-4">🎒</div>
                  <Typography variant="h4" className="mb-2">
                    Secondary
                  </Typography>
                  <Typography variant="body">
                    Informative videos for secondary school students
                  </Typography>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="text-4xl mb-4">👩‍🏫</div>
                  <Typography variant="h4" className="mb-2">
                    Educators
                  </Typography>
                  <Typography variant="body">
                    Detailed videos for teachers and professionals
                  </Typography>
                </Card>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Request Custom Videos */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Need a Custom Video Guide?
              </Typography>
              <Typography variant="body" className="mb-8">
                If you need help with a specific feature or have a unique use case, we can create custom video guides tailored to your needs.
              </Typography>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact?type=custom-video-request">
                  Request Custom Video
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      
      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <Typography variant="h4">
                {selectedVideo.title}
              </Typography>
              <button 
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto">
              <div className="aspect-video bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <svg className="w-20 h-20 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="body" className="text-gray-500">
                    This is a placeholder for the "{selectedVideo.title}" video.
                  </Typography>
                  <Typography variant="small" className="text-gray-500 mt-2">
                    The actual video will be uploaded by Dr. Scott I-Patrick.
                  </Typography>
                </div>
              </div>
              
              <div className="p-6">
                <Typography variant="h5" className="mb-2">
                  {selectedVideo.title}
                </Typography>
                <Typography variant="body" className="mb-4">
                  {selectedVideo.description}
                </Typography>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Duration: {selectedVideo.duration}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <Button variant="primary" onClick={closeVideoModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <EnhancedFooter />
    </div>
  );
}
