'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Search, Plus, BookOpen, Filter, Grid3X3, List, FileText, Calendar, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function CurriculumPlanner() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('plans');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedKeyStage, setSelectedKeyStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data for curriculum plans
  const mockCurriculumPlans = [
    {
      id: '1',
      title: 'Year 5 Mathematics - Spring Term',
      description: 'Comprehensive mathematics curriculum for Year 5 covering fractions, decimals, and geometry.',
      subject: 'Mathematics',
      keyStage: 'KS2',
      year: 'Year 5',
      term: 'Spring',
      author: 'Dr. Emma Johnson',
      lastUpdated: '2025-02-15',
      objectives: 12,
      resources: 8,
      assessments: 4,
      collaborators: 2,
      status: 'published'
    },
    {
      id: '2',
      title: 'GCSE English Literature - Poetry',
      description: 'GCSE curriculum covering poetry analysis, themes, and comparative techniques.',
      subject: 'English',
      keyStage: 'KS4',
      year: 'Year 11',
      term: 'Autumn',
      author: 'Prof. Michael Smith',
      lastUpdated: '2025-01-20',
      objectives: 15,
      resources: 12,
      assessments: 6,
      collaborators: 3,
      status: 'draft'
    },
    {
      id: '3',
      title: 'KS3 Science - Forces and Motion',
      description: 'Science curriculum covering Newton\'s laws, forces, and practical experiments.',
      subject: 'Science',
      keyStage: 'KS3',
      year: 'Year 8',
      term: 'Summer',
      author: 'Dr. Sarah Williams',
      lastUpdated: '2025-03-05',
      objectives: 10,
      resources: 15,
      assessments: 5,
      collaborators: 1,
      status: 'published'
    },
    {
      id: '4',
      title: 'Primary History - Ancient Civilisations',
      description: 'History curriculum exploring ancient Egypt, Greece, and Rome for KS2 students.',
      subject: 'History',
      keyStage: 'KS2',
      year: 'Year 4',
      term: 'Autumn',
      author: 'Prof. James Thompson',
      lastUpdated: '2025-02-10',
      objectives: 8,
      resources: 20,
      assessments: 3,
      collaborators: 4,
      status: 'published'
    },
    {
      id: '5',
      title: 'A-Level Chemistry - Organic Reactions',
      description: 'Advanced chemistry curriculum covering organic reaction mechanisms and synthesis.',
      subject: 'Chemistry',
      keyStage: 'KS5',
      year: 'Year 13',
      term: 'Spring',
      author: 'Dr. Rebecca Brown',
      lastUpdated: '2025-04-12',
      objectives: 18,
      resources: 10,
      assessments: 8,
      collaborators: 2,
      status: 'draft'
    },
    {
      id: '6',
      title: 'Early Years Literacy Development',
      description: 'EYFS curriculum for developing early literacy skills through play-based learning.',
      subject: 'English',
      keyStage: 'EYFS',
      year: 'Reception',
      term: 'All Year',
      author: 'Ms. Laura Davies',
      lastUpdated: '2025-01-30',
      objectives: 6,
      resources: 25,
      assessments: 4,
      collaborators: 5,
      status: 'published'
    }
  ];

  // Mock data for curriculum standards
  const mockStandards = [
    {
      id: '1',
      code: 'MA-KS2-N1',
      description: 'Count in multiples of 6, 7, 9, 25 and 1000',
      subject: 'Mathematics',
      keyStage: 'KS2',
      category: 'Number',
      subcategory: 'Number and place value',
      year: 'Year 4'
    },
    {
      id: '2',
      code: 'EN-KS4-R3',
      description: 'Compare texts critically with similar themes or topics',
      subject: 'English',
      keyStage: 'KS4',
      category: 'Reading',
      subcategory: 'Comprehension',
      year: 'Year 10-11'
    },
    {
      id: '3',
      code: 'SC-KS3-P2',
      description: 'Understand forces as pushes or pulls, arising from the interaction between two objects',
      subject: 'Science',
      keyStage: 'KS3',
      category: 'Physics',
      subcategory: 'Forces',
      year: 'Year 8'
    },
    {
      id: '4',
      code: 'HI-KS2-A4',
      description: 'Learn about the achievements of the earliest civilizations',
      subject: 'History',
      keyStage: 'KS2',
      category: 'Ancient History',
      subcategory: 'Civilizations',
      year: 'Year 4'
    },
    {
      id: '5',
      code: 'CH-KS5-O2',
      description: 'Understand mechanisms of organic reactions including nucleophilic substitution',
      subject: 'Chemistry',
      keyStage: 'KS5',
      category: 'Organic Chemistry',
      subcategory: 'Reaction Mechanisms',
      year: 'Year 13'
    },
    {
      id: '6',
      code: 'EN-EYFS-L1',
      description: 'Develop phonological awareness through play and exploration',
      subject: 'English',
      keyStage: 'EYFS',
      category: 'Literacy',
      subcategory: 'Phonological Awareness',
      year: 'Reception'
    }
  ];

  // Filter curriculum plans based on selected filters
  const filteredPlans = mockCurriculumPlans.filter(plan => {
    const matchesSubject = selectedSubject === 'all' || plan.subject === selectedSubject;
    const matchesKeyStage = selectedKeyStage === 'all' || plan.keyStage === selectedKeyStage;
    const matchesSearch = searchQuery === '' || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesKeyStage && matchesSearch;
  });

  // Filter standards based on selected filters
  const filteredStandards = mockStandards.filter(standard => {
    const matchesSubject = selectedSubject === 'all' || standard.subject === selectedSubject;
    const matchesKeyStage = selectedKeyStage === 'all' || standard.keyStage === selectedKeyStage;
    const matchesSearch = searchQuery === '' || 
      standard.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      standard.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesKeyStage && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would trigger an API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Curriculum Planner</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and align curriculum plans with UK educational standards
          </p>
        </div>
        
        {session && (
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/curriculum/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Curriculum Plan
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
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
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

              {activeTab === 'plans' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => {
                  setSelectedSubject('all');
                  setSelectedKeyStage('all');
                  setSearchQuery('');
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
                  placeholder={activeTab === 'plans' ? "Search curriculum plans..." : "Search curriculum standards..."}
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

          {/* Tabs for Curriculum Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="plans" className="flex items-centre">
                <FileText className="mr-2 h-4 w-4" />
                Curriculum Plans
              </TabsTrigger>
              <TabsTrigger value="standards" className="flex items-centre">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Curriculum Standards
              </TabsTrigger>
              {session && (
                <TabsTrigger value="my-plans" className="flex items-centre">
                  <Calendar className="mr-2 h-4 w-4" />
                  My Plans
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Curriculum Plans Tab */}
            <TabsContent value="plans" className="mt-6">
              {filteredPlans.length === 0 ? (
                <div className="text-centre py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No curriculum plans found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden flex flex-col h-full">
                      <div className="h-2 bg-primary"></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            <Link href={`/curriculum/plans/${plan.id}`} className="hover:underline">
                              {plan.title}
                            </Link>
                          </CardTitle>
                          <Badge variant={plan.status === 'published' ? 'default' : 'outline'}>
                            {plan.status === 'published' ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <CardDescription>{plan.subject} • {plan.keyStage} • {plan.year}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.description}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-centre p-2 bg-muted rounded-md">
                            <p className="text-sm font-medium">{plan.objectives}</p>
                            <p className="text-xs text-muted-foreground">Objectives</p>
                          </div>
                          <div className="text-centre p-2 bg-muted rounded-md">
                            <p className="text-sm font-medium">{plan.resources}</p>
                            <p className="text-xs text-muted-foreground">Resources</p>
                          </div>
                          <div className="text-centre p-2 bg-muted rounded-md">
                            <p className="text-sm font-medium">{plan.assessments}</p>
                            <p className="text-xs text-muted-foreground">Assessments</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex justify-between items-centre w-full">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {plan.lastUpdated}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/curriculum/plans/${plan.id}`}>
                              View Plan
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-2 md:h-auto bg-primary"></div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex items-centre">
                                <h3 className="text-lg font-semibold">
                                  <Link href={`/curriculum/plans/${plan.id}`} className="hover:underline">
                                    {plan.title}
                                  </Link>
                                </h3>
                                <Badge className="ml-2" variant={plan.status === 'published' ? 'default' : 'outline'}>
                                  {plan.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {plan.subject} • {plan.keyStage} • {plan.year} • {plan.term}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm text-muted-foreground">
                              Last updated: {plan.lastUpdated}
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                          <div className="mt-4 flex items-centre justify-between">
                            <div className="flex space-x-4">
                              <div className="text-sm">
                                <span className="font-medium">{plan.objectives}</span> objectives
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">{plan.resources}</span> resources
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">{plan.assessments}</span> assessments
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">{plan.collaborators}</span> collaborators
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/curriculum/plans/${plan.id}`}>
                                View Plan
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredPlans.length > 0 && (
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
                        Page {currentPage} of {Math.ceil(filteredPlans.length / 6)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredPlans.length / 6), currentPage + 1))}
                      disabled={currentPage === Math.ceil(filteredPlans.length / 6)}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            {/* Curriculum Standards Tab */}
            <TabsContent value="standards" className="mt-6">
              {filteredStandards.length === 0 ? (
                <div className="text-centre py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No curriculum standards found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStandards.map((standard) => (
                    <Card key={standard.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-centre">
                              <Badge variant="outline" className="mr-2">
                                {standard.code}
                              </Badge>
                              {standard.year}
                            </CardTitle>
                            <CardDescription>
                              {standard.subject} • {standard.keyStage} • {standard.category} • {standard.subcategory}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/curriculum/standards/${standard.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {standard.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredStandards.length > 0 && (
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
                        Page {currentPage} of {Math.ceil(filteredStandards.length / 6)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredStandards.length / 6), currentPage + 1))}
                      disabled={currentPage === Math.ceil(filteredStandards.length / 6)}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            {/* My Plans Tab */}
            {session && (
              <TabsContent value="my-plans" className="mt-6">
                <div className="text-centre py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">My Curriculum Plans</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your personal curriculum plans will be displayed here.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/curriculum/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Plan
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
