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

export default function TeachingAssistantDevelopment() {
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
                <CardDescription>Teaching Assistant Development</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Effective Deployment of TAs</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Supporting Learners with Complex Needs</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Collaborative Working with Teachers</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Implementing Interventions with Fidelity</span>
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
                      TA Best Practice Guide (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video: Effective TA-Teacher Partnerships
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      EEF Making Best Use of TAs Report
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
                    <CardTitle className="text-2xl">Effective Deployment of Teaching Assistants</CardTitle>
                    <CardDescription>Teaching Assistant Development - Unit 1</CardDescription>
                  </div>
                  <Badge>25 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/teaching-assistant-deployment.jpg"
                    alt="Teaching Assistant working with students"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Teaching Assistants (TAs) are a valuable resource in UK schools, but research shows their impact depends significantly on how they are deployed. 
                    This unit explores evidence-based approaches to TA deployment that maximize their effectiveness and support positive outcomes for all learners.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understand the evidence base for effective TA deployment</li>
                        <li>Identify key principles for maximizing TA impact</li>
                        <li>Develop strategies for role clarity and purposeful deployment</li>
                        <li>Plan for effective TA-teacher collaboration</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Complementary roles vs. replacement teaching</li>
                        <li>Targeted academic intervention</li>
                        <li>Scaffolding for independence</li>
                        <li>Preparation and feedback time</li>
                        <li>Whole-school deployment strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Evidence Base: What Works?</h3>
                  <p className="mb-4">
                    Research on TA effectiveness, particularly the Education Endowment Foundation's (EEF) "Making Best Use of Teaching Assistants" report, 
                    provides clear guidance on deployment practices that lead to positive outcomes for pupils:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">What Works</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Targeted interventions:</span> 
                          <p className="text-sm text-muted-foreground">TAs delivering structured, evidence-based interventions to individuals or small groups show consistent positive effects.</p>
                        </li>
                        <li>
                          <span className="font-medium">Preparation and feedback time:</span> 
                          <p className="text-sm text-muted-foreground">Allocated time for teachers and TAs to communicate about lessons, learning objectives, and pupil progress.</p>
                        </li>
                        <li>
                          <span className="font-medium">Clear roles and expectations:</span> 
                          <p className="text-sm text-muted-foreground">Well-defined responsibilities that complement rather than replace teacher instruction.</p>
                        </li>
                        <li>
                          <span className="font-medium">Scaffolding for independence:</span> 
                          <p className="text-sm text-muted-foreground">Supporting pupils to develop independent learning skills rather than completing tasks for them.</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">What Doesn't Work</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Velcro model:</span> 
                          <p className="text-sm text-muted-foreground">TAs assigned to specific pupils for extended periods, potentially creating dependency and separation from peers and teacher.</p>
                        </li>
                        <li>
                          <span className="font-medium">Informal deployment:</span> 
                          <p className="text-sm text-muted-foreground">TAs given vague instructions to "support the class" without specific guidance on roles or interventions.</p>
                        </li>
                        <li>
                          <span className="font-medium">Replacement teaching:</span> 
                          <p className="text-sm text-muted-foreground">TAs working with lower-attaining pupils while teachers focus on higher-attaining groups, reducing access to qualified teaching.</p>
                        </li>
                        <li>
                          <span className="font-medium">Task completion focus:</span> 
                          <p className="text-sm text-muted-foreground">Prioritizing task completion over developing understanding and independent learning skills.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Key Principles for Effective TA Deployment</h3>
                  <p className="mb-4">
                    Based on research evidence, the following principles should guide TA deployment in schools:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">1. TAs should supplement, not replace, teacher instruction</h4>
                      <p className="text-sm text-muted-foreground">
                        The most qualified staff should work with those who need the most support. TAs should add value to what teachers do, not substitute for them.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Ensure all pupils receive regular time with the teacher, using rotation systems rather than fixed groupings.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">2. Use TAs to deliver high-quality structured interventions</h4>
                      <p className="text-sm text-muted-foreground">
                        TAs can have significant positive impact when delivering structured interventions with appropriate training and support.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Select evidence-based interventions, provide thorough training, and ensure fidelity to the intervention design.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">3. Ensure TAs are prepared for their role</h4>
                      <p className="text-sm text-muted-foreground">
                        TAs need time to prepare for lessons and interventions, and to receive feedback on their work.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Schedule regular meeting time between teachers and TAs, share lesson plans in advance, and provide clear guidance on learning objectives.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">4. Use TAs to help pupils develop independent learning skills</h4>
                      <p className="text-sm text-muted-foreground">
                        TAs should help pupils develop metacognitive strategies and self-scaffolding techniques rather than completing tasks for them.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Train TAs in questioning techniques, scaffolding strategies, and the gradual release of responsibility model.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Models of TA Deployment</h3>
                  <p className="mb-4">
                    Schools can consider various models for deploying TAs effectively:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Deployment Model</th>
                          <th scope="col" className="px-6 py-3">Description</th>
                          <th scope="col" className="px-6 py-3">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Intervention delivery</td>
                          <td className="px-6 py-4">
                            TAs deliver structured, evidence-based interventions to individuals or small groups outside the classroom.
                          </td>
                          <td className="px-6 py-4">Targeted academic or social-emotional support for identified pupils</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">In-class targeted support</td>
                          <td className="px-6 py-4">
                            TAs work with specific pupils or groups within the classroom, focusing on particular learning objectives.
                          </td>
                          <td className="px-6 py-4">Supporting access to whole-class teaching while providing additional scaffolding</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Floating support</td>
                          <td className="px-6 py-4">
                            TAs move around the classroom, supporting different pupils as needed based on in-the-moment assessment.
                          </td>
                          <td className="px-6 py-4">Responsive support in mixed-ability classrooms</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4 font-medium">Pre-teaching and reinforcement</td>
                          <td className="px-6 py-4">
                            TAs work with pupils before or after main class teaching to prepare them for new content or reinforce learning.
                          </td>
                          <td className="px-6 py-4">Building confidence and background knowledge for pupils who might struggle with new concepts</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Transforming TA Deployment at Riverside Primary</h3>
                  <p className="mb-4">
                    Riverside Primary School reviewed their TA deployment after recognizing that their current approach wasn't having the desired impact on pupil outcomes, 
                    particularly for those with SEND.
                  </p>
                  
                  <h4 className="font-medium mb-2">Initial Situation:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>TAs were assigned to individual pupils with EHCPs and rarely worked with other children</li>
                    <li>TAs had no allocated time to meet with teachers before lessons</li>
                    <li>Many TAs worked with lower-attaining groups while teachers focused on higher-attaining pupils</li>
                    <li>TAs often completed tasks for pupils to ensure work was finished</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Change Process:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mb-4">
                    <li>Leadership team conducted an audit of current TA deployment using the EEF's self-assessment guide</li>
                    <li>Restructured timetables to create 20 minutes of daily teacher-TA liaison time before school</li>
                    <li>Provided training on scaffolding for independence and effective questioning techniques</li>
                    <li>Implemented a rotation system ensuring all pupils had regular time with the teacher</li>
                    <li>Trained selected TAs to deliver structured interventions with fidelity</li>
                  </ol>
                  
                  <h4 className="font-medium mb-2">Outcomes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improved progress for pupils with SEND, who benefited from both teacher instruction and targeted interventions</li>
                    <li>Increased independence among previously TA-dependent pupils</li>
                    <li>Higher job satisfaction among TAs, who reported feeling more valued and effective</li>
                    <li>More consistent approach to supporting pupils across the school</li>
                    <li>Better use of teacher expertise for all pupil groups</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Implementing a Whole-School Approach</h3>
                  <p className="mb-4">
                    Effective TA deployment requires a coordinated, whole-school approach:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Leadership Actions</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Conduct an audit of current TA deployment</li>
                        <li>Review and revise TA job descriptions</li>
                        <li>Create timetables that include preparation time</li>
                        <li>Develop a school policy on TA deployment</li>
                        <li>Provide professional development opportunities</li>
                        <li>Monitor implementation and impact</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Teacher Actions</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Share lesson plans and objectives in advance</li>
                        <li>Provide clear guidance on expected TA role</li>
                        <li>Ensure rotation of TA support across pupil groups</li>
                        <li>Give regular feedback to TAs</li>
                        <li>Model effective teaching strategies</li>
                        <li>Collaborate on intervention planning and review</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 mt-4">
                    <h4 className="font-medium mb-2">TA Deployment Review Tool</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use this simple tool to review current practice in your setting:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="check1" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check1" className="ml-2 text-sm">TAs are not routinely assigned to work with the lowest-attaining pupils only</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check2" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check2" className="ml-2 text-sm">Teachers and TAs have regular scheduled time to communicate about lessons and pupils</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check3" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check3" className="ml-2 text-sm">TAs are trained in specific evidence-based interventions they deliver</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check4" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check4" className="ml-2 text-sm">TAs use strategies that promote independent learning rather than task completion</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check5" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check5" className="ml-2 text-sm">All pupils receive regular time working directly with the teacher</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check6" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="check6" className="ml-2 text-sm">The impact of TA interventions is systematically monitored and evaluated</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Practical Strategies for Implementation</h3>
                  <p className="mb-4">
                    Consider these practical approaches to improve TA deployment in your setting:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Creating Time for Communication</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Adjust start/end times to create meeting windows</li>
                        <li>Use assembly times for quick check-ins</li>
                        <li>Create communication books or digital logs</li>
                        <li>Schedule regular (e.g., fortnightly) longer planning meetings</li>
                        <li>Use standardized lesson plan templates with clear TA guidance sections</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Developing Independence</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Train TAs in scaffolding techniques (e.g., prompting hierarchy)</li>
                        <li>Implement a "help desk" model where pupils seek support when needed</li>
                        <li>Use visual cues for levels of independence expected during activities</li>
                        <li>Establish clear routines for gradually reducing support</li>
                        <li>Teach TAs to use wait time effectively before intervening</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Intervention Delivery</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Select evidence-based interventions matched to pupil needs</li>
                        <li>Provide comprehensive training, not just an introduction</li>
                        <li>Create quiet, appropriate spaces for intervention delivery</li>
                        <li>Establish clear entry and exit criteria for interventions</li>
                        <li>Implement regular progress monitoring and adjust as needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How are TAs currently deployed in your setting, and how does this align with the evidence-based principles discussed?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What are the main barriers to effective TA-teacher communication in your context, and how might these be addressed?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What one change to TA deployment could you implement that would have the most significant positive impact?</p>
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
                    Next Unit: Supporting Learners with Complex Needs
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
                  <CardDescription>Test your understanding of TA deployment</CardDescription>
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
