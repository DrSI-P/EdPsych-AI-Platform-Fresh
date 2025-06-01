"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoiceInput } from '@/providers/voice-input-provider';
import { BookOpen, Sparkles, Mic, MicOff, Lightbulb, AlertTriangle } from 'lucide-react';

/**
 * MultiModalVoiceInput Component
 * 
 * Provides combined voice and alternative input methods for enhanced accessibility,
 * particularly for users with speech difficulties or in noisy environments.
 */
export function MultiModalVoiceInput() {
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    settings
  } = useVoiceInput();

  // Local state for multi-modal settings
  const [multiModalEnabled, setMultiModalEnabled] = useState(true);
  const [primaryInputMode, setPrimaryInputMode] = useState('voice');
  const [quickPhrases, setQuickPhrases] = useState(true);
  const [predictiveText, setPredictiveText] = useState(true);
  const [symbolSupport, setSymbolSupport] = useState(false);
  const [gestureControl, setGestureControl] = useState(false);
  
  // Sample quick phrases for demonstration
  const sampleQuickPhrases = {
    navigation: ["Go back", "Next page", "Home", "Help"],
    responses: ["Yes", "No", "Maybe", "I don't know"],
    requests: ["Read this to me", "Explain this", "Show me an example", "I need help"],
    emotions: ["I'm happy", "I'm confused", "I'm frustrated", "I'm excited"]
  };
  
  // Sample predictive text options
  const samplePredictions = ["learning", "lesson", "language", "literacy"];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="mr-2 h-5 w-5" />
          Multi-Modal Voice Input
        </CardTitle>
        <CardDescription>
          Combined voice and alternative input methods for enhanced accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="multi-modal-toggle" className="font-medium">Multi-Modal Input</Label>
            <p className="text-xs text-muted-foreground">
              Enable combined voice and alternative input methods
            </p>
          </div>
          <Switch 
            id="multi-modal-toggle" 
            checked={multiModalEnabled} 
            onCheckedChange={setMultiModalEnabled}
            aria-label="Toggle multi-modal input"
          />
        </div>
        
        {multiModalEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="primary-input-mode">Primary Input Mode</Label>
              <Select value={primaryInputMode} onValueChange={setPrimaryInputMode}>
                <SelectTrigger id="primary-input-mode" aria-label="Select primary input mode">
                  <SelectValue placeholder="Select input mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voice">Voice First</SelectItem>
                  <SelectItem value="touch">Touch First</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Voice + Touch)</SelectItem>
                  <SelectItem value="simplified">Simplified Input</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your preferred primary input method
              </p>
            </div>
            
            <Tabs defaultValue="quick-phrases">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quick-phrases">Quick Phrases</TabsTrigger>
                <TabsTrigger value="predictive">Predictive</TabsTrigger>
                <TabsTrigger value="symbols">Symbols</TabsTrigger>
                <TabsTrigger value="gestures">Gestures</TabsTrigger>
              </TabsList>
              
              {/* Quick Phrases Tab */}
              <TabsContent value="quick-phrases" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quick-phrases-toggle" className="font-medium">Quick Phrases</Label>
                    <p className="text-xs text-muted-foreground">
                      Show common phrases for quick selection
                    </p>
                  </div>
                  <Switch 
                    id="quick-phrases-toggle" 
                    checked={quickPhrases} 
                    onCheckedChange={setQuickPhrases}
                    aria-label="Toggle quick phrases"
                  />
                </div>
                
                {quickPhrases && (
                  <div className="space-y-3">
                    {Object.entries(sampleQuickPhrases).map(([category, phrases]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {phrases.map((phrase, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              size="sm"
                              className="text-xs h-8"
                            >
                              {phrase}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Customize Quick Phrases
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Predictive Tab */}
              <TabsContent value="predictive" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="predictive-toggle" className="font-medium">Predictive Text</Label>
                    <p className="text-xs text-muted-foreground">
                      Show word predictions based on context
                    </p>
                  </div>
                  <Switch 
                    id="predictive-toggle" 
                    checked={predictiveText} 
                    onCheckedChange={setPredictiveText}
                    aria-label="Toggle predictive text"
                  />
                </div>
                
                {predictiveText && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm mb-2">Sample text: "I am learning about..."</p>
                      <div className="flex gap-2">
                        {samplePredictions.map((word, index) => (
                          <Button 
                            key={index} 
                            variant="secondary" 
                            size="sm"
                            className="text-xs"
                          >
                            {word}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prediction-style">Prediction Style</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="prediction-style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="simplified">Simplified</SelectItem>
                          <SelectItem value="expanded">Expanded (More Options)</SelectItem>
                          <SelectItem value="contextual">Contextual (Topic-Based)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Symbols Tab */}
              <TabsContent value="symbols" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="symbols-toggle" className="font-medium">Symbol Support</Label>
                    <p className="text-xs text-muted-foreground">
                      Show symbol-supported communication options
                    </p>
                  </div>
                  <Switch 
                    id="symbols-toggle" 
                    checked={symbolSupport} 
                    onCheckedChange={setSymbolSupport}
                    aria-label="Toggle symbol support"
                  />
                </div>
                
                {symbolSupport && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {["help", "yes", "no", "more", "less", "stop", "go", "like"].map((symbol, index) => (
                        <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                          <div className="w-10 h-10 bg-muted rounded-md mb-1 flex items-center justify-center">
                            {/* Symbol placeholder */}
                            {symbol.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs">{symbol}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="symbol-set">Symbol Set</Label>
                      <Select defaultValue="widgit">
                        <SelectTrigger id="symbol-set">
                          <SelectValue placeholder="Select symbol set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="widgit">Widgit Symbols</SelectItem>
                          <SelectItem value="pcs">PCS Symbols</SelectItem>
                          <SelectItem value="makaton">Makaton Symbols</SelectItem>
                          <SelectItem value="simple">Simple Icons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Gestures Tab */}
              <TabsContent value="gestures" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gestures-toggle" className="font-medium">Gesture Control</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable gesture-based input methods
                    </p>
                  </div>
                  <Switch 
                    id="gestures-toggle" 
                    checked={gestureControl} 
                    onCheckedChange={setGestureControl}
                    aria-label="Toggle gesture control"
                  />
                </div>
                
                {gestureControl && (
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm font-medium">Available Gestures</p>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                            <li>Swipe left/right to navigate</li>
                            <li>Swipe up/down to scroll</li>
                            <li>Tap and hold to activate voice input</li>
                            <li>Two-finger tap for context menu</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gesture-sensitivity">Gesture Sensitivity</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="gesture-sensitivity">
                          <SelectValue placeholder="Select sensitivity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Requires Definite Gestures)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High (Responds to Subtle Movements)</SelectItem>
                          <SelectItem value="custom">Custom Settings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Multi-Modal Support</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multi-modal input provides alternative ways to interact when voice input is challenging due to speech difficulties, noisy environments, or privacy concerns.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {!multiModalEnabled && (
          <div className="bg-muted p-6 rounded-md text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">Multi-Modal Input Disabled</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable multi-modal input to combine voice with other input methods for enhanced accessibility.
            </p>
            <Button 
              onClick={() => setMultiModalEnabled(true)}
              className="mx-auto"
            >
              Enable Multi-Modal Input
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
