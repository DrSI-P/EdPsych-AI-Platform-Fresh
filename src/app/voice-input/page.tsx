"use client";

import React from 'react';
import { VoiceInputIntegrationManager } from '@/components/voice-input/VoiceInputIntegrationManager';

/**
 * Voice Input Integration Page
 * 
 * This page provides access to the comprehensive voice input integration features
 * of the EdPsych-AI-Education-Platform, including cross-platform integration settings
 * and special educational needs support.
 */
export default function VoiceInputIntegrationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Voice Input Integration</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive voice input capabilities across the platform with special educational needs support
      </p>
      
      <VoiceInputIntegrationManager />
    </div>
  );
}
