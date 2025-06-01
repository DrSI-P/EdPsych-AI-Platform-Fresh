'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Sword, 
  Map, 
  Trophy, 
  Star, 
  BookOpen, 
  Users, 
  Compass, 
  Sparkles,
  Award,
  Backpack,
  Scroll,
  Zap,
  Heart,
  Brain,
  Lightbulb,
  Puzzle,
  Milestone,
  Hourglass,
  BarChart,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';
import { useFairUsage } from '../subscription/fair-usage';
import { useCurriculum } from '../curriculum/curriculum-context';
import { useGamification } from '../gamification/gamification-context';
import { useAssessment } from '../assessment/assessment-context';
import { useUserProfile } from '../user/user-profile-context';
import { mockCharacter, mockQuests, learningStyles } from './mock-data';

// Component imports
import CharacterCreation from './character-creation';
import QuestDetail from './quest-detail';
import QuestHub from './quest-hub';
import CharacterDashboard from './character-dashboard';

// Types
interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  attributes: {
    intelligence: number;
    creativity: number;
    persistence: number;
    curiosity: number;
  };
  inventory: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  keyStage: string;
  difficulty: string;
  duration: number;
  xpReward: number;
  objectives: string[];
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    type: string;
    options?: string[];
    correctAnswer?: string;
    minScore?: number;
  }>;
}

interface GenerationParams {
  subject: string;
  difficulty: string;
  duration: number;
  learningStyle: string;
}

interface CompletedQuest extends Quest {
  completedAt: string;
  results?: any;
}

// Custom hook for feature credit usage
const useFeatureWithCredit = (featureName: string): Promise<{ success: boolean; usedCredits: boolean }> => {
  // This would normally check if the user has credits or subscription access
  return Promise.resolve({ success: true, usedCredits: false });
};

