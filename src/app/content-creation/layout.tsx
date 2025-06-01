'use client';

import React from 'react';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

export default function ContentCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
