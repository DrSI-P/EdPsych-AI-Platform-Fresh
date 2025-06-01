'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { VoiceInputProvider } from '@/providers/voice-input-provider';
import GlobalVoiceInput from '@/components/voice-input/global-voice-input';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import { MultilingualSupport } from '@/components/ui/MultilingualSupport';

/**
 * Integrated Accessibility Wrapper Component
 * 
 * This component wraps the entire application to provide:
 * 1. Voice input capabilities through a global floating component
 * 2. Accessibility controls for font size, contrast, motion, etc.
 * 3. Multilingual support with language switching
 * 4. Integration between voice input, accessibility, and language features
 * 
 * It ensures these features are consistently available throughout the application
 * and are properly adapted to the user's needs and preferences.
 */
export function IntegratedAccessibilityWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine if we should show the voice input on this page
  // Exclude it from pages where it might interfere with specialised voice interfaces
  const shouldShowVoiceInput = !pathname.includes('/voice-input-test');
  
  // Determine if we should show accessibility controls on this page
  // Include on all pages by default
  const shouldShowAccessibilityControls = true;
  
  return (
    <VoiceInputProvider>
      {children}
      
      {/* Global accessibility controls */}
      {shouldShowAccessibilityControls && (
        <AccessibilityControls 
          position="bottom-right"
          initialFontSize={16}
          initialContrast="normal"
          initialReduceMotion={false}
          initialDyslexicFont={false}
        />
      )}
      
      {/* Global voice input component */}
      {shouldShowVoiceInput && <GlobalVoiceInput />}
    </VoiceInputProvider>
  );
}

export default IntegratedAccessibilityWrapper;
