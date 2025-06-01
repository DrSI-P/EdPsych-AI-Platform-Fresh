'use client';

import React from 'react';
import ContentCreationVoiceInput from '@/components/content/content-creation-voice-input';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Content Creation Page with Voice Input
 * 
 * This page demonstrates the integration of voice-to-text functionality
 * in content creation areas of the platform.
 */
export default function ContentCreationPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Content Creation</h1>
        <p className="text-gray-600 mb-8">
          Create various types of content using voice dictation. This feature helps students who
          struggle with typing to express their ideas more easily.
        </p>
        
        <ContentCreationVoiceInput />
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
