'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Clock,
  Users,
  Star,
  Calendar
} from 'lucide-react';

import { 
  ContentType, 
  ContentFormat, 
  ContentDifficultyLevel, 
  ContentStatus,
  UKKeyStage,
  UKSubject,
  ContentSearchFilters,
  ContentMetadata
} from '@/lib/curriculum-content/types';
import { searchCurriculumContent } from '@/lib/curriculum-content/api';

/**
 * Curriculum Content Browser Component
 * 
 * Allows educators to browse, search, and filter curriculum content
 */
export function CurriculumContentBrowser() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ContentSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<ContentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Fetch content on filter/search change
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Apply tab filter
        let tabFilters: Partial<ContentSearchFilters> = {};
        if (selectedTab === 'my-content') {
          // Mock user ID - in production would come from auth context
          tabFilters.createdBy = 'current-user-id';
        } else if (selectedTab === 'drafts') {
          tabFilters.status = [ContentStatus.DRAFT];
        } else if (selectedTab === 'published') {
          tabFilters.status = [ContentStatus.PUBLISHED];
        }
        
        // Combine with other filters
        const combinedFilters = {
          ...filters,
          ...tabFilters
        };
        
        const result = await searchCurriculumContent(combinedFilters, currentPage, 10);
        setSearchResults(result.results);
        setTotalResults(result.totalResults);
      } catch (error) {
        console.error('Error fetching content:', error);
        // In production, would show error toast
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [filters, currentPage, selectedTab]);
  
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      keywords: searchQuery ? [searchQuery] : undefined
    }));
    setCurrentPage(1);
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof ContentSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };
  
  // Get icon for content format
  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case ContentFormat.TEXT:
        return <FileText className="h-4 w-4" />;
      case ContentFormat.VIDEO:
        return <Video className="h-4 w-4" />;
      case ContentFormat.AUDIO:
        return <Headphones className="h-4 w-4" />;
      case ContentFormat.INTERACTIVE:
        return <MousePointer className="h-4 w-4" />;
      case ContentFormat.DOCUMENT:
        return <FileSpreadsheet className="h-4 w-4" />;
      case ContentFormat.PRESENTATION:
        return <Presentation className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  // Get color for content status
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DRAFT:
        return 'bg-yellow-500';
      case ContentStatus.REVIEW:
        return 'bg-blue-500';
      case ContentStatus.APPROVED:
        return 'bg-green-500';
      case ContentStatus.PUBLISHED:
        return 'bg-purple-500';
      case ContentStatus.ARCHIVED:
        return 'bg-gray-500';
      case ContentStatus.REJECTED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Content</h1>
          <p className="text-muted-foreground">Browse, search, and manage curriculum content</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Create New Content
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="my-content">My Content</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search curriculum content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </form>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Content</CardTitle>
            <CardDescription>Refine your search with specific filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyStage">Key Stage</Label>
                <Select 
                  value={filters.keyStage?.[0] || ''} 
                  onValueChange={(value) => handleFilterChange('keyStage', value ? [value as UKKeyStage] : undefined)}
                >
                  <SelectTrigger id="keyStage">
                    <SelectValue placeholder="Select key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Key Stages</SelectItem>
                    <SelectItem value={UKKeyStage.EYFS}>Early Years (EYFS)</SelectItem>
                    <SelectItem value={UKKeyStage.KS1}>Key Stage 1</SelectItem>
                    <SelectItem value={UKKeyStage.KS2}>Key Stage 2</SelectItem>
                    <SelectItem value={UKKeyStage.KS3}>Key Stage 3</SelectItem>
                    <SelectItem value={UKKeyStage.KS4}>Key Stage 4</SelectItem>
                    <SelectItem value={UKKeyStage.KS5}>Key Stage 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={filters.subject?.[0] || ''} 
                  onValueChange={(value) => handleFilterChange('subject', value ? [value as UKSubject] : undefined)}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    <SelectItem value={UKSubject.ENGLISH}>English</SelectItem>
                    <SelectItem value={UKSubject.MATHEMATICS}>Mathematics</SelectItem>
                    <SelectItem value={UKSubject.SCIENCE}>Science</SelectItem>
                    <SelectItem value={UKSubject.HISTORY}>History</SelectItem>
                    <SelectItem value={UKSubject.GEOGRAPHY}>Geography</SelectItem>
                    <SelectItem value={UKSubject.ART_AND_DESIGN}>Art and Design</SelectItem>
                    <SelectItem value={UKSubject.COMPUTING}>Computing</SelectItem>
                    <SelectItem value={UKSubject.DESIGN_AND_TECHNOLOGY}>Design and Technology</SelectItem>
                    <SelectItem value={UKSubject.LANGUAGES}>Languages</SelectItem>
                    <SelectItem value={UKSubject.MUSIC}>Music</SelectItem>
                    <SelectItem value={UKSubject.PHYSICAL_EDUCATION}>Physical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={filters.contentType?.[0] || ''} 
                  onValueChange={(value) => handleFilterChange('contentType', value ? [value as ContentType] : undefined)}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value={ContentType.EXPLANATION}>Explanation</SelectItem>
                    <SelectItem value={ContentType.EXERCISE}>Exercise</SelectItem>
                    <SelectItem value={ContentType.ASSESSMENT}>Assessment</SelectItem>
                    <SelectItem value={ContentType.EXAMPLE}>Example</SelectItem>
                    <SelectItem value={ContentType.RESOURCE}>Resource</SelectItem>
                    <SelectItem value={ContentType.PROJECT}>Project</SelectItem>
                    <SelectItem value={ContentType.DISCUSSION}>Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select 
                  value={filters.difficultyLevel?.[0] || ''} 
                  onValueChange={(value) => handleFilterChange('difficultyLevel', value ? [value as ContentDifficultyLevel] : undefined)}
                >
                  <SelectTrigger id="difficultyLevel">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value={ContentDifficultyLevel.FOUNDATION}>Foundation</SelectItem>
                    <SelectItem value={ContentDifficultyLevel.CORE}>Core</SelectItem>
                    <SelectItem value={ContentDifficultyLevel.EXTENDED}>Extended</SelectItem>
                    <SelectItem value={ContentDifficultyLevel.ADVANCED}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setFilters({});
              setSearchQuery('');
            }}>
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `Showing ${searchResults.length} of ${totalResults} results`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((content) => (
          <Card key={content.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {content.description}
                  </CardDescription>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(content.status)}`}></div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getFormatIcon(content.contentFormat)}
                  {content.contentFormat}
                </Badge>
                <Badge variant="secondary">{content.keyStage}</Badge>
                <Badge>{content.subject}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{content.estimatedDuration} mins</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{new Date(content.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  <span>By {content.createdBy.substring(0, 10)}</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3" />
                  <span>{content.difficultyLevel}</span>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3">
              <div className="flex justify-between w-full">
                <Button variant="ghost" size="sm">Preview</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {!isLoading && searchResults.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No content found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button className="mt-4" onClick={() => {
              setFilters({});
              setSearchQuery('');
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
      
      {totalResults > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(totalResults / 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalResults / 10)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
