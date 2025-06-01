/**
 * Sentry Error Tracking Configuration
 * 
 * This module configures Sentry for error tracking in the EdPsych-AI-Education-Platform.
 * It follows UK educational standards for data privacy and security.
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry with appropriate configuration
 * 
 * @param dsn - Sentry DSN (Data Source Name)
 * @param environment - Current environment (development, staging, production)
 */
export function initSentry(
  dsn: string = process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  environment: string = process.env.NODE_ENV || 'development'
) {
  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    // Adjust this value in production to avoid excessive data collection
    
    beforeSend(event) {
      // Sanitize personal data before sending to Sentry
      // This is critical for GDPR compliance and UK educational standards
      if (event.user) {
        // Remove identifiable information for users under 18
        delete event.user.ip_address;
        
        // Keep user ID for debugging but remove other PII
        const userId = event.user.id;
        event.user = { id: userId };
      }
      
      // Sanitize request data
      if (event.request && event.request.headers) {
        // Remove cookies and authorization headers
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
      
      return event;
    },
    
    // Set release information for better debugging
    release: process.env.NEXT_PUBLIC_VERSION || 'development',
  });
}

/**
 * Capture an exception with additional context
 * 
 * @param error - The error to capture
 * @param context - Additional context information
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message with additional context
 * 
 * @param message - The message to capture
 * @param level - Severity level
 * @param context - Additional context information
 */
export function captureMessage(
  message: string, 
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user information for error context
 * 
 * @param id - User ID
 * @param role - User role (student, teacher, admin)
 */
export function setUser(id: string, role?: string) {
  Sentry.setUser({
    id,
    role,
  });
}

/**
 * Clear user information
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Set additional context tags
 * 
 * @param tags - Key-value pairs for tagging errors
 */
export function setTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Start performance monitoring for a specific operation
 * 
 * @param name - Operation name
 * @param options - Additional options
 * @returns Transaction object
 */
export function startTransaction(name: string, options?: Record<string, any>) {
  return Sentry.startTransaction({
    name,
    ...options,
  });
}

/**
 * Create a child span for detailed performance tracking
 * 
 * @param transaction - Parent transaction
 * @param operation - Operation name
 * @returns Span object
 */
export function createSpan(transaction: Sentry.Transaction, operation: string) {
  return transaction.startChild({
    op: operation,
  });
}

export default {
  initSentry,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  setTags,
  startTransaction,
  createSpan,
};
