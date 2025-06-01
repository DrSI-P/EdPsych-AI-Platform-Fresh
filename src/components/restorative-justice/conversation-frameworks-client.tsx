'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the actual component with SSR disabled
const ConversationFrameworksContent = dynamic(
  () => import('@/components/restorative-justice/conversation-frameworks-content'),
  { ssr: false }
);

export default function ClientPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Loading conversation frameworks...</div>}>
      <ConversationFrameworksContent />
    </Suspense>
  );
}