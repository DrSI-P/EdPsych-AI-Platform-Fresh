'use client';

import React from 'react';
import { VoiceInputProvider } from '@/providers/voice-input-provider';
import GlobalVoiceInput from '@/components/voice-input/global-voice-input';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import { usePathname } from 'next/navigation';

/**
 * Accessibility Wrapper Component
 * 
 * This component wraps the entire application to provide:
 * 1. Voice input capabilities through a global floating component
 * 2. Accessibility controls for font size, contrast, motion, etc.
 * 3. Integration between voice input and accessibility features
 * 
 * It ensures these features are consistently available throughout the application
 * and are properly adapted to the user's needs and preferences.
 */
export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine if we should show the voice input on this page
  // Exclude it from pages where it might interfere with specialised voice interfaces
  const shouldShowVoiceInput = !pathname.includes('/voice-input-test');
  
  return (
    <VoiceInputProvider>
      {children}
      
      {/* Global accessibility controls */}
      <AccessibilityControls 
        position="bottom-right"
        initialFontSize={16}
        initialContrast="normal"
        initialReduceMotion={false}
        initialDyslexicFont={false}
      />
      
      {/* Global voice input component */}
      {shouldShowVoiceInput && <GlobalVoiceInput />}
    </VoiceInputProvider>
  );
}

export default AccessibilityWrapper;
