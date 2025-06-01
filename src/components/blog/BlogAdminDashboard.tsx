import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Clock, BookOpen, Tag, BarChart } from 'lucide-react';
import { BlogGenerationForm } from './BlogGenerationForm';

interface BlogAdminDashboardProps {
  initialTab?: 'schedules' | 'generations' | 'analytics';
}

export function BlogAdminDashboard({ initialTab = 'schedules' }: BlogAdminDashboardProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [schedules, setSchedules] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user has admin or teacher role
  const isAuthorized = session?.user?.role === 'admin' || session?.user?.role === 'teacher';
  
  useEffect(() => {
    if (!isAuthorized) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch schedules
        const schedulesResponse = await fetch('/api/blog/schedules');
        if (!schedulesResponse.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const schedulesData = await schedulesResponse.json();
        setSchedules(schedulesData);
        
        // Fetch generations
        const generationsResponse = await fetch('/api/blog/generate');
        if (!generationsResponse.ok) {
          throw new Error('Failed to fetch generations');
        }
        const generationsData = await generationsResponse.json();
        setGenerations(generationsData.generations || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthorized]);
  
  if (!isAuthorized) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You do not have permission to access this page.
        </AlertDescription>
      </Alert>
    );
  }
  
  const renderSchedules = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    if (schedules.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No content schedules found. Create your first schedule to get started.</p>
          <Button className="mt-4">Create Schedule</Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{schedule.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {schedule.description || 'No description provided'}
                  </p>
                </div>
                <Badge variant={schedule.isActive ? 'default' : 'outline'}>
                  {schedule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {schedule.frequency === 'weekly' 
                      ? `Weekly on ${getDayName(schedule.dayOfWeek)}`
                      : schedule.frequency === 'monthly'
                        ? `Monthly on day ${schedule.dayOfMonth}`
                        : 'Daily'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {`${schedule.hour}:${schedule.minute.toString().padStart(2, '0')}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {schedule.topicArea || 'Any topic'}
                    {schedule.keyStage ? ` (KS${schedule.keyStage})` : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Run Now
                </Button>
                <Button variant="outline" size="sm" className={schedule.isActive ? 'text-destructive' : ''}>
                  {schedule.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-end mt-6">
          <Button>
            Create New Schedule
          </Button>
        </div>
      </div>
    );
  };
  
  const renderGenerations = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    if (generations.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No content generations found. Generate your first blog post to get started.</p>
          <Button className="mt-4">Generate Content</Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {generations.map((generation) => (
          <Card key={generation.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {generation.blogPost?.title || 'Content Generation'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(generation.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge 
                  variant={
                    generation.status === 'completed' ? 'default' : 
                    generation.status === 'failed' ? 'destructive' : 
                    'outline'
                  }
                >
                  {generation.status.charAt(0).toUpperCase() + generation.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="mb-4">
                <p className="text-sm font-medium">Prompt:</p>
                <p className="text-sm text-muted-foreground">{generation.prompt}</p>
              </div>
              
              {generation.status === 'processing' && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Generating content...</span>
                </div>
              )}
              
              {generation.status === 'failed' && generation.error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{generation.error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                {generation.blogPostId && (
                  <Button variant="outline" size="sm">
                    View Post
                  </Button>
                )}
                
                {generation.status === 'failed' && (
                  <Button variant="outline" size="sm">
                    Retry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="mt-6">
          <BlogGenerationForm />
        </div>
      </div>
    );
  };
  
  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Total Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-3xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-3xl font-bold">1,254</p>
              <p className="text-sm text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Mathematics</Badge>
                <Badge variant="secondary">English</Badge>
                <Badge variant="secondary">Science</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Monthly Content Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder - would integrate with a charting library
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">How to Support Students with Dyslexia</p>
                    <p className="text-sm text-muted-foreground">Published 2 weeks ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{120 - i * 15} views</p>
                    <p className="text-sm text-muted-foreground">{12 - i} comments</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Content Management</h1>
        <Button onClick={() => window.location.href = '/blog/new'}>
          Create Blog Post
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedules">Content Schedules</TabsTrigger>
          <TabsTrigger value="generations">AI Generations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="pt-6">
          {renderSchedules()}
        </TabsContent>
        
        <TabsContent value="generations" className="pt-6">
          {renderGenerations()}
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get day name from day number
function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || 'Unknown';
}
