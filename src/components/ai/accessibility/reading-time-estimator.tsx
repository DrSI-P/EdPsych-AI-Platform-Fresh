'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Clock,
  BookOpen
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interfaces
interface ReadingTimeEstimatorProps {
  settings: {
    enabled: boolean;
    wordsPerMinute: number;
    showProgressBar: boolean;
    includeImages: boolean;
    imageTimeValue: number;
    includeInteractiveElements: boolean;
    interactiveTimeValue: number;
    adjustForComplexity: boolean;
    complexityFactor: number;
  };
  content?: {
    wordCount: number;
    imageCount: number;
    interactiveElementCount: number;
    complexityScore: number;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export const ReadingTimeEstimator: React.FC<ReadingTimeEstimatorProps> = ({ 
  settings,
  content = {
    wordCount: 0,
    imageCount: 0,
    interactiveElementCount: 0,
    complexityScore: 1.0
  },
  onSettingsChange
}) => {
  // State for UI and functionality
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState<boolean>(false);
  const [estimatedTime, setEstimatedTime] = React.useState<number>(0);
  const [readingProgress, setReadingProgress] = React.useState<number>(0);
  const [isReading, setIsReading] = React.useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = React.useState<number>(0);
  
  // Timer interval reference
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Calculate estimated reading time
  const calculateReadingTime = React.useCallback(() => {
    if (!settings.enabled || content.wordCount === 0) return 0;
    
    // Base time from word count
    let totalSeconds = (content.wordCount / settings.wordsPerMinute) * 60;
    
    // Add time for images if enabled
    if (settings.includeImages && content.imageCount > 0) {
      totalSeconds += content.imageCount * settings.imageTimeValue;
    }
    
    // Add time for interactive elements if enabled
    if (settings.includeInteractiveElements && content.interactiveElementCount > 0) {
      totalSeconds += content.interactiveElementCount * settings.interactiveTimeValue;
    }
    
    // Adjust for content complexity if enabled
    if (settings.adjustForComplexity) {
      totalSeconds *= content.complexityScore * (settings.complexityFactor / 100);
    }
    
    return Math.round(totalSeconds);
  }, [settings, content]);
  
  // Format time in minutes and seconds
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }
    
    return `${minutes} min ${remainingSeconds} sec`;
  };
  
