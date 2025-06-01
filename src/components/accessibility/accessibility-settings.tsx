'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sun, 
  Moon, 
  Type, 
  ZoomIn, 
  Contrast, 
  Palette, 
  MousePointer, 
  Keyboard, 
  Save
} from 'lucide-react';

/**
 * AccessibilitySettings Component
 * 
 * A comprehensive accessibility settings panel that allows users to customize
 * their experience based on their specific needs.
 */
export default function AccessibilitySettings() {
  const { toast } = useToast();
  
  // Visual settings
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [colorScheme, setColorScheme] = useState('default');
  
  // Input settings
  const [voiceInput, setVoiceInput] = useState(true);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [mouseSettings, setMouseSettings] = useState('default');
  const [autoComplete, setAutoComplete] = useState(true);
  
  // Content settings
  const [readingLevel, setReadingLevel] = useState('standard');
  const [imageDescriptions, setImageDescriptions] = useState(true);
  const [videoSubtitles, setVideoSubtitles] = useState(true);
  const [contentLanguage, setContentLanguage] = useState('en-GB');
  
  // Save settings
  const saveSettings = () => {
    // Create settings object
    const settings = {
      visual: {
        highContrast,
        darkMode,
        reducedMotion,
        fontSize,
        lineSpacing,
        colorScheme
      },
      input: {
        voiceInput,
        keyboardNavigation,
        mouseSettings,
        autoComplete
      },
      content: {
        readingLevel,
        imageDescriptions,
        videoSubtitles,
        contentLanguage
      }
    };
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to document
    applySettings(settings);
    
    toast({
      title: 'Settings Saved',
      description: 'Your accessibility preferences have been saved and applied.',
    });
  };
  
  // Load settings from localStorage on component mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Update state with saved settings
      setHighContrast(settings.visual.highContrast);
      setDarkMode(settings.visual.darkMode);
      setReducedMotion(settings.visual.reducedMotion);
      setFontSize(settings.visual.fontSize);
      setLineSpacing(settings.visual.lineSpacing);
      setColorScheme(settings.visual.colorScheme);
      
      setVoiceInput(settings.input.voiceInput);
      setKeyboardNavigation(settings.input.keyboardNavigation);
      setMouseSettings(settings.input.mouseSettings);
      setAutoComplete(settings.input.autoComplete);
      
      setReadingLevel(settings.content.readingLevel);
      setImageDescriptions(settings.content.imageDescriptions);
      setVideoSubtitles(settings.content.videoSubtitles);
      setContentLanguage(settings.content.contentLanguage);
      
      // Apply settings
      applySettings(settings);
    }
  }, []);
  
  // Apply settings to document
  const applySettings = (settings) => {
    const html = document.documentElement;
    
    // Apply visual settings
    if (settings.visual.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    if (settings.visual.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    if (settings.visual.reducedMotion) {
      html.classList.add('reduced-motion');
    } else {
      html.classList.remove('reduced-motion');
    }
    
    // Apply font size
    html.style.setProperty('--font-size-multiplier', `${settings.visual.fontSize / 100}`);
    
    // Apply line spacing
    html.style.setProperty('--line-spacing', `${settings.visual.lineSpacing}`);
    
    // Apply color scheme
    html.setAttribute('data-color-scheme', settings.visual.colorScheme);
    
    // Apply content settings
    html.setAttribute('data-reading-level', settings.content.readingLevel);
    html.setAttribute('lang', settings.content.contentLanguage);
    
    // Apply input settings
    if (settings.input.keyboardNavigation) {
      html.classList.add('keyboard-navigation');
    } else {
      html.classList.remove('keyboard-navigation');
    }
    
    html.setAttribute('data-mouse-settings', settings.input.mouseSettings);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>
          Customize your experience to meet your specific needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="input">Input Methods</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          {/* Visual Settings */}
          <TabsContent value="visual" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <Label htmlFor="high-contrast">High Contrast</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="font-size">Font Size</Label>
              </div>
              <div className="w-1/2">
                <Slider
                  id="font-size"
                  min={75}
                  max={200}
                  step={5}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  aria-label="Adjust font size"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>Smaller</span>
                  <span>{fontSize}%</span>
                  <span>Larger</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ZoomIn className="h-4 w-4" />
                <Label htmlFor="line-spacing">Line Spacing</Label>
              </div>
              <div className="w-1/2">
                <Slider
                  id="line-spacing"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[lineSpacing]}
                  onValueChange={(value) => setLineSpacing(value[0])}
                  aria-label="Adjust line spacing"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>Tighter</span>
                  <span>{lineSpacing.toFixed(1)}x</span>
                  <span>Looser</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <Label htmlFor="color-scheme">Color Scheme</Label>
              </div>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger className="w-[180px]" id="color-scheme">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Red-Green)</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-Green)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-Yellow)</SelectItem>
                  <SelectItem value="monochromacy">Monochromacy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          {/* Input Methods */}
          <TabsContent value="input" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="voice-input">Voice Input</Label>
              </div>
              <Switch
                id="voice-input"
                checked={voiceInput}
                onCheckedChange={setVoiceInput}
                aria-label="Toggle voice input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="keyboard-navigation">Keyboard Navigation</Label>
              </div>
              <Switch
                id="keyboard-navigation"
                checked={keyboardNavigation}
                onCheckedChange={setKeyboardNavigation}
                aria-label="Toggle keyboard navigation"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4" />
                <Label htmlFor="mouse-settings">Mouse Settings</Label>
              </div>
              <Select value={mouseSettings} onValueChange={setMouseSettings}>
                <SelectTrigger className="w-[180px]" id="mouse-settings">
                  <SelectValue placeholder="Select mouse settings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="large-cursor">Large Cursor</SelectItem>
                  <SelectItem value="high-visibility">High Visibility Cursor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="auto-complete">Auto-Complete</Label>
              </div>
              <Switch
                id="auto-complete"
                checked={autoComplete}
                onCheckedChange={setAutoComplete}
                aria-label="Toggle auto-complete"
              />
            </div>
          </TabsContent>
          
          {/* Content Settings */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="reading-level">Reading Level</Label>
              </div>
              <Select value={readingLevel} onValueChange={setReadingLevel}>
                <SelectTrigger className="w-[180px]" id="reading-level">
                  <SelectValue placeholder="Select reading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Label htmlFor="image-descriptions">Image Descriptions</Label>
              </div>
              <Switch
                id="image-descriptions"
                checked={imageDescriptions}
                onCheckedChange={setImageDescriptions}
                aria-label="Toggle image descriptions"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Label htmlFor="video-subtitles">Video Subtitles</Label>
              </div>
              <Switch
                id="video-subtitles"
                checked={videoSubtitles}
                onCheckedChange={setVideoSubtitles}
                aria-label="Toggle video subtitles"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="content-language">Content Language</Label>
              </div>
              <Select value={contentLanguage} onValueChange={setContentLanguage}>
                <SelectTrigger className="w-[180px]" id="content-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
