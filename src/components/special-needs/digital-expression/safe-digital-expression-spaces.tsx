'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  Lock,
  MessageCircle,
  Mic,
  PenTool,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  Trash2,
  User,
  Users,
  Video,
  Volume2,
  VolumeX
} from "lucide-react";
import Image from "next/image";

const SafeDigitalExpressionSpaces = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("journal");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState("private");
  const [expressionType, setExpressionType] = useState("all");
  const [journalEntries, setJournalEntries] = useState([]);
  const [artGallery, setArtGallery] = useState([]);
  const [mediaProjects, setMediaProjects] = useState([]);
  const [peerGroups, setPeerGroups] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newJournalEntry, setNewJournalEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
    tags: [],
    isPrivate: true
  });
  const [newTag, setNewTag] = useState("");
  
  // Mock data for journal entries
  const mockJournalEntries = [
    {
      id: "j1",
      title: "First day at new school",
      content: "Today was my first day at the new school. I was feeling really nervous in the morning, but by lunchtime I had met a few nice people. The teachers seem okay, and I like my science class the most. I'm still a bit worried about making friends, but it wasn't as bad as I thought it would be.",
      date: "2025-05-10T09:30:00Z",
      mood: "mixed",
      tags: ["school", "new beginnings", "anxiety"],
      isPrivate: true,
      hasResponses: false
    },
    {
      id: "j2",
      title: "Feeling frustrated with math homework",
      content: "I spent two hours on my math homework today and still couldn\'t figure out some of the problems. It makes me feel really stupid when everyone else seems to understand it. I know I should ask for help, but I\'m embarrassed. Maybe I\'ll try watching some tutorial videos online before the next class.",
      date: "2025-05-12T19:45:00Z",
      mood: "frustrated",
      tags: ["school", "homework", "math", "frustration"],
      isPrivate: true,
      hasResponses: false
    },
    {
      id: "j3",
      title: "Made the football team!",
      content: "I got the news today that I made the school football team! All that practise paid off. I'm so excited to start training with the team next week. Dad was really proud and said we'd go shopping for new boots this weekend. I can't wait to tell my friends from my old school.",
      date: "2025-05-14T16:20:00Z",
      mood: "happy",
      tags: ["sports", "achievement", "football"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "r1",
          author: "Ms. Thompson",
          role: "teacher",
          content: "Congratulations! Your hard work and dedication have paid off. The team is lucky to have you!",
          date: "2025-05-14T17:45:00Z"
        },
        {
          id: "r2",
          author: "Jamie",
          role: "peer",
          content: "That\'s awesome! I\'m on the team too, so I\'ll see you at practise!",
          date: "2025-05-14T18:30:00Z"
        }
      ]
    },
    {
      id: "j4",
      title: "Argument with my sister",
      content: "Had a big fight with my sister today over something really stupid. She borrowed my headphones without asking and then denied it. I know it's not a big deal, but it's about respect. I said some mean things I regret now. I should probably apologize tomorrow, but I'm still annoyed that she won't admit what she did.",
      date: "2025-05-15T21:10:00Z",
      mood: "angry",
      tags: ["family", "conflict", "emotions"],
      isPrivate: true,
      hasResponses: false
    },
    {
      id: "j5",
      title: "Mindfulness practise reflection",
      content: "I tried the 10-minute mindfulness exercise from class today. It was hard to sit still at first, but by the end I felt calmer. I noticed that my thoughts kept drifting to my upcoming science test, but I practiced bringing my attention back to my breathing like we learned. I think I\'ll try to do this every morning before school.",
      date: "2025-05-16T08:15:00Z",
      mood: "calm",
      tags: ["mindfulness", "wellbeing", "practise"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "r3",
          author: "Dr. Martinez",
          role: "counselor",
          content: "This is excellent reflection, and I'm glad you're finding the mindfulness exercises helpful. It's completely normal for your mind to wander during practise - the important part is noticing it and gently bringing your attention back, just as you did. Keep up the great work!",
          date: "2025-05-16T14:20:00Z"
        }
      ]
    }
  ];
  
  // Mock data for art gallery
  const mockArtGallery = [
    {
      id: "a1",
      title: "My emotions colour wheel",
      description: "I created this colour wheel to show different emotions I\'ve been feeling this month. Each colour represents a different feeling, and the size shows how often I felt that way.",
      date: "2025-05-08T15:30:00Z",
      medium: "digital",
      imageUrl: "/art/emotions-wheel.png",
      tags: ["emotions", "art therapy", "self-reflection"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "ar1",
          author: "Ms. Williams",
          role: "art teacher",
          content: "I love how you've used colour symbolism here. The way you've made 'calm' flow into 'happy' shows great insight into how our emotions connect.",
          date: "2025-05-09T10:15:00Z"
        }
      ]
    },
    {
      id: "a2",
      title: "Safe place visualisation",
      description: "This is a drawing of my 'safe place' that I imagine when I'm feeling stressed or anxious. It's a treehouse by the ocean where I can hear the waves and feel the breeze.",
      date: "2025-05-11T16:45:00Z",
      medium: "coloured pencil",
      imageUrl: "/art/safe-place.png",
      tags: ["anxiety", "coping strategies", "visualisation"],
      isPrivate: true,
      hasResponses: false
    },
    {
      id: "a3",
      title: "Anger monster",
      description: "This is what my anger feels like sometimes - like a monster that takes over. Drawing it helps me see it as something separate from me that I can control.",
      date: "2025-05-13T19:20:00Z",
      medium: "markers",
      imageUrl: "/art/anger-monster.png",
      tags: ["anger", "emotions", "coping strategies"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "ar2",
          author: "Dr. Martinez",
          role: "counselor",
          content: "This is a powerful visualisation of your anger. Externalizing emotions like this can be very helpful in learning to manage them. Have you noticed any changes in how you relate to your anger since creating this?",
          date: "2025-05-14T11:30:00Z"
        }
      ]
    }
  ];
  
  // Mock data for media projects
  const mockMediaProjects = [
    {
      id: "m1",
      title: "My anxiety journey",
      description: "A short video about my experience with anxiety and the strategies that have helped me manage it.",
      date: "2025-05-07T14:20:00Z",
      type: "video",
      duration: "3:45",
      thumbnailUrl: "/media/anxiety-journey-thumb.png",
      mediaUrl: "/media/anxiety-journey.mp4",
      tags: ["anxiety", "mental health", "coping strategies"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "mr1",
          author: "Jamie",
          role: "peer",
          content: "Thank you for sharing this. I\'ve been dealing with similar feelings and it helps to know I\'m not alone.",
          date: "2025-05-08T09:15:00Z"
        },
        {
          id: "mr2",
          author: "Dr. Martinez",
          role: "counselor",
          content: "This is a brave and insightful reflection on your journey. The strategies you've shared could be very helpful for others too.",
          date: "2025-05-08T13:40:00Z"
        }
      ]
    },
    {
      id: "m2",
      title: "Mindfulness meditation recording",
      description: "I recorded this guided meditation to help with focus and calm before tests. I use it myself and thought others might find it helpful too.",
      date: "2025-05-12T18:30:00Z",
      type: "audio",
      duration: "5:20",
      thumbnailUrl: "/media/meditation-thumb.png",
      mediaUrl: "/media/meditation.mp3",
      tags: ["mindfulness", "meditation", "test anxiety"],
      isPrivate: false,
      hasResponses: true,
      responses: [
        {
          id: "mr3",
          author: "Ms. Thompson",
          role: "teacher",
          content: "I played this for the class before our quiz today, and several students commented on how helpful it was. Thank you for creating this resource!",
          date: "2025-05-13T15:10:00Z"
        }
      ]
    },
    {
      id: "m3",
      title: "My personal timeline",
      description: "A digital timeline showing important events in my life and how they've shaped who I am today.",
      date: "2025-05-15T17:45:00Z",
      type: "interactive",
      thumbnailUrl: "/media/timeline-thumb.png",
      mediaUrl: "/media/timeline.html",
      tags: ["self-reflection", "identity", "personal history"],
      isPrivate: true,
      hasResponses: false
    }
  ];
  
  // Mock data for peer support groups
  const mockPeerGroups = [
    {
      id: "g1",
      name: "Test Anxiety Support",
      description: "A group for sharing strategies and support for managing anxiety around tests and exams.",
      members: 12,
      facilitator: "Dr. Martinez",
      tags: ["anxiety", "school", "exams", "stress"],
      isPrivate: false,
      recentActivity: "5 new posts today",
      messages: [
        {
          id: "gm1",
          author: "Alex",
          role: "peer",
          content: "Does anyone have tips for staying calm during math tests? I always freeze up even when I know the material.",
          date: "2025-05-16T09:30:00Z",
          responses: [
            {
              id: "gmr1",
              author: "Jamie",
              role: "peer",
              content: "I use the 4-7-8 breathing technique right before the test starts. Breathe in for 4 counts, hold for 7, exhale for 8. It really helps calm my nervous system.",
              date: "2025-05-16T09:45:00Z"
            },
            {
              id: "gmr2",
              author: "Dr. Martinez",
              role: "facilitator",
              content: "Great suggestion, Jamie! Alex, another strategy is to write down all your formulas on the test paper as soon as you receive it. This creates an external reference so you don't have to worry about forgetting them.",
              date: "2025-05-16T10:15:00Z"
            }
          ]
        },
        {
          id: "gm2",
          author: "Sam",
          role: "peer",
          content: "I had my history exam today and used the visualisation technique we discussed last week. It really helped! I imagined myself successfully completing the test before I started, and I felt much more confident.",
          date: "2025-05-16T15:20:00Z",
          responses: [
            {
              id: "gmr3",
              author: "Dr. Martinez",
              role: "facilitator",
              content: "That's wonderful to hear, Sam! Positive visualisation can be a powerful tool. Would you be willing to share more about how you prepared for this in our next group meeting?",
              date: "2025-05-16T16:00:00Z"
            }
          ]
        }
      ]
    },
    {
      id: "g2",
      name: "New Student Connection",
      description: "A space for students who are new to the school to connect, share experiences, and support each other.",
      members: 8,
      facilitator: "Ms. Thompson",
      tags: ["new students", "transitions", "friendship", "school"],
      isPrivate: false,
      recentActivity: "2 new posts today",
      messages: [
        {
          id: "gm3",
          author: "Jordan",
          role: "peer",
          content: "Today was my first day and I got completely lost trying to find the science lab. Does anyone have tips for navigating the school?",
          date: "2025-05-15T16:10:00Z",
          responses: [
            {
              id: "gmr4",
              author: "Taylor",
              role: "peer",
              content: "I\'ve been here for two weeks now and still get lost sometimes! I found that taking a photo of the school map helped. Also, the colour-coded hallways make more sense after a few days.",
              date: "2025-05-15T16:25:00Z"
            },
            {
              id: "gmr5",
              author: "Ms. Thompson",
              role: "facilitator",
              content: "Great suggestion, Taylor. Jordan, I'd be happy to meet you at the main entrance tomorrow morning and walk through your schedule if that would help.",
              date: "2025-05-15T17:00:00Z"
            }
          ]
        }
      ]
    },
    {
      id: "g3",
      name: "Mindfulness Practise",
      description: "A group focused on practicing and discussing mindfulness techniques for stress management and emotional regulation.",
      members: 15,
      facilitator: "Dr. Martinez",
      tags: ["mindfulness", "meditation", "stress", "wellbeing"],
      isPrivate: false,
      recentActivity: "7 new posts today",
      messages: [
        {
          id: "gm4",
          author: "Riley",
          role: "peer",
          content: "I\'ve been trying the body scan meditation before bed, but I keep falling asleep halfway through! Is that normal or am I doing it wrong?",
          date: "2025-05-16T20:15:00Z",
          responses: [
            {
              id: "gmr6",
              author: "Dr. Martinez",
              role: "facilitator",
              content: "That's completely normal, Riley! In fact, the body scan can be a great tool for helping with sleep. If your goal is relaxation before bed, falling asleep is a sign it's working. If you want to practise staying present through the whole exercise, you might try it earlier in the day when you're more alert.",
              date: "2025-05-16T20:30:00Z"
            }
          ]
        }
      ]
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch data from the API
      // For now, we'll simulate loading with a timeout
      setTimeout(() => {
        setJournalEntries(mockJournalEntries);
        setArtGallery(mockArtGallery);
        setMediaProjects(mockMediaProjects);
        setPeerGroups(mockPeerGroups);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateJournalEntry = async () => {
    try {
      setIsLoading(true);
      
      // Validate entry
      if (!newJournalEntry.title.trim()) {
        toast({
          title: "Error",
          description: "Please provide a title for your journal entry.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!newJournalEntry.content.trim()) {
        toast({
          title: "Error",
          description: "Please write something in your journal entry.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/digital-expression/journal', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newJournalEntry),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        const newEntry = {
          id: `j${journalEntries.length + 1}`,
          title: newJournalEntry.title,
          content: newJournalEntry.content,
          date: new Date().toISOString(),
          mood: newJournalEntry.mood,
          tags: [...newJournalEntry.tags],
          isPrivate: newJournalEntry.isPrivate,
          hasResponses: false
        };
        
        setJournalEntries([newEntry, ...journalEntries]);
        
        // Reset form
        setNewJournalEntry({
          title: "",
          content: "",
          mood: "neutral",
          tags: [],
          isPrivate: true
        });
        
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your journal entry has been saved.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error creating journal entry:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !newJournalEntry.tags.includes(newTag.trim())) {
      setNewJournalEntry({
        ...newJournalEntry,
        tags: [...newJournalEntry.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setNewJournalEntry({
      ...newJournalEntry,
      tags: newJournalEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleJoinGroup = (groupId) => {
    toast({
      title: "Group Joined",
      description: "You have successfully joined this group.",
    });
  };
  
  const handlePostMessage = (groupId) => {
    toast({
      title: "Message Posted",
      description: "Your message has been posted to the group.",
    });
  };
  
  const getFilteredJournalEntries = () => {
    let filtered = [...journalEntries];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => {
        return (
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply privacy filter
    if (privacyLevel !== "all") {
      filtered = filtered.filter(entry => {
        if (privacyLevel === "private") return entry.isPrivate;
        if (privacyLevel === "shared") return !entry.isPrivate;
        return true;
      });
    }
    
    return filtered;
  };
  
  const getFilteredArtworks = () => {
    let filtered = [...artGallery];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artwork => {
        return (
          artwork.title.toLowerCase().includes(query) ||
          artwork.description.toLowerCase().includes(query) ||
          artwork.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply privacy filter
    if (privacyLevel !== "all") {
      filtered = filtered.filter(artwork => {
        if (privacyLevel === "private") return artwork.isPrivate;
        if (privacyLevel === "shared") return !artwork.isPrivate;
        return true;
      });
    }
    
    return filtered;
  };
  
  const getFilteredMediaProjects = () => {
    let filtered = [...mediaProjects];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply privacy filter
    if (privacyLevel !== "all") {
      filtered = filtered.filter(project => {
        if (privacyLevel === "private") return project.isPrivate;
        if (privacyLevel === "shared") return !project.isPrivate;
        return true;
      });
    }
    
    // Apply expression type filter
    if (expressionType !== "all") {
      filtered = filtered.filter(project => project.type === expressionType);
    }
    
    return filtered;
  };
  
  const getFilteredPeerGroups = () => {
    let filtered = [...peerGroups];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => {
        return (
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query) ||
          group.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }
    
    return filtered;
  };
  
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      case "anxious":
        return "😰";
      case "calm":
        return "😌";
      case "frustrated":
        return "😤";
      case "proud":
        return "😁";
      case "confused":
        return "😕";
      case "mixed":
        return "😐";
      default:
        return "😐";
    }
  };
  
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "audio":
        return <Volume2 className="h-5 w-5 text-green-500" />;
      case "interactive":
        return <PenTool className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getPrivacyBadge = (isPrivate) => {
    if (isPrivate) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-centre gap-1">
          <Lock className="h-3 w-3" />
          Private
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-centre gap-1">
          <Users className="h-3 w-3" />
          Shared
        </Badge>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Safe Digital Expression Spaces</CardTitle>
          <CardDescription>
            Express yourself, reflect, and connect in a secure digital environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="journal">Digital Journal</TabsTrigger>
              <TabsTrigger value="art">Creative Expression</TabsTrigger>
              <TabsTrigger value="media">Media Projects</TabsTrigger>
              <TabsTrigger value="groups">Peer Support</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading content...</p>
              </div>
            ) : (
              <>
                {/* Digital Journal Tab */}
                <TabsContent value="journal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Journal Entry</CardTitle>
                      <CardDescription>
                        Express your thoughts, feelings, and experiences in a safe space
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="entry-title">Title</Label>
                        <Input 
                          id="entry-title" 
                          placeholder="Give your entry a title"
                          value={newJournalEntry.title}
                          onChange={(e) => setNewJournalEntry({...newJournalEntry, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="entry-content">Journal Entry</Label>
                        <Textarea 
                          id="entry-content" 
                          placeholder="Write your thoughts here..."
                          className="min-h-[150px]"
                          value={newJournalEntry.content}
                          onChange={(e) => setNewJournalEntry({...newJournalEntry, content: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="entry-mood">How are you feeling?</Label>
                          <Select 
                            value={newJournalEntry.mood}
                            onValueChange={(value) => setNewJournalEntry({...newJournalEntry, mood: value})}
                          >
                            <SelectTrigger id="entry-mood">
                              <SelectValue placeholder="Select a mood" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="happy">Happy 😊</SelectItem>
                              <SelectItem value="sad">Sad 😢</SelectItem>
                              <SelectItem value="angry">Angry 😠</SelectItem>
                              <SelectItem value="anxious">Anxious 😰</SelectItem>
                              <SelectItem value="calm">Calm 😌</SelectItem>
                              <SelectItem value="frustrated">Frustrated 😤</SelectItem>
                              <SelectItem value="proud">Proud 😁</SelectItem>
                              <SelectItem value="confused">Confused 😕</SelectItem>
                              <SelectItem value="mixed">Mixed feelings 😐</SelectItem>
                              <SelectItem value="neutral">Neutral 😐</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entry-privacy">Privacy Setting</Label>
                          <div className="flex items-centre justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <Label htmlFor="entry-privacy">
                                {newJournalEntry.isPrivate ? "Private Entry" : "Shared Entry"}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {newJournalEntry.isPrivate 
                                  ? "Only you can see this entry" 
                                  : "Teachers and counselors can see and respond"}
                              </p>
                            </div>
                            <Switch 
                              id="entry-privacy" 
                              checked={newJournalEntry.isPrivate}
                              onCheckedChange={(checked) => {
                                setNewJournalEntry({...newJournalEntry, isPrivate: checked});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newJournalEntry.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-centre gap-1">
                              {tag}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1 hover:bg-secondary"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add a tag (e.g., school, friends, goals)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddTag}>Add</Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleCreateJournalEntry}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Saving..." : "Save Journal Entry"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search journal entries..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={privacyLevel}
                        onValueChange={setPrivacyLevel}
                      >
                        <SelectTrigger className="w-[150px]">
                          <Lock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Entries</SelectItem>
                          <SelectItem value="private">Private Only</SelectItem>
                          <SelectItem value="shared">Shared Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedEntry ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-centre gap-2">
                              <CardTitle>{selectedEntry.title}</CardTitle>
                              <span className="text-2xl">{getMoodEmoji(selectedEntry.mood)}</span>
                            </div>
                            <CardDescription>
                              {getFormattedDate(selectedEntry.date)} • {getPrivacyBadge(selectedEntry.isPrivate)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedEntry(null)}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <p className="whitespace-pre-line">{selectedEntry.content}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {selectedEntry.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {selectedEntry.hasResponses && (
                            <div className="mt-6 space-y-4">
                              <h3 className="text-lg font-medium">Responses</h3>
                              <div className="space-y-4">
                                {selectedEntry.responses.map(response => (
                                  <div key={response.id} className="rounded-lg border p-4 bg-muted/50">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-centre gap-2">
                                        <Badge variant="outline">{response.role}</Badge>
                                        <span className="font-medium">{response.author}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {getFormattedDate(response.date)}
                                      </span>
                                    </div>
                                    <p>{response.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <PenTool className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        
                        {selectedEntry.isPrivate && (
                          <Button variant="outline">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share with Support Team
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {getFilteredJournalEntries().map(entry => (
                        <Card 
                          key={entry.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-centre gap-2">
                                <CardTitle className="text-lg">{entry.title}</CardTitle>
                                <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                              </div>
                              <div className="flex items-centre gap-2">
                                {getPrivacyBadge(entry.isPrivate)}
                                {entry.hasResponses && (
                                  <Badge variant="secondary" className="flex items-centre gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    Responses
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardDescription>
                              {getFormattedDate(entry.date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="line-clamp-3">{entry.content}</p>
                          </CardContent>
                          <CardFooter>
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {entry.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{entry.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {getFilteredJournalEntries().length === 0 && (
                        <div className="text-centre py-12">
                          <p className="text-muted-foreground">
                            No journal entries found matching your filters. Try adjusting your search criteria or create a new entry.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Creative Expression Tab */}
                <TabsContent value="art" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creative Expression Gallery</CardTitle>
                      <CardDescription>
                        Express your emotions and experiences through art, drawing, and creative projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Upload New Artwork
                        </Button>
                        
                        <div className="flex items-centre gap-2">
                          <Select 
                            value={privacyLevel}
                            onValueChange={setPrivacyLevel}
                          >
                            <SelectTrigger className="w-[150px]">
                              <Lock className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Privacy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Artwork</SelectItem>
                              <SelectItem value="private">Private Only</SelectItem>
                              <SelectItem value="shared">Shared Only</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search artwork..."
                              className="pl-8 w-[200px]"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {selectedArtwork ? (
                        <Card>
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            {/* In a real implementation, this would be an actual image */}
                            <div className="absolute inset-0 bg-grey-200 flex items-centre justify-centre">
                              <ImageIcon className="h-12 w-12 text-grey-400" />
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{selectedArtwork.title}</CardTitle>
                                <CardDescription>
                                  {getFormattedDate(selectedArtwork.date)} • {selectedArtwork.medium} • {getPrivacyBadge(selectedArtwork.isPrivate)}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedArtwork(null)}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="space-y-4">
                              <p>{selectedArtwork.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {selectedArtwork.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              {selectedArtwork.hasResponses && (
                                <div className="mt-6 space-y-4">
                                  <h3 className="text-lg font-medium">Feedback</h3>
                                  <div className="space-y-4">
                                    {selectedArtwork.responses.map(response => (
                                      <div key={response.id} className="rounded-lg border p-4 bg-muted/50">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-centre gap-2">
                                            <Badge variant="outline">{response.role}</Badge>
                                            <span className="font-medium">{response.author}</span>
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {getFormattedDate(response.date)}
                                          </span>
                                        </div>
                                        <p>{response.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            
                            {selectedArtwork.isPrivate && (
                              <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share with Support Team
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {getFilteredArtworks().map(artwork => (
                            <Card 
                              key={artwork.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedArtwork(artwork)}
                            >
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                {/* In a real implementation, this would be an actual image */}
                                <div className="absolute inset-0 bg-grey-200 flex items-centre justify-centre">
                                  <ImageIcon className="h-8 w-8 text-grey-400" />
                                </div>
                              </div>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{artwork.title}</CardTitle>
                                  <div className="flex items-centre gap-2">
                                    {getPrivacyBadge(artwork.isPrivate)}
                                  </div>
                                </div>
                                <CardDescription>
                                  {getFormattedDate(artwork.date)} • {artwork.medium}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <p className="line-clamp-2">{artwork.description}</p>
                              </CardContent>
                              <CardFooter>
                                <div className="flex flex-wrap gap-1">
                                  {artwork.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {artwork.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{artwork.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                          
                          {getFilteredArtworks().length === 0 && (
                            <div className="col-span-full text-centre py-12">
                              <p className="text-muted-foreground">
                                No artwork found matching your filters. Try adjusting your search criteria or upload new artwork.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Media Projects Tab */}
                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Projects</CardTitle>
                      <CardDescription>
                        Express yourself through video, audio, and interactive media projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Project
                        </Button>
                        
                        <div className="flex items-centre gap-2">
                          <Select 
                            value={expressionType}
                            onValueChange={setExpressionType}
                          >
                            <SelectTrigger className="w-[150px]">
                              <Filter className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="interactive">Interactive</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select 
                            value={privacyLevel}
                            onValueChange={setPrivacyLevel}
                          >
                            <SelectTrigger className="w-[150px]">
                              <Lock className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Privacy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Projects</SelectItem>
                              <SelectItem value="private">Private Only</SelectItem>
                              <SelectItem value="shared">Shared Only</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search projects..."
                              className="pl-8 w-[200px]"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {selectedProject ? (
                        <Card>
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            {/* In a real implementation, this would be an actual media player */}
                            <div className="absolute inset-0 bg-grey-200 flex items-centre justify-centre">
                              {getMediaTypeIcon(selectedProject.type)}
                              <Play className="h-12 w-12 text-grey-400 ml-2" />
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-centre gap-2">
                                  <CardTitle>{selectedProject.title}</CardTitle>
                                  {getMediaTypeIcon(selectedProject.type)}
                                </div>
                                <CardDescription>
                                  {getFormattedDate(selectedProject.date)} • {selectedProject.duration} • {getPrivacyBadge(selectedProject.isPrivate)}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedProject(null)}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="space-y-4">
                              <p>{selectedProject.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              {selectedProject.hasResponses && (
                                <div className="mt-6 space-y-4">
                                  <h3 className="text-lg font-medium">Feedback</h3>
                                  <div className="space-y-4">
                                    {selectedProject.responses.map(response => (
                                      <div key={response.id} className="rounded-lg border p-4 bg-muted/50">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-centre gap-2">
                                            <Badge variant="outline">{response.role}</Badge>
                                            <span className="font-medium">{response.author}</span>
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {getFormattedDate(response.date)}
                                          </span>
                                        </div>
                                        <p>{response.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">
                              <Play className="mr-2 h-4 w-4" />
                              Play
                            </Button>
                            
                            {selectedProject.isPrivate && (
                              <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share with Support Team
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {getFilteredMediaProjects().map(project => (
                            <Card 
                              key={project.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedProject(project)}
                            >
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                {/* In a real implementation, this would be an actual thumbnail */}
                                <div className="absolute inset-0 bg-grey-200 flex items-centre justify-centre">
                                  {getMediaTypeIcon(project.type)}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {project.duration}
                                </div>
                              </div>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{project.title}</CardTitle>
                                  <div className="flex items-centre gap-2">
                                    {getPrivacyBadge(project.isPrivate)}
                                  </div>
                                </div>
                                <CardDescription>
                                  {getFormattedDate(project.date)}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <p className="line-clamp-2">{project.description}</p>
                              </CardContent>
                              <CardFooter>
                                <div className="flex flex-wrap gap-1">
                                  {project.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {project.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{project.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                          
                          {getFilteredMediaProjects().length === 0 && (
                            <div className="col-span-full text-centre py-12">
                              <p className="text-muted-foreground">
                                No media projects found matching your filters. Try adjusting your search criteria or create a new project.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Peer Support Tab */}
                <TabsContent value="groups" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Peer Support Groups</CardTitle>
                      <CardDescription>
                        Connect with peers and support each other in a safe, moderated environment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="flex items-centre gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Shield className="mr-1 h-3 w-3" />
                            All groups are supervised by trained staff
                          </Badge>
                        </div>
                        
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search groups..."
                            className="pl-8 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {selectedGroup ? (
                        <Card>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{selectedGroup.name}</CardTitle>
                                <CardDescription>
                                  Facilitated by {selectedGroup.facilitator} • {selectedGroup.members} members
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedGroup(null)}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-medium mb-2">About this Group</h3>
                                <p>{selectedGroup.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {selectedGroup.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h3 className="text-lg font-medium mb-4">Group Discussion</h3>
                                <ScrollArea className="h-[400px] pr-4">
                                  <div className="space-y-6">
                                    {selectedGroup.messages.map(message => (
                                      <div key={message.id} className="space-y-4">
                                        <div className="rounded-lg border p-4">
                                          <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-centre gap-2">
                                              <Badge variant="outline">{message.role}</Badge>
                                              <span className="font-medium">{message.author}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                              {getFormattedDate(message.date)}
                                            </span>
                                          </div>
                                          <p>{message.content}</p>
                                        </div>
                                        
                                        {message.responses && message.responses.length > 0 && (
                                          <div className="pl-6 space-y-4">
                                            {message.responses.map(response => (
                                              <div key={response.id} className="rounded-lg border p-4 bg-muted/50">
                                                <div className="flex justify-between items-start mb-2">
                                                  <div className="flex items-centre gap-2">
                                                    <Badge variant="outline">{response.role}</Badge>
                                                    <span className="font-medium">{response.author}</span>
                                                  </div>
                                                  <span className="text-sm text-muted-foreground">
                                                    {getFormattedDate(response.date)}
                                                  </span>
                                                </div>
                                                <p>{response.content}</p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="message">Post a Message</Label>
                                <div className="flex gap-2">
                                  <Textarea 
                                    id="message" 
                                    placeholder="Type your message here..."
                                    className="min-h-[80px]"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">
                              <Users className="mr-2 h-4 w-4" />
                              View Members
                            </Button>
                            
                            <Button onClick={() => handlePostMessage(selectedGroup.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              Post Message
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {getFilteredPeerGroups().map(group => (
                            <Card 
                              key={group.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedGroup(group)}
                            >
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <CardTitle>{group.name}</CardTitle>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    {group.members} members
                                  </Badge>
                                </div>
                                <CardDescription>
                                  Facilitated by {group.facilitator}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">{group.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {group.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                  <MessageCircle className="inline-block mr-1 h-4 w-4" />
                                  {group.recentActivity}
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinGroup(group.id);
                                  }}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Join Group
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                          
                          {getFilteredPeerGroups().length === 0 && (
                            <div className="col-span-full text-centre py-12">
                              <p className="text-muted-foreground">
                                No peer support groups found matching your search. Try adjusting your search criteria.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
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

export default SafeDigitalExpressionSpaces;
