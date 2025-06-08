'use client';

// Avatar Video Player Component for EdPsych Connect Platform
// Integrates with HeyGen API for interactive avatar videos

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface AvatarVideoPlayerProps {
  avatarId: string;
  videoScript: string;
  context: 'homepage' | 'dashboard' | 'feature' | 'help' | 'navigation';
  userRole: 'student' | 'teacher' | 'parent' | 'professional' | 'admin';
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  responsive?: boolean;
}

interface AvatarCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  expertise: string[];
  tone: string;
  appearance: {
    gender: string;
    age: string;
    style: string;
  };
}

// Avatar character definitions based on Dr. Scott's video scripts
const AVATAR_CHARACTERS: Record<string, AvatarCharacter> = {
  'dr-scott': {
    id: 'dr-scott',
    name: 'Dr. Scott I-Patrick',
    role: 'Managing Director & Educational Psychologist',
    description: 'DEdPsych, BSc, CPsychol, MBPsS - Chartered Child and Adolescent Psychologist',
    expertise: ['Educational Psychology', 'Restorative Justice', 'Evidence-Based Practice', 'Clinical Assessment'],
    tone: 'Professional, authoritative, warm, research-grounded',
    appearance: {
      gender: 'male',
      age: 'middle-aged',
      style: 'professional'
    }
  },
  'leila': {
    id: 'leila',
    name: 'Leila',
    role: 'Student Guide',
    description: 'Enthusiastic guide for young learners and student empowerment',
    expertise: ['Student Engagement', 'Learning Motivation', 'Peer Collaboration', 'Youth Leadership'],
    tone: 'Excited, enthusiastic, supportive, age-appropriate',
    appearance: {
      gender: 'female',
      age: 'young-adult',
      style: 'friendly'
    }
  },
  'professor-maya': {
    id: 'professor-maya',
    name: 'Professor Maya',
    role: 'Educator Guide',
    description: 'Professional development and teaching excellence specialist',
    expertise: ['Curriculum Planning', 'Professional Development', 'Teaching Excellence', 'Educational Innovation'],
    tone: 'Collegial, professional, respectful, inspiring',
    appearance: {
      gender: 'female',
      age: 'middle-aged',
      style: 'academic'
    }
  },
  'sarah': {
    id: 'sarah',
    name: 'Sarah',
    role: 'Parent Guide',
    description: 'Family engagement and parent support specialist',
    expertise: ['Family Engagement', 'Home-School Communication', 'Parent Support', 'Child Development'],
    tone: 'Warm, understanding, empathetic, family-focused',
    appearance: {
      gender: 'female',
      age: 'adult',
      style: 'approachable'
    }
  },
  'alex': {
    id: 'alex',
    name: 'Alex',
    role: 'Accessibility Guide',
    description: 'Inclusive design and accessibility specialist',
    expertise: ['Accessibility Features', 'Inclusive Design', 'Assistive Technology', 'Universal Access'],
    tone: 'Inclusive, supportive, empowering, patient',
    appearance: {
      gender: 'non-binary',
      age: 'young-adult',
      style: 'modern'
    }
  },
  'maria': {
    id: 'maria',
    name: 'Maria',
    role: 'Global Guide',
    description: 'Multilingual and cultural diversity specialist',
    expertise: ['Multilingual Support', 'Cultural Diversity', 'Global Perspectives', 'Language Learning'],
    tone: 'Culturally inclusive, warm, globally-minded',
    appearance: {
      gender: 'female',
      age: 'adult',
      style: 'international'
    }
  },
  'jamal': {
    id: 'jamal',
    name: 'Jamal',
    role: 'Collaboration Guide',
    description: 'Peer learning and collaboration specialist',
    expertise: ['Peer Learning', 'Team Collaboration', 'Social Learning', 'Community Building'],
    tone: 'Friendly, collaborative, community-focused',
    appearance: {
      gender: 'male',
      age: 'young-adult',
      style: 'collaborative'
    }
  }
};

