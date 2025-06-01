'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Save, 
  Eye, 
  Send, 
  Trash2, 
  Copy, 
  Clock, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  AlertCircle
} from 'lucide-react';

import { 
  ContentType, 
  ContentFormat, 
  ContentDifficultyLevel, 
  ContentStatus,
  UKKeyStage,
  UKSubject,
  ContentMetadata,
  ContentVariant,
  CurriculumContent,
  LearningStyle
} from '@/lib/curriculum-content/types';
import { createCurriculumContent, updateCurriculumContent, updateContentStatus } from '@/lib/curriculum-content/api';

/**
 * Curriculum Content Editor Component
 * 
 * Allows educators to create and edit curriculum content with learning style variants
 */
export function CurriculumContentEditor({ 
  initialContent,
  onSave,
  onCancel
}: { 
  initialContent?: CurriculumContent,
  onSave?: (content: CurriculumContent) => void,
  onCancel?: () => void
}) {
  const { toast } = useToast();
  const isEditing = !!initialContent;
  
  // Content metadata state
  const [metadata, setMetadata] = useState<Partial<ContentMetadata>>(
    initialContent?.metadata || {
      title: '',
      description: '',
      keyStage: UKKeyStage.KS2,
      subject: UKSubject.MATHEMATICS,
      topics: [],
      learningObjectives: [],
      keywords: [],
      difficultyLevel: ContentDifficultyLevel.CORE,
      contentType: ContentType.EXPLANATION,
      contentFormat: ContentFormat.TEXT,
      estimatedDuration: 30,
      status: ContentStatus.DRAFT
    }
  );
  
  // Content variants state
  const [variants, setVariants] = useState<Record<LearningStyle, Partial<ContentVariant>>>(
    initialContent?.variants.reduce((acc, variant) => {
      acc[variant.learningStyle] = variant;
      return acc;
    }, {} as Record<LearningStyle, ContentVariant>) || {
      [LearningStyle.VISUAL]: {
        learningStyle: LearningStyle.VISUAL,
        content: '',
        mediaUrls: []
      },
      [LearningStyle.AUDITORY]: {
        learningStyle: LearningStyle.AUDITORY,
        content: '',
        mediaUrls: []
      },
      [LearningStyle.KINESTHETIC]: {
        learningStyle: LearningStyle.KINESTHETIC,
        content: '',
        mediaUrls: []
      },
      [LearningStyle.READ_WRITE]: {
        learningStyle: LearningStyle.READ_WRITE,
        content: '',
        mediaUrls: []
      }
    }
  );
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('metadata');
  
  // Topic input state
  const [topicInput, setTopicInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  // Handle metadata change
  const handleMetadataChange = (key: keyof ContentMetadata, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle variant change
  const handleVariantChange = (style: LearningStyle, key: keyof ContentVariant, value: any) => {
    setVariants(prev => ({
      ...prev,
      [style]: {
        ...prev[style],
        [key]: value
      }
    }));
  };
  
  // Add topic
  const handleAddTopic = () => {
    if (topicInput.trim()) {
      setMetadata(prev => ({
        ...prev,
        topics: [...(prev.topics || []), topicInput.trim()]
      }));
      setTopicInput('');
    }
  };
  
  // Remove topic
  const handleRemoveTopic = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      topics: prev.topics?.filter((_, i) => i !== index)
    }));
  };
  
  // Add learning objective
  const handleAddObjective = () => {
    if (objectiveInput.trim()) {
      setMetadata(prev => ({
        ...prev,
        learningObjectives: [...(prev.learningObjectives || []), objectiveInput.trim()]
      }));
      setObjectiveInput('');
    }
  };
  
  // Remove learning objective
  const handleRemoveObjective = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.filter((_, i) => i !== index)
    }));
  };
  
  // Add keyword
  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setMetadata(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };
  
  // Remove keyword
  const handleRemoveKeyword = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      keywords: prev.keywords?.filter((_, i) => i !== index)
    }));
  };
  
  // Handle save
  const handleSave = async (status?: ContentStatus) => {
    try {
      // Validate required fields
      if (!metadata.title || !metadata.description || !metadata.keyStage || !metadata.subject) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields in the metadata tab.",
          variant: "destructive"
        });
        setActiveTab('metadata');
        return;
      }
      
      // Check if at least one variant has content
      const hasContent = Object.values(variants).some(v => v.content && v.content.trim().length > 0);
      if (!hasContent) {
        toast({
          title: "Missing content",
          description: "Please add content to at least one learning style variant.",
          variant: "destructive"
        });
        setActiveTab('visual');
        return;
      }
      
      // Prepare content object
      const contentToSave: Partial<CurriculumContent> = {
        metadata: {
          ...metadata,
          status: status || metadata.status,
          updatedAt: new Date().toISOString()
        } as ContentMetadata,
        variants: Object.values(variants).filter(v => v.content && v.content.trim().length > 0) as ContentVariant[],
        defaultVariant: variants[LearningStyle.VISUAL] as ContentVariant
      };
      
      // Save content
      let savedContent;
      if (isEditing && initialContent?.metadata.id) {
        savedContent = await updateCurriculumContent(initialContent.metadata.id, contentToSave);
        
        // Update status if needed
        if (status && status !== initialContent.metadata.status) {
          await updateContentStatus(initialContent.metadata.id, status);
        }
      } else {
        savedContent = await createCurriculumContent(contentToSave);
      }
      
      toast({
        title: isEditing ? "Content updated" : "Content created",
        description: `Your curriculum content has been ${isEditing ? 'updated' : 'created'} successfully.`
      });
      
      if (onSave) {
        onSave(savedContent);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error saving content",
        description: "An error occurred while saving your content. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle submit for review
  const handleSubmitForReview = () => {
    handleSave(ContentStatus.REVIEW);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  // Get icon for content format
  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case ContentFormat.TEXT:
        return <FileText className="h-4 w-4" />;
      case ContentFormat.VIDEO:
        return <Video className="h-4 w-4" />;
      case ContentFormat.AUDIO:
        return <Headphones className="h-4 w-4" />;
      case ContentFormat.INTERACTIVE:
        return <MousePointer className="h-4 w-4" />;
      case ContentFormat.DOCUMENT:
        return <FileSpreadsheet className="h-4 w-4" />;
      case ContentFormat.PRESENTATION:
        return <Presentation className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Curriculum Content' : 'Create Curriculum Content'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Update existing curriculum content and learning style variants' 
              : 'Create new curriculum content with variants for different learning styles'}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave()}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmitForReview}>
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="auditory">Auditory</TabsTrigger>
          <TabsTrigger value="kinesthetic">Kinesthetic</TabsTrigger>
          <TabsTrigger value="read-write">Read/Write</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle>Content Metadata</CardTitle>
              <CardDescription>
                Basic information about your curriculum content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={metadata.title || ''}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  value={metadata.description || ''}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  placeholder="Provide a detailed description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyStage">Key Stage <span className="text-red-500">*</span></Label>
                  <Select 
                    value={metadata.keyStage} 
                    onValueChange={(value) => handleMetadataChange('keyStage', value)}
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
                  <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                  <Select 
                    value={metadata.subject} 
                    onValueChange={(value) => handleMetadataChange('subject', value)}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select 
                    value={metadata.contentType} 
                    onValueChange={(value) => handleMetadataChange('contentType', value)}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContentType.EXPLANATION}>Explanation</SelectItem>
                      <SelectItem value={ContentType.EXERCISE}>Exercise</SelectItem>
                      <SelectItem value={ContentType.ASSESSMENT}>Assessment</SelectItem>
                      <SelectItem value={ContentType.EXAMPLE}>Example</SelectItem>
                      <SelectItem value={ContentType.RESOURCE}>Resource</SelectItem>
                      <SelectItem value={ContentType.PROJECT}>Project</SelectItem>
                      <SelectItem value={ContentType.DISCUSSION}>Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentFormat">Content Format</Label>
                  <Select 
                    value={metadata.contentFormat} 
                    onValueChange={(value) => handleMetadataChange('contentFormat', value)}
                  >
                    <SelectTrigger id="contentFormat">
                      <SelectValue placeholder="Select content format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContentFormat.TEXT}>Text</SelectItem>
                      <SelectItem value={ContentFormat.IMAGE}>Image</SelectItem>
                      <SelectItem value={ContentFormat.VIDEO}>Video</SelectItem>
                      <SelectItem value={ContentFormat.AUDIO}>Audio</SelectItem>
                      <SelectItem value={ContentFormat.INTERACTIVE}>Interactive</SelectItem>
                      <SelectItem value={ContentFormat.DOCUMENT}>Document</SelectItem>
                      <SelectItem value={ContentFormat.PRESENTATION}>Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select 
                    value={metadata.difficultyLevel} 
                    onValueChange={(value) => handleMetadataChange('difficultyLevel', value)}
                  >
                    <SelectTrigger id="difficultyLevel">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContentDifficultyLevel.FOUNDATION}>Foundation</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.CORE}>Core</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.EXTENDED}>Extended</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.ADVANCED}>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    min="1"
                    value={metadata.estimatedDuration || ''}
                    onChange={(e) => handleMetadataChange('estimatedDuration', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Topics</Label>
                <div className="flex space-x-2">
                  <Input
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Add a topic"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTopic}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.topics?.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {topic}
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveTopic(index)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <div className="flex space-x-2">
                  <Input
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    placeholder="Add a learning objective"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddObjective}>Add</Button>
                </div>
                <div className="space-y-2 mt-2">
                  {metadata.learningObjectives?.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>{objective}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveObjective(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex space-x-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.keywords?.map((keyword, index) => (
                    <Badge key={index} className="px-3 py-1">
                      {keyword}
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveKeyword(index)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Fields marked with <span className="text-red-500">*</span> are required</span>
              </div>
              <Button onClick={() => setActiveTab('visual')}>
                Continue to Visual Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Visual Learning Style Content</CardTitle>
              <CardDescription>
                Create content optimized for visual learners who prefer images, diagrams, and visual representations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="visual-content">Content</Label>
                <Textarea
                  id="visual-content"
                  value={variants[LearningStyle.VISUAL]?.content || ''}
                  onChange={(e) => handleVariantChange(LearningStyle.VISUAL, 'content', e.target.value)}
                  placeholder="Enter content for visual learners. Include descriptions of diagrams, charts, and visual aids."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Visual Learning Strategies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="visual-diagrams" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="visual-diagrams">Include diagrams and charts</Label>
                      <p className="text-sm text-muted-foreground">
                        Visual representations of concepts and relationships
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="visual-mindmaps" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="visual-mindmaps">Use mind maps</Label>
                      <p className="text-sm text-muted-foreground">
                        Visual organization of information showing connections
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="visual-color" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="visual-color">Apply color coding</Label>
                      <p className="text-sm text-muted-foreground">
                        Use colors to highlight and categorize information
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="visual-symbols" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="visual-symbols">Include symbols and icons</Label>
                      <p className="text-sm text-muted-foreground">
                        Visual cues to represent concepts and ideas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Media URLs</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add links to images, diagrams, videos, or other visual resources
                </p>
                <div className="space-y-2">
                  {/* Media URL inputs would go here */}
                  <Input placeholder="https://example.com/image.jpg" />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Add Media URL
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('metadata')}>
                Back to Metadata
              </Button>
              <Button onClick={() => setActiveTab('auditory')}>
                Continue to Auditory Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="auditory">
          <Card>
            <CardHeader>
              <CardTitle>Auditory Learning Style Content</CardTitle>
              <CardDescription>
                Create content optimized for auditory learners who prefer listening, discussions, and verbal explanations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="auditory-content">Content</Label>
                <Textarea
                  id="auditory-content"
                  value={variants[LearningStyle.AUDITORY]?.content || ''}
                  onChange={(e) => handleVariantChange(LearningStyle.AUDITORY, 'content', e.target.value)}
                  placeholder="Enter content for auditory learners. Include verbal explanations, discussions, and spoken instructions."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Auditory Learning Strategies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="auditory-discussions" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="auditory-discussions">Include discussion prompts</Label>
                      <p className="text-sm text-muted-foreground">
                        Questions and topics for verbal exploration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="auditory-mnemonics" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="auditory-mnemonics">Use mnemonics and rhymes</Label>
                      <p className="text-sm text-muted-foreground">
                        Memory aids using sounds and patterns
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="auditory-storytelling" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="auditory-storytelling">Apply storytelling</Label>
                      <p className="text-sm text-muted-foreground">
                        Narrative approaches to explain concepts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="auditory-repetition" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="auditory-repetition">Include verbal repetition</Label>
                      <p className="text-sm text-muted-foreground">
                        Repeating key points in different ways
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Media URLs</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add links to audio recordings, podcasts, or spoken explanations
                </p>
                <div className="space-y-2">
                  {/* Media URL inputs would go here */}
                  <Input placeholder="https://example.com/audio.mp3" />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Add Media URL
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('visual')}>
                Back to Visual Content
              </Button>
              <Button onClick={() => setActiveTab('kinesthetic')}>
                Continue to Kinesthetic Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="kinesthetic">
          <Card>
            <CardHeader>
              <CardTitle>Kinesthetic Learning Style Content</CardTitle>
              <CardDescription>
                Create content optimized for kinesthetic learners who prefer hands-on activities and physical engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kinesthetic-content">Content</Label>
                <Textarea
                  id="kinesthetic-content"
                  value={variants[LearningStyle.KINESTHETIC]?.content || ''}
                  onChange={(e) => handleVariantChange(LearningStyle.KINESTHETIC, 'content', e.target.value)}
                  placeholder="Enter content for kinesthetic learners. Include hands-on activities, experiments, and physical demonstrations."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Kinesthetic Learning Strategies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="kinesthetic-activities" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="kinesthetic-activities">Include hands-on activities</Label>
                      <p className="text-sm text-muted-foreground">
                        Physical tasks that reinforce learning
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="kinesthetic-experiments" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="kinesthetic-experiments">Use experiments</Label>
                      <p className="text-sm text-muted-foreground">
                        Practical investigations and demonstrations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="kinesthetic-roleplay" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="kinesthetic-roleplay">Apply role-playing</Label>
                      <p className="text-sm text-muted-foreground">
                        Acting out concepts and scenarios
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="kinesthetic-models" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="kinesthetic-models">Include model building</Label>
                      <p className="text-sm text-muted-foreground">
                        Creating physical representations of concepts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Media URLs</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add links to instructional videos, activity guides, or demonstration materials
                </p>
                <div className="space-y-2">
                  {/* Media URL inputs would go here */}
                  <Input placeholder="https://example.com/activity-guide.pdf" />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Add Media URL
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('auditory')}>
                Back to Auditory Content
              </Button>
              <Button onClick={() => setActiveTab('read-write')}>
                Continue to Read/Write Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="read-write">
          <Card>
            <CardHeader>
              <CardTitle>Read/Write Learning Style Content</CardTitle>
              <CardDescription>
                Create content optimized for read/write learners who prefer text-based information and note-taking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="read-write-content">Content</Label>
                <Textarea
                  id="read-write-content"
                  value={variants[LearningStyle.READ_WRITE]?.content || ''}
                  onChange={(e) => handleVariantChange(LearningStyle.READ_WRITE, 'content', e.target.value)}
                  placeholder="Enter content for read/write learners. Include detailed text explanations, lists, and definitions."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Read/Write Learning Strategies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="read-write-lists" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="read-write-lists">Include lists and bullet points</Label>
                      <p className="text-sm text-muted-foreground">
                        Organized text information in list format
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="read-write-definitions" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="read-write-definitions">Use definitions and glossaries</Label>
                      <p className="text-sm text-muted-foreground">
                        Clear explanations of terminology
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="read-write-essays" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="read-write-essays">Apply essay-style explanations</Label>
                      <p className="text-sm text-muted-foreground">
                        Detailed written explorations of concepts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="read-write-notes" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="read-write-notes">Include note-taking templates</Label>
                      <p className="text-sm text-muted-foreground">
                        Structured formats for written notes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Media URLs</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add links to articles, documents, or written resources
                </p>
                <div className="space-y-2">
                  {/* Media URL inputs would go here */}
                  <Input placeholder="https://example.com/article.pdf" />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Add Media URL
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('kinesthetic')}>
                Back to Kinesthetic Content
              </Button>
              <Button onClick={() => handleSave()}>
                <Save className="mr-2 h-4 w-4" />
                Save Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave()}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
        <Button onClick={handleSubmitForReview}>
          <Send className="mr-2 h-4 w-4" />
          Submit for Review
        </Button>
      </div>
    </div>
  );
}
