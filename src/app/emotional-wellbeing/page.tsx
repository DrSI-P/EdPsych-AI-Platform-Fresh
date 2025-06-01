'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Metadata } from 'next';

// Dynamically import the EmotionalCheckin component with SSR disabled
const EmotionalCheckin = dynamic(
  () => import('@/components/ai/emotional-wellbeing/emotional-checkin'),
  { ssr: false }
);

export default function EmotionalWellbeingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emotional Well-being</h1>
          <p className="text-muted-foreground">
            Monitor and support your emotional health with daily check-ins and personalized strategies.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading emotional check-in tool...</div>}>
          <EmotionalCheckin />
        </Suspense>
      </div>
    </div>
  );
}
