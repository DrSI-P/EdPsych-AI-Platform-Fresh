'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const ExpansionClient = dynamic(
  () => import('@/components/student-voice/expansion/expansion-client'),
  { ssr: false }
);

export default function ExpansionWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Student Voice Expansion...</div>}>
      <ExpansionClient />
    </Suspense>
  );
}