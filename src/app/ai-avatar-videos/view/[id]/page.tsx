'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComprehensiveNavigation from '@/components/navigation/comprehensive-navigation';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ArrowLeft, 
  Clock, 
  User, 
  Share2,
  Download,
  BookOpen,
  Star,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export default function VideoViewPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Dr. Scott's video data
  const videoData = {
    '973a9f4857e14071bb2e5082bb40135b': {
      title: 'FLAGSHIP INTRO VIDEO',
      description: 'Welcome to EdPsych Connect! I\'m Dr. Scott I-Patrick, and I\'m delighted to introduce you to our comprehensive educational psychology platform. In this video, I\'ll share my background, our platform\'s mission, and how we can support your educational journey.',
      duration: '4:32',
      category: 'introduction',
      transcript: 'Hello! I\'m Dr. Scott I-Patrick, DEdPsych, BSc, CPsychol, MBPSs - a Chartered Educational Psychologist and the founder of EdPsych Connect. With over 20 years of experience in education and 12 years specializing in educational psychology, I\'m here to provide you with expert guidance and support...',
      keyPoints: [
        'Introduction to Dr. Scott I-Patrick and his credentials',
        'Overview of EdPsych Connect platform capabilities',
        'Evidence-based approach to educational psychology',
        'Support for students, teachers, parents, and professionals'
      ]
    },
    '8e2d334be9d64a0da44cc126e046f2f8': {
      title: 'Dashboard Welcome - All Users',
      description: 'Learn how to navigate your personalized dashboard and make the most of the features available to you.',
      duration: '2:15',
      category: 'dashboard',
      transcript: 'Welcome to your EdPsych Connect dashboard! This is your central hub for accessing all the tools and resources...',
      keyPoints: [
        'Dashboard navigation overview',
        'Personalized features and settings',
        'Quick access to key tools',
        'Progress tracking and analytics'
      ]
    },
    'dd8cb316033c4fc2b3d84580c339d50c': {
      title: 'Professional Collaboration Space',
      description: 'Discover how to use our collaborative tools for professional development and team working.',
      duration: '3:20',
      category: 'collaboration',
      transcript: 'Professional collaboration is at the heart of effective educational practice...',
      keyPoints: [
        'Collaboration tools overview',
        'Team communication features',
        'Shared resources and planning',
        'Professional networking opportunities'
      ]
    },
    'c18d650dd74f4f3da88bff0676dd0042': {
      title: 'Getting Started Guide',
      description: 'A comprehensive step-by-step guide for new users to get the most out of the platform.',
      duration: '2:45',
      category: 'getting-started',
      transcript: 'Getting started with EdPsych Connect is straightforward and intuitive...',
      keyPoints: [
        'Account setup and profile creation',
        'Initial platform orientation',
        'Key features walkthrough',
        'First steps recommendations'
      ]
    },
    'f6598a293dc94dc7b6ebd446c01cdc34': {
      title: 'Platform Security Overview',
      description: 'Understanding our security measures and how we protect your data and privacy.',
      duration: '2:30',
      category: 'security',
      transcript: 'Security and privacy are fundamental to everything we do at EdPsych Connect...',
      keyPoints: [
        'Data protection measures',
        'Privacy policy overview',
        'User security best practices',
        'Compliance and certifications'
      ]
    },
    '9b2ac61ef7cc4d25abdbbcc2de0e45b0': {
      title: 'Assessment and Progress Tracking',
      description: 'Learn how to effectively use our assessment tools and track student progress.',
      duration: '3:45',
      category: 'assessment',
      transcript: 'Effective assessment is crucial for understanding and supporting student progress...',
      keyPoints: [
        'Assessment tool overview',
        'Progress tracking methods',
        'Data interpretation guidance',
        'Intervention planning'
      ]
    },
    '7547b35f3bfa4c189df5a121a330ecab': {
      title: 'Restorative Justice Framework',
      description: 'Explore Dr. Scott\'s doctoral research on restorative justice approaches in educational settings.',
      duration: '4:10',
      category: 'restorative-justice',
      transcript: 'Restorative justice represents a fundamental shift in how we approach conflict and behavior in schools...',
      keyPoints: [
        'Restorative justice principles',
        'Implementation in educational settings',
        'Evidence-based outcomes',
        'Practical application strategies'
      ]
    },
    '378b41b7c2cb4852ab965ede79901686': {
      title: 'Learning Analytics Dashboard',
      description: 'Understanding and interpreting learning analytics data to improve educational outcomes.',
      duration: '3:15',
      category: 'analytics',
      transcript: 'Learning analytics provide powerful insights into student learning patterns and outcomes...',
      keyPoints: [
        'Analytics dashboard overview',
        'Data interpretation skills',
        'Actionable insights identification',
        'Evidence-based decision making'
      ]
    },
    '648adb1e0fee434c9e2141438ba1ff5f': {
      title: 'Community Partnerships',
      description: 'Building effective partnerships within the educational community for better outcomes.',
      duration: '2:55',
      category: 'community',
      transcript: 'Strong community partnerships are essential for comprehensive educational support...',
      keyPoints: [
        'Partnership building strategies',
        'Community engagement approaches',
        'Collaborative planning methods',
        'Sustainable relationship development'
      ]
    },
    'eade752b5d134710b9bb18d0e4cbea8e': {
      title: 'Crisis Support and Wellbeing',
      description: 'Supporting student wellbeing and implementing effective crisis intervention strategies.',
      duration: '3:30',
      category: 'wellbeing',
      transcript: 'Student wellbeing is fundamental to effective learning and development...',
      keyPoints: [
        'Wellbeing assessment approaches',
        'Crisis intervention strategies',
        'Support system development',
        'Prevention and early intervention'
      ]
    },
    '6c21771d40fc4c24a531708fa3b21788': {
      title: 'Global Citizenship and Social Justice',
      description: 'Promoting global citizenship and social justice awareness in educational practice.',
      duration: '3:25',
      category: 'social-justice',
      transcript: 'Global citizenship and social justice are increasingly important in modern education...',
      keyPoints: [
        'Global citizenship concepts',
        'Social justice in education',
        'Inclusive practice development',
        'Cultural competency building'
      ]
    },
    '26946cb6af6242f58ddc6f0eeb455132': {
      title: 'Platform Navigation Help',
      description: 'Comprehensive guide to navigating all platform features and maximizing your experience.',
      duration: '2:40',
      category: 'help',
      transcript: 'Navigating EdPsych Connect effectively will help you access all our powerful features...',
      keyPoints: [
        'Navigation menu overview',
        'Feature location guide',
        'Search and filter functions',
        'Customization options'
      ]
    },
    'ef44f068f8c742f8adafcb97ec1c4a8f': {
      title: 'Data and Privacy Information',
      description: 'Understanding data handling, privacy policies, and your rights as a user.',
      duration: '2:20',
      category: 'privacy',
      transcript: 'Your privacy and data protection are our highest priorities...',
      keyPoints: [
        'Data collection practices',
        'Privacy policy explanation',
        'User rights and controls',
        'GDPR compliance measures'
      ]
    },
    '8efabf923abd452dbd6e1c5f982b94e1': {
      title: 'Feedback and Improvement',
      description: 'How to provide feedback and contribute to the continuous improvement of our platform.',
      duration: '2:10',
      category: 'feedback',
      transcript: 'Your feedback is invaluable in helping us improve EdPsych Connect...',
      keyPoints: [
        'Feedback submission methods',
        'Feature request process',
        'Community contribution opportunities',
        'Continuous improvement commitment'
      ]
    }
  };

  const currentVideo = videoData[videoId as keyof typeof videoData];

  useEffect(() => {
    if (!currentVideo) {
      router.push('/ai-avatar-videos');
    }
  }, [currentVideo, router]);

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ComprehensiveNavigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h1>
            <Button onClick={() => router.push('/ai-avatar-videos')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => router.push('/ai-avatar-videos')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg">
              <div className="relative aspect-video bg-gray-900">
                {/* Video Player Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isPlaying ? (
                        <Pause className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <p className="text-sm opacity-75">Dr. Scott I-Patrick Avatar Video</p>
                    <p className="text-xs opacity-50 mt-2">Video ID: {videoId}</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      onClick={togglePlay}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div className="bg-white rounded-full h-1 w-1/3"></div>
                    </div>
                    
                    <span className="text-white text-sm">{currentVideo.duration}</span>
                    
                    <Button
                      size="sm"
                      onClick={toggleMute}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Info */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{currentVideo.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Dr. Scott I-Patrick</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentVideo.duration}</span>
                      </div>
                      <Badge variant="outline">{currentVideo.category}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Like
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{currentVideo.description}</p>
                
                {/* Key Points */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Points Covered:</h3>
                  <ul className="space-y-2">
                    {currentVideo.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Transcript */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Transcript:</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{currentVideo.transcript}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Dr. Scott */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Dr. Scott</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Dr. Scott I-Patrick</h4>
                    <p className="text-sm text-gray-600">Educational Psychologist</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  DEdPsych BSc CPsychol MBPSs • HCPC: PYL042340
                </p>
                <p className="text-sm text-gray-600">
                  20+ years in education, 12+ years in educational psychology. 
                  Providing evidence-based guidance and support.
                </p>
              </CardContent>
            </Card>

            {/* Related Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">More Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(videoData)
                    .filter(([id]) => id !== videoId)
                    .slice(0, 3)
                    .map(([id, video]) => (
                      <div 
                        key={id}
                        onClick={() => router.push(`/ai-avatar-videos/view/${id}`)}
                        className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <Play className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm line-clamp-2">{video.title}</h5>
                          <p className="text-xs text-gray-600">{video.duration}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => router.push('/ai-avatar-videos')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Videos
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask Dr. Scott
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

