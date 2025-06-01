'use client';

import React from 'react';
import VoiceInputTest from '@/components/voice-input/enhanced/voice-input-test';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Voice Input Test Page
 * 
 * This page provides a testing interface for the enhanced voice input system,
 * allowing developers to validate browser compatibility, accent recognition,
 * and age-appropriate command libraries.
 */
export default function VoiceInputTestPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice Input System Test</h1>
        <p className="text-gray-600 mb-8">
          Use this page to test and validate the enhanced voice input system, including
          browser compatibility, UK accent recognition, and age-appropriate commands.
        </p>
        
        <VoiceInputTest />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
