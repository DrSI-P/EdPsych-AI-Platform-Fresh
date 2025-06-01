'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressTracking } from "@/components/analytics/student-progress-tracking";
import { EducatorPerformanceAnalytics } from "@/components/analytics/educator-performance-analytics";
import { ResourceAndAssessmentAnalytics } from "@/components/analytics/resource-and-assessment-analytics";
import CustomReportBuilder from "@/components/analytics/custom-report-builder";

export default function AnalyticsAndReportingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Comprehensive insights and custom reports for data-informed decision making
        </p>
      </div>
      
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
          <TabsTrigger value="educator">Educator Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources & Assessment</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-6">
          <StudentProgressTracking />
        </TabsContent>
        
        <TabsContent value="educator" className="mt-6">
          <EducatorPerformanceAnalytics />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <ResourceAndAssessmentAnalytics />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
