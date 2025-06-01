import React, { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';

interface AvatarVideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  autoPlay?: boolean;
  controls?: boolean;
  onComplete?: () => void;
  className?: string;
  avatarId?: string;
  ageGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard';
}

const AvatarVideoPlayer: React.FC<AvatarVideoPlayerProps> = ({
  videoId,
  title,
  description,
  autoPlay = false,
  controls = true,
  onComplete,
  className = '',
  avatarId = 'default',
  ageGroup = 'standard'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'explaining' | 'concerned'>('neutral');
  const [transcript, setTranscript] = useState<string>('');
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulated script data - in production this would come from an API
  const [scriptData, setScriptData] = useState<{
    audioUrl: string;
    transcript: string;
    duration: number;
    emotionMarkers: {time: number, emotion: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'concerned'}[];
  } | null>(null);

  // Load video data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to get video data
    setTimeout(() => {
      // Mock data - in production this would come from an API
      const mockScriptData = {
        audioUrl: `/audio/${videoId}.mp3`,
        transcript: "Welcome to EdPsych Connect! I'm your guide to this comprehensive platform designed by educational psychologists. Let me show you how to navigate through our personalized learning experiences tailored for all students. Whether you're a student looking for support with your unique learning style, or an educator seeking evidence-based resources, I'm here to help you find exactly what you need.",
        duration: 30, // seconds
        emotionMarkers: [
          {time: 0, emotion: 'neutral'},
          {time: 5, emotion: 'happy'},
          {time: 10, emotion: 'explaining'},
          {time: 15, emotion: 'thinking'},
          {time: 20, emotion: 'explaining'},
          {time: 25, emotion: 'happy'}
        ]
      };
      
      setScriptData(mockScriptData);
      setDuration(mockScriptData.duration);
      setTranscript(mockScriptData.transcript);
      setIsLoading(false);
      
      // Initialize audio element
      if (audioRef.current) {
        audioRef.current.src = mockScriptData.audioUrl;
        audioRef.current.load();
      }
    }, 1000);
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [videoId]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  // Play video
  const playVideo = () => {
    if (audioRef.current && scriptData) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsSpeaking(true);
          
          // Update progress
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          
          progressInterval.current = setInterval(() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              
              // Update emotion based on current time
              const currentTimeInSeconds = audioRef.current.currentTime;
              const currentEmotionMarker = scriptData.emotionMarkers
                .slice()
                .reverse()
                .find(marker => marker.time <= currentTimeInSeconds);
                
              if (currentEmotionMarker) {
                setCurrentEmotion(currentEmotionMarker.emotion);
              }
            }
          }, 100);
        })
        .catch(err => {
          setError(`Error playing audio: ${err.message}`);
        });
    }
  };

  // Pause video
  const pauseVideo = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsSpeaking(false);
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      
      // Update emotion based on seek time
      if (scriptData) {
        const currentEmotionMarker = scriptData.emotionMarkers
          .slice()
          .reverse()
          .find(marker => marker.time <= seekTime);
          
        if (currentEmotionMarker) {
          setCurrentEmotion(currentEmotionMarker.emotion);
        }
      }
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    setCurrentTime(0);
    
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle transcript visibility
  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  // Determine player styling based on age group
  const getPlayerStyle = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'bg-purple-100 rounded-3xl p-6 shadow-lg border-4 border-purple-300',
          controls: 'bg-purple-200 rounded-2xl p-4',
          button: 'bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3',
          progressBar: 'accent-purple-500',
          text: 'text-purple-800'
        };
      case 'early-primary':
        return {
          container: 'bg-blue-100 rounded-2xl p-5 shadow-md border-3 border-blue-300',
          controls: 'bg-blue-200 rounded-xl p-3',
          button: 'bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2',
          progressBar: 'accent-blue-500',
          text: 'text-blue-800'
        };
      case 'late-primary':
        return {
          container: 'bg-teal-100 rounded-xl p-4 shadow-sm border-2 border-teal-300',
          controls: 'bg-teal-200 rounded-lg p-3',
          button: 'bg-teal-500 hover:bg-teal-600 text-white rounded-lg p-2',
          progressBar: 'accent-teal-500',
          text: 'text-teal-800'
        };
      case 'secondary':
        return {
          container: 'bg-indigo-50 rounded-lg p-4 shadow-sm border border-indigo-200',
          controls: 'bg-indigo-100 rounded-md p-2',
          button: 'bg-indigo-500 hover:bg-indigo-600 text-white rounded-md p-2',
          progressBar: 'accent-indigo-500',
          text: 'text-indigo-800'
        };
      default:
        return {
          container: 'bg-gray-100 rounded-lg p-4 shadow-sm border border-gray-200',
          controls: 'bg-gray-200 rounded-md p-2',
          button: 'bg-primary hover:bg-primary-dark text-white rounded-md p-2',
          progressBar: 'accent-primary',
          text: 'text-gray-800'
        };
    }
  };

  const playerStyle = getPlayerStyle();

  // Loading state
  if (isLoading) {
    return (
      <div className={`${playerStyle.container} ${className} animate-pulse`}>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}>
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className={`${playerStyle.container} ${className}`}>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      />
      
      {/* Title */}
      <h3 className={`text-xl font-semibold mb-4 ${playerStyle.text}`}>{title}</h3>
      
      {/* Avatar and description */}
      <div className="flex flex-col md:flex-row items-center mb-4">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <Avatar 
            avatarId={avatarId}
            speaking={isSpeaking}
            emotion={currentEmotion}
            size="large"
            ageGroup={ageGroup}
          />
        </div>
        
        <div>
          {description && <p className={`mb-4 ${playerStyle.text}`}>{description}</p>}
        </div>
      </div>
      
      {/* Controls */}
      {controls && (
        <div className={`${playerStyle.controls} mt-4`}>
          {/* Play/Pause button */}
          <button 
            onClick={togglePlayPause}
            className={`${playerStyle.button} mr-4`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Progress bar */}
          <div className="flex items-center flex-grow">
            <span className="mr-2 text-sm">{formatTime(currentTime)}</span>
            <input 
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className={`w-full h-2 ${playerStyle.progressBar} rounded-lg appearance-none cursor-pointer`}
            />
            <span className="ml-2 text-sm">{formatTime(duration)}</span>
          </div>
          
          {/* Transcript toggle button */}
          <button 
            onClick={toggleTranscript}
            className={`${playerStyle.button} ml-4`}
            aria-label={showTranscript ? 'Hide transcript' : 'Show transcript'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Transcript */}
      {showTranscript && (
        <div className={`mt-4 p-4 bg-white rounded-lg border ${playerStyle.text} text-sm`}>
          <h4 className="font-semibold mb-2">Transcript:</h4>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AvatarVideoPlayer;
