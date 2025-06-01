'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { CalendarIcon, TrendingUp, Clock, Calendar as CalendarIcon2, Activity, AlertCircle, Lightbulb, Download } from "lucide-react";

const EmotionalPatternRecognition = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [selectedEmotions, setSelectedEmotions] = useState(['all']);
  const [patternInsights, setPatternInsights] = useState([]);
  const [triggerPatterns, setTriggerPatterns] = useState([]);
  const [timePatterns, setTimePatterns] = useState([]);
  const [emotionTrends, setEmotionTrends] = useState([]);
  const [emotionCorrelations, setEmotionCorrelations] = useState([]);
  
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
  
  // Time periods for analysis
  const timePeriods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "custom", label: "Custom Range" }
  ];
  
  // Load emotion history and generate patterns on component mount
  useEffect(() => {
    if (session?.user) {
      fetchEmotionHistory();
    }
  }, [session]);
  
  // Regenerate patterns when date range or selected emotions change
  useEffect(() => {
    if (emotionHistory.length > 0) {
      generatePatterns();
    }
  }, [dateRange, selectedEmotions, emotionHistory]);
  
  const fetchEmotionHistory = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-regulation/history');
      // const data = await response.json();
      // setEmotionHistory(data.history);
      
      // Simulating API response with mock data
      setTimeout(() => {
        const mockHistory = generateMockEmotionHistory();
        setEmotionHistory(mockHistory);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching emotion history:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load your emotion history. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Generate mock emotion history for demonstration
  const generateMockEmotionHistory = () => {
    const history = [];
    const now = new Date();
    
    // Generate entries for the last 90 days
    for (let i = 0; i < 90; i++) {
      // Some days might have multiple entries
      const entriesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < entriesPerDay; j++) {
        const date = subDays(now, i);
        // Randomize the time of day
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        
        // Select a random emotion
        const allEmotionsList = [...basicEmotions, ...advancedEmotions];
        const emotion = allEmotionsList[Math.floor(Math.random() * allEmotionsList.length)];
        
        // Generate common triggers based on emotion
        let triggers = "";
        if (emotion.name === "Anxious" || emotion.name === "Nervous") {
          const anxiousTriggers = ["School presentation", "Test tomorrow", "Meeting new people", "Going to a party"];
          triggers = anxiousTriggers[Math.floor(Math.random() * anxiousTriggers.length)];
        } else if (emotion.name === "Angry" || emotion.name === "Frustrated") {
          const angryTriggers = ["Argument with friend", "Lost a game", "Too much homework", "Someone was unfair"];
          triggers = angryTriggers[Math.floor(Math.random() * angryTriggers.length)];
        } else if (emotion.name === "Happy" || emotion.name === "Excited") {
          const happyTriggers = ["Played with friends", "Got a good grade", "Family time", "Fun activity"];
          triggers = happyTriggers[Math.floor(Math.random() * happyTriggers.length)];
        } else if (emotion.name === "Sad" || emotion.name === "Disappointed") {
          const sadTriggers = ["Friend was mean", "Bad grade", "Missed an event", "Lost something important"];
          triggers = sadTriggers[Math.floor(Math.random() * sadTriggers.length)];
        } else {
          const generalTriggers = ["School situation", "Home situation", "Friend situation", "Personal thought"];
          triggers = generalTriggers[Math.floor(Math.random() * generalTriggers.length)];
        }
        
        // Create the history entry
        history.push({
          id: `emotion-${i}-${j}`,
          name: emotion.name,
          intensity: Math.floor(Math.random() * 10) + 1,
          timestamp: date.toISOString(),
          triggers: triggers,
          bodyFeelings: ["Chest", "Stomach"].slice(0, Math.floor(Math.random() * 3)),
          thoughts: "",
          strategiesUsed: []
        });
      }
    }
    
    // Sort by timestamp, newest first
    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  
  const generatePatterns = () => {
    // Filter history based on date range
    const filteredHistory = emotionHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });
    
    // Further filter by selected emotions if not 'all'
    const emotionFilteredHistory = selectedEmotions.includes('all') 
      ? filteredHistory 
      : filteredHistory.filter(entry => selectedEmotions.includes(entry.name));
    
    if (emotionFilteredHistory.length === 0) {
      setPatternInsights([]);
      setTriggerPatterns([]);
      setTimePatterns([]);
      setEmotionTrends([]);
      setEmotionCorrelations([]);
      return;
    }
    
    // Generate insights
    generateInsights(emotionFilteredHistory);
    
    // Generate trigger patterns
    generateTriggerPatterns(emotionFilteredHistory);
    
    // Generate time patterns
    generateTimePatterns(emotionFilteredHistory);
    
    // Generate emotion trends
    generateEmotionTrends(emotionFilteredHistory);
    
    // Generate emotion correlations
    generateEmotionCorrelations(filteredHistory);
  };
  
  const generateInsights = (history) => {
    const insights = [];
    
    // Most common emotion
    const emotionCounts = {};
    history.forEach(entry => {
      emotionCounts[entry.name] = (emotionCounts[entry.name] || 0) + 1;
    });
    
    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostCommonEmotion) {
      insights.push({
        id: "most-common-emotion",
        type: "frequency",
        title: "Most Common Emotion",
        description: `Your most frequently recorded emotion is ${mostCommonEmotion[0]} (${mostCommonEmotion[1]} times).`,
        emotion: mostCommonEmotion[0],
        count: mostCommonEmotion[1],
        icon: <Activity className="h-5 w-5" />
      });
    }
    
    // Highest intensity emotion
    const emotionIntensities = {};
    history.forEach(entry => {
      if (!emotionIntensities[entry.name]) {
        emotionIntensities[entry.name] = [];
      }
      emotionIntensities[entry.name].push(entry.intensity);
    });
    
    const averageIntensities = Object.entries(emotionIntensities).map(([emotion, intensities]) => {
      const average = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
      return { emotion, average };
    });
    
    const highestIntensityEmotion = averageIntensities
      .sort((a, b) => b.average - a.average)[0];
    
    if (highestIntensityEmotion) {
      insights.push({
        id: "highest-intensity-emotion",
        type: "intensity",
        title: "Highest Intensity Emotion",
        description: `${highestIntensityEmotion.emotion} tends to be your most intense emotion (average intensity: ${highestIntensityEmotion.average.toFixed(1)}).`,
        emotion: highestIntensityEmotion.emotion,
        intensity: highestIntensityEmotion.average,
        icon: <TrendingUp className="h-5 w-5" />
      });
    }
    
    // Time-based patterns
    const timeOfDayCounts = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };
    
    history.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      if (hour >= 5 && hour < 12) timeOfDayCounts.morning++;
      else if (hour >= 12 && hour < 17) timeOfDayCounts.afternoon++;
      else if (hour >= 17 && hour < 22) timeOfDayCounts.evening++;
      else timeOfDayCounts.night++;
    });
    
    const mostCommonTimeOfDay = Object.entries(timeOfDayCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostCommonTimeOfDay && mostCommonTimeOfDay[1] > 0) {
      insights.push({
        id: "common-time-of-day",
        type: "time",
        title: "Time Pattern",
        description: `You tend to record emotions most often during the ${mostCommonTimeOfDay[0]} (${mostCommonTimeOfDay[1]} entries).`,
        timeOfDay: mostCommonTimeOfDay[0],
        count: mostCommonTimeOfDay[1],
        icon: <Clock className="h-5 w-5" />
      });
    }
    
    // Day of week patterns
    const dayOfWeekCounts = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    };
    
    history.forEach(entry => {
      const day = new Date(entry.timestamp).toLocaleString('en-US', { weekday: 'long' });
      dayOfWeekCounts[day]++;
    });
    
    const mostCommonDayOfWeek = Object.entries(dayOfWeekCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostCommonDayOfWeek && mostCommonDayOfWeek[1] > 0) {
      insights.push({
        id: "common-day-of-week",
        type: "day",
        title: "Day of Week Pattern",
        description: `${mostCommonDayOfWeek[0]} is when you tend to record emotions most frequently (${mostCommonDayOfWeek[1]} entries).`,
        dayOfWeek: mostCommonDayOfWeek[0],
        count: mostCommonDayOfWeek[1],
        icon: <CalendarIcon2 className="h-5 w-5" />
      });
    }
    
    // Common triggers
    const triggerCounts = {};
    history.forEach(entry => {
      if (entry.triggers) {
        triggerCounts[entry.triggers] = (triggerCounts[entry.triggers] || 0) + 1;
      }
    });
    
    const mostCommonTrigger = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostCommonTrigger && mostCommonTrigger[1] > 1) {
      insights.push({
        id: "common-trigger",
        type: "trigger",
        title: "Common Trigger",
        description: `"${mostCommonTrigger[0]}" is a frequent trigger for your emotions (${mostCommonTrigger[1]} times).`,
        trigger: mostCommonTrigger[0],
        count: mostCommonTrigger[1],
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
    
    // Emotion improvement suggestions
    if (mostCommonEmotion && ["Anxious", "Angry", "Sad", "Frustrated", "Overwhelmed"].includes(mostCommonEmotion[0])) {
      let suggestion = "";
      
      if (mostCommonEmotion[0] === "Anxious") {
        suggestion = "Consider practicing mindfulness or deep breathing exercises when you notice anxiety building.";
      } else if (mostCommonEmotion[0] === "Angry" || mostCommonEmotion[0] === "Frustrated") {
        suggestion = "Taking a short break or using the 5-4-3-2-1 grounding technique might help when you feel anger rising.";
      } else if (mostCommonEmotion[0] === "Sad") {
        suggestion = "Connecting with friends or engaging in activities you enjoy might help improve your mood.";
      } else if (mostCommonEmotion[0] === "Overwhelmed") {
        suggestion = "Breaking tasks into smaller steps and focusing on one thing at a time might help reduce feeling overwhelmed.";
      }
      
      insights.push({
        id: "suggestion",
        type: "suggestion",
        title: "Helpful Suggestion",
        description: suggestion,
        emotion: mostCommonEmotion[0],
        icon: <Lightbulb className="h-5 w-5" />
      });
    }
    
    setPatternInsights(insights);
  };
  
  const generateTriggerPatterns = (history) => {
    // Group emotions by triggers
    const triggerEmotions = {};
    
    history.forEach(entry => {
      if (entry.triggers) {
        if (!triggerEmotions[entry.triggers]) {
          triggerEmotions[entry.triggers] = {};
        }
        triggerEmotions[entry.triggers][entry.name] = (triggerEmotions[entry.triggers][entry.name] || 0) + 1;
      }
    });
    
    // Convert to format for visualisation
    const triggerPatternData = Object.entries(triggerEmotions).map(([trigger, emotions]) => {
      return {
        trigger,
        ...emotions,
        total: Object.values(emotions).reduce((sum, count) => sum + count, 0)
      };
    });
    
    // Sort by total occurrences
    triggerPatternData.sort((a, b) => b.total - a.total);
    
    setTriggerPatterns(triggerPatternData.slice(0, 5)); // Top 5 triggers
  };
  
  const generateTimePatterns = (history) => {
    // Group by hour of day
    const hourCounts = Array(24).fill(0).map(() => ({ hour: 0, count: 0 }));
    
    history.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hourCounts[hour].hour = hour;
      hourCounts[hour].count++;
    });
    
    // Group by day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeekCounts = Array(7).fill(0).map((_, i) => ({ 
      day: i, 
      name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
      count: 0 
    }));
    
    history.forEach(entry => {
      const day = new Date(entry.timestamp).getDay();
      dayOfWeekCounts[day].count++;
    });
    
    setTimePatterns({
      hourly: hourCounts,
      daily: dayOfWeekCounts
    });
  };
  
  const generateEmotionTrends = (history) => {
    // Group by date
    const dateEmotions = {};
    
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!dateEmotions[date]) {
        dateEmotions[date] = {};
      }
      dateEmotions[date][entry.name] = (dateEmotions[date][entry.name] || 0) + 1;
    });
    
    // Convert to array and sort by date
    const trendData = Object.entries(dateEmotions).map(([date, emotions]) => {
      return {
        date,
        ...emotions
      };
    });
    
    trendData.sort((a, b) => a.date.localeCompare(b.date));
    
    setEmotionTrends(trendData);
  };
  
  const generateEmotionCorrelations = (history) => {
    // Find emotions that often occur together or in sequence
    const emotionPairs = {};
    const allEmotionNames = [...basicEmotions, ...advancedEmotions].map(e => e.name);
    
    // Initialize all possible pairs
    allEmotionNames.forEach(emotion1 => {
      allEmotionNames.forEach(emotion2 => {
        if (emotion1 !== emotion2) {
          const pairKey = [emotion1, emotion2].sort().join('-');
          if (!emotionPairs[pairKey]) {
            emotionPairs[pairKey] = {
              source: emotion1,
              target: emotion2,
              count: 0,
              strength: 0
            };
          }
        }
      });
    });
    
    // Sort history by timestamp
    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Look for emotions that occur within 24 hours of each other
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const currentEmotion = sortedHistory[i].name;
      const currentTime = new Date(sortedHistory[i].timestamp);
      
      // Look ahead up to 3 entries or 24 hours, whichever comes first
      for (let j = i + 1; j < Math.min(i + 4, sortedHistory.length); j++) {
        const nextEmotion = sortedHistory[j].name;
        const nextTime = new Date(sortedHistory[j].timestamp);
        
        // Check if within 24 hours
        const hoursDiff = (nextTime - currentTime) / (1000 * 60 * 60);
        if (hoursDiff <= 24 && currentEmotion !== nextEmotion) {
          const pairKey = [currentEmotion, nextEmotion].sort().join('-');
          emotionPairs[pairKey].count++;
        }
      }
    }
    
    // Calculate strength based on count
    const maxCount = Math.max(...Object.values(emotionPairs).map(pair => pair.count));
    
    Object.values(emotionPairs).forEach(pair => {
      pair.strength = maxCount > 0 ? pair.count / maxCount : 0;
    });
    
    // Filter to only include pairs that occurred at least once
    const significantPairs = Object.values(emotionPairs)
      .filter(pair => pair.count > 0)
      .sort((a, b) => b.count - a.count);
    
    setEmotionCorrelations(significantPairs.slice(0, 10)); // Top 10 correlations
  };
  
  const handleDateRangeChange = (period) => {
    const now = new Date();
    let start = now;
    
    switch (period) {
      case "7days":
        start = subDays(now, 7);
        break;
      case "30days":
        start = subDays(now, 30);
        break;
      case "90days":
        start = subDays(now, 90);
        break;
      case "custom":
        // Keep current custom range if already set
        return;
      default:
        start = subDays(now, 30);
    }
    
    setDateRange({ start, end: now });
  };
  
  const handleEmotionFilterChange = (emotions) => {
    setSelectedEmotions(emotions);
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
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  
  const exportData = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Date,Time,Emotion,Intensity,Trigger\n";
    
    // Data rows
    emotionHistory.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateStr = format(date, 'yyyy-MM-dd');
      const timeStr = format(date, 'HH:mm');
      
      csvContent += `${dateStr},${timeStr},${entry.name},${entry.intensity},"${entry.triggers}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emotion_data.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Your emotion data has been exported to CSV.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emotional Pattern Recognition</CardTitle>
          <CardDescription>
            Discover patterns in your emotional experiences to gain deeper insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="triggers">Trigger Analysis</TabsTrigger>
              <TabsTrigger value="time">Time Patterns</TabsTrigger>
              <TabsTrigger value="trends">Emotion Trends</TabsTrigger>
            </TabsList>
            
            {/* Controls for all tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-centre gap-4 my-6">
              <div className="space-y-2 w-full md:w-auto">
                <Label htmlFor="date-range">Time Period</Label>
                <Select 
                  defaultValue="30days"
                  onValueChange={handleDateRangeChange}
                >
                  <SelectTrigger id="date-range" className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {timePeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {timePeriods.find(p => p.value === "custom") && (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-[150px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.start ? format(dateRange.start, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.start}
                          onSelect={(date) => setDateRange({ ...dateRange, start: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-[150px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.end ? format(dateRange.end, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.end}
                          onSelect={(date) => setDateRange({ ...dateRange, end: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 w-full md:w-auto">
                <Label htmlFor="emotion-filter">Filter Emotions</Label>
                <Select 
                  defaultValue="all"
                  onValueChange={(value) => handleEmotionFilterChange([value])}
                >
                  <SelectTrigger id="emotion-filter" className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select emotions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Emotions</SelectItem>
                    {allEmotions.map((emotion) => (
                      <SelectItem key={emotion.name} value={emotion.name}>
                        <div className="flex items-centre">
                          <span className="mr-2">{emotion.icon}</span>
                          <span>{emotion.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full md:w-auto mt-auto"
                onClick={exportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading pattern analysis...</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {patternInsights.length > 0 ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        {patternInsights.map((insight) => (
                          <Card key={insight.id} className="border-l-4" style={{ 
                            borderLeftColor: insight.emotion ? getEmotionColor(insight.emotion) : "#6366F1" 
                          }}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg flex items-centre gap-2">
                                  <div className="bg-blue-100 p-1.5 rounded-full text-blue-700">
                                    {insight.icon}
                                  </div>
                                  {insight.title}
                                </CardTitle>
                                {insight.emotion && (
                                  <Badge style={{ backgroundColor: getEmotionColor(insight.emotion) }}>
                                    {insight.emotion}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p>{insight.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Emotion Distribution</CardTitle>
                          <CardDescription>
                            Breakdown of your emotions during this period
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={Object.entries(
                                    emotionHistory.reduce((acc, entry) => {
                                      acc[entry.name] = (acc[entry.name] || 0) + 1;
                                      return acc;
                                    }, {})
                                  ).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  nameKey="name"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {Object.entries(
                                    emotionHistory.reduce((acc, entry) => {
                                      acc[entry.name] = (acc[entry.name] || 0) + 1;
                                      return acc;
                                    }, {})
                                  ).map(([name]) => (
                                    <Cell key={name} fill={getEmotionColor(name)} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Emotion Correlations</CardTitle>
                          <CardDescription>
                            Emotions that often occur together or in sequence
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {emotionCorrelations.length > 0 ? (
                            <div className="space-y-4">
                              {emotionCorrelations.slice(0, 5).map((correlation, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-centre justify-between">
                                    <div className="flex items-centre gap-2">
                                      <span className="text-xl">{getEmotionIcon(correlation.source)}</span>
                                      <span>{correlation.source}</span>
                                      <span className="mx-2">→</span>
                                      <span className="text-xl">{getEmotionIcon(correlation.target)}</span>
                                      <span>{correlation.target}</span>
                                    </div>
                                    <Badge variant="outline">
                                      {correlation.count} times
                                    </Badge>
                                  </div>
                                  <div className="w-full bg-grey-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ 
                                        width: `${correlation.strength * 100}%`,
                                        background: `linear-gradient(90deg, ${getEmotionColor(correlation.source)}, ${getEmotionColor(correlation.target)})` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-centre py-4">Not enough data to identify correlations.</p>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-centre py-12 border rounded-lg bg-grey-50">
                      <p className="text-lg font-medium mb-2">No patterns detected yet</p>
                      <p className="text-grey-500 mb-4">
                        Record more emotions to discover patterns and insights.
                      </p>
                      <Button onClick={() => router.push('/special-needs/emotional-regulation')}>
                        Record Emotions
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Triggers Tab */}
                <TabsContent value="triggers" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Emotion Triggers Analysis</CardTitle>
                      <CardDescription>
                        See how different situations affect your emotions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {triggerPatterns.length > 0 ? (
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={triggerPatterns}
                              layout="vertical"
                              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis 
                                dataKey="trigger" 
                                type="category" 
                                width={100}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip />
                              <Legend />
                              {allEmotions.map(emotion => (
                                triggerPatterns.some(trigger => trigger[emotion.name] > 0) && (
                                  <Bar 
                                    key={emotion.name}
                                    dataKey={emotion.name} 
                                    stackId="a"
                                    fill={emotion.color}
                                    name={emotion.name}
                                  />
                                )
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-centre py-8">
                          No trigger patterns found in the selected date range.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Common Triggers by Emotion</CardTitle>
                        <CardDescription>
                          What typically triggers each emotion
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          {allEmotions.map(emotion => {
                            // Find triggers for this emotion
                            const emotionTriggers = emotionHistory
                              .filter(entry => entry.name === emotion.name && entry.triggers)
                              .reduce((acc, entry) => {
                                acc[entry.triggers] = (acc[entry.triggers] || 0) + 1;
                                return acc;
                              }, {});
                            
                            // Sort triggers by frequency
                            const sortedTriggers = Object.entries(emotionTriggers)
                              .sort((a, b) => b[1] - a[1]);
                            
                            if (sortedTriggers.length === 0) return null;
                            
                            return (
                              <div key={emotion.name} className="mb-6">
                                <h3 className="flex items-centre gap-2 font-medium mb-2">
                                  <span className="text-xl">{emotion.icon}</span>
                                  <span>{emotion.name}</span>
                                </h3>
                                <ul className="space-y-1 pl-8 list-disc">
                                  {sortedTriggers.slice(0, 3).map(([trigger, count]) => (
                                    <li key={trigger} className="text-sm">
                                      {trigger} <span className="text-grey-500">({count} times)</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }).filter(Boolean)}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Trigger Intensity Analysis</CardTitle>
                        <CardDescription>
                          How intensely different triggers affect you
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {triggerPatterns.length > 0 ? (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={90} data={
                                triggerPatterns.map(trigger => {
                                  // Calculate average intensity for this trigger
                                  const triggerEntries = emotionHistory.filter(entry => 
                                    entry.triggers === trigger.trigger
                                  );
                                  
                                  const avgIntensity = triggerEntries.reduce(
                                    (sum, entry) => sum + entry.intensity, 0
                                  ) / triggerEntries.length;
                                  
                                  return {
                                    trigger: trigger.trigger,
                                    intensity: avgIntensity
                                  };
                                })
                              }>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="trigger" />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                <Radar 
                                  name="Intensity" 
                                  dataKey="intensity" 
                                  stroke="#8884d8" 
                                  fill="#8884d8" 
                                  fillOpacity={0.6} 
                                />
                                <Tooltip />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <p className="text-centre py-8">
                            Not enough data for intensity analysis.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Time Patterns Tab */}
                <TabsContent value="time" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Time of Day Patterns</CardTitle>
                      <CardDescription>
                        When you tend to experience different emotions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {timePatterns.hourly && timePatterns.hourly.some(h => h.count > 0) ? (
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={timePatterns.hourly}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="hour" 
                                tickFormatter={(hour) => `${hour}:00`}
                              />
                              <YAxis />
                              <Tooltip 
                                labelFormatter={(hour) => `Time: ${hour}:00 - ${hour}:59`}
                              />
                              <Bar 
                                dataKey="count" 
                                name="Emotion Count" 
                                fill="#8884d8" 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-centre py-8">
                          No time of day patterns found in the selected date range.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Day of Week Patterns</CardTitle>
                      <CardDescription>
                        How your emotions vary throughout the week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {timePatterns.daily && timePatterns.daily.some(d => d.count > 0) ? (
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={timePatterns.daily}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar 
                                dataKey="count" 
                                name="Emotion Count" 
                                fill="#82ca9d" 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-centre py-8">
                          No day of week patterns found in the selected date range.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Emotion Calendar</CardTitle>
                      <CardDescription>
                        Your emotional journey over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-7 gap-1 text-centre text-xs">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="font-medium py-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1">
                          {eachDayOfInterval({
                            start: startOfWeek(dateRange.start),
                            end: endOfWeek(dateRange.end)
                          }).map(date => {
                            // Find emotions for this day
                            const dayEmotions = emotionHistory.filter(entry => 
                              isSameDay(new Date(entry.timestamp), date)
                            );
                            
                            // Get the most common emotion for this day
                            let dominantEmotion = null;
                            if (dayEmotions.length > 0) {
                              const emotionCounts = dayEmotions.reduce((acc, entry) => {
                                acc[entry.name] = (acc[entry.name] || 0) + 1;
                                return acc;
                              }, {});
                              
                              dominantEmotion = Object.entries(emotionCounts)
                                .sort((a, b) => b[1] - a[1])[0][0];
                            }
                            
                            return (
                              <div 
                                key={date.toISOString()} 
                                className={`aspect-square flex flex-col items-centre justify-centre rounded-md text-xs ${
                                  dominantEmotion 
                                    ? 'border-2' 
                                    : 'border bg-grey-50'
                                }`}
                                style={{
                                  borderColor: dominantEmotion ? getEmotionColor(dominantEmotion) : undefined,
                                  backgroundColor: dominantEmotion ? `${getEmotionColor(dominantEmotion)}20` : undefined
                                }}
                              >
                                <div className="font-medium">{date.getDate()}</div>
                                {dominantEmotion && (
                                  <div className="text-lg mt-1">
                                    {getEmotionIcon(dominantEmotion)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Emotion Trends Over Time</CardTitle>
                      <CardDescription>
                        How your emotions have changed over the selected period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {emotionTrends.length > 0 ? (
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={emotionTrends}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                              />
                              <YAxis />
                              <Tooltip 
                                labelFormatter={(date) => format(new Date(date), 'PPP')}
                              />
                              <Legend />
                              {allEmotions.map(emotion => (
                                emotionTrends.some(day => day[emotion.name] > 0) && (
                                  <Line 
                                    key={emotion.name}
                                    type="monotone" 
                                    dataKey={emotion.name}
                                    stroke={emotion.color}
                                    name={emotion.name}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                  />
                                )
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-centre py-8">
                          No trend data available for the selected date range.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Emotion Intensity Trends</CardTitle>
                        <CardDescription>
                          How the intensity of your emotions has changed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {emotionHistory.length > 0 ? (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={
                                  // Group by date and calculate average intensity
                                  Object.entries(
                                    emotionHistory.reduce((acc, entry) => {
                                      const date = entry.timestamp.split('T')[0];
                                      if (!acc[date]) {
                                        acc[date] = { intensities: [], count: 0 };
                                      }
                                      acc[date].intensities.push(entry.intensity);
                                      acc[date].count++;
                                      return acc;
                                    }, {})
                                  ).map(([date, data]) => ({
                                    date,
                                    avgIntensity: data.intensities.reduce((sum, val) => sum + val, 0) / data.intensities.length,
                                    count: data.count
                                  })).sort((a, b) => a.date.localeCompare(b.date))
                                }
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                                />
                                <YAxis domain={[0, 10]} />
                                <Tooltip 
                                  labelFormatter={(date) => format(new Date(date), 'PPP')}
                                  formatter={(value) => [`${value.toFixed(1)}`, 'Avg Intensity']}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="avgIntensity" 
                                  stroke="#ff7300" 
                                  name="Average Intensity"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <p className="text-centre py-8">
                            No intensity data available for the selected date range.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Emotion Frequency</CardTitle>
                        <CardDescription>
                          How often you record different emotions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {emotionHistory.length > 0 ? (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={
                                  Object.entries(
                                    emotionHistory.reduce((acc, entry) => {
                                      acc[entry.name] = (acc[entry.name] || 0) + 1;
                                      return acc;
                                    }, {})
                                  ).map(([name, count]) => ({ name, count }))
                                  .sort((a, b) => b.count - a.count)
                                  .slice(0, 10) // Top 10 emotions
                                }
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis 
                                  dataKey="name" 
                                  type="category" 
                                  width={80}
                                  tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar 
                                  dataKey="count" 
                                  name="Frequency" 
                                >
                                  {Object.entries(
                                    emotionHistory.reduce((acc, entry) => {
                                      acc[entry.name] = (acc[entry.name] || 0) + 1;
                                      return acc;
                                    }, {})
                                  ).map(([name]) => (
                                    <Cell key={name} fill={getEmotionColor(name)} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <p className="text-centre py-8">
                            No frequency data available for the selected date range.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/special-needs/emotional-regulation')}>
            Back to Emotional Regulation
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmotionalPatternRecognition;
