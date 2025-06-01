'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, Save, RefreshCw, BookOpen, Video, Headphones, 
  PenTool, Users, UserPlus, Clock, Sun, Moon, Volume2, VolumeX,
  Layout, LayoutGrid, LayoutList, Eye, EyeOff, Bell, BellOff,
  Check, X, HelpCircle, Info, AlertCircle, ArrowRight
} from "lucide-react";

export default function PreferenceTrackingSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Sample preference data
  const [preferences, setPreferences] = useState({
    content: {
      format: {
        text: 60,
        video: 85,
        audio: 40,
        interactive: 90
      },
      complexity: 65,
      topics: ["science", "history", "art"]
    },
    learning: {
      instructionalMethods: {
        direct: 50,
        inquiry: 80,
        collaborative: 70,
        independent: 60
      },
      pacing: 75,
      assessmentTypes: ["project", "discussion", "quiz"]
    },
    environment: {
      theme: "light",
      soundEnabled: true,
      notificationLevel: "medium",
      layoutDensity: "comfortable"
    },
    social: {
      groupPreference: 65,
      communicationStyle: "visual",
      collaborationRole: "contributor"
    }
  });
  
  // Sample recommended content based on preferences
  const recommendedContent = [
    {
      id: "1",
      title: "Interactive Solar System Explorer",
      type: "interactive",
      match: 95,
      subject: "science"
    },
    {
      id: "2",
      title: "Video Series: Ancient Civilizations",
      type: "video",
      match: 88,
      subject: "history"
    },
    {
      id: "3",
      title: "Collaborative Art Project: Renaissance Styles",
      type: "project",
      match: 82,
      subject: "art"
    }
  ];
  
  // Sample preference history
  const preferenceHistory = [
    {
      date: "May 10, 2025",
      changes: [
        { category: "Content", preference: "Video format", from: 75, to: 85 }
      ]
    },
    {
      date: "April 28, 2025",
      changes: [
        { category: "Learning", preference: "Inquiry-based methods", from: 65, to: 80 },
        { category: "Social", preference: "Group work", from: 50, to: 65 }
      ]
    },
    {
      date: "April 15, 2025",
      changes: [
        { category: "Environment", preference: "Layout density", from: "compact", to: "comfortable" }
      ]
    }
  ];
  
  // Format preference value as percentage
  const formatPreferenceValue = (value) => {
    return `${value}%`;
  };
  
  // Get preference strength class
  const getPreferenceStrengthClass = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-blue-600";
    if (value >= 40) return "text-amber-600";
    return "text-red-600";
  };
  
  // Get match badge colour
  const getMatchBadgeColor = (match) => {
    if (match >= 90) return "bg-green-100 text-green-800";
    if (match >= 75) return "bg-blue-100 text-blue-800";
    if (match >= 60) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <Settings className="mr-2 h-5 w-5" />
            Student Preference Tracking System
          </CardTitle>
          <CardDescription>
            Track, manage, and apply your learning preferences across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="dashboard">Preference Dashboard</TabsTrigger>
              <TabsTrigger value="survey">Preference Survey</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="history">Preference History</TabsTrigger>
            </TabsList>
            
            {/* Preference Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Preferences */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Content Preferences
                    </CardTitle>
                    <CardDescription>
                      How you prefer to consume learning materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Text</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.content.format.text)}`}>
                          {formatPreferenceValue(preferences.content.format.text)}
                        </span>
                      </div>
                      <Progress value={preferences.content.format.text} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Video</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.content.format.video)}`}>
                          {formatPreferenceValue(preferences.content.format.video)}
                        </span>
                      </div>
                      <Progress value={preferences.content.format.video} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Audio</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.content.format.audio)}`}>
                          {formatPreferenceValue(preferences.content.format.audio)}
                        </span>
                      </div>
                      <Progress value={preferences.content.format.audio} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Interactive</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.content.format.interactive)}`}>
                          {formatPreferenceValue(preferences.content.format.interactive)}
                        </span>
                      </div>
                      <Progress value={preferences.content.format.interactive} className="h-2" />
                    </div>
                    
                    <div className="pt-2">
                      <Label className="text-sm mb-1 block">Preferred Topics</Label>
                      <div className="flex flex-wrap gap-2">
                        {preferences.content.topics.map((topic) => (
                          <Badge key={topic} variant="outline">
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Content Preferences
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Learning Approach Preferences */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <PenTool className="mr-2 h-4 w-4" />
                      Learning Approach Preferences
                    </CardTitle>
                    <CardDescription>
                      How you prefer to engage with learning activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Direct Instruction</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.learning.instructionalMethods.direct)}`}>
                          {formatPreferenceValue(preferences.learning.instructionalMethods.direct)}
                        </span>
                      </div>
                      <Progress value={preferences.learning.instructionalMethods.direct} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Inquiry-Based Learning</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.learning.instructionalMethods.inquiry)}`}>
                          {formatPreferenceValue(preferences.learning.instructionalMethods.inquiry)}
                        </span>
                      </div>
                      <Progress value={preferences.learning.instructionalMethods.inquiry} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Collaborative Learning</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.learning.instructionalMethods.collaborative)}`}>
                          {formatPreferenceValue(preferences.learning.instructionalMethods.collaborative)}
                        </span>
                      </div>
                      <Progress value={preferences.learning.instructionalMethods.collaborative} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Independent Study</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.learning.instructionalMethods.independent)}`}>
                          {formatPreferenceValue(preferences.learning.instructionalMethods.independent)}
                        </span>
                      </div>
                      <Progress value={preferences.learning.instructionalMethods.independent} className="h-2" />
                    </div>
                    
                    <div className="pt-2">
                      <Label className="text-sm mb-1 block">Preferred Assessment Types</Label>
                      <div className="flex flex-wrap gap-2">
                        {preferences.learning.assessmentTypes.map((type) => (
                          <Badge key={type} variant="outline">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Learning Preferences
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Environmental Preferences */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <Layout className="mr-2 h-4 w-4" />
                      Environmental Preferences
                    </CardTitle>
                    <CardDescription>
                      How you prefer your digital learning environment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Sun className="h-4 w-4" />
                        <Label>Theme</Label>
                      </div>
                      <Select defaultValue={preferences.environment.theme}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Volume2 className="h-4 w-4" />
                        <Label>Sound Enabled</Label>
                      </div>
                      <Switch checked={preferences.environment.soundEnabled} />
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Bell className="h-4 w-4" />
                        <Label>Notification Level</Label>
                      </div>
                      <Select defaultValue={preferences.environment.notificationLevel}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <LayoutGrid className="h-4 w-4" />
                        <Label>Layout Density</Label>
                      </div>
                      <Select defaultValue={preferences.environment.layoutDensity}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Environmental Preferences
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Social Preferences */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-centre">
                      <Users className="mr-2 h-4 w-4" />
                      Social Preferences
                    </CardTitle>
                    <CardDescription>
                      How you prefer to interact with others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Group vs. Individual Work</Label>
                        <span className={`text-sm font-medium ${getPreferenceStrengthClass(preferences.social.groupPreference)}`}>
                          {formatPreferenceValue(preferences.social.groupPreference)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={preferences.social.groupPreference} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Individual</span>
                          <span>Group</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Communication Style</Label>
                      <Select defaultValue={preferences.social.communicationStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual">Visual (diagrams, charts)</SelectItem>
                          <SelectItem value="verbal">Verbal (discussions, explanations)</SelectItem>
                          <SelectItem value="written">Written (text, notes)</SelectItem>
                          <SelectItem value="mixed">Mixed (combination)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Collaboration Role</Label>
                      <Select defaultValue={preferences.social.collaborationRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leader">Leader</SelectItem>
                          <SelectItem value="contributor">Contributor</SelectItem>
                          <SelectItem value="organizer">Organizer</SelectItem>
                          <SelectItem value="supporter">Supporter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Social Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" className="flex items-centre">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Preferences
                </Button>
                <Button className="flex items-centre">
                  <Save className="mr-2 h-4 w-4" />
                  Save All Preferences
                </Button>
              </div>
            </TabsContent>
            
            {/* Preference Survey Tab */}
            <TabsContent value="survey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Format Preferences</CardTitle>
                  <CardDescription>
                    Rate how much you prefer each type of learning content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="text-preference" className="flex items-centre">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Text-based content
                        </Label>
                        <span className="text-sm font-medium">
                          {preferences.content.format.text}%
                        </span>
                      </div>
                      <Slider 
                        id="text-preference"
                        defaultValue={[preferences.content.format.text]} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not preferred</span>
                        <span>Highly preferred</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="video-preference" className="flex items-centre">
                          <Video className="mr-2 h-4 w-4" />
                          Video content
                        </Label>
                        <span className="text-sm font-medium">
                          {preferences.content.format.video}%
                        </span>
                      </div>
                      <Slider 
                        id="video-preference"
                        defaultValue={[preferences.content.format.video]} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not preferred</span>
                        <span>Highly preferred</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="audio-preference" className="flex items-centre">
                          <Headphones className="mr-2 h-4 w-4" />
                          Audio content
                        </Label>
                        <span className="text-sm font-medium">
                          {preferences.content.format.audio}%
                        </span>
                      </div>
                      <Slider 
                        id="audio-preference"
                        defaultValue={[preferences.content.format.audio]} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not preferred</span>
                        <span>Highly preferred</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="interactive-preference" className="flex items-centre">
                          <PenTool className="mr-2 h-4 w-4" />
                          Interactive content
                        </Label>
                        <span className="text-sm font-medium">
                          {preferences.content.format.interactive}%
                        </span>
                      </div>
                      <Slider 
                        id="interactive-preference"
                        defaultValue={[preferences.content.format.interactive]} 
                        max={100} 
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not preferred</span>
                        <span>Highly preferred</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Environment Preferences</CardTitle>
                  <CardDescription>
                    Select your preferred settings for your learning environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Visual Theme</Label>
                      <RadioGroup defaultValue={preferences.environment.theme} className="flex space-x-4">
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="light" id="theme-light" />
                          <Label htmlFor="theme-light" className="flex items-centre">
                            <Sun className="mr-1 h-4 w-4" />
                            Light
                          </Label>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="dark" id="theme-dark" />
                          <Label htmlFor="theme-dark" className="flex items-centre">
                            <Moon className="mr-1 h-4 w-4" />
                            Dark
                          </Label>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="system" id="theme-system" />
                          <Label htmlFor="theme-system">System</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sound Settings</Label>
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="sound-enabled" 
                          checked={preferences.environment.soundEnabled}
                        />
                        <Label htmlFor="sound-enabled" className="flex items-centre">
                          <Volume2 className="mr-1 h-4 w-4" />
                          Enable sounds and audio feedback
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Notification Preferences</Label>
                      <Select defaultValue={preferences.environment.notificationLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High - All notifications</SelectItem>
                          <SelectItem value="medium">Medium - Important notifications only</SelectItem>
                          <SelectItem value="low">Low - Critical notifications only</SelectItem>
                          <SelectItem value="none">None - No notifications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Layout Density</Label>
                      <RadioGroup defaultValue={preferences.environment.layoutDensity} className="flex space-x-4">
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="compact" id="layout-compact" />
                          <Label htmlFor="layout-compact" className="flex items-centre">
                            <LayoutList className="mr-1 h-4 w-4" />
                            Compact
                          </Label>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="comfortable" id="layout-comfortable" />
                          <Label htmlFor="layout-comfortable" className="flex items-centre">
                            <LayoutGrid className="mr-1 h-4 w-4" />
                            Comfortable
                          </Label>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <RadioGroupItem value="spacious" id="layout-spacious" />
                          <Label htmlFor="layout-spacious" className="flex items-centre">
                            <Layout className="mr-1 h-4 w-4" />
                            Spacious
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button>Save Survey Responses</Button>
              </div>
            </TabsContent>
            
            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-centre">
                  <h3 className="text-lg font-medium">Recommended Content</h3>
                  <Badge variant="outline" className="flex items-centre">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Updated today
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {recommendedContent.map((content) => (
                    <Card key={content.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{content.title}</CardTitle>
                          <Badge className={getMatchBadgeColor(content.match)}>
                            {content.match}% Match
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-centre text-sm text-muted-foreground mb-2">
                          {content.type === 'interactive' && <PenTool className="mr-1 h-4 w-4" />}
                          {content.type === 'video' && <Video className="mr-1 h-4 w-4" />}
                          {content.type === 'project' && <Users className="mr-1 h-4 w-4" />}
                          <span className="capitalize">{content.type}</span>
                          <Separator orientation="vertical" className="mx-2 h-4" />
                          <span className="capitalize">{content.subject}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Why this is recommended:</span>
                            <ul className="list-disc list-inside mt-1 text-muted-foreground">
                              {content.type === 'interactive' && (
                                <>
                                  <li>Matches your high preference for interactive content (90%)</li>
                                  <li>Aligns with your interest in science</li>
                                  <li>Supports your preferred inquiry-based learning approach</li>
                                </>
                              )}
                              {content.type === 'video' && (
                                <>
                                  <li>Matches your high preference for video content (85%)</li>
                                  <li>Aligns with your interest in history</li>
                                  <li>Supports your preferred visual communication style</li>
                                </>
                              )}
                              {content.type === 'project' && (
                                <>
                                  <li>Aligns with your interest in art</li>
                                  <li>Supports your preference for collaborative learning (70%)</li>
                                  <li>Matches your preferred project-based assessment type</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline" size="sm" className="mr-2">
                          Save for Later
                        </Button>
                        <Button size="sm">
                          View Content
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-centre pt-4">
                <Button variant="outline" className="flex items-centre">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Recommendations
                </Button>
                <div className="flex items-centre text-sm text-muted-foreground">
                  <Info className="mr-1 h-4 w-4" />
                  Recommendations are based on your current preferences
                </div>
              </div>
            </TabsContent>
            
            {/* Preference History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-centre">
                  <h3 className="text-lg font-medium">Preference History</h3>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="content">Content Preferences</SelectItem>
                      <SelectItem value="learning">Learning Preferences</SelectItem>
                      <SelectItem value="environment">Environmental Preferences</SelectItem>
                      <SelectItem value="social">Social Preferences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {preferenceHistory.map((entry, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-centre">
                          <CardTitle className="text-base flex items-centre">
                            <Clock className="mr-2 h-4 w-4" />
                            {entry.date}
                          </CardTitle>
                          <Badge variant="outline">
                            {entry.changes.length} {entry.changes.length === 1 ? 'Change' : 'Changes'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {entry.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="flex items-start">
                              <div className="mr-2 mt-0.5 text-blue-500">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{change.preference}</div>
                                <div className="text-sm text-muted-foreground flex items-centre">
                                  Changed from 
                                  <Badge variant="outline" className="mx-1 px-1 py-0 h-5">
                                    {typeof change.from === 'number' ? `${change.from}%` : change.from}
                                  </Badge>
                                  to
                                  <Badge variant="outline" className="mx-1 px-1 py-0 h-5">
                                    {typeof change.to === 'number' ? `${change.to}%` : change.to}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Category: {change.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-centre">
                <Button variant="outline">
                  Load More History
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
