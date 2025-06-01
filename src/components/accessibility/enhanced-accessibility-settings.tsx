import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Globe,
  Check,
  AlertTriangle,
  HelpCircle,
  Settings
} from 'lucide-react';

/**
 * Enhanced Color Contrast Settings Component
 * 
 * Provides advanced color contrast settings that meet WCAG AA standards
 * and offers multiple contrast modes for different visual needs.
 */
const EnhancedColorContrastSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [contrastMode, setContrastMode] = useState('standard');
  
  // Apply contrast mode
  useEffect(() => {
    document.documentElement.classList.remove(
      'contrast-standard',
      'contrast-high',
      'contrast-very-high',
      'contrast-custom'
    );
    document.documentElement.classList.add(`contrast-${contrastMode}`);
    
    // Set appropriate theme based on contrast mode
    if (contrastMode === 'high' || contrastMode === 'very-high') {
      setTheme('high-contrast');
    }
  }, [contrastMode, setTheme]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <Label>Color Contrast Settings</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contrast-mode" className="text-sm">Contrast Mode</Label>
        <Select value={contrastMode} onValueChange={setContrastMode}>
          <SelectTrigger id="contrast-mode" className="w-full">
            <SelectValue placeholder="Select contrast mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Contrast</SelectItem>
            <SelectItem value="high">High Contrast (WCAG AA)</SelectItem>
            <SelectItem value="very-high">Very High Contrast (WCAG AAA)</SelectItem>
            <SelectItem value="custom">Custom Contrast</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {contrastMode === 'custom' && (
        <div className="space-y-4 pl-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text-contrast" className="text-sm">Text Contrast</Label>
              <span className="text-xs text-muted-foreground">4.5:1 (WCAG AA)</span>
            </div>
            <Slider
              id="text-contrast"
              min={1}
              max={21}
              step={0.5}
              defaultValue={[4.5]}
              aria-label="Text contrast ratio"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ui-contrast" className="text-sm">UI Element Contrast</Label>
              <span className="text-xs text-muted-foreground">3:1 (WCAG AA)</span>
            </div>
            <Slider
              id="ui-contrast"
              min={1}
              max={21}
              step={0.5}
              defaultValue={[3]}
              aria-label="UI element contrast ratio"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-transparency" className="text-sm">Reduce Transparency</Label>
            <Switch id="reduce-transparency" />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="remove-background-images" className="text-sm">Remove Background Images</Label>
            <Switch id="remove-background-images" />
          </div>
        </div>
      )}
      
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Contrast Information</p>
            <p className="text-xs text-muted-foreground mt-1">
              High contrast modes ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
              Very high contrast meets WCAG AAA standards (7:1 for normal text, 4.5:1 for large text).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Keyboard Navigation Settings Component
 * 
 * Provides advanced keyboard navigation settings to improve
 * accessibility for keyboard-only users.
 */
const EnhancedKeyboardNavigationSettings: React.FC = () => {
  const [enhancedFocus, setEnhancedFocus] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);
  const [tabNavigation, setTabNavigation] = useState('standard');
  const [autoFocus, setAutoFocus] = useState(false);
  
  // Apply keyboard navigation settings
  useEffect(() => {
    if (enhancedFocus) {
      document.documentElement.classList.add('enhanced-focus');
    } else {
      document.documentElement.classList.remove('enhanced-focus');
    }
    
    // Apply tab navigation mode
    document.documentElement.setAttribute('data-tab-navigation', tabNavigation);
    
    // Apply auto-focus setting
    if (autoFocus) {
      document.documentElement.setAttribute('data-auto-focus', 'true');
    } else {
      document.documentElement.removeAttribute('data-auto-focus');
    }
  }, [enhancedFocus, tabNavigation, autoFocus]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Keyboard className="h-4 w-4 text-muted-foreground" />
        <Label>Keyboard Navigation Settings</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="enhanced-focus" className="text-sm">Enhanced Focus Indicators</Label>
          <Switch
            id="enhanced-focus"
            checked={enhancedFocus}
            onCheckedChange={setEnhancedFocus}
            aria-describedby="enhanced-focus-description"
          />
        </div>
        <p id="enhanced-focus-description" className="text-xs text-muted-foreground">
          Makes focus indicators larger and more visible when navigating with keyboard
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="keyboard-shortcuts" className="text-sm">Keyboard Shortcuts</Label>
          <Switch
            id="keyboard-shortcuts"
            checked={keyboardShortcuts}
            onCheckedChange={setKeyboardShortcuts}
            aria-describedby="keyboard-shortcuts-description"
          />
        </div>
        <p id="keyboard-shortcuts-description" className="text-xs text-muted-foreground">
          Enables additional keyboard shortcuts for faster navigation
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="tab-navigation" className="text-sm">Tab Navigation Mode</Label>
          <Select value={tabNavigation} onValueChange={setTabNavigation}>
            <SelectTrigger id="tab-navigation" className="w-full">
              <SelectValue placeholder="Select tab navigation mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Tab Order)</SelectItem>
              <SelectItem value="enhanced">Enhanced (Logical Groups)</SelectItem>
              <SelectItem value="simplified">Simplified (Main Elements Only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-focus" className="text-sm">Auto-Focus Important Elements</Label>
          <Switch
            id="auto-focus"
            checked={autoFocus}
            onCheckedChange={setAutoFocus}
            aria-describedby="auto-focus-description"
          />
        </div>
        <p id="auto-focus-description" className="text-xs text-muted-foreground">
          Automatically focuses on important elements when pages load
        </p>
      </div>
      
      {keyboardShortcuts && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium mb-2">Available Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+1</kbd> Home</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+2</kbd> Dashboard</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+3</kbd> Learning</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+4</kbd> Resources</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+5</kbd> Profile</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+A</kbd> Accessibility</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+S</kbd> Search</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span><kbd className="px-1 bg-muted rounded">Alt+H</kbd> Help</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Language Selection Component
 * 
 * Provides language selection options for the platform,
 * supporting internationalization and localization.
 */
const LanguageSelection: React.FC = () => {
  const [language, setLanguage] = useState('en-GB');
  
  // Apply language selection
  useEffect(() => {
    document.documentElement.lang = language;
    // In a real implementation, this would trigger i18n language change
  }, [language]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Label>Language Settings</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="language-selection" className="text-sm">Select Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language-selection" className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="cy">Welsh (Cymraeg)</SelectItem>
            <SelectItem value="ur">Urdu (اردو)</SelectItem>
            <SelectItem value="pl">Polish (Polski)</SelectItem>
            <SelectItem value="pa">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
            <SelectItem value="ar">Arabic (العربية)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-detect-language" className="text-sm">Auto-detect Language</Label>
        <Switch id="auto-detect-language" />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="rtl-support" className="text-sm">Right-to-Left Support</Label>
        <Switch 
          id="rtl-support" 
          checked={['ar', 'ur'].includes(language)}
          disabled={['ar', 'ur'].includes(language)}
        />
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-3">
        <div className="flex items-start gap-2">
          <HelpCircle className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Language Support</p>
            <p className="text-xs text-muted-foreground mt-1">
              Changing the language will translate the user interface and content.
              Right-to-Left support is automatically enabled for languages like Arabic and Urdu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simplified Interface Settings Component
 * 
 * Provides options to simplify the user interface for users with
 * cognitive disabilities or those who prefer a simpler experience.
 */
const SimplifiedInterfaceSettings: React.FC = () => {
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hideNonEssential, setHideNonEssential] = useState(false);
  const [simplificationLevel, setSimplificationLevel] = useState('moderate');
  
  // Apply simplified interface settings
  useEffect(() => {
    // Apply simplified mode
    if (simplifiedMode) {
      document.documentElement.classList.add('simplified-mode');
    } else {
      document.documentElement.classList.remove('simplified-mode');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply hide non-essential
    if (hideNonEssential) {
      document.documentElement.classList.add('hide-non-essential');
    } else {
      document.documentElement.classList.remove('hide-non-essential');
    }
    
    // Apply simplification level
    document.documentElement.setAttribute('data-simplification', simplificationLevel);
  }, [simplifiedMode, reducedMotion, hideNonEssential, simplificationLevel]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <Label>Simplified Interface Settings</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="simplified-mode" className="text-sm">Simplified Mode</Label>
          <Switch
            id="simplified-mode"
            checked={simplifiedMode}
            onCheckedChange={setSimplifiedMode}
            aria-describedby="simplified-mode-description"
          />
        </div>
        <p id="simplified-mode-description" className="text-xs text-muted-foreground">
          Simplifies the user interface for easier navigation and focus
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-motion" className="text-sm">Reduced Motion</Label>
          <Switch
            id="reduced-motion"
            checked={reducedMotion}
            onCheckedChange={setReducedMotion}
            aria-describedby="reduced-motion-description"
          />
        </div>
        <p id="reduced-motion-description" className="text-xs text-muted-foreground">
          Reduces or eliminates animations and transitions
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="hide-non-essential" className="text-sm">Hide Non-Essential Elements</Label>
          <Switch
            id="hide-non-essential"
            checked={hideNonEssential}
            onCheckedChange={setHideNonEssential}
            aria-describedby="hide-non-essential-description"
          />
        </div>
        <p id="hide-non-essential-description" className="text-xs text-muted-foreground">
          Hides decorative elements and simplifies the visual presentation
        </p>
        
        {simplifiedMode && (
          <div className="space-y-2">
            <Label htmlFor="simplification-level" className="text-sm">Simplification Level</Label>
            <Select value={simplificationLevel} onValueChange={setSimplificationLevel}>
              <SelectTrigger id="simplification-level" className="w-full">
                <SelectValue placeholder="Select simplification level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light - Minor Simplifications</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced Approach</SelectItem>
                <SelectItem value="high">High - Maximum Simplification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-3">
        <div className="flex items-start gap-2">
          <Check className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Simplified Interface Benefits</p>
            <p className="text-xs text-muted-foreground mt-1">
              Simplified mode helps users with cognitive disabilities, ADHD, or anyone who prefers
              a cleaner, more focused interface with fewer distractions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Accessibility Settings Panel
 * 
 * A comprehensive panel that combines all accessibility settings
 * in one place for easy access and configuration.
 */
const EnhancedAccessibilitySettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('visual');
  
  return (
    <div className="w-full max-w-md bg-background border rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Enhanced Accessibility Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your experience for better accessibility</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start px-4 pt-2">
          <TabsTrigger value="visual" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>Visual</span>
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="flex items-center gap-1">
            <Keyboard className="h-4 w-4" />
            <span>Keyboard</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </TabsTrigger>
          <TabsTrigger value="simplified" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Simplified</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4">
          <TabsContent value="visual">
            <EnhancedColorContrastSettings />
          </TabsContent>
          
          <TabsContent value="keyboard">
            <EnhancedKeyboardNavigationSettings />
          </TabsContent>
          
          <TabsContent value="language">
            <LanguageSelection />
          </TabsContent>
          
          <TabsContent value="simplified">
            <SimplifiedInterfaceSettings />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="p-4 border-t bg-muted/50">
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            Reset to Defaults
          </Button>
          <Button size="sm">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  EnhancedColorContrastSettings,
  EnhancedKeyboardNavigationSettings,
  LanguageSelection,
  SimplifiedInterfaceSettings,
  EnhancedAccessibilitySettingsPanel
};
