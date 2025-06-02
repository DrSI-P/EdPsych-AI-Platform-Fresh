'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
// This helps avoid the stack overflow issues during build
const EmotionalPatternRecognitionClient = dynamic(
  () => import('@/components/special-needs/emotional-regulation/pattern-recognition/emotional-pattern-recognition'),
  { 
    ssr: false,
    loading: () => <PatternRecognitionFallback />
  }
);

// Fallback component shown during loading
function PatternRecognitionFallback() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Emotional Pattern Recognition</h1>
        <p className="text-muted-foreground mb-6">
          Discover patterns in your emotional experiences to gain deeper insights
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {['Most Common Emotion', 'Highest Intensity', 'Time Patterns', 'Trigger Analysis'].map((title) => (
            <div key={title} className="p-6 border rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">{title}</h3>
              <p className="text-2xl font-bold">--</p>
            </div>
          ))}
        </div>
        
        <div className="p-8 border rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Pattern Analysis</h2>
          <p>
            The interactive pattern recognition dashboard will be available in client mode. 
            This static version is shown during loading.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component
export default function PatternRecognitionWrapper() {
  return <EmotionalPatternRecognitionClient />;
}