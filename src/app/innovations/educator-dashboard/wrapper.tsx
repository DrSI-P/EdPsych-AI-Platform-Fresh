'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
// This helps avoid the stack overflow issues during build
const EducatorDashboardClient = dynamic(
  () => import('./client').then(mod => mod.EducatorDashboardClient),
  { 
    ssr: false,
    loading: () => <DashboardFallback />
  }
);

// Fallback component shown during loading
function DashboardFallback() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Educator Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage your classroom, track student progress, and plan your curriculum
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {['Total Students', 'Average Attendance', 'Curriculum Progress', 'Assessment Completion'].map((title) => (
          <div key={title} className="p-6 border rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">{title}</h3>
            <p className="text-2xl font-bold">--</p>
          </div>
        ))}
      </div>
      
      <div className="p-8 border rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Dashboard Loading</h2>
        <p>
          The interactive dashboard will be available in client mode. 
          This static version is shown during server-side rendering.
        </p>
      </div>
    </div>
  );
}

// Wrapper component
export default function DashboardWrapper() {
  return <EducatorDashboardClient />;
}