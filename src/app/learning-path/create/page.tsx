'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalizedLearning } from '@/lib/learning-path/use-personalized-learning';
import { LearningPathCreator } from '@/components/learning-path/LearningPathCreator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import AvatarVideo from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

/**
 * Create Learning Path Page
 * 
 * This page allows users to create a new personalized learning path.
 * It uses the LearningPathCreator component and connects it to the API.
 */
export default function CreateLearningPathPage() {
  const router = useRouter();
  const userId = 'user-1'; // In a real app, this would come from authentication
  
  const {
    isLoading,
    error,
    createLearningPath
  } = usePersonalizedLearning(userId);
  
  const handleCreatePath = async (subjectId: string, keyStage: string, params: any) => {
    const path = await createLearningPath(subjectId as any, keyStage as any, params);
    
    if (path) {
      // Navigate to the new path
      setTimeout(() => {
        router.push(`/learning-path/${path.id}`);
      }, 1500);
    }
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
      
      <AvatarVideo 
        title="Create Learning Path"
        description="Create a personalized learning path tailored to your needs, interests, and learning style. You can choose the subject, difficulty level, and specific topics to focus on."
      />
      
      {isLoading ? (
        <Card className="w-full">
          <CardContent className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <LearningPathCreator 
          userId={userId} 
          onCreatePath={handleCreatePath}
        />
      )}
    </div>
  );
}
