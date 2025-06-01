'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Copy, Download, FileText, RefreshCw, BookOpen, Lightbulb, Wand2 } from 'lucide-react';

interface LessonPlanTemplate {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  subject: string;
  duration: string;
  content: string;
}

const lessonPlanTemplates: any[] = [
  {
    id: "1",
    name: "Literacy Hour",
    description: "A structured literacy lesson following the national framework",
    ageRange: "KS1",
    subject: "English",
    duration: "60 minutes",
    content: "# Literacy Hour Lesson Plan\n\n## Learning Objectives\n- To understand the main features of a story\n- To identify and use descriptive language\n- To develop comprehension skills\n\n## Resources\n- Story book\n- Whiteboards and pens\n- Character cards\n- Vocabulary list\n\n## Introduction (15 minutes)\n- Introduce the story and discuss the cover\n- Activate prior knowledge through questioning\n- Introduce key vocabulary\n\n## Main Activity (30 minutes)\n- Shared reading of the story\n- Discuss characters and setting\n- Model descriptive writing\n- Independent writing activity\n\n## Plenary (15 minutes)\n- Share examples of good work\n- Review learning objectives\n- Set follow-up activities"
  },
  {
    id: "2",
    name: "Scientific Investigation",
    description: "A hands-on science investigation lesson",
    ageRange: "KS2",
    subject: "Science",
    duration: "45 minutes",
    content: "# Scientific Investigation Lesson Plan\n\n## Learning Objectives\n- To plan and conduct a fair test\n- To make predictions based on scientific knowledge\n- To record and interpret results\n\n## Resources\n- Investigation equipment\n- Recording sheets\n- Safety equipment\n- Results table template\n\n## Introduction (10 minutes)\n- Introduce the scientific question\n- Discuss variables and fair testing\n- Model the investigation process\n\n## Main Activity (25 minutes)\n- Students conduct investigation in groups\n- Record results systematically\n- Analyze findings\n\n## Plenary (10 minutes)\n- Groups share findings\n- Discuss patterns and conclusions\n- Link to scientific concepts"
  }
];

const curriculumStandards = [
  { id: "nc-en1", name: "National Curriculum - English KS1" },
  { id: "nc-en2", name: "National Curriculum - English KS2" },
  { id: "nc-ma1", name: "National Curriculum - Mathematics KS1" },
  { id: "nc-ma2", name: "National Curriculum - Mathematics KS2" },
  { id: "nc-sc1", name: "National Curriculum - Science KS1" },
  { id: "nc-sc2", name: "National Curriculum - Science KS2" }
];

const differentiationStrategies = [
  { id: "visual", name: "Visual supports", description: "Add visual aids and diagrams" },
  { id: "scaffold", name: "Scaffolding", description: "Provide writing frames and structured support" },
  { id: "extension", name: "Extension tasks", description: "Additional challenges for advanced learners" },
  { id: "group", name: "Mixed ability grouping", description: "Collaborative learning in diverse groups" },
  { id: "concrete", name: "Concrete resources", description: "Hands-on manipulatives and resources" }
];

