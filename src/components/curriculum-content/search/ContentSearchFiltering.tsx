'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  X,
  Check,
  AlertCircle,
  Info,
  History,
  Heart,
  Star,
  Smile,
  Zap,
  Award,
  Compass,
  SlidersHorizontal
} from 'lucide-react';

import { 
  ContentType,
  ContentStatus,
  ContentMetadata
} from '@/lib/curriculum-content/types';

/**
 * Content Search and Filtering Component
 * 
 * Provides advanced search and filtering capabilities for curriculum content
 * with options for filtering by key stage, subject, content type, status, and more.
 */
export function ContentSearchFiltering() {
  const { toast } = useToast();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    keyStages: [],
    subjects: [],
    contentTypes: [],
    statuses: [],
    dateRange: 'all',
    createdBy: [],
    tags: []
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([
    {
      id: 'saved1',
      name: 'KS2 Maths Resources',
      filters: {
        keyStages: ['KS2'],
        subjects: ['Mathematics'],
        contentTypes: [ContentType.EXERCISE, ContentType.EXPLANATION],
        statuses: [ContentStatus.PUBLISHED],
        dateRange: 'all',
        createdBy: [],
        tags: ['fractions', 'decimals']
      }
    },
    {
      id: 'saved2',
      name: 'Draft Science Content',
      filters: {
        keyStages: ['KS3', 'KS4'],
        subjects: ['Science'],
        contentTypes: [],
        statuses: [ContentStatus.DRAFT],
        dateRange: 'last30days',
        createdBy: [],
        tags: []
      }
    }
  ]);
  const [newSavedSearchName, setNewSavedSearchName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ContentMetadata[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Filter options
  const keyStageOptions = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5'];
  const subjectOptions = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computing', 'Design and Technology',
    'Modern Foreign Languages', 'Religious Education', 'PSHE'
  ];
  const contentTypeOptions = Object.values(ContentType);
  const statusOptions = Object.values(ContentStatus);
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'lastyear', label: 'Last Year' }
  ];
  const tagOptions = [
    'fractions', 'decimals', 'algebra', 'geometry', 'statistics',
    'grammar', 'vocabulary', 'reading', 'writing', 'speaking',
    'biology', 'chemistry', 'physics', 'earth science', 'astronomy',
    'ancient history', 'modern history', 'world wars', 'civilizations',
    'maps', 'climate', 'ecosystems', 'countries', 'natural resources',
    'visual arts', 'performing arts', 'music theory', 'instruments',
    'team sports', 'individual sports', 'fitness', 'nutrition',
    'programming', 'digital literacy', 'online safety', 'algorithms',
    'materials', 'structures', 'mechanisms', 'electronics',
    'languages', 'cultures', 'traditions', 'religions',
    'wellbeing', 'relationships', 'citizenship', 'careers'
  ];
  
  // Mock content creators
  const contentCreators = [
    'John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Williams', 
    'Michael Brown', 'Sarah Davis', 'David Wilson', 'Lisa Taylor'
  ];
  
  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    
    // In a real implementation, this would call an API with the search query and filters
    // Mock search results for demonstration
    setTimeout(() => {
      const mockResults: ContentMetadata[] = [
        {
          id: 'content-123',
          title: 'Introduction to Fractions',
          description: 'A comprehensive introduction to fractions for Key Stage 2',
          keyStage: 'KS2',
          subject: 'Mathematics',
          contentType: ContentType.EXPLANATION,
          status: ContentStatus.PUBLISHED,
          createdAt: '2025-05-20T10:30:00Z',
          updatedAt: '2025-05-30T14:45:00Z',
          createdBy: 'John Smith',
          updatedBy: 'Jane Doe'
        },
        {
          id: 'content-124',
          title: 'Fractions Practice Exercises',
          description: 'Practice exercises for working with fractions',
          keyStage: 'KS2',
          subject: 'Mathematics',
          contentType: ContentType.EXERCISE,
          status: ContentStatus.PUBLISHED,
          createdAt: '2025-05-21T11:15:00Z',
          updatedAt: '2025-05-29T09:30:00Z',
          createdBy: 'John Smith',
          updatedBy: 'John Smith'
        },
        {
          id: 'content-125',
          title: 'Fractions Assessment',
          description: 'Assessment for understanding of fractions',
          keyStage: 'KS2',
          subject: 'Mathematics',
          contentType: ContentType.ASSESSMENT,
          status: ContentStatus.DRAFT,
          createdAt: '2025-05-25T14:20:00Z',
          updatedAt: '2025-05-28T16:10:00Z',
          createdBy: 'Jane Doe',
          updatedBy: 'Jane Doe'
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
      
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} results matching your criteria`
      });
    }, 1000);
  };
  
  // Handle filter toggle
  const handleFilterToggle = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: value
    }));
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setActiveFilters({
      keyStages: [],
      subjects: [],
      contentTypes: [],
      statuses: [],
      dateRange: 'all',
      createdBy: [],
      tags: []
    });
    setSearchQuery('');
    
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset"
    });
  };
  
  // Handle save search
  const handleSaveSearch = () => {
    if (newSavedSearchName) {
      const newSavedSearch = {
        id: `saved${savedSearches.length + 1}`,
        name: newSavedSearchName,
        filters: { ...activeFilters },
        query: searchQuery
      };
      
      setSavedSearches(prev => [...prev, newSavedSearch]);
      setNewSavedSearchName('');
      
      toast({
        title: "Search saved",
        description: `"${newSavedSearchName}" has been saved to your searches`
      });
    }
  };
  
  // Handle load saved search
  const handleLoadSavedSearch = (savedSearch: any) => {
    setActiveFilters(savedSearch.filters);
    setSearchQuery(savedSearch.query || '');
    
    toast({
      title: "Search loaded",
      description: `"${savedSearch.name}" has been loaded`
    });
    
    // Automatically perform search
    handleSearch();
  };
  
  // Handle delete saved search
  const handleDeleteSavedSearch = (savedSearchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== savedSearchId));
    
    toast({
      title: "Search deleted",
      description: "The saved search has been deleted"
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get content type icon
  const getContentTypeIcon = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.EXPLANATION:
        return <BookOpen className="h-4 w-4" />;
      case ContentType.EXERCISE:
        return <FileText className="h-4 w-4" />;
      case ContentType.VIDEO:
        return <Video className="h-4 w-4" />;
      case ContentType.AUDIO:
        return <Headphones className="h-4 w-4" />;
      case ContentType.INTERACTIVE:
        return <MousePointer className="h-4 w-4" />;
      case ContentType.ASSESSMENT:
        return <FileSpreadsheet className="h-4 w-4" />;
      case ContentType.PRESENTATION:
        return <Presentation className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.PUBLISHED:
        return "success";
      case ContentStatus.DRAFT:
        return "secondary";
      case ContentStatus.REVIEW:
        return "warning";
      case ContentStatus.ARCHIVED:
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    count += activeFilters.keyStages.length;
    count += activeFilters.subjects.length;
    count += activeFilters.contentTypes.length;
    count += activeFilters.statuses.length;
    count += activeFilters.createdBy.length;
    count += activeFilters.tags.length;
    if (activeFilters.dateRange !== 'all') count += 1;
    return count;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Content Search & Filtering</CardTitle>
              <CardDescription>
                Search and filter curriculum content by various criteria
              </CardDescription>
            </div>
            <Badge variant="outline">
              {countActiveFilters()} active filters
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search curriculum content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm font-medium mt-1">Saved:</span>
                {savedSearches.map((savedSearch) => (
                  <Badge 
                    key={savedSearch.id}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer flex items-center"
                  >
                    <span onClick={() => handleLoadSavedSearch(savedSearch)}>
                      {savedSearch.name}
                    </span>
                    <X 
                      className="ml-1 h-3 w-3 hover:text-destructive" 
                      onClick={() => handleDeleteSavedSearch(savedSearch.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Advanced Filters</h3>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
                
                <Tabs defaultValue="basic">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                    <TabsTrigger value="content">Content Type</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    {/* Key Stage Filters */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Stage</h4>
                      <div className="flex flex-wrap gap-2">
                        {keyStageOptions.map((keyStage) => (
                          <Badge 
                            key={keyStage}
                            variant={activeFilters.keyStages.includes(keyStage) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('keyStages', keyStage)}
                          >
                            {keyStage}
                            {activeFilters.keyStages.includes(keyStage) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Subject Filters */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Subject</h4>
                      <div className="flex flex-wrap gap-2">
                        {subjectOptions.map((subject) => (
                          <Badge 
                            key={subject}
                            variant={activeFilters.subjects.includes(subject) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('subjects', subject)}
                          >
                            {subject}
                            {activeFilters.subjects.includes(subject) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status Filters */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((status) => (
                          <Badge 
                            key={status}
                            variant={activeFilters.statuses.includes(status) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('statuses', status)}
                          >
                            {status}
                            {activeFilters.statuses.includes(status) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="content" className="space-y-4 mt-4">
                    {/* Content Type Filters */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Content Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {contentTypeOptions.map((contentType) => (
                          <Badge 
                            key={contentType}
                            variant={activeFilters.contentTypes.includes(contentType) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('contentTypes', contentType)}
                          >
                            <span className="flex items-center">
                              {getContentTypeIcon(contentType as ContentType)}
                              <span className="ml-1">{contentType}</span>
                            </span>
                            {activeFilters.contentTypes.includes(contentType) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="metadata" className="space-y-4 mt-4">
                    {/* Date Range Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Date Range</h4>
                      <div className="flex flex-wrap gap-2">
                        {dateRangeOptions.map((option) => (
                          <Badge 
                            key={option.value}
                            variant={activeFilters.dateRange === option.value ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleDateRangeChange(option.value)}
                          >
                            {option.label}
                            {activeFilters.dateRange === option.value && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Created By Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Created By</h4>
                      <div className="flex flex-wrap gap-2">
                        {contentCreators.map((creator) => (
                          <Badge 
                            key={creator}
                            variant={activeFilters.createdBy.includes(creator) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('createdBy', creator)}
                          >
                            {creator}
                            {activeFilters.createdBy.includes(creator) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tags" className="space-y-4 mt-4">
                    {/* Tags Filter */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tagOptions.map((tag) => (
                          <Badge 
                            key={tag}
                            variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => handleFilterToggle('tags', tag)}
                          >
                            {tag}
                            {activeFilters.tags.includes(tag) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Save Search */}
                <div className="flex items-end space-x-2 pt-4 border-t">
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="saveSearchName">Save this search</Label>
                    <Input
                      id="saveSearchName"
                      placeholder="Enter a name for this search..."
                      value={newSavedSearchName}
                      onChange={(e) => setNewSavedSearchName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveSearch} disabled={!newSavedSearchName}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Search Results</h3>
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} results found
                  </span>
                </div>
                
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="overflow-hidden">
                      <div className="flex">
                        <div className={`w-2 ${
                          result.status === ContentStatus.PUBLISHED ? 'bg-green-500' :
                          result.status === ContentStatus.DRAFT ? 'bg-gray-400' :
                          result.status === ContentStatus.REVIEW ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div className="flex-grow p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-md font-medium">{result.title}</h4>
                              <p className="text-sm text-muted-foreground">{result.description}</p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(result.status as ContentStatus)}>
                              {result.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Key Stage:</span>
                              {result.keyStage}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Subject:</span>
                              {result.subject}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Type:</span>
                              <span className="flex items-center">
                                {getContentTypeIcon(result.contentType as ContentType)}
                                <span className="ml-1">{result.contentType}</span>
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Created:</span>
                              {formatDate(result.createdAt)} by {result.createdBy}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Updated:</span>
                              {formatDate(result.updatedAt)} by {result.updatedBy}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/curriculum-content/view/${result.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/curriculum-content/edit/${result.id}`}>
                                <SlidersHorizontal className="mr-1 h-4 w-4" />
                                Edit
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="mr-2 h-4 w-4" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
