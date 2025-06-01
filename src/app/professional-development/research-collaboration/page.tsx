'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResearchCollaboration from '@/components/professional-development/research-collaboration';
import ResearchCollaborationDashboard from '@/components/professional-development/research-collaboration-dashboard';

export default function ResearchCollaborationPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <ResearchCollaboration />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <ResearchCollaborationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
