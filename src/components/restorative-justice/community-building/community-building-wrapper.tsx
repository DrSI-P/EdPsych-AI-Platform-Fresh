'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const CommunityBuildingActivities = dynamic(
  () => import('@/components/restorative-justice/community-building/community-building-activities'),
  { ssr: false }
);

export default function CommunityBuildingWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Community Building Activities...</div>}>
      <CommunityBuildingActivities />
    </Suspense>
  );
}