export function SmartLessonPlanning() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [lessonTitle, setLessonTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [duration, setDuration] = useState("");
  const [objectives, setObjectives] = useState("");
  const [resources, setResources] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [mainActivity, setMainActivity] = useState("");
  const [plenary, setPlenary] = useState("");
  const [assessment, setAssessment] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [selectedDifferentiation, setSelectedDifferentiation] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = lessonPlanTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setLessonTitle(template.name);
      setSubject(template.subject);
      setAgeRange(template.ageRange);
      setDuration(template.duration);
      
      // Parse the markdown content to extract sections
      const content = template.content;
      
      // Extract objectives
      const objectivesMatch = content.match(/## Learning Objectives\n([\s\S]*?)(?=\n##|$)/);
      if (objectivesMatch) setObjectives(objectivesMatch[1].trim());
      
      // Extract resources
      const resourcesMatch = content.match(/## Resources\n([\s\S]*?)(?=\n##|$)/);
      if (resourcesMatch) setResources(resourcesMatch[1].trim());
      
      // Extract introduction
      const introMatch = content.match(/## Introduction.*\n([\s\S]*?)(?=\n##|$)/);
      if (introMatch) setIntroduction(introMatch[1].trim());
      
      // Extract main activity
      const mainMatch = content.match(/## Main Activity.*\n([\s\S]*?)(?=\n##|$)/);
      if (mainMatch) setMainActivity(mainMatch[1].trim());
      
      // Extract plenary
      const plenaryMatch = content.match(/## Plenary.*\n([\s\S]*?)(?=\n##|$)/);
      if (plenaryMatch) setPlenary(plenaryMatch[1].trim());
    }
  };
  
  // Handle standard selection
  const handleStandardToggle = (standardId: string) => {
    setSelectedStandards(prev => 
      prev.includes(standardId)
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    );
  };
  
  // Handle differentiation strategy selection
  const handleDifferentiationToggle = (strategyId: string) => {
    setSelectedDifferentiation(prev => 
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };
  
  // Generate lesson plan
  const generateLessonPlan = () => {
    if (!lessonTitle || !subject || !objectives) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the title, subject, and objectives.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const selectedStandardsText = selectedStandards.map(id => 
        curriculumStandards.find(s => s.id === id)?.name
      ).join(", ");
      
      const selectedDiffText = selectedDifferentiation.map(id => 
        differentiationStrategies.find(s => s.id === id)?.name
      ).join(", ");
      
      const plan = `# ${lessonTitle}

## Overview
- Subject: ${subject}
- Age Range: ${ageRange}
- Duration: ${duration}
- Curriculum Standards: ${selectedStandardsText || "None specified"}

## Learning Objectives
${objectives}

## Resources
${resources}

## Differentiation Strategies
${selectedDiffText || "None specified"}

## Lesson Structure

### Introduction (${duration.split(" ")[0] === "60" ? "15 minutes" : "10 minutes"})
${introduction}

### Main Activity (${duration.split(" ")[0] === "60" ? "30 minutes" : "20 minutes"})
${mainActivity}

### Plenary (${duration.split(" ")[0] === "60" ? "15 minutes" : "10 minutes"})
${plenary}

## Assessment
${assessment || "Ongoing assessment through observation and questioning."}

## Notes
- This lesson plan was generated using the Smart Lesson Planning tool.
- Adjust timing and activities as needed for your specific class.
- Consider additional differentiation strategies as appropriate.`;
      
      setGeneratedPlan(plan);
      setIsGenerating(false);
      setActiveTab('preview');
    }, 2000);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Smart Lesson Planning</h1>
      <p className="text-muted-foreground mb-6">
        Create comprehensive, differentiated lesson plans aligned with curriculum standards
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
              <CardDescription>Enter the basic information for your lesson plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input 
                    id="lesson-title" 
                    value={lessonTitle} 
                    onChange={(e) => setLessonTitle(e.target.value)} 
                    placeholder="Enter lesson title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="e.g., Mathematics, English, Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age-range">Age Range/Key Stage</Label>
                  <Select value={ageRange} onValueChange={setAgeRange}>
                    <SelectTrigger id="age-range">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EYFS">EYFS</SelectItem>
                      <SelectItem value="KS1">Key Stage 1</SelectItem>
                      <SelectItem value="KS2">Key Stage 2</SelectItem>
                      <SelectItem value="KS3">Key Stage 3</SelectItem>
                      <SelectItem value="KS4">Key Stage 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="45 minutes">45 minutes</SelectItem>
                      <SelectItem value="60 minutes">60 minutes</SelectItem>
                      <SelectItem value="90 minutes">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objectives">Learning Objectives</Label>
                <Textarea 
                  id="objectives" 
                  value={objectives} 
                  onChange={(e) => setObjectives(e.target.value)} 
                  placeholder="Enter learning objectives (one per line)"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resources">Resources</Label>
                <Textarea 
                  id="resources" 
                  value={resources} 
                  onChange={(e) => setResources(e.target.value)} 
                  placeholder="List required resources (one per line)"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Standards</CardTitle>
                <CardDescription>Select relevant curriculum standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {curriculumStandards.map(standard => (
                    <div key={standard.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={standard.id} 
                        checked={selectedStandards.includes(standard.id)}
                        onCheckedChange={() => handleStandardToggle(standard.id)}
                      />
                      <Label htmlFor={standard.id}>{standard.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Differentiation</CardTitle>
                <CardDescription>Select differentiation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {differentiationStrategies.map(strategy => (
                    <div key={strategy.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={strategy.id} 
                        checked={selectedDifferentiation.includes(strategy.id)}
                        onCheckedChange={() => handleDifferentiationToggle(strategy.id)}
                      />
                      <div>
                        <Label htmlFor={strategy.id}>{strategy.name}</Label>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lesson Structure</CardTitle>
              <CardDescription>Outline the structure of your lesson</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="introduction">Introduction</Label>
                <Textarea 
                  id="introduction" 
                  value={introduction} 
                  onChange={(e) => setIntroduction(e.target.value)} 
                  placeholder="Describe the introduction/starter activity"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="main-activity">Main Activity</Label>
                <Textarea 
                  id="main-activity" 
                  value={mainActivity} 
                  onChange={(e) => setMainActivity(e.target.value)} 
                  placeholder="Describe the main teaching and learning activities"
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plenary">Plenary</Label>
                <Textarea 
                  id="plenary" 
                  value={plenary} 
                  onChange={(e) => setPlenary(e.target.value)} 
                  placeholder="Describe the closing/summary activity"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assessment">Assessment</Label>
                <Textarea 
                  id="assessment" 
                  value={assessment} 
                  onChange={(e) => setAssessment(e.target.value)} 
                  placeholder="Describe assessment methods and success criteria"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('templates')}>
                <FileText className="mr-2 h-4 w-4" />
                Browse Templates
              </Button>
              <Button onClick={generateLessonPlan} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plan Templates</CardTitle>
              <CardDescription>Choose a template as a starting point</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonPlanTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedTemplate === template.id ? 'border-primary' : ''}`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{template.subject}</Badge>
                        <Badge variant="outline">{template.ageRange}</Badge>
                        <Badge variant="outline">{template.duration}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab('create')}
              >
                Back to Create
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plan Preview</CardTitle>
              <CardDescription>Review and export your lesson plan</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPlan ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto">
                    {generatedPlan}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No plan generated yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill in the lesson details and click "Generate Plan" to preview your lesson plan.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Go to Create
                  </Button>
                </div>
              )}
            </CardContent>
            {generatedPlan && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('create')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Edit Plan
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Plan
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SmartLessonPlanning;
