'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Heart,
  Share2,
  Zap,
  Award,
  Star,
  MessageCircle,
  Smile,
  ThumbsUp,
  BookOpen,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  Brain,
  BarChart,
  LineChart,
  PieChart,
  Settings,
  Code,
  Layers,
  Sliders
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function AdaptiveLearningAlgorithmsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('maths');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ks2');
  const [difficultyLevel, setDifficultyLevel] = useState(5);
  const [adaptationSpeed, setAdaptationSpeed] = useState(3);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Sample performance data for visualization
  const performanceData = {
    maths: {
      ks1: {
        accuracy: 78,
        speed: 65,
        retention: 72,
        engagement: 85,
        progress: 68
      },
      ks2: {
        accuracy: 82,
        speed: 70,
        retention: 75,
        engagement: 88,
        progress: 73
      },
      ks3: {
        accuracy: 76,
        speed: 68,
        retention: 70,
        engagement: 80,
        progress: 65
      },
      ks4: {
        accuracy: 80,
        speed: 72,
        retention: 74,
        engagement: 82,
        progress: 70
      }
    },
    english: {
      ks1: {
        accuracy: 80,
        speed: 68,
        retention: 75,
        engagement: 87,
        progress: 72
      },
      ks2: {
        accuracy: 85,
        speed: 73,
        retention: 78,
        engagement: 90,
        progress: 76
      },
      ks3: {
        accuracy: 79,
        speed: 70,
        retention: 73,
        engagement: 83,
        progress: 68
      },
      ks4: {
        accuracy: 83,
        speed: 75,
        retention: 77,
        engagement: 85,
        progress: 74
      }
    },
    science: {
      ks1: {
        accuracy: 75,
        speed: 63,
        retention: 70,
        engagement: 82,
        progress: 65
      },
      ks2: {
        accuracy: 80,
        speed: 68,
        retention: 73,
        engagement: 85,
        progress: 70
      },
      ks3: {
        accuracy: 78,
        speed: 65,
        retention: 72,
        engagement: 80,
        progress: 67
      },
      ks4: {
        accuracy: 82,
        speed: 70,
        retention: 75,
        engagement: 83,
        progress: 72
      }
    }
  };
  
  // Get current performance data based on selections
  const currentPerformance = performanceData[selectedSubject][selectedAgeGroup];
  
  // Sample algorithm parameters
  const algorithmParameters = {
    difficultyAdjustment: {
      title: "Difficulty Adjustment",
      description: "Controls how quickly the system adjusts difficulty based on performance",
      min: 1,
      max: 10,
      default: 5,
      value: difficultyLevel
    },
    adaptationSpeed: {
      title: "Adaptation Speed",
      description: "Determines how rapidly the system responds to changes in learning patterns",
      min: 1,
      max: 5,
      default: 3,
      value: adaptationSpeed
    }
  };
  
  // Sample UK curriculum topics for selected subject and age group
  const curriculumTopics = {
    maths: {
      ks1: [
        "Number and Place Value",
        "Addition and Subtraction",
        "Multiplication and Division",
        "Fractions",
        "Measurement",
        "Geometry - Properties of Shapes",
        "Geometry - Position and Direction",
        "Statistics"
      ],
      ks2: [
        "Number and Place Value",
        "Addition, Subtraction, Multiplication and Division",
        "Fractions (including decimals and percentages)",
        "Ratio and Proportion",
        "Algebra",
        "Measurement",
        "Geometry - Properties of Shapes",
        "Geometry - Position and Direction",
        "Statistics"
      ],
      ks3: [
        "Number",
        "Algebra",
        "Ratio, Proportion and Rates of Change",
        "Geometry and Measures",
        "Probability",
        "Statistics"
      ],
      ks4: [
        "Number",
        "Algebra",
        "Ratio, Proportion and Rates of Change",
        "Geometry and Measures",
        "Probability",
        "Statistics"
      ]
    },
    english: {
      ks1: [
        "Spoken Language",
        "Reading - Word Reading",
        "Reading - Comprehension",
        "Writing - Transcription",
        "Writing - Composition",
        "Writing - Vocabulary, Grammar and Punctuation"
      ],
      ks2: [
        "Spoken Language",
        "Reading - Word Reading",
        "Reading - Comprehension",
        "Writing - Transcription",
        "Writing - Composition",
        "Writing - Vocabulary, Grammar and Punctuation"
      ],
      ks3: [
        "Reading",
        "Writing",
        "Grammar and Vocabulary",
        "Spoken English"
      ],
      ks4: [
        "Reading",
        "Writing",
        "Grammar and Vocabulary",
        "Spoken English"
      ]
    },
    science: {
      ks1: [
        "Working Scientifically",
        "Plants",
        "Animals, including Humans",
        "Everyday Materials",
        "Seasonal Changes"
      ],
      ks2: [
        "Working Scientifically",
        "Plants",
        "Animals, including Humans",
        "Rocks",
        "Light",
        "Forces and Magnets",
        "Living Things and their Habitats",
        "States of Matter",
        "Sound",
        "Electricity",
        "Earth and Space",
        "Evolution and Inheritance"
      ],
      ks3: [
        "Working Scientifically",
        "Biology",
        "Chemistry",
        "Physics"
      ],
      ks4: [
        "Working Scientifically",
        "Biology",
        "Chemistry",
        "Physics"
      ]
    }
  };
  
  // Get current curriculum topics based on selections
  const currentTopics = curriculumTopics[selectedSubject][selectedAgeGroup];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Adaptive Learning Algorithms</h1>
        <p className="text-muted-foreground text-lg">
          Personalized learning experiences powered by intelligent algorithms aligned with UK curriculum
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Adaptive Learning System</CardTitle>
                    <CardDescription>
                      Intelligent algorithms that personalize learning experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* Algorithm Overview */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className="bg-primary/10 p-3 rounded-full mb-3">
                                  <Brain className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-medium mb-2">Assessment</h4>
                                <p className="text-sm text-muted-foreground">
                                  Continuously evaluates student performance and learning patterns
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className="bg-primary/10 p-3 rounded-full mb-3">
                                  <Sliders className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-medium mb-2">Adaptation</h4>
                                <p className="text-sm text-muted-foreground">
                                  Adjusts difficulty, content, and pacing based on individual needs
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className="bg-primary/10 p-3 rounded-full mb-3">
                                  <Layers className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-medium mb-2">Personalization</h4>
                                <p className="text-sm text-muted-foreground">
                                  Creates unique learning pathways aligned with UK curriculum
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Key Features */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">UK Curriculum Alignment</h4>
                              <p className="text-sm text-muted-foreground">
                                Fully aligned with National Curriculum standards for all key stages
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Real-time Adaptation</h4>
                              <p className="text-sm text-muted-foreground">
                                Adjusts difficulty and content in real-time based on performance
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Learning Style Recognition</h4>
                              <p className="text-sm text-muted-foreground">
                                Identifies and adapts to individual learning preferences
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Gap Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                Identifies and addresses knowledge gaps in the learning journey
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Engagement Optimization</h4>
                              <p className="text-sm text-muted-foreground">
                                Adapts content based on interest to maximize motivation
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Comprehensive Analytics</h4>
                              <p className="text-sm text-muted-foreground">
                                Detailed insights into learning patterns and progress
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subject Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Explore by Subject</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card 
                            className={`cursor-pointer transition-colors ${selectedSubject === 'maths' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                            onClick={() => setSelectedSubject('maths')}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className={`p-3 rounded-full mb-3 ${selectedSubject === 'maths' ? 'bg-primary/20' : 'bg-gray-100'}`}>
                                  <span className="text-2xl">🔢</span>
                                </div>
                                <h4 className="font-medium">Mathematics</h4>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card 
                            className={`cursor-pointer transition-colors ${selectedSubject === 'english' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                            onClick={() => setSelectedSubject('english')}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className={`p-3 rounded-full mb-3 ${selectedSubject === 'english' ? 'bg-primary/20' : 'bg-gray-100'}`}>
                                  <span className="text-2xl">📝</span>
                                </div>
                                <h4 className="font-medium">English</h4>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card 
                            className={`cursor-pointer transition-colors ${selectedSubject === 'science' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}
                            onClick={() => setSelectedSubject('science')}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center text-center">
                                <div className={`p-3 rounded-full mb-3 ${selectedSubject === 'science' ? 'bg-primary/20' : 'bg-gray-100'}`}>
                                  <span className="text-2xl">🔬</span>
                                </div>
                                <h4 className="font-medium">Science</h4>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Age Group Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Select Age Group</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            className={`cursor-pointer px-3 py-1 ${selectedAgeGroup === 'ks1' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                            onClick={() => setSelectedAgeGroup('ks1')}
                          >
                            Key Stage 1 (5-7 years)
                          </Badge>
                          <Badge 
                            className={`cursor-pointer px-3 py-1 ${selectedAgeGroup === 'ks2' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                            onClick={() => setSelectedAgeGroup('ks2')}
                          >
                            Key Stage 2 (7-11 years)
                          </Badge>
                          <Badge 
                            className={`cursor-pointer px-3 py-1 ${selectedAgeGroup === 'ks3' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                            onClick={() => setSelectedAgeGroup('ks3')}
                          >
                            Key Stage 3 (11-14 years)
                          </Badge>
                          <Badge 
                            className={`cursor-pointer px-3 py-1 ${selectedAgeGroup === 'ks4' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                            onClick={() => setSelectedAgeGroup('ks4')}
                          >
                            Key Stage 4 (14-16 years)
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Curriculum Topics */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">UK Curriculum Topics</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} • {selectedAgeGroup.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentTopics.map((topic, index) => (
                            <Card key={index} className="bg-gray-50">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-primary font-medium">{index + 1}</span>
                                    </div>
                                    <span className="font-medium">{topic}</span>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Adaptive
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Algorithm Tab */}
            <TabsContent value="algorithm">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Algorithm Configuration</CardTitle>
                    <CardDescription>
                      Customize the adaptive learning algorithm parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* Algorithm Visualization */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Algorithm Visualization</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="relative w-full max-w-md">
                              {/* Simplified algorithm visualization */}
                              <div className="absolute top-0 left-0 right-0 h-12 bg-blue-100 rounded-t-lg flex items-center justify-center">
                                <span className="font-medium text-blue-800">Input Layer</span>
                              </div>
                              
                              <div className="absolute top-14 left-0 right-0 h-36 bg-primary/10 rounded-lg flex items-center justify-center">
                                <div className="grid grid-cols-3 gap-3 p-4">
                                  {Array(9).fill(0).map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-100 rounded-b-lg flex items-center justify-center">
                                <span className="font-medium text-green-800">Output Layer</span>
                              </div>
                              
                              {/* Connection lines */}
                              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                                <defs>
                                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                                  </marker>
                                </defs>
                                <line x1="50%" y1="12" x2="50%" y2="14" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <line x1="50%" y1="50" x2="50%" y2="52" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Algorithm Parameters */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Algorithm Parameters</h3>
                        
                        <div className="space-y-6">
                          {/* Difficulty Adjustment */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{algorithmParameters.difficultyAdjustment.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {algorithmParameters.difficultyAdjustment.description}
                                </p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                Level {difficultyLevel}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Gradual</span>
                              <input 
                                type="range" 
                                min={algorithmParameters.difficultyAdjustment.min} 
                                max={algorithmParameters.difficultyAdjustment.max} 
                                value={difficultyLevel}
                                onChange={(e) => setDifficultyLevel(parseInt(e.target.value))}
                                className="flex-grow"
                              />
                              <span className="text-sm">Responsive</span>
                            </div>
                          </div>
                          
                          {/* Adaptation Speed */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{algorithmParameters.adaptationSpeed.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {algorithmParameters.adaptationSpeed.description}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Level {adaptationSpeed}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Conservative</span>
                              <input 
                                type="range" 
                                min={algorithmParameters.adaptationSpeed.min} 
                                max={algorithmParameters.adaptationSpeed.max} 
                                value={adaptationSpeed}
                                onChange={(e) => setAdaptationSpeed(parseInt(e.target.value))}
                                className="flex-grow"
                              />
                              <span className="text-sm">Aggressive</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Algorithm Components */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Algorithm Components</h3>
                        
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                  <Brain className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Performance Analysis</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Evaluates accuracy, speed, and consistency across multiple dimensions
                                  </p>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                  <Layers className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Knowledge Mapping</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Creates detailed knowledge graph aligned with UK curriculum standards
                                  </p>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="bg-purple-100 p-2 rounded-full mr-3">
                                  <Lightbulb className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Learning Style Detection</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Identifies preferred learning modalities and adapts content presentation
                                  </p>
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                  <Heart className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Engagement Optimization</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Monitors engagement levels and adapts content to maintain motivation
                                  </p>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Technical Details */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Technical Details</h3>
                          <Button variant="outline" size="sm">
                            <Code className="h-4 w-4 mr-2" /> View Documentation
                          </Button>
                        </div>
                        
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Algorithm Type:</span>
                                <span className="font-medium">Adaptive Neural Network</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Training Method:</span>
                                <span className="font-medium">Supervised + Reinforcement Learning</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Update Frequency:</span>
                                <span className="font-medium">Real-time + Daily Batch</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Data Privacy:</span>
                                <span className="font-medium">GDPR Compliant</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">UK Curriculum Version:</span>
                                <span className="font-medium">2023-2024</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle>Performance Analytics</CardTitle>
                        <CardDescription>
                          Measure the effectiveness of adaptive learning algorithms
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <select 
                          className="border rounded-md p-2 text-sm"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          <option value="maths">Mathematics</option>
                          <option value="english">English</option>
                          <option value="science">Science</option>
                        </select>
                        <select 
                          className="border rounded-md p-2 text-sm"
                          value={selectedAgeGroup}
                          onChange={(e) => setSelectedAgeGroup(e.target.value)}
                        >
                          <option value="ks1">Key Stage 1</option>
                          <option value="ks2">Key Stage 2</option>
                          <option value="ks3">Key Stage 3</option>
                          <option value="ks4">Key Stage 4</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-blue-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-800">Accuracy</h4>
                                <span className="text-2xl font-bold text-blue-800">{currentPerformance.accuracy}%</span>
                              </div>
                              <Progress value={currentPerformance.accuracy} className="h-2 bg-blue-200">
                                <div className="h-full bg-blue-600 rounded-full"></div>
                              </Progress>
                              <p className="text-xs text-blue-700 mt-2">
                                Percentage of correct responses across all assessments
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-green-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-green-800">Engagement</h4>
                                <span className="text-2xl font-bold text-green-800">{currentPerformance.engagement}%</span>
                              </div>
                              <Progress value={currentPerformance.engagement} className="h-2 bg-green-200">
                                <div className="h-full bg-green-600 rounded-full"></div>
                              </Progress>
                              <p className="text-xs text-green-700 mt-2">
                                Measure of student interaction and time on task
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-purple-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-purple-800">Progress</h4>
                                <span className="text-2xl font-bold text-purple-800">{currentPerformance.progress}%</span>
                              </div>
                              <Progress value={currentPerformance.progress} className="h-2 bg-purple-200">
                                <div className="h-full bg-purple-600 rounded-full"></div>
                              </Progress>
                              <p className="text-xs text-purple-700 mt-2">
                                Overall curriculum coverage and mastery level
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Performance Visualization */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Performance Visualization</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="w-full max-w-md">
                              {/* Simplified radar chart */}
                              <div className="relative h-64 w-full">
                                {/* Radar background */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-48 h-48 rounded-full border border-gray-200"></div>
                                  <div className="absolute w-36 h-36 rounded-full border border-gray-200"></div>
                                  <div className="absolute w-24 h-24 rounded-full border border-gray-200"></div>
                                  <div className="absolute w-12 h-12 rounded-full border border-gray-200"></div>
                                </div>
                                
                                {/* Radar axes */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="absolute h-48 w-0 border-l border-gray-200 transform rotate-0"></div>
                                  <div className="absolute h-48 w-0 border-l border-gray-200 transform rotate-72"></div>
                                  <div className="absolute h-48 w-0 border-l border-gray-200 transform rotate-144"></div>
                                  <div className="absolute h-48 w-0 border-l border-gray-200 transform rotate-216"></div>
                                  <div className="absolute h-48 w-0 border-l border-gray-200 transform rotate-288"></div>
                                </div>
                                
                                {/* Radar data polygon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                                    <polygon 
                                      points="50,10 90,40 75,85 25,85 10,40" 
                                      fill="rgba(79, 70, 229, 0.2)" 
                                      stroke="rgba(79, 70, 229, 0.8)" 
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                                
                                {/* Radar labels */}
                                <div className="absolute inset-0">
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-xs font-medium">Accuracy</div>
                                  <div className="absolute top-1/4 right-4 transform translate-y-1/2 text-xs font-medium">Speed</div>
                                  <div className="absolute bottom-1/4 right-4 transform translate-y-1/2 text-xs font-medium">Retention</div>
                                  <div className="absolute bottom-1/4 left-4 transform translate-y-1/2 text-xs font-medium">Engagement</div>
                                  <div className="absolute top-1/4 left-4 transform translate-y-1/2 text-xs font-medium">Progress</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Adaptation Effectiveness */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Adaptation Effectiveness</h3>
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Difficulty Adjustment</h4>
                                <Badge className="bg-green-100 text-green-800">
                                  Highly Effective
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Challenge Balance:</span>
                                  <span className="font-medium">92%</span>
                                </div>
                                <Progress value={92} className="h-2">
                                  <div className="h-full bg-green-600 rounded-full"></div>
                                </Progress>
                                <p className="text-xs text-muted-foreground">
                                  Algorithm effectively maintains optimal challenge level, keeping students in the productive learning zone
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Content Personalization</h4>
                                <Badge className="bg-blue-100 text-blue-800">
                                  Effective
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Relevance Score:</span>
                                  <span className="font-medium">87%</span>
                                </div>
                                <Progress value={87} className="h-2">
                                  <div className="h-full bg-blue-600 rounded-full"></div>
                                </Progress>
                                <p className="text-xs text-muted-foreground">
                                  Content selection aligns well with individual interests and learning preferences
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Gap Identification</h4>
                                <Badge className="bg-amber-100 text-amber-800">
                                  Moderately Effective
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Detection Accuracy:</span>
                                  <span className="font-medium">78%</span>
                                </div>
                                <Progress value={78} className="h-2">
                                  <div className="h-full bg-amber-600 rounded-full"></div>
                                </Progress>
                                <p className="text-xs text-muted-foreground">
                                  Algorithm identifies most knowledge gaps but occasionally misses subtle conceptual misunderstandings
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* UK Curriculum Coverage */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">UK Curriculum Coverage</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} • {selectedAgeGroup.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="w-full max-w-md">
                              {/* Simplified curriculum coverage visualization */}
                              <div className="grid grid-cols-3 gap-3">
                                {currentTopics.slice(0, 9).map((topic, index) => {
                                  // Generate random coverage percentage between 65-95%
                                  const coverage = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
                                  return (
                                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                      <div className="text-xs font-medium mb-2 truncate" title={topic}>
                                        {topic.length > 15 ? topic.substring(0, 15) + '...' : topic}
                                      </div>
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Coverage:</span>
                                        <span>{coverage}%</span>
                                      </div>
                                      <Progress value={coverage} className="h-1.5">
                                        <div className={`h-full rounded-full ${coverage > 85 ? 'bg-green-600' : coverage > 75 ? 'bg-blue-600' : 'bg-amber-600'}`}></div>
                                      </Progress>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Report Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" /> Generate Detailed Report
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                        <Button variant="ghost">
                          <Share2 className="h-4 w-4 mr-2" /> Share Insights
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Algorithm Settings</CardTitle>
                    <CardDescription>
                      Configure adaptive learning algorithm behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* General Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">General Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Enable Adaptive Learning</h4>
                              <p className="text-sm text-muted-foreground">
                                Turn adaptive learning algorithms on or off
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Real-time Adaptation</h4>
                              <p className="text-sm text-muted-foreground">
                                Adjust content and difficulty in real-time during sessions
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Learning Style Detection</h4>
                              <p className="text-sm text-muted-foreground">
                                Identify and adapt to individual learning preferences
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Interest-Based Content</h4>
                              <p className="text-sm text-muted-foreground">
                                Adapt content based on detected interests and preferences
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Curriculum Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">UK Curriculum Settings</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="curriculum-version" className="block text-sm font-medium mb-1">
                              Curriculum Version
                            </label>
                            <select 
                              id="curriculum-version"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="2023">UK National Curriculum 2023-2024</option>
                              <option value="2022">UK National Curriculum 2022-2023</option>
                              <option value="2021">UK National Curriculum 2021-2022</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="assessment-framework" className="block text-sm font-medium mb-1">
                              Assessment Framework
                            </label>
                            <select 
                              id="assessment-framework"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="standard">Standard Assessment Tests (SATs)</option>
                              <option value="gcse">GCSE Framework</option>
                              <option value="custom">Custom Assessment Framework</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Strict Curriculum Adherence</h4>
                              <p className="text-sm text-muted-foreground">
                                Ensure all content strictly follows UK curriculum standards
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Advanced Settings</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="data-collection" className="block text-sm font-medium mb-1">
                              Data Collection Level
                            </label>
                            <select 
                              id="data-collection"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="minimal">Minimal - Essential Learning Data Only</option>
                              <option value="standard">Standard - Learning and Engagement Data</option>
                              <option value="comprehensive">Comprehensive - Full Analytics Suite</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="model-update" className="block text-sm font-medium mb-1">
                              Model Update Frequency
                            </label>
                            <select 
                              id="model-update"
                              className="w-full border rounded-md p-2 text-sm"
                            >
                              <option value="realtime">Real-time Updates</option>
                              <option value="daily">Daily Updates</option>
                              <option value="weekly">Weekly Updates</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Advanced Analytics</h4>
                              <p className="text-sm text-muted-foreground">
                                Enable detailed learning pattern analysis
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Experimental Features</h4>
                              <p className="text-sm text-muted-foreground">
                                Enable cutting-edge adaptive learning capabilities
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                              <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">
                          Reset to Defaults
                        </Button>
                        <Button>
                          Save Settings
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-8">
          {/* UK Educational Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UK Educational Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Our adaptive learning algorithms are specifically designed to support UK educational frameworks and curriculum standards.
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">UK Curriculum Alignment:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Fully aligned with National Curriculum for England</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports progression across all key stages</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Incorporates UK assessment frameworks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" /> Configure Algorithm
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> View Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart className="h-4 w-4 mr-2" /> Performance Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" /> Manage Student Groups
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Implementation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Initial Assessment</p>
                      <p className="text-muted-foreground">Begin with baseline assessment to establish starting points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Regular Usage</p>
                      <p className="text-muted-foreground">Consistent engagement improves algorithm accuracy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Review Analytics</p>
                      <p className="text-muted-foreground">Monitor performance reports to track progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Adjust Parameters</p>
                      <p className="text-muted-foreground">Fine-tune algorithm settings for optimal results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Tools and resources to support adaptive learning implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Technical Documentation</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed technical guides for understanding and configuring adaptive algorithms.
                  </p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Teacher Guides</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Implementation guides and best practices for educators using adaptive learning.
                  </p>
                  <Button variant="outline" className="w-full">View Guides</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Research Evidence</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    UK-based research on the effectiveness of adaptive learning in educational settings.
                  </p>
                  <Button variant="outline" className="w-full">View Research</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/reflection-prompts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Reflection Prompts
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/adaptive-learning">
            Adaptive Learning Overview <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
