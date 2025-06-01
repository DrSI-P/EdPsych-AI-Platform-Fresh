'use client';

import React from 'react';
import { AgeAppropriateProvider } from '@/components/age-appropriate';
import { AgeAppropriateTest } from '@/components/age-appropriate/age-appropriate-test';

export default function AgeAppropriateTestPage() {
  return (
    <AgeAppropriateProvider>
      <AgeAppropriateTest />
    </AgeAppropriateProvider>
  );
}
