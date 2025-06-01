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
  Brain, 
  Users, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Layers,
  Zap,
  BarChart4,
  Lightbulb
} from "lucide-react";

interface CurriculumDifferentiationEngineProps {
  curriculumPlanId?: string;
  curriculumContent?: string;
  objectives?: string[];
  subject?: string;
  keyStage?: string;
  year?: string;
  onDifferentiationGenerated?: (differentiatedContent: any) => void;
  className?: string;
}

export default function CurriculumDifferentiationEngine({
  curriculumPlanId,
  curriculumContent = '',
  objectives = [],
  subject = '',
  keyStage = '',
  year = '',
  onDifferentiationGenerated,
  className
}: CurriculumDifferentiationEngineProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [differentiatedContent, setDifferentiatedContent] = useState<any>(null);
  const [learningProfiles, setLearningProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [settings, setSettings] = useState({
    adaptToLearningStyle: true,
    considerPriorKnowledge: true,
    includeExtensionActivities: true,
    includeScaffolding: true,
    differentiationLevel: 70,
    includeAllLearningStyles: false
  });
  const [activeTab, setActiveTab] = useState('visual');

  // Fetch learning profiles
  useEffect(() => {
    const fetchLearningProfiles = async () => {
      try {
        const response = await fetch('/api/ai/learning-style/profiles');
        if (response.ok) {
          const data = await response.json();
          setLearningProfiles(data.profiles || []);
          
          // Set default selected profile if available
          if (data.profiles && data.profiles.length > 0) {
            setSelectedProfile(data.profiles[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching learning profiles:', error);
      }
    };

    fetchLearningProfiles();
  }, []);

  const generateDifferentiation = async () => {
    if (!curriculumContent && !curriculumPlanId) {
      toast({
        title: "Missing curriculum content",
        description: "Please provide curriculum content or select a curriculum plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Get selected profile details if a profile is selected
      let profileDetails = null;
      if (selectedProfile && !settings.includeAllLearningStyles) {
        const selectedProfileData = learningProfiles.find(p => p.id === selectedProfile);
        if (selectedProfileData) {
          profileDetails = {
            primaryStyle: selectedProfileData.primaryStyle,
            secondaryStyle: selectedProfileData.secondaryStyle,
            visualScore: selectedProfileData.visualScore,
            auditoryScore: selectedProfileData.auditoryScore,
            kinestheticScore: selectedProfileData.kinestheticScore,
            readingWritingScore: selectedProfileData.readingWritingScore
          };
        }
      }

      const response = await fetch('/api/ai/curriculum-differentiation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curriculumPlanId,
          curriculumContent,
          objectives,
          subject,
          keyStage,
          year,
          settings: {
            ...settings,
            learningProfile: profileDetails
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate differentiated curriculum');
      }

      const data = await response.json();
      setDifferentiatedContent(data.differentiatedContent);
      
      if (onDifferentiationGenerated) {
        onDifferentiationGenerated(data.differentiatedContent);
      }

      toast({
        title: "Differentiation generated",
        description: "Curriculum has been successfully differentiated based on learning needs.",
      });
    } catch (error) {
      console.error('Error generating differentiation:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate differentiated curriculum. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderLearningStyleContent = (style: string) => {
    if (!differentiatedContent) return null;
    
    const contentMap: {[key: string]: any} = {
      visual: differentiatedContent.visual,
      auditory: differentiatedContent.auditory,
      kinesthetic: differentiatedContent.kinesthetic,
      readingWriting: differentiatedContent.readingWriting
    };
    
    const content = contentMap[style];
    if (!content) return <p>No content available for this learning style.</p>;
    
    return (
      <div className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h3>Learning Objectives</h3>
          <ul>
            {content.objectives.map((objective: string, index: number) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
          
          <h3>Core Content</h3>
          <div dangerouslySetInnerHTML={{ __html: content.coreContent }} />
          
          <h3>Activities</h3>
          <ul>
            {content.activities.map((activity: string, index: number) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          
          {content.scaffolding && (
            <>
              <h3>Scaffolding Support</h3>
              <ul>
                {content.scaffolding.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
          
          {content.extensionActivities && (
            <>
              <h3>Extension Activities</h3>
              <ul>
                {content.extensionActivities.map((activity: string, index: number) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </>
          )}
          
          {content.assessmentStrategies && (
            <>
              <h3>Assessment Strategies</h3>
              <ul>
                {content.assessmentStrategies.map((strategy: string, index: number) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </>
          )}
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
              <Brain className="h-5 w-5 text-primary" />
              AI Curriculum Differentiation
            </div>
          </CardTitle>
          <CardDescription>
            Automatically adapt curriculum content to meet diverse learning needs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {learningProfiles.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-centre justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Differentiate for all learning styles</label>
                  <p className="text-xs text-muted-foreground">
                    Generate adaptations for visual, auditory, kinesthetic, and reading/writing learners
                  </p>
                </div>
                <Switch 
                  checked={settings.includeAllLearningStyles}
                  onCheckedChange={(checked) => setSettings({...settings, includeAllLearningStyles: checked})}
                />
              </div>
              
              {!settings.includeAllLearningStyles && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Learning Profile</label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    disabled={settings.includeAllLearningStyles}
                  >
                    {learningProfiles.map(profile => (
                      <option key={profile.id} value={profile.id}>
                        {profile.user?.name || 'Unknown'} - {profile.primaryStyle} ({new Date(profile.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Differentiation Settings</h3>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Learning Style Adaptation</label>
                    <p className="text-xs text-muted-foreground">
                      Adapt content based on learning style preferences
                    </p>
                  </div>
                  <Switch 
                    checked={settings.adaptToLearningStyle}
                    onCheckedChange={(checked) => setSettings({...settings, adaptToLearningStyle: checked})}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Prior Knowledge Consideration</label>
                    <p className="text-xs text-muted-foreground">
                      Adjust content based on existing knowledge and skills
                    </p>
                  </div>
                  <Switch 
                    checked={settings.considerPriorKnowledge}
                    onCheckedChange={(checked) => setSettings({...settings, considerPriorKnowledge: checked})}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Include Extension Activities</label>
                    <p className="text-xs text-muted-foreground">
                      Add challenging activities for advanced learners
                    </p>
                  </div>
                  <Switch 
                    checked={settings.includeExtensionActivities}
                    onCheckedChange={(checked) => setSettings({...settings, includeExtensionActivities: checked})}
                  />
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Include Scaffolding</label>
                    <p className="text-xs text-muted-foreground">
                      Add support structures for learners who need additional help
                    </p>
                  </div>
                  <Switch 
                    checked={settings.includeScaffolding}
                    onCheckedChange={(checked) => setSettings({...settings, includeScaffolding: checked})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <label className="text-sm font-medium">Differentiation Level</label>
                    <span className="text-xs text-muted-foreground">
                      {settings.differentiationLevel}%
                    </span>
                  </div>
                  <Slider 
                    value={[settings.differentiationLevel]} 
                    min={10} 
                    max={100} 
                    step={10}
                    onValueChange={(value) => setSettings({...settings, differentiationLevel: value[0]})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values create more significant adaptations to the original content
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-centre text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3 mr-1" /> 
            AI-powered differentiation
          </div>
          <Button 
            onClick={generateDifferentiation} 
            disabled={isGenerating || (!curriculumContent && !curriculumPlanId)}
            className="flex items-centre gap-1"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Differentiation
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isGenerating && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-centre justify-centre space-y-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <div className="text-centre">
                <h3 className="text-lg font-medium">Generating Differentiated Curriculum</h3>
                <p className="text-sm text-muted-foreground">
                  Adapting content to meet diverse learning needs...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {differentiatedContent && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Differentiated Curriculum</CardTitle>
            <CardDescription>
              Content adapted to different learning styles and needs
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visual" className="flex items-centre gap-1">
                  <span className="hidden sm:inline">Visual</span>
                  <span className="sm:hidden">👁️</span>
                </TabsTrigger>
                <TabsTrigger value="auditory" className="flex items-centre gap-1">
                  <span className="hidden sm:inline">Auditory</span>
                  <span className="sm:hidden">👂</span>
                </TabsTrigger>
                <TabsTrigger value="kinesthetic" className="flex items-centre gap-1">
                  <span className="hidden sm:inline">Kinesthetic</span>
                  <span className="sm:hidden">✋</span>
                </TabsTrigger>
                <TabsTrigger value="readingWriting" className="flex items-centre gap-1">
                  <span className="hidden sm:inline">Reading/Writing</span>
                  <span className="sm:hidden">📝</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual" className="mt-4">
                {renderLearningStyleContent('visual')}
              </TabsContent>
              
              <TabsContent value="auditory" className="mt-4">
                {renderLearningStyleContent('auditory')}
              </TabsContent>
              
              <TabsContent value="kinesthetic" className="mt-4">
                {renderLearningStyleContent('kinesthetic')}
              </TabsContent>
              
              <TabsContent value="readingWriting" className="mt-4">
                {renderLearningStyleContent('readingWriting')}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline">
              Download as PDF
            </Button>
            <Button>
              Save to Curriculum
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
