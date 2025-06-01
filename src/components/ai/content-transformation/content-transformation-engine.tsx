'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAIService } from '@/lib/ai/ai-service';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, Play, Pause, Volume2, BookOpen, Eye, Hand, Ear } from 'lucide-react';

type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';

type ContentTransformationProps = {
  originalContent: string;
  contentType?: 'lesson' | 'assessment' | 'resource' | 'feedback';
  subjectArea?: string;
  targetAge?: number;
  learningStyle?: LearningStyle;
  onTransformationComplete?: (transformedContent: TransformedContent) => void;
};

type TransformedContent = {
  visual: string;
  auditory: string;
  kinesthetic: string;
  readingWriting: string;
  multimodal: string;
};

export default function ContentTransformationEngine({
  originalContent,
  contentType = 'lesson',
  subjectArea = '',
  targetAge = 10,
  learningStyle,
  onTransformationComplete
}: ContentTransformationProps) {
  const { toast } = useToast();
  const aiService = useAIService();
  
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedContent, setTransformedContent] = useState<TransformedContent | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>(learningStyle || 'visual');
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(null);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(80);
  const [customContent, setCustomContent] = useState('');
  const [useCustomContent, setUseCustomContent] = useState(false);
  const [complexity, setComplexity] = useState(50);
  
  // Fetch user's learning style profile if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/ai/learning-style');
        const data = await response.json();
        
        if (data.success && data.hasProfile) {
          setUserProfile(data.profile);
          if (!learningStyle) {
            setSelectedStyle(data.profile.primaryStyle.toLowerCase().replace('/', '-') as LearningStyle);
          }
        }
      } catch (error) {
        console.error('Error fetching learning style profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [learningStyle]);
  
  // Transform content when component mounts or when key props change
  useEffect(() => {
    if (originalContent && !transformedContent && !isTransforming) {
      transformContent();
    }
  }, [originalContent]);
  
  const transformContent = async () => {
    if (!originalContent && !useCustomContent) {
      toast({
        title: "No content to transform",
        description: "Please provide content to transform or enable custom content input.",
        variant: "destructive"
      });
      return;
    }
    
    const contentToTransform = useCustomContent ? customContent : originalContent;
    
    if (!contentToTransform) {
      toast({
        title: "No content to transform",
        description: "Please provide content to transform.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransforming(true);
    
    try {
      const prompt = `
        Transform the following educational content to optimise it for different learning styles.
        Create versions optimised for visual, auditory, kinesthetic, and reading/writing learning styles,
        as well as a multimodal version that combines elements from all styles.
        
        Content Type: ${contentType}
        ${subjectArea ? `Subject Area: ${subjectArea}` : ''}
        Target Age: ${targetAge}
        Complexity Level (0-100): ${complexity}
        
        Original Content:
        ${contentToTransform}
        
        For each learning style, adapt the content while preserving the educational objectives:
        
        1. Visual: Emphasize diagrams, charts, colour-coding, spatial organisation, and visual metaphors.
        2. Auditory: Emphasize dialogue, discussion points, mnemonics, rhythm, and spoken explanations.
        3. Kinesthetic: Emphasize hands-on activities, physical movements, tactile examples, and experiential learning.
        4. Reading/Writing: Emphasize lists, definitions, structured text, note-taking opportunities, and written exercises.
        5. Multimodal: Create a balanced version that incorporates elements from all learning styles.
        
        Ensure all content:
        - Uses UK English spelling and terminology
        - Aligns with UK curriculum standards
        - Is evidence-based and factually accurate
        - Is age-appropriate for the target audience
        - Maintains the educational integrity of the original content
        
        Format the response as JSON with the following structure:
        {
          "visual": "content optimised for visual learners",
          "auditory": "content optimised for auditory learners",
          "kinesthetic": "content optimised for kinesthetic learners",
          "readingWriting": "content optimised for reading/writing learners",
          "multimodal": "content optimised for multimodal learning"
        }
      `;
      
      const aiResponse = await aiService.getCompletion({
        prompt,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      });
      
      // Parse AI response
      let result;
      try {
        result = JSON.parse(aiResponse);
        setTransformedContent({
          visual: result.visual,
          auditory: result.auditory,
          kinesthetic: result.kinesthetic,
          readingWriting: result.readingWriting,
          multimodal: result.multimodal
        });
        
        if (onTransformationComplete) {
          onTransformationComplete({
            visual: result.visual,
            auditory: result.auditory,
            kinesthetic: result.kinesthetic,
            readingWriting: result.readingWriting,
            multimodal: result.multimodal
          });
        }
        
        toast({
          title: "Content transformed successfully",
          description: "Content has been adapted for different learning styles.",
        });
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        toast({
          title: "Transformation error",
          description: "Failed to process the transformed content.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error transforming content:', error);
      toast({
        title: "Transformation failed",
        description: "There was an error transforming the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTransforming(false);
    }
  };
  
  const handleVoiceInput = () => {
    // In a real implementation, this would use the Web Speech API
    setIsVoiceInputActive(prev => !prev);
    
    if (!isVoiceInputActive) {
      toast({
        title: "Voice input activated",
        description: "Speak clearly to input your content.",
      });
      
      // Simulate voice recognition after a delay
      setTimeout(() => {
        setCustomContent(prev => prev + " This is simulated voice input text that would be captured from the user's speech.");
        setIsVoiceInputActive(false);
        toast({
          title: "Voice input complete",
          description: "Your speech has been converted to text.",
        });
      }, 3000);
    }
  };
  
  const handleTextToSpeech = () => {
    // In a real implementation, this would use the Web Speech API
    setIsPlayingAudio(prev => !prev);
    
    if (!isPlayingAudio) {
      toast({
        title: "Reading content aloud",
        description: `Volume: ${audioVolume}%`,
      });
      
      // Simulate audio playback ending after a delay
      setTimeout(() => {
        setIsPlayingAudio(false);
        toast({
          title: "Finished reading content",
          description: "Audio playback complete.",
        });
      }, 5000);
    } else {
      toast({
        title: "Paused reading",
        description: "Audio playback paused.",
      });
    }
  };
  
  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'visual':
        return <Eye className="h-4 w-4" />;
      case 'auditory':
        return <Ear className="h-4 w-4" />;
      case 'kinesthetic':
        return <Hand className="h-4 w-4" />;
      case 'reading-writing':
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const renderStyleBadge = (style: LearningStyle) => {
    return (
      <Badge variant="outline" className="flex items-centre gap-1">
        {getStyleIcon(style)}
        <span>{style.charAt(0).toUpperCase() + style.slice(1).replace('-', '/')}</span>
      </Badge>
    );
  };
  
  const renderContent = () => {
    if (isTransforming) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    
    if (!transformedContent) {
      return (
        <div className="text-centre py-8">
          <p className="text-muted-foreground">
            No transformed content available. Click "Transform Content" to begin.
          </p>
        </div>
      );
    }
    
    const contentMap = {
      'visual': transformedContent.visual,
      'auditory': transformedContent.auditory,
      'kinesthetic': transformedContent.kinesthetic,
      'reading-writing': transformedContent.readingWriting,
      'multimodal': transformedContent.multimodal
    };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-centre">
          {renderStyleBadge(selectedStyle)}
          
          <div className="flex items-centre gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTextToSpeech}
              className="flex items-centre gap-1"
            >
              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlayingAudio ? 'Pause' : 'Read Aloud'}
            </Button>
            
            {isPlayingAudio && (
              <div className="flex items-centre gap-2 w-32">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[audioVolume]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setAudioVolume(value[0])}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {/* In a real implementation, this would be properly rendered HTML with appropriate styling */}
          <div dangerouslySetInnerHTML={{ __html: contentMap[selectedStyle].replace(/\n/g, '<br />') }} />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Transformation Engine</CardTitle>
          <CardDescription>
            Adapt educational content to different learning styles for personalized learning experiences.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Custom Content Input */}
            <div className="space-y-4">
              <div className="flex items-centre justify-between">
                <Label htmlFor="use-custom-content">Use custom content</Label>
                <Switch
                  id="use-custom-content"
                  checked={useCustomContent}
                  onCheckedChange={setUseCustomContent}
                />
              </div>
              
              {useCustomContent && (
                <div className="space-y-2">
                  <div className="flex justify-between items-centre">
                    <Label htmlFor="custom-content">Enter content to transform</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVoiceInput}
                      className={`flex items-centre gap-1 ${isVoiceInputActive ? 'text-red-500' : ''}`}
                    >
                      <Mic className="h-4 w-4" />
                      {isVoiceInputActive ? 'Recording...' : 'Voice Input'}
                    </Button>
                  </div>
                  
                  <Textarea
                    id="custom-content"
                    placeholder="Enter educational content to transform..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
            
            {/* Complexity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-centre">
                <Label htmlFor="complexity">Content Complexity</Label>
                <span className="text-sm text-muted-foreground">{complexity}%</span>
              </div>
              <Slider
                id="complexity"
                value={[complexity]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setComplexity(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Simpler</span>
                <span>More Complex</span>
              </div>
            </div>
            
            {/* Learning Style Selection */}
            <div className="space-y-2">
              <Label>Learning Style Preference</Label>
              <RadioGroup
                value={selectedStyle}
                onValueChange={(value) => setSelectedStyle(value as LearningStyle)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="visual" id="visual" />
                  <Label htmlFor="visual" className="flex items-centre gap-1">
                    <Eye className="h-4 w-4" /> Visual
                  </Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="auditory" id="auditory" />
                  <Label htmlFor="auditory" className="flex items-centre gap-1">
                    <Ear className="h-4 w-4" /> Auditory
                  </Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                  <Label htmlFor="kinesthetic" className="flex items-centre gap-1">
                    <Hand className="h-4 w-4" /> Kinesthetic
                  </Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="reading-writing" id="reading-writing" />
                  <Label htmlFor="reading-writing" className="flex items-centre gap-1">
                    <BookOpen className="h-4 w-4" /> Reading/Writing
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={transformContent} 
            disabled={isTransforming || (!originalContent && !customContent)}
            className="w-full"
          >
            {isTransforming ? 'Transforming...' : 'Transform Content'}
          </Button>
          
          <Tabs defaultValue="preview" className="w-full mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="all-styles">All Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              {renderContent()}
            </TabsContent>
            <TabsContent value="all-styles" className="mt-4">
              {transformedContent ? (
                <div className="space-y-8">
                  {Object.entries(transformedContent).map(([key, content]) => (
                    <div key={key} className="space-y-2">
                      <h3 className="text-lg font-medium flex items-centre gap-2">
                        {key === 'visual' && <Eye className="h-4 w-4" />}
                        {key === 'auditory' && <Ear className="h-4 w-4" />}
                        {key === 'kinesthetic' && <Hand className="h-4 w-4" />}
                        {key === 'readingWriting' && <BookOpen className="h-4 w-4" />}
                        {key === 'multimodal' && <span className="text-sm">🔄</span>}
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="prose prose-sm max-w-none dark:prose-invert border-l-2 pl-4 py-2">
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-centre py-8">
                  <p className="text-muted-foreground">
                    No transformed content available. Click "Transform Content" to begin.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-sm font-medium mb-2">About Learning Styles</h3>
        <p className="text-sm text-muted-foreground">
          While the concept of learning styles has been debated in educational research, 
          providing content in multiple formats can benefit all learners by offering 
          different ways to engage with material. This tool adapts content to support 
          diverse learning preferences and needs.
        </p>
      </div>
    </div>
  );
}
