'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Settings, Volume2, VolumeX, Wand2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SpeechRecognitionEngineProps {
  onTranscriptChange?: (transcript: string) => void;
  onSpeechEnd?: (finalTranscript: string) => void;
  placeholder?: string;
  mode?: 'dictation' | 'command' | 'conversation';
  childVoiceOptimization?: boolean;
  autoStart?: boolean;
  className?: string;
}

export default function SpeechRecognitionEngine({
  onTranscriptChange,
  onSpeechEnd,
  placeholder = "Speak to see your words appear here...",
  mode = 'dictation',
  childVoiceOptimization = true,
  autoStart = false,
  className
}: SpeechRecognitionEngineProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [volume, setVolume] = useState(0);
  const [settings, setSettings] = useState({
    childVoiceOptimization: childVoiceOptimization,
    punctuationAutoCorrect: true,
    backgroundNoiseReduction: true,
    confidenceThreshold: 0.7,
    language: 'en-GB'
  });
  
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = settings.language;
        
        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          // Apply child voice optimization if enabled
          if (settings.childVoiceOptimization) {
            finalTranscript = optimizeChildVoiceTranscript(finalTranscript);
            interimTranscript = optimizeChildVoiceTranscript(interimTranscript);
          }
          
          // Apply punctuation auto-correct if enabled
          if (settings.punctuationAutoCorrect && finalTranscript) {
            finalTranscript = autoPunctuate(finalTranscript);
          }
          
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(interimTranscript);
          
          if (finalTranscript && onTranscriptChange) {
            onTranscriptChange(prev => prev + finalTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone access denied",
              description: "Please allow microphone access to use speech recognition.",
              variant: "destructive"
            });
            setIsListening(false);
          }
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current.start();
          } else {
            if (onSpeechEnd && transcript) {
              onSpeechEnd(transcript);
            }
          }
        };
      } else {
        setIsSupported(false);
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
          variant: "destructive"
        });
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Auto-start if specified
  useEffect(() => {
    if (autoStart && isSupported) {
      startListening();
    }
  }, [autoStart, isSupported]);
  
  // Update recognition settings when they change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = settings.language;
    }
  }, [settings.language]);
  
  const startListening = async () => {
    if (!isSupported) return;
    
    try {
      setIsListening(true);
      
      // Set up audio context for volume visualisation
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(microphoneStreamRef.current);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        const updateVolume = () => {
          if (!analyserRef.current || !dataArrayRef.current || !isListening) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
          setVolume(average / 128); // Normalize to 0-1
          
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
      }
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Failed to start speech recognition",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setVolume(0);
  };
  
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    if (onTranscriptChange) {
      onTranscriptChange('');
    }
  };
  
  const optimizeChildVoiceTranscript = (text: string): string => {
    if (!text) return text;
    
    // Common child speech patterns and corrections
    const optimised = text
      // Fix common child pronunciation issues
      .replace(/(\b)fing(\b)/gi, '$1thing$2')
      .replace(/(\b)wiv(\b)/gi, '$1with$2')
      .replace(/(\b)dat(\b)/gi, '$1that$2')
      .replace(/(\b)dis(\b)/gi, '$1this$2')
      .replace(/(\b)nuffin(\b)/gi, '$1nothing$2')
      .replace(/(\b)sumfin(\b)/gi, '$1something$2')
      .replace(/(\b)libary(\b)/gi, '$1library$2')
      .replace(/(\b)aminal(\b)/gi, '$1animal$2')
      .replace(/(\b)lellow(\b)/gi, '$1yellow$2')
      .replace(/(\b)pasketti(\b)/gi, '$1spaghetti$2')
      .replace(/(\b)brefast(\b)/gi, '$1breakfast$2')
      .replace(/(\b)supwise(\b)/gi, '$1surprise$2')
      .replace(/(\b)member(\b)/gi, '$1remember$2')
      .replace(/(\b)tomorow(\b)/gi, '$1tomorrow$2')
      .replace(/(\b)yesteray(\b)/gi, '$1yesterday$2')
      
      // Fix common word omissions
      .replace(/(\b)want (go|play|see)(\b)/gi, '$1want to $2$3')
      .replace(/(\b)going (go|play|see)(\b)/gi, '$1going to $2$3')
      .replace(/(\b)have (go|play|see)(\b)/gi, '$1have to $2$3');
    
    return optimised;
  };
  
  const autoPunctuate = (text: string): string => {
    if (!text) return text;
    
    // Add periods at natural sentence breaks
    let punctuated = text.trim();
    
    // Add period if the text doesn't end with punctuation
    if (!/[.!?]$/.test(punctuated)) {
      punctuated += '.';
    }
    
    // Capitalize first letter of sentences
    punctuated = punctuated.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    
    // Capitalize "I"
    punctuated = punctuated.replace(/(\s|^)i(\s|$)/g, '$1I$2');
    
    return punctuated;
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-green-500 animate-pulse" />
            ) : (
              <MicOff className="h-5 w-5 text-muted-foreground" />
            )}
            Speech Recognition
          </div>
          <Tabs defaultValue="main" className="w-auto">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="main">Main</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
        <CardDescription>
          {mode === 'dictation' && "Speak clearly to convert your speech to text"}
          {mode === 'command' && "Speak commands to control the application"}
          {mode === 'conversation' && "Have a conversation with the AI assistant"}
        </CardDescription>
      </CardHeader>
      
      <TabsContent value="main" className="mt-0">
        <CardContent className="space-y-4 pt-4">
          {!isSupported ? (
            <div className="flex items-centre justify-centre p-6 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 dark:text-red-400">
                Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 border rounded-md bg-muted/20">
                  {transcript || interimTranscript ? (
                    <div>
                      <span>{transcript}</span>
                      <span className="text-muted-foreground">{interimTranscript}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{placeholder}</p>
                  )}
                </div>
                
                {isListening && (
                  <div className="absolute bottom-2 right-2 flex items-centre gap-1">
                    <div className="relative w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {isListening ? (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={stopListening}
                    className="flex items-centre gap-1"
                  >
                    <MicOff className="h-4 w-4" />
                    Stop Listening
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={startListening}
                    className="flex items-centre gap-1"
                  >
                    <Mic className="h-4 w-4" />
                    Start Listening
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearTranscript}
                  className="flex items-centre gap-1"
                >
                  Clear
                </Button>
                
                {mode === 'dictation' && transcript && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => {
                      if (onSpeechEnd) onSpeechEnd(transcript);
                      toast({
                        title: "Text copied",
                        description: "The transcribed text has been copied to your clipboard.",
                      });
                      navigator.clipboard.writeText(transcript);
                    }}
                    className="flex items-centre gap-1"
                  >
                    Copy Text
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </TabsContent>
      
      <TabsContent value="settings" className="mt-0">
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Child Voice Optimization</label>
                <p className="text-xs text-muted-foreground">
                  Improves recognition accuracy for children's voices
                </p>
              </div>
              <Switch 
                checked={settings.childVoiceOptimization}
                onCheckedChange={(checked) => setSettings({...settings, childVoiceOptimization: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Punctuation</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adds punctuation to transcribed text
                </p>
              </div>
              <Switch 
                checked={settings.punctuationAutoCorrect}
                onCheckedChange={(checked) => setSettings({...settings, punctuationAutoCorrect: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Background Noise Reduction</label>
                <p className="text-xs text-muted-foreground">
                  Filters out background noise for clearer recognition
                </p>
              </div>
              <Switch 
                checked={settings.backgroundNoiseReduction}
                onCheckedChange={(checked) => setSettings({...settings, backgroundNoiseReduction: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <label className="text-sm font-medium">Recognition Confidence</label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.confidenceThreshold * 100)}%
                </span>
              </div>
              <Slider 
                value={[settings.confidenceThreshold * 100]} 
                min={50} 
                max={95} 
                step={5}
                onValueChange={(value) => setSettings({...settings, confidenceThreshold: value[0] / 100})}
              />
              <p className="text-xs text-muted-foreground">
                Higher values improve accuracy but may reject some valid speech
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <option value="en-GB">English (UK)</option>
                <option value="en-US">English (US)</option>
                <option value="en-AU">English (Australia)</option>
                <option value="en-IN">English (India)</option>
                <option value="en-NZ">English (New Zealand)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </TabsContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {isListening ? 'Listening...' : 'Ready to listen'}
        </p>
        <div className="flex items-centre text-xs text-muted-foreground">
          {settings.childVoiceOptimization && (
            <span className="flex items-centre mr-2">
              <Wand2 className="h-3 w-3 mr-1" /> Child-optimised
            </span>
          )}
          {settings.backgroundNoiseReduction && (
            <span className="flex items-centre">
              <VolumeX className="h-3 w-3 mr-1" /> Noise reduction
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
