'use client';

import React, { useState, useEffect } from 'react';
import { AIAvatarVideo, AIAvatarVideoCategory, AIAvatarVideoAudience } from './types';
import { AIAvatarVideoService } from './ai-avatar-video-service';
import { AIAvatarVideoPlayer } from './ai-avatar-video-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Search, Filter, Clock, User, Tag } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

/**
 * AI Avatar Video Library Component
 * 
 * Displays a searchable, filterable library of AI Avatar videos
 * organised by categories and audiences.
 */
export const AIAvatarVideoLibrary: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<AIAvatarVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<AIAvatarVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AIAvatarVideoCategory | 'all'>('all');
  const [selectedAudience, setSelectedAudience] = useState<AIAvatarVideoAudience | 'all'>('all');
  const [selectedVideo, setSelectedVideo] = useState<AIAvatarVideo | null>(null);
  
  const videoService = AIAvatarVideoService.getInstance();

  // Load videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        await videoService.initialize();
        const allVideos = await videoService.getAllVideos();
        setVideos(allVideos);
        setFilteredVideos(allVideos);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load videos:', error);
        setLoading(false);
      }
    };
    
    loadVideos();
  }, []);

  // Filter videos when search query, category, or audience changes
  useEffect(() => {
    const filterVideos = async () => {
      let result = [...videos];
      
      // Filter by search query
      if (searchQuery) {
        result = await videoService.searchVideos(searchQuery);
      }
      
      // Filter by category
      if (selectedCategory !== 'all') {
        result = result.filter(video => video.category === selectedCategory);
      }
      
      // Filter by audience
      if (selectedAudience !== 'all') {
        result = result.filter(video => video.audience === selectedAudience);
      }
      
      setFilteredVideos(result);
    };
    
    filterVideos();
  }, [searchQuery, selectedCategory, selectedAudience, videos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as AIAvatarVideoCategory | 'all');
  };

  const handleAudienceChange = (audience: string) => {
    setSelectedAudience(audience as AIAvatarVideoAudience | 'all');
  };

  const handleVideoSelect = (video: AIAvatarVideo) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="ai-avatar-video-library p-4">
        <div className="mb-6">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Video player view
  if (selectedVideo) {
    return (
      <div className="ai-avatar-video-player-view p-4">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={handleCloseVideo}
        >
          Back to Library
        </Button>
        
        <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
        <p className="text-grey-600 mb-4">{selectedVideo.description}</p>
        
        <AIAvatarVideoPlayer 
          videoId={selectedVideo.id} 
          showControls={true}
          showCaptions={true}
        />
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">About this video</h3>
          <div className="flex flex-wrap gap-4 text-sm text-grey-600">
            <div className="flex items-centre">
              <Clock size={16} className="mr-1" />
              <span>{formatDuration(selectedVideo.duration)}</span>
            </div>
            <div className="flex items-centre">
              <User size={16} className="mr-1" />
              <span>{selectedVideo.audience.replace('_', ' ')}</span>
            </div>
            <div className="flex items-centre">
              <Tag size={16} className="mr-1" />
              <span>{selectedVideo.category.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedVideo.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-grey-100 text-grey-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Library view
  return (
    <div className="ai-avatar-video-library p-4">
      <h1 className="text-3xl font-bold mb-6">AI Avatar Video Library</h1>
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-400" size={18} />
          <Input
            type="text"
            placeholder="Search videos..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              className="border rounded-md p-2 w-full"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.values(AIAvatarVideoCategory).map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Audience</label>
            <select 
              className="border rounded-md p-2 w-full"
              value={selectedAudience}
              onChange={(e) => handleAudienceChange(e.target.value)}
            >
              <option value="all">All Audiences</option>
              {Object.values(AIAvatarVideoAudience).map(audience => (
                <option key={audience} value={audience}>
                  {audience.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Video grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-centre py-12">
          <h3 className="text-xl font-medium mb-2">No videos found</h3>
          <p className="text-grey-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card 
              key={video.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVideoSelect(video)}
            >
              <div className="aspect-video bg-grey-100 relative">
                <img 
                  src={video.thumbnailPath || `/api/ai-avatar/thumbnails/${video.id}`} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {formatDuration(video.duration)}
                </div>
                {video.featured && (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded">
                    Featured
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="pt-0 text-sm text-grey-600">
                <div className="flex justify-between w-full">
                  <span>{video.audience.replace('_', ' ')}</span>
                  <span>{video.category.replace('_', ' ')}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAvatarVideoLibrary;
