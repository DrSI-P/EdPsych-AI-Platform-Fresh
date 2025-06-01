import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Bookmark, 
  Star, 
  Play,
  Video,
  Printer,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Tag,
  Clock,
  User,
  Users
} from 'lucide-react';

import { Child, LearningStyle } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockChildren = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: new Date('2015-05-10'),
    yearGroup: 5,
    keyStage: 'KS2',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/child-1.png',
    learningStyle: 'VISUAL'
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Johnson',
    dateOfBirth: new Date('2017-08-22'),
    yearGroup: 3,
    keyStage: 'KS2',
    school: 'Oakwood Primary School',
    profileImageUrl: '/images/avatars/child-2.png',
    learningStyle: 'KINESTHETIC'
  }
];

// Mock resource categories
const mockCategories = [
  { id: 'c1', name: 'Reading', icon: 'BookOpen' },
  { id: 'c2', name: 'Mathematics', icon: 'Calculator' },
  { id: 'c3', name: 'Science', icon: 'Flask' },
  { id: 'c4', name: 'History', icon: 'Clock' },
  { id: 'c5', name: 'Geography', icon: 'Globe' },
  { id: 'c6', name: 'Art', icon: 'Palette' },
  { id: 'c7', name: 'Music', icon: 'Music' },
  { id: 'c8', name: 'Physical Education', icon: 'Activity' },
  { id: 'c9', name: 'Languages', icon: 'MessageCircle' },
  { id: 'c10', name: 'Technology', icon: 'Cpu' }
];

