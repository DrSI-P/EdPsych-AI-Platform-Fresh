'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface TextToSpeechEngineProps {
  settings: {
    enabled: boolean;
    rate: number;
    pitch: number;
    volume: number;
    useUKVoice: boolean;
    highlightText: boolean;
    autoScroll: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

// Define SpeechSynthesisVoice interface
interface SpeechSynthesisVoiceType {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

declare global {
  interface Window {
    speechSynthesis: SpeechSynthesis;
  }
}

export const TextToSpeechEngine: React.FC<TextToSpeechEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoiceType[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoiceType | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  // Reference for speech synthesis utterance
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }
    
    // Get available voices
    const getVoices = (): void => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Select UK voice if available and enabled
      if (settings.useUKVoice) {
        const ukVoice = voices.find(voice => voice.lang.includes('en-GB'));
        if (ukVoice) {
          setSelectedVoice(ukVoice);
        } else {
          // Fallback to first English voice
          const englishVoice = voices.find(voice => voice.lang.includes('en'));
          if (englishVoice) {
            setSelectedVoice(englishVoice);
          } else if (voices.length > 0) {
            // Fallback to first available voice
            setSelectedVoice(voices[0]);
          }
        }
      } else if (voices.length > 0) {
        // Default to first voice
        setSelectedVoice(voices[0]);
      }
    };
    
    // Get voices on load
    getVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
    
    // Clean up on unmount
    return () => {
      stopSpeaking();
    };
  }, [settings.useUKVoice]);
  
  // Start speaking
  const startSpeaking = (): void => {
    if (!window.speechSynthesis || !speechSupported || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (selectedVoice) {
      utteranceRef.current.voice = selectedVoice;
    }
    
    // Set speech properties
    utteranceRef.current.rate = settings.rate;
    utteranceRef.current.pitch = settings.pitch;
    utteranceRef.current.volume = settings.volume;
    
    // Set event handlers
    utteranceRef.current.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utteranceRef.current);
  };
  
  // Stop speaking
  const stopSpeaking = (): void => {
    if (!window.speechSynthesis || !speechSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };
  
  // Pause speaking
  const pauseSpeaking = (): void => {
    if (!window.speechSynthesis || !speechSupported || !isSpeaking) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  };
  
  // Resume speaking
  const resumeSpeaking = (): void => {
    if (!window.speechSynthesis || !speechSupported || !isPaused) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  };
  
  // Toggle speaking
  const toggleSpeaking = (): void => {
    if (isSpeaking) {
      if (isPaused) {
        resumeSpeaking();
      } else {
        pauseSpeaking();
      }
    } else {
      startSpeaking();
    }
  };
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: number | boolean): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Apply settings to current utterance if speaking
    if (utteranceRef.current && isSpeaking) {
      if (setting === 'rate') {
        utteranceRef.current.rate = value as number;
      } else if (setting === 'pitch') {
        utteranceRef.current.pitch = value as number;
      } else if (setting === 'volume') {
        utteranceRef.current.volume = value as number;
      }
    }
    
    // Notify parent component
    onSettingsChange(updatedSettings);
  };
  
  return (
    <div className="text-to-speech-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Volume2 className="mr-2" /> Text to Speech
          </CardTitle>
          <CardDescription>
            Convert text to speech for easier comprehension
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-text-to-speech" className="flex items-center">
                Enable Text to Speech
              </Label>
              <input
                type="checkbox"
                id="enable-text-to-speech"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                disabled={!speechSupported}
                className="toggle"
              />
            </div>
            
            {!speechSupported && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Speech Synthesis Not Supported</AlertTitle>
                <AlertDescription>
                  Your browser does not support the Speech Synthesis API. Please try using Chrome, Edge, or Safari.
                </AlertDescription>
              </Alert>
            )}
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rate" className="text-sm">Rate: {settings.rate.toFixed(1)}x</Label>
                  <span className="text-xs text-gray-500">0.5 - 2.0</span>
                </div>
                <input
                  type="range"
                  id="rate"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => handleSettingChange('rate', parseFloat(e.target.value))}
                  disabled={!settings.enabled || !speechSupported}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="pitch" className="text-sm">Pitch: {settings.pitch.toFixed(1)}</Label>
                  <span className="text-xs text-gray-500">0.5 - 2.0</span>
                </div>
                <input
                  type="range"
                  id="pitch"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
                  disabled={!settings.enabled || !speechSupported}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="volume" className="text-sm">Volume: {Math.round(settings.volume * 100)}%</Label>
                  <span className="text-xs text-gray-500">0 - 100%</span>
                </div>
                <input
                  type="range"
                  id="volume"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                  disabled={!settings.enabled || !speechSupported}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use-uk-voice" className="flex items-center text-sm">
                  Use UK English Voice
                </Label>
                <input
                  type="checkbox"
                  id="use-uk-voice"
                  checked={settings.useUKVoice}
                  onChange={(e) => handleSettingChange('useUKVoice', e.target.checked)}
                  disabled={!settings.enabled || !speechSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-text" className="flex items-center text-sm">
                  Highlight Text While Speaking
                </Label>
                <input
                  type="checkbox"
                  id="highlight-text"
                  checked={settings.highlightText}
                  onChange={(e) => handleSettingChange('highlightText', e.target.checked)}
                  disabled={!settings.enabled || !speechSupported}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-scroll" className="flex items-center text-sm">
                  Auto-Scroll While Speaking
                </Label>
                <input
                  type="checkbox"
                  id="auto-scroll"
                  checked={settings.autoScroll}
                  onChange={(e) => handleSettingChange('autoScroll', e.target.checked)}
                  disabled={!settings.enabled || !speechSupported}
                  className="toggle toggle-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-to-speak" className="text-sm">Text to Speak</Label>
              <textarea
                id="text-to-speak"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!settings.enabled || !speechSupported}
                placeholder="Enter text to be spoken..."
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            
            {availableVoices.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="voice-select" className="text-sm">Voice</Label>
                <select
                  id="voice-select"
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(v => v.name === e.target.value);
                    if (voice) setSelectedVoice(voice);
                  }}
                  disabled={!settings.enabled || !speechSupported}
                  className="w-full p-2 border rounded-md"
                >
                  {availableVoices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={toggleSpeaking} 
            disabled={!settings.enabled || !speechSupported || !text}
            className={`w-full ${isSpeaking && !isPaused ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
          >
            {isSpeaking ? (
              isPaused ? (
                <>
                  <Volume2 className="mr-2" /> Resume Speaking
                </>
              ) : (
                <>
                  <VolumeX className="mr-2" /> Pause Speaking
                </>
              )
            ) : (
              <>
                <Volume2 className="mr-2" /> Start Speaking
              </>
            )}
          </Button>
          
          {isSpeaking && (
            <Button 
              variant="outline"
              onClick={stopSpeaking}
              className="w-full"
            >
              Stop Speaking
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Adjust the rate and pitch settings to find the most comfortable listening experience. UK English voices are recommended for educational content aligned with the UK curriculum.
        </p>
      </div>
    </div>
  );
};
