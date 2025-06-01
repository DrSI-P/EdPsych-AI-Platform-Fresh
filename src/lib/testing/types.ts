/**
 * Testing Infrastructure Types
 * 
 * This file defines the core types for the testing infrastructure of the EdPsych-AI-Education-Platform.
 * It provides a structured approach to unit, integration, accessibility, and end-to-end testing.
 */

/**
 * Test severity levels for categorizing test failures
 */
export enum TestSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

/**
 * Test categories for organising tests by type
 */
export enum TestCategory {
  UNIT = 'unit',
  INTEGRATION = 'integration',
  ACCESSIBILITY = 'accessibility',
  PERFORMANCE = 'performance',
  END_TO_END = 'end-to-end',
  SECURITY = 'security',
  LOCALIZATION = 'localization'
}

/**
 * Test status for tracking test execution
 */
export enum TestStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  PENDING = 'pending',
  RUNNING = 'running',
  BLOCKED = 'blocked'
}

/**
 * Test result interface for storing test outcomes
 */
export interface TestResult {
  id: string;
  name: string;
  category: TestCategory;
  status: TestStatus;
  severity: TestSeverity;
  duration: number; // in milliseconds
  message?: string;
  stackTrace?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Test suite interface for grouping related tests
 */
export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: any[];
  startTime: Date;
  endTime?: Date;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

/**
 * Test run interface for tracking a complete test execution
 */
export interface TestRun {
  id: string;
  name: string;
  description: string;
  suites: any[];
  startTime: Date;
  endTime?: Date;
  environment: string;
  version: string;
  totalSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

/**
 * Accessibility test criteria based on WCAG standards
 */
export interface AccessibilityTestCriteria {
  wcagLevel: 'A' | 'AA' | 'AAA';
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
  guideline: string;
  criterion: string;
  description: string;
}

/**
 * Performance test metrics for measuring application performance
 */
export interface PerformanceTestMetrics {
  firstContentfulPaint: number; // in milliseconds
  largestContentfulPaint: number; // in milliseconds
  timeToInteractive: number; // in milliseconds
  totalBlockingTime: number; // in milliseconds
  cumulativeLayoutShift: number;
  speedIndex: number;
  resourceLoadTimes: Record<string, number>;
  memoryUsage: number; // in bytes
  cpuUsage: number; // percentage
}

/**
 * Test configuration for customising test execution
 */
export interface TestConfig {
  timeout: number; // in milliseconds
  retries: number;
  parallel: boolean;
  maxWorkers: number;
  bail: boolean;
  verbose: boolean;
  reporters: any[];
  testMatch: any[];
  testIgnore: any[];
  setupFiles: any[];
  teardownFiles: any[];
  environmentVariables: Record<string, string>;
}

/**
 * Test reporter interface for outputting test results
 */
export interface TestReporter {
  name: string;
  outputFormat: 'console' | 'json' | 'html' | 'xml' | 'csv';
  outputPath?: string;
  onRunStart: (run: TestRun) => void;
  onSuiteStart: (suite: TestSuite) => void;
  onTestStart: (test: TestResult) => void;
  onTestEnd: (test: TestResult) => void;
  onSuiteEnd: (suite: TestSuite) => void;
  onRunEnd: (run: TestRun) => void;
}

/**
 * Educational context for tests to ensure alignment with educational principles
 */
export interface EducationalTestContext {
  keyStage?: string;
  subject?: string;
  learningObjectives?: string[];
  specialEducationalNeeds?: string[];
  curriculumAlignment?: string[];
}

/**
 * Test fixture for setting up test environments
 */
export interface TestFixture {
  id: string;
  name: string;
  setup: () => Promise<void>;
  teardown: () => Promise<void>;
  data?: Record<string, any>;
}
