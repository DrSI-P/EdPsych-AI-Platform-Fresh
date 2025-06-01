'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Save,
  Eye,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  Info,
  History,
  Heart,
  Star,
  Smile,
  Zap,
  Award,
  Compass
} from 'lucide-react';

import { 
  ContentType,
  ContentStatus,
  ContentMetadata
} from '@/lib/curriculum-content/types';

/**
 * Student Interest Personalization Component
 * 
 * Provides tools for personalizing curriculum content based on student interests
 * with features for theme customization, interest-based examples, and engagement optimization.
 */
export function StudentInterestPersonalization() {
  const { toast } = useToast();
  
  // Mock content data
  const [content, setContent] = useState<ContentMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<string>('themes');
  
  // Student interest state
  const [interestAreas, setInterestAreas] = useState<string[]>([
    'Sports', 'Music', 'Technology', 'Nature', 'Space', 'Animals', 
    'Art', 'History', 'Science Fiction', 'Cooking', 'Gaming'
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Space']);
  const [newInterest, setNewInterest] = useState<string>('');
  
  // Theme customization state
  const [themes, setThemes] = useState<any[]>([
    {
      id: 'theme1',
      name: 'Space Exploration',
      description: 'Examples and scenarios based on space exploration and astronomy',
      interests: ['Space', 'Science Fiction', 'Technology'],
      enabled: true
    },
    {
      id: 'theme2',
      name: 'Wildlife and Nature',
      description: 'Examples and scenarios based on wildlife and natural environments',
      interests: ['Nature', 'Animals'],
      enabled: false
    },
    {
      id: 'theme3',
      name: 'Sports and Athletics',
      description: 'Examples and scenarios based on sports and athletic activities',
      interests: ['Sports'],
      enabled: false
    },
    {
      id: 'theme4',
      name: 'Technology and Innovation',
      description: 'Examples and scenarios based on technology and innovation',
      interests: ['Technology', 'Gaming'],
      enabled: true
    }
  ]);
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [newThemeDescription, setNewThemeDescription] = useState<string>('');
  const [newThemeInterests, setNewThemeInterests] = useState<string[]>([]);
  
  // Example customization state
  const [examples, setExamples] = useState<any[]>([
    {
      id: 'example1',
      title: 'Understanding Fractions with Pizza Slices',
      description: 'Uses pizza slices to explain fraction concepts',
      interests: ['Cooking', 'Food'],
      enabled: true
    },
    {
      id: 'example2',
      title: 'Calculating Distances in Space',
      description: 'Uses space travel to explain distance calculations',
      interests: ['Space', 'Science Fiction'],
      enabled: true
    },
    {
      id: 'example3',
      title: 'Tracking Sports Statistics',
      description: 'Uses sports statistics to explain data analysis',
      interests: ['Sports'],
      enabled: false
    }
  ]);
  const [newExampleTitle, setNewExampleTitle] = useState<string>('');
  const [newExampleDescription, setNewExampleDescription] = useState<string>('');
  const [newExampleInterests, setNewExampleInterests] = useState<string[]>([]);
  
  // Engagement settings
  const [engagementSettings, setEngagementSettings] = useState<any>({
    adaptiveContent: true,
    interestBasedRewards: true,
    personalizedFeedback: true,
    challengeLevel: 'moderate',
    rewardFrequency: 'balanced'
  });
  
  // Fetch content
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    const mockContent: ContentMetadata = {
      id: 'content-123',
      title: 'Introduction to Fractions',
      description: 'A comprehensive introduction to fractions for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentType: ContentType.EXPLANATION,
      status: ContentStatus.DRAFT,
      createdAt: '2025-05-20T10:30:00Z',
      updatedAt: '2025-05-30T14:45:00Z',
      createdBy: 'John Smith',
      updatedBy: 'Jane Doe'
    };
    
    setContent(mockContent);
  }, []);
  
  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };
  
  // Handle add new interest
  const handleAddInterest = () => {
    if (newInterest && !interestAreas.includes(newInterest)) {
      setInterestAreas(prev => [...prev, newInterest]);
      setSelectedInterests(prev => [...prev, newInterest]);
      setNewInterest('');
      
      toast({
        title: "Interest added",
        description: `${newInterest} has been added to the interest areas`
      });
    }
  };
  
  // Handle theme toggle
  const handleThemeToggle = (themeId: string, enabled: boolean) => {
    setThemes(prev => prev.map(theme => 
      theme.id === themeId ? { ...theme, enabled } : theme
    ));
    
    toast({
      title: enabled ? "Theme enabled" : "Theme disabled",
      description: `${themes.find(t => t.id === themeId)?.name} has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };
  
  // Handle add new theme
  const handleAddTheme = () => {
    if (newThemeName) {
      const newTheme = {
        id: `theme${themes.length + 1}`,
        name: newThemeName,
        description: newThemeDescription,
        interests: newThemeInterests,
        enabled: true
      };
      
      setThemes(prev => [...prev, newTheme]);
      setNewThemeName('');
      setNewThemeDescription('');
      setNewThemeInterests([]);
      
      toast({
        title: "Theme added",
        description: `${newThemeName} has been added to the themes`
      });
    }
  };
  
  // Handle example toggle
  const handleExampleToggle = (exampleId: string, enabled: boolean) => {
    setExamples(prev => prev.map(example => 
      example.id === exampleId ? { ...example, enabled } : example
    ));
    
    toast({
      title: enabled ? "Example enabled" : "Example disabled",
      description: `${examples.find(e => e.id === exampleId)?.title} has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };
  
  // Handle add new example
  const handleAddExample = () => {
    if (newExampleTitle) {
      const newExample = {
        id: `example${examples.length + 1}`,
        title: newExampleTitle,
        description: newExampleDescription,
        interests: newExampleInterests,
        enabled: true
      };
      
      setExamples(prev => [...prev, newExample]);
      setNewExampleTitle('');
      setNewExampleDescription('');
      setNewExampleInterests([]);
      
      toast({
        title: "Example added",
        description: `${newExampleTitle} has been added to the examples`
      });
    }
  };
  
  // Handle engagement setting update
  const handleEngagementSettingUpdate = (key: string, value: any) => {
    setEngagementSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle save personalization
  const handleSavePersonalization = () => {
    // In a real implementation, this would save via API
    toast({
      title: "Personalization saved",
      description: "Student interest personalization settings have been saved successfully"
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (!content) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </div>
            <Badge variant="outline">
              Student Interest Personalization
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <span className="text-sm font-medium">Key Stage:</span>
              <span className="ml-2">{content.keyStage}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Subject:</span>
              <span className="ml-2">{content.subject}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Content Type:</span>
              <span className="ml-2">{content.contentType}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Student Interest Areas</h3>
            <p className="text-sm mb-4">
              Select interest areas to personalize content for students. These interests will be used to customize
              themes, examples, and engagement strategies.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {interestAreas.map((interest) => (
                <Badge 
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="px-3 py-1 cursor-pointer"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                  {selectedInterests.includes(interest) && (
                    <Check className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Add new interest area..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleAddInterest} disabled={!newInterest}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="themes" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="themes">
                <Palette className="h-4 w-4 mr-2" />
                Themes
              </TabsTrigger>
              <TabsTrigger value="examples">
                <FileText className="h-4 w-4 mr-2" />
                Examples
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Zap className="h-4 w-4 mr-2" />
                Engagement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="themes">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme Customization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize content themes based on student interests. Themes affect the overall context,
                  scenarios, and presentation of the content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {themes.map((theme) => (
                    <Card key={theme.id} className={`border-l-4 ${theme.enabled ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-md">{theme.name}</CardTitle>
                          <Switch 
                            checked={theme.enabled}
                            onCheckedChange={(checked) => handleThemeToggle(theme.id, checked)}
                          />
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-wrap gap-1">
                          {theme.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Add New Theme</CardTitle>
                    <CardDescription>Create a new theme based on student interests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="themeName">Theme Name</Label>
                      <Input 
                        id="themeName"
                        value={newThemeName}
                        onChange={(e) => setNewThemeName(e.target.value)}
                        placeholder="e.g., Sports and Games"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="themeDescription">Description</Label>
                      <Textarea 
                        id="themeDescription"
                        value={newThemeDescription}
                        onChange={(e) => setNewThemeDescription(e.target.value)}
                        placeholder="Describe how this theme will be applied to the content..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Related Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {interestAreas.map((interest) => (
                          <Badge 
                            key={interest}
                            variant={newThemeInterests.includes(interest) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              if (newThemeInterests.includes(interest)) {
                                setNewThemeInterests(prev => prev.filter(i => i !== interest));
                              } else {
                                setNewThemeInterests(prev => [...prev, interest]);
                              }
                            }}
                          >
                            {interest}
                            {newThemeInterests.includes(interest) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddTheme} disabled={!newThemeName}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Theme
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="examples">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Example Customization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize examples and scenarios based on student interests. Examples are used to illustrate
                  concepts and make content more relatable.
                </p>
                
                <div className="space-y-4 mb-6">
                  {examples.map((example) => (
                    <Card key={example.id} className={`border-l-4 ${example.enabled ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-md">{example.title}</CardTitle>
                          <Switch 
                            checked={example.enabled}
                            onCheckedChange={(checked) => handleExampleToggle(example.id, checked)}
                          />
                        </div>
                        <CardDescription>{example.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-wrap gap-1">
                          {example.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Add New Example</CardTitle>
                    <CardDescription>Create a new example based on student interests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="exampleTitle">Example Title</Label>
                      <Input 
                        id="exampleTitle"
                        value={newExampleTitle}
                        onChange={(e) => setNewExampleTitle(e.target.value)}
                        placeholder="e.g., Calculating Distances in Video Games"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="exampleDescription">Description</Label>
                      <Textarea 
                        id="exampleDescription"
                        value={newExampleDescription}
                        onChange={(e) => setNewExampleDescription(e.target.value)}
                        placeholder="Describe how this example will illustrate the concept..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Related Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {interestAreas.map((interest) => (
                          <Badge 
                            key={interest}
                            variant={newExampleInterests.includes(interest) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              if (newExampleInterests.includes(interest)) {
                                setNewExampleInterests(prev => prev.filter(i => i !== interest));
                              } else {
                                setNewExampleInterests(prev => [...prev, interest]);
                              }
                            }}
                          >
                            {interest}
                            {newExampleInterests.includes(interest) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddExample} disabled={!newExampleTitle}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Example
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="engagement">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Engagement Optimization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize engagement strategies based on student interests. These settings affect how content
                  is presented and how students interact with it.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="adaptiveContent">Adaptive Content</Label>
                      <Switch 
                        id="adaptiveContent"
                        checked={engagementSettings.adaptiveContent}
                        onCheckedChange={(checked) => handleEngagementSettingUpdate('adaptiveContent', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically adapt content based on student interests and performance
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interestBasedRewards">Interest-Based Rewards</Label>
                      <Switch 
                        id="interestBasedRewards"
                        checked={engagementSettings.interestBasedRewards}
                        onCheckedChange={(checked) => handleEngagementSettingUpdate('interestBasedRewards', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provide rewards and incentives based on student interests
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalizedFeedback">Personalized Feedback</Label>
                      <Switch 
                        id="personalizedFeedback"
                        checked={engagementSettings.personalizedFeedback}
                        onCheckedChange={(checked) => handleEngagementSettingUpdate('personalizedFeedback', checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provide feedback that references student interests
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="challengeLevel">Challenge Level</Label>
                    <Select 
                      value={engagementSettings.challengeLevel}
                      onValueChange={(value) => handleEngagementSettingUpdate('challengeLevel', value)}
                    >
                      <SelectTrigger id="challengeLevel">
                        <SelectValue placeholder="Select challenge level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Difficulty level of content and activities
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rewardFrequency">Reward Frequency</Label>
                    <Select 
                      value={engagementSettings.rewardFrequency}
                      onValueChange={(value) => handleEngagementSettingUpdate('rewardFrequency', value)}
                    >
                      <SelectTrigger id="rewardFrequency">
                        <SelectValue placeholder="Select reward frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often rewards and incentives are provided
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-700">Engagement Optimization</h4>
                      <p className="text-xs text-blue-600 mt-1">
                        These settings will be used to optimize engagement based on the selected student interests.
                        The system will automatically adjust content presentation, examples, and feedback to align
                        with student interests and preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.href = `/curriculum-content/preview/${content.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Preview Personalization
          </Button>
          <Button onClick={handleSavePersonalization}>
            <Save className="mr-2 h-4 w-4" />
            Save Personalization
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
