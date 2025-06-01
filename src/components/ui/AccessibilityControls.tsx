'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/ui/theme-provider';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Type, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Move, 
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilityControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  initialFontSize?: number;
  initialContrast?: 'normal' | 'high';
  initialReduceMotion?: boolean;
  initialDyslexicFont?: boolean;
  className?: string;
}

/**
 * AccessibilityControls Component
 * 
 * A floating panel that provides accessibility controls for the platform,
 * including theme switching, font size adjustment, contrast modes,
 * motion reduction, and dyslexic font options.
 */
const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  position = 'bottom-right',
  initialFontSize = 16,
  initialContrast = 'normal',
  initialReduceMotion = false,
  initialDyslexicFont = false,
  className,
}) => {
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
    isDyslexicFont,
    setIsDyslexicFont
  } = useTheme();
  
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle font size change
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system' | 'high-contrast') => {
    setTheme(newTheme);
  };
  
  // Handle motion reduction change
  const handleMotionReductionChange = (checked: boolean) => {
    setIsReducedMotion(checked);
  };
  
  // Handle dyslexic font change
  const handleDyslexicFontChange = (checked: boolean) => {
    setIsDyslexicFont(checked);
  };
  
  return (
    <div className={cn(
      'fixed z-50',
      positionClasses[position],
      className
    )}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="origin-bottom-right"
          >
            <Card className="w-72 shadow-lg border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-centre justify-between">
                  <span>Accessibility</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={togglePanel}
                    className="h-8 w-8"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-centre justify-between gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className="flex-1"
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                      className="flex-1"
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('system')}
                      className="flex-1"
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Auto
                    </Button>
                  </div>
                </div>
                
                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <Label>Font Size</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                  </div>
                  <div className="flex items-centre gap-2">
                    <ZoomOut className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={handleFontSizeChange}
                    />
                    <ZoomIn className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                {/* High Contrast */}
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="high-contrast">High Contrast</Label>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={theme === 'high-contrast'}
                    onCheckedChange={(checked) => handleThemeChange(checked ? 'high-contrast' : 'light')}
                  />
                </div>
                
                {/* Reduce Motion */}
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre gap-2">
                    <Move className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                  </div>
                  <Switch
                    id="reduce-motion"
                    checked={isReducedMotion}
                    onCheckedChange={handleMotionReductionChange}
                  />
                </div>
                
                {/* Dyslexic Font */}
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre gap-2">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="dyslexic-font">Dyslexic Font</Label>
                  </div>
                  <Switch
                    id="dyslexic-font"
                    checked={isDyslexicFont}
                    onCheckedChange={handleDyslexicFontChange}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={togglePanel}
              className="h-10 w-10 rounded-full shadow-md bg-background border-primary/20"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityControls;