  // Start reading timer
  const startReading = (): void => {
    if (isReading || estimatedTime === 0) return;
    
    setIsReading(true);
    setElapsedTime(0);
    setReadingProgress(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = prev + 1;
        const newProgress = Math.min(100, Math.round((newElapsed / estimatedTime) * 100));
        setReadingProgress(newProgress);
        
        if (newElapsed >= estimatedTime) {
          // Reading complete
          setIsReading(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
        
        return newElapsed;
      });
    }, 1000);
  };
  
  // Reset reading timer
  const resetReading = (): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsReading(false);
    setElapsedTime(0);
    setReadingProgress(0);
  };
  
  // Calculate estimated time on component mount and when settings or content change
  React.useEffect(() => {
    const time = calculateReadingTime();
    setEstimatedTime(time);
    
    // Reset reading progress if settings change
    resetReading();
    
    // Log estimated time
    if (settings.enabled && time > 0) {
      console.log(`Estimated reading time: ${formatTime(time)}`);
    }
  }, [settings, content, calculateReadingTime]);
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: unknown): void => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    // Notify parent component
    onSettingsChange(updatedSettings);
    
    // Log setting change
    console.log(`Reading time estimator setting changed: ${setting} = ${value}`);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = (): void => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  // Reset to default settings
  const resetSettings = (): void => {
    const defaultSettings = {
      enabled: true,
      wordsPerMinute: 200,
      showProgressBar: true,
      includeImages: true,
      imageTimeValue: 12,
      includeInteractiveElements: true,
      interactiveTimeValue: 30,
      adjustForComplexity: true,
      complexityFactor: 100
    };
    
    // Notify parent component
    onSettingsChange(defaultSettings);
    
    // Log reset
    console.log('Reading time estimator settings reset to defaults');
  };
  
  return (
    <div className="reading-time-estimator">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Clock className="mr-2" /> Reading Time Estimator
          </CardTitle>
          <CardDescription>
            Estimates time required to read and interact with content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reading-time" className="flex items-center">
                Enable Reading Time Estimator
              </Label>
              <input
                type="checkbox"
                id="enable-reading-time"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="words-per-minute" className="text-sm">
                    Reading Speed: {settings.wordsPerMinute} WPM
                  </Label>
                  <span className="text-xs text-gray-500">100 - 400 WPM</span>
                </div>
                <input
                  type="range"
                  id="words-per-minute"
                  min="100"
                  max="400"
                  step="10"
                  value={settings.wordsPerMinute}
                  onChange={(e) => handleSettingChange('wordsPerMinute', parseInt(e.target.value, 10))}
                  disabled={!settings.enabled}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress-bar" className="flex items-center text-sm">
                  Show Progress Bar
                </Label>
                <input
                  type="checkbox"
                  id="show-progress-bar"
                  checked={settings.showProgressBar}
                  onChange={(e) => handleSettingChange('showProgressBar', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-images" className="flex items-center text-sm">
                      Include Images in Estimate
                    </Label>
                    <input
                      type="checkbox"
                      id="include-images"
                      checked={settings.includeImages}
                      onChange={(e) => handleSettingChange('includeImages', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.includeImages && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="image-time-value" className="text-sm">
                          Seconds per Image: {settings.imageTimeValue}s
                        </Label>
                        <span className="text-xs text-gray-500">5 - 30s</span>
                      </div>
                      <input
                        type="range"
                        id="image-time-value"
                        min="5"
                        max="30"
                        step="1"
                        value={settings.imageTimeValue}
                        onChange={(e) => handleSettingChange('imageTimeValue', parseInt(e.target.value, 10))}
                        disabled={!settings.enabled || !settings.includeImages}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-interactive" className="flex items-center text-sm">
                      Include Interactive Elements
                    </Label>
                    <input
                      type="checkbox"
                      id="include-interactive"
                      checked={settings.includeInteractiveElements}
                      onChange={(e) => handleSettingChange('includeInteractiveElements', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.includeInteractiveElements && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="interactive-time-value" className="text-sm">
                          Seconds per Interactive Element: {settings.interactiveTimeValue}s
                        </Label>
                        <span className="text-xs text-gray-500">10 - 60s</span>
                      </div>
                      <input
                        type="range"
                        id="interactive-time-value"
                        min="10"
                        max="60"
                        step="5"
                        value={settings.interactiveTimeValue}
                        onChange={(e) => handleSettingChange('interactiveTimeValue', parseInt(e.target.value, 10))}
                        disabled={!settings.enabled || !settings.includeInteractiveElements}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adjust-complexity" className="flex items-center text-sm">
                      Adjust for Content Complexity
                    </Label>
                    <input
                      type="checkbox"
                      id="adjust-complexity"
                      checked={settings.adjustForComplexity}
                      onChange={(e) => handleSettingChange('adjustForComplexity', e.target.checked)}
                      disabled={!settings.enabled}
                      className="toggle toggle-sm"
                    />
                  </div>
                  
                  {settings.adjustForComplexity && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="complexity-factor" className="text-sm">
                          Complexity Factor: {settings.complexityFactor}%
                        </Label>
                        <span className="text-xs text-gray-500">50 - 200%</span>
                      </div>
                      <input
                        type="range"
                        id="complexity-factor"
                        min="50"
                        max="200"
                        step="10"
                        value={settings.complexityFactor}
                        onChange={(e) => handleSettingChange('complexityFactor', parseInt(e.target.value, 10))}
                        disabled={!settings.enabled || !settings.adjustForComplexity}
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
            
            {settings.enabled && estimatedTime > 0 && (
              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Estimated Reading Time:</span>
                  </div>
                  <span className="text-xl font-bold">{formatTime(estimatedTime)}</span>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Words: {content.wordCount}</div>
                    <div>Images: {content.imageCount}</div>
                    <div>Interactive Elements: {content.interactiveElementCount}</div>
                    <div>Complexity: {(content.complexityScore * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                {settings.showProgressBar && (
                  <div className="mt-4 space-y-2">
                    {isReading ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Reading Progress:</span>
                          <span>{readingProgress}% ({formatTime(elapsedTime)} / {formatTime(estimatedTime)})</span>
                        </div>
                        <Progress value={readingProgress} className="h-2" />
                      </>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={startReading}
                          className="flex-1"
                        >
                          Start Reading Timer
                        </Button>
                        
                        {elapsedTime > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={resetReading}
                            className="flex-1"
                          >
                            Reset Timer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {isReading && (
            <Button 
              variant="outline" 
              onClick={resetReading}
              className="w-full"
            >
              Stop Reading Timer
            </Button>
          )}
          
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
          <strong>Reading Time Tip:</strong> The average adult reads at approximately 200-250 words per minute for non-technical content. Technical or complex educational material may require a slower reading speed for comprehension.
        </p>
      </div>
    </div>
  );
};

export { ReadingTimeEstimator };
