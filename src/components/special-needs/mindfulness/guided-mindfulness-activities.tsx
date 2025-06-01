'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Heart,
  Brain,
  Sparkles,
  Star,
  Settings,
  Moon,
  Sun,
  Cloud,
  Leaf,
  Waves,
  Mountain,
  Wind,
  Activity,
  Eye
} from "lucide-react";

const GuidedMindfulnessActivities = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("discover");
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);
  const [favoriteActivities, setFavoriteActivities] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    preferredDuration: "medium",
    preferredThemes: ["nature", "body-scan", "breathing"],
    preferredVoice: "female",
    reminderFrequency: "weekly",
    backgroundSounds: true
  });
  
  // Audio reference
  const audioRef = React.useRef(null);
  
  // Mindfulness activities database
  const mindfulnessActivities = [
    {
      id: "breathing-awareness",
      title: "Breathing Awareness",
      description: "A simple practise focusing on the breath to anchor attention to the present moment.",
      duration: 300, // 5 minutes in seconds
      category: "breathing",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Stress reduction", "Improved focus", "Emotional regulation"],
      audioSrc: "/audio/mindfulness/breathing-awareness.mp3",
      imageSrc: "/images/mindfulness/breathing-awareness.jpg",
      transcript: "Begin by finding a comfortable position...",
      instructions: [
        "Find a comfortable seated position",
        "Close your eyes or maintain a soft gaze",
        "Bring attention to your natural breathing",
        "Notice the sensation of breath entering and leaving your body",
        "When your mind wanders, gently return focus to your breath",
        "Continue for the duration of the practise"
      ],
      evidenceBase: "Supported by research from Oxford Mindfulness Centre and recommended in NICE guidelines for stress management."
    },
    {
      id: "body-scan",
      title: "Body Scan Meditation",
      description: "A practise that involves systematically bringing attention to different parts of the body.",
      duration: 600, // 10 minutes in seconds
      category: "body-scan",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Body awareness", "Tension release", "Improved sleep"],
      audioSrc: "/audio/mindfulness/body-scan.mp3",
      imageSrc: "/images/mindfulness/body-scan.jpg",
      transcript: "Begin by lying down or sitting comfortably...",
      instructions: [
        "Lie down or sit in a comfortable position",
        "Close your eyes and take a few deep breaths",
        "Bring attention to your feet, noticing any sensations",
        "Slowly move attention up through your legs, torso, arms, and head",
        "Notice sensations without judgment",
        "If your mind wanders, gently return to the body part you were focusing on"
      ],
      evidenceBase: "Recommended by the NHS for relaxation and sleep improvement. Research shows effectiveness for reducing physical tension."
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness Meditation",
      description: "A practise that cultivates feelings of goodwill, kindness, and warmth towards oneself and others.",
      duration: 480, // 8 minutes in seconds
      category: "compassion",
      ageRange: "secondary",
      difficulty: "intermediate",
      benefits: ["Increased empathy", "Improved relationships", "Reduced negative emotions"],
      audioSrc: "/audio/mindfulness/loving-kindness.mp3",
      imageSrc: "/images/mindfulness/loving-kindness.jpg",
      transcript: "Find a comfortable position and take a few deep breaths...",
      instructions: [
        "Sit comfortably with eyes closed",
        "Begin by directing kind wishes toward yourself",
        "Repeat phrases like 'May I be happy, may I be healthy, may I be safe'",
        "Gradually extend these wishes to others - loved ones, neutral people, difficult people",
        "Notice any feelings that arise without judgment",
        "End by extending kindness to all beings"
      ],
      evidenceBase: "Research from University of Oxford shows effectiveness for increasing compassion and reducing self-criticism."
    },
    {
      id: "mindful-listening",
      title: "Mindful Listening",
      description: "A practise that involves paying full attention to sounds in the environment.",
      duration: 240, // 4 minutes in seconds
      category: "sensory",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Improved attention", "Reduced distraction", "Present moment awareness"],
      audioSrc: "/audio/mindfulness/mindful-listening.mp3",
      imageSrc: "/images/mindfulness/mindful-listening.jpg",
      transcript: "Find a comfortable seated position...",
      instructions: [
        "Sit comfortably with eyes closed",
        "Bring attention to the sounds around you",
        "Notice sounds without labelling or judging them",
        "Observe how sounds arise and fade away",
        "When your mind wanders, gently return to listening",
        "Notice the quality, pitch, and volume of different sounds"
      ],
      evidenceBase: "Recommended by educational psychologists for improving attention and focus in classroom settings."
    },
    {
      id: "mountain-meditation",
      title: "Mountain Meditation",
      description: "A visualisation practise using the image of a mountain to cultivate stability and strength.",
      duration: 540, // 9 minutes in seconds
      category: "visualisation",
      ageRange: "secondary",
      difficulty: "intermediate",
      benefits: ["Emotional stability", "Inner strength", "Resilience"],
      audioSrc: "/audio/mindfulness/mountain-meditation.mp3",
      imageSrc: "/images/mindfulness/mountain-meditation.jpg",
      transcript: "Begin by finding a comfortable seated position...",
      instructions: [
        "Sit comfortably with a straight back",
        "Visualise a majestic mountain in your mind's eye",
        "Imagine the mountain as solid, stable, and unmoving",
        "Connect with the qualities of the mountain - strength, stability, dignity",
        "Imagine yourself embodying these qualities",
        "Notice how the mountain remains unchanged through changing seasons and weather"
      ],
      evidenceBase: "Based on practices developed by Jon Kabat-Zinn and used in Mindfulness-Based Stress Reduction (MBSR) programmes."
    },
    {
      id: "mindful-movement",
      title: "Mindful Movement",
      description: "A practise that brings awareness to gentle, deliberate movements of the body.",
      duration: 360, // 6 minutes in seconds
      category: "movement",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Body awareness", "Stress reduction", "Mind-body connection"],
      audioSrc: "/audio/mindfulness/mindful-movement.mp3",
      imageSrc: "/images/mindfulness/mindful-movement.jpg",
      transcript: "Begin by standing comfortably with your feet hip-width apart...",
      instructions: [
        "Stand with feet hip-width apart",
        "Bring awareness to your body and breath",
        "Slowly raise your arms as you inhale",
        "Lower your arms as you exhale",
        "Continue with slow, deliberate movements",
        "Pay attention to sensations in your muscles and joints",
        "Notice how your body feels during and after each movement"
      ],
      evidenceBase: "Recommended by physiotherapists and occupational therapists for improving body awareness and reducing physical tension."
    },
    {
      id: "cloud-watching",
      title: "Cloud Watching Meditation",
      description: "A practise that uses the metaphor of watching clouds to observe thoughts without attachment.",
      duration: 420, // 7 minutes in seconds
      category: "visualisation",
      ageRange: "primary",
      difficulty: "beginner",
      benefits: ["Reduced rumination", "Emotional regulation", "Mental clarity"],
      audioSrc: "/audio/mindfulness/cloud-watching.mp3",
      imageSrc: "/images/mindfulness/cloud-watching.jpg",
      transcript: "Find a comfortable position and take a few deep breaths...",
      instructions: [
        "Sit or lie comfortably with eyes closed",
        "Imagine looking up at a blue sky with passing clouds",
        "As thoughts arise, imagine placing them on clouds",
        "Watch the clouds float by without holding onto them",
        "Return to watching the sky when you notice yourself getting caught in thoughts",
        "Practise observing thoughts without judgment or attachment"
      ],
      evidenceBase: "Used in child-friendly mindfulness programmes in UK schools. Effective for teaching thought observation without attachment."
    },
    {
      id: "five-senses",
      title: "Five Senses Grounding",
      description: "A practise that uses the five senses to anchor attention to the present moment.",
      duration: 300, // 5 minutes in seconds
      category: "sensory",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Anxiety reduction", "Present moment awareness", "Stress management"],
      audioSrc: "/audio/mindfulness/five-senses.mp3",
      imageSrc: "/images/mindfulness/five-senses.jpg",
      transcript: "Begin by finding a comfortable position...",
      instructions: [
        "Sit comfortably and take a few deep breaths",
        "Notice 5 things you can see",
        "Notice 4 things you can feel/touch",
        "Notice 3 things you can hear",
        "Notice 2 things you can smell",
        "Notice 1 thing you can taste",
        "Take a deep breath to complete the practise"
      ],
      evidenceBase: "Recommended by NHS mental health services as an effective grounding technique for anxiety and panic."
    },
    {
      id: "gratitude-meditation",
      title: "Gratitude Meditation",
      description: "A practise that cultivates appreciation and thankfulness for aspects of life.",
      duration: 360, // 6 minutes in seconds
      category: "compassion",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Improved mood", "Positive outlook", "Reduced negativity bias"],
      audioSrc: "/audio/mindfulness/gratitude-meditation.mp3",
      imageSrc: "/images/mindfulness/gratitude-meditation.jpg",
      transcript: "Find a comfortable seated position and take a few deep breaths...",
      instructions: [
        "Sit comfortably with eyes closed",
        "Bring to mind something you're grateful for",
        "Notice how gratitude feels in your body",
        "Reflect on people, experiences, or things you appreciate",
        "Consider aspects of yourself you're grateful for",
        "End by setting an intention to notice moments of gratitude throughout your day"
      ],
      evidenceBase: "Research shows regular gratitude practise improves wellbeing and reduces symptoms of depression and anxiety."
    },
    {
      id: "mindful-eating",
      title: "Mindful Eating Practise",
      description: "A practise that brings full attention to the experience of eating.",
      duration: 480, // 8 minutes in seconds
      category: "sensory",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Healthier relationship with food", "Enhanced taste experience", "Improved digestion"],
      audioSrc: "/audio/mindfulness/mindful-eating.mp3",
      imageSrc: "/images/mindfulness/mindful-eating.jpg",
      transcript: "Begin by selecting a small piece of food...",
      instructions: [
        "Choose a small piece of food (like a raisin or slice of fruit)",
        "Observe it as if seeing it for the first time",
        "Notice its colour, texture, and smell",
        "Place it in your mouth without chewing at first",
        "Notice the sensations, taste, and texture",
        "Chew slowly and mindfully",
        "Notice the entire experience of eating"
      ],
      evidenceBase: "Recommended by dietitians and eating disorder specialists. Research shows effectiveness for reducing emotional eating."
    },
    {
      id: "rainbow-meditation",
      title: "Rainbow Meditation",
      description: "A colorful visualisation practise especially suitable for children.",
      duration: 240, // 4 minutes in seconds
      category: "visualisation",
      ageRange: "primary",
      difficulty: "beginner",
      benefits: ["Creativity", "Relaxation", "Emotional awareness"],
      audioSrc: "/audio/mindfulness/rainbow-meditation.mp3",
      imageSrc: "/images/mindfulness/rainbow-meditation.jpg",
      transcript: "Sit comfortably and take a few deep breaths...",
      instructions: [
        "Sit comfortably with eyes closed",
        "Imagine a beautiful rainbow appearing in your mind",
        "Notice each colour - red, orange, yellow, green, blue, indigo, violet",
        "Connect each colour with a feeling or quality",
        "Imagine being surrounded by the colors and their positive qualities",
        "Take a deep breath with each colour"
      ],
      evidenceBase: "Used in primary schools across the UK. Effective for introducing mindfulness concepts to young children."
    },
    {
      id: "mindful-walking",
      title: "Mindful Walking",
      description: "A practise that brings awareness to the experience of walking.",
      duration: 600, // 10 minutes in seconds
      category: "movement",
      ageRange: "all",
      difficulty: "beginner",
      benefits: ["Stress reduction", "Physical awareness", "Present moment focus"],
      audioSrc: "/audio/mindfulness/mindful-walking.mp3",
      imageSrc: "/images/mindfulness/mindful-walking.jpg",
      transcript: "Find a space where you can walk slowly for about 10-15 steps in one direction...",
      instructions: [
        "Find a space where you can walk slowly",
        "Stand still and become aware of your body",
        "Begin walking very slowly, noticing the sensation in your feet",
        "Pay attention to the lifting, moving, and placing of each foot",
        "Notice how your weight shifts with each step",
        "When your mind wanders, gently return focus to the walking",
        "Continue for the duration of the practise"
      ],
      evidenceBase: "Recommended by physiotherapists and mental health professionals. Research shows effectiveness for reducing rumination."
    }
  ];
  
  // Age-appropriate activities for different educational stages
  const nurseryActivities = mindfulnessActivities.filter(
    activity => activity.difficulty === "beginner" && 
    (activity.ageRange === "all" || activity.ageRange === "primary") &&
    activity.duration <= 300
  );
  
  const primaryActivities = mindfulnessActivities.filter(
    activity => activity.ageRange === "all" || activity.ageRange === "primary"
  );
  
  const secondaryActivities = mindfulnessActivities.filter(
    activity => activity.ageRange === "all" || activity.ageRange === "secondary"
  );
  
  // Load user data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchUserPreferences();
      fetchActivityHistory();
      fetchFavoriteActivities();
    }
  }, [session]);
  
  // Audio player controls
  useEffect(() => {
    if (audioRef.current) {
      // Set volume
      audioRef.current.volume = volume / 100;
      
      // Set muted state
      audioRef.current.muted = isMuted;
      
      // Play/pause based on state
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive"
          });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, isMuted]);
  
  // Update current time during playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);
  
  // Handle audio loading and metadata
  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Log completion
    if (currentActivity) {
      logActivityCompletion(currentActivity.id);
    }
    
    toast({
      title: "Practise Complete",
      description: "Well done! You've completed your mindfulness practise.",
    });
  };
  
  const fetchUserPreferences = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/preferences');
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
  
  const fetchActivityHistory = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/history');
      // const data = await response.json();
      // setActivityHistory(data.history);
      
      // Simulating API response with mock data
      const mockHistory = [
        {
          id: "history-1",
          activityId: "breathing-awareness",
          completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          duration: 300,
          feedback: {
            rating: 4,
            notes: "Felt calmer afterward"
          }
        },
        {
          id: "history-2",
          activityId: "body-scan",
          completedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          duration: 600,
          feedback: {
            rating: 5,
            notes: "Really helped with sleep"
          }
        },
        {
          id: "history-3",
          activityId: "five-senses",
          completedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          duration: 300,
          feedback: {
            rating: 3,
            notes: "Was a bit distracted"
          }
        }
      ];
      
      setActivityHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching activity history:', error);
      toast({
        title: "Error",
        description: "Failed to load your activity history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fetchFavoriteActivities = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/favorites');
      // const data = await response.json();
      // setFavoriteActivities(data.favorites);
      
      // Simulating API response with mock data
      const mockFavorites = ["breathing-awareness", "body-scan", "mindful-walking"];
      setFavoriteActivities(mockFavorites);
    } catch (error) {
      console.error('Error fetching favourite activities:', error);
      toast({
        title: "Error",
        description: "Failed to load your favourite activities. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/preferences', {
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
  
  const handleActivitySelection = (activity) => {
    setCurrentActivity(activity);
    setCurrentTime(0);
    setIsPlaying(false);
    
    // In a real implementation, we would load the actual audio file
    // For now, we'll simulate this
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = activity.audioSrc || "#";
        audioRef.current.load();
      }
    }, 100);
    
    setActiveTab("practise");
  };
  
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleToggleFavorite = async (activityId) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/favorites', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ activityId, action: favoriteActivities.includes(activityId) ? 'remove' : 'add' }),
      // });
      // const data = await response.json();
      
      // Update local state
      setFavoriteActivities(prev => {
        if (prev.includes(activityId)) {
          return prev.filter(id => id !== activityId);
        } else {
          return [...prev, activityId];
        }
      });
      
      toast({
        title: favoriteActivities.includes(activityId) ? "Removed from Favorites" : "Added to Favorites",
        description: "Your favorites have been updated.",
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update your favorites. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const logActivityCompletion = async (activityId) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/log', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     activityId,
      //     duration: currentActivity ? currentActivity.duration : 0,
      //     completedAt: new Date().toISOString()
      //   }),
      // });
      // const data = await response.json();
      
      // Update local history
      const newHistoryEntry = {
        id: `history-${Date.now()}`,
        activityId,
        completedAt: new Date().toISOString(),
        duration: currentActivity ? currentActivity.duration : 0,
        feedback: null
      };
      
      setActivityHistory(prev => [newHistoryEntry, ...prev]);
      
    } catch (error) {
      console.error('Error logging activity completion:', error);
      toast({
        title: "Error",
        description: "Failed to log your activity. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleActivityFeedback = async (activityId, rating, notes) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/mindfulness/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     activityId,
      //     rating,
      //     notes
      //   }),
      // });
      // const data = await response.json();
      
      // Update local history
      setActivityHistory(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.activityId === activityId && !item.feedback);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            feedback: { rating, notes }
          };
        }
        return updated;
      });
      
      toast({
        title: "Feedback Recorded",
        description: "Thank you for your feedback.",
      });
      
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Error",
        description: "Failed to save your feedback. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
  
  const getActivityById = (id) => {
    return mindfulnessActivities.find(activity => activity.id === id);
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'breathing':
        return <Wind className="h-6 w-6 text-blue-500" />;
      case 'body-scan':
        return <Heart className="h-6 w-6 text-pink-500" />;
      case 'visualisation':
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      case 'movement':
        return <Activity className="h-6 w-6 text-green-500" />;
      case 'sensory':
        return <Eye className="h-6 w-6 text-amber-500" />;
      case 'compassion':
        return <Heart className="h-6 w-6 text-red-500" />;
      default:
        return <Leaf className="h-6 w-6 text-green-500" />;
    }
  };
  
  const getAgeRangeLabel = (ageRange) => {
    switch (ageRange) {
      case 'primary':
        return 'Primary School';
      case 'secondary':
        return 'Secondary School';
      case 'all':
        return 'All Ages';
      default:
        return 'All Ages';
    }
  };
  
  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Beginner';
    }
  };
  
  const getDurationLabel = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guided Mindfulness Activities</CardTitle>
          <CardDescription>
            Discover and practise evidence-based mindfulness exercises to support emotional wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="practise">Practise</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading mindfulness activities...</p>
              </div>
            ) : (
              <>
                {/* Discover Tab */}
                <TabsContent value="discover" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recommended For You</CardTitle>
                        <CardDescription>Based on your preferences and history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {favoriteActivities.length > 0 ? (
                            favoriteActivities.slice(0, 3).map(activityId => {
                              const activity = getActivityById(activityId);
                              if (!activity) return null;
                              
                              return (
                                <Button 
                                  key={activity.id}
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => handleActivitySelection(activity)}
                                >
                                  <div className="flex items-centre">
                                    <div className="mr-2">
                                      {getCategoryIcon(activity.category)}
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium">{activity.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {getDurationLabel(activity.duration)}
                                      </div>
                                    </div>
                                  </div>
                                </Button>
                              );
                            })
                          ) : (
                            <div className="text-centre py-4">
                              <p className="text-sm text-muted-foreground">
                                Add favorites to see recommendations
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Quick Practices</CardTitle>
                        <CardDescription>Short mindfulness exercises (5 min or less)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {mindfulnessActivities
                            .filter(activity => activity.duration <= 300)
                            .slice(0, 3)
                            .map(activity => (
                              <Button 
                                key={activity.id}
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => handleActivitySelection(activity)}
                              >
                                <div className="flex items-centre">
                                  <div className="mr-2">
                                    {getCategoryIcon(activity.category)}
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium">{activity.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {getDurationLabel(activity.duration)}
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recently Practiced</CardTitle>
                        <CardDescription>Activities you've done recently</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {activityHistory.length > 0 ? (
                            activityHistory.slice(0, 3).map(historyItem => {
                              const activity = getActivityById(historyItem.activityId);
                              if (!activity) return null;
                              
                              return (
                                <Button 
                                  key={historyItem.id}
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => handleActivitySelection(activity)}
                                >
                                  <div className="flex items-centre">
                                    <div className="mr-2">
                                      {getCategoryIcon(activity.category)}
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium">{activity.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Last practiced: {new Date(historyItem.completedAt).toLocaleDateString('en-GB')}
                                      </div>
                                    </div>
                                  </div>
                                </Button>
                              );
                            })
                          ) : (
                            <div className="text-centre py-4">
                              <p className="text-sm text-muted-foreground">
                                No practise history yet
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Browse All Activities</h3>
                    
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="breathing">Breathing</TabsTrigger>
                        <TabsTrigger value="body-scan">Body Scan</TabsTrigger>
                        <TabsTrigger value="visualisation">Visualisation</TabsTrigger>
                        <TabsTrigger value="movement">Movement</TabsTrigger>
                        <TabsTrigger value="sensory">Sensory</TabsTrigger>
                        <TabsTrigger value="compassion">Compassion</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mindfulnessActivities.map(activity => (
                            <Card key={activity.id} className="overflow-hidden">
                              <div className="aspect-video bg-muted relative">
                                {activity.imageSrc ? (
                                  <Image 
                                    src={activity.imageSrc} 
                                    alt={activity.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-centre justify-centre bg-gradient-to-br from-blue-50 to-indigo-50">
                                    {getCategoryIcon(activity.category)}
                                  </div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                  onClick={() => handleToggleFavorite(activity.id)}
                                >
                                  <Star className={`h-5 w-5 ${favoriteActivities.includes(activity.id) ? "fill-current text-amber-500" : "text-muted-foreground"}`} />
                                </Button>
                              </div>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle>{activity.title}</CardTitle>
                                  <Badge variant="outline">
                                    {activity.category}
                                  </Badge>
                                </div>
                                <CardDescription>{activity.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <Badge variant="secondary" className="flex items-centre gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getDurationLabel(activity.duration)}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {getAgeRangeLabel(activity.ageRange)}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {getDifficultyLabel(activity.difficulty)}
                                  </Badge>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {activity.benefits.map((benefit, index) => (
                                      <Badge key={index} variant="outline" className="bg-green-50">
                                        {benefit}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                  className="w-full"
                                  onClick={() => handleActivitySelection(activity)}
                                >
                                  Start Practise
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {['breathing', 'body-scan', 'visualisation', 'movement', 'sensory', 'compassion'].map(category => (
                        <TabsContent key={category} value={category} className="mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mindfulnessActivities
                              .filter(activity => activity.category === category)
                              .map(activity => (
                                <Card key={activity.id} className="overflow-hidden">
                                  <div className="aspect-video bg-muted relative">
                                    {activity.imageSrc ? (
                                      <Image 
                                        src={activity.imageSrc} 
                                        alt={activity.title}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-centre justify-centre bg-gradient-to-br from-blue-50 to-indigo-50">
                                        {getCategoryIcon(activity.category)}
                                      </div>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                      onClick={() => handleToggleFavorite(activity.id)}
                                    >
                                      <Star className={`h-5 w-5 ${favoriteActivities.includes(activity.id) ? "fill-current text-amber-500" : "text-muted-foreground"}`} />
                                    </Button>
                                  </div>
                                  <CardHeader className="pb-2">
                                    <CardTitle>{activity.title}</CardTitle>
                                    <CardDescription>{activity.description}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pb-2">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      <Badge variant="secondary" className="flex items-centre gap-1">
                                        <Clock className="h-3 w-3" />
                                        {getDurationLabel(activity.duration)}
                                      </Badge>
                                      <Badge variant="secondary">
                                        {getAgeRangeLabel(activity.ageRange)}
                                      </Badge>
                                      <Badge variant="secondary">
                                        {getDifficultyLabel(activity.difficulty)}
                                      </Badge>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {activity.benefits.map((benefit, index) => (
                                          <Badge key={index} variant="outline" className="bg-green-50">
                                            {benefit}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </CardContent>
                                  <CardFooter>
                                    <Button 
                                      className="w-full"
                                      onClick={() => handleActivitySelection(activity)}
                                    >
                                      Start Practise
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </TabsContent>
                
                {/* Practise Tab */}
                <TabsContent value="practise" className="space-y-6">
                  {currentActivity ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 aspect-square relative rounded-lg overflow-hidden">
                            {currentActivity.imageSrc ? (
                              <Image 
                                src={currentActivity.imageSrc} 
                                alt={currentActivity.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-centre justify-centre bg-white">
                                {getCategoryIcon(currentActivity.category)}
                              </div>
                            )}
                          </div>
                          
                          <div className="md:w-2/3">
                            <h2 className="text-2xl font-bold mb-2">{currentActivity.title}</h2>
                            <p className="text-muted-foreground mb-4">{currentActivity.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="flex items-centre gap-1">
                                <Clock className="h-3 w-3" />
                                {getDurationLabel(currentActivity.duration)}
                              </Badge>
                              <Badge variant="secondary">
                                {getAgeRangeLabel(currentActivity.ageRange)}
                              </Badge>
                              <Badge variant="secondary">
                                {getDifficultyLabel(currentActivity.difficulty)}
                              </Badge>
                              <Badge variant="secondary">
                                {currentActivity.category}
                              </Badge>
                            </div>
                            
                            <div className="mb-4">
                              <h3 className="text-lg font-medium mb-2">Benefits:</h3>
                              <div className="flex flex-wrap gap-2">
                                {currentActivity.benefits.map((benefit, index) => (
                                  <Badge key={index} variant="outline" className="bg-green-50">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Instructions:</h3>
                              <ol className="list-decimal pl-5 space-y-1">
                                {currentActivity.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Audio Player</CardTitle>
                          <CardDescription>
                            Listen to the guided practise
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <audio 
                              ref={audioRef}
                              onLoadedMetadata={handleAudioLoaded}
                              onEnded={handleAudioEnded}
                              src={currentActivity.audioSrc || "#"}
                            />
                            
                            <div className="flex items-centre justify-centre space-x-4">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setCurrentTime(0);
                                  if (audioRef.current) {
                                    audioRef.current.currentTime = 0;
                                  }
                                }}
                              >
                                <SkipBack className="h-5 w-5" />
                              </Button>
                              
                              <Button
                                variant="default"
                                size="icon"
                                className="h-12 w-12 rounded-full"
                                onClick={handleTogglePlay}
                              >
                                {isPlaying ? (
                                  <Pause className="h-6 w-6" />
                                ) : (
                                  <Play className="h-6 w-6" />
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                disabled
                              >
                                <SkipForward className="h-5 w-5" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full"
                              />
                            </div>
                            
                            <div className="flex items-centre space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleMute}
                              >
                                {isMuted ? (
                                  <VolumeX className="h-5 w-5" />
                                ) : (
                                  <Volume2 className="h-5 w-5" />
                                )}
                              </Button>
                              <Slider
                                value={[volume]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={handleVolumeChange}
                                className="w-28"
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveTab("discover")}
                          >
                            Back to Activities
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleToggleFavorite(currentActivity.id)}
                            className={favoriteActivities.includes(currentActivity.id) ? "text-amber-500" : ""}
                          >
                            {favoriteActivities.includes(currentActivity.id) ? (
                              <>
                                <Star className="h-4 w-4 fill-current mr-2" />
                                Remove from Favorites
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Add to Favorites
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Evidence Base</CardTitle>
                          <CardDescription>
                            Research and recommendations supporting this practise
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{currentActivity.evidenceBase}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-centre py-12 border rounded-lg bg-grey-50">
                      <p className="text-lg font-medium mb-2">No activity selected</p>
                      <p className="text-grey-500 mb-4">
                        Select a mindfulness activity to begin your practise.
                      </p>
                      <Button onClick={() => setActiveTab("discover")}>
                        Browse Activities
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Practise History</CardTitle>
                      <CardDescription>
                        Track your mindfulness journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {activityHistory.length > 0 ? (
                            activityHistory.map((historyItem) => {
                              const activity = getActivityById(historyItem.activityId);
                              if (!activity) return null;
                              
                              return (
                                <Card key={historyItem.id} className="border-l-4" style={{ 
                                  borderLeftColor: activity.category === 'breathing' ? '#3B82F6' : 
                                                  activity.category === 'body-scan' ? '#EC4899' :
                                                  activity.category === 'visualisation' ? '#8B5CF6' :
                                                  activity.category === 'movement' ? '#10B981' :
                                                  activity.category === 'sensory' ? '#F59E0B' :
                                                  '#6366F1'
                                }}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-centre">
                                      <CardTitle className="flex items-centre gap-2">
                                        {getCategoryIcon(activity.category)}
                                        {activity.title}
                                      </CardTitle>
                                      <div className="text-sm text-muted-foreground">
                                        {formatDate(historyItem.completedAt)}
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pb-2">
                                    <div className="flex justify-between items-centre mb-2">
                                      <div>
                                        <Badge variant="outline" className="mr-2">
                                          {activity.category}
                                        </Badge>
                                        <Badge variant="secondary">
                                          {getDurationLabel(historyItem.duration)}
                                        </Badge>
                                      </div>
                                      
                                      {historyItem.feedback ? (
                                        <div className="flex items-centre">
                                          <span className="mr-2">Rating:</span>
                                          <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star 
                                                key={star} 
                                                className={`h-4 w-4 ${
                                                  star <= historyItem.feedback.rating 
                                                    ? "fill-current text-amber-500" 
                                                    : "text-grey-300"
                                                }`} 
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            const rating = prompt("How was this practise? Rate from 1-5 (5 being excellent)");
                                            if (rating && !isNaN(parseInt(rating)) && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
                                              const notes = prompt("Any notes about your experience? (optional)");
                                              handleActivityFeedback(historyItem.activityId, parseInt(rating), notes || "");
                                            }
                                          }}
                                        >
                                          Rate Practise
                                        </Button>
                                      )}
                                    </div>
                                    
                                    {historyItem.feedback?.notes && (
                                      <div className="mt-2 text-sm">
                                        <p><strong>Notes:</strong> {historyItem.feedback.notes}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                  <CardFooter>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleActivitySelection(activity)}
                                      className="w-full"
                                    >
                                      Practise Again
                                    </Button>
                                  </CardFooter>
                                </Card>
                              );
                            })
                          ) : (
                            <div className="text-centre py-8">
                              <p>No practise history recorded yet.</p>
                              <Button className="mt-4" onClick={() => setActiveTab("discover")}>
                                Start Your First Practise
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mindfulness Preferences</CardTitle>
                      <CardDescription>
                        Customise your mindfulness experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="preferred-duration">Preferred Practise Duration</Label>
                          <Select 
                            value={userPreferences.preferredDuration}
                            onValueChange={(value) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                preferredDuration: value
                              }));
                            }}
                          >
                            <SelectTrigger id="preferred-duration">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (5 minutes or less)</SelectItem>
                              <SelectItem value="medium">Medium (5-10 minutes)</SelectItem>
                              <SelectItem value="long">Long (10+ minutes)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-1">
                            Choose your preferred practise length
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferred-themes">Preferred Practise Themes</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {["breathing", "body-scan", "visualisation", "movement", "sensory", "compassion"].map((type) => (
                              <div key={type} className="flex items-centre space-x-2">
                                <Switch 
                                  id={`type-${type}`} 
                                  checked={userPreferences.preferredThemes.includes(type)}
                                  onCheckedChange={(checked) => {
                                    setUserPreferences(prev => {
                                      const updated = { ...prev };
                                      if (checked) {
                                        updated.preferredThemes = [...updated.preferredThemes, type];
                                      } else {
                                        updated.preferredThemes = updated.preferredThemes.filter(t => t !== type);
                                      }
                                      return updated;
                                    });
                                  }}
                                />
                                <Label htmlFor={`type-${type}`} className="capitalize">{type.replace('-', ' ')}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferred-voice">Preferred Narration Voice</Label>
                          <Select 
                            value={userPreferences.preferredVoice}
                            onValueChange={(value) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                preferredVoice: value
                              }));
                            }}
                          >
                            <SelectTrigger id="preferred-voice">
                              <SelectValue placeholder="Select voice" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="no-preference">No Preference</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="reminder-frequency">Practise Reminders</Label>
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
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="none">No Reminders</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-1">
                            How often would you like to be reminded to practise?
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-centre space-x-2">
                          <Switch 
                            id="background-sounds" 
                            checked={userPreferences.backgroundSounds}
                            onCheckedChange={(checked) => {
                              setUserPreferences(prev => ({
                                ...prev,
                                backgroundSounds: checked
                              }));
                            }}
                          />
                          <div>
                            <Label htmlFor="background-sounds">Background Sounds</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable gentle background sounds during practices
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
          <Button variant="outline" onClick={() => router.push('/special-needs')}>
            Back to Special Needs Support
          </Button>
          <Button onClick={() => router.push('/special-needs/emotional-regulation')}>
            Emotional Regulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuidedMindfulnessActivities;
