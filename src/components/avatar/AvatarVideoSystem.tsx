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

// Dr. Scott's Avatar Video Scripts
const AVATAR_SCRIPTS: AvatarVideoScript[] = [
  {
    id: 'welcome-intro',
    title: 'Welcome to EdPsych Connect',
    description: 'Dr. Scott introduces the platform and its capabilities',
    videoUrl: '/videos/avatars/dr-scott-welcome.mp4',
    audioUrl: '/audio/avatars/dr-scott-welcome.mp3',
    script: `Hello! I'm Dr. Scott I-Patrick, and I'm delighted to welcome you to EdPsych Connect. This platform represents the future of educational psychology support, bringing together cutting-edge AI technology with evidence-based practices to support students, educators, parents, and professionals. Whether you're here to access personalized learning paths, explore assessment tools, or connect with our community, I'm here to guide you every step of the way. Let's begin this journey together!`,
    duration: 45,
    category: 'welcome'
  },
  {
    id: 'navigation-guide',
    title: 'Platform Navigation Guide',
    description: 'How to navigate through the EdPsych Connect platform',
    videoUrl: '/videos/avatars/dr-scott-navigation.mp4',
    audioUrl: '/audio/avatars/dr-scott-navigation.mp3',
    script: `Let me show you how to navigate EdPsych Connect effectively. The main navigation menu provides access to all our key features. Students can access their personalized dashboard, learning paths, and assessment tools. Educators will find classroom management tools, professional development resources, and collaboration features. Parents can track their child's progress and access support resources. Use the search function to quickly find specific tools or information. Remember, I'm always here to help if you need guidance!`,
    duration: 60,
    category: 'navigation'
  },
  {
    id: 'student-dashboard',
    title: 'Student Dashboard Overview',
    description: 'Introduction to the student dashboard features',
    videoUrl: '/videos/avatars/dr-scott-student-dashboard.mp4',
    audioUrl: '/audio/avatars/dr-scott-student-dashboard.mp3',
    script: `Welcome to your student dashboard! This is your personalized learning hub where you can track your progress, access your learning paths, and manage your educational journey. Here you'll find your current assessments, upcoming tasks, achievement badges, and progress reports. The dashboard adapts to your learning style and provides recommendations for your next steps. You can also access your portfolio, connect with peers, and communicate with your teachers and parents. Everything is designed to support your success!`,
    duration: 50,
    category: 'feature',
    page: '/student/dashboard'
  },
  {
    id: 'educator-tools',
    title: 'Educator Tools Suite',
    description: 'Overview of tools available for educators',
    videoUrl: '/videos/avatars/dr-scott-educator-tools.mp4',
    audioUrl: '/audio/avatars/dr-scott-educator-tools.mp3',
    script: `As an educator, you have access to a comprehensive suite of tools designed to enhance your teaching effectiveness. The classroom management system helps you organize students, track behavior, and manage assessments. Our lesson planning tools integrate with curriculum standards and provide evidence-based strategies. You can create custom assessments, generate reports, and collaborate with colleagues. The professional development section offers CPD tracking and the latest research insights. Everything is designed to support your professional growth and student success.`,
    duration: 65,
    category: 'feature',
    page: '/educator/dashboard'
  },
  {
    id: 'assessment-tools',
    title: 'Assessment and Evaluation Tools',
    description: 'Guide to assessment features and capabilities',
    videoUrl: '/videos/avatars/dr-scott-assessments.mp4',
    audioUrl: '/audio/avatars/dr-scott-assessments.mp3',
    script: `Our assessment tools are built on the latest educational psychology research. You can create formative and summative assessments, conduct learning style evaluations, and perform comprehensive educational assessments. The system provides detailed analytics, identifies learning gaps, and suggests targeted interventions. For students with special educational needs, we offer specialized assessment protocols. All assessments are designed to be inclusive, accessible, and provide actionable insights for improving learning outcomes.`,
    duration: 55,
    category: 'feature',
    page: '/assessments'
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Learning Features',
    description: 'Introduction to AI capabilities and benefits',
    videoUrl: '/videos/avatars/dr-scott-ai-features.mp4',
    audioUrl: '/audio/avatars/dr-scott-ai-features.mp3',
    script: `EdPsych Connect harnesses the power of artificial intelligence to personalize your learning experience. Our AI analyzes your learning patterns, identifies your strengths and areas for growth, and adapts content to your individual needs. The system provides intelligent tutoring, automated feedback, and predictive analytics to support your success. For educators, AI assists with lesson planning, assessment creation, and intervention recommendations. Everything is designed to augment human expertise, not replace it, ensuring the best possible outcomes for all learners.`,
    duration: 60,
    category: 'feature'
  }
];

interface AvatarVideoPlayerProps {
  scriptId?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export function AvatarVideoPlayer({
  scriptId = 'welcome-intro',
  autoPlay = false,
  showControls = true,
  className = ''
}: AvatarVideoPlayerProps) {
  const [currentScript, setCurrentScript] = useState<AvatarVideoScript | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [useAudio, setUseAudio] = useState(false);

  useEffect(() => {
    const script = AVATAR_SCRIPTS.find(s => s.id === scriptId) || AVATAR_SCRIPTS[0];
    setCurrentScript(script);
  }, [scriptId]);

  const handleVideoError = () => {
    console.log('Video failed to load, showing fallback');
    setShowFallback(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const toggleAudioMode = () => {
    setUseAudio(!useAudio);
    setIsPlaying(false);
  };

  if (!currentScript) {
    return (
      <Card className={`bg-gray-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Loading avatar content...</p>
        </CardContent>
      </Card>
    );
  }

  // Fallback content when video/audio is not available
  if (showFallback || (!currentScript.videoUrl && !currentScript.audioUrl)) {
    return (
      <Card className={className}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
              <AvatarFallback className="bg-white text-blue-600 font-bold">DS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{currentScript.title}</CardTitle>
              <p className="text-blue-100 text-sm">{currentScript.description}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <Badge variant="secondary" className="mb-3">
              Dr. Scott's Message
            </Badge>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentScript.script}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Category: {currentScript.category}</span>
            {currentScript.duration && (
              <span>Duration: {currentScript.duration}s</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
              <AvatarFallback className="bg-white text-blue-600 font-bold">DS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{currentScript.title}</CardTitle>
              <p className="text-blue-100 text-sm">{currentScript.description}</p>
            </div>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {useAudio ? 'Audio' : 'Video'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudioMode}
                className="text-white hover:bg-white/20"
              >
                {useAudio ? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {useAudio && currentScript.audioUrl ? (
          <div className="p-6">
            <AudioPlayer
              src={currentScript.audioUrl}
              title={`Audio: ${currentScript.title}`}
              autoPlay={autoPlay}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
            />
          </div>
        ) : currentScript.videoUrl ? (
          <VideoPlayer
            src={currentScript.videoUrl}
            autoPlay={autoPlay}
            controls={showControls}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Media content is being prepared. Here's Dr. Scott's message:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentScript.script}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for selecting and playing different avatar scripts
export function AvatarScriptSelector({ 
  onScriptSelect,
  currentScriptId,
  className = '' 
}: {
  onScriptSelect: (scriptId: string) => void;
  currentScriptId?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Dr. Scott's Video Library</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          {AVATAR_SCRIPTS.map((script) => (
            <Button
              key={script.id}
              variant={currentScriptId === script.id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => onScriptSelect(script.id)}
            >
              <div>
                <div className="font-medium">{script.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {script.description}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {script.category}
                  </Badge>
                  {script.duration && (
                    <span className="text-xs text-gray-500">
                      {script.duration}s
                    </span>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { AVATAR_SCRIPTS };

