import React from 'react';
import { Metadata } from 'next';
import GuidedMindfulnessActivities from '@/components/special-needs/mindfulness/guided-mindfulness-activities';

export const metadata: Metadata = {
  title: 'Guided Mindfulness Activities | EdPsych Connect',
  description: 'Discover and practise evidence-based mindfulness exercises to support emotional wellbeing and self-regulation.',
};

export default function GuidedMindfulnessActivitiesPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-8">
      <GuidedMindfulnessActivities />
    </div>
  );
}
