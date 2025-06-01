'use client';

import React, { useEffect, useState } from 'react';
import VoiceNavigationShortcuts from '@/components/voice-input/enhanced/voice-navigation-shortcuts';
import { AgeAppropriateCommandsProvider, KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Global Voice Navigation Component
 * 
 * This component provides global voice navigation capabilities throughout the application.
 * It should be included in the root layout to enable voice navigation on all pages.
 */
export default function GlobalVoiceNavigation() {
  // State for key stage
  const [keyStage, setKeyStage] = useState<KeyStage>('adult');
  
  // Load key stage from localStorage on mount
  useEffect(() => {
    const storedKeyStage = localStorage.getItem('voiceNavigationKeyStage');
    if (storedKeyStage) {
      setKeyStage(storedKeyStage as KeyStage);
    }
  }, []);
  
  return (
    <AgeAppropriateCommandsProvider initialKeyStage={keyStage}>
      <VoiceNavigationShortcuts 
        position="floating" 
        size="md" 
        keyStage={keyStage}
      />
    </AgeAppropriateCommandsProvider>
  );
}
