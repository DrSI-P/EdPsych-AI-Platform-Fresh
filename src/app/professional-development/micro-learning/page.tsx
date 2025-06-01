'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function MicroLearning() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Micro-Learning Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quick, focused learning resources designed to fit into your busy schedule. Build your knowledge in just 5-15 minutes at a time.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                placeholder="Search micro-learning resources..." 
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="infographics">Infographics</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="quizzes">Quick Quizzes</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>
          
          {/* All Tab */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Micro-Learning */}
              <Card className="col-span-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">Featured</Badge>
                      <CardTitle className="text-2xl">5-Minute Guide to Executive Function</CardTitle>
                      <CardDescription>Understanding the brain's control system</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 rounded-md overflow-hidden mb-4">
                    <Image 
                      src="/images/professional-development/executive-function.jpg" 
                      alt="Executive Function Diagram" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Learn the key components of executive function and how they impact learning and behavior. 
                    Perfect for quickly understanding this crucial cognitive process.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    1,245 views
                  </div>
                  <Button>View Resource</Button>
                </CardFooter>
              </Card>
              
              {/* Video Resources */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>Working Memory in the Classroom</CardTitle>
                      <CardDescription>Practical strategies for teachers</CardDescription>
                    </div>
                    <Badge variant="outline">8 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">EP</span>
                    </div>
                    <span className="text-sm">Dr. Sarah Johnson</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>De-escalation Techniques</CardTitle>
                      <CardDescription>Managing challenging behavior</CardDescription>
                    </div>
                    <Badge variant="outline">10 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-green-700">MB</span>
                    </div>
                    <span className="text-sm">Mark Bennett</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>Dyslexia: Signs and Support</CardTitle>
                      <CardDescription>Quick guide for educators</CardDescription>
                    </div>
                    <Badge variant="outline">7 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-700">LT</span>
                    </div>
                    <span className="text-sm">Dr. Lisa Taylor</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              {/* Infographics */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Infographic</Badge>
                      <CardTitle>The ADHD Brain: Key Facts</CardTitle>
                      <CardDescription>Visual guide to neurodiversity</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4">
                    <Image 
                      src="/images/professional-development/adhd-infographic.jpg" 
                      alt="ADHD Brain Infographic" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A visual breakdown of how ADHD affects brain function and learning, with key strategies for classroom support.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Infographic</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Infographic</Badge>
                      <CardTitle>Trauma Response Cycle</CardTitle>
                      <CardDescription>Understanding trauma behaviors</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4">
                    <Image 
                      src="/images/professional-development/trauma-cycle.jpg" 
                      alt="Trauma Response Cycle" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visual guide to recognizing trauma responses in the classroom and appropriate intervention strategies.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Infographic</Button>
                </CardFooter>
              </Card>
              
              {/* Podcasts */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Podcast</Badge>
                      <CardTitle>Growth Mindset in Practice</CardTitle>
                      <CardDescription>Quick listen for busy educators</CardDescription>
                    </div>
                    <Badge variant="outline">12 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-700">EP</span>
                      </div>
                      <span className="text-sm">EdPsych Talks</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Listen Now</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Podcast</Badge>
                      <CardTitle>Anxiety in the Classroom</CardTitle>
                      <CardDescription>Recognition and support strategies</CardDescription>
                    </div>
                    <Badge variant="outline">15 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-700">EP</span>
                      </div>
                      <span className="text-sm">EdPsych Talks</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Listen Now</Button>
                </CardFooter>
              </Card>
              
              {/* Quick Quizzes */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Quiz</Badge>
                      <CardTitle>SEND Code of Practice</CardTitle>
                      <CardDescription>Test your knowledge</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A quick 5-question quiz to test your knowledge of the SEND Code of Practice and its implementation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Take Quiz</Button>
                </CardFooter>
              </Card>
              
              {/* Practical Guides */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Guide</Badge>
                      <CardTitle>Sensory Breaks: Quick Guide</CardTitle>
                      <CardDescription>5-minute sensory activities</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4">
                    <Image 
                      src="/images/professional-development/sensory-breaks.jpg" 
                      alt="Sensory Breaks Guide" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A practical guide to implementing quick sensory breaks in the classroom to support regulation and focus.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Guide</Badge>
                      <CardTitle>Effective Praise Techniques</CardTitle>
                      <CardDescription>Evidence-based approaches</CardDescription>
                    </div>
                    <Badge variant="outline">5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4">
                    <Image 
                      src="/images/professional-development/effective-praise.jpg" 
                      alt="Effective Praise Guide" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Learn how to deliver praise that builds intrinsic motivation and supports growth mindset in learners.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Resources
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
          </TabsContent>
          
          {/* Other tabs would have similar content structure but filtered by type */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Video content would go here */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>Working Memory in the Classroom</CardTitle>
                      <CardDescription>Practical strategies for teachers</CardDescription>
                    </div>
                    <Badge variant="outline">8 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">EP</span>
                    </div>
                    <span className="text-sm">Dr. Sarah Johnson</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>De-escalation Techniques</CardTitle>
                      <CardDescription>Managing challenging behavior</CardDescription>
                    </div>
                    <Badge variant="outline">10 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-green-700">MB</span>
                    </div>
                    <span className="text-sm">Mark Bennett</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">Video</Badge>
                      <CardTitle>Dyslexia: Signs and Support</CardTitle>
                      <CardDescription>Quick guide for educators</CardDescription>
                    </div>
                    <Badge variant="outline">7 min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-700">LT</span>
                    </div>
                    <span className="text-sm">Dr. Lisa Taylor</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Other tab content would be similar */}
          <TabsContent value="infographics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Infographics content */}
            </div>
          </TabsContent>
          
          <TabsContent value="podcasts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Podcasts content */}
            </div>
          </TabsContent>
          
          <TabsContent value="quizzes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quizzes content */}
            </div>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Guides content */}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 bg-muted rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create Your Own Micro-Learning Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customize your professional development by selecting micro-learning resources that align with your interests and needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Select Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse our library and save resources to your personal learning path based on your interests and development goals.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Organize Your Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Arrange resources in a logical sequence and set timeframes for completion to create a structured learning journey.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor your progress, earn badges for completion, and add completed resources to your professional development record.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-6">
            <Button size="lg">Create My Learning Path</Button>
          </div>
        </div>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
