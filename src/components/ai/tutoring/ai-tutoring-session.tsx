import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertCircle, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  Info, 
  Lightbulb, 
  Loader2, 
  MessageSquare, 
  Mic, 
  MicOff, 
  MoreHorizontal, 
  Pencil, 
  RefreshCw, 
  Save, 
  Send, 
  Settings, 
  Sparkles, 
  ThumbsUp, 
  User, 
  Volume2, 
  VolumeX, 
  Zap 
} from 'lucide-react';

import { useAIService } from '@/lib/ai/ai-service';
import { LearningStyle, UKKeyStage, UKSubject, ProficiencyLevel } from '@/lib/learning-path/types';

/**
 * AI Tutoring Session Component
 * 
 * Provides personalized tutoring sessions with adaptive approaches based on learning profiles,
 * multi-modal explanations, and interactive question answering.
 */
export function AITutoringSession({
  initialSubject = UKSubject.MATHEMATICS,
  initialTopic = 'Fractions and Decimals',
  initialKeyStage = UKKeyStage.KS2,
  initialLearningStyle = LearningStyle.VISUAL,
  initialProficiencyLevel = ProficiencyLevel.DEVELOPING,
  onSessionComplete,
  onSessionSave
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const aiService = useAIService();
  const messageEndRef = useRef(null);
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  
  // User input state
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Session configuration
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [keyStage, setKeyStage] = useState(initialKeyStage);
  const [learningStyle, setLearningStyle] = useState(initialLearningStyle);
  const [proficiencyLevel, setProficiencyLevel] = useState(initialProficiencyLevel);
  const [sessionGoal, setSessionGoal] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Conversation state
  const [messages, setMessages] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [conceptsExplained, setConceptsExplained] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  
  // Session analytics
  const [analytics, setAnalytics] = useState({
    questionsAsked: 0,
    conceptsExplained: 0,
    interactionsCompleted: 0,
    averageResponseTime: 0,
    engagementScore: 0,
    knowledgeGaps: [],
    strengths: []
  });
  
  // Initialize session
  useEffect(() => {
    if (messages.length === 0 && !isSessionActive) {
      // Add welcome message based on subject and topic
      const welcomeMessage = {
        id: 'welcome',
        sender: 'tutor',
        content: `Welcome to your personalized tutoring session on ${topic} for ${subject}. I'm here to help you understand this topic better and answer any questions you have. What would you like to focus on today?`,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages([welcomeMessage]);
      
      // Set initial suggested questions
      setSuggestedQuestions([
        `Can you explain what ${topic} is?`,
        `What are the key concepts I need to understand about ${topic}?`,
        `How does ${topic} relate to other topics in ${subject}?`,
        `Can you give me an example problem about ${topic}?`
      ]);
    }
  }, [subject, topic, isSessionActive, messages.length]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Session timer
  useEffect(() => {
    if (isSessionActive && !sessionTimer) {
      const timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      setSessionTimer(timer);
    } else if (!isSessionActive && sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    
    return () => {
      if (sessionTimer) {
        clearInterval(sessionTimer);
      }
    };
  }, [isSessionActive, sessionTimer]);
  
  // Format session duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Start session
  const startSession = () => {
    setIsSessionActive(true);
    setSessionProgress(0);
    
    // Add session start message
    const startMessage = {
      id: `system-${Date.now()}`,
      sender: 'system',
      content: `Tutoring session started on ${topic} for ${subject}.`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, startMessage]);
    
    // Generate initial tutor message
    generateTutorResponse(`Let's start our session on ${topic}. What specific aspect would you like to explore first?`);
  };
  
  // End session
  const endSession = () => {
    setIsSessionActive(false);
    setIsSessionComplete(true);
    
    // Add session end message
    const endMessage = {
      id: `system-${Date.now()}`,
      sender: 'system',
      content: `Tutoring session completed. Duration: ${formatDuration(sessionDuration)}.`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, endMessage]);
    
    // Generate session summary
    generateSessionSummary();
    
    // Notify parent component
    if (onSessionComplete) {
      onSessionComplete({
        subject,
        topic,
        duration: sessionDuration,
        messages: messages,
        analytics: analytics,
        conceptsExplained: conceptsExplained
      });
    }
  };
  
  // Save session
  const saveSession = () => {
    if (onSessionSave) {
      onSessionSave({
        subject,
        topic,
        duration: sessionDuration,
        messages: messages,
        analytics: analytics,
        conceptsExplained: conceptsExplained,
        isComplete: isSessionComplete
      });
    }
    
    toast({
      title: "Session saved",
      description: "Your tutoring session has been saved successfully.",
    });
  };
  
  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    
    // Start session if not already active
    if (!isSessionActive) {
      startSession();
    }
    
    // Generate tutor response
    generateTutorResponse(userInput);
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
      interactionsCompleted: prev.interactionsCompleted + 1
    }));
    
    // Update session progress
    updateSessionProgress();
  };
  
  // Generate tutor response
  const generateTutorResponse = async (userQuery) => {
    setIsThinking(true);
    
    try {
      // Prepare context for AI
      const context = {
        subject,
        topic,
        keyStage,
        learningStyle,
        proficiencyLevel,
        sessionGoal,
        conversationHistory: messages.slice(-5), // Last 5 messages for context
        conceptsExplained
      };
      
      // Create prompt for AI
      const prompt = `
        You are an educational tutor specializing in ${subject} for UK Key Stage ${keyStage}.
        The student's learning style is ${learningStyle} and their proficiency level is ${proficiencyLevel}.
        The current topic is ${topic}.
        ${sessionGoal ? `The student's goal for this session is: ${sessionGoal}` : ''}
        
        Student query: "${userQuery}"
        
        Provide a helpful, encouraging response that:
        1. Addresses the student's question directly
        2. Uses age-appropriate language for Key Stage ${keyStage}
        3. Adapts to their ${learningStyle} learning style
        4. Matches their ${proficiencyLevel} proficiency level
        5. Follows UK curriculum standards
        
        Include relevant examples and check for understanding.
      `;
      
      // In a real implementation, this would call the AI service
      // For now, we'll simulate the response with a timeout
      
      // Simulate typing indicator
      const typingMessage = {
        id: `typing-${Date.now()}`,
        sender: 'tutor',
        content: '...',
        timestamp: new Date().toISOString(),
        type: 'typing'
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // Simulate AI processing time
      setTimeout(async () => {
        // Remove typing indicator
        setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
        
        // In a real implementation, this would use the AI service
        // const aiResponse = await aiService.generateText(prompt, {
        //   model: 'gpt-4',
        //   temperature: 0.7,
        //   max_tokens: 500
        // });
        
        // For now, simulate AI response based on the query and context
        let responseContent = '';
        let responseType = 'text';
        let conceptDetected = false;
        
        // Check if query is about explaining a concept
        if (userQuery.toLowerCase().includes('explain') || 
            userQuery.toLowerCase().includes('what is') || 
            userQuery.toLowerCase().includes('how does')) {
          
          conceptDetected = true;
          
          // Simulate concept explanation based on subject and topic
          if (subject === UKSubject.MATHEMATICS && topic.includes('Fractions')) {
            responseContent = generateMathExplanation(userQuery, learningStyle);
            responseType = 'explanation';
            
            // Add to concepts explained
            const conceptName = userQuery.includes('decimal') ? 'Decimals' : 
                               userQuery.includes('equivalent') ? 'Equivalent Fractions' : 
                               'Fractions';
            
            if (!conceptsExplained.includes(conceptName)) {
              setConceptsExplained(prev => [...prev, conceptName]);
              
              // Update analytics
              setAnalytics(prev => ({
                ...prev,
                conceptsExplained: prev.conceptsExplained + 1
              }));
            }
          } else {
            // Generic explanation
            responseContent = `I'd be happy to explain ${topic}. 
            
            ${topic} is an important concept in ${subject} that helps us understand how parts relate to wholes. When we work with ${topic}, we're essentially dealing with portions or segments of a complete unit.
            
            For example, if we have a pizza cut into 8 equal slices and you eat 3 slices, you've consumed 3/8 of the pizza. The denominator (8) tells us how many equal parts the whole is divided into, and the numerator (3) tells us how many of those parts we're considering.
            
            Would you like me to go into more detail about any specific aspect of ${topic}?`;
            responseType = 'explanation';
          }
        } 
        // Check if query is about an example
        else if (userQuery.toLowerCase().includes('example') || 
                userQuery.toLowerCase().includes('problem')) {
          
          // Simulate example based on subject and topic
          if (subject === UKSubject.MATHEMATICS && topic.includes('Fractions')) {
            responseContent = generateMathExample(learningStyle);
            responseType = 'example';
          } else {
            // Generic example
            responseContent = `Here's an example related to ${topic}:
            
            Problem: If a recipe calls for 3/4 cup of flour and you want to make 1/2 of the recipe, how much flour do you need?
            
            Solution: To find out how much flour you need, you multiply 3/4 by 1/2.
            3/4 × 1/2 = 3/8 cup of flour
            
            Would you like me to explain how I solved this, or would you like another example?`;
            responseType = 'example';
          }
        }
        // Check if query is about relating to other topics
        else if (userQuery.toLowerCase().includes('relate') || 
                userQuery.toLowerCase().includes('connection')) {
          
          // Simulate relationship explanation
          responseContent = `Great question about how ${topic} relates to other areas of ${subject}!
          
          ${topic} connects to several other important concepts:
          
          1. Percentages: Fractions can be converted to percentages (e.g., 1/4 = 25%)
          2. Decimals: Fractions can be written as decimals (e.g., 1/4 = 0.25)
          3. Ratios: Fractions are used to express ratios between quantities
          4. Algebra: Fractional expressions are important in algebraic equations
          5. Measurement: Fractions are used in measurements of length, weight, and capacity
          
          Understanding ${topic} builds a foundation for these more advanced concepts. Which of these connections would you like to explore further?`;
          responseType = 'explanation';
        }
        // Default response
        else {
          responseContent = `That's a good question about ${topic}. 
          
          In ${subject}, we often find that ${topic} helps us solve many different types of problems. The key thing to remember is that ${topic} represents parts of a whole.
          
          Is there a specific aspect of ${topic} you're finding challenging, or would you like me to explain a particular concept in more detail?`;
          responseType = 'text';
        }
        
        // Add tutor response
        const tutorMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          content: responseContent,
          timestamp: new Date().toISOString(),
          type: responseType
        };
        
        setMessages(prev => [...prev, tutorMessage]);
        
        // Generate new suggested questions based on the response
        generateSuggestedQuestions(responseContent, conceptDetected);
        
        setIsThinking(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating tutor response:', error);
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: 'system',
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        timestamp: new Date().toISOString(),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsThinking(false);
    }
  };
  
  // Generate math explanation based on learning style
  const generateMathExplanation = (query, style) => {
    // Visual learner explanation
    if (style === LearningStyle.VISUAL) {
      return `
        Let me explain fractions visually.
        
        A fraction represents a part of a whole. For example, in the fraction 3/4:
        - The numerator (3) is the number on top and represents the parts we're considering
        - The denominator (4) is the number on the bottom and represents the total number of equal parts
        
        Visually, we can represent this as a circle or rectangle divided into 4 equal parts, with 3 parts shaded:
        
        [Circle diagram with 3/4 shaded]
        
        When we work with fractions, we can:
        - Add fractions with the same denominator by adding the numerators
        - Convert fractions to decimals by dividing the numerator by the denominator
        - Find equivalent fractions by multiplying or dividing both the numerator and denominator by the same number
        
        Would you like me to explain any of these operations in more detail with visual examples?
      `;
    }
    // Auditory learner explanation
    else if (style === LearningStyle.AUDITORY) {
      return `
        Let me explain fractions in a way that might be easier to remember through verbal patterns.
        
        Think of a fraction as a way of saying "this many parts out of that many equal parts." For example, 3/4 means "3 parts out of 4 equal parts."
        
        When we say "three-fourths" or "three-quarters," we're describing:
        - The "three" (numerator) tells us how many parts we have
        - The "fourths" (denominator) tells us what size each part is (one-fourth of the whole)
        
        Here's a helpful way to remember: "The numerator is the number of parts, the denominator is the name of the parts."
        
        When adding fractions with the same denominator, we add the numerators but keep the denominator the same. For example:
        1/4 + 2/4 = 3/4 (one-fourth plus two-fourths equals three-fourths)
        
        Does this explanation help? Would you like me to explain more about operations with fractions using verbal patterns?
      `;
    }
    // Kinesthetic learner explanation
    else if (style === LearningStyle.KINESTHETIC) {
      return `
        Let's understand fractions through hands-on examples you can try.
        
        Imagine you have a chocolate bar with 8 equal pieces. If you eat 3 pieces, you've eaten 3/8 of the chocolate bar.
        
        Try this activity: Take a piece of paper and fold it into 4 equal parts. Now color 3 of those parts. You've just represented the fraction 3/4!
        
        For adding fractions with the same denominator:
        1. Take another piece of paper and fold it into 4 equal parts
        2. Color 1 part on this paper (representing 1/4)
        3. Now look at both papers together - you have 3 colored parts on the first and 1 colored part on the second
        4. Together, that's 4 colored parts out of 8 total parts, or 4/8 (which simplifies to 1/2)
        
        Would you like more hands-on activities to explore fractions?
      `;
    }
    // Read/Write learner explanation
    else {
      return `
        Fractions are numerical expressions that represent parts of a whole or a collection. A fraction consists of two numbers separated by a line:
        
        Numerator / Denominator
        
        - The numerator (top number) represents how many parts we are considering
        - The denominator (bottom number) represents the total number of equal parts in the whole
        
        For example, in the fraction 3/4:
        - 3 is the numerator, indicating we have 3 parts
        - 4 is the denominator, indicating the whole is divided into 4 equal parts
        
        Key properties of fractions:
        1. Equivalent fractions: Fractions that represent the same value (e.g., 1/2 = 2/4 = 3/6)
        2. Proper fractions: Numerator is less than denominator (e.g., 3/4)
        3. Improper fractions: Numerator is greater than or equal to denominator (e.g., 5/4)
        4. Mixed numbers: Whole number plus a proper fraction (e.g., 1 1/4)
        
        Basic operations with fractions:
        - Addition/subtraction with like denominators: Add/subtract numerators, keep denominator
        - Addition/subtraction with unlike denominators: Convert to equivalent fractions with common denominator
        - Multiplication: Multiply numerators, multiply denominators
        - Division: Multiply by the reciprocal of the divisor
        
        Would you like me to elaborate on any of these concepts?
      `;
    }
  };
  
  // Generate math example based on learning style
  const generateMathExample = (style) => {
    // Visual learner example
    if (style === LearningStyle.VISUAL) {
      return `
        Here's a visual example involving fractions:
        
        Problem: What is 2/3 of 18?
        
        Visual solution:
        1. Draw 18 circles: ○○○○○○○○○○○○○○○○○○
        2. Divide them into 3 equal groups (because the denominator is 3):
           Group 1: ○○○○○○
           Group 2: ○○○○○○
           Group 3: ○○○○○○
        3. Take 2 of these groups (because the numerator is 2):
           ○○○○○○ + ○○○○○○ = 12
        
        So 2/3 of 18 = 12
        
        Would you like to try another example?
      `;
    }
    // Auditory learner example
    else if (style === LearningStyle.AUDITORY) {
      return `
        Let me walk you through a fraction problem step by step:
        
        Problem: What is 2/3 of 18?
        
        Verbal solution:
        1. "Of" means multiplication in math language
        2. So we need to calculate 2/3 × 18
        3. First, multiply the numerator by the whole number: 2 × 18 = 36
        4. Then divide by the denominator: 36 ÷ 3 = 12
        
        So 2/3 of 18 = 12
        
        Try saying this out loud as you work through similar problems: "To find a fraction of a number, multiply the number by the numerator, then divide by the denominator."
        
        Would you like to hear another example?
      `;
    }
    // Kinesthetic learner example
    else if (style === LearningStyle.KINESTHETIC) {
      return `
        Here's a hands-on example with fractions:
        
        Problem: What is 2/3 of 18?
        
        Try solving this physically:
        1. Get 18 small objects (coins, buttons, or even pieces of paper)
        2. Arrange them in 3 equal rows (because the denominator is 3):
           Row 1: ● ● ● ● ● ●
           Row 2: ● ● ● ● ● ●
           Row 3: ● ● ● ● ● ●
        3. Now take 2 of these rows (because the numerator is 2)
        4. Count how many objects you have: 6 + 6 = 12
        
        So 2/3 of 18 = 12
        
        Try this approach with different fractions and numbers. Would you like another hands-on example?
      `;
    }
    // Read/Write learner example
    else {
      return `
        Example: Finding a Fraction of a Whole Number
        
        Problem: What is 2/3 of 18?
        
        Solution:
        To find a fraction of a number, we multiply the number by the fraction.
        
        Step 1: Set up the multiplication.
        2/3 × 18
        
        Step 2: Multiply the numerator by the whole number.
        2 × 18 = 36
        
        Step 3: Divide the result by the denominator.
        36 ÷ 3 = 12
        
        Therefore, 2/3 of 18 = 12
        
        Alternative method:
        Step 1: Divide the whole number by the denominator.
        18 ÷ 3 = 6
        
        Step 2: Multiply the result by the numerator.
        6 × 2 = 12
        
        Therefore, 2/3 of 18 = 12
        
        Would you like to see another written example?
      `;
    }
  };
  
  // Generate suggested questions
  const generateSuggestedQuestions = (tutorResponse, conceptDetected) => {
    // In a real implementation, this would analyze the tutor response
    // and generate relevant follow-up questions
    
    // For now, we'll provide static suggestions based on the detected concept
    if (conceptDetected) {
      setSuggestedQuestions([
        'Can you give me an example problem?',
        'How does this relate to real life?',
        'What are common mistakes students make with this?',
        'Can you explain it in a different way?'
      ]);
    } else {
      setSuggestedQuestions([
        `Can you explain more about ${topic}?`,
        'What are the key points I should remember?',
        'Can we try a practice problem?',
        'How will this help me in the future?'
      ]);
    }
  };
  
  // Generate session summary
  const generateSessionSummary = () => {
    // In a real implementation, this would analyze the entire session
    // and generate a comprehensive summary
    
    // For now, we'll provide a static summary
    const summaryMessage = {
      id: `summary-${Date.now()}`,
      sender: 'tutor',
      content: `
        # Session Summary
        
        ## Topics Covered
        We discussed ${topic} in ${subject}, focusing on:
        ${conceptsExplained.map(concept => `- ${concept}`).join('\n')}
        
        ## Key Takeaways
        - Fractions represent parts of a whole
        - The numerator tells us how many parts we have
        - The denominator tells us the total number of equal parts
        - Fractions can be represented visually, verbally, and symbolically
        
        ## Progress
        You asked ${analytics.questionsAsked} questions and explored ${analytics.conceptsExplained} concepts.
        
        ## Next Steps
        I recommend:
        1. Practice more problems involving ${topic}
        2. Explore the connection between fractions and decimals
        3. Try applying these concepts to real-world situations
        
        Would you like to save this session summary?
      `,
      timestamp: new Date().toISOString(),
      type: 'summary'
    };
    
    setMessages(prev => [...prev, summaryMessage]);
  };
  
  // Update session progress
  const updateSessionProgress = () => {
    // In a real implementation, this would calculate progress based on
    // learning objectives, concepts covered, and student understanding
    
    // For now, we'll simulate progress
    const newProgress = Math.min(100, sessionProgress + Math.floor(Math.random() * 10) + 5);
    setSessionProgress(newProgress);
  };
  
  // Handle suggested question click
  const handleSuggestedQuestionClick = (question) => {
    setUserInput(question);
  };
  
  // Toggle recording
  const toggleRecording = () => {
    // In a real implementation, this would start/stop speech recognition
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Speech recognition started",
        description: "Speak clearly and I'll convert your speech to text.",
      });
      
      // Simulate speech recognition after a delay
      setTimeout(() => {
        setUserInput("Can you explain how to add fractions with different denominators?");
        setIsRecording(false);
        
        toast({
          title: "Speech recognition complete",
          description: "Your speech has been converted to text.",
        });
      }, 3000);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Audio enabled" : "Audio muted",
      description: isMuted ? "You will now hear audio responses." : "Audio responses are now muted.",
    });
  };
  
  // Render message
  const renderMessage = (message) => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      
      case 'typing':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        );
      
      case 'system':
        return (
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-2" />
            {message.content}
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center text-sm text-red-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            {message.content}
          </div>
        );
      
      case 'explanation':
        return (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        );
      
      case 'example':
        return (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        );
      
      case 'summary':
        return (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        );
      
      default:
        return <p>{message.content}</p>;
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/assets/ai-tutor-avatar.png" alt="AI Tutor" />
            <AvatarFallback>
              <Brain className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Tutor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subject} - {topic}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSessionActive && (
            <div className="flex items-center mr-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {formatDuration(sessionDuration)}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Session Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={saveSession}>
                <Save className="h-4 w-4 mr-2" />
                Save Session
              </DropdownMenuItem>
              {isSessionActive ? (
                <DropdownMenuItem onClick={endSession}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  End Session
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={startSession}>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Session
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Tips
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Settings Panel (conditionally rendered) */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Session Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKSubject.MATHEMATICS}>Mathematics</SelectItem>
                  <SelectItem value={UKSubject.ENGLISH}>English</SelectItem>
                  <SelectItem value={UKSubject.SCIENCE}>Science</SelectItem>
                  <SelectItem value={UKSubject.HISTORY}>History</SelectItem>
                  <SelectItem value={UKSubject.GEOGRAPHY}>Geography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Topic</label>
              <Input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Key Stage</label>
              <Select value={keyStage} onValueChange={setKeyStage}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select key stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKKeyStage.KS1}>Key Stage 1</SelectItem>
                  <SelectItem value={UKKeyStage.KS2}>Key Stage 2</SelectItem>
                  <SelectItem value={UKKeyStage.KS3}>Key Stage 3</SelectItem>
                  <SelectItem value={UKKeyStage.KS4}>Key Stage 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Learning Style</label>
              <Select value={learningStyle} onValueChange={setLearningStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LearningStyle.VISUAL}>Visual</SelectItem>
                  <SelectItem value={LearningStyle.AUDITORY}>Auditory</SelectItem>
                  <SelectItem value={LearningStyle.KINESTHETIC}>Kinesthetic</SelectItem>
                  <SelectItem value={LearningStyle.READ_WRITE}>Read/Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">Session Goal (Optional)</label>
              <Input 
                value={sessionGoal} 
                onChange={(e) => setSessionGoal(e.target.value)} 
                placeholder="What do you want to achieve in this session?"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSettings(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      {isSessionActive && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Session Progress</span>
            <span>{sessionProgress}%</span>
          </div>
          <Progress value={sessionProgress} className="h-1" />
        </div>
      )}
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'tutor' && message.type !== 'system' && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src="/assets/ai-tutor-avatar.png" alt="AI Tutor" />
                  <AvatarFallback>
                    <Brain className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'system' || message.type === 'error'
                    ? 'bg-gray-100 dark:bg-neutral-800 w-full text-center'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                }`}
              >
                {renderMessage(message)}
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name || 'User'} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {/* Thinking indicator */}
          {isThinking && !messages.some(m => m.type === 'typing') && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                <AvatarFallback>
                  <Brain className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && !isSessionComplete && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Suggested Questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestedQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      {!isSessionComplete && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={isRecording ? 'text-red-500' : ''}
              onClick={toggleRecording}
              disabled={isThinking}
            >
              {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1"
              disabled={isThinking || isRecording}
            />
            
            <Button 
              type="submit" 
              disabled={!userInput.trim() || isThinking || isRecording}
            >
              {isThinking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      )}
      
      {/* Session Complete Actions */}
      {isSessionComplete && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={saveSession}>
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
            
            <Button onClick={() => {
              setIsSessionComplete(false);
              setIsSessionActive(false);
              setMessages([messages[0]]);
              setSessionDuration(0);
              setSessionProgress(0);
            }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
