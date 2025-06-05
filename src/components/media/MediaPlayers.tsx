'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function VideoPlayer({
  src,
  title,
  description,
  autoPlay = false,
  controls = true,
  className = '',
  onPlay,
  onPause,
  onEnded
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Failed to play video');
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (!isPlaying) {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setError('Failed to play video');
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">⚠️ Video Error</div>
          <p className="text-red-700">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              videoRef.current?.load();
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            muted={isMuted}
            className="w-full h-auto"
            playsInline
            preload="metadata"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">Loading video...</div>
            </div>
          )}
          
          {controls && !isLoading && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={restart}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Audio Player Component
interface AudioPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function AudioPlayer({
  src,
  title,
  autoPlay = false,
  className = '',
  onPlay,
  onPause,
  onEnded
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Failed to play audio');
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="text-red-600 mb-2">⚠️ Audio Error</div>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={src}
          autoPlay={autoPlay}
          preload="metadata"
        />
        
        {title && (
          <div className="mb-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>
          </div>
        )}
        
        {!isLoading && (
          <>
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </>
        )}
        
        {isLoading && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading audio...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

