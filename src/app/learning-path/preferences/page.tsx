'use client';

import React, { useEffect, useState } from 'react';
import { usePersonalizedLearning } from '@/lib/learning-path/use-personalized-learning';
import { LearningStylePreferences } from '@/components/learning-path/LearningStylePreferences';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import AvatarVideo from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

/**
 * Learning Style Preferences Page
 * 
 * This page allows users to set their learning style preferences.
 * It fetches the user's learning profile from the API and allows them to update it.
 */
export default function LearningStylePreferencesPage() {
  const userId = 'user-1'; // In a real app, this would come from authentication
  
  const {
    isLoading,
    error,
    userProfile,
    fetchUserProfile,
    updateUserProfile
  } = usePersonalizedLearning(userId);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const handleSaveProfile = async (profile: any) => {
    await updateUserProfile(profile);
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
        title="Learning Style Preferences"
        description="Understanding your learning style helps us personalize your learning experience. Everyone learns differently, and there's no right or wrong style!"
      />
      
      {isLoading ? (
        <Card className="w-full">
          <CardContent className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <LearningStylePreferences 
          userId={userId}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
