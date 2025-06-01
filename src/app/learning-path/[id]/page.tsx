'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePersonalizedLearning } from '@/lib/learning-path/use-personalized-learning';
import { LearningPathView } from '@/components/learning-path/LearningPathView';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

/**
 * Learning Path View Page
 * 
 * This page displays a specific learning path and allows the user to interact with it.
 * It fetches the learning path data from the API and passes it to the LearningPathView component.
 */
export default function LearningPathViewPage() {
  const params = useParams();
  const pathId = params.id as string;
  const userId = 'user-1'; // In a real app, this would come from authentication
  
  const {
    isLoading,
    error,
    currentPath,
    fetchLearningPath,
    updateUnitStatus
  } = usePersonalizedLearning(userId);
  
  useEffect(() => {
    if (pathId) {
      fetchLearningPath(pathId);
    }
  }, [pathId]);
  
  const handleUpdateUnitStatus = async (unitId: string, status: string, progress: number) => {
    await updateUnitStatus(pathId, unitId, status, progress);
  };
  
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
      ) : !currentPath ? (
        <Card className="w-full">
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Learning Path Not Found</h2>
              <p className="text-muted-foreground">
                The learning path you're looking for could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <AvatarVideo 
            title="Learning Path"
            description="This is your personalized learning path. It's designed to help you progress through the curriculum at your own pace, focusing on your specific needs and interests."
          />
          
          <LearningPathView 
            pathId={pathId} 
            userId={userId} 
            path={currentPath}
            onUpdateUnitStatus={handleUpdateUnitStatus}
          />
        </>
      )}
    </div>
  );
}
