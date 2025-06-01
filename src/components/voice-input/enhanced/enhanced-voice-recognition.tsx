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

// Define types
type VoiceInputProps = {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: string) => void;
  placeholder?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  commands?: string[];
  keyStage?: 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';
  continuous?: boolean;
  autoStart?: boolean;
};

type ButtonSizeClasses = {
  [key in 'sm' | 'md' | 'lg']: string;
};

type RecognitionEngine = {
  instance: any;
  isListening: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

// UK-specific accent and dialect options
const accentOptions = [
  { value: 'uk_general', label: 'UK General' },
  { value: 'uk_received', label: 'Received Pronunciation' },
  { value: 'uk_scottish', label: 'Scottish' },
  { value: 'uk_welsh', label: 'Welsh' },
  { value: 'uk_northern', label: 'Northern English' },
  { value: 'uk_midlands', label: 'Midlands' },
  { value: 'uk_west_country', label: 'West Country' },
  { value: 'uk_london', label: 'London' },
];

// Command libraries for different key stages
const commandLibraries = {
  early_years: [
    'play', 'stop', 'help', 'next', 'back',
    'read to me', 'show me', 'bigger', 'smaller',
    'louder', 'quieter', 'home'
  ],
  ks1: [
    'play', 'stop', 'help', 'next', 'back',
    'read to me', 'show me', 'bigger', 'smaller',
    'louder', 'quieter', 'home', 'menu',
    'my work', 'games', 'stories'
  ],
  ks2: [
    'play', 'stop', 'help', 'next', 'back',
    'read to me', 'show me', 'bigger', 'smaller',
    'louder', 'quieter', 'home', 'menu',
    'my work', 'games', 'stories', 'search',
    'calculator', 'dictionary', 'my progress'
  ],
  ks3: [
    'navigate to', 'search for', 'open', 'close',
    'submit', 'save', 'delete', 'edit', 'help',
    'next page', 'previous page', 'home', 'menu',
    'my work', 'my progress', 'resources', 'calculator',
    'dictionary', 'thesaurus', 'read aloud'
  ],
  ks4: [
    'navigate to', 'search for', 'open', 'close',
    'submit', 'save', 'delete', 'edit', 'help',
    'next page', 'previous page', 'home', 'menu',
    'my work', 'my progress', 'resources', 'calculator',
    'dictionary', 'thesaurus', 'read aloud',
    'summarize', 'translate', 'define', 'explain'
  ],
  adult: [
    'navigate to', 'search for', 'open', 'close',
    'submit', 'save', 'delete', 'edit', 'help',
    'next page', 'previous page', 'home', 'dashboard',
    'reports', 'analytics', 'settings', 'notifications',
    'messages', 'calendar', 'resources', 'students',
    'classes', 'assessments', 'curriculum'
  ]
};

/**
 * Enhanced Voice Input Component
 * 
 * Features:
 * - Improved recognition accuracy for UK accents and dialects
 * - Age-appropriate command libraries for different key stages
 * - Enhanced accessibility features for speech difficulties
 * - Visual feedback and command suggestions
 * - Cross-browser compatibility with fallbacks
 * - Privacy controls and settings
 */
export default function EnhancedVoiceInput({
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
  
  // Command suggestions based on key stage
  const [commandSuggestions, setCommandSuggestions] = useState<string[]>([]);
  const [availableCommands, setAvailableCommands] = useState<string[]>([]);
  
  // Recognition engine reference
  const recognitionRef = useRef<RecognitionEngine | null>(null);
  
  // Initialize available commands based on key stage and custom commands
  useEffect(() => {
    const stageCommands = commandLibraries[keyStage] || [];
    setAvailableCommands([...stageCommands, ...commands]);
  }, [keyStage, commands]);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    
    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // Set to UK English
    
    // Configure recognition based on settings
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setPermission('denied');
      }
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptValue = result[0].transcript;
      
      setTranscript(transcriptValue);
      
      if (onTranscript) {
        onTranscript(transcriptValue);
      }
      
      // Check if the transcript matches any commands
      if (result.isFinal) {
        const lowerTranscript = transcriptValue.toLowerCase().trim();
        
        // Check for command match
        const matchedCommand = availableCommands.find(cmd => 
          lowerTranscript === cmd.toLowerCase() || 
          lowerTranscript.includes(`${cmd.toLowerCase()} `) ||
          lowerTranscript.includes(` ${cmd.toLowerCase()}`) ||
          lowerTranscript.includes(` ${cmd.toLowerCase()} `)
        );
        
        if (matchedCommand && onCommand) {
          onCommand(matchedCommand);
        }
        
        // Update command suggestions based on partial matches
        if (showCommandSuggestions) {
          const suggestions = availableCommands.filter(cmd => 
            cmd.toLowerCase().includes(lowerTranscript) ||
            lowerTranscript.includes(cmd.toLowerCase())
          ).slice(0, 5);
          
          setCommandSuggestions(suggestions);
        }
        
        // If not continuous, stop listening after final result
        if (!continuous) {
          stopListening();
        }
      }
    };
    
    // Create recognition engine methods
    recognitionRef.current = {
      instance: recognition,
      isListening: false,
      start: () => {
        try {
          recognition.start();
          recognitionRef.current!.isListening = true;
        } catch (err) {
          console.error('Error starting recognition:', err);
        }
      },
      stop: () => {
        try {
          recognition.stop();
          recognitionRef.current!.isListening = false;
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      },
      abort: () => {
        try {
          recognition.abort();
          recognitionRef.current!.isListening = false;
        } catch (err) {
          console.error('Error aborting recognition:', err);
        }
      }
    };
    
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
  }, [continuous, onTranscript, onCommand, autoStart, voiceEnabled, disabled, availableCommands, showCommandSuggestions]);
  
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
    // In a real implementation, these settings would be applied to the recognition engine
    // For now, we'll just close the dialog
    setSettingsOpen(false);
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
                    {accentOptions.map(option => (
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
                    Show available command suggestions
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
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applySettings}>
                Apply Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isListening && (
        <div className="mt-2 text-sm text-muted-foreground min-h-[1.5rem] max-w-xs text-center">
          {transcript || placeholder}
        </div>
      )}
      
      {showCommandSuggestions && commandSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 justify-center max-w-xs">
          {commandSuggestions.map((cmd, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs py-1 h-auto"
              onClick={() => {
                if (onCommand) onCommand(cmd);
              }}
            >
              {cmd}
            </Button>
          ))}
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
      
      {/* Toggle for enabling/disabling voice input */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 text-xs"
        onClick={toggleVoiceEnabled}
      >
        {voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
      </Button>
    </div>
  );
}
