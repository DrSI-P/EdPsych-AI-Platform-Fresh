'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button, Input, Select } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/enhanced-interactive-components';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Team members data
  const teamMembers = [
    {
      name: "Dr. Scott I-Patrick",
      role: "Founder & Educational Psychologist",
      bio: "Dr. Scott I-Patrick is an Educational Psychologist with over 12 years of experience advocating for inclusive education and equitable access. His doctoral research on school connectedness and restorative practices forms the foundation of EdPsych Connect's approach.",
      image: "/images/team/dr-scott.jpg"
    },
    {
      name: "Dr. Emma Williams",
      role: "Head of Curriculum Development",
      bio: "With a PhD in Educational Psychology and 15 years of classroom experience, Dr. Williams leads our curriculum development team, ensuring all content is evidence-based and aligned with UK educational standards.",
      image: "/images/team/emma.jpg"
    },
    {
      name: "Michael Thompson",
      role: "Chief Technology Officer",
      bio: "Michael brings 20 years of experience in educational technology, specializing in adaptive learning systems and accessibility. He leads our technical team in creating innovative solutions that support diverse learning needs.",
      image: "/images/team/michael.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Professional Development",
      bio: "Former headteacher with extensive experience in school leadership and teacher training, Sarah oversees our professional development programs, ensuring they provide practical, evidence-based strategies for educators.",
      image: "/images/team/sarah.jpg"
    }
  ];
  
  // Mission and values
  const values = [
    {
      title: "Evidence-Based Practice",
      description: "All our approaches and content are grounded in rigorous educational psychology research and evidence.",
      icon: "📚"
    },
    {
      title: "Inclusive Education",
      description: "We believe in creating learning environments that support all children and young people, regardless of background or ability.",
      icon: "🌈"
    },
    {
      title: "Personalized Learning",
      description: "We recognize that each learner is unique, with individual strengths, challenges, and interests that should inform their educational journey.",
      icon: "🧩"
    },
    {
      title: "Relationship-Centered Approach",
      description: "We prioritize building positive relationships as the foundation for effective learning and behavior support.",
      icon: "🤝"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h1" className="mb-4">
                  About EdPsych Connect
                </Typography>
                <Typography variant="lead" className="mb-6">
                  Revolutionizing education through evidence-based psychology principles and innovative technology.
                </Typography>
                <Typography variant="body" className="mb-8">
                  Founded by Dr. Scott I-Patrick, EdPsych Connect combines over 12 years of educational psychology expertise with cutting-edge technology to create a platform that truly understands and supports the diverse needs of learners across the UK.
                </Typography>
                <Button variant="primary" size="lg">
                  Our Mission
                </Button>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/about-hero.jpg"
                  alt="EdPsych Connect Team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Our Story
              </Typography>
              <Typography variant="lead">
                A journey driven by passion for inclusive education and equitable access for all learners.
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/founder.jpg"
                  alt="Dr. Scott I-Patrick, Founder of EdPsych Connect"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Typography variant="h3" className="mb-4">
                  From Vision to Reality
                </Typography>
                <Typography variant="body" className="mb-4">
                  EdPsych Connect was born from Dr. Scott I-Patrick's doctoral research on school connectedness and his extensive experience working with children and young people across diverse educational settings. After witnessing firsthand the challenges faced by students, particularly those from disadvantaged backgrounds, he envisioned a platform that could democratize access to high-quality, personalized education.
                </Typography>
                <Typography variant="body" className="mb-4">
                  Drawing on principles of educational psychology, restorative practices, and relationship-building, Dr. I-Patrick assembled a team of dedicated educators, psychologists, and technologists to create a platform that addresses the root causes of educational challenges rather than just their symptoms.
                </Typography>
                <Typography variant="body">
                  Today, EdPsych Connect serves thousands of students, teachers, and schools across the UK, providing evidence-based tools and resources that empower learners and educators alike. Our journey continues as we constantly evolve and improve our platform based on the latest research and feedback from our community.
                </Typography>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Mission and Values Section */}
        <section className="py-16 bg-primary/5">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Our Mission & Values
              </Typography>
              <Typography variant="lead">
                Guided by educational psychology principles and a commitment to inclusive education.
              </Typography>
            </div>
            
            <Card className="p-8 mb-12">
              <Typography variant="h3" className="mb-4 text-center">
                Our Mission
              </Typography>
              <Typography variant="body" className="text-center max-w-3xl mx-auto">
                To revolutionize learning through personalized educational experiences that recognize individual starting points, minimize learning gaps, adapt to diverse learning styles, and maximize motivation and engagement through content that resonates with each child and young person's interests and needs.
              </Typography>
            </Card>
            
            <Typography variant="h3" className="mb-8 text-center">
              Our Core Values
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6">
                  <Flex align="start" gap="md">
                    <div className="text-4xl">{value.icon}</div>
                    <div>
                      <Typography variant="h4" className="mb-2">
                        {value.title}
                      </Typography>
                      <Typography variant="body">
                        {value.description}
                      </Typography>
                    </div>
                  </Flex>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Team Section */}
        <section className="py-16" id="team">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Meet Our Team
              </Typography>
              <Typography variant="lead">
                Passionate experts dedicated to transforming education through psychology and technology.
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="mb-4 mx-auto rounded-full overflow-hidden h-40 w-40 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Typography variant="h4" className="mb-1">
                    {member.name}
                  </Typography>
                  <Typography variant="small" color="muted" className="mb-4">
                    {member.role}
                  </Typography>
                  <Typography variant="body">
                    {member.bio}
                  </Typography>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Approach Section */}
        <section className="py-16 bg-background">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h2" className="mb-4">
                  Our Approach
                </Typography>
                <Typography variant="lead" className="mb-6">
                  Combining educational psychology with innovative technology to create meaningful learning experiences.
                </Typography>
                
                <Tabs defaultValue="psychology">
                  <TabsList>
                    <TabsTrigger value="psychology">Educational Psychology</TabsTrigger>
                    <TabsTrigger value="personalization">Personalization</TabsTrigger>
                    <TabsTrigger value="inclusion">Inclusive Design</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="psychology" className="pt-6">
                    <Typography variant="h5" className="mb-2">
                      Evidence-Based Psychology
                    </Typography>
                    <Typography variant="body" className="mb-4">
                      Our platform is built on sound educational psychology principles, drawing from research on cognitive development, motivation, and learning theories. We prioritize relationship-building and understanding the underlying causes of behavior, using approaches like Restorative Justice to create supportive learning environments.
                    </Typography>
                    <Typography variant="body">
                      Every feature and tool on our platform is designed with psychological principles in mind, ensuring that we're not just delivering content, but creating meaningful learning experiences that support cognitive, social, and emotional development.
                    </Typography>
                  </TabsContent>
                  
                  <TabsContent value="personalization" className="pt-6">
                    <Typography variant="h5" className="mb-2">
                      Adaptive Learning Paths
                    </Typography>
                    <Typography variant="body" className="mb-4">
                      We recognize that each learner has unique strengths, challenges, and interests. Our platform uses sophisticated algorithms to create personalized learning paths based on individual starting points, learning styles, and interests.
                    </Typography>
                    <Typography variant="body">
                      By adapting content and presentation to match each learner's needs, we maximize engagement and motivation, helping students develop a genuine love for learning while ensuring they master essential skills and knowledge.
                    </Typography>
                  </TabsContent>
                  
                  <TabsContent value="inclusion" className="pt-6">
                    <Typography variant="h5" className="mb-2">
                      Accessibility for All
                    </Typography>
                    <Typography variant="body" className="mb-4">
                      Inclusion is at the heart of everything we do. Our platform is designed to be accessible to all learners, including those with special educational needs, disabilities, or those from disadvantaged backgrounds.
                    </Typography>
                    <Typography variant="body">
                      Features like voice input for children who struggle with typing, customizable text spacing, and content adaptation for different learning styles ensure that every child can access and benefit from our platform, regardless of their individual circumstances.
                    </Typography>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about/approach.jpg"
                  alt="Our Educational Approach"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h2" className="mb-4">
                Join Our Mission
              </Typography>
              <Typography variant="lead" className="mb-8">
                Be part of the educational revolution that's transforming how children and young people learn.
              </Typography>
              <Flex gap="md" justify="center">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Flex>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
