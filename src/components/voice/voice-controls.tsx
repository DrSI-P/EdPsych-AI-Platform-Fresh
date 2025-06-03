'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings,
  Headphones,
  MessageCircle
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VoiceControlsProps {
  onVoiceInput?: (text: string) => void;
  onSpeechToggle?: (enabled: boolean) => void;
  className?: string;
}

export default function VoiceControls({ 
  onVoiceInput, 
  onSpeechToggle, 
  className = "" 
}: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [volume, setVolume] = useState([80]);
  const [speechRate, setSpeechRate] = useState([1]);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-GB';

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onVoiceInput?.(transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = () => {
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);
    onSpeechToggle?.(newState);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate[0];
      utterance.volume = volume[0] / 100;
      utterance.lang = 'en-GB';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Voice Input Button */}
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        className={`${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      {/* Speech Output Toggle */}
      <Button
        variant={speechEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleSpeech}
        title={speechEnabled ? 'Disable speech output' : 'Enable speech output'}
      >
        {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      {/* Voice Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" title="Voice settings">
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Voice Controls</h4>
              <p className="text-sm text-muted-foreground">
                Configure voice input and speech output settings
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-enabled">Speech Output</Label>
                <Switch
                  id="speech-enabled"
                  checked={speechEnabled}
                  onCheckedChange={setSpeechEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Volume: {volume[0]}%</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Speech Rate: {speechRate[0]}x</Label>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText("This is a test of the speech output system.")}
                  className="w-full"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Test Speech
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Status Indicator */}
      {isListening && (
        <Badge variant="destructive" className="animate-pulse">
          Listening...
        </Badge>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