// Context-based avatar selection logic
const getContextualAvatar = (context: string, userRole: string): string => {
  switch (context) {
    case 'homepage':
    case 'security':
    case 'research':
    case 'professional':
      return 'dr-scott';
    
    case 'dashboard':
      switch (userRole) {
        case 'student': return 'leila';
        case 'teacher': return 'professor-maya';
        case 'parent': return 'sarah';
        case 'professional': return 'dr-scott';
        default: return 'dr-scott';
      }
    
    case 'accessibility':
    case 'voice-input':
    case 'sen-support':
      return 'alex';
    
    case 'family':
    case 'communication':
      return 'sarah';
    
    case 'curriculum':
    case 'assessment':
    case 'cpd':
      return 'professor-maya';
    
    case 'collaboration':
    case 'peer-learning':
      return 'jamal';
    
    case 'multilingual':
    case 'cultural':
      return 'maria';
    
    case 'student-voice':
    case 'gamification':
      return 'leila';
    
    default:
      return 'dr-scott';
  }
};

export const AvatarVideoPlayer: React.FC<AvatarVideoPlayerProps> = ({
  avatarId,
  videoScript,
  context,
  userRole,
  className = '',
  autoPlay = false,
  showControls = true,
  responsive = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which avatar to use based on context
  const selectedAvatarId = avatarId || getContextualAvatar(context, userRole);
  const avatar = AVATAR_CHARACTERS[selectedAvatarId] || AVATAR_CHARACTERS['dr-scott'];

  // HeyGen API integration for avatar video generation
  useEffect(() => {
    const generateAvatarVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // HeyGen API configuration
        const heygenConfig = {
          avatar_id: selectedAvatarId,
          script: videoScript,
          voice_settings: {
            voice_id: avatar.id === 'dr-scott' ? 'professional_male_uk' : 'default',
            speed: 1.0,
            emotion: 'friendly'
          },
          video_settings: {
            quality: 'high',
            background: 'transparent',
            format: 'mp4'
          }
        };

        // Note: In production, this would call the actual HeyGen API
        // For now, we'll simulate the API response
        const mockVideoUrl = `/api/avatar-videos/${selectedAvatarId}/${context}`;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setVideoUrl(mockVideoUrl);
        setIsLoading(false);

        if (autoPlay) {
          setTimeout(() => {
            handlePlay();
          }, 500);
        }

      } catch (err) {
        setError('Failed to generate avatar video');
        setIsLoading(false);
        console.error('Avatar video generation error:', err);
      }
    };

    if (videoScript) {
      generateAvatarVideo();
    }
  }, [selectedAvatarId, videoScript, context, autoPlay]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  if (isLoading) {
    return (
      <div className={`avatar-video-player loading ${className}`}>
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating {avatar.name} video...</p>
            <p className="text-sm text-gray-500 mt-2">{avatar.description}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`avatar-video-player error ${className}`}>
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️ Video Generation Error</div>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`avatar-video-player ${responsive ? 'responsive' : ''} ${className}`}
    >
      {/* Avatar Information Header */}
      <div className="avatar-info mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {avatar.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">{avatar.name}</h3>
            <p className="text-sm text-blue-700">{avatar.role}</p>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="video-container relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto"
          poster={`/images/avatars/${selectedAvatarId}-poster.jpg`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={videoUrl || ''} type="video/mp4" />
          <track kind="captions" src={`/captions/${selectedAvatarId}-${context}.vtt`} srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls */}
        {showControls && (
          <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <button
                  onClick={handleMute}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Expertise Tags */}
      <div className="avatar-expertise mt-3">
        <div className="flex flex-wrap gap-2">
          {avatar.expertise.slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="accessibility-info mt-2 text-xs text-gray-600">
        <p>🎧 Audio descriptions available • 📝 Captions included • ⌨️ Keyboard accessible</p>
      </div>
    </div>
  );
};

export default AvatarVideoPlayer;