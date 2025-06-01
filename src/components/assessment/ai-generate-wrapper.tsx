'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const AIAssessmentGeneratorClient = dynamic(
  () => import('@/components/assessment/ai-generate-client'),
  { ssr: false }
);

export default function AIAssessmentGeneratorWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading AI Assessment Generator...</div>}>
      <AIAssessmentGeneratorClient />
    </Suspense>
  );
}