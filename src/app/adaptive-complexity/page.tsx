'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, CheckCircle2, BarChart3 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/micro-interactions";

// Define interface for content structure
interface ContentItem {
  title: string;
  content: string;
}

// Dynamically import the AdaptiveComplexityEngine component with SSR disabled
const AdaptiveComplexityEngine = dynamic(
  () => import('@/components/ai/adaptive-complexity/adaptive-complexity-engine'),
  { ssr: false }
);

// Content component that uses client-side features
const AdaptiveComplexityContent = () => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<ContentItem | null>(null);
  const contentId = searchParams ? searchParams.get('contentId') : null;
  
  return (
    <>
      {!contentId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Content to Adjust</CardTitle>
            <CardDescription>
              Choose existing content or create new adaptive content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content?select=true')}
              >
                <BookOpen className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">Existing Content</div>
                  <div className="text-sm text-muted-foreground mt-1">Adapt previously created materials</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content/create?adaptive=true')}
              >
                <Layers className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">New Content</div>
                  <div className="text-sm text-muted-foreground mt-1">Create new adaptive content</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
                onClick={() => router.push('/curriculum/content/examples?adaptive=true')}
              >
                <BarChart3 className="h-10 w-10 mb-2" />
                <div>
                  <div className="font-medium">View Examples</div>
                  <div className="text-sm text-muted-foreground mt-1">See adaptive content in action</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {contentId && (
        <AdaptiveComplexityEngine
          contentId={contentId}
          initialContent={content}
          onContentChange={setContent}
        />
      )}
    </>
  );
};

// Main page component with Suspense boundary
export default function AdaptiveComplexityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Adaptive Complexity Adjustment</h1>
          <p className="text-muted-foreground">
            Automatically adjust content complexity based on student performance and needs
          </p>
        </div>
        
        <Tabs defaultValue="adjust" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">Adjust Content</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="pt-4">
            <div className="space-y-8">
              <Suspense fallback={
                <div className="flex justify-center items-center min-h-[200px]">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <AdaptiveComplexityContent />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Adaptive Complexity</CardTitle>
                <CardDescription>
                  Understanding how our AI-powered complexity adjustment works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Adaptive Complexity Adjustment?</h3>
                  <p>
                    Adaptive Complexity Adjustment is an advanced educational technology that automatically modifies the complexity level of learning content to match individual student needs, abilities, and performance. This feature ensures that each student receives content at the optimal level of challenge—not too difficult to cause frustration, yet not too simple to cause boredom.
                  </p>
                  <p className="mt-2">
                    By leveraging artificial intelligence and evidence-based pedagogical principles, the system creates personalized learning experiences that adapt to each student's unique learning journey, making education more accessible, engaging, and effective.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Performance-Based Adaptation:</span> Automatically adjusts content complexity based on student performance data, comprehension levels, and assessment results.
                    </li>
                    <li>
                      <span className="font-medium">Scaffolding Support:</span> Provides additional support structures for complex concepts when needed, helping students bridge knowledge gaps.
                    </li>
                    <li>
                      <span className="font-medium">Extension Activities:</span> Offers additional challenges for advanced learners who have mastered the core content.
                    </li>
                    <li>
                      <span className="font-medium">Comprehension Checks:</span> Embeds assessment points within content to verify understanding and guide further adaptations.
                    </li>
                    <li>
                      <span className="font-medium">Multi-Modal Preservation:</span> Maintains visual, audio, and interactive elements while adjusting complexity to support diverse learning styles.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Benefits</h3>
                  <p>
                    Research in educational psychology demonstrates that adaptive complexity offers significant advantages:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Increased engagement through appropriately challenging content</li>
                    <li>Reduced frustration and anxiety when facing overly complex material</li>
                    <li>Prevention of boredom and disengagement from overly simplistic content</li>
                    <li>Support for students with diverse learning needs and abilities</li>
                    <li>Gradual building of confidence and competence through incremental challenges</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our adaptive complexity system is built on established research in Vygotsky's Zone of Proximal Development, Csikszentmihalyi's Flow Theory, and contemporary cognitive load theory. The system implements best practices for presenting information at the optimal level of challenge while providing appropriate support.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                  <p>
                    All adapted content maintains alignment with UK curriculum standards and uses UK English spelling and terminology. The system ensures that while the complexity level may be adjusted, the core learning objectives and curriculum requirements are preserved.
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                    Teacher Tip
                  </h3>
                  <p>
                    Adaptive complexity is particularly valuable for mixed-ability classrooms, students with special educational needs, and differentiated instruction. Consider using this feature to create tiered assignments that allow all students to access the same core content at different complexity levels.
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
