'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ParentCommunication from '@/components/parent-school/parent-communication';
import SharedGoalTracking from '@/components/parent-school/shared-goal-tracking';
import HomeStrategyLibrary from '@/components/parent-school/home-strategy-library';
import VirtualConferenceTools from '@/components/parent-school/virtual-conference-tools';

export default function ParentSchoolCollaborationHub() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Parent-School Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Strengthen the partnership between home and school with our comprehensive collaboration tools
        </p>
      </div>
      
      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Library</TabsTrigger>
          <TabsTrigger value="conferences">Conferences & Celebrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communication" className="mt-6">
          <ParentCommunication />
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <SharedGoalTracking />
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-6">
          <HomeStrategyLibrary />
        </TabsContent>
        
        <TabsContent value="conferences" className="mt-6">
          <VirtualConferenceTools />
        </TabsContent>
      </Tabs>
    </div>
  );
}