// AdventureQuestSaga component
export const AdventureQuestSagaAdaptive = (): JSX.Element => {
  const { toast } = useToast();
  const { fairUsage } = useFairUsage();
  const { curriculum } = useCurriculum();
  const { gamification } = useGamification();
  const { assessment } = useAssessment();
  const { userProfile } = useUserProfile();
  
  // State for character
  const [character, setCharacter] = useState<Character | null>(null);
  
  // State for quests
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>([]);
  
  // State for UI
  const [view, setView] = useState<'creation' | 'hub' | 'quest' | 'history' | 'generate'>('hub');
  const [generating, setGenerating] = useState<boolean>(false);
  
  // State for quest generation parameters
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    subject: 'Mathematics',
    difficulty: 'beginner',
    duration: 20,
    learningStyle: 'visual'
  });
  
  // Generate quest based on user profile and learning history
  const generateAdaptiveQuest = async (): Promise<void> => {
    try {
      setGenerating(true);
      
      // In a real implementation, this would call an API to check credits
      const usageResult = { success: true, usedCredits: false };
      
      if (!usageResult.success && !usageResult.usedCredits) {
        // If feature cannot be used and credits weren't used, exit
        setGenerating(false);
        return;
      }
      
      // In a real implementation, this would call an AI service to generate a quest
      // For now, simulate with a timeout and mock data
      setTimeout(() => {
        // Generate quest based on user profile, learning history, and parameters
        const generatedQuest = createAdaptiveQuest(
          userProfile, 
          [], // Empty array instead of undefined learningHistory
          assessment?.results || [], 
          generationParams,
          curriculum
        );
        
        onQuestGenerated(generatedQuest);
        
        toast({
          title: "Quest Generated",
          description: `"${generatedQuest.title}" has been created based on your learning profile`,
        });
        
        setGenerating(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating adaptive quest:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your quest. Please try again.",
      });
      setGenerating(false);
    }
  };
  
  // Create adaptive quest based on user data
  const createAdaptiveQuest = (
    userProfile: any, 
    learningHistory: any[], 
    assessmentResults: any[], 
    params: GenerationParams,
    curriculumContext: any
  ): Quest => {
    // In a real implementation, this would use AI to generate a quest
    // For now, return a mock quest
    return {
      id: `quest-${Date.now()}`,
      title: `${params.subject} Adventure: ${params.difficulty.charAt(0).toUpperCase() + params.difficulty.slice(1)} Level`,
      description: `An adaptive quest designed for ${params.learningStyle} learners focusing on ${params.subject}.`,
      subject: params.subject,
      keyStage: 'KS2',
      difficulty: params.difficulty,
      duration: params.duration,
      xpReward: params.difficulty === 'beginner' ? 100 : params.difficulty === 'intermediate' ? 200 : 300,
      objectives: [
        `Understand key concepts in ${params.subject}`,
        `Apply knowledge through interactive challenges`,
        `Reflect on learning through adaptive feedback`
      ],
      challenges: [
        {
          id: 'c1',
          title: 'Knowledge Check',
          description: 'Test your understanding of key concepts',
          content: `This challenge will assess your knowledge of ${params.subject}`,
          type: 'multiple-choice',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 'Option 2'
        },
        {
          id: 'c2',
          title: 'Application Challenge',
          description: 'Apply your knowledge to solve a problem',
          content: `Use what you've learned about ${params.subject} to complete this challenge`,
          type: 'interactive',
          minScore: 70
        }
      ]
    };
  };
  
  // Handle quest generation
  const onQuestGenerated = (quest: Quest): void => {
    setQuests([...quests, quest]);
  };
  
  // Handle quest selection
  const handleSelectQuest = (quest: Quest): void => {
    setActiveQuest(quest);
    setView('quest');
  };
  
  // Handle quest completion
  const handleCompleteQuest = (quest: Quest, results: any): void => {
    // Add quest to completed quests
    setCompletedQuests([...completedQuests, {
      ...quest,
      completedAt: new Date().toISOString(),
      results
    }]);
    
    // Remove from active quests
    setQuests(quests.filter(q => q.id !== quest.id));
    
    // Award XP to character
    if (character) {
      setCharacter({
        ...character,
        xp: character.xp + quest.xpReward,
        level: calculateLevel(character.xp + quest.xpReward)
      });
    }
    
    // Show success message
    toast({
      title: "Quest Completed!",
      description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
    });
    
    // Return to hub
    setActiveQuest(null);
    setView('hub');
  };
  
  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    // Simple level calculation: level = 1 + floor(xp / 1000)
    return 1 + Math.floor(xp / 1000);
  };
  
  // Handle character creation
  const handleCreateCharacter = (newCharacter: Character): void => {
    setCharacter(newCharacter);
    setView('hub');
    
    toast({
      title: "Character Created",
      description: `Welcome, ${newCharacter.name}! Your adventure begins now.`,
    });
  };
  
  // Handle parameter change
  const handleParamChange = (param: string, value: any): void => {
    setGenerationParams({
      ...generationParams,
      [param]: value
    });
  };
  
  // Initialize data on component mount
  useEffect(() => {
    // Initialize character if not exists
    if (!character) {
      setCharacter(mockCharacter as Character);
    }
    
    // Initialize quests
    setQuests(mockQuests as Quest[]);
    
    // Initialize completed quests
    setCompletedQuests([
      {
        id: 'cq1',
        title: 'The Number Navigator',
        subject: 'Mathematics',
        difficulty: 'beginner',
        xpReward: 150,
        completedAt: '2023-01-15T12:30:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      },
      {
        id: 'cq2',
        title: 'Word Wizards',
        subject: 'English',
        difficulty: 'intermediate',
        xpReward: 200,
        completedAt: '2023-02-10T14:45:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      },
      {
        id: 'cq3',
        title: 'Science Explorers',
        subject: 'Science',
        difficulty: 'beginner',
        xpReward: 125,
        completedAt: '2023-03-05T09:20:00Z',
        objectives: [],
        challenges: [],
        description: '',
        keyStage: '',
        duration: 0
      }
    ]);
  }, []);
  
  // Render character creation view
  const renderCharacterCreation = (): JSX.Element => {
    return (
      <div className="adventure-quest-character-creation">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sword className="mr-2" /> Create Your Character
            </CardTitle>
            <CardDescription>
              Customize your character to begin your learning adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="character-name">Character Name</Label>
                <Input id="character-name" placeholder="Enter your character name" />
              </div>
              
              <div>
                <Label>Learning Style</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {learningStyles.map((style) => (
                    <Card key={style.id} className="cursor-pointer hover:bg-accent transition-colors">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{style.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Attributes</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Intelligence</Label>
                    <div className="flex items-center">
                      <Brain className="mr-2 h-4 w-4" />
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Creativity</Label>
                    <div className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Persistence</Label>
                    <div className="flex items-center">
                      <Milestone className="mr-2 h-4 w-4" />
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Curiosity</Label>
                    <div className="flex items-center">
                      <Puzzle className="mr-2 h-4 w-4" />
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleCreateCharacter({
                id: 'char1',
                name: 'Alex',
                level: 1,
                xp: 0,
                xpToNextLevel: 1000,
                attributes: {
                  intelligence: 6,
                  creativity: 8,
                  persistence: 5,
                  curiosity: 9
                },
                inventory: [],
                achievements: []
              })}
              className="w-full"
            >
              Begin Adventure
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest hub view
  const renderQuestHub = (): JSX.Element => {
    return (
      <div className="adventure-quest-hub">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Map className="mr-2" /> Available Quests
                </CardTitle>
                <CardDescription>
                  Choose a quest to begin or generate a new adaptive quest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quests.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-4">No quests available. Generate a new quest to begin.</p>
                    <Button onClick={() => setView('generate')} disabled={generating}>
                      {generating ? 'Generating...' : 'Generate New Quest'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quests.map((quest) => (
                      <Card key={quest.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                            <Badge variant={
                              quest.difficulty === 'beginner' ? 'outline' : 
                              quest.difficulty === 'intermediate' ? 'secondary' : 
                              'destructive'
                            }>
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{quest.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <BookOpen className="mr-1 h-4 w-4" />
                              <span>{quest.subject}</span>
                            </div>
                            <div className="flex items-center">
                              <Hourglass className="mr-1 h-4 w-4" />
                              <span>{quest.duration} min</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4" />
                              <span>{quest.xpReward} XP</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            onClick={() => handleSelectQuest(quest)}
                            variant="outline"
                            className="w-full"
                          >
                            Begin Quest
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setView('history')}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Quest History
                </Button>
                <Button onClick={() => setView('generate')} disabled={generating}>
                  {generating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate New Quest
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Users className="mr-2" /> Character Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {character && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{character.name}</h3>
                        <p className="text-sm text-muted-foreground">Level {character.level} Explorer</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Experience</span>
                        <span>{character.xp} / {character.xpToNextLevel}</span>
                      </div>
                      <Progress value={(character.xp / character.xpToNextLevel) * 100} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Attributes</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Intelligence</span>
                            <span>{character.attributes.intelligence}/10</span>
                          </div>
                          <Progress value={character.attributes.intelligence * 10} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Creativity</span>
                            <span>{character.attributes.creativity}/10</span>
                          </div>
                          <Progress value={character.attributes.creativity * 10} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Persistence</span>
                            <span>{character.attributes.persistence}/10</span>
                          </div>
                          <Progress value={character.attributes.persistence * 10} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Curiosity</span>
                            <span>{character.attributes.curiosity}/10</span>
                          </div>
                          <Progress value={character.attributes.curiosity * 10} className="h-1" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Stats</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Trophy className="mr-1 h-4 w-4 text-yellow-500" />
                          <span>Quests: {completedQuests.length}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="mr-1 h-4 w-4 text-purple-500" />
                          <span>Achievements: {character.achievements.length}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-amber-500" />
                          <span>Total XP: {character.xp}</span>
                        </div>
                        <div className="flex items-center">
                          <Backpack className="mr-1 h-4 w-4 text-emerald-500" />
                          <span>Items: {character.inventory.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Scroll className="mr-2 h-4 w-4" />
                  View Full Profile
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Activity className="mr-2" /> Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Subject Mastery</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mathematics</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>English</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Science</span>
                          <span>82%</span>
                        </div>
                        <Progress value={82} className="h-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Recent Activity</h4>
                    <div className="space-y-2">
                      {completedQuests.slice(0, 3).map((quest) => (
                        <div key={quest.id} className="flex justify-between items-center text-sm">
                          <span className="truncate">{quest.title}</span>
                          <Badge variant="outline">{quest.xpReward} XP</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  // Render quest detail view
  const renderQuestDetail = (): JSX.Element => {
    if (!activeQuest) return <div>No quest selected</div>;
    
    return (
      <div className="adventure-quest-detail">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{activeQuest.title}</CardTitle>
                <CardDescription>{activeQuest.description}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => { setActiveQuest(null); setView('hub'); }}>
                Back to Hub
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {activeQuest.subject}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {activeQuest.keyStage}
                </Badge>
                <Badge variant={
                  activeQuest.difficulty === 'beginner' ? 'outline' : 
                  activeQuest.difficulty === 'intermediate' ? 'secondary' : 
                  'destructive'
                } className="flex items-center">
                  <Zap className="mr-1 h-4 w-4" />
                  {activeQuest.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Hourglass className="mr-1 h-4 w-4" />
                  {activeQuest.duration} minutes
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  {activeQuest.xpReward} XP
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Objectives</h3>
                <ul className="space-y-1">
                  {activeQuest.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Challenges</h3>
                <div className="space-y-4">
                  {activeQuest.challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{challenge.content}</p>
                        
                        {challenge.type === 'multiple-choice' && challenge.options && (
                          <div className="mt-4 space-y-2">
                            {challenge.options.map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input 
                                  type="radio" 
                                  id={`option-${index}`} 
                                  name={`challenge-${challenge.id}`} 
                                  className="h-4 w-4"
                                />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => { setActiveQuest(null); setView('hub'); }}>
              Cancel Quest
            </Button>
            <Button onClick={() => handleCompleteQuest(activeQuest, { score: 85, completed: true })}>
              Complete Quest
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render quest history view
  const renderQuestHistory = (): JSX.Element => {
    return (
      <div className="adventure-quest-history">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="mr-2" /> Quest History
                </CardTitle>
                <CardDescription>
                  Review your completed quests and achievements
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setView('hub')}>
                Back to Hub
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {completedQuests.length === 0 ? (
              <div className="text-center p-6 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">You haven't completed any quests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedQuests.map((quest) => (
                  <Card key={quest.id}>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                        <Badge variant="outline">{quest.xpReward} XP</Badge>
                      </div>
                      <CardDescription>
                        Completed on {new Date(quest.completedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center">
                          <BookOpen className="mr-1 h-4 w-4" />
                          {quest.subject}
                        </Badge>
                        <Badge variant={
                          quest.difficulty === 'beginner' ? 'outline' : 
                          quest.difficulty === 'intermediate' ? 'secondary' : 
                          'destructive'
                        } className="flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          {quest.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render quest generation view
  const renderQuestGeneration = (): JSX.Element => {
    return (
      <div className="adventure-quest-generation">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="mr-2" /> Generate Adaptive Quest
                </CardTitle>
                <CardDescription>
                  Create a personalized learning quest tailored to your needs
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setView('hub')}>
                Back to Hub
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={generationParams.subject} 
                  onValueChange={(value) => handleParamChange('subject', value)}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={generationParams.difficulty} 
                  onValueChange={(value) => handleParamChange('difficulty', value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select 
                  value={generationParams.duration.toString()} 
                  onValueChange={(value) => handleParamChange('duration', parseInt(value))}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="learning-style">Learning Style</Label>
                <Select 
                  value={generationParams.learningStyle} 
                  onValueChange={(value) => handleParamChange('learningStyle', value)}
                >
                  <SelectTrigger id="learning-style">
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditory">Auditory</SelectItem>
                    <SelectItem value="reading">Reading/Writing</SelectItem>
                    <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setView('hub')}>
              Cancel
            </Button>
            <Button onClick={generateAdaptiveQuest} disabled={generating}>
              {generating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quest
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render the appropriate view
  const renderView = (): JSX.Element => {
    switch (view) {
      case 'creation':
        return renderCharacterCreation();
      case 'hub':
        return renderQuestHub();
      case 'quest':
        return renderQuestDetail();
      case 'history':
        return renderQuestHistory();
      case 'generate':
        return renderQuestGeneration();
      default:
        return renderQuestHub();
    }
  };
  
  return (
    <div className="adventure-quest-saga container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Adventure Quest Saga</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Learn through adaptive, personalized quests
          </p>
        </div>
      </div>
      
      {renderView()}
    </div>
  );
};

export default AdventureQuestSagaAdaptive;
