'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePersonalizedLearning } from '@/lib/learning-path/use-personalized-learning';
import { LearningPathAssessment } from '@/components/learning-path/LearningPathAssessment';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

/**
 * Learning Path Assessment Page
 * 
 * This page allows users to take assessments for a specific learning path.
 * It fetches the learning path data and assessment data from the API.
 */
export default function LearningPathAssessmentPage() {
  const params = useParams();
  const pathId = params.id as string;
  const userId = 'user-1'; // In a real app, this would come from authentication
  
  const {
    isLoading,
    error,
    currentPath,
    fetchLearningPath,
    submitAssessmentResult,
    updateUnitStatus
  } = usePersonalizedLearning(userId);
  
  useEffect(() => {
    if (pathId) {
      fetchLearningPath(pathId);
    }
  }, [pathId]);
  
  const handleSubmitAssessment = async (result: any) => {
    const assessmentResult = await submitAssessmentResult({
      ...result,
      userId
    });
    
    if (assessmentResult && result.unitId) {
      // Update the unit status based on the assessment result
      const status = assessmentResult.proficiencyLevel === 'mastered' ? 'mastered' : 'completed';
      const progress = 100;
      
      await updateUnitStatus(pathId, result.unitId, status, progress);
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
        title="Learning Path Assessment"
        description="Assessments help us understand your knowledge and adapt your learning path to your needs. Take your time and do your best!"
      />
      
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
        <LearningPathAssessment 
          pathId={pathId}
          userId={userId}
          path={currentPath}
          onSubmitAssessment={handleSubmitAssessment}
        />
      )}
    </div>
  );
}
