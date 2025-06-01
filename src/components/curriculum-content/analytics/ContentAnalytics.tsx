'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  BookOpen,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Zap,
  Download,
  Share2,
  Printer,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';

import {
  ContentType,
  ContentStatus,
  ContentMetadata
} from '@/lib/curriculum-content/types';

/**
 * Content Analytics Component
 * 
 * Provides comprehensive analytics and reporting for curriculum content
 * with usage statistics, engagement metrics, and performance indicators.
 */
export function ContentAnalytics() {
  const { toast } = useToast();
  
  // Analytics state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<string>('last30days');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  // Date range options
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'thisyear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];
  
  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);
  
  const fetchAnalyticsData = () => {
    setIsLoading(true);
    
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    setTimeout(() => {
      const mockData = {
        overview: {
          totalViews: 12458,
          uniqueUsers: 3245,
          averageEngagementTime: '8m 32s',
          completionRate: 78.5,
          contentCount: {
            total: 342,
            byType: {
              [ContentType.EXPLANATION]: 124,
              [ContentType.EXERCISE]: 98,
              [ContentType.VIDEO]: 45,
              [ContentType.AUDIO]: 28,
              [ContentType.INTERACTIVE]: 32,
              [ContentType.ASSESSMENT]: 15
            },
            byStatus: {
              [ContentStatus.PUBLISHED]: 285,
              [ContentStatus.DRAFT]: 42,
              [ContentStatus.REVIEW]: 15,
              [ContentStatus.ARCHIVED]: 0
            }
          },
          keyStageDistribution: {
            'EYFS': 15,
            'KS1': 68,
            'KS2': 95,
            'KS3': 87,
            'KS4': 62,
            'KS5': 15
          },
          subjectDistribution: {
            'Mathematics': 78,
            'English': 65,
            'Science': 54,
            'History': 32,
            'Geography': 28,
            'Art': 18,
            'Music': 15,
            'Physical Education': 12,
            'Computing': 25,
            'Other': 15
          }
        },
        engagement: {
          dailyViews: [
            { date: '2025-05-01', views: 345 },
            { date: '2025-05-02', views: 389 },
            { date: '2025-05-03', views: 287 },
            { date: '2025-05-04', views: 312 },
            { date: '2025-05-05', views: 456 },
            { date: '2025-05-06', views: 478 },
            { date: '2025-05-07', views: 423 },
            { date: '2025-05-08', views: 401 },
            { date: '2025-05-09', views: 387 },
            { date: '2025-05-10', views: 298 },
            { date: '2025-05-11', views: 276 },
            { date: '2025-05-12', views: 432 },
            { date: '2025-05-13', views: 467 },
            { date: '2025-05-14', views: 489 },
            { date: '2025-05-15', views: 512 },
            { date: '2025-05-16', views: 498 },
            { date: '2025-05-17', views: 387 },
            { date: '2025-05-18', views: 356 },
            { date: '2025-05-19', views: 423 },
            { date: '2025-05-20', views: 456 },
            { date: '2025-05-21', views: 478 },
            { date: '2025-05-22', views: 501 },
            { date: '2025-05-23', views: 489 },
            { date: '2025-05-24', views: 378 },
            { date: '2025-05-25', views: 345 },
            { date: '2025-05-26', views: 412 },
            { date: '2025-05-27', views: 456 },
            { date: '2025-05-28', views: 489 },
            { date: '2025-05-29', views: 512 },
            { date: '2025-05-30', views: 498 }
          ],
          averageTimeByContentType: {
            [ContentType.EXPLANATION]: '6m 45s',
            [ContentType.EXERCISE]: '12m 23s',
            [ContentType.VIDEO]: '8m 56s',
            [ContentType.AUDIO]: '7m 12s',
            [ContentType.INTERACTIVE]: '15m 34s',
            [ContentType.ASSESSMENT]: '18m 45s'
          },
          completionRateByKeyStage: {
            'EYFS': 82.3,
            'KS1': 79.8,
            'KS2': 76.5,
            'KS3': 72.1,
            'KS4': 68.7,
            'KS5': 65.2
          },
          deviceUsage: {
            'Desktop': 45.2,
            'Tablet': 32.8,
            'Mobile': 22.0
          },
          timeOfDayUsage: {
            'Morning (6am-12pm)': 28.5,
            'Afternoon (12pm-6pm)': 42.3,
            'Evening (6pm-12am)': 26.7,
            'Night (12am-6am)': 2.5
          }
        },
        performance: {
          topPerformingContent: [
            {
              id: 'content-123',
              title: 'Introduction to Fractions',
              type: ContentType.EXPLANATION,
              keyStage: 'KS2',
              subject: 'Mathematics',
              views: 1245,
              avgEngagementTime: '9m 23s',
              completionRate: 87.5
            },
            {
              id: 'content-456',
              title: 'Understanding Photosynthesis',
              type: ContentType.VIDEO,
              keyStage: 'KS3',
              subject: 'Science',
              views: 1156,
              avgEngagementTime: '7m 45s',
              completionRate: 85.2
            },
            {
              id: 'content-789',
              title: 'Shakespeare\'s Romeo and Juliet',
              type: ContentType.INTERACTIVE,
              keyStage: 'KS4',
              subject: 'English',
              views: 987,
              avgEngagementTime: '12m 34s',
              completionRate: 82.7
            },
            {
              id: 'content-101',
              title: 'World War II Timeline',
              type: ContentType.EXPLANATION,
              keyStage: 'KS3',
              subject: 'History',
              views: 876,
              avgEngagementTime: '8m 12s',
              completionRate: 80.1
            },
            {
              id: 'content-102',
              title: 'Basic Coding Concepts',
              type: ContentType.EXERCISE,
              keyStage: 'KS2',
              subject: 'Computing',
              views: 823,
              avgEngagementTime: '14m 56s',
              completionRate: 79.8
            }
          ],
          underperformingContent: [
            {
              id: 'content-301',
              title: 'Advanced Calculus',
              type: ContentType.EXERCISE,
              keyStage: 'KS5',
              subject: 'Mathematics',
              views: 156,
              avgEngagementTime: '4m 12s',
              completionRate: 45.3
            },
            {
              id: 'content-302',
              title: 'Poetry Analysis Techniques',
              type: ContentType.EXPLANATION,
              keyStage: 'KS4',
              subject: 'English',
              views: 187,
              avgEngagementTime: '3m 45s',
              completionRate: 48.7
            },
            {
              id: 'content-303',
              title: 'Chemical Bonding',
              type: ContentType.VIDEO,
              keyStage: 'KS4',
              subject: 'Science',
              views: 201,
              avgEngagementTime: '5m 23s',
              completionRate: 52.1
            }
          ],
          improvementSuggestions: [
            {
              contentId: 'content-301',
              suggestion: 'Break down complex concepts into smaller, more digestible sections',
              expectedImpact: 'Increase completion rate by 15-20%'
            },
            {
              contentId: 'content-302',
              suggestion: 'Add more interactive examples and visual aids',
              expectedImpact: 'Increase engagement time by 40-50%'
            },
            {
              contentId: 'content-303',
              suggestion: 'Include more real-world applications and examples',
              expectedImpact: 'Improve completion rate by 10-15%'
            }
          ]
        },
        learning: {
          learningOutcomesByKeyStage: {
            'EYFS': 78.5,
            'KS1': 76.2,
            'KS2': 72.8,
            'KS3': 68.5,
            'KS4': 65.3,
            'KS5': 62.7
          },
          assessmentPerformance: {
            'Mathematics': 72.5,
            'English': 68.9,
            'Science': 70.2,
            'History': 75.6,
            'Geography': 73.8,
            'Computing': 76.2
          },
          progressionRates: {
            'EYFS to KS1': 92.5,
            'KS1 to KS2': 88.7,
            'KS2 to KS3': 85.2,
            'KS3 to KS4': 82.6,
            'KS4 to KS5': 78.9
          },
          skillMastery: {
            'Critical Thinking': 68.5,
            'Problem Solving': 72.3,
            'Communication': 65.7,
            'Collaboration': 70.1,
            'Creativity': 67.8,
            'Digital Literacy': 75.2
          }
        }
      };
      
      setAnalyticsData(mockData);
      setIsLoading(false);
      
      toast({
        title: "Analytics updated",
        description: `Analytics data has been updated for ${getDateRangeLabel(dateRange)}`
      });
    }, 1500);
  };
  
  // Get date range label
  const getDateRangeLabel = (value: string) => {
    const option = dateRangeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };
  
  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };
  
  // Handle export data
  const handleExportData = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: `Analytics data has been exported in ${format.toUpperCase()} format`
    });
  };
  
  // Handle refresh data
  const handleRefreshData = () => {
    fetchAnalyticsData();
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };
  
  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Curriculum Content Analytics</CardTitle>
              <CardDescription>
                Comprehensive analytics and reporting for curriculum content
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Label htmlFor="dateRange" className="text-sm">Date Range:</Label>
                <select
                  id="dateRange"
                  className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Users className="h-4 w-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="performance">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="learning">
                <Award className="h-4 w-4 mr-2" />
                Learning Outcomes
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                          <h3 className="text-2xl font-bold mt-1">{formatNumber(analyticsData.overview.totalViews)}</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-green-500 font-medium">↑ 12.5%</span> from previous period
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                          <h3 className="text-2xl font-bold mt-1">{formatNumber(analyticsData.overview.uniqueUsers)}</h3>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-green-500 font-medium">↑ 8.3%</span> from previous period
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg. Engagement Time</p>
                          <h3 className="text-2xl font-bold mt-1">{analyticsData.overview.averageEngagementTime}</h3>
                        </div>
                        <div className="bg-yellow-500/10 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-green-500 font-medium">↑ 5.2%</span> from previous period
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <h3 className="text-2xl font-bold mt-1">{formatPercentage(analyticsData.overview.completionRate)}</h3>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <Award className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-green-500 font-medium">↑ 3.7%</span> from previous period
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Content Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Content by Key Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <PieChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Key Stage Distribution Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Object.entries(analyticsData.overview.keyStageDistribution).map(([keyStage, count]) => (
                          <div key={keyStage} className="flex items-center justify-between">
                            <span className="text-xs font-medium">{keyStage}</span>
                            <Badge variant="outline" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Content by Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Subject Distribution Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(analyticsData.overview.subjectDistribution)
                          .sort((a, b) => (b[1] as number) - (a[1] as number))
                          .slice(0, 6)
                          .map(([subject, count]) => (
                            <div key={subject} className="flex items-center justify-between">
                              <span className="text-xs font-medium truncate mr-2">{subject}</span>
                              <Badge variant="outline" className="text-xs">
                                {count}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Content Types and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Content by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(analyticsData.overview.contentCount.byType).map(([type, count]) => (
                          <div key={type} className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(count as number) / analyticsData.overview.contentCount.total * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between min-w-[120px]">
                              <span className="text-xs font-medium">{type}</span>
                              <Badge variant="outline" className="text-xs">
                                {count}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Content by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <PieChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Status Distribution Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {Object.entries(analyticsData.overview.contentCount.byStatus).map(([status, count]) => (
                          <Card key={status} className="border-0 shadow-none bg-muted/50">
                            <CardContent className="p-3 flex justify-between items-center">
                              <span className="text-xs font-medium">{status}</span>
                              <Badge 
                                variant={
                                  status === ContentStatus.PUBLISHED ? "success" :
                                  status === ContentStatus.DRAFT ? "secondary" :
                                  status === ContentStatus.REVIEW ? "warning" :
                                  "destructive"
                                }
                                className="text-xs"
                              >
                                {count}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Engagement Tab */}
            <TabsContent value="engagement">
              <div className="space-y-6">
                {/* Daily Views Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Daily Content Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <LineChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                        <p>Daily Views Trend Chart</p>
                        <p className="text-xs mt-1">(Visualization would appear here)</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{analyticsData.engagement.dailyViews[0].date}</span>
                      <span>{analyticsData.engagement.dailyViews[analyticsData.engagement.dailyViews.length - 1].date}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Engagement Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Average Time by Content Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analyticsData.engagement.averageTimeByContentType).map(([type, time]) => (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {type === ContentType.EXPLANATION && <BookOpen className="h-4 w-4 mr-2" />}
                              {type === ContentType.EXERCISE && <FileText className="h-4 w-4 mr-2" />}
                              {type === ContentType.VIDEO && <Video className="h-4 w-4 mr-2" />}
                              {type === ContentType.AUDIO && <Headphones className="h-4 w-4 mr-2" />}
                              {type === ContentType.INTERACTIVE && <MousePointer className="h-4 w-4 mr-2" />}
                              {type === ContentType.ASSESSMENT && <FileText className="h-4 w-4 mr-2" />}
                              <span className="text-sm">{type}</span>
                            </div>
                            <Badge variant="outline">{time}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Completion Rate by Key Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analyticsData.engagement.completionRateByKeyStage).map(([keyStage, rate]) => (
                          <div key={keyStage} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{keyStage}</span>
                              <span className="text-sm font-medium">{formatPercentage(rate as number)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (rate as number) > 75 ? 'bg-green-500' :
                                  (rate as number) > 65 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Usage Patterns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Device Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <PieChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Device Usage Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {Object.entries(analyticsData.engagement.deviceUsage).map(([device, percentage]) => (
                          <Card key={device} className="border-0 shadow-none bg-muted/50">
                            <CardContent className="p-3 text-center">
                              <div className="text-sm font-medium">{device}</div>
                              <div className="text-lg font-bold mt-1">{formatPercentage(percentage as number)}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Time of Day Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Time of Day Usage Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        {Object.entries(analyticsData.engagement.timeOfDayUsage).map(([timeOfDay, percentage]) => (
                          <div key={timeOfDay} className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between min-w-[100px]">
                              <span className="text-xs">{timeOfDay}</span>
                              <span className="text-xs font-medium">{formatPercentage(percentage as number)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="space-y-6">
                {/* Top Performing Content */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Top Performing Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.performance.topPerformingContent.map((content: any, index: number) => (
                        <div key={content.id} className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div className="space-y-1 flex-grow">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">{content.title}</h4>
                              <Badge variant="outline" className="ml-2">
                                {content.keyStage}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                              <span>{content.subject}</span>
                              <span>{content.type}</span>
                              <span>{formatNumber(content.views)} views</span>
                              <span>{content.avgEngagementTime} avg. time</span>
                              <span>{formatPercentage(content.completionRate)} completion</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Underperforming Content */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Underperforming Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.performance.underperformingContent.map((content: any) => (
                        <Card key={content.id} className="border-l-4 border-l-red-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium">{content.title}</h4>
                                <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground mt-1">
                                  <span>{content.subject}</span>
                                  <span>{content.type}</span>
                                  <span>{content.keyStage}</span>
                                </div>
                              </div>
                              <Badge variant="destructive">
                                {formatPercentage(content.completionRate)} completion
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <div className="bg-muted/50 p-2 rounded text-center">
                                <div className="text-xs text-muted-foreground">Views</div>
                                <div className="text-sm font-medium">{formatNumber(content.views)}</div>
                              </div>
                              <div className="bg-muted/50 p-2 rounded text-center">
                                <div className="text-xs text-muted-foreground">Avg. Time</div>
                                <div className="text-sm font-medium">{content.avgEngagementTime}</div>
                              </div>
                              <div className="bg-muted/50 p-2 rounded text-center">
                                <div className="text-xs text-muted-foreground">Completion</div>
                                <div className="text-sm font-medium">{formatPercentage(content.completionRate)}</div>
                              </div>
                            </div>
                            
                            {analyticsData.performance.improvementSuggestions
                              .filter((suggestion: any) => suggestion.contentId === content.id)
                              .map((suggestion: any, index: number) => (
                                <div key={index} className="mt-3 bg-yellow-50 p-3 rounded-md">
                                  <div className="flex items-start">
                                    <Zap className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                                    <div>
                                      <div className="text-sm font-medium text-yellow-700">Improvement Suggestion</div>
                                      <p className="text-xs text-yellow-600 mt-1">{suggestion.suggestion}</p>
                                      <p className="text-xs font-medium text-yellow-700 mt-1">Expected Impact: {suggestion.expectedImpact}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Learning Outcomes Tab */}
            <TabsContent value="learning">
              <div className="space-y-6">
                {/* Learning Outcomes Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Learning Outcomes by Key Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Learning Outcomes Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        {Object.entries(analyticsData.learning.learningOutcomesByKeyStage).map(([keyStage, rate]) => (
                          <div key={keyStage} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{keyStage}</span>
                              <span className="text-sm font-medium">{formatPercentage(rate as number)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (rate as number) > 75 ? 'bg-green-500' :
                                  (rate as number) > 65 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Assessment Performance by Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-2 text-primary/60" />
                          <p>Assessment Performance Chart</p>
                          <p className="text-xs mt-1">(Visualization would appear here)</p>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        {Object.entries(analyticsData.learning.assessmentPerformance).map(([subject, rate]) => (
                          <div key={subject} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{subject}</span>
                              <span className="text-sm font-medium">{formatPercentage(rate as number)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (rate as number) > 75 ? 'bg-green-500' :
                                  (rate as number) > 65 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Progression and Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Progression Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analyticsData.learning.progressionRates).map(([progression, rate]) => (
                          <div key={progression} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-sm">{progression}</span>
                            </div>
                            <Badge 
                              variant={(rate as number) > 85 ? "success" : "secondary"}
                            >
                              {formatPercentage(rate as number)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Skill Mastery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(analyticsData.learning.skillMastery).map(([skill, rate]) => (
                          <Card key={skill} className="border-0 shadow-none bg-muted/50">
                            <CardContent className="p-3">
                              <div className="text-sm font-medium mb-2">{skill}</div>
                              <div className="w-full bg-background rounded-full h-2 mb-1">
                                <div 
                                  className={`h-2 rounded-full ${
                                    (rate as number) > 75 ? 'bg-green-500' :
                                    (rate as number) > 65 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${rate}%` }}
                                ></div>
                              </div>
                              <div className="text-right text-xs font-medium">
                                {formatPercentage(rate as number)}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExportData('pdf')}>
              <FileText className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
