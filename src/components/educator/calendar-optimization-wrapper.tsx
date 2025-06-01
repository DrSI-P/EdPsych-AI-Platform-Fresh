'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled
const CalendarOptimization = dynamic(
  () => import('@/components/educator/calendar-optimization').then(mod => ({ default: mod.CalendarOptimization })),
  { ssr: false }
);

export default function CalendarOptimizationWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading Calendar Optimization...</div>}>
      <CalendarOptimization />
    </Suspense>
  );
}