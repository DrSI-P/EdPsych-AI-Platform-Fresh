'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AccessibilityControls component with SSR disabled
const AccessibilityControls = dynamic(
  () => import('@/components/ai/accessibility/accessibility-controls').then(mod => ({ default: mod.AccessibilityControls })),
  { ssr: false }
);

export default function AccessibilityClient() {
  const [settings, setSettings] = useState({
    enabled: true,
    screenReaderOptimization: false,
    highContrastMode: false,
    textToSpeech: false,
    speechToText: false,
    keyboardNavigation: false,
    reducedMotion: false,
    dyslexiaFriendlyMode: false,
    colorBlindnessMode: false,
    focusMode: false
  });
  
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
        <p className="text-muted-foreground">
          Customise your experience to meet your individual needs and preferences. These settings will be applied across the entire platform.
        </p>
      </div>
      
      <AccessibilityControls 
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}