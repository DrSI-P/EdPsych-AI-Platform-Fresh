'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
// This helps avoid the stack overflow issues during build
const ParentTeacherCommunicationClient = dynamic(
  () => import('@/components/special-needs/parent-teacher-communication/parent-teacher-communication'),
  { 
    ssr: false,
    loading: () => <CommunicationFallback />
  }
);

// Fallback component shown during loading
function CommunicationFallback() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Parent-Teacher-Student Emotional Communication</h1>
        <p className="text-muted-foreground mb-6">
          Collaborate on emotional wellbeing through secure, structured communication channels
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {['Messages', 'Meetings', 'Reports'].map((title) => (
            <div key={title} className="p-6 border rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ))}
        </div>
        
        <div className="p-8 border rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Communication Tools</h2>
          <p>
            The interactive communication tools will be available in client mode. 
            This static version is shown during loading.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper component
export default function ParentTeacherCommunicationWrapper() {
  return <ParentTeacherCommunicationClient />;
}