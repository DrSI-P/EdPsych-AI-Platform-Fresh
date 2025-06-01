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

export default function LeadershipInEducationalPsychology() {
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
                <CardDescription>Leadership in Educational Psychology</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Whole-School Approaches to Wellbeing</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Leading SEND Provision</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Building Trauma-Informed Schools</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Change Management in Educational Settings</span>
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
                      Whole-School Wellbeing Framework (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video: Leading Wellbeing Initiatives
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      DfE Mental Health and Wellbeing Guidance
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
                    <CardTitle className="text-2xl">Whole-School Approaches to Wellbeing</CardTitle>
                    <CardDescription>Leadership in Educational Psychology - Unit 1</CardDescription>
                  </div>
                  <Badge>30 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/whole-school-wellbeing.jpg"
                    alt="School wellbeing initiative in action"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Whole-school approaches to wellbeing recognize that mental health and emotional wellbeing are fundamental to effective learning and 
                    positive development. This unit explores how educational leaders can develop, implement, and sustain comprehensive wellbeing frameworks 
                    that support all members of the school community.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understand the evidence base for whole-school wellbeing approaches</li>
                        <li>Identify key components of effective wellbeing frameworks</li>
                        <li>Develop strategies for implementing wellbeing initiatives</li>
                        <li>Learn methods for evaluating impact and sustainability</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Universal, targeted, and specialist support</li>
                        <li>Staff wellbeing and capacity building</li>
                        <li>Systemic approaches to mental health</li>
                        <li>Preventative and responsive strategies</li>
                        <li>Wellbeing leadership and governance</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Case for Whole-School Wellbeing</h3>
                  <p className="mb-4">
                    Research consistently demonstrates that wellbeing and learning are inextricably linked. Schools that prioritize wellbeing 
                    see improvements not only in mental health outcomes but also in academic achievement, attendance, behavior, and staff retention.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Statistics</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <p className="text-sm text-muted-foreground">1 in 6 children and young people in the UK have a probable mental health disorder (NHS Digital, 2021)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Schools with effective wellbeing programs see an average 11% improvement in academic achievement (Public Health England)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Teacher wellbeing is strongly correlated with pupil wellbeing and attainment (Education Support Partnership)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Every £1 invested in school-based mental health interventions yields an estimated £5.08 in benefits (Pro Bono Economics)</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Benefits of Whole-School Approaches</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Consistency and coherence:</span> 
                          <p className="text-sm text-muted-foreground">Integrated approach rather than fragmented initiatives</p>
                        </li>
                        <li>
                          <span className="font-medium">Universal reach:</span> 
                          <p className="text-sm text-muted-foreground">Benefits all members of the school community</p>
                        </li>
                        <li>
                          <span className="font-medium">Preventative focus:</span> 
                          <p className="text-sm text-muted-foreground">Addresses issues before they escalate</p>
                        </li>
                        <li>
                          <span className="font-medium">Sustainable impact:</span> 
                          <p className="text-sm text-muted-foreground">Embeds wellbeing in school culture and systems</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    The UK government has recognized the importance of wellbeing in education through initiatives such as the Wellbeing for Education Return program 
                    and the requirement for schools to teach about mental wellbeing as part of the statutory Relationships, Sex and Health Education curriculum.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Components of Effective Wellbeing Frameworks</h3>
                  <p className="mb-4">
                    Comprehensive wellbeing frameworks typically include the following interconnected components:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">1. Leadership and Governance</h4>
                      <p className="text-sm text-muted-foreground">
                        Clear leadership structures with wellbeing embedded in strategic planning, policies, and governance.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Designated wellbeing lead, governor responsibility, wellbeing included in school development plan
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">2. Ethos and Environment</h4>
                      <p className="text-sm text-muted-foreground">
                        A positive, inclusive school culture that promotes belonging, respect, and emotional safety.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Anti-bullying initiatives, restorative approaches, physical environment design, celebration of diversity
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">3. Curriculum, Teaching and Learning</h4>
                      <p className="text-sm text-muted-foreground">
                        Explicit teaching of social-emotional skills and wellbeing concepts, integrated throughout the curriculum.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: PSHE/RSE curriculum, embedded wellbeing across subjects, teaching approaches that support wellbeing
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">4. Student Voice and Participation</h4>
                      <p className="text-sm text-muted-foreground">
                        Meaningful involvement of pupils in wellbeing initiatives, giving them agency and ownership.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Wellbeing ambassadors, pupil surveys, co-production of initiatives, feedback mechanisms
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">5. Staff Development and Wellbeing</h4>
                      <p className="text-sm text-muted-foreground">
                        Support for staff mental health and training to develop skills in promoting pupil wellbeing.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Workload management, professional development, supervision, staff wellbeing committee
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">6. Identifying Needs and Monitoring Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Systems to identify wellbeing concerns early and evaluate the effectiveness of interventions.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Wellbeing assessment tools, data tracking, regular review cycles, impact measurement
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">7. Working with Parents and Community</h4>
                      <p className="text-sm text-muted-foreground">
                        Partnerships with families and external agencies to provide consistent support.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Parent education, communication strategies, community partnerships, referral pathways
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">8. Targeted Support and Appropriate Referrals</h4>
                      <p className="text-sm text-muted-foreground">
                        Clear pathways for additional support when universal approaches are insufficient.
                      </p>
                      <p className="text-sm italic mt-1">
                        Key elements: Graduated response, evidence-based interventions, effective referral systems, multi-agency working
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Implementation Strategies</h3>
                  <p className="mb-4">
                    Successful implementation of whole-school wellbeing approaches requires careful planning and a staged approach:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Stage</th>
                          <th scope="col" className="px-6 py-3">Key Actions</th>
                          <th scope="col" className="px-6 py-3">Leadership Considerations</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">1. Exploration</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Assess current wellbeing provision</li>
                              <li>Identify needs and priorities</li>
                              <li>Research evidence-based approaches</li>
                              <li>Consult with stakeholders</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Create a compelling vision</li>
                              <li>Secure leadership commitment</li>
                              <li>Allocate resources</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">2. Preparation</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Develop a strategic plan</li>
                              <li>Form a wellbeing team</li>
                              <li>Create policies and procedures</li>
                              <li>Establish baseline measures</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Build staff capacity</li>
                              <li>Address potential barriers</li>
                              <li>Develop communication strategy</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">3. Implementation</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Roll out initiatives in phases</li>
                              <li>Provide training and support</li>
                              <li>Monitor early implementation</li>
                              <li>Celebrate early successes</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Model wellbeing practices</li>
                              <li>Maintain momentum</li>
                              <li>Address implementation challenges</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">4. Evaluation</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Gather data on impact</li>
                              <li>Review implementation fidelity</li>
                              <li>Collect stakeholder feedback</li>
                              <li>Identify areas for improvement</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Use data to inform decisions</li>
                              <li>Share outcomes with stakeholders</li>
                              <li>Recognize and reward progress</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4 font-medium">5. Sustainability</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Embed practices in school systems</li>
                              <li>Plan for staff turnover</li>
                              <li>Secure ongoing resources</li>
                              <li>Refresh and renew approaches</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Develop distributed leadership</li>
                              <li>Build external partnerships</li>
                              <li>Plan for continuous improvement</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Transforming Wellbeing at Hillside Academy</h3>
                  <p className="mb-4">
                    Hillside Academy, a secondary school in an area of high socioeconomic deprivation, identified wellbeing as a strategic priority 
                    after noticing increasing mental health concerns, behavior incidents, and staff absences.
                  </p>
                  
                  <h4 className="font-medium mb-2">Initial Approach:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mb-4">
                    <li>Formed a wellbeing steering group with representatives from leadership, teaching staff, support staff, pupils, and parents</li>
                    <li>Conducted a comprehensive wellbeing audit using surveys, focus groups, and existing data</li>
                    <li>Developed a three-year wellbeing strategy with clear goals, actions, and success criteria</li>
                    <li>Appointed a senior leader as Wellbeing Lead with dedicated time for the role</li>
                    <li>Secured governor commitment and regular reporting on wellbeing metrics</li>
                  </ol>
                  
                  <h4 className="font-medium mb-2">Key Initiatives:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Implemented a whole-school approach to emotional literacy using the RULER program</li>
                    <li>Redesigned the school day to include daily tutor time focused on wellbeing</li>
                    <li>Established a staff wellbeing committee with budget for initiatives</li>
                    <li>Trained all staff in mental health first aid and trauma-informed approaches</li>
                    <li>Created a graduated response model for wellbeing concerns with clear pathways</li>
                    <li>Developed a parent education program on adolescent mental health</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Outcomes (after two years):</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>20% reduction in behavior incidents</li>
                    <li>15% improvement in pupil wellbeing measures</li>
                    <li>30% reduction in staff absence due to stress</li>
                    <li>Improved Ofsted rating for personal development</li>
                    <li>Increased parental engagement and positive feedback</li>
                    <li>More effective identification and support for pupils with mental health needs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overcoming Common Challenges</h3>
                  <p className="mb-4">
                    Leaders often face several challenges when implementing whole-school wellbeing approaches:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Challenge: Competing Priorities</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Schools face pressure to prioritize academic outcomes, which can sideline wellbeing initiatives.
                      </p>
                      <h5 className="text-sm font-medium">Leadership Strategies:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Frame wellbeing as enabling academic success, not competing with it</li>
                        <li>Use data to demonstrate links between wellbeing and achievement</li>
                        <li>Integrate wellbeing into existing priorities rather than adding it as an extra</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Challenge: Resource Constraints</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Limited time, funding, and staff capacity can hinder implementation.
                      </p>
                      <h5 className="text-sm font-medium">Leadership Strategies:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Start with low-cost, high-impact initiatives</li>
                        <li>Repurpose existing resources rather than creating new ones</li>
                        <li>Seek external funding and partnerships</li>
                        <li>Build capacity through a train-the-trainer approach</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Challenge: Staff Resistance</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Some staff may view wellbeing as "another initiative" or outside their role.
                      </p>
                      <h5 className="text-sm font-medium">Leadership Strategies:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Start with staff wellbeing to build buy-in</li>
                        <li>Provide compelling evidence and examples</li>
                        <li>Involve staff in planning and decision-making</li>
                        <li>Recognize and celebrate staff contributions</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Challenge: Measuring Impact</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Wellbeing outcomes can be difficult to measure and attribute to specific initiatives.
                      </p>
                      <h5 className="text-sm font-medium">Leadership Strategies:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Use validated wellbeing assessment tools</li>
                        <li>Collect both quantitative and qualitative data</li>
                        <li>Establish clear baseline measures before implementation</li>
                        <li>Look for "proxy indicators" like attendance and behavior</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tools for Wellbeing Leadership</h3>
                  <p className="mb-4">
                    The following tools can support leaders in developing whole-school wellbeing approaches:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Wellbeing Audit Tool</h4>
                      <p className="text-sm text-muted-foreground pl-4 mb-2">
                        A structured framework for assessing current wellbeing provision across all components of a whole-school approach.
                      </p>
                      <div className="border rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-2">Sample Audit Questions:</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>To what extent is wellbeing explicitly mentioned in the school's vision and values?</li>
                          <li>How effectively do school policies promote wellbeing (e.g., behavior, anti-bullying)?</li>
                          <li>What systems are in place to identify pupils who may need additional wellbeing support?</li>
                          <li>How is staff wellbeing supported and monitored?</li>
                          <li>What opportunities do pupils have to learn about mental health and wellbeing?</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Wellbeing Action Planning Template</h4>
                      <p className="text-sm text-muted-foreground pl-4 mb-2">
                        A structured format for developing a comprehensive wellbeing strategy.
                      </p>
                      <div className="border rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-2">Key Components:</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Vision statement for wellbeing</li>
                          <li>SMART goals for each component of the whole-school approach</li>
                          <li>Specific actions with timelines and responsible persons</li>
                          <li>Resource requirements and allocation</li>
                          <li>Success criteria and evaluation methods</li>
                          <li>Communication and stakeholder engagement plan</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Wellbeing Impact Measurement Framework</h4>
                      <p className="text-sm text-muted-foreground pl-4 mb-2">
                        A structured approach to evaluating the impact of wellbeing initiatives.
                      </p>
                      <div className="border rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-2">Measurement Domains:</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Pupil wellbeing (using validated measures like WEMWBS or SDQ)</li>
                          <li>Staff wellbeing and job satisfaction</li>
                          <li>School climate and relationships</li>
                          <li>Behavior and attendance data</li>
                          <li>Academic engagement and achievement</li>
                          <li>Stakeholder perceptions and feedback</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How would you assess the current state of wellbeing provision in your setting, and what are the key areas for development?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What leadership strategies would be most effective in building staff commitment to a whole-school wellbeing approach in your context?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might you measure the impact of wellbeing initiatives in your setting, and what would success look like?</p>
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
                    Next Unit: Leading SEND Provision
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
                  <CardDescription>Test your understanding of whole-school wellbeing</CardDescription>
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
