// Analytics utilities for EdPsych-AI-Education-Platform
// Provides comprehensive analytics tracking, reporting, and visualisation

import { useEffect, useState } from 'react';

/**
 * Analytics event types supported by the platform
 */
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  FEATURE_USAGE = 'feature_usage',
  LEARNING_PROGRESS = 'learning_progress',
  USER_ENGAGEMENT = 'user_engagement',
  ASSESSMENT_COMPLETION = 'assessment_completion',
  ERROR_OCCURRED = 'error_occurred',
  RESOURCE_ACCESS = 'resource_access',
  VIDEO_INTERACTION = 'video_interaction',
  SEARCH_PERFORMED = 'search_performed',
  FEEDBACK_PROVIDED = 'feedback_provided'
}

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * User session information
 */
export interface SessionInfo {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    screenSize: {
      width: number;
      height: number;
    };
  };
  referrer?: string;
  entryPath: string;
}

/**
 * Analytics configuration options
 */
export interface AnalyticsConfig {
  enabled: boolean;
  anonymizeIp: boolean;
  trackErrors: boolean;
  trackPerformance: boolean;
  samplingRate: number; // 0-1 value
  excludePaths: any[];
  consentRequired: boolean;
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  anonymizeIp: true,
  trackErrors: true,
  trackPerformance: true,
  samplingRate: 1.0,
  excludePaths: ['/admin', '/debug'],
  consentRequired: true
};

// Session storage
let currentSession: SessionInfo | null = null;
let analyticsQueue: any[] = [];
let analyticsConfig: AnalyticsConfig = defaultConfig;
let consentGiven = false;

/**
 * Initialize analytics system
 */
export const initializeAnalytics = (config?: Partial<AnalyticsConfig>): void => {
  analyticsConfig = { ...defaultConfig, ...config };
  
  // Check for existing consent
  if (typeof window !== 'undefined') {
    consentGiven = localStorage.getItem('analytics_consent') === 'true';
  }
  
  // Create or resume session
  if (!currentSession && typeof window !== 'undefined') {
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    
    if (existingSessionId) {
      resumeSession(existingSessionId);
    } else {
      createNewSession();
    }
  }
  
  // Set up error tracking if enabled
  if (analyticsConfig.trackErrors && typeof window !== 'undefined') {
    window.addEventListener('error', handleErrorEvent);
  }
  
  // Set up performance tracking if enabled
  if (analyticsConfig.trackPerformance && typeof window !== 'undefined') {
    trackPerformanceMetrics();
  }
};

/**
 * Create a new analytics session
 */
export const createNewSession = (): SessionInfo => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot create session in server-side context');
  }
  
  const sessionId = generateUniqueId();
  const now = Date.now();
  
  const userAgent = window.navigator.userAgent;
  const deviceType = getDeviceType(userAgent);
  const browserInfo = getBrowserInfo(userAgent);
  const osInfo = getOSInfo(userAgent);
  
  currentSession = {
    sessionId,
    startTime: now,
    lastActivity: now,
    deviceInfo: {
      type: deviceType,
      browser: browserInfo,
      os: osInfo,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    referrer: document.referrer,
    entryPath: window.location.pathname
  };
  
  // Store session ID in sessionStorage
  sessionStorage.setItem('analytics_session_id', sessionId);
  
  // Track session start event
  trackEvent({
    type: AnalyticsEventType.PAGE_VIEW,
    properties: {
      path: window.location.pathname,
      title: document.title,
      isEntryPage: true
    }
  });
  
  return currentSession;
};

/**
 * Resume an existing analytics session
 */
