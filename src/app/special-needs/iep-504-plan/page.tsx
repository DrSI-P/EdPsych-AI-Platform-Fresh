import React from 'react';
import { Metadata } from 'next';
import IEP504PlanEngine from '@/components/special-needs/iep-504-plan/iep-504-plan-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Users, School, Briefcase, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: 'IEP/504 Plan Management | EdPsych Connect',
  description: 'Create and manage Individualised Education Plans (IEPs) and 504 Accommodation Plans for students with special educational needs.',
};

export default function IEP504PlanPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">IEP/504 Plan Management</h1>
        <p className="text-grey-500 dark:text-grey-400">
          Create and manage comprehensive educational support plans for students with special educational needs
        </p>
      </div>

      <Tabs defaultValue="tool" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tool">Management Tool</TabsTrigger>
          <TabsTrigger value="about">About IEPs &amp; 504 Plans</TabsTrigger>
          <TabsTrigger value="guidance">Best Practices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tool" className="space-y-4">
          <IEP504PlanEngine />
        </TabsContent>
        
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding IEPs and 504 Plans in UK Education</CardTitle>
              <CardDescription>
                Key information about educational support plans in the UK context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Individualised Education Plans (IEPs)</h3>
                      <p className="text-sm text-grey-500">
                        In the UK, IEPs are working documents used to plan, monitor and evaluate 
                        interventions for pupils with special educational needs. They outline specific, 
                        measurable targets and strategies tailored to individual student needs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">504 Accommodation Plans</h3>
                      <p className="text-sm text-grey-500">
                        While &quot;504 Plans&quot; are primarily a US term, similar accommodation plans exist in the UK 
                        for students who need reasonable adjustments but may not require an EHCP. These plans 
                        ensure equal access to education through specific accommodations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <School className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Education, Health and Care Plans (EHCPs)</h3>
                      <p className="text-sm text-grey-500">
                        EHCPs are legal documents that describe a child&apos;s special educational, health and social care needs, 
                        and the provision required to meet those needs. They are more comprehensive than IEPs and have 
                        statutory backing.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">The SEND Code of Practise</h3>
                      <p className="text-sm text-grey-500">
                        The SEND Code of Practise (2015) provides statutory guidance for organisations working with 
                        children and young people with special educational needs and disabilities. It emphasises 
                        person-centred planning and the graduated approach of Assess, Plan, Do, Review.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Briefcase className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Legal Framework</h3>
                      <p className="text-sm text-grey-500">
                        The Children and Families Act 2014 and the Equality Act 2010 form the legal basis for 
                        SEND provision in the UK. Schools have a duty to make reasonable adjustments to ensure 
                        students with disabilities are not disadvantaged.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-grey-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Key Differences Between UK and US Approaches</h3>
                    <ul className="space-y-1 text-sm text-grey-600">
                      <li>• UK uses IEPs and EHCPs; US uses IEPs and 504 Plans</li>
                      <li>• UK has a graduated approach to SEND support</li>
                      <li>• UK emphasises the role of the SENCO (Special Educational Needs Coordinator)</li>
                      <li>• UK focuses on outcomes rather than just provision</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">The Graduated Approach to SEND Support</h3>
                <p className="text-sm text-blue-700 mb-3">
                  The UK SEND Code of Practise outlines a graduated approach to supporting children with special educational needs:
                </p>
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">1. Assess</h4>
                    <p className="text-blue-600">
                      Clear analysis of pupil&apos;s needs, drawing on teacher assessment, experience of the pupil, and other data
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">2. Plan</h4>
                    <p className="text-blue-600">
                      Formal notification to parents, with clear outcomes, interventions, support and expected impact
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">3. Do</h4>
                    <p className="text-blue-600">
                      Implementation of the agreed interventions or adjustments, with the teacher remaining responsible
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">4. Review</h4>
                    <p className="text-blue-600">
                      Evaluation of the effectiveness of support and its impact on pupil progress, with revisions as needed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guidance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Effective Educational Planning</CardTitle>
              <CardDescription>
                Evidence-based approaches to developing and implementing IEPs and accommodation plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Creating Effective Plans</h3>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Use SMART Goals</h4>
                      <p className="text-sm text-grey-500">
                        Ensure all goals are Specific, Measurable, Achievable, Relevant, and Time-bound. 
                        This provides clarity and enables effective progress monitoring.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Focus on Strengths</h4>
                      <p className="text-sm text-grey-500">
                        Begin with a thorough assessment of the student&apos;s strengths, interests, and preferences. 
                        Build on these to develop effective strategies and increase engagement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Prioritise Key Areas</h4>
                      <p className="text-sm text-grey-500">
                        Focus on the most important areas of need rather than trying to address everything at once. 
                        This prevents overwhelming the student and allows for meaningful progress.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Include Baseline Data</h4>
                      <p className="text-sm text-grey-500">
                        Document current performance levels to provide a clear starting point for measuring progress. 
                        Use multiple sources of data for a comprehensive picture.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Implementation and Monitoring</h3>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ensure Collaborative Implementation</h4>
                      <p className="text-sm text-grey-500">
                        Clearly communicate the plan to all staff involved in implementation. 
                        Ensure everyone understands their responsibilities and the strategies to be used.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Regular Progress Monitoring</h4>
                      <p className="text-sm text-grey-500">
                        Collect data consistently to track progress toward goals. Use this data to make 
                        informed decisions about continuing, modifying, or changing interventions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Meaningful Review Meetings</h4>
                      <p className="text-sm text-grey-500">
                        Hold regular review meetings with all stakeholders, including the student when appropriate. 
                        Focus on progress, challenges, and next steps.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Adjust as Needed</h4>
                      <p className="text-sm text-grey-500">
                        Be willing to revise goals, accommodations, or strategies based on progress data 
                        and feedback. Flexibility is key to effective support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md">
                <h3 className="font-medium text-amber-800 mb-2">Student and Family Engagement</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
                  <div>
                    <h4 className="font-medium mb-1">Student Voice</h4>
                    <p className="mb-2">
                      Actively involve students in the planning process to increase ownership and engagement. 
                      Use age-appropriate methods to gather their input on goals, strengths, and preferences.
                    </p>
                    <p>
                      Research shows that student involvement leads to better outcomes and helps develop 
                      self-advocacy skills essential for long-term success.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Family Partnership</h4>
                    <p className="mb-2">
                      Establish genuine partnerships with families, recognising them as experts on their child. 
                      Ensure communication is accessible, regular, and two-way.
                    </p>
                    <p>
                      Consider cultural perspectives and family circumstances when planning.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
