'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import our new browser compatibility and accent recognition modules
import { createBrowserSpeechRecognition, BrowserSpeechRecognition } from './browser-compatibility-layer';
import { ukAccentOptions, useUKAccentRecognition } from './uk-accent-recognition';
import { useAgeAppropriateCommands, KeyStage } from './age-appropriate-commands';

// Define types
type VoiceInputProps = {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: string) => void;
  placeholder?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  commands?: string[];
  keyStage?: KeyStage;
  continuous?: boolean;
  autoStart?: boolean;
};

type ButtonSizeClasses = {
  [key in 'sm' | 'md' | 'lg']: string;
};

/**
 * Enhanced Voice Recognition Component V2
 * 
 * Features:
 * - Cross-browser compatibility with fallbacks
 * - Improved recognition accuracy for UK accents and dialects
 * - Enhanced support for children's speech patterns
 * - Age-appropriate command libraries for different key stages
 * - Enhanced accessibility features for speech difficulties
 * - Visual feedback and command suggestions
 * - Privacy controls and settings
 */
export default function EnhancedVoiceRecognitionV2({
  onTranscript,
  onCommand,
  placeholder = 'Listening...',
  buttonSize = 'md',
  className = '',
  disabled = false,
  commands = [],
  keyStage = 'adult',
  continuous = false,
  autoStart = false,
}: VoiceInputProps) {
  // State for voice input
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  
  // State for settings
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [selectedAccent, setSelectedAccent] = useState<string>('uk_general');
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(75);
  const [adaptiveMode, setAdaptiveMode] = useState<boolean>(true);
  const [showCommandSuggestions, setShowCommandSuggestions] = useState<boolean>(true);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  
  // Command suggestions
  const [commandSuggestions, setCommandSuggestions] = useState<string[]>([]);
  
  // Recognition engine reference
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  
  // Use our UK accent recognition hook
  const accentRecognition = useUKAccentRecognition({
    initialAccent: selectedAccent,
    adaptiveMode,
    sensitivityLevel,
  });
  
  // Use our age-appropriate commands hook
  const { 
    getAvailableCommands, 
    findCommandByPhrase, 
    getSuggestions 
  } = useAgeAppropriateCommands();
  
  // Initialize speech recognition
  useEffect(() => {
    // Create recognition instance with browser compatibility
    const recognition = createBrowserSpeechRecognition({
      continuous,
      interimResults: true,
      lang: accentRecognition.getLanguageCode(),
    });
    
    // Update support status
    setSupported(recognition.isSupported);
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setPermission('denied');
      }
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      // Process the result with accent optimization
      const processedResult = accentRecognition.processRecognitionResult([{
        transcript: result[0].transcript,
        confidence: result[0].confidence
      }]);
      
      // Apply children's speech optimizations if needed
      const optimizedTranscript = accentRecognition.applyChildrenSpeechOptimizations(
        processedResult.transcript
      );
      
      setTranscript(optimizedTranscript);
      
      if (onTranscript) {
        onTranscript(optimizedTranscript);
      }
      
      // Check if the transcript matches any commands
      if (result.isFinal) {
        const lowerTranscript = optimizedTranscript.toLowerCase().trim();
        
        // Find matching command using our age-appropriate commands
        const matchedCommand = findCommandByPhrase(lowerTranscript);
        
        if (matchedCommand && onCommand) {
          onCommand(matchedCommand.phrase);
        }
        
        // Update command suggestions based on partial matches
        if (showCommandSuggestions) {
          const suggestions = getSuggestions(lowerTranscript)
            .map(cmd => cmd.phrase)
            .slice(0, 5);
          
          setCommandSuggestions(suggestions);
        }
        
        // If not continuous, stop listening after final result
        if (!continuous) {
          stopListening();
        }
      }
    };
    
    // Store recognition instance
    recognitionRef.current = recognition;
    
    // Check for auto-start
    if (autoStart && voiceEnabled && !disabled) {
      startListening();
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current?.isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [
    continuous, 
    onTranscript, 
    onCommand, 
    autoStart, 
    voiceEnabled, 
    disabled, 
    accentRecognition, 
    showCommandSuggestions,
    findCommandByPhrase,
    getSuggestions
  ]);
  
  // Start listening function
  const startListening = useCallback(() => {
    if (!recognitionRef.current || disabled || !voiceEnabled) return;
    
    recognitionRef.current.start();
    setTranscript('');
    setCommandSuggestions([]);
  }, [disabled, voiceEnabled]);
  
  // Stop listening function
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.stop();
  }, []);
  
  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Toggle voice input enabled state
  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (!newState && isListening) {
      stopListening();
    }
  };
  
  // Apply settings
  const applySettings = () => {
    // Update accent recognition settings
    accentRecognition.setSelectedAccent(selectedAccent);
    accentRecognition.setAdaptiveMode(adaptiveMode);
    accentRecognition.setSensitivityLevel(sensitivityLevel);
    
    // Close the dialog
    setSettingsOpen(false);
    
    // If currently listening, restart to apply new settings
    if (isListening) {
      stopListening();
      setTimeout(() => {
        startListening();
      }, 300);
    }
  };
  
  // Button size classes
  const buttonSizeClasses: ButtonSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  // If not supported, render a disabled button with tooltip
  if (!supported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${buttonSizeClasses[buttonSize]} ${className}`}
              disabled
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input is not supported in this browser.</p>
            <p className="text-xs mt-1">Try using Chrome, Edge, or Safari for voice input.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // If permission is denied, render a button to request permission
  if (permission === 'denied') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${buttonSizeClasses[buttonSize]} ${className}`}
              onClick={() => {
                // This will trigger a permission prompt in most browsers
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(() => {
                    setPermission('granted');
                    setError(null);
                  })
                  .catch(err => {
                    console.error('Error requesting microphone permission:', err);
                    setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
                  });
              }}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Microphone access denied. Click to request permission.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Render the enhanced voice input component
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                className={`${buttonSizeClasses[buttonSize]} ${isListening ? 'bg-red-500 hover:bg-red-600' : ''} ${!voiceEnabled ? 'opacity-50' : ''}`}
                onClick={toggleListening}
                disabled={disabled || !voiceEnabled}
              >
                {isListening ? (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop voice input' : 'Start voice input'}</p>
              {!voiceEnabled && <p>Voice input is disabled</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voice Input Settings</DialogTitle>
              <DialogDescription>
                Customize your voice input experience for better recognition.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accent" className="col-span-1">Accent</Label>
                <Select
                  value={selectedAccent}
                  onValueChange={setSelectedAccent}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent>
                    {ukAccentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sensitivity" className="col-span-1">Sensitivity</Label>
                <div className="col-span-3">
                  <Slider
                    id="sensitivity"
                    min={0}
                    max={100}
                    step={1}
                    value={[sensitivityLevel]}
                    onValueChange={(value) => setSensitivityLevel(value[0])}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adaptive-mode" className="col-span-1">Adaptive Mode</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="adaptive-mode"
                    checked={adaptiveMode}
                    onCheckedChange={setAdaptiveMode}
                  />
                  <Label htmlFor="adaptive-mode">
                    Adjust to your speech patterns over time
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="command-suggestions" className="col-span-1">Command Suggestions</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="command-suggestions"
                    checked={showCommandSuggestions}
                    onCheckedChange={setShowCommandSuggestions}
                  />
                  <Label htmlFor="command-suggestions">
                    Show command suggestions while speaking
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="privacy-mode" className="col-span-1">Privacy Mode</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="privacy-mode"
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                  <Label htmlFor="privacy-mode">
                    Don't store voice data
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={applySettings}>Apply Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Transcript display */}
      {transcript && (
        <div className="mt-2 text-sm text-gray-500">
          {transcript}
        </div>
      )}
      
      {/* Command suggestions */}
      {isListening && showCommandSuggestions && commandSuggestions.length > 0 && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md">
          <p className="text-xs text-gray-500 mb-1">Try saying:</p>
          <div className="flex flex-wrap gap-1">
            {commandSuggestions.map((suggestion, index) => (
              <span key={index} className="text-xs bg-white px-2 py-1 rounded-md border">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

// Export the component as both default and named export
export { EnhancedVoiceRecognitionV2 };
