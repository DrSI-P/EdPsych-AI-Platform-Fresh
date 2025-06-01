'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CertificationPathways() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Professional Certification Pathways</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enhance your professional development with our specialized certification pathways, designed to build expertise in key areas of educational psychology.
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="practitioner">Educational Psychology Practitioner</TabsTrigger>
            <TabsTrigger value="inclusive">Inclusive Education Specialist</TabsTrigger>
            <TabsTrigger value="wellbeing">Wellbeing & Mental Health</TabsTrigger>
            <TabsTrigger value="technology">Technology Integration</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Why Choose Our Certification Pathways?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Evidence-Based Content</h3>
                      <p className="text-muted-foreground">All pathways are grounded in the latest research and best practices in educational psychology.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Flexible Learning</h3>
                      <p className="text-muted-foreground">Complete modules at your own pace, with both self-directed and guided learning options.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Practical Application</h3>
                      <p className="text-muted-foreground">Develop skills you can immediately apply in your educational setting.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Professional Recognition</h3>
                      <p className="text-muted-foreground">Earn certificates that demonstrate your expertise and commitment to professional growth.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="relative rounded-lg overflow-hidden h-80">
                <Image 
                  src="/images/professional-development/certification-overview.jpg" 
                  alt="Professional development session" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">How Our Certification Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <span className="text-blue-500 text-xl font-bold">1</span>
                    </div>
                    <CardTitle>Choose Your Pathway</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Select the certification pathway that aligns with your professional goals and interests.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-t-green-500">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <span className="text-green-500 text-xl font-bold">2</span>
                    </div>
                    <CardTitle>Complete Core Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Work through the required modules for your chosen pathway at your own pace.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-t-amber-500">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <span className="text-amber-500 text-xl font-bold">3</span>
                    </div>
                    <CardTitle>Demonstrate Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Complete assessments and practical applications to demonstrate your knowledge and skills.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-t-purple-500">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <span className="text-purple-500 text-xl font-bold">4</span>
                    </div>
                    <CardTitle>Receive Certification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Earn your digital certificate and showcase your specialized expertise.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Certification Levels</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200">
                    <CardTitle className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Foundation Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        2-3 core modules
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Knowledge-based assessments
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Digital badge and certificate
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approximately 25-30 CPD hours
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200">
                    <CardTitle className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Advanced Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        4-6 modules (core + specialized)
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Case study or project work
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Digital badge, certificate, and portfolio
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approximately 50-60 CPD hours
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
                    <CardTitle className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Specialist Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete pathway (8+ modules)
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Applied project and presentation
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Premium certificate and mentor access
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        100+ CPD hours
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="mr-4">View All Pathways</Button>
              <Button variant="outline" size="lg">Contact for Group Enrollment</Button>
            </div>
          </TabsContent>
          
          {/* Educational Psychology Practitioner Tab */}
          <TabsContent value="practitioner">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Educational Psychology Practitioner Certification</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Develop comprehensive knowledge and skills in educational psychology principles and practices to support 
                    learners across educational settings.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">100+ CPD Hours</Badge>
                    <Badge variant="secondary">8 Core Modules</Badge>
                    <Badge variant="secondary">3 Certification Levels</Badge>
                    <Badge variant="secondary">Applied Project</Badge>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Overview</h3>
                  <p className="mb-4">
                    The Educational Psychology Practitioner Certification provides a comprehensive foundation in educational psychology 
                    principles and practices. This pathway is designed for educators who want to deepen their understanding of how 
                    children learn and develop, and how to apply psychological principles to support learning and wellbeing in educational settings.
                  </p>
                  <p>
                    Through this certification, you'll develop skills in assessment, intervention planning, and evidence-based practice, 
                    enabling you to make a significant positive impact on the educational experiences of all learners.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Required Modules</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Foundations of Educational Psychology</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Core theories, principles, and research that underpin educational psychology practice.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/foundations" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cognitive Development and Learning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Understanding how cognitive processes develop and impact learning across different ages.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/cognitive-development" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Social-Emotional Development</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">The role of social and emotional factors in learning and development.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/social-emotional" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Assessment and Intervention</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Approaches to assessing learning needs and designing effective interventions.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/assessment" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Button variant="outline" className="w-full">View All Required Modules</Button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Requirements</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Foundation Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 3 core modules</li>
                        <li>Pass knowledge assessments with 70% or higher</li>
                        <li>Submit reflection journal</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Advanced Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 6 modules (3 core + 3 specialized)</li>
                        <li>Pass all assessments with 75% or higher</li>
                        <li>Submit case study analysis</li>
                        <li>Complete Foundation Level requirements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialist Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete all 8 pathway modules</li>
                        <li>Pass all assessments with 80% or higher</li>
                        <li>Develop and implement an applied project</li>
                        <li>Present project outcomes and learning</li>
                        <li>Complete Advanced Level requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Begin Your Certification</CardTitle>
                    <CardDescription>Start your journey to becoming an Educational Psychology Practitioner</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative rounded-md overflow-hidden h-48">
                      <Image 
                        src="/images/professional-development/ed-psych-practitioner.jpg" 
                        alt="Educational Psychology Practitioner" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Time:</span>
                        <span className="font-medium">12-18 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPD Hours:</span>
                        <span className="font-medium">100+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assessment:</span>
                        <span className="font-medium">Mixed Methods</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support:</span>
                        <span className="font-medium">Tutor & Peer</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full">Enroll Now</Button>
                    <Button variant="outline" className="w-full">Download Syllabus</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Inclusive Education Specialist Tab */}
          <TabsContent value="inclusive">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Inclusive Education Specialist Certification</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Develop expertise in creating inclusive learning environments that meet the diverse needs of all learners, 
                    with a focus on SEND, accessibility, and equity.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">90+ CPD Hours</Badge>
                    <Badge variant="secondary">7 Core Modules</Badge>
                    <Badge variant="secondary">3 Certification Levels</Badge>
                    <Badge variant="secondary">Practical Portfolio</Badge>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Overview</h3>
                  <p className="mb-4">
                    The Inclusive Education Specialist Certification equips educators with the knowledge, skills, and strategies to create 
                    truly inclusive learning environments. This pathway focuses on understanding diverse learning needs, removing barriers to 
                    participation, and implementing evidence-based approaches to support all learners.
                  </p>
                  <p>
                    Through this certification, you'll develop expertise in areas such as SEND provision, universal design for learning, 
                    differentiation strategies, and creating a culture of inclusion within educational settings.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Required Modules</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Inclusive Education Principles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Core principles, legislation, and research underpinning inclusive education.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/inclusive-principles" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">SEND Identification and Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Understanding different types of SEND and effective support strategies.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/send-support" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Universal Design for Learning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Designing learning experiences that are accessible to all from the outset.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/udl" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Differentiation Strategies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Approaches to adapting teaching and learning to meet diverse needs.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/differentiation" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Button variant="outline" className="w-full">View All Required Modules</Button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Requirements</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Foundation Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 3 core modules</li>
                        <li>Pass knowledge assessments with 70% or higher</li>
                        <li>Submit inclusion audit of own setting</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Advanced Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 5 modules (3 core + 2 specialized)</li>
                        <li>Pass all assessments with 75% or higher</li>
                        <li>Develop inclusive intervention plan</li>
                        <li>Complete Foundation Level requirements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialist Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete all 7 pathway modules</li>
                        <li>Pass all assessments with 80% or higher</li>
                        <li>Create inclusive education portfolio</li>
                        <li>Implement and evaluate inclusion initiative</li>
                        <li>Complete Advanced Level requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Begin Your Certification</CardTitle>
                    <CardDescription>Start your journey to becoming an Inclusive Education Specialist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative rounded-md overflow-hidden h-48">
                      <Image 
                        src="/images/professional-development/inclusive-education.jpg" 
                        alt="Inclusive Education Specialist" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Time:</span>
                        <span className="font-medium">10-15 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPD Hours:</span>
                        <span className="font-medium">90+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assessment:</span>
                        <span className="font-medium">Portfolio-based</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support:</span>
                        <span className="font-medium">Tutor & Peer</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full">Enroll Now</Button>
                    <Button variant="outline" className="w-full">Download Syllabus</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Wellbeing & Mental Health Tab */}
          <TabsContent value="wellbeing">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Wellbeing & Mental Health Leadership Certification</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Develop expertise in promoting mental health and wellbeing across educational settings, with a focus on 
                    whole-school approaches and supporting vulnerable learners.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">80+ CPD Hours</Badge>
                    <Badge variant="secondary">6 Core Modules</Badge>
                    <Badge variant="secondary">3 Certification Levels</Badge>
                    <Badge variant="secondary">Action Research</Badge>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Overview</h3>
                  <p className="mb-4">
                    The Wellbeing & Mental Health Leadership Certification equips educators with the knowledge and skills to lead 
                    effective wellbeing initiatives in educational settings. This pathway focuses on understanding mental health, 
                    developing whole-school approaches to wellbeing, and supporting vulnerable learners.
                  </p>
                  <p>
                    Through this certification, you'll develop expertise in areas such as trauma-informed practice, resilience building, 
                    staff wellbeing, and creating mentally healthy learning environments.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Required Modules</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Whole-School Approaches to Wellbeing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Developing comprehensive wellbeing frameworks across educational settings.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/leadership-in-educational-psychology" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Trauma-Informed Practice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Understanding trauma's impact on learning and implementing trauma-sensitive approaches.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/trauma-informed-practice" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Mental Health Literacy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Understanding common mental health conditions and appropriate support strategies.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/mental-health-literacy" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Staff Wellbeing and Resilience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Supporting staff mental health and building organizational resilience.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/staff-wellbeing" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Button variant="outline" className="w-full">View All Required Modules</Button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Requirements</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Foundation Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 2 core modules</li>
                        <li>Pass knowledge assessments with 70% or higher</li>
                        <li>Submit wellbeing audit of own setting</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Advanced Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 4 modules (2 core + 2 specialized)</li>
                        <li>Pass all assessments with 75% or higher</li>
                        <li>Develop wellbeing action plan</li>
                        <li>Complete Foundation Level requirements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialist Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete all 6 pathway modules</li>
                        <li>Pass all assessments with 80% or higher</li>
                        <li>Conduct action research project</li>
                        <li>Present findings and recommendations</li>
                        <li>Complete Advanced Level requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Begin Your Certification</CardTitle>
                    <CardDescription>Start your journey to becoming a Wellbeing & Mental Health Leader</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative rounded-md overflow-hidden h-48">
                      <Image 
                        src="/images/professional-development/wellbeing-leadership.jpg" 
                        alt="Wellbeing and Mental Health Leadership" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Time:</span>
                        <span className="font-medium">8-12 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPD Hours:</span>
                        <span className="font-medium">80+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assessment:</span>
                        <span className="font-medium">Action Research</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support:</span>
                        <span className="font-medium">Tutor & Peer</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full">Enroll Now</Button>
                    <Button variant="outline" className="w-full">Download Syllabus</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Technology Integration Tab */}
          <TabsContent value="technology">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Technology Integration Specialist Certification</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Develop expertise in leveraging technology to enhance teaching, learning, and assessment, with a focus on 
                    evidence-based approaches and ethical considerations.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">75+ CPD Hours</Badge>
                    <Badge variant="secondary">6 Core Modules</Badge>
                    <Badge variant="secondary">3 Certification Levels</Badge>
                    <Badge variant="secondary">Digital Portfolio</Badge>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Overview</h3>
                  <p className="mb-4">
                    The Technology Integration Specialist Certification equips educators with the knowledge and skills to effectively 
                    integrate technology into educational practice. This pathway focuses on evidence-based approaches to technology 
                    integration, digital pedagogy, and ethical considerations.
                  </p>
                  <p>
                    Through this certification, you'll develop expertise in areas such as AI in education, digital accessibility, 
                    technology-enhanced assessment, and supporting diverse learners through technology.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Required Modules</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">AI Policy Development for Schools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Developing comprehensive policies for ethical AI use in educational settings.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/technology-in-education" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Digital Pedagogy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Evidence-based approaches to teaching and learning with technology.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/digital-pedagogy" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Digital Tools for SEND Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Using technology to support learners with special educational needs and disabilities.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/digital-send-support" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Technology-Enhanced Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Using digital tools to improve assessment practices and feedback.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href="/professional-development/tech-assessment" className="text-sm text-primary hover:underline">View Module</Link>
                      </CardFooter>
                    </Card>
                    
                    <Button variant="outline" className="w-full">View All Required Modules</Button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Certification Requirements</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Foundation Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 2 core modules</li>
                        <li>Pass knowledge assessments with 70% or higher</li>
                        <li>Create digital resource collection</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Advanced Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete 4 modules (2 core + 2 specialized)</li>
                        <li>Pass all assessments with 75% or higher</li>
                        <li>Develop technology integration plan</li>
                        <li>Complete Foundation Level requirements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialist Level</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Complete all 6 pathway modules</li>
                        <li>Pass all assessments with 80% or higher</li>
                        <li>Create comprehensive digital portfolio</li>
                        <li>Implement and evaluate technology initiative</li>
                        <li>Complete Advanced Level requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Begin Your Certification</CardTitle>
                    <CardDescription>Start your journey to becoming a Technology Integration Specialist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative rounded-md overflow-hidden h-48">
                      <Image 
                        src="/images/professional-development/technology-integration.jpg" 
                        alt="Technology Integration Specialist" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Time:</span>
                        <span className="font-medium">6-10 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPD Hours:</span>
                        <span className="font-medium">75+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assessment:</span>
                        <span className="font-medium">Digital Portfolio</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support:</span>
                        <span className="font-medium">Tutor & Peer</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full">Enroll Now</Button>
                    <Button variant="outline" className="w-full">Download Syllabus</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
