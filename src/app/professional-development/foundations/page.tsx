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

export default function FoundationsOfEducationalPsychology() {
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
                <CardDescription>Foundations of Educational Psychology</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Introduction to Educational Psychology</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Child Development and Learning Theories</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. UK Educational Framework</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Evidence-Based Practice</span>
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
                      Module Handbook (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Introduction Video
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Additional Reading
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
                    <CardTitle className="text-2xl">Introduction to Educational Psychology</CardTitle>
                    <CardDescription>Foundations of Educational Psychology - Unit 1</CardDescription>
                  </div>
                  <Badge>25 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/educational-psychology-intro.jpg"
                    alt="Educational Psychology Introduction"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Educational psychology is the scientific study of how people learn and how teachers can foster learning. 
                    This unit introduces the fundamental principles of educational psychology and their application in UK educational settings.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Define educational psychology and its scope</li>
                        <li>Identify key historical developments in the field</li>
                        <li>Explain the role of educational psychologists in UK schools</li>
                        <li>Apply basic psychological principles to learning scenarios</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Cognitive development</li>
                        <li>Learning theories</li>
                        <li>Individual differences</li>
                        <li>Assessment and intervention</li>
                        <li>Evidence-based practice</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">What is Educational Psychology?</h3>
                  <p className="mb-4">
                    Educational psychology is a discipline that studies how humans learn in educational settings, the effectiveness of educational interventions, 
                    the psychology of teaching, and the social psychology of schools as organizations. It's concerned with how students learn and develop, 
                    often focusing on subgroups such as gifted children and those with specific disabilities.
                  </p>
                  <p className="mb-4">
                    Educational psychologists work to understand how different factors influence learning and to develop strategies that support effective teaching and learning. 
                    They apply theories of human development to understand individual learning and inform educational practice.
                  </p>
                  <p className="mb-4">
                    In the UK context, educational psychologists play a crucial role in supporting schools, teachers, parents, and children. 
                    They are involved in assessment, intervention planning, consultation, research, and training to promote positive educational outcomes for all learners.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Historical Development</h3>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Period</th>
                          <th scope="col" className="px-6 py-3">Key Developments</th>
                          <th scope="col" className="px-6 py-3">Influential Figures</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4">Late 19th Century</td>
                          <td className="px-6 py-4">Emergence of scientific approach to education</td>
                          <td className="px-6 py-4">Wilhelm Wundt, William James</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4">Early 20th Century</td>
                          <td className="px-6 py-4">Development of intelligence testing</td>
                          <td className="px-6 py-4">Alfred Binet, Cyril Burt</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4">Mid 20th Century</td>
                          <td className="px-6 py-4">Behaviorist and cognitive approaches</td>
                          <td className="px-6 py-4">B.F. Skinner, Jean Piaget</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4">Late 20th Century to Present</td>
                          <td className="px-6 py-4">Inclusive education, neuroscience integration</td>
                          <td className="px-6 py-4">Lev Vygotsky, Howard Gardner</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Role of Educational Psychologists in UK Schools</h3>
                  <p className="mb-4">
                    Educational psychologists in the UK work within local authorities, schools, and private practice to support the educational, 
                    social, and emotional development of children and young people. Their work is guided by the SEND Code of Practice and other relevant legislation.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Conducting psychological assessments</li>
                        <li>Contributing to Education, Health and Care Plans (EHCPs)</li>
                        <li>Consulting with teachers and parents</li>
                        <li>Designing and evaluating interventions</li>
                        <li>Providing training and professional development</li>
                        <li>Research and service development</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Working Context</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Local Authority Educational Psychology Services</li>
                        <li>Multi-Academy Trusts</li>
                        <li>Independent schools</li>
                        <li>Private practice</li>
                        <li>Research institutions</li>
                        <li>Specialist settings (e.g., PRUs, special schools)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Applying Psychological Principles to Learning</h3>
                  <p className="mb-4">
                    Educational psychology provides a framework for understanding how students learn and how to create effective learning environments. 
                    Below are some key psychological principles and their applications in educational settings:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Cognitive Load Theory</h4>
                      <p className="text-sm text-muted-foreground">
                        Recognizes the limitations of working memory and suggests instructional techniques that avoid cognitive overload.
                      </p>
                      <p className="text-sm italic mt-1">
                        Application: Breaking complex tasks into manageable steps, using visual aids, and providing worked examples.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Growth Mindset</h4>
                      <p className="text-sm text-muted-foreground">
                        The belief that abilities can be developed through dedication and hard work.
                      </p>
                      <p className="text-sm italic mt-1">
                        Application: Praising effort rather than intelligence, teaching about neuroplasticity, and reframing challenges as opportunities.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Scaffolding</h4>
                      <p className="text-sm text-muted-foreground">
                        Providing temporary support that helps students bridge the gap between their current abilities and the intended learning goal.
                      </p>
                      <p className="text-sm italic mt-1">
                        Application: Using prompts, cues, partial solutions, and gradually removing support as competence increases.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Spaced Practice</h4>
                      <p className="text-sm text-muted-foreground">
                        Distributing learning over time rather than concentrating it in a single session.
                      </p>
                      <p className="text-sm italic mt-1">
                        Application: Revisiting content at increasing intervals, using cumulative review, and interleaving different topics.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Supporting a Child with Learning Difficulties</h3>
                  <p className="mb-4">
                    Sarah is a Year 4 student who has been struggling with reading and writing. Her teacher has noticed that she often reverses letters, 
                    has difficulty following written instructions, and becomes frustrated during literacy activities.
                  </p>
                  <p className="mb-4">
                    The school's SENCo requested involvement from an educational psychologist to better understand Sarah's learning needs and develop appropriate support strategies.
                  </p>
                  <h4 className="font-medium mb-2">Educational Psychologist's Approach:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mb-4">
                    <li>Conducted classroom observations to see how Sarah engages with different learning activities</li>
                    <li>Administered cognitive and literacy assessments to identify specific areas of strength and difficulty</li>
                    <li>Consulted with Sarah's parents to gather developmental history and understand home learning environment</li>
                    <li>Collaborated with the teacher and SENCo to develop a tailored intervention plan</li>
                  </ol>
                  <h4 className="font-medium mb-2">Outcomes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Identified specific learning difficulties consistent with dyslexia</li>
                    <li>Recommended evidence-based literacy interventions and classroom accommodations</li>
                    <li>Provided strategies for building Sarah's confidence and self-efficacy</li>
                    <li>Suggested assistive technology to support reading and writing</li>
                    <li>Arranged follow-up consultation to monitor progress and adjust support as needed</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might understanding educational psychology principles improve your teaching practice?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Describe a situation where you've observed a psychological principle being applied in an educational setting.</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What role do you think educational psychologists should play in supporting inclusive education?</p>
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
                    Next Unit: Child Development and Learning Theories
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
                  <CardDescription>Test your understanding of key concepts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Quiz</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                  <CardDescription>Engage with peers and instructors</CardDescription>
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
