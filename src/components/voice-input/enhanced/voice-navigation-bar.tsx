'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useVoiceNavigation } from './voice-navigation-provider';
import { EnhancedVoiceInput } from './enhanced-voice-recognition';

type VoiceNavigationBarProps = {
  className?: string;
};

/**
 * Voice Navigation Bar Component
 * 
 * This component provides a global voice navigation interface that can be used
 * throughout the application. It integrates with the VoiceNavigationProvider
 * to handle voice commands and navigation.
 */
export default function VoiceNavigationBar({ className = '' }: VoiceNavigationBarProps) {
  const router = useRouter();
  const {
    isEnabled,
    toggleEnabled,
    executeCommand,
    availableCommands,
    keyStage,
    setKeyStage,
    isListening,
    startListening,
    stopListening
  } = useVoiceNavigation();
  
  // Handle voice transcript
  const handleTranscript = (transcript: string) => {
    // Process transcript for navigation commands
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Check for navigation commands
    if (lowerTranscript.startsWith('go to') || lowerTranscript.startsWith('navigate to')) {
      const destination = lowerTranscript.replace(/^(go to|navigate to)\s+/i, '').trim();
      handleNavigationCommand(destination);
      return;
    }
    
    // Check for registered commands
    executeCommand(lowerTranscript);
  };
  
  // Handle navigation commands
  const handleNavigationCommand = (destination: string) => {
    // Map common destinations to routes
    const routeMap: Record<string, string> = {
      'home': '/',
      'dashboard': '/dashboard',
      'profile': '/profile',
      'settings': '/settings',
      'help': '/help',
      'about': '/about',
      'contact': '/contact',
      'login': '/login',
      'register': '/register',
      'courses': '/courses',
      'lessons': '/lessons',
      'assessments': '/assessments',
      'resources': '/resources',
      'community': '/community',
      'forum': '/forum',
      'messages': '/messages',
      'notifications': '/notifications',
      'calendar': '/calendar',
      'timetable': '/timetable',
      'schedule': '/schedule',
      'progress': '/progress',
      'achievements': '/achievements',
      'badges': '/badges',
      'certificates': '/certificates',
      'reports': '/reports',
      'analytics': '/analytics',
      'students': '/students',
      'teachers': '/teachers',
      'parents': '/parents',
      'administrators': '/administrators',
      'curriculum': '/curriculum',
      'subjects': '/subjects',
      'topics': '/topics',
      'activities': '/activities',
      'games': '/games',
      'videos': '/videos',
      'audio': '/audio',
      'documents': '/documents',
      'worksheets': '/worksheets',
      'quizzes': '/quizzes',
      'tests': '/tests',
      'exams': '/exams',
      'projects': '/projects',
      'assignments': '/assignments',
      'feedback': '/feedback',
      'support': '/support',
      'faq': '/faq',
      'terms': '/terms',
      'privacy': '/privacy',
      'accessibility': '/accessibility',
    };
    
    // Check if destination exists in route map
    if (routeMap[destination]) {
      router.push(routeMap[destination]);
      return;
    }
    
    // If not found in map, try direct navigation
    try {
      router.push(`/${destination.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // In a real implementation, we would provide feedback to the user
    }
  };
  
  // Handle specific voice commands
  const handleCommand = (command: string) => {
    // Execute the command
    const success = executeCommand(command);
    
    if (!success) {
      // If command not found in registered commands, try navigation
      handleNavigationCommand(command);
    }
  };
  
  return (
    <div className={`voice-navigation-bar ${className}`}>
      <EnhancedVoiceInput
        onTranscript={handleTranscript}
        onCommand={handleCommand}
        keyStage={keyStage}
        buttonSize="md"
        continuous={false}
        disabled={!isEnabled}
        placeholder="Say a command..."
      />
    </div>
  );
}
