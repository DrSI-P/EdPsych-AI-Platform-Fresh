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
  Info
} from 'lucide-react';

import { 
  UKKeyStage, 
  UKSubject,
  ContentType,
  ContentFormat,
  ContentDifficultyLevel,
  ContentStatus,
  UKCurriculumRegion,
  LearningStyle
} from '@/lib/curriculum-content/types';

/**
 * UK Curriculum Alignment Component
 * 
 * Provides tools for aligning curriculum content with UK educational standards
 * and adapting content for different learning styles.
 */
export function UKCurriculumAlignment() {
  const { toast } = useToast();
  
  // State for curriculum standards
  const [selectedKeyStage, setSelectedKeyStage] = useState<UKKeyStage>(UKKeyStage.KS2);
  const [selectedSubject, setSelectedSubject] = useState<UKSubject>(UKSubject.MATHEMATICS);
  const [selectedRegion, setSelectedRegion] = useState<UKCurriculumRegion>(UKCurriculumRegion.ENGLAND);
  
  // State for curriculum objectives
  const [curriculumObjectives, setCurriculumObjectives] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjectives, setCustomObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  
  // State for learning style adaptation
  const [adaptToLearningStyles, setAdaptToLearningStyles] = useState(true);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<LearningStyle[]>([
    LearningStyle.VISUAL,
    LearningStyle.AUDITORY,
    LearningStyle.KINESTHETIC,
    LearningStyle.READ_WRITE
  ]);
  
  // State for content personalization
  const [enablePersonalization, setEnablePersonalization] = useState(true);
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [newInterestTag, setNewInterestTag] = useState('');
  
  // State for accessibility options
  const [accessibilityOptions, setAccessibilityOptions] = useState({
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
    reducedMotion: false,
    simplifiedLanguage: false
  });
  
  // Fetch curriculum objectives based on key stage and subject
  useEffect(() => {
    const fetchCurriculumObjectives = async () => {
      // In a real implementation, this would fetch from an API
      // For now, we'll use mock data
      const mockObjectives = [
        "Understand place value in whole numbers",
        "Add and subtract whole numbers",
        "Multiply and divide whole numbers",
        "Identify and describe properties of 2D shapes",
        "Identify and describe properties of 3D shapes",
        "Measure and compare lengths, mass, and capacity",
        "Tell and write the time",
        "Recognize and use fractions",
        "Interpret and present data using charts and tables",
        "Solve one-step and two-step problems"
      ];
      
      setCurriculumObjectives(mockObjectives);
    };
    
    fetchCurriculumObjectives();
  }, [selectedKeyStage, selectedSubject, selectedRegion]);
  
  // Handle adding custom objective
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setCustomObjectives(prev => [...prev, newObjective.trim()]);
      setSelectedObjectives(prev => [...prev, newObjective.trim()]);
      setNewObjective('');
    }
  };
  
  // Handle removing objective
  const handleRemoveObjective = (objective: string) => {
    setSelectedObjectives(prev => prev.filter(obj => obj !== objective));
    if (customObjectives.includes(objective)) {
      setCustomObjectives(prev => prev.filter(obj => obj !== objective));
    }
  };
  
  // Handle toggling standard objective
  const handleToggleObjective = (objective: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objective) 
        ? prev.filter(obj => obj !== objective)
        : [...prev, objective]
    );
  };
  
  // Handle adding interest tag
  const handleAddInterestTag = () => {
    if (newInterestTag.trim() && !interestTags.includes(newInterestTag.trim())) {
      setInterestTags(prev => [...prev, newInterestTag.trim()]);
      setNewInterestTag('');
    }
  };
  
  // Handle removing interest tag
  const handleRemoveInterestTag = (tag: string) => {
    setInterestTags(prev => prev.filter(t => t !== tag));
  };
  
  // Handle toggling learning style
  const handleToggleLearningStyle = (style: LearningStyle) => {
    setSelectedLearningStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };
  
  // Handle accessibility option change
  const handleAccessibilityChange = (option: keyof typeof accessibilityOptions, value: boolean) => {
    setAccessibilityOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to an API
    toast({
      title: "Curriculum alignment saved",
      description: "Your curriculum alignment settings have been saved successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UK Curriculum Alignment</CardTitle>
          <CardDescription>
            Align your content with UK curriculum standards and learning objectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyStage">Key Stage</Label>
              <Select 
                value={selectedKeyStage} 
                onValueChange={(value) => setSelectedKeyStage(value as UKKeyStage)}
              >
                <SelectTrigger id="keyStage">
                  <SelectValue placeholder="Select key stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKKeyStage.EYFS}>Early Years (EYFS)</SelectItem>
                  <SelectItem value={UKKeyStage.KS1}>Key Stage 1</SelectItem>
                  <SelectItem value={UKKeyStage.KS2}>Key Stage 2</SelectItem>
                  <SelectItem value={UKKeyStage.KS3}>Key Stage 3</SelectItem>
                  <SelectItem value={UKKeyStage.KS4}>Key Stage 4</SelectItem>
                  <SelectItem value={UKKeyStage.KS5}>Key Stage 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={(value) => setSelectedSubject(value as UKSubject)}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKSubject.ENGLISH}>English</SelectItem>
                  <SelectItem value={UKSubject.MATHEMATICS}>Mathematics</SelectItem>
                  <SelectItem value={UKSubject.SCIENCE}>Science</SelectItem>
                  <SelectItem value={UKSubject.HISTORY}>History</SelectItem>
                  <SelectItem value={UKSubject.GEOGRAPHY}>Geography</SelectItem>
                  <SelectItem value={UKSubject.ART_AND_DESIGN}>Art and Design</SelectItem>
                  <SelectItem value={UKSubject.COMPUTING}>Computing</SelectItem>
                  <SelectItem value={UKSubject.DESIGN_AND_TECHNOLOGY}>Design and Technology</SelectItem>
                  <SelectItem value={UKSubject.LANGUAGES}>Languages</SelectItem>
                  <SelectItem value={UKSubject.MUSIC}>Music</SelectItem>
                  <SelectItem value={UKSubject.PHYSICAL_EDUCATION}>Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">UK Region</Label>
              <Select 
                value={selectedRegion} 
                onValueChange={(value) => setSelectedRegion(value as UKCurriculumRegion)}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKCurriculumRegion.ENGLAND}>England</SelectItem>
                  <SelectItem value={UKCurriculumRegion.WALES}>Wales</SelectItem>
                  <SelectItem value={UKCurriculumRegion.SCOTLAND}>Scotland</SelectItem>
                  <SelectItem value={UKCurriculumRegion.NORTHERN_IRELAND}>Northern Ireland</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Curriculum Objectives</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select relevant curriculum objectives for your content
            </p>
            
            <div className="space-y-2 mb-4">
              {curriculumObjectives.map((objective) => (
                <div key={objective} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={`objective-${objective}`}
                    checked={selectedObjectives.includes(objective)}
                    onChange={() => handleToggleObjective(objective)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`objective-${objective}`}>{objective}</Label>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customObjective">Add Custom Objective</Label>
              <div className="flex space-x-2">
                <Input 
                  id="customObjective"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Enter a custom learning objective"
                />
                <Button onClick={handleAddObjective} type="button">Add</Button>
              </div>
            </div>
            
            {customObjectives.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Custom Objectives</h4>
                <div className="space-y-2">
                  {customObjectives.map((objective) => (
                    <div key={objective} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{objective}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveObjective(objective)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Learning Style Adaptation</CardTitle>
          <CardDescription>
            Adapt your content for different learning styles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="adaptToLearningStyles">Enable Learning Style Adaptation</Label>
              <p className="text-sm text-muted-foreground">
                Create variants of your content optimized for different learning styles
              </p>
            </div>
            <Switch 
              id="adaptToLearningStyles"
              checked={adaptToLearningStyles}
              onCheckedChange={setAdaptToLearningStyles}
            />
          </div>
          
          {adaptToLearningStyles && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Learning Styles</h3>
                <p className="text-sm text-muted-foreground">
                  Choose which learning styles to create content variants for
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <input 
                      type="checkbox" 
                      id="visual-style"
                      checked={selectedLearningStyles.includes(LearningStyle.VISUAL)}
                      onChange={() => handleToggleLearningStyle(LearningStyle.VISUAL)}
                      className="h-4 w-4 mt-1"
                    />
                    <div>
                      <Label htmlFor="visual-style">Visual Learners</Label>
                      <p className="text-sm text-muted-foreground">
                        Prefer images, diagrams, charts, and visual demonstrations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <input 
                      type="checkbox" 
                      id="auditory-style"
                      checked={selectedLearningStyles.includes(LearningStyle.AUDITORY)}
                      onChange={() => handleToggleLearningStyle(LearningStyle.AUDITORY)}
                      className="h-4 w-4 mt-1"
                    />
                    <div>
                      <Label htmlFor="auditory-style">Auditory Learners</Label>
                      <p className="text-sm text-muted-foreground">
                        Prefer spoken explanations, discussions, and audio content
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <input 
                      type="checkbox" 
                      id="kinesthetic-style"
                      checked={selectedLearningStyles.includes(LearningStyle.KINESTHETIC)}
                      onChange={() => handleToggleLearningStyle(LearningStyle.KINESTHETIC)}
                      className="h-4 w-4 mt-1"
                    />
                    <div>
                      <Label htmlFor="kinesthetic-style">Kinesthetic Learners</Label>
                      <p className="text-sm text-muted-foreground">
                        Prefer hands-on activities, interactive exercises, and physical engagement
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <input 
                      type="checkbox" 
                      id="read-write-style"
                      checked={selectedLearningStyles.includes(LearningStyle.READ_WRITE)}
                      onChange={() => handleToggleLearningStyle(LearningStyle.READ_WRITE)}
                      className="h-4 w-4 mt-1"
                    />
                    <div>
                      <Label htmlFor="read-write-style">Read/Write Learners</Label>
                      <p className="text-sm text-muted-foreground">
                        Prefer text-based information, lists, and written explanations
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-700">Learning Style Adaptation</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        When enabled, the system will help you create optimized content variants for each selected learning style. 
                        You'll be able to customize each variant while maintaining alignment with curriculum objectives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Personalization</CardTitle>
          <CardDescription>
            Personalize content based on student interests and needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enablePersonalization">Enable Content Personalization</Label>
              <p className="text-sm text-muted-foreground">
                Allow content to be personalized based on student interests and preferences
              </p>
            </div>
            <Switch 
              id="enablePersonalization"
              checked={enablePersonalization}
              onCheckedChange={setEnablePersonalization}
            />
          </div>
          
          {enablePersonalization && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Interest Tags</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add tags that represent interests this content can be adapted for
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="interestTag">Add Interest Tag</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="interestTag"
                      value={newInterestTag}
                      onChange={(e) => setNewInterestTag(e.target.value)}
                      placeholder="e.g., sports, music, technology, nature"
                    />
                    <Button onClick={handleAddInterestTag} type="button">Add</Button>
                  </div>
                </div>
                
                {interestTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {interestTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1">
                        {tag}
                        <button 
                          onClick={() => handleRemoveInterestTag(tag)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-700">Personalization Note</h4>
                      <p className="text-sm text-amber-600 mt-1">
                        Interest tags help the system suggest content to students based on their preferences.
                        The system will use these tags to create personalized learning experiences while
                        maintaining curriculum alignment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Options</CardTitle>
          <CardDescription>
            Ensure your content is accessible to all learners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="highContrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Optimize for visual impairments
                </p>
              </div>
              <Switch 
                id="highContrast"
                checked={accessibilityOptions.highContrast}
                onCheckedChange={(value) => handleAccessibilityChange('highContrast', value)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="largeText">Large Text</Label>
                <p className="text-sm text-muted-foreground">
                  Increase text size for readability
                </p>
              </div>
              <Switch 
                id="largeText"
                checked={accessibilityOptions.largeText}
                onCheckedChange={(value) => handleAccessibilityChange('largeText', value)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="screenReaderOptimized">Screen Reader Optimized</Label>
                <p className="text-sm text-muted-foreground">
                  Enhance compatibility with screen readers
                </p>
              </div>
              <Switch 
                id="screenReaderOptimized"
                checked={accessibilityOptions.screenReaderOptimized}
                onCheckedChange={(value) => handleAccessibilityChange('screenReaderOptimized', value)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="reducedMotion">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch 
                id="reducedMotion"
                checked={accessibilityOptions.reducedMotion}
                onCheckedChange={(value) => handleAccessibilityChange('reducedMotion', value)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md md:col-span-2">
              <div>
                <Label htmlFor="simplifiedLanguage">Simplified Language</Label>
                <p className="text-sm text-muted-foreground">
                  Use simpler vocabulary and sentence structure
                </p>
              </div>
              <Switch 
                id="simplifiedLanguage"
                checked={accessibilityOptions.simplifiedLanguage}
                onCheckedChange={(value) => handleAccessibilityChange('simplifiedLanguage', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Alignment Settings
        </Button>
      </div>
    </div>
  );
}