export const resumeSession = (sessionId: string): SessionInfo | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const now = Date.now();
  
  // Update session info
  if (currentSession) {
    currentSession.lastActivity = now;
    return currentSession;
  }
  
  // Create new session with existing ID
  currentSession = {
    sessionId,
    startTime: now, // We don't know the actual start time, so use now
    lastActivity: now,
    deviceInfo: {
      type: getDeviceType(window.navigator.userAgent),
      browser: getBrowserInfo(window.navigator.userAgent),
      os: getOSInfo(window.navigator.userAgent),
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    entryPath: window.location.pathname
  };
  
  return currentSession;
};

/**
 * Track an analytics event
 */
export const trackEvent = (eventData: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void => {
  if (!analyticsConfig.enabled || (analyticsConfig.consentRequired && !consentGiven)) {
    return;
  }
  
  if (!currentSession && typeof window !== 'undefined') {
    createNewSession();
  }
  
  if (!currentSession) {
    console.warn('Cannot track event: No active session');
    return;
  }
  
  // Check if current path is excluded
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (analyticsConfig.excludePaths.some(path => currentPath.startsWith(path))) {
      return;
    }
  }
  
  // Apply sampling rate
  if (Math.random() > analyticsConfig.samplingRate) {
    return;
  }
  
  const event: AnalyticsEvent = {
    ...eventData,
    timestamp: Date.now(),
    sessionId: currentSession.sessionId,
  };
  
  // Update last activity time
  if (currentSession) {
    currentSession.lastActivity = event.timestamp;
  }
  
  // Queue event for sending
  analyticsQueue.push(event);
  
  // Process queue if it reaches threshold or immediately for certain events
  if (analyticsQueue.length >= 10 || 
      event.type === AnalyticsEventType.ERROR_OCCURRED) {
    processAnalyticsQueue();
  }
};

/**
 * Process and send queued analytics events
 */
export const processAnalyticsQueue = async (): Promise<void> => {
  if (analyticsQueue.length === 0) {
    return;
  }
  
  const eventsToSend = [...analyticsQueue];
  analyticsQueue = [];
  
  try {
    // In a real implementation, this would send to a backend endpoint
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics events:', eventsToSend);
    }
    
    // Here would be the actual API call to send events
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events: eventsToSend })
    // });
  } catch (error) {
    console.error('Failed to send analytics events:', error);
    // Put events back in queue for retry
    analyticsQueue = [...eventsToSend, ...analyticsQueue];
  }
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title: string): void => {
  trackEvent({
    type: AnalyticsEventType.PAGE_VIEW,
    properties: {
      path,
      title
    }
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (featureName: string, details?: Record<string, any>): void => {
  trackEvent({
    type: AnalyticsEventType.FEATURE_USAGE,
    properties: {
      feature: featureName,
      ...details
    }
  });
};

/**
 * Track learning progress
 */
export const trackLearningProgress = (
  moduleId: string, 
  progress: number, 
  completedActivities: any[],
  timeSpent: number
): void => {
  trackEvent({
    type: AnalyticsEventType.LEARNING_PROGRESS,
    properties: {
      moduleId,
      progress,
      completedActivities,
      timeSpent
    }
  });
};

/**
 * Track assessment completion
 */
export const trackAssessmentCompletion = (
  assessmentId: string,
  score: number,
  timeSpent: number,
  questionsAnswered: number,
  correctAnswers: number
): void => {
  trackEvent({
    type: AnalyticsEventType.ASSESSMENT_COMPLETION,
    properties: {
      assessmentId,
      score,
      timeSpent,
      questionsAnswered,
      correctAnswers,
      accuracy: correctAnswers / questionsAnswered
    }
  });
};

/**
 * Track error occurrence
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  stackTrace?: string,
  componentName?: string
): void => {
  trackEvent({
    type: AnalyticsEventType.ERROR_OCCURRED,
    properties: {
      errorType,
      errorMessage,
      stackTrace,
      componentName,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }
  });
};

/**
 * Handle window error events
 */
const handleErrorEvent = (event: ErrorEvent): void => {
  trackError(
    'unhandled_error',
    event.message,
    event.error?.stack,
    event.filename
  );
};

/**
 * Track performance metrics
 */
const trackPerformanceMetrics = (): void => {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }
  
  // Track page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime = perfData.domComplete - perfData.domLoading;
      
      trackEvent({
        type: AnalyticsEventType.PAGE_VIEW,
        properties: {
          performance: {
            pageLoadTime,
            domReadyTime,
            redirectTime: perfData.redirectEnd - perfData.redirectStart,
            dnsLookupTime: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcpConnectTime: perfData.connectEnd - perfData.connectStart,
            serverResponseTime: perfData.responseEnd - perfData.requestStart,
            domParseTime: perfData.domInteractive - perfData.responseEnd,
            resourcesLoadTime: perfData.loadEventStart - perfData.domContentLoadedEventEnd
          }
        }
      });
    }, 0);
  });
  
  // Track resource timing if available
  if (window.performance.getEntriesByType) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = window.performance.getEntriesByType('resource');
        const resourceStats = resources.map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize || 0,
          type: resource.initiatorType
        }));
        
        trackEvent({
          type: AnalyticsEventType.PAGE_VIEW,
          properties: {
            resourceStats: {
              count: resourceStats.length,
              totalSize: resourceStats.reduce((sum, r) => sum + r.size, 0),
              slowestResources: resourceStats
                .sort((a, b) => b.duration - a.duration)
                .slice(0, 5)
            }
          }
        });
      }, 0);
    });
  }
};

