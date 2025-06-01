'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Clock, 
  Star, 
  ThumbsUp, 
  Bookmark, 
  BarChart, 
  Download,
  ArrowRight,
  CheckCircle2,
  History,
  Settings,
  Lightbulb
} from "lucide-react";
import Image from "next/image";

const PersonalizedStrategyRecommendations = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("recommendations");
  const [isLoading, setIsLoading] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    preferredStrategyTypes: ["physical", "cognitive", "social"],
    strategyComplexity: "moderate",
    reminderFrequency: "medium",
    autoSuggestEnabled: true,
    favoriteStrategies: []
  });
  const [personalizedStrategies, setPersonalizedStrategies] = useState([]);
  const [strategyEffectiveness, setStrategyEffectiveness] = useState({});
  const [currentMood, setCurrentMood] = useState(null);
  const [strategyHistory, setStrategyHistory] = useState([]);
  
  // Basic emotions with UK spelling
  const basicEmotions = [
    { name: "Happy", color: "#FFD700", icon: "😊" },
    { name: "Sad", color: "#6495ED", icon: "😢" },
    { name: "Angry", color: "#FF4500", icon: "😠" },
    { name: "Scared", color: "#9370DB", icon: "😨" },
    { name: "Disgusted", color: "#32CD32", icon: "🤢" },
    { name: "Surprised", color: "#FF69B4", icon: "😲" }
  ];
  
  // Advanced emotions with UK spelling
  const advancedEmotions = [
    { name: "Anxious", color: "#DAA520", icon: "😰" },
    { name: "Frustrated", color: "#CD5C5C", icon: "😤" },
    { name: "Excited", color: "#FF8C00", icon: "🤩" },
    { name: "Proud", color: "#4682B4", icon: "😌" },
    { name: "Embarrassed", color: "#DB7093", icon: "😳" },
    { name: "Jealous", color: "#228B22", icon: "😒" },
    { name: "Confused", color: "#9932CC", icon: "😕" },
    { name: "Calm", color: "#87CEEB", icon: "😌" },
    { name: "Bored", color: "#A9A9A9", icon: "😑" },
    { name: "Nervous", color: "#FFA07A", icon: "😬" },
    { name: "Overwhelmed", color: "#800080", icon: "😩" },
    { name: "Disappointed", color: "#708090", icon: "😞" }
  ];
  
  // All emotions combined
  const allEmotions = [...basicEmotions, ...advancedEmotions];
  
  // Comprehensive regulation strategies database with UK spelling and terminology
  const regulationStrategies = [
    {
      id: "deep-breathing",
      name: "Deep Breathing",
      description: "Take slow, deep breaths to calm your body and mind.",
      steps: [
        "Find a comfortable position",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath for 2 counts",
        "Breathe out slowly through your mouth for 6 counts",
        "Repeat 5 times"
      ],
      suitableFor: ["Angry", "Anxious", "Overwhelmed", "Nervous"],
      category: "physical",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Supported by research from the British Psychological Society and NHS mental health guidelines."
    },
    {
      id: "counting",
      name: "Counting",
      description: "Count slowly to help redirect your focus and calm down.",
      steps: [
        "Start counting slowly from 1",
        "Focus on each number as you say it",
        "Continue to 10 or 20",
        "If needed, count backwards to 1"
      ],
      suitableFor: ["Angry", "Frustrated", "Overwhelmed"],
      category: "cognitive",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Recommended by the Royal College of Psychiatrists as a grounding technique."
    },
    {
      id: "visualisation",
      name: "Peaceful Place Visualisation",
      description: "Imagine a calm, peaceful place to help you relax.",
      steps: [
        "Close your eyes",
        "Think of a place where you feel safe and calm",
        "Imagine what you can see there",
        "Imagine what you can hear there",
        "Imagine what you can feel there",
        "Stay in this place for a few minutes"
      ],
      suitableFor: ["Anxious", "Scared", "Overwhelmed", "Sad"],
      category: "cognitive",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Supported by cognitive-behavioural therapy research and NICE guidelines for anxiety management."
    },
    {
      id: "5-4-3-2-1",
      name: "5-4-3-2-1 Grounding",
      description: "Use your senses to ground yourself in the present moment.",
      steps: [
        "Notice 5 things you can see",
        "Notice 4 things you can touch/feel",
        "Notice 3 things you can hear",
        "Notice 2 things you can smell",
        "Notice 1 thing you can taste"
      ],
      suitableFor: ["Anxious", "Overwhelmed", "Scared", "Confused"],
      category: "cognitive",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Recommended by NHS mental health services as an effective grounding technique for anxiety and panic."
    },
    {
      id: "movement",
      name: "Movement Break",
      description: "Use physical movement to release energy and change your state.",
      steps: [
        "Stand up and stretch",
        "Do 10 jumping jacks or march in place",
        "Shake out your arms and legs",
        "Roll your shoulders and neck gently",
        "Take a short walk if possible"
      ],
      suitableFor: ["Angry", "Frustrated", "Bored", "Nervous", "Restless"],
      category: "physical",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Supported by research on the connection between physical activity and emotional regulation from Sport England and the British Association of Sport and Exercise Sciences."
    },
    {
      id: "progressive-muscle-relaxation",
      name: "Progressive Muscle Relaxation",
      description: "Tense and relax different muscle groups to reduce physical tension.",
      steps: [
        "Find a comfortable position sitting or lying down",
        "Start with your feet - tense the muscles for 5 seconds",
        "Release and notice the difference for 10 seconds",
        "Move up through your body - legs, abdomen, hands, arms, shoulders, face",
        "Tense and release each muscle group in turn"
      ],
      suitableFor: ["Anxious", "Tense", "Stressed", "Overwhelmed"],
      category: "physical",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Recommended by the NHS and British Association for Counselling and Psychotherapy for anxiety and stress management."
    },
    {
      id: "thought-challenging",
      name: "Thought Challenging",
      description: "Identify and challenge unhelpful thoughts that contribute to difficult emotions.",
      steps: [
        "Notice the unhelpful thought",
        "Identify what type of thinking trap it might be (e.g., catastrophizing, mind-reading)",
        "Look for evidence that supports and doesn't support the thought",
        "Consider a more balanced alternative thought",
        "Practise replacing the unhelpful thought with the balanced one"
      ],
      suitableFor: ["Anxious", "Sad", "Angry", "Disappointed", "Worried"],
      category: "cognitive",
      complexity: "advanced",
      duration: "long",
      evidenceBase: "Core technique in Cognitive Behavioural Therapy (CBT), recommended by NICE guidelines for anxiety and depression."
    },
    {
      id: "positive-self-talk",
      name: "Positive Self-Talk",
      description: "Use encouraging and supportive phrases to talk to yourself.",
      steps: [
        "Notice negative self-talk",
        "Pause and take a breath",
        "Think of what you would say to a friend in this situation",
        "Create a positive, realistic alternative",
        "Practise saying it to yourself"
      ],
      suitableFor: ["Sad", "Anxious", "Disappointed", "Embarrassed"],
      category: "cognitive",
      complexity: "moderate",
      duration: "short",
      evidenceBase: "Supported by research in positive psychology and recommended by the British Psychological Society."
    },
    {
      id: "gratitude-practise",
      name: "Gratitude Practise",
      description: "Focus on things you're thankful for to shift perspective and improve mood.",
      steps: [
        "Take a few deep breaths to centre yourself",
        "Think of three things you're grateful for right now",
        "For each one, consider why you're grateful for it",
        "Notice how thinking about these things makes you feel",
        "Consider writing them down in a gratitude journal"
      ],
      suitableFor: ["Sad", "Disappointed", "Frustrated", "Bored"],
      category: "cognitive",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Supported by positive psychology research and recommended by mental health charities like Mind."
    },
    {
      id: "social-connection",
      name: "Social Connection",
      description: "Reach out to someone you trust for support or distraction.",
      steps: [
        "Identify someone you feel comfortable talking to",
        "Decide what kind of support you need (listening, advice, distraction)",
        "Reach out via text, call, or in person",
        "Share what you're comfortable with",
        "Engage in the conversation or activity together"
      ],
      suitableFor: ["Sad", "Lonely", "Anxious", "Overwhelmed"],
      category: "social",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Supported by research on social support and mental wellbeing from the Mental Health Foundation."
    },
    {
      id: "mindful-observation",
      name: "Mindful Observation",
      description: "Focus completely on observing one thing with all your attention.",
      steps: [
        "Choose something to observe (e.g., a flower, the sky, your hand)",
        "Focus all your attention on it",
        "Notice details you wouldn't normally see",
        "When your mind wanders, gently bring it back",
        "Continue for 3-5 minutes"
      ],
      suitableFor: ["Anxious", "Overwhelmed", "Restless", "Bored"],
      category: "cognitive",
      complexity: "moderate",
      duration: "short",
      evidenceBase: "Based on mindfulness practices recommended by the Oxford Mindfulness Centre and NICE guidelines."
    },
    {
      id: "emotion-labelling",
      name: "Emotion Labelling",
      description: "Name your emotions specifically to help process and manage them.",
      steps: [
        "Pause and check in with yourself",
        "Notice what you're feeling in your body",
        "Try to name the specific emotion(s)",
        "Acknowledge the emotion without judgment",
        "Remind yourself that emotions are temporary"
      ],
      suitableFor: ["Confused", "Overwhelmed", "Mixed emotions"],
      category: "cognitive",
      complexity: "simple",
      duration: "short",
      evidenceBase: "Supported by neuroscience research and recommended by the British Association for Counselling and Psychotherapy."
    },
    {
      id: "opposite-action",
      name: "Opposite Action",
      description: "Do the opposite of what your emotion urges you to do (when the emotion doesn't fit the facts).",
      steps: [
        "Identify the emotion you're feeling",
        "Notice what action the emotion is urging you to take",
        "Consider if the emotion fits the situation",
        "If not, identify an opposite action",
        "Commit fully to the opposite action"
      ],
      suitableFor: ["Angry", "Anxious", "Sad", "Embarrassed"],
      category: "behavioural",
      complexity: "advanced",
      duration: "medium",
      evidenceBase: "Core technique from Dialectical Behaviour Therapy (DBT), supported by clinical research and NICE guidelines."
    },
    {
      id: "creative-expression",
      name: "Creative Expression",
      description: "Express your emotions through art, music, writing, or other creative outlets.",
      steps: [
        "Choose a creative medium you enjoy",
        "Set aside time without distractions",
        "Focus on expressing your feelings, not creating something 'good'",
        "Let yourself be guided by your emotions",
        "Reflect on what you've created and how it represents your feelings"
      ],
      suitableFor: ["Sad", "Angry", "Confused", "Overwhelmed", "Happy"],
      category: "expressive",
      complexity: "moderate",
      duration: "medium",
      evidenceBase: "Supported by art therapy research and recommended by the British Association of Art Therapists."
    },
    {
      id: "self-compassion-break",
      name: "Self-Compassion Break",
      description: "Treat yourself with the same kindness you would offer to a good friend.",
      steps: [
        "Acknowledge that this is a moment of suffering",
        "Remind yourself that suffering is part of being human",
        "Place your hands over your heart or use another soothing touch",
        "Say kind words to yourself, like 'May I be kind to myself in this moment'",
        "Take a few deep breaths and feel the care you're offering yourself"
      ],
      suitableFor: ["Self-critical", "Disappointed", "Embarrassed", "Sad"],
      category: "cognitive",
      complexity: "moderate",
      duration: "short",
      evidenceBase: "Based on self-compassion research by Dr. Kristin Neff and recommended by compassion-focused therapy practitioners."
    }
  ];
  
  // Load user data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchUserPreferences();
      fetchEmotionHistory();
      fetchStrategyHistory();
      generatePersonalizedRecommendations();
    }
  }, [session]);
  
  // Regenerate recommendations when user preferences or emotion history changes
  useEffect(() => {
    if (emotionHistory.length > 0 && Object.keys(userPreferences).length > 0) {
      generatePersonalizedRecommendations();
    }
  }, [userPreferences, emotionHistory]);
  
  const fetchUserPreferences = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/strategy-recommendations/preferences');
      // const data = await response.json();
      // setUserPreferences(data.preferences);
      
      // Simulating API response for now
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fetchEmotionHistory = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/history');
      // const data = await response.json();
      // setEmotionHistory(data.history);
      
      // Simulating API response with mock data
      const mockHistory = [
        { 
          id: "emotion-1",
          name: "Anxious", 
          intensity: 7, 
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          triggers: "Upcoming test",
          bodyFeelings: ["Chest", "Stomach"],
          strategiesUsed: ["deep-breathing", "5-4-3-2-1"]
        },
        { 
          id: "emotion-2",
          name: "Frustrated", 
          intensity: 6, 
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          triggers: "Difficult homework",
          bodyFeelings: ["Head", "Hands"],
          strategiesUsed: ["counting", "movement"]
        },
        { 
          id: "emotion-3",
          name: "Sad", 
          intensity: 5, 
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          triggers: "Argument with friend",
          bodyFeelings: ["Chest", "Throat"],
          strategiesUsed: ["social-connection", "creative-expression"]
        },
        { 
          id: "emotion-4",
          name: "Overwhelmed", 
          intensity: 8, 
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          triggers: "Too many assignments",
          bodyFeelings: ["Head", "Chest", "Stomach"],
          strategiesUsed: ["progressive-muscle-relaxation", "thought-challenging"]
        },
        { 
          id: "emotion-5",
          name: "Happy", 
          intensity: 8, 
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          triggers: "Good grade on project",
          bodyFeelings: ["Chest"],
          strategiesUsed: ["gratitude-practise"]
        }
      ];
      setEmotionHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching emotion history:', error);
      toast({
        title: "Error",
        description: "Failed to load your emotion history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fetchStrategyHistory = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/strategies/history');
      // const data = await response.json();
      // setStrategyHistory(data.history);
      
      // Simulating API response with mock data
      const mockStrategyHistory = [
        {
          id: "strategy-use-1",
          strategyId: "deep-breathing",
          emotion: "Anxious",
          effectiveness: 4,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          notes: "Helped calm my racing heart before the test"
        },
        {
          id: "strategy-use-2",
          strategyId: "5-4-3-2-1",
          emotion: "Anxious",
          effectiveness: 3,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          notes: "Took a while but eventually helped me focus"
        },
        {
          id: "strategy-use-3",
          strategyId: "counting",
          emotion: "Frustrated",
          effectiveness: 2,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          notes: "Didn't help much with the frustration"
        },
        {
          id: "strategy-use-4",
          strategyId: "movement",
          emotion: "Frustrated",
          effectiveness: 4,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          notes: "Walking around really helped clear my head"
        },
        {
          id: "strategy-use-5",
          strategyId: "social-connection",
          emotion: "Sad",
          effectiveness: 5,
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          notes: "Talking to mum made me feel much better"
        }
      ];
      
      setStrategyHistory(mockStrategyHistory);
      
      // Calculate strategy effectiveness
      const effectiveness = {};
      mockStrategyHistory.forEach(record => {
        if (!effectiveness[record.strategyId]) {
          effectiveness[record.strategyId] = {
            totalRating: 0,
            count: 0,
            average: 0
          };
        }
        effectiveness[record.strategyId].totalRating += record.effectiveness;
        effectiveness[record.strategyId].count += 1;
        effectiveness[record.strategyId].average = 
          effectiveness[record.strategyId].totalRating / effectiveness[record.strategyId].count;
      });
      
      setStrategyEffectiveness(effectiveness);
      
    } catch (error) {
      console.error('Error fetching strategy history:', error);
      toast({
        title: "Error",
        description: "Failed to load your strategy history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const generatePersonalizedRecommendations = () => {
    // This would be replaced with an actual API call in production
    // const response = await fetch('/api/special-needs/emotional-regulation/strategy-recommendations');
    // const data = await response.json();
    // setPersonalizedStrategies(data.recommendations);
    
    // For now, we'll generate recommendations based on local data
    
    // Step 1: Analyse emotion patterns
    const emotionFrequency = {};
    emotionHistory.forEach(record => {
      emotionFrequency[record.name] = (emotionFrequency[record.name] || 0) + 1;
    });
    
    const commonEmotions = Object.entries(emotionFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Step 2: Analyse strategy effectiveness
    const effectiveStrategies = Object.entries(strategyEffectiveness)
      .filter(([_, data]) => data.average >= 3.5 && data.count >= 2)
      .map(([id, _]) => id);
    
    // Step 3: Filter strategies based on user preferences
    const filteredStrategies = regulationStrategies.filter(strategy => {
      // Match by category preference
      const categoryMatch = userPreferences.preferredStrategyTypes.includes(strategy.category);
      
      // Match by complexity
      let complexityMatch = true;
      if (userPreferences.strategyComplexity === "simple") {
        complexityMatch = strategy.complexity === "simple";
      } else if (userPreferences.strategyComplexity === "moderate") {
        complexityMatch = strategy.complexity !== "advanced";
      }
      
      return categoryMatch && complexityMatch;
    });
    
    // Step 4: Generate personalized recommendations
    const recommendations = [];
    
    // 4.1: Add strategies that have worked well in the past
    effectiveStrategies.forEach(strategyId => {
      const strategy = regulationStrategies.find(s => s.id === strategyId);
      if (strategy) {
        recommendations.push({
          ...strategy,
          reason: "This has worked well for you in the past",
          reasonType: "effectiveness",
          score: strategyEffectiveness[strategyId].average * 20 // Convert to 0-100 scale
        });
      }
    });
    
    // 4.2: Add strategies suitable for common emotions
    commonEmotions.forEach(emotion => {
      const suitableStrategies = filteredStrategies.filter(
        strategy => strategy.suitableFor.includes(emotion) && 
        !recommendations.some(r => r.id === strategy.id)
      );
      
      suitableStrategies.slice(0, 2).forEach(strategy => {
        recommendations.push({
          ...strategy,
          reason: `Good for managing ${emotion.toLowerCase()} feelings`,
          reasonType: "emotion",
          score: 70 + Math.random() * 15 // Random score between 70-85
        });
      });
    });
    
    // 4.3: Add some strategies based on evidence strength
    const evidenceBasedStrategies = filteredStrategies
      .filter(strategy => 
        !recommendations.some(r => r.id === strategy.id) &&
        strategy.evidenceBase.includes("NICE") || 
        strategy.evidenceBase.includes("NHS") ||
        strategy.evidenceBase.includes("research")
      )
      .slice(0, 2);
    
    evidenceBasedStrategies.forEach(strategy => {
      recommendations.push({
        ...strategy,
        reason: "Strong evidence supporting effectiveness",
        reasonType: "evidence",
        score: 65 + Math.random() * 15 // Random score between 65-80
      });
    });
    
    // 4.4: Add some variety if needed
    if (recommendations.length < 6) {
      const remainingStrategies = filteredStrategies
        .filter(strategy => !recommendations.some(r => r.id === strategy.id))
        .slice(0, 6 - recommendations.length);
      
      remainingStrategies.forEach(strategy => {
        recommendations.push({
          ...strategy,
          reason: "Matches your preferences",
          reasonType: "preference",
          score: 60 + Math.random() * 10 // Random score between 60-70
        });
      });
    }
    
    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);
    
    setPersonalizedStrategies(recommendations);
  };
  
  const handleCurrentMoodSelect = (emotion) => {
    setCurrentMood(emotion);
    
    // Filter recommendations based on current mood
    if (personalizedStrategies.length > 0) {
      const filteredRecommendations = regulationStrategies
        .filter(strategy => strategy.suitableFor.includes(emotion.name))
        .map(strategy => {
          // Check if this strategy is already in personalized recommendations
          const existing = personalizedStrategies.find(s => s.id === strategy.id);
          if (existing) {
            return {
              ...existing,
              reason: `Good for managing ${emotion.name.toLowerCase()} feelings`,
              reasonType: "current_mood",
              score: existing.score + 10 // Boost score for current mood
            };
          }
          
          return {
            ...strategy,
            reason: `Good for managing ${emotion.name.toLowerCase()} feelings`,
            reasonType: "current_mood",
            score: 75 + Math.random() * 15 // Random score between 75-90
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      
      setPersonalizedStrategies(filteredRecommendations);
      
      toast({
        title: "Recommendations Updated",
        description: `Showing strategies for ${emotion.name.toLowerCase()} feelings.`,
      });
    }
  };
  
  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/strategy-recommendations/preferences', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userPreferences),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your preferences have been saved.",
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleStrategyFeedback = async (strategyId, effectiveness, notes) => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/strategies/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     strategyId,
      //     effectiveness,
      //     notes,
      //     emotion: currentMood ? currentMood.name : null
      //   }),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        // Update strategy history
        const newFeedback = {
          id: `strategy-use-${Date.now()}`,
          strategyId,
          emotion: currentMood ? currentMood.name : "Unknown",
          effectiveness,
          timestamp: new Date().toISOString(),
          notes
        };
        
        setStrategyHistory([newFeedback, ...strategyHistory]);
        
        // Update effectiveness data
        setStrategyEffectiveness(prev => {
          const updated = { ...prev };
          if (!updated[strategyId]) {
            updated[strategyId] = {
              totalRating: 0,
              count: 0,
              average: 0
            };
          }
          updated[strategyId].totalRating += effectiveness;
          updated[strategyId].count += 1;
          updated[strategyId].average = 
            updated[strategyId].totalRating / updated[strategyId].count;
          
          return updated;
        });
        
        setIsLoading(false);
        toast({
          title: "Feedback Recorded",
          description: "Thank you for your feedback. This helps us improve your recommendations.",
        });
        
        // Regenerate recommendations
        generatePersonalizedRecommendations();
        
      }, 1000);
    } catch (error) {
      console.error('Error saving strategy feedback:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your feedback. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleFavoriteStrategy = (strategyId) => {
    setUserPreferences(prev => {
      const updated = { ...prev };
      if (updated.favoriteStrategies.includes(strategyId)) {
        updated.favoriteStrategies = updated.favoriteStrategies.filter(id => id !== strategyId);
      } else {
        updated.favoriteStrategies = [...updated.favoriteStrategies, strategyId];
      }
      return updated;
    });
    
    toast({
      title: userPreferences.favoriteStrategies.includes(strategyId)
        ? "Added to Favorites"
        : "Removed from Favorites",
      description: "Your favourite strategies have been updated.",
    });
  };
  
  const getEmotionColor = (emotionName) => {
    const emotion =
      basicEmotions.find(e => e.name === emotionName) ||
      advancedEmotions.find(e => e.name === emotionName);
    return emotion ? emotion.color : "#808080";
  };
  
  const getEmotionIcon = (emotionName) => {
    const emotion = 
      basicEmotions.find(e => e.name === emotionName) || 
      advancedEmotions.find(e => e.name === emotionName);
    return emotion ? emotion.icon : "😐";
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  
  const getReasonIcon = (reasonType) => {
    switch (reasonType) {
      case 'effectiveness':
        return <ThumbsUp className="h-4 w-4" />;
      case 'emotion':
        return <Heart className="h-4 w-4" />;
      case 'evidence':
        return <Brain className="h-4 w-4" />;
      case 'preference':
        return <Star className="h-4 w-4" />;
      case 'current_mood':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Regulation Strategy Recommendations</CardTitle>
          <CardDescription>
            Discover strategies tailored to your emotional patterns and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              <TabsTrigger value="history">Strategy History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            {/* Current Mood Selector */}
            <div className="my-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-medium mb-3">How are you feeling right now?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select your current emotion to get tailored strategy recommendations
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {allEmotions.slice(0, 12).map((emotion) => (
                  <Button
                    key={emotion.name}
                    variant={currentMood?.name === emotion.name ? "default" : "outline"}
                    className="h-20 flex flex-col items-centre justify-centre"
                    style={{
                      borderColor: emotion.color,
                      backgroundColor: currentMood?.name === emotion.name ? emotion.color : "transparent",
                      color: currentMood?.name === emotion.name ? "white" : "inherit"
                    }}
                    onClick={() => handleCurrentMoodSelect(emotion)}
                  >
                    <span className="text-2xl mb-1">{emotion.icon}</span>
                    <span className="text-xs">{emotion.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading your personalized recommendations...</p>
              </div>
            ) : (
              <>
                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-6">
                  {personalizedStrategies.length > 0 ? (
                    <div className="space-y-4">
                      {personalizedStrategies.map((strategy) => (
                        <Card key={strategy.id} className="overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex justify-between items-centre">
                            <div className="flex items-centre">
                              <div className="mr-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-centre justify-centre shadow-sm">
                                  {strategy.category === 'physical' && <Heart className="h-6 w-6 text-pink-500" />}
                                  {strategy.category === 'cognitive' && <Brain className="h-6 w-6 text-purple-500" />}
                                  {strategy.category === 'social' && <Clock className="h-6 w-6 text-blue-500" />}
                                  {strategy.category === 'behavioural' && <ArrowRight className="h-6 w-6 text-green-500" />}
                                  {strategy.category === 'expressive' && <Sparkles className="h-6 w-6 text-amber-500" />}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">{strategy.name}</h3>
                                <div className="flex items-centre text-sm text-muted-foreground">
                                  <Badge variant="outline" className="mr-2">
                                    {strategy.category}
                                  </Badge>
                                  <Badge variant="outline">
                                    {strategy.complexity}
                                  </Badge>
                                  {strategyEffectiveness[strategy.id] && (
                                    <Badge variant="outline" className="ml-2 bg-green-50">
                                      {strategyEffectiveness[strategy.id].average.toFixed(1)}/5 rating
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-centre">
                              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex flex-col items-centre justify-centre mr-4">
                                <div className="text-lg font-bold text-blue-600">
                                  {Math.round(strategy.score)}%
                                </div>
                                <div className="text-xs text-muted-foreground">match</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFavoriteStrategy(strategy.id)}
                                className={userPreferences.favoriteStrategies.includes(strategy.id) ? "text-amber-500" : "text-muted-foreground"}
                              >
                                <Star className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardContent className="pt-6">
                            <div className="flex items-centre mb-4">
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-centre gap-1">
                                {getReasonIcon(strategy.reasonType)}
                                <span>{strategy.reason}</span>
                              </Badge>
                            </div>
                            
                            <p className="mb-4">{strategy.description}</p>
                            
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Steps:</h4>
                              <ol className="list-decimal pl-5 space-y-1">
                                {strategy.steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Good for:</h4>
                              <div className="flex flex-wrap gap-2">
                                {strategy.suitableFor.map((emotion) => (
                                  <Badge key={emotion} style={{ backgroundColor: getEmotionColor(emotion) }}>
                                    {emotion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                              <div className="text-sm text-muted-foreground">
                                <p><strong>Evidence:</strong> {strategy.evidenceBase}</p>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const feedback = prompt("How did this strategy work for you? Rate from 1-5 (5 being most effective)");
                                    if (feedback && !isNaN(parseInt(feedback)) && parseInt(feedback) >= 1 && parseInt(feedback) <= 5) {
                                      const notes = prompt("Any notes about your experience? (optional)");
                                      handleStrategyFeedback(strategy.id, parseInt(feedback), notes || "");
                                    }
                                  }}
                                >
                                  Rate Effectiveness
                                </Button>
                                <Button size="sm">Try This</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-12 border rounded-lg bg-grey-50">
                      <p className="text-lg font-medium mb-2">No recommendations available yet</p>
                      <p className="text-grey-500 mb-4">
                        Record more emotions and try different strategies to get personalized recommendations.
                      </p>
                      <Button onClick={() => router.push('/special-needs/emotional-regulation')}>
                        Record Emotions
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-6">
                  {userPreferences.favoriteStrategies.length > 0 ? (
                    <div className="space-y-4">
                      {userPreferences.favoriteStrategies.map(strategyId => {
                        const strategy = regulationStrategies.find(s => s.id === strategyId);
                        if (!strategy) return null;
                        
                        return (
                          <Card key={strategy.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <CardTitle className="flex items-centre gap-2">
                                  {strategy.name}
                                  <Star className="h-4 w-4 fill-current text-amber-500" />
                                </CardTitle>
                                <Badge variant="outline">
                                  {strategy.category}
                                </Badge>
                              </div>
                              <CardDescription>{strategy.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Steps:</h4>
                                <ol className="list-decimal pl-5 space-y-1">
                                  {strategy.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Good for:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {strategy.suitableFor.map((emotion) => (
                                    <Badge key={emotion} style={{ backgroundColor: getEmotionColor(emotion) }}>
                                      {emotion}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button 
                                variant="outline"
                                onClick={() => handleFavoriteStrategy(strategy.id)}
                              >
                                Remove from Favorites
                              </Button>
                              <Button>Try This</Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-centre py-12 border rounded-lg bg-grey-50">
                      <p className="text-lg font-medium mb-2">No favourite strategies yet</p>
                      <p className="text-grey-500 mb-4">
                        Add strategies to your favorites for quick access.
                      </p>
                      <Button onClick={() => setActiveTab("recommendations")}>
                        View Recommendations
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Strategy History</CardTitle>
                      <CardDescription>
                        Track which strategies you've used and how effective they were
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {strategyHistory.length > 0 ? (
                            strategyHistory.map((record) => {
                              const strategy = regulationStrategies.find(s => s.id === record.strategyId);
                              if (!strategy) return null;
                              
                              return (
                                <Card key={record.id} className="border-l-4" style={{ 
                                  borderLeftColor: record.emotion ? getEmotionColor(record.emotion) : "#808080" 
                                }}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-centre">
                                      <div className="flex items-centre gap-2">
                                        {record.emotion && (
                                          <span className="text-2xl">{getEmotionIcon(record.emotion)}</span>
                                        )}
                                        <CardTitle>{strategy.name}</CardTitle>
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {formatDate(record.timestamp)}
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pb-2">
                                    <div className="flex justify-between items-centre mb-2">
                                      <div>
                                        <Badge variant="outline" className="mr-2">
                                          {strategy.category}
                                        </Badge>
                                        {record.emotion && (
                                          <Badge style={{ backgroundColor: getEmotionColor(record.emotion) }}>
                                            {record.emotion}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-centre">
                                        <span className="mr-2">Effectiveness:</span>
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                              key={star} 
                                              className={`h-4 w-4 ${
                                                star <= record.effectiveness 
                                                  ? "fill-current text-amber-500" 
                                                  : "text-grey-300"
                                              }`} 
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {record.notes && (
                                      <div className="mt-2 text-sm">
                                        <p><strong>Notes:</strong> {record.notes}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })
                          ) : (
                            <div className="text-centre py-8">
                              <p>No strategy history recorded yet.</p>
                              <Button className="mt-4" onClick={() => setActiveTab("recommendations")}>
                                Try Your First Strategy
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Preferences</CardTitle>
                      <CardDescription>
                        Customise your strategy recommendations to match your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="strategy-types">Preferred Strategy Types</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {["physical", "cognitive", "social", "behavioural", "expressive"].map((type) => (
                              <div key={type} className="flex items-centre space-x-2">
                                <Switch 
                                  id={`type-${type}`} 
                                  checked={userPreferences.preferredStrategyTypes.includes(type)}
                                  onCheckedChange={(checked) => {
                                    setUserPreferences(prev => {
                                      const updated = { ...prev };
                                      if (checked) {
                                        updated.preferredStrategyTypes = [...updated.preferredStrategyTypes, type];
                                      } else {
                                        updated.preferredStrategyTypes = updated.preferredStrategyTypes.filter(t => t !== type);
                                      }
                                      return updated;
                                    });
                                  }}
                                />
                                <Label htmlFor={`type-${type}`} className="capitalize">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="strategy-complexity">Strategy Complexity</Label>
                          <Select 
                            value={userPreferences.strategyComplexity}
                            onValueChange={(value) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                strategyComplexity: value
                              }));
                            }}
                          >
                            <SelectTrigger id="strategy-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simple">Simple - Easy to remember and use</SelectItem>
                              <SelectItem value="moderate">Moderate - Some practise needed</SelectItem>
                              <SelectItem value="advanced">Advanced - More complex techniques</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-1">
                            Choose the level of complexity you're comfortable with
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                          <Select 
                            value={userPreferences.reminderFrequency}
                            onValueChange={(value) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                reminderFrequency: value
                              }));
                            }}
                          >
                            <SelectTrigger id="reminder-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low - Minimal reminders</SelectItem>
                              <SelectItem value="medium">Medium - Occasional reminders</SelectItem>
                              <SelectItem value="high">High - Frequent reminders</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-1">
                            How often would you like to be reminded to use strategies?
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-centre space-x-2">
                          <Switch 
                            id="auto-suggest" 
                            checked={userPreferences.autoSuggestEnabled}
                            onCheckedChange={(checked) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                autoSuggestEnabled: checked
                              }));
                            }}
                          />
                          <div>
                            <Label htmlFor="auto-suggest">Auto-suggest strategies</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically suggest strategies based on your emotional patterns
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/special-needs/emotional-regulation')}>
            Back to Emotional Regulation
          </Button>
          <Button onClick={() => router.push('/special-needs/emotional-regulation/pattern-recognition')}>
            View Emotion Patterns
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PersonalizedStrategyRecommendations;
