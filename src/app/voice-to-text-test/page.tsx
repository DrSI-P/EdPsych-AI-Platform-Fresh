'use client';

import React from 'react';
import VoiceToTextTest from '@/components/voice-input/enhanced/voice-to-text-test';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Voice-to-Text Test Page
 * 
 * This page provides a testing interface for the voice-to-text functionality,
 * allowing developers to validate dictation capabilities across different key stages.
 */
export default function VoiceToTextTestPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice-to-Text System Test</h1>
        <p className="text-gray-600 mb-8">
          Use this page to test and validate the voice-to-text functionality, including
          dictation, punctuation commands, and age-appropriate vocabulary recognition.
        </p>
        
        <VoiceToTextTest />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
