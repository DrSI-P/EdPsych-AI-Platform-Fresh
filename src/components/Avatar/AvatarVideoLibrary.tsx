import React, { useState, useEffect } from 'react';
import { Avatar, AvatarVideoPlayer } from '../components/Avatar';

interface AvatarVideoData {
  id: string;
  title: string;
  description: string;
  avatarId: string;
  category: string;
  tags: string[];
  nextVideoId?: string;
}

const AvatarVideoLibrary: React.FC = () => {
  const [videos, setVideos] = useState<AvatarVideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<AvatarVideoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard'>('standard');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load video library data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to get video library data
    setTimeout(() => {
      // Mock data - in production this would come from an API
      const mockVideos: AvatarVideoData[] = [
        {
          id: 'intro-platform',
          title: 'Welcome to EdPsych Connect',
          description: 'An introduction to the EdPsych Connect platform and its features.',
          avatarId: 'guide',
          category: 'introduction',
          tags: ['welcome', 'overview', 'introduction'],
          nextVideoId: 'student-portal'
        },
        {
          id: 'student-portal',
          title: 'Student Portal Guide',
          description: 'Learn how to navigate the student portal and access personalized learning resources.',
          avatarId: 'teacher',
          category: 'navigation',
          tags: ['student', 'portal', 'navigation'],
          nextVideoId: 'educator-resources'
        },
        {
          id: 'educator-resources',
          title: 'Educator Resources Guide',
          description: 'Discover the comprehensive resources available for educators.',
          avatarId: 'professor',
          category: 'navigation',
          tags: ['educator', 'resources', 'navigation'],
          nextVideoId: 'learning-styles'
        },
        {
          id: 'learning-styles',
          title: 'Learning Styles Introduction',
          description: 'Understanding different learning styles and how the platform adapts to them.',
          avatarId: 'counselor',
          category: 'educational',
          tags: ['learning', 'styles', 'adaptation'],
          nextVideoId: 'emotional-wellbeing'
        },
        {
          id: 'emotional-wellbeing',
          title: 'Emotional Wellbeing Tools Guide',
          description: 'Explore tools designed to support emotional wellbeing and mental health.',
          avatarId: 'therapist',
          category: 'wellbeing',
          tags: ['emotional', 'wellbeing', 'mental health'],
          nextVideoId: 'executive-function'
        }
      ];
      
      setVideos(mockVideos);
      setSelectedVideo(mockVideos[0]); // Select first video by default
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle video completion
  const handleVideoComplete = () => {
    if (selectedVideo && selectedVideo.nextVideoId) {
      const nextVideo = videos.find(video => video.id === selectedVideo.nextVideoId);
      if (nextVideo) {
        setSelectedVideo(nextVideo);
      }
    }
  };

  // Handle video selection
  const handleVideoSelect = (video: AvatarVideoData) => {
    setSelectedVideo(video);
  };

  // Handle age group change
  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeGroup(e.target.value as 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard');
  };

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  // Filter videos by category
  const filteredVideos = filterCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === filterCategory);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(videos.map(video => video.category))];

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gradient">AI Avatar Video Library</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main video player */}
        <div className="md:col-span-2">
          {selectedVideo && (
            <AvatarVideoPlayer
              videoId={selectedVideo.id}
              title={selectedVideo.title}
              description={selectedVideo.description}
              avatarId={selectedVideo.avatarId}
              ageGroup={ageGroup}
              onComplete={handleVideoComplete}
              className="mb-6"
            />
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Age group selector */}
          <div className="mb-6">
            <label htmlFor="age-group" className="block text-sm font-medium text-gray-700 mb-2">
              Select Age Group:
            </label>
            <select
              id="age-group"
              value={ageGroup}
              onChange={handleAgeGroupChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="nursery">Nursery</option>
              <option value="early-primary">Early Primary</option>
              <option value="late-primary">Late Primary</option>
              <option value="secondary">Secondary</option>
              <option value="standard">Standard</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div className="mb-6">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Video list */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Videos</h2>
            <div className="space-y-4">
              {filteredVideos.map(video => (
                <div 
                  key={video.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedVideo && selectedVideo.id === video.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <Avatar 
                        avatarId={video.avatarId}
                        size="small"
                        ageGroup={ageGroup}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm truncate">
                        {selectedVideo && selectedVideo.id === video.id 
                          ? 'Now Playing' 
                          : video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarVideoLibrary;
