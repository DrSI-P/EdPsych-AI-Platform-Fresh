'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParentSchoolCollaboration from '@/components/parent-school/parent-school-collaboration';

export default function ParentSchoolCollaborationPage() {
  return (
    <div className="container mx-auto py-6">
      <ParentSchoolCollaboration />
    </div>
  );
}
