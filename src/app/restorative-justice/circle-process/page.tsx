"use client";

import React from 'react';
import dynamic from 'next/dynamic';

/**
 * Circle Process Templates Page
 *
 * This page provides structured templates for conducting restorative circles
 * in educational settings, based on evidence-based restorative justice principles.
 */

// Use dynamic import with SSR disabled to prevent server-side rendering issues with useSession
const CircleProcessTemplates = dynamic(
  () => import('@/components/restorative-justice/circle-process/circle-process-templates'),
  { ssr: false }
);

export default function CircleProcessPage() {
  return (
    <div className="container mx-auto py-8">
      <CircleProcessTemplates />
    </div>
  );
}
