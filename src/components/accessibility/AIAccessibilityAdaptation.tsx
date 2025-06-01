"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccessibility } from './accessibility-provider';
import { Brain, Sparkles, Gauge, Settings, BookOpen, MessageSquare, AlertTriangle } from 'lucide-react';

/**
 * AIAccessibilityAdaptation Component
 * 
 * Provides AI-powered accessibility adaptations that dynamically adjust content
 * and interface elements based on user needs and preferences. This component
 * leverages AI to enhance accessibility beyond static settings.
 */
export function AIAccessibilityAdaptation() {
  // Access global accessibility context
  const { 
    highContrast, 
    setHighContrast,
    fontSize, 
    setFontSize
  } = useAccessibility();

  // AI adaptation settings
  const [aiAdaptationEnabled, setAiAdaptationEnabled] = useState<boolean>(true);
  const [adaptationLevel, setAdaptationLevel] = useState<number>(50);
  const [learningProfile, setLearningProfile] = useState<string>("automatic");
  const [contentSimplification, setContentSimplification] = useState<boolean>(true);
  const [dynamicAdjustments, setDynamicAdjustments] = useState<boolean>(true);
  const [voiceAssistant, setVoiceAssistant] = useState<boolean>(false);
  const [adaptationFeedback, setAdaptationFeedback] = useState<boolean>(true);
  
  // Sample adaptation insights (in a real implementation, these would come from AI analysis)
  const adaptationInsights = [
    { type: "Reading Level", current: "Year 5", recommendation: "Simplify vocabulary for Year 4 level" },
    { type: "Visual Processing", current: "Standard", recommendation: "Increase spacing between paragraphs" },
    { type: "Attention Support", current: "Minimal", recommendation: "Add focus highlighting to active sections" }
  ];

  // Handle adaptation level change
  const handleAdaptationLevelChange = (value: number[]) => {
    setAdaptationLevel(value[0]);
  };

  // Learning profile options
  const learningProfiles = [
    { value: "automatic", label: "Automatic Detection" },
    { value: "dyslexia", label: "Dyslexia Support" },
    { value: "adhd", label: "ADHD Support" },
    { value: "asd", label: "Autism Spectrum Support" },
    { value: "visual", label: "Visual Processing Support" },
    { value: "auditory", label: "Auditory Processing Support" },
    { value: "esl", label: "English as Additional Language" },
    { value: "custom", label: "Custom Profile" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI-Powered Accessibility Adaptation
        </CardTitle>
        <CardDescription>
          Intelligent content and interface adaptations based on your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="ai-adaptation" className="font-medium">AI Adaptation</Label>
            <p className="text-xs text-muted-foreground">
              Enables intelligent accessibility adaptations
            </p>
          </div>
          <Switch 
            id="ai-adaptation" 
            checked={aiAdaptationEnabled} 
            onCheckedChange={setAiAdaptationEnabled}
            aria-label="Toggle AI adaptation"
          />
        </div>

        {aiAdaptationEnabled && (
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="learning-profile">Learning Profile</Label>
                <Select value={learningProfile} onValueChange={setLearningProfile}>
                  <SelectTrigger id="learning-profile" aria-label="Select learning profile">
                    <SelectValue placeholder="Select learning profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningProfiles.map((profile) => (
                      <SelectItem key={profile.value} value={profile.value}>
                        {profile.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {learningProfile === "automatic" 
                    ? "AI will automatically detect and adapt to your learning needs" 
                    : `Optimizes content for ${learningProfile === "custom" ? "your custom" : learningProfile} support needs`}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="adaptation-level" className="font-medium">Adaptation Intensity</Label>
                  <span className="text-sm">{adaptationLevel}%</span>
                </div>
                <Slider
                  id="adaptation-level"
                  min={0}
                  max={100}
                  step={10}
                  value={[adaptationLevel]}
                  onValueChange={handleAdaptationLevelChange}
                  aria-label="Adjust adaptation intensity"
                />
                <p className="text-xs text-muted-foreground">
                  Controls how significantly AI will adapt content and interface
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="content-simplification" className="font-medium">Content Simplification</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically simplifies complex content
                  </p>
                </div>
                <Switch 
                  id="content-simplification" 
                  checked={contentSimplification} 
                  onCheckedChange={setContentSimplification}
                  aria-label="Toggle content simplification"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dynamic-adjustments" className="font-medium">Dynamic Adjustments</Label>
                  <p className="text-xs text-muted-foreground">
                    Adapts in real-time based on your interactions
                  </p>
                </div>
                <Switch 
                  id="dynamic-adjustments" 
                  checked={dynamicAdjustments} 
                  onCheckedChange={setDynamicAdjustments}
                  aria-label="Toggle dynamic adjustments"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-assistant" className="font-medium">AI Voice Assistant</Label>
                  <p className="text-xs text-muted-foreground">
                    Provides spoken guidance for accessibility features
                  </p>
                </div>
                <Switch 
                  id="voice-assistant" 
                  checked={voiceAssistant} 
                  onCheckedChange={setVoiceAssistant}
                  aria-label="Toggle AI voice assistant"
                />
              </div>
            </TabsContent>
            
            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">AI-Generated Accessibility Insights</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on your usage patterns, AI has identified these potential accessibility improvements
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-2">
                {adaptationInsights.map((insight, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">{insight.type}</h4>
                        <p className="text-xs text-muted-foreground">Current: {insight.current}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Apply</Button>
                    </div>
                    <p className="text-xs mt-2 text-primary">
                      Recommendation: {insight.recommendation}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <Label htmlFor="adaptation-feedback" className="font-medium">Adaptation Feedback</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about AI adaptations
                  </p>
                </div>
                <Switch 
                  id="adaptation-feedback" 
                  checked={adaptationFeedback} 
                  onCheckedChange={setAdaptationFeedback}
                  aria-label="Toggle adaptation feedback"
                />
              </div>
            </TabsContent>
            
            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="reading-level-adaptation">Reading Level Adaptation</Label>
                <Select defaultValue="automatic">
                  <SelectTrigger id="reading-level-adaptation" aria-label="Select reading level adaptation">
                    <SelectValue placeholder="Select adaptation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic (Based on Profile)</SelectItem>
                    <SelectItem value="none">No Adaptation</SelectItem>
                    <SelectItem value="mild">Mild Simplification</SelectItem>
                    <SelectItem value="moderate">Moderate Simplification</SelectItem>
                    <SelectItem value="significant">Significant Simplification</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls how text complexity is adjusted
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visual-adaptation">Visual Adaptation</Label>
                <Select defaultValue="automatic">
                  <SelectTrigger id="visual-adaptation" aria-label="Select visual adaptation">
                    <SelectValue placeholder="Select adaptation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic (Based on Profile)</SelectItem>
                    <SelectItem value="none">No Adaptation</SelectItem>
                    <SelectItem value="spacing">Enhanced Spacing</SelectItem>
                    <SelectItem value="highlighting">Content Highlighting</SelectItem>
                    <SelectItem value="focus">Focus Assistance</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Support</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls visual presentation adaptations
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interaction-adaptation">Interaction Adaptation</Label>
                <Select defaultValue="automatic">
                  <SelectTrigger id="interaction-adaptation" aria-label="Select interaction adaptation">
                    <SelectValue placeholder="Select adaptation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic (Based on Profile)</SelectItem>
                    <SelectItem value="none">No Adaptation</SelectItem>
                    <SelectItem value="timing">Extended Timing</SelectItem>
                    <SelectItem value="input">Input Assistance</SelectItem>
                    <SelectItem value="navigation">Navigation Support</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Support</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls how user interactions are adapted
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Privacy Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI adaptation uses anonymized interaction data to improve accessibility. No personal information is stored or shared.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {!aiAdaptationEnabled && (
          <div className="bg-muted p-6 rounded-md text-center">
            <Gauge className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">AI Adaptation Disabled</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enable AI adaptation to receive personalized accessibility adjustments based on your needs and preferences.
            </p>
            <Button 
              onClick={() => setAiAdaptationEnabled(true)}
              className="mx-auto"
            >
              Enable AI Adaptation
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Reset AI Learning
        </Button>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
