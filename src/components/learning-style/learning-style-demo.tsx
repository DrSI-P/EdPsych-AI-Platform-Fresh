'use client';

import React from 'react';
import { LearningStyleProvider } from './learning-style-provider';
import LearningStyleDetector from './learning-style-detector';
import ContentAdapter from './content-adapter';
import LearningStylePreferences from './learning-style-preferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LearningStyleDemoProps {
  className?: string;
}

export const LearningStyleDemo: React.FC<LearningStyleDemoProps> = ({
  className = '',
}) => {
  const [showDetector, setShowDetector] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);
  
  const handleDetectionComplete = () => {
    setShowDetector(false);
  };
  
  return (
    <div className={`learning-style-demo ${className}`}>
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={() => {
            setShowDetector(true);
            setShowPreferences(false);
          }}
        >
          Take Learning Style Assessment
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setShowPreferences(true);
            setShowDetector(false);
          }}
        >
          Adjust Learning Preferences
        </Button>
      </div>
      
      {showDetector && (
        <div className="mb-8">
          <LearningStyleDetector onComplete={handleDetectionComplete} />
        </div>
      )}
      
      {showPreferences && (
        <div className="mb-8">
          <LearningStylePreferences />
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <ContentAdapter contentType="lesson">
          <Card>
            <CardHeader>
              <CardTitle>Sample Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This content is automatically adapted to your learning style and age group.
                The presentation, layout, and emphasis will change based on your preferences.
              </p>
              <h3 className="text-lg font-medium mb-2">Key Concepts</h3>
              <p>
                Learning styles represent different approaches to learning based on individual
                preferences for perceiving, processing, and retaining information.
              </p>
              <div className="mt-4 p-4 border rounded-md">
                <h4 className="font-medium mb-2">Interactive Element</h4>
                <p>
                  This section would contain interactive elements tailored to your
                  learning style.
                </p>
              </div>
            </CardContent>
          </Card>
        </ContentAdapter>
        
        <ContentAdapter contentType="activity">
          <Card>
            <CardHeader>
              <CardTitle>Sample Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Activities are adapted to match your learning preferences, making them
                more engaging and effective for your specific learning style.
              </p>
              <div className="p-4 border rounded-md mb-4">
                <h4 className="font-medium mb-2">Practice Exercise</h4>
                <p>
                  This activity would be customized based on your learning style,
                  with different approaches for visual, auditory, reading, or
                  kinesthetic learners.
                </p>
              </div>
              <Button className="w-full">Start Activity</Button>
            </CardContent>
          </Card>
        </ContentAdapter>
      </div>
    </div>
  );
};

export default function LearningStyleDemoWrapper({ className = '' }) {
  return (
    <LearningStyleProvider>
      <LearningStyleDemo className={className} />
    </LearningStyleProvider>
  );
}
