'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Mic,
  MicOff,
  Copy,
  Check
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface SpeechToTextEngineProps {
  settings: {
    enabled: boolean;
    autoCapitalization: boolean;
    punctuationPrediction: boolean;
    childVoiceOptimization: boolean;
    continuousListening: boolean;
    interimResults: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

interface RecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

// Define SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const SpeechToTextEngine: React.FC<SpeechToTextEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);
  
  // Reference for speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Timeout reference for reset copied state
  const copyTimeoutRef = useRef<number | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if speech recognition is supported
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setRecognitionSupported(false);
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.continuous = settings.continuousListening;
      recognitionRef.current.interimResults = settings.interimResults;
      recognitionRef.current.lang = 'en-GB'; // UK English
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setRecognitionError('');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        // Restart if continuous listening is enabled and no error occurred
        if (settings.continuousListening && !recognitionError && settings.enabled && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
          }
        }
      };
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let currentInterimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const resultTranscript = result[0].transcript;
          
          if (result.isFinal) {
            // Apply auto-capitalization if enabled
            let processedTranscript = resultTranscript;
            
            if (settings.autoCapitalization) {
              // Capitalize first letter of sentences
              processedTranscript = processedTranscript.replace(/(?:^|[.!?]\s+)([a-z])/g, (match, letter) => {
                return match.replace(letter, letter.toUpperCase());
              });
              
              // Capitalize 'I'
              processedTranscript = processedTranscript.replace(/\si\s/g, ' I ');
            }
            
            // Apply punctuation prediction if enabled
            if (settings.punctuationPrediction) {
              // Add period at the end if missing
              if (!/[.!?]$/.test(processedTranscript)) {
                processedTranscript += '.';
              }
            }
            
            finalTranscript += processedTranscript;
          } else {
            currentInterimTranscript += resultTranscript;
          }
        }
        
        setTranscript(prevTranscript => prevTranscript + finalTranscript);
        setInterimTranscript(currentInterimTranscript);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setRecognitionError(event.error);
        setIsListening(false);
      };
    }
    
    // Clean up on unmount
    return () => {
      stopListening();
      
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, [
    settings.enabled,
    settings.continuousListening,
    settings.interimResults,
    settings.autoCapitalization,
    settings.punctuationPrediction,
    recognitionError
  ]);
  
  // Start listening
  const startListening = (): void => {
    if (!recognitionRef.current || !recognitionSupported) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setRecognitionError('Failed to start speech recognition');
    }
  };
  
  // Stop listening
  const stopListening = (): void => {
    if (!recognitionRef.current || !recognitionSupported) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };
  
  // Toggle listening
  const toggleListening = (): void => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Clear transcript
  const clearTranscript = (): void => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  // Copy transcript to clipboard
  const copyTranscript = (): void => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript)
      .then(() => {
        setCopied(true);
        
        // Reset copied state after 2 seconds
        if (copyTimeoutRef.current) {
          window.clearTimeout(copyTimeoutRef.current);
        }
        
        copyTimeoutRef.current = window.setTimeout(() => {
          setCopied(false);
          copyTimeoutRef.current = null;
        }, 2000);
      })
      .catch(error => {
        console.error('Error copying transcript:', error);
      });
  };
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: boolean): void => {
    // Update settings
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Apply settings to recognition instance
    if (recognitionRef.current) {
      if (setting === 'continuousListening') {
        recognitionRef.current.continuous = value;
      } else if (setting === 'interimResults') {
        recognitionRef.current.interimResults = value;
      }
    }
    
    // Notify parent component
    onSettingsChange(updatedSettings);
  };
  
  return (
    <div className="speech-to-text-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Mic className="mr-2" /> Speech to Text
          </CardTitle>
          <CardDescription>
            Convert speech to text for easier input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-speech-to-text" className="flex items-center">
                Enable Speech to Text
              </Label>
              <input
                type="checkbox"
                id="enable-speech-to-text"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                disabled={!recognitionSupported}
                className="toggle"
              />
            </div>
            
            {!recognitionSupported && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Speech Recognition Not Supported</AlertTitle>
                <AlertDescription>
                  Your browser does not support the Speech Recognition API. Please try using Chrome, Edge, or Safari.
                </AlertDescription>
              </Alert>
            )}
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-capitalization" className="flex items-center text-sm">
                  Auto-Capitalization
                </Label>
                <input
                  type="checkbox"
                  id="auto-capitalization"
                  checked={settings.autoCapitalization}
                  onChange={(e) => handleSettingChange('autoCapitalization', e.target.checked)}
                  disabled={!settings.enabled || !recognitionSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="punctuation-prediction" className="flex items-center text-sm">
                  Punctuation Prediction
                </Label>
                <input
                  type="checkbox"
                  id="punctuation-prediction"
                  checked={settings.punctuationPrediction}
                  onChange={(e) => handleSettingChange('punctuationPrediction', e.target.checked)}
                  disabled={!settings.enabled || !recognitionSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="child-voice-optimization" className="flex items-center text-sm">
                  Child Voice Optimization
                </Label>
                <input
                  type="checkbox"
                  id="child-voice-optimization"
                  checked={settings.childVoiceOptimization}
                  onChange={(e) => handleSettingChange('childVoiceOptimization', e.target.checked)}
                  disabled={!settings.enabled || !recognitionSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="continuous-listening" className="flex items-center text-sm">
                  Continuous Listening
                </Label>
                <input
                  type="checkbox"
                  id="continuous-listening"
                  checked={settings.continuousListening}
                  onChange={(e) => handleSettingChange('continuousListening', e.target.checked)}
                  disabled={!settings.enabled || !recognitionSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="interim-results" className="flex items-center text-sm">
                  Show Interim Results
                </Label>
                <input
                  type="checkbox"
                  id="interim-results"
                  checked={settings.interimResults}
                  onChange={(e) => handleSettingChange('interimResults', e.target.checked)}
                  disabled={!settings.enabled || !recognitionSupported}
                  className="toggle toggle-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="transcript" className="text-sm">Transcript</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearTranscript}
                    disabled={!transcript && !interimTranscript}
                  >
                    Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyTranscript}
                    disabled={!transcript}
                    className="flex items-center"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <div 
                id="transcript" 
                className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 border rounded-md"
              >
                {transcript}
                {interimTranscript && (
                  <span className="text-gray-400">{interimTranscript}</span>
                )}
                {!transcript && !interimTranscript && (
                  <span className="text-gray-400">Start speaking to see transcript here...</span>
                )}
              </div>
            </div>
            
            {recognitionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Speech Recognition Error</AlertTitle>
                <AlertDescription>
                  {recognitionError === 'no-speech' ? 
                    'No speech was detected. Please try again.' : 
                    `Error: ${recognitionError}`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={toggleListening} 
            disabled={!settings.enabled || !recognitionSupported}
            className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2" /> Start Listening
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> For best results, speak clearly and at a moderate pace. This feature works best in a quiet environment.
        </p>
      </div>
    </div>
  );
};
