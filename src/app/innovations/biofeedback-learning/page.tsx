'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  Activity, 
  LineChart, 
  BarChart, 
  Zap, 
  Brain,
  RefreshCw,
  Gauge,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

// Integrated Biofeedback Learning System prototype
// This component demonstrates the concept of using biometric data to enhance learning experiences

interface BiometricData {
  heartRate: number;
  breathingRate: number;
  stressLevel: number;
  focusLevel: number;
  emotionalState: 'calm' | 'excited' | 'stressed' | 'engaged' | 'bored';
  energyLevel: number;
}

interface LearningMetrics {
  comprehensionRate: number;
  retentionScore: number;
  engagementLevel: number;
  flowStateFrequency: number;
  optimalChallengeZone: number;
}

export default function BiofeedbackLearningPage() {
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    breathingRate: 14,
    stressLevel: 35,
    focusLevel: 75,
    emotionalState: 'engaged',
    energyLevel: 70
  });
  
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
    comprehensionRate: 78,
    retentionScore: 65,
    engagementLevel: 82,
    flowStateFrequency: 45,
    optimalChallengeZone: 72
  });
  
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [biofeedbackEnabled, setBiofeedbackEnabled] = useState(true);
  const [currentRecommendation, setCurrentRecommendation] = useState('Your biometrics indicate optimal learning conditions. Continue with current activity.');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simulate changing biometric data over time
  useEffect(() => {
    if (!simulationRunning) return;
    
    const interval = setInterval(() => {
      setBiometrics(prev => {
        // Simulate natural fluctuations in biometric data
        const newHeartRate = Math.max(60, Math.min(100, prev.heartRate + (Math.random() * 6 - 3)));
        const newBreathingRate = Math.max(10, Math.min(20, prev.breathingRate + (Math.random() * 2 - 1)));
        const newStressLevel = Math.max(10, Math.min(90, prev.stressLevel + (Math.random() * 10 - 5)));
        const newFocusLevel = Math.max(30, Math.min(95, prev.focusLevel + (Math.random() * 8 - 4)));
        const newEnergyLevel = Math.max(20, Math.min(95, prev.energyLevel + (Math.random() * 6 - 3)));
        
        // Determine emotional state based on stress and focus
        let newEmotionalState: BiometricData['emotionalState'] = 'engaged';
        if (newStressLevel > 70 && newFocusLevel < 50) {
          newEmotionalState = 'stressed';
        } else if (newStressLevel < 30 && newFocusLevel < 40) {
          newEmotionalState = 'bored';
        } else if (newStressLevel < 40 && newFocusLevel > 70) {
          newEmotionalState = 'calm';
        } else if (newStressLevel > 50 && newFocusLevel > 70) {
          newEmotionalState = 'excited';
        }
        
        return {
          heartRate: newHeartRate,
          breathingRate: newBreathingRate,
          stressLevel: newStressLevel,
          focusLevel: newFocusLevel,
          emotionalState: newEmotionalState,
          energyLevel: newEnergyLevel
        };
      });
      
      // Update learning metrics based on biometrics
      setLearningMetrics(prev => {
        const focusImpact = (biometrics.focusLevel - 50) * 0.3;
        const stressImpact = (50 - biometrics.stressLevel) * 0.2;
        const energyImpact = (biometrics.energyLevel - 50) * 0.1;
        const overallImpact = (focusImpact + stressImpact + energyImpact) * simulationSpeed * 0.1;
        
        return {
          comprehensionRate: Math.max(10, Math.min(100, prev.comprehensionRate + overallImpact + (Math.random() * 4 - 2))),
          retentionScore: Math.max(10, Math.min(100, prev.retentionScore + overallImpact + (Math.random() * 4 - 2))),
          engagementLevel: Math.max(10, Math.min(100, prev.engagementLevel + overallImpact + (Math.random() * 6 - 3))),
          flowStateFrequency: Math.max(10, Math.min(100, prev.flowStateFrequency + overallImpact + (Math.random() * 4 - 2))),
          optimalChallengeZone: Math.max(10, Math.min(100, prev.optimalChallengeZone + overallImpact + (Math.random() * 4 - 2)))
        };
      });
      
      // Update recommendations based on biometrics
      if (biofeedbackEnabled) {
        updateRecommendations();
      }
    }, 2000 / simulationSpeed);
    
    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed, biometrics, biofeedbackEnabled]);
  
  // Reset simulation
  const handleReset = () => {
    setBiometrics({
      heartRate: 72,
      breathingRate: 14,
      stressLevel: 35,
      focusLevel: 75,
      emotionalState: 'engaged',
      energyLevel: 70
    });
    
    setLearningMetrics({
      comprehensionRate: 78,
      retentionScore: 65,
      engagementLevel: 82,
      flowStateFrequency: 45,
      optimalChallengeZone: 72
    });
  };
  
  // Update recommendations based on biometric data
  const updateRecommendations = () => {
    if (biometrics.stressLevel > 70) {
      setCurrentRecommendation('High stress detected. Consider a 2-minute breathing exercise to optimise learning conditions.');
    } else if (biometrics.focusLevel < 40) {
      setCurrentRecommendation('Focus levels dropping. Suggested interventions: short break, change of learning modality, or brief physical activity.');
    } else if (biometrics.energyLevel < 30) {
      setCurrentRecommendation('Energy levels low. Consider a short break, hydration, or switching to a more interactive learning activity.');
    } else if (biometrics.focusLevel > 80 && biometrics.stressLevel < 30) {
      setCurrentRecommendation('Optimal learning state detected. This is an excellent time for challenging material or complex problem-solving.');
    } else if (biometrics.emotionalState === 'bored') {
      setCurrentRecommendation('Engagement dropping. Recommended: increase challenge level or switch to a more interactive learning format.');
    } else {
      setCurrentRecommendation('Your biometrics indicate good learning conditions. Continue with current activity.');
    }
  };
  
  // Get colour for metrics
  const getMetricColor = (value: number, isInverse: boolean = false) => {
    if (isInverse) {
      if (value > 70) return "text-red-500";
      if (value > 50) return "text-amber-500";
      return "text-green-500";
    } else {
      if (value < 30) return "text-red-500";
      if (value < 50) return "text-amber-500";
      return "text-green-500";
    }
  };
  
  // Get emotional state emoji
  const getEmotionalStateEmoji = () => {
    switch(biometrics.emotionalState) {
      case 'calm': return '😌';
      case 'excited': return '😃';
      case 'stressed': return '😓';
      case 'engaged': return '🤔';
      case 'bored': return '😐';
      default: return '🤔';
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
        <h1 className="text-4xl font-bold tracking-tight">Integrated Biofeedback Learning System</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience a revolutionary learning environment that adapts to your physiological and emotional state in real-time, optimising conditions for maximum comprehension and retention.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Biometric Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-centre justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-centre">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Biometric Data
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-centre justify-between mb-4">
                  <div className="text-centre px-4 py-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold">{Math.round(biometrics.heartRate)}</div>
                    <div className="text-xs text-muted-foreground">BPM</div>
                  </div>
                  
                  <div className="text-centre px-4 py-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold">{Math.round(biometrics.breathingRate)}</div>
                    <div className="text-xs text-muted-foreground">Breaths/min</div>
                  </div>
                  
                  <div className="text-centre px-4 py-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold">{getEmotionalStateEmoji()}</div>
                    <div className="text-xs text-muted-foreground capitalize">{biometrics.emotionalState}</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Activity className="mr-2 h-4 w-4" />
                      Stress Level
                    </Label>
                    <span className={getMetricColor(biometrics.stressLevel, true)}>
                      {Math.round(biometrics.stressLevel)}%
                    </span>
                  </div>
                  <Progress value={biometrics.stressLevel} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Brain className="mr-2 h-4 w-4" />
                      Focus Level
                    </Label>
                    <span className={getMetricColor(biometrics.focusLevel)}>
                      {Math.round(biometrics.focusLevel)}%
                    </span>
                  </div>
                  <Progress value={biometrics.focusLevel} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Zap className="mr-2 h-4 w-4" />
                      Energy Level
                    </Label>
                    <span className={getMetricColor(biometrics.energyLevel)}>
                      {Math.round(biometrics.energyLevel)}%
                    </span>
                  </div>
                  <Progress value={biometrics.energyLevel} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-centre">
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Biofeedback Recommendation
                    </h3>
                    <p className="text-sm">{currentRecommendation}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-centre justify-between">
                  <Label htmlFor="biofeedback-toggle" className="font-medium">
                    Biofeedback Adaptation
                  </Label>
                  <Switch 
                    id="biofeedback-toggle" 
                    checked={biofeedbackEnabled}
                    onCheckedChange={setBiofeedbackEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="simulation-toggle" className="font-medium">
                    Simulation
                  </Label>
                  <div className="flex items-centre justify-between">
                    <Button 
                      variant={simulationRunning ? "destructive" : "default"}
                      size="sm"
                      onClick={() => setSimulationRunning(!simulationRunning)}
                    >
                      {simulationRunning ? "Stop" : "Start"} Simulation
                    </Button>
                    <div className="flex items-centre gap-2">
                      <Label htmlFor="speed-slider" className="text-sm">Speed</Label>
                      <Slider
                        id="speed-slider"
                        min={0.5}
                        max={3}
                        step={0.5}
                        value={[simulationSpeed]}
                        onValueChange={(value) => setSimulationSpeed(value[0])}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Metrics and Adaptive Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Learning Dashboard</TabsTrigger>
              <TabsTrigger value="content">Adaptive Content</TabsTrigger>
              <TabsTrigger value="exercises">Biofeedback Exercises</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <LineChart className="mr-2 h-5 w-5 text-primary" />
                    Learning Metrics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Comprehension Rate</Label>
                          <span className={getMetricColor(learningMetrics.comprehensionRate)}>
                            {Math.round(learningMetrics.comprehensionRate)}%
                          </span>
                        </div>
                        <Progress value={learningMetrics.comprehensionRate} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          How well you understand new concepts based on biometric indicators
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Retention Score</Label>
                          <span className={getMetricColor(learningMetrics.retentionScore)}>
                            {Math.round(learningMetrics.retentionScore)}%
                          </span>
                        </div>
                        <Progress value={learningMetrics.retentionScore} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Predicted long-term memory formation based on current physiological state
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Engagement Level</Label>
                          <span className={getMetricColor(learningMetrics.engagementLevel)}>
                            {Math.round(learningMetrics.engagementLevel)}%
                          </span>
                        </div>
                        <Progress value={learningMetrics.engagementLevel} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your current level of active participation and interest
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Flow State Frequency</Label>
                          <span className={getMetricColor(learningMetrics.flowStateFrequency)}>
                            {Math.round(learningMetrics.flowStateFrequency)}%
                          </span>
                        </div>
                        <Progress value={learningMetrics.flowStateFrequency} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          How often you enter the optimal state of focused immersion
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Optimal Challenge Zone</Label>
                          <span className={getMetricColor(learningMetrics.optimalChallengeZone)}>
                            {Math.round(learningMetrics.optimalChallengeZone)}%
                          </span>
                        </div>
                        <Progress value={learningMetrics.optimalChallengeZone} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          How well current content difficulty matches your physiological readiness
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-centre">
                          <Gauge className="mr-2 h-4 w-4 text-primary" />
                          Learning State Analysis
                        </h3>
                        <p className="text-sm">
                          {biometrics.focusLevel > 70 && biometrics.stressLevel < 40 ? 
                            "You're in an optimal learning state. Your focus is high and stress is low, creating ideal conditions for deep learning and retention." : 
                            biometrics.stressLevel > 70 ? 
                              "High stress is currently limiting your learning potential. Consider a brief relaxation exercise to optimise your physiological state." :
                              biometrics.focusLevel < 40 ?
                                "Your focus levels indicate potential for distraction. Consider a short break or switching to a different learning modality." :
                                "Your current physiological state is conducive to learning. Minor adjustments to stress or focus could further optimise your experience."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Biofeedback-Optimised Learning Path</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Optimal Study Times</h4>
                          <p className="text-sm text-muted-foreground mb-2">Based on your biometric patterns, your peak learning periods are:</p>
                          <ul className="text-sm space-y-1">
                            <li>9:00 AM - 11:30 AM</li>
                            <li>4:00 PM - 6:00 PM</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Content Modality</h4>
                          <p className="text-sm text-muted-foreground mb-2">Your current physiological state suggests these learning approaches:</p>
                          <ul className="text-sm space-y-1">
                            <li>Visual diagrams</li>
                            <li>Interactive simulations</li>
                            <li>Brief video explanations</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="overflow-hidden">
                        <div className="bg-primary/10 p-4">
                          <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Break Schedule</h4>
                          <p className="text-sm text-muted-foreground mb-2">Recommended break pattern based on your energy cycles:</p>
                          <ul className="text-sm space-y-1">
                            <li>25 min work / 5 min break</li>
                            <li>Deep breathing at 35 min intervals</li>
                            <li>Physical movement every 90 min</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    Biofeedback-Adaptive Content
                  </h2>
                  
                  <div className="mb-6 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      This content automatically adapts based on your real-time biometric data. The presentation style, complexity, and pace adjust to match your current physiological and cognitive state.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Content adapts based on biometric state */}
                    {biometrics.focusLevel < 50 ? (
                      <div className="space-y-4">
                        <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
                          <h3 className="text-xl font-semibold mb-4">Key Concept: Biofeedback in Learning</h3>
                          <div className="flex flex-col md:flex-row gap-6 items-centre mb-4">
                            <div className="bg-muted rounded-lg p-4 flex items-centre justify-centre w-full md:w-1/3 aspect-video">
                              <Activity className="h-12 w-12 text-primary/50" />
                            </div>
                            <div className="w-full md:w-2/3">
                              <p className="mb-4">Biofeedback uses real-time physiological data to help you understand and control your body's responses.</p>
                              <p className="font-medium">In learning, this means:</p>
                              <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Recognising when you're in an optimal state for learning</li>
                                <li>Identifying when stress or fatigue are affecting comprehension</li>
                                <li>Learning to self-regulate for better focus and retention</li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline">Previous</Button>
                            <Button>Next</Button>
                          </div>
                        </div>
                        
                        <div className="text-centre text-sm text-muted-foreground">
                          <p>Content has been simplified and made more visual based on your current focus levels.</p>
                          <p>Interactive elements have been increased to boost engagement.</p>
                        </div>
                      </div>
                    ) : biometrics.stressLevel > 70 ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Calming Learning Environment</h3>
                          <p className="mb-4">Let's take a gentle approach to understanding biofeedback in learning.</p>
                          <p className="mb-4">Biofeedback is simply a way to understand how your body responds during learning. By measuring things like heart rate and breathing, we can find the best ways for you to learn.</p>
                          <p className="mb-4">Take a moment to breathe deeply as you read this. Notice how your thoughts become clearer with each breath.</p>
                          <div className="flex justify-between">
                            <Button variant="outline">Previous</Button>
                            <Button>Next</Button>
                          </div>
                        </div>
                        
                        <div className="text-centre text-sm text-muted-foreground">
                          <p>Content has been adjusted to reduce cognitive load based on your current stress levels.</p>
                          <p>Calming colour scheme and simplified language have been applied.</p>
                        </div>
                      </div>
                    ) : biometrics.energyLevel < 40 ? (
                      <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-300">Energizing Learning Session</h3>
                          <p className="mb-4">Let's explore biofeedback with some engaging activities!</p>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-2">Quick Challenge:</h4>
                            <div className="bg-white dark:bg-black/20 p-4 rounded-lg">
                              <p className="mb-2">Match these biometric signals to their effects on learning:</p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>1. Increased heart rate</div>
                                <div>A. May indicate deep focus</div>
                                <div>2. Slow, deep breathing</div>
                                <div>B. Often signals stress or excitement</div>
                                <div>3. Reduced movement</div>
                                <div>C. Typically indicates relaxation</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button variant="outline">Previous</Button>
                            <Button>Next</Button>
                          </div>
                        </div>
                        
                        <div className="text-centre text-sm text-muted-foreground">
                          <p>Content has been made more interactive and engaging based on your current energy levels.</p>
                          <p>Stimulating colors and interactive elements have been added.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-card p-6 rounded-lg border">
                          <h3 className="text-xl font-semibold mb-4">Biofeedback in Educational Contexts</h3>
                          <p className="mb-4">Biofeedback represents a significant advancement in educational technology, offering real-time physiological data that can be used to optimise learning experiences. By monitoring metrics such as heart rate variability, skin conductance, breathing patterns, and even subtle facial expressions, biofeedback systems can determine a learner's cognitive and emotional state.</p>
                          
                          <h4 className="font-medium mt-6 mb-3">Key Applications in Education:</h4>
                          <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>Cognitive Load Management</strong> - Detecting when a student is approaching cognitive overload and adjusting content complexity accordingly</li>
                            <li><strong>Attention Optimization</strong> - Identifying attention fluctuations and implementing interventions to restore focus</li>
                            <li><strong>Emotional Regulation</strong> - Recognising emotional states that inhibit learning (anxiety, frustration) and providing appropriate support</li>
                            <li><strong>Flow State Facilitation</strong> - Creating conditions that promote the optimal state of engaged concentration</li>
                            <li><strong>Metacognitive Development</strong> - Helping learners understand their own physiological responses to different learning activities</li>
                          </ul>
                          
                          <p className="mb-6">Research indicates that students who learn in biofeedback-enhanced environments demonstrate improved retention rates, higher engagement levels, and more effective self-regulation strategies. The integration of biofeedback with adaptive learning algorithms creates a powerful system that continuously optimizes the learning experience based on the individual's current state.</p>
                          
                          <div className="flex justify-between">
                            <Button variant="outline">Previous</Button>
                            <Button>Next</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exercises" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Biofeedback Exercises
                  </h2>
                  
                  <div className="mb-6 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      These exercises are designed to help you regulate your physiological state for optimal learning. Each exercise is recommended based on your current biometric data.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {biometrics.stressLevel > 60 ? (
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Recommended: Stress Reduction</h3>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">4-7-8 Breathing Exercise</h4>
                          <div className="bg-white dark:bg-black/20 p-4 rounded-lg mb-4">
                            <ol className="space-y-2">
                              <li>1. Sit comfortably with your back straight</li>
                              <li>2. Inhale quietly through your nose for 4 seconds</li>
                              <li>3. Hold your breath for 7 seconds</li>
                              <li>4. Exhale completely through your mouth for 8 seconds</li>
                              <li>5. Repeat this cycle 4 times</li>
                            </ol>
                          </div>
                          <p className="text-sm text-muted-foreground">This exercise activates your parasympathetic nervous system, reducing stress hormones and creating an optimal state for learning and memory formation.</p>
                        </div>
                        
                        <Button className="w-full">
                          Start Guided Breathing Exercise
                        </Button>
                      </div>
                    ) : biometrics.focusLevel < 50 ? (
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-300">Recommended: Focus Enhancement</h3>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Attention Anchoring Exercise</h4>
                          <div className="bg-white dark:bg-black/20 p-4 rounded-lg mb-4">
                            <ol className="space-y-2">
                              <li>1. Choose a small object to focus on (a pen, paperclip, etc.)</li>
                              <li>2. Examine it in detail for 30 seconds, noting colour, texture, shape</li>
                              <li>3. Close your eyes and visualise the object for 30 seconds</li>
                              <li>4. Open your eyes and compare your visualisation to the actual object</li>
                              <li>5. Repeat once more, then return to your learning task</li>
                            </ol>
                          </div>
                          <p className="text-sm text-muted-foreground">This exercise trains your attention networks and primes your brain for focused learning. It's particularly effective when concentration is waning.</p>
                        </div>
                        
                        <Button className="w-full">
                          Start Guided Focus Exercise
                        </Button>
                      </div>
                    ) : biometrics.energyLevel < 40 ? (
                      <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Recommended: Energy Boost</h3>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Energizing Movement Sequence</h4>
                          <div className="bg-white dark:bg-black/20 p-4 rounded-lg mb-4">
                            <ol className="space-y-2">
                              <li>1. Stand up and stretch your arms overhead for 10 seconds</li>
                              <li>2. Perform 10 jumping jacks or march in place for 30 seconds</li>
                              <li>3. Roll your shoulders backward 5 times, then forward 5 times</li>
                              <li>4. Take 5 deep breaths, inhaling through nose and exhaling through mouth</li>
                              <li>5. Gently tap your fingertips over your scalp, face, shoulders, and arms</li>
                            </ol>
                          </div>
                          <p className="text-sm text-muted-foreground">This sequence increases blood flow and oxygen to the brain, releases energy-boosting endorphins, and stimulates your nervous system for improved alertness.</p>
                        </div>
                        
                        <Button className="w-full">
                          Start Guided Movement Sequence
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Recommended: Flow State Enhancement</h3>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Optimal State Maintenance</h4>
                          <div className="bg-white dark:bg-black/20 p-4 rounded-lg mb-4">
                            <p className="mb-2">Your biometrics indicate you're in an excellent state for learning. To maintain this optimal state:</p>
                            <ol className="space-y-2">
                              <li>1. Continue your current activity for 25-30 minutes</li>
                              <li>2. Take a short 3-5 minute break when you complete your current section</li>
                              <li>3. Hydrate during your break</li>
                              <li>4. Consider tackling more challenging material while in this optimal state</li>
                              <li>5. Check in with your body every 15 minutes to maintain awareness</li>
                            </ol>
                          </div>
                          <p className="text-sm text-muted-foreground">Your current physiological state is ideal for deep learning and memory formation. These recommendations will help you maintain this state and maximize its benefits.</p>
                        </div>
                        
                        <Button className="w-full">
                          Set Flow State Timer (25 min)
                        </Button>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-medium mt-8 mb-4">Additional Exercises</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Heart Rate Variability Training</h4>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Learn to control your heart rhythm patterns for improved cognitive function and emotional regulation.
                          </p>
                          <div className="text-xs text-muted-foreground">Duration: 5 minutes</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Mindful Awareness Scan</h4>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            A guided body scan that enhances interoceptive awareness and cognitive presence.
                          </p>
                          <div className="text-xs text-muted-foreground">Duration: 3 minutes</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Cognitive Refresh Technique</h4>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            A quick mental exercise that clears working memory and prepares your brain for new information.
                          </p>
                          <div className="text-xs text-muted-foreground">Duration: 2 minutes</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Binaural Beat Session</h4>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Audio entrainment that synchronizes brainwaves to optimal frequencies for learning and memory.
                          </p>
                          <div className="text-xs text-muted-foreground">Duration: 10 minutes</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Biometric Monitoring</h3>
              <p className="text-muted-foreground">
                Advanced sensors track key physiological indicators including heart rate variability, breathing patterns, subtle facial expressions, and other biomarkers of cognitive and emotional states.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cognitive State Analysis</h3>
              <p className="text-muted-foreground">
                Sophisticated algorithms interpret your biometric data to determine your current cognitive state, including attention levels, emotional engagement, and physiological readiness for learning.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Optimization</h3>
              <p className="text-muted-foreground">
                The learning environment automatically adjusts to your physiological state, optimising content presentation, difficulty level, and learning modalities to match your current cognitive capacity.
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
                    <span className="font-medium">Enhanced Learning Efficiency</span>
                    <p className="text-sm text-muted-foreground">Learn more effectively by studying when your body and mind are in optimal states for information processing.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Reduced Cognitive Fatigue</span>
                    <p className="text-sm text-muted-foreground">Prevent mental exhaustion through early detection of fatigue markers and timely interventions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Self-Regulation Skills</span>
                    <p className="text-sm text-muted-foreground">Develop the ability to recognise and control your physiological states for improved learning and performance.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Personalized Learning Experience</span>
                    <p className="text-sm text-muted-foreground">Receive content that adapts in real-time to your current physiological and cognitive state.</p>
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
                    <span className="font-medium">Objective Learning Metrics</span>
                    <p className="text-sm text-muted-foreground">Access physiological data that provides objective insights into student engagement and comprehension.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Early Intervention</span>
                    <p className="text-sm text-muted-foreground">Identify students experiencing stress, confusion, or disengagement before it affects learning outcomes.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Content Effectiveness Analysis</span>
                    <p className="text-sm text-muted-foreground">Evaluate which learning materials and approaches generate optimal physiological responses across students.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Evidence-Based Teaching</span>
                    <p className="text-sm text-muted-foreground">Ground pedagogical decisions in objective physiological data rather than subjective assessments alone.</p>
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
