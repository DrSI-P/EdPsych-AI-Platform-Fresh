import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Languages, 
  Settings,
  Check,
  HelpCircle,
  BookMarked,
  FileText
} from 'lucide-react';

/**
 * Multi-language Support Component
 * 
 * Provides comprehensive internationalization support for the platform,
 * including language selection, RTL support, and localized content.
 */
const MultiLanguageSupport: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en-GB');
  const [autoDetect, setAutoDetect] = useState(true);
  const [rtlSupport, setRtlSupport] = useState(false);
  
  // Available languages with their properties
  const languages = [
    { code: 'en-GB', name: 'English (UK)', rtl: false, flag: '🇬🇧' },
    { code: 'cy', name: 'Welsh (Cymraeg)', rtl: false, flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { code: 'ur', name: 'Urdu (اردو)', rtl: true, flag: '🇵🇰' },
    { code: 'pl', name: 'Polish (Polski)', rtl: false, flag: '🇵🇱' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', rtl: false, flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic (العربية)', rtl: true, flag: '🇸🇦' }
  ];
  
  // Apply language settings
  useEffect(() => {
    // Set document language
    document.documentElement.lang = currentLanguage;
    
    // Get selected language properties
    const selectedLang = languages.find(lang => lang.code === currentLanguage);
    
    // Apply RTL if needed
    if (selectedLang?.rtl) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
      setRtlSupport(true);
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
      setRtlSupport(false);
    }
    
    // In a real implementation, this would trigger i18n language change
    // and load localized content
  }, [currentLanguage]);
  
  // Auto-detect language on initial load
  useEffect(() => {
    if (autoDetect) {
      const browserLang = navigator.language;
      const supportedLang = languages.find(lang => lang.code === browserLang);
      
      if (supportedLang) {
        setCurrentLanguage(supportedLang.code);
      }
    }
  }, [autoDetect]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <Label>Language Settings</Label>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentLanguage(lang.code)}
            className="justify-start"
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span className="text-xs">{lang.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-detect" className="text-sm">Auto-detect Language</Label>
          <Switch
            id="auto-detect"
            checked={autoDetect}
            onCheckedChange={setAutoDetect}
            aria-describedby="auto-detect-description"
          />
        </div>
        <p id="auto-detect-description" className="text-xs text-muted-foreground">
          Automatically detect and apply the user's preferred language
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="rtl-support" className="text-sm">Right-to-Left Support</Label>
          <Switch
            id="rtl-support"
            checked={rtlSupport}
            disabled={true}
            aria-describedby="rtl-support-description"
          />
        </div>
        <p id="rtl-support-description" className="text-xs text-muted-foreground">
          Automatically enabled for RTL languages like Arabic and Urdu
        </p>
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-3">
        <div className="flex items-start gap-2">
          <HelpCircle className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Language Support</p>
            <p className="text-xs text-muted-foreground mt-1">
              Changing the language will translate the user interface and content.
              Content availability may vary by language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Learning Disability Support Component
 * 
 * Provides specialized support for users with learning disabilities,
 * including dyslexia, ADHD, and other cognitive challenges.
 */
const LearningDisabilitySupport: React.FC = () => {
  const [dyslexiaSupport, setDyslexiaSupport] = useState(false);
  const [adhdSupport, setAdhdSupport] = useState(false);
  const [symbolSupport, setSymbolSupport] = useState(false);
  const [simplifiedLanguage, setSimplifiedLanguage] = useState(false);
  const [contentChunking, setContentChunking] = useState(false);
  
  // Apply learning disability support settings
  useEffect(() => {
    // Apply dyslexia support
    if (dyslexiaSupport) {
      document.documentElement.classList.add('dyslexia-support');
    } else {
      document.documentElement.classList.remove('dyslexia-support');
    }
    
    // Apply ADHD support
    if (adhdSupport) {
      document.documentElement.classList.add('adhd-support');
    } else {
      document.documentElement.classList.remove('adhd-support');
    }
    
    // Apply symbol support
    if (symbolSupport) {
      document.documentElement.classList.add('symbol-support');
    } else {
      document.documentElement.classList.remove('symbol-support');
    }
    
    // Apply simplified language
    if (simplifiedLanguage) {
      document.documentElement.classList.add('simplified-language');
    } else {
      document.documentElement.classList.remove('simplified-language');
    }
    
    // Apply content chunking
    if (contentChunking) {
      document.documentElement.classList.add('content-chunking');
    } else {
      document.documentElement.classList.remove('content-chunking');
    }
  }, [dyslexiaSupport, adhdSupport, symbolSupport, simplifiedLanguage, contentChunking]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BookMarked className="h-4 w-4 text-muted-foreground" />
        <Label>Learning Support Settings</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="dyslexia-support" className="text-sm">Dyslexia Support</Label>
          <Switch
            id="dyslexia-support"
            checked={dyslexiaSupport}
            onCheckedChange={setDyslexiaSupport}
            aria-describedby="dyslexia-support-description"
          />
        </div>
        <p id="dyslexia-support-description" className="text-xs text-muted-foreground">
          Uses dyslexia-friendly fonts, spacing, and colors
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="adhd-support" className="text-sm">ADHD Support</Label>
          <Switch
            id="adhd-support"
            checked={adhdSupport}
            onCheckedChange={setAdhdSupport}
            aria-describedby="adhd-support-description"
          />
        </div>
        <p id="adhd-support-description" className="text-xs text-muted-foreground">
          Reduces distractions and provides focus aids
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="symbol-support" className="text-sm">Symbol Support</Label>
          <Switch
            id="symbol-support"
            checked={symbolSupport}
            onCheckedChange={setSymbolSupport}
            aria-describedby="symbol-support-description"
          />
        </div>
        <p id="symbol-support-description" className="text-xs text-muted-foreground">
          Adds symbols alongside text for non-readers
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="simplified-language" className="text-sm">Simplified Language</Label>
          <Switch
            id="simplified-language"
            checked={simplifiedLanguage}
            onCheckedChange={setSimplifiedLanguage}
            aria-describedby="simplified-language-description"
          />
        </div>
        <p id="simplified-language-description" className="text-xs text-muted-foreground">
          Uses simpler words and sentence structures
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="content-chunking" className="text-sm">Content Chunking</Label>
          <Switch
            id="content-chunking"
            checked={contentChunking}
            onCheckedChange={setContentChunking}
            aria-describedby="content-chunking-description"
          />
        </div>
        <p id="content-chunking-description" className="text-xs text-muted-foreground">
          Breaks content into smaller, manageable sections
        </p>
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-md p-3">
        <div className="flex items-start gap-2">
          <Check className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Learning Support Benefits</p>
            <p className="text-xs text-muted-foreground mt-1">
              These settings help make learning more accessible for users with
              different learning styles and needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Accessibility Documentation Component
 * 
 * Provides comprehensive documentation and help for accessibility features,
 * ensuring users can effectively utilize all available accessibility options.
 */
const AccessibilityDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const documentationSections = {
    overview: {
      title: "Accessibility Features Overview",
      content: "EdPsych Connect is committed to providing an accessible platform for all users. Our accessibility features are designed to support users with various needs, including visual, auditory, motor, and cognitive disabilities."
    },
    visual: {
      title: "Visual Accessibility",
      content: "Features include screen reader support, high contrast modes, color blindness filters, text resizing, and reading guides to assist users with visual impairments."
    },
    keyboard: {
      title: "Keyboard Navigation",
      content: "Full keyboard accessibility with enhanced focus indicators, keyboard shortcuts, and logical tab order to support users who cannot use a mouse."
    },
    motor: {
      title: "Motor Disability Support",
      content: "Dwell clicking, large target areas, sticky keys, and voice navigation to assist users with limited motor control or dexterity."
    },
    learning: {
      title: "Learning Disability Support",
      content: "Dyslexia-friendly fonts, ADHD support, symbol support, simplified language, and content chunking to assist users with various learning disabilities."
    },
    language: {
      title: "Language Support",
      content: "Multiple language options including Welsh, Urdu, Polish, Punjabi, and Arabic, with automatic RTL support for appropriate languages."
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <Label>Accessibility Help & Documentation</Label>
      </div>
      
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-2">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
          <TabsTrigger value="keyboard" className="text-xs">Keyboard</TabsTrigger>
          <TabsTrigger value="motor" className="text-xs">Motor</TabsTrigger>
          <TabsTrigger value="learning" className="text-xs">Learning</TabsTrigger>
          <TabsTrigger value="language" className="text-xs">Language</TabsTrigger>
        </TabsList>
        
        {Object.entries(documentationSections).map(([key, section]) => (
          <TabsContent key={key} value={key} className="space-y-2">
            <h3 className="text-sm font-medium">{section.title}</h3>
            <p className="text-xs text-muted-foreground">{section.content}</p>
            
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              View detailed documentation
            </Button>
          </TabsContent>
        ))}
      </Tabs>
      
      <Card>
        <CardContent className="p-3">
          <h4 className="text-xs font-medium mb-1">Need Additional Help?</h4>
          <p className="text-xs text-muted-foreground mb-2">
            If you need assistance with accessibility features, please contact our support team.
          </p>
          <Button variant="outline" size="sm" className="text-xs w-full">
            Contact Accessibility Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Accessibility Preference Persistence Component
 * 
 * Manages the saving, loading, and synchronization of accessibility preferences
 * across devices and sessions.
 */
const AccessibilityPreferencePersistence: React.FC = () => {
  const [autoSave, setAutoSave] = useState(true);
  const [syncPreferences, setSyncPreferences] = useState(true);
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState([
    { id: 1, name: 'High Contrast Mode', description: 'Maximum contrast with large text' },
    { id: 2, name: 'Dyslexia-Friendly', description: 'Optimized for users with dyslexia' },
    { id: 3, name: 'Motor Assistance', description: 'Dwell clicking and large targets' }
  ]);
  
  // Save current preferences as a preset
  const savePreset = () => {
    if (!presetName) return;
    
    // In a real implementation, this would save the current accessibility settings
    const newPreset = {
      id: savedPresets.length + 1,
      name: presetName,
      description: 'Custom accessibility preset'
    };
    
    setSavedPresets([...savedPresets, newPreset]);
    setPresetName('');
  };
  
  // Load a preset
  const loadPreset = (presetId: number) => {
    // In a real implementation, this would load the selected preset settings
    console.log(`Loading preset ${presetId}`);
  };
  
  // Delete a preset
  const deletePreset = (presetId: number) => {
    setSavedPresets(savedPresets.filter(preset => preset.id !== presetId));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <Label>Preference Management</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-save" className="text-sm">Auto-save Preferences</Label>
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={setAutoSave}
            aria-describedby="auto-save-description"
          />
        </div>
        <p id="auto-save-description" className="text-xs text-muted-foreground">
          Automatically save your accessibility preferences
        </p>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sync-preferences" className="text-sm">Sync Across Devices</Label>
          <Switch
            id="sync-preferences"
            checked={syncPreferences}
            onCheckedChange={setSyncPreferences}
            aria-describedby="sync-preferences-description"
          />
        </div>
        <p id="sync-preferences-description" className="text-xs text-muted-foreground">
          Synchronize your preferences across all your devices
        </p>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="preset-name" className="text-sm">Save Current Settings as Preset</Label>
        <div className="flex space-x-2">
          <input
            id="preset-name"
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="flex-1 px-3 py-1 text-sm rounded-md border"
          />
          <Button size="sm" onClick={savePreset} disabled={!presetName}>
            Save
          </Button>
        </div>
      </div>
      
      {savedPresets.length > 0 && (
        <div className="space-y-2 pt-2">
          <Label className="text-sm">Saved Presets</Label>
          <div className="space-y-2">
            {savedPresets.map((preset) => (
              <div key={preset.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="text-xs font-medium">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => loadPreset(preset.id)}>
                    Load
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deletePreset(preset.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export {
  MultiLanguageSupport,
  LearningDisabilitySupport,
  AccessibilityDocumentation,
  AccessibilityPreferencePersistence
};
