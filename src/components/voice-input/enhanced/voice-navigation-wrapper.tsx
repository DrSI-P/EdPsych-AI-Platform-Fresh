'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { VoiceNavigationProvider, useVoiceNavigation } from './voice-navigation-provider';
import VoiceNavigationBar from './voice-navigation-bar';

type VoiceNavigationWrapperProps = {
  children: React.ReactNode;
  initialKeyStage?: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';
};

/**
 * Voice Navigation Wrapper Component
 * 
 * This component wraps the application with voice navigation capabilities.
 * It provides the VoiceNavigationProvider and registers global navigation commands.
 */
export default function VoiceNavigationWrapper({
  children,
  initialKeyStage = 'adult',
}: VoiceNavigationWrapperProps) {
  return (
    <VoiceNavigationProvider initialKeyStage={initialKeyStage}>
      <VoiceNavigationContent>
        {children}
      </VoiceNavigationContent>
    </VoiceNavigationProvider>
  );
}

/**
 * Voice Navigation Content Component
 * 
 * This component handles the registration of global navigation commands
 * and renders the VoiceNavigationBar alongside the application content.
 */
function VoiceNavigationContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { registerCommand, unregisterCommand } = useVoiceNavigation();
  
  // Register global navigation commands
  useEffect(() => {
    // Home navigation
    registerCommand({
      command: 'go home',
      action: () => router.push('/'),
      description: 'Navigate to the home page',
    });
    
    // Back navigation
    registerCommand({
      command: 'go back',
      action: () => router.back(),
      description: 'Navigate to the previous page',
    });
    
    // Help navigation
    registerCommand({
      command: 'help',
      action: () => router.push('/help'),
      description: 'Navigate to the help page',
    });
    
    // Settings navigation
    registerCommand({
      command: 'settings',
      action: () => router.push('/settings'),
      description: 'Navigate to the settings page',
    });
    
    // Profile navigation
    registerCommand({
      command: 'profile',
      action: () => router.push('/profile'),
      description: 'Navigate to your profile',
    });
    
    // Dashboard navigation
    registerCommand({
      command: 'dashboard',
      action: () => router.push('/dashboard'),
      description: 'Navigate to your dashboard',
    });
    
    // Early years specific commands
    registerCommand({
      command: 'show games',
      action: () => router.push('/games'),
      description: 'Navigate to games',
      keyStage: 'early_years',
    });
    
    registerCommand({
      command: 'show stories',
      action: () => router.push('/stories'),
      description: 'Navigate to stories',
      keyStage: 'early_years',
    });
    
    // KS1-KS2 specific commands
    registerCommand({
      command: 'my work',
      action: () => router.push('/my-work'),
      description: 'Navigate to my work',
      keyStage: 'ks1',
    });
    
    registerCommand({
      command: 'my work',
      action: () => router.push('/my-work'),
      description: 'Navigate to my work',
      keyStage: 'ks2',
    });
    
    // KS3-KS4 specific commands
    registerCommand({
      command: 'my progress',
      action: () => router.push('/progress'),
      description: 'Navigate to my progress',
      keyStage: 'ks3',
    });
    
    registerCommand({
      command: 'my progress',
      action: () => router.push('/progress'),
      description: 'Navigate to my progress',
      keyStage: 'ks4',
    });
    
    // Educator specific commands
    registerCommand({
      command: 'my students',
      action: () => router.push('/students'),
      description: 'Navigate to my students',
      keyStage: 'adult',
    });
    
    registerCommand({
      command: 'analytics',
      action: () => router.push('/analytics'),
      description: 'Navigate to analytics',
      keyStage: 'adult',
    });
    
    // Clean up on unmount
    return () => {
      unregisterCommand('go home');
      unregisterCommand('go back');
      unregisterCommand('help');
      unregisterCommand('settings');
      unregisterCommand('profile');
      unregisterCommand('dashboard');
      unregisterCommand('show games');
      unregisterCommand('show stories');
      unregisterCommand('my work');
      unregisterCommand('my progress');
      unregisterCommand('my students');
      unregisterCommand('analytics');
    };
  }, [registerCommand, unregisterCommand, router]);
  
  return (
    <>
      <div className="voice-navigation-wrapper">
        {children}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <VoiceNavigationBar />
      </div>
    </>
  );
}
