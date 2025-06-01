"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccessibility } from './accessibility-provider';
import { UKCurriculumAccessibility } from './UKCurriculumAccessibility';
import { AIAccessibilityAdaptation } from './AIAccessibilityAdaptation';
import { Video, FileText, Settings, HelpCircle, Check, AlertTriangle } from 'lucide-react';

/**
 * AIAvatarVideoAccessibility Component
 * 
 * Provides specialized accessibility features for AI avatar videos,
 * including closed captioning, transcript generation, playback controls,
 * and visual alternatives.
 */
export function AIAvatarVideoAccessibility() {
  // Access global accessibility context
  const { 
    highContrast, 
    setHighContrast,
    fontSize, 
    setFontSize,
    reducedMotion, 
    setReducedMotion
  } = useAccessibility();

  // Video accessibility settings
  const [autoCaptions, setAutoCaptions] = useState<boolean>(true);
  const [autoTranscript, setAutoTranscript] = useState<boolean>(true);
  const [signLanguage, setSignLanguage] = useState<boolean>(false);
  const [visualAlternatives, setVisualAlternatives] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>("normal");
  const [pauseOnInteraction, setPauseOnInteraction] = useState<boolean>(true);
  const [captionLanguage, setCaptionLanguage] = useState<string>("en-GB");

  // Playback speed options
  const speedOptions = [
    { value: "very-slow", label: "Very Slow (0.5x)" },
    { value: "slow", label: "Slow (0.75x)" },
    { value: "normal", label: "Normal (1x)" },
    { value: "fast", label: "Fast (1.25x)" },
    { value: "very-fast", label: "Very Fast (1.5x)" }
  ];

  // Caption language options
  const languageOptions = [
    { value: "en-GB", label: "English (UK)" },
    { value: "cy", label: "Welsh (Cymraeg)" },
    { value: "ur", label: "Urdu (اردو)" },
    { value: "pl", label: "Polish (Polski)" },
    { value: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { value: "ar", label: "Arabic (العربية)" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-5 w-5" />
          AI Avatar Video Accessibility
        </CardTitle>
        <CardDescription>
          Accessibility features for AI avatar videos and interactive content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="captions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="captions">Captions & Text</TabsTrigger>
            <TabsTrigger value="playback">Playback Controls</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>
          
          {/* Captions & Text Tab */}
          <TabsContent value="captions" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-captions" className="font-medium">Automatic Captions</Label>
                <p className="text-xs text-muted-foreground">
                  Show captions for all AI avatar videos
                </p>
              </div>
              <Switch 
                id="auto-captions" 
                checked={autoCaptions} 
                onCheckedChange={setAutoCaptions}
                aria-label="Toggle automatic captions"
              />
            </div>
            
            {autoCaptions && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label htmlFor="caption-language">Caption Language</Label>
                <Select value={captionLanguage} onValueChange={setCaptionLanguage}>
                  <SelectTrigger id="caption-language" aria-label="Select caption language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select your preferred caption language
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-transcript" className="font-medium">Automatic Transcript</Label>
                <p className="text-xs text-muted-foreground">
                  Generate and display transcripts for videos
                </p>
              </div>
              <Switch 
                id="auto-transcript" 
                checked={autoTranscript} 
                onCheckedChange={setAutoTranscript}
                aria-label="Toggle automatic transcript"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caption-style">Caption Style</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="caption-style" aria-label="Select caption style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="large">Large Text</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                  <SelectItem value="simplified">Simplified Language</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how captions appear on videos
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-2">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">Caption & Transcript Quality</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Captions and transcripts are automatically generated and may not be 100% accurate. You can report inaccuracies to help improve quality.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Playback Controls Tab */}
          <TabsContent value="playback" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="playback-speed">Playback Speed</Label>
              <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                <SelectTrigger id="playback-speed" aria-label="Select playback speed">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  {speedOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Adjust the default speed of AI avatar videos
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pause-on-interaction" className="font-medium">Pause on Interaction</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically pause videos when interacting with content
                </p>
              </div>
              <Switch 
                id="pause-on-interaction" 
                checked={pauseOnInteraction} 
                onCheckedChange={setPauseOnInteraction}
                aria-label="Toggle pause on interaction"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="keyboard-controls" className="font-medium">Enhanced Keyboard Controls</Label>
                <p className="text-xs text-muted-foreground">
                  Enable additional keyboard shortcuts for video control
                </p>
              </div>
              <Switch 
                id="keyboard-controls" 
                defaultChecked={true}
                aria-label="Toggle enhanced keyboard controls"
              />
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Play/Pause</span>
                  <span className="font-mono bg-background px-2 rounded">Space</span>
                </li>
                <li className="flex justify-between">
                  <span>Rewind 10s</span>
                  <span className="font-mono bg-background px-2 rounded">←</span>
                </li>
                <li className="flex justify-between">
                  <span>Forward 10s</span>
                  <span className="font-mono bg-background px-2 rounded">→</span>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Captions</span>
                  <span className="font-mono bg-background px-2 rounded">C</span>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Transcript</span>
                  <span className="font-mono bg-background px-2 rounded">T</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          {/* Alternatives Tab */}
          <TabsContent value="alternatives" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visual-alternatives" className="font-medium">Visual Alternatives</Label>
                <p className="text-xs text-muted-foreground">
                  Provide text-based alternatives to video content
                </p>
              </div>
              <Switch 
                id="visual-alternatives" 
                checked={visualAlternatives} 
                onCheckedChange={setVisualAlternatives}
                aria-label="Toggle visual alternatives"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sign-language" className="font-medium">Sign Language (BSL)</Label>
                <p className="text-xs text-muted-foreground">
                  Show British Sign Language interpretation
                </p>
              </div>
              <Switch 
                id="sign-language" 
                checked={signLanguage} 
                onCheckedChange={setSignLanguage}
                aria-label="Toggle sign language"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alternative-format">Alternative Format</Label>
              <Select defaultValue="text">
                <SelectTrigger id="alternative-format" aria-label="Select alternative format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Summary</SelectItem>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="image">Image Sequence</SelectItem>
                  <SelectItem value="interactive">Interactive Elements</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how content alternatives are presented
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3 mt-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">WCAG 2.1 Compliant</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These alternatives ensure our video content meets WCAG 2.1 AA accessibility standards.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center">
          <HelpCircle className="mr-2 h-4 w-4" />
          Accessibility Guide
        </Button>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  );
}

/**
 * EnhancedAccessibilityPanel Component
 * 
 * A comprehensive accessibility panel that combines all enhanced accessibility
 * features into a single, unified interface.
 */
export function EnhancedAccessibilityPanel() {
  return (
    <div className="space-y-8">
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-4">
        <h2 className="text-xl font-bold mb-2">Enhanced Accessibility Features</h2>
        <p className="text-sm text-muted-foreground">
          These advanced accessibility features are designed to provide comprehensive support for all users,
          with special focus on UK curriculum alignment and AI-powered adaptations.
        </p>
      </div>
      
      <UKCurriculumAccessibility />
      
      <AIAccessibilityAdaptation />
      
      <AIAvatarVideoAccessibility />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Accessibility Settings Management
          </CardTitle>
          <CardDescription>
            Save, export, and manage your accessibility preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start">
              <Check className="mr-2 h-4 w-4" />
              Save Current Settings as Profile
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Export Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Import Settings
            </Button>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Settings Persistence</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your accessibility settings are automatically saved to your account and will be applied across all devices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full">Reset All Accessibility Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
