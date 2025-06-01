'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Image as ImageIcon,
  FileText,
  Headphones,
  Hand,
  Sparkles,
  RefreshCw,
  Settings,
  CheckCircle2,
  Download
} from "lucide-react";

interface MultiModalPresentationEngineProps {
  content?: string;
  title?: string;
  subject?: string;
  keyStage?: string;
  contentId?: string;
  onContentGenerated?: (content) => void;
  className?: string;
}

export default function MultiModalPresentationEngine({
  content = '',
  title = '',
  subject = '',
  keyStage = '',
  contentId,
  onContentGenerated,
  className
}: MultiModalPresentationEngineProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [multiModalContent, setMultiModalContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('combined');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState({
    includeVisual: true,
    includeAudio: true,
    includeText: true,
    includeInteractive: true,
    accessibilityLevel: 'high',
    contentComplexity: 70,
    presentationSpeed: 'medium',
    autoAdvance: false
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);
  
  // Handle auto-advance slides
  useEffect(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
    
    if (isPlaying && settings.autoAdvance && multiModalContent?.slides) {
      const speedMap: {[key: string]: number} = {
        slow: 15000,
        medium: 10000,
        fast: 5000
      };
      
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % multiModalContent.slides.length);
      }, speedMap[settings.presentationSpeed]);
    }
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isPlaying, settings.autoAdvance, settings.presentationSpeed, multiModalContent]);
  
  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSlide]);
  
  const generateMultiModalContent = async () => {
    if (!content && !contentId && !title) {
      toast({
        title: "Missing content",
        description: "Please provide content, a title, or select existing content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/multi-modal-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          subject,
          keyStage,
          contentId,
          settings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate multi-modal content');
      }

      const data = await response.json();
      setMultiModalContent(data.multiModalContent);
      
      if (onContentGenerated) {
        onContentGenerated(data.multiModalContent);
      }

      toast({
        title: "Multi-modal content generated",
        description: "Content has been successfully transformed into multiple modalities.",
      });
      
      // Reset to first slide
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error generating multi-modal content:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate multi-modal content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handlePrevSlide = () => {
    if (multiModalContent?.slides) {
      setCurrentSlide(prev => (prev - 1 + multiModalContent.slides.length) % multiModalContent.slides.length);
    }
  };
  
  const handleNextSlide = () => {
    if (multiModalContent?.slides) {
      setCurrentSlide(prev => (prev + 1) % multiModalContent.slides.length);
    }
  };
  
  const getCurrentSlide = () => {
    if (!multiModalContent?.slides || multiModalContent.slides.length === 0) {
      return null;
    }
    
    return multiModalContent.slides[currentSlide];
  };
  
  const renderCombinedView = () => {
    const currentSlide = getCurrentSlide();
    if (!currentSlide) return null;
    
    return (
      <div className="space-y-6">
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
          {settings.includeVisual && currentSlide.visualContent && (
            <div className="absolute inset-0 flex items-centre justify-centre">
              <img 
                src={currentSlide.visualContent} 
                alt={currentSlide.title || 'Visual representation'} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          {settings.includeInteractive && currentSlide.interactiveContent && (
            <div className="absolute bottom-4 right-4 p-2 bg-white/80 dark:bg-black/80 rounded-md">
              <Button size="sm" variant="outline" className="flex items-centre gap-1">
                <Hand className="h-4 w-4" />
                Interactive Element
              </Button>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="font-medium">{currentSlide.title}</h3>
            <div className="flex items-centre gap-2 text-xs">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Slide {currentSlide + 1} of {multiModalContent.slides.length}
              </Badge>
            </div>
          </div>
        </div>
        
        {settings.includeAudio && currentSlide.audioContent && (
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
            <div className="flex items-centre gap-2 mb-2">
              <Headphones className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Audio Narration</span>
            </div>
            <audio 
              ref={audioRef} 
              src={currentSlide.audioContent} 
              controls 
              className="w-full h-8"
            />
          </div>
        )}
        
        {settings.includeText && currentSlide.textContent && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
            <div className="flex items-centre gap-2 mb-2">
              <FileText className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium">Text Content</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentSlide.textContent }} />
            </div>
          </div>
        )}
        
        <div className="flex items-centre justify-between">
          <div className="flex items-centre gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevSlide}
              disabled={!multiModalContent?.slides || multiModalContent.slides.length <= 1}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isPlaying ? "destructive" : "default"}
              size="icon"
              onClick={handlePlayPause}
              disabled={!multiModalContent?.slides || !settings.includeAudio}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextSlide}
              disabled={!multiModalContent?.slides || multiModalContent.slides.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {multiModalContent?.slides && (
              <span>
                {currentSlide + 1} / {multiModalContent.slides.length}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderVisualView = () => {
    if (!multiModalContent?.slides) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {multiModalContent.slides.map((slide, index: number) => (
          <Card 
            key={index} 
            className={`overflow-hidden ${currentSlide === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
              {slide.visualContent ? (
                <img 
                  src={slide.visualContent} 
                  alt={slide.title || `Slide ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-centre justify-centre w-full h-full">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white text-sm font-medium truncate">{slide.title}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderAudioView = () => {
    if (!multiModalContent?.slides) return null;
    
    return (
      <div className="space-y-4">
        {multiModalContent.slides.map((slide, index: number) => (
          <Card 
            key={index} 
            className={`${currentSlide === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-base">{slide.title || `Slide ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {slide.audioContent ? (
                <audio 
                  src={slide.audioContent} 
                  controls 
                  className="w-full h-8"
                />
              ) : (
                <div className="flex items-centre justify-centre p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <Headphones className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">No audio available</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderTextView = () => {
    if (!multiModalContent?.slides) return null;
    
    return (
      <div className="space-y-4">
        {multiModalContent.slides.map((slide, index: number) => (
          <Card 
            key={index} 
            className={`${currentSlide === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-base">{slide.title || `Slide ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {slide.textContent ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: slide.textContent }} />
                </div>
              ) : (
                <div className="flex items-centre justify-centre p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <FileText className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">No text content available</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderInteractiveView = () => {
    if (!multiModalContent?.slides) return null;
    
    return (
      <div className="space-y-4">
        {multiModalContent.slides.map((slide, index: number) => (
          <Card 
            key={index} 
            className={`${currentSlide === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-base">{slide.title || `Slide ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {slide.interactiveContent ? (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                  <div className="flex items-centre justify-centre">
                    <Hand className="h-6 w-6 text-primary mr-2" />
                    <span>Interactive element available</span>
                  </div>
                  <div className="mt-2 text-centre">
                    <Button size="sm">Launch Interactive Element</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-centre justify-centre p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <Hand className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">No interactive content available</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-centre justify-between">
            <div className="flex items-centre gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Multi-Modal Content Presentation
            </div>
          </CardTitle>
          <CardDescription>
            Present educational content through multiple sensory channels simultaneously
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content Settings</TabsTrigger>
              <TabsTrigger value="presentation">Presentation Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Include Visual Content</label>
                  <p className="text-xs text-muted-foreground">
                    Images, diagrams, and visual representations
                  </p>
                </div>
                <Switch 
                  checked={settings.includeVisual}
                  onCheckedChange={(checked) => setSettings({...settings, includeVisual: checked})}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Include Audio Content</label>
                  <p className="text-xs text-muted-foreground">
                    Narration, sound effects, and audio explanations
                  </p>
                </div>
                <Switch 
                  checked={settings.includeAudio}
                  onCheckedChange={(checked) => setSettings({...settings, includeAudio: checked})}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Include Text Content</label>
                  <p className="text-xs text-muted-foreground">
                    Written explanations, summaries, and key points
                  </p>
                </div>
                <Switch 
                  checked={settings.includeText}
                  onCheckedChange={(checked) => setSettings({...settings, includeText: checked})}
                />
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Include Interactive Elements</label>
                  <p className="text-xs text-muted-foreground">
                    Interactive activities, quizzes, and manipulatives
                  </p>
                </div>
                <Switch 
                  checked={settings.includeInteractive}
                  onCheckedChange={(checked) => setSettings({...settings, includeInteractive: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-centre justify-between">
                  <label className="text-sm font-medium">Content Complexity</label>
                  <span className="text-xs text-muted-foreground">
                    {settings.contentComplexity}%
                  </span>
                </div>
                <Slider 
                  value={[settings.contentComplexity]} 
                  min={10} 
                  max={100} 
                  step={10}
                  onValueChange={(value) => setSettings({...settings, contentComplexity: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values create more detailed and complex content
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="presentation" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Accessibility Level</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.accessibilityLevel}
                  onChange={(e) => setSettings({...settings, accessibilityLevel: e.target.value})}
                >
                  <option value="standard">Standard</option>
                  <option value="high">High (Additional accessibility features)</option>
                  <option value="maximum">Maximum (Comprehensive accessibility support)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Higher levels add more accessibility features for diverse needs
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Presentation Speed</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.presentationSpeed}
                  onChange={(e) => setSettings({...settings, presentationSpeed: e.target.value as 'slow' | 'medium' | 'fast'})}
                >
                  <option value="slow">Slow (15 seconds per slide)</option>
                  <option value="medium">Medium (10 seconds per slide)</option>
                  <option value="fast">Fast (5 seconds per slide)</option>
                </select>
              </div>
              
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto-Advance Slides</label>
                  <p className="text-xs text-muted-foreground">
                    Automatically move to the next slide during playback
                  </p>
                </div>
                <Switch 
                  checked={settings.autoAdvance}
                  onCheckedChange={(checked) => setSettings({...settings, autoAdvance: checked})}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-centre text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 
            Multi-sensory learning
          </div>
          <Button 
            onClick={generateMultiModalContent} 
            disabled={isGenerating}
            className="flex items-centre gap-1"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Multi-Modal Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isGenerating && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-centre justify-centre space-y-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <div className="text-centre">
                <h3 className="text-lg font-medium">Generating Multi-Modal Content</h3>
                <p className="text-sm text-muted-foreground">
                  Creating content for multiple sensory channels...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {multiModalContent && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>{multiModalContent.title || 'Multi-Modal Content'}</CardTitle>
            <CardDescription>
              Content presented through multiple sensory channels
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="combined" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="combined">Combined</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="interactive">Interactive</TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                <TabsContent value="combined">
                  {renderCombinedView()}
                </TabsContent>
                
                <TabsContent value="visual">
                  {renderVisualView()}
                </TabsContent>
                
                <TabsContent value="audio">
                  {renderAudioView()}
                </TabsContent>
                
                <TabsContent value="text">
                  {renderTextView()}
                </TabsContent>
                
                <TabsContent value="interactive">
                  {renderInteractiveView()}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setMultiModalContent(null)}
              className="flex items-centre gap-1"
            >
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Content saved",
                  description: "The multi-modal content has been saved to your account.",
                });
              }}
              className="flex items-centre gap-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Save Content
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
