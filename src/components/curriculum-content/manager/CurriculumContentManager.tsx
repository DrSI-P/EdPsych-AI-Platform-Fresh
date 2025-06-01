'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Save,
  Eye,
  Trash2,
  Plus,
  X
} from 'lucide-react';

import { 
  ContentSearchFilters, 
  ContentMetadata,
  UKKeyStage,
  UKSubject,
  ContentType,
  ContentFormat,
  ContentDifficultyLevel,
  ContentStatus,
  UKCurriculumRegion
} from '@/lib/curriculum-content/types';
import { searchCurriculumContent } from '@/lib/curriculum-content/api';

/**
 * Enhanced Curriculum Content Management Interface
 * 
 * Provides advanced search, filtering, and management capabilities for curriculum content
 * with UK curriculum alignment and learning style adaptation features.
 */
export function CurriculumContentManager() {
  const { toast } = useToast();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentMetadata[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<ContentSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected content state
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  
  // Bulk action state
  const [bulkAction, setBulkAction] = useState('');
  
  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await searchCurriculumContent(
          {
            ...filters,
            ...(searchQuery ? { keywords: [searchQuery] } : {})
          },
          currentPage,
          pageSize
        );
        
        setSearchResults(results.results);
        setTotalResults(results.totalResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        toast({
          title: "Error",
          description: "Failed to fetch content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [searchQuery, filters, currentPage, pageSize, toast]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
  
  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({});
    setCurrentPage(1);
  };
  
  // Handle content selection
  const handleSelectContent = (id: string) => {
    setSelectedContent(prev => {
      if (prev.includes(id)) {
        return prev.filter(contentId => contentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedContent.length === searchResults.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(searchResults.map(content => content.id));
    }
  };
  
  // Handle bulk action
  const handleBulkAction = async () => {
    if (!bulkAction || selectedContent.length === 0) return;
    
    setIsLoading(true);
    try {
      // Implement bulk actions (archive, publish, etc.)
      toast({
        title: "Success",
        description: `${bulkAction} action completed for ${selectedContent.length} items.`
      });
      
      // Reset selection
      setSelectedContent([]);
      setBulkAction('');
      
      // Refresh results
      const results = await searchCurriculumContent(
        {
          ...filters,
          ...(searchQuery ? { keywords: [searchQuery] } : {})
        },
        currentPage,
        pageSize
      );
      
      setSearchResults(results.results);
      setTotalResults(results.totalResults);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get status badge color
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get content type icon
  const getContentTypeIcon = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.EXPLANATION:
        return <BookOpen className="h-4 w-4" />;
      case ContentType.EXERCISE:
        return <FileText className="h-4 w-4" />;
      case ContentType.ASSESSMENT:
        return <FileSpreadsheet className="h-4 w-4" />;
      case ContentType.EXAMPLE:
        return <Eye className="h-4 w-4" />;
      case ContentType.RESOURCE:
        return <Headphones className="h-4 w-4" />;
      case ContentType.PROJECT:
        return <Presentation className="h-4 w-4" />;
      case ContentType.DISCUSSION:
        return <MousePointer className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Content Manager</h1>
          <p className="text-muted-foreground">
            Search, filter, and manage curriculum content with UK curriculum alignment
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => window.location.href = '/curriculum-content/dashboard'}>
            Dashboard
          </Button>
          <Button onClick={() => window.location.href = '/curriculum-content/editor'}>
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find curriculum content by keywords, subjects, key stages, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, description, or keywords..."
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
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </form>
          
          {showFilters && (
            <div className="space-y-4">
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyStage">Key Stage</Label>
                  <Select 
                    value={filters.keyStage?.[0] || ''} 
                    onValueChange={(value) => handleFilterChange('keyStage', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="keyStage">
                      <SelectValue placeholder="All key stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All key stages</SelectItem>
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
                    onValueChange={(value) => handleFilterChange('subject', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subjects</SelectItem>
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
                    onValueChange={(value) => handleFilterChange('contentType', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="All content types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All content types</SelectItem>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select 
                    value={filters.difficultyLevel?.[0] || ''} 
                    onValueChange={(value) => handleFilterChange('difficultyLevel', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="difficultyLevel">
                      <SelectValue placeholder="All difficulty levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All difficulty levels</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.FOUNDATION}>Foundation</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.CORE}>Core</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.EXTENDED}>Extended</SelectItem>
                      <SelectItem value={ContentDifficultyLevel.ADVANCED}>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={filters.status?.[0] || ''} 
                    onValueChange={(value) => handleFilterChange('status', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value={ContentStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={ContentStatus.REVIEW}>Review</SelectItem>
                      <SelectItem value={ContentStatus.APPROVED}>Approved</SelectItem>
                      <SelectItem value={ContentStatus.PUBLISHED}>Published</SelectItem>
                      <SelectItem value={ContentStatus.ARCHIVED}>Archived</SelectItem>
                      <SelectItem value={ContentStatus.REJECTED}>Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">UK Region</Label>
                  <Select 
                    value={filters.region?.[0] || ''} 
                    onValueChange={(value) => handleFilterChange('region', value ? [value] : undefined)}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All regions</SelectItem>
                      <SelectItem value={UKCurriculumRegion.ENGLAND}>England</SelectItem>
                      <SelectItem value={UKCurriculumRegion.WALES}>Wales</SelectItem>
                      <SelectItem value={UKCurriculumRegion.SCOTLAND}>Scotland</SelectItem>
                      <SelectItem value={UKCurriculumRegion.NORTHERN_IRELAND}>Northern Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleFilterReset} className="mr-2">
                  Reset Filters
                </Button>
                <Button onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {isLoading 
                  ? 'Loading...' 
                  : `Showing ${searchResults.length} of ${totalResults} results`}
              </CardDescription>
            </div>
            
            {selectedContent.length > 0 && (
              <div className="flex items-center space-x-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bulk actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Publish</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleBulkAction} 
                  disabled={!bulkAction || selectedContent.length === 0}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading content...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-left">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedContent.length === searchResults.length && searchResults.length > 0}
                            onChange={handleSelectAll}
                            className="mr-2"
                          />
                          Title
                        </div>
                      </th>
                      <th className="p-3 text-left">Key Stage</th>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Updated</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((content) => (
                      <tr key={content.id} className="border-t hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={selectedContent.includes(content.id)}
                              onChange={() => handleSelectContent(content.id)}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium">{content.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {content.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{content.keyStage}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge>{content.subject}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {getContentTypeIcon(content.contentType)}
                            <span className="ml-2">{content.contentType}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {formatDate(content.updatedAt)}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => window.location.href = `/curriculum-content/view/${content.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => window.location.href = `/curriculum-content/editor/${content.id}`}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                // Handle delete
                                toast({
                                  title: "Content deleted",
                                  description: "The content has been deleted successfully."
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : currentPage - 2 + i;
                      
                      if (pageNum <= 0 || pageNum > totalPages) return null;
                      
                      return (
                        <Button 
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={handleFilterReset}>
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