// Mock resources
const mockResources = [
  {
    id: 'r1',
    title: 'Reading Comprehension Strategies',
    description: 'A guide to help your child develop strong reading comprehension skills with practical exercises and tips.',
    category: 'c1',
    type: 'guide',
    format: 'pdf',
    fileSize: '2.4 MB',
    thumbnail: '/images/resources/reading-comprehension.jpg',
    url: '/resources/reading-comprehension-strategies.pdf',
    learningStyles: ['VISUAL', 'READ_WRITE'],
    keyStages: ['KS2'],
    yearGroups: [4, 5, 6],
    subjects: ['ENGLISH'],
    dateAdded: new Date('2025-04-15'),
    popularity: 4.8,
    downloadCount: 342,
    tags: ['reading', 'comprehension', 'literacy'],
    isBookmarked: true,
    isRecommended: true,
    childId: '1'
  },
  {
    id: 'r2',
    title: 'Fractions and Decimals Interactive Workbook',
    description: 'An interactive workbook to help children understand fractions and decimals through visual representations and hands-on activities.',
    category: 'c2',
    type: 'workbook',
    format: 'pdf',
    fileSize: '3.1 MB',
    thumbnail: '/images/resources/fractions.jpg',
    url: '/resources/fractions-decimals-workbook.pdf',
    learningStyles: ['VISUAL', 'KINESTHETIC'],
    keyStages: ['KS2'],
    yearGroups: [4, 5],
    subjects: ['MATHEMATICS'],
    dateAdded: new Date('2025-04-20'),
    popularity: 4.6,
    downloadCount: 289,
    tags: ['fractions', 'decimals', 'mathematics'],
    isBookmarked: false,
    isRecommended: true,
    childId: '1'
  },
  {
    id: 'r3',
    title: 'Science Experiments for Home',
    description: 'A collection of safe and engaging science experiments that can be done at home with everyday materials.',
    category: 'c3',
    type: 'activity',
    format: 'pdf',
    fileSize: '4.2 MB',
    thumbnail: '/images/resources/science-experiments.jpg',
    url: '/resources/science-experiments-home.pdf',
    learningStyles: ['KINESTHETIC', 'VISUAL'],
    keyStages: ['KS1', 'KS2'],
    yearGroups: [2, 3, 4, 5, 6],
    subjects: ['SCIENCE'],
    dateAdded: new Date('2025-05-05'),
    popularity: 4.9,
    downloadCount: 412,
    tags: ['science', 'experiments', 'hands-on'],
    isBookmarked: true,
    isRecommended: false,
    childId: '1'
  },
  {
    id: 'r4',
    title: 'Phonics Practice Sheets',
    description: 'Printable worksheets to help young children practice their phonics skills and improve reading fluency.',
    category: 'c1',
    type: 'worksheet',
    format: 'pdf',
    fileSize: '1.8 MB',
    thumbnail: '/images/resources/phonics.jpg',
    url: '/resources/phonics-practice-sheets.pdf',
    learningStyles: ['VISUAL', 'AUDITORY', 'READ_WRITE'],
    keyStages: ['KS1', 'KS2'],
    yearGroups: [1, 2, 3],
    subjects: ['ENGLISH'],
    dateAdded: new Date('2025-03-10'),
    popularity: 4.7,
    downloadCount: 523,
    tags: ['phonics', 'reading', 'literacy'],
    isBookmarked: false,
    isRecommended: true,
    childId: '2'
  },
  {
    id: 'r5',
    title: 'Times Tables Songs and Rhymes',
    description: 'A collection of catchy songs and rhymes to help children memorize their times tables in a fun way.',
    category: 'c2',
    type: 'audio',
    format: 'mp3',
    fileSize: '45 MB',
    thumbnail: '/images/resources/times-tables.jpg',
    url: '/resources/times-tables-songs.zip',
    learningStyles: ['AUDITORY', 'KINESTHETIC'],
    keyStages: ['KS1', 'KS2'],
    yearGroups: [2, 3, 4],
    subjects: ['MATHEMATICS'],
    dateAdded: new Date('2025-02-28'),
    popularity: 4.5,
    downloadCount: 378,
    tags: ['times tables', 'multiplication', 'songs'],
    isBookmarked: true,
    isRecommended: true,
    childId: '2'
  },
  {
    id: 'r6',
    title: 'Ancient Egypt Interactive Timeline',
    description: 'An interactive timeline exploring the fascinating history of Ancient Egypt with activities and discussion points.',
    category: 'c4',
    type: 'interactive',
    format: 'html',
    fileSize: '12 MB',
    thumbnail: '/images/resources/ancient-egypt.jpg',
    url: '/resources/ancient-egypt-timeline.html',
    learningStyles: ['VISUAL', 'READ_WRITE'],
    keyStages: ['KS2'],
    yearGroups: [5, 6],
    subjects: ['HISTORY'],
    dateAdded: new Date('2025-05-12'),
    popularity: 4.8,
    downloadCount: 156,
    tags: ['history', 'ancient egypt', 'timeline'],
    isBookmarked: false,
    isRecommended: false,
    childId: '1'
  },
  {
    id: 'r7',
    title: 'Handwriting Practice Sheets',
    description: 'Printable sheets to help children improve their handwriting skills with guided practice.',
    category: 'c1',
    type: 'worksheet',
    format: 'pdf',
    fileSize: '1.5 MB',
    thumbnail: '/images/resources/handwriting.jpg',
    url: '/resources/handwriting-practice.pdf',
    learningStyles: ['KINESTHETIC', 'VISUAL'],
    keyStages: ['KS1', 'KS2'],
    yearGroups: [1, 2, 3],
    subjects: ['ENGLISH'],
    dateAdded: new Date('2025-04-05'),
    popularity: 4.3,
    downloadCount: 289,
    tags: ['handwriting', 'fine motor skills', 'writing'],
    isBookmarked: false,
    isRecommended: true,
    childId: '2'
  },
  {
    id: 'r8',
    title: 'Introduction to Coding for Kids',
    description: 'A beginner-friendly guide to introduce children to the basics of coding through fun activities and games.',
    category: 'c10',
    type: 'guide',
    format: 'pdf',
    fileSize: '3.8 MB',
    thumbnail: '/images/resources/coding.jpg',
    url: '/resources/intro-coding-kids.pdf',
    learningStyles: ['VISUAL', 'KINESTHETIC'],
    keyStages: ['KS2'],
    yearGroups: [4, 5, 6],
    subjects: ['COMPUTING'],
    dateAdded: new Date('2025-05-18'),
    popularity: 4.9,
    downloadCount: 203,
    tags: ['coding', 'programming', 'technology'],
    isBookmarked: true,
    isRecommended: false,
    childId: '1'
  }
];

