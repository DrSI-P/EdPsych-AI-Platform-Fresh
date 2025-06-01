'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface AccessibilityControlsProps {
  settings: {
    enabled: boolean;
    screenReaderOptimization: boolean;
    highContrastMode: boolean;
    textToSpeech: boolean;
    speechToText: boolean;
    keyboardNavigation: boolean;
    reducedMotion: boolean;
    dyslexiaFriendlyMode: boolean;
    colorBlindnessMode: boolean;
    focusMode: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [activeTab, setActiveTab] = React.useState<string>('general');
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [optimizationProgress, setOptimizationProgress] = React.useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  
  // Apply accessibility settings
  const applyAccessibilitySettings = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsApplying(true);
    setOptimizationProgress(0);
    
    // Simulate optimization process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setOptimizationProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Optimization complete
        setIsApplying(false);
        
        // Success applied
        // Remove console.log for production
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings.enabled]);
  
  // Apply settings on component mount
  React.useEffect(() => {
    if (settings.enabled) {
      applyAccessibilitySettings();
    }
  }, [settings.enabled, applyAccessibilitySettings]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: boolean): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Setting changed
    // Remove console.log for production
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  // Reset all settings
  const resetAllSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      screenReaderOptimization: false,
      highContrastMode: false,
      textToSpeech: false,
      speechToText: false,
      keyboardNavigation: false,
      reducedMotion: false,
      dyslexiaFriendlyMode: false,
      colorBlindnessMode: false,
      focusMode: false
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Settings reset
    // Remove console.log for production
  };
  
  return (
    <div className="accessibility-controls">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Eye className="mr-2" /> Accessibility Controls
          </CardTitle>
          <CardDescription>
            Customize accessibility settings to improve your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-accessibility" className="flex items-center">
                Enable Accessibility Features
              </Label>
              <input
                type="checkbox"
                id="enable-accessibility"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="checkbox"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader-optimization" className="flex items-center text-sm">
                  Screen Reader Optimization
                </Label>
                <input
                  type="checkbox"
                  id="screen-reader-optimization"
                  checked={settings.screenReaderOptimization}
                  onChange={(e) => handleSettingChange('screenReaderOptimization', e.target.checked)}
                  disabled={!settings.enabled}
                  className="checkbox checkbox-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast-mode" className="flex items-center text-sm">
                  High Contrast Mode
                </Label>
                <input
                  type="checkbox"
                  id="high-contrast-mode"
                  checked={settings.highContrastMode}
                  onChange={(e) => handleSettingChange('highContrastMode', e.target.checked)}
                  disabled={!settings.enabled}
                  className="checkbox checkbox-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="text-to-speech" className="flex items-center text-sm">
                  Text to Speech
                </Label>
                <input
                  type="checkbox"
                  id="text-to-speech"
                  checked={settings.textToSpeech}
                  onChange={(e) => handleSettingChange('textToSpeech', e.target.checked)}
                  disabled={!settings.enabled}
                  className="checkbox checkbox-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-to-text" className="flex items-center text-sm">
                  Speech to Text
                </Label>
                <input
                  type="checkbox"
                  id="speech-to-text"
                  checked={settings.speechToText}
                  onChange={(e) => handleSettingChange('speechToText', e.target.checked)}
                  disabled={!settings.enabled}
                  className="checkbox checkbox-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-navigation" className="flex items-center text-sm">
                  Keyboard Navigation
                </Label>
                <input
                  type="checkbox"
                  id="keyboard-navigation"
                  checked={settings.keyboardNavigation}
                  onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                  disabled={!settings.enabled}
                  className="checkbox checkbox-sm"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduced-motion" className="flex items-center text-sm">
                      Reduced Motion
                    </Label>
                    <input
                      type="checkbox"
                      id="reduced-motion"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      disabled={!settings.enabled}
                      className="checkbox checkbox-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dyslexia-friendly-mode" className="flex items-center text-sm">
                      Dyslexia Friendly Mode
                    </Label>
                    <input
                      type="checkbox"
                      id="dyslexia-friendly-mode"
                      checked={settings.dyslexiaFriendlyMode}
                      onChange={(e) => handleSettingChange('dyslexiaFriendlyMode', e.target.checked)}
                      disabled={!settings.enabled}
                      className="checkbox checkbox-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="color-blindness-mode" className="flex items-center text-sm">
                      Color Blindness Mode
                    </Label>
                    <input
                      type="checkbox"
                      id="color-blindness-mode"
                      checked={settings.colorBlindnessMode}
                      onChange={(e) => handleSettingChange('colorBlindnessMode', e.target.checked)}
                      disabled={!settings.enabled}
                      className="checkbox checkbox-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="focus-mode" className="flex items-center text-sm">
                      Focus Mode
                    </Label>
                    <input
                      type="checkbox"
                      id="focus-mode"
                      checked={settings.focusMode}
                      onChange={(e) => handleSettingChange('focusMode', e.target.checked)}
                      disabled={!settings.enabled}
                      className="checkbox checkbox-sm"
                    />
                  </div>
                </>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAdvancedSettings}
              className="w-full"
            >
              {showAdvancedSettings ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" /> Hide Advanced Settings
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Show Advanced Settings
                </>
              )}
            </Button>
            
            {isApplying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying accessibility settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={applyAccessibilitySettings} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying Settings...' : 'Apply Settings'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetAllSettings}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Accessibility Tip:</strong> Combine multiple features for the best experience. For example, use Screen Reader Optimization with Keyboard Navigation for users who rely on screen readers.
        </p>
      </div>
      
      <div className="mt-4">
        <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Accessibility Statement</AlertTitle>
        <AlertDescription>
          We are committed to making our platform accessible to all users, regardless of ability or technology. These settings help customize your experience, but we always welcome feedback on how we can improve accessibility further.
        </AlertDescription>
        </Alert>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + A</p>
            <p className="text-gray-600">Toggle accessibility panel</p>
          </div>
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + H</p>
            <p className="text-gray-600">Toggle high contrast mode</p>
          </div>
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + T</p>
            <p className="text-gray-600">Toggle text-to-speech</p>
          </div>
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + S</p>
            <p className="text-gray-600">Toggle speech-to-text</p>
          </div>
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + R</p>
            <p className="text-gray-600">Toggle reduced motion</p>
          </div>
          <div className="p-2 border rounded-md">
            <p className="font-medium">Alt + F</p>
            <p className="text-gray-600">Toggle focus mode</p>
          </div>
        </div>
      </div>
    </div>
  );
};
