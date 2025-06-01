'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Film, 
  Loader2, 
  Play, 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  Video 
} from 'lucide-react';
import { 
  AvatarVideoMetadata, 
  AvatarVideoScript,
  ContentCategory,
  TargetAudience,
  AvatarIntegrationPoint
} from '@/lib/avatar/types';
import { AvatarService } from '@/lib/avatar/avatarService';
import ScriptEditor from './script-editor';
import VideoGenerator from './video-generator';

interface VideoLibraryProps {
  onSelectVideo?: (video: AvatarVideoMetadata) => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  onSelectVideo
}) => {
  const [videos, setVideos] = useState<AvatarVideoMetadata[]>([]);
  const [scripts, setScripts] = useState<AvatarVideoScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<TargetAudience | 'all'>('all');
  const [selectedScript, setSelectedScript] = useState<AvatarVideoScript | null>(null);
  const [isCreatingScript, setIsCreatingScript] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const avatarService = new AvatarService();
  
  // Fetch videos and scripts on component mount
  useEffect(() => {
    const fetchVideosAndScripts = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockVideos: AvatarVideoMetadata[] = [
          {
            id: 'video1',
            title: 'Introduction to Fractions',
            description: 'A comprehensive introduction to fractions for Key Stage 2 students',
            durationSeconds: 240,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            category: ContentCategory.LESSON,
            targetAudience: [TargetAudience.KEY_STAGE_2],
            curriculumLinks: ['Mathematics', 'Fractions'],
            tags: ['maths', 'fractions', 'introduction'],
            transcriptUrl: '/assets/transcripts/fractions_intro.txt',
            captionsUrl: '/assets/captions/fractions_intro.vtt',
            thumbnailUrl: '/assets/thumbnails/fractions_intro.jpg',
            videoUrl: '/assets/videos/fractions_intro.mp4',
            status: 'ready',
            accessibilityFeatures: {
              hasCaptions: true,
              hasTranscript: true,
              hasAudioDescription: false,
              hasSignLanguage: false
            }
          },
          {
            id: 'video2',
            title: 'Understanding Anxiety in the Classroom',
            description: 'Guidance for teachers on recognising and supporting students with anxiety',
            durationSeconds: 360,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            category: ContentCategory.TUTORIAL,
            targetAudience: [TargetAudience.TEACHERS, TargetAudience.SENCOS],
            tags: ['anxiety', 'mental health', 'support', 'classroom management'],
            thumbnailUrl: '/assets/thumbnails/anxiety_classroom.jpg',
            videoUrl: '/assets/videos/anxiety_classroom.mp4',
            status: 'ready',
            accessibilityFeatures: {
              hasCaptions: true,
              hasTranscript: true,
              hasAudioDescription: true,
              hasSignLanguage: false
            }
          },
          {
            id: 'video3',
            title: 'Phonics Practise: Short Vowel Sounds',
            description: 'Interactive phonics practise focusing on short vowel sounds',
            durationSeconds: 180,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            category: ContentCategory.TUTORIAL,
            targetAudience: [TargetAudience.EARLY_YEARS, TargetAudience.KEY_STAGE_1],
            curriculumLinks: ['English', 'Phonics', 'Reading'],
            tags: ['phonics', 'reading', 'vowels', 'literacy'],
            captionsUrl: '/assets/captions/phonics_vowels.vtt',
            thumbnailUrl: '/assets/thumbnails/phonics_vowels.jpg',
            videoUrl: '/assets/videos/phonics_vowels.mp4',
            status: 'ready',
            accessibilityFeatures: {
              hasCaptions: true,
              hasTranscript: false,
              hasAudioDescription: false,
              hasSignLanguage: false
            }
          }
        ];
        
        const mockScripts: AvatarVideoScript[] = [
          {
            id: 'script1',
            title: 'Introduction to Fractions',
            content: 'Hello everyone! Today we\'re going to learn about fractions. A fraction represents a part of a whole. Imagine you have a pizza cut into 8 equal slices. If you eat 3 slices, you\'ve eaten 3/8 of the pizza. The number on the bottom (8) is called the denominator, and it tells us how many equal parts the whole is divided into. The number on the top (3) is called the numerator, and it tells us how many of those parts we\'re talking about.',
            notes: 'Use visual aids for pizza example. Speak slowly when introducing numerator and denominator.',
            visualCues: [],
            emotionMarkers: [],
            pauseMarkers: [],
            emphasisMarkers: [],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            authorId: 'user1',
            status: 'generated',
            category: ContentCategory.LESSON,
            targetAudience: [TargetAudience.KEY_STAGE_2],
            estimatedDurationSeconds: 240
          },
          {
            id: 'script2',
            title: 'Understanding Anxiety in the Classroom',
            content: 'Welcome to this professional development session on understanding anxiety in the classroom. Anxiety is one of the most common mental health challenges that students face, and it can significantly impact their learning and wellbeing. In this video, we\'ll discuss how to recognise signs of anxiety, strategies to support anxious students, and when to seek additional help from specialists.',
            notes: 'Maintain a calm, supportive tone throughout. Include practical examples that teachers can implement immediately.',
            visualCues: [],
            emotionMarkers: [],
            pauseMarkers: [],
            emphasisMarkers: [],
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
            updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            authorId: 'user1',
            status: 'generated',
            category: ContentCategory.TUTORIAL,
            targetAudience: [TargetAudience.TEACHERS, TargetAudience.SENCOS],
            estimatedDurationSeconds: 360
          },
          {
            id: 'script3',
            title: 'Phonics Practise: Short Vowel Sounds',
            content: 'Hi there! Today we\'re going to practise our short vowel sounds. These are the sounds that the vowels a, e, i, o, and u make in words like "cat," "pet," "sit," "hot," and "sun." Let\'s start with the short "a" sound. Can you say "a" as in "apple"? Great job! Now, let\'s try some words with the short "a" sound: cat, hat, map, tap, and bag.',
            visualCues: [],
            emotionMarkers: [],
            pauseMarkers: [],
            emphasisMarkers: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            authorId: 'user1',
            status: 'draft',
            category: ContentCategory.TUTORIAL,
            targetAudience: [TargetAudience.EARLY_YEARS, TargetAudience.KEY_STAGE_1],
            estimatedDurationSeconds: 180
          }
        ];
        
        setVideos(mockVideos);
        setScripts(mockScripts);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching videos and scripts:', err);
        setError('Failed to load video library. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchVideosAndScripts();
  }, []);
  
  // Handle script creation
  const handleScriptCreated = (script: AvatarVideoScript) => {
    setScripts([...scripts, script]);
    setIsCreatingScript(false);
  };
  
  // Handle video generation
  const handleVideoGenerated = (video: AvatarVideoMetadata) => {
    setVideos([...videos, video]);
    setSelectedScript(null);
  };
  
  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
    
    const matchesAudience = audienceFilter === 'all' || 
      video.targetAudience.includes(audienceFilter as TargetAudience);
    
    return matchesSearch && matchesCategory && matchesAudience;
  });
  
  // Filter scripts based on search and filters
  const filteredScripts = scripts.filter(script => {
    const matchesSearch = searchQuery === '' || 
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter;
    
    const matchesAudience = audienceFilter === 'all' || 
      script.targetAudience.includes(audienceFilter as TargetAudience);
    
    return matchesSearch && matchesCategory && matchesAudience;
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format enum for display
  const formatEnum = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Render video card
  const renderVideoCard = (video: AvatarVideoMetadata) => {
    return (
      <Card key={video.id} className="overflow-hidden">
        <div className="aspect-video bg-muted relative">
          <div className="absolute inset-0 flex items-centre justify-centre">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
            {formatDuration(video.durationSeconds)}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{video.title}</CardTitle>
          <CardDescription className="flex items-centre">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(video.createdAt)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge>{formatEnum(video.category)}</Badge>
            {video.targetAudience.map(audience => (
              <Badge key={audience} variant="outline">
                {formatEnum(audience)}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description || 'No description available'}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onSelectVideo && onSelectVideo(video)}
          >
            <Play className="h-4 w-4 mr-2" />
            Select Video
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render script card
  const renderScriptCard = (script: AvatarVideoScript) => {
    return (
      <Card key={script.id} className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{script.title}</CardTitle>
          <CardDescription className="flex items-centre">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(script.createdAt)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge>{formatEnum(script.category)}</Badge>
            {script.targetAudience.map(audience => (
              <Badge key={audience} variant="outline">
                {formatEnum(audience)}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {script.content}
          </p>
          
          <div className="mt-2 flex items-centre text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              Estimated duration: {formatDuration(script.estimatedDurationSeconds)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setSelectedScript(script)}
            >
              <Video className="h-4 w-4 mr-2" />
              Generate Video
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-none"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-none text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  // If a script is selected for video generation, show the video generator
  if (selectedScript) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedScript(null)}
          className="mb-4"
        >
          ← Back to Library
        </Button>
        
        <VideoGenerator 
          script={selectedScript} 
          onVideoGenerated={handleVideoGenerated} 
        />
      </div>
    );
  }
  
  // If creating a new script, show the script editor
  if (isCreatingScript) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setIsCreatingScript(false)}
          className="mb-4"
        >
          ← Back to Library
        </Button>
        
        <ScriptEditor onScriptCreated={handleScriptCreated} />
      </div>
    );
  }
  
  return (
    <div className="video-library">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h2 className="text-2xl font-bold">Avatar Video Library</h2>
          <p className="text-muted-foreground">
            Manage and create AI avatar videos for your educational content
          </p>
        </div>
        
        <Button onClick={() => setIsCreatingScript(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Script
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos and scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select 
            value={categoryFilter} 
            onValueChange={(value) => setCategoryFilter(value as ContentCategory | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(ContentCategory).map(category => (
                <SelectItem key={category} value={category}>
                  {formatEnum(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={audienceFilter} 
            onValueChange={(value) => setAudienceFilter(value as TargetAudience | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audiences</SelectItem>
              {Object.values(TargetAudience).map(audience => (
                <SelectItem key={audience} value={audience}>
                  {formatEnum(audience)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos">Videos ({filteredVideos.length})</TabsTrigger>
            <TabsTrigger value="scripts">Scripts ({filteredScripts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="pt-4">
            {isLoading ? (
              <div className="flex items-centre justify-centre p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2">Loading videos...</span>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="flex flex-col items-centre justify-centre p-12 border rounded-lg bg-muted/50">
                <Film className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No videos found</h3>
                <p className="text-muted-foreground text-centre mb-6">
                  {searchQuery || categoryFilter !== 'all' || audienceFilter !== 'all' ? 
                    "No videos match your search criteria. Try adjusting your filters." : 
                    "You haven't created any videos yet. Start by creating a script."}
                </p>
                <Button onClick={() => setIsCreatingScript(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Script
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(renderVideoCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scripts" className="pt-4">
            {isLoading ? (
              <div className="flex items-centre justify-centre p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2">Loading scripts...</span>
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="flex flex-col items-centre justify-centre p-12 border rounded-lg bg-muted/50">
                <Edit className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No scripts found</h3>
                <p className="text-muted-foreground text-centre mb-6">
                  {searchQuery || categoryFilter !== 'all' || audienceFilter !== 'all' ? 
                    "No scripts match your search criteria. Try adjusting your filters." : 
                    "You haven't created any scripts yet."}
                </p>
                <Button onClick={() => setIsCreatingScript(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Script
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScripts.map(renderScriptCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoLibrary;
