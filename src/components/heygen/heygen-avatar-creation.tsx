'use client';

import React, { useState, useEffect } from 'react';
import { HeyGenService, AvatarCreationParams, VideoGenerationParams } from '@/lib/heygen/heygen-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Mic, Video, Check, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * HeyGen Avatar Creation Component
 * 
 * This component handles the creation of a custom AI avatar using HeyGen's API,
 * including both face and voice cloning.
 */
export const HeyGenAvatarCreation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarName, setAvatarName] = useState('Dr. Scott Avatar');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVoiceSample, setSelectedVoiceSample] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  // Initialize HeyGen service
  const heygenService = HeyGenService.getInstance({
    apiKey: process.env.NEXT_PUBLIC_HEYGEN_API_KEY || 'demo-api-key',
    baseUrl: process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com'
  });
  
  useEffect(() => {
    // Initialize HeyGen service
    const initService = async () => {
      try {
        await heygenService.initialize();
      } catch (error) {
        console.error('Failed to initialize HeyGen service:', error);
        setError('Failed to initialize avatar creation service. Please try again later.');
      }
    };
    
    initService();
  }, []);
  
  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newImages = Array.from(files);
    setSelectedImages(prev => [...prev, ...newImages]);
    
    // Create preview URLs
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  // Handle voice sample selection
  const handleVoiceSampleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;
    
    setSelectedVoiceSample(files[0]);
    setVoicePreviewUrl(URL.createObjectURL(files[0]));
  };
  
  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
        setAudioChunks(chunks);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'voice-sample.wav', { type: 'audio/wav' });
        setSelectedVoiceSample(file);
        setVoicePreviewUrl(URL.createObjectURL(blob));
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop();
      setIsRecording(false);
    }
  };
  
  // Handle avatar creation
  const handleCreateAvatar = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image for avatar creation.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a production environment, we would upload the images and voice sample
      // to a storage service and then pass the URLs to HeyGen
      // For now, we'll simulate this process
      
      const imageUrls = previewUrls;
      const voiceSampleUrl = voicePreviewUrl || undefined;
      
      const params: AvatarCreationParams = {
        name: avatarName,
        imageUrls,
        voiceSampleUrl
      };
      
      const avatar = await heygenService.createAvatar(params);
      
      // If voice sample was provided, create a voice
      if (voiceSampleUrl) {
        await heygenService.createVoice(avatarName + ' Voice', voiceSampleUrl);
      }
      
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to create avatar:', error);
      setError('Failed to create avatar. Please try again later.');
      setLoading(false);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setSelectedImages([]);
    setSelectedVoiceSample(null);
    setPreviewUrls([]);
    setVoicePreviewUrl(null);
    setSuccess(false);
    setError(null);
  };
  
  // Success state
  if (success) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600 flex items-centre">
            <Check className="mr-2" /> Avatar Created Successfully
          </CardTitle>
          <CardDescription>
            Your custom AI avatar has been created and is ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The avatar and voice have been successfully created and are now available for generating videos.
            You can now proceed to the video generation process using your custom avatar.
          </p>
          <div className="flex justify-centre">
            <Button onClick={handleReset} variant="outline" className="mr-2">
              Create Another Avatar
            </Button>
            <Button onClick={() => window.location.href = '/ai-avatar-videos/generate'}>
              Generate Videos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Custom AI Avatar</CardTitle>
        <CardDescription>
          Upload photos of yourself and a voice sample to create a personalized AI avatar for your educational videos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Avatar Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Avatar Name</label>
            <Input
              type="text"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              placeholder="Enter a name for your avatar"
            />
          </div>
          
          {/* Face Photos */}
          <div>
            <label className="block text-sm font-medium mb-1">Face Photos (3-5 recommended)</label>
            <p className="text-sm text-grey-500 mb-2">
              Upload clear photos of your face from different angles for best results.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img src={url} alt={`Face ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              
              <label className="border border-dashed rounded-md flex flex-col items-centre justify-centre aspect-square cursor-pointer hover:bg-grey-50">
                <Upload className="h-8 w-8 text-grey-400 mb-2" />
                <span className="text-sm text-grey-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  multiple
                />
              </label>
            </div>
          </div>
          
          {/* Voice Sample */}
          <div>
            <label className="block text-sm font-medium mb-1">Voice Sample</label>
            <p className="text-sm text-grey-500 mb-2">
              Upload or record a clear voice sample (2-3 minutes recommended) for voice cloning.
            </p>
            
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                <TabsTrigger value="record">Record Voice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="border border-dashed rounded-md p-6 flex flex-col items-centre justify-centre cursor-pointer hover:bg-grey-50">
                  <Upload className="h-8 w-8 text-grey-400 mb-2" />
                  <span className="text-sm text-grey-500 mb-2">Upload Voice Sample</span>
                  <span className="text-xs text-grey-400 mb-4">WAV or MP3 format, 2-3 minutes of clear speech</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleVoiceSampleSelect}
                    className="hidden"
                    id="voice-upload"
                  />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="voice-upload">Select File</label>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="record">
                <div className="border rounded-md p-6 flex flex-col items-centre justify-centre">
                  <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500 animate-pulse' : 'text-grey-400'} mb-2`} />
                  <span className="text-sm text-grey-500 mb-2">
                    {isRecording ? 'Recording in progress...' : 'Click to record your voice'}
                  </span>
                  <span className="text-xs text-grey-400 mb-4">
                    Speak clearly for 2-3 minutes, reading a passage or script
                  </span>
                  
                  {isRecording ? (
                    <Button onClick={stopRecording} variant="destructive" size="sm">
                      Stop Recording
                    </Button>
                  ) : (
                    <Button onClick={startRecording} variant="outline" size="sm">
                      Start Recording
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {voicePreviewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Voice Sample Preview:</p>
                <audio controls src={voicePreviewUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          Reset
        </Button>
        <Button onClick={handleCreateAvatar} disabled={loading || selectedImages.length === 0}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating Avatar...
            </>
          ) : (
            'Create Avatar'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HeyGenAvatarCreation;
