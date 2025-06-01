import React from 'react';
import { Metadata } from 'next';
import SafeDigitalExpressionSpaces from '@/components/special-needs/digital-expression/safe-digital-expression-spaces';

export const metadata: Metadata = {
  title: 'Safe Digital Expression Spaces | EdPsych Connect',
  description: 'Express yourself, reflect, and connect in a secure digital environment designed for emotional wellbeing and personal growth.',
};

export default function DigitalExpressionPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <SafeDigitalExpressionSpaces />
    </div>
  );
}
