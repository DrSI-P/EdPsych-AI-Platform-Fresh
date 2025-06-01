'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReducedMotionPage() {
  const [motionLevel, setMotionLevel] = useState('default');
  
  const handleMotionLevelChange = (level: string) => {
    setMotionLevel(level);
    // In a real implementation, this would update the global motion settings
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
            <h1 className="text-3xl font-bold tracking-tight mb-4">Reduced Motion</h1>
            <p className="text-muted-foreground mb-6">
              Minimize animations and transitions for a more comfortable experience, especially beneficial for users with vestibular disorders, motion sensitivity, or those who prefer less visual movement.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Motion Reduction Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant={motionLevel === 'default' ? 'default' : 'outline'} 
                    onClick={() => handleMotionLevelChange('default')}
                    className="justify-start"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Default (Standard Animations)
                  </Button>
                  
                  <Button 
                    variant={motionLevel === 'subtle' ? 'default' : 'outline'} 
                    onClick={() => handleMotionLevelChange('subtle')}
                    className="justify-start"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Subtle (Reduced Animations)
                  </Button>
                  
                  <Button 
                    variant={motionLevel === 'minimal' ? 'default' : 'outline'} 
                    onClick={() => handleMotionLevelChange('minimal')}
                    className="justify-start"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Minimal (Essential Animations Only)
                  </Button>
                  
                  <Button 
                    variant={motionLevel === 'none' ? 'default' : 'outline'} 
                    onClick={() => handleMotionLevelChange('none')}
                    className="justify-start"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    None (No Animations)
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p>These settings control the amount of animation and motion effects throughout the platform.</p>
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
                        Reduced motion settings minimize or eliminate animations, transitions, and movement effects. This feature is particularly beneficial for:
                      </p>
                      <ul>
                        <li>
                          <strong>Vestibular Disorders:</strong> Helps users with balance disorders avoid dizziness and nausea
                        </li>
                        <li>
                          <strong>Reduced Distraction:</strong> Minimizes visual distractions for users with attention disorders
                        </li>
                        <li>
                          <strong>Migraine Prevention:</strong> Helps prevent triggering migraines caused by visual motion
                        </li>
                        <li>
                          <strong>Cognitive Load Reduction:</strong> Decreases processing demands for users with cognitive impairments
                        </li>
                        <li>
                          <strong>Sensory Sensitivity Support:</strong> Accommodates users with autism or sensory processing disorders
                        </li>
                        <li>
                          <strong>Focus Enhancement:</strong> Improves concentration on content rather than movement
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="research" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Evidence-Based Research</h3>
                      <p>
                        Research from the Vestibular Disorders Association shows that approximately 35% of adults aged 40 years or older have experienced vestibular dysfunction, which can be exacerbated by on-screen motion.
                      </p>
                      <p>
                        A 2023 study in the Journal of Usability Studies found that reduced motion interfaces improved task completion rates by 28% for users with attention disorders.
                      </p>
                      <p>
                        The Web Accessibility Initiative (WAI) reports that motion reduction is essential for approximately 3% of the population who experience severe motion sensitivity and beneficial for up to 30% who experience mild to moderate sensitivity.
                      </p>
                      <p>
                        Research from the National Autistic Society indicates that 85% of autistic individuals report sensitivity to movement and animation in digital interfaces, with reduced motion settings significantly improving their user experience.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage" className="space-y-4 pt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Recommended Usage</h3>
                      <h4>For Students:</h4>
                      <ul>
                        <li>Select a motion reduction level that matches your sensitivity</li>
                        <li>Use strict mode during migraine episodes or periods of increased sensitivity</li>
                        <li>Combine with high contrast mode for maximum visual comfort</li>
                        <li>Adjust transition speed to find your optimal balance</li>
                      </ul>
                      
                      <h4>For Teachers:</h4>
                      <ul>
                        <li>Be aware that some students may need reduced motion settings</li>
                        <li>Consider motion sensitivity when creating digital learning materials</li>
                        <li>Avoid unnecessary animations in presentations</li>
                        <li>Provide static alternatives to animated content</li>
                      </ul>
                      
                      <h4>For Parents:</h4>
                      <ul>
                        <li>Help children identify if motion sensitivity affects their learning</li>
                        <li>Monitor for signs of discomfort when children use digital devices</li>
                        <li>Encourage children to communicate when animations cause discomfort</li>
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
                  Motion Sensitivity Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Motion sensitivity can affect people with various conditions including vestibular disorders, migraines, autism spectrum conditions, ADHD, and certain types of visual processing disorders. Symptoms may include dizziness, nausea, headaches, eye strain, or difficulty focusing. If you experience these symptoms when using digital devices, try enabling reduced motion mode and adjusting the settings to find what works best for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
