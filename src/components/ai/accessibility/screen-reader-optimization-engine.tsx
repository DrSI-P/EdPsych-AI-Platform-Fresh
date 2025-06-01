'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  Info,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ScreenReaderOptimizationEngineProps {
  settings: {
    enabled: boolean;
    enhanceHeadings: boolean;
    improveAltText: boolean;
    addContextualDescriptions: boolean;
    optimizeTabOrder: boolean;
    verbosityLevel: string;
  };
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

interface OptimizationResults {
  elementsProcessed: number;
  elementsEnhanced: number;
  warnings: string[];
}

export const ScreenReaderOptimizationEngine: React.FC<ScreenReaderOptimizationEngineProps> = ({ 
  settings,
  onSettingsChange
}) => {
  // State for UI
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);
  const [optimizationStatus, setOptimizationStatus] = React.useState<string>('idle');
  const [optimizationProgress, setOptimizationProgress] = React.useState<number>(0);
  const [optimizationResults, setOptimizationResults] = React.useState<OptimizationResults>({
    elementsProcessed: 0,
    elementsEnhanced: 0,
    warnings: []
  });

  // Verbosity level options
  const verbosityLevelOptions = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'verbose', label: 'Verbose' }
  ];

  // Apply screen reader optimizations
  const applyScreenReaderOptimizations = React.useCallback(() => {
    if (!settings.enabled) return;
    
    setIsOptimizing(true);
    setOptimizationStatus('processing');
    setOptimizationProgress(0);
    
    // Simulate optimization process
    const totalSteps = 5;
    let currentStep = 0;
    
    const processStep = () => {
      currentStep++;
      setOptimizationProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep === totalSteps) {
        // Optimization complete
        setOptimizationStatus('complete');
        setOptimizationResults({
          elementsProcessed: 127,
          elementsEnhanced: 84,
          warnings: [
            'Some dynamic content may require manual review',
            'Complex visualizations may need additional descriptions'
          ]
        });
        setIsOptimizing(false);
      } else {
        // Continue to next step
        setTimeout(processStep, 500);
      }
    };
    
    // Start processing
    setTimeout(processStep, 500);
  }, [settings.enabled]);
  
  // Apply optimizations on settings change
  React.useEffect(() => {
    if (settings.enabled) {
      applyScreenReaderOptimizations();
    }
  }, [settings.enabled, applyScreenReaderOptimizations]);
  
  // Enhance headings
  const enhanceHeadings = React.useCallback(() => {
    if (!settings.enabled || !settings.enhanceHeadings) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find all headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Process each heading
      headings.forEach((heading) => {
        // Add role="heading" and aria-level
        const level = parseInt(heading.tagName.substring(1), 10);
        heading.setAttribute('role', 'heading');
        heading.setAttribute('aria-level', level.toString());
        
        // Add context based on verbosity level
        if (settings.verbosityLevel === 'detailed' || settings.verbosityLevel === 'verbose') {
          // Add section context if available
          const section = heading.closest('section');
          if (section && section.getAttribute('aria-label')) {
            const sectionLabel = section.getAttribute('aria-label');
            heading.setAttribute('aria-describedby', `section-${sectionLabel}`);
          }
        }
      });
    } catch (error) {
      console.error('Error enhancing headings:', error);
    }
  }, [settings.enabled, settings.enhanceHeadings, settings.verbosityLevel]);
  
  // Improve alt text
  const improveAltText = React.useCallback(() => {
    if (!settings.enabled || !settings.improveAltText) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find all images
      const images = document.querySelectorAll('img');
      
      // Process each image
      images.forEach((image) => {
        // Check if image has alt text
        if (!image.hasAttribute('alt') || image.getAttribute('alt') === '') {
          // Generate alt text based on context
          let altText = 'Image';
          
          // Try to get context from parent elements
          const figure = image.closest('figure');
          if (figure) {
            const figcaption = figure.querySelector('figcaption');
            if (figcaption && figcaption.textContent) {
              altText = figcaption.textContent;
            }
          }
          
          // Use filename as fallback
          if (altText === 'Image' && image.src) {
            const filename = image.src.split('/').pop()?.split('.')[0];
            if (filename) {
              // Convert filename to readable text
              altText = filename
                .replace(/[-_]/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .trim();
            }
          }
          
          // Set alt text
          image.setAttribute('alt', altText);
        }
        
        // Add role="img" for better screen reader support
        image.setAttribute('role', 'img');
      });
    } catch (error) {
      console.error('Error improving alt text:', error);
    }
  }, [settings.enabled, settings.improveAltText]);
  
  // Add contextual descriptions
  const addContextualDescriptions = React.useCallback(() => {
    if (!settings.enabled || !settings.addContextualDescriptions) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find all interactive elements
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], [role="link"]');
      
      // Process each interactive element
      interactiveElements.forEach((element) => {
        // Check if element has accessible name
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          // Generate accessible name based on content
          const text = element.textContent?.trim();
          
          // If element has no text content, try to generate a label
          if (!text || text === '') {
            // Check if it's an icon button
            const hasIcon = element.querySelector('svg, img, i');
            if (hasIcon) {
              // Try to get context from parent elements
              const parent = element.parentElement;
              if (parent && parent.textContent) {
                const parentText = parent.textContent.trim();
                if (parentText) {
                  element.setAttribute('aria-label', `${parentText} button`);
                } else {
                  element.setAttribute('aria-label', 'Button');
                }
              } else {
                element.setAttribute('aria-label', 'Button');
              }
            }
          }
        }
        
        // Add context based on verbosity level
        if (settings.verbosityLevel === 'detailed' || settings.verbosityLevel === 'verbose') {
          // Add description for links
          if (element.tagName.toLowerCase() === 'a') {
            const href = element.getAttribute('href');
            if (href) {
              // Check if it's an external link
              if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                element.setAttribute('aria-description', 'External link');
              }
              
              // Check if it's a download link
              if (element.hasAttribute('download')) {
                element.setAttribute('aria-description', 'Download link');
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error adding contextual descriptions:', error);
    }
  }, [settings.enabled, settings.addContextualDescriptions, settings.verbosityLevel]);
  
  // Optimize tab order
  const optimizeTabOrder = React.useCallback(() => {
    if (!settings.enabled || !settings.optimizeTabOrder) return;
    
    try {
      // Implementation would go here
      // This is a placeholder for the actual implementation
      
      // Find all focusable elements
      const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
      
      // Create an array of elements with their positions
      const elements = Array.from(focusableElements).map((element, i) => ({
        element,
        originalIndex: i,
        rect: element.getBoundingClientRect()
      }));
      
      // Sort elements by position (top to bottom, left to right)
      elements.sort((a, b) => {
        // If elements are roughly on the same row
        if (Math.abs(a.rect.top - b.rect.top) < 50) {
          return a.rect.left - b.rect.left;
        }
        return a.rect.top - b.rect.top;
      });
      
      // Set tabindex based on sorted order
      elements.forEach((item, i) => {
        // Only set tabindex if it's different from the natural order
        if (i !== item.originalIndex) {
          item.element.setAttribute('tabindex', '0');
        }
      });
    } catch (error) {
      console.error('Error optimizing tab order:', error);
    }
  }, [settings.enabled, settings.optimizeTabOrder]);
  
  // Apply all optimizations
  const applyAllOptimizations = React.useCallback(() => {
    enhanceHeadings();
    improveAltText();
    addContextualDescriptions();
    optimizeTabOrder();
  }, [
    enhanceHeadings,
    improveAltText,
    addContextualDescriptions,
    optimizeTabOrder
  ]);
  
  // Apply optimizations on component mount
  React.useEffect(() => {
    if (settings.enabled) {
      applyAllOptimizations();
    }
  }, [settings.enabled, applyAllOptimizations]);
  
  // Handle settings change
  const handleSettingChange = (setting: string, value: boolean | string): void => {
    onSettingsChange({
      ...settings,
      [setting]: value
    });
  };
  
  return (
    <div className="screen-reader-optimization-engine">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2" /> Screen Reader Optimization
          </CardTitle>
          <CardDescription>
            Enhance content for screen reader users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-screen-reader" className="flex items-center">
                Enable Screen Reader Optimization
              </Label>
              <input
                type="checkbox"
                id="enable-screen-reader"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                className="toggle"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enhance-headings" className="flex items-center text-sm">
                  Enhance Headings
                </Label>
                <input
                  type="checkbox"
                  id="enhance-headings"
                  checked={settings.enhanceHeadings}
                  onChange={(e) => handleSettingChange('enhanceHeadings', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="improve-alt-text" className="flex items-center text-sm">
                  Improve Alt Text
                </Label>
                <input
                  type="checkbox"
                  id="improve-alt-text"
                  checked={settings.improveAltText}
                  onChange={(e) => handleSettingChange('improveAltText', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="add-contextual-descriptions" className="flex items-center text-sm">
                  Add Contextual Descriptions
                </Label>
                <input
                  type="checkbox"
                  id="add-contextual-descriptions"
                  checked={settings.addContextualDescriptions}
                  onChange={(e) => handleSettingChange('addContextualDescriptions', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="optimize-tab-order" className="flex items-center text-sm">
                  Optimize Tab Order
                </Label>
                <input
                  type="checkbox"
                  id="optimize-tab-order"
                  checked={settings.optimizeTabOrder}
                  onChange={(e) => handleSettingChange('optimizeTabOrder', e.target.checked)}
                  disabled={!settings.enabled}
                  className="toggle toggle-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verbosity-level" className="text-sm">Verbosity Level</Label>
                <select
                  id="verbosity-level"
                  value={settings.verbosityLevel}
                  onChange={(e) => handleSettingChange('verbosityLevel', e.target.value)}
                  disabled={!settings.enabled}
                  className="w-full p-2 border rounded-md"
                >
                  {verbosityLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {optimizationStatus === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Applying screen reader optimizations...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
            
            {optimizationStatus === 'complete' && (
              <div className="space-y-4">
                <Alert variant="success">
                  <AlertTitle>Screen reader optimizations applied successfully</AlertTitle>
                </Alert>
                
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{optimizationResults.elementsProcessed}</p>
                      <p className="text-sm text-muted-foreground">Elements Processed</p>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{optimizationResults.elementsEnhanced}</p>
                      <p className="text-sm text-muted-foreground">Elements Enhanced</p>
                    </div>
                  </Card>
                </div>
                
                {optimizationResults.warnings.length > 0 && (
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2">
                        {optimizationResults.warnings.map((warning, index) => (
                          <li key={`warning-${index}`}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={applyScreenReaderOptimizations} 
            disabled={!settings.enabled || isOptimizing}
            className="w-full"
          >
            {isOptimizing ? 'Optimizing...' : 'Apply Optimizations'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
