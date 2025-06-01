'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Users, UserPlus, Settings, BookOpen, MessageSquare, Award, Target, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SocialSkillsDevelopmentEngine = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("skills");
  const [isLoading, setIsLoading] = useState(true);
  
  // State for social skills data
  const [socialSkills, setSocialSkills] = useState([]);
  const [socialScenarios, setSocialScenarios] = useState([]);
  const [socialGoals, setSocialGoals] = useState([]);
  const [socialActivities, setSocialActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [settings, setSettings] = useState({
    enablePeerModeling: true,
    enableSocialStories: true,
    enableRolePlay: true,
    enableVideoModeling: true,
    enableSocialScripts: true,
    enableGroupActivities: true,
    enableParentAccess: true,
    enableStudentAccess: true,
    notifyParentsOnProgress: true,
    defaultAssessmentFrequency: "monthly",
    defaultSkillCategory: "communication",
    customizableGoals: true,
  });
  
  // Form states
  const [newSkill, setNewSkill] = useState({
    name: "",
    description: "",
    category: "communication",
    ageRange: "5-7",
    difficultyLevel: "beginner",
    teachingMethod: "direct",
    evidenceBase: "",
    notes: "",
  });
  
  const [newScenario, setNewScenario] = useState({
    title: "",
    description: "",
    context: "classroom",
    skillsAddressed: [],
    difficultyLevel: "beginner",
    supportLevel: "high",
    visualSupport: true,
  });
  
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    targetSkill: "",
    targetValue: 3,
    timeframe: "weekly",
    studentId: "",
    measurementMethod: "frequency",
  });
  
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    type: "group",
    skillsAddressed: [],
    duration: 15,
    materials: "",
    instructions: "",
  });
  
  const [assessmentForm, setAssessmentForm] = useState({
    studentId: "",
    skillId: "",
    date: new Date(),
    rating: 3,
    context: "",
    notes: "",
  });
  
  // Fetch data on component mount
  useEffect(() => {
    if (session) {
      fetchSettings();
      fetchSocialSkills();
      fetchSocialScenarios();
      fetchSocialGoals();
      fetchSocialActivities();
      fetchStudents();
      fetchAssessmentResults();
    }
  }, [session]);
  
  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };
  
  // Fetch social skills
  const fetchSocialSkills = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/skills');
      if (response.ok) {
        const data = await response.json();
        setSocialSkills(data);
      }
    } catch (error) {
      console.error('Error fetching social skills:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch social scenarios
  const fetchSocialScenarios = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/scenarios');
      if (response.ok) {
        const data = await response.json();
        setSocialScenarios(data);
      }
    } catch (error) {
      console.error('Error fetching social scenarios:', error);
    }
  };
  
  // Fetch social goals
  const fetchSocialGoals = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/goals');
      if (response.ok) {
        const data = await response.json();
        setSocialGoals(data);
      }
    } catch (error) {
      console.error('Error fetching social goals:', error);
    }
  };
  
  // Fetch social activities
  const fetchSocialActivities = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/activities');
      if (response.ok) {
        const data = await response.json();
        setSocialActivities(data);
      }
    } catch (error) {
      console.error('Error fetching social activities:', error);
    }
  };
  
  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/special-needs/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  // Fetch assessment results
  const fetchAssessmentResults = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/assessments');
      if (response.ok) {
        const data = await response.json();
        setAssessmentResults(data);
      }
    } catch (error) {
      console.error('Error fetching assessment results:', error);
    }
  };
  
  // Handle skill form submission
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/social-skills/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSkill),
      });
      
      if (response.ok) {
        toast({
          title: "Social skill created",
          description: `${newSkill.name} has been added to your social skills.`,
        });
        setNewSkill({
          name: "",
          description: "",
          category: "communication",
          ageRange: "5-7",
          difficultyLevel: "beginner",
          teachingMethod: "direct",
          evidenceBase: "",
          notes: "",
        });
        fetchSocialSkills();
      } else {
        toast({
          title: "Error",
          description: "Failed to create social skill. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating social skill:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle scenario form submission
  const handleScenarioSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/social-skills/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScenario),
      });
      
      if (response.ok) {
        toast({
          title: "Social scenario created",
          description: `${newScenario.title} has been added to your social scenarios.`,
        });
        setNewScenario({
          title: "",
          description: "",
          context: "classroom",
          skillsAddressed: [],
          difficultyLevel: "beginner",
          supportLevel: "high",
          visualSupport: true,
        });
        fetchSocialScenarios();
      } else {
        toast({
          title: "Error",
          description: "Failed to create social scenario. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating social scenario:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle goal form submission
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/social-skills/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      
      if (response.ok) {
        toast({
          title: "Social goal created",
          description: `${newGoal.name} has been added to your social goals.`,
        });
        setNewGoal({
          name: "",
          description: "",
          targetSkill: "",
          targetValue: 3,
          timeframe: "weekly",
          studentId: "",
          measurementMethod: "frequency",
        });
        fetchSocialGoals();
      } else {
        toast({
          title: "Error",
          description: "Failed to create social goal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating social goal:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle activity form submission
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/social-skills/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActivity),
      });
      
      if (response.ok) {
        toast({
          title: "Social activity created",
          description: `${newActivity.name} has been added to your social activities.`,
        });
        setNewActivity({
          name: "",
          description: "",
          type: "group",
          skillsAddressed: [],
          duration: 15,
          materials: "",
          instructions: "",
        });
        fetchSocialActivities();
      } else {
        toast({
          title: "Error",
          description: "Failed to create social activity. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating social activity:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle assessment form submission
  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/special-needs/social-skills/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assessmentForm,
          date: assessmentForm.date.toISOString(),
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Assessment recorded",
          description: "Social skill assessment has been successfully recorded.",
        });
        setAssessmentForm({
          studentId: "",
          skillId: "",
          date: new Date(),
          rating: 3,
          context: "",
          notes: "",
        });
        fetchAssessmentResults();
        fetchSocialGoals(); // Refresh goals in case any were completed
      } else {
        toast({
          title: "Error",
          description: "Failed to record assessment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error recording assessment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle settings update
  const handleSettingsUpdate = async () => {
    try {
      const response = await fetch('/api/special-needs/social-skills/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        toast({
          title: "Settings updated",
          description: "Your social skills development settings have been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update settings. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Prepare chart data for progress visualisation
  const prepareProgressChartData = () => {
    if (assessmentResults.length === 0) return [];
    
    // Group by date and skill
    const groupedData = assessmentResults.reduce((acc, item) => {
      const date = format(new Date(item.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {};
      }
      
      const skillName = socialSkills.find(s => s.id === item.skillId)?.name || 'Unknown';
      if (!acc[date][skillName]) {
        acc[date][skillName] = 0;
      }
      
      acc[date][skillName] = item.rating;
      return acc;
    }, {});
    
    // Convert to chart format
    return Object.keys(groupedData).map(date => {
      return {
        date,
        ...groupedData[date],
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Get skill category badge colour
  const getSkillCategoryColor = (category) => {
    switch (category) {
      case 'communication':
        return 'bg-blue-100 text-blue-800';
      case 'emotional':
        return 'bg-pink-100 text-pink-800';
      case 'interpersonal':
        return 'bg-purple-100 text-purple-800';
      case 'problem-solving':
        return 'bg-amber-100 text-amber-800';
      case 'self-awareness':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Get difficulty level badge colour
  const getDifficultyLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Get activity type badge colour
  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'group':
        return 'bg-blue-100 text-blue-800';
      case 'pair':
        return 'bg-purple-100 text-purple-800';
      case 'individual':
        return 'bg-green-100 text-green-800';
      case 'role-play':
        return 'bg-amber-100 text-amber-800';
      case 'game':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  // Calculate goal progress
  const calculateGoalProgress = (goal) => {
    if (!goal || !assessmentResults.length) return 0;
    
    // Filter assessment results for this goal's skill and timeframe
    const timeframeStart = new Date();
    switch (goal.timeframe) {
      case 'daily':
        timeframeStart.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        timeframeStart.setDate(timeframeStart.getDate() - timeframeStart.getDay());
        timeframeStart.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        timeframeStart.setDate(1);
        timeframeStart.setHours(0, 0, 0, 0);
        break;
      case 'term':
        // Assuming a term is roughly 3 months
        timeframeStart.setMonth(timeframeStart.getMonth() - 3);
        timeframeStart.setHours(0, 0, 0, 0);
        break;
    }
    
    const relevantResults = assessmentResults.filter(item => 
      item.skillId === goal.targetSkill &&
      (!goal.studentId || item.studentId === goal.studentId) &&
      new Date(item.date) >= timeframeStart
    );
    
    if (relevantResults.length === 0) return 0;
    
    if (goal.measurementMethod === 'rating') {
      // For rating-based goals, use the most recent rating
      const latestResult = relevantResults.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return Math.min(100, Math.round((latestResult.rating / goal.targetValue) * 100));
    } else {
      // For frequency-based goals, count the number of assessments
      return Math.min(100, Math.round((relevantResults.length / goal.targetValue) * 100));
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-centre justify-centre h-64">
        <div className="text-centre">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading social skills development system...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Social Skills Development</h1>
      
      <Tabs defaultValue="skills" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="skills" className="flex items-centre gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-centre gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-centre gap-2">
            <Activity className="h-4 w-4" />
            <span>Activities</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-centre gap-2">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-centre gap-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-centre gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Social Skill</CardTitle>
                <CardDescription>
                  Define social skills you want to teach and develop.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSkillSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Skill Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Taking Turns in Conversation"
                      value={newSkill.name} 
                      onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the skill"
                      value={newSkill.description} 
                      onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newSkill.category} 
                      onValueChange={(value) => setNewSkill({...newSkill, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="emotional">Emotional Understanding</SelectItem>
                        <SelectItem value="interpersonal">Interpersonal Skills</SelectItem>
                        <SelectItem value="problem-solving">Social Problem Solving</SelectItem>
                        <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ageRange">Age Range</Label>
                    <Select 
                      value={newSkill.ageRange} 
                      onValueChange={(value) => setNewSkill({...newSkill, ageRange: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-4">3-4 years (Early Years)</SelectItem>
                        <SelectItem value="5-7">5-7 years (KS1)</SelectItem>
                        <SelectItem value="8-11">8-11 years (KS2)</SelectItem>
                        <SelectItem value="12-14">12-14 years (KS3)</SelectItem>
                        <SelectItem value="15-16">15-16 years (KS4)</SelectItem>
                        <SelectItem value="16+">16+ years (Post-16)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                    <Select 
                      value={newSkill.difficultyLevel} 
                      onValueChange={(value) => setNewSkill({...newSkill, difficultyLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teachingMethod">Recommended Teaching Method</Label>
                    <Select 
                      value={newSkill.teachingMethod} 
                      onValueChange={(value) => setNewSkill({...newSkill, teachingMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select teaching method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct Instruction</SelectItem>
                        <SelectItem value="modelling">Modelling</SelectItem>
                        <SelectItem value="role-play">Role Play</SelectItem>
                        <SelectItem value="social-stories">Social Stories</SelectItem>
                        <SelectItem value="video-modelling">Video Modelling</SelectItem>
                        <SelectItem value="peer-mediated">Peer-Mediated Instruction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="evidenceBase">Evidence Base</Label>
                    <Textarea 
                      id="evidenceBase" 
                      placeholder="Research or evidence supporting this skill development approach"
                      value={newSkill.evidenceBase} 
                      onChange={(e) => setNewSkill({...newSkill, evidenceBase: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional information about this skill"
                      value={newSkill.notes} 
                      onChange={(e) => setNewSkill({...newSkill, notes: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Create Social Skill</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Defined Social Skills</CardTitle>
                <CardDescription>
                  View and manage your defined social skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {socialSkills.length > 0 ? (
                    <div className="space-y-4">
                      {socialSkills.map((skill) => (
                        <div key={skill.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{skill.name}</h4>
                            <Badge className={getSkillCategoryColor(skill.category)}>
                              {skill.category}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{skill.description}</p>
                          <div className="flex items-centre mt-2 text-sm text-muted-foreground">
                            <span className="mr-4">Age: {skill.ageRange}</span>
                            <Badge variant="outline" className={getDifficultyLevelColor(skill.difficultyLevel)}>
                              {skill.difficultyLevel}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">Teaching method: {skill.teachingMethod}</p>
                          {skill.evidenceBase && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Evidence Base:</p>
                              <p className="text-xs mt-1">{skill.evidenceBase}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No social skills defined yet.</p>
                      <p className="text-sm mt-2">Create social skills to start teaching.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Assess Social Skills</CardTitle>
              <CardDescription>
                Record and track student progress in social skill development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssessmentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student</Label>
                    <Select 
                      value={assessmentForm.studentId} 
                      onValueChange={(value) => setAssessmentForm({...assessmentForm, studentId: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillId">Social Skill</Label>
                    <Select 
                      value={assessmentForm.skillId} 
                      onValueChange={(value) => setAssessmentForm({...assessmentForm, skillId: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select social skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialSkills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Assessment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {assessmentForm.date ? format(assessmentForm.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={assessmentForm.date}
                          onSelect={(date) => setAssessmentForm({...assessmentForm, date: date || new Date()})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Input 
                      type="text" 
                      id="context" 
                      placeholder="e.g., During group activity"
                      value={assessmentForm.context} 
                      onChange={(e) => setAssessmentForm({...assessmentForm, context: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Skill Rating (1-5)</Label>
                  <div className="flex items-centre justify-between">
                    <span className="text-sm text-muted-foreground">Emerging (1)</span>
                    <span className="text-sm text-muted-foreground">Mastered (5)</span>
                  </div>
                  <RadioGroup 
                    value={assessmentForm.rating.toString()} 
                    onValueChange={(value) => setAssessmentForm({...assessmentForm, rating: parseInt(value)})}
                    className="flex justify-between"
                  >
                    <div className="flex items-centre space-x-2">
                      <RadioGroupItem value="1" id="r1" />
                      <Label htmlFor="r1">1</Label>
                    </div>
                    <div className="flex items-centre space-x-2">
                      <RadioGroupItem value="2" id="r2" />
                      <Label htmlFor="r2">2</Label>
                    </div>
                    <div className="flex items-centre space-x-2">
                      <RadioGroupItem value="3" id="r3" />
                      <Label htmlFor="r3">3</Label>
                    </div>
                    <div className="flex items-centre space-x-2">
                      <RadioGroupItem value="4" id="r4" />
                      <Label htmlFor="r4">4</Label>
                    </div>
                    <div className="flex items-centre space-x-2">
                      <RadioGroupItem value="5" id="r5" />
                      <Label htmlFor="r5">5</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Assessment Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Observations, strengths, areas for improvement"
                    value={assessmentForm.notes} 
                    onChange={(e) => setAssessmentForm({...assessmentForm, notes: e.target.value})}
                  />
                </div>
                
                <Button type="submit" className="w-full">Record Assessment</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Social Scenario</CardTitle>
                <CardDescription>
                  Define scenarios for practicing social skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScenarioSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Scenario Title</Label>
                    <Input 
                      type="text" 
                      id="title" 
                      placeholder="e.g., Joining a Group at Playtime"
                      value={newScenario.title} 
                      onChange={(e) => setNewScenario({...newScenario, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the scenario"
                      value={newScenario.description} 
                      onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Select 
                      value={newScenario.context} 
                      onValueChange={(value) => setNewScenario({...newScenario, context: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select context" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="playground">Playground</SelectItem>
                        <SelectItem value="lunchroom">Lunchroom</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillsAddressed">Skills Addressed</Label>
                    <Select 
                      value={newScenario.skillsAddressed[0] || ""} 
                      onValueChange={(value) => setNewScenario({
                        ...newScenario, 
                        skillsAddressed: value ? [value, ...newScenario.skillsAddressed.slice(1)] : newScenario.skillsAddressed.slice(1)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary skill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {socialSkills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Select 
                        value={newScenario.skillsAddressed[1] || ""} 
                        onValueChange={(value) => setNewScenario({
                          ...newScenario, 
                          skillsAddressed: [
                            newScenario.skillsAddressed[0] || "", 
                            value, 
                            ...newScenario.skillsAddressed.slice(2)
                          ]
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary skill (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {socialSkills.map((skill) => (
                            <SelectItem key={skill.id} value={skill.id}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                    <Select 
                      value={newScenario.difficultyLevel} 
                      onValueChange={(value) => setNewScenario({...newScenario, difficultyLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportLevel">Support Level</Label>
                    <Select 
                      value={newScenario.supportLevel} 
                      onValueChange={(value) => setNewScenario({...newScenario, supportLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select support level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Support</SelectItem>
                        <SelectItem value="medium">Medium Support</SelectItem>
                        <SelectItem value="low">Low Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="visualSupport" 
                      checked={newScenario.visualSupport}
                      onCheckedChange={(checked) => setNewScenario({...newScenario, visualSupport: checked})}
                    />
                    <Label htmlFor="visualSupport">Include visual supports</Label>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Social Scenario</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Scenarios</CardTitle>
                <CardDescription>
                  View and manage your social scenarios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {socialScenarios.length > 0 ? (
                    <div className="space-y-4">
                      {socialScenarios.map((scenario) => (
                        <div key={scenario.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{scenario.title}</h4>
                            <Badge variant="outline">
                              {scenario.context}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{scenario.description}</p>
                          <div className="flex items-centre mt-2 text-sm text-muted-foreground">
                            <Badge className={getDifficultyLevelColor(scenario.difficultyLevel)} variant="secondary">
                              {scenario.difficultyLevel}
                            </Badge>
                            <span className="mx-2">•</span>
                            <span>Support: {scenario.supportLevel}</span>
                            {scenario.visualSupport && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Visual supports</span>
                              </>
                            )}
                          </div>
                          {scenario.skillsAddressed.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Skills addressed:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {scenario.skillsAddressed.map((skillId) => {
                                  const skill = socialSkills.find(s => s.id === skillId);
                                  return skill ? (
                                    <Badge key={skillId} variant="outline" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No social scenarios defined yet.</p>
                      <p className="text-sm mt-2">Create scenarios to practise social skills.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Stories and Scripts</CardTitle>
              <CardDescription>
                Evidence-based social stories and scripts for teaching social skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What are Social Stories?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Social Stories™ were developed by Carol Grey in 1991 and are short descriptions of a particular 
                      situation, event or activity, which include specific information about what to expect in that 
                      situation and why. They are particularly beneficial for children with autism spectrum conditions 
                      but can be helpful for any child who struggles with social understanding.
                    </p>
                    <p className="text-sm mt-2">
                      Research has shown that Social Stories™ can improve social understanding and behaviour when they:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Are written from the child's perspective</li>
                      <li>Use positive, supportive language</li>
                      <li>Include descriptive, perspective, directive, and affirmative sentences</li>
                      <li>Answer the "wh" questions (who, what, when, where, why)</li>
                      <li>Are tailored to the child's reading and comprehension level</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Creating Effective Social Scripts</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Social scripts provide children with specific language to use in different social situations. 
                      They are particularly helpful for children who struggle with spontaneous social communication.
                    </p>
                    <p className="text-sm mt-2">
                      Effective social scripts should:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Be concise and clear</li>
                      <li>Use age-appropriate language</li>
                      <li>Include both verbal and nonverbal components</li>
                      <li>Be practiced regularly in a safe environment</li>
                      <li>Gradually fade as the child internalizes the skill</li>
                    </ul>
                    <p className="text-sm mt-2">
                      Research from the National Autistic Society and the American Speech-Language-Hearing Association 
                      supports the use of scripts to develop conversational skills, particularly when combined with 
                      visual supports and regular practise opportunities.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Sample Social Story: Joining a Group</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Joining a Group at Playtime</h4>
                      <p className="text-sm">
                        Sometimes I want to play with other children during playtime. This is called joining in.
                      </p>
                      <p className="text-sm mt-2">
                        First, I can watch what the children are playing. This helps me understand their game.
                      </p>
                      <p className="text-sm mt-2">
                        Next, I can stand near the group and smile. This shows I am friendly.
                      </p>
                      <p className="text-sm mt-2">
                        When there is a pause in the game, I can say, "Can I play?" or "That looks fun. May I join in?"
                      </p>
                      <p className="text-sm mt-2">
                        If the children say "yes," I will say "thank you" and join the game. I will try to follow the rules they are using.
                      </p>
                      <p className="text-sm mt-2">
                        If the children say "no" or "not now," I can say "okay" and find something else to do. I can try again another time.
                      </p>
                      <p className="text-sm mt-2">
                        Joining in games with other children can be fun. Sometimes it takes practise to learn how to join in.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Sample Social Script: Starting a Conversation</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Starting a Conversation</h4>
                      <p className="text-sm font-medium">When I want to start a conversation, I can:</p>
                      <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                        <li>Look for someone who isn't busy</li>
                        <li>Stand or sit at a comfortable distance (about an arm's length away)</li>
                        <li>Look at their face (near their eyes or nose)</li>
                        <li>Say a greeting: "Hi" or "Hello"</li>
                        <li>Say their name if I know it: "Hi, Sam"</li>
                        <li>Ask a question or make a comment:
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>"How are you today?"</li>
                            <li>"I like your t-shirt."</li>
                            <li>"Did you watch the football match yesterday?"</li>
                            <li>"What did you do at the weekend?"</li>
                          </ul>
                        </li>
                        <li>Listen to their answer</li>
                        <li>Take turns talking</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Social Activity</CardTitle>
                <CardDescription>
                  Define activities for practicing social skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Activity Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Emotion Charades"
                      value={newActivity.name} 
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the activity"
                      value={newActivity.description} 
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Activity Type</Label>
                    <Select 
                      value={newActivity.type} 
                      onValueChange={(value) => setNewActivity({...newActivity, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group">Group Activity</SelectItem>
                        <SelectItem value="pair">Pair Activity</SelectItem>
                        <SelectItem value="individual">Individual Activity</SelectItem>
                        <SelectItem value="role-play">Role Play</SelectItem>
                        <SelectItem value="game">Game</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillsAddressed">Skills Addressed</Label>
                    <Select 
                      value={newActivity.skillsAddressed[0] || ""} 
                      onValueChange={(value) => setNewActivity({
                        ...newActivity, 
                        skillsAddressed: value ? [value, ...newActivity.skillsAddressed.slice(1)] : newActivity.skillsAddressed.slice(1)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary skill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {socialSkills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Select 
                        value={newActivity.skillsAddressed[1] || ""} 
                        onValueChange={(value) => setNewActivity({
                          ...newActivity, 
                          skillsAddressed: [
                            newActivity.skillsAddressed[0] || "", 
                            value, 
                            ...newActivity.skillsAddressed.slice(2)
                          ]
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary skill (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {socialSkills.map((skill) => (
                            <SelectItem key={skill.id} value={skill.id}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      type="number" 
                      id="duration" 
                      min="5"
                      value={newActivity.duration} 
                      onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials Needed</Label>
                    <Textarea 
                      id="materials" 
                      placeholder="List of materials needed for the activity"
                      value={newActivity.materials} 
                      onChange={(e) => setNewActivity({...newActivity, materials: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea 
                      id="instructions" 
                      placeholder="Step-by-step instructions for the activity"
                      value={newActivity.instructions} 
                      onChange={(e) => setNewActivity({...newActivity, instructions: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Create Social Activity</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Activities</CardTitle>
                <CardDescription>
                  View and manage your social activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {socialActivities.length > 0 ? (
                    <div className="space-y-4">
                      {socialActivities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{activity.name}</h4>
                            <Badge className={getActivityTypeColor(activity.type)}>
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{activity.description}</p>
                          <div className="flex items-centre mt-2 text-sm text-muted-foreground">
                            <span>{activity.duration} minutes</span>
                          </div>
                          {activity.skillsAddressed.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Skills addressed:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {activity.skillsAddressed.map((skillId) => {
                                  const skill = socialSkills.find(s => s.id === skillId);
                                  return skill ? (
                                    <Badge key={skillId} variant="outline" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          {activity.materials && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Materials:</p>
                              <p className="text-xs mt-1">{activity.materials}</p>
                            </div>
                          )}
                          {activity.instructions && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground">Instructions:</p>
                              <p className="text-xs mt-1">{activity.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No social activities defined yet.</p>
                      <p className="text-sm mt-2">Create activities to practise social skills.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Social Skill Activities</CardTitle>
              <CardDescription>
                Research-backed activities for developing social skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Video Modelling</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Video modelling involves showing students videos of individuals demonstrating appropriate social behaviors. 
                      Research from the National Professional Development Centre on Autism Spectrum Disorders identifies video 
                      modelling as an evidence-based practise for teaching social skills.
                    </p>
                    <p className="text-sm mt-2 font-medium">Implementation Tips:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Select videos that clearly demonstrate the target skill</li>
                      <li>Keep videos short (2-5 minutes) and focused on one skill</li>
                      <li>Include peers or age-appropriate models when possible</li>
                      <li>Provide opportunities to practise the skill after watching</li>
                      <li>Review and discuss the video, highlighting key behaviors</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Social Skills Groups</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Social skills groups provide structured opportunities for children to learn and practise social skills 
                      with peers. A meta-analysis published in the Journal of Child Psychology and Psychiatry found that social 
                      skills groups are effective for improving social competence in children with social difficulties.
                    </p>
                    <p className="text-sm mt-2 font-medium">Key Components of Effective Groups:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Small group size (4-6 children)</li>
                      <li>Inclusion of typically developing peers when appropriate</li>
                      <li>Structured activities with clear objectives</li>
                      <li>Direct instruction followed by practise opportunities</li>
                      <li>Positive reinforcement for appropriate social behaviors</li>
                      <li>Regular sessions (weekly) over an extended period (10+ weeks)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Role Play Activities</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Role play provides opportunities for children to practise social skills in a structured, supportive 
                      environment. Research from the American Psychological Association supports role play as an effective 
                      strategy for developing social competence.
                    </p>
                    <p className="text-sm mt-2 font-medium">Sample Role Play Activity: "Different Perspectives"</p>
                    <div className="bg-muted p-3 rounded-md mt-1">
                      <p className="text-sm"><span className="font-medium">Objective:</span> To help children understand different perspectives in social situations</p>
                      <p className="text-sm mt-1"><span className="font-medium">Materials:</span> Scenario cards, role labels</p>
                      <p className="text-sm mt-1"><span className="font-medium">Procedure:</span></p>
                      <ol className="list-decimal list-inside text-sm mt-1 space-y-1">
                        <li>Divide children into small groups of 3-4</li>
                        <li>Present a scenario (e.g., "Someone accidentally breaks another person's toy")</li>
                        <li>Assign different roles to each child (e.g., toy owner, person who broke it, bystander)</li>
                        <li>Have children act out the scenario from their assigned perspective</li>
                        <li>After the role play, discuss how each person felt and what they were thinking</li>
                        <li>Switch roles and repeat with the same or a new scenario</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Peer-Mediated Interventions</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Peer-mediated interventions involve teaching typically developing peers strategies to support and 
                      engage with children who have social difficulties. Research from the What Works Clearinghouse 
                      identifies peer-mediated interventions as having strong evidence for improving social outcomes.
                    </p>
                    <p className="text-sm mt-2 font-medium">Implementation Guidelines:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Select socially competent, empathetic peers as "peer buddies"</li>
                      <li>Provide training to peer buddies on specific strategies (e.g., initiating interactions, providing prompts)</li>
                      <li>Create structured activities that encourage interaction</li>
                      <li>Provide adult supervision and support</li>
                      <li>Recognise and reinforce peer buddies' efforts</li>
                      <li>Gradually fade adult support as interactions become more natural</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Social Goal</CardTitle>
                <CardDescription>
                  Set goals for social skill development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Improve Conversation Turn-Taking"
                      value={newGoal.name} 
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the goal"
                      value={newGoal.description} 
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetSkill">Target Skill</Label>
                    <Select 
                      value={newGoal.targetSkill} 
                      onValueChange={(value) => setNewGoal({...newGoal, targetSkill: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialSkills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="measurementMethod">Measurement Method</Label>
                    <Select 
                      value={newGoal.measurementMethod} 
                      onValueChange={(value) => setNewGoal({...newGoal, measurementMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select measurement method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frequency">Frequency (number of assessments)</SelectItem>
                        <SelectItem value="rating">Rating (skill level 1-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetValue">
                      {newGoal.measurementMethod === 'rating' ? 'Target Rating (1-5)' : 'Target Frequency'}
                    </Label>
                    <Input 
                      type="number" 
                      id="targetValue" 
                      min="1"
                      max={newGoal.measurementMethod === 'rating' ? "5" : undefined}
                      value={newGoal.targetValue} 
                      onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value)})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {newGoal.measurementMethod === 'rating' 
                        ? 'Target skill rating to achieve (1-5 scale)' 
                        : 'Number of successful demonstrations needed'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select 
                      value={newGoal.timeframe} 
                      onValueChange={(value) => setNewGoal({...newGoal, timeframe: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="term">Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student (Optional)</Label>
                    <Select 
                      value={newGoal.studentId} 
                      onValueChange={(value) => setNewGoal({...newGoal, studentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific student</SelectItem>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Social Goal</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>
                  View and manage your social skill goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {socialGoals.length > 0 ? (
                    <div className="space-y-4">
                      {socialGoals.map((goal) => {
                        const progress = calculateGoalProgress(goal);
                        const targetSkill = socialSkills.find(s => s.id === goal.targetSkill);
                        const student = students.find(s => s.id === goal.studentId);
                        
                        return (
                          <div key={goal.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{goal.name}</h4>
                              <Badge variant="outline">
                                {goal.status || 'active'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm mt-2">{goal.description}</p>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm">
                                <span>Progress: {progress}%</span>
                                <span>
                                  {goal.measurementMethod === 'rating' 
                                    ? `Target rating: ${goal.targetValue}/5` 
                                    : `Target: ${goal.targetValue} demonstrations`}
                                </span>
                              </div>
                              <Progress value={progress} className="mt-1" />
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Skill:</p>
                                <p>{targetSkill?.name || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Timeframe:</p>
                                <p className="capitalize">{goal.timeframe}</p>
                              </div>
                              {student && (
                                <div>
                                  <p className="text-muted-foreground">Student:</p>
                                  <p>{student.name}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground">Measurement:</p>
                                <p className="capitalize">{goal.measurementMethod}</p>
                              </div>
                            </div>
                            
                            {goal.status === 'completed' && goal.completedAt && (
                              <p className="text-sm mt-3 text-green-600">
                                Completed on {format(new Date(goal.completedAt), 'PPP')}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-centre py-8">
                      <p className="text-muted-foreground">No social goals defined yet.</p>
                      <p className="text-sm mt-2">Create goals to track social skill development.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Skills Progress</CardTitle>
              <CardDescription>
                Visualise progress in social skill development over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessmentResults.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareProgressChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      {socialSkills.slice(0, 6).map((skill, index) => (
                        <Line 
                          key={skill.id} 
                          type="monotone"
                          dataKey={skill.name} 
                          stroke={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} 
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-centre py-8">
                  <p className="text-muted-foreground">No assessment data available for visualisation.</p>
                  <p className="text-sm mt-2">Record skill assessments to see progress over time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Social Skills Progress</CardTitle>
              <CardDescription>
                View individual student progress in social skill development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-6">
                  {students.map((student) => {
                    // Get student's assessment results
                    const studentResults = assessmentResults.filter(item => item.studentId === student.id);
                    // Get student's active goals
                    const studentGoals = socialGoals.filter(goal => goal.studentId === student.id && goal.status === 'active');
                    
                    return (
                      <div key={student.id} className="border rounded-lg p-6">
                        <div className="flex items-centre gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {student.year ? `Year ${student.year}` : 'No year specified'}
                            </p>
                          </div>
                        </div>
                        
                        {studentGoals.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Active Social Goals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {studentGoals.map(goal => {
                                const progress = calculateGoalProgress(goal);
                                const targetSkill = socialSkills.find(s => s.id === goal.targetSkill);
                                
                                return (
                                  <div key={goal.id} className="border rounded p-3">
                                    <div className="flex justify-between items-start">
                                      <h5 className="text-sm font-medium">{goal.name}</h5>
                                      <span className="text-xs text-muted-foreground">{goal.timeframe}</span>
                                    </div>
                                    <p className="text-xs mt-1">{targetSkill?.name}</p>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs">
                                        <span>{progress}%</span>
                                        <span>
                                          {goal.measurementMethod === 'rating' 
                                            ? `Target: ${goal.targetValue}/5` 
                                            : `Target: ${goal.targetValue}`}
                                        </span>
                                      </div>
                                      <Progress value={progress} className="mt-1 h-2" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {studentResults.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Recent Skill Assessments</h4>
                            <div className="space-y-2">
                              {studentResults.slice(0, 3).map(result => {
                                const skill = socialSkills.find(s => s.id === result.skillId);
                                return (
                                  <div key={result.id} className="flex justify-between items-centre border-b pb-2">
                                    <div>
                                      <p className="text-sm">{skill?.name || 'Unknown skill'}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {format(new Date(result.date), 'PPP')}
                                      </p>
                                    </div>
                                    <Badge variant="outline">Rating: {result.rating}/5</Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-4">No social skill assessments recorded yet.</p>
                        )}
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Recommended Activities</h4>
                          {studentResults.length > 0 ? (
                            <div className="space-y-2">
                              {/* Find skills that need improvement (rating < 4) */}
                              {studentResults
                                .filter(result => result.rating < 4)
                                .slice(0, 2)
                                .map(result => {
                                  const skill = socialSkills.find(s => s.id === result.skillId);
                                  // Find activities that address this skill
                                  const relevantActivities = socialActivities.filter(
                                    activity => activity.skillsAddressed.includes(result.skillId)
                                  );
                                  
                                  return relevantActivities.length > 0 ? (
                                    <div key={result.id} className="border rounded p-3">
                                      <p className="text-sm font-medium">For {skill?.name || 'Unknown skill'} (Current rating: {result.rating}/5)</p>
                                      <ul className="list-disc list-inside text-sm mt-1">
                                        {relevantActivities.slice(0, 2).map(activity => (
                                          <li key={activity.id}>{activity.name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null;
                                })}
                              
                              {/* If no specific recommendations based on low ratings */}
                              {studentResults.filter(result => result.rating < 4).length === 0 && (
                                <div className="border rounded p-3">
                                  <p className="text-sm">General social skill activities:</p>
                                  <ul className="list-disc list-inside text-sm mt-1">
                                    {socialActivities.slice(0, 3).map(activity => (
                                      <li key={activity.id}>{activity.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="border rounded p-3">
                              <p className="text-sm">Suggested starter activities:</p>
                              <ul className="list-disc list-inside text-sm mt-1">
                                {socialActivities.slice(0, 3).map(activity => (
                                  <li key={activity.id}>{activity.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-centre py-8">
                  <p className="text-muted-foreground">No students available.</p>
                  <p className="text-sm mt-2">Add students to track their social skill development.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>
                Add a new student to the social skills development system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                To add a new student, please use the student management system in the main dashboard.
                Once added, students will automatically appear in the social skills development module.
              </p>
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Go to Student Management
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Skills Development Settings</CardTitle>
              <CardDescription>
                Configure your social skills development system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Teaching Methods</h3>
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePeerModeling">Peer Modelling</Label>
                      <p className="text-sm text-muted-foreground">Enable peer modelling approach</p>
                    </div>
                    <Switch 
                      id="enablePeerModeling" 
                      checked={settings.enablePeerModeling}
                      onCheckedChange={(checked) => setSettings({...settings, enablePeerModeling: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSocialStories">Social Stories</Label>
                      <p className="text-sm text-muted-foreground">Enable social stories approach</p>
                    </div>
                    <Switch 
                      id="enableSocialStories" 
                      checked={settings.enableSocialStories}
                      onCheckedChange={(checked) => setSettings({...settings, enableSocialStories: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRolePlay">Role Play</Label>
                      <p className="text-sm text-muted-foreground">Enable role play activities</p>
                    </div>
                    <Switch 
                      id="enableRolePlay" 
                      checked={settings.enableRolePlay}
                      onCheckedChange={(checked) => setSettings({...settings, enableRolePlay: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableVideoModeling">Video Modelling</Label>
                      <p className="text-sm text-muted-foreground">Enable video modelling approach</p>
                    </div>
                    <Switch 
                      id="enableVideoModeling" 
                      checked={settings.enableVideoModeling}
                      onCheckedChange={(checked) => setSettings({...settings, enableVideoModeling: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSocialScripts">Social Scripts</Label>
                      <p className="text-sm text-muted-foreground">Enable social scripts approach</p>
                    </div>
                    <Switch 
                      id="enableSocialScripts" 
                      checked={settings.enableSocialScripts}
                      onCheckedChange={(checked) => setSettings({...settings, enableSocialScripts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableGroupActivities">Group Activities</Label>
                      <p className="text-sm text-muted-foreground">Enable group-based activities</p>
                    </div>
                    <Switch 
                      id="enableGroupActivities" 
                      checked={settings.enableGroupActivities}
                      onCheckedChange={(checked) => setSettings({...settings, enableGroupActivities: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Access Settings</h3>
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableParentAccess">Parent Access</Label>
                      <p className="text-sm text-muted-foreground">Allow parents to view social skills data</p>
                    </div>
                    <Switch 
                      id="enableParentAccess" 
                      checked={settings.enableParentAccess}
                      onCheckedChange={(checked) => setSettings({...settings, enableParentAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableStudentAccess">Student Access</Label>
                      <p className="text-sm text-muted-foreground">Allow students to view their own data</p>
                    </div>
                    <Switch 
                      id="enableStudentAccess" 
                      checked={settings.enableStudentAccess}
                      onCheckedChange={(checked) => setSettings({...settings, enableStudentAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyParentsOnProgress">Progress Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify parents about social skills progress</p>
                    </div>
                    <Switch 
                      id="notifyParentsOnProgress" 
                      checked={settings.notifyParentsOnProgress}
                      onCheckedChange={(checked) => setSettings({...settings, notifyParentsOnProgress: checked})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="defaultAssessmentFrequency">Default Assessment Frequency</Label>
                    <Select 
                      value={settings.defaultAssessmentFrequency} 
                      onValueChange={(value) => setSettings({...settings, defaultAssessmentFrequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="termly">Termly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultSkillCategory">Default Skill Category</Label>
                    <Select 
                      value={settings.defaultSkillCategory} 
                      onValueChange={(value) => setSettings({...settings, defaultSkillCategory: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="emotional">Emotional Understanding</SelectItem>
                        <SelectItem value="interpersonal">Interpersonal Skills</SelectItem>
                        <SelectItem value="problem-solving">Social Problem Solving</SelectItem>
                        <SelectItem value="self-awareness">Self-Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="customizableGoals">Customizable Goals</Label>
                      <p className="text-sm text-muted-foreground">Allow students to suggest custom goals</p>
                    </div>
                    <Switch 
                      id="customizableGoals" 
                      checked={settings.customizableGoals}
                      onCheckedChange={(checked) => setSettings({...settings, customizableGoals: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSettingsUpdate} className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Practices</CardTitle>
              <CardDescription>
                Research-backed approaches to social skills development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Social Skills Interventions</h4>
                  <p className="text-sm mt-1">
                    This system is aligned with evidence-based social skills interventions that have been shown to improve 
                    social competence in children with and without social difficulties. A meta-analysis by Reichow and 
                    Volkmar (2010) found that social skills groups, video modelling, and peer-mediated interventions have 
                    strong empirical support.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Social Stories™</h4>
                  <p className="text-sm mt-1">
                    Social Stories™, developed by Carol Grey, have been shown to be effective for teaching social understanding 
                    and skills. Research by Kokina and Kern (2010) found that Social Stories™ are most effective when they 
                    include descriptive, perspective, directive, and affirmative sentences, and when they are implemented 
                    with visual supports.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Video Modelling</h4>
                  <p className="text-sm mt-1">
                    Video modelling is an evidence-based practise identified by the National Professional Development Centre 
                    on Autism Spectrum Disorders. Research by Bellini and Akullian (2007) found that video modelling leads to 
                    rapid skill acquisition, maintenance of skills over time, and generalization across settings.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Peer-Mediated Interventions</h4>
                  <p className="text-sm mt-1">
                    Peer-mediated interventions involve teaching typically developing peers strategies to support and engage 
                    with children who have social difficulties. Research by Chan et al. (2009) found that peer-mediated 
                    interventions lead to increased social interactions, improved social skills, and better generalization 
                    of skills to natural settings.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Cognitive-Behavioural Approaches</h4>
                  <p className="text-sm mt-1">
                    This system incorporates cognitive-behavioural approaches to social skills development, which focus on 
                    teaching children to identify and modify thoughts, feelings, and behaviors that affect social interactions. 
                    Research by Bauminger (2007) found that cognitive-behavioural social skills training leads to improvements 
                    in social cognition, social problem-solving, and social interaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialSkillsDevelopmentEngine;
