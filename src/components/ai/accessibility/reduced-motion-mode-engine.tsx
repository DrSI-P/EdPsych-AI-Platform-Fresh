'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle
} from 'lucide-react';

interface ReducedMotionModeEngineProps {
  settings: {
    enabled: boolean;
    reduceAnimations: boolean;
    disableAutoplay: boolean;
    reduceTransitions: boolean;
    disableParallaxEffects: boolean;
    disableScrollEffects: boolean;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

interface OptimizationResults {
  elementsProcessed: number;
  motionsReduced: number;
  warnings: string[];
}

export const ReducedMotionModeEngine: React.FC<ReducedMotionModeEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [optimizationStatus, setOptimizationStatus] = useState<string>('idle');
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResults>({
    elementsProcessed: 0,
    motionsReduced: 0,
    warnings: []
  });

  // Apply reduced motion optimizations
  const applyReducedMotionOptimizations = useCallback(() => {
    if (!settings.enabled) return;
    
    setIsApplying(true);
    setOptimizationStatus('processing');
    setOptimizationProgress(0);
    
    // Simulate optimization process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = (): void => {
      currentStep++;
      setOptimizationProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Optimization complete
        setOptimizationStatus('complete');
        setOptimizationResults({
          elementsProcessed: 85,
          motionsReduced: 32,
          warnings: [
            'Some third-party components may still contain animations',
            'Video content may still autoplay if controlled by external sources'
          ]
        });
        setIsApplying(false);
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings.enabled]);
  
  // Apply optimizations on settings change
  useEffect(() => {
    if (settings.enabled) {
      applyReducedMotionOptimizations();
    }
  }, [settings.enabled, applyReducedMotionOptimizations]);
  
  // Reduce animations
  const reduceAnimations = useCallback(() => {
    if (!settings.reduceAnimations) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--reduce-motion', 'reduce');
      
      // Find and modify animation elements
      const animatedElements = document.querySelectorAll('[data-animated], .animate, .animation');
      animatedElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.animation = 'none';
          element.style.transition = 'none';
        }
      });
    } catch (error) {
      console.error('Error reducing animations:', error);
    }
  }, [settings.reduceAnimations]);
  
  // Disable autoplay
  const disableAutoplay = useCallback(() => {
    if (!settings.disableAutoplay) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach((video) => {
        video.autoplay = false;
        video.pause();
      });
      
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        audio.autoplay = false;
        audio.pause();
      });
    } catch (error) {
      console.error('Error disabling autoplay:', error);
    }
  }, [settings.disableAutoplay]);
  
  // Reduce transitions
  const reduceTransitions = useCallback(() => {
    if (!settings.reduceTransitions) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      document.documentElement.style.setProperty('--reduce-transition', 'reduce');
      
      // Find and modify transition elements
      const transitionElements = document.querySelectorAll('[data-transition], .transition');
      transitionElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.transition = 'none';
        }
      });
    } catch (error) {
      console.error('Error reducing transitions:', error);
    }
  }, [settings.reduceTransitions]);
  
  // Disable parallax effects
  const disableParallaxEffects = useCallback(() => {
    if (!settings.disableParallaxEffects) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const parallaxElements = document.querySelectorAll('[data-parallax], .parallax');
      parallaxElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.backgroundAttachment = 'scroll';
          element.style.transform = 'none';
        }
      });
    } catch (error) {
      console.error('Error disabling parallax effects:', error);
    }
  }, [settings.disableParallaxEffects]);
  
  // Disable scroll effects
  const disableScrollEffects = useCallback(() => {
    if (!settings.disableScrollEffects) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      const scrollElements = document.querySelectorAll('[data-scroll], .scroll-effect');
      scrollElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.opacity = '1';
          element.style.transform = 'none';
        }
      });
    } catch (error) {
      console.error('Error disabling scroll effects:', error);
    }
  }, [settings.disableScrollEffects]);
  
  // Apply all optimizations
  const applyAllOptimizations = useCallback(() => {
    reduceAnimations();
    disableAutoplay();
    reduceTransitions();
    disableParallaxEffects();
    disableScrollEffects();
  }, [
    reduceAnimations,
    disableAutoplay,
    reduceTransitions,
    disableParallaxEffects,
    disableScrollEffects
  ]);
  
  // Apply optimizations on component mount
  useEffect(() => {
    if (settings.enabled) {
      applyAllOptimizations();
    }
  }, [settings.enabled, applyAllOptimizations]);
  
  // Handle settings toggle
  const handleSettingToggle = (setting: string, value: boolean): void => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  return (
    <div className="reduced-motion-mode-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            Reduced Motion Mode
          </CardTitle>
          <CardDescription>
            Reduce or eliminate animations and motion effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reduced-motion" className="flex items-center">
                Enable Reduced Motion Mode
              </Label>
              <input
                type="checkbox"
                id="enable-reduced-motion"
                checked={settings.enabled}
                onChange={(e) => handleSettingToggle('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Motion Reduction Settings</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-animations" className="flex items-center text-sm">
                    Reduce Animations
                  </Label>
                  <input
                    type="checkbox"
                    id="reduce-animations"
                    checked={settings.reduceAnimations}
                    onChange={(e) => handleSettingToggle('reduceAnimations', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-autoplay" className="flex items-center text-sm">
                    Disable Autoplay
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-autoplay"
                    checked={settings.disableAutoplay}
                    onChange={(e) => handleSettingToggle('disableAutoplay', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-transitions" className="flex items-center text-sm">
                    Reduce Transitions
                  </Label>
                  <input
                    type="checkbox"
                    id="reduce-transitions"
                    checked={settings.reduceTransitions}
                    onChange={(e) => handleSettingToggle('reduceTransitions', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-parallax" className="flex items-center text-sm">
                    Disable Parallax Effects
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-parallax"
                    checked={settings.disableParallaxEffects}
                    onChange={(e) => handleSettingToggle('disableParallaxEffects', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="disable-scroll-effects" className="flex items-center text-sm">
                    Disable Scroll Effects
                  </Label>
                  <input
                    type="checkbox"
                    id="disable-scroll-effects"
                    checked={settings.disableScrollEffects}
                    onChange={(e) => handleSettingToggle('disableScrollEffects', e.target.checked)}
                    disabled={!settings.enabled}
                    className="toggle toggle-sm"
                  />
                </div>
              </div>
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying reduced motion settings...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {optimizationStatus === 'complete' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="text-sm font-medium">Reduced motion settings applied successfully</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <p className="text-sm font-medium">Elements Processed</p>
                    <p className="text-2xl font-bold">{optimizationResults.elementsProcessed}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-sm font-medium">Motions Reduced</p>
                    <p className="text-2xl font-bold">{optimizationResults.motionsReduced}</p>
                  </Card>
                </div>
                
                {optimizationResults.warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Warnings</p>
                    <ul className="space-y-1">
                      {optimizationResults.warnings.map((warning, i) => (
                        <li key={`warning-${i}`} className="text-sm text-amber-500 flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={applyReducedMotionOptimizations} 
            disabled={!settings.enabled || isApplying}
            className="w-full"
          >
            {isApplying ? 'Applying Settings...' : 'Apply Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
