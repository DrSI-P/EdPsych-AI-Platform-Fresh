'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { 
  Clock, 
  LineChart, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Gauge,
  Zap,
  BarChart3,
  FastForward,
  Calendar,
  Award,
  AlertCircle
} from "lucide-react";

interface ProgressPacingEngineProps {
  studentId?: string;
  curriculumId?: string;
  subject?: string;
  keyStage?: string;
  initialPacingData?;
  onPacingAdjusted?: (adjustedPacing) => void;
  className?: string;
}

export default function ProgressPacingEngine({
  studentId,
  curriculumId,
  subject = '',
  keyStage = '',
  initialPacingData,
  onPacingAdjusted,
  className
}: ProgressPacingEngineProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [pacingData, setPacingData] = useState<any>(initialPacingData || null);
  const [activeTab, setActiveTab] = useState('current');
  const [settings, setSettings] = useState({
    baselinePace: 50,
    adaptToProgress: true,
    includeReinforcementActivities: true,
    includeAccelerationOptions: true,
    considerLearningStyle: true,
    adaptationStrength: 70,
    autoAssessMastery: true,
    enableBreakpoints: true
  });
  const [progressMetrics, setProgressMetrics] = useState<any>(null);
  
  // Fetch student progress data if available
  useEffect(() => {
    if (studentId) {
      fetchProgressData(studentId, curriculumId);
    }
  }, [studentId, curriculumId]);
  
  const fetchProgressData = async (studentId: string, curriculumId?: string) => {
    try {
      const response = await fetch(`/api/ai/student-progress?studentId=${studentId}${curriculumId ? `&curriculumId=${curriculumId}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setProgressMetrics(data.progressMetrics);
        
        // Auto-adjust baseline pace based on progress if enabled
        if (settings.adaptToProgress && data.progressMetrics?.recommendedPace) {
          setSettings(prev => ({
            ...prev,
            baselinePace: data.progressMetrics.recommendedPace
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const adjustPacing = async () => {
    if (!studentId && !curriculumId) {
      toast({
        title: "Missing information",
        description: "Please provide student ID or curriculum ID.",
        variant: "destructive"
      });
      return;
    }

    setIsAdjusting(true);

    try {
      const response = await fetch('/api/ai/progress-pacing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          curriculumId,
          subject,
          keyStage,
          settings,
          progressMetrics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adjust learning pace');
      }

      const data = await response.json();
      setPacingData(data.pacingData);
      
      if (onPacingAdjusted) {
        onPacingAdjusted(data.pacingData);
      }

      toast({
        title: "Pacing adjusted",
        description: "Learning pace has been successfully adjusted based on student progress.",
      });
      
      // Switch to adjusted pacing tab
      setActiveTab('adjusted');
    } catch (error) {
      console.error('Error adjusting pacing:', error);
      toast({
        title: "Adjustment failed",
        description: "Failed to adjust learning pace. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdjusting(false);
    }
  };
  
  const getPaceLevelDescription = (level: number) => {
    if (level < 20) return "Very Gradual";
    if (level < 40) return "Gradual";
    if (level < 60) return "Moderate";
    if (level < 80) return "Accelerated";
    return "Highly Accelerated";
  };
  
  const getPaceBadgeColor = (level: number) => {
    if (level < 20) return "bg-blue-50 text-blue-700 border-blue-200";
    if (level < 40) return "bg-green-50 text-green-700 border-green-200";
    if (level < 60) return "bg-purple-50 text-purple-700 border-purple-200";
    if (level < 80) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };
  
  const renderProgressMetrics = () => {
    if (!progressMetrics) return null;
    
    return (
      <div className="space-y-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-centre justify-between">
          <h3 className="text-sm font-medium flex items-centre gap-2">
            <LineChart className="h-4 w-4 text-blue-600" />
            Student Progress Metrics
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Auto-detected
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Learning Velocity</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.learningVelocity}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.learningVelocity}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mastery Level</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.masteryLevel}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.masteryLevel}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Engagement Consistency</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.engagementConsistency}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.engagementConsistency}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Knowledge Retention</p>
            <div className="flex items-centre gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${progressMetrics.knowledgeRetention}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{progressMetrics.knowledgeRetention}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-centre justify-between pt-2 border-t">
          <div className="flex items-centre gap-2">
            <Gauge className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Recommended Pace</span>
          </div>
          <Badge variant="outline" className={getPaceBadgeColor(progressMetrics.recommendedPace)}>
            {progressMetrics.recommendedPace}% - {getPaceLevelDescription(progressMetrics.recommendedPace)}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-centre justify-between">
            <div className="flex items-centre gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Progress-Adaptive Pacing
            </div>
          </CardTitle>
          <CardDescription>
            Automatically adjust learning pace based on individual student progress
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {renderProgressMetrics()}
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <label className="text-sm font-medium">Baseline Pace Level</label>
                <span className="text-xs text-muted-foreground">
                  {settings.baselinePace}% - {getPaceLevelDescription(settings.baselinePace)}
                </span>
              </div>
              <Slider 
                value={[settings.baselinePace]} 
                min={10} 
                max={90} 
                step={10}
                onValueChange={(value) => setSettings({...settings, baselinePace: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the slider to set the baseline pace for learning progression
              </p>
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Adapt to Progress Data</label>
                <p className="text-xs text-muted-foreground">
                  Automatically adjust pace based on student progress
                </p>
              </div>
              <Switch 
                checked={settings.adaptToProgress}
                onCheckedChange={(checked) => setSettings({...settings, adaptToProgress: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Reinforcement Activities</label>
                <p className="text-xs text-muted-foreground">
                  Add activities to reinforce concepts when needed
                </p>
              </div>
              <Switch 
                checked={settings.includeReinforcementActivities}
                onCheckedChange={(checked) => setSettings({...settings, includeReinforcementActivities: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Include Acceleration Options</label>
                <p className="text-xs text-muted-foreground">
                  Add options to accelerate for advanced learners
                </p>
              </div>
              <Switch 
                checked={settings.includeAccelerationOptions}
                onCheckedChange={(checked) => setSettings({...settings, includeAccelerationOptions: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Consider Learning Style</label>
                <p className="text-xs text-muted-foreground">
                  Adjust pacing based on learning style preferences
                </p>
              </div>
              <Switch 
                checked={settings.considerLearningStyle}
                onCheckedChange={(checked) => setSettings({...settings, considerLearningStyle: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <label className="text-sm font-medium">Adaptation Strength</label>
                <span className="text-xs text-muted-foreground">
                  {settings.adaptationStrength}%
                </span>
              </div>
              <Slider 
                value={[settings.adaptationStrength]} 
                min={10} 
                max={100} 
                step={10}
                onValueChange={(value) => setSettings({...settings, adaptationStrength: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Higher values create more significant changes to the standard pacing
              </p>
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Assess Mastery</label>
                <p className="text-xs text-muted-foreground">
                  Include mastery checks to verify readiness to progress
                </p>
              </div>
              <Switch 
                checked={settings.autoAssessMastery}
                onCheckedChange={(checked) => setSettings({...settings, autoAssessMastery: checked})}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Enable Breakpoints</label>
                <p className="text-xs text-muted-foreground">
                  Add strategic pauses for reflection and consolidation
                </p>
              </div>
              <Switch 
                checked={settings.enableBreakpoints}
                onCheckedChange={(checked) => setSettings({...settings, enableBreakpoints: checked})}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-centre text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> 
            Evidence-based pacing adjustment
          </div>
          <Button 
            onClick={adjustPacing} 
            disabled={isAdjusting}
            className="flex items-centre gap-1"
          >
            {isAdjusting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Adjusting...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Adjust Pacing
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAdjusting && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-centre justify-centre space-y-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <div className="text-centre">
                <h3 className="text-lg font-medium">Adjusting Learning Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Adapting learning pace to the student's progress...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {pacingData && !isAdjusting && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Pace Comparison</CardTitle>
            <CardDescription>
              Compare standard and adjusted learning pacing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current Pacing</TabsTrigger>
                <TabsTrigger value="adjusted">Adjusted Pacing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="space-y-4 pt-4">
                {pacingData.currentPacing ? (
                  <>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Standard Pace</span>
                      </div>
                      <Badge variant="outline" className="bg-slate-50">
                        {pacingData.currentPacing.paceLevel}% - {getPaceLevelDescription(pacingData.currentPacing.paceLevel)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Estimated Timeline</h4>
                      <div className="space-y-2">
                        {pacingData.currentPacing.timeline.map((item, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-2 border rounded-md">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-centre justify-centre shrink-0">
                              <span className="text-xs">{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.topic}</p>
                              <div className="flex items-centre gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Completion Projection</h4>
                      <div className="p-3 bg-slate-50 rounded-md">
                        <div className="flex items-centre justify-between mb-2">
                          <span className="text-sm">Estimated completion:</span>
                          <span className="font-medium">{pacingData.currentPacing.estimatedCompletion}</span>
                        </div>
                        <div className="flex items-centre justify-between">
                          <span className="text-sm">Total learning hours:</span>
                          <span className="font-medium">{pacingData.currentPacing.totalHours} hours</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="adjusted" className="space-y-4 pt-4">
                {pacingData.adjustedPacing ? (
                  <>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Adaptive Pace</span>
                      </div>
                      <Badge variant="outline" className={getPaceBadgeColor(pacingData.adjustedPacing.paceLevel)}>
                        {pacingData.adjustedPacing.paceLevel}% - {getPaceLevelDescription(pacingData.adjustedPacing.paceLevel)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-centre justify-between">
                        <h4 className="text-sm font-medium">Optimized Timeline</h4>
                        {pacingData.adjustedPacing.timeReduction > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {pacingData.adjustedPacing.timeReduction}% faster
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {pacingData.adjustedPacing.timeline.map((item, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-2 border rounded-md">
                            <div className={`h-6 w-6 rounded-full flex items-centre justify-centre shrink-0 ${
                              item.optimized ? 'bg-amber-50 text-amber-700' : 'bg-slate-100'
                            }`}>
                              <span className="text-xs">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-centre justify-between">
                                <p className="text-sm font-medium">{item.topic}</p>
                                {item.optimized && (
                                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                    Optimized
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-centre gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.duration}</span>
                                {item.durationChange && (
                                  <span className="text-xs text-green-600">
                                    ({item.durationChange > 0 ? '+' : ''}{item.durationChange}%)
                                  </span>
                                )}
                              </div>
                              {item.adaptations && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  <span className="font-medium text-primary">Adaptations: </span>
                                  {item.adaptations}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Optimized Projection</h4>
                      <div className="p-3 bg-amber-50 rounded-md">
                        <div className="flex items-centre justify-between mb-2">
                          <span className="text-sm">Estimated completion:</span>
                          <div className="flex items-centre gap-2">
                            <span className="font-medium">{pacingData.adjustedPacing.estimatedCompletion}</span>
                            {pacingData.adjustedPacing.completionDifference && (
                              <span className="text-xs text-green-600">
                                ({pacingData.adjustedPacing.completionDifference} earlier)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-centre justify-between">
                          <span className="text-sm">Total learning hours:</span>
                          <div className="flex items-centre gap-2">
                            <span className="font-medium">{pacingData.adjustedPacing.totalHours} hours</span>
                            {pacingData.adjustedPacing.hoursDifference && (
                              <span className="text-xs text-green-600">
                                ({pacingData.adjustedPacing.hoursDifference} hours saved)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Key Adaptations</h4>
                      <div className="space-y-2">
                        {pacingData.adjustedPacing.keyAdaptations?.map((adaptation: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm">{adaptation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => setPacingData(null)}>
              Reset
            </Button>
            <Button className="flex items-centre gap-1">
              <FastForward className="h-4 w-4" />
              Apply Pacing
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">About Progress-Adaptive Pacing</h4>
            <p className="text-sm text-blue-700">
              This feature uses AI to analyze student progress data and automatically adjust the learning pace to optimize engagement and knowledge retention. The system considers learning velocity, mastery levels, and engagement patterns to create a personalized learning timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
