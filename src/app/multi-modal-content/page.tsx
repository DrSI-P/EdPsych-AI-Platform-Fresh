'use client';

import { useState, Suspense } from 'react';
import MultiModalPresentationEngine from '@/components/ai/multi-modal-content/multi-modal-presentation-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from "@/components/ui/loading";

// Component to handle search params with Suspense
function MultiModalContentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<any>(null);
  const contentId = searchParams.get('contentId');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Multi-Modal Content Presentation</h1>
          <p className="text-muted-foreground">
            Present educational content through multiple sensory channels simultaneously for enhanced learning
          </p>
        </div>
        
        <Tabs defaultValue="create" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Multi-Modal Content</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="pt-4">
            <div className="space-y-8">
              {!contentId && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select Content to Transform</CardTitle>
                    <CardDescription>
                      Choose existing content or create new multi-modal content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                        onClick={() => router.push('/curriculum')}
                      >
                        <BookOpen className="h-10 w-10 text-primary mb-2" />
                        <span className="text-lg font-medium">Curriculum Plans</span>
                        <span className="text-sm text-muted-foreground text-centre">
                          Transform existing curriculum plans into multi-modal content
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto flex flex-col items-centre justify-centre p-6 gap-2"
                        onClick={() => router.push('/resources')}
                      >
                        <Layers className="h-10 w-10 text-primary mb-2" />
                        <span className="text-lg font-medium">Resources</span>
                        <span className="text-sm text-muted-foreground text-centre">
                          Transform existing resources into multi-modal content
                        </span>
                      </Button>
                    </div>
                    
                    <div className="mt-6 text-centre">
                      <p className="text-sm text-muted-foreground mb-4">
                        Or create new multi-modal content from scratch
                      </p>
                      <Button onClick={() => setContent({ title: '', content: '' })}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create New Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <MultiModalPresentationEngine 
                contentId={contentId || undefined}
                content={content?.content}
                title={content?.title}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Multi-Modal Content Presentation</CardTitle>
                <CardDescription>
                  Understanding how this feature enhances learning through multiple sensory channels
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Multi-Modal Content Presentation?</h3>
                  <p>
                    Multi-Modal Content Presentation is an advanced educational approach that presents information through multiple sensory channels simultaneously. This feature transforms standard educational content into rich, multi-sensory experiences that engage visual, auditory, and kinesthetic learning pathways.
                  </p>
                  <p className="mt-2">
                    By leveraging artificial intelligence and evidence-based pedagogical principles, the system creates comprehensive learning experiences that cater to diverse learning preferences and needs, making education more accessible and effective for all students.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Visual Content:</span> Engaging images, diagrams, charts, and visual representations that illustrate concepts clearly.
                    </li>
                    <li>
                      <span className="font-medium">Audio Content:</span> Professional narration, explanations, and sound elements that reinforce learning through auditory channels.
                    </li>
                    <li>
                      <span className="font-medium">Text Content:</span> Well-structured written explanations, summaries, and key points for reading-oriented learners.
                    </li>
                    <li>
                      <span className="font-medium">Interactive Elements:</span> Engaging activities, quizzes, and manipulatives that promote active learning and knowledge application.
                    </li>
                    <li>
                      <span className="font-medium">Accessibility Features:</span> Comprehensive support for diverse learning needs, including alternative text, transcripts, and navigation aids.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Benefits</h3>
                  <p>
                    Research in cognitive science and educational psychology demonstrates that multi-modal learning offers significant advantages:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Improved information retention and recall through multiple memory pathways</li>
                    <li>Enhanced engagement through stimulation of multiple sensory channels</li>
                    <li>Increased accessibility for learners with different preferences and needs</li>
                    <li>Deeper conceptual understanding through varied representations</li>
                    <li>More effective learning for complex or abstract concepts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    Our multi-modal content presentation system is built on established research in cognitive load theory, dual coding theory, and multimedia learning principles. The system implements best practices for presenting information across multiple modalities while avoiding cognitive overload.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">UK Curriculum Alignment</h3>
                  <p>
                    All multi-modal content maintains alignment with UK curriculum standards and uses UK English spelling and terminology. The system ensures that while the presentation format is enhanced, the core learning objectives and curriculum requirements are preserved and reinforced.
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex items-centre">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                    Teacher Tip
                  </h3>
                  <p>
                    Multi-modal content is particularly effective for introducing new concepts, reviewing complex material before assessments, and supporting students with diverse learning needs. Consider creating multi-modal versions of your most challenging curriculum topics.
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

// Main component with Suspense boundary
export default function MultiModalContentPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <MultiModalContentPageContent />
    </Suspense>
  );
}
