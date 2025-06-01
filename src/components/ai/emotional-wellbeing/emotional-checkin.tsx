'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAIService } from '@/lib/ai/ai-service';

type Emotion = {
  name: string;
  color: string;
  description: string;
};

type CheckinData = {
  mood: string;
  intensity: number;
  notes: string;
  triggers: any[];
  strategies: any[];
};

// Export both as default and named export to fix build warnings
export function EmotionalCheckin() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkinData, setCheckinData] = useState<CheckinData>({
    mood: '',
    intensity: 5,
    notes: '',
    triggers: [],
    strategies: []
  });
  const [suggestedStrategies, setSuggestedStrategies] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [historicalPatterns, setHistoricalPatterns] = useState<Record<string, any> | null>(null);
  const [voiceInput, setVoiceInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Sample emotions with descriptions
  const emotions: any[] = [
    { name: 'Happy', color: 'bg-green-500', description: 'Feeling joyful, content, or pleased' },
    { name: 'Calm', color: 'bg-blue-400', description: 'Feeling peaceful, relaxed, or at ease' },
    { name: 'Excited', color: 'bg-yellow-400', description: 'Feeling enthusiastic, eager, or energetic' },
    { name: 'Sad', color: 'bg-blue-600', description: 'Feeling unhappy, down, or low' },
    { name: 'Worried', color: 'bg-purple-400', description: 'Feeling anxious, nervous, or concerned' },
    { name: 'Frustrated', color: 'bg-orange-500', description: 'Feeling annoyed, irritated, or stuck' },
    { name: 'Angry', color: 'bg-red-500', description: 'Feeling mad, upset, or furious' },
    { name: 'Confused', color: 'bg-grey-400', description: 'Feeling uncertain, puzzled, or mixed up' },
    { name: 'Tired', color: 'bg-grey-600', description: 'Feeling exhausted, sleepy, or low energy' },
    { name: 'Proud', color: 'bg-indigo-500', description: 'Feeling accomplished, confident, or satisfied' },
    { name: 'Bored', color: 'bg-grey-500', description: 'Feeling uninterested, restless, or disengaged' },
    { name: 'Hopeful', color: 'bg-teal-400', description: 'Feeling optimistic, positive, or encouraged' }
  ];

  // Common triggers
  const commonTriggers = [
    'School work', 'Tests/Exams', 'Friendship issues', 'Family situation',
    'Not understanding something', 'Being left out', 'Too much noise',
    'Changes in routine', 'Not enough sleep', 'Hunger', 'Physical discomfort'
  ];

  // Toggle voice input mode
  const toggleVoiceInput = () => {
    setVoiceInput(!voiceInput);
  };

  // Simulate voice recording (in a real implementation, this would use the Web Speech API)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your spoken words have been converted to text.",
      });
      // In a real implementation, this would process the recorded audio
      // For now, we'll simulate by adding some text
      if (step === 2) {
        setCheckinData(prev => ({
          ...prev,
          notes: prev.notes + " I'm feeling this way because of what happened at school today. It was difficult to concentrate in class."
        }));
      }
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Please speak clearly about how you're feeling.",
      });
    }
  };

  const selectEmotion = (emotion: string) => {
    setCheckinData(prev => ({
      ...prev,
      mood: emotion
    }));
    setStep(2);
  };

  const handleIntensityChange = (value: any[]) => {
    setCheckinData(prev => ({
      ...prev,
      intensity: value[0]
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCheckinData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleTriggerSelect = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const addCustomTrigger = () => {
    if (customTrigger.trim() !== '' && !selectedTriggers.includes(customTrigger)) {
      setSelectedTriggers([...selectedTriggers, customTrigger]);
      setCustomTrigger('');
    }
  };

  const processCheckin = async () => {
    setIsProcessing(true);
    try {
      // Update checkin data with selected triggers
      setCheckinData(prev => ({
        ...prev,
        triggers: selectedTriggers
      }));

      // In a real implementation, this would call the AI service to analyse the emotional check-in
      // and suggest personalized strategies
      const prompt = `
        Based on the following emotional check-in data, suggest 5 personalized strategies to help the student regulate their emotions:
        
        Mood: ${checkinData.mood}
        Intensity: ${checkinData.intensity}/10
        Notes: ${checkinData.notes}
        Triggers: ${selectedTriggers.join(', ')}
        
        Consider age-appropriate strategies that address the specific emotion and triggers.
        Format each strategy as a concise, actionable suggestion.
      `;
      
      const aiResponse = await aiService.getCompletion({
        prompt,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500
      });
      
      // Parse the AI response to extract strategies
      const strategies = aiResponse
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.'))
        .map(line => line.replace(/^[-\d.\s]+/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
      
      setSuggestedStrategies(strategies);
      
      // Save check-in data to database (simulated)
      // In a real implementation, this would make an API call
      
      // Simulate fetching historical patterns
      setHistoricalPatterns({
        recentMoods: [
          { mood: 'Happy', count: 3 },
          { mood: checkinData.mood, count: 2 },
          { mood: 'Tired', count: 1 }
        ],
        commonTriggers: [
          { trigger: selectedTriggers[0] || 'School work', count: 4 },
          { trigger: 'Not enough sleep', count: 2 }
        ],
        effectiveStrategies: [
          { strategy: 'Deep breathing', effectiveness: 80 },
          { strategy: 'Talking to a friend', effectiveness: 75 }
        ]
      });
      
      setStep(4);
    } catch (error) {
      toast({
        title: "Error processing check-in",
        description: "There was a problem analysing your emotional check-in. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveSelectedStrategies = (strategies: any[]) => {
    setCheckinData(prev => ({
      ...prev,
      strategies
    }));
    
    // In a real implementation, this would update the database record
    
    toast({
      title: "Check-in saved",
      description: "Your emotional check-in and selected strategies have been saved.",
    });
    
    // Reset form for a new check-in
    setStep(5);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">How are you feeling right now?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant={checkinData.mood === emotion.name ? "default" : "outline"}
                  className={`h-auto py-3 px-4 justify-start ${checkinData.mood === emotion.name ? 'border-primary' : ''}`}
                  onClick={() => selectEmotion(emotion.name)}
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-centre mb-1">
                      <div className={`w-3 h-3 rounded-full ${emotion.color} mr-2`}></div>
                      <span>{emotion.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{emotion.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">How intense is this feeling?</h3>
              <div className="px-4">
                <Slider
                  value={[checkinData.intensity]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={handleIntensityChange}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mild (1)</span>
                  <span>Moderate (5)</span>
                  <span>Strong (10)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-centre mb-2">
                <h3 className="text-lg font-medium">Would you like to share more?</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleVoiceInput}
                  className="flex items-centre gap-1"
                >
                  <span className="h-4 w-4">{voiceInput ? '🎤' : '⌨️'}</span>
                  <span>{voiceInput ? 'Voice Input' : 'Text Input'}</span>
                </Button>
              </div>
              
              {voiceInput ? (
                <div className="flex flex-col items-centre space-y-4">
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={toggleRecording}
                  >
                    {isRecording ? '■' : '🎤'}
                  </Button>
                  <p className="text-sm text-centre text-muted-foreground">
                    {isRecording 
                      ? "Recording... Click to stop" 
                      : "Click to start speaking about how you're feeling"}
                  </p>
                  {checkinData.notes && (
                    <div className="w-full mt-4">
                      <p className="text-sm font-medium mb-1">Transcription:</p>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {checkinData.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Textarea
                  placeholder="You can write about what happened, what you're thinking about, or anything else you'd like to share..."
                  value={checkinData.notes}
                  onChange={handleNotesChange}
                  className="min-h-[120px]"
                />
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">What might be causing this feeling?</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {commonTriggers.map((trigger) => (
                <Badge
                  key={trigger}
                  variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                  className="cursor-pointer py-1.5 px-3"
                  onClick={() => handleTriggerSelect(trigger)}
                >
                  {trigger}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-centre gap-2">
              <Textarea
                placeholder="Add your own reason..."
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                className="min-h-[40px]"
              />
              <Button onClick={addCustomTrigger} className="shrink-0">Add</Button>
            </div>
            
            {selectedTriggers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected triggers:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTriggers.map((trigger) => (
                    <Badge key={trigger} variant="secondary" className="py-1.5 px-3">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={processCheckin}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Submit Check-in'}
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-2">Your Check-in Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Feeling</p>
                  <p className="font-medium">{checkinData.mood}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intensity</p>
                  <p className="font-medium">{checkinData.intensity}/10</p>
                </div>
                {selectedTriggers.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Possible triggers</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTriggers.map(trigger => (
                        <Badge key={trigger} variant="outline" className="py-0.5">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {checkinData.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{checkinData.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Suggested Strategies</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Here are some strategies that might help you manage your feelings. Select the ones you'd like to try:
              </p>
              
              <div className="space-y-3">
                {suggestedStrategies.map((strategy, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      const isSelected = checkinData.strategies.includes(strategy);
                      if (isSelected) {
                        setCheckinData(prev => ({
                          ...prev,
                          strategies: prev.strategies.filter(s => s !== strategy)
                        }));
                      } else {
                        setCheckinData(prev => ({
                          ...prev,
                          strategies: [...prev.strategies, strategy]
                        }));
                      }
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={checkinData.strategies.includes(strategy)}
                      onChange={() => {}}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <p>{strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {historicalPatterns && (
              <div className="mt-6">
                <Tabs defaultValue="patterns">
                  <TabsList className="w-full">
                    <TabsTrigger value="patterns" className="flex-1">Patterns</TabsTrigger>
                    <TabsTrigger value="strategies" className="flex-1">Effective Strategies</TabsTrigger>
                  </TabsList>
                  <TabsContent value="patterns" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recent Moods</h4>
                        <div className="flex gap-2">
                          {historicalPatterns.recentMoods.map((item, i) => (
                            <Badge key={i} variant="outline">
                              {item.mood} ({item.count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Common Triggers</h4>
                        <div className="flex gap-2">
                          {historicalPatterns.commonTriggers.map((item, i) => (
                            <Badge key={i} variant="outline">
                              {item.trigger} ({item.count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="strategies" className="mt-4">
                    <div className="space-y-4">
                      {historicalPatterns.effectiveStrategies.map((strategy, i) => (
                        <div key={i} className="flex justify-between items-centre">
                          <span>{strategy.strategy}</span>
                          <div className="flex items-centre">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${strategy.effectiveness}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{strategy.effectiveness}%</span>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on your previous check-ins and feedback
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button 
                onClick={() => saveSelectedStrategies(checkinData.strategies)}
                disabled={checkinData.strategies.length === 0}
              >
                Save and Finish
              </Button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="text-centre py-8">
            <div className="inline-flex items-centre justify-centre rounded-full p-4 bg-green-100 text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Check-in Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for sharing how you're feeling. Your check-in has been saved.
            </p>
            <Button onClick={() => {
              setCheckinData({
                mood: '',
                intensity: 5,
                notes: '',
                triggers: [],
                strategies: []
              });
              setSelectedTriggers([]);
              setSuggestedStrategies([]);
              setHistoricalPatterns(null);
              setStep(1);
            }}>
              Start New Check-in
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Emotional Check-in</CardTitle>
        <CardDescription>
          Take a moment to reflect on how you're feeling right now
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

// Make sure the default export is the same as the named export
export default EmotionalCheckin;
