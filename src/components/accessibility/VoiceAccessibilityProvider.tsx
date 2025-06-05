'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceAccessibilityContextType {
  isEnabled: boolean;
  isReading: boolean;
  toggleVoiceAccessibility: () => void;
  readText: (text: string) => void;
  stopReading: () => void;
  readPageContent: () => void;
}

const VoiceAccessibilityContext = createContext<VoiceAccessibilityContextType | undefined>(undefined);

export function VoiceAccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Load user preference
      const savedPreference = localStorage.getItem('voiceAccessibilityEnabled');
      if (savedPreference === 'true') {
        setIsEnabled(true);
      }
    }
  }, []);

  const toggleVoiceAccessibility = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('voiceAccessibilityEnabled', newState.toString());
    
    if (!newState && isReading) {
      stopReading();
    }
  };

  const readText = (text: string) => {
    if (!speechSynthesis || !isEnabled || !text.trim()) return;

    // Stop any current reading
    stopReading();

    // Clean text for better speech
    const cleanText = text
      .replace(/[^\w\s.,!?;:-]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Try to use a clear English voice
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => {
      setIsReading(false);
      setCurrentUtterance(null);
    };
    utterance.onerror = () => {
      setIsReading(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsReading(false);
      setCurrentUtterance(null);
    }
  };

  const readPageContent = () => {
    if (!isEnabled) return;

    // Get main content areas
    const contentSelectors = [
      'main',
      '[role="main"]',
      '.main-content',
      'article',
      '.content',
      'h1, h2, h3',
      'p',
      '.description'
    ];

    let textToRead = '';

    // Try to get page title first
    const title = document.title;
    if (title) {
      textToRead += `Page: ${title}. `;
    }

    // Get main heading
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
      textToRead += `Main heading: ${mainHeading.textContent}. `;
    }

    // Get main content
    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length > 10 && text.length < 500) {
          textToRead += `${text}. `;
        }
      });
      
      if (textToRead.length > 500) break; // Limit length
    }

    if (textToRead.trim()) {
      readText(textToRead);
    } else {
      readText('Welcome to EdPsych Connect. This page contains educational content and tools.');
    }
  };

  return (
    <VoiceAccessibilityContext.Provider
      value={{
        isEnabled,
        isReading,
        toggleVoiceAccessibility,
        readText,
        stopReading,
        readPageContent,
      }}
    >
      {children}
    </VoiceAccessibilityContext.Provider>
  );
}

export function useVoiceAccessibility() {
  const context = useContext(VoiceAccessibilityContext);
  if (context === undefined) {
    throw new Error('useVoiceAccessibility must be used within a VoiceAccessibilityProvider');
  }
  return context;
}

