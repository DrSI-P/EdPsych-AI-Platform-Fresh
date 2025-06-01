'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Brain, 
  Compass, 
  Lightbulb, 
  Map, 
  BarChart, 
  LineChart,
  Sparkles,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Award,
  Layers,
  RotateCw
} from 'lucide-react';

// Personalized Learning Pathways prototype
// This component demonstrates the concept of AI-driven, adaptive learning paths tailored to individual learners

interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
  social: number;
  solitary: number;
}

interface LearnerProfile {
  name: string;
  age: number;
  educationLevel: string;
  interests: any[];
  strengths: any[];
  areasForGrowth: any[];
  learningStyle: LearningStyle;
  priorKnowledge: Record<string, number>;
  learningGoals: any[];
  accessibilityNeeds: any[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: any[];
  learningOutcomes: any[];
  format: any[];
  engagementLevel: number;
  completionStatus: number;
}

export default function PersonalizedLearningPathwaysPage() {
  // State for learner profile
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>({
    name: "Alex Thompson",
    age: 12,
    educationLevel: "Key Stage 3",
    interests: ["Space exploration", "Robotics", "Wildlife", "Video games"],
    strengths: ["Mathematical reasoning", "Creative thinking", "Visual pattern recognition"],
    areasForGrowth: ["Written expression", "Historical context understanding", "Public speaking"],
    learningStyle: {
      visual: 85,
      auditory: 60,
      kinesthetic: 75,
      reading: 50,
      social: 65,
      solitary: 80
    },
    priorKnowledge: {
      "Mathematics": 78,
      "Science": 82,
      "English": 65,
      "History": 58,
      "Geography": 70,
      "Art": 75
    },
    learningGoals: [
      "Improve understanding of algebraic concepts",
      "Develop better essay writing skills",
      "Learn about space exploration history",
      "Build a simple robot"
    ],
    accessibilityNeeds: []
  });
  
  // State for learning modules
  const [learningModules, setLearningModules] = useState<LearningModule[]>([
    {
      id: "math-001",
      title: "Algebraic Expressions and Equations",
      description: "Master the fundamentals of algebraic expressions, equations, and problem-solving techniques.",
      subject: "Mathematics",
      difficulty: 3,
      estimatedTime: 45,
      prerequisites: ["Basic arithmetic", "Introduction to variables"],
      learningOutcomes: [
        "Simplify algebraic expressions",
        "Solve linear equations",
        "Apply algebraic concepts to real-world problems"
      ],
      format: ["Interactive simulation", "Visual diagrams", "Problem sets"],
      engagementLevel: 85,
      completionStatus: 65
    },
    {
      id: "sci-042",
      title: "Solar System Exploration",
      description: "Journey through our solar system, learning about planets, moons, and space exploration missions.",
      subject: "Science",
      difficulty: 2,
      estimatedTime: 60,
      prerequisites: ["Basic astronomy concepts"],
      learningOutcomes: [
        "Identify the planets and their key characteristics",
        "Understand the history of space exploration",
        "Explain how spacecraft navigate the solar system"
      ],
      format: ["Immersive environment", "Video content", "Interactive models"],
      engagementLevel: 95,
      completionStatus: 30
    },
    {
      id: "eng-023",
      title: "Narrative Writing Workshop",
      description: "Develop creative writing skills through structured narrative development exercises.",
      subject: "English",
      difficulty: 3,
      estimatedTime: 50,
      prerequisites: ["Basic grammar and vocabulary"],
      learningOutcomes: [
        "Create compelling character profiles",
        "Structure a narrative with beginning, middle, and end",
        "Use descriptive language effectively"
      ],
      format: ["Writing exercises", "Audio guidance", "Peer feedback"],
      engagementLevel: 70,
      completionStatus: 10
    },
    {
      id: "rob-007",
      title: "Introduction to Robotics",
      description: "Learn the basics of robotics through hands-on projects and simulations.",
      subject: "Technology",
      difficulty: 4,
      estimatedTime: 75,
      prerequisites: ["Basic science concepts", "Simple mathematics"],
      learningOutcomes: [
        "Understand core robotics principles",
        "Design a simple robot",
        "Programme basic movement commands"
      ],
      format: ["Hands-on project", "Simulation", "Video tutorials"],
      engagementLevel: 90,
      completionStatus: 0
    },
    {
      id: "hist-019",
      title: "Space Race: Cold War to Cooperation",
      description: "Explore the history of space exploration from the Cold War competition to international collaboration.",
      subject: "History",
      difficulty: 3,
      estimatedTime: 55,
      prerequisites: ["Basic 20th century history"],
      learningOutcomes: [
        "Understand the political context of the Space Race",
        "Trace key milestones in space exploration",
        "Analyse the shift from competition to cooperation"
      ],
      format: ["Documentary video", "Primary sources", "Timeline activity"],
      engagementLevel: 80,
      completionStatus: 0
    }
  ]);
  
  // State for recommended pathway
  const [recommendedPathway, setRecommendedPathway] = useState<string[]>(["sci-042", "math-001", "hist-019", "rob-007", "eng-023"]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for loading simulation
  const [isLoading, setIsLoading] = useState(false);
  
  // State for AI customization level
  const [aiCustomizationLevel, setAiCustomizationLevel] = useState(80);
  
  // State for showing accessibility options
  const [showAccessibilityOptions, setShowAccessibilityOptions] = useState(false);
  
  // State for selected module
  const [selectedModule, setSelectedModule] = useState<string | null>("sci-042");
  
  // Effect to simulate AI recalculation when customization level changes
  useEffect(() => {
    if (aiCustomizationLevel !== 80) {
      setIsLoading(true);
      
      setTimeout(() => {
        // Simulate AI recalculating the pathway based on new customization level
        const newOrder = [...recommendedPathway];
        if (aiCustomizationLevel > 80) {
          // Prioritize interests more heavily
          newOrder.sort((a, b) => {
            const moduleA = learningModules.find(m => m.id === a);
            const moduleB = learningModules.find(m => m.id === b);
            if (!moduleA || !moduleB) return 0;
            return moduleB.engagementLevel - moduleA.engagementLevel;
          });
        } else {
          // Prioritize areas for growth more heavily
          newOrder.sort((a, b) => {
            const moduleA = learningModules.find(m => m.id === a);
            const moduleB = learningModules.find(m => m.id === b);
            if (!moduleA || !moduleB) return 0;
            
            // Check if module subject matches areas for growth
            const aMatchesGrowth = learnerProfile.areasForGrowth.some(area => 
              moduleA.subject.toLowerCase().includes(area.toLowerCase()) || 
              moduleA.learningOutcomes.some(outcome => outcome.toLowerCase().includes(area.toLowerCase()))
            );
            
            const bMatchesGrowth = learnerProfile.areasForGrowth.some(area => 
              moduleB.subject.toLowerCase().includes(area.toLowerCase()) || 
              moduleB.learningOutcomes.some(outcome => outcome.toLowerCase().includes(area.toLowerCase()))
            );
            
            if (aMatchesGrowth && !bMatchesGrowth) return -1;
            if (!aMatchesGrowth && bMatchesGrowth) return 1;
            return 0;
          });
        }
        
        setRecommendedPathway(newOrder);
        setIsLoading(false);
      }, 2000);
    }
  }, [aiCustomizationLevel]);
  
  // Function to get module by ID
  const getModuleById = (id: string) => {
    return learningModules.find(module => module.id === id);
  };
  
  // Function to update module completion status
  const updateModuleCompletion = (id: string, newStatus: number) => {
    setLearningModules(prevModules => 
      prevModules.map(module => 
        module.id === id ? { ...module, completionStatus: newStatus } : module
      )
    );
  };
  
  // Function to get difficulty label
  const getDifficultyLabel = (level: number) => {
    switch(level) {
      case 1: return "Beginner";
      case 2: return "Elementary";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Expert";
      default: return "Intermediate";
    }
  };
  
  // Function to get subject colour
  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case "Mathematics": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Science": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "English": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "History": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Geography": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Technology": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Art": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default: return "bg-grey-100 text-grey-800 dark:bg-grey-800 dark:text-grey-300";
    }
  };
  
