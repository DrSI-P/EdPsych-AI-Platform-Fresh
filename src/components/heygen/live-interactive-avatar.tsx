'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  Send, 
  User, 
  GraduationCap, 
  Users, 
  Heart,
  Sparkles,
  BookOpen,
  Brain,
  Shield,
  Minimize2,
  Maximize2,
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import VoiceControls from '@/components/voice/voice-controls';

interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  userRole?: string;
}

interface UserRole {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const USER_ROLES: UserRole[] = [
  { 
    id: 'student', 
    label: 'Student', 
    icon: GraduationCap, 
    color: 'bg-blue-500',
    description: 'Learning support and academic guidance'
  },
  { 
    id: 'teacher', 
    label: 'Teacher', 
    icon: BookOpen, 
    color: 'bg-green-500',
    description: 'Classroom strategies and professional development'
  },
  { 
    id: 'parent', 
    label: 'Parent', 
    icon: Heart, 
    color: 'bg-pink-500',
    description: 'Home support and advocacy guidance'
  },
  { 
    id: 'professional', 
    label: 'Professional', 
    icon: Brain, 
    color: 'bg-purple-500',
    description: 'Expert consultation and research insights'
  }
];

interface LiveInteractiveAvatarProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function LiveInteractiveAvatar({ 
  isMinimized = false, 
  onToggleMinimize, 
  onClose,
  className = ""
}: LiveInteractiveAvatarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'demo' | 'error'>('checking');
  const [streamingSession, setStreamingSession] = useState<any>(null);

  // Check HeyGen API status on component mount
  useEffect(() => {
    checkHeyGenAPIStatus();
  }, []);

  const checkHeyGenAPIStatus = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      
      if (!apiKey || apiKey === 'your_heygen_api_key_here') {
        setApiStatus('demo');
        return;
      }

      // Test API connection
      const response = await fetch('/api/heygen/streaming/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          avatar_id: 'default_avatar_id', // This will be replaced with Dr. Scott's avatar ID
          voice_id: 'default_voice_id'
        })
      });

      if (response.ok) {
        setApiStatus('connected');
        const sessionData = await response.json();
        setStreamingSession(sessionData);
      } else {
        setApiStatus('demo');
      }
    } catch (error) {
      console.error('HeyGen API check failed:', error);
      setApiStatus('demo');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      userRole: selectedRole
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate avatar response (replace with actual HeyGen streaming when avatar video is uploaded)
      setTimeout(() => {
        const avatarResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'avatar',
          content: getAvatarResponse(inputMessage, selectedRole),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, avatarResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const getAvatarResponse = (message: string, role: string): string => {
    // This will be replaced with actual HeyGen streaming responses
    const responses = {
      student: "As your Educational Psychologist, I understand the challenges you're facing. Let me help you develop strategies that work for your unique learning style.",
      teacher: "That's an excellent question from an educator's perspective. Based on my 20+ years in education, here's what I recommend...",
      parent: "I completely understand your concerns as a parent. Let's work together to support your child's educational journey.",
      professional: "From a professional standpoint, this aligns with current research in educational psychology. Let me share some evidence-based insights..."
    };
    return responses[role as keyof typeof responses] || responses.student;
  };

  const handleVoiceInput = (transcript: string) => {
    setInputMessage(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={onToggleMinimize}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 h-[600px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src="/images/dr-scott-avatar.jpg" alt="Dr. Scott" />
                  <AvatarFallback className="bg-white text-blue-600 font-semibold">DS</AvatarFallback>
                </Avatar>
                {apiStatus === 'connected' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Scott I-Patrick</CardTitle>
                <p className="text-sm text-blue-100">Educational Psychologist • Interactive Avatar</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* API Status */}
          <div className="mt-3">
            {apiStatus === 'checking' && (
              <Alert className="bg-white/20 border-white/30 text-white">
                <Loader2 className="w-4 h-4 animate-spin" />
                <AlertDescription>Connecting to live avatar system...</AlertDescription>
              </Alert>
            )}
            {apiStatus === 'connected' && (
              <Alert className="bg-green-500/20 border-green-300 text-white">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>🎥 Live HeyGen API Connected - Ready for Dr. Scott's Avatar Video!</AlertDescription>
              </Alert>
            )}
            {apiStatus === 'demo' && (
              <Alert className="bg-yellow-500/20 border-yellow-300 text-white">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>Demo Mode - Upload avatar video to enable live responses</AlertDescription>
              </Alert>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[calc(600px-140px)]">
          {/* Role Selection */}
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">I'm here as a:</p>
            <div className="grid grid-cols-2 gap-2">
              {USER_ROLES.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Button
                    key={role.id}
                    variant={selectedRole === role.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role.id)}
                    className={`justify-start ${selectedRole === role.id ? role.color : ''}`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {role.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hello! I'm Dr. Scott I-Patrick</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Educational Psychologist with 20+ years experience. How can I help you today?
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {apiStatus === 'connected' ? '🎥 Live Video Ready' : '💬 Text Responses Active'}
                  </Badge>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">Dr. Scott is responding...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            {/* Voice Controls */}
            <div className="flex items-center justify-between mb-3">
              <VoiceControls 
                onVoiceInput={handleVoiceInput}
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  title={isVideoEnabled ? 'Disable video' : 'Enable video'}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  title={isAudioEnabled ? 'Mute audio' : 'Unmute audio'}
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Dr. Scott anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              {apiStatus === 'connected' 
                ? '🎥 Live video responses ready when avatar video is uploaded'
                : '💬 Demo mode - Upload Dr. Scott\'s avatar video for live responses'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