// Mock learning style guides
const mockLearningStyleGuides = [
  {
    id: 'ls1',
    style: 'VISUAL',
    title: 'Supporting Visual Learners',
    description: 'Strategies and tips for supporting children who learn best through visual means.',
    thumbnail: '/images/resources/visual-learning.jpg',
    url: '/resources/supporting-visual-learners.pdf'
  },
  {
    id: 'ls2',
    style: 'AUDITORY',
    title: 'Supporting Auditory Learners',
    description: 'Strategies and tips for supporting children who learn best through listening and speaking.',
    thumbnail: '/images/resources/auditory-learning.jpg',
    url: '/resources/supporting-auditory-learners.pdf'
  },
  {
    id: 'ls3',
    style: 'KINESTHETIC',
    title: 'Supporting Kinesthetic Learners',
    description: 'Strategies and tips for supporting children who learn best through physical activities and hands-on experiences.',
    thumbnail: '/images/resources/kinesthetic-learning.jpg',
    url: '/resources/supporting-kinesthetic-learners.pdf'
  },
  {
    id: 'ls4',
    style: 'READ_WRITE',
    title: 'Supporting Read/Write Learners',
    description: 'Strategies and tips for supporting children who learn best through reading and writing.',
    thumbnail: '/images/resources/read-write-learning.jpg',
    url: '/resources/supporting-read-write-learners.pdf'
  }
];

