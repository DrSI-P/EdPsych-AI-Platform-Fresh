'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for voice navigation
type VoiceCommand = {
  command: string;
  action: () => void;
  description: string;
  keyStage?: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';
};

type VoiceNavigationContextType = {
  isEnabled: boolean;
  toggleEnabled: () => void;
  registerCommand: (command: VoiceCommand) => void;
  unregisterCommand: (command: string) => void;
  executeCommand: (command: string) => boolean;
  availableCommands: VoiceCommand[];
  keyStage: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';
  setKeyStage: (keyStage: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult') => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
};

// Create context
const VoiceNavigationContext = createContext<VoiceNavigationContextType | undefined>(undefined);

// Provider props
type VoiceNavigationProviderProps = {
  children: ReactNode;
  initialKeyStage?: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';
};

/**
 * Voice Navigation Provider
 * 
 * This provider manages voice commands and navigation throughout the application.
 * It allows components to register commands, execute them, and manage voice input state.
 */
export function VoiceNavigationProvider({
  children,
  initialKeyStage = 'adult',
}: VoiceNavigationProviderProps) {
  // State
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [keyStage, setKeyStage] = useState<'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult'>(initialKeyStage);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  // Toggle voice navigation enabled state
  const toggleEnabled = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    // If disabling, stop listening
    if (!newState && isListening) {
      stopListening();
    }
    
    // Store preference in localStorage
    localStorage.setItem('voiceNavigationEnabled', newState.toString());
  };
  
  // Register a new voice command
  const registerCommand = (command: VoiceCommand) => {
    setCommands(prevCommands => {
      // Check if command already exists
      const exists = prevCommands.some(cmd => cmd.command === command.command);
      
      if (exists) {
        // Replace existing command
        return prevCommands.map(cmd => 
          cmd.command === command.command ? command : cmd
        );
      } else {
        // Add new command
        return [...prevCommands, command];
      }
    });
  };
  
  // Unregister a voice command
  const unregisterCommand = (command: string) => {
    setCommands(prevCommands => 
      prevCommands.filter(cmd => cmd.command !== command)
    );
  };
  
  // Execute a voice command
  const executeCommand = (command: string): boolean => {
    // Find matching command
    const matchingCommand = commands.find(cmd => 
      cmd.command.toLowerCase() === command.toLowerCase() &&
      (!cmd.keyStage || cmd.keyStage === keyStage)
    );
    
    // Execute if found
    if (matchingCommand) {
      matchingCommand.action();
      return true;
    }
    
    return false;
  };
  
  // Start listening for voice commands
  const startListening = () => {
    if (!isEnabled) return;
    setIsListening(true);
    // In a real implementation, this would start the speech recognition
    // For now, we just update the state
  };
  
  // Stop listening for voice commands
  const stopListening = () => {
    setIsListening(false);
    // In a real implementation, this would stop the speech recognition
  };
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedEnabled = localStorage.getItem('voiceNavigationEnabled');
    if (storedEnabled !== null) {
      setIsEnabled(storedEnabled === 'true');
    }
    
    const storedKeyStage = localStorage.getItem('voiceNavigationKeyStage');
    if (storedKeyStage) {
      setKeyStage(storedKeyStage as any);
    }
    
    // Clean up on unmount
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);
  
  // Filter commands by key stage
  const availableCommands = commands.filter(cmd => 
    !cmd.keyStage || cmd.keyStage === keyStage
  );
  
  // Context value
  const value: VoiceNavigationContextType = {
    isEnabled,
    toggleEnabled,
    registerCommand,
    unregisterCommand,
    executeCommand,
    availableCommands,
    keyStage,
    setKeyStage: (newKeyStage) => {
      setKeyStage(newKeyStage);
      localStorage.setItem('voiceNavigationKeyStage', newKeyStage);
    },
    isListening,
    startListening,
    stopListening,
  };
  
  return (
    <VoiceNavigationContext.Provider value={value}>
      {children}
    </VoiceNavigationContext.Provider>
  );
}

/**
 * Hook to use voice navigation
 * 
 * This hook provides access to the voice navigation context.
 * Components can use this hook to register commands, execute them, and manage voice input state.
 */
export function useVoiceNavigation() {
  const context = useContext(VoiceNavigationContext);
  
  if (context === undefined) {
    throw new Error('useVoiceNavigation must be used within a VoiceNavigationProvider');
  }
  
  return context;
}
