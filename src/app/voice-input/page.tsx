"use client";

import React from 'react';
import { VoiceInputProvider } from '@/providers/voice-input-provider';
import { VoiceInputIntegrationManager } from '@/components/voice-input/VoiceInputIntegrationManager';
import dynamic from 'next/dynamic';

/**
 * Voice Input Integration Page
 *
 * This page provides access to the comprehensive voice input integration features
 * of the EdPsych-AI-Education-Platform, including cross-platform integration settings
 * and special educational needs support.
 */

// Use dynamic import to ensure this component only renders on the client side
const VoiceInputPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Voice Input Integration</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive voice input capabilities across the platform with special educational needs support
      </p>
      
      <VoiceInputProvider>
        <VoiceInputIntegrationManager />
      </VoiceInputProvider>
    </div>
  );
};

// Use dynamic import with SSR disabled to prevent server-side rendering
export default dynamic(() => Promise.resolve(VoiceInputPage), {
  ssr: false
});
