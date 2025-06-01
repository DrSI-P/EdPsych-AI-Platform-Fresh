'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MessageSquare, Search, Filter } from 'lucide-react';
import { getForumTopics, createForumTopic } from '@/lib/collaborative-learning/api';
import { ForumTopic, ForumCategory, PostVisibility } from '@/lib/collaborative-learning/types';
import { CreateTopicDialog } from './create-topic-dialog';
import { TopicList } from './topic-list';
import { ForumSearch } from './forum-search';

/**
 * Discussion Forum Dashboard Component
 * 
 * Displays forum topics, allows users to create new topics,
 * and provides tools to search and filter discussions.
 */
export function DiscussionForumDashboard() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock user ID - in a real implementation, this would come from authentication
  const userId = 'current-user-id';
  
  // Fetch forum topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const filters: any = {};
        
        if (selectedCategory !== 'all') {
          filters.category = selectedCategory;
        }
        
        const data = await getForumTopics(filters);
        setTopics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load forum topics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, [selectedCategory]);
  
  // Handle creating a new topic
  const handleCreateTopic = (newTopic: ForumTopic) => {
    setTopics([newTopic, ...topics]);
    setShowCreateDialog(false);
  };
  
  // Filter topics by search query
  const filteredTopics = searchQuery
    ? topics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : topics;
  
  // Get topics by category for the tabs
  const getTopicsByCategory = (category: string) => {
    if (category === 'all') {
      return filteredTopics;
    }
    return filteredTopics.filter(topic => topic.category === category);
  };
  
  // Get topics created by the current user
  const myTopics = filteredTopics.filter(topic => topic.createdBy === userId);
  
  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Discussion Forums</h2>
          <p className="text-muted-foreground">Engage in discussions with peers and educators</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Topic
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
                placeholder="Search topics, tags, or content..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value={ForumCategory.GENERAL}>General</option>
                <option value={ForumCategory.SUBJECT_SPECIFIC}>Subject Specific</option>
                <option value={ForumCategory.HELP_REQUESTS}>Help Requests</option>
                <option value={ForumCategory.STUDY_GROUPS}>Study Groups</option>
                <option value={ForumCategory.ANNOUNCEMENTS}>Announcements</option>
              </select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
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
          <p>Loading forum topics...</p>
        </div>
      )}
      
      {/* Main content */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Discussion Topics
            </CardTitle>
            <CardDescription>
              Join conversations or start your own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="my-topics">My Topics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No topics found</p>
                    <Button 
                      variant="link" 
                      onClick={() => setShowCreateDialog(true)}
                    >
                      Create a new topic
                    </Button>
                  </div>
                ) : (
                  <TopicList topics={filteredTopics} currentUserId={userId} />
                )}
              </TabsContent>
              
              <TabsContent value="popular">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No popular topics found</p>
                  </div>
                ) : (
                  <TopicList 
                    topics={[...filteredTopics].sort((a, b) => b.viewCount - a.viewCount)} 
                    currentUserId={userId} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="recent">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent topics found</p>
                  </div>
                ) : (
                  <TopicList 
                    topics={[...filteredTopics].sort((a, b) => 
                      new Date(b.lastPostAt).getTime() - new Date(a.lastPostAt).getTime()
                    )} 
                    currentUserId={userId} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="my-topics">
                {myTopics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't created any topics yet</p>
                    <Button 
                      variant="link" 
                      onClick={() => setShowCreateDialog(true)}
                    >
                      Create your first topic
                    </Button>
                  </div>
                ) : (
                  <TopicList topics={myTopics} currentUserId={userId} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Forum guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Forum Guidelines</CardTitle>
          <CardDescription>
            Please follow these guidelines to ensure a positive discussion environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Be respectful and considerate of others' viewpoints</li>
            <li>Stay on topic and contribute meaningfully to discussions</li>
            <li>Use appropriate language and avoid personal attacks</li>
            <li>Check for existing topics before creating new ones</li>
            <li>Provide evidence or sources when making factual claims</li>
            <li>Report inappropriate content to moderators</li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      {showCreateDialog && (
        <CreateTopicDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateTopic={handleCreateTopic}
          userId={userId}
        />
      )}
    </div>
  );
}
