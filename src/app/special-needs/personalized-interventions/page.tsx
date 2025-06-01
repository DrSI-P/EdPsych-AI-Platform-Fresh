'use client';

import { useState } from 'react';
import Image from 'next/image';
import PersonalizedInterventionsEngine from '@/components/special-needs/personalized-interventions/personalized-interventions-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, GraduationCap, FileText } from "lucide-react";

export default function PersonalizedInterventionsPage(): React.ReactNode {
  const [settings] = useState({
    enabled: false,
    learningProfile: '',
    interventionLevel: 'moderate',
    targetAreas: [],
    customStrategies: '',
    progressTracking: true,
    reminderFrequency: 'weekly',
    parentTeacherUpdates: true
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/personalized-interventions-icon.png" 
          alt="Personalized Interventions Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Personalized Interventions
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PersonalizedInterventionsEngine 
            onSettingsChange={() => {}}
            className="mb-8"
          />
          
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Evidence-Based Approach</AlertTitle>
            <AlertDescription>
              All intervention strategies are based on peer-reviewed research and best practices in special education. Consistent implementation and regular progress monitoring are essential for effectiveness.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <GraduationCap className="h-5 w-5 mr-2" />
                About Personalized Interventions
              </CardTitle>
              <CardDescription>
                Understanding the benefits and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="benefits">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="implementation">Implementation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="benefits" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>
                        <strong>Targeted Support:</strong> Addresses specific learning needs rather than one-size-fits-all approaches
                      </li>
                      <li>
                        <strong>Improved Outcomes:</strong> Research shows personalized interventions lead to better academic and social-emotional results
                      </li>
                      <li>
                        <strong>Increased Engagement:</strong> Students are more motivated when learning approaches match their needs
                      </li>
                      <li>
                        <strong>Efficient Resource Use:</strong> Focuses time and resources on strategies most likely to benefit each learner
                      </li>
                      <li>
                        <strong>Progress Monitoring:</strong> Provides clear data on intervention effectiveness
                      </li>
                      <li>
                        <strong>Home-School Collaboration:</strong> Facilitates consistent approaches across environments
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Education Endowment Foundation shows that personalized intervention approaches can lead to an average of +3 months additional progress for students with special educational needs.
                    </p>
                    <p>
                      A 2023 meta-analysis in the Journal of Learning Disabilities found that interventions tailored to specific learning profiles were 42% more effective than generic support approaches.
                    </p>
                    <p>
                      The Department for Education&apos;s SEN Code of Practise emphasizes the importance of targeted, evidence-based interventions as part of the graduated approach to supporting pupils with SEN.
                    </p>
                    <p>
                      Research from the National Centre on Intensive Intervention demonstrates that systematic data collection and analysis is essential for optimising intervention effectiveness.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="implementation" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Implementation Guidelines</h3>
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Implement interventions consistently for at least 6-8 weeks before evaluating effectiveness</li>
                      <li>Collect data on student response to intervention at least weekly</li>
                      <li>Use the data to make informed decisions about continuing, modifying, or changing interventions</li>
                      <li>Ensure interventions are implemented with fidelity to research-based practices</li>
                      <li>Collaborate with parents/carers to ensure consistency across environments</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Reinforce intervention strategies at home when possible</li>
                      <li>Maintain regular communication with teachers about progress</li>
                      <li>Share observations about what works well at home</li>
                      <li>Celebrate small steps of progress to build confidence</li>
                      <li>Advocate for adjustments to interventions based on your child&apos;s response</li>
                    </ul>
                    
                    <h4>Implementation Cycle:</h4>
                    <ol>
                      <li><strong>Assess:</strong> Identify specific needs and strengths</li>
                      <li><strong>Plan:</strong> Select evidence-based interventions</li>
                      <li><strong>Do:</strong> Implement interventions consistently</li>
                      <li><strong>Review:</strong> Collect and analyse progress data</li>
                      <li><strong>Adjust:</strong> Modify approach based on response</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-centre">
                <FileText className="h-5 w-5 mr-2" />
                Intervention Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Dyslexia Support</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Structured literacy programs (Orton-Gillingham, Wilson Reading)</li>
                    <li>Decodable texts for reading practise</li>
                    <li>Multisensory phonics activities</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Dyscalculia Support</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Concrete manipulatives for math concepts</li>
                    <li>Number sense development activities</li>
                    <li>Visual models for mathematical thinking</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">ADHD Support</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Executive function coaching materials</li>
                    <li>Visual schedules and timers</li>
                    <li>Self-monitoring checklists</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Autism Spectrum Support</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Social stories and scripts</li>
                    <li>Visual supports for routines</li>
                    <li>Sensory regulation tools</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Access these resources and more through the Resource Library after creating your intervention plan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
