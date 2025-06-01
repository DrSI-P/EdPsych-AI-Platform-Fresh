'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, ThumbsUp, Tag } from 'lucide-react';
import { getStudentResources, createStudentResource } from '@/lib/collaborative-learning/api';
import { StudentResource } from '@/lib/collaborative-learning/types';
import { CreateResourceDialog } from './create-resource-dialog';
import { ResourceCard } from './resource-card';

/**
 * Student Resource Browser Component
 * 
 * Allows students to browse, search, and create educational resources
 * shared by peers, filtered by subject, key stage, and learning style.
 */
export function StudentResourceBrowser() {
  const [resources, setResources] = useState<StudentResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    keyStage: '',
    tags: [] as string[],
    approved: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user ID - in a real implementation, this would come from authentication
  const userId = 'current-user-id';
  
  // Fetch student resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await getStudentResources(filters);
        setResources(data);
        setError(null);
      } catch (err) {
        setError('Failed to load student resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [filters]);
  
  // Handle creating a new resource
  const handleCreateResource = (newResource: StudentResource) => {
    setResources([newResource, ...resources]);
    setShowCreateDialog(false);
  };
  
  // Filter resources by search query
  const filteredResources = searchQuery
    ? resources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : resources;
  
  // Get resources by content type
  const getResourcesByType = (contentType: string) => {
    if (contentType === 'all') {
      return filteredResources;
    }
    return filteredResources.filter(resource => resource.contentType === contentType);
  };
  
  // Get resources created by the current user
  const myResources = filteredResources.filter(resource => resource.creatorId === userId);
  
  // Get popular resources (by average rating)
  const popularResources = [...filteredResources].sort((a, b) => b.averageRating - a.averageRating);
  
  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Resources</h2>
          <p className="text-muted-foreground">Browse and share learning resources created by peers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Create Resource
          </Button>
        </div>
      </div>
      
      {/* Search and filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources by title, description, or tags..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
              <select 
                className="px-3 py-2 border rounded-md"
                value={filters.keyStage}
                onChange={(e) => setFilters({...filters, keyStage: e.target.value})}
              >
                <option value="">All Key Stages</option>
                <option value="KS1">KS1</option>
                <option value="KS2">KS2</option>
                <option value="KS3">KS3</option>
                <option value="KS4">KS4</option>
                <option value="KS5">KS5</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading student resources...</p>
        </div>
      )}
      
      {/* Main content */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Learning Resources
            </CardTitle>
            <CardDescription>
              Educational resources created and shared by students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="my-resources">My Resources</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No resources found</p>
                    <Button 
                      variant="link" 
                      onClick={() => setShowCreateDialog(true)}
                    >
                      Create a new resource
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map(resource => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        currentUserId={userId} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular">
                {popularResources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No popular resources found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularResources.map(resource => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        currentUserId={userId} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my-resources">
                {myResources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't created any resources yet</p>
                    <Button 
                      variant="link" 
                      onClick={() => setShowCreateDialog(true)}
                    >
                      Create your first resource
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myResources.map(resource => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        currentUserId={userId} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visual">
                {getResourcesByType('image').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No visual resources found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getResourcesByType('image').map(resource => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        currentUserId={userId} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="text">
                {getResourcesByType('text').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No text resources found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getResourcesByType('text').map(resource => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        currentUserId={userId} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Popular tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Popular Tags
          </CardTitle>
          <CardDescription>
            Browse resources by popular tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Mathematics', 'English', 'Science', 'History', 'Geography', 'Visual Learning', 
              'Study Guide', 'Revision', 'Exam Prep', 'Mind Map', 'Flashcards', 'Quiz', 
              'Tutorial', 'Explanation', 'Practice'].map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      {showCreateDialog && (
        <CreateResourceDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateResource={handleCreateResource}
          userId={userId}
        />
      )}
    </div>
  );
}

/**
 * Resource Card Component
 * 
 * Displays information about a student resource
 */
export function ResourceCard({ resource, currentUserId }) {
  // Format date
  const createdDate = new Date(resource.createdAt).toLocaleDateString();
  
  // Determine if current user is the creator
  const isCreator = resource.creatorId === currentUserId;
  
  // Get content type icon
  const getContentTypeIcon = () => {
    switch (resource.contentType) {
      case 'text':
        return <BookOpen className="h-5 w-5" />;
      case 'image':
        return <img src="/icons/image.svg" alt="Image" className="h-5 w-5" />;
      case 'video':
        return <img src="/icons/video.svg" alt="Video" className="h-5 w-5" />;
      case 'audio':
        return <img src="/icons/audio.svg" alt="Audio" className="h-5 w-5" />;
      case 'document':
        return <img src="/icons/document.svg" alt="Document" className="h-5 w-5" />;
      case 'link':
        return <img src="/icons/link.svg" alt="Link" className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`h-2 ${getContentTypeColor(resource.contentType)}`}></div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {getContentTypeIcon()}
            <Badge className="ml-2" variant="outline">{resource.contentType}</Badge>
          </div>
          {resource.approved && (
            <Badge variant="secondary">Approved</Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{resource.description}</p>
        
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{resource.subject}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Key Stage:</span>
            <span className="font-medium">{resource.keyStage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{createdDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1 text-primary" />
              {resource.averageRating.toFixed(1)} ({resource.reviews?.length || 0})
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-4">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/50">
        <Button variant="outline" className="w-full">
          View Resource
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Helper function to get color based on content type
 */
function getContentTypeColor(contentType: string): string {
  switch (contentType) {
    case 'text':
      return 'bg-blue-500';
    case 'image':
      return 'bg-green-500';
    case 'video':
      return 'bg-red-500';
    case 'audio':
      return 'bg-purple-500';
    case 'document':
      return 'bg-amber-500';
    case 'link':
      return 'bg-cyan-500';
    default:
      return 'bg-gray-500';
  }
}
