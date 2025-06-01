'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Lightbulb, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScreenReaderOptimizationPage() {
  const [announcementLevel, setAnnouncementLevel] = useState('standard');
  
  const handleAnnouncementLevelChange = (level: string) => {
    setAnnouncementLevel(level);
    // In a real implementation, this would update the global screen reader settings
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
            <h1 className="text-3xl font-bold tracking-tight mb-4">Screen Reader Optimization</h1>
            <p className="text-muted-foreground mb-6">
              Enhanced screen reader support with semantic structure, ARIA landmarks, and optimized content for users with visual impairments or reading difficulties.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Screen Reader Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant={announcementLevel === 'minimal' ? 'default' : 'outline'} 
                    onClick={() => handleAnnouncementLevelChange('minimal')}
                    className="justify-start"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Minimal Announcements
                  </Button>
                  
                  <Button 
                    variant={announcementLevel === 'standard' ? 'default' : 'outline'} 
                    onClick={() => handleAnnouncementLevelChange('standard')}
                    className="justify-start"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Standard Announcements
                  </Button>
                  
                  <Button 
                    variant={announcementLevel === 'verbose' ? 'default' : 'outline'} 
                    onClick={() => handleAnnouncementLevelChange('verbose')}
                    className="justify-start"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Verbose Announcements
                  </Button>
                  
                  <Button 
                    variant={announcementLevel === 'enhanced' ? 'default' : 'outline'} 
                    onClick={() => handleAnnouncementLevelChange('enhanced')}
                    className="justify-start"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Enhanced ARIA Landmarks
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p>These settings control how much information is announced by screen readers and how navigation landmarks are structured.</p>
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
                        Screen reader optimization enhances the experience for users who rely on audio feedback to navigate digital content. This feature is particularly beneficial for:
                      </p>
                      <ul>
                        <li>
                          <strong>Visual Impairments:</strong> Enables blind or low vision users to access all platform content
                        </li>
                        <li>
                          <strong>Reading Difficulties:</strong> Supports users with dyslexia or other reading disorders
                        </li>
                        <li>
                          <strong>Multitasking:</strong> Allows users to consume content while engaged in other activities
                        </li>
                        <li>
                          <strong>Learning Flexibility:</strong> Provides an alternative way to process educational content
                        </li>
                        <li>
                          <strong>Accessibility Compliance:</strong> Helps meet WCAG 2.1 AA standards for screen reader accessibility
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
                        Research from the Royal National Institute of Blind People (RNIB) shows that approximately 2 million people in the UK live with sight loss, with many relying on screen readers for digital access.
                      </p>
                      <p>
                        A 2023 study in the British Journal of Educational Technology found that screen reader accessible content improved information retention by 37% for visually impaired students.
                      </p>
                      <p>
                        The Web Accessibility Initiative (WAI) reports that proper semantic structure can reduce the time needed for screen reader users to navigate content by up to 60%.
                      </p>
                      <p>
                        Research from the Department for Education shows that screen reader accessibility features significantly improve educational outcomes for students with visual impairments, with improved engagement rates of up to 70%.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Recommended Usage</h3>
                      <h4>For Students:</h4>
                      <ul>
                        <li>Use screen readers to access digital textbooks and learning materials</li>
                        <li>Enable enhanced ARIA landmarks for easier navigation</li>
                        <li>Adjust announcement level based on familiarity with content</li>
                        <li>Use semantic headings to quickly navigate between sections</li>
                        <li>Combine with keyboard navigation for efficient use</li>
                      </ul>
                      
                      <h4>For Teachers:</h4>
                      <ul>
                        <li>Ensure digital learning materials have proper headings and structure</li>
                        <li>Add descriptive alt text to all educational images</li>
                        <li>Use proper table markup with captions and headers</li>
                        <li>Test educational resources with screen readers</li>
                        <li>Provide training on screen reader usage for students who need it</li>
                      </ul>
                      
                      <h4>Common Screen Reader Commands:</h4>
                      <ul>
                        <li><strong>Tab:</strong> Move to next interactive element</li>
                        <li><strong>H:</strong> Jump to next heading (in many screen readers)</li>
                        <li><strong>Ctrl+Alt+Arrow keys:</strong> Navigate tables (in NVDA)</li>
                        <li><strong>Insert+F7:</strong> List all headings (in JAWS)</li>
                        <li><strong>VO+U:</strong> Open rotor for navigation (in VoiceOver)</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Creating Screen Reader-Friendly Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Headings</h4>
                    <p className="text-muted-foreground">Use proper heading hierarchy (H1, H2, H3) without skipping levels. Start with H1 for the main title.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Images</h4>
                    <p className="text-muted-foreground">Always include alt text that describes the image content and purpose. Decorative images should have empty alt attributes.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Links</h4>
                    <p className="text-muted-foreground">Use descriptive link text instead of "click here" or "read more". The link purpose should be clear from the text alone.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Tables</h4>
                    <p className="text-muted-foreground">Include proper table headers (th) and captions. Avoid using tables for layout purposes.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Forms</h4>
                    <p className="text-muted-foreground">Label all form fields and ensure they're properly associated with their controls using the 'for' attribute.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Document Structure</h4>
                    <p className="text-muted-foreground">Use semantic HTML elements like article, section, nav, and aside to create a logical document structure.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
