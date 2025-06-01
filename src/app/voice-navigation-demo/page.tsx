'use client';

import React from 'react';
import VoiceNavigationShortcuts from '@/components/voice-input/enhanced/voice-navigation-shortcuts';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Voice Navigation Shortcuts Demo Page
 * 
 * This page demonstrates the voice-controlled navigation shortcuts functionality,
 * allowing users to navigate the platform using voice commands.
 */
export default function VoiceNavigationShortcutsDemo() {
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Voice Navigation Shortcuts</h1>
        <p className="text-gray-600 mb-8">
          This page demonstrates voice-controlled navigation shortcuts that allow users to navigate
          the platform using voice commands. Try saying commands like "go to home", "navigate to about",
          or "go back" to test the functionality.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Navigation Commands</h2>
            <p className="text-gray-600 mb-4">
              Try these voice commands to navigate around the platform:
            </p>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-50 rounded">
                <strong>"Go to home"</strong> - Navigate to the home page
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <strong>"Navigate to about"</strong> - Navigate to the about page
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <strong>"Go to content creation"</strong> - Navigate to content creation
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <strong>"Go back"</strong> - Navigate to the previous page
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <strong>"Show menu"</strong> - Display the main menu
              </li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 mb-4">
              The voice navigation shortcuts component provides:
            </p>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-50 rounded">
                Quick access to voice navigation from any page
              </li>
              <li className="p-2 bg-gray-50 rounded">
                Customizable position and appearance
              </li>
              <li className="p-2 bg-gray-50 rounded">
                Age-appropriate command recognition
              </li>
              <li className="p-2 bg-gray-50 rounded">
                Visual feedback during listening
              </li>
              <li className="p-2 bg-gray-50 rounded">
                Settings for customization
              </li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Top Left Position</h3>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg relative">
              <VoiceNavigationShortcuts position="top-left" size="sm" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Look at the top left corner
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Bottom Right Position</h3>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg relative">
              <VoiceNavigationShortcuts position="bottom-right" size="md" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Look at the bottom right corner
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">Floating Position</h3>
            <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg relative">
              <VoiceNavigationShortcuts position="floating" size="lg" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Look at the floating button
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Available Pages for Navigation</h2>
          <p className="text-gray-600 mb-4">
            Try navigating to these pages using voice commands:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              Home
            </a>
            <a href="/about" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              About
            </a>
            <a href="/content-creation" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              Content Creation
            </a>
            <a href="/voice-input-test" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              Voice Input Test
            </a>
            <a href="/voice-to-text-test" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              Voice-to-Text Test
            </a>
            <a href="/content-creation-demo" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
              Content Creation Demo
            </a>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Global Voice Navigation</h2>
          <p className="text-gray-600 mb-4">
            The voice navigation shortcuts component is available globally throughout the platform.
            The floating button in the bottom right corner of every page provides quick access to
            voice navigation.
          </p>
          <p className="text-gray-600">
            Try clicking the microphone button and saying a navigation command to test it out!
          </p>
        </div>
      </div>
      
      {/* Global voice navigation shortcuts */}
      <VoiceNavigationShortcuts position="floating" size="lg" />
    </AgeAppropriateCommandsProvider>
  );
}
