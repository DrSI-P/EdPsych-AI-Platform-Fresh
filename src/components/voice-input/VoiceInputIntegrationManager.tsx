"use client";

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '@/providers/voice-input-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Volume2, VolumeX, Settings, HelpCircle, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';

/**
 * VoiceInputIntegrationManager Component
 * 
 * A comprehensive manager for voice input integration across the platform.
 * This component provides centralized control for voice input settings,
 * special educational needs support, and cross-platform integration.
 */
export function VoiceInputIntegrationManager() {
  // Access voice input context
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    confidence,
    settings,
    updateSettings,
    ageGroup,
    setAgeGroup
  } = useVoiceInput();

  // Local state for settings
  const [specialNeedsSupport, setSpecialNeedsSupport] = useState({
    articulation: settings?.specialEducationalNeeds?.articulation || false,
    fluency: settings?.specialEducationalNeeds?.fluency || false,
    processing: settings?.specialEducationalNeeds?.processing || false,
    dyslexia: false,
    motorControl: false
  });

  // Platform integration settings
  const [platformIntegration, setPlatformIntegration] = useState({
    assessments: true,
    immersiveLearning: true,
    resourceLibrary: true,
    adaptiveComplexity: true,
    dashboard: true
  });

  // Update special needs settings
  const updateSpecialNeedsSettings = (key, value) => {
    setSpecialNeedsSupport(prev => {
      const updated = { ...prev, [key]: value };
      
      // Update provider settings
      if (updateSettings) {
        updateSettings({
          specialEducationalNeeds: {
            articulation: updated.articulation,
            fluency: updated.fluency,
            processing: updated.processing
          }
        });
      }
      
      return updated;
    });
  };

  // Age group options
  const ageGroups = [
    { value: 'nursery', label: 'Nursery (3-5 years)' },
    { value: 'early-primary', label: 'Early Primary (5-8 years)' },
    { value: 'late-primary', label: 'Late Primary (8-11 years)' },
    { value: 'secondary', label: 'Secondary (11+ years)' }
  ];

  // Handle age group change
  const handleAgeGroupChange = (value) => {
    if (setAgeGroup) {
      setAgeGroup(value);
    }
  };

  // Check if voice input is available
  if (!isAvailable) {
    return (
      <Alert variant="destructive">
        <AlertTitle className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Voice Input Not Available
        </AlertTitle>
        <AlertDescription>
          Voice input is not available in your browser. Please try using a modern browser like Chrome, Edge, or Safari.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2 text-primary" />
            Voice Input Integration Manager
          </CardTitle>
          <CardDescription>
            Manage voice input settings and integration across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">General Settings</TabsTrigger>
              <TabsTrigger value="special-needs">Special Educational Needs</TabsTrigger>
              <TabsTrigger value="platform">Platform Integration</TabsTrigger>
            </TabsList>
            
            {/* General Settings Tab */}
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group</Label>
                <Select value={ageGroup} onValueChange={handleAgeGroupChange}>
                  <SelectTrigger id="age-group">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Adjusts voice recognition and interface to be age-appropriate
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="child-voice-optimization" className="font-medium">Child Voice Optimization</Label>
                  <p className="text-xs text-muted-foreground">
                    Improves recognition accuracy for children's voices
                  </p>
                </div>
                <Switch 
                  id="child-voice-optimization" 
                  checked={settings?.childVoiceOptimization || false} 
                  onCheckedChange={(value) => updateSettings?.({ childVoiceOptimization: value })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="noise-reduction" className="font-medium">Classroom Noise Reduction</Label>
                  <p className="text-xs text-muted-foreground">
                    Filters out background classroom noise
                  </p>
                </div>
                <Switch 
                  id="noise-reduction" 
                  checked={settings?.noiseReduction || false} 
                  onCheckedChange={(value) => updateSettings?.({ noiseReduction: value })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dialect-adaptation" className="font-medium">UK Dialect Adaptation</Label>
                  <p className="text-xs text-muted-foreground">
                    Optimizes for regional UK accents and dialects
                  </p>
                </div>
                <Switch 
                  id="dialect-adaptation" 
                  checked={settings?.dialectAdaptation || false} 
                  onCheckedChange={(value) => updateSettings?.({ dialectAdaptation: value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings?.language || 'en-GB'} 
                  onValueChange={(value) => updateSettings?.({ language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="cy">Welsh (Cymraeg)</SelectItem>
                    <SelectItem value="ur">Urdu (اردو)</SelectItem>
                    <SelectItem value="pl">Polish (Polski)</SelectItem>
                    <SelectItem value="pa">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the primary language for voice recognition
                </p>
              </div>
            </TabsContent>
            
            {/* Special Educational Needs Tab */}
            <TabsContent value="special-needs" className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Special Educational Needs Support</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      These settings optimize voice input for children with different needs and abilities
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="articulation-support" className="font-medium">Articulation Support</Label>
                  <p className="text-xs text-muted-foreground">
                    For children with speech sound difficulties
                  </p>
                </div>
                <Switch 
                  id="articulation-support" 
                  checked={specialNeedsSupport.articulation} 
                  onCheckedChange={(value) => updateSpecialNeedsSettings('articulation', value)}
                />
              </div>
              
              {specialNeedsSupport.articulation && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <p className="text-sm">Articulation support enabled:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Extended processing time</li>
                    <li>Pattern recognition for common substitutions</li>
                    <li>Phonological awareness assistance</li>
                    <li>Visual feedback for articulation</li>
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fluency-support" className="font-medium">Fluency Support</Label>
                  <p className="text-xs text-muted-foreground">
                    For children who stammer or have dysfluent speech
                  </p>
                </div>
                <Switch 
                  id="fluency-support" 
                  checked={specialNeedsSupport.fluency} 
                  onCheckedChange={(value) => updateSpecialNeedsSettings('fluency', value)}
                />
              </div>
              
              {specialNeedsSupport.fluency && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <p className="text-sm">Fluency support enabled:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Extended silence tolerance</li>
                    <li>Repetition filtering</li>
                    <li>Stress-free interaction mode</li>
                    <li>Pacing guidance</li>
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="processing-support" className="font-medium">Processing Support</Label>
                  <p className="text-xs text-muted-foreground">
                    For children with auditory processing difficulties
                  </p>
                </div>
                <Switch 
                  id="processing-support" 
                  checked={specialNeedsSupport.processing} 
                  onCheckedChange={(value) => updateSpecialNeedsSettings('processing', value)}
                />
              </div>
              
              {specialNeedsSupport.processing && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <p className="text-sm">Processing support enabled:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Visual cues and feedback</li>
                    <li>Simplified command structure</li>
                    <li>Multi-modal confirmation</li>
                    <li>Extended processing time</li>
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dyslexia-support" className="font-medium">Dyslexia Support</Label>
                  <p className="text-xs text-muted-foreground">
                    For children with reading and writing difficulties
                  </p>
                </div>
                <Switch 
                  id="dyslexia-support" 
                  checked={specialNeedsSupport.dyslexia} 
                  onCheckedChange={(value) => updateSpecialNeedsSettings('dyslexia', value)}
                />
              </div>
              
              {specialNeedsSupport.dyslexia && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <p className="text-sm">Dyslexia support enabled:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Text-to-speech feedback</li>
                    <li>Spelling assistance</li>
                    <li>Word prediction</li>
                    <li>Simplified visual interface</li>
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="motor-control-support" className="font-medium">Motor Control Support</Label>
                  <p className="text-xs text-muted-foreground">
                    For children with physical disabilities affecting typing
                  </p>
                </div>
                <Switch 
                  id="motor-control-support" 
                  checked={specialNeedsSupport.motorControl} 
                  onCheckedChange={(value) => updateSpecialNeedsSettings('motorControl', value)}
                />
              </div>
              
              {specialNeedsSupport.motorControl && (
                <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                  <p className="text-sm">Motor control support enabled:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Dwell activation</li>
                    <li>Simplified command structure</li>
                    <li>Alternative activation methods</li>
                    <li>Switch compatibility</li>
                  </ul>
                </div>
              )}
            </TabsContent>
            
            {/* Platform Integration Tab */}
            <TabsContent value="platform" className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Platform-Wide Integration</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Control where voice input is available across the platform
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assessments-integration" className="font-medium">Assessments</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable voice input for assessments and quizzes
                  </p>
                </div>
                <Switch 
                  id="assessments-integration" 
                  checked={platformIntegration.assessments} 
                  onCheckedChange={(value) => setPlatformIntegration(prev => ({ ...prev, assessments: value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="immersive-integration" className="font-medium">Immersive Learning</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable voice commands for immersive learning experiences
                  </p>
                </div>
                <Switch 
                  id="immersive-integration" 
                  checked={platformIntegration.immersiveLearning} 
                  onCheckedChange={(value) => setPlatformIntegration(prev => ({ ...prev, immersiveLearning: value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="resource-integration" className="font-medium">Resource Library</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable voice search and navigation in resource library
                  </p>
                </div>
                <Switch 
                  id="resource-integration" 
                  checked={platformIntegration.resourceLibrary} 
                  onCheckedChange={(value) => setPlatformIntegration(prev => ({ ...prev, resourceLibrary: value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="adaptive-integration" className="font-medium">Adaptive Complexity</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable voice control for adaptive complexity features
                  </p>
                </div>
                <Switch 
                  id="adaptive-integration" 
                  checked={platformIntegration.adaptiveComplexity} 
                  onCheckedChange={(value) => setPlatformIntegration(prev => ({ ...prev, adaptiveComplexity: value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dashboard-integration" className="font-medium">Dashboard</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable voice commands in user dashboards
                  </p>
                </div>
                <Switch 
                  id="dashboard-integration" 
                  checked={platformIntegration.dashboard} 
                  onCheckedChange={(value) => setPlatformIntegration(prev => ({ ...prev, dashboard: value }))}
                />
              </div>
              
              <div className="mt-4 p-3 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Integration Status</h4>
                <div className="space-y-1">
                  {Object.entries(platformIntegration).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={value ? 'text-green-500' : 'text-amber-500'}>
                        {value ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Voice Input Guide
          </Button>
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
      
      {/* Voice Input Test Area */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Input Test Area</CardTitle>
          <CardDescription>
            Test your voice input settings in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="min-h-[100px] bg-muted rounded-md p-4 text-sm">
            {transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className="text-muted-foreground">
                {isListening ? "Listening... speak now" : "Click the microphone button to start speaking"}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {isListening ? (
                <Button 
                  variant="destructive"
                  onClick={stopListening}
                  className="flex items-center gap-1"
                >
                  <MicOff className="h-4 w-4 mr-1" />
                  Stop Listening
                </Button>
              ) : (
                <Button 
                  variant="default"
                  onClick={startListening}
                  className="flex items-center gap-1"
                >
                  <Mic className="h-4 w-4 mr-1" />
                  Start Listening
                </Button>
              )}
            </div>
            
            {confidence !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Recognition confidence:</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      confidence > 0.8 ? 'bg-green-500' : 
                      confidence > 0.5 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs">{Math.round(confidence * 100)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
