import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Settings,
  MessageSquare,
  Headphones
} from 'lucide-react';

/**
 * Enhanced Voice Input Component
 * 
 * Provides advanced voice input capabilities with accessibility features
 * for users with motor disabilities or those who prefer voice interaction.
 */
const EnhancedVoiceInput: React.FC<{
  onVoiceInput?: (text: string) => void;
  placeholder?: string;
  continuous?: boolean;
  commands?: Record<string, () => void>;
}> = ({ 
  onVoiceInput, 
  placeholder = "Speak to input text...", 
  continuous = false,
  commands = {}
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-GB';
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (continuous && isListening) {
        recognition.start();
      }
    };
    
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      
      setTranscript(text);
      
      if (result.isFinal) {
        if (commandMode) {
          // Check if the transcript matches any commands
          const commandText = text.toLowerCase().trim();
          
          // Check for built-in navigation commands
          if (commandText.includes('go to home')) {
            window.location.href = '/';
          } else if (commandText.includes('go to dashboard')) {
            window.location.href = '/dashboard';
          } else if (commandText.includes('go to learning')) {
            window.location.href = '/learning';
          } else if (commandText.includes('go to resources')) {
            window.location.href = '/resources';
          } else if (commandText.includes('go to profile')) {
            window.location.href = '/profile';
          } else if (commandText.includes('exit command mode')) {
            setCommandMode(false);
          } else {
            // Check custom commands
            for (const [command, action] of Object.entries(commands)) {
              if (commandText.includes(command.toLowerCase())) {
                action();
                break;
              }
            }
          }
        } else {
          // Check if the transcript includes "command mode"
          if (text.toLowerCase().includes('command mode')) {
            setCommandMode(true);
          } else if (onVoiceInput) {
            onVoiceInput(text);
          }
        }
        
        if (!continuous) {
          setTranscript('');
        }
      }
    };
    
    // Start/stop recognition based on isListening state
    if (isListening) {
      recognition.start();
    }
    
    // Cleanup
    return () => {
      recognition.abort();
    };
  }, [isListening, continuous, onVoiceInput, commands, commandMode]);
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {commandMode ? (
            <MessageSquare className="h-5 w-5 text-primary" />
          ) : (
            <Mic className={`h-5 w-5 ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          )}
          <span className="text-sm font-medium">
            {commandMode ? 'Command Mode' : 'Voice Input'}
          </span>
        </div>
        <Button
          variant={isListening ? "default" : "outline"}
          size="sm"
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? "Stop" : "Start"}
        </Button>
      </div>
      
      {error && (
        <div className="text-xs text-destructive">{error}</div>
      )}
      
      <div 
        className="min-h-[60px] p-2 border rounded-md text-sm bg-muted/30"
        aria-live="polite"
      >
        {transcript || placeholder}
      </div>
      
      {commandMode && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <h4 className="text-xs font-medium mb-1">Available Voice Commands</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>"Go to Home"</li>
              <li>"Go to Dashboard"</li>
              <li>"Go to Learning"</li>
              <li>"Go to Resources"</li>
              <li>"Go to Profile"</li>
              <li>"Exit Command Mode"</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Enhanced Text-to-Speech Component
 * 
 * Provides advanced text-to-speech capabilities with accessibility features
 * for users with visual impairments or reading difficulties.
 */
const EnhancedTextToSpeech: React.FC<{
  text: string;
  autoPlay?: boolean;
  highlightText?: boolean;
  voiceOptions?: boolean;
}> = ({ 
  text, 
  autoPlay = false, 
  highlightText = false,
  voiceOptions = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Split text into words for highlighting
  const words = text.split(' ');
  
  useEffect(() => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }
    
    // Get available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Select a default voice (preferably UK English)
        const ukVoice = voices.find(voice => voice.lang === 'en-GB');
        setSelectedVoice(ukVoice?.name || voices[0].name);
      }
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Auto-play if enabled
    if (autoPlay) {
      playText();
    }
    
    // Cleanup
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [autoPlay]);
  
  const playText = () => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if selected
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    
    // Set speech properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Handle events
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPosition(0);
    };
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentPosition(event.charIndex);
      }
    };
    
    utterance.onerror = (event) => {
      setError(`Text-to-speech error: ${event.error}`);
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const pauseText = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  };
  
  const resumeText = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  };
  
  const stopText = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isPlaying ? (
            <Volume2 className="h-5 w-5 text-primary" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Text-to-Speech</span>
        </div>
        <div className="flex items-center space-x-1">
          {isPlaying && !isPaused ? (
            <Button
              variant="outline"
              size="sm"
              onClick={pauseText}
              aria-label="Pause speech"
            >
              Pause
            </Button>
          ) : isPlaying && isPaused ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resumeText}
              aria-label="Resume speech"
            >
              Resume
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={playText}
              aria-label="Start speech"
            >
              Play
            </Button>
          )}
          
          {(isPlaying || isPaused) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={stopText}
              aria-label="Stop speech"
            >
              Stop
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-xs text-destructive">{error}</div>
      )}
      
      {highlightText && (
        <div className="p-3 border rounded-md bg-muted/30 text-sm">
          {words.map((word, index) => {
            const wordStart = text.indexOf(word, index > 0 ? text.indexOf(words[index - 1]) + words[index - 1].length : 0);
            const isCurrentWord = currentPosition >= wordStart && currentPosition < wordStart + word.length;
            
            return (
              <span
                key={index}
                className={isCurrentWord ? 'bg-primary/20 text-primary font-medium' : ''}
              >
                {word}{' '}
              </span>
            );
          })}
        </div>
      )}
      
      {voiceOptions && (
        <div className="space-y-2 pt-2">
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="voice" className="text-xs">Voice</TabsTrigger>
              <TabsTrigger value="rate" className="text-xs">Speed</TabsTrigger>
              <TabsTrigger value="pitch" className="text-xs">Pitch</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voice" className="pt-2">
              <div className="space-y-2">
                <Label htmlFor="voice-select" className="text-xs">Select Voice</Label>
                <select
                  id="voice-select"
                  className="w-full text-xs p-2 rounded-md border bg-background"
                  value={selectedVoice || ''}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="rate" className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate-slider" className="text-xs">Speech Rate</Label>
                  <span className="text-xs text-muted-foreground">{rate}x</span>
                </div>
                <input
                  id="rate-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pitch" className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pitch-slider" className="text-xs">Voice Pitch</Label>
                  <span className="text-xs text-muted-foreground">{pitch}</span>
                </div>
                <input
                  id="pitch-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

/**
 * Motor Disability Support Component
 * 
 * Provides specialized support for users with motor disabilities,
 * including dwell clicking, switch access, and other motor assistance features.
 */
const MotorDisabilitySupport: React.FC = () => {
  const [dwellClickEnabled, setDwellClickEnabled] = useState(false);
  const [dwellTime, setDwellTime] = useState(1000); // milliseconds
  const [largeTargets, setLargeTargets] = useState(false);
  const [stickyKeys, setStickyKeys] = useState(false);
  const [voiceNavigation, setVoiceNavigation] = useState(false);
  
  // Apply motor disability support settings
  useEffect(() => {
    // Apply dwell clicking
    if (dwellClickEnabled) {
      document.documentElement.classList.add('dwell-click-enabled');
      document.documentElement.style.setProperty('--dwell-time', `${dwellTime}ms`);
    } else {
      document.documentElement.classList.remove('dwell-click-enabled');
    }
    
    // Apply large targets
    if (largeTargets) {
      document.documentElement.classList.add('large-targets');
    } else {
      document.documentElement.classList.remove('large-targets');
    }
    
    // Apply sticky keys
    if (stickyKeys) {
      document.documentElement.classList.add('sticky-keys');
    } else {
      document.documentElement.classList.remove('sticky-keys');
    }
    
    // Apply voice navigation
    if (voiceNavigation) {
      document.documentElement.classList.add('voice-navigation');
    } else {
      document.documentElement.classList.remove('voice-navigation');
    }
  }, [dwellClickEnabled, dwellTime, largeTargets, stickyKeys, voiceNavigation]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Headphones className="h-4 w-4 text-muted-foreground" />
        <Label>Motor Assistance Settings</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="dwell-click" className="text-sm">Dwell Clicking</Label>
          <Switch
            id="dwell-click"
            checked={dwellClickEnabled}
            onCheckedChange={setDwellClickEnabled}
            aria-describedby="dwell-click-description"
          />
        </div>
        <p id="dwell-click-description" className="text-xs text-muted-foreground">
          Hover over elements to click them automatically
        </p>
        
        {dwellClickEnabled && (
          <div className="space-y-2 pl-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dwell-time" className="text-xs">Dwell Time</Label>
              <span className="text-xs text-muted-foreground">{dwellTime / 1000}s</span>
            </div>
            <input
              id="dwell-time"
              type="range"
              min="500"
              max="3000"
              step="100"
              value={dwellTime}
              onChange={(e) => setDwellTime(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="large-targets" className="text-sm">Large Target Areas</Label>
          <Switch
            id="large-targets"
            checked={largeTargets}
            onCheckedChange={setLargeTargets}
            aria-describedby="large-targets-description"
          />
        </div>
        <p id="large-targets-description" className="text-xs text-muted-foreground">
          Increases the clickable area of buttons and links
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sticky-keys" className="text-sm">Sticky Keys</Label>
          <Switch
            id="sticky-keys"
            checked={stickyKeys}
            onCheckedChange={setStickyKeys}
            aria-describedby="sticky-keys-description"
          />
        </div>
        <p id="sticky-keys-description" className="text-xs text-muted-foreground">
          Press modifier keys (Shift, Ctrl, Alt) one at a time instead of simultaneously
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-navigation" className="text-sm">Voice Navigation</Label>
          <Switch
            id="voice-navigation"
            checked={voiceNavigation}
            onCheckedChange={setVoiceNavigation}
            aria-describedby="voice-navigation-description"
          />
        </div>
        <p id="voice-navigation-description" className="text-xs text-muted-foreground">
          Navigate and interact with the platform using voice commands
        </p>
        
        {voiceNavigation && (
          <div className="pl-4 pt-2">
            <EnhancedVoiceInput 
              placeholder="Voice navigation enabled. Say 'command mode' to start."
              continuous={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export {
  EnhancedVoiceInput,
  EnhancedTextToSpeech,
  MotorDisabilitySupport
};
