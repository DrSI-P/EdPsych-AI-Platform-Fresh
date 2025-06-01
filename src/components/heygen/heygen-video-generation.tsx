'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeygenService, HeyGenVideo } from '@/lib/heygen/heygen-service';
import { VideoGenerationRequest } from '@/lib/heygen/heygen-api';
import { Loader2, Upload, Check, AlertCircle } from 'lucide-react';

export function HeyGenVideoGeneration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Avatar upload state
  const [avatarName, setAvatarName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Script state
  const [scriptContent, setScriptContent] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [availableScripts, setAvailableScripts] = useState([
    { id: 'welcome', title: 'Welcome Message' },
    { id: 'introduction', title: 'Course Introduction' },
    { id: 'feedback', title: 'Assignment Feedback' }
  ]);
  
  // Voice settings
  const [selectedVoice, setSelectedVoice] = useState('en-US-1');
  const [voiceSpeed, setVoiceSpeed] = useState('1.0');
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarName(file.name.split('.')[0]);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle script selection
  const handleScriptSelect = (scriptId: string) => {
    setSelectedScript(scriptId);
    
    // In a real implementation, this would fetch the script content
    const scriptTemplates: Record<string, string> = {
      'welcome': "Hello and welcome to our platform! I'm excited to guide you through this learning journey. Let's explore the features together and make the most of your educational experience.",
      'introduction': "Welcome to this course on educational psychology. Throughout this course, we'll explore key theories, practical applications, and evidence-based strategies to enhance learning outcomes for all students.",
      'feedback': "I've reviewed your assignment and I'm impressed with your analysis. You've demonstrated a good understanding of the core concepts, though there are a few areas where you could expand your thinking. Let's discuss these points in more detail."
    };
    
    setScriptContent(scriptTemplates[scriptId] || '');
  };
  
  // Generate video
  const handleGenerateVideo = async () => {
    if (!avatarFile || !scriptContent) {
      setError('Please upload an avatar image and provide script content');
      return;
    }
    
    setLoading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate video generation process
      const totalSteps = 5;
      
      // Step 1: Upload avatar
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(20);
      
      // Step 2: Process avatar
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(40);
      
      // Step 3: Generate speech
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60);
      
      // Step 4: Animate avatar
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(80);
      
      // Step 5: Finalize video
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(100);
      
      // Success
      setSuccess(true);
      
      // In a real implementation, this would call the HeyGen API
      // const params: VideoGenerationParams = {
      //   avatar: avatarFile,
      //   script: scriptContent,
      //   voice: selectedVoice,
      //   speed: parseFloat(voiceSpeed)
      // };
      // const result = await HeyGenService.generateVideo(params);
      
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error('Video generation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Avatar Video Generation</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Avatar</TabsTrigger>
          <TabsTrigger value="script">Select Script</TabsTrigger>
          <TabsTrigger value="generate">Generate Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Avatar Image</CardTitle>
              <CardDescription>Upload a clear front-facing portrait photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="avatar-name">Avatar Name</Label>
                  <Input 
                    id="avatar-name" 
                    value={avatarName} 
                    onChange={(e) => setAvatarName(e.target.value)} 
                    placeholder="Enter a name for your avatar"
                    className="mt-1"
                  />
                  
                  <div className="mt-4">
                    <Label htmlFor="avatar-upload">Upload Image</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose avatar image</span>
                        <input
                          id="avatar-upload"
                          type="file"
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-primary-foreground
                            hover:file:bg-primary/90"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported formats: JPG, PNG. Max size: 5MB
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Label>Avatar Type</Label>
                    <Select defaultValue="realistic">
                      <SelectTrigger>
                        <SelectValue placeholder="Select avatar type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="stylized">Stylized</SelectItem>
                        <SelectItem value="animated">Animated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  {avatarPreview ? (
                    <div className="relative">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-48 h-48 object-cover rounded-full border-4 border-primary/20"
                      />
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/20">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <p className="mt-4 text-center text-muted-foreground">
                    {avatarPreview ? 'Preview' : 'Avatar preview will appear here'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button 
                onClick={() => setActiveTab('script')} 
                disabled={!avatarFile}
              >
                Continue to Script
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="script">
          <Card>
            <CardHeader>
              <CardTitle>Select or Create Script</CardTitle>
              <CardDescription>Choose a template or write your own script</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="script-select">Select Existing Script</Label>
                <Select 
                  value={selectedScript} 
                  onValueChange={handleScriptSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a script" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScripts.map(script => (
                      <SelectItem key={script.id} value={script.id}>
                        {script.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="script-content">Script Content</Label>
                <Textarea 
                  id="script-content"
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="Enter your script here..."
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  {scriptContent.length} characters | Recommended: 100-500 characters
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Voice</Label>
                  <Select 
                    value={selectedVoice} 
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US-1">English (US) - Female</SelectItem>
                      <SelectItem value="en-US-2">English (US) - Male</SelectItem>
                      <SelectItem value="en-GB-1">English (UK) - Female</SelectItem>
                      <SelectItem value="en-GB-2">English (UK) - Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice-speed">Voice Speed</Label>
                  <Select 
                    value={voiceSpeed} 
                    onValueChange={setVoiceSpeed}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.8">Slow (0.8x)</SelectItem>
                      <SelectItem value="1.0">Normal (1.0x)</SelectItem>
                      <SelectItem value="1.2">Fast (1.2x)</SelectItem>
                      <SelectItem value="1.5">Very Fast (1.5x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('upload')}>
                Back
              </Button>
              <Button 
                onClick={() => setActiveTab('generate')} 
                disabled={!scriptContent}
              >
                Continue to Generate
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Video</CardTitle>
              <CardDescription>Review and generate your AI avatar video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Avatar</h3>
                  <div className="flex items-center space-x-4">
                    {avatarPreview && (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar" 
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{avatarName || 'Unnamed Avatar'}</p>
                      <p className="text-sm text-muted-foreground">Realistic</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Script</h3>
                  <div className="p-3 bg-muted rounded-md text-sm max-h-[100px] overflow-y-auto">
                    {scriptContent || 'No script content'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Voice Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Voice</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVoice === 'en-US-1' ? 'English (US) - Female' : 
                       selectedVoice === 'en-US-2' ? 'English (US) - Male' :
                       selectedVoice === 'en-GB-1' ? 'English (UK) - Female' :
                       'English (UK) - Male'}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Speed</p>
                    <p className="text-sm text-muted-foreground">
                      {voiceSpeed === '0.8' ? 'Slow (0.8x)' :
                       voiceSpeed === '1.0' ? 'Normal (1.0x)' :
                       voiceSpeed === '1.2' ? 'Fast (1.2x)' :
                       'Very Fast (1.5x)'}
                    </p>
                  </div>
                </div>
              </div>
              
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Generating video...</p>
                    <p className="text-sm text-muted-foreground">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your video has been generated successfully! You can view it in the Video Library.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('script')}>
                Back
              </Button>
              <Button 
                onClick={handleGenerateVideo} 
                disabled={loading || !avatarFile || !scriptContent}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Video'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add default export to fix import errors
export default HeyGenVideoGeneration;
