'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Brain, 
  BookOpen, 
  LineChart, 
  MessageSquare, 
  Sparkles,
  Lightbulb,
  Award,
  Zap,
  Send,
  BarChart4,
  Layers,
  Clock
} from 'lucide-react';

// Digital Twin Learning Companion prototype
// This component demonstrates the concept of a persistent AI companion that evolves with the learner

interface LearningProfile {
  strengths: any[];
  challenges: any[];
  interests: any[];
  learningStyle: 'visual' | 'auditory' | 'reading/writing' | 'kinesthetic' | 'multimodal';
  pacePreference: 'accelerated' | 'standard' | 'deliberate';
  motivationFactors: any[];
  recentTopics: any[];
  skillLevels: Record<string, number>;
}

interface CompanionState {
  name: string;
  level: number;
  experience: number;
  mood: 'excited' | 'focused' | 'curious' | 'thoughtful' | 'encouraging';
  insightCount: number;
  challengesCompleted: number;
  streak: number;
  lastInteraction: Date;
}

export default function DigitalTwinCompanionPage() {
  const [learningProfile, setLearningProfile] = useState<LearningProfile>({
    strengths: ['Pattern recognition', 'Creative problem-solving', 'Visual learning'],
    challenges: ['Sustained focus', 'Mathematical formulas', 'Text-heavy content'],
    interests: ['Space exploration', 'Robotics', 'Natural ecosystems'],
    learningStyle: 'visual',
    pacePreference: 'standard',
    motivationFactors: ['Real-world applications', 'Interactive challenges', 'Visual feedback'],
    recentTopics: ['Planetary motion', 'Ecosystem balance', 'Basic programming'],
    skillLevels: {
      'Mathematics': 65,
      'Science': 82,
      'Language Arts': 70,
      'Critical Thinking': 78,
      'Creative Expression': 85
    }
  });
  
  const [companion, setCompanion] = useState<CompanionState>({
    name: 'Nova',
    level: 12,
    experience: 68,
    mood: 'curious',
    insightCount: 24,
    challengesCompleted: 37,
    streak: 8,
    lastInteraction: new Date()
  });
  
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'companion', content: string, timestamp: Date}[]>([
    {
      role: 'companion',
      content: "Welcome back! I noticed you've been exploring planetary motion concepts. Would you like to continue with that or try something new today?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companionAvatar, setCompanionAvatar] = useState('/images/companion/nova.png');
  
  // Simulate companion response
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate companion thinking and responding
    setTimeout(() => {
      let response = '';
      
      // Simple pattern matching for demo purposes
      if (inputMessage.toLowerCase().includes('planet')) {
        response = "The planetary motion concepts are fascinating! Johannes Kepler's laws describe how planets move in elliptical orbits. Would you like me to explain more about elliptical orbits or move on to gravitational forces?";
      } else if (inputMessage.toLowerCase().includes('math') || inputMessage.toLowerCase().includes('formula')) {
        response = "I've noticed mathematical formulas are sometimes challenging for you. Let's try a visual approach to understand them. For example, we can visualise the formula for gravitational force as two objects pulling on each other with invisible strings.";
      } else if (inputMessage.toLowerCase().includes('help') || inputMessage.toLowerCase().includes('stuck')) {
        response = "I'm here to help! Based on your learning profile, you learn best with visual examples. Let me create a diagram to explain this concept. Also, remember that you excel at pattern recognition - try to connect this with patterns you've seen before.";
      } else if (inputMessage.toLowerCase().includes('robot') || inputMessage.toLowerCase().includes('code')) {
        response = "Robotics combines so many interesting fields! Since you're interested in both robotics and have been studying basic programming, would you like to explore a simple coding challenge that simulates robot movement?";
      } else {
        response = "That's an interesting point! Based on your learning profile, I think we could connect this to your interest in " + learningProfile.interests[Math.floor(Math.random() * learningProfile.interests.length)] + ". Would you like to explore that connection?";
      }
      
      const companionMessage = {
        role: 'companion' as const,
        content: response,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, companionMessage]);
      setIsTyping(false);
      
      // Update companion state
      setCompanion(prev => ({
        ...prev,
        experience: Math.min(prev.experience + 5, 100),
        lastInteraction: new Date()
      }));
      
      // Level up if experience reaches 100
      if (companion.experience + 5 >= 100) {
        setTimeout(() => {
          setCompanion(prev => ({
            ...prev,
            level: prev.level + 1,
            experience: 0,
            mood: 'excited'
          }));
        }, 1000);
      }
    }, 2000);
  };
  
  // Get mood emoji
  const getMoodEmoji = () => {
    switch(companion.mood) {
      case 'excited': return '😃';
      case 'focused': return '🧐';
      case 'curious': return '🤔';
      case 'thoughtful': return '😌';
      case 'encouraging': return '😊';
      default: return '🤔';
    }
  };
  
  // Get learning style icon
  const getLearningStyleIcon = () => {
    switch(learningProfile.learningStyle) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'auditory': return <Ear className="h-4 w-4" />;
      case 'reading/writing': return <BookOpen className="h-4 w-4" />;
      case 'kinesthetic': return <Hand className="h-4 w-4" />;
      case 'multimodal': return <Layers className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };
  
  // Simulate companion evolution
  const evolveCompanion = () => {
    setCompanionAvatar('/images/companion/nova-evolved.png');
    setCompanion(prev => ({
      ...prev,
      level: prev.level + 3,
      mood: 'excited',
      insightCount: prev.insightCount + 5
    }));
  };
  
  // Custom components for the demo
  const Eye = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  
  const Ear = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
      <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
    </svg>
  );
  
  const Hand = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Digital Twin Learning Companion</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Meet your personalized AI learning companion that evolves with you, understands your unique learning profile, and provides tailored guidance throughout your educational journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Companion Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-centre mb-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={companionAvatar} alt={companion.name} />
                    <AvatarFallback>{companion.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-4 right-0 text-2xl">
                    {getMoodEmoji()}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold">{companion.name}</h2>
                <div className="flex items-centre gap-1 text-muted-foreground">
                  <span>Level {companion.level}</span>
                  <span>•</span>
                  <span>{companion.mood.charAt(0).toUpperCase() + companion.mood.slice(1)}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Experience</span>
                    <span>{companion.experience}/100</span>
                  </div>
                  <Progress value={companion.experience} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-centre">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="text-2xl font-semibold">{companion.insightCount}</div>
                    <div className="text-xs text-muted-foreground">Insights</div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="text-2xl font-semibold">{companion.challengesCompleted}</div>
                    <div className="text-xs text-muted-foreground">Challenges</div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-centre gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Learning Streak</span>
                  </div>
                  <div className="flex items-centre justify-between">
                    <span className="text-2xl font-bold">{companion.streak} days</span>
                    <Badge variant="outline" className="text-xs">
                      {companion.streak >= 7 ? 'On Fire! 🔥' : 'Keep Going!'}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Companion Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={evolveCompanion}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Evolve Companion
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="mr-2 h-4 w-4" />
                      View Achievements
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Layers className="mr-2 h-4 w-4" />
                      Customise Appearance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="learning-profile">Learning Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <BarChart4 className="mr-2 h-5 w-5 text-primary" />
                    Learning Dashboard
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Recent Progress</h3>
                      <div className="space-y-4">
                        {Object.entries(learningProfile.skillLevels).map(([skill, level]) => (
                          <div key={skill}>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>{skill}</span>
                              <span>{level}/100</span>
                            </div>
                            <Progress value={level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Companion Insights</h3>
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full mt-1">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm">Based on your learning patterns, you seem to grasp concepts faster when they're presented visually with real-world applications.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full mt-1">
                              <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm">I've noticed you excel at creative problem-solving but sometimes struggle with mathematical formulas. Let's try a more visual approach to mathematics.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full mt-1">
                              <Brain className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm">Your interest in space exploration and robotics suggests you might enjoy exploring the mechanics of rover design and planetary navigation.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Recommended Learning Paths</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Planetary Science</h4>
                          <p className="text-sm text-muted-foreground mb-4">Visual exploration of planetary motion and gravitational forces.</p>
                          <Badge variant="outline" className="text-xs">Matches Interests</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Interactive Robotics</h4>
                          <p className="text-sm text-muted-foreground mb-4">Hands-on programming challenges for robotic systems.</p>
                          <Badge variant="outline" className="text-xs">Builds on Strengths</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Visual Mathematics</h4>
                          <p className="text-sm text-muted-foreground mb-4">Mathematical concepts explained through visual patterns and models.</p>
                          <Badge variant="outline" className="text-xs">Addresses Challenges</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conversation" className="mt-6">
              <Card className="h-[600px] flex flex-col">
                <CardContent className="p-6 flex-grow overflow-hidden flex flex-col">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Conversation with {companion.name}
                  </h2>
                  
                  <div className="flex-grow overflow-y-auto mb-4 pr-2">
                    <div className="space-y-4">
                      {chatHistory.map((message, index) => (
                        <div 
                          key={index} 
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs mt-2 opacity-70">
                              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask your companion anything..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-grow"
                    />
                    <Button onClick={handleSendMessage} disabled={isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="learning-profile" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Your Learning Profile
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Learning Preferences</h3>
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Primary Learning Style</span>
                              <Badge className="capitalize">{learningProfile.learningStyle}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You learn best through visual representations, diagrams, and demonstrations.
                            </p>
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Pace Preference</span>
                              <Badge className="capitalize">{learningProfile.pacePreference}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You prefer a balanced pace with time to absorb concepts thoroughly.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Strengths</h3>
                        <div className="flex flex-wrap gap-2">
                          {learningProfile.strengths.map((strength, index) => (
                            <Badge key={index} variant="secondary">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Challenges</h3>
                        <div className="flex flex-wrap gap-2">
                          {learningProfile.challenges.map((challenge, index) => (
                            <Badge key={index} variant="outline">
                              {challenge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {learningProfile.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Motivation Factors</h3>
                        <ul className="space-y-2">
                          {learningProfile.motivationFactors.map((factor, index) => (
                            <li key={index} className="flex items-centre gap-2">
                              <div className="bg-primary/10 p-1 rounded-full">
                                <Zap className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recent Topics</h3>
                        <div className="flex flex-wrap gap-2">
                          {learningProfile.recentTopics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Companion's Observations</h3>
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">You engage more deeply with content that has visual elements and real-world applications.</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">You tend to lose focus after approximately 25 minutes of continuous study.</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">You learn mathematical concepts more effectively when presented through visual patterns rather than formulas.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Update Profile</h3>
                        <Textarea 
                          placeholder="Share more about your learning preferences, interests, or challenges..."
                          className="mb-2"
                        />
                        <Button>Update Profile</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Profile Analysis</h3>
              <p className="text-muted-foreground">
                Your digital twin builds a sophisticated learning profile by analysing your interactions, preferences, strengths, challenges, and learning patterns over time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
              <p className="text-muted-foreground">
                Using your unique learning profile, your companion provides tailored recommendations, explanations, and support strategies optimised for your specific learning needs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Evolution</h3>
              <p className="text-muted-foreground">
                Your digital twin evolves alongside you, adapting its approach as your skills develop, interests change, and learning patterns shift throughout your educational journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Learners</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Truly Personalized Learning</span>
                    <p className="text-sm text-muted-foreground">Experience education tailored specifically to your unique learning profile, not generic algorithms.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Continuous Support</span>
                    <p className="text-sm text-muted-foreground">Receive guidance, motivation, and assistance whenever you need it, throughout your learning journey.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Metacognitive Development</span>
                    <p className="text-sm text-muted-foreground">Gain insights into your own learning processes and develop stronger self-awareness as a learner.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Emotional Connection</span>
                    <p className="text-sm text-muted-foreground">Build a relationship with a companion that understands your educational journey and celebrates your growth.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Educators</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Comprehensive Learner Insights</span>
                    <p className="text-sm text-muted-foreground">Access detailed profiles of student learning patterns, preferences, and challenges to inform teaching strategies.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Personalized Support at Scale</span>
                    <p className="text-sm text-muted-foreground">Provide individualized guidance to every student simultaneously through their digital twins.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Early Intervention Opportunities</span>
                    <p className="text-sm text-muted-foreground">Identify learning challenges early through companion observations and predictive analytics.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Continuous Engagement</span>
                    <p className="text-sm text-muted-foreground">Maintain student motivation and participation through personalized companion interactions and challenges.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
