'use client';

import React from 'react';
import VoiceAnalyticsDashboard from '@/components/voice-input/enhanced/voice-analytics-dashboard';
import { VoiceAnalyticsProvider } from '@/components/voice-input/enhanced/voice-input-analytics';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Voice Analytics Dashboard Page
 * 
 * This page provides access to the voice analytics dashboard for monitoring
 * voice input usage across the platform.
 */
export default function VoiceAnalyticsPage() {
  return (
    <AgeAppropriateCommandsProvider>
      <VoiceAnalyticsProvider>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Voice Analytics Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Monitor and analyze voice input usage across the platform. This dashboard provides
            insights into how users are interacting with voice features, helping to identify
            areas for improvement and optimization.
          </p>
          
          <VoiceAnalyticsDashboard />
        </div>
      </VoiceAnalyticsProvider>
    </AgeAppropriateCommandsProvider>
  );
}
