'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CollaborativeGoalSetting from '@/components/student-voice/collaborative-goal-setting';

// Create a placeholder component since the original file is incomplete
const StudentLedConferenceTool = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student-Led Conference Tool</CardTitle>
        <CardDescription>
          This tool helps students prepare and lead their own academic conferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Student-led conference functionality will be available soon.</p>
      </CardContent>
    </Card>
  );
};

export default function StudentVoiceExpansionClient() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Student Voice Expansion</h1>
        <p className="text-xl text-muted-foreground">
          Tools for student-led conferences and collaborative goal setting
        </p>
      </div>
      
      <Tabs defaultValue="conferences" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="conferences">Student-Led Conferences</TabsTrigger>
          <TabsTrigger value="goals">Collaborative Goal Setting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conferences">
          <StudentLedConferenceTool />
        </TabsContent>
        
        <TabsContent value="goals">
          <CollaborativeGoalSetting />
        </TabsContent>
      </Tabs>
    </div>
  );
}