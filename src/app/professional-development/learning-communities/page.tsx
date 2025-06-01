'use client';

import React from 'react';
import LearningCommunities from '@/components/professional-development/learning-communities';

// Metadata should not be exported from client components
// Removed the metadata export to fix the React Server Components error

export default function LearningCommunitiesPage() {
  return (
    <div>
      <LearningCommunities />
    </div>
  );
}
