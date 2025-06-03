'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { getKnowledgeBase } from '@/lib/knowledge-base';
import { HeygenAPI } from '@/lib/heygen/heygen-api';

// Types for the Interactive Avatar system
export interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  videoUrl?: string;
  metadata?: {
    userRole?: string;
    confidence?: number;
    sources?: string[];
    sessionId?: string;
  };
}

export interface UserRole {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

export interface AvatarConfig {
  name: string;
  title: string;
  expertise: string[];
  avatar_id?: string;
  voice_id?: string;
}

export interface HeyGenStreamingSession {
  sessionId: string;
  status: 'initializing' | 'ready' | 'speaking' | 'listening' | 'error' | 'closed';
  avatarId: string;
  websocket?: WebSocket;
}

// User roles configuration
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

// Dr. Scott's avatar configuration
const DR_SCOTT_CONFIG: AvatarConfig = {
  name: 'Dr. Scott I-Patrick',
  title: 'Educational Psychologist • Interactive Avatar',
  expertise: [
    'Educational Psychology',
    'Restorative Justice',
    'Assessment & Evaluation',
    'Intervention Planning',
    'Special Educational Needs',
    'Inclusive Education'
  ],
  avatar_id: process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID || 'default_avatar_id',
  voice_id: process.env.NEXT_PUBLIC_HEYGEN_VOICE_ID || 'default_voice_id'
};

interface InteractiveAvatarProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  defaultRole?: string;
  showRoleSelector?: boolean;
  className?: string;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  isMinimized = false,
  onToggleMinimize,
  onClose,
  defaultRole = 'student',
  showRoleSelector = true,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [isConnected, setIsConnected] = useState(false);
  const [streamingSession, setStreamingSession] = useState<HeyGenStreamingSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [heygenApi, setHeygenApi] = useState<HeygenAPI | null>(null);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const knowledgeBase = getKnowledgeBase();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize HeyGen API and avatar session
  useEffect(() => {
    initializeHeyGenAPI();
  }, []);

  const initializeHeyGenAPI = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      
      if (!apiKey || apiKey === 'your_heygen_api_key_here') {
        console.log('HeyGen API key not configured, using demo mode');
        setUseRealAPI(false);
        initializeDemoSession();
        return;
      }

      // Initialize real HeyGen API
      const api = HeygenAPI.getInstance();
      api.initialize(apiKey);
      setHeygenApi(api);
      setUseRealAPI(true);

