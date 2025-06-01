'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeygenService } from '@/lib/heygen/heygen-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Play, Download, Share, Trash2, Search, Filter } from 'lucide-react';

export interface HeygenVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  created_at: string;
  avatar: { name: string };
  duration: number;
}

// Mock data for testing
const mockVideos: any[] = [
  {
    id: 'v1',
    title: 'Welcome to EdPsych Connect',
    thumbnail: 'https://example.com/thumbnail1.jpg',
    url: 'https://example.com/video1.mp4',
    created_at: '2025-05-20T10:30:00Z',
    avatar: { name: 'Teacher Avatar' },
    duration: 45
  },
  {
    id: 'v2',
    title: 'Mathematics Lesson Introduction',
    thumbnail: 'https://example.com/thumbnail2.jpg',
    url: 'https://example.com/video2.mp4',
    created_at: '2025-05-18T14:15:00Z',
    avatar: { name: 'Math Tutor' },
    duration: 120
  },
  {
    id: 'v3',
    title: 'Reading Comprehension Strategies',
    thumbnail: 'https://example.com/thumbnail3.jpg',
    url: 'https://example.com/video3.mp4',
    created_at: '2025-05-15T09:45:00Z',
    avatar: { name: 'Literacy Coach' },
    duration: 180
  }
];

export function HeygenVideoLibrary() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<HeygenVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<HeygenVideo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  
  const videosPerPage = 6;
  
  // Load videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would call the API
        // const response = await getVideos();
        // setVideos(response);
        
        // Using mock data for demonstration
        setVideos(mockVideos);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  const handleVideoClick = (video: HeygenVideo) => {
    setSelectedVideo(video);
  };
  
  const confirmDelete = async (videoId: string) => {
    setVideoToDelete(videoId);
    setShowDeleteConfirm(true);
  };
  
  const handleDelete = async () => {
    if (!videoToDelete) return;
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call the API
      // await deleteVideo(videoToDelete);
      
      // Update local state
      setVideos(videos.filter(v => v.id !== videoToDelete));
      setShowDeleteConfirm(false);
      setVideoToDelete(null);
      
      if (selectedVideo && selectedVideo.id === videoToDelete) {
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = (video: HeygenVideo) => {
    window.open(video.url, '_blank');
  };
  
  const handleShare = async (video: HeygenVideo) => {
    try {
      await navigator.clipboard.writeText(video.url);
      alert('Video URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL. Please try again.');
    }
  };
  
  // Ensure videos and savedVideos are defined
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.avatar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  );
  
  const totalPages = Math.ceil(sortedVideos.length / videosPerPage);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">AI Avatar Video Library</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading videos...</span>
        </div>
      ) : paginatedVideos.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">No videos found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? 'Try a different search term' : 'Generate your first AI avatar video'}
          </p>
          <Button className="mt-4" asChild>
            <a href="/ai-avatar-videos/generate">Create New Video</a>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVideos.map(video => (
              <div 
                key={video.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative aspect-video bg-muted">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for missing thumbnails
                      e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-primary/80 p-3">
                      <Play className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium truncate">{video.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {video.avatar.name} • {formatDuration(video.duration)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Created: {new Date(video.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-end mt-2 space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(video);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(video);
                      }}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(video.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
              <DialogDescription>
                Created by {selectedVideo.avatar.name} on {new Date(selectedVideo.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <video 
                src={selectedVideo.url} 
                controls 
                className="w-full h-full"
                poster={selectedVideo.thumbnail}
              />
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleDownload(selectedVideo)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleShare(selectedVideo)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              <Button variant="destructive" onClick={() => confirmDelete(selectedVideo.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {showDeleteConfirm && (
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the video.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

// Add default export to fix import errors
export default HeygenVideoLibrary;
