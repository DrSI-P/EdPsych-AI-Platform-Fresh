'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Save,
  Eye,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  Info,
  History,
  Brain,
  Palette,
  Music,
  Image,
  Activity,
  Users
} from 'lucide-react';

import { 
  ContentType,
  ContentStatus,
  ContentMetadata,
  LearningStyle
} from '@/lib/curriculum-content/types';

/**
 * Learning Style Adaptation Component
 * 
 * Provides tools for adapting curriculum content to different learning styles
 * with features for visual, auditory, kinesthetic, and reading/writing preferences.
 */
export function LearningStyleAdaptation() {
  const { toast } = useToast();
  
  // Mock content data
  const [content, setContent] = useState<ContentMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<string>('visual');
  const [adaptations, setAdaptations] = useState<Record<string, any>>({
    visual: {
      enabled: true,
      imageCount: 5,
      diagramCount: 3,
      videoCount: 2,
      colorScheme: 'standard',
      animationLevel: 'moderate'
    },
    auditory: {
      enabled: true,
      narrationEnabled: true,
      backgroundMusicEnabled: false,
      soundEffectsEnabled: true,
      interactiveVoiceEnabled: false,
      speechRate: 1.0
    },
    kinesthetic: {
      enabled: true,
      interactiveExercises: 4,
      practicalActivities: 3,
      simulationsEnabled: true,
      gamificationLevel: 'high'
    },
    readingWriting: {
      enabled: true,
      textDensity: 'moderate',
      vocabularyLevel: 'age-appropriate',
      notesTakingEnabled: true,
      summaryEnabled: true,
      quizEnabled: true
    }
  });
  
  // Fetch content
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    const mockContent: ContentMetadata = {
      id: 'content-123',
      title: 'Introduction to Fractions',
      description: 'A comprehensive introduction to fractions for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentType: ContentType.EXPLANATION,
      status: ContentStatus.DRAFT,
      createdAt: '2025-05-20T10:30:00Z',
      updatedAt: '2025-05-30T14:45:00Z',
      createdBy: 'John Smith',
      updatedBy: 'Jane Doe'
    };
    
    setContent(mockContent);
  }, []);
  
  // Handle adaptation toggle
  const handleAdaptationToggle = (style: string, enabled: boolean) => {
    setAdaptations(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        enabled
      }
    }));
    
    toast({
      title: enabled ? "Adaptation enabled" : "Adaptation disabled",
      description: `${style.charAt(0).toUpperCase() + style.slice(1)} learning style adaptation has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };
  
  // Handle adaptation update
  const handleAdaptationUpdate = (style: string, key: string, value: any) => {
    setAdaptations(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        [key]: value
      }
    }));
  };
  
  // Handle save adaptations
  const handleSaveAdaptations = () => {
    // In a real implementation, this would save via API
    toast({
      title: "Adaptations saved",
      description: "Learning style adaptations have been saved successfully"
    });
  };
  
  // Handle generate adaptations
  const handleGenerateAdaptations = () => {
    // In a real implementation, this would generate adaptations via API
    toast({
      title: "Adaptations generated",
      description: "Learning style adaptations have been generated automatically"
    });
  };
  
  // Handle preview adaptations
  const handlePreviewAdaptations = () => {
    // In a real implementation, this would open a preview
    toast({
      title: "Preview opened",
      description: "Learning style adaptations preview has been opened"
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (!content) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </div>
            <Badge variant="outline">
              Learning Style Adaptation
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <span className="text-sm font-medium">Key Stage:</span>
              <span className="ml-2">{content.keyStage}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Subject:</span>
              <span className="ml-2">{content.subject}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Content Type:</span>
              <span className="ml-2">{content.contentType}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Learning Style Adaptation Overview</h3>
            <p className="text-sm mb-4">
              Adapt this content to different learning styles to ensure it meets the needs of all students.
              Enable or disable adaptations for each learning style and customize the settings as needed.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className={`border-l-4 ${adaptations.visual.enabled ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image className="h-5 w-5 mr-2 text-blue-500" />
                      <CardTitle className="text-md">Visual</CardTitle>
                    </div>
                    <Switch 
                      checked={adaptations.visual.enabled}
                      onCheckedChange={(checked) => handleAdaptationToggle('visual', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {adaptations.visual.enabled 
                      ? `${adaptations.visual.imageCount} images, ${adaptations.visual.diagramCount} diagrams, ${adaptations.visual.videoCount} videos`
                      : 'Disabled'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`border-l-4 ${adaptations.auditory.enabled ? 'border-l-purple-500' : 'border-l-gray-300'}`}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5 mr-2 text-purple-500" />
                      <CardTitle className="text-md">Auditory</CardTitle>
                    </div>
                    <Switch 
                      checked={adaptations.auditory.enabled}
                      onCheckedChange={(checked) => handleAdaptationToggle('auditory', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {adaptations.auditory.enabled 
                      ? `Narration: ${adaptations.auditory.narrationEnabled ? 'Yes' : 'No'}, Music: ${adaptations.auditory.backgroundMusicEnabled ? 'Yes' : 'No'}`
                      : 'Disabled'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`border-l-4 ${adaptations.kinesthetic.enabled ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MousePointer className="h-5 w-5 mr-2 text-green-500" />
                      <CardTitle className="text-md">Kinesthetic</CardTitle>
                    </div>
                    <Switch 
                      checked={adaptations.kinesthetic.enabled}
                      onCheckedChange={(checked) => handleAdaptationToggle('kinesthetic', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {adaptations.kinesthetic.enabled 
                      ? `${adaptations.kinesthetic.interactiveExercises} exercises, ${adaptations.kinesthetic.practicalActivities} activities`
                      : 'Disabled'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`border-l-4 ${adaptations.readingWriting.enabled ? 'border-l-amber-500' : 'border-l-gray-300'}`}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-amber-500" />
                      <CardTitle className="text-md">Reading/Writing</CardTitle>
                    </div>
                    <Switch 
                      checked={adaptations.readingWriting.enabled}
                      onCheckedChange={(checked) => handleAdaptationToggle('readingWriting', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {adaptations.readingWriting.enabled 
                      ? `Text: ${adaptations.readingWriting.textDensity}, Vocab: ${adaptations.readingWriting.vocabularyLevel}`
                      : 'Disabled'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="visual" disabled={!adaptations.visual.enabled}>
                <Image className="h-4 w-4 mr-2" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="auditory" disabled={!adaptations.auditory.enabled}>
                <Headphones className="h-4 w-4 mr-2" />
                Auditory
              </TabsTrigger>
              <TabsTrigger value="kinesthetic" disabled={!adaptations.kinesthetic.enabled}>
                <MousePointer className="h-4 w-4 mr-2" />
                Kinesthetic
              </TabsTrigger>
              <TabsTrigger value="readingWriting" disabled={!adaptations.readingWriting.enabled}>
                <FileText className="h-4 w-4 mr-2" />
                Reading/Writing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visual Learning Style Adaptation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how content is adapted for visual learners. Visual learners prefer to see information
                  presented through images, diagrams, videos, and other visual media.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageCount">Number of Images</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="imageCount"
                        min={0}
                        max={10}
                        step={1}
                        value={[adaptations.visual.imageCount]}
                        onValueChange={(value) => handleAdaptationUpdate('visual', 'imageCount', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.visual.imageCount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diagramCount">Number of Diagrams</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="diagramCount"
                        min={0}
                        max={10}
                        step={1}
                        value={[adaptations.visual.diagramCount]}
                        onValueChange={(value) => handleAdaptationUpdate('visual', 'diagramCount', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.visual.diagramCount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="videoCount">Number of Videos</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="videoCount"
                        min={0}
                        max={5}
                        step={1}
                        value={[adaptations.visual.videoCount]}
                        onValueChange={(value) => handleAdaptationUpdate('visual', 'videoCount', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.visual.videoCount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <Select 
                      value={adaptations.visual.colorScheme}
                      onValueChange={(value) => handleAdaptationUpdate('visual', 'colorScheme', value)}
                    >
                      <SelectTrigger id="colorScheme">
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high-contrast">High Contrast</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="colorblind-friendly">Colorblind Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="animationLevel">Animation Level</Label>
                    <Select 
                      value={adaptations.visual.animationLevel}
                      onValueChange={(value) => handleAdaptationUpdate('visual', 'animationLevel', value)}
                    >
                      <SelectTrigger id="animationLevel">
                        <SelectValue placeholder="Select animation level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auditory">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Auditory Learning Style Adaptation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how content is adapted for auditory learners. Auditory learners prefer to hear information
                  and may benefit from spoken explanations, discussions, and audio content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="narrationEnabled">Enable Narration</Label>
                      <Switch 
                        id="narrationEnabled"
                        checked={adaptations.auditory.narrationEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('auditory', 'narrationEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provides spoken narration of the content
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backgroundMusicEnabled">Background Music</Label>
                      <Switch 
                        id="backgroundMusicEnabled"
                        checked={adaptations.auditory.backgroundMusicEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('auditory', 'backgroundMusicEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Adds gentle background music to enhance focus
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="soundEffectsEnabled">Sound Effects</Label>
                      <Switch 
                        id="soundEffectsEnabled"
                        checked={adaptations.auditory.soundEffectsEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('auditory', 'soundEffectsEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Includes sound effects for interactive elements
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interactiveVoiceEnabled">Interactive Voice</Label>
                      <Switch 
                        id="interactiveVoiceEnabled"
                        checked={adaptations.auditory.interactiveVoiceEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('auditory', 'interactiveVoiceEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enables voice interaction for questions and answers
                    </p>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="speechRate">Speech Rate</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="speechRate"
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        value={[adaptations.auditory.speechRate]}
                        onValueChange={(value) => handleAdaptationUpdate('auditory', 'speechRate', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.auditory.speechRate}x</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Adjust the speed of narration (1.0 = normal speed)
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="kinesthetic">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kinesthetic Learning Style Adaptation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how content is adapted for kinesthetic learners. Kinesthetic learners prefer to learn by doing
                  and may benefit from interactive exercises, practical activities, and hands-on experiences.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interactiveExercises">Interactive Exercises</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="interactiveExercises"
                        min={0}
                        max={10}
                        step={1}
                        value={[adaptations.kinesthetic.interactiveExercises]}
                        onValueChange={(value) => handleAdaptationUpdate('kinesthetic', 'interactiveExercises', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.kinesthetic.interactiveExercises}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of interactive exercises to include
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="practicalActivities">Practical Activities</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="practicalActivities"
                        min={0}
                        max={10}
                        step={1}
                        value={[adaptations.kinesthetic.practicalActivities]}
                        onValueChange={(value) => handleAdaptationUpdate('kinesthetic', 'practicalActivities', value[0])}
                      />
                      <span className="w-12 text-center">{adaptations.kinesthetic.practicalActivities}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of practical activities to include
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="simulationsEnabled">Enable Simulations</Label>
                      <Switch 
                        id="simulationsEnabled"
                        checked={adaptations.kinesthetic.simulationsEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('kinesthetic', 'simulationsEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Includes interactive simulations where applicable
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gamificationLevel">Gamification Level</Label>
                    <Select 
                      value={adaptations.kinesthetic.gamificationLevel}
                      onValueChange={(value) => handleAdaptationUpdate('kinesthetic', 'gamificationLevel', value)}
                    >
                      <SelectTrigger id="gamificationLevel">
                        <SelectValue placeholder="Select gamification level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Level of game-like elements to include
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="readingWriting">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reading/Writing Learning Style Adaptation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how content is adapted for reading/writing learners. These learners prefer to learn through
                  text-based materials and may benefit from written explanations, note-taking, and text-based activities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="textDensity">Text Density</Label>
                    <Select 
                      value={adaptations.readingWriting.textDensity}
                      onValueChange={(value) => handleAdaptationUpdate('readingWriting', 'textDensity', value)}
                    >
                      <SelectTrigger id="textDensity">
                        <SelectValue placeholder="Select text density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Amount of text to include in the content
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vocabularyLevel">Vocabulary Level</Label>
                    <Select 
                      value={adaptations.readingWriting.vocabularyLevel}
                      onValueChange={(value) => handleAdaptationUpdate('readingWriting', 'vocabularyLevel', value)}
                    >
                      <SelectTrigger id="vocabularyLevel">
                        <SelectValue placeholder="Select vocabulary level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simplified">Simplified</SelectItem>
                        <SelectItem value="age-appropriate">Age Appropriate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Level of vocabulary to use in the content
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notesTakingEnabled">Notes Taking</Label>
                      <Switch 
                        id="notesTakingEnabled"
                        checked={adaptations.readingWriting.notesTakingEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('readingWriting', 'notesTakingEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Includes note-taking features and prompts
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="summaryEnabled">Summary Sections</Label>
                      <Switch 
                        id="summaryEnabled"
                        checked={adaptations.readingWriting.summaryEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('readingWriting', 'summaryEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Includes summary sections at the end of each topic
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quizEnabled">Written Quizzes</Label>
                      <Switch 
                        id="quizEnabled"
                        checked={adaptations.readingWriting.quizEnabled}
                        onCheckedChange={(checked) => handleAdaptationUpdate('readingWriting', 'quizEnabled', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Includes written quizzes and assessments
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button variant="outline" onClick={handleGenerateAdaptations} className="mr-2">
              <Brain className="mr-2 h-4 w-4" />
              Auto-Generate Adaptations
            </Button>
            <Button variant="outline" onClick={handlePreviewAdaptations}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
          <Button onClick={handleSaveAdaptations}>
            <Save className="mr-2 h-4 w-4" />
            Save Adaptations
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