      // Test API connection
      try {
        await api.getAvatars();
        console.log('HeyGen API connected successfully');
        await initializeStreamingSession();
      } catch (error) {
        console.error('HeyGen API connection failed, falling back to demo mode:', error);
        setUseRealAPI(false);
        initializeDemoSession();
      }
    } catch (error) {
      console.error('Failed to initialize HeyGen API:', error);
      setUseRealAPI(false);
      initializeDemoSession();
    }
  };

  const initializeStreamingSession = async () => {
    if (!heygenApi || !useRealAPI) return;

    try {
      // Create streaming session with HeyGen
      const response = await fetch('/api/heygen/streaming/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_id: DR_SCOTT_CONFIG.avatar_id,
          voice_id: DR_SCOTT_CONFIG.voice_id,
          quality: 'high',
          avatar_style: 'normal'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create streaming session');
      }

      const sessionData = await response.json();
      
      const session: HeyGenStreamingSession = {
        sessionId: sessionData.session_id,
        status: 'initializing',
        avatarId: DR_SCOTT_CONFIG.avatar_id!
      };

      setStreamingSession(session);
      
      // Initialize WebSocket connection for real-time communication
      await initializeWebSocket(session);
      
      setIsConnected(true);
      addWelcomeMessage();
      
    } catch (error) {
      console.error('Failed to initialize streaming session:', error);
      setUseRealAPI(false);
      initializeDemoSession();
    }
  };

  const initializeWebSocket = async (session: HeyGenStreamingSession) => {
    try {
      const wsUrl = `wss://api.heygen.com/v1/streaming/${session.sessionId}`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setStreamingSession(prev => prev ? { ...prev, status: 'ready', websocket } : null);
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStreamingSession(prev => prev ? { ...prev, status: 'error' } : null);
      };

      websocket.onclose = () => {
        console.log('WebSocket closed');
        setStreamingSession(prev => prev ? { ...prev, status: 'closed' } : null);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      throw error;
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'avatar_response':
        if (data.audio_url || data.video_url) {
          const avatarMessage: Message = {
            id: `msg_${Date.now()}`,
            type: 'avatar',
            content: data.text || 'Audio/Video response',
            timestamp: new Date(),
            audioUrl: data.audio_url,
            videoUrl: data.video_url,
            metadata: {
              sessionId: streamingSession?.sessionId,
              confidence: data.confidence
            }
          };
          setMessages(prev => [...prev, avatarMessage]);
        }
        setIsTyping(false);
        break;
      
      case 'status_update':
        setStreamingSession(prev => prev ? { ...prev, status: data.status } : null);
        break;
      
      case 'error':
        console.error('Avatar error:', data.message);
        setIsTyping(false);
        break;
    }
  };

  const initializeDemoSession = () => {
    // Demo mode initialization
    const demoSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setStreamingSession({
      sessionId: demoSessionId,
      status: 'ready',
      avatarId: 'demo_avatar'
    });
    setIsConnected(true);
    addWelcomeMessage();
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'avatar',
      content: getRoleSpecificWelcome(selectedRole),
      timestamp: new Date(),
      metadata: {
        userRole: selectedRole,
        confidence: 1.0,
        sessionId: streamingSession?.sessionId
      }
    };
    setMessages([welcomeMessage]);
  };

  const getRoleSpecificWelcome = (role: string): string => {
    const welcomes = {
      student: "Hello! I'm Dr. Scott I-Patrick, and I'm here to support your learning journey. Whether you're facing challenges with schoolwork, need study strategies, or want to understand your learning style better, I'm here to help. What would you like to explore today?",
      teacher: "Welcome! As an educator, you're making such an important difference. I can help with evidence-based classroom strategies, behavior management, assessment techniques, and supporting students with diverse needs. What's on your mind?",
      parent: "Hello! Supporting your child's education is one of the most important things you can do. I can help you understand assessment results, develop home support strategies, navigate school systems, and advocate for your child's needs. How can I assist you?",
      professional: "Greetings, colleague! I'm excited to collaborate with you on supporting students and families. Whether you need consultation on complex cases, want to discuss latest research, or explore intervention strategies, I'm here to help. What would you like to discuss?"
    };
    return welcomes[role as keyof typeof welcomes] || welcomes.student;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !streamingSession) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      metadata: {
        userRole: selectedRole,
        sessionId: streamingSession.sessionId
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    if (useRealAPI && streamingSession.websocket && streamingSession.status === 'ready') {
      // Send message via WebSocket to HeyGen
      const messageData = {
        type: 'user_message',
        text: userMessage.content,
        session_id: streamingSession.sessionId,
        metadata: {
          user_role: selectedRole,
          timestamp: userMessage.timestamp.toISOString()
        }
      };

      streamingSession.websocket.send(JSON.stringify(messageData));
    } else {
      // Demo mode - use knowledge base
      setTimeout(() => {
        const response = knowledgeBase.generateResponse(userMessage.content, {
          userRole: selectedRole,
          previousTopics: messages.map(m => m.content).slice(-5),
          sessionHistory: messages.map(m => m.content)
        });

        const avatarMessage: Message = {
          id: `msg_${Date.now()}`,
          type: 'avatar',
          content: response,
          timestamp: new Date(),
          metadata: {
            userRole: selectedRole,
            confidence: 0.95,
            sessionId: streamingSession.sessionId
          }
        };

        setMessages(prev => [...prev, avatarMessage]);
        setIsTyping(false);
      }, 1500 + Math.random() * 1000);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    
    // Add role change message
    const roleChangeMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'avatar',
      content: `I've updated my responses for your role as a ${newRole}. ${getRoleSpecificWelcome(newRole)}`,
      timestamp: new Date(),
      metadata: {
        userRole: newRole,
        confidence: 1.0,
        sessionId: streamingSession?.sessionId
      }
    };
    
    setMessages(prev => [...prev, roleChangeMessage]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const startListening = () => {
    // Voice input functionality
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Card className="w-16 h-16 cursor-pointer shadow-lg border-2 border-blue-500" onClick={onToggleMinimize}>
          <CardContent className="p-0 h-full flex items-center justify-center">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/dr-scott-avatar.jpg" alt="Dr. Scott" />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                  DS
                </AvatarFallback>
              </Avatar>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 h-[600px] shadow-2xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/dr-scott-avatar.jpg" alt="Dr. Scott" />
                <AvatarFallback className="bg-white text-blue-600 font-bold">DS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">{DR_SCOTT_CONFIG.name}</CardTitle>
                <p className="text-blue-100 text-sm">{DR_SCOTT_CONFIG.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "secondary" : "destructive"} className="text-xs">
                {useRealAPI ? (isConnected ? "Live" : "Connecting...") : "Demo"}
              </Badge>
              {onToggleMinimize && (
                <Button variant="ghost" size="sm" onClick={onToggleMinimize} className="text-white hover:bg-white/20">
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[calc(600px-80px)] flex flex-col">
          {/* Role Selector */}
          {showRoleSelector && (
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">I'm here as a:</p>
              <div className="grid grid-cols-2 gap-2">
                {USER_ROLES.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoleChange(role.id)}
                      className={`justify-start ${selectedRole === role.id ? role.color + ' text-white' : ''}`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {role.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Video Display for Real API */}
          {useRealAPI && streamingSession && (
            <div className="relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover"
                autoPlay
                muted={isMuted}
                playsInline
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
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
                    {message.audioUrl && (
                      <audio controls className="mt-2 w-full">
                        <source src={message.audioUrl} type="audio/mpeg" />
                      </audio>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Dr. Scott anything..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
                disabled={!isConnected}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={startListening}
                disabled={!isConnected || isListening}
                className={isListening ? "bg-red-100 text-red-600" : ""}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || !isConnected}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {!useRealAPI && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Demo mode - Configure HeyGen API for live avatar interaction
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveAvatar;

