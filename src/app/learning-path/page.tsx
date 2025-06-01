'use client';

import React, { useEffect, useState } from 'react';
import { usePersonalizedLearning } from '@/lib/learning-path/use-personalized-learning';
import { LearningPathDashboard } from '@/components/learning-path/LearningPathDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Learning Path Dashboard Page
 * 
 * This page displays all learning paths for the user and allows them to create new ones.
 * It fetches learning paths data from the API and passes it to the LearningPathDashboard component.
 */
export default function LearningPathDashboardPage() {
  const userId = 'user-1'; // In a real app, this would come from authentication
  
  const {
    isLoading,
    error,
    learningPaths,
    fetchLearningPaths
  } = usePersonalizedLearning(userId);
  
  useEffect(() => {
    fetchLearningPaths();
  }, []);
  
  return (
    <div className="container mx-auto py-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <Card className="w-full">
          <CardContent className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <LearningPathDashboard 
          userId={userId} 
          activePaths={learningPaths.filter(path => path.overallProgress < 100)}
          completedPaths={learningPaths.filter(path => path.overallProgress === 100)}
        />
      )}
    </div>
  );
}
