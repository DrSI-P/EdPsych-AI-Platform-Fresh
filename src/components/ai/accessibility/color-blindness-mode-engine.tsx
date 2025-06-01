'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Eye,
  EyeOff,
  Palette
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface ColorBlindnessModeEngineProps {
  settings: {
    enabled: boolean;
    type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'custom';
    intensity: number;
    customFilter: string;
    applyToImages: boolean;
    applyToVideos: boolean;
    highlightLinks: boolean;
    highlightButtons: boolean;
    enhanceContrast: boolean;
    contrastLevel: number;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const ColorBlindnessModeEngine: React.FC<ColorBlindnessModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [applyProgress, setApplyProgress] = React.useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  const [previewMode, setPreviewMode] = React.useState<boolean>(false);
  
  // Apply color blindness mode
  const applyColorBlindnessMode = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsApplying(true);
    setApplyProgress(0);
    
    // Simulate application process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setApplyProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Application complete
        setIsApplying(false);
        
        // Apply CSS styles based on settings
        const root = document.documentElement;
        
        // Reset existing styles
        root.style.removeProperty('--color-filter');
        root.style.removeProperty('--filter-intensity');
        root.style.removeProperty('--contrast-enhancement');
        
        // Apply new styles
        if (settings.enabled) {
          let filterValue = '';
          
          switch (settings.type) {
            case 'protanopia':
              filterValue = 'url(#protanopia-filter)';
              break;
            case 'deuteranopia':
              filterValue = 'url(#deuteranopia-filter)';
              break;
            case 'tritanopia':
              filterValue = 'url(#tritanopia-filter)';
              break;
            case 'achromatopsia':
              filterValue = 'url(#achromatopsia-filter)';
              break;
            case 'custom':
              filterValue = settings.customFilter;
              break;
            default:
              filterValue = 'none';
          }
          
          root.style.setProperty('--color-filter', filterValue);
          root.style.setProperty('--filter-intensity', `${settings.intensity}%`);
          
          if (settings.enhanceContrast) {
            root.style.setProperty('--contrast-enhancement', `${settings.contrastLevel}%`);
          }
          
          // Apply class to body for global styles
          document.body.classList.add('color-blindness-mode-active');
          
          if (settings.applyToImages) {
            document.body.classList.add('apply-filter-to-images');
          } else {
            document.body.classList.remove('apply-filter-to-images');
          }
          
          if (settings.applyToVideos) {
            document.body.classList.add('apply-filter-to-videos');
          } else {
            document.body.classList.remove('apply-filter-to-videos');
          }
          
          if (settings.highlightLinks) {
            document.body.classList.add('highlight-links');
          } else {
            document.body.classList.remove('highlight-links');
          }
          
          if (settings.highlightButtons) {
            document.body.classList.add('highlight-buttons');
          } else {
            document.body.classList.remove('highlight-buttons');
          }
        } else {
          // Remove all classes if disabled
          document.body.classList.remove('color-blindness-mode-active');
          document.body.classList.remove('apply-filter-to-images');
          document.body.classList.remove('apply-filter-to-videos');
          document.body.classList.remove('highlight-links');
          document.body.classList.remove('highlight-buttons');
        }
        
        // Log success
        console.log('Color blindness mode applied');
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings]);
  
  // Apply settings on component mount and when settings change
  React.useEffect(() => {
    if (settings.enabled) {
      applyColorBlindnessMode();
    } else {
      // Remove styles if disabled
      document.body.classList.remove('color-blindness-mode-active');
      document.body.classList.remove('apply-filter-to-images');
      document.body.classList.remove('apply-filter-to-videos');
      document.body.classList.remove('highlight-links');
      document.body.classList.remove('highlight-buttons');
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('color-blindness-mode-active');
      document.body.classList.remove('apply-filter-to-images');
      document.body.classList.remove('apply-filter-to-videos');
      document.body.classList.remove('highlight-links');
      document.body.classList.remove('highlight-buttons');
    };
  }, [settings.enabled, applyColorBlindnessMode]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Log setting change
    console.log(`Color blindness mode setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  // Toggle preview mode
  const togglePreviewMode = (): void => {
    setPreviewMode(!previewMode);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      type: 'deuteranopia' as const,
      intensity: 80,
      customFilter: 'contrast(1.1) saturate(1.5)',
      applyToImages: true,
      applyToVideos: true,
      highlightLinks: true,
      highlightButtons: true,
      enhanceContrast: true,
      contrastLevel: 110
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Log reset
    console.log('Color blindness mode settings reset to defaults');
  };
  
  // Get color blindness type label
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'protanopia':
        return 'Red-Blind (Protanopia)';
      case 'deuteranopia':
        return 'Green-Blind (Deuteranopia)';
      case 'tritanopia':
        return 'Blue-Blind (Tritanopia)';
      case 'achromatopsia':
        return 'Total Color Blindness (Achromatopsia)';
      case 'custom':
        return 'Custom Filter';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="color-blindness-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Palette className="mr-2" /> Color Blindness Mode
          </CardTitle>
          <CardDescription>
            Adjusts colors to improve visibility for users with color vision deficiencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-color-blindness-mode" className="flex items-center">
                Enable Color Blindness Mode
              </Label>
              <input
                type="checkbox"
                id="enable-color-blindness-mode"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-blindness-type" className="text-sm">Color Blindness Type</Label>
                <select
                  id="color-blindness-type"
                  value={settings.type}
                  onChange={(e) => handleSettingChange('type', e.target.value)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="protanopia">Red-Blind (Protanopia)</option>
                  <option value="deuteranopia">Green-Blind (Deuteranopia)</option>
                  <option value="tritanopia">Blue-Blind (Tritanopia)</option>
                  <option value="achromatopsia">Total Color Blindness (Achromatopsia)</option>
                  <option value="custom">Custom Filter</option>
                </select>
              </div>
              
              {settings.type === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-filter" className="text-sm">Custom CSS Filter</Label>
                  <input
                    type="text"
                    id="custom-filter"
                    value={settings.customFilter}
                    onChange={(e) => handleSettingChange('customFilter', e.target.value)}
                    disabled={!settings.enabled || settings.type !== 'custom'}
                    placeholder="e.g., contrast(1.1) saturate(1.5)"
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="text-xs text-gray-500">
                    Use CSS filter functions like contrast(), saturate(), hue-rotate(), etc.
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="filter-intensity" className="text-sm">
                    Filter Intensity: {settings.intensity}%
                  </Label>
                  <span className="text-xs text-gray-500">0 - 100%</span>
                </div>
                <input
                  type="range"
                  id="filter-intensity"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.intensity}
                  onChange={(e) => handleSettingChange('intensity', parseInt(e.target.value, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="apply-to-images" className="flex items-center text-sm">
                  Apply to Images
                </Label>
                <input
                  type="checkbox"
                  id="apply-to-images"
                  checked={settings.applyToImages}
                  onChange={(e) => handleSettingChange('applyToImages', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="apply-to-videos" className="flex items-center text-sm">
                  Apply to Videos
                </Label>
                <input
                  type="checkbox"
                  id="apply-to-videos"
                  checked={settings.applyToVideos}
                  onChange={(e) => handleSettingChange('applyToVideos', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-links" className="flex items-center text-sm">
                      Highlight Links
                    </Label>
                    <input
                      type="checkbox"
                      id="highlight-links"
                      checked={settings.highlightLinks}
                      onChange={(e) => handleSettingChange('highlightLinks', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-buttons" className="flex items-center text-sm">
                      Highlight Buttons
                    </Label>
                    <input
                      type="checkbox"
                      id="highlight-buttons"
                      checked={settings.highlightButtons}
                      onChange={(e) => handleSettingChange('highlightButtons', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enhance-contrast" className="flex items-center text-sm">
                      Enhance Contrast
                    </Label>
                    <input
                      type="checkbox"
                      id="enhance-contrast"
                      checked={settings.enhanceContrast}
                      onChange={(e) => handleSettingChange('enhanceContrast', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.enhanceContrast && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="contrast-level" className="text-sm">
                          Contrast Level: {settings.contrastLevel}%
                        </Label>
                        <span className="text-xs text-gray-500">100 - 150%</span>
                      </div>
                      <input
                        type="range"
                        id="contrast-level"
                        min="100"
                        max="150"
                        step="5"
                        value={settings.contrastLevel}
                        onChange={(e) => handleSettingChange('contrastLevel', parseInt(e.target.value, 10))}
                        disabled={!settings.enabled || !settings.enhanceContrast}
                        className="w-full"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAdvancedSettings}
              className="w-full"
            >
              {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>
            
            {isApplying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying color blindness mode...</span>
                  <span>{applyProgress}%</span>
                </div>
                <Progress value={applyProgress} className="h-2" />
              </div>
            )}
            
            {settings.enabled && (
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Active Mode:</span>
                  </div>
                  <span className="font-bold">{getTypeLabel(settings.type)}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={togglePreviewMode}
                    className="flex-1 flex items-center justify-center"
                  >
                    {previewMode ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Preview
                      </>
                    )}
                  </Button>
                </div>
                
                {previewMode && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-red-500 rounded-md"></div>
                      <div className="h-8 bg-green-500 rounded-md"></div>
                      <div className="h-8 bg-blue-500 rounded-md"></div>
                      <div className="h-8 bg-yellow-500 rounded-md"></div>
                      <div className="h-8 bg-purple-500 rounded-md"></div>
                      <div className="h-8 bg-orange-500 rounded-md"></div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Primary Button</Button>
                      <Button variant="outline" size="sm" className="flex-1">Secondary Button</Button>
                    </div>
                    
                    <div className="text-sm">
                      <p>
                        This is normal text with a <a href="#" className="text-blue-600 underline">link</a> to show how links appear.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={applyColorBlindnessMode} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying...' : 'Apply Settings'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Color Blindness Info:</strong> Approximately 8% of men and 0.5% of women experience some form of color vision deficiency. The most common type is deuteranopia (green-blindness), followed by protanopia (red-blindness).
        </p>
      </div>
      
      {/* SVG Filters for Color Blindness Simulation */}
      <div className="hidden">
        <svg>
          <defs>
            {/* Protanopia Filter (Red-Blind) */}
            <filter id="protanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.567, 0.433, 0,     0, 0
                        0.558, 0.442, 0,     0, 0
                        0,     0.242, 0.758, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
            
            {/* Deuteranopia Filter (Green-Blind) */}
            <filter id="deuteranopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.625, 0.375, 0,   0, 0
                        0.7,   0.3,   0,   0, 0
                        0,     0.3,   0.7, 0, 0
                        0,     0,     0,   1, 0"
              />
            </filter>
            
            {/* Tritanopia Filter (Blue-Blind) */}
            <filter id="tritanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.95, 0.05,  0,     0, 0
                        0,    0.433, 0.567, 0, 0
                        0,    0.475, 0.525, 0, 0
                        0,    0,     0,     1, 0"
              />
            </filter>
            
            {/* Achromatopsia Filter (Total Color Blindness) */}
            <filter id="achromatopsia-filter">
              <feColorMatrix
                type="matrix"
                values="0.299, 0.587, 0.114, 0, 0
                        0.299, 0.587, 0.114, 0, 0
                        0.299, 0.587, 0.114, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { ColorBlindnessModeEngine };
