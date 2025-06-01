'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Globe, 
  BookOpen, 
  Compass, 
  Map, 
  Users,
  Sparkles,
  Lightbulb,
  Zap,
  Layers,
  Maximize,
  Headphones,
  PanelRight,
  RotateCw
} from 'lucide-react';

// Immersive Learning Environments prototype
// This component demonstrates the concept of deeply engaging, multisensory learning spaces

export default function ImmersiveLearningEnvironmentsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState('rainforest');
  const [immersionLevel, setImmersionLevel] = useState(70);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [interactivityLevel, setInteractivityLevel] = useState(80);
  const [showGuide, setShowGuide] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  
  // Simulated environment data
  const environments = {
    rainforest: {
      title: "Amazon Rainforest Expedition",
      description: "Explore the biodiversity and ecosystems of the Amazon Rainforest through an immersive journey.",
      learningObjectives: [
        "Understand rainforest ecosystem dynamics and biodiversity",
        "Identify key species and their ecological roles",
        "Analyse human impact on rainforest environments",
        "Explore conservation strategies and sustainable practices"
      ],
      interactiveElements: [
        "3D species identification",
        "Ecosystem simulation",
        "Weather pattern visualisation",
        "Indigenous knowledge integration"
      ],
      guidedActivities: [
        "Canopy exploration",
        "River system analysis",
        "Species interaction mapping",
        "Conservation challenge"
      ]
    },
    ancient_rome: {
      title: "Ancient Rome: The Republic Era",
      description: "Walk the streets of Ancient Rome during the Republic era, experiencing daily life, politics, and culture.",
      learningObjectives: [
        "Understand Roman political structures and governance",
        "Explore daily life and social hierarchies in Ancient Rome",
        "Analyse architectural and engineering achievements",
        "Examine the cultural and religious practices of the era"
      ],
      interactiveElements: [
        "Senate debate participation",
        "Architectural construction tools",
        "Market economy simulation",
        "Roman technology exploration"
      ],
      guidedActivities: [
        "Forum political tour",
        "Aqueduct engineering challenge",
        "Cultural traditions experience",
        "Historical decision points"
      ]
    },
    cell_biology: {
      title: "Journey Inside the Cell",
      description: "Shrink down to explore the microscopic world inside a human cell, witnessing cellular processes in real-time.",
      learningObjectives: [
        "Identify and understand cellular structures and organelles",
        "Visualise key cellular processes like protein synthesis",
        "Analyse energy production and utilization in cells",
        "Explore cell communication and response mechanisms"
      ],
      interactiveElements: [
        "Organelle function simulation",
        "Protein synthesis visualisation",
        "Cellular respiration process",
        "Membrane transport mechanisms"
      ],
      guidedActivities: [
        "Mitochondria energy challenge",
        "DNA transcription experience",
        "Cell defense simulation",
        "Cellular communication network"
      ]
    }
  };
  
  // Canvas animation effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    
    // Animation variables
    let particles: {x: number, y: number, radius: number, color: string, speed: number}[] = [];
    const particleCount = 100;
    
    // Create particles based on active environment
    const createParticles = () => {
      particles = [];
      let colorScheme: any[] = [];
      
      switch(activeTab) {
        case 'rainforest':
          colorScheme = ['#4CAF50', '#8BC34A', '#CDDC39', '#3E7D32', '#1B5E20'];
          break;
        case 'ancient_rome':
          colorScheme = ['#FFC107', '#FF9800', '#FFEB3B', '#F57C00', '#E65100'];
          break;
        case 'cell_biology':
          colorScheme = ['#2196F3', '#03A9F4', '#00BCD4', '#0288D1', '#01579B'];
          break;
        default:
          colorScheme = ['#4CAF50', '#8BC34A', '#CDDC39', '#3E7D32', '#1B5E20'];
      }
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 5 + 1,
          color: colorScheme[Math.floor(Math.random() * colorScheme.length)],
          speed: Math.random() * 1 + 0.2
        });
      }
    };
    
    createParticles();
    
    // Animation loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.colour;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        // Move particles
        particle.y += particle.speed;
        
        // Reset particles that go off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);
  
  // Handle environment change
  useEffect(() => {
    // Reset position when changing environments
    setCurrentLocation({ x: 0, y: 0 });
    
    // Simulate loading new environment
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 2000);
  }, [activeTab]);
  
  // Handle canvas mouse move for interactive effect
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentLocation({ x, y });
  };
  
  // Get current environment data
  const getCurrentEnvironment = () => {
    switch(activeTab) {
      case 'rainforest':
        return environments.rainforest;
      case 'ancient_rome':
        return environments.ancient_rome;
      case 'cell_biology':
        return environments.cell_biology;
      default:
        return environments.rainforest;
    }
  };
  
  const currentEnvironment = getCurrentEnvironment();

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Immersive Learning Environments</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience multisensory, deeply engaging learning spaces that transport students to different worlds, time periods, and scales for unparalleled educational experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Environment Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                Environments
              </h2>
              
              <div className="space-y-4">
                <Button 
                  variant={activeTab === 'rainforest' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('rainforest')}
                >
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Amazon Rainforest
                </Button>
                
                <Button 
                  variant={activeTab === 'ancient_rome' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('ancient_rome')}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-500 mr-2" />
                  Ancient Rome
                </Button>
                
                <Button 
                  variant={activeTab === 'cell_biology' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('cell_biology')}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                  Cell Biology
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t space-y-6">
                <h3 className="font-medium mb-3">Immersion Settings</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="immersion-level">Immersion Level</Label>
                      <span className="text-sm">{immersionLevel}%</span>
                    </div>
                    <Slider
                      id="immersion-level"
                      min={0}
                      max={100}
                      step={10}
                      value={[immersionLevel]}
                      onValueChange={(value) => setImmersionLevel(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="interactivity-level">Interactivity</Label>
                      <span className="text-sm">{interactivityLevel}%</span>
                    </div>
                    <Slider
                      id="interactivity-level"
                      min={0}
                      max={100}
                      step={10}
                      value={[interactivityLevel]}
                      onValueChange={(value) => setInteractivityLevel(value[0])}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="audio-toggle">
                      <div className="flex items-centre">
                        <Headphones className="mr-2 h-4 w-4" />
                        Ambient Audio
                      </div>
                    </Label>
                    <Switch 
                      id="audio-toggle" 
                      checked={audioEnabled}
                      onCheckedChange={setAudioEnabled}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="narration-toggle">
                      <div className="flex items-centre">
                        <Headphones className="mr-2 h-4 w-4" />
                        Narration
                      </div>
                    </Label>
                    <Switch 
                      id="narration-toggle" 
                      checked={narrationEnabled}
                      onCheckedChange={setNarrationEnabled}
                    />
                  </div>
                  
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="guide-toggle">
                      <div className="flex items-centre">
                        <Compass className="mr-2 h-4 w-4" />
                        Learning Guide
                      </div>
                    </Label>
                    <Switch 
                      id="guide-toggle" 
                      checked={showGuide}
                      onCheckedChange={setShowGuide}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Immersive Environment Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-centre justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {currentEnvironment.title}
                </h2>
                <div className="flex items-centre gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFullscreen(!fullscreen)}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    {isRotating ? 'Loading...' : 'Ready'}
                  </Badge>
                </div>
              </div>
              
              <div className="relative mb-6 bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
                {/* Canvas for immersive environment visualisation */}
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full"
                  onMouseMove={handleCanvasMouseMove}
                />
                
                {/* Overlay elements */}
                <div className="absolute inset-0 flex items-centre justify-centre">
                  {isRotating ? (
                    <div className="flex flex-col items-centre">
                      <RotateCw className="h-12 w-12 text-primary animate-spin" />
                      <p className="mt-4 text-lg font-medium">Loading Environment...</p>
                    </div>
                  ) : (
                    <div className="text-centre p-6 bg-black/30 backdrop-blur-sm rounded-lg">
                      <h3 className="text-2xl font-bold text-white mb-2">{currentEnvironment.title}</h3>
                      <p className="text-white/80">{currentEnvironment.description}</p>
                    </div>
                  )}
                </div>
                
                {/* Interactive hotspots */}
                {!isRotating && interactivityLevel > 30 && (
                  <>
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-centre justify-centre cursor-pointer hover:bg-primary/40 transition-colors">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="absolute top-2/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-centre justify-centre cursor-pointer hover:bg-primary/40 transition-colors">
                        <Lightbulb className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-centre justify-centre cursor-pointer hover:bg-primary/40 transition-colors">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Learning guide panel */}
                {showGuide && !isRotating && (
                  <div className="absolute top-4 right-4 w-64 bg-background/90 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                    <div className="flex items-centre justify-between mb-2">
                      <h4 className="font-medium">Learning Guide</h4>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <PanelRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Explore the {activeTab === 'rainforest' ? 'rainforest ecosystem' : 
                                   activeTab === 'ancient_rome' ? 'Roman Forum' : 
                                   'cellular structures'} to discover key learning points.
                    </p>
                    <div className="text-xs">
                      <div className="flex items-centre gap-1 text-primary">
                        <Map className="h-3 w-3" />
                        <span>Current location: {activeTab === 'rainforest' ? 'Canopy Level' : 
                                               activeTab === 'ancient_rome' ? 'Forum Centre' : 
                                               'Cytoplasm'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Coordinates display for debugging */}
                <div className="absolute bottom-2 left-2 text-xs text-white/50">
                  x: {Math.round(currentLocation.x)}, y: {Math.round(currentLocation.y)}
                </div>
              </div>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
                  <TabsTrigger value="interactive">Interactive Elements</TabsTrigger>
                  <TabsTrigger value="activities">Guided Activities</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-4">
                    <p>
                      {activeTab === 'rainforest' ? (
                        "The Amazon Rainforest immersive environment transports learners into the heart of the world's largest rainforest ecosystem. Students can explore different layers of the forest from the forest floor to the emergent layer, interact with diverse plant and animal species, and witness ecological processes in action."
                      ) : activeTab === 'ancient_rome' ? (
                        "Step back in time to Ancient Rome during the Republic era (509-27 BCE). This immersive environment recreates the architectural splendor, daily life, and political atmosphere of one of history's most influential civilizations. Students can walk the streets, enter buildings, and interact with historical figures."
                      ) : (
                        "Journey inside a human cell in this microscopic adventure that shrinks learners down to explore cellular structures and processes. Students can witness protein synthesis, energy production, and cellular communication in real-time, gaining an unprecedented understanding of the fundamental building blocks of life."
                      )}
                    </p>
                    
                    <p>
                      {activeTab === 'rainforest' ? (
                        "This environment integrates biology, ecology, geography, and environmental science concepts, allowing for cross-disciplinary learning experiences. Students can conduct virtual field research, collect data, and analyse ecosystem relationships through hands-on interaction."
                      ) : activeTab === 'ancient_rome' ? (
                        "This environment brings together history, politics, architecture, and cultural studies in an integrated learning experience. Students can participate in historical events, examine artifacts, and engage with the social structures and daily practices of Ancient Roman society."
                      ) : (
                        "This environment combines biology, chemistry, and physics to provide a comprehensive understanding of cellular function. Students can manipulate cellular components, trigger biological processes, and observe the molecular machinery that powers all living organisms."
                      )}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 flex items-centre">
                            <Users className="mr-2 h-4 w-4 text-primary" />
                            Target Age Groups
                          </h4>
                          <ul className="text-sm space-y-1">
                            {activeTab === 'rainforest' ? (
                              <>
                                <li>Key Stage 2 (Ages 7-11)</li>
                                <li>Key Stage 3 (Ages 11-14)</li>
                                <li>GCSE (Ages 14-16)</li>
                              </>
                            ) : activeTab === 'ancient_rome' ? (
                              <>
                                <li>Key Stage 2 (Ages 7-11)</li>
                                <li>Key Stage 3 (Ages 11-14)</li>
                                <li>GCSE (Ages 14-16)</li>
                              </>
                            ) : (
                              <>
                                <li>Key Stage 3 (Ages 11-14)</li>
                                <li>GCSE (Ages 14-16)</li>
                                <li>A-Level (Ages 16-18)</li>
                              </>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 flex items-centre">
                            <BookOpen className="mr-2 h-4 w-4 text-primary" />
                            Curriculum Links
                          </h4>
                          <ul className="text-sm space-y-1">
                            {activeTab === 'rainforest' ? (
                              <>
                                <li>Science: Ecosystems</li>
                                <li>Geography: Biomes</li>
                                <li>Environmental Studies</li>
                              </>
                            ) : activeTab === 'ancient_rome' ? (
                              <>
                                <li>History: Ancient Civilizations</li>
                                <li>Citizenship: Governance</li>
                                <li>Art & Architecture</li>
                              </>
                            ) : (
                              <>
                                <li>Biology: Cell Structure</li>
                                <li>Chemistry: Biochemistry</li>
                                <li>Physics: Energy Transfer</li>
                              </>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 flex items-centre">
                            <Layers className="mr-2 h-4 w-4 text-primary" />
                            Experience Type
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>Virtual Reality Compatible</li>
                            <li>Desktop/Tablet Mode</li>
                            <li>Multi-user Collaboration</li>
                            <li>Teacher-guided Options</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="objectives" className="mt-6">
                  <div className="space-y-4">
                    <p className="mb-4">
                      This immersive environment is designed to achieve the following learning objectives:
                    </p>
                    
                    <ul className="space-y-4">
                      {currentEnvironment.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p>{objective}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-muted/50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium mb-2">Assessment Opportunities</h4>
                      <p className="text-sm mb-3">
                        This environment includes embedded assessment opportunities that measure student progress toward these objectives:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li>• Interactive quizzes integrated into the environment</li>
                        <li>• Data collection and analysis tasks</li>
                        <li>• Problem-solving scenarios with multiple solution paths</li>
                        <li>• Collaborative challenges requiring application of knowledge</li>
                        <li>• Reflection prompts to encourage metacognition</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="interactive" className="mt-6">
                  <div className="space-y-4">
                    <p className="mb-4">
                      This environment features the following interactive elements that students can engage with:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentEnvironment.interactiveElements.map((element, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-centre">
                              <div className="mr-2 bg-primary/10 p-1 rounded-full">
                                <Sparkles className="h-4 w-4 text-primary" />
                              </div>
                              {element}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {activeTab === 'rainforest' ? (
                                index === 0 ? "Identify and learn about hundreds of plant and animal species through interactive 3D models." :
                                index === 1 ? "Manipulate environmental factors to see how they affect the rainforest ecosystem." :
                                index === 2 ? "Observe and interact with weather patterns and their impact on the rainforest." :
                                "Learn from indigenous knowledge systems about sustainable rainforest management."
                              ) : activeTab === 'ancient_rome' ? (
                                index === 0 ? "Participate in Senate debates on historical issues and see how your decisions affect Rome." :
                                index === 1 ? "Use Roman engineering tools to construct aqueducts, roads, and buildings." :
                                index === 2 ? "Engage in the Roman market economy, trading goods and managing resources." :
                                "Explore and interact with Roman technological innovations and their impact."
                              ) : (
                                index === 0 ? "Interact with cellular organelles to learn about their structures and functions." :
                                index === 1 ? "Watch and control the process of protein synthesis from DNA to functional protein." :
                                index === 2 ? "Explore energy production in mitochondria and track ATP through the cell." :
                                "Investigate how cells communicate through chemical signals and membrane receptors."
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium mb-2">Interaction Methods</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Direct manipulation</span>
                        </div>
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Voice commands</span>
                        </div>
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Gesture controls</span>
                        </div>
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Data collection tools</span>
                        </div>
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Simulation controls</span>
                        </div>
                        <div className="flex items-centre gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span>Collaborative tools</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activities" className="mt-6">
                  <div className="space-y-4">
                    <p className="mb-4">
                      Educators can guide students through these structured learning activities:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {currentEnvironment.guidedActivities.map((activity, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-centre">
                              <div className="mr-2 bg-primary/10 p-1 rounded-full">
                                <Compass className="h-4 w-4 text-primary" />
                              </div>
                              {activity}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {activeTab === 'rainforest' ? (
                                index === 0 ? "Guide students through the different layers of the rainforest canopy, from understory to emergent layer, exploring biodiversity at each level." :
                                index === 1 ? "Investigate the Amazon River system and its role in the rainforest ecosystem, collecting and analysing water samples and observing aquatic life." :
                                index === 2 ? "Create a detailed map of species interactions, including predator-prey relationships, symbiosis, and competition for resources." :
                                "Engage students in a conservation challenge where they must develop and test strategies to protect endangered species and habitats."
                              ) : activeTab === 'ancient_rome' ? (
                                index === 0 ? "Take students on a guided tour of the Roman Forum, exploring political institutions and their role in the Republic's governance." :
                                index === 1 ? "Challenge students to design and build a functioning Roman aqueduct, applying principles of engineering and hydraulics." :
                                index === 2 ? "Immerse students in Roman cultural traditions, including religious ceremonies, family life, and social customs." :
                                "Present students with key historical decision points and allow them to explore alternative outcomes to actual historical events."
                              ) : (
                                index === 0 ? "Guide students through the mitochondria to understand cellular respiration and energy production processes." :
                                index === 1 ? "Walk through the complete process of DNA transcription and translation, from gene to functional protein." :
                                index === 2 ? "Simulate a pathogen invasion and guide students through the cell's defense mechanisms and immune response." :
                                "Explore how cells communicate with each other through chemical signals, receptors, and response pathways."
                              )}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">30-45 minutes</Badge>
                              <Badge variant="outline">{index === 0 || index === 2 ? 'Individual/Group' : 'Small Groups'}</Badge>
                              <Badge variant="outline">{index === 3 ? 'Advanced' : index === 0 ? 'Introductory' : 'Intermediate'}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium mb-2">Teacher Resources</h4>
                      <p className="text-sm mb-3">
                        Each activity includes comprehensive teacher resources:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li>• Detailed lesson plans with timing suggestions</li>
                        <li>• Background knowledge briefings</li>
                        <li>• Differentiation strategies for diverse learners</li>
                        <li>• Assessment rubrics and student worksheets</li>
                        <li>• Extension activities for advanced exploration</li>
                        <li>• Technical guides for environment navigation</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multisensory Engagement</h3>
              <p className="text-muted-foreground">
                Our immersive environments engage multiple senses simultaneously through rich visuals, spatial audio, interactive elements, and even simulated physical sensations, creating deeper neural connections for enhanced learning and retention.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contextual Learning</h3>
              <p className="text-muted-foreground">
                Rather than learning facts in isolation, students discover knowledge in authentic contexts where it naturally applies, making abstract concepts concrete and demonstrating real-world relevance through direct experience.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Participation</h3>
              <p className="text-muted-foreground">
                Students become active participants rather than passive observers, making decisions, solving problems, and directly manipulating elements within the environment, fostering deeper engagement and promoting experiential learning.
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
                    <span className="font-medium">Enhanced Memory Formation</span>
                    <p className="text-sm text-muted-foreground">Multisensory experiences create stronger, more numerous neural connections, significantly improving long-term retention of information.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Increased Motivation</span>
                    <p className="text-sm text-muted-foreground">Immersive environments tap into intrinsic motivation through curiosity, agency, and the joy of discovery, reducing the need for external rewards.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Conceptual Understanding</span>
                    <p className="text-sm text-muted-foreground">Abstract concepts become tangible through direct experience, helping students develop deeper conceptual understanding rather than surface-level knowledge.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Emotional Connection</span>
                    <p className="text-sm text-muted-foreground">Immersive experiences create emotional connections to learning content, which neuroscience shows is crucial for effective memory formation and recall.</p>
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
                    <span className="font-medium">Expanded Teaching Possibilities</span>
                    <p className="text-sm text-muted-foreground">Teach concepts that are impossible to demonstrate in traditional classrooms due to scale, safety, cost, or physical limitations.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Differentiated Instruction</span>
                    <p className="text-sm text-muted-foreground">Easily adjust complexity levels, pacing, and support features to accommodate diverse learning needs within the same environment.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Rich Assessment Data</span>
                    <p className="text-sm text-muted-foreground">Gather detailed analytics on student interactions, decision-making processes, and problem-solving approaches for nuanced assessment.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Cross-Curricular Integration</span>
                    <p className="text-sm text-muted-foreground">Seamlessly integrate multiple subject areas within a single learning environment, supporting holistic and interdisciplinary approaches.</p>
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
