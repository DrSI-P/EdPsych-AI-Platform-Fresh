'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CurriculumDifferentiationEngine from '@/components/ai/curriculum-differentiation/curriculum-differentiation-engine';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

// Client component that uses useSearchParams
function CurriculumDifferentiationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [curriculumPlan, setCurriculumPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const planId = searchParams?.get('planId') || null;
  
  useEffect(() => {
    if (planId) {
      fetchCurriculumPlan(planId);
    }
  }, [planId]);
  
  // Define the type for curriculum objectives
  interface CurriculumObjective {
    description: string;
    [key: string]: any;
  }

  const fetchCurriculumPlan = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/curriculum/plans/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurriculumPlan(data.plan);
      }
    } catch (error) {
      console.error('Error fetching curriculum plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {planId && curriculumPlan ? (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Selected Curriculum Plan</CardTitle>
                    <CardDescription>
                      The following curriculum plan will be differentiated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{curriculumPlan.title}</h3>
                        <p className="text-sm text-muted-foreground">{curriculumPlan.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Subject</p>
                          <p className="text-sm text-muted-foreground">{curriculumPlan.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Key Stage</p>
                          <p className="text-sm text-muted-foreground">{curriculumPlan.keyStage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Year</p>
                          <p className="text-sm text-muted-foreground">{curriculumPlan.year || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Term</p>
                          <p className="text-sm text-muted-foreground">{curriculumPlan.term || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/curriculum')}
                        className="flex items-centre gap-1"
                      >
                        Select Different Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : !planId ? (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select a Curriculum Plan</CardTitle>
                    <CardDescription>
                      Choose a curriculum plan to differentiate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        No curriculum plan selected. Please select a plan to differentiate.
                      </p>
                      <Button 
                        onClick={() => router.push('/curriculum')}
                        className="flex items-centre gap-1"
                      >
                        <BookOpen className="h-4 w-4" />
                        Browse Curriculum Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-6">
                  <CardContent className="py-6">
                    <div className="flex flex-col items-centre justify-centre space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p>Loading curriculum plan...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
     <CurriculumDifferentiationEngine
       curriculumPlanId={planId || undefined}
       curriculumContent={curriculumPlan?.content || ''}
       objectives={curriculumPlan?.objectives?.map((obj: CurriculumObjective) => obj.description) || []}
       subject={curriculumPlan?.subject || ''}
       keyStage={curriculumPlan?.keyStage || ''}
       year={curriculumPlan?.year || ''}
     />
    </div>
  );
}

// Main page component with Suspense boundary
export default function CurriculumDifferentiationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI-Driven Curriculum Differentiation</h1>
          <p className="text-muted-foreground">
            Automatically adapt curriculum content to meet diverse learning needs and styles
          </p>
        </div>
        
        <Tabs defaultValue="differentiate" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="differentiate">Differentiate Curriculum</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="differentiate" className="pt-4">
            <Suspense fallback={
              <Card className="mb-6">
                <CardContent className="py-6">
                  <div className="flex flex-col items-centre justify-centre space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p>Loading curriculum differentiation...</p>
                  </div>
                </CardContent>
              </Card>
            }>
              <CurriculumDifferentiationContent />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About AI-Driven Curriculum Differentiation</CardTitle>
                <CardDescription>
                  Understanding how this feature enhances personalized learning
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is AI-Driven Curriculum Differentiation?</h3>
                  <p>
                    AI-Driven Curriculum Differentiation automatically adapts educational content to meet the diverse learning needs and styles of individual students. This feature transforms standard curriculum plans into personalized learning experiences that address the unique requirements of each learner.
                  </p>
                  <p className="mt-2">
                    By leveraging artificial intelligence and data from learning style assessments, the system creates variations of curriculum content optimised for different learning preferences, abilities, and prior knowledge levels.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Learning Style Adaptation:</span> Transforms content to match visual, auditory, kinesthetic, and reading/writing learning preferences.
                    </li>
                    <li>
                      <span className="font-medium">Prior Knowledge Consideration:</span> Adjusts content based on existing knowledge and skills to prevent gaps or redundancy.
                    </li>
                    <li>
                      <span className="font-medium">Extension Activities:</span> Provides additional challenging activities for advanced learners who need further stimulation.
                    </li>
                    <li>
                      <span className="font-medium">Scaffolding Support:</span> Includes additional support structures for learners who need extra help with concepts.
                    </li>
                    <li>
                      <span className="font-medium">Adjustable Differentiation Level:</span> Controls the degree of adaptation from the original curriculum to meet specific needs.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Benefits</h3>
                  <p>
                    This feature significantly enhances educational outcomes by:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Increasing student engagement through personalized content delivery</li>
                    <li>Improving information retention by matching content to preferred learning styles</li>
                    <li>Supporting inclusive education by addressing diverse learning needs</li>
                    <li>Reducing teacher workload in creating differentiated materials</li>
                    <li>Ensuring all students can access the curriculum regardless of learning differences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our curriculum differentiation technology is built on established educational research into differentiated instruction, learning styles, and personalized learning. The system continuously improves through machine learning, adapting to educational outcomes and teacher feedback.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                  <p>
                    All differentiated content maintains alignment with UK curriculum standards and uses UK English spelling and terminology. The system ensures that while the presentation and approach may be adapted, the core learning objectives and curriculum requirements are preserved.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
