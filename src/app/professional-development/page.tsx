'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { Container, Typography, Card, Grid } from '@/components/ui/enhanced-layout-components';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/enhanced-interactive-components';
import { HeroSection, FeatureCard } from '@/components/ui/enhanced-marketing-components';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfessionalDevelopmentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        <HeroSection
          title="Professional Development"
          subtitle="Evidence-based training for educational professionals"
          description="Enhance your practice with our comprehensive professional development programs designed by educational psychology experts. Earn recognized certifications and transform your approach to supporting all learners."
          imageSrc="/images/professional-development/hero-image.jpg"
          imageAlt="Educational professionals collaborating"
          primaryAction={{
            text: "Explore Courses",
            href: "#courses"
          }}
          secondaryAction={{
            text: "View Certifications",
            href: "#certifications"
          }}
        />
        
        <Container className="py-16">
          <Typography variant="h2" className="text-center mb-12">
            Our Professional Development Approach
          </Typography>
          
          <Grid columns={3} className="gap-8 mb-16">
            <FeatureCard
              icon="🧠"
              title="Evidence-Based Practice"
              description="All content is grounded in rigorous educational psychology research and proven methodologies."
            />
            <FeatureCard
              icon="🔄"
              title="Practical Application"
              description="Focus on real-world implementation with tools and strategies you can use immediately."
            />
            <FeatureCard
              icon="📊"
              title="Measurable Impact"
              description="Track your progress and measure the impact of new approaches on student outcomes."
            />
          </Grid>
          
          <div id="courses" className="scroll-mt-24">
            <Typography variant="h2" className="mb-8">
              Core Training Modules
            </Typography>
            
            <Tabs defaultValue="inclusive-education">
              <TabsList className="mb-8">
                <TabsTrigger value="inclusive-education">Inclusive Education</TabsTrigger>
                <TabsTrigger value="special-educational-needs">Special Educational Needs</TabsTrigger>
                <TabsTrigger value="behavior-management">Behavior Management</TabsTrigger>
                <TabsTrigger value="assessment-strategies">Assessment Strategies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inclusive-education">
                <Card className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/images/professional-development/inclusive-education.jpg"
                          alt="Inclusive classroom setting"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">12 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Modules:</span>
                          <span className="text-sm">6 modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Level:</span>
                          <span className="text-sm">Foundation to Advanced</span>
                        </div>
                      </div>
                      
                      <Button variant="primary" size="lg" className="w-full" asChild>
                        <Link href="/professional-development/courses/inclusive-education">
                          Start Course
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Typography variant="h3" className="mb-4">
                        Inclusive Education: Creating Learning Environments for All
                      </Typography>
                      
                      <Typography variant="body" className="mb-6">
                        This comprehensive course explores evidence-based approaches to creating truly inclusive learning environments that support all students. Developed by educational psychology experts, the program provides practical strategies for removing barriers to learning and implementing universal design principles.
                      </Typography>
                      
                      <Typography variant="h4" className="mb-2">
                        What You'll Learn
                      </Typography>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Universal Design for Learning principles and implementation</li>
                        <li>Differentiation strategies for diverse learners</li>
                        <li>Creating accessible learning materials and assessments</li>
                        <li>Fostering inclusive classroom culture and belonging</li>
                        <li>Collaborative approaches to inclusion with multidisciplinary teams</li>
                        <li>Measuring the impact of inclusive practices</li>
                      </ul>
                      
                      <Typography variant="h4" className="mb-2">
                        Course Structure
                      </Typography>
                      
                      <ol className="list-decimal pl-6 mb-6 space-y-2">
                        <li><strong>Foundations of Inclusive Education</strong> - Understanding the research and principles</li>
                        <li><strong>Universal Design for Learning</strong> - Multiple means of engagement, representation, and action</li>
                        <li><strong>Differentiation in Practice</strong> - Adapting content, process, and product</li>
                        <li><strong>Creating Inclusive Cultures</strong> - Building belonging and positive relationships</li>
                        <li><strong>Collaborative Inclusion</strong> - Working with specialists and support staff</li>
                        <li><strong>Measuring Impact</strong> - Evaluating and improving inclusive practices</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="special-educational-needs">
                <Card className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/images/professional-development/special-educational-needs.jpg"
                          alt="Teacher supporting student with special educational needs"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">15 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Modules:</span>
                          <span className="text-sm">8 modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Level:</span>
                          <span className="text-sm">Foundation to Advanced</span>
                        </div>
                      </div>
                      
                      <Button variant="primary" size="lg" className="w-full" asChild>
                        <Link href="/professional-development/courses/special-educational-needs">
                          Start Course
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Typography variant="h3" className="mb-4">
                        Special Educational Needs: Effective Support Strategies
                      </Typography>
                      
                      <Typography variant="body" className="mb-6">
                        This in-depth course provides educators with the knowledge and skills to effectively support learners with special educational needs. Based on current research and best practices, the program covers a range of needs and evidence-based intervention approaches.
                      </Typography>
                      
                      <Typography variant="h4" className="mb-2">
                        What You'll Learn
                      </Typography>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Understanding the UK SEND Code of Practice and legal framework</li>
                        <li>Evidence-based approaches for specific learning difficulties</li>
                        <li>Supporting social communication and interaction needs</li>
                        <li>Strategies for executive function and attention challenges</li>
                        <li>Sensory processing considerations in the classroom</li>
                        <li>Developing effective Individual Education Plans</li>
                        <li>Working collaboratively with SEND specialists and families</li>
                      </ul>
                      
                      <Typography variant="h4" className="mb-2">
                        Course Structure
                      </Typography>
                      
                      <ol className="list-decimal pl-6 mb-6 space-y-2">
                        <li><strong>SEND Framework and Identification</strong> - UK legal context and identification processes</li>
                        <li><strong>Specific Learning Difficulties</strong> - Dyslexia, dyscalculia, and dysgraphia</li>
                        <li><strong>Autism Spectrum</strong> - Supporting social communication and interaction</li>
                        <li><strong>ADHD and Executive Function</strong> - Attention and self-regulation support</li>
                        <li><strong>Speech, Language and Communication Needs</strong> - Classroom strategies and interventions</li>
                        <li><strong>Sensory Processing</strong> - Understanding and supporting sensory needs</li>
                        <li><strong>Social, Emotional and Mental Health</strong> - Supportive approaches and interventions</li>
                        <li><strong>Effective IEPs and Support Plans</strong> - Development, implementation and review</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="behavior-management">
                <Card className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/images/professional-development/behavior-management.jpg"
                          alt="Teacher facilitating restorative circle"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">10 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Modules:</span>
                          <span className="text-sm">5 modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Level:</span>
                          <span className="text-sm">Foundation to Advanced</span>
                        </div>
                      </div>
                      
                      <Button variant="primary" size="lg" className="w-full" asChild>
                        <Link href="/professional-development/courses/behavior-management">
                          Start Course
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Typography variant="h3" className="mb-4">
                        Positive Behavior Support and Restorative Approaches
                      </Typography>
                      
                      <Typography variant="body" className="mb-6">
                        This transformative course explores evidence-based approaches to behavior support that focus on understanding underlying causes and building positive relationships. Based on restorative principles and positive psychology, the program provides practical strategies for creating supportive learning environments.
                      </Typography>
                      
                      <Typography variant="h4" className="mb-2">
                        What You'll Learn
                      </Typography>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Understanding behavior as communication and identifying underlying needs</li>
                        <li>Implementing school-wide positive behavior support frameworks</li>
                        <li>Restorative justice principles and practices in educational settings</li>
                        <li>De-escalation techniques and crisis prevention</li>
                        <li>Trauma-informed approaches to behavior support</li>
                        <li>Building student self-regulation and emotional literacy</li>
                      </ul>
                      
                      <Typography variant="h4" className="mb-2">
                        Course Structure
                      </Typography>
                      
                      <ol className="list-decimal pl-6 mb-6 space-y-2">
                        <li><strong>Behavior as Communication</strong> - Understanding functions and underlying needs</li>
                        <li><strong>Positive Behavior Support</strong> - Preventative approaches and teaching alternatives</li>
                        <li><strong>Restorative Practices</strong> - Building relationships and repairing harm</li>
                        <li><strong>Trauma-Informed Approaches</strong> - Supporting students with adverse experiences</li>
                        <li><strong>Self-Regulation Development</strong> - Building emotional literacy and coping skills</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="assessment-strategies">
                <Card className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/images/professional-development/assessment-strategies.jpg"
                          alt="Teacher conducting formative assessment"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">12 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Modules:</span>
                          <span className="text-sm">6 modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Level:</span>
                          <span className="text-sm">Foundation to Advanced</span>
                        </div>
                      </div>
                      
                      <Button variant="primary" size="lg" className="w-full" asChild>
                        <Link href="/professional-development/courses/assessment-strategies">
                          Start Course
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Typography variant="h3" className="mb-4">
                        Effective Assessment for Learning
                      </Typography>
                      
                      <Typography variant="body" className="mb-6">
                        This comprehensive course explores evidence-based assessment approaches that drive learning and inform teaching. Based on assessment for learning principles, the program provides practical strategies for gathering meaningful data and using it to enhance educational outcomes.
                      </Typography>
                      
                      <Typography variant="h4" className="mb-2">
                        What You'll Learn
                      </Typography>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Principles of effective formative and summative assessment</li>
                        <li>Designing inclusive and accessible assessments</li>
                        <li>Providing effective feedback that moves learning forward</li>
                        <li>Using assessment data to inform teaching and interventions</li>
                        <li>Developing student self-assessment and metacognitive skills</li>
                        <li>UK assessment frameworks and reporting requirements</li>
                      </ul>
                      
                      <Typography variant="h4" className="mb-2">
                        Course Structure
                      </Typography>
                      
                      <ol className="list-decimal pl-6 mb-6 space-y-2">
                        <li><strong>Assessment Fundamentals</strong> - Purposes, principles and best practices</li>
                        <li><strong>Formative Assessment</strong> - Gathering evidence to inform teaching</li>
                        <li><strong>Effective Feedback</strong> - Principles and practices that drive learning</li>
                        <li><strong>Inclusive Assessment</strong> - Designing for all learners</li>
                        <li><strong>Data-Informed Teaching</strong> - Using assessment to plan interventions</li>
                        <li><strong>Student Agency</strong> - Developing self-assessment and peer assessment</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div id="certifications" className="scroll-mt-24 mt-24">
            <Typography variant="h2" className="mb-8">
              Specialized Certification Pathways
            </Typography>
            
            <Grid columns={2} className="gap-8">
              <Card className="p-8">
                <Typography variant="h3" className="mb-4">
                  SENCO Certification
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/senco-certification.jpg"
                    alt="SENCO working with team"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-6">
                  Comprehensive training for Special Educational Needs Coordinators (SENCOs) covering legal requirements, effective coordination of provision, and strategic SEND leadership within educational settings.
                </Typography>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">40 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Modules:</span>
                    <span className="text-sm">8 core modules + practical assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Recognition:</span>
                    <span className="text-sm">EdPsych Connect SENCO Certificate</span>
                  </div>
                </div>
                
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <Link href="/professional-development/certifications/senco">
                    View Certification Details
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-8">
                <Typography variant="h3" className="mb-4">
                  Assessment Specialist Certification
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/assessment-specialist.jpg"
                    alt="Teacher conducting educational assessment"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-6">
                  Advanced training in educational assessment approaches, interpretation of assessment data, and development of evidence-based interventions based on assessment findings.
                </Typography>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">35 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Modules:</span>
                    <span className="text-sm">7 core modules + practical assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Recognition:</span>
                    <span className="text-sm">EdPsych Connect Assessment Specialist Certificate</span>
                  </div>
                </div>
                
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <Link href="/professional-development/certifications/assessment-specialist">
                    View Certification Details
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-8">
                <Typography variant="h3" className="mb-4">
                  Restorative Justice Practitioner Certification
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/restorative-justice.jpg"
                    alt="Restorative circle in classroom"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-6">
                  In-depth training on restorative justice principles and practices in educational settings, including facilitation of restorative conferences and implementation of whole-school restorative approaches.
                </Typography>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">30 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Modules:</span>
                    <span className="text-sm">6 core modules + practical assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Recognition:</span>
                    <span className="text-sm">EdPsych Connect Restorative Practitioner Certificate</span>
                  </div>
                </div>
                
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <Link href="/professional-development/certifications/restorative-justice">
                    View Certification Details
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-8">
                <Typography variant="h3" className="mb-4">
                  Wellbeing Lead Certification
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/wellbeing-lead.jpg"
                    alt="School wellbeing activities"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-6">
                  Comprehensive training for educational professionals leading on mental health and wellbeing initiatives, covering mental health first aid, whole-school wellbeing strategies, and effective interventions.
                </Typography>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">35 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Modules:</span>
                    <span className="text-sm">7 core modules + practical assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Recognition:</span>
                    <span className="text-sm">EdPsych Connect Wellbeing Lead Certificate</span>
                  </div>
                </div>
                
                <Button variant="secondary" size="lg" className="w-full" asChild>
                  <Link href="/professional-development/certifications/wellbeing-lead">
                    View Certification Details
                  </Link>
                </Button>
              </Card>
            </Grid>
          </div>
          
          <div className="mt-24">
            <Typography variant="h2" className="mb-8">
              Micro-Learning Resources
            </Typography>
            
            <Grid columns={3} className="gap-8">
              <Card className="p-6">
                <Typography variant="h4" className="mb-4">
                  Quick Guides
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/professional-development/quick-guides.jpg"
                    alt="Teacher reviewing quick guide"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-4">
                  Concise 15-20 minute modules on specific topics, perfect for busy educators looking to quickly implement new strategies.
                </Typography>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/professional-development/micro-learning/quick-guides">
                    Browse Quick Guides
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-6">
                <Typography variant="h4" className="mb-4">
                  Video Demonstrations
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/professional-development/video-demonstrations.jpg"
                    alt="Video demonstration of teaching technique"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-4">
                  Watch expert educators demonstrate evidence-based techniques in real classroom settings with detailed commentary.
                </Typography>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/professional-development/micro-learning/video-demonstrations">
                    Watch Demonstrations
                  </Link>
                </Button>
              </Card>
              
              <Card className="p-6">
                <Typography variant="h4" className="mb-4">
                  Downloadable Resources
                </Typography>
                
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/professional-development/downloadable-resources.jpg"
                    alt="Educational resources and worksheets"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <Typography variant="body" className="mb-4">
                  Access ready-to-use templates, worksheets, visual supports, and planning tools for immediate classroom implementation.
                </Typography>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/professional-development/micro-learning/downloadable-resources">
                    Download Resources
                  </Link>
                </Button>
              </Card>
            </Grid>
          </div>
          
          <div className="mt-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <Typography variant="h2" className="mb-4">
                  Start Your Professional Development Journey
                </Typography>
                
                <Typography variant="body" className="mb-6">
                  Transform your practice with our evidence-based professional development programs. Whether you're looking to enhance your inclusive teaching approaches, develop specialized expertise, or simply access quick practical strategies, we have resources to support your growth.
                </Typography>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/professional-development/courses">
                      Explore All Courses
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">
                      Request Custom Training
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-development/pd-journey.jpg"
                    alt="Professional development journey"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
