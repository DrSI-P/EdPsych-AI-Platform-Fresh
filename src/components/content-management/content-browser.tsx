'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { 
  Search, Filter, SortAsc, SortDesc, FileText, Book, Video, 
  Image, File, ExternalLink, Eye, Download, Edit, Trash2, 
  Copy, Check, X, Grid, List, Star, StarHalf, Clock
} from 'lucide-react';

import { 
  ContentItem, 
  ContentType, 
  ContentFormat, 
  ReviewStatus, 
  DifficultyLevel,
  ContentSearchFilters
} from '@/lib/content-management/types';
import { UKKeyStage, UKSubject } from '@/lib/assessment/types';
import { LearningStyle } from '@/lib/learning-path/types';
import { searchContentItems } from '@/lib/content-management/api';

interface ContentBrowserProps {
  initialItems?: ContentItem[];
  onItemSelect?: (item: ContentItem) => void;
  onItemEdit?: (item: ContentItem) => void;
  onItemDelete?: (item: ContentItem) => void;
  onItemCopy?: (item: ContentItem) => void;
  className?: string;
}

export function ContentBrowser({
  initialItems = [],
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onItemCopy,
  className = ''
}: ContentBrowserProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  
  // Search and filter state
  const [searchFilters, setSearchFilters] = useState<ContentSearchFilters>({
    query: '',
    subjects: [],
    keyStages: [],
    contentTypes: [],
    learningStyles: [],
    difficultyLevels: [],
    tags: [],
    reviewStatus: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  // Fetch content items on component mount and when filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // If initialItems are provided and this is the first load, use them
        if (initialItems.length > 0 && page === 1 && !searchFilters.query) {
          setItems(initialItems);
          setTotal(initialItems.length);
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch from API
        const result = await searchContentItems(searchFilters, page, limit);
        setItems(result.items);
        setTotal(result.total);
        setError('');
      } catch (err) {
        console.error('Error fetching content items:', err);
        setError('Failed to load content items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [initialItems, page, limit, searchFilters]);
  
  // Handle search query change
  const handleSearchQueryChange = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle filter change
  const handleFilterChange = (filterName: keyof ContentSearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [filterName]: value }));
    setPage(1); // Reset to first page when filters change
  };
  
  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    setSearchFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Get icon for content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.LESSON:
        return <Book className="h-5 w-5" />;
      case ContentType.VIDEO:
        return <Video className="h-5 w-5" />;
      case ContentType.READING:
        return <FileText className="h-5 w-5" />;
      case ContentType.INTERACTIVE:
        return <ExternalLink className="h-5 w-5" />;
      case ContentType.WORKSHEET:
        return <File className="h-5 w-5" />;
      case ContentType.PRESENTATION:
        return <Image className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };
  
  // Get color for review status
  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case ReviewStatus.DRAFT:
        return 'bg-gray-200 text-gray-800';
      case ReviewStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case ReviewStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ReviewStatus.PUBLISHED:
        return 'bg-blue-100 text-blue-800';
      case ReviewStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      case ReviewStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(item.type)}
                <Badge className={getStatusColor(item.reviewStatus)}>
                  {item.reviewStatus.replace('_', ' ')}
                </Badge>
              </div>
              <Badge variant="outline">{item.keyStage}</Badge>
            </div>
            <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-2">
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="secondary">{item.subject}</Badge>
              <Badge variant="outline">{item.difficulty}</Badge>
              {item.content.some(v => v.learningStyle === LearningStyle.VISUAL) && (
                <Badge variant="outline" className="bg-blue-50">Visual</Badge>
              )}
              {item.content.some(v => v.learningStyle === LearningStyle.AUDITORY) && (
                <Badge variant="outline" className="bg-green-50">Auditory</Badge>
              )}
              {item.content.some(v => v.learningStyle === LearningStyle.KINESTHETIC) && (
                <Badge variant="outline" className="bg-purple-50">Kinesthetic</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.estimatedDuration} minutes
              </div>
              <div className="mt-1">
                {item.yearGroup.length > 0 && (
                  <span>Years: {item.yearGroup.join(', ')}</span>
                )}
              </div>
              <div className="mt-2 line-clamp-1">
                {item.tags.length > 0 && (
                  <span>Tags: {item.tags.join(', ')}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onItemSelect?.(item)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <div className="flex gap-1">
                {onItemEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onItemEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onItemCopy && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onItemCopy(item)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                {onItemDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onItemDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  
  // Render list view
  const renderListView = () => (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="flex items-center p-4">
            <div className="mr-4">
              {getContentTypeIcon(item.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{item.title}</h3>
                <Badge className={getStatusColor(item.reviewStatus)}>
                  {item.reviewStatus.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary">{item.subject}</Badge>
                <Badge variant="outline">{item.keyStage}</Badge>
                <Badge variant="outline">{item.difficulty}</Badge>
                {item.content.map(v => (
                  <Badge key={v.learningStyle} variant="outline" className="bg-blue-50">
                    {v.learningStyle}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onItemSelect?.(item)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {onItemEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onItemEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onItemCopy && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onItemCopy(item)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onItemDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onItemDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Browse and manage curriculum content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchFilters.query || ''}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={searchFilters.subjects?.[0] || ''}
                  onValueChange={(value) => handleFilterChange('subjects', value ? [value] : [])}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {Object.values(UKSubject).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={searchFilters.keyStages?.[0] || ''}
                  onValueChange={(value) => handleFilterChange('keyStages', value ? [value] : [])}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Key Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Key Stages</SelectItem>
                    {Object.values(UKKeyStage).map((keyStage) => (
                      <SelectItem key={keyStage} value={keyStage}>
                        {keyStage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => handleSortChange('date')}
                >
                  {searchFilters.sortBy === 'date' && searchFilters.sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Active filters */}
            {(searchFilters.subjects?.length || 
              searchFilters.keyStages?.length || 
              searchFilters.contentTypes?.length || 
              searchFilters.learningStyles?.length || 
              searchFilters.tags?.length) && (
              <div className="flex flex-wrap gap-2">
                {searchFilters.subjects?.map((subject) => (
                  <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                    Subject: {subject}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('subjects', 
                        searchFilters.subjects?.filter(s => s !== subject) || []
                      )}
                    />
                  </Badge>
                ))}
                
                {searchFilters.keyStages?.map((keyStage) => (
                  <Badge key={keyStage} variant="secondary" className="flex items-center gap-1">
                    Key Stage: {keyStage}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('keyStages', 
                        searchFilters.keyStages?.filter(k => k !== keyStage) || []
                      )}
                    />
                  </Badge>
                ))}
                
                {searchFilters.contentTypes?.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    Type: {type}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('contentTypes', 
                        searchFilters.contentTypes?.filter(t => t !== type) || []
                      )}
                    />
                  </Badge>
                ))}
                
                {searchFilters.learningStyles?.map((style) => (
                  <Badge key={style} variant="secondary" className="flex items-center gap-1">
                    Style: {style}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('learningStyles', 
                        searchFilters.learningStyles?.filter(s => s !== style) || []
                      )}
                    />
                  </Badge>
                ))}
                
                {searchFilters.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    Tag: {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('tags', 
                        searchFilters.tags?.filter(t => t !== tag) || []
                      )}
                    />
                  </Badge>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchFilters({
                    query: searchFilters.query,
                    sortBy: searchFilters.sortBy,
                    sortOrder: searchFilters.sortOrder
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Content items */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="my-4">
                {error}
              </Alert>
            ) : items.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No content items found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div>
                {viewMode === 'grid' ? renderGridView() : renderListView()}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && items.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
