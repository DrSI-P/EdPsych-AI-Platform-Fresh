'use client';

import React, { useState } from 'react';
import { 
  ContentMetadata, 
  AIGenerationPrompt, 
  ContentType,
  KeyStage,
  LearningStyle,
  SENCategory,
  ContentDocument
} from '@/lib/content-creation/types';
import { getContentCreationService } from '@/lib/content-creation/contentCreationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface AIGenerationPanelProps {
  contentMetadata?: ContentMetadata;
  onGenerate: (generatedContent: Partial<ContentDocument>) => void;
  onCancel: () => void;
}

export const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  contentMetadata,
  onGenerate,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quick generation state
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickGenerationType, setQuickGenerationType] = useState<'complete' | 'outline' | 'enhance' | 'adapt' | 'simplify' | 'extend'>('outline');
  
  // Advanced generation state
  const [advancedPrompt, setAdvancedPrompt] = useState<AIGenerationPrompt>({
    contentType: contentMetadata?.contentType || ContentType.LESSON,
    subject: contentMetadata?.subject || '',
    topic: '',
    keyStage: contentMetadata?.keyStage || KeyStage.KS3,
    learningObjectives: contentMetadata?.learningObjectives || [],
    targetLearningStyles: contentMetadata?.targetLearningStyles || [LearningStyle.MULTIMODAL],
    senSupport: contentMetadata?.senSupport || [],
    difficulty: 'intermediate',
    duration: 30,
    additionalInstructions: '',
    generationType: 'complete'
  });
  
  const [newLearningObjective, setNewLearningObjective] = useState('');
  
  const { toast } = useToast();
  
  // Handle quick generation
  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim()) {
      setError('Please enter a prompt for generation.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create a simplified prompt for quick generation
      const prompt: AIGenerationPrompt = {
        contentType: contentMetadata?.contentType || ContentType.LESSON,
        subject: contentMetadata?.subject || '',
        topic: quickPrompt,
        keyStage: contentMetadata?.keyStage || KeyStage.KS3,
        learningObjectives: [],
        generationType: quickGenerationType
      };
      
      const contentService = getContentCreationService();
      const generatedContent = await contentService.generateWithAI(prompt);
      
      onGenerate(generatedContent);
    } catch (error) {
      console.error('Failed to generate content:', error);
      setError('Failed to generate content. Please try again.');
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was a problem generating content with AI.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle advanced generation
  const handleAdvancedGenerate = async () => {
    if (!advancedPrompt.topic.trim()) {
      setError('Please enter a topic for generation.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const contentService = getContentCreationService();
      const generatedContent = await contentService.generateWithAI(advancedPrompt);
      
      onGenerate(generatedContent);
    } catch (error) {
      console.error('Failed to generate content:', error);
      setError('Failed to generate content. Please try again.');
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was a problem generating content with AI.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Add learning objective
  const handleAddLearningObjective = () => {
    if (!newLearningObjective.trim()) return;
    
    setAdvancedPrompt({
      ...advancedPrompt,
      learningObjectives: [...advancedPrompt.learningObjectives, newLearningObjective]
    });
    
    setNewLearningObjective('');
  };
  
  // Remove learning objective
  const handleRemoveLearningObjective = (index: number) => {
    setAdvancedPrompt({
      ...advancedPrompt,
      learningObjectives: advancedPrompt.learningObjectives.filter((_, i) => i !== index)
    });
  };
  
  // Update advanced prompt field
  const handleAdvancedPromptChange = (field: keyof AIGenerationPrompt, value) => {
    setAdvancedPrompt({
      ...advancedPrompt,
      [field]: value
    });
  };
  
  // Toggle learning style
  const handleToggleLearningStyle = (style: LearningStyle) => {
    if (advancedPrompt.targetLearningStyles?.includes(style)) {
      setAdvancedPrompt({
        ...advancedPrompt,
        targetLearningStyles: advancedPrompt.targetLearningStyles.filter(s => s !== style)
      });
    } else {
      setAdvancedPrompt({
        ...advancedPrompt,
        targetLearningStyles: [...(advancedPrompt.targetLearningStyles || []), style]
      });
    }
  };
  
  // Toggle SEN support
  const handleToggleSENSupport = (category: SENCategory) => {
    if (advancedPrompt.senSupport?.includes(category)) {
      setAdvancedPrompt({
        ...advancedPrompt,
        senSupport: advancedPrompt.senSupport.filter(c => c !== category)
      });
    } else {
      setAdvancedPrompt({
        ...advancedPrompt,
        senSupport: [...(advancedPrompt.senSupport || []), category]
      });
    }
  };
  
  return (
    <div className="ai-generation-panel">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Quick Generation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quickPrompt">What would you like to generate?</Label>
              <Textarea 
                id="quickPrompt" 
                placeholder="E.g., A lesson about photosynthesis for Year 8 students" 
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quickGenerationType">Generation Type</Label>
              <RadioGroup 
                value={quickGenerationType}
                onValueChange={(value) => setQuickGenerationType(value as any)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="outline" id="outline" />
                  <Label htmlFor="outline">Outline</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="complete" id="complete" />
                  <Label htmlFor="complete">Complete Content</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="enhance" id="enhance" />
                  <Label htmlFor="enhance">Enhance Existing</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="adapt" id="adapt" />
                  <Label htmlFor="adapt">Adapt for Learning Styles</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="simplify" id="simplify" />
                  <Label htmlFor="simplify">Simplify</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="extend" id="extend" />
                  <Label htmlFor="extend">Extend</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
                Cancel
              </Button>
              <Button 
                onClick={handleQuickGenerate} 
                disabled={isGenerating || !quickPrompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
                {!isGenerating && <Wand2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={advancedPrompt.contentType} 
                  onValueChange={(value) => handleAdvancedPromptChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyStage">Key Stage</Label>
                <Select 
                  value={advancedPrompt.keyStage} 
                  onValueChange={(value) => handleAdvancedPromptChange('keyStage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(KeyStage).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={advancedPrompt.subject} 
                  onChange={(e) => handleAdvancedPromptChange('subject', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input 
                  id="topic" 
                  value={advancedPrompt.topic} 
                  onChange={(e) => handleAdvancedPromptChange('topic', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Learning Objectives</Label>
              <div className="flex gap-2">
                <Input 
                  value={newLearningObjective}
                  onChange={(e) => setNewLearningObjective(e.target.value)}
                  placeholder="Enter a learning objective"
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddLearningObjective}
                  disabled={!newLearningObjective.trim()}
                >
                  Add
                </Button>
              </div>
              
              {advancedPrompt.learningObjectives.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {advancedPrompt.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex justify-between items-centre p-2 bg-muted rounded-md">
                      <span>{objective}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveLearningObjective(index)}
                      >
                        &times;
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No learning objectives added yet.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Target Learning Styles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.values(LearningStyle).map((style) => (
                  <div key={style} className="flex items-centre space-x-2">
                    <Checkbox 
                      id={`style-${style}`} 
                      checked={advancedPrompt.targetLearningStyles?.includes(style)}
                      onCheckedChange={() => handleToggleLearningStyle(style)}
                    />
                    <Label htmlFor={`style-${style}`}>{style.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>SEN Support</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.values(SENCategory).map((category) => (
                  <div key={category} className="flex items-centre space-x-2">
                    <Checkbox 
                      id={`sen-${category}`} 
                      checked={advancedPrompt.senSupport?.includes(category)}
                      onCheckedChange={() => handleToggleSENSupport(category)}
                    />
                    <Label htmlFor={`sen-${category}`}>{category.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={advancedPrompt.difficulty} 
                  onValueChange={(value) => handleAdvancedPromptChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  min="5"
                  max="120"
                  value={advancedPrompt.duration || ''} 
                  onChange={(e) => handleAdvancedPromptChange('duration', parseInt(e.target.value) || undefined)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="generationType">Generation Type</Label>
              <Select 
                value={advancedPrompt.generationType} 
                onValueChange={(value) => handleAdvancedPromptChange('generationType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select generation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Content</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="enhance">Enhance Existing</SelectItem>
                  <SelectItem value="adapt">Adapt for Learning Styles</SelectItem>
                  <SelectItem value="simplify">Simplify</SelectItem>
                  <SelectItem value="extend">Extend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInstructions">Additional Instructions</Label>
              <Textarea 
                id="additionalInstructions" 
                placeholder="Any specific requirements or instructions for the AI" 
                value={advancedPrompt.additionalInstructions || ''}
                onChange={(e) => handleAdvancedPromptChange('additionalInstructions', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdvancedGenerate} 
                disabled={isGenerating || !advancedPrompt.topic.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
                {!isGenerating && <Wand2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h3 className="text-sm font-medium mb-2">AI Generation Tips</h3>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>Be specific about the topic and learning objectives</li>
          <li>Include age-appropriate language for the target key stage</li>
          <li>Specify any particular teaching approaches or methodologies</li>
          <li>For SEN support, provide details about specific accommodations needed</li>
          <li>Generated content will align with UK curriculum standards</li>
        </ul>
      </div>
    </div>
  );
};

export default AIGenerationPanel;
