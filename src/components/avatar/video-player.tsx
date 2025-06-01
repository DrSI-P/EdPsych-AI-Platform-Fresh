'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { AvatarVideoMetadata } from '@/lib/avatar/types';
import { AvatarService } from '@/lib/avatar/avatarService';

interface VideoPlayerProps {
  video: AvatarVideoMetadata;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoPlay = false,
  onEnded,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(video.accessibilityFeatures.hasCaptions);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const avatarService = new AvatarService();
  
  // Initialize video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
      
      // Record view
      avatarService.recordVideoView(
        video.id,
        'current_user', // In a real app, this would be the actual user ID
        videoElement.duration,
        true
      ).catch(err => console.error('Error recording view:', err));
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    
    // Set initial volume
    videoElement.volume = volume;
    
    // Auto play if specified
    if (autoPlay) {
      videoElement.play().catch(err => {
        console.error('Auto play failed:', err);
        setIsPlaying(false);
      });
    }
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
    };
  }, [video, autoPlay, onEnded]);
  
  // Handle play/pause
  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play().catch(err => {
        console.error('Play failed:', err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newTime = value[0];
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newVolume = value[0];
    videoElement.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isMuted) {
      videoElement.muted = false;
      setIsMuted(false);
    } else {
      videoElement.muted = true;
      setIsMuted(true);
    }
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle captions toggle
  const toggleCaptions = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // In a real implementation, this would toggle the visibility of the captions track
    setShowCaptions(!showCaptions);
    
    // For demo purposes, we'll just log this
    console.log(`Captions ${!showCaptions ? 'enabled' : 'disabled'}`);
  };
  
  // Handle skip backward
  const skipBackward = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newTime = Math.max(0, videoElement.currentTime - 10);
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Handle skip forward
  const skipForward = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newTime = Math.min(videoElement.duration, videoElement.currentTime + 10);
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };
  
  // Format time (seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div 
      id="video-container" 
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-auto rounded-lg"
        poster={video.thumbnail}
        playsInline
      >
        {video.accessibilityFeatures.hasCaptions && video.captionsUrl && (
          <track 
            kind="subtitles" 
            src={video.captionsUrl} 
            srcLang="en" 
            label="English" 
            default={showCaptions} 
          />
        )}
        Your browser does not support the video tag.
      </video>
      
      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-centre justify-centre bg-black/30">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      
      {/* Video title overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="font-medium">{video.title}</h3>
      </div>
      
      {/* Video controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white transition-opacity ${isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col space-y-2">
          {/* Progress bar */}
          <div className="flex items-centre space-x-2">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-centre justify-between">
            <div className="flex items-centre space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={skipBackward}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={skipForward}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <div className="flex items-centre space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="flex items-centre space-x-2">
              {video.accessibilityFeatures.hasCaptions && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 hover:bg-white/20 ${showCaptions ? 'text-primary' : 'text-white'}`}
                  onClick={toggleCaptions}
                >
                  <Subtitles className="h-5 w-5" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
