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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog as Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertCircle, 
  CheckCircle, 
  Film, 
  Loader2, 
  Play, 
  Plus, 
  Settings, 
  Video 
} from 'lucide-react';
import { 
  AvatarVideoMetadata, 
  AvatarIntegrationPoint,
  ContentCategory,
  TargetAudience
} from '@/lib/avatar/types';
import { AvatarService } from '@/lib/avatar/avatarService';
import VideoLibrary from './video-library';
import VideoPlayer from './video-player';

interface AvatarVideoIntegrationProps {
  componentId: string;
  componentType: 'lesson' | 'assessment' | 'feedback' | 'dashboard' | 'profile' | 'help';
  position: 'intro' | 'main' | 'summary' | 'feedback' | 'help' | 'custom';
  className?: string;
}

export const AvatarVideoIntegration: React.FC<AvatarVideoIntegrationProps> = ({
  componentId,
  componentType,
  position,
  className = ''
}) => {
  const [integrationPoint, setIntegrationPoint] = useState<AvatarIntegrationPoint | null>(null);
  const [video, setVideo] = useState<AvatarVideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  const avatarService = new AvatarService();
  
  // Fetch integration point and video on component mount
  useEffect(() => {
    const fetchIntegrationPoint = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockIntegrationPoint: AvatarIntegrationPoint = {
          id: `integration_${componentId}_${position}`,
          componentId,
          componentType,
          position,
          videoId: position === 'intro' ? 'video1' : position === 'summary' ? 'video2' : undefined,
          scriptTemplate: position === 'feedback' ? 'Well done on completing this {subject} activity! You\'ve made great progress with {skill}.' : undefined,
          dynamicVariables: position === 'feedback' ? { subject: 'mathematics', skill: 'fractions' } : undefined,
          conditions: {
            userRole: ['student', 'teacher'],
            userProgress: position === 'intro' ? 0 : position === 'summary' ? 100 : undefined
          },
          fallbackText: 'Video content is currently unavailable. Please try again later.'
        };
        
        setIntegrationPoint(mockIntegrationPoint);
        
        // If there's a video ID, fetch the video
        if (mockIntegrationPoint.videoId) {
          try {
            // In a real implementation, this would fetch from the API
            // For now, we'll use mock data
            const mockVideo: AvatarVideoMetadata = {
              id: mockIntegrationPoint.videoId,
              title: position === 'intro' ? 'Introduction to Fractions' : 'Summary of Key Concepts',
              description: `A ${position} video for ${componentType}`,
              durationSeconds: position === 'intro' ? 120 : 90,
              createdAt: new Date(),
              updatedAt: new Date(),
              category: position === 'intro' ? ContentCategory.INTRODUCTION : position === 'summary' ? ContentCategory.SUMMARY : ContentCategory.FEEDBACK,
              targetAudience: [TargetAudience.KEY_STAGE_2],
              tags: ['mathematics', 'fractions', position],
              thumbnailUrl: '/assets/thumbnails/fractions_intro.jpg',
              videoUrl: '/assets/videos/fractions_intro.mp4',
              status: 'ready',
              accessibilityFeatures: {
                hasCaptions: true,
                hasTranscript: true,
                hasAudioDescription: false,
                hasSignLanguage: false
              }
            };
            
            setVideo(mockVideo);
          } catch (err) {
            console.error('Error fetching video:', err);
            setError('Failed to load video. Please try again.');
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching integration point:', err);
        setError('Failed to load avatar integration. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchIntegrationPoint();
  }, [componentId, componentType, position]);
  
  // Handle video selection from library
  const handleVideoSelect = (selectedVideo: AvatarVideoMetadata) => {
    setVideo(selectedVideo);
    setIsLibraryOpen(false);
    
    // In a real implementation, this would update the integration point
    if (integrationPoint) {
      const updatedIntegrationPoint: AvatarIntegrationPoint = {
        ...integrationPoint,
        videoId: selectedVideo.id
      };
      
      setIntegrationPoint(updatedIntegrationPoint);
      
      // Save the updated integration point
      // avatarService.updateIntegrationPoint(updatedIntegrationPoint)
      //   .catch(err => console.error('Error updating integration point:', err));
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`flex items-centre justify-centre p-4 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading avatar content...</span>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className={`flex items-centre p-4 text-destructive ${className}`}>
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }
  
  // Render when no video is available
  if (!video) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Avatar Video Integration</CardTitle>
          <CardDescription>
            Add an avatar video to enhance this {componentType} {position}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-centre justify-centre p-6">
          <Film className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Video Selected</h3>
          <p className="text-muted-foreground text-centre mb-6">
            Select a video from the library or create a new one to enhance this content.
          </p>
          
          <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Video className="h-4 w-4 mr-2" />
                Select Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Video Library</DialogTitle>
              </DialogHeader>
              <VideoLibrary onSelectVideo={handleVideoSelect} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }
  
  // Render when video is available
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-centre">
          <div>
            <CardTitle>{video.title}</CardTitle>
            <CardDescription>
              {video.description}
            </CardDescription>
          </div>
          
          <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Change Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Video Library</DialogTitle>
              </DialogHeader>
              <VideoLibrary onSelectVideo={handleVideoSelect} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <VideoPlayer video={video} />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, '0')} • {video.accessibilityFeatures.hasCaptions ? 'Captions available' : 'No captions'}
        </div>
        
        {video.accessibilityFeatures.hasTranscript && (
          <Button variant="link" size="sm">
            View Transcript
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AvatarVideoIntegration;
