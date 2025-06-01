'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const CreateResourcesClient = dynamic(
  () => import('@/components/resources/create/create-resources-client'),
  { ssr: false }
);

export default function CreateResourcesWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Resource Creation Form...</div>}>
      <CreateResourcesClient />
    </Suspense>
  );
}