/**
 * Testing Service Implementation
 * 
 * This service provides core functionality for running tests, collecting results,
 * and generating reports for the EdPsych-AI-Education-Platform.
 */

import { 
  TestResult, 
  TestSuite, 
  TestRun, 
  TestStatus, 
  TestCategory,
  TestSeverity,
  TestReporter,
  TestConfig,
  EducationalTestContext
} from './types';

/**
 * Core testing service that manages test execution and reporting
 */
export class TestingService {
  private config: TestConfig;
  private reporters: any[] = [];
  private currentRun: TestRun | null = null;
  
  constructor(config: TestConfig) {
    this.config = config;
  }
  
  /**
   * Adds a reporter to receive test events
   */
  public addReporter(reporter: TestReporter): void {
    this.reporters.push(reporter);
  }
  
  /**
   * Starts a new test run
   */
  public async startRun(name: string, description: string, version: string, environment: string): Promise<TestRun> {
    const run: TestRun = {
      id: this.generateId(),
      name,
      description,
      suites: [],
      startTime: new Date(),
      environment,
      version,
      totalSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    };
    
    this.currentRun = run;
    
    // Notify reporters
    for (const reporter of this.reporters) {
      reporter.onRunStart(run);
    }
    
    return run;
  }
  
  /**
   * Starts a new test suite
   */
  public async startSuite(name: string, description: string): Promise<TestSuite> {
    if (!this.currentRun) {
      throw new Error('Cannot start suite without an active test run');
    }
    
    const suite: TestSuite = {
      id: this.generateId(),
      name,
      description,
      tests: [],
      startTime: new Date(),
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    };
    
    this.currentRun.suites.push(suite);
    this.currentRun.totalSuites++;
    
    // Notify reporters
    for (const reporter of this.reporters) {
      reporter.onSuiteStart(suite);
    }
    
    return suite;
  }
  
  /**
   * Records a test result
   */
  public async recordTest(
    suiteId: string, 
    name: string, 
    category: TestCategory, 
    status: TestStatus, 
    severity: TestSeverity,
    duration: number,
    message?: string,
    stackTrace?: string,
    metadata?: Record<string, any>
  ): Promise<TestResult> {
    if (!this.currentRun) {
      throw new Error('Cannot record test without an active test run');
    }
    
    const suite = this.currentRun.suites.find(s => s.id === suiteId);
    if (!suite) {
      throw new Error(`Suite with ID ${suiteId} not found`);
    }
    
    const test: TestResult = {
      id: this.generateId(),
      name,
      category,
      status,
      severity,
      duration,
      message,
      stackTrace,
      timestamp: new Date(),
      metadata
    };
    
    // Update suite statistics
    suite.tests.push(test);
    suite.totalTests++;
    
    if (status === TestStatus.PASSED) {
      suite.passedTests++;
      this.currentRun.passedTests++;
    } else if (status === TestStatus.FAILED) {
      suite.failedTests++;
      this.currentRun.failedTests++;
    } else if (status === TestStatus.SKIPPED) {
      suite.skippedTests++;
      this.currentRun.skippedTests++;
    }
    
    this.currentRun.totalTests++;
    
    // Notify reporters
    for (const reporter of this.reporters) {
      reporter.onTestEnd(test);
    }
    
    return test;
  }
  
  /**
   * Ends a test suite
   */
  public async endSuite(suiteId: string): Promise<TestSuite> {
    if (!this.currentRun) {
      throw new Error('Cannot end suite without an active test run');
    }
    
    const suite = this.currentRun.suites.find(s => s.id === suiteId);
    if (!suite) {
      throw new Error(`Suite with ID ${suiteId} not found`);
    }
    
    suite.endTime = new Date();
    
    // Notify reporters
    for (const reporter of this.reporters) {
      reporter.onSuiteEnd(suite);
    }
    
    return suite;
  }
  
  /**
   * Ends the current test run
   */
  public async endRun(): Promise<TestRun> {
    if (!this.currentRun) {
      throw new Error('Cannot end run without an active test run');
    }
    
    this.currentRun.endTime = new Date();
    
    // Notify reporters
    for (const reporter of this.reporters) {
      reporter.onRunEnd(this.currentRun);
    }
    
    const completedRun = this.currentRun;
    this.currentRun = null;
    
    return completedRun;
  }
  
  /**
   * Generates a summary report of the test run
   */
  public generateSummary(run: TestRun): string {
    const duration = run.endTime 
      ? (run.endTime.getTime() - run.startTime.getTime()) / 1000 
      : 0;
    
    let summary = `
Test Run: ${run.name}
Description: ${run.description}
Environment: ${run.environment}
Version: ${run.version}
Duration: ${duration.toFixed(2)}s
Total Suites: ${run.totalSuites}
Total Tests: ${run.totalTests}
Passed: ${run.passedTests} (${(run.passedTests / run.totalTests * 100).toFixed(2)}%)
Failed: ${run.failedTests} (${(run.failedTests / run.totalTests * 100).toFixed(2)}%)
Skipped: ${run.skippedTests} (${(run.skippedTests / run.totalTests * 100).toFixed(2)}%)

Suite Summary:
`;
    
    for (const suite of run.suites) {
      const suiteDuration = suite.endTime 
        ? (suite.endTime.getTime() - suite.startTime.getTime()) / 1000 
        : 0;
      
      summary += `
  ${suite.name}
  Description: ${suite.description}
  Duration: ${suiteDuration.toFixed(2)}s
  Total Tests: ${suite.totalTests}
  Passed: ${suite.passedTests} (${(suite.passedTests / suite.totalTests * 100).toFixed(2)}%)
  Failed: ${suite.failedTests} (${(suite.failedTests / suite.totalTests * 100).toFixed(2)}%)
  Skipped: ${suite.skippedTests} (${(suite.skippedTests / suite.totalTests * 100).toFixed(2)}%)
`;
      
      // List failed tests
      if (suite.failedTests > 0) {
        summary += `
  Failed Tests:
`;
        for (const test of suite.tests.filter(t => t.status === TestStatus.FAILED)) {
          summary += `    - ${test.name} (${test.category}): ${test.message}\n`;
        }
      }
    }
    
    return summary;
  }
  
  /**
   * Validates educational alignment of tests
   */
  public validateEducationalAlignment(context: EducationalTestContext): boolean {
    // Implementation would validate that tests align with educational principles
    // This is a placeholder for the actual implementation
    return true;
  }
  
  /**
   * Generates a unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
