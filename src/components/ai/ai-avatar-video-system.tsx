import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Settings, List, Grid, Search, Filter, Download } from 'lucide-react';

/**
 * AI Avatar Video System for EdPsych Connect
 * Provides educational video content with AI avatars
 */
const AIAvatarVideoSystem = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    ageGroup: 'all',
    subject: 'all',
    sortBy: 'newest'
  });
  
  const videoRef = useRef(null);
  
  // Sample video data
  const [videos, setVideos] = useState([
    {
      id: 'video1',
      title: 'Understanding Emotions',
      description: 'Learn about different emotions and how to recognize them in yourself and others.',
      thumbnail: '/assets/videos/emotions-thumbnail.jpg',
      duration: 245, // in seconds
      category: 'emotional-wellbeing',
      ageGroup: '5-8',
      subject: 'social-emotional',
      views: 1245,
      dateAdded: '2025-05-15',
      avatarName: 'Emma',
      featured: true,
      completed: false,
      progress: 0
    },
    {
      id: 'video2',
      title: 'Introduction to Fractions',
      description: 'Basic concepts of fractions explained with visual examples.',
      thumbnail: '/assets/videos/fractions-thumbnail.jpg',
      duration: 318, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'mathematics',
      views: 987,
      dateAdded: '2025-05-10',
      avatarName: 'Professor Alex',
      featured: true,
      completed: false,
      progress: 0
    },
    {
      id: 'video3',
      title: 'Growth Mindset for Learning',
      description: 'Discover how a growth mindset can help you overcome challenges in learning.',
      thumbnail: '/assets/videos/growth-mindset-thumbnail.jpg',
      duration: 275, // in seconds
      category: 'learning-strategies',
      ageGroup: '9-12',
      subject: 'study-skills',
      views: 756,
      dateAdded: '2025-05-05',
      avatarName: 'Coach Sam',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video4',
      title: 'Dealing with Anxiety',
      description: 'Practical strategies to manage anxiety in school and social situations.',
      thumbnail: '/assets/videos/anxiety-thumbnail.jpg',
      duration: 362, // in seconds
      category: 'emotional-wellbeing',
      ageGroup: '13-16',
      subject: 'mental-health',
      views: 1532,
      dateAdded: '2025-05-01',
      avatarName: 'Dr. Maya',
      featured: true,
      completed: false,
      progress: 0
    },
    {
      id: 'video5',
      title: 'The Water Cycle',
      description: 'Learn about the water cycle and how it works in our environment.',
      thumbnail: '/assets/videos/water-cycle-thumbnail.jpg',
      duration: 289, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'science',
      views: 845,
      dateAdded: '2025-04-28',
      avatarName: 'Professor Alex',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video6',
      title: 'Organization Skills',
      description: 'Tips and strategies for staying organized with schoolwork.',
      thumbnail: '/assets/videos/organization-thumbnail.jpg',
      duration: 254, // in seconds
      category: 'executive-function',
      ageGroup: '9-12',
      subject: 'study-skills',
      views: 678,
      dateAdded: '2025-04-25',
      avatarName: 'Coach Sam',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video7',
      title: 'Making Friends',
      description: 'Social skills for building and maintaining friendships.',
      thumbnail: '/assets/videos/friends-thumbnail.jpg',
      duration: 312, // in seconds
      category: 'social-skills',
      ageGroup: '5-8',
      subject: 'social-emotional',
      views: 923,
      dateAdded: '2025-04-22',
      avatarName: 'Emma',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video8',
      title: 'Reading Comprehension Strategies',
      description: 'Effective techniques to improve understanding of what you read.',
      thumbnail: '/assets/videos/reading-thumbnail.jpg',
      duration: 342, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'english',
      views: 1056,
      dateAdded: '2025-04-20',
      avatarName: 'Professor Alex',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video9',
      title: 'Mindfulness for Focus',
      description: 'Simple mindfulness exercises to improve concentration and attention.',
      thumbnail: '/assets/videos/mindfulness-thumbnail.jpg',
      duration: 267, // in seconds
      category: 'emotional-wellbeing',
      ageGroup: '9-12',
      subject: 'mental-health',
      views: 876,
      dateAdded: '2025-04-18',
      avatarName: 'Dr. Maya',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video10',
      title: 'Understanding Bullying',
      description: 'What is bullying, why it happens, and what to do about it.',
      thumbnail: '/assets/videos/bullying-thumbnail.jpg',
      duration: 298, // in seconds
      category: 'social-skills',
      ageGroup: '9-12',
      subject: 'social-emotional',
      views: 1345,
      dateAdded: '2025-04-15',
      avatarName: 'Emma',
      featured: true,
      completed: false,
      progress: 0
    },
    {
      id: 'video11',
      title: 'Time Management',
      description: 'Learn how to manage your time effectively for school and activities.',
      thumbnail: '/assets/videos/time-management-thumbnail.jpg',
      duration: 283, // in seconds
      category: 'executive-function',
      ageGroup: '13-16',
      subject: 'study-skills',
      views: 789,
      dateAdded: '2025-04-12',
      avatarName: 'Coach Sam',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video12',
      title: 'The Solar System',
      description: 'Explore the planets and other objects in our solar system.',
      thumbnail: '/assets/videos/solar-system-thumbnail.jpg',
      duration: 325, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'science',
      views: 1123,
      dateAdded: '2025-04-10',
      avatarName: 'Professor Alex',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video13',
      title: 'Handling Strong Emotions',
      description: 'Strategies for managing intense feelings like anger and frustration.',
      thumbnail: '/assets/videos/strong-emotions-thumbnail.jpg',
      duration: 274, // in seconds
      category: 'emotional-wellbeing',
      ageGroup: '5-8',
      subject: 'mental-health',
      views: 965,
      dateAdded: '2025-04-08',
      avatarName: 'Dr. Maya',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video14',
      title: 'Basic Grammar Rules',
      description: 'Essential grammar concepts for clear writing and speaking.',
      thumbnail: '/assets/videos/grammar-thumbnail.jpg',
      duration: 308, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'english',
      views: 842,
      dateAdded: '2025-04-05',
      avatarName: 'Professor Alex',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video15',
      title: 'Problem-Solving Steps',
      description: 'A systematic approach to solving problems in school and life.',
      thumbnail: '/assets/videos/problem-solving-thumbnail.jpg',
      duration: 295, // in seconds
      category: 'learning-strategies',
      ageGroup: '9-12',
      subject: 'study-skills',
      views: 731,
      dateAdded: '2025-04-03',
      avatarName: 'Coach Sam',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video16',
      title: 'Understanding Different Perspectives',
      description: 'How to see situations from other people\'s points of view.',
      thumbnail: '/assets/videos/perspectives-thumbnail.jpg',
      duration: 267, // in seconds
      category: 'social-skills',
      ageGroup: '9-12',
      subject: 'social-emotional',
      views: 689,
      dateAdded: '2025-04-01',
      avatarName: 'Emma',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video17',
      title: 'Test Anxiety Management',
      description: 'Techniques to reduce anxiety before and during tests.',
      thumbnail: '/assets/videos/test-anxiety-thumbnail.jpg',
      duration: 286, // in seconds
      category: 'emotional-wellbeing',
      ageGroup: '13-16',
      subject: 'mental-health',
      views: 1087,
      dateAdded: '2025-03-29',
      avatarName: 'Dr. Maya',
      featured: false,
      completed: false,
      progress: 0
    },
    {
      id: 'video18',
      title: 'Introduction to Coding',
      description: 'Basic concepts of computer programming for beginners.',
      thumbnail: '/assets/videos/coding-thumbnail.jpg',
      duration: 335, // in seconds
      category: 'academic',
      ageGroup: '9-12',
      subject: 'technology',
      views: 1256,
      dateAdded: '2025-03-27',
      avatarName: 'Professor Alex',
      featured: true,
      completed: false,
      progress: 0
    }
  ]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Handle video selection
  const selectVideo = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    
    // Update video progress in the list
    const updatedVideos = videos.map(v => {
      if (v.id === video.id) {
        return { ...v, progress: v.progress > 0 ? v.progress : 0.1 };
      }
      return v;
    });
    setVideos(updatedVideos);
  };
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      
      // Update video progress in the list
      if (currentVideo) {
        const updatedVideos = videos.map(v => {
          if (v.id === currentVideo.id) {
            return { 
              ...v, 
              progress: (videoRef.current.currentTime / videoRef.current.duration) * 100,
              completed: videoRef.current.currentTime >= videoRef.current.duration * 0.9
            };
          }
          return v;
        });
        setVideos(updatedVideos);
      }
    }
  };
  
  // Handle seeking
  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };
  
  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    
    // Mark video as completed
    if (currentVideo) {
      const updatedVideos = videos.map(v => {
        if (v.id === currentVideo.id) {
          return { ...v, completed: true, progress: 100 };
        }
        return v;
      });
      setVideos(updatedVideos);
    }
  };
  
  // Handle video metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.category === 'all' || video.category === filters.category;
    
    // Age group filter
    const matchesAgeGroup = filters.ageGroup === 'all' || video.ageGroup === filters.ageGroup;
    
    // Subject filter
    const matchesSubject = filters.subject === 'all' || video.subject === filters.subject;
    
    return matchesSearch && matchesCategory && matchesAgeGroup && matchesSubject;
  });
  
  // Sort videos based on selected sort option
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'oldest':
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      case 'popular':
        return b.views - a.views;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Get videos based on active tab
  const getTabVideos = () => {
    switch (activeTab) {
      case 'featured':
        return sortedVideos.filter(video => video.featured);
      case 'recent':
        return sortedVideos.slice(0, 5);
      case 'completed':
        return sortedVideos.filter(video => video.completed);
      case 'inProgress':
        return sortedVideos.filter(video => video.progress > 0 && !video.completed);
      default:
        return sortedVideos;
    }
  };
  
  const displayVideos = getTabVideos();
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Avatar Video Library</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Educational videos featuring AI avatars to support your learning journey
        </p>
      </div>
      
      {/* Video Player Section */}
      {currentVideo ? (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <video
              ref={videoRef}
              src={`/assets/videos/${currentVideo.id}.mp4`}
              poster={currentVideo.thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onLoadedMetadata={handleMetadataLoaded}
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Video Controls */}
          <div className="p-4 bg-gray-50 dark:bg-neutral-750">
            {/* Progress Bar */}
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatTime(videoRef.current ? videoRef.current.currentTime : 0)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const index = videos.findIndex(v => v.id === currentVideo.id);
                    if (index > 0) {
                      selectVideo(videos[index - 1]);
                    }
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  disabled={videos.findIndex(v => v.id === currentVideo.id) === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                
                <button
                  onClick={() => {
                    const index = videos.findIndex(v => v.id === currentVideo.id);
                    if (index < videos.length - 1) {
                      selectVideo(videos[index + 1]);
                    }
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  disabled={videos.findIndex(v => v.id === currentVideo.id) === videos.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                
                <button
                  onClick={() => {
                    // Toggle fullscreen
                    if (videoRef.current) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        videoRef.current.requestFullscreen();
                      }
                    }
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Video Info */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {currentVideo.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="mr-3">Avatar: {currentVideo.avatarName}</span>
              <span className="mr-3">{formatTime(currentVideo.duration)}</span>
              <span>{currentVideo.views.toLocaleString()} views</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentVideo.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a video to start watching
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse our collection of educational videos featuring AI avatars designed to support your learning journey.
            </p>
          </div>
        </div>
      )}
      
      {/* Video Library Section */}
      <div>
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'featured'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Featured
            </button>
            
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All Videos
            </button>
            
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'recent'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Recently Added
            </button>
            
            <button
              onClick={() => setActiveTab('inProgress')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'inProgress'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              In Progress
            </button>
            
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={() => {
                  // Toggle filter dropdown
                  document.getElementById('filterDropdown').classList.toggle('hidden');
                }}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Filter Dropdown */}
          <div id="filterDropdown" className="hidden mt-2 p-4 bg-white dark:bg-neutral-750 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="categoryFilter"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="emotional-wellbeing">Emotional Wellbeing</option>
                  <option value="executive-function">Executive Function</option>
                  <option value="learning-strategies">Learning Strategies</option>
                  <option value="social-skills">Social Skills</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ageGroupFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age Group
                </label>
                <select
                  id="ageGroupFilter"
                  value={filters.ageGroup}
                  onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                >
                  <option value="all">All Ages</option>
                  <option value="5-8">Ages 5-8</option>
                  <option value="9-12">Ages 9-12</option>
                  <option value="13-16">Ages 13-16</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  id="subjectFilter"
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                >
                  <option value="all">All Subjects</option>
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="social-emotional">Social-Emotional</option>
                  <option value="study-skills">Study Skills</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortByFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sortByFilter"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Grid/List */}
        <div className="p-4">
          {displayVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No videos found matching your criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayVideos.map(video => (
                <div 
                  key={video.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => selectVideo(video)}
                >
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      {formatTime(video.duration)}
                    </div>
                    {video.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{video.avatarName}</span>
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayVideos.map(video => (
                <div 
                  key={video.id}
                  className="flex bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => selectVideo(video)}
                >
                  <div className="relative w-48 flex-shrink-0">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 h-full">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      {formatTime(video.duration)}
                    </div>
                    {video.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="mr-3">{video.avatarName}</span>
                      <span className="mr-3">{video.views.toLocaleString()} views</span>
                      <span>{new Date(video.dateAdded).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-2 capitalize">
                        {video.category.replace('-', ' ')}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-2">
                        Ages {video.ageGroup}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 capitalize">
                        {video.subject.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAvatarVideoSystem;
