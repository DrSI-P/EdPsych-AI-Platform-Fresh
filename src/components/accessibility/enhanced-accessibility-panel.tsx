'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Keyboard, 
  Eye, 
  Palette, 
  Type, 
  LineHeight, 
  LetterCase,
  MousePointer,
  Sparkles
} from 'lucide-react';

/**
 * ReadingGuide Component
 * 
 * A visual guide that follows the mouse cursor to help users focus on text
 * while reading. Particularly helpful for users with dyslexia, ADHD, or
 * other conditions that affect reading focus.
 */
const ReadingGuide: React.FC<{
  active: boolean;
  color: string;
  size: string;
}> = ({ active, color, size }) => {
  const guideRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active || !guideRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (guideRef.current) {
        const height = guideRef.current.offsetHeight;
        guideRef.current.style.transform = `translateY(${e.clientY - height / 2}px)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);
  
  if (!active) return null;
  
  const sizeMap = {
    'small': '24px',
    'medium': '32px',
    'large': '48px'
  };
  
  return (
    <div
      ref={guideRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: sizeMap[size as keyof typeof sizeMap] || '32px',
        backgroundColor: color,
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.05s ease'
      }}
    />
  );
};

/**
 * Enhanced Reading Guides Component
 * 
 * Provides configurable reading guides to help users focus on text.
 * Includes options for guide color, size, and opacity.
 */
const EnhancedReadingGuides: React.FC = () => {
  const [active, setActive] = useState(false);
  const [color, setColor] = useState('#ffff00'); // Yellow default
  const [size, setSize] = useState('medium');
  const [opacity, setOpacity] = useState(20);
  
  const colorOptions = [
    { value: '#ffff00', label: 'Yellow' },
    { value: '#ff0000', label: 'Red' },
    { value: '#00ff00', label: 'Green' },
    { value: '#0000ff', label: 'Blue' },
    { value: '#ff00ff', label: 'Magenta' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="reading-guide">Reading Guide</Label>
        </div>
        <Switch
          id="reading-guide"
          checked={active}
          onCheckedChange={setActive}
        />
      </div>
      
      {active && (
        <div className="space-y-3 pl-6 mt-2">
          <div className="space-y-1">
            <Label htmlFor="guide-color" className="text-sm">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="guide-color" className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: option.value }} 
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="guide-size" className="text-sm">Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger id="guide-size" className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="guide-opacity" className="text-sm">Opacity</Label>
              <span className="text-xs text-muted-foreground">{opacity}%</span>
            </div>
            <Slider
              id="guide-opacity"
              min={10}
              max={50}
              step={5}
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
            />
          </div>
        </div>
      )}
      
      <ReadingGuide 
        active={active} 
        color={color} 
        size={size} 
      />
    </div>
  );
};

/**
 * ColorBlindnessFilters Component
 * 
 * Provides filters to simulate and compensate for different types of color blindness.
 * Helps users with color vision deficiencies better perceive content.
 */
const ColorBlindnessFilters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('none');
  
  useEffect(() => {
    // Remove any existing filters
    document.documentElement.style.filter = '';
    
    // Apply selected filter
    switch (activeFilter) {
      case 'protanopia':
        document.documentElement.style.filter = 'url(#protanopia-filter)';
        break;
      case 'deuteranopia':
        document.documentElement.style.filter = 'url(#deuteranopia-filter)';
        break;
      case 'tritanopia':
        document.documentElement.style.filter = 'url(#tritanopia-filter)';
        break;
      case 'achromatopsia':
        document.documentElement.style.filter = 'url(#achromatopsia-filter)';
        break;
      case 'enhance-contrast':
        document.documentElement.style.filter = 'contrast(1.4) saturate(1.8)';
        break;
    }
  }, [activeFilter]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="color-filter">Color Vision Support</Label>
        </div>
      </div>
      
      <Select value={activeFilter} onValueChange={setActiveFilter}>
        <SelectTrigger id="color-filter" className="w-full">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Filter</SelectItem>
          <SelectItem value="protanopia">Protanopia (Red-Blind) Support</SelectItem>
          <SelectItem value="deuteranopia">Deuteranopia (Green-Blind) Support</SelectItem>
          <SelectItem value="tritanopia">Tritanopia (Blue-Blind) Support</SelectItem>
          <SelectItem value="achromatopsia">Achromatopsia (Monochromacy) Support</SelectItem>
          <SelectItem value="enhance-contrast">Enhanced Contrast</SelectItem>
        </SelectContent>
      </Select>
      
      {/* SVG Filters for Color Blindness */}
      <svg style={{ position: 'absolute', height: 0, width: 0, overflow: 'hidden' }}>
        <defs>
          {/* Protanopia Filter */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          
          {/* Deuteranopia Filter */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          
          {/* Tritanopia Filter */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          
          {/* Achromatopsia Filter */}
          <filter id="achromatopsia-filter">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

/**
 * KeyboardNavigation Component
 * 
 * Enhances keyboard navigation for users who rely on keyboard input.
 * Provides visible focus indicators and keyboard shortcuts.
 */
const KeyboardNavigation: React.FC = () => {
  const [enhancedFocus, setEnhancedFocus] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);
  
  useEffect(() => {
    if (enhancedFocus) {
      document.documentElement.classList.add('enhanced-focus');
    } else {
      document.documentElement.classList.remove('enhanced-focus');
    }
  }, [enhancedFocus]);
  
  useEffect(() => {
    if (!keyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if keyboard shortcuts are enabled
      if (!keyboardShortcuts) return;
      
      // Alt + number shortcuts for navigation
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case '1': // Home
            window.location.href = '/';
            break;
          case '2': // Dashboard
            window.location.href = '/dashboard';
            break;
          case '3': // Learning
            window.location.href = '/learning';
            break;
          case '4': // Resources
            window.location.href = '/resources';
            break;
          case '5': // Profile
            window.location.href = '/profile';
            break;
          case 'a': // Accessibility panel toggle
            // Toggle accessibility panel
            const accessibilityButton = document.querySelector('[aria-label="Accessibility Settings"]') as HTMLElement;
            if (accessibilityButton) accessibilityButton.click();
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcuts]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="enhanced-focus">Enhanced Focus Indicators</Label>
        </div>
        <Switch
          id="enhanced-focus"
          checked={enhancedFocus}
          onCheckedChange={setEnhancedFocus}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="keyboard-shortcuts">Keyboard Shortcuts</Label>
        </div>
        <Switch
          id="keyboard-shortcuts"
          checked={keyboardShortcuts}
          onCheckedChange={setKeyboardShortcuts}
        />
      </div>
      
      {keyboardShortcuts && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium mb-2">Available Shortcuts</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li><kbd className="px-1 bg-muted rounded">Alt+1</kbd> Home</li>
              <li><kbd className="px-1 bg-muted rounded">Alt+2</kbd> Dashboard</li>
              <li><kbd className="px-1 bg-muted rounded">Alt+3</kbd> Learning</li>
              <li><kbd className="px-1 bg-muted rounded">Alt+4</kbd> Resources</li>
              <li><kbd className="px-1 bg-muted rounded">Alt+5</kbd> Profile</li>
              <li><kbd className="px-1 bg-muted rounded">Alt+A</kbd> Toggle Accessibility Panel</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * AgeAppropriatePresets Component
 * 
 * Provides age-appropriate accessibility presets for different student age groups.
 * Automatically adjusts multiple settings to be appropriate for each age range.
 */
const AgeAppropriatePresets: React.FC = () => {
  const { setTheme, setFontSize, setIsDyslexicFont, setIsReducedMotion } = useTheme();
  
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'nursery':
        setTheme('light');
        setFontSize(20);
        setIsDyslexicFont(true);
        setIsReducedMotion(true);
        // Additional settings would be applied here
        break;
      case 'early-primary':
        setTheme('light');
        setFontSize(18);
        setIsDyslexicFont(true);
        setIsReducedMotion(false);
        break;
      case 'late-primary':
        setTheme('light');
        setFontSize(16);
        setIsDyslexicFont(false);
        setIsReducedMotion(false);
        break;
      case 'secondary':
        setTheme('system');
        setFontSize(16);
        setIsDyslexicFont(false);
        setIsReducedMotion(false);
        break;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <Label>Age-Appropriate Presets</Label>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset('nursery')}
          className="flex flex-col items-center justify-center h-20 text-center"
        >
          <span className="text-lg mb-1">🧸</span>
          <span className="text-xs">Nursery</span>
          <span className="text-xs text-muted-foreground">(Ages 3-4)</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset('early-primary')}
          className="flex flex-col items-center justify-center h-20 text-center"
        >
          <span className="text-lg mb-1">🎨</span>
          <span className="text-xs">Early Primary</span>
          <span className="text-xs text-muted-foreground">(Ages 5-7)</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset('late-primary')}
          className="flex flex-col items-center justify-center h-20 text-center"
        >
          <span className="text-lg mb-1">📚</span>
          <span className="text-xs">Late Primary</span>
          <span className="text-xs text-muted-foreground">(Ages 8-11)</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset('secondary')}
          className="flex flex-col items-center justify-center h-20 text-center"
        >
          <span className="text-lg mb-1">🔬</span>
          <span className="text-xs">Secondary</span>
          <span className="text-xs text-muted-foreground">(Ages 12+)</span>
        </Button>
      </div>
    </div>
  );
};

/**
 * EnhancedAccessibilityPanel Component
 * 
 * A comprehensive accessibility panel that combines all accessibility features
 * into a tabbed interface for easy navigation and configuration.
 */
const EnhancedAccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-3 rounded-full shadow-lg"
        size="icon"
        aria-label="Accessibility Settings"
      >
        <Eye className="h-5 w-5" />
      </Button>
      
      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Card className="w-[90%] max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Accessibility Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <Tabs defaultValue="display" className="w-full">
              <TabsList className="grid grid-cols-4 p-1 m-2">
                <TabsTrigger value="display">
                  <Type className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Display</span>
                </TabsTrigger>
                <TabsTrigger value="reading">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Reading</span>
                </TabsTrigger>
                <TabsTrigger value="input">
                  <Keyboard className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Input</span>
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Presets</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="overflow-y-auto p-4 max-h-[60vh]">
                <TabsContent value="display" className="space-y-4">
                  {/* Display settings from AccessibilityControls */}
                  <ColorBlindnessFilters />
                </TabsContent>
                
                <TabsContent value="reading" className="space-y-4">
                  <EnhancedReadingGuides />
                </TabsContent>
                
                <TabsContent value="input" className="space-y-4">
                  <KeyboardNavigation />
                </TabsContent>
                
                <TabsContent value="presets" className="space-y-4">
                  <AgeAppropriatePresets />
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default EnhancedAccessibilityPanel;
