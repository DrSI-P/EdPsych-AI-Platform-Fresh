'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const AIAvatarClient = dynamic(
  () => import('@/components/ai-avatar/ai-avatar-client'),
  { ssr: false }
);

export default function AIAvatarWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading AI Avatar Creator...</div>}>
      <AIAvatarClient />
    </Suspense>
  );
}