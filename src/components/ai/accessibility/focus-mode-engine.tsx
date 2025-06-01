'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Lightbulb,
  Moon
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface FocusModeEngineProps {
  settings: {
    enabled: boolean;
    dimBackground: boolean;
    dimLevel: number;
    highlightFocusedContent: boolean;
    highlightColor: string;
    blockNotifications: boolean;
    hideNonEssentialElements: boolean;
    autoScrollToActive: boolean;
    focusTimer: number;
    breakReminders: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const FocusModeEngine: React.FC<FocusModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI and functionality
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [applyProgress, setApplyProgress] = React.useState<number>(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  const [focusTimeRemaining, setFocusTimeRemaining] = React.useState<number>(0);
  const [focusTimerActive, setFocusTimerActive] = React.useState<boolean>(false);
  const [breakDue, setBreakDue] = React.useState<boolean>(false);
  
  // Timer interval reference
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Apply focus mode
  const applyFocusMode = React.useCallback(() => {
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
        root.style.removeProperty('--focus-dim-level');
        root.style.removeProperty('--focus-highlight-color');
        
        // Apply new styles
        if (settings.dimBackground) {
          root.style.setProperty('--focus-dim-level', `${settings.dimLevel}%`);
        }
        
        if (settings.highlightFocusedContent) {
          root.style.setProperty('--focus-highlight-color', settings.highlightColor);
        }
        
        // Apply class to body for global styles
        if (settings.enabled) {
          document.body.classList.add('focus-mode-active');
          
          if (settings.hideNonEssentialElements) {
            document.body.classList.add('focus-hide-nonessential');
          } else {
            document.body.classList.remove('focus-hide-nonessential');
          }
        } else {
          document.body.classList.remove('focus-mode-active');
          document.body.classList.remove('focus-hide-nonessential');
        }
        
        // Start focus timer if enabled
        if (settings.enabled && settings.focusTimer > 0) {
          startFocusTimer();
        }
        
        // Log success
        console.log('Focus mode applied');
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings]);
  
  // Start focus timer
  const startFocusTimer = React.useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set initial time
    setFocusTimeRemaining(settings.focusTimer * 60); // Convert minutes to seconds
    setFocusTimerActive(true);
    setBreakDue(false);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setFocusTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer complete
          if (settings.breakReminders) {
            setBreakDue(true);
          }
          setFocusTimerActive(false);
          
          // Clear interval
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [settings.focusTimer, settings.breakReminders]);
  
  // Reset focus timer
  const resetFocusTimer = (): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setFocusTimerActive(false);
    setBreakDue(false);
    setFocusTimeRemaining(0);
  };
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Apply settings on component mount and when settings change
  React.useEffect(() => {
    if (settings.enabled) {
      applyFocusMode();
    } else {
      // Remove styles if disabled
      document.body.classList.remove('focus-mode-active');
      document.body.classList.remove('focus-hide-nonessential');
      resetFocusTimer();
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('focus-mode-active');
      document.body.classList.remove('focus-hide-nonessential');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.enabled, applyFocusMode]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Log setting change
    console.log(`Focus mode setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      dimBackground: true,
      dimLevel: 70,
      highlightFocusedContent: true,
      highlightColor: '#f0f7ff',
      blockNotifications: true,
      hideNonEssentialElements: true,
      autoScrollToActive: true,
      focusTimer: 25,
      breakReminders: true
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Log reset
    console.log('Focus mode settings reset to defaults');
  };
  
  return (
    <div className="focus-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2" /> Focus Mode
          </CardTitle>
          <CardDescription>
            Reduces distractions and helps maintain concentration on learning content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-focus-mode" className="flex items-center">
                Enable Focus Mode
              </Label>
              <input
                type="checkbox"
                id="enable-focus-mode"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dim-background" className="flex items-center text-sm">
                  Dim Background
                </Label>
                <input
                  type="checkbox"
                  id="dim-background"
                  checked={settings.dimBackground}
                  onChange={(e) => handleSettingChange('dimBackground', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {settings.dimBackground && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="dim-level" className="text-sm">
                      Dim Level: {settings.dimLevel}%
                    </Label>
                    <span className="text-xs text-gray-500">50 - 90%</span>
                  </div>
                  <input
                    type="range"
                    id="dim-level"
                    min="50"
                    max="90"
                    step="5"
                    value={settings.dimLevel}
                    onChange={(e) => handleSettingChange('dimLevel', parseInt(e.target.value, 10))}
                    disabled={!settings.enabled || !settings.dimBackground}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-focused-content" className="flex items-center text-sm">
                  Highlight Focused Content
                </Label>
                <input
                  type="checkbox"
                  id="highlight-focused-content"
                  checked={settings.highlightFocusedContent}
                  onChange={(e) => handleSettingChange('highlightFocusedContent', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {settings.highlightFocusedContent && (
                <div className="space-y-2">
                  <Label htmlFor="highlight-color" className="text-sm">Highlight Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="highlight-color"
                      value={settings.highlightColor}
                      onChange={(e) => handleSettingChange('highlightColor', e.target.value)}
                      disabled={!settings.enabled || !settings.highlightFocusedContent}
                      className="w-8 h-8 rounded-md"
                    />
                    <span className="text-xs">{settings.highlightColor}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="focus-timer" className="text-sm">
                    Focus Timer: {settings.focusTimer} minutes
                  </Label>
                  <span className="text-xs text-gray-500">0 - 60 min</span>
                </div>
                <input
                  type="range"
                  id="focus-timer"
                  min="0"
                  max="60"
                  step="5"
                  value={settings.focusTimer}
                  onChange={(e) => handleSettingChange('focusTimer', parseInt(e.target.value, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Set to 0 to disable timer
                </div>
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="block-notifications" className="flex items-center text-sm">
                      Block Notifications
                    </Label>
                    <input
                      type="checkbox"
                      id="block-notifications"
                      checked={settings.blockNotifications}
                      onChange={(e) => handleSettingChange('blockNotifications', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-nonessential" className="flex items-center text-sm">
                      Hide Non-Essential Elements
                    </Label>
                    <input
                      type="checkbox"
                      id="hide-nonessential"
                      checked={settings.hideNonEssentialElements}
                      onChange={(e) => handleSettingChange('hideNonEssentialElements', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-scroll" className="flex items-center text-sm">
                      Auto-Scroll to Active Content
                    </Label>
                    <input
                      type="checkbox"
                      id="auto-scroll"
                      checked={settings.autoScrollToActive}
                      onChange={(e) => handleSettingChange('autoScrollToActive', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="break-reminders" className="flex items-center text-sm">
                      Break Reminders
                    </Label>
                    <input
                      type="checkbox"
                      id="break-reminders"
                      checked={settings.breakReminders}
                      onChange={(e) => handleSettingChange('breakReminders', e.target.checked)}
                      disabled={!settings.enabled || settings.focusTimer === 0}
                      className="toggle toggle-sm"
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
              {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>
            
            {isApplying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying focus mode...</span>
                  <span>{applyProgress}%</span>
                </div>
                <Progress value={applyProgress} className="h-2" />
              </div>
            )}
            
            {focusTimerActive && (
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Focus Time Remaining:</span>
                  <span className="text-xl font-bold">{formatTimeRemaining(focusTimeRemaining)}</span>
                </div>
                <Progress 
                  value={(focusTimeRemaining / (settings.focusTimer * 60)) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
            )}
            
            {breakDue && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Break Time!</AlertTitle>
                <AlertDescription>
                  <p>You&apos;ve been focusing for {settings.focusTimer} minutes. Time to take a short break!</p>
                  <Button 
                    size="sm" 
                    onClick={startFocusTimer}
                    className="mt-2"
                  >
                    Start Another Focus Session
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={applyFocusMode} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying...' : 'Apply Settings'}
          </Button>
          
          <div className="flex space-x-2 w-full">
            {settings.focusTimer > 0 && !focusTimerActive && !breakDue && (
              <Button 
                variant="outline" 
                onClick={startFocusTimer}
                disabled={!settings.enabled}
                className="flex-1"
              >
                Start Focus Timer
              </Button>
            )}
            
            {(focusTimerActive || breakDue) && (
              <Button 
                variant="outline" 
                onClick={resetFocusTimer}
                className="flex-1"
              >
                Reset Timer
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="flex-1"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
        <p className="text-sm text-blue-800">
          <strong>Focus Tip:</strong> The Pomodoro Technique suggests working in focused 25-minute intervals followed by 5-minute breaks. This can help maintain concentration and prevent mental fatigue during learning sessions.
        </p>
      </div>
    </div>
  );
};

export { FocusModeEngine };
