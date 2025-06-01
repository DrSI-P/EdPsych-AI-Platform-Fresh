/**
 * Monitoring Index Module
 * 
 * This module exports all monitoring functionality for the EdPsych-AI-Education-Platform.
 * It provides a unified interface for error tracking, logging, performance monitoring,
 * health checks, and alerting.
 */

import sentryModule from './sentry';
import loggerModule from './logger';
import performanceModule from './performance';
import healthChecksModule from './health-checks';
import alertingModule from './alerting';

// Export all modules
export const sentry = sentryModule;
export const logger = loggerModule;
export const performance = performanceModule;
export const healthChecks = healthChecksModule;
export const alerting = alertingModule;

// Initialize monitoring based on environment
export function initializeMonitoring() {
  // Initialize Sentry for error tracking
  sentry.initSentry(
    process.env.NEXT_PUBLIC_SENTRY_DSN,
    process.env.NODE_ENV
  );
  
  // Register default alerts
  if (process.env.NODE_ENV === 'production') {
    // Register production alerts
    alerting.registerAlert({
      name: 'high-error-rate',
      description: 'High error rate detected',
      level: 'error',
      threshold: 10, // 10 errors per minute
      cooldown: 5 * 60 * 1000, // 5 minutes
      channels: ['email', 'slack'],
      enabled: true,
    });
    
    alerting.registerAlert({
      name: 'api-latency',
      description: 'API latency above threshold',
      level: 'warning',
      threshold: 1000, // 1000ms
      cooldown: 15 * 60 * 1000, // 15 minutes
      channels: ['slack'],
      enabled: true,
    });
    
    alerting.registerAlert({
      name: 'memory-usage',
      description: 'High memory usage detected',
      level: 'warning',
      threshold: 80, // 80% usage
      cooldown: 30 * 60 * 1000, // 30 minutes
      channels: ['email', 'slack'],
      enabled: true,
    });
    
    alerting.registerAlert({
      name: 'database-connection-failure',
      description: 'Database connection failure detected',
      level: 'critical',
      threshold: 1, // Any failure
      cooldown: 5 * 60 * 1000, // 5 minutes
      channels: ['email', 'slack', 'webhook'],
      enabled: true,
    });
  } else {
    // Register development alerts
    alerting.registerAlert({
      name: 'high-error-rate-dev',
      description: 'High error rate detected (Development)',
      level: 'warning',
      threshold: 5, // 5 errors per minute
      cooldown: 5 * 60 * 1000, // 5 minutes
      channels: ['email'],
      enabled: true,
    });
  }
  
  return {
    sentry,
    logger,
    performance,
    healthChecks,
    alerting,
  };
}

// Export default object
export default {
  sentry,
  logger,
  performance,
  healthChecks,
  alerting,
  initializeMonitoring,
};
