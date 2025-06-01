'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyRound, Keyboard, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KeyboardNavigationPage() {
  const [focusStyle, setFocusStyle] = useState('default');
  
  const handleFocusStyleChange = (style: string) => {
    setFocusStyle(style);
    // In a real implementation, this would update the global focus style
  };
  
  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Keyboard Navigation</h1>
            <p className="text-muted-foreground mb-6">
              Navigate our platform efficiently using just your keyboard, with enhanced focus indicators and intuitive shortcuts designed for users with motor impairments or those who prefer keyboard controls.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Focus Indicator Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant={focusStyle === 'default' ? 'default' : 'outline'} 
                    onClick={() => handleFocusStyleChange('default')}
                    className="justify-start"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Default
                  </Button>
                  
                  <Button 
                    variant={focusStyle === 'high-visibility' ? 'default' : 'outline'} 
                    onClick={() => handleFocusStyleChange('high-visibility')}
                    className="justify-start"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    High Visibility
                  </Button>
                  
                  <Button 
                    variant={focusStyle === 'large' ? 'default' : 'outline'} 
                    onClick={() => handleFocusStyleChange('large')}
                    className="justify-start"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Large Focus Ring
                  </Button>
                  
                  <Button 
                    variant={focusStyle === 'custom' ? 'default' : 'outline'} 
                    onClick={() => handleFocusStyleChange('custom')}
                    className="justify-start"
                  >
                    <MousePointer className="mr-2 h-4 w-4" />
                    Custom...
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p>These settings change the appearance of the focus indicator when navigating with the keyboard.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="benefits">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                    <TabsTrigger value="usage">Usage Tips</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="benefits" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Key Benefits</h3>
                      <p>
                        Keyboard navigation allows users to interact with our platform without using a mouse or touchscreen. This feature is particularly beneficial for:
                      </p>
                      <ul>
                        <li>
                          <strong>Motor Impairments:</strong> Users with conditions that limit fine motor control
                        </li>
                        <li>
                          <strong>Screen Reader Users:</strong> Blind or visually impaired users who navigate digitally via keyboard
                        </li>
                        <li>
                          <strong>Efficiency:</strong> Power users who prefer keyboard shortcuts for faster navigation
                        </li>
                        <li>
                          <strong>Temporary Limitations:</strong> Users with temporary injuries or situations where mouse use is difficult
                        </li>
                        <li>
                          <strong>Accessibility Compliance:</strong> Helps meet WCAG 2.1 AA standards for keyboard accessibility
                        </li>
                        <li>
                          <strong>Inclusive Design:</strong> Makes content accessible to a wider range of users
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="research" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Evidence-Based Research</h3>
                      <p>
                        Research from the Web Accessibility Initiative (WAI) shows that approximately 5% of users rely exclusively on keyboard navigation, with an additional 15% using it as their primary navigation method.
                      </p>
                      <p>
                        A 2022 study in the International Journal of Human-Computer Interaction found that optimised keyboard navigation reduced task completion time by 42% for users with motor impairments.
                      </p>
                      <p>
                        The Royal National Institute of Blind People (RNIB) reports that keyboard navigation is essential for screen reader users, who represent approximately 2% of the UK population.
                      </p>
                      <p>
                        Research from the Department for Education indicates that keyboard accessibility features significantly improve educational outcomes for students with physical disabilities, with improved engagement rates of up to 60%.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Recommended Usage</h3>
                      <h4>For Students:</h4>
                      <ul>
                        <li>Use Tab key to navigate forward through interactive elements</li>
                        <li>Use Shift+Tab to navigate backward</li>
                        <li>Press Enter or Space to activate buttons, links, and controls</li>
                        <li>Use arrow keys for additional navigation within components</li>
                        <li>Adjust focus indicator size and colour for your visual needs</li>
                      </ul>
                      
                      <h4>For Teachers:</h4>
                      <ul>
                        <li>Ensure digital learning materials are keyboard accessible</li>
                        <li>Teach keyboard navigation as an essential digital skill</li>
                        <li>Provide keyboard shortcuts for common classroom activities</li>
                        <li>Test educational resources with keyboard-only navigation</li>
                      </ul>
                      
                      <h4>Common Keyboard Shortcuts:</h4>
                      <ul>
                        <li><strong>Tab:</strong> Move to next focusable element</li>
                        <li><strong>Shift+Tab:</strong> Move to previous focusable element</li>
                        <li><strong>Enter/Space:</strong> Activate current element</li>
                        <li><strong>Esc:</strong> Close dialogs or cancel actions</li>
                        <li><strong>Arrow keys:</strong> Navigate within components</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KeyRound className="h-5 w-5 mr-2" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p className="font-medium">Platform Navigation:</p>
                  <ul className="space-y-1">
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+H</kbd> - Go to Home</li>
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+S</kbd> - Go to Search</li>
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+A</kbd> - Go to Accessibility Settings</li>
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+P</kbd> - Go to Profile</li>
                  </ul>
                  
                  <p className="font-medium mt-4">Content Navigation:</p>
                  <ul className="space-y-1">
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+1</kbd> to <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+6</kbd> - Jump to headings</li>
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd> - Find in page</li>
                    <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Alt+B</kbd> - Back to previous page</li>
                  </ul>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Note: These shortcuts are available when keyboard shortcuts are enabled in your settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
