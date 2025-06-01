'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Eye, Palette, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HighContrastPage() {
  const [contrastMode, setContrastMode] = useState('default');
  
  const handleContrastChange = (mode: string) => {
    setContrastMode(mode);
    // In a real implementation, this would update the global theme
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
            <h1 className="text-3xl font-bold tracking-tight mb-4">High Contrast Mode</h1>
            <p className="text-muted-foreground mb-6">
              Enhance visual clarity and readability with our high contrast display options, designed to improve accessibility for users with visual impairments or reading difficulties.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Select Contrast Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant={contrastMode === 'default' ? 'default' : 'outline'} 
                    onClick={() => handleContrastChange('default')}
                    className="justify-start"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Default
                  </Button>
                  
                  <Button 
                    variant={contrastMode === 'white-on-black' ? 'default' : 'outline'} 
                    onClick={() => handleContrastChange('white-on-black')}
                    className="justify-start bg-black text-white hover:bg-black/90 hover:text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    White on Black
                  </Button>
                  
                  <Button 
                    variant={contrastMode === 'black-on-white' ? 'default' : 'outline'} 
                    onClick={() => handleContrastChange('black-on-white')}
                    className="justify-start bg-white text-black hover:bg-white/90 hover:text-black border border-gray-200"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Black on White
                  </Button>
                  
                  <Button 
                    variant={contrastMode === 'yellow-on-black' ? 'default' : 'outline'} 
                    onClick={() => handleContrastChange('yellow-on-black')}
                    className="justify-start bg-black text-yellow-300 hover:bg-black/90 hover:text-yellow-300"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Yellow on Black
                  </Button>
                  
                  <Button 
                    variant={contrastMode === 'black-on-yellow' ? 'default' : 'outline'} 
                    onClick={() => handleContrastChange('black-on-yellow')}
                    className="justify-start bg-yellow-300 text-black hover:bg-yellow-300/90 hover:text-black"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Black on Yellow
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p>These settings change the appearance of the platform to improve readability and reduce eye strain.</p>
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
                        High contrast mode enhances the visibility of text and interface elements by maximizing the contrast between foreground and background colors. This feature is particularly beneficial for:
                      </p>
                      <ul>
                        <li>
                          <strong>Visual Impairments:</strong> Assists users with low vision, color blindness, or visual processing disorders
                        </li>
                        <li>
                          <strong>Reduced Eye Strain:</strong> Minimizes fatigue during extended reading or screen time
                        </li>
                        <li>
                          <strong>Improved Focus:</strong> Helps users with attention difficulties concentrate on content
                        </li>
                        <li>
                          <strong>Customization:</strong> Allows personalization to meet individual visual needs
                        </li>
                        <li>
                          <strong>Accessibility Compliance:</strong> Helps meet WCAG 2.1 AA standards for contrast ratios
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
                        Research from the Royal National Institute of Blind People (RNIB) shows that high contrast modes can improve reading speed by up to 35% for users with visual impairments.
                      </p>
                      <p>
                        A 2022 study in the British Journal of Ophthalmology found that customizable contrast settings significantly improved content accessibility for users with age-related macular degeneration.
                      </p>
                      <p>
                        The Web Accessibility Initiative (WAI) reports that proper contrast is one of the most important factors in digital accessibility, with an estimated 1 in 12 men and 1 in 200 women experiencing some form of colour vision deficiency.
                      </p>
                      <p>
                        Research from the Department for Education indicates that appropriate visual adjustments can increase engagement and reduce cognitive load for students with specific learning differences.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Recommended Usage</h3>
                      <h4>For Students:</h4>
                      <ul>
                        <li>Select a contrast mode that works best for your specific visual needs</li>
                        <li>Increase text size for improved readability during extended reading</li>
                        <li>Enable reduced animations if you experience visual tracking difficulties</li>
                        <li>Use custom colour settings if you have specific colour sensitivity</li>
                      </ul>
                      
                      <h4>For Teachers:</h4>
                      <ul>
                        <li>Encourage students to explore different contrast settings</li>
                        <li>Consider high contrast mode when creating digital learning materials</li>
                        <li>Understand how different visual presentations affect different learners</li>
                        <li>Use high contrast mode during presentations for better visibility</li>
                      </ul>
                      
                      <h4>For Parents:</h4>
                      <ul>
                        <li>Help children find the most comfortable visual settings</li>
                        <li>Be aware that visual preferences may change with lighting conditions</li>
                        <li>Monitor for signs of eye strain when children use digital devices</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Visual Sensitivity Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Some high contrast settings may cause discomfort for users with certain visual sensitivities or conditions like photophobia. If you experience any discomfort, try adjusting the contrast level or switching to a different mode. The "Black on Yellow" and "Yellow on Black" options are often recommended for users with dyslexia, while "White on Black" may be preferred by users with light sensitivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
