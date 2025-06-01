'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import Link from 'next/link';
import Image from 'next/image';

export default function TraumaInformedPractice() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar - Module navigation */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Module Navigation</CardTitle>
                <CardDescription>Trauma-Informed Practice</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Understanding Trauma and Its Impact</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. The Polyvagal Theory</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Trauma-Sensitive Classroom Strategies</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Restorative Approaches for Recovery</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </nav>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
                  <Progress value={25} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">1 of 4 units completed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Trauma-Informed Practice Guide (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Expert Interview: Trauma in Schools
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Research Summary: ACEs in Education
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Understanding Trauma and Its Impact on Learning</CardTitle>
                    <CardDescription>Trauma-Informed Practice - Unit 1</CardDescription>
                  </div>
                  <Badge>30 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/trauma-informed-practice.jpg"
                    alt="Trauma-Informed Practice in Education"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Trauma can significantly impact a child's ability to learn, develop, and form relationships. This unit introduces the concept of trauma, 
                    its prevalence in educational settings, and how it affects brain development, behavior, and learning capacity.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Define trauma and adverse childhood experiences (ACEs)</li>
                        <li>Identify the prevalence of trauma in educational settings</li>
                        <li>Explain how trauma affects brain development and learning</li>
                        <li>Recognize trauma responses in educational contexts</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Adverse Childhood Experiences (ACEs)</li>
                        <li>Developmental trauma</li>
                        <li>Neurobiological impacts</li>
                        <li>Trauma responses (fight, flight, freeze, fawn)</li>
                        <li>Trauma-sensitive approaches</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">What is Trauma?</h3>
                  <p className="mb-4">
                    Trauma refers to experiences that overwhelm an individual's capacity to cope. These experiences can be single incidents (acute trauma) 
                    or ongoing situations (chronic trauma) that cause feelings of helplessness, fear, and vulnerability. In educational contexts, 
                    it's essential to understand that trauma is not just about what happened to a person but also about how their nervous system has been affected.
                  </p>
                  <p className="mb-4">
                    Adverse Childhood Experiences (ACEs) are potentially traumatic events that occur before age 18. These include experiences such as physical abuse, 
                    neglect, household dysfunction, and exposure to violence. Research has shown that ACEs are common across all populations, with approximately 
                    two-thirds of the UK population having at least one ACE and about 12% experiencing four or more ACEs.
                  </p>
                  <p className="mb-4">
                    It's important to note that not all stressful experiences lead to trauma. Factors such as the severity and duration of the event, 
                    the child's age and developmental stage, and the presence of supportive relationships can influence whether an experience becomes traumatic.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Prevalence in Educational Settings</h3>
                  <p className="mb-4">
                    Research indicates that a significant number of children in UK schools have experienced trauma or adverse childhood experiences:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Type of Experience</th>
                          <th scope="col" className="px-6 py-3">Estimated Prevalence</th>
                          <th scope="col" className="px-6 py-3">Educational Implications</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4">Domestic violence exposure</td>
                          <td className="px-6 py-4">1 in 5 children</td>
                          <td className="px-6 py-4">Hypervigilance, difficulty concentrating</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4">Parental mental health issues</td>
                          <td className="px-6 py-4">1 in 8 children</td>
                          <td className="px-6 py-4">Emotional dysregulation, anxiety</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4">Neglect</td>
                          <td className="px-6 py-4">1 in 10 children</td>
                          <td className="px-6 py-4">Attachment difficulties, trust issues</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4">Physical or sexual abuse</td>
                          <td className="px-6 py-4">1 in 20 children</td>
                          <td className="px-6 py-4">Behavioral challenges, dissociation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    Source: Adapted from UK Department for Education statistics and ACEs research
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">How Trauma Affects Brain Development and Learning</h3>
                  <p className="mb-4">
                    Trauma can significantly impact brain development, particularly in areas responsible for learning, behavior regulation, and social interaction:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Neurobiological Effects</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Stress Response System:</span> 
                          <p className="text-sm text-muted-foreground">Trauma can lead to a chronically activated stress response system, keeping children in a state of hyperarousal or hypoarousal.</p>
                        </li>
                        <li>
                          <span className="font-medium">Prefrontal Cortex:</span> 
                          <p className="text-sm text-muted-foreground">Reduced development in areas responsible for executive functions, including attention, planning, and impulse control.</p>
                        </li>
                        <li>
                          <span className="font-medium">Hippocampus:</span> 
                          <p className="text-sm text-muted-foreground">Decreased volume can affect memory formation and contextual learning.</p>
                        </li>
                        <li>
                          <span className="font-medium">Amygdala:</span> 
                          <p className="text-sm text-muted-foreground">Increased reactivity leads to heightened fear responses and emotional reactivity.</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Impact on Learning</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Cognitive Functioning:</span> 
                          <p className="text-sm text-muted-foreground">Difficulties with concentration, memory, and information processing.</p>
                        </li>
                        <li>
                          <span className="font-medium">Language Development:</span> 
                          <p className="text-sm text-muted-foreground">Delays in expressive and receptive language skills.</p>
                        </li>
                        <li>
                          <span className="font-medium">Self-Regulation:</span> 
                          <p className="text-sm text-muted-foreground">Challenges managing emotions and behavior in the classroom.</p>
                        </li>
                        <li>
                          <span className="font-medium">Social Skills:</span> 
                          <p className="text-sm text-muted-foreground">Difficulties forming relationships with peers and teachers.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">The Learning Brain vs. The Survival Brain</h4>
                    <p className="mb-2">
                      When children feel safe, their "learning brain" (prefrontal cortex) is engaged, allowing them to explore, take risks, and process new information. 
                      When they feel threatened, their "survival brain" (limbic system and brainstem) takes over, prioritizing safety over learning.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h5 className="text-sm font-medium">Learning Brain State:</h5>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Calm, alert, and engaged</li>
                          <li>Able to process and retain information</li>
                          <li>Can think critically and creatively</li>
                          <li>Receptive to feedback</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Survival Brain State:</h5>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Hypervigilant or withdrawn</li>
                          <li>Unable to process complex information</li>
                          <li>Reactive rather than reflective</li>
                          <li>Focused on perceived threats</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Recognizing Trauma Responses in Educational Settings</h3>
                  <p className="mb-4">
                    Children who have experienced trauma may exhibit various behaviors in the classroom that are often misinterpreted as defiance, 
                    attention-seeking, or lack of motivation. Understanding these behaviors as trauma responses can help educators respond more effectively:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Fight Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Manifests as aggression, defiance, arguing, or challenging authority.
                      </p>
                      <p className="text-sm italic mt-1">
                        Often misinterpreted as: Behavioral problems, oppositional defiant disorder, or conduct issues.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Flight Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Appears as avoidance, skipping class, running away, or constant movement.
                      </p>
                      <p className="text-sm italic mt-1">
                        Often misinterpreted as: ADHD, lack of interest, or truancy issues.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Freeze Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows up as withdrawal, daydreaming, appearing "spaced out," or inability to respond.
                      </p>
                      <p className="text-sm italic mt-1">
                        Often misinterpreted as: Learning difficulties, lack of motivation, or laziness.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Fawn Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Presents as people-pleasing, excessive compliance, or difficulty expressing needs.
                      </p>
                      <p className="text-sm italic mt-1">
                        Often misinterpreted as: Model student behavior (but masks underlying distress).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Recognizing Trauma in the Classroom</h3>
                  <p className="mb-4">
                    Jamie, a Year 7 student, has recently started displaying concerning behaviors. He has difficulty staying seated, 
                    often appears distracted, and has explosive outbursts when asked to transition between activities. His academic performance has declined, 
                    and he struggles to maintain friendships.
                  </p>
                  <p className="mb-4">
                    Initially, staff considered whether Jamie might have ADHD or behavioral issues. However, a trauma-informed approach revealed that Jamie's 
                    parents had recently separated, and there was ongoing conflict at home. His behaviors were manifestations of his trauma response.
                  </p>
                  <h4 className="font-medium mb-2">Trauma-Informed Response:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Recognized Jamie's behavior as communication of distress rather than defiance</li>
                    <li>Created predictable routines and provided advance notice of transitions</li>
                    <li>Established a "calm corner" where Jamie could self-regulate when feeling overwhelmed</li>
                    <li>Assigned a key adult who checked in with Jamie daily</li>
                    <li>Collaborated with parents to ensure consistent support at home and school</li>
                  </ul>
                  <h4 className="font-medium mb-2">Outcomes:</h4>
                  <p>
                    Over time, Jamie's outbursts decreased, his ability to remain engaged in learning improved, and he began to develop more positive peer relationships. 
                    By addressing the underlying trauma rather than just the behavior, the school was able to support Jamie's emotional and academic needs more effectively.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Principles of Trauma-Informed Practice</h3>
                  <p className="mb-4">
                    Trauma-informed practice in education is guided by several key principles that help create safe, supportive learning environments:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Safety</h4>
                      <p className="text-sm text-muted-foreground">
                        Creating environments where students feel physically and emotionally safe, with predictable routines and clear expectations.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Trustworthiness</h4>
                      <p className="text-sm text-muted-foreground">
                        Building consistent, reliable relationships with clear boundaries and transparent communication.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Choice</h4>
                      <p className="text-sm text-muted-foreground">
                        Providing opportunities for students to make decisions and have control over aspects of their learning experience.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Collaboration</h4>
                      <p className="text-sm text-muted-foreground">
                        Working together with students, families, and colleagues to create supportive environments and interventions.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Empowerment</h4>
                      <p className="text-sm text-muted-foreground">
                        Recognizing and building upon students' strengths and resilience rather than focusing solely on deficits.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Cultural Sensitivity</h4>
                      <p className="text-sm text-muted-foreground">
                        Acknowledging and respecting cultural backgrounds and how they influence trauma experiences and responses.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might you reinterpret challenging behaviors you've observed in students through a trauma-informed lens?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What aspects of your classroom or practice already support trauma-affected students? What could you enhance?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might understanding the neurobiological impacts of trauma change your approach to supporting students?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Save Progress</Button>
                <div className="space-x-2">
                  <Button variant="outline" disabled>Previous Unit</Button>
                  <Button>
                    Next Unit: The Polyvagal Theory
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Check</CardTitle>
                  <CardDescription>Test your understanding of trauma concepts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Quiz</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                  <CardDescription>Share experiences and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Join Discussion</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
