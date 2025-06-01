"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccessibility } from './accessibility-provider';
import { BookOpen, FileText, Lightbulb, HelpCircle, Check, AlertTriangle } from 'lucide-react';

/**
 * UKCurriculumAccessibility Component
 * 
 * Provides specialized accessibility features aligned with UK curriculum standards
 * and Department for Education (DfE) guidelines. This component enhances the
 * platform's accessibility for UK educational contexts.
 */
export function UKCurriculumAccessibility() {
  const { 
    highContrast, 
    setHighContrast,
    fontSize, 
    setFontSize,
    colorBlindMode,
    setColorBlindMode
  } = useAccessibility();

  // UK curriculum-specific settings
  const [keyStage, setKeyStage] = useState<string>("ks2");
  const [subjectSpecificAdaptations, setSubjectSpecificAdaptations] = useState<boolean>(true);
  const [examAccommodations, setExamAccommodations] = useState<boolean>(false);
  const [simplifiedCurriculum, setSimplifiedCurriculum] = useState<boolean>(false);
  const [visualSupports, setVisualSupports] = useState<boolean>(true);
  const [sendSupport, setSendSupport] = useState<string>("none");

  // Key stages in UK education
  const keyStages = [
    { value: "eyfs", label: "Early Years Foundation Stage" },
    { value: "ks1", label: "Key Stage 1 (Years 1-2)" },
    { value: "ks2", label: "Key Stage 2 (Years 3-6)" },
    { value: "ks3", label: "Key Stage 3 (Years 7-9)" },
    { value: "ks4", label: "Key Stage 4 (Years 10-11)" },
    { value: "ks5", label: "Key Stage 5 (Years 12-13)" }
  ];

  // SEND support options
  const sendOptions = [
    { value: "none", label: "No additional support" },
    { value: "cognition", label: "Cognition and Learning" },
    { value: "communication", label: "Communication and Interaction" },
    { value: "sensory", label: "Sensory and/or Physical Needs" },
    { value: "social", label: "Social, Emotional and Mental Health" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          UK Curriculum Accessibility
        </CardTitle>
        <CardDescription>
          Specialized accessibility features aligned with UK educational standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="curriculum">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="send">SEND Support</TabsTrigger>
            <TabsTrigger value="exams">Exam Access</TabsTrigger>
          </TabsList>
          
          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="key-stage">Key Stage</Label>
              <Select value={keyStage} onValueChange={setKeyStage}>
                <SelectTrigger id="key-stage" aria-label="Select key stage">
                  <SelectValue placeholder="Select key stage" />
                </SelectTrigger>
                <SelectContent>
                  {keyStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Adapts content complexity and presentation to match the selected key stage
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="subject-adaptations" className="font-medium">Subject-Specific Adaptations</Label>
                <p className="text-xs text-muted-foreground">
                  Customizes accessibility features based on subject requirements
                </p>
              </div>
              <Switch 
                id="subject-adaptations" 
                checked={subjectSpecificAdaptations} 
                onCheckedChange={setSubjectSpecificAdaptations}
                aria-label="Toggle subject-specific adaptations"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="simplified-curriculum" className="font-medium">Simplified Curriculum</Label>
                <p className="text-xs text-muted-foreground">
                  Presents curriculum content in simplified language and structure
                </p>
              </div>
              <Switch 
                id="simplified-curriculum" 
                checked={simplifiedCurriculum} 
                onCheckedChange={setSimplifiedCurriculum}
                aria-label="Toggle simplified curriculum"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visual-supports" className="font-medium">Visual Curriculum Supports</Label>
                <p className="text-xs text-muted-foreground">
                  Adds visual aids and diagrams to support curriculum understanding
                </p>
              </div>
              <Switch 
                id="visual-supports" 
                checked={visualSupports} 
                onCheckedChange={setVisualSupports}
                aria-label="Toggle visual curriculum supports"
              />
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium">UK Curriculum Alignment</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These settings ensure content accessibility aligns with UK Department for Education standards and the National Curriculum.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* SEND Support Tab */}
          <TabsContent value="send" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="send-support">SEND Support Category</Label>
              <Select value={sendSupport} onValueChange={setSendSupport}>
                <SelectTrigger id="send-support" aria-label="Select SEND support category">
                  <SelectValue placeholder="Select SEND support category" />
                </SelectTrigger>
                <SelectContent>
                  {sendOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Activates specialized accessibility features based on SEND category
              </p>
            </div>
            
            {sendSupport === "cognition" && (
              <div className="space-y-3 border-l-2 border-primary pl-4 mt-4">
                <h4 className="text-sm font-medium">Cognition and Learning Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reading-support" className="text-sm">Reading Support</Label>
                    <Switch id="reading-support" defaultChecked aria-label="Toggle reading support" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="memory-aids" className="text-sm">Memory Aids</Label>
                    <Switch id="memory-aids" defaultChecked aria-label="Toggle memory aids" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="processing-time" className="text-sm">Extended Processing Time</Label>
                    <Switch id="processing-time" defaultChecked aria-label="Toggle extended processing time" />
                  </div>
                </div>
              </div>
            )}
            
            {sendSupport === "communication" && (
              <div className="space-y-3 border-l-2 border-primary pl-4 mt-4">
                <h4 className="text-sm font-medium">Communication and Interaction Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="aac-support" className="text-sm">AAC Support</Label>
                    <Switch id="aac-support" defaultChecked aria-label="Toggle AAC support" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="social-stories" className="text-sm">Social Stories</Label>
                    <Switch id="social-stories" defaultChecked aria-label="Toggle social stories" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="visual-schedules" className="text-sm">Visual Schedules</Label>
                    <Switch id="visual-schedules" defaultChecked aria-label="Toggle visual schedules" />
                  </div>
                </div>
              </div>
            )}
            
            {sendSupport === "sensory" && (
              <div className="space-y-3 border-l-2 border-primary pl-4 mt-4">
                <h4 className="text-sm font-medium">Sensory and/or Physical Needs Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="screen-reader" className="text-sm">Screen Reader Optimization</Label>
                    <Switch id="screen-reader" defaultChecked aria-label="Toggle screen reader optimization" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sensory-breaks" className="text-sm">Sensory Break Reminders</Label>
                    <Switch id="sensory-breaks" defaultChecked aria-label="Toggle sensory break reminders" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="motor-alternatives" className="text-sm">Motor Alternatives</Label>
                    <Switch id="motor-alternatives" defaultChecked aria-label="Toggle motor alternatives" />
                  </div>
                </div>
              </div>
            )}
            
            {sendSupport === "social" && (
              <div className="space-y-3 border-l-2 border-primary pl-4 mt-4">
                <h4 className="text-sm font-medium">Social, Emotional and Mental Health Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emotional-regulation" className="text-sm">Emotional Regulation Tools</Label>
                    <Switch id="emotional-regulation" defaultChecked aria-label="Toggle emotional regulation tools" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anxiety-support" className="text-sm">Anxiety Support</Label>
                    <Switch id="anxiety-support" defaultChecked aria-label="Toggle anxiety support" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="focus-tools" className="text-sm">Focus Tools</Label>
                    <Switch id="focus-tools" defaultChecked aria-label="Toggle focus tools" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-muted p-4 rounded-md mt-4">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <div>
                  <p className="text-sm font-medium">SEND Code of Practice Aligned</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These accessibility features are designed in accordance with the UK SEND Code of Practice to support inclusive education.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Exam Access Tab */}
          <TabsContent value="exams" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="exam-accommodations" className="font-medium">Exam Accommodations</Label>
                <p className="text-xs text-muted-foreground">
                  Activates JCQ-approved exam access arrangements
                </p>
              </div>
              <Switch 
                id="exam-accommodations" 
                checked={examAccommodations} 
                onCheckedChange={setExamAccommodations}
                aria-label="Toggle exam accommodations"
              />
            </div>
            
            {examAccommodations && (
              <div className="space-y-4 border-l-2 border-primary pl-4 mt-4">
                <h4 className="text-sm font-medium">Available Exam Accommodations</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extra-time" className="text-sm">Extra Time (25%)</Label>
                    <Switch id="extra-time" defaultChecked aria-label="Toggle extra time" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Extends time limits on timed assessments by 25%
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reader" className="text-sm">Reader/Screen Reader</Label>
                    <Switch id="reader" defaultChecked aria-label="Toggle reader/screen reader" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provides text-to-speech functionality for exam content
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scribe" className="text-sm">Scribe/Speech Recognition</Label>
                    <Switch id="scribe" defaultChecked aria-label="Toggle scribe/speech recognition" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enables voice input for answering questions
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rest-breaks" className="text-sm">Rest Breaks</Label>
                    <Switch id="rest-breaks" defaultChecked aria-label="Toggle rest breaks" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provides timed breaks during assessments
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="modified-papers" className="text-sm">Modified Papers</Label>
                    <Switch id="modified-papers" defaultChecked aria-label="Toggle modified papers" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adapts assessment format (font size, color, layout)
                  </p>
                </div>
              </div>
            )}
            
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Important Note</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These digital accommodations are designed to mirror JCQ-approved access arrangements. For formal examinations, official JCQ approval is required.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center">
          <HelpCircle className="mr-2 h-4 w-4" />
          DfE Guidance
        </Button>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