/**
 * Set user consent for analytics
 */
export const setAnalyticsConsent = (consent: boolean): void => {
  consentGiven = consent;
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics_consent', consent.toString());
  }
  
  if (consent) {
    // If consent was just given, process any queued events
    processAnalyticsQueue();
  }
};

/**
 * Check if user has given consent for analytics
 */
export const hasAnalyticsConsent = (): boolean => {
  return consentGiven;
};

/**
 * Generate a unique ID for sessions or events
 */
const generateUniqueId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get device type from user agent
 */
const getDeviceType = (userAgent: string): 'mobile' | 'tablet' | 'desktop' => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
};

/**
 * Get browser information from user agent
 */
const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('SamsungBrowser')) return 'Samsung Browser';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  if (userAgent.includes('Trident')) return 'Internet Explorer';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Unknown';
};

/**
 * Get OS information from user agent
 */
const getOSInfo = (userAgent: string): string => {
  if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows NT 6.0')) return 'Windows Vista';
  if (userAgent.includes('Windows NT 5.1')) return 'Windows XP';
  if (userAgent.includes('Windows NT')) return 'Windows';
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  if (userAgent.includes('Linux')) return 'Linux';
  return 'Unknown';
};

/**
 * React hook for tracking page views
 */
export const usePageViewTracking = (path?: string, title?: string): void => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = path || window.location.pathname;
      const currentTitle = title || document.title;
      
      trackPageView(currentPath, currentTitle);
    }
  }, [path, title]);
};

/**
 * React hook for tracking feature usage
 */
export const useFeatureTracking = (featureName: string): (details?: Record<string, any>) => void => {
  return (details?: Record<string, any>) => {
    trackFeatureUsage(featureName, details);
  };
};

/**
 * React hook for analytics consent management
 */
export const useAnalyticsConsent = (): [boolean, (consent: boolean) => void] => {
  const [consent, setConsent] = useState<boolean>(consentGiven);
  
  const updateConsent = (newConsent: boolean) => {
    setAnalyticsConsent(newConsent);
    setConsent(newConsent);
  };
  
  return [consent, updateConsent];
};

/**
 * Get analytics data for reporting
 */
