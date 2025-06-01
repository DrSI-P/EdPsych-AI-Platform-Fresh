'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Volume2, VolumeX, Play, Pause, StopCircle, Settings, RefreshCw, Check } from 'lucide-react';
import { TextToSpeechService, TextToSpeechOptions, TextToSpeechState } from '@/lib/voice/textToSpeech';

export default function TextToSpeechReader() {
  // State for text-to-speech
  const [text, setText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // State for settings
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [language, setLanguage] = useState('en-GB');
  const [highlightText, setHighlightText] = useState(true);
  const [childFriendlyVoice, setChildFriendlyVoice] = useState(false);
  const [specialNeedsSettings, setSpecialNeedsSettings] = useState({
    simplifiedLanguage: false,
    extendedPauses: false,
    emphasizeKeywords: false
  });
  
  // References
  const textToSpeechRef = useRef<TextToSpeechService | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedTextRef = useRef<HTMLDivElement>(null);
  
  // Initialize text-to-speech on client side
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      try {
        // Import dynamically to avoid SSR issues
        import('@/lib/voice/textToSpeech').then(({ getTextToSpeechService }) => {
          const options: TextToSpeechOptions = {
            voice,
            rate,
            pitch,
            volume,
            lang: language,
            highlightText,
            childFriendlyVoice,
            specialEducationalNeeds: specialNeedsSettings
          };
          
          textToSpeechRef.current = getTextToSpeechService(options);
          setIsSupported(textToSpeechRef.current.isBrowserSupported());
          
          // Get available voices
          setAvailableVoices(textToSpeechRef.current.getVoices());
          
          // Set highlight callback
          textToSpeechRef.current.setHighlightCallback((text, start, end) => {
            if (highlightedTextRef.current) {
              const highlightedText = text.substring(0, end);
              highlightedTextRef.current.innerHTML = `<span class="bg-primary/20">${highlightedText}</span>${text.substring(end)}`;
            }
          });
          
          // Set on end callback
          textToSpeechRef.current.setOnEndCallback(() => {
            setIsReading(false);
            setIsPaused(false);
            setProgress(100);
            
            if (highlightedTextRef.current) {
              highlightedTextRef.current.innerHTML = text;
            }
          });
          
          // Update state periodically
          const interval = setInterval(() => {
            if (textToSpeechRef.current) {
              const state = textToSpeechRef.current.getState();
              setProgress(state.progress);
            }
          }, 500);
          
          return () => clearInterval(interval);
        });
      } catch (error) {
        console.error('Failed to initialize text-to-speech:', error);
        setIsSupported(false);
      }
    }
  }, []);
  
  // Update text-to-speech options when settings change
  useEffect(() => {
    if (textToSpeechRef.current) {
      const options: TextToSpeechOptions = {
        voice,
        rate,
        pitch,
        volume,
        lang: language,
        highlightText,
        childFriendlyVoice,
        specialEducationalNeeds: specialNeedsSettings
      };
      
      textToSpeechRef.current.updateOptions(options);
    }
  }, [voice, rate, pitch, volume, language, highlightText, childFriendlyVoice, specialNeedsSettings]);
  
  // Handle start reading
  const startReading = () => {
    if (!textToSpeechRef.current) return;
    
    const textToRead = textareaRef.current?.value || text;
    
    if (!textToRead) {
      toast({
        title: 'No Text to Read',
        description: 'Please enter some text to read aloud.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setText(textToRead);
    
    // Start text-to-speech
    textToSpeechRef.current.speak(textToRead);
    setIsReading(true);
    setIsPaused(false);
    setIsLoading(false);
    
    // Initialize highlighted text
    if (highlightedTextRef.current) {
      highlightedTextRef.current.innerHTML = textToRead;
    }
  };
  
  // Handle pause reading
  const pauseReading = () => {
    if (!textToSpeechRef.current) return;
    
    textToSpeechRef.current.pause();
    setIsPaused(true);
  };
  
  // Handle resume reading
  const resumeReading = () => {
    if (!textToSpeechRef.current) return;
    
    textToSpeechRef.current.resume();
    setIsPaused(false);
  };
  
  // Handle stop reading
  const stopReading = () => {
    if (!textToSpeechRef.current) return;
    
    textToSpeechRef.current.stop();
    setIsReading(false);
    setIsPaused(false);
    setProgress(0);
    
    // Reset highlighted text
    if (highlightedTextRef.current) {
      highlightedTextRef.current.innerHTML = text;
    }
  };
  
  // Handle voice change
  const handleVoiceChange = (value: string) => {
    setVoice(value);
  };
  
  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };
  
  // Handle special needs setting change
  const handleSpecialNeedsChange = (setting: keyof typeof specialNeedsSettings, value: boolean) => {
    setSpecialNeedsSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Text to Speech</h1>
      
      {!isSupported ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-600">Browser Not Supported</CardTitle>
            <CardDescription>
              Your browser does not support text-to-speech. Please try using Chrome, Edge, or Safari.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Text-to-speech requires a modern browser with Web Speech API support. 
              Please switch to a compatible browser to use this feature.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Text to Speech Reader</CardTitle>
              <CardDescription>
                Enter text below to have it read aloud.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="text-input">Text Input</Label>
                  <textarea 
                    id="text-input" 
                    placeholder="Enter text to be read aloud..." 
                    className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2"
                    ref={textareaRef}
                    defaultValue={text}
                  />
                </div>
                
                {isReading && (
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label>Reading Progress</Label>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="mt-4 p-4 border rounded-md bg-muted/30">
                      <Label className="mb-2 block">Currently Reading:</Label>
                      <div 
                        ref={highlightedTextRef} 
                        className="text-sm leading-relaxed"
                      >
                        {text}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div className="space-x-2">
                    {!isReading ? (
                      <Button 
                        onClick={startReading}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Read Aloud
                      </Button>
                    ) : isPaused ? (
                      <Button onClick={resumeReading}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    ) : (
                      <Button onClick={pauseReading}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    {isReading && (
                      <Button 
                        variant="outline" 
                        onClick={stopReading}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="voice">
            <TabsList className="grid grid-cols-3 w-[400px] mb-6">
              <TabsTrigger value="voice">Voice Settings</TabsTrigger>
              <TabsTrigger value="reading">Reading Style</TabsTrigger>
              <TabsTrigger value="special-needs">Special Needs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Settings</CardTitle>
                  <CardDescription>
                    Customise the voice used for text-to-speech.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice</Label>
                    <Select value={voice} onValueChange={handleVoiceChange}>
                      <SelectTrigger id="voice">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((v) => (
                          <SelectItem key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="cy-GB">Welsh</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="pl-PL">Polish</SelectItem>
                        <SelectItem value="ur-PK">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="child-voice" className="block mb-1">Child-Friendly Voice</Label>
                      <p className="text-sm text-muted-foreground">
                        Prefer voices that are more suitable for children
                      </p>
                    </div>
                    <Switch
                      id="child-voice"
                      checked={childFriendlyVoice}
                      onCheckedChange={setChildFriendlyVoice}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label htmlFor="rate">Rate ({rate}x)</Label>
                      <div className="flex items-centre space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRate(Math.max(0.5, rate - 0.1))}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRate(Math.min(2, rate + 0.1))}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Slider
                      id="rate"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[rate]}
                      onValueChange={(value) => setRate(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pitch">Pitch ({pitch})</Label>
                    <Slider
                      id="pitch"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[pitch]}
                      onValueChange={(value) => setPitch(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label htmlFor="volume">Volume ({Math.round(volume * 100)}%)</Label>
                      <div className="flex items-centre">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVolume(0)}
                          className="h-8 w-8 p-0"
                        >
                          <VolumeX className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVolume(1)}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      id="volume"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reading">
              <Card>
                <CardHeader>
                  <CardTitle>Reading Style</CardTitle>
                  <CardDescription>
                    Customise how text is read aloud.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="highlight-text" className="block mb-1">Highlight Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Highlight text as it is being read
                      </p>
                    </div>
                    <Switch
                      id="highlight-text"
                      checked={highlightText}
                      onCheckedChange={setHighlightText}
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Reading Tips</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Use a slower rate for complex or educational content</li>
                      <li>Higher pitch works well for younger children</li>
                      <li>Text highlighting helps with reading comprehension</li>
                      <li>For longer texts, break into smaller paragraphs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="special-needs">
              <Card>
                <CardHeader>
                  <CardTitle>Special Educational Needs Settings</CardTitle>
                  <CardDescription>
                    Additional settings to support various reading and comprehension needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="simplified-language" className="block mb-1">Simplified Language</Label>
                      <p className="text-sm text-muted-foreground">
                        Simplify complex language when possible
                      </p>
                    </div>
                    <Switch
                      id="simplified-language"
                      checked={specialNeedsSettings.simplifiedLanguage}
                      onCheckedChange={(value) => handleSpecialNeedsChange('simplifiedLanguage', value)}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="extended-pauses" className="block mb-1">Extended Pauses</Label>
                      <p className="text-sm text-muted-foreground">
                        Add longer pauses between sentences and paragraphs
                      </p>
                    </div>
                    <Switch
                      id="extended-pauses"
                      checked={specialNeedsSettings.extendedPauses}
                      onCheckedChange={(value) => handleSpecialNeedsChange('extendedPauses', value)}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div>
                      <Label htmlFor="emphasize-keywords" className="block mb-1">Emphasize Keywords</Label>
                      <p className="text-sm text-muted-foreground">
                        Add emphasis to important words and concepts
                      </p>
                    </div>
                    <Switch
                      id="emphasize-keywords"
                      checked={specialNeedsSettings.emphasizeKeywords}
                      onCheckedChange={(value) => handleSpecialNeedsChange('emphasizeKeywords', value)}
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Recommended Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">For Reading Difficulties:</p>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Enable Simplified Language</li>
                          <li>Enable Extended Pauses</li>
                          <li>Reduce Reading Rate (0.8x)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">For Auditory Processing:</p>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Enable Extended Pauses</li>
                          <li>Enable Emphasize Keywords</li>
                          <li>Reduce Reading Rate (0.7x)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">For English as Additional Language:</p>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Enable Simplified Language</li>
                          <li>Enable Extended Pauses</li>
                          <li>Reduce Reading Rate (0.8x)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