  // Function to get format icon
  const getFormatIcon = (format: string) => {
    switch(format) {
      case "Interactive simulation":
      case "Simulation":
        return <Sparkles className="h-4 w-4" />;
      case "Visual diagrams":
      case "Interactive models":
        return <Layers className="h-4 w-4" />;
      case "Problem sets":
        return <Brain className="h-4 w-4" />;
      case "Immersive environment":
        return <Compass className="h-4 w-4" />;
      case "Video content":
      case "Video tutorials":
      case "Documentary video":
        return <BookOpen className="h-4 w-4" />;
      case "Writing exercises":
        return <Lightbulb className="h-4 w-4" />;
      case "Audio guidance":
        return <Users className="h-4 w-4" />;
      case "Peer feedback":
        return <Users className="h-4 w-4" />;
      case "Hands-on project":
        return <Zap className="h-4 w-4" />;
      case "Primary sources":
        return <BookOpen className="h-4 w-4" />;
      case "Timeline activity":
        return <Map className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Personalized Learning Pathways</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience AI-driven, adaptive learning journeys that evolve with each learner, creating truly personalized educational experiences based on individual needs, interests, and goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === 'profile' ? (
                <div className="space-y-6">
                  <div className="text-centre mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-centre justify-centre mx-auto mb-3">
                      <span className="text-2xl font-bold text-primary">{learnerProfile.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h2 className="text-xl font-semibold">{learnerProfile.name}</h2>
                    <p className="text-muted-foreground">{learnerProfile.age} years • {learnerProfile.educationLevel}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-centre">
                      <Star className="mr-2 h-4 w-4 text-primary" />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {learnerProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-centre">
                      <Award className="mr-2 h-4 w-4 text-primary" />
                      Strengths
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {learnerProfile.strengths.map((strength, index) => (
                        <li key={index} className="flex items-centre">
                          <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-centre">
                      <Zap className="mr-2 h-4 w-4 text-primary" />
                      Areas for Growth
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {learnerProfile.areasForGrowth.map((area, index) => (
                        <li key={index} className="flex items-centre">
                          <ArrowRight className="mr-2 h-3 w-3 text-amber-500" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-centre">
                      <Brain className="mr-2 h-4 w-4 text-primary" />
                      Learning Style
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Visual</span>
                          <span>{learnerProfile.learningStyle.visual}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.visual} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Auditory</span>
                          <span>{learnerProfile.learningStyle.auditory}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.auditory} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Kinesthetic</span>
                          <span>{learnerProfile.learningStyle.kinesthetic}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.kinesthetic} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Reading/Writing</span>
                          <span>{learnerProfile.learningStyle.reading}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.reading} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Social</span>
                          <span>{learnerProfile.learningStyle.social}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.social} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Solitary</span>
                          <span>{learnerProfile.learningStyle.solitary}%</span>
                        </div>
                        <Progress value={learnerProfile.learningStyle.solitary} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-centre">
                      <BookOpen className="mr-2 h-4 w-4 text-primary" />
                      Prior Knowledge
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(learnerProfile.priorKnowledge).map(([subject, level]) => (
                        <div key={subject}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{subject}</span>
                            <span>{level}%</span>
                          </div>
                          <Progress value={level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Pathway Customization</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="ai-customization">AI Customization Level</Label>
                          <span className="text-sm">{aiCustomizationLevel}%</span>
                        </div>
                        <Slider
                          id="ai-customization"
                          min={0}
                          max={100}
                          step={10}
                          value={[aiCustomizationLevel]}
                          onValueChange={(value) => setAiCustomizationLevel(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher values prioritize interests and engagement, lower values focus on addressing areas for growth.
                        </p>
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="accessibility-toggle">
                          <div className="flex items-centre">
                            <Users className="mr-2 h-4 w-4" />
                            Accessibility Options
                          </div>
                        </Label>
                        <Switch 
                          id="accessibility-toggle" 
                          checked={showAccessibilityOptions}
                          onCheckedChange={setShowAccessibilityOptions}
                        />
                      </div>
                      
                      {showAccessibilityOptions && (
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <h4 className="text-sm font-medium">Accessibility Preferences</h4>
                          <div className="flex items-centre justify-between">
                            <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                            <Switch id="text-to-speech" />
                          </div>
                          <div className="flex items-centre justify-between">
                            <Label htmlFor="high-contrast">High Contrast Mode</Label>
                            <Switch id="high-contrast" />
                          </div>
                          <div className="flex items-centre justify-between">
                            <Label htmlFor="simplified-ui">Simplified Interface</Label>
                            <Switch id="simplified-ui" />
                          </div>
                          <div className="flex items-centre justify-between">
                            <Label htmlFor="extended-time">Extended Time for Activities</Label>
                            <Switch id="extended-time" />
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <Button className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                              Recalculating Pathway...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Regenerate Learning Pathway
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Learning Goals</h3>
                    <div className="space-y-2">
                      {learnerProfile.learningGoals.map((goal, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm">{goal}</p>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Add New Goal
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-centre justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-centre">
                  <Map className="mr-2 h-5 w-5 text-primary" />
                  Your Learning Pathway
                </h2>
                <Badge variant="outline" className="text-xs">
                  {isLoading ? 'Recalculating...' : 'AI-Optimised'}
                </Badge>
              </div>
              
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-centre justify-centre z-10">
                    <div className="flex flex-col items-centre">
                      <RotateCw className="h-8 w-8 text-primary animate-spin mb-4" />
                      <p className="text-lg font-medium">Recalculating Your Personalized Pathway...</p>
                      <p className="text-sm text-muted-foreground mt-2">Analysing learning profile and optimising module sequence</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  {recommendedPathway.map((moduleId, index) => {
                    const module = getModuleById(moduleId);
                    if (!module) return null;
                    
                    return (
                      <div 
                        key={moduleId} 
                        className={`relative pl-8 ${index < recommendedPathway.length - 1 ? 'pb-6' : ''}`}
                      >
                        {/* Connector line */}
                        {index < recommendedPathway.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-primary/20"></div>
                        )}
                        
                        {/* Step indicator */}
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 flex items-centre justify-centre">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        
                        <Card 
                          className={`border ${selectedModule === module.id ? 'border-primary' : ''} transition-colors`}
                          onClick={() => setSelectedModule(module.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-centre justify-between gap-4">
                              <div>
                                <div className="flex items-centre gap-2 mb-1">
                                  <Badge className={`${getSubjectColor(module.subject)}`}>
                                    {module.subject}
                                  </Badge>
                                  <Badge variant="outline">
                                    {getDifficultyLabel(module.difficulty)}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-medium">{module.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-centre gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{module.estimatedTime} min</span>
                                </div>
                                
                                <div className="w-full md:w-32">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{module.completionStatus}%</span>
                                  </div>
                                  <Progress value={module.completionStatus} className="h-2" />
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant={module.completionStatus > 0 ? "outline" : "default"}
                                  className="mt-1"
                                >
                                  {module.completionStatus === 100 ? (
                                    <>
                                      <CheckCircle className="mr-1 h-4 w-4" />
                                      Completed
                                    </>
                                  ) : module.completionStatus > 0 ? (
                                    <>
                                      <ArrowRight className="mr-1 h-4 w-4" />
                                      Continue
                                    </>
                                  ) : (
                                    <>
                                      <Lightbulb className="mr-1 h-4 w-4" />
                                      Start
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {selectedModule === module.id && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Learning Outcomes</h4>
                                    <ul className="space-y-1 text-sm">
                                      {module.learningOutcomes.map((outcome, i) => (
                                        <li key={i} className="flex items-start">
                                          <CheckCircle className="mr-2 h-3 w-3 text-primary mt-1" />
                                          <span>{outcome}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Learning Formats</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {module.format.map((format, i) => (
                                        <Badge key={i} variant="outline" className="flex items-centre">
                                          {getFormatIcon(format)}
                                          <span className="ml-1">{format}</span>
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="mt-3">
                                      <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {module.prerequisites.map((prereq, i) => (
                                          <Badge key={i} variant="secondary" className="text-xs">
                                            {prereq}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between mt-4">
                                  <div className="flex items-centre gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="text-sm">Engagement Match: {module.engagementLevel}%</span>
                                  </div>
                                  
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-centre">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Learning Analytics
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subject Engagement</h4>
                    <div className="space-y-3">
                      {Object.entries(learnerProfile.priorKnowledge).map(([subject, level]) => (
                        <div key={subject}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{subject}</span>
                            <span>{level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Learning Pace</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-centre justify-between mb-2">
                        <span className="text-sm">Average completion time:</span>
                        <Badge variant="outline">42 minutes/module</Badge>
                      </div>
                      <div className="flex items-centre justify-between">
                        <span className="text-sm">Retention assessment score:</span>
                        <Badge variant="outline">85%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Consistent Learner</p>
                          <p className="text-xs text-muted-foreground">Completed activities on 5 consecutive days</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Science Explorer</p>
                          <p className="text-xs text-muted-foreground">Completed 3 science modules with 90%+ score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-centre">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Recommendations
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Learning Style Optimization</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm mb-3">
                        Based on your learning profile, we recommend these adjustments:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="mr-2 h-3 w-3 text-primary mt-1" />
                          <span>Prioritize visual learning materials with diagrams and models</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-2 h-3 w-3 text-primary mt-1" />
                          <span>Incorporate hands-on activities to leverage kinesthetic strengths</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-2 h-3 w-3 text-primary mt-1" />
                          <span>Balance independent work with collaborative activities</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Suggested Focus Areas</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Written Expression</p>
                          <p className="text-xs text-muted-foreground">Dedicate 20-30 minutes daily to structured writing exercises</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Historical Context</p>
                          <p className="text-xs text-muted-foreground">Connect historical events to your interest in space exploration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Additional Resources</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Interactive Algebra Practise
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Space Exploration Timeline
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Beginner Robotics Projects
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learner Profiling</h3>
              <p className="text-muted-foreground">
                Our AI builds a comprehensive learner profile through assessments, observations, and interactions, understanding learning styles, strengths, interests, and areas for growth.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pathway Generation</h3>
              <p className="text-muted-foreground">
                The system creates a personalized learning pathway that sequences content and activities in the optimal order based on the learner's profile, goals, and current knowledge.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Adaptation</h3>
              <p className="text-muted-foreground">
                Learning materials adapt in real-time to match the learner's preferences, presenting content in formats that align with their learning style and engagement patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Evolution</h3>
              <p className="text-muted-foreground">
                The pathway continuously evolves based on performance data, adjusting difficulty, pace, and content to maintain the optimal challenge level and learning progression.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Learners</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Truly Personalized Experience</span>
                    <p className="text-sm text-muted-foreground">Every aspect of the learning journey is tailored to your unique profile, creating an experience designed specifically for you.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Optimal Challenge Level</span>
                    <p className="text-sm text-muted-foreground">Content is neither too easy nor too difficult, maintaining the perfect balance for engagement and growth.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Increased Motivation</span>
                    <p className="text-sm text-muted-foreground">Learning that connects to your interests and presents information in your preferred style naturally increases engagement.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Metacognitive Development</span>
                    <p className="text-sm text-muted-foreground">Gain insights into your own learning process, developing self-awareness and effective learning strategies.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Educators</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Detailed Learner Insights</span>
                    <p className="text-sm text-muted-foreground">Access comprehensive data on each student's learning patterns, strengths, and areas for development.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Efficient Differentiation</span>
                    <p className="text-sm text-muted-foreground">Automatically differentiate instruction for every student without the time-intensive manual planning typically required.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Targeted Intervention</span>
                    <p className="text-sm text-muted-foreground">Identify precisely where and how to intervene when students struggle, with specific recommendations for support.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Evidence-Based Practise</span>
                    <p className="text-sm text-muted-foreground">Make instructional decisions based on rich data rather than assumptions, improving educational outcomes.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
