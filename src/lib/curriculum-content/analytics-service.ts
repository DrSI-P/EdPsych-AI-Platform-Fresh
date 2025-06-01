/**
 * Content Analytics Service
 * Provides analytics and reporting capabilities for curriculum content
 */

import { 
  ContentMetadata,
  ContentAnalytics,
  ContentType,
  UKKeyStage,
  UKSubject
} from './types';

/**
 * Analytics date range interface
 */
export interface AnalyticsDateRange {
  from: string;
  to: string;
  label: string;
}

/**
 * Analytics overview interface
 */
export interface AnalyticsOverview {
  totalViews: number;
  uniqueUsers: number;
  averageEngagementTime: string;
  completionRate: number;
  contentCount: {
    total: number;
    byType: Record<ContentType, number>;
    byStatus: Record<string, number>;
  };
  keyStageDistribution: Record<UKKeyStage, number>;
  subjectDistribution: Record<UKSubject, number>;
}

/**
 * Engagement metrics interface
 */
export interface EngagementMetrics {
  dailyViews: Array<{ date: string; views: number }>;
  averageTimeByContentType: Record<ContentType, string>;
  completionRateByKeyStage: Record<UKKeyStage, number>;
  deviceUsage: Record<string, number>;
  timeOfDayUsage: Record<string, number>;
}

/**
 * Content performance interface
 */
export interface ContentPerformance {
  topPerformingContent: Array<{
    id: string;
    title: string;
    type: ContentType;
    keyStage: UKKeyStage;
    subject: UKSubject;
    views: number;
    avgEngagementTime: string;
    completionRate: number;
  }>;
  underperformingContent: Array<{
    id: string;
    title: string;
    type: ContentType;
    keyStage: UKKeyStage;
    subject: UKSubject;
    views: number;
    avgEngagementTime: string;
    completionRate: number;
  }>;
  improvementSuggestions: Array<{
    contentId: string;
    suggestion: string;
    expectedImpact: string;
  }>;
}

/**
 * Learning outcomes interface
 */
export interface LearningOutcomes {
  learningOutcomesByKeyStage: Record<UKKeyStage, number>;
  assessmentPerformance: Record<UKSubject, number>;
  progressionRates: Record<string, number>;
  skillMastery: Record<string, number>;
}

/**
 * Complete analytics data interface
 */
export interface AnalyticsData {
  overview: AnalyticsOverview;
  engagement: EngagementMetrics;
  performance: ContentPerformance;
  learning: LearningOutcomes;
}

/**
 * Get available date range options
 */
export function getAnalyticsDateRangeOptions(): AnalyticsDateRange[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      from: today.toISOString(),
      to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
      label: 'Today'
    },
    {
      from: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(today.getTime() - 1).toISOString(),
      label: 'Yesterday'
    },
    {
      from: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
      label: 'Last 7 Days'
    },
    {
      from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
      label: 'Last 30 Days'
    },
    {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
      label: 'This Month'
    },
    {
      from: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
      to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString(),
      label: 'Last Month'
    },
    {
      from: new Date(now.getFullYear(), 0, 1).toISOString(),
      to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString(),
      label: 'This Year'
    },
    {
      from: new Date(now.getFullYear() - 1, 0, 1).toISOString(),
      to: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999).toISOString(),
      label: 'Last Year'
    }
  ];
}

/**
 * Fetch analytics data for a specific date range
 */
export async function fetchAnalyticsData(dateRange: AnalyticsDateRange): Promise<AnalyticsData> {
  try {
    const response = await fetch('/api/curriculum-content/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: dateRange.from,
        to: dateRange.to
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // Return mock data for development/testing
    return getMockAnalyticsData();
  }
}

/**
 * Get analytics data for a specific content item
 */
export async function getContentAnalytics(contentId: string): Promise<ContentAnalytics> {
  try {
    const response = await fetch(`/api/curriculum-content/${contentId}/analytics`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content analytics: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching content analytics:', error);
    
    // Return mock data for development/testing
    return {
      contentId,
      views: Math.floor(Math.random() * 1000) + 100,
      completions: Math.floor(Math.random() * 500) + 50,
      averageTimeSpent: Math.floor(Math.random() * 600) + 60,
      averageRating: (Math.random() * 2) + 3,
      successRate: Math.floor(Math.random() * 30) + 70,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Export analytics data to CSV
 */
export function exportAnalyticsToCSV(data: AnalyticsData): string {
  // In a real implementation, this would convert the data to CSV format
  // For now, we'll just return a mock CSV string
  
  let csv = 'Category,Metric,Value\n';
  
  // Add overview metrics
  csv += `Overview,Total Views,${data.overview.totalViews}\n`;
  csv += `Overview,Unique Users,${data.overview.uniqueUsers}\n`;
  csv += `Overview,Average Engagement Time,${data.overview.averageEngagementTime}\n`;
  csv += `Overview,Completion Rate,${data.overview.completionRate}%\n`;
  csv += `Overview,Total Content,${data.overview.contentCount.total}\n`;
  
  // Add content type distribution
  Object.entries(data.overview.contentCount.byType).forEach(([type, count]) => {
    csv += `Content Types,${type},${count}\n`;
  });
  
  // Add key stage distribution
  Object.entries(data.overview.keyStageDistribution).forEach(([keyStage, count]) => {
    csv += `Key Stages,${keyStage},${count}\n`;
  });
  
  // Add subject distribution
  Object.entries(data.overview.subjectDistribution).forEach(([subject, count]) => {
    csv += `Subjects,${subject},${count}\n`;
  });
  
  // Add daily views
  data.engagement.dailyViews.forEach(({ date, views }) => {
    csv += `Daily Views,${date},${views}\n`;
  });
  
  // Add top performing content
  data.performance.topPerformingContent.forEach((content, index) => {
    csv += `Top Content,${index + 1},${content.title} (${content.views} views, ${content.completionRate}% completion)\n`;
  });
  
  return csv;
}

/**
 * Generate mock analytics data for development/testing
 */
function getMockAnalyticsData(): AnalyticsData {
  return {
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
          [ContentType.ASSESSMENT]: 15,
          [ContentType.EXAMPLE]: 45,
          [ContentType.RESOURCE]: 28,
          [ContentType.PROJECT]: 32,
          [ContentType.DISCUSSION]: 0
        },
        byStatus: {
          'PUBLISHED': 285,
          'DRAFT': 42,
          'REVIEW': 15,
          'ARCHIVED': 0,
          'APPROVED': 0,
          'REJECTED': 0
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
        'Design and Technology': 0,
        'Modern Foreign Languages': 0,
        'Religious Education': 0,
        'PSHE': 15
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
        [ContentType.ASSESSMENT]: '18m 45s',
        [ContentType.EXAMPLE]: '8m 56s',
        [ContentType.RESOURCE]: '7m 12s',
        [ContentType.PROJECT]: '15m 34s',
        [ContentType.DISCUSSION]: '0m 0s'
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
          type: ContentType.EXPLANATION,
          keyStage: 'KS3',
          subject: 'Science',
          views: 1156,
          avgEngagementTime: '7m 45s',
          completionRate: 85.2
        },
        {
          id: 'content-789',
          title: 'Shakespeare\'s Romeo and Juliet',
          type: ContentType.EXERCISE,
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
          type: ContentType.EXPLANATION,
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
        'Computing': 76.2,
        'Art': 0,
        'Music': 0,
        'Physical Education': 0,
        'Design and Technology': 0,
        'Modern Foreign Languages': 0,
        'Religious Education': 0,
        'PSHE': 0
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
}