export const getAnalyticsReport = async (
  startDate: Date,
  endDate: Date,
  metrics: any[],
  filters?: Record<string, any>
): Promise<Record<string, any>> => {
  // In a real implementation, this would fetch from a backend API
  // For now, return mock data
  return {
    timeRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    },
    summary: {
      totalUsers: 1250,
      newUsers: 342,
      returningUsers: 908,
      averageSessionDuration: 724, // seconds
      averagePageViews: 8.3,
      bounceRate: 0.23
    },
    pageViews: {
      total: 10342,
      byPath: {
        '/': 2103,
        '/dashboard': 1842,
        '/learning-modules': 1536,
        '/assessments': 1203,
        '/profile': 982
      }
    },
    featureUsage: {
      'voice-input': 823,
      'multilingual-support': 642,
      'accessibility-controls': 531,
      'ai-avatar-videos': 1203,
      'interactive-guidance': 892
    },
    learningProgress: {
      averageCompletion: 0.68,
      moduleCompletions: 532,
      averageTimePerModule: 1842 // seconds
    },
    userEngagement: {
      dailyActiveUsers: [
        { date: '2023-05-01', count: 342 },
        { date: '2023-05-02', count: 356 },
        { date: '2023-05-03', count: 378 },
        // More dates would be included
      ],
      weeklyActiveUsers: [
        { week: '2023-W18', count: 842 },
        { week: '2023-W19', count: 903 },
        { week: '2023-W20', count: 928 },
        // More weeks would be included
      ]
    },
    deviceStats: {
      byType: {
        desktop: 0.62,
        mobile: 0.31,
        tablet: 0.07
      },
      byBrowser: {
        'Chrome': 0.48,
        'Safari': 0.23,
        'Firefox': 0.12,
        'Edge': 0.09,
        'Other': 0.08
      },
      byOS: {
        'Windows': 0.42,
        'macOS': 0.21,
        'iOS': 0.18,
        'Android': 0.14,
        'Linux': 0.05
      }
    }
  };
};

/**
 * Analytics visualisation component
 */
export const AnalyticsDashboard: React.FC<{
  startDate: Date;
  endDate: Date;
  metrics: any[];
  filters?: Record<string, any>;
}> = ({ startDate, endDate, metrics, filters }) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const report = await getAnalyticsReport(startDate, endDate, metrics, filters);
        setData(report);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [startDate, endDate, metrics, filters]);
  
  if (loading) {
    return <div>Loading analytics data...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!data) {
    return <div>No data available</div>;
  }
  
  // In a real implementation, this would render charts and tables
  // For now, just return a placeholder
  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      <div className="analytics-summary">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p className="metric-value">{data.summary.totalUsers}</p>
        </div>
        <div className="metric-card">
          <h3>New Users</h3>
          <p className="metric-value">{data.summary.newUsers}</p>
        </div>
        <div className="metric-card">
          <h3>Avg. Session Duration</h3>
          <p className="metric-value">{Math.floor(data.summary.averageSessionDuration / 60)}m {data.summary.averageSessionDuration % 60}s</p>
        </div>
        <div className="metric-card">
          <h3>Bounce Rate</h3>
          <p className="metric-value">{(data.summary.bounceRate * 100).toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Page Views</h3>
          {/* Chart would be rendered here */}
          <p>Total: {data.pageViews.total}</p>
        </div>
        
        <div className="chart-container">
          <h3>Feature Usage</h3>
          {/* Chart would be rendered here */}
        </div>
        
        <div className="chart-container">
          <h3>Learning Progress</h3>
          {/* Chart would be rendered here */}
          <p>Average Completion: {(data.learningProgress.averageCompletion * 100).toFixed(1)}%</p>
        </div>
        
        <div className="chart-container">
          <h3>Device Distribution</h3>
          {/* Chart would be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default {
  initializeAnalytics,
  trackPageView,
  trackFeatureUsage,
  trackLearningProgress,
  trackAssessmentCompletion,
  trackError,
  setAnalyticsConsent,
  hasAnalyticsConsent,
  usePageViewTracking,
  useFeatureTracking,
  useAnalyticsConsent,
  AnalyticsDashboard
};
