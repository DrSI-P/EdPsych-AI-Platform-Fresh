'use client';

import React from 'react';
import VoiceInputTestingFramework from '@/components/voice-input/enhanced/voice-input-testing-framework';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Voice Testing Framework Page
 * 
 * This page provides a comprehensive testing interface for the voice input system,
 * allowing validation with different UK accents and dialects.
 */
export default function VoiceTestingFrameworkPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice Input Testing Framework</h1>
        <p className="text-gray-600 mb-8">
          Use this framework to validate the voice recognition system with different UK accents and dialects.
          Test recognition accuracy and identify areas for improvement.
        </p>
        
        <VoiceInputTestingFramework />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
