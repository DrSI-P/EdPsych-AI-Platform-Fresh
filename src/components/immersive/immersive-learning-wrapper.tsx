'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const ImmersiveLearningClient = dynamic(
  () => import('@/components/immersive/immersive-learning-client'),
  { ssr: false }
);

export default function ImmersiveLearningWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Immersive Learning Experiences...</div>}>
      <ImmersiveLearningClient />
    </Suspense>
  );
}