export default function EnhancedResourcesPage() {
  const [activeTab, setActiveTab] = useState('recommended');
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0].id);
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [resources, setResources] = useState(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedLearningStyle, setSelectedLearningStyle] = useState('all');
  const [showAllChildren, setShowAllChildren] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Update selected child when selectedChildId changes
  useEffect(() => {
    const child = mockChildren.find(c => c.id === selectedChildId);
    if (child) {
      setSelectedChild(child);
    }
  }, [selectedChildId]);
  
  // Filter resources based on selected child, search query, and filters
  const filteredResources = resources.filter(resource => {
    // Filter by child
    if (!showAllChildren && resource.childId !== selectedChildId) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && resource.category !== selectedCategory) {
      return false;
    }
    
    // Filter by format
    if (selectedFormat !== 'all' && resource.format !== selectedFormat) {
      return false;
    }
    
    // Filter by learning style
    if (selectedLearningStyle !== 'all' && !resource.learningStyles.includes(selectedLearningStyle)) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'recommended' && !resource.isRecommended) {
      return false;
    }
    
    if (activeTab === 'bookmarked' && !resource.isBookmarked) {
      return false;
    }
    
    return true;
  });
  
  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.dateAdded.getTime() - a.dateAdded.getTime();
      case 'popularity':
        return b.popularity - a.popularity;
      case 'downloads':
        return b.downloadCount - a.downloadCount;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recommended':
      default:
        // Sort by recommended first, then by date added
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return b.dateAdded.getTime() - a.dateAdded.getTime();
    }
  });
  
  // Get learning style guide for selected child
  const getLearningStyleGuide = () => {
    return mockLearningStyleGuides.find(guide => guide.style === selectedChild.learningStyle);
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Toggle bookmark status
  const toggleBookmark = (resourceId) => {
    setResources(resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked } 
        : resource
    ));
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get icon for resource type
  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'workbook':
        return <FileText className="h-4 w-4" />;
      case 'worksheet':
        return <FileText className="h-4 w-4" />;
      case 'activity':
        return <CheckCircle className="h-4 w-4" />;
      case 'audio':
        return <Play className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'interactive':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get icon for resource format
  const getResourceFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'mp3':
        return <Play className="h-4 w-4" />;
      case 'mp4':
        return <Video className="h-4 w-4" />;
      case 'html':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Format learning style for display
  const formatLearningStyle = (style) => {
    return style.replace('_', '/');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            Access educational resources to support your child's learning at home
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {mockChildren.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <label htmlFor="show-all-children" className="text-sm">
                Show all children
              </label>
              <input 
                id="show-all-children" 
                type="checkbox" 
                checked={showAllChildren}
                onChange={(e) => setShowAllChildren(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search resources..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="mp3">Audio</SelectItem>
                    <SelectItem value="mp4">Video</SelectItem>
                    <SelectItem value="html">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Learning Style</label>
                <Select value={selectedLearningStyle} onValueChange={setSelectedLearningStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Learning Styles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Learning Styles</SelectItem>
                    <SelectItem value="VISUAL">Visual</SelectItem>
                    <SelectItem value="AUDITORY">Auditory</SelectItem>
                    <SelectItem value="KINESTHETIC">Kinesthetic</SelectItem>
                    <SelectItem value="READ_WRITE">Read/Write</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFormat('all');
                setSelectedLearningStyle('all');
                setSortBy('recommended');
              }}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
          
          {selectedChild.learningStyle && getLearningStyleGuide() && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Learning Style Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white">
                      {formatLearningStyle(selectedChild.learningStyle)} Learner
                    </Badge>
                  </div>
                  <p className="text-sm">
                    {selectedChild.firstName} has a {formatLearningStyle(selectedChild.learningStyle).toLowerCase()} learning style. 
                    We've highlighted resources that match this style.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <h4 className="font-medium text-sm mb-1">{getLearningStyleGuide().title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{getLearningStyleGuide().description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-1" />
                      Download Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="recommended">
                <Star className="h-4 w-4 mr-2" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="all">
                <FileText className="h-4 w-4 mr-2" />
                All Resources
              </TabsTrigger>
              <TabsTrigger value="bookmarked">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarked
              </TabsTrigger>
              <TabsTrigger value="curriculum">
                <BookOpen className="h-4 w-4 mr-2" />
                Curriculum-Aligned
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {sortedResources.length} resources
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print List
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {sortedResources.length > 0 ? (
                sortedResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 bg-slate-100 p-4 flex items-center justify-center">
                        <div className="aspect-square w-full max-w-[150px] bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                          {resource.thumbnail ? (
                            <img 
                              src={resource.thumbnail} 
                              alt={resource.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="h-12 w-12 text-slate-300" />
                          )}
                        </div>
                      </div>
                      <div className="md:w-3/4 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{resource.title}</h3>
                            {showAllChildren && (
                              <p className="text-xs font-medium text-blue-600">
                                For {mockChildren.find(c => c.id === resource.childId)?.firstName}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getCategoryName(resource.category)}
                              </Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                {getResourceTypeIcon(resource.type)}
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                {getResourceFormatIcon(resource.format)}
                                {resource.format.toUpperCase()}
                              </Badge>
                              {resource.learningStyles.includes(selectedChild.learningStyle) && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                  Matches Learning Style
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleBookmark(resource.id)}
                          >
                            <Bookmark className={`h-5 w-5 ${resource.isBookmarked ? 'fill-current text-amber-500' : ''}`} />
                          </Button>
                        </div>
                        
                        <p className="text-sm mt-2">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {resource.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded-full flex items-center">
                              <Tag className="h-3 w-3 mr-1 text-slate-500" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center mt-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(resource.dateAdded)}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              {resource.downloadCount} downloads
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-amber-500" />
                              {resource.popularity.toFixed(1)}
                            </span>
                          </div>
                          
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No resources found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No resources match your current filters. Try adjusting your search criteria or filters to find what you're looking for.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedFormat('all');
                    setSelectedLearningStyle('all');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
