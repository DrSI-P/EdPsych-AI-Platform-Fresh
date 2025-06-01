'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Video, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Avatar {
  id: string;
  name: string;
  thumbnail: string;
}

interface Voice {
  id: string;
  name: string;
  language: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export default function HeygenVideoCreator() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const { toast } = useToast();

  // Fetch avatars, voices, and videos on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch avatars
        const avatarsRes = await fetch('/api/heygen/avatars');
        if (avatarsRes.ok) {
          const data = await avatarsRes.json();
          setAvatars(data.avatars || []);
          if (data.avatars?.length > 0) {
            setSelectedAvatar(data.avatars[0].id);
          }
        }

        // Fetch voices
        const voicesRes = await fetch('/api/heygen/voices');
        if (voicesRes.ok) {
          const data = await voicesRes.json();
          setVoices(data.voices || []);
          if (data.voices?.length > 0) {
            setSelectedVoice(data.voices[0].id);
          }
        }

        // Fetch videos
        const videosRes = await fetch('/api/heygen/videos');
        if (videosRes.ok) {
          const data = await videosRes.json();
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load resources. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Create a new video
  const handleCreateVideo = async () => {
    if (!selectedAvatar || !script) {
      toast({
        title: 'Missing information',
        description: 'Please select an avatar and enter a script.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/heygen/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_id: selectedAvatar,
          voice_id: selectedVoice,
          text: script,
          title: title || 'Untitled Video',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: 'Success',
          description: 'Video creation started. It will appear in your list when ready.',
        });

        // Add the new video to the list
        setVideos((prev) => [
          {
            id: data.id,
            title: title || 'Untitled Video',
            thumbnail: '',
            url: '',
            status: data.status,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        // Reset form
        setTitle('');
        setScript('');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create video');
      }
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create video',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  // Delete a video
  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/heygen/videos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Video deleted successfully.',
        });
        setVideos((prev) => prev.filter((video) => video.id !== id));
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete video',
        variant: 'destructive',
      });
    }
  };

  // Refresh videos list
  const refreshVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/heygen/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error refreshing videos:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to refresh videos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Video Creator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Video</CardTitle>
            <CardDescription>
              Create an AI-powered educational video with your chosen avatar and voice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Select Avatar</Label>
              <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an avatar" />
                </SelectTrigger>
                <SelectContent>
                  {avatars.map((avatar) => (
                    <SelectItem key={avatar.id} value={avatar.id}>
                      {avatar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Select Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="script">Video Script</Label>
              <Textarea
                id="script"
                placeholder="Enter the script for your video..."
                rows={6}
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateVideo} disabled={creating || !selectedAvatar || !script}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Video'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Videos List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Videos</CardTitle>
              <CardDescription>
                View and manage your AI-generated videos.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={refreshVideos} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : videos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No videos found. Create your first video!
              </p>
            ) : (
              <div className="space-y-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted flex items-center justify-center rounded">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Status: {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {video.url && video.status === 'completed' && (
                        <Button variant="outline" asChild>
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            Watch
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
