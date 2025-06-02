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
  X
} from 'lucide-react';

// Types for the Interactive Avatar system
export interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  metadata?: {
    userRole?: string;
    confidence?: number;
    sources?: string[];
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
  heygen_session_id?: string;
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
  ]
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize avatar session
  useEffect(() => {
    initializeAvatarSession();
  }, []);

  const initializeAvatarSession = async () => {
    try {
      // Simulate HeyGen session initialization
      // In real implementation, this would connect to HeyGen API
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setIsConnected(true);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'avatar',
        content: `Hello! I'm Dr. Scott I-Patrick, and I'm delighted to meet you. As an Educational Psychologist with over 12 years of experience, I'm here to provide you with evidence-based support and guidance. How can I help you today?`,
        timestamp: new Date(),
        metadata: {
          userRole: selectedRole,
          confidence: 1.0,
          sources: ['Dr. Scott I-Patrick Professional Profile']
        }
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize avatar session:', error);
      setIsConnected(false);
    }
  };

  const getAvatarResponse = async (userInput: string, userRole: string): Promise<string> => {
    // Enhanced knowledge base with role-specific responses
    const knowledgeBase = {
      greeting: {
        student: "Hello! I'm here to support your learning journey. Whether you're facing challenges with schoolwork, need study strategies, or want to understand your learning style better, I'm here to help. What would you like to explore today?",
        teacher: "Welcome! As an educator, you're making such an important difference. I can help with evidence-based classroom strategies, behavior management, assessment techniques, and supporting students with diverse needs. What's on your mind?",
        parent: "Hello! Supporting your child's education is one of the most important things you can do. I can help you understand assessment results, develop home support strategies, navigate school systems, and advocate for your child's needs. How can I assist you?",
        professional: "Greetings, colleague! I'm excited to collaborate with you on supporting students and families. Whether you need consultation on complex cases, want to discuss latest research, or explore intervention strategies, I'm here to help. What would you like to discuss?"
      },
      
      restorative_justice: {
        general: "Restorative Justice is at the heart of my doctoral research and practice. It's about building relationships, understanding underlying causes of behavior, and creating healing rather than punishment. In schools, this means focusing on repairing harm and strengthening community bonds.",
        teacher: "For teachers, Restorative Justice transforms classroom management. Instead of traditional punishments, we use circle processes, restorative conversations, and community agreements. This approach builds stronger relationships and creates a more positive learning environment.",
        student: "Restorative Justice means when conflicts happen, we focus on understanding what went wrong and how to make things better. It's about taking responsibility, making amends, and learning from mistakes rather than just getting punished.",
        parent: "Restorative Justice in schools means your child learns to take responsibility for their actions while being supported to make positive changes. It focuses on repairing relationships and building empathy rather than exclusionary discipline."
      },
      
      assessments: {
        general: "Educational psychology assessments are powerful tools for understanding learning needs. I can guide you through various assessment types, from cognitive evaluations to social-emotional assessments, helping you understand what they measure and how to interpret results.",
        teacher: "Assessments help us understand each student's unique profile. I can guide you through classroom-based assessments, progress monitoring tools, and how to use assessment data to inform your teaching strategies and support planning.",
        parent: "Assessment results can feel overwhelming, but they're actually roadmaps to understanding your child's strengths and needs. I can help you interpret results, understand recommendations, and know what questions to ask at school meetings.",
        professional: "Assessment is the foundation of effective intervention. I can discuss assessment selection, administration protocols, interpretation frameworks, and how to translate results into actionable intervention plans."
      },
      
      interventions: {
        general: "Evidence-based interventions are the cornerstone of effective educational psychology practice. I can guide you through selecting, implementing, and monitoring interventions that are proven to work for specific learning and behavioral needs.",
        teacher: "Classroom interventions should be practical and evidence-based. I can help you implement strategies for academic support, behavior management, social-emotional learning, and creating inclusive environments that work for all students.",
        student: "Interventions are strategies that help you learn better and feel more successful at school. We can explore study techniques, organization strategies, ways to manage stress, and approaches that match your learning style.",
        parent: "Home interventions complement what's happening at school. I can suggest strategies for homework support, behavior management, communication skills, and creating structure that supports your child's success."
      }
    };

    const input = userInput.toLowerCase();
    
    // Determine response category
    let category = 'general';
    let responseType = 'help';
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      responseType = 'greeting';
    } else if (input.includes('restorative') || input.includes('justice') || input.includes('behavior')) {
      responseType = 'restorative_justice';
    } else if (input.includes('assessment') || input.includes('test') || input.includes('evaluate')) {
      responseType = 'assessments';
    } else if (input.includes('intervention') || input.includes('strategy') || input.includes('support')) {
      responseType = 'interventions';
    }
    
    // Get role-specific response
    const responses = knowledgeBase[responseType as keyof typeof knowledgeBase];
    if (responses && typeof responses === 'object') {
      return responses[userRole as keyof typeof responses] || responses.general || "I'd be happy to help you with that. Could you tell me more about what specific area you'd like to explore?";
    }
    
    // Default response
    return `That's a great question! As an Educational Psychologist, I can help you with assessments, interventions, learning strategies, behavioral support, and restorative justice practices. Could you tell me more about what specific area you'd like to explore?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      metadata: {
        userRole: selectedRole
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Get avatar response
      const responseContent = await getAvatarResponse(inputMessage, selectedRole);
      
      const avatarResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        type: 'avatar',
        content: responseContent,
        timestamp: new Date(),
        metadata: {
          userRole: selectedRole,
          confidence: 0.95,
          sources: ['Dr. Scott I-Patrick Knowledge Base', 'Educational Psychology Research']
        }
      };
      
      setMessages(prev => [...prev, avatarResponse]);
    } catch (error) {
      console.error('Failed to get avatar response:', error);
      
      const errorResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        type: 'avatar',
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to contact our support team for immediate assistance.",
        timestamp: new Date(),
        metadata: {
          userRole: selectedRole,
          confidence: 0.0
        }
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Tell me about EdPsych Connect",
    "What is Restorative Justice?",
    "How do assessments work?",
    "What interventions do you recommend?",
    "How can I support learning at home?"
  ];

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 h-[600px] flex flex-col shadow-2xl border-2 border-blue-200">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src="/api/placeholder/40/40" alt="Dr. Scott" />
                <AvatarFallback className="bg-white text-blue-600 font-bold">
                  DS
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">{DR_SCOTT_CONFIG.name}</CardTitle>
                <p className="text-xs opacity-90">{DR_SCOTT_CONFIG.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                {isConnected ? 'Online' : 'Offline'}
              </Badge>
              <div className="flex space-x-1">
                {onToggleMinimize && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleMinimize}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                )}
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {showRoleSelector && (
          <div className="flex-shrink-0 p-3 bg-gray-50 border-b">
            <div className="flex space-x-1">
              {USER_ROLES.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Button
                    key={role.id}
                    variant={selectedRole === role.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role.id)}
                    className="flex-1 text-xs"
                    title={role.description}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {role.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.metadata?.confidence && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(message.metadata.confidence * 100)}% confident
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Quick Questions */}
        <div className="flex-shrink-0 p-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-1">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-1 text-gray-600 hover:text-blue-600"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-3 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Dr. Scott about educational psychology..."
              className="flex-1 text-sm"
              disabled={isTyping || !isConnected}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || !isConnected}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InteractiveAvatar;

