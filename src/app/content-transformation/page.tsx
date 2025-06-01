'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import ContentTransformationEngine from '@/components/ai/content-transformation/content-transformation-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContentTransformationPage() {
  const [sampleContent] = useState(`
    The Water Cycle

    The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. Water can change states among liquid, vapour, and ice at various places in the water cycle.

    The water cycle involves several key processes:

    1. Evaporation: The process where water changes from a liquid to a gas or vapour. Heat from the sun provides energy for evaporation.

    2. Transpiration: The process by which moisture is carried through plants from roots to small pores on the underside of leaves, where it changes to vapour and is released to the atmosphere.

    3. Condensation: The process where water vapour in the air is changed into liquid water. Condensation is crucial to the water cycle because it is responsible for the formation of clouds.

    4. Precipitation: When water molecules in clouds become too heavy, they fall to the earth as precipitation (rain, snow, hail, or sleet).

    5. Collection: Precipitation that falls onto land will flow downhill as runoff, eventually collecting in the oceans, lakes, and rivers. Some of the water soaks into the ground as infiltration, and some water flows underground as groundwater.

    The water cycle is essential for all life on Earth. It purifies water, replenishes the land with freshwater, and moves minerals around the globe.
  `);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Transformation</h1>
          <p className="text-muted-foreground">
            Transform educational content to match different learning styles and needs.
          </p>
        </div>
        
        <Tabs defaultValue="transform" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transform">Transform Content</TabsTrigger>
            <TabsTrigger value="about">About This Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transform" className="pt-4">
            <ContentTransformationEngine originalContent={sampleContent} contentType="lesson" subjectArea="Science" targetAge={10} />
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About Content Transformation</CardTitle>
                <CardDescription>
                  Understanding how this feature helps personalize learning experiences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Content Transformation?</h3>
                  <p>
                    Content Transformation is an AI-powered feature that adapts educational content to match different learning styles. 
                    It helps make learning more effective by presenting information in ways that align with how individuals best process and retain knowledge.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Learning Styles Supported</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Visual:</span> For learners who process information best through seeing. Content is enhanced with visual elements, spatial organisation, and visual metaphors.
                    </li>
                    <li>
                      <span className="font-medium">Auditory:</span> For learners who process information best through hearing. Content emphasizes dialogue, discussion points, and spoken explanations.
                    </li>
                    <li>
                      <span className="font-medium">Kinesthetic:</span> For learners who process information best through physical activities. Content incorporates hands-on activities, movement, and experiential learning.
                    </li>
                    <li>
                      <span className="font-medium">Reading/Writing:</span> For learners who process information best through text. Content is structured with lists, definitions, and written exercises.
                    </li>
                    <li>
                      <span className="font-medium">Multimodal:</span> A balanced approach that combines elements from all learning styles for comprehensive engagement.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">How It Works</h3>
                  <p>
                    The Content Transformation Engine uses advanced AI to analyse educational content and create optimised versions for each learning style. 
                    It maintains the educational objectives and factual accuracy while adapting the presentation format, examples, and activities to match different learning preferences.
                  </p>
                  <p className="mt-2">
                    The system can automatically detect your preferred learning style based on your Learning Style Assessment results, 
                    or you can manually select a different style to explore alternative approaches to the material.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personalized learning experiences that match individual preferences</li>
                    <li>Improved comprehension and retention of educational content</li>
                    <li>Reduced frustration and increased engagement with learning materials</li>
                    <li>Support for diverse learning needs in inclusive educational environments</li>
                    <li>Opportunity to explore content through different perspectives</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Evidence-Based Approach</h3>
                  <p>
                    This feature is grounded in educational research on learning styles and differentiated instruction. 
                    While maintaining a critical perspective on learning style theories, the system focuses on providing 
                    multiple representations of content that can benefit all learners regardless of preferred style.
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
