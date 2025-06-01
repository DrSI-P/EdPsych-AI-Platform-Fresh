'use client';

import React from 'react';
import StaffTrainingModules from '@/components/restorative-justice/staff-training/staff-training-modules';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/common/access-denied';

export default function StaffTrainingPage() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  
  // Check if user is authenticated
  if (!session && !isLoading) {
    return <AccessDenied />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Staff Training on Restorative Approaches</h1>
        <p className="text-lg">
          Evidence-based professional development resources to support educators in effectively implementing
          restorative practices in educational settings. These comprehensive modules are designed to build
          knowledge, skills, and confidence in using restorative approaches to create positive school communities.
        </p>
      </div>
      
      <StaffTrainingModules />
    </div>
  );
}
