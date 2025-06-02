'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Extremely minimal wrapper to prevent stack overflow during build
export default function WebinarWrapper() {
  const [WebinarComponent, setWebinarComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only import the client component on the client side
    const loadComponent = async () => {
      try {
        // Dynamic import with explicit disabling of SSR
        const WebinarIntegration = (await import('@/components/professional-development/webinar-integration')).default;
        setWebinarComponent(() => WebinarIntegration);
      } catch (error) {
        console.error('Error loading webinar component:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, []);

  if (loading || !WebinarComponent) {
    return <WebinarFallback />;
  }

  return <WebinarComponent />;
}

// Fallback component shown during loading
function WebinarFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6 gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        
        <Skeleton className="h-12 w-full mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-centre">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}