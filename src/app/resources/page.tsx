'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import { FeatureCard } from '@/components/ui/enhanced-marketing-components';
import Image from 'next/image';
import Link from 'next/link';

export default function ResourcesPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Resource categories
  const resourceCategories = [
    {
      title: "Educational Materials",
      description: "Curriculum-aligned resources for all key stages",
      icon: "📚",
      resources: [
        {
          title: "Literacy Resources",
          description: "Comprehensive reading and writing materials for all ages",
          image: "/images/resources/literacy.jpg",
          link: "/resources/literacy"
        },
        {
          title: "Numeracy Resources",
          description: "Mathematics materials from basic counting to advanced algebra",
          image: "/images/resources/numeracy.jpg",
          link: "/resources/numeracy"
        },
        {
          title: "Science Resources",
          description: "Engaging science materials covering biology, chemistry, and physics",
          image: "/images/resources/science.jpg",
          link: "/resources/science"
        }
      ]
    },
    {
      title: "Teacher Resources",
      description: "Tools and materials to support educators",
      icon: "👩‍🏫",
      resources: [
        {
          title: "Lesson Plans",
          description: "Ready-to-use lesson plans aligned with UK curriculum",
          image: "/images/resources/lesson-plans.jpg",
          link: "/resources/lesson-plans"
        },
        {
          title: "Assessment Tools",
          description: "Comprehensive assessment resources for tracking progress",
          image: "/images/resources/assessment.jpg",
          link: "/resources/assessment"
        },
        {
          title: "Professional Development",
          description: "Resources to support teacher growth and development",
          image: "/images/resources/professional-development.jpg",
          link: "/professional-development"
        }
      ]
    },
    {
      title: "Special Educational Needs",
      description: "Resources for supporting diverse learning needs",
      icon: "🧩",
      resources: [
        {
          title: "Dyslexia Support",
          description: "Specialized resources for supporting students with dyslexia",
          image: "/images/resources/dyslexia.jpg",
          link: "/resources/dyslexia"
        },
        {
          title: "ADHD Resources",
          description: "Tools and strategies for supporting students with ADHD",
          image: "/images/resources/adhd.jpg",
          link: "/resources/adhd"
        },
        {
          title: "Autism Support",
          description: "Resources designed for students on the autism spectrum",
          image: "/images/resources/autism.jpg",
          link: "/resources/autism"
        }
      ]
    },
    {
      title: "Parent Resources",
      description: "Materials to support learning at home",
      icon: "👪",
      resources: [
        {
          title: "Home Learning Guides",
          description: "Practical guides for supporting education at home",
          image: "/images/resources/home-learning.jpg",
          link: "/resources/home-learning"
        },
        {
          title: "Parent Workshops",
          description: "Recorded workshops on supporting your child's education",
          image: "/images/resources/parent-workshops.jpg",
          link: "/resources/parent-workshops"
        },
        {
          title: "Family Activities",
          description: "Educational activities for the whole family",
          image: "/images/resources/family-activities.jpg",
          link: "/resources/family-activities"
        }
      ]
    }
  ];
  
  // Featured resources
  const featuredResources = [
    {
      title: "Educational Psychology Handbook",
      description: "A comprehensive guide to educational psychology principles and practices",
      image: "/images/resources/featured/handbook.jpg",
      link: "/resources/educational-psychology-handbook"
    },
    {
      title: "Inclusive Education Toolkit",
      description: "Essential tools and strategies for creating inclusive learning environments",
      image: "/images/resources/featured/inclusive-toolkit.jpg",
      link: "/resources/inclusive-education-toolkit"
    },
    {
      title: "Executive Function Development Guide",
      description: "Research-based approaches to developing executive function skills",
      image: "/images/resources/featured/executive-function.jpg",
      link: "/resources/executive-function-guide"
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
                Educational Resources
              </Typography>
              <Typography variant="lead" className="mb-6">
                Access our comprehensive collection of educational psychology resources
              </Typography>
              <Typography variant="body">
                Discover curriculum-aligned materials, specialized tools for diverse learning needs, and professional development resources—all designed by educational psychology experts.
              </Typography>
            </div>
          </Container>
        </section>
        
        {/* Featured Resources */}
        <section className="py-16">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Featured Resources
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredResources.map((resource, index) => (
                <Link href={resource.link} key={index}>
                  <Card className="h-full overflow-hidden transition-transform hover:scale-[1.02]">
                    <div className="aspect-video relative">
                      <Image
                        src={resource.image}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <Typography variant="h4" className="mb-2">
                        {resource.title}
                      </Typography>
                      <Typography variant="body">
                        {resource.description}
                      </Typography>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Resource Categories */}
        <section className="py-16 bg-background">
          <Container>
            <Typography variant="h2" className="mb-8 text-center">
              Browse Resources by Category
            </Typography>
            
            <Tabs defaultValue={resourceCategories[0].title.toLowerCase().replace(/\s+/g, '-')} className="w-full">
              <TabsList className="mx-auto mb-8">
                {resourceCategories.map((category, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={category.title.toLowerCase().replace(/\s+/g, '-')}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {resourceCategories.map((category, categoryIndex) => (
                <TabsContent 
                  key={categoryIndex} 
                  value={category.title.toLowerCase().replace(/\s+/g, '-')}
                >
                  <div className="mb-8 text-center">
                    <Typography variant="h3" className="mb-2">
                      {category.title}
                    </Typography>
                    <Typography variant="body" className="max-w-2xl mx-auto">
                      {category.description}
                    </Typography>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {category.resources.map((resource, resourceIndex) => (
                      <Link href={resource.link} key={resourceIndex}>
                        <Card className="h-full overflow-hidden transition-transform hover:scale-[1.02]">
                          <div className="aspect-video relative">
                            <Image
                              src={resource.image}
                              alt={resource.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6">
                            <Typography variant="h4" className="mb-2">
                              {resource.title}
                            </Typography>
                            <Typography variant="body">
                              {resource.description}
                            </Typography>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Container>
        </section>
        
        {/* Resource Search */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Can't Find What You're Looking For?
              </Typography>
              <Typography variant="body" className="mb-8">
                Use our advanced search to find specific resources tailored to your needs.
              </Typography>
              <Button variant="primary" size="lg" asChild>
                <Link href="/resources/search">
                  Advanced Resource Search
                </Link>
              </Button>
            </div>
          </Container>
        </section>
        
        {/* Resource Request */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Request Custom Resources
              </Typography>
              <Typography variant="body" className="mb-8">
                Need specialized resources for your classroom or school? Our educational psychology experts can develop custom materials tailored to your specific requirements.
              </Typography>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact?type=resource-request">
                  Request Custom Resources
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
