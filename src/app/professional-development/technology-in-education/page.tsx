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

export default function TechnologyInEducation() {
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
                <CardDescription>Technology in Education</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. AI Policy Development for Schools</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Ethical Use of Technology</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Digital Tools for SEND Support</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Data-Informed Decision Making</span>
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
                      AI in Education Guide (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Expert Interview: AI Ethics in Schools
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      DfE Technology Policy Templates
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
                    <CardTitle className="text-2xl">AI Policy Development for Schools</CardTitle>
                    <CardDescription>Technology in Education - Unit 1</CardDescription>
                  </div>
                  <Badge>25 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/ai-policy-schools.jpg"
                    alt="AI Policy Development for Schools"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    As artificial intelligence becomes increasingly integrated into educational settings, schools need clear policies to guide its ethical and effective use. 
                    This unit explores how to develop comprehensive AI policies that balance innovation with safeguarding, privacy, and educational integrity.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understand the current landscape of AI in UK education</li>
                        <li>Identify key considerations for school AI policies</li>
                        <li>Develop a framework for ethical AI implementation</li>
                        <li>Create guidelines for staff, students, and parents</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>AI literacy and digital citizenship</li>
                        <li>Data protection and GDPR compliance</li>
                        <li>Ethical considerations and bias mitigation</li>
                        <li>Accessibility and inclusion</li>
                        <li>Professional development requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Current Landscape of AI in UK Education</h3>
                  <p className="mb-4">
                    Artificial Intelligence is transforming education in the UK through various applications, from personalized learning platforms to administrative tools. 
                    Understanding the current landscape is essential for developing appropriate policies that address both opportunities and challenges.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Common AI Applications in UK Schools</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Adaptive learning platforms that personalize content</li>
                        <li>Automated assessment and feedback systems</li>
                        <li>Administrative tools for timetabling and resource allocation</li>
                        <li>Chatbots for student support and information</li>
                        <li>Content creation and summarization tools</li>
                        <li>Accessibility features for SEND students</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Stakeholders</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Department for Education (DfE)</li>
                        <li>Office for Standards in Education (Ofsted)</li>
                        <li>Information Commissioner's Office (ICO)</li>
                        <li>School leadership teams</li>
                        <li>Teachers and support staff</li>
                        <li>Students and parents/carers</li>
                        <li>EdTech providers and developers</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    The UK government has recognized the importance of AI in education through initiatives such as the National AI Strategy and the EdTech Strategy. 
                    These frameworks emphasize responsible innovation, evidence-based implementation, and the need for schools to develop their own contextual policies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Key Considerations for School AI Policies</h3>
                  <p className="mb-4">
                    Effective AI policies for schools must address several critical areas to ensure that technology enhances learning while protecting students and staff:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Data Protection and Privacy</h4>
                      <p className="text-sm text-muted-foreground">
                        Policies must comply with UK GDPR and the Data Protection Act 2018, addressing data collection, storage, processing, and sharing.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key questions: What student data will AI systems access? How is consent obtained? How long is data retained?
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Equity and Accessibility</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure AI tools are accessible to all students, including those with SEND, and do not perpetuate or amplify existing inequalities.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key questions: How do we ensure AI benefits all students? How do we address digital divides?
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Transparency and Explainability</h4>
                      <p className="text-sm text-muted-foreground">
                        AI systems used in education should be transparent in their operation, with clear explanations of how they make decisions or recommendations.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key questions: Can teachers explain how AI tools work? Do students understand when they're interacting with AI?
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Human Oversight and Accountability</h4>
                      <p className="text-sm text-muted-foreground">
                        Establish clear lines of responsibility for AI implementation and use, ensuring human oversight of automated systems.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key questions: Who is responsible for reviewing AI outputs? How are errors or biases addressed?
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Professional Development</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure staff have appropriate training to use AI tools effectively and ethically, and to help students develop AI literacy.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key questions: What training do staff need? How do we keep up with rapidly evolving technology?
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Developing a Framework for Ethical AI Implementation</h3>
                  <p className="mb-4">
                    A structured framework helps schools implement AI ethically and effectively. The following steps provide a practical approach:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Stage</th>
                          <th scope="col" className="px-6 py-3">Key Actions</th>
                          <th scope="col" className="px-6 py-3">Stakeholders Involved</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">1. Assessment</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Identify educational needs and challenges</li>
                              <li>Evaluate existing technology infrastructure</li>
                              <li>Review current policies and procedures</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Leadership team, IT staff, department heads</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">2. Planning</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Define clear objectives for AI implementation</li>
                              <li>Develop evaluation criteria for AI tools</li>
                              <li>Draft initial policy framework</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Leadership team, teachers, data protection officer</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">3. Consultation</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Engage with staff, students, and parents</li>
                              <li>Seek input from SEND coordinators</li>
                              <li>Consult with legal and data protection experts</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">All stakeholders including parents and students</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">4. Implementation</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Finalize and publish AI policy</li>
                              <li>Provide staff training and resources</li>
                              <li>Implement in phases with pilot testing</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Leadership team, IT staff, teachers</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4 font-medium">5. Monitoring</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Establish ongoing review processes</li>
                              <li>Collect feedback from all users</li>
                              <li>Update policy as technology evolves</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Leadership team, designated AI coordinator</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Developing an AI Policy at Oakridge Academy</h3>
                  <p className="mb-4">
                    Oakridge Academy, a secondary school in the Midlands, recognized the need for a comprehensive AI policy after teachers began using various AI tools 
                    for lesson planning, and students started using AI for assignments without clear guidelines.
                  </p>
                  
                  <h4 className="font-medium mb-2">The Challenge:</h4>
                  <p className="mb-4">
                    The school needed to balance encouraging innovation with ensuring ethical use, maintaining academic integrity, and protecting data privacy.
                  </p>
                  
                  <h4 className="font-medium mb-2">The Approach:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mb-4">
                    <li>Formed a working group with representatives from leadership, teaching staff, IT, students, and parents</li>
                    <li>Conducted a survey to understand current AI use and concerns across the school community</li>
                    <li>Researched best practices and consulted with educational technology experts</li>
                    <li>Developed draft guidelines for different stakeholders (staff, students, parents)</li>
                    <li>Held consultation sessions to gather feedback on the draft policy</li>
                    <li>Finalized and implemented the policy with supporting resources and training</li>
                  </ol>
                  
                  <h4 className="font-medium mb-2">Key Policy Components:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Clear definitions of AI and related technologies</li>
                    <li>Specific guidelines for appropriate use in teaching, learning, and assessment</li>
                    <li>Protocols for data protection and privacy</li>
                    <li>Framework for evaluating new AI tools before adoption</li>
                    <li>Professional development requirements for staff</li>
                    <li>Digital citizenship curriculum for students</li>
                    <li>Regular review and update schedule</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Outcomes:</h4>
                  <p>
                    The policy provided clarity and confidence for all stakeholders. Teachers reported feeling more comfortable integrating AI tools knowing they had clear guidelines, 
                    while students developed better understanding of appropriate AI use. The school established an "AI Innovation Group" to continuously evaluate new technologies 
                    and update the policy as needed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Creating Guidelines for Different Stakeholders</h3>
                  <p className="mb-4">
                    Effective AI policies should include specific guidelines tailored to different stakeholder groups:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">For Teachers</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Appropriate uses of AI for lesson planning and resource creation</li>
                        <li>Guidelines for reviewing AI-generated content</li>
                        <li>Protocols for using AI in assessment and feedback</li>
                        <li>Requirements for transparency with students</li>
                        <li>Professional development expectations</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">For Students</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Clear definitions of acceptable AI use in assignments</li>
                        <li>Requirements for acknowledging AI assistance</li>
                        <li>Guidelines for critical evaluation of AI outputs</li>
                        <li>Digital citizenship and AI literacy expectations</li>
                        <li>Procedures for reporting concerns</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">For Parents/Carers</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Information about AI tools used in school</li>
                        <li>Guidance on supporting appropriate AI use at home</li>
                        <li>Data protection and privacy information</li>
                        <li>Resources for understanding AI in education</li>
                        <li>Channels for questions and concerns</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Policy Template: Key Sections</h3>
                  <p className="mb-4">
                    Below is a framework for a comprehensive school AI policy that can be adapted to your specific context:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Introduction and Purpose</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Define the scope and purpose of the policy, including definitions of AI and related technologies.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Principles and Values</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Outline the ethical principles guiding AI use in your school (e.g., fairness, transparency, human-centered approach).
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Data Protection and Privacy</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Detail compliance with GDPR and data protection legislation, including data minimization, consent procedures, and rights of data subjects.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Acceptable Use Guidelines</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Specific guidelines for different stakeholders (as outlined above) and different contexts (teaching, learning, assessment, administration).
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">5. Tool Evaluation and Procurement</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Criteria and processes for evaluating, selecting, and implementing new AI tools.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">6. Training and Support</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Professional development requirements and resources for staff, students, and parents.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">7. Monitoring and Review</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Procedures for ongoing evaluation, feedback collection, and policy updates.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">8. Roles and Responsibilities</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Clear designation of responsibilities for implementation, oversight, and compliance.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">9. Related Policies</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Links to other relevant policies (e.g., safeguarding, data protection, acceptable use, teaching and learning).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What AI tools are currently being used in your educational setting, and what policies (if any) govern their use?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What are the most significant ethical concerns about AI use in your specific educational context?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might you engage different stakeholders in developing or updating an AI policy for your school?</p>
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
                    Next Unit: Ethical Use of Technology
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
                  <CardDescription>Test your understanding of AI policy development</CardDescription>
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
