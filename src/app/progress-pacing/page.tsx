'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProgressPacingEngine from '@/components/ai/progress-pacing/progress-pacing-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/micro-interactions";

// Content component that uses client-side features
const ProgressPacingContent = () => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const curriculumId = searchParams.get('curriculumId');
  
  return (
    <>
      {!studentId && !curriculumId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Student or Curriculum</CardTitle>
            <CardDescription>
              Choose a student or curriculum to adjust learning pace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                onClick={() => router.push('/students')}
              >
                <Users className="h-10 w-10 text-primary mb-2" />
                <span className="text-lg font-medium">Select Student</span>
                <span className="text-sm text-muted-foreground text-centre">
                  Adjust pacing based on individual student progress
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                onClick={() => router.push('/curriculum')}
              >
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <span className="text-lg font-medium">Select Curriculum</span>
                <span className="text-sm text-muted-foreground text-centre">
                  Adjust pacing for a specific curriculum plan
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <ProgressPacingEngine
        studentId={studentId || undefined}
        curriculumId={curriculumId || undefined}
      />
    </>
  );
};

// Main page component with Suspense boundary
export default function ProgressPacingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progress-Adaptive Pacing</h1>
          <p className="text-muted-foreground">
            Automatically adjust learning pace based on individual student progress
          </p>
        </div>
        
        <Tabs defaultValue="adjust" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">Adjust Pacing</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="pt-4">
            <div className="space-y-8">
              <Suspense fallback={
                <div className="flex justify-center items-center min-h-[200px]">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <ProgressPacingContent />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Progress-Adaptive Pacing</CardTitle>
                <CardDescription>
                  Understanding how this feature personalizes learning pace for individual students
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Progress-Adaptive Pacing?</h3>
                  <p>
                    Progress-Adaptive Pacing is an advanced educational approach that automatically adjusts the pace of learning based on individual student progress, ensuring that each student moves through the curriculum at an optimal rate. This feature recognizes that students learn at different speeds and adapts accordingly, preventing both frustration from moving too quickly and disengagement from moving too slowly.
                  </p>
                  <p className="mt-2">
                    By leveraging artificial intelligence and evidence-based pedagogical principles, the system creates personalized learning journeys that respond dynamically to each student's progress, mastery level, and learning patterns, making education more efficient, engaging, and effective.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Progress-Based Adaptation:</span> Automatically adjusts learning pace based on student progress data, mastery levels, and engagement patterns.
                    </li>
                    <li>
                      <span className="font-medium">Reinforcement Activities:</span> Provides additional practise opportunities when needed to ensure concept mastery before progression.
                    </li>
                    <li>
                      <span className="font-medium">Acceleration Options:</span> Offers pathways for advanced progression when students demonstrate strong understanding and mastery.
                    </li>
                    <li>
                      <span className="font-medium">Mastery Checkpoints:</span> Embeds strategic assessment points to verify readiness for progression to new concepts.
                    </li>
                    <li>
                      <span className="font-medium">Strategic Breakpoints:</span> Incorporates planned pauses for reflection and knowledge consolidation at key points in the learning journey.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Benefits</h3>
                  <p>
                    Research in educational psychology demonstrates that adaptive pacing offers significant advantages:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Reduced frustration and anxiety from inappropriate pacing</li>
                    <li>Increased engagement through appropriately challenging progression</li>
                    <li>More efficient use of learning time for all students</li>
                    <li>Stronger knowledge retention through mastery-based progression</li>
                    <li>Greater student agency and ownership of learning</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our progress-adaptive pacing system is built on established research in mastery learning, spaced repetition, and the zone of proximal development. The system implements best practices for pacing educational content while ensuring deep understanding and knowledge retention.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                  <p>
                    All pacing adjustments maintain alignment with UK curriculum standards and progression expectations. The system ensures that while the pace may be personalized, the core learning objectives and curriculum requirements are preserved and achieved.
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-centre">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                    Teacher Tip
                  </h3>
                  <p>
                    Progress-adaptive pacing is particularly valuable for mixed-ability classrooms and personalized learning environments. Consider using this feature to create individualized learning plans that allow each student to progress at their optimal pace while still achieving curriculum objectives within appropriate timeframes.
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
