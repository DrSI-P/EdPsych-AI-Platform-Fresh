'use client';

import React from 'react';
import { Metadata } from 'next';
import MentorMatchingDashboard from '@/components/professional-development/mentor-matching-dashboard';

export default function MentorMatchingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MentorMatchingDashboard />
    </div>
  );
}
