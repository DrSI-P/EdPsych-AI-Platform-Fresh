'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Loader2, Save, Trash } from 'lucide-react';
import { createBrowserSpeechRecognition } from './browser-compatibility-layer';
import { useUKAccentRecognition } from './uk-accent-recognition';
import { KeyStage } from './age-appropriate-commands';

// Define types
type VoiceToTextProps = {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  keyStage?: KeyStage;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  autoFocus?: boolean;
};

/**
 * Voice-to-Text Component
 * 
 * This component provides voice input for content creation areas,
 * allowing users to dictate text instead of typing.
 * 
 * Features:
 * - UK accent recognition with children's speech pattern support
 * - Continuous dictation with real-time transcription
 * - Editing capabilities with voice and keyboard
 * - Punctuation commands (e.g., "full stop", "comma", "new line")
 * - Age-appropriate vocabulary and command recognition
 */
export default function VoiceToText({
  initialValue = '',
  placeholder = 'Click the microphone to start dictating...',
  onChange,
  onSave,
  keyStage = 'adult',
  className = '',
  disabled = false,
  maxLength,
  minRows = 3,
  maxRows = 10,
  autoFocus = false,
}: VoiceToTextProps) {
  // State
  const [text, setText] = useState<string>(initialValue);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
  const [cursorPosition, setCursorPosition] = useState<number>(initialValue.length);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Use UK accent recognition
  const accentRecognition = useUKAccentRecognition({
    initialAccent: keyStage === 'early_years' || keyStage === 'ks1' ? 'uk_children' : 'uk_general',
    adaptiveMode: true,
    sensitivityLevel: 75,
  });
  
  // Initialize speech recognition
  useEffect(() => {
    // Create recognition instance with browser compatibility
    const recognition = createBrowserSpeechRecognition({
      continuous: true,
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
    
    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      // Process the result with accent optimization
      const processedResult = accentRecognition.processRecognitionResult([{
        transcript: result[0].transcript,
        confidence: result[0].confidence
      }]);
      
      // Apply children's speech optimizations if needed
      let optimizedTranscript = accentRecognition.applyChildrenSpeechOptimizations(
        processedResult.transcript
      );
      
      // Process punctuation commands
      optimizedTranscript = processPunctuationCommands(optimizedTranscript);
      
      if (result.isFinal) {
        // Insert the transcript at the current cursor position
        insertTextAtCursor(optimizedTranscript);
      }
    };
    
    // Store recognition instance
    recognitionRef.current = recognition;
    
    // Cleanup
    return () => {
      if (recognitionRef.current?.isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [accentRecognition]);
  
  // Process punctuation commands
  const processPunctuationCommands = (transcript: string): string => {
    // Define punctuation command mappings
    const punctuationCommands: Record<string, string> = {
      'full stop': '.',
      'period': '.',
      'comma': ',',
      'question mark': '?',
      'exclamation mark': '!',
      'exclamation point': '!',
      'colon': ':',
      'semicolon': ';',
      'new line': '\n',
      'new paragraph': '\n\n',
      'open bracket': '(',
      'close bracket': ')',
      'open quote': '"',
      'close quote': '"',
      'hyphen': '-',
      'dash': '—',
      'underscore': '_',
      'percent': '%',
      'at sign': '@',
      'hashtag': '#',
      'dollar sign': '$',
      'pound sign': '£',
      'euro sign': '€',
    };
    
    // Process each command
    let processedText = transcript;
    
    Object.entries(punctuationCommands).forEach(([command, punctuation]) => {
      const regex = new RegExp(`\\b${command}\\b`, 'gi');
      processedText = processedText.replace(regex, punctuation);
    });
    
    return processedText;
  };
  
  // Insert text at cursor position
  const insertTextAtCursor = (newText: string) => {
    if (!newText) return;
    
    const newPosition = cursorPosition + newText.length;
    const newValue = text.substring(0, cursorPosition) + newText + text.substring(cursorPosition);
    
    setText(newValue);
    setCursorPosition(newPosition);
    
    // Call onChange if provided
    if (onChange) {
      onChange(newValue);
    }
    
    // Focus the textarea and set cursor position
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    }
  };
  
  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    
    // Call onChange if provided
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Handle textarea selection change
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionEnd || 0);
  };
  
  // Handle textarea click
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionEnd || 0);
  };
  
  // Handle textarea key up
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionEnd || 0);
  };
  
  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || !supported || disabled) return;
    
    recognitionRef.current.start();
  };
  
  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current || !supported) return;
    
    recognitionRef.current.stop();
  };
  
  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Clear text
  const clearText = () => {
    setText('');
    setCursorPosition(0);
    
    // Call onChange if provided
    if (onChange) {
      onChange('');
    }
    
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Save text
  const saveText = () => {
    if (onSave) {
      onSave(text);
    }
  };
  
  // If not supported, render with disabled microphone button
  if (!supported) {
    return (
      <div className={`voice-to-text ${className}`}>
        <div className="flex flex-col space-y-2">
          <Textarea
            ref={textareaRef}
            value={text}
            placeholder={placeholder}
            onChange={handleChange}
            onSelect={handleSelect}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
            disabled={disabled}
            className="min-h-[80px]"
            style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
            maxLength={maxLength}
            autoFocus={autoFocus}
          />
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled={true}
                title="Voice input is not supported in this browser"
              >
                <MicOff className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={clearText}
                disabled={disabled || !text}
                title="Clear text"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {onSave && (
              <Button
                variant="default"
                size="sm"
                onClick={saveText}
                disabled={disabled || !text}
                title="Save text"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
          <p className="text-xs text-red-500">
            Voice input is not supported in this browser. Try using Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }
  
  // Render the voice-to-text component
  return (
    <div className={`voice-to-text ${className}`}>
      <div className="flex flex-col space-y-2">
        <Textarea
          ref={textareaRef}
          value={text}
          placeholder={placeholder}
          onChange={handleChange}
          onSelect={handleSelect}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          disabled={disabled}
          className="min-h-[80px]"
          style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={toggleListening}
              disabled={disabled}
              className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
              title={isListening ? "Stop dictating" : "Start dictating"}
            >
              {isListening ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={clearText}
              disabled={disabled || !text}
              title="Clear text"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          {onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={saveText}
              disabled={disabled || !text}
              title="Save text"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
        {isListening && (
          <p className="text-xs text-green-600 animate-pulse">
            Listening... speak clearly.
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
        {keyStage === 'early_years' || keyStage === 'ks1' ? (
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700 font-medium">Voice Commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              <div className="text-xs">Say "full stop" for .</div>
              <div className="text-xs">Say "question mark" for ?</div>
              <div className="text-xs">Say "comma" for ,</div>
              <div className="text-xs">Say "new line" to start a new line</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Export the component
export { VoiceToText };
