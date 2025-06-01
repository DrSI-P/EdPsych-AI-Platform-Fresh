'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, BookOpen, Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LearningDifferenceSettings {
  dyslexiaSupport: boolean;
  dyscalculiaSupport: boolean;
  adhdSupport: boolean;
  autismSupport: boolean;
  textToSpeech: boolean;
  fontAdjustments: boolean;
  colorOverlays: boolean;
  mathSupports: boolean;
  focusTools: boolean;
  sensoryConsiderations: boolean;
  fontType: string;
  lineSpacing: number;
  colorScheme: string;
  readingSpeed: number;
}

const defaultSettings: LearningDifferenceSettings = {
  dyslexiaSupport: false,
  dyscalculiaSupport: false,
  adhdSupport: false,
  autismSupport: false,
  textToSpeech: false,
  fontAdjustments: false,
  colorOverlays: false,
  mathSupports: false,
  focusTools: false,
  sensoryConsiderations: false,
  fontType: 'standard',
  lineSpacing: 1.5,
  colorScheme: 'standard',
  readingSpeed: 1.0
};

export default function LearningDifferencesAccommodation() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<LearningDifferenceSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("settings");
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserSettings();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/special-needs/learning-differences?type=settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.assessmentResults) {
          setAssessmentResults(data.assessmentResults);
        }
      }
    } catch (error) {
      console.error('Error fetching learning difference settings:', error);
      toast({
        title: "Error",
        description: "Failed to load your learning difference settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/special-needs/learning-differences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'settings',
          data: settings
        }),
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your learning difference accommodations have been updated.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof LearningDifferenceSettings, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const runAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/special-needs/learning-differences/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssessmentResults(data.results);
        toast({
          title: "Assessment Complete",
          description: "Your learning differences assessment has been completed.",
        });
      } else {
        throw new Error('Failed to run assessment');
      }
    } catch (error) {
      console.error('Error running assessment:', error);
      toast({
        title: "Error",
        description: "Failed to complete the assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendedSettings = () => {
    if (!assessmentResults) return;
    
    const recommendedSettings: Partial<LearningDifferenceSettings> = {
      dyslexiaSupport: assessmentResults.dyslexia > 0.5,
      dyscalculiaSupport: assessmentResults.dyscalculia > 0.5,
      adhdSupport: assessmentResults.adhd > 0.5,
      autismSupport: assessmentResults.autism > 0.5,
      textToSpeech: assessmentResults.dyslexia > 0.7,
      fontAdjustments: assessmentResults.dyslexia > 0.3,
      colorOverlays: assessmentResults.visualSensitivity > 0.5,
      mathSupports: assessmentResults.dyscalculia > 0.3,
      focusTools: assessmentResults.adhd > 0.3,
      sensoryConsiderations: assessmentResults.autism > 0.3,
      fontType: assessmentResults.dyslexia > 0.7 ? 'dyslexic' : 'standard',
      lineSpacing: assessmentResults.dyslexia > 0.5 ? 2.0 : 1.5,
      colorScheme: assessmentResults.visualSensitivity > 0.7 ? 'high-contrast' : 'standard',
      readingSpeed: assessmentResults.processingSpeed < 0.5 ? 0.8 : 1.0
    };
    
    setSettings(prev => ({
      ...prev,
      ...recommendedSettings
    }));
    
    toast({
      title: "Settings Applied",
      description: "Recommended settings have been applied based on your assessment.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Learning Differences Accommodation</h1>
      
      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="preview">Content Preview</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Difference Accommodations</CardTitle>
              <CardDescription>
                Customise your learning experience based on your specific needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Learning Differences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="dyslexia" 
                      checked={settings.dyslexiaSupport}
                      onCheckedChange={(checked) => handleSettingChange('dyslexiaSupport', checked)}
                    />
                    <Label htmlFor="dyslexia">Dyslexia Support</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="dyscalculia" 
                      checked={settings.dyscalculiaSupport}
                      onCheckedChange={(checked) => handleSettingChange('dyscalculiaSupport', checked)}
                    />
                    <Label htmlFor="dyscalculia">Dyscalculia Support</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="adhd" 
                      checked={settings.adhdSupport}
                      onCheckedChange={(checked) => handleSettingChange('adhdSupport', checked)}
                    />
                    <Label htmlFor="adhd">ADHD Support</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="autism" 
                      checked={settings.autismSupport}
                      onCheckedChange={(checked) => handleSettingChange('autismSupport', checked)}
                    />
                    <Label htmlFor="autism">Autism Support</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accommodation Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="text-to-speech" 
                      checked={settings.textToSpeech}
                      onCheckedChange={(checked) => handleSettingChange('textToSpeech', checked)}
                    />
                    <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="font-adjustments" 
                      checked={settings.fontAdjustments}
                      onCheckedChange={(checked) => handleSettingChange('fontAdjustments', checked)}
                    />
                    <Label htmlFor="font-adjustments">Font Adjustments</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="colour-overlays" 
                      checked={settings.colorOverlays}
                      onCheckedChange={(checked) => handleSettingChange('colorOverlays', checked)}
                    />
                    <Label htmlFor="colour-overlays">Colour Overlays</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="math-supports" 
                      checked={settings.mathSupports}
                      onCheckedChange={(checked) => handleSettingChange('mathSupports', checked)}
                    />
                    <Label htmlFor="math-supports">Math Supports</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="focus-tools" 
                      checked={settings.focusTools}
                      onCheckedChange={(checked) => handleSettingChange('focusTools', checked)}
                    />
                    <Label htmlFor="focus-tools">Focus Tools</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Switch 
                      id="sensory-considerations" 
                      checked={settings.sensoryConsiderations}
                      onCheckedChange={(checked) => handleSettingChange('sensoryConsiderations', checked)}
                    />
                    <Label htmlFor="sensory-considerations">Sensory Considerations</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="font-type" className="block mb-2">Font Type</Label>
                    <RadioGroup 
                      id="font-type" 
                      value={settings.fontType}
                      onValueChange={(value) => handleSettingChange('fontType', value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="standard" id="standard-font" />
                        <Label htmlFor="standard-font">Standard</Label>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="dyslexic" id="dyslexic-font" />
                        <Label htmlFor="dyslexic-font">Dyslexia-Friendly</Label>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="simplified" id="simplified-font" />
                        <Label htmlFor="simplified-font">Simplified</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="line-spacing" className="block mb-2">Line Spacing: {settings.lineSpacing.toFixed(1)}</Label>
                    <Slider
                      id="line-spacing"
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      value={[settings.lineSpacing]}
                      onValueChange={(value) => handleSettingChange('lineSpacing', value[0])}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="colour-scheme" className="block mb-2">Colour Scheme</Label>
                    <RadioGroup 
                      id="colour-scheme" 
                      value={settings.colorScheme}
                      onValueChange={(value) => handleSettingChange('colorScheme', value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="standard" id="standard-colors" />
                        <Label htmlFor="standard-colors">Standard</Label>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="high-contrast" id="high-contrast" />
                        <Label htmlFor="high-contrast">High Contrast</Label>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="dark" id="dark-mode" />
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <RadioGroupItem value="pastel" id="pastel" />
                        <Label htmlFor="pastel">Pastel</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="reading-speed" className="block mb-2">Reading Speed: {settings.readingSpeed.toFixed(1)}x</Label>
                    <Slider
                      id="reading-speed"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={[settings.readingSpeed]}
                      onValueChange={(value) => handleSettingChange('readingSpeed', value[0])}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSettings(defaultSettings)}>Reset to Default</Button>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
          
          {assessmentResults && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Settings</CardTitle>
                <CardDescription>
                  Based on your assessment results, we recommend the following accommodations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Personalized Recommendations Available</AlertTitle>
                  <AlertDescription>
                    We've analysed your assessment results and have personalized recommendations ready.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button onClick={applyRecommendedSettings}>Apply Recommended Settings</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="assessment" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Differences Assessment</CardTitle>
              <CardDescription>
                Complete this assessment to receive personalized accommodation recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This assessment helps identify potential learning differences and provides tailored
                accommodation recommendations. The assessment takes approximately 15-20 minutes to complete.
              </p>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Privacy Notice</AlertTitle>
                <AlertDescription>
                  Your assessment results are confidential and will only be used to provide personalized accommodations.
                </AlertDescription>
              </Alert>
              
              {assessmentResults && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium">Your Assessment Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Dyslexia Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-grey-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${assessmentResults.dyslexia * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm mt-2">
                          {assessmentResults.dyslexia < 0.3 ? "Low" : 
                           assessmentResults.dyslexia < 0.7 ? "Moderate" : "High"} indicators
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Dyscalculia Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-grey-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${assessmentResults.dyscalculia * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm mt-2">
                          {assessmentResults.dyscalculia < 0.3 ? "Low" : 
                           assessmentResults.dyscalculia < 0.7 ? "Moderate" : "High"} indicators
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ADHD Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-grey-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${assessmentResults.adhd * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm mt-2">
                          {assessmentResults.adhd < 0.3 ? "Low" : 
                           assessmentResults.adhd < 0.7 ? "Moderate" : "High"} indicators
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Autism Spectrum Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-2 w-full bg-grey-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${assessmentResults.autism * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm mt-2">
                          {assessmentResults.autism < 0.3 ? "Low" : 
                           assessmentResults.autism < 0.7 ? "Moderate" : "High"} indicators
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Alert className="mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Assessment Complete</AlertTitle>
                    <AlertDescription>
                      Based on your results, we've generated personalized accommodation recommendations.
                      Visit the Settings tab to apply these recommendations.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runAssessment} disabled={loading}>
                {loading ? "Processing..." : assessmentResults ? "Retake Assessment" : "Start Assessment"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
              <CardDescription>
                See how your content will appear with your current accommodation settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`p-6 border rounded-md ${
                  settings.colorScheme === 'dark' ? 'bg-grey-900 text-white' : 
                  settings.colorScheme === 'high-contrast' ? 'bg-black text-white' :
                  settings.colorScheme === 'pastel' ? 'bg-blue-50' : 'bg-white'
                }`}
                style={{
                  fontFamily: settings.fontType === 'dyslexic' ? 'OpenDyslexic, sans-serif' : 
                             settings.fontType === 'simplified' ? 'Arial, sans-serif' : 'inherit',
                  lineHeight: settings.lineSpacing,
                }}
              >
                <h2 className="text-xl font-bold mb-4">Sample Content</h2>
                <p className="mb-4">
                  This is an example of how educational content will appear with your current settings.
                  The text formatting, spacing, and colors will reflect your chosen accommodations.
                </p>
                <h3 className="text-lg font-semibold mb-2">Mathematics Example</h3>
                <div className={`p-4 border rounded ${settings.mathSupports ? 'bg-yellow-50' : ''}`}>
                  <p>Solve the equation: 3x + 5 = 20</p>
                  {settings.mathSupports && (
                    <div className="mt-2 text-sm">
                      <p>Step 1: Subtract 5 from both sides</p>
                      <p>3x = 15</p>
                      <p>Step 2: Divide both sides by 3</p>
                      <p>x = 5</p>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 mt-4">Reading Example</h3>
                <p>
                  The quick brown fox jumps over the lazy dog. This pangram contains all the letters
                  of the English alphabet. It is commonly used for testing typefaces and keyboard layouts.
                </p>
                {settings.focusTools && (
                  <div className="mt-4 p-2 bg-yellow-100 border-l-4 border-yellow-500">
                    <p className="font-semibold">Focus Point:</p>
                    <p>Pay attention to how the fox jumps over the dog.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("settings")}>
                Adjust Settings
              </Button>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About Learning Differences Accommodation</CardTitle>
              <CardDescription>
                Understanding how our accommodation system works and the research behind it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">What Are Learning Differences?</h3>
                <p>
                  Learning differences (also called learning disabilities or learning disorders) are
                  neurologically-based processing problems that can interfere with learning basic skills
                  such as reading, writing, or math. They can also affect higher-level skills like organisation,
                  time planning, abstract reasoning, and attention.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Our Approach</h3>
                <p>
                  Our Learning Differences Accommodation system is designed to provide personalized
                  support based on evidence-based practices. We focus on:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Personalized accommodations based on individual needs</li>
                  <li>Multi-sensory learning approaches</li>
                  <li>Reducing cognitive load while maintaining educational rigor</li>
                  <li>Building confidence and independence</li>
                  <li>Alignment with UK Department for Education standards</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Evidence-Based Support</h3>
                <p>
                  Our accommodations are based on research from leading educational psychology sources,
                  including the British Dyslexia Association, National Council for Special Education,
                  and peer-reviewed academic research on effective interventions for various learning differences.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Types of Accommodations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dyslexia Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Includes specialised fonts, text-to-speech, adjusted spacing, colour overlays,
                        and structured phonics-based approaches to reading.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dyscalculia Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Provides visual representations of mathematical concepts, step-by-step breakdowns,
                        concrete examples, and additional practise opportunities.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">ADHD Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Offers focus tools, chunked content, frequent breaks, reduced distractions,
                        and clear visual organisation of information.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Autism Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Includes sensory considerations, clear and concrete language, visual schedules,
                        predictable routines, and social narrative supports.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
