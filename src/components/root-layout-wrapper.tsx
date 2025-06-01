'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { VoiceInputProvider } from '@/components/VoiceInput';
import DynamicGlobalVoiceInput from '@/components/voice-input/dynamic-global-voice-input';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import { useSession } from 'next-auth/react';
import { PWAProvider } from '@/components/pwa/PWAProvider';
import { PWAServiceWorkerManager } from '@/components/pwa/PWAServiceWorkerManager';
import { OfflineBanner } from '@/components/pwa/OfflineBanner';
import { OfflineContentManager } from '@/components/pwa/OfflineContentManager';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';

// Define the user type with optional yearGroup property
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  yearGroup?: number;
}

/**
 * Root Layout Wrapper Component
 *
 * This component should be added to the root layout to provide:
 * 1. Voice input capabilities through a global floating component
 * 2. Accessibility controls for font size, contrast, motion, etc.
 * 3. Integration between voice input and accessibility features
 * 4. Progressive Web App functionality and offline support
 * 5. Installation prompts and offline content management
 *
 * It ensures these features are consistently available throughout the application
 * and are properly adapted to the user's needs and preferences.
 */
export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const { data: session } = useSession();
  
  // Determine if we should show the voice input on this page
  // Exclude it from pages where it might interfere with specialised voice interfaces
  const shouldShowVoiceInput = !pathname.includes('/voice-input-test');
  
  // Determine if we should show the install prompt
  // Don't show on login, register, or offline pages
  const shouldShowInstallPrompt = !pathname.includes('/login') && 
                                 !pathname.includes('/register') &&
                                 !pathname.includes('/offline');
  
  // Determine user age group based on session data if available
  const getUserAgeGroup = () => {
    if (!session?.user) return 'late-primary'; // Default
    
    // In a real implementation, this would use actual user data
    // For now, we'll use a simple mapping based on role
    const user = session.user as User;
    const role = user.role;
    if (role === 'STUDENT') {
      const yearGroup = user.yearGroup || 0;
      if (yearGroup <= 2) return 'nursery';
      if (yearGroup <= 5) return 'early-primary';
      if (yearGroup <= 8) return 'late-primary';
      return 'secondary';
    }
    
    return 'secondary'; // Default for non-students
  };
  
  return (
    <PWAProvider>
      <VoiceInputProvider>
        {/* Offline banner - shows when user is offline */}
        <OfflineBanner className="sticky top-0 z-50" />
        
        {/* Main content */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Offline content manager - handles content for offline use */}
          <OfflineContentManager />
          
          {/* Installation prompt - shows when app is installable */}
          {shouldShowInstallPrompt && <InstallPrompt />}
        </div>
        
        {/* Global accessibility controls */}
        <AccessibilityControls
          position="bottom-right"
          initialFontSize={16}
          initialContrast="normal"
          initialReduceMotion={false}
          initialDyslexicFont={false}
        />
        
        {/* Global voice input component */}
        {shouldShowVoiceInput && <DynamicGlobalVoiceInput />}
        
        {/* PWA service worker manager - handles updates */}
        <PWAServiceWorkerManager />
      </VoiceInputProvider>
    </PWAProvider>
  );
}

export default RootLayoutWrapper;
