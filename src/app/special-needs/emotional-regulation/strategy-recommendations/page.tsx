import React from 'react';
import { Metadata } from 'next';
import PersonalizedStrategyRecommendations from '@/components/special-needs/emotional-regulation/strategy-recommendations/personalized-strategy-recommendations';

export const metadata: Metadata = {
  title: 'Personalized Regulation Strategy Recommendations | EdPsych Connect',
  description: 'Discover personalized emotional regulation strategies tailored to your unique patterns and preferences.',
};

export default function PersonalizedStrategyRecommendationsPage() {
  return (
    <div className="container mx-auto py-8">
      <PersonalizedStrategyRecommendations />
    </div>
  );
}
