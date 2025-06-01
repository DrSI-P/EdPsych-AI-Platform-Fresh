'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

interface VoiceInputContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  supported: boolean;
}

const VoiceInputContext = createContext<VoiceInputContextType | undefined>(undefined);

interface VoiceInputProviderProps {
  children: ReactNode;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export const VoiceInputProvider: React.FC<VoiceInputProviderProps> = ({
  children,
  language = 'en-GB',
  continuous = true,
  interimResults = true,
  maxAlternatives = 1,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Browser compatibility check
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.lang = language;
        recognitionInstance.continuous = continuous;
        recognitionInstance.interimResults = interimResults;
        recognitionInstance.maxAlternatives = maxAlternatives;
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          setError(null);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };
        
        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(prevTranscript => prevTranscript + finalTranscript);
        };
        
        setRecognition(recognitionInstance);
        setSupported(true);
      } else {
        setSupported(false);
        setError('Speech recognition is not supported in this browser.');
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language, continuous, interimResults, maxAlternatives]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start speech recognition.');
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const value = {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    supported
  };

  return (
    <VoiceInputContext.Provider value={value}>
      {children}
    </VoiceInputContext.Provider>
  );
};

export const useVoiceInput = (): VoiceInputContextType => {
  const context = useContext(VoiceInputContext);
  if (context === undefined) {
    throw new Error('useVoiceInput must be used within a VoiceInputProvider');
  }
  return context;
};
