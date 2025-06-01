'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Search, Upload, BookOpen, Filter, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesClient() {
  const { data: session, status } = useSession();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedKeyStage, setSelectedKeyStage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data for initial development
  const mockResources = [
    {
      id: '1',
      title: 'Understanding Phonics: A Teacher\'s Guide',
      description: 'Comprehensive guide to teaching phonics in early years education.',
      subject: 'English',
      keyStage: 'KS1',
      type: 'Guide',
      author: 'Dr. Emma Johnson',
      dateCreated: '2025-01-15',
      thumbnail: '/images/resources/phonics-guide.jpg',
      downloads: 342,
      rating: 4.8,
      tags: ['phonics', 'reading', 'literacy', 'early years']
    },
    {
      id: '2',
      title: 'Mathematics Problem Solving Worksheets',
      description: 'Collection of problem-solving worksheets for Year 5 students.',
      subject: 'Mathematics',
      keyStage: 'KS2',
      type: 'Worksheet',
      author: 'Prof. Michael Smith',
      dateCreated: '2025-02-20',
      thumbnail: '/images/resources/maths-worksheets.jpg',
      downloads: 521,
      rating: 4.6,
      tags: ['mathematics', 'problem solving', 'worksheets', 'year 5']
    },
    {
      id: '3',
      title: 'Science Experiments for Secondary Schools',
      description: 'Practical science experiments suitable for KS3 and KS4 students.',
      subject: 'Science',
      keyStage: 'KS3',
      type: 'Activity',
      author: 'Dr. Sarah Williams',
      dateCreated: '2025-03-05',
      thumbnail: '/images/resources/science-experiments.jpg',
      downloads: 289,
      rating: 4.9,
      tags: ['science', 'experiments', 'practical', 'secondary']
    },
    {
      id: '4',
      title: 'History of Britain: Interactive Timeline',
      description: 'Interactive digital timeline covering key events in British history.',
      subject: 'History',
      keyStage: 'KS3',
      type: 'Interactive',
      author: 'Prof. James Thompson',
      dateCreated: '2025-02-10',
      thumbnail: '/images/resources/history-timeline.jpg',
      downloads: 412,
      rating: 4.7,
      tags: ['history', 'britain', 'timeline', 'interactive']
    },
    {
      id: '5',
      title: 'GCSE English Literature Revision Guide',
      description: 'Comprehensive revision guide for GCSE English Literature.',
      subject: 'English',
      keyStage: 'KS4',
      type: 'Guide',
      author: 'Dr. Rebecca Brown',
      dateCreated: '2025-04-12',
      thumbnail: '/images/resources/english-revision.jpg',
      downloads: 678,
      rating: 4.9,
      tags: ['english', 'literature', 'gcse', 'revision']
    },
    {
      id: '6',
      title: 'Early Years Numeracy Activities',
      description: 'Fun activities to develop early numeracy skills in EYFS children.',
      subject: 'Mathematics',
      keyStage: 'EYFS',
      type: 'Activity',
      author: 'Ms. Laura Davies',
      dateCreated: '2025-01-30',
      thumbnail: '/images/resources/early-numeracy.jpg',
      downloads: 245,
      rating: 4.5,
      tags: ['numeracy', 'early years', 'activities', 'eyfs']
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch resources
    const fetchResources = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/resources?page=${currentPage}&search=${searchQuery}');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setResources(mockResources);
          setTotalPages(3); // Mock total pages
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setLoading(false);
      }
    };

    fetchResources();
  }, [currentPage, searchQuery, selectedSubject, selectedKeyStage, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    // Search logic will be implemented with actual API
  };

  const filteredResources = resources.filter(resource => {
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesKeyStage = selectedKeyStage === 'all' || resource.keyStage === selectedKeyStage;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSubject && matchesKeyStage && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Resource Library</h1>
          <p className="text-muted-foreground mt-2">
            Discover and share high-quality educational resources aligned with the UK curriculum
          </p>
        </div>
        
        {session && (
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/resources/create">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-centre">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                    <SelectItem value="Computing">Computing</SelectItem>
                    <SelectItem value="Design and Technology">Design and Technology</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Key Stage</label>
                <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Key Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Key Stages</SelectItem>
                    <SelectItem value="EYFS">Early Years (EYFS)</SelectItem>
                    <SelectItem value="KS1">Key Stage 1</SelectItem>
                    <SelectItem value="KS2">Key Stage 2</SelectItem>
                    <SelectItem value="KS3">Key Stage 3</SelectItem>
                    <SelectItem value="KS4">Key Stage 4</SelectItem>
                    <SelectItem value="KS5">Key Stage 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resource Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Worksheet">Worksheet</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Presentation">Presentation</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Interactive">Interactive</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Lesson Plan">Lesson Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => {
                  setSelectedSubject('all');
                  setSelectedKeyStage('all');
                  setSelectedType('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search resources..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-centre space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs for Resource Categories */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              {session && <TabsTrigger value="saved">Saved</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-40 bg-muted rounded-t-lg"></div>
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6 mt-2"></div>
                      </CardContent>
                      <CardFooter>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {filteredResources.length === 0 ? (
                    <div className="text-centre py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No resources found</h3>
                      <p className="mt-2 text-muted-foreground">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map((resource) => (
                        <Card key={resource.id} className="overflow-hidden flex flex-col h-full">
                          <div className="h-40 bg-muted relative">
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">{resource.keyStage}</Badge>
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              <Link href={`/resources/${resource.id}`} className="hover:underline">
                                {resource.title}
                              </Link>
                            </CardTitle>
                            <CardDescription>{resource.subject} • {resource.type}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {resource.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {resource.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4">
                            <div className="flex justify-between items-centre w-full">
                              <span className="text-sm text-muted-foreground">
                                {resource.downloads} downloads
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/resources/${resource.id}`}>
                                  View Resource
                                </Link>
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredResources.map((resource) => (
                        <Card key={resource.id}>
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-40 md:h-auto bg-muted"></div>
                            <div className="flex-1 p-6">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    <Link href={`/resources/${resource.id}`} className="hover:underline">
                                      {resource.title}
                                    </Link>
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {resource.subject} • {resource.type} • {resource.keyStage}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                  <Badge variant="secondary">{resource.downloads} downloads</Badge>
                                </div>
                              </div>
                              <p className="mt-4 text-sm text-muted-foreground">
                                {resource.description}
                              </p>
                              <div className="mt-4 flex items-centre justify-between">
                                <div className="flex flex-wrap gap-2">
                                  {resource.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/resources/${resource.id}`}>
                                    View Resource
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {!loading && filteredResources.length > 0 && (
                <div className="flex justify-centre mt-8">
                  <Pagination>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-centre mx-4">
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            {/* Other tab contents would be implemented similarly */}
            <TabsContent value="featured">
              <div className="text-centre py-12">
                <p>Featured resources will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="text-centre py-12">
                <p>Recently added resources will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="text-centre py-12">
                <p>Most popular resources will be displayed here.</p>
              </div>
            </TabsContent>
            
            {session && (
              <TabsContent value="saved">
                <div className="text-centre py-12">
                  <p>Your saved resources will be displayed here.</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}