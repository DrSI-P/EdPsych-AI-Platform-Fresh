'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const StudentVoiceClient = dynamic(
  () => import('@/components/student-voice/student-voice-client'),
  { ssr: false }
);

export default function StudentVoiceWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Student Voice System...</div>}>
      <StudentVoiceClient />
    </Suspense>
  );
}