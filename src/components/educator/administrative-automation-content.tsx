'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutomatedDocumentation from '@/components/educator/automated-documentation';
import SmartLessonPlanning from '@/components/educator/smart-lesson-planning';

export default function AdministrativeAutomationContent() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Teacher Administrative Automation</h1>
      <p className="text-muted-foreground mb-8">
        AI-powered tools to reduce administrative burden and focus more on teaching
      </p>
      
      <Tabs defaultValue="documentation" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="documentation">Automated Documentation</TabsTrigger>
          <TabsTrigger value="lesson-planning">Smart Lesson Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documentation">
          <AutomatedDocumentation />
        </TabsContent>
        
        <TabsContent value="lesson-planning">
          <SmartLessonPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
}