"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Import the component dynamically to prevent SSR
const PersonalizedStrategyRecommendations = dynamic(
  () => import('@/components/special-needs/emotional-regulation/strategy-recommendations/personalized-strategy-recommendations'),
  { ssr: false }
);

export default function StrategyRecommendationsPage() {
  return (
    <div className="container mx-auto py-8">
      <PersonalizedStrategyRecommendations />
    </div>
  );
}
