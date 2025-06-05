'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayer, AudioPlayer } from './MediaPlayers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AvatarVideoScript {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  script: string;
  duration?: number;
  category: 'welcome' | 'navigation' | 'feature' | 'help' | 'educational';
  page?: string;
}

interface AvatarVideoPlayerProps {
  scriptId: string;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onScriptComplete?: () => void;
}

// Mock data for avatar video scripts
const avatarScripts: Record<string, AvatarVideoScript> = {
  'welcome-intro': {
    id: 'welcome-intro',
    title: 'Welcome to EdPsych Connect',
    description: 'Dr. Scott introduces the platform and its mission',
    videoUrl: '/videos/dr-scott-welcome.mp4',
    audioUrl: '/audio/dr-scott-welcome.mp3',
    script: `Hello and welcome to EdPsych Connect! I'm Dr. Scott I-Patrick, and I'm thrilled you're here. 
    This platform represents years of work to bridge the gap between educational psychology research and 
    practical application. Whether you're a student, educator, parent, or professional, you'll find 
    evidence-based tools and resources designed to support learning and development. Let's explore 
    together how we can make education more inclusive, effective, and empowering for everyone.`,
    duration: 45,
    category: 'welcome',
    page: 'meet-dr-scott'
  },
  'platform-overview': {
    id: 'platform-overview',
    title: 'Platform Overview',
    description: 'Comprehensive tour of EdPsych Connect features',
    videoUrl: '/videos/dr-scott-overview.mp4',
    audioUrl: '/audio/dr-scott-overview.mp3',
    script: `Let me give you a comprehensive overview of what EdPsych Connect offers. Our platform 
    includes student learning analytics, educator professional development tools, AI-powered assessment 
    systems, and comprehensive accessibility features. Each tool is grounded in current educational 
    psychology research and designed to support diverse learning needs. From personalized learning 
    paths to restorative justice practices, we're here to support your educational journey.`,
    duration: 60,
    category: 'feature',
    page: 'platform-overview'
  },
  'navigation-help': {
    id: 'navigation-help',
    title: 'Navigation Guide',
    description: 'How to navigate the EdPsych Connect platform',
    videoUrl: '/videos/dr-scott-navigation.mp4',
    audioUrl: '/audio/dr-scott-navigation.mp3',
    script: `Navigating EdPsych Connect is designed to be intuitive and accessible. Use the main 
    navigation menu to access different feature categories. Each section includes detailed tools 
    and resources. Don't forget to check out the accessibility features - we have voice navigation, 
    screen reader support, and customizable interfaces to meet your needs. If you ever need help, 
    just look for the help icons throughout the platform.`,
    duration: 40,
    category: 'navigation',
    page: 'help'
  }
};

export function AvatarVideoPlayer({ 
  scriptId, 
  autoPlay = false, 
  showControls = true, 
  className = '',
  onScriptComplete 
}: AvatarVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const script = avatarScripts[scriptId];

  useEffect(() => {
    if (autoPlay && script) {
      handlePlay();
    }
  }, [autoPlay, script]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    handlePlay();
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    } else if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onScriptComplete) {
      onScriptComplete();
    }
  };

  if (!script) {
    return (
      <Card className={`bg-gray-100 dark:bg-gray-800 ${className}`}>
        <CardContent className="p-6 text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
            <AvatarFallback className="bg-blue-600 text-white text-2xl">DS</AvatarFallback>
          </Avatar>
          <p className="text-gray-600 dark:text-gray-400">
            Video script not found. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
              <AvatarFallback className="bg-blue-600 text-white">DS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{script.title}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{script.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize">
            {script.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player */}
        {script.videoUrl && (
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <VideoPlayer
              ref={videoRef}
              src={script.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            
            {/* Video Overlay Controls */}
            {showControls && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                  {!isPlaying ? (
                    <Button
                      onClick={handlePlay}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
                    >
                      <Pause className="w-8 h-8" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audio Player (fallback if no video) */}
        {!script.videoUrl && script.audioUrl && (
          <AudioPlayer
            ref={audioRef}
            src={script.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            muted={isMuted}
          />
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isPlaying ? (
                <Button onClick={handlePlay} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              ) : (
                <Button onClick={handlePause} size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={handleRestart} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              
              <Button onClick={handleMute} variant="outline" size="sm">
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowTranscript(!showTranscript)}
                variant="outline"
                size="sm"
              >
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </Button>
              
              {script.duration && (
                <Badge variant="outline">
                  {Math.floor(currentTime)}s / {script.duration}s
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {showControls && script.duration && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${(currentTime / script.duration) * 100}%` }}
            />
          </div>
        )}

        {/* Transcript */}
        {showTranscript && (
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {script.script}
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

export default AvatarVideoPlayer;

