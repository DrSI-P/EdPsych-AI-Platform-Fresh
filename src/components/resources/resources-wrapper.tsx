'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const ResourcesClient = dynamic(
  () => import('@/components/resources/resources-client'),
  { ssr: false }
);

export default function ResourcesWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Resource Library...</div>}>
      <ResourcesClient />
    </Suspense>
  );
}