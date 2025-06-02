'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
// This helps avoid the stack overflow issues during build
const TransitionPlanningEngineClient = dynamic(
  () => import('@/components/special-needs/transition-planning/transition-planning-engine'),
  { 
    ssr: false,
    loading: () => <TransitionPlanningFallback />
  }
);

// Fallback component shown during loading
function TransitionPlanningFallback() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Transition Planning Tools</h1>
        <p className="text-muted-foreground mb-6">
          Create and manage transition plans for educational changes
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {['Dashboard', 'Create Plan', 'Edit Plan', 'Resources'].map((title) => (
            <div key={title} className="p-6 border rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ))}
        </div>
        
        <div className="p-8 border rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Transition Planning Tools</h2>
          <p>
            The interactive transition planning tools will be available in client mode. 
            This static version is shown during loading.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component
export default function TransitionPlanningWrapper() {
  return <TransitionPlanningEngineClient />;
}