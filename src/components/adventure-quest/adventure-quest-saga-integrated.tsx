'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
  Compass, 
  Sparkles,
  Award,
  Backpack,
  Scroll,
  Zap,
  Brain,
  Lightbulb,
  Puzzle,
  Milestone,
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

// AdventureQuestSagaIntegrated component
export const AdventureQuestSagaIntegrated = (): JSX.Element => {
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
  const [view, setView] = useState<'creation' | 'hub' | 'quest' | 'history' | 'generate' | 'character'>('hub');
  const [generating, setGenerating] = useState<boolean>(false);
  
  // State for quest generation parameters
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    subject: 'Mathematics',
    difficulty: 'beginner',
    duration: 20,
    learningStyle: 'visual'
  });
  
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
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{quest.subject}</Badge>
                            <Badge variant="outline">{quest.keyStage}</Badge>
                            <Badge variant="outline">{quest.duration} mins</Badge>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                              <span className="text-sm">{quest.xpReward} XP</span>
                            </div>
                            <Button size="sm" onClick={() => handleSelectQuest(quest)}>
                              Start Quest
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setView('generate')} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate New Quest'}
                </Button>
                <Button variant="outline" onClick={() => setView('history')}>
                  Quest History
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Sword className="mr-2" /> {character?.name || 'Character'}
                </CardTitle>
                <CardDescription>
                  Level {character?.level || 1} Adventurer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>XP: {character?.xp || 0}</span>
                      <span>{character?.xpToNextLevel || 1000} to level {(character?.level || 1) + 1}</span>
                    </div>
                    <Progress value={(character?.xp || 0) / (character?.xpToNextLevel || 1000) * 100} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Attributes</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Brain className="mr-1 h-3 w-3" /> Intelligence
                          </span>
                          <span>{character?.attributes?.intelligence || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.intelligence || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Lightbulb className="mr-1 h-3 w-3" /> Creativity
                          </span>
                          <span>{character?.attributes?.creativity || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.creativity || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Milestone className="mr-1 h-3 w-3" /> Persistence
                          </span>
                          <span>{character?.attributes?.persistence || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.persistence || 0) * 10} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Puzzle className="mr-1 h-3 w-3" /> Curiosity
                          </span>
                          <span>{character?.attributes?.curiosity || 0}/10</span>
                        </div>
                        <Progress value={(character?.attributes?.curiosity || 0) * 10} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                    {character?.achievements && character.achievements.length > 0 ? (
                      <div className="space-y-2">
                        {character.achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className="flex items-start">
                            <Award className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">{achievement.name}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Complete quests to earn achievements</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setView('character')}>
                  View Character
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  // Render quest detail view
  const renderQuestDetail = (): JSX.Element | null => {
    if (!activeQuest) return null;
    
    return (
      <div className="adventure-quest-detail">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Scroll className="mr-2" /> {activeQuest.title}
                </CardTitle>
                <CardDescription>{activeQuest.description}</CardDescription>
              </div>
              <Badge variant={
                activeQuest.difficulty === 'beginner' ? 'outline' : 
                activeQuest.difficulty === 'intermediate' ? 'secondary' : 
                'destructive'
              }>
                {activeQuest.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{activeQuest.subject}</Badge>
                <Badge variant="outline">{activeQuest.keyStage}</Badge>
                <Badge variant="outline">{activeQuest.duration} mins</Badge>
                <Badge variant="outline" className="flex items-center">
                  <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                  {activeQuest.xpReward} XP
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Objectives</h3>
                <ul className="space-y-1">
                  {activeQuest.objectives.map((objective, index) => (
                    <li key={`objective-${index}`} className="flex items-start">
                      <Star className="h-4 w-4 mr-2 text-yellow-500 mt-1" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Challenges</h3>
                <div className="space-y-4">
                  {activeQuest.challenges.map((challenge, index) => (
                    <Card key={challenge.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-md flex items-center">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            {index + 1}
                          </span>
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p>{challenge.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setActiveQuest(null);
              setView('hub');
            }}>
              Back to Hub
            </Button>
            <Button onClick={() => handleCompleteQuest(activeQuest, {
              score: 85,
              timeSpent: '15 minutes',
              completedChallenges: activeQuest.challenges.length
            })}>
              Complete Quest
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Render main component
  return (
    <div className="adventure-quest-saga p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Sword className="mr-2" /> Adventure Quest Saga
          </h1>
          <p className="text-muted-foreground">
            Embark on personalized learning quests tailored to your learning style and curriculum needs
          </p>
        </div>
        
        {view === 'hub' && renderQuestHub()}
        {view === 'quest' && renderQuestDetail()}
      </div>
    </div>
  );
};
