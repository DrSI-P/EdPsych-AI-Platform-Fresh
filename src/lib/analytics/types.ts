/**
 * Data Visualisation Dashboard Types
 * 
 * This file defines the types and interfaces used throughout the Data Visualisation Dashboard.
 * It provides a structured approach to handling analytics data, visualisation configurations,
 * and dashboard components.
 */

/**
 * Time period options for data filtering
 */
export enum TimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  TERM = 'term',
  ACADEMIC_YEAR = 'academic_year',
  CUSTOM = 'custom'
}

/**
 * Data granularity options
 */
export enum DataGranularity {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  TERMLY = 'termly',
  YEARLY = 'yearly'
}

/**
 * Chart types supported by the dashboard
 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  RADAR = 'radar',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  AREA = 'area',
  HEATMAP = 'heatmap',
  TABLE = 'table'
}

/**
 * Data categories for analytics
 */
export enum DataCategory {
  STUDENT_PERFORMANCE = 'student_performance',
  ENGAGEMENT = 'engagement',
  CURRICULUM_COVERAGE = 'curriculum_coverage',
  LEARNING_STYLES = 'learning_styles',
  ACCESSIBILITY_USAGE = 'accessibility_usage',
  RESOURCE_UTILIZATION = 'resource_utilization',
  TEACHER_ACTIVITY = 'teacher_activity',
  PLATFORM_USAGE = 'platform_usage',
  SPECIAL_NEEDS = 'special_needs',
  ASSESSMENT_RESULTS = 'assessment_results'
}

/**
 * User roles for permission-based dashboard views
 */
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  SENCO = 'senco', // Special Educational Needs Coordinator
  SCHOOL_LEADER = 'school_leader',
  EDUCATIONAL_PSYCHOLOGIST = 'educational_psychologist',
  PARENT = 'parent',
  STUDENT = 'student'
}

/**
 * Dashboard widget types
 */
export enum WidgetType {
  CHART = 'chart',
  METRIC = 'metric',
  TABLE = 'table',
  ALERT = 'alert',
  PROGRESS = 'progress',
  COMPARISON = 'comparison',
  BREAKDOWN = 'breakdown',
  HEATMAP = 'heatmap',
  TIMELINE = 'timeline',
  CUSTOM = 'custom'
}

/**
 * Data point interface for visualisation
 */
export interface DataPoint {
  label: string;
  value: number | string | boolean | null;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

/**
 * Dataset interface for charts
 */
export interface Dataset {
  id: string;
  label: string;
  data: any[];
  colour?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  hidden?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Chart configuration interface
 */
export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  datasets: Dataset[];
  options?: Record<string, any>; // Chart.js options
  accessibility?: {
    textDescription: string;
    keyFindings: string[];
    alternativeFormats?: boolean;
  };
}

/**
 * Metric configuration interface
 */
export interface MetricConfig {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  icon?: string;
  colour?: string;
  description?: string;
  goal?: number | string;
  format?: string; // e.g., 'percentage', 'currency', 'number'
}

/**
 * Dashboard widget configuration
 */
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dataCategory: DataCategory;
  chartConfig?: ChartConfig;
  metricConfig?: MetricConfig;
  tableConfig?: any; // Defined as needed
  customConfig?: Record<string, any>;
  refreshInterval?: number; // in seconds
  isInteractive?: boolean;
  permissions?: UserRole[];
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  widgets: WidgetConfig[];
  layout?: 'grid' | 'free' | 'fixed';
  theme?: 'light' | 'dark' | 'system' | 'high-contrast';
  defaultTimePeriod?: TimePeriod;
  defaultGranularity?: DataGranularity;
  permissions?: UserRole[];
  filters?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  isTemplate?: boolean;
}

/**
 * Student performance data interface
 */
export interface StudentPerformanceData {
  studentId: string;
  studentName: string;
  assessments: {
    id: string;
    title: string;
    score: number;
    maxScore: number;
    percentile?: number;
    completedAt: Date;
    category?: string;
    subject?: string;
    keyStage?: string;
    yearGroup?: string;
  }[];
  averageScore?: number;
  progressTrend?: number;
  strengths?: string[];
  areasForImprovement?: string[];
  learningStyle?: string;
  accommodations?: string[];
}

/**
 * Curriculum coverage data interface
 */
export interface CurriculumCoverageData {
  subject: string;
  keyStage: string;
  objectives: {
    id: string;
    description: string;
    coveragePercentage: number;
    assessmentResults?: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  }[];
  overallCoverage: number;
  gapsIdentified?: string[];
}

/**
 * Engagement data interface
 */
export interface EngagementData {
  userId: string;
  userName?: string;
  userRole: UserRole;
  metrics: {
    timeSpent: number; // in minutes
    resourcesAccessed: number;
    activitiesCompleted: number;
    collaborationEvents: number;
    loginFrequency: number;
    lastActive: Date;
  };
  engagementScore: number;
  trends: {
    period: string;
    score: number;
  }[];
}

/**
 * Special educational needs data interface
 */
export interface SpecialNeedsData {
  category: 'dyslexia' | 'dyspraxia' | 'asd' | 'adhd' | 'anxiety' | 'other';
  accommodationsUsed: string[];
  effectivenessRating?: number;
  engagementMetrics: {
    withAccommodation: number;
    withoutAccommodation: number;
  };
  progressMetrics: {
    withAccommodation: number;
    withoutAccommodation: number;
  };
  recommendations?: string[];
}

/**
 * Analytics filter interface
 */
export interface AnalyticsFilter {
  timePeriod?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
  granularity?: DataGranularity;
  students?: string[];
  classes?: string[];
  yearGroups?: string[];
  subjects?: string[];
  keyStages?: string[];
  specialNeeds?: string[];
  learningStyles?: string[];
}

/**
 * Analytics service response interface
 */
export interface AnalyticsResponse<T> {
  data: T;
  metadata: {
    timePeriod: {
      start: Date;
      end: Date;
      granularity: DataGranularity;
    };
    filters: Record<string, any>;
    dataPoints: number;
    generatedAt: Date;
  };
}

/**
 * Dashboard export format options
 */
export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
  IMAGE = 'image',
  JSON = 'json'
}

/**
 * Dashboard export configuration
 */
export interface ExportConfig {
  format: ExportFormat;
  widgets?: string[]; // Widget IDs to export, empty means all
  includeFilters?: boolean;
  includeSummary?: boolean;
  orientation?: 'portrait' | 'landscape';
  fileName?: string;
}

/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
  id: string;
  metricId: string;
  condition: 'above' | 'below' | 'equal' | 'between';
  value: number | [number, number]; // Single value or range
  severity: 'info' | 'warning' | 'critical';
  message: string;
  actions?: {
    type: 'notification' | 'email' | 'intervention' | 'custom';
    config: Record<string, any>;
  }[];
}

/**
 * Dashboard user preferences
 */
export interface DashboardPreferences {
  userId: string;
  defaultDashboard?: string;
  theme?: 'light' | 'dark' | 'system' | 'high-contrast';
  defaultTimePeriod?: TimePeriod;
  defaultGranularity?: DataGranularity;
  favoriteWidgets?: string[];
  hiddenWidgets?: string[];
  widgetLayout?: Record<string, { x: number; y: number; width: number; height: number }>;
  accessibilitySettings?: {
    highContrast?: boolean;
    largeText?: boolean;
    reducedMotion?: boolean;
    screenReaderOptimized?: boolean;
  };
}
