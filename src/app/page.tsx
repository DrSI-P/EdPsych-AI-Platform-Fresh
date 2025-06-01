'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import { HeroSection, FeatureCard, TestimonialCard } from '@/components/ui/enhanced-marketing-components';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate content adaptations
  const heroContent = {
    nursery: {
      title: "Learning is Fun with EdPsych Connect!",
      subtitle: "Join us on an exciting adventure where you can learn, play, and grow!",
      image: "/images/hero/nursery-hero.jpg",
    },
    'early-primary': {
      title: "Discover Your Learning Superpowers!",
      subtitle: "Explore exciting lessons, fun activities, and make new friends along the way!",
      image: "/images/hero/early-primary-hero.jpg",
    },
    'late-primary': {
      title: "Your Journey to Learning Success",
      subtitle: "Personalized learning paths, interactive lessons, and tools to help you excel",
      image: "/images/hero/late-primary-hero.jpg",
    },
    secondary: {
      title: "Personalized Education for Your Future",
      subtitle: "Evidence-based learning tools designed to help you achieve your academic goals",
      image: "/images/hero/secondary-hero.jpg",
    },
    default: {
      title: "Revolutionizing Education Through Psychology",
      subtitle: "Personalized learning paths based on educational psychology principles",
      image: "/images/hero/default-hero.jpg",
    }
  };
  
  // Select content based on age group or use default
  const currentHeroContent = heroContent[ageGroup as keyof typeof heroContent] || heroContent.default;
  
  // Features data
  const features = [
    {
      title: "Personalized Learning Paths",
      description: "Tailored educational journeys based on individual starting points and learning styles",
      icon: "🧠",
      image: "/images/features/personalized-learning.jpg"
    },
    {
      title: "Comprehensive Curriculum",
      description: "Complete coverage of UK curriculum to minimize learning gaps across all key stages",
      icon: "📚",
      image: "/images/features/curriculum.jpg"
    },
    {
      title: "Interactive Learning Tools",
      description: "Engaging activities and tools that adapt to different learning styles and preferences",
      icon: "🔍",
      image: "/images/features/interactive-tools.jpg"
    },
    {
      title: "Voice-Enabled Support",
      description: "Accessibility features including voice navigation for children who struggle with typing",
      icon: "🎤",
      image: "/images/features/voice-support.jpg"
    },
    {
      title: "Progress Tracking",
      description: "Comprehensive analytics to monitor learning progress and identify areas for improvement",
      icon: "📊",
      image: "/images/features/progress-tracking.jpg"
    },
    {
      title: "Community Collaboration",
      description: "Safe spaces for students to collaborate, share ideas, and learn from each other",
      icon: "👥",
      image: "/images/features/community.jpg"
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "EdPsych Connect has transformed how our school approaches personalized learning. The educational psychology foundations are evident in every feature.",
      author: "Sarah Johnson",
      role: "Headteacher, Oakwood Primary",
      avatar: "/images/testimonials/sarah.jpg",
      rating: 5
    },
    {
      quote: "As a parent of a child with dyslexia, I've seen remarkable progress since using this platform. The voice input feature has been a game-changer.",
      author: "Michael Thompson",
      role: "Parent",
      avatar: "/images/testimonials/michael.jpg",
      rating: 5
    },
    {
      quote: "The curriculum content is comprehensive and engaging. My students are more motivated than ever, especially with the adaptive learning features.",
      author: "Emma Williams",
      role: "Year 4 Teacher",
      avatar: "/images/testimonials/emma.jpg",
      rating: 5
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title={currentHeroContent.title}
          subtitle={currentHeroContent.subtitle}
          image={currentHeroContent.image}
          imageAlt="EdPsych Connect - Revolutionizing Education"
          height="lg"
          overlay={true}
        >
          <Flex gap="md" className="mt-6" wrap="wrap">
            <Button size="lg" variant="primary">
              Start Learning Journey
            </Button>
            <Button size="lg" variant="secondary">
              Explore Features
            </Button>
          </Flex>
        </HeroSection>
        
        {/* Introduction Section */}
        <section className="py-16 bg-background">
          <Container>
            <Flex direction="column" align="center" className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Welcome to EdPsych Connect
              </Typography>
              <Typography variant="lead" className="max-w-3xl">
                Founded on educational psychology principles, EdPsych Connect is designed to empower learners through tailored, evidence-based support and inclusive education.
              </Typography>
            </Flex>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Typography variant="h3" className="mb-4">
                  Our Vision
                </Typography>
                <Typography variant="body" className="mb-6">
                  EdPsych Connect revolutionizes learning through personalized paths based on individual starting points, systematic curriculum coverage to minimize learning gaps, identification of learning styles, and content adaptation based on interest to maximize motivation and engagement.
                </Typography>
                <Typography variant="h3" className="mb-4">
                  Our Approach
                </Typography>
                <Typography variant="body">
                  Built on over 12 years of educational psychology experience, our platform advocates for inclusive education and equitable access, particularly for disadvantaged children and young people, focusing on relationship-building and understanding underlying causes of behavior.
                </Typography>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/founder.jpg"
                  alt="Dr. Scott I-Patrick, Founder of EdPsych Connect"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <Flex direction="column" align="center" className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Platform Features
              </Typography>
              <Typography variant="lead" className="max-w-3xl">
                Discover how EdPsych Connect combines educational psychology with advanced technology to create a comprehensive learning experience.
              </Typography>
            </Flex>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  imageAlt={feature.title}
                />
              ))}
            </div>
          </Container>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-background">
          <Container>
            <Flex direction="column" align="center" className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                What Our Users Say
              </Typography>
              <Typography variant="lead" className="max-w-3xl">
                Hear from educators, parents, and students who have experienced the benefits of EdPsych Connect.
              </Typography>
            </Flex>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  avatar={testimonial.avatar}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <Container>
            <Flex direction="column" align="center" className="text-center">
              <Typography variant="h2" className="mb-4">
                Ready to Transform Learning?
              </Typography>
              <Typography variant="lead" className="max-w-3xl mb-8">
                Join thousands of students, teachers, and schools already benefiting from EdPsych Connect's innovative approach to education.
              </Typography>
              <Flex gap="md" wrap="wrap" justify="center">
                <Button size="lg" variant="primary">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="secondary">
                  Book a Demo
                </Button>
              </Flex>
            </Flex>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
