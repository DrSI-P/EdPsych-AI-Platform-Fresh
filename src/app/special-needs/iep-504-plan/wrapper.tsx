'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the IEP504PlanEngine component with SSR disabled
const IEP504PlanEngine = dynamic(
  () => import('@/components/special-needs/iep-504-plan/iep-504-plan-engine'),
  { 
    ssr: false,
    loading: () => <IEP504PlanFallback />
  }
);

// Fallback component to show while the main component is loading
function IEP504PlanFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[50px] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-[20px] w-3/4 rounded-md" />
        <Skeleton className="h-[20px] w-1/2 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
      <Skeleton className="h-[100px] w-full rounded-md" />
    </div>
  );
}

// Wrapper component that uses the dynamically imported component
export default function IEP504PlanWrapper() {
  return <IEP504PlanEngine />;
}