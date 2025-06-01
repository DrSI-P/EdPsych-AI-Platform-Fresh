'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download, 
  Film, 
  Loader2, 
  Play, 
  Settings, 
  Share2, 
  Video 
} from 'lucide-react';
import { 
  AvatarVideoScript, 
  AvatarGenerationSettings, 
  AvatarGenerationJob, 
  AvatarVideoMetadata,
  AvatarModel,
  AvatarEmotion, 
  AvatarSpeakingStyle, 
  AvatarBackgroundType, 
  VideoQuality, 
  VideoAspectRatio
} from '@/lib/avatar/types';
import { AvatarService } from '@/lib/avatar/avatarService';

interface VideoGeneratorProps {
  script: AvatarVideoScript;
  onVideoGenerated?: (video: AvatarVideoMetadata) => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  script,
  onVideoGenerated
}) => {
  const [avatarModels, setAvatarModels] = useState<AvatarModel[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [emotion, setEmotion] = useState<AvatarEmotion>(AvatarEmotion.PROFESSIONAL);
  const [speakingStyle, setSpeakingStyle] = useState<AvatarSpeakingStyle>(AvatarSpeakingStyle.EDUCATIONAL);
  const [backgroundType, setBackgroundType] = useState<AvatarBackgroundType>(AvatarBackgroundType.CLASSROOM);
  const [quality, setQuality] = useState<VideoQuality>(VideoQuality.HIGH);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(VideoAspectRatio.WIDESCREEN);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [visualAids, setVisualAids] = useState<boolean>(true);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationJob, setGenerationJob] = useState<AvatarGenerationJob | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<AvatarVideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('settings');
  
  const avatarService = new AvatarService();
  
  // Fetch avatar models on component mount
  useEffect(() => {
    const fetchAvatarModels = async () => {
      try {
        const models = await avatarService.getAvatarModels();
        setAvatarModels(models);
        
        // Set default avatar
        const defaultModel = models.find(model => model.isDefault);
        if (defaultModel) {
          setSelectedAvatarId(defaultModel.id);
        } else if (models.length > 0) {
          setSelectedAvatarId(models[0].id);
        }
      } catch (err) {
        console.error('Error fetching avatar models:', err);
        setError('Failed to load avatar models. Please try again.');
      }
    };
    
    fetchAvatarModels();
  }, []);
  
  // Poll job status when a job is in progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (generationJob && (generationJob.status === 'queued' || generationJob.status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const updatedJob = await avatarService.checkJobStatus(generationJob.id);
          setGenerationJob(updatedJob);
          
          if (updatedJob.status === 'completed' && updatedJob.resultVideoId) {
            clearInterval(interval);
            const videoMetadata = await avatarService.getVideoMetadata(updatedJob.resultVideoId);
            setGeneratedVideo(videoMetadata);
            
            if (onVideoGenerated) {
              onVideoGenerated(videoMetadata);
            }
            
            setIsGenerating(false);
          } else if (updatedJob.status === 'failed') {
            clearInterval(interval);
            setError(`Video generation failed: ${updatedJob.errorMessage || 'Unknown error'}`);
            setIsGenerating(false);
          }
        } catch (err) {
          console.error('Error checking job status:', err);
          // Don't stop polling on error, just log it
        }
      }, 3000); // Poll every 3 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [generationJob, onVideoGenerated]);
  
  // Generate video
  const handleGenerateVideo = async () => {
    if (!selectedAvatarId) {
      setError('Please select an avatar');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const settings: AvatarGenerationSettings = {
        avatarId: selectedAvatarId,
        emotion,
        speakingStyle,
        backgroundType,
        quality,
        aspectRatio,
        showCaptions,
        captionsPosition: 'bottom',
        captionsSize: 'medium',
        speedMultiplier,
        visualAids
      };
      
      const job = await avatarService.generateVideo(script.id, settings);
      setGenerationJob(job);
      
      // In a real implementation, we would poll for job status
      // For demo purposes, we'll simulate a completed job after a delay
      setTimeout(() => {
        const mockVideo: AvatarVideoMetadata = {
          id: `video_${Date.now()}`,
          title: script.title,
          description: `Generated from script: ${script.title}`,
          durationSeconds: script.estimatedDurationSeconds,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: script.category,
          targetAudience: script.targetAudience,
          tags: [],
          thumbnailUrl: '/assets/avatars/thumbnail.jpg',
          videoUrl: '/assets/avatars/sample_video.mp4',
          status: 'ready',
          accessibilityFeatures: {
            hasCaptions: showCaptions,
            hasTranscript: true,
            hasAudioDescription: false,
            hasSignLanguage: false
          }
        };
        
        setGeneratedVideo(mockVideo);
        
        if (onVideoGenerated) {
          onVideoGenerated(mockVideo);
        }
        
        setIsGenerating(false);
        setActiveTab('preview');
      }, 5000);
    } catch (err) {
      console.error('Error generating video:', err);
      setError('Failed to generate video. Please try again.');
      setIsGenerating(false);
    }
  };
  
  // Get available emotions for selected avatar
  const getAvailableEmotions = () => {
    const selectedAvatar = avatarModels.find(model => model.id === selectedAvatarId);
    return selectedAvatar?.supportedEmotions || Object.values(AvatarEmotion);
  };
  
  // Get available speaking styles for selected avatar
  const getAvailableSpeakingStyles = () => {
    const selectedAvatar = avatarModels.find(model => model.id === selectedAvatarId);
    return selectedAvatar?.supportedSpeakingStyles || Object.values(AvatarSpeakingStyle);
  };
  
  // Get available background types for selected avatar
  const getAvailableBackgroundTypes = () => {
    const selectedAvatar = avatarModels.find(model => model.id === selectedAvatarId);
    return selectedAvatar?.supportedBackgrounds || Object.values(AvatarBackgroundType);
  };
  
  // Format enum for display
  const formatEnum = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  return (
    <div className="video-generator">
      <Card>
        <CardHeader>
          <CardTitle>Generate Avatar Video</CardTitle>
          <CardDescription>
            Configure and generate an AI avatar video from your script
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="script" className="space-y-4 pt-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">{script.title}</h3>
                
                <div className="mb-4">
                  <Badge className="mr-2">{formatEnum(script.category)}</Badge>
                  {script.targetAudience.map(audience => (
                    <Badge key={audience} variant="outline" className="mr-2">
                      {formatEnum(audience)}
                    </Badge>
                  ))}
                </div>
                
                <div className="prose max-w-none">
                  <p>{script.content}</p>
                </div>
                
                {script.notes && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Production Notes:</h4>
                    <p className="text-muted-foreground">{script.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex items-centre text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Estimated duration: {Math.floor(script.estimatedDurationSeconds / 60)}:
                    {(script.estimatedDurationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="avatar" className="block font-medium">
                    Avatar
                  </label>
                  <Select 
                    value={selectedAvatarId} 
                    onValueChange={setSelectedAvatarId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an avatar" />
                    </SelectTrigger>
                    <SelectContent>
                      {avatarModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} - {model.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="emotion" className="block font-medium">
                    Emotion
                  </label>
                  <Select 
                    value={emotion} 
                    onValueChange={(value) => setEmotion(value as AvatarEmotion)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableEmotions().map(emotion => (
                        <SelectItem key={emotion} value={emotion}>
                          {formatEnum(emotion)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="speakingStyle" className="block font-medium">
                    Speaking Style
                  </label>
                  <Select 
                    value={speakingStyle} 
                    onValueChange={(value) => setSpeakingStyle(value as AvatarSpeakingStyle)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speaking style" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSpeakingStyles().map(style => (
                        <SelectItem key={style} value={style}>
                          {formatEnum(style)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="backgroundType" className="block font-medium">
                    Background
                  </label>
                  <Select 
                    value={backgroundType} 
                    onValueChange={(value) => setBackgroundType(value as AvatarBackgroundType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select background" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableBackgroundTypes().map(type => (
                        <SelectItem key={type} value={type}>
                          {formatEnum(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="quality" className="block font-medium">
                    Video Quality
                  </label>
                  <Select 
                    value={quality} 
                    onValueChange={(value) => setQuality(value as VideoQuality)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VideoQuality.LOW}>Low (480p)</SelectItem>
                      <SelectItem value={VideoQuality.MEDIUM}>Medium (720p)</SelectItem>
                      <SelectItem value={VideoQuality.HIGH}>High (1080p)</SelectItem>
                      <SelectItem value={VideoQuality.ULTRA}>Ultra (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="aspectRatio" className="block font-medium">
                    Aspect Ratio
                  </label>
                  <Select 
                    value={aspectRatio} 
                    onValueChange={(value) => setAspectRatio(value as VideoAspectRatio)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VideoAspectRatio.STANDARD}>Standard (4:3)</SelectItem>
                      <SelectItem value={VideoAspectRatio.WIDESCREEN}>Widescreen (16:9)</SelectItem>
                      <SelectItem value={VideoAspectRatio.SQUARE}>Square (1:1)</SelectItem>
                      <SelectItem value={VideoAspectRatio.VERTICAL}>Vertical (9:16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Accessibility Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-centre space-x-2">
                    <input
                      type="checkbox"
                      id="showCaptions"
                      checked={showCaptions}
                      onChange={(e) => setShowCaptions(e.target.checked)}
                      className="h-4 w-4 rounded border-grey-300"
                    />
                    <label htmlFor="showCaptions">
                      Show Captions
                    </label>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <input
                      type="checkbox"
                      id="visualAids"
                      checked={visualAids}
                      onChange={(e) => setVisualAids(e.target.checked)}
                      className="h-4 w-4 rounded border-grey-300"
                    />
                    <label htmlFor="visualAids">
                      Include Visual Aids
                    </label>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <label htmlFor="speedMultiplier" className="block font-medium">
                      Speaking Speed: {speedMultiplier}x
                    </label>
                    <input
                      type="range"
                      id="speedMultiplier"
                      min="0.75"
                      max="1.5"
                      step="0.05"
                      value={speedMultiplier}
                      onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slower (0.75x)</span>
                      <span>Normal (1.0x)</span>
                      <span>Faster (1.5x)</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="pt-4">
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-md flex items-centre justify-centre">
                    <div className="text-centre">
                      <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Video preview would appear here
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Play className="h-4 w-4 mr-2" />
                        Play Video
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-centre">
                    <div>
                      <h3 className="font-medium">{generatedVideo.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(generatedVideo.durationSeconds / 60)}:
                        {(generatedVideo.durationSeconds % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Accessibility Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedVideo.accessibilityFeatures.hasCaptions && (
                        <Badge variant="outline">Captions</Badge>
                      )}
                      {generatedVideo.accessibilityFeatures.hasTranscript && (
                        <Badge variant="outline">Transcript</Badge>
                      )}
                      {generatedVideo.accessibilityFeatures.hasAudioDescription && (
                        <Badge variant="outline">Audio Description</Badge>
                      )}
                      {generatedVideo.accessibilityFeatures.hasSignLanguage && (
                        <Badge variant="outline">Sign Language</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-centre justify-centre p-12">
                  <div className="mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Generating Video</h3>
                  <p className="text-muted-foreground text-centre mb-6">
                    Please wait while we generate your avatar video. This may take a few minutes.
                  </p>
                  
                  {generationJob && (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Progress</span>
                        <span>{generationJob.progress}%</span>
                      </div>
                      <Progress value={generationJob.progress} className="h-2" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-centre justify-centre p-12 border rounded-lg bg-muted/50">
                  <Film className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Video Generated Yet</h3>
                  <p className="text-muted-foreground text-centre mb-6">
                    Configure your avatar settings and generate a video to preview it here.
                  </p>
                  <Button onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab(activeTab === 'settings' ? 'script' : 'settings')}
          >
            {activeTab === 'settings' ? 'View Script' : 'Edit Settings'}
          </Button>
          
          <Button 
            onClick={handleGenerateVideo} 
            disabled={isGenerating || !selectedAvatarId}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoGenerator;
