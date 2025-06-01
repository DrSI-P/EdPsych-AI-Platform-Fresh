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

export default function ParentFamilyEngagement() {
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
                <CardDescription>Parent and Family Engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <span className="font-medium">1. Building Effective Home-School Partnerships</span>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>2. Supporting Parents of Children with SEND</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>3. Family-Centered Intervention Approaches</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <span>4. Engaging Hard-to-Reach Families</span>
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
                      Family Engagement Toolkit (PDF)
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video: Successful Parent Partnerships
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-primary hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Communication Templates for Schools
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
                    <CardTitle className="text-2xl">Building Effective Home-School Partnerships</CardTitle>
                    <CardDescription>Parent and Family Engagement - Unit 1</CardDescription>
                  </div>
                  <Badge>25 CPD Points</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/professional-development/home-school-partnership.jpg"
                    alt="Teacher meeting with parents"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Effective partnerships between home and school are fundamental to children's educational success. This unit explores 
                    evidence-based approaches to building meaningful relationships with parents and families that support children's learning, 
                    development, and wellbeing across both contexts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understand the evidence base for family engagement</li>
                        <li>Identify key principles of effective home-school partnerships</li>
                        <li>Develop strategies for meaningful two-way communication</li>
                        <li>Learn approaches to overcome barriers to engagement</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Concepts</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Two-way communication and reciprocity</li>
                        <li>Cultural responsiveness and inclusion</li>
                        <li>Asset-based approaches to family engagement</li>
                        <li>Shared decision-making</li>
                        <li>Systemic approaches to partnership</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Evidence for Family Engagement</h3>
                  <p className="mb-4">
                    Research consistently demonstrates that effective family engagement has significant positive impacts on children's 
                    educational outcomes, social-emotional development, and wellbeing.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Key Research Findings</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <p className="text-sm text-muted-foreground">Parental engagement can add the equivalent of 2-3 years of schooling to a child's education (Education Endowment Foundation)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Children whose parents are involved in their education are more likely to achieve higher grades, have better attendance, and demonstrate more positive behavior (Department for Education)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Family engagement is twice as predictive of academic success as socioeconomic status (Harvard Family Research Project)</p>
                        </li>
                        <li>
                          <p className="text-sm text-muted-foreground">Schools that effectively engage families see improvements in school climate, staff satisfaction, and community support (National Network of Partnership Schools)</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Benefits Across Stakeholders</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">For children:</span> 
                          <p className="text-sm text-muted-foreground">Improved academic achievement, attendance, behavior, and social-emotional skills</p>
                        </li>
                        <li>
                          <span className="font-medium">For parents:</span> 
                          <p className="text-sm text-muted-foreground">Greater confidence in supporting learning, better understanding of school systems, increased voice in education</p>
                        </li>
                        <li>
                          <span className="font-medium">For schools:</span> 
                          <p className="text-sm text-muted-foreground">Improved school climate, higher staff morale, better understanding of pupils' needs and contexts</p>
                        </li>
                        <li>
                          <span className="font-medium">For communities:</span> 
                          <p className="text-sm text-muted-foreground">Stronger social networks, increased community cohesion, better use of community resources</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    The UK government has recognized the importance of parental engagement through initiatives such as the Parental Engagement Fund 
                    and the inclusion of parent partnership in the SEND Code of Practice and Ofsted inspection framework.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Key Principles of Effective Home-School Partnerships</h3>
                  <p className="mb-4">
                    Based on research and best practice, the following principles underpin effective home-school partnerships:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">1. Relationships come first</h4>
                      <p className="text-sm text-muted-foreground">
                        Authentic, trusting relationships are the foundation of effective partnerships. These take time to develop and require 
                        intentional effort from school staff.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Prioritize relationship-building activities, create informal opportunities for interaction, and ensure first 
                        contacts with families are positive.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">2. Recognize and respect diverse family structures and cultures</h4>
                      <p className="text-sm text-muted-foreground">
                        Families come in many forms and bring diverse cultural perspectives, values, and practices related to education and child-rearing.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Use inclusive language, acknowledge diverse family structures, learn about cultural perspectives, and adapt 
                        approaches to meet different needs.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">3. Adopt an asset-based approach</h4>
                      <p className="text-sm text-muted-foreground">
                        View families as having valuable knowledge, skills, and resources to contribute, rather than focusing on deficits or problems.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Identify and build on family strengths, invite parents to share expertise, and avoid deficit-based language.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">4. Establish two-way communication</h4>
                      <p className="text-sm text-muted-foreground">
                        Effective communication flows in both directions, with schools both sharing information and actively listening to families.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Create multiple channels for communication, seek parent input regularly, and ensure communication is accessible to all.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">5. Share power and decision-making</h4>
                      <p className="text-sm text-muted-foreground">
                        Authentic partnerships involve shared ownership and decision-making about children's education.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Create meaningful roles for parents in governance, involve families in goal-setting, and be transparent about decision processes.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">6. Focus on learning and development</h4>
                      <p className="text-sm text-muted-foreground">
                        The core purpose of home-school partnerships is to support children's learning, development, and wellbeing.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Provide specific guidance on supporting learning at home, share curriculum information clearly, and help parents understand child development.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">7. Take a systemic approach</h4>
                      <p className="text-sm text-muted-foreground">
                        Effective family engagement is embedded in school culture, policies, and practices rather than consisting of isolated events or initiatives.
                      </p>
                      <p className="text-sm italic mt-1">
                        Implementation: Develop a whole-school family engagement strategy, allocate resources appropriately, and build staff capacity.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Strategies for Meaningful Two-Way Communication</h3>
                  <p className="mb-4">
                    Communication is the cornerstone of effective home-school partnerships. Consider these approaches to enhance communication with families:
                  </p>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Communication Strategy</th>
                          <th scope="col" className="px-6 py-3">Benefits</th>
                          <th scope="col" className="px-6 py-3">Implementation Tips</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Regular two-way communication channels</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Builds ongoing relationship</li>
                              <li>Allows for timely updates</li>
                              <li>Creates multiple opportunities for engagement</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Use digital platforms that allow two-way messaging</li>
                              <li>Establish clear response timeframes</li>
                              <li>Offer alternative formats for families without digital access</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">Learning-focused conversations</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Centers child's learning needs</li>
                              <li>Builds shared understanding</li>
                              <li>Focuses on specific actions</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Structure conversations around learning goals</li>
                              <li>Share specific examples of work</li>
                              <li>Agree on actions for both home and school</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Home visits</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Demonstrates commitment</li>
                              <li>Provides context understanding</li>
                              <li>Reduces power imbalance</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Ensure visits are optional and arranged in advance</li>
                              <li>Focus on relationship building, not inspection</li>
                              <li>Consider safety protocols and cultural sensitivities</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="px-6 py-4 font-medium">Parent feedback mechanisms</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Demonstrates valuing parent voice</li>
                              <li>Identifies improvement areas</li>
                              <li>Builds ownership</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Use multiple formats (surveys, focus groups, suggestion boxes)</li>
                              <li>Act on feedback and communicate changes</li>
                              <li>Make participation accessible to all families</li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="px-6 py-4 font-medium">Cultural brokers/translators</td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Bridges language and cultural gaps</li>
                              <li>Builds trust with diverse communities</li>
                              <li>Ensures accurate communication</li>
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <ul className="list-disc pl-4">
                              <li>Use professional interpreters when possible</li>
                              <li>Train staff on working effectively with interpreters</li>
                              <li>Consider community members as cultural liaisons</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Case Study: Transforming Family Engagement at Oakwood Primary</h3>
                  <p className="mb-4">
                    Oakwood Primary School serves a diverse community with high levels of socioeconomic disadvantage. The school recognized that 
                    traditional approaches to parent engagement were not reaching many families, with parent evening attendance below 40% and limited 
                    engagement in school activities.
                  </p>
                  
                  <h4 className="font-medium mb-2">Initial Approach:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mb-4">
                    <li>Conducted a parent survey and focus groups to understand barriers to engagement</li>
                    <li>Formed a Family Partnership Team with staff, parents, and community representatives</li>
                    <li>Developed a three-year family engagement strategy with clear goals and success criteria</li>
                    <li>Provided professional development for all staff on family engagement principles</li>
                    <li>Allocated resources, including a dedicated Family Engagement Coordinator role</li>
                  </ol>
                  
                  <h4 className="font-medium mb-2">Key Initiatives:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Implemented flexible meeting times, including early morning, evening, and weekend options</li>
                    <li>Created a welcoming Family Room in the school with resources and drop-in support</li>
                    <li>Established a "Parents as Partners in Learning" program with practical workshops</li>
                    <li>Recruited and trained parent ambassadors from different community groups</li>
                    <li>Developed a communication strategy using multiple channels based on parent preferences</li>
                    <li>Introduced termly learning conversations replacing traditional parents' evenings</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2">Outcomes (after two years):</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Parent participation in learning conversations increased to 85%</li>
                    <li>95% of parents reported feeling welcome in the school (up from 60%)</li>
                    <li>Significant increase in parents supporting learning at home (based on survey data)</li>
                    <li>Improved attendance and behavior, particularly for previously disengaged pupils</li>
                    <li>Greater diversity of parents involved in school governance and volunteering</li>
                    <li>Stronger community partnerships and increased resource sharing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overcoming Barriers to Engagement</h3>
                  <p className="mb-4">
                    Many families face barriers to engagement with schools. Understanding and addressing these barriers is essential for inclusive partnerships:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Practical Barriers</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Time constraints:</span> 
                          <p className="text-sm text-muted-foreground">Work commitments, caring responsibilities, and multiple children at different schools</p>
                          <p className="text-sm italic">Solution: Flexible timing, virtual options, childcare provision</p>
                        </li>
                        <li>
                          <span className="font-medium">Transport and location:</span> 
                          <p className="text-sm text-muted-foreground">Distance from school, lack of transport, mobility issues</p>
                          <p className="text-sm italic">Solution: Community-based activities, transport support, home visits</p>
                        </li>
                        <li>
                          <span className="font-medium">Language barriers:</span> 
                          <p className="text-sm text-muted-foreground">Limited English proficiency, technical educational language</p>
                          <p className="text-sm italic">Solution: Translation services, visual communication, plain language</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Psychological and Cultural Barriers</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Negative school experiences:</span> 
                          <p className="text-sm text-muted-foreground">Parents' own difficult school experiences affecting their confidence</p>
                          <p className="text-sm italic">Solution: Create positive early interactions, focus on strengths</p>
                        </li>
                        <li>
                          <span className="font-medium">Cultural differences:</span> 
                          <p className="text-sm text-muted-foreground">Different understandings of parent role in education, unfamiliarity with UK system</p>
                          <p className="text-sm italic">Solution: Cultural responsiveness training, community liaisons</p>
                        </li>
                        <li>
                          <span className="font-medium">Power imbalances:</span> 
                          <p className="text-sm text-muted-foreground">Perceived hierarchy, professional jargon, intimidating environments</p>
                          <p className="text-sm italic">Solution: Shared decision-making, informal settings, accessible language</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 mt-4">
                    <h4 className="font-medium mb-2">Barrier Analysis Tool</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use this simple tool to identify and address barriers in your setting:
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium">Step 1: Identify who is not engaging</h5>
                        <p className="text-xs text-muted-foreground">Look at attendance data, communication patterns, and participation rates across different family groups</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Step 2: Ask families directly about barriers</h5>
                        <p className="text-xs text-muted-foreground">Use surveys, informal conversations, or community partners to understand specific challenges</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Step 3: Analyze your current approaches</h5>
                        <p className="text-xs text-muted-foreground">Review timing, location, communication methods, and cultural responsiveness of current engagement activities</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Step 4: Co-create solutions with families</h5>
                        <p className="text-xs text-muted-foreground">Involve representatives from less engaged groups in developing new approaches</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Step 5: Monitor impact and adjust</h5>
                        <p className="text-xs text-muted-foreground">Track engagement rates across different groups and continue to refine approaches</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Supporting Learning at Home</h3>
                  <p className="mb-4">
                    One of the most impactful aspects of family engagement is supporting learning at home. Schools can help families develop 
                    effective home learning environments and practices:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Focus on the home learning environment</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Share research on the impact of home learning environments</li>
                        <li>Provide practical suggestions for creating learning-friendly spaces</li>
                        <li>Emphasize that expensive resources aren't necessary</li>
                        <li>Consider lending libraries for books, games, and learning materials</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Build parents' confidence and skills</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Offer workshops on specific learning strategies (e.g., phonics, number skills)</li>
                        <li>Create accessible guides and videos demonstrating techniques</li>
                        <li>Provide opportunities for parents to observe teaching approaches</li>
                        <li>Focus on parents' existing strengths and knowledge</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Provide specific, actionable guidance</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Share clear information about current learning topics</li>
                        <li>Suggest specific activities linked to classroom learning</li>
                        <li>Provide prompts for learning conversations (e.g., questions to ask)</li>
                        <li>Offer differentiated suggestions for different ages and needs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Recognize diverse forms of home learning</h4>
                      <ul className="list-disc pl-8 space-y-1 mt-2">
                        <li>Value everyday learning opportunities (cooking, shopping, etc.)</li>
                        <li>Acknowledge cultural variations in home learning practices</li>
                        <li>Recognize that "homework" is just one form of home learning</li>
                        <li>Celebrate and share diverse approaches to supporting learning</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Developing a Whole-School Approach</h3>
                  <p className="mb-4">
                    Effective family engagement requires a coordinated, whole-school approach:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Leadership commitment</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Senior leaders must visibly prioritize family engagement, allocate resources, and model effective partnership practices.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Policy development</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Create a comprehensive family engagement policy that outlines principles, practices, and responsibilities.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Staff development</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Provide training and support for all staff in family engagement skills, cultural responsiveness, and communication.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Dedicated coordination</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Assign responsibility for coordinating family engagement efforts, either through a dedicated role or as part of existing responsibilities.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">5. Monitoring and evaluation</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Regularly assess the effectiveness of family engagement strategies and their impact on pupil outcomes.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">6. Continuous improvement</h4>
                      <p className="text-sm text-muted-foreground pl-4">
                        Use evaluation data to refine approaches and address emerging needs or challenges.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Reflection Questions</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How would you assess the current state of family engagement in your setting, and what are the key areas for development?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">What barriers to engagement exist for families in your context, and how might these be addressed?</p>
                      <textarea 
                        className="mt-2 w-full p-2 border rounded-md" 
                        rows={3} 
                        placeholder="Enter your reflection here..."
                      ></textarea>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">How might you adapt your communication approaches to better engage all families in your setting?</p>
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
                    Next Unit: Supporting Parents of Children with SEND
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
                  <CardDescription>Test your understanding of home-school partnerships</CardDescription>
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
