'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the client component with SSR disabled
const AgeAppropriateDemoClient = dynamic(
  () => import('./client'),
  { 
    ssr: false,
    loading: () => <LoadingFallback />
  }
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-12 w-3/4 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-3">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        
        <div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        
        <div className="md:col-span-2">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
      
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/2 mb-6" />
        
        <Skeleton className="h-64 w-full rounded-lg mb-8" />
        <Skeleton className="h-64 w-full rounded-lg mb-8" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function AgeAppropriateDemoWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AgeAppropriateDemoClient />
    </Suspense>
  );
}