import React from 'react';
import { Metadata } from 'next';
import PatternRecognitionWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'Emotional Pattern Recognition | EdPsych Connect',
  description: 'Discover patterns in your emotional experiences to gain deeper insights and improve emotional regulation skills.',
};

export default function EmotionalPatternRecognitionPage() {
  return (
    <div className="container mx-auto py-8">
      <PatternRecognitionWrapper />
    </div>
  );
}
