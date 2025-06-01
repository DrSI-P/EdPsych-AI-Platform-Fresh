'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Check, 
  Clock, 
  FileText, 
  Info, 
  RefreshCw, 
  Target, 
  ThumbsUp, 
  Zap 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function EmotionalRegulationEngine() {
  const { toast } = useToast();
  
  // State for current emotion
  const [currentEmotion, setCurrentEmotion] = useState({
    name: "",
    intensity: 5,
    triggers: "",
    bodyFeelings: [],
    thoughts: ""
  });
  
  const [strategies, setStrategies] = useState([]);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionJournal, setEmotionJournal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic emotions with UK spelling
  const basicEmotions = [
    { name: "Happy", color: "#FFD700", icon: "😊" },
    { name: "Sad", color: "#6495ED", icon: "😢" },
    { name: "Angry", color: "#FF4500", icon: "😠" },
    { name: "Scared", color: "#9370DB", icon: "😨" },
    { name: "Disgusted", color: "#32CD32", icon: "🤢" },
    { name: "Surprised", color: "#FF69B4", icon: "😲" },
    { name: "Calm", color: "#87CEEB", icon: "😌" },
    { name: "Worried", color: "#D3D3D3", icon: "😟" },
    { name: "Confused", color: "#DDA0DD", icon: "😕" },
    { name: "Excited", color: "#FFA500", icon: "🤩" }
  ];
  
  // Complex emotions
  const complexEmotions = [
    { name: "Anxious", color: "#D3D3D3", icon: "😰" },
    { name: "Frustrated", color: "#CD5C5C", icon: "😤" },
    { name: "Overwhelmed", color: "#9370DB", icon: "😩" },
    { name: "Embarrassed", color: "#FF69B4", icon: "😳" },
    { name: "Proud", color: "#FFD700", icon: "😎" },
    { name: "Jealous", color: "#32CD32", icon: "😒" },
    { name: "Guilty", color: "#6495ED", icon: "😔" },
    { name: "Hopeful", color: "#87CEEB", icon: "🙂" },
    { name: "Disappointed", color: "#CD853F", icon: "😞" },
    { name: "Grateful", color: "#FFD700", icon: "🙏" }
  ];
  
  // Body feelings
  const bodyFeelings = [
    { name: "Racing heart", area: "chest" },
    { name: "Tight chest", area: "chest" },
    { name: "Butterflies", area: "stomach" },
    { name: "Tense muscles", area: "muscles" },
    { name: "Sweaty palms", area: "hands" },
    { name: "Headache", area: "head" },
    { name: "Tired", area: "whole body" },
    { name: "Shaky", area: "whole body" },
    { name: "Hot face", area: "face" },
    { name: "Clenched jaw", area: "face" }
  ];
  
  // Regulation strategies
  const regulationStrategies = [
    {
      id: 1,
      name: "Deep breathing",
      description: "Take 5 slow, deep breaths, counting to 4 on the inhale and 6 on the exhale.",
      suitable: ["Angry", "Anxious", "Overwhelmed", "Scared", "Worried"],
      difficulty: "easy",
      timeNeeded: "1-2 minutes"
    },
    {
      id: 2,
      name: "5-4-3-2-1 Grounding",
      description: "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      suitable: ["Anxious", "Overwhelmed", "Worried", "Scared"],
      difficulty: "medium",
      timeNeeded: "3-5 minutes"
    },
    {
      id: 3,
      name: "Progressive muscle relaxation",
      description: "Tense and then relax each muscle group in your body, starting from your toes and working up to your head.",
      suitable: ["Anxious", "Tense", "Worried", "Angry"],
      difficulty: "medium",
      timeNeeded: "5-10 minutes"
    },
    {
      id: 4,
      name: "Positive self-talk",
      description: "Replace negative thoughts with positive, realistic statements.",
      suitable: ["Sad", "Disappointed", "Guilty", "Embarrassed"],
      difficulty: "medium",
      timeNeeded: "ongoing"
    },
    {
      id: 5,
      name: "Emotion journaling",
      description: "Write down your feelings, what triggered them, and how you responded.",
      suitable: ["All emotions"],
      difficulty: "medium",
      timeNeeded: "5-15 minutes"
    }
  ];
  
  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call to load user's emotion history and strategies
        // In a real implementation, this would fetch from a database
        setTimeout(() => {
          setEmotionHistory([
            { 
              name: "Anxious", 
              intensity: 7, 
              date: "2025-05-20T09:30:00", 
              triggers: "Upcoming presentation",
              strategies: ["Deep breathing", "5-4-3-2-1 Grounding"]
            },
            { 
              name: "Happy", 
              intensity: 8, 
              date: "2025-05-19T15:45:00", 
              triggers: "Received good feedback",
              strategies: []
            },
            { 
              name: "Frustrated", 
              intensity: 6, 
              date: "2025-05-18T11:20:00", 
              triggers: "Technology not working",
              strategies: ["Deep breathing", "Positive self-talk"]
            }
          ]);
          
          setEmotionJournal([
            {
              id: 1,
              date: "2025-05-20T09:45:00",
              emotion: "Anxious",
              intensity: 7,
              triggers: "Upcoming presentation to the whole school",
              bodyFeelings: ["Racing heart", "Butterflies", "Sweaty palms"],
              thoughts: "I'm worried I'll forget what to say or that people will judge me.",
              strategies: ["Deep breathing", "5-4-3-2-1 Grounding"],
              outcome: "Reduced anxiety to a 4/10, felt more prepared."
            },
            {
              id: 2,
              date: "2025-05-18T11:30:00",
              emotion: "Frustrated",
              intensity: 6,
              triggers: "Computer crashed during lesson preparation",
              bodyFeelings: ["Tense muscles", "Headache"],
              thoughts: "This always happens at the worst time!",
              strategies: ["Deep breathing", "Positive self-talk"],
              outcome: "Calmed down to a 3/10, found a solution."
            }
          ]);
          
          setStrategies(regulationStrategies);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your emotional regulation data.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);
  
  // Handle emotion selection
  const handleEmotionSelect = (emotion) => {
    setCurrentEmotion({
      ...currentEmotion,
      name: emotion.name
    });
    
    // Suggest strategies based on selected emotion
    const suggestedStrategies = strategies.filter(
      strategy => strategy.suitable.includes(emotion.name) || 
                 strategy.suitable.includes("All emotions")
    );
    
    setStrategies(suggestedStrategies);
  };
  
  // Handle intensity change
  const handleIntensityChange = (value) => {
    setCurrentEmotion({
      ...currentEmotion,
      intensity: value[0]
    });
  };
  
  // Handle body feeling toggle
  const handleBodyFeelingToggle = (feeling) => {
    const updatedFeelings = [...currentEmotion.bodyFeelings];
    const index = updatedFeelings.findIndex(f => f === feeling.name);
    
    if (index >= 0) {
      updatedFeelings.splice(index, 1);
    } else {
      updatedFeelings.push(feeling.name);
    }
    
    setCurrentEmotion({
      ...currentEmotion,
      bodyFeelings: updatedFeelings
    });
  };
  
  // Save current emotion to journal
  const handleSaveToJournal = () => {
    if (!currentEmotion.name) {
      toast({
        title: "Missing information",
        description: "Please select an emotion before saving to your journal.",
        variant: "destructive"
      });
      return;
    }
    
    const newJournalEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      emotion: currentEmotion.name,
      intensity: currentEmotion.intensity,
      triggers: currentEmotion.triggers,
      bodyFeelings: currentEmotion.bodyFeelings,
      thoughts: currentEmotion.thoughts,
      strategies: [],
      outcome: ""
    };
    
    setEmotionJournal([newJournalEntry, ...emotionJournal]);
    
    // Add to emotion history
    const historyEntry = {
      name: currentEmotion.name,
      intensity: currentEmotion.intensity,
      date: new Date().toISOString(),
      triggers: currentEmotion.triggers,
      strategies: []
    };
    
    setEmotionHistory([historyEntry, ...emotionHistory]);
    
    // Reset current emotion
    setCurrentEmotion({
      name: "",
      intensity: 5,
      triggers: "",
      bodyFeelings: [],
      thoughts: ""
    });
    
    toast({
      title: "Saved to journal",
      description: "Your emotion has been recorded in your journal.",
    });
  };
  
  // Get intensity color
  const getIntensityColor = (intensity) => {
    if (intensity <= 3) return "bg-green-100 text-green-800";
    if (intensity <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  
  // Get strategy difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="identify" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identify">Identify</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        {/* Identify Tab */}
        <TabsContent value="identify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling right now?</CardTitle>
              <CardDescription>
                Identifying your emotions is the first step to managing them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Emotions */}
              <div>
                <h3 className="text-sm font-medium mb-2">Basic Emotions</h3>
                <div className="grid grid-cols-5 gap-2">
                  {basicEmotions.map((emotion) => (
                    <Button
                      key={emotion.name}
                      variant={currentEmotion.name === emotion.name ? "default" : "outline"}
                      className="flex flex-col items-center p-2 h-auto"
                      onClick={() => handleEmotionSelect(emotion)}
                    >
                      <span className="text-2xl mb-1">{emotion.icon}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Complex Emotions */}
              <div>
                <h3 className="text-sm font-medium mb-2">Complex Emotions</h3>
                <div className="grid grid-cols-5 gap-2">
                  {complexEmotions.map((emotion) => (
                    <Button
                      key={emotion.name}
                      variant={currentEmotion.name === emotion.name ? "default" : "outline"}
                      className="flex flex-col items-center p-2 h-auto"
                      onClick={() => handleEmotionSelect(emotion)}
                    >
                      <span className="text-2xl mb-1">{emotion.icon}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Intensity Slider */}
              {currentEmotion.name && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="intensity">How intense is this feeling?</Label>
                    <Badge 
                      variant="outline" 
                      className={getIntensityColor(currentEmotion.intensity)}
                    >
                      {currentEmotion.intensity}/10
                    </Badge>
                  </div>
                  <Slider
                    id="intensity"
                    min={1}
                    max={10}
                    step={1}
                    value={[currentEmotion.intensity]}
                    onValueChange={handleIntensityChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>
              )}
              
              {/* Triggers */}
              {currentEmotion.name && (
                <div className="space-y-2">
                  <Label htmlFor="triggers">What triggered this feeling?</Label>
                  <Textarea
                    id="triggers"
                    placeholder="Describe what happened to make you feel this way..."
                    value={currentEmotion.triggers}
                    onChange={(e) => setCurrentEmotion({...currentEmotion, triggers: e.target.value})}
                  />
                </div>
              )}
              
              {/* Body Feelings */}
              {currentEmotion.name && (
                <div className="space-y-2">
                  <Label>Where do you feel this in your body?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {bodyFeelings.map((feeling) => (
                      <div key={feeling.name} className="flex items-center space-x-2">
                        <Switch
                          id={`feeling-${feeling.name}`}
                          checked={currentEmotion.bodyFeelings.includes(feeling.name)}
                          onCheckedChange={() => handleBodyFeelingToggle(feeling)}
                        />
                        <Label htmlFor={`feeling-${feeling.name}`} className="text-sm">
                          {feeling.name} <span className="text-xs text-muted-foreground">({feeling.area})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Thoughts */}
              {currentEmotion.name && (
                <div className="space-y-2">
                  <Label htmlFor="thoughts">What thoughts are you having?</Label>
                  <Textarea
                    id="thoughts"
                    placeholder="What are you saying to yourself about this situation?"
                    value={currentEmotion.thoughts}
                    onChange={(e) => setCurrentEmotion({...currentEmotion, thoughts: e.target.value})}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveToJournal}
                disabled={!currentEmotion.name}
                className="w-full"
              >
                Save to Journal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Regulation Strategies</CardTitle>
              <CardDescription>
                Try these strategies to help manage your emotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentEmotion.name ? (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      Showing strategies for: <Badge>{currentEmotion.name}</Badge> at intensity <Badge className={getIntensityColor(currentEmotion.intensity)}>{currentEmotion.intensity}/10</Badge>
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Select an emotion in the Identify tab to see personalized strategies
                    </p>
                  </div>
                )}
                
                {strategies.map((strategy) => (
                  <Card key={strategy.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className={getDifficultyColor(strategy.difficulty)}>
                          {strategy.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {strategy.timeNeeded}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm">{strategy.description}</p>
                      
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Suitable for:</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.suitable.map((emotion) => (
                            <Badge key={emotion} variant="secondary" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm">
                        <Check className="h-4 w-4 mr-2" />
                        Try This
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Journal</CardTitle>
              <CardDescription>
                Track your emotions and reflect on patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : emotionJournal.length > 0 ? (
                <div className="space-y-4">
                  {emotionJournal.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg flex items-center">
                            {entry.emotion}
                            <Badge className={`ml-2 ${getIntensityColor(entry.intensity)}`}>
                              {entry.intensity}/10
                            </Badge>
                          </CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        {entry.triggers && (
                          <div>
                            <h4 className="text-sm font-medium">Triggers:</h4>
                            <p className="text-sm">{entry.triggers}</p>
                          </div>
                        )}
                        
                        {entry.bodyFeelings.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium">Body Feelings:</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.bodyFeelings.map((feeling) => (
                                <Badge key={feeling} variant="outline" className="text-xs">
                                  {feeling}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {entry.thoughts && (
                          <div>
                            <h4 className="text-sm font-medium">Thoughts:</h4>
                            <p className="text-sm">{entry.thoughts}</p>
                          </div>
                        )}
                        
                        {entry.strategies.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium">Strategies Used:</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.strategies.map((strategy) => (
                                <Badge key={strategy} variant="secondary" className="text-xs">
                                  {strategy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {entry.outcome && (
                          <div>
                            <h4 className="text-sm font-medium">Outcome:</h4>
                            <p className="text-sm">{entry.outcome}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No journal entries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Emotional Regulation Progress</CardTitle>
              <CardDescription>
                Track your emotional patterns and regulation skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Emotions</h3>
                    {emotionHistory.length > 0 ? (
                      <div className="space-y-2">
                        {emotionHistory.slice(0, 5).map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center">
                              <Badge className={getIntensityColor(entry.intensity)}>
                                {entry.intensity}
                              </Badge>
                              <span className="ml-2">{entry.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No emotion history yet</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Most Used Strategies</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Deep breathing</span>
                          <Badge variant="secondary">8 times</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">5-4-3-2-1 Grounding</span>
                          <Badge variant="secondary">5 times</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Positive self-talk</span>
                          <Badge variant="secondary">3 times</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Emotion journaling</span>
                          <Badge variant="secondary">2 times</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Regulation Skills Progress</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Emotion Identification</span>
                          <span className="text-xs text-muted-foreground">85%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Strategy Application</span>
                          <span className="text-xs text-muted-foreground">70%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Emotional Awareness</span>
                          <span className="text-xs text-muted-foreground">90%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Self-Regulation</span>
                          <span className="text-xs text-muted-foreground">65%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Your Progress
                    </h3>
                    <p className="text-sm">
                      You've logged 12 emotions and used 18 regulation strategies in the past month.
                      Your emotional awareness has improved by 15% since you started.
                    </p>
                    <Button className="mt-3 w-full" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EmotionalRegulationEngine;
