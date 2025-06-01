'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccessibility } from '@/components/accessibility/accessibility-provider';

/**
 * AccessibilityEnhancements Component
 * 
 * This component provides accessibility controls for the Educator Dashboard,
 * allowing educators to customize their experience based on their needs.
 * It integrates with the platform's accessibility provider for consistent
 * settings across the application.
 */
export function AccessibilityEnhancements() {
  const { 
    highContrast, 
    setHighContrast,
    fontSize, 
    setFontSize,
    reducedMotion, 
    setReducedMotion,
    textToSpeech,
    setTextToSpeech,
    voiceInput,
    setVoiceInput,
    colorBlindMode,
    setColorBlindMode
  } = useAccessibility();

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize your dashboard experience to meet your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="visual">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="input">Input Methods</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increases contrast for better readability</p>
              </div>
              <Switch 
                id="high-contrast" 
                checked={highContrast} 
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                <span className="text-sm">{fontSize}px</span>
              </div>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                aria-label="Adjust font size"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduced-motion" className="font-medium">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">Minimizes animations and transitions</p>
              </div>
              <Switch 
                id="reduced-motion" 
                checked={reducedMotion} 
                onCheckedChange={setReducedMotion}
                aria-label="Toggle reduced motion"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color-blind-mode" className="font-medium">Color Blind Mode</Label>
              <Select 
                value={colorBlindMode} 
                onValueChange={(value) => setColorBlindMode(value)}
              >
                <SelectTrigger id="color-blind-mode" aria-label="Select color blind mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="input" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-input" className="font-medium">Voice Input</Label>
                <p className="text-sm text-muted-foreground">Control the dashboard using voice commands</p>
              </div>
              <Switch 
                id="voice-input" 
                checked={voiceInput} 
                onCheckedChange={setVoiceInput}
                aria-label="Toggle voice input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="text-to-speech" className="font-medium">Text to Speech</Label>
                <p className="text-sm text-muted-foreground">Read dashboard content aloud</p>
              </div>
              <Switch 
                id="text-to-speech" 
                checked={textToSpeech} 
                onCheckedChange={setTextToSpeech}
                aria-label="Toggle text to speech"
              />
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Voice Command Examples</h4>
              <ul className="space-y-1 text-sm">
                <li>"Show student progress"</li>
                <li>"Generate report for [student name]"</li>
                <li>"Schedule parent meeting"</li>
                <li>"Open class [class name]"</li>
                <li>"Create new assignment"</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="content-density" className="font-medium">Content Density</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="content-density" aria-label="Select content density">
                  <SelectValue placeholder="Select density" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-visualization" className="font-medium">Data Visualization Style</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="data-visualization" aria-label="Select data visualization style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                  <SelectItem value="patterns">Patterns (Color Blind Friendly)</SelectItem>
                  <SelectItem value="text-focused">Text-Focused (Minimal Graphics)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="simplified-view" className="font-medium">Simplified View</Label>
                <p className="text-sm text-muted-foreground">Reduces visual complexity</p>
              </div>
              <Switch 
                id="simplified-view" 
                defaultChecked={false}
                aria-label="Toggle simplified view"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
