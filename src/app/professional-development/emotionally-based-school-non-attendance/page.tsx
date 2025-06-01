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

export default function EmotionallyBasedSchoolNonAttendance() {
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
                <CardDescription>Emotionally Based School Non-Attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Understanding EBSNA</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Theoretical Frameworks</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Assessment and Identification</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Intervention Strategies</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>5. Case Studies and Resources</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </nav>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
                  <Progress value={20} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">1 of 5 units completed</p>
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
                      EBSNA Assessment Toolkit (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video: Understanding School Anxiety
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Reintegration Plan Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Parent Communication Guide
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
                    <CardTitle className="text-2xl">Understanding Emotionally Based School Non-Attendance</CardTitle>
                    <CardDescription>Unit 1: Foundations and Context</CardDescription>
                  </div>
                  <Badge>30 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/ebsna-overview.jpg"
                    alt="Child experiencing school anxiety"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Introduction to EBSNA</h3>
                  <p className="text-muted-foreground mb-4">
                    Emotionally Based School Non-Attendance (EBSNA) represents a significant challenge for children, families, schools, 
                    and support services across the UK. Unlike truancy, EBSNA is characterized by emotional distress that prevents a child 
                    from attending school, despite the desire or intention to attend. This module explores the complexities of EBSNA, 
                    its underlying causes, and evidence-based approaches to support affected children and young people.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understand the definition and prevalence of EBSNA</li>
                        <li>Differentiate between EBSNA and other forms of non-attendance</li>
                        <li>Identify key theoretical frameworks for understanding EBSNA</li>
                        <li>Recognize risk factors and early warning signs</li>
                        <li>Develop skills in assessment and intervention planning</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Emotional distress and school avoidance</li>
                        <li>Affect regulation and the role of shame</li>
                        <li>Attachment and separation anxiety</li>
                        <li>School-based factors and environmental triggers</li>
                        <li>Collaborative multi-agency approaches</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Defining EBSNA</h3>
                  <p className="mb-4">
                    Emotionally Based School Non-Attendance (EBSNA) refers to a pattern of school absence characterized by significant 
                    emotional distress when faced with attending school. This distress may manifest as anxiety, fear, depression, or 
                    other emotional difficulties that make school attendance extremely challenging for the child or young person.
                  </p>
                  
                  <div className="border-l-4 border-primary pl-4 py-2 my-4">
                    <p className="italic">
                      "EBSNA can be defined as a difficulty in attending school due to emotional factors, often manifesting as anxiety or fear, 
                      which can result in significant school absence with a substantial emotional component that prevents the child from 
                      attending school despite the efforts of parents and school staff."
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      — West Sussex Educational Psychology Service (2018)
                    </p>
                  </div>
                  
                  <p className="mb-4">
                    It is important to distinguish EBSNA from other forms of non-attendance:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Type of Non-Attendance</th>
                          <th scope="col" className="px-6 py-3">Key Characteristics</th>
                          <th scope="col" className="px-6 py-3">Emotional Component</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Emotionally Based School Non-Attendance (EBSNA)</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Significant emotional distress</li>
                              <li>Desire to attend but unable</li>
                              <li>Parents aware and attempting to support</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">High - Primary driver of absence</td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">Truancy</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Deliberate avoidance of school</li>
                              <li>Often concealed from parents</li>
                              <li>Preference for activities outside school</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Low - Not primarily emotion-driven</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">School Refusal</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Broader term that includes EBSNA</li>
                              <li>May include behavioral components</li>
                              <li>Can involve active resistance</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Variable - Often present but not always primary</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4 font-medium">School Withdrawal</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Parent-condoned absence</li>
                              <li>Child kept home for various reasons</li>
                              <li>May involve caring responsibilities</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">Variable - May be present but not child-driven</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Prevalence and Impact</h3>
                  <p className="mb-4">
                    EBSNA is a significant issue within UK schools, though precise prevalence can be difficult to determine due to 
                    inconsistent identification and recording practices. Research suggests:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Prevalence Statistics</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <p className="text-sm text-muted-foreground">Estimated that between 1-5% of the school population may experience EBSNA at some point (Pellegrini, 2007)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Peaks in incidence occur during transition periods: ages 5-7 and 11-14 (Heyne et al., 2019)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Increased prevalence following the COVID-19 pandemic, with estimates suggesting up to 100,000 children in England are severely absent from school (Department for Education, 2022)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">No significant gender differences in overall prevalence, though presentation may differ (Ingul et al., 2019)</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Impact on Children and Young People</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Educational:</span> 
                          <p className="text-sm text-muted-foreground">Learning gaps, reduced academic achievement, disrupted educational progression</p>
                        </li>
                        <li>
                          <span className="font-medium">Social:</span> 
                          <p className="text-sm text-muted-foreground">Isolation from peers, reduced social skills development, limited friendship networks</p>
                        </li>
                        <li>
                          <span className="font-medium">Emotional:</span> 
                          <p className="text-sm text-muted-foreground">Increased anxiety, depression, low self-esteem, reduced emotional resilience</p>
                        </li>
                        <li>
                          <span className="font-medium">Long-term:</span> 
                          <p className="text-sm text-muted-foreground">Higher risk of mental health difficulties in adulthood, reduced employment prospects, economic disadvantage</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    The impact extends beyond the individual child to affect families, schools, and wider systems:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Impact on Families</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Increased stress and family conflict</li>
                        <li>Financial implications (e.g., reduced work hours)</li>
                        <li>Parental anxiety and guilt</li>
                        <li>Strain on parent-child relationships</li>
                        <li>Potential for legal consequences</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Impact on Schools</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Resource implications for support</li>
                        <li>Attendance statistics and Ofsted implications</li>
                        <li>Staff stress and potential burnout</li>
                        <li>Challenges in meeting educational needs</li>
                        <li>Balancing needs of individual vs. group</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Impact on Services</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Increased demand for CAMHS support</li>
                        <li>Pressure on educational psychology services</li>
                        <li>Social care involvement in complex cases</li>
                        <li>Coordination challenges across agencies</li>
                        <li>Resource allocation difficulties</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Risk Factors and Early Warning Signs</h3>
                  <p className="mb-4">
                    EBSNA typically develops as a result of multiple interacting factors rather than a single cause. Understanding 
                    these risk factors can help with early identification and intervention:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">1. Individual Factors</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                        <li>Anxiety disorders or predisposition to anxiety</li>
                        <li>Depression or low mood</li>
                        <li>Neurodevelopmental conditions (e.g., autism, ADHD)</li>
                        <li>Learning difficulties or specific educational needs</li>
                        <li>Perfectionism or high self-expectations</li>
                        <li>History of trauma or adverse experiences</li>
                        <li>Physical health conditions or somatic complaints</li>
                        <li>Difficulties with emotion regulation</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">2. Family Factors</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                        <li>Family history of anxiety or mental health difficulties</li>
                        <li>Overprotective parenting styles</li>
                        <li>Insecure attachment patterns</li>
                        <li>Family stress or significant life events</li>
                        <li>Parental mental health difficulties</li>
                        <li>Family conflict or domestic violence</li>
                        <li>Caring responsibilities within the family</li>
                        <li>Parental attitudes toward education and attendance</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">3. School Factors</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                        <li>Bullying or peer relationship difficulties</li>
                        <li>Academic pressure or fear of failure</li>
                        <li>Transitions between schools or key stages</li>
                        <li>Specific teacher relationships or conflicts</li>
                        <li>School climate and sense of belonging</li>
                        <li>Curriculum accessibility and differentiation</li>
                        <li>Physical environment (noise, crowding, etc.)</li>
                        <li>Rigid attendance policies or punitive approaches</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">4. Wider Systemic Factors</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                        <li>Socioeconomic disadvantage</li>
                        <li>Cultural factors and expectations</li>
                        <li>Community safety concerns</li>
                        <li>Access to support services</li>
                        <li>Social media and online influences</li>
                        <li>Societal pressures and expectations</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-6 rounded-lg mt-6">
                    <h4 className="font-medium mb-3">Early Warning Signs</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Early identification is crucial for effective intervention. The following signs may indicate emerging EBSNA:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Behavioral Signs</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Increasing lateness or sporadic absences</li>
                          <li>Pattern of absence on specific days</li>
                          <li>Difficulty separating from parents</li>
                          <li>Reluctance to discuss school</li>
                          <li>Withdrawal from previously enjoyed activities</li>
                          <li>Seeking frequent reassurance</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Physical Signs</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Frequent complaints of headaches or stomachaches</li>
                          <li>Sleep disturbances or nightmares</li>
                          <li>Loss of appetite or changes in eating patterns</li>
                          <li>Physical symptoms that appear on school days</li>
                          <li>Panic attacks or physiological anxiety responses</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Emotional Signs</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Expressions of fear or worry about school</li>
                          <li>Tearfulness or emotional outbursts</li>
                          <li>Increased irritability or mood swings</li>
                          <li>Expressions of low self-esteem</li>
                          <li>Catastrophic thinking about school situations</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Academic Signs</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Declining academic performance</li>
                          <li>Incomplete assignments or homework</li>
                          <li>Avoidance of specific subjects or activities</li>
                          <li>Perfectionism or fear of making mistakes</li>
                          <li>Difficulty concentrating or participating</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Developmental Pathway of EBSNA</h3>
                  <p className="mb-4">
                    EBSNA typically develops through a process rather than appearing suddenly. Understanding this developmental 
                    pathway can help identify opportunities for early intervention:
                  </p>
                  
                  <div className="relative overflow-x-auto">
                    <div className="flex flex-col md:flex-row gap-4 my-6">
                      <div className="flex-1 border rounded-lg p-4 bg-blue-50">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-blue-700">1</span>
                        </div>
                        <h4 className="font-medium mb-2">Initial Triggers</h4>
                        <p className="text-sm text-muted-foreground">
                          Specific events or circumstances that initiate anxiety about school attendance. May include transitions, 
                          bullying incidents, academic challenges, or family changes.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 border rounded-lg p-4 bg-indigo-50">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-indigo-700">2</span>
                        </div>
                        <h4 className="font-medium mb-2">Initial Response</h4>
                        <p className="text-sm text-muted-foreground">
                          Child experiences emotional distress related to school. May express reluctance or develop physical 
                          complaints but continues to attend with support.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 border rounded-lg p-4 bg-purple-50">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-purple-700">3</span>
                        </div>
                        <h4 className="font-medium mb-2">Escalation</h4>
                        <p className="text-sm text-muted-foreground">
                          Anxiety increases and attendance becomes more difficult. Pattern of sporadic absences may develop. 
                          Physical symptoms and emotional distress intensify.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 my-6">
                      <div className="flex-1 border rounded-lg p-4 bg-red-50">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-red-700">4</span>
                        </div>
                        <h4 className="font-medium mb-2">Crisis Point</h4>
                        <p className="text-sm text-muted-foreground">
                          Child becomes unable to attend school despite efforts. Severe emotional distress when attendance is attempted. 
                          Family system becomes significantly impacted.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 border rounded-lg p-4 bg-amber-50">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-amber-700">5</span>
                        </div>
                        <h4 className="font-medium mb-2">Entrenchment</h4>
                        <p className="text-sm text-muted-foreground">
                          Prolonged absence leads to increased anxiety about return. Secondary gains may develop (e.g., reduced anxiety at home). 
                          Social isolation increases.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 border rounded-lg p-4 bg-green-50">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <span className="font-medium text-green-700">6</span>
                        </div>
                        <h4 className="font-medium mb-2">Recovery</h4>
                        <p className="text-sm text-muted-foreground">
                          With appropriate intervention, gradual reintegration begins. Requires coordinated support and individualized 
                          approach. May involve alternative provision initially.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This pathway represents a typical progression, but individual experiences may vary. 
                    Early intervention at stages 1-2 is significantly more effective than waiting until stages 4-5, when patterns 
                    become entrenched and more resistant to change.
                  </p>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Example: Aiden's Story</h3>
                  <p className="mb-4">
                    Aiden is a 13-year-old boy in Year 8 who has always been somewhat anxious but managed to attend primary school regularly. 
                    His difficulties began during the transition to secondary school, which coincided with his parents' separation.
                  </p>
                  
                  <h4 className="font-medium mb-2">Initial Presentation:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Began complaining of stomachaches and headaches on school mornings</li>
                    <li>Initially continued to attend but became increasingly distressed</li>
                    <li>Started missing specific lessons (PE and mathematics)</li>
                    <li>Attendance became more sporadic, with complete days missed</li>
                    <li>After a two-week illness, found it impossible to return to school</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Contributing Factors:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li><strong>Individual:</strong> Tendency toward anxiety, perfectionist traits, difficulty with change</li>
                    <li><strong>Family:</strong> Parental separation, mother's own anxiety, inconsistent morning routines</li>
                    <li><strong>School:</strong> Transition to larger school, challenging peer dynamics, academic pressure</li>
                    <li><strong>Wider:</strong> COVID-19 disruption to education, reduced social opportunities</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Emotional Experience:</h4>
                  <p className="mb-4">
                    Aiden described feeling overwhelmed by the noise and crowds at school. He worried constantly about his academic 
                    performance and whether other students liked him. He experienced intense shame when unable to attend, which further 
                    increased his anxiety about returning. His emotional distress manifested physically through panic symptoms and 
                    gastrointestinal complaints.
                  </p>
                  
                  <div className="border-t border-b py-4 my-4">
                    <p className="italic">
                      "I want to go to school, I really do. But when it's time to leave, my heart starts racing and I feel sick. 
                      I worry all night about the next day. Everyone thinks I'm just being difficult, but I'm trying my hardest."
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      — Aiden, age 13
                    </p>
                  </div>
                  
                  <p>
                    Aiden's case illustrates how EBSNA typically involves multiple interacting factors rather than a single cause, 
                    and how emotional distress can manifest physically and behaviorally. It also highlights the importance of understanding 
                    the child's subjective experience rather than focusing solely on the behavior of non-attendance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might your understanding of EBSNA influence your approach to supporting a child who is struggling with school attendance?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What early warning signs of EBSNA have you observed in your setting, and what systems are in place to identify and respond to these?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Consider a child you have worked with who experienced difficulties with school attendance. What factors do you think contributed to their situation?</p>
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
                    Next Unit: Theoretical Frameworks
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
                  <CardDescription>Test your understanding of EBSNA</CardDescription>
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
