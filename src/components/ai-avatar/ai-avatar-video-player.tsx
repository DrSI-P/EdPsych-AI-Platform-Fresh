'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIAvatarVideoPlayer as AIAvatarVideoPlayerProps } from './types';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';

/**
 * AI Avatar Video Player Component
 * 
 * Renders a video player specifically designed for AI Avatar videos
 * with custom controls and accessibility features.
 */
export const AIAvatarVideoPlayer: React.FC<AIAvatarVideoPlayerProps> = ({
  videoId,
  autoPlay = false,
  showControls = true,
  showCaptions = true,
  onComplete,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Load video data
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        // In production, this would fetch the actual video URL from the service
        // For now, we'll use a placeholder
        setVideoUrl(`/api/ai-avatar/videos/${videoId}`);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load video:', err);
        setError(err instanceof Error ? err : new Error('Failed to load video'));
        setLoading(false);
        if (onError) onError(err instanceof Error ? err : new Error('Failed to load video'));
      }
    };
    
    loadVideo();
  }, [videoId, onError]);

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setPlaying(false);
      if (onComplete) onComplete();
    };

    const handleError = (e: Event) => {
      const error = new Error('Video playback error');
      setError(error);
      if (onError) onError(error);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
    };
  }, [onComplete, onError]);

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play().catch(err => {
          console.error('Failed to play video:', err);
          setPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  // Handle volume/mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  if (loading) {
    return (
      <div className="ai-avatar-video-player-loading">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="mt-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-avatar-video-player-error p-4 border border-red-300 bg-red-50 rounded-lg">
        <h3 className="text-red-700 font-medium">Error Loading Video</h3>
        <p className="text-red-600">{error.message}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className={`ai-avatar-video-player relative overflow-hidden rounded-lg ${fullscreen ? 'fullscreen' : ''}`}
    >
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        className="w-full aspect-video bg-black"
        playsInline
        poster={`/api/ai-avatar/thumbnails/${videoId}`}
      >
        {showCaptions && (
          <track 
            kind="captions" 
            src={`/api/ai-avatar/captions/${videoId}`} 
            label="English" 
            srcLang="en" 
            default 
          />
        )}
        Your browser does not support the video tag.
      </video>
      
      {showControls && (
        <div className="ai-avatar-video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity opacity-0 hover:opacity-100 focus-within:opacity-100">
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="progress-bar h-1 bg-grey-500 rounded-full mb-2 cursor-pointer"
            onClick={handleProgressBarClick}
          >
            <div 
              className="progress-fill h-full bg-primary rounded-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex items-centre justify-between">
            <div className="flex items-centre space-x-2">
              {/* Play/Pause button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              {/* Skip buttons */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={skipBackward}
                aria-label="Skip back 10 seconds"
              >
                <SkipBack size={20} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={skipForward}
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={20} />
              </Button>
              
              {/* Volume control */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              {/* Time display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-centre space-x-2">
              {/* Settings button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                aria-label="Settings"
              >
                <Settings size={20} />
              </Button>
              
              {/* Fullscreen button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={toggleFullscreen}
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAvatarVideoPlayer;
