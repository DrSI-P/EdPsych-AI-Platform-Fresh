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
  Brain, 
  Activity, 
  LineChart, 
  BarChart, 
  Zap, 
  Gauge, 
  RefreshCw,
  Eye,
  Heart,
  Clock
} from 'lucide-react';

// Neuroscience-informed adaptive interface prototype
// This component demonstrates the concept of a UI that adapts based on cognitive state

interface CognitiveMetrics {
  attentionLevel: number;
  cognitiveLoad: number;
  fatigueLevel: number;
  engagementScore: number;
  stressLevel: number;
  timeOnTask: number;
}

export default function NeuroadaptiveInterfacePage() {
  const [metrics, setMetrics] = useState<CognitiveMetrics>({
    attentionLevel: 75,
    cognitiveLoad: 45,
    fatigueLevel: 30,
    engagementScore: 80,
    stressLevel: 35,
    timeOnTask: 15
  });
  
  const [adaptationEnabled, setAdaptationEnabled] = useState(true);
  const [interfaceMode, setInterfaceMode] = useState<'standard' | 'focused' | 'simplified'>('standard');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Simulate changing cognitive metrics over time
  useEffect(() => {
    if (!simulationRunning) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => {
        // Simulate natural fluctuations in cognitive metrics
        const newAttention = Math.max(10, Math.min(100, prev.attentionLevel + (Math.random() * 10 - 5)));
        const newLoad = Math.max(10, Math.min(100, prev.cognitiveLoad + (Math.random() * 8 - 3)));
        const newFatigue = Math.min(100, prev.fatigueLevel + (Math.random() * 2));
        const newEngagement = Math.max(10, Math.min(100, prev.engagementScore + (Math.random() * 10 - 5)));
        const newStress = Math.max(10, Math.min(100, prev.stressLevel + (Math.random() * 8 - 3)));
        const newTimeOnTask = prev.timeOnTask + (0.5 * simulationSpeed);
        
        return {
          attentionLevel: newAttention,
          cognitiveLoad: newLoad,
          fatigueLevel: newFatigue,
          engagementScore: newEngagement,
          stressLevel: newStress,
          timeOnTask: newTimeOnTask
        };
      });
    }, 2000 / simulationSpeed);
    
    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);
  
  // Determine interface mode based on cognitive metrics
  useEffect(() => {
    if (!adaptationEnabled) {
      setInterfaceMode('standard');
      return;
    }
    
    // Logic for adaptive interface changes
    if (metrics.cognitiveLoad > 70 || metrics.fatigueLevel > 60) {
      setInterfaceMode('simplified');
    } else if (metrics.attentionLevel < 40) {
      setInterfaceMode('focused');
    } else {
      setInterfaceMode('standard');
    }
  }, [metrics, adaptationEnabled]);
  
  // Reset simulation
  const handleReset = () => {
    setMetrics({
      attentionLevel: 75,
      cognitiveLoad: 45,
      fatigueLevel: 30,
      engagementScore: 80,
      stressLevel: 35,
      timeOnTask: 0
    });
  };
  
  // Get UI adaptation description
  const getAdaptationDescription = () => {
    switch (interfaceMode) {
      case 'focused':
        return "Attention enhancement mode activated. UI elements simplified, contrast increased, and distractions minimized to help regain focus.";
      case 'simplified':
        return "Cognitive load reduction mode activated. Content chunked into smaller units, visual complexity reduced, and optional elements hidden.";
      default:
        return "Standard interface mode. All features and content displayed with balanced visual complexity.";
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

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Neuroscience-Informed Adaptive Interface</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience a revolutionary interface that adapts in real-time to your cognitive state, optimising learning and reducing cognitive fatigue.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Cognitive Metrics Dashboard */}
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
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  Cognitive Metrics
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
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Eye className="mr-2 h-4 w-4" />
                      Attention Level
                    </Label>
                    <span className={getMetricColor(metrics.attentionLevel)}>
                      {Math.round(metrics.attentionLevel)}%
                    </span>
                  </div>
                  <Progress value={metrics.attentionLevel} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Brain className="mr-2 h-4 w-4" />
                      Cognitive Load
                    </Label>
                    <span className={getMetricColor(metrics.cognitiveLoad, true)}>
                      {Math.round(metrics.cognitiveLoad)}%
                    </span>
                  </div>
                  <Progress value={metrics.cognitiveLoad} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Clock className="mr-2 h-4 w-4" />
                      Fatigue Level
                    </Label>
                    <span className={getMetricColor(metrics.fatigueLevel, true)}>
                      {Math.round(metrics.fatigueLevel)}%
                    </span>
                  </div>
                  <Progress value={metrics.fatigueLevel} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Zap className="mr-2 h-4 w-4" />
                      Engagement Score
                    </Label>
                    <span className={getMetricColor(metrics.engagementScore)}>
                      {Math.round(metrics.engagementScore)}%
                    </span>
                  </div>
                  <Progress value={metrics.engagementScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-centre">
                      <Heart className="mr-2 h-4 w-4" />
                      Stress Level
                    </Label>
                    <span className={getMetricColor(metrics.stressLevel, true)}>
                      {Math.round(metrics.stressLevel)}%
                    </span>
                  </div>
                  <Progress value={metrics.stressLevel} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <Label>Time on Task</Label>
                    <span>{Math.round(metrics.timeOnTask)} minutes</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.timeOnTask > 30 ? 
                      "Consider taking a short break to maintain optimal cognitive performance." : 
                      "Cognitive performance is still in optimal range."}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-centre justify-between">
                  <Label htmlFor="adaptation-toggle" className="font-medium">
                    Adaptive Interface
                  </Label>
                  <Switch 
                    id="adaptation-toggle" 
                    checked={adaptationEnabled}
                    onCheckedChange={setAdaptationEnabled}
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

        {/* Adaptive Interface Demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-centre justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-centre">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Adaptive Learning Interface
                </h2>
                <div className="flex items-centre gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm">
                  <Gauge className="h-4 w-4" />
                  <span>Mode: {interfaceMode.charAt(0).toUpperCase() + interfaceMode.slice(1)}</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md mb-6">
                <p className="text-sm">{getAdaptationDescription()}</p>
              </div>
              
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Learning Content</TabsTrigger>
                  <TabsTrigger value="visualisation">Data Visualisation</TabsTrigger>
                  <TabsTrigger value="settings">Interface Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="mt-6 space-y-6">
                  {/* Content adapts based on interface mode */}
                  {interfaceMode === 'simplified' ? (
                    <div className="space-y-6">
                      <div className="bg-card p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold mb-4">Key Concept: Cognitive Load Theory</h3>
                        <p className="mb-4">Cognitive load theory suggests that learning happens best when information is presented in a way that doesn't overload working memory.</p>
                        <Button>Continue to Next Section</Button>
                      </div>
                      
                      <div className="text-centre text-sm text-muted-foreground">
                        <p>Content has been simplified to reduce cognitive load.</p>
                        <p>Additional details and examples are temporarily hidden.</p>
                      </div>
                    </div>
                  ) : interfaceMode === 'focused' ? (
                    <div className="space-y-6">
                      <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
                        <h3 className="text-xl font-semibold mb-4">Focus Point: Cognitive Load Theory</h3>
                        <p className="mb-4">Cognitive load theory suggests that learning happens best when information is presented in a way that doesn't overload working memory.</p>
                        <div className="flex justify-between">
                          <Button variant="outline">Previous</Button>
                          <Button>Next</Button>
                        </div>
                      </div>
                      
                      <div className="text-centre text-sm text-muted-foreground">
                        <p>Focus mode activated to help maintain attention.</p>
                        <p>Content is highlighted with increased contrast and reduced distractions.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-card p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold mb-4">Cognitive Load Theory</h3>
                        <p className="mb-4">Cognitive load theory suggests that learning happens best when information is presented in a way that doesn't overload working memory.</p>
                        <p className="mb-4">There are three types of cognitive load:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li><strong>Intrinsic load</strong> - the inherent difficulty of the material</li>
                          <li><strong>Extraneous load</strong> - the way information is presented</li>
                          <li><strong>Germane load</strong> - the mental effort needed for learning</li>
                        </ul>
                        <p className="mb-6">Effective instructional design aims to minimize extraneous load, manage intrinsic load, and optimise germane load.</p>
                        <div className="flex justify-between">
                          <Button variant="outline">Previous</Button>
                          <Button>Next</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-2">Related Concept</h4>
                          <p className="text-sm text-muted-foreground">Working Memory Capacity and Limitations</p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-2">Practical Application</h4>
                          <p className="text-sm text-muted-foreground">Designing Educational Materials with CLT</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="visualisation" className="mt-6">
                  <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg border">
                      <h3 className="text-xl font-semibold mb-4">Learning Analytics</h3>
                      
                      {interfaceMode === 'simplified' ? (
                        <div className="space-y-4">
                          <p className="mb-2">Simplified view showing key metrics only:</p>
                          <div className="h-[200px] bg-muted rounded-md flex items-centre justify-centre">
                            <BarChart className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Detailed charts temporarily hidden to reduce cognitive load.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between mb-2">
                            <span>Performance Over Time</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Daily</Button>
                              <Button variant="outline" size="sm">Weekly</Button>
                              <Button variant="outline" size="sm">Monthly</Button>
                            </div>
                          </div>
                          
                          <div className="h-[200px] bg-muted rounded-md flex items-centre justify-centre">
                            <LineChart className="h-12 w-12 text-muted-foreground" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-3 rounded-md">
                              <div className="text-sm font-medium">Completion Rate</div>
                              <div className="text-2xl font-bold">87%</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md">
                              <div className="text-sm font-medium">Avg. Score</div>
                              <div className="text-2xl font-bold">92/100</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md">
                              <div className="text-sm font-medium">Time Spent</div>
                              <div className="text-2xl font-bold">4.2 hrs</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg border">
                      <h3 className="text-xl font-semibold mb-4">Interface Preferences</h3>
                      
                      {interfaceMode === 'simplified' ? (
                        <div className="space-y-4">
                          <p className="mb-4">Essential settings only:</p>
                          
                          <div className="space-y-4">
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="text-size">Text Size</Label>
                              <Slider
                                id="text-size"
                                defaultValue={[16]}
                                max={24}
                                min={12}
                                step={1}
                                className="w-[180px]"
                              />
                            </div>
                            
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="notifications">Notifications</Label>
                              <Switch id="notifications" />
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">Advanced settings temporarily hidden to reduce cognitive load.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-medium">Display Settings</h4>
                              
                              <div className="space-y-4">
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="text-size">Text Size</Label>
                                  <Slider
                                    id="text-size"
                                    defaultValue={[16]}
                                    max={24}
                                    min={12}
                                    step={1}
                                    className="w-[180px]"
                                  />
                                </div>
                                
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="contrast">Contrast</Label>
                                  <Slider
                                    id="contrast"
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    className="w-[180px]"
                                  />
                                </div>
                                
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="animations">Animations</Label>
                                  <Switch id="animations" defaultChecked />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="font-medium">Notification Settings</h4>
                              
                              <div className="space-y-4">
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="notifications">Notifications</Label>
                                  <Switch id="notifications" defaultChecked />
                                </div>
                                
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="break-reminders">Break Reminders</Label>
                                  <Switch id="break-reminders" defaultChecked />
                                </div>
                                
                                <div className="flex items-centre justify-between">
                                  <Label htmlFor="progress-updates">Progress Updates</Label>
                                  <Switch id="progress-updates" defaultChecked />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-4">Cognitive Adaptation Settings</h4>
                            
                            <div className="space-y-4">
                              <div className="flex items-centre justify-between">
                                <Label htmlFor="auto-simplify">Auto-simplify on High Cognitive Load</Label>
                                <Switch id="auto-simplify" defaultChecked />
                              </div>
                              
                              <div className="flex items-centre justify-between">
                                <Label htmlFor="focus-mode">Focus Mode on Low Attention</Label>
                                <Switch id="focus-mode" defaultChecked />
                              </div>
                              
                              <div className="flex items-centre justify-between">
                                <Label htmlFor="break-suggestions">Break Suggestions</Label>
                                <Switch id="break-suggestions" defaultChecked />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cognitive State Monitoring</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyse webcam data to detect attention levels, cognitive load, and fatigue through micro-expressions, eye movements, and posture.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-muted-foreground">
                Our system processes cognitive metrics in real-time, identifying patterns and trends to determine optimal interface adaptations for your current state.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Adaptation</h3>
              <p className="text-muted-foreground">
                The interface automatically adjusts to optimise your learning experience, reducing cognitive load when needed and enhancing focus during attention dips.
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
                    <span className="font-medium">Reduced Cognitive Fatigue</span>
                    <p className="text-sm text-muted-foreground">Experience longer, more productive learning sessions with less mental exhaustion.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Improved Focus</span>
                    <p className="text-sm text-muted-foreground">Interface adaptations help maintain attention during challenging learning tasks.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Personalized Learning Pace</span>
                    <p className="text-sm text-muted-foreground">Content delivery adjusts to your cognitive state, ensuring optimal challenge levels.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Metacognitive Awareness</span>
                    <p className="text-sm text-muted-foreground">Gain insights into your cognitive patterns and develop better learning strategies.</p>
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
                    <span className="font-medium">Deeper Learning Insights</span>
                    <p className="text-sm text-muted-foreground">Access detailed cognitive metrics to understand student engagement and challenges.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Targeted Interventions</span>
                    <p className="text-sm text-muted-foreground">Identify when and where students struggle to provide timely support.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Content Optimization</span>
                    <p className="text-sm text-muted-foreground">Refine educational materials based on cognitive load patterns across students.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Inclusive Education</span>
                    <p className="text-sm text-muted-foreground">Support diverse learning needs with interfaces that adapt to individual cognitive profiles.</p>
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
