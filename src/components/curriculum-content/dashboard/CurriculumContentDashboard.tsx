'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  BarChart2, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Edit3,
  Layers,
  Calendar,
  Star
} from 'lucide-react';

import { 
  ContentStatus, 
  ContentType, 
  UKKeyStage, 
  UKSubject,
  ContentMetadata
} from '@/lib/curriculum-content/types';
import { searchCurriculumContent } from '@/lib/curriculum-content/api';

/**
 * Curriculum Content Dashboard Component
 * 
 * Central hub for managing curriculum content with analytics, recent content,
 * workflow management, and quick access to content creation and editing.
 */
export function CurriculumContentDashboard() {
  // State for content metrics
  const [contentMetrics, setContentMetrics] = useState({
    total: 0,
    published: 0,
    draft: 0,
    review: 0,
    byKeyStage: {} as Record<string, number>,
    bySubject: {} as Record<string, number>
  });
  
  // State for recent content
  const [recentContent, setRecentContent] = useState<ContentMetadata[]>([]);
  
  // State for popular content
  const [popularContent, setPopularContent] = useState<ContentMetadata[]>([]);
  
  // State for content needing review
  const [reviewContent, setReviewContent] = useState<ContentMetadata[]>([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent content
        const recentResult = await searchCurriculumContent(
          { },
          1,
          5
        );
        setRecentContent(recentResult.results);
        
        // Fetch content needing review
        const reviewResult = await searchCurriculumContent(
          { status: [ContentStatus.REVIEW] },
          1,
          5
        );
        setReviewContent(reviewResult.results);
        
        // Fetch popular content (mock data - would be based on analytics in production)
        const popularResult = await searchCurriculumContent(
          { },
          1,
          5
        );
        setPopularContent(popularResult.results);
        
        // Calculate metrics
        const allContent = await searchCurriculumContent(
          { },
          1,
          1000
        );
        
        // Process metrics
        const metrics = {
          total: allContent.totalResults,
          published: 0,
          draft: 0,
          review: 0,
          byKeyStage: {} as Record<string, number>,
          bySubject: {} as Record<string, number>
        };
        
        allContent.results.forEach(content => {
          // Count by status
          if (content.status === ContentStatus.PUBLISHED) {
            metrics.published++;
          } else if (content.status === ContentStatus.DRAFT) {
            metrics.draft++;
          } else if (content.status === ContentStatus.REVIEW) {
            metrics.review++;
          }
          
          // Count by key stage
          metrics.byKeyStage[content.keyStage] = (metrics.byKeyStage[content.keyStage] || 0) + 1;
          
          // Count by subject
          metrics.bySubject[content.subject] = (metrics.bySubject[content.subject] || 0) + 1;
        });
        
        setContentMetrics(metrics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to content browser with search query
    // In production, would use router.push
    window.location.href = `/curriculum-content/browser?search=${encodeURIComponent(searchQuery)}`;
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
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Content Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor your curriculum content</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => window.location.href = '/curriculum-content/browser'}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Content
          </Button>
          <Button onClick={() => window.location.href = '/curriculum-content/editor'}>
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        </div>
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
        </form>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Content</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentMetrics.total}</div>
                <p className="text-xs text-muted-foreground">Across all subjects and key stages</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentMetrics.published}</div>
                <Progress 
                  value={contentMetrics.total ? (contentMetrics.published / contentMetrics.total) * 100 : 0} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentMetrics.draft}</div>
                <Progress 
                  value={contentMetrics.total ? (contentMetrics.draft / contentMetrics.total) * 100 : 0} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentMetrics.review}</div>
                <Progress 
                  value={contentMetrics.total ? (contentMetrics.review / contentMetrics.total) * 100 : 0} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Content by Key Stage</CardTitle>
                <CardDescription>Distribution across UK key stages</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(contentMetrics.byKeyStage).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(contentMetrics.byKeyStage).map(([keyStage, count]) => (
                      <div key={keyStage} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">{keyStage}</Badge>
                          <span>{count} items</span>
                        </div>
                        <Progress 
                          value={contentMetrics.total ? (count / contentMetrics.total) * 100 : 0} 
                          className="h-2 w-1/2" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No content data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content by Subject</CardTitle>
                <CardDescription>Distribution across curriculum subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(contentMetrics.bySubject).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(contentMetrics.bySubject).map(([subject, count]) => (
                      <div key={subject} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2">{subject}</Badge>
                          <span>{count} items</span>
                        </div>
                        <Progress 
                          value={contentMetrics.total ? (count / contentMetrics.total) * 100 : 0} 
                          className="h-2 w-1/2" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No content data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content updates and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {recentContent.length > 0 ? (
                  <div className="space-y-4">
                    {recentContent.slice(0, 5).map((content) => (
                      <div key={content.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(content.status)}`}></div>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(content.updatedAt)}</span>
                            <span className="mx-1">•</span>
                            <Badge variant="outline" className="text-xs">{content.keyStage}</Badge>
                            <span className="mx-1">•</span>
                            <Badge variant="outline" className="text-xs">{content.subject}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/curriculum-content/browser'}>
                  View All Content
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common curriculum management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/curriculum-content/editor'}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Content
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/curriculum-content/browser?status=review'}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review Pending Content
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/curriculum-content/browser?status=draft'}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Continue Drafts
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/curriculum-content/units'}>
                  <Layers className="mr-2 h-4 w-4" />
                  Manage Curriculum Units
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/curriculum-content/analytics'}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Recently created and updated curriculum content</CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent.length > 0 ? (
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(content.status)} mr-3`}></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{content.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{content.description}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant="outline">{content.status}</Badge>
                            <span className="text-xs text-muted-foreground mt-1">{formatDate(content.updatedAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary">{content.keyStage}</Badge>
                          <Badge>{content.subject}</Badge>
                          <Badge variant="outline">{content.contentType}</Badge>
                        </div>
                        
                        <div className="flex justify-end mt-3 space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => window.location.href = `/curriculum-content/view/${content.id}`}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/curriculum-content/editor/${content.id}`}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recent content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start creating curriculum content to see it here.
                  </p>
                  <Button onClick={() => window.location.href = '/curriculum-content/editor'}>
                    Create Content
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/curriculum-content/browser'}>
                View All Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Content Workflow</CardTitle>
              <CardDescription>Manage content review and publishing process</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="review">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="review">Needs Review</TabsTrigger>
                  <TabsTrigger value="draft">My Drafts</TabsTrigger>
                  <TabsTrigger value="published">Recently Published</TabsTrigger>
                </TabsList>
                
                <TabsContent value="review">
                  {reviewContent.length > 0 ? (
                    <div className="space-y-4">
                      {reviewContent.map((content) => (
                        <div key={content.id} className="flex items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{content.title}</h4>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>Submitted by {content.createdBy.substring(0, 10)}</span>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatDate(content.updatedAt)}</span>
                                </div>
                              </div>
                              <Badge className="bg-blue-500">Needs Review</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="secondary">{content.keyStage}</Badge>
                              <Badge>{content.subject}</Badge>
                              <Badge variant="outline">{content.contentType}</Badge>
                            </div>
                            
                            <div className="flex justify-end mt-3 space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => window.location.href = `/curriculum-content/view/${content.id}`}>
                                Preview
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => window.location.href = `/curriculum-content/review/${content.id}`}>
                                Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No content needs review</h3>
                      <p className="text-sm text-muted-foreground">
                        All content has been reviewed. Check back later.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="draft">
                  {/* Similar structure to review tab, but with draft content */}
                  <div className="text-center py-8">
                    <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your draft content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Continue working on your draft content or create new content.
                    </p>
                    <Button onClick={() => window.location.href = '/curriculum-content/editor'}>
                      Create New Content
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="published">
                  {/* Similar structure to review tab, but with recently published content */}
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Recently published content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      View and manage recently published curriculum content.
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = '/curriculum-content/browser?status=published'}>
                      View Published Content
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Usage</CardTitle>
                <CardDescription>Most viewed and used curriculum content</CardDescription>
              </CardHeader>
              <CardContent>
                {popularContent.length > 0 ? (
                  <div className="space-y-4">
                    {popularContent.map((content, index) => (
                      <div key={content.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{content.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Badge variant="outline" className="mr-1">{content.keyStage}</Badge>
                              <Badge variant="outline">{content.subject}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.floor(Math.random() * 1000)} views</div>
                          <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 100)}% completion</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No analytics data available
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/curriculum-content/analytics'}>
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Student engagement with curriculum content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Completion Rate</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Time Spent</span>
                      <span className="text-sm font-medium">24 minutes</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Rating</span>
                      <span className="text-sm font-medium">4.2/5</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Assessment Success Rate</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="font-medium mb-2">Top Learning Styles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Visual</span>
                      <Progress value={42} className="h-2 w-1/2" />
                      <span className="text-sm">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Kinesthetic</span>
                      <Progress value={28} className="h-2 w-1/2" />
                      <span className="text-sm">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Auditory</span>
                      <Progress value={18} className="h-2 w-1/2" />
                      <span className="text-sm">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Read/Write</span>
                      <Progress value={12} className="h-2 w-1/2" />
                      <span className="text-sm">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/curriculum-content/analytics/engagement'}>
                  View Engagement Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Coverage Analysis</CardTitle>
              <CardDescription>Curriculum coverage across key stages and subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Detailed analytics available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View comprehensive analytics about curriculum coverage, student engagement, and content effectiveness.
                </p>
                <Button onClick={() => window.location.href = '/curriculum-content/analytics/coverage'}>
                  View Coverage Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
