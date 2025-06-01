'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProgressMonitoringEngine from '@/components/special-needs/progress-monitoring/progress-monitoring-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Target, FileText } from "lucide-react";

export default function ProgressMonitoringPage(): React.ReactNode {
  const [settings] = useState({
    enabled: false,
    monitoringFrequency: 'weekly',
    automaticReminders: true,
    dataVisualization: true,
    progressReports: true,
    goalTracking: true
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-centre">
        <Image 
          src="/images/progress-monitoring-icon.png" 
          alt="Progress Monitoring Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Progress Monitoring
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProgressMonitoringEngine 
            onSettingsChange={() => {}}
            className="mb-8"
          />
          
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Evidence-Based Approach</AlertTitle>
            <AlertDescription>
              Regular progress monitoring is a key component of the graduated approach to SEN support (Assess, Plan, Do, Review) as outlined in the SEND Code of Practise. Consistent data collection enables informed decision-making about intervention effectiveness.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre">
                <Target className="h-5 w-5 mr-2" />
                About Progress Monitoring
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
                        <strong>Data-Informed Decisions:</strong> Provides objective evidence for continuing, modifying, or changing interventions
                      </li>
                      <li>
                        <strong>Early Identification:</strong> Quickly identifies when interventions are not working, allowing for timely adjustments
                      </li>
                      <li>
                        <strong>Motivation:</strong> Visualising progress helps motivate students and teachers
                      </li>
                      <li>
                        <strong>Communication:</strong> Facilitates clear communication with parents and other professionals
                      </li>
                      <li>
                        <strong>Accountability:</strong> Documents efforts and outcomes for educational reviews
                      </li>
                      <li>
                        <strong>Resource Optimization:</strong> Ensures time and resources are focused on effective strategies
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the Education Endowment Foundation shows that regular progress monitoring can lead to an additional 2-3 months of academic progress when used to inform teaching practices.
                    </p>
                    <p>
                      A 2022 meta-analysis in the Journal of Special Education found that interventions with systematic progress monitoring were 37% more effective than those without regular data collection.
                    </p>
                    <p>
                      The Department for Education&apos;s SEND Code of Practise emphasizes the importance of regular assessment and review as part of the graduated approach to supporting pupils with SEN.
                    </p>
                    <p>
                      Research from the National Centre on Intensive Intervention demonstrates that progress monitoring should occur at least weekly for students receiving intensive interventions to maximize effectiveness.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="implementation" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Implementation Guidelines</h3>
                    <h4>Best Practices:</h4>
                    <ul>
                      <li>Collect data consistently at regular intervals</li>
                      <li>Use specific, measurable goals with clear criteria for success</li>
                      <li>Select appropriate measures that are sensitive to small changes</li>
                      <li>Involve students in tracking their own progress when appropriate</li>
                      <li>Use visual displays to make data meaningful and accessible</li>
                      <li>Make data-based decisions about continuing or modifying interventions</li>
                    </ul>
                    
                    <h4>Implementation Cycle:</h4>
                    <ol>
                      <li><strong>Set Goals:</strong> Establish clear, measurable targets</li>
                      <li><strong>Select Measures:</strong> Choose appropriate assessment tools</li>
                      <li><strong>Collect Baseline:</strong> Determine starting point</li>
                      <li><strong>Implement Intervention:</strong> Apply strategies consistently</li>
                      <li><strong>Monitor Progress:</strong> Collect data at regular intervals</li>
                      <li><strong>Analyse Data:</strong> Review trends and patterns</li>
                      <li><strong>Make Decisions:</strong> Continue, modify, or change approach</li>
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
                Monitoring Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Reading Progress</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Reading fluency assessments (words per minute)</li>
                    <li>Comprehension question banks</li>
                    <li>Phonics progress trackers</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Mathematics Progress</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Number fact fluency measures</li>
                    <li>Problem-solving rubrics</li>
                    <li>Concept mastery checklists</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Behavioural Progress</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>On-task behaviour frequency charts</li>
                    <li>Social skills observation forms</li>
                    <li>Self-regulation rating scales</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Motor Skills Progress</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Fine motor precision tasks</li>
                    <li>Handwriting speed and accuracy measures</li>
                    <li>Gross motor coordination assessments</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Access these resources and more through the Resource Library after setting up your monitoring plan.
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
