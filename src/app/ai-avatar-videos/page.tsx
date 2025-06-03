'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ComprehensiveNavigation from '@/components/navigation/comprehensive-navigation';
import { 
  Play, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Star,
  BookOpen,
  Users,
  Shield,
  Heart,
  Globe,
  HelpCircle,
  Database,
  MessageSquare
} from 'lucide-react';

export default function AvatarVideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dr. Scott's 14 completed avatar videos with provided IDs
  const drScottVideos = [
    {
      id: '973a9f4857e14071bb2e5082bb40135b',
      title: 'FLAGSHIP INTRO VIDEO',
      description: 'Comprehensive introduction to Dr. Scott I-Patrick and the EdPsych Connect platform',
      duration: '4:32',
      category: 'introduction',
      thumbnail: '/images/avatars/dr-scott-intro.jpg',
      featured: true
    },
    {
      id: '8e2d334be9d64a0da44cc126e046f2f8',
      title: 'Dashboard Welcome - All Users',
      description: 'Welcome guide for all users accessing their personalized dashboards',
      duration: '2:15',
      category: 'dashboard',
      thumbnail: '/images/avatars/dashboard-welcome.jpg'
    },
    {
      id: 'dd8cb316033c4fc2b3d84580c339d50c',
      title: 'Professional Collaboration Space',
      description: 'Guide to using collaborative tools for professional development',
      duration: '3:20',
      category: 'collaboration',
      thumbnail: '/images/avatars/collaboration.jpg'
    },
    {
      id: 'c18d650dd74f4f3da88bff0676dd0042',
      title: 'Getting Started Guide',
      description: 'Step-by-step guide for new users to navigate the platform',
      duration: '2:45',
      category: 'getting-started',
      thumbnail: '/images/avatars/getting-started.jpg'
    },
    {
      id: 'f6598a293dc94dc7b6ebd446c01cdc34',
      title: 'Platform Security Overview',
      description: 'Understanding security features and data protection measures',
      duration: '2:30',
      category: 'security',
      thumbnail: '/images/avatars/security.jpg'
    },
    {
      id: '9b2ac61ef7cc4d25abdbbcc2de0e45b0',
      title: 'Assessment and Progress Tracking',
      description: 'How to use assessment tools and track student progress effectively',
      duration: '3:45',
      category: 'assessment',
      thumbnail: '/images/avatars/assessment.jpg'
    },
    {
      id: '7547b35f3bfa4c189df5a121a330ecab',
      title: 'Restorative Justice Framework',
      description: 'Dr. Scott\'s doctoral research on restorative justice in education',
      duration: '4:10',
      category: 'restorative-justice',
      thumbnail: '/images/avatars/restorative-justice.jpg'
    },
    {
      id: '378b41b7c2cb4852ab965ede79901686',
      title: 'Learning Analytics Dashboard',
      description: 'Understanding and interpreting learning analytics data',
      duration: '3:15',
      category: 'analytics',
      thumbnail: '/images/avatars/analytics.jpg'
    },
    {
      id: '648adb1e0fee434c9e2141438ba1ff5f',
      title: 'Community Partnerships',
      description: 'Building effective partnerships within the educational community',
      duration: '2:55',
      category: 'community',
      thumbnail: '/images/avatars/partnerships.jpg'
    },
    {
      id: 'eade752b5d134710b9bb18d0e4cbea8e',
      title: 'Crisis Support and Wellbeing',
      description: 'Supporting student wellbeing and crisis intervention strategies',
      duration: '3:30',
      category: 'wellbeing',
      thumbnail: '/images/avatars/wellbeing.jpg'
    },
    {
      id: '6c21771d40fc4c24a531708fa3b21788',
      title: 'Global Citizenship and Social Justice',
      description: 'Promoting global citizenship and social justice in education',
      duration: '3:25',
      category: 'social-justice',
      thumbnail: '/images/avatars/global-citizenship.jpg'
    },
    {
      id: '26946cb6af6242f58ddc6f0eeb455132',
      title: 'Platform Navigation Help',
      description: 'Comprehensive guide to navigating all platform features',
      duration: '2:40',
      category: 'help',
      thumbnail: '/images/avatars/navigation.jpg'
    },
    {
      id: 'ef44f068f8c742f8adafcb97ec1c4a8f',
      title: 'Data and Privacy Information',
      description: 'Understanding data handling, privacy policies, and user rights',
      duration: '2:20',
      category: 'privacy',
      thumbnail: '/images/avatars/privacy.jpg'
    },
    {
      id: '8efabf923abd452dbd6e1c5f982b94e1',
      title: 'Feedback and Improvement',
      description: 'How to provide feedback and contribute to platform improvement',
      duration: '2:10',
      category: 'feedback',
      thumbnail: '/images/avatars/feedback.jpg'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Videos', icon: BookOpen },
    { id: 'introduction', name: 'Introduction', icon: User },
    { id: 'dashboard', name: 'Dashboard', icon: BookOpen },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'assessment', name: 'Assessment', icon: BookOpen },
    { id: 'restorative-justice', name: 'Restorative Justice', icon: Heart },
    { id: 'analytics', name: 'Analytics', icon: Database },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'wellbeing', name: 'Wellbeing', icon: Heart },
    { id: 'social-justice', name: 'Social Justice', icon: Globe },
    { id: 'help', name: 'Help', icon: HelpCircle },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'feedback', name: 'Feedback', icon: MessageSquare }
  ];

  const filteredVideos = drScottVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoClick = (videoId: string) => {
    // Navigate to video player page
    window.open(`/ai-avatar-videos/view/${videoId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ComprehensiveNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
            <Star className="w-4 h-4 mr-2" />
            Dr. Scott I-Patrick Avatar Videos
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Evidence-Based Guidance from Dr. Scott
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           Access comprehensive video guidance from Dr. Scott I-Patrick, DEdPsych BSc CPsychol 
        MBPSs, covering all aspects of the EdPsych Connect platform and educational psychology best 
        practices.       </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Video */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Video</h2>
            {drScottVideos.filter(video => video.featured).map((video) => (
              <Card key={video.id} className="overflow-hidden shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 relative">
                      <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-sm opacity-75">Video Preview</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleVideoClick(video.id)}
                        className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-16 h-16 text-white" />
                      </Button>
                    </div>
                    <div className="lg:w-1/2 p-8 text-white">
                      <Badge className="bg-white/20 text-white mb-4">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                      <h3 className="text-2xl font-bold mb-4">{video.title}</h3>
                      <p className="text-white/90 mb-6">{video.description}</p>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{video.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm">Dr. Scott I-Patrick</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleVideoClick(video.id)}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        Watch Now
                        <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Video Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Videos' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600">{filteredVideos.length} videos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(video => !video.featured || selectedCategory !== 'all').map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Play className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-xs">Video Preview</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleVideoClick(video.id)}
                    className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-12 h-12 text-white" />
                  </Button>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>Dr. Scott</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleVideoClick(video.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* About Dr. Scott */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Scott I-Patrick</h3>
                <p className="text-blue-600 font-medium mb-4">
                  DEdPsych BSc CPsychol MBPSs • HCPC Registered: PYL042340
                </p>
                <p className="text-gray-700">
                  With over 20 years of experience in education and 12+ years specializing in educational psychology, 
                  Dr. Scott provides expert guidance through these comprehensive video resources. His evidence-based 
                  approach combines rigorous research with practical application to support every learner's journey.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

