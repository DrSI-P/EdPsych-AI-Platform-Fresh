import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  Brain, 
  BookOpen, 
  LineChart, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart, 
  Lightbulb,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Calendar,
  Layers,
  Target
} from 'lucide-react';

import { AITutoringSession } from './ai-tutoring-session';
import { NaturalLanguageConceptExplainer } from './natural-language-concept-explainer';
import { 
  LearningPath, 
  LearningPathNode, 
  LearningStyle, 
  UKKeyStage, 
  UKSubject, 
  ProficiencyLevel 
} from '@/lib/learning-path/types';
import { CurriculumContent } from '@/lib/curriculum-content/types';

/**
 * AI Tutoring System Integration Component
 * 
 * Integrates the AI tutoring system with personalized learning paths
 * and provides progress monitoring and analytics.
 */
export function AITutoringSystemIntegration({
  studentId,
  initialSubject = UKSubject.MATHEMATICS,
  initialKeyStage = UKKeyStage.KS2
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // State for learning path and progress
  const [learningPath, setLearningPath] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [learningProgress, setLearningProgress] = useState({
    completedNodes: 0,
    totalNodes: 0,
    masteredConcepts: 0,
    totalConcepts: 0,
    averageProficiency: 0
  });
  
  // State for student profile
  const [studentProfile, setStudentProfile] = useState({
    id: studentId || 'student-1',
    name: 'Student Name',
    keyStage: initialKeyStage,
    learningStyle: LearningStyle.VISUAL,
    subjects: [
      { id: initialSubject, proficiencyLevel: ProficiencyLevel.DEVELOPING }
    ],
    interests: ['Space', 'Animals', 'Sports'],
    strengths: ['Visual learning', 'Problem-solving'],
    areasForImprovement: ['Retention of facts', 'Written expression']
  });
  
  // State for tutoring sessions
  const [tutoringSessions, setTutoringSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  
  // State for recommended content
  const [recommendedContent, setRecommendedContent] = useState([]);
  
  // State for UI
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch learning path and student data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, these would be API calls
        // For now, we'll simulate the data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock learning path data
        const mockLearningPath = generateMockLearningPath(initialSubject, initialKeyStage);
        setLearningPath(mockLearningPath);
        
        // Set current node to the first incomplete node
        const firstIncompleteNode = mockLearningPath.nodes.find(node => !node.completed);
        setCurrentNode(firstIncompleteNode || mockLearningPath.nodes[0]);
        
        // Calculate learning progress
        const completedNodes = mockLearningPath.nodes.filter(node => node.completed).length;
        const totalNodes = mockLearningPath.nodes.length;
        const masteredConcepts = mockLearningPath.nodes.filter(node => node.proficiencyLevel === ProficiencyLevel.MASTERED).length;
        const totalConcepts = mockLearningPath.nodes.length;
        
        // Calculate average proficiency
        const proficiencyValues = {
          [ProficiencyLevel.BEGINNING]: 1,
          [ProficiencyLevel.DEVELOPING]: 2,
          [ProficiencyLevel.SECURE]: 3,
          [ProficiencyLevel.MASTERED]: 4
        };
        
        const proficiencySum = mockLearningPath.nodes.reduce((sum, node) => {
          return sum + proficiencyValues[node.proficiencyLevel || ProficiencyLevel.BEGINNING];
        }, 0);
        
        const averageProficiency = (proficiencySum / totalNodes) * 25; // Convert to percentage (0-100)
        
        setLearningProgress({
          completedNodes,
          totalNodes,
          masteredConcepts,
          totalConcepts,
          averageProficiency
        });
        
        // Mock session history
        const mockSessionHistory = [
          {
            id: 'session-1',
            date: '2025-05-28',
            subject: initialSubject,
            topic: 'Fractions and Decimals',
            duration: 25 * 60, // 25 minutes in seconds
            conceptsCovered: ['Equivalent Fractions', 'Decimal Place Value'],
            proficiencyGain: 15
          },
          {
            id: 'session-2',
            date: '2025-05-29',
            subject: initialSubject,
            topic: 'Multiplication and Division',
            duration: 18 * 60, // 18 minutes in seconds
            conceptsCovered: ['Long Multiplication', 'Division with Remainders'],
            proficiencyGain: 12
          }
        ];
        
        setSessionHistory(mockSessionHistory);
        
        // Mock recommended content
        const mockRecommendedContent = generateMockRecommendedContent(initialSubject, initialKeyStage, studentProfile.learningStyle);
        setRecommendedContent(mockRecommendedContent);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading your learning path and profile.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [initialSubject, initialKeyStage, studentId, toast]);
  
  // Start a new tutoring session
  const startTutoringSession = (topic, subject, keyStage) => {
    const newSession = {
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      subject: subject || initialSubject,
      topic: topic || (currentNode ? currentNode.title : 'General Review'),
      keyStage: keyStage || initialKeyStage,
      learningStyle: studentProfile.learningStyle,
      proficiencyLevel: currentNode ? currentNode.proficiencyLevel : ProficiencyLevel.DEVELOPING,
      active: true
    };
    
    setCurrentSession(newSession);
    setTutoringSessions(prev => [...prev, newSession]);
    setActiveTab('tutoring');
    
    toast({
      title: 'Tutoring session started',
      description: `Starting a new session on ${newSession.topic} for ${newSession.subject}.`,
    });
  };
  
  // Complete a tutoring session
  const completeTutoringSession = (sessionData) => {
    // Update the session with completion data
    const updatedSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      duration: sessionData.duration,
      conceptsCovered: sessionData.conceptsExplained,
      active: false,
      analytics: sessionData.analytics
    };
    
    // Update sessions list
    setTutoringSessions(prev => 
      prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    
    // Add to session history
    setSessionHistory(prev => [
      {
        id: updatedSession.id,
        date: new Date().toISOString().split('T')[0],
        subject: updatedSession.subject,
        topic: updatedSession.topic,
        duration: updatedSession.duration,
        conceptsCovered: updatedSession.conceptsCovered,
        proficiencyGain: Math.floor(Math.random() * 15) + 5 // Simulate proficiency gain
      },
      ...prev
    ]);
    
    // Clear current session
    setCurrentSession(null);
    
    // Update learning path progress based on session results
    if (currentNode) {
      // Simulate progress update
      const updatedNode = {
        ...currentNode,
        proficiencyLevel: getNextProficiencyLevel(currentNode.proficiencyLevel),
        lastPracticed: new Date().toISOString()
      };
      
      // If proficiency is now secure or mastered, mark as completed
      if (
        updatedNode.proficiencyLevel === ProficiencyLevel.SECURE || 
        updatedNode.proficiencyLevel === ProficiencyLevel.MASTERED
      ) {
        updatedNode.completed = true;
      }
      
      // Update learning path
      const updatedPath = {
        ...learningPath,
        nodes: learningPath.nodes.map(node => 
          node.id === updatedNode.id ? updatedNode : node
        )
      };
      
      setLearningPath(updatedPath);
      setCurrentNode(updatedNode);
      
      // Update learning progress
      const completedNodes = updatedPath.nodes.filter(node => node.completed).length;
      const masteredConcepts = updatedPath.nodes.filter(node => node.proficiencyLevel === ProficiencyLevel.MASTERED).length;
      
      // Calculate new average proficiency
      const proficiencyValues = {
        [ProficiencyLevel.BEGINNING]: 1,
        [ProficiencyLevel.DEVELOPING]: 2,
        [ProficiencyLevel.SECURE]: 3,
        [ProficiencyLevel.MASTERED]: 4
      };
      
      const proficiencySum = updatedPath.nodes.reduce((sum, node) => {
        return sum + proficiencyValues[node.proficiencyLevel || ProficiencyLevel.BEGINNING];
      }, 0);
      
      const averageProficiency = (proficiencySum / updatedPath.nodes.length) * 25; // Convert to percentage (0-100)
      
      setLearningProgress(prev => ({
        ...prev,
        completedNodes,
        masteredConcepts,
        averageProficiency
      }));
    }
    
    // Generate new recommended content based on session results
    const newRecommendedContent = generateMockRecommendedContent(
      initialSubject, 
      initialKeyStage, 
      studentProfile.learningStyle,
      updatedSession.conceptsCovered
    );
    
    setRecommendedContent(newRecommendedContent);
    
    // Show success message
    toast({
      title: 'Tutoring session completed',
      description: `You've completed a ${Math.round(updatedSession.duration / 60)} minute session on ${updatedSession.topic}.`,
    });
    
    // Return to dashboard
    setActiveTab('dashboard');
  };
  
  // Get next proficiency level
  const getNextProficiencyLevel = (currentLevel) => {
    switch (currentLevel) {
      case ProficiencyLevel.BEGINNING:
        return ProficiencyLevel.DEVELOPING;
      case ProficiencyLevel.DEVELOPING:
        return ProficiencyLevel.SECURE;
      case ProficiencyLevel.SECURE:
        return ProficiencyLevel.MASTERED;
      case ProficiencyLevel.MASTERED:
        return ProficiencyLevel.MASTERED;
      default:
        return ProficiencyLevel.DEVELOPING;
    }
  };
  
  // Generate mock learning path
  const generateMockLearningPath = (subject, keyStage) => {
    // Generate nodes based on subject and key stage
    let nodes = [];
    
    if (subject === UKSubject.MATHEMATICS && keyStage === UKKeyStage.KS2) {
      nodes = [
        {
          id: 'node-1',
          title: 'Number and Place Value',
          description: 'Understanding the value of digits in numbers',
          type: 'topic',
          completed: true,
          proficiencyLevel: ProficiencyLevel.SECURE,
          lastPracticed: '2025-05-20T10:30:00Z',
          prerequisites: []
        },
        {
          id: 'node-2',
          title: 'Addition and Subtraction',
          description: 'Methods for adding and subtracting numbers',
          type: 'topic',
          completed: true,
          proficiencyLevel: ProficiencyLevel.MASTERED,
          lastPracticed: '2025-05-22T14:15:00Z',
          prerequisites: ['node-1']
        },
        {
          id: 'node-3',
          title: 'Multiplication and Division',
          description: 'Methods for multiplying and dividing numbers',
          type: 'topic',
          completed: true,
          proficiencyLevel: ProficiencyLevel.DEVELOPING,
          lastPracticed: '2025-05-29T09:45:00Z',
          prerequisites: ['node-1']
        },
        {
          id: 'node-4',
          title: 'Fractions and Decimals',
          description: 'Understanding parts of numbers and decimal notation',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-2', 'node-3']
        },
        {
          id: 'node-5',
          title: 'Measurement',
          description: 'Understanding and using standard units of measurement',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-4']
        },
        {
          id: 'node-6',
          title: 'Geometry - Properties of Shapes',
          description: 'Identifying and describing properties of 2D and 3D shapes',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-4']
        },
        {
          id: 'node-7',
          title: 'Geometry - Position and Direction',
          description: 'Describing position, direction and movement',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-6']
        },
        {
          id: 'node-8',
          title: 'Statistics',
          description: 'Interpreting and presenting data',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-4']
        }
      ];
    } else {
      // Generic nodes for other subjects/key stages
      nodes = [
        {
          id: 'node-1',
          title: 'Introduction to ' + subject,
          description: 'Basic concepts and principles',
          type: 'topic',
          completed: true,
          proficiencyLevel: ProficiencyLevel.SECURE,
          lastPracticed: '2025-05-15T10:30:00Z',
          prerequisites: []
        },
        {
          id: 'node-2',
          title: 'Core Skills in ' + subject,
          description: 'Essential skills and techniques',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.DEVELOPING,
          lastPracticed: '2025-05-20T14:15:00Z',
          prerequisites: ['node-1']
        },
        {
          id: 'node-3',
          title: 'Advanced Concepts in ' + subject,
          description: 'More complex ideas and applications',
          type: 'topic',
          completed: false,
          proficiencyLevel: ProficiencyLevel.BEGINNING,
          lastPracticed: null,
          prerequisites: ['node-2']
        }
      ];
    }
    
    return {
      id: `path-${subject}-${keyStage}`,
      title: `${subject} for ${keyStage}`,
      description: `Personalized learning path for ${subject} at ${keyStage} level`,
      subject: subject,
      keyStage: keyStage,
      nodes: nodes,
      createdAt: '2025-05-01T00:00:00Z',
      updatedAt: '2025-05-30T00:00:00Z'
    };
  };
  
  // Generate mock recommended content
  const generateMockRecommendedContent = (subject, keyStage, learningStyle, recentConcepts = []) => {
    // Base content items
    const baseItems = [
      {
        id: 'content-1',
        title: 'Understanding Fractions',
        description: 'Learn about fractions and their properties',
        type: 'lesson',
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        relevance: 'high',
        learningStyles: [LearningStyle.VISUAL, LearningStyle.READ_WRITE]
      },
      {
        id: 'content-2',
        title: 'Decimal Place Value',
        description: 'Explore the place value system with decimals',
        type: 'interactive',
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        relevance: 'high',
        learningStyles: [LearningStyle.VISUAL, LearningStyle.KINESTHETIC]
      },
      {
        id: 'content-3',
        title: 'Converting Fractions to Decimals',
        description: 'Learn how to convert between fractions and decimals',
        type: 'video',
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        relevance: 'medium',
        learningStyles: [LearningStyle.VISUAL, LearningStyle.AUDITORY]
      },
      {
        id: 'content-4',
        title: 'Fraction Word Problems',
        description: 'Practice solving word problems involving fractions',
        type: 'practice',
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        relevance: 'medium',
        learningStyles: [LearningStyle.READ_WRITE, LearningStyle.KINESTHETIC]
      },
      {
        id: 'content-5',
        title: 'Comparing Fractions and Decimals',
        description: 'Learn how to compare and order fractions and decimals',
        type: 'assessment',
        subject: UKSubject.MATHEMATICS,
        keyStage: UKKeyStage.KS2,
        relevance: 'low',
        learningStyles: [LearningStyle.VISUAL, LearningStyle.READ_WRITE]
      }
    ];
    
    // Filter based on subject and key stage
    let filteredItems = baseItems.filter(item => 
      item.subject === subject && item.keyStage === keyStage
    );
    
    // If no items match, return all items
    if (filteredItems.length === 0) {
      filteredItems = baseItems;
    }
    
    // Prioritize items matching the learning style
    filteredItems.sort((a, b) => {
      const aMatchesStyle = a.learningStyles.includes(learningStyle);
      const bMatchesStyle = b.learningStyles.includes(learningStyle);
      
      if (aMatchesStyle && !bMatchesStyle) return -1;
      if (!aMatchesStyle && bMatchesStyle) return 1;
      return 0;
    });
    
    // Adjust relevance based on recent concepts
    if (recentConcepts && recentConcepts.length > 0) {
      filteredItems = filteredItems.map(item => {
        // Check if item title matches any recent concepts
        const matchesConcept = recentConcepts.some(concept => 
          item.title.toLowerCase().includes(concept.toLowerCase())
        );
        
        // Increase relevance if matches
        if (matchesConcept) {
          return {
            ...item,
            relevance: 'high'
          };
        }
        
        return item;
      });
    }
    
    return filteredItems;
  };
  
  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Render proficiency level badge
  const renderProficiencyBadge = (level) => {
    switch (level) {
      case ProficiencyLevel.BEGINNING:
        return <Badge variant="outline">Beginning</Badge>;
      case ProficiencyLevel.DEVELOPING:
        return <Badge variant="secondary">Developing</Badge>;
      case ProficiencyLevel.SECURE:
        return <Badge variant="default">Secure</Badge>;
      case ProficiencyLevel.MASTERED:
        return <Badge className="bg-green-500">Mastered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Render content type icon
  const renderContentTypeIcon = (type) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'interactive':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'video':
        return <Brain className="h-4 w-4 text-red-500" />;
      case 'practice':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'assessment':
        return <LineChart className="h-4 w-4 text-green-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Brain className="h-12 w-12 text-primary animate-pulse mb-4" />
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Loading your personalized tutoring system...
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Brain className="h-6 w-6 mr-2 text-primary" />
              AI Tutoring System
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Personalized tutoring and learning support
            </p>
          </div>
          
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Progress */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Your progress in {learningPath?.subject} for {learningPath?.keyStage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Overall Progress</h3>
                      <span className="text-sm text-gray-500">
                        {learningProgress.completedNodes}/{learningProgress.totalNodes} topics completed
                      </span>
                    </div>
                    <Progress 
                      value={(learningProgress.completedNodes / learningProgress.totalNodes) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Proficiency Level */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Average Proficiency</h3>
                      <span className="text-sm text-gray-500">
                        {Math.round(learningProgress.averageProficiency)}%
                      </span>
                    </div>
                    <Progress 
                      value={learningProgress.averageProficiency} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Concept Mastery */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Concept Mastery</h3>
                      <span className="text-sm text-gray-500">
                        {learningProgress.masteredConcepts}/{learningProgress.totalConcepts} concepts mastered
                      </span>
                    </div>
                    <Progress 
                      value={(learningProgress.masteredConcepts / learningProgress.totalConcepts) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                {/* Current Topic */}
                {currentNode && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Current Focus Topic</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{currentNode.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentNode.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        {renderProficiencyBadge(currentNode.proficiencyLevel)}
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => startTutoringSession(currentNode.title, learningPath.subject, learningPath.keyStage)}
                        >
                          Start Tutoring
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  Your latest tutoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {sessionHistory.slice(0, 3).map(session => (
                      <div 
                        key={session.id}
                        className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{session.topic}</h4>
                          <Badge variant="outline">{session.date}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{Math.round(session.duration / 60)} minutes</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {session.conceptsCovered.map((concept, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center mt-3 text-sm text-green-600 dark:text-green-400">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span>+{session.proficiencyGain}% proficiency gain</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No sessions yet</p>
                    <p className="text-sm mt-1">Start a tutoring session to see your history</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('progress')}
                >
                  View All Sessions
                </Button>
              </CardFooter>
            </Card>
            
            {/* Recommended Content */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recommended Learning Content</CardTitle>
                <CardDescription>
                  Personalized content based on your learning style and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedContent.map(content => (
                    <div 
                      key={content.id}
                      className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                      onClick={() => {
                        toast({
                          title: 'Content selected',
                          description: `Opening ${content.title}`,
                        });
                      }}
                    >
                      <div className="flex items-center mb-2">
                        {renderContentTypeIcon(content.type)}
                        <Badge 
                          variant={
                            content.relevance === 'high' ? 'default' : 
                            content.relevance === 'medium' ? 'secondary' : 
                            'outline'
                          }
                          className="ml-2 text-xs"
                        >
                          {content.relevance} relevance
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{content.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {content.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {content.type}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Refresh recommended content
                    const newRecommendedContent = generateMockRecommendedContent(
                      initialSubject, 
                      initialKeyStage, 
                      studentProfile.learningStyle
                    );
                    
                    setRecommendedContent(newRecommendedContent);
                    
                    toast({
                      title: 'Recommendations refreshed',
                      description: 'Your content recommendations have been updated.',
                    });
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Recommendations
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tutoring Tab */}
        <TabsContent value="tutoring">
          {currentSession ? (
            <AITutoringSession
              initialSubject={currentSession.subject}
              initialTopic={currentSession.topic}
              initialKeyStage={currentSession.keyStage}
              initialLearningStyle={studentProfile.learningStyle}
              initialProficiencyLevel={currentSession.proficiencyLevel}
              onSessionComplete={completeTutoringSession}
              onSessionSave={(sessionData) => {
                toast({
                  title: 'Session saved',
                  description: 'Your tutoring session progress has been saved.',
                });
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Start a Tutoring Session</CardTitle>
                  <CardDescription>
                    Get personalized tutoring on your current learning topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningPath && learningPath.nodes
                      .filter(node => !node.completed)
                      .slice(0, 3)
                      .map(node => (
                        <div 
                          key={node.id}
                          className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          onClick={() => startTutoringSession(node.title, learningPath.subject, learningPath.keyStage)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{node.title}</h4>
                            {renderProficiencyBadge(node.proficiencyLevel)}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                            {node.description}
                          </p>
                          <Button size="sm" className="w-full">
                            Start Tutoring
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Explore Concepts</CardTitle>
                  <CardDescription>
                    Get in-depth explanations of specific concepts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedContent.slice(0, 3).map(content => (
                      <div 
                        key={content.id}
                        className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab('concepts');
                        }}
                      >
                        <div className="flex items-center mb-1">
                          {renderContentTypeIcon(content.type)}
                          <h4 className="font-medium ml-2">{content.title}</h4>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {content.description}
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Explore Concept
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Concepts Tab */}
        <TabsContent value="concepts">
          <NaturalLanguageConceptExplainer
            subject={initialSubject}
            topic={currentNode ? currentNode.title : 'General Topics'}
            keyStage={initialKeyStage}
            learningStyle={studentProfile.learningStyle}
            proficiencyLevel={currentNode ? currentNode.proficiencyLevel : ProficiencyLevel.DEVELOPING}
            onExplanationComplete={(data) => {
              toast({
                title: 'Concept explored',
                description: 'Your concept exploration has been saved to your learning history.',
              });
            }}
          />
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Path Progress */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Learning Path Progress</CardTitle>
                <CardDescription>
                  Your progress through {learningPath?.subject} for {learningPath?.keyStage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningPath && learningPath.nodes.map(node => (
                    <div 
                      key={node.id}
                      className={`p-4 rounded-lg ${
                        node.completed 
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
                          : 'bg-gray-50 dark:bg-neutral-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {node.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <h4 className="font-medium">{node.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {node.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {renderProficiencyBadge(node.proficiencyLevel)}
                          {node.lastPracticed && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Last practiced: {new Date(node.lastPracticed).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!node.completed && (
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => startTutoringSession(node.title, learningPath.subject, learningPath.keyStage)}
                        >
                          Start Tutoring
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Analytics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Proficiency Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {sessionHistory.map(session => (
                        <div 
                          key={session.id}
                          className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{session.topic}</h4>
                            <Badge variant="outline">{session.date}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{Math.round(session.duration / 60)} minutes</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {session.conceptsCovered.map((concept, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center mt-3 text-sm text-green-600 dark:text-green-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>+{session.proficiencyGain}% proficiency gain</span>
                          </div>
                        </div>
                      ))}
                      
                      {sessionHistory.length === 0 && (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No session history</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            {/* Learning Insights */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>
                  AI-generated insights based on your learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">Strengths</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Strong understanding of addition and subtraction concepts</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Good progress in number and place value</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Consistent engagement with learning materials</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-medium">Focus Areas</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>More practice needed with fractions and decimals</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>Review multiplication with larger numbers</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>Work on applying concepts to word problems</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
                    <div className="flex items-center mb-2">
                      <Layers className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium">Learning Patterns</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>You learn best with visual examples and diagrams</span>
                      </li>
                      <li className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>Most productive learning sessions are 15-20 minutes</span>
                      </li>
                      <li className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span>You benefit from regular practice with new concepts</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AITutoringSystemIntegration;
