'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define types for speech recognition
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
  message: string;
};

type SpeechRecognitionOptions = {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
};

// Define the browser compatibility layer interface
export interface BrowserSpeechRecognition {
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
}

/**
 * Creates a browser-compatible speech recognition instance
 * 
 * This function provides a unified interface for speech recognition across different browsers,
 * with fallbacks for browsers that don't support the Web Speech API.
 * 
 * @param options Configuration options for speech recognition
 * @returns A browser-compatible speech recognition instance
 */
export function createBrowserSpeechRecognition(options: SpeechRecognitionOptions = {}): BrowserSpeechRecognition {
  // Default options
  const defaultOptions = {
    continuous: false,
    interimResults: true,
    lang: 'en-GB',
    maxAlternatives: 1,
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Check if browser supports speech recognition
  const SpeechRecognition = 
    window.SpeechRecognition || 
    window.webkitSpeechRecognition || 
    window.mozSpeechRecognition || 
    window.msSpeechRecognition;
  
  // If speech recognition is not supported, return a mock implementation
  if (!SpeechRecognition) {
    console.warn('Speech recognition is not supported in this browser.');
    
    return {
      isSupported: false,
      isListening: false,
      start: () => console.warn('Speech recognition is not supported in this browser.'),
      stop: () => {},
      abort: () => {},
      onstart: null,
      onend: null,
      onerror: null,
      onresult: null,
      continuous: mergedOptions.continuous || false,
      interimResults: mergedOptions.interimResults || false,
      lang: mergedOptions.lang || 'en-GB',
      maxAlternatives: mergedOptions.maxAlternatives || 1,
    };
  }
  
  // Create recognition instance
  const recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = mergedOptions.continuous || false;
  recognition.interimResults = mergedOptions.interimResults || false;
  recognition.lang = mergedOptions.lang || 'en-GB';
  recognition.maxAlternatives = mergedOptions.maxAlternatives || 1;
  
  // Create browser-compatible interface
  const browserRecognition: BrowserSpeechRecognition = {
    isSupported: true,
    isListening: false,
    start: () => {
      try {
        recognition.start();
        browserRecognition.isListening = true;
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        if (browserRecognition.onerror) {
          browserRecognition.onerror({
            error: 'start_error',
            message: 'Error starting speech recognition',
          });
        }
      }
    },
    stop: () => {
      try {
        recognition.stop();
        browserRecognition.isListening = false;
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    },
    abort: () => {
      try {
        recognition.abort();
        browserRecognition.isListening = false;
      } catch (err) {
        console.error('Error aborting speech recognition:', err);
      }
    },
    onstart: null,
    onend: null,
    onerror: null,
    onresult: null,
    continuous: mergedOptions.continuous || false,
    interimResults: mergedOptions.interimResults || false,
    lang: mergedOptions.lang || 'en-GB',
    maxAlternatives: mergedOptions.maxAlternatives || 1,
  };
  
  // Set up event handlers
  recognition.onstart = () => {
    browserRecognition.isListening = true;
    if (browserRecognition.onstart) {
      browserRecognition.onstart();
    }
  };
  
  recognition.onend = () => {
    browserRecognition.isListening = false;
    if (browserRecognition.onend) {
      browserRecognition.onend();
    }
  };
  
  recognition.onerror = (event) => {
    browserRecognition.isListening = false;
    if (browserRecognition.onerror) {
      browserRecognition.onerror(event);
    }
  };
  
  recognition.onresult = (event) => {
    if (browserRecognition.onresult) {
      browserRecognition.onresult(event);
    }
  };
  
  return browserRecognition;
}

/**
 * Hook for using speech recognition with browser compatibility
 * 
 * This hook provides a unified interface for speech recognition across different browsers,
 * with fallbacks for browsers that don't support the Web Speech API.
 * 
 * @param options Configuration options for speech recognition
 * @returns Speech recognition state and controls
 */
export function useBrowserSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Recognition instance reference
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Create recognition instance
    const recognition = createBrowserSpeechRecognition(options);
    
    // Update support status
    setIsSupported(recognition.isSupported);
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptValue = result[0].transcript;
      
      setTranscript(transcriptValue);
    };
    
    // Store recognition instance
    recognitionRef.current = recognition;
    
    // Cleanup
    return () => {
      if (recognitionRef.current?.isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [options]);
  
  // Start listening function
  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    recognitionRef.current.start();
    setTranscript('');
  };
  
  // Stop listening function
  const stopListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    recognitionRef.current.stop();
  };
  
  // Return speech recognition state and controls
  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript(''),
  };
}
