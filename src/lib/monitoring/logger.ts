/**
 * Logging Configuration
 * 
 * This module configures logging for the EdPsych-AI-Education-Platform.
 * It provides structured logging with appropriate privacy controls for UK educational settings.
 */

import winston from 'winston';
import { createLogger, format, transports } from 'winston';
import { NextApiRequest } from 'next';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'http';
};

// Define custom format for logs
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create sanitizer to remove sensitive information
const sanitizeData = (data) => {
  if (!data) return data;
  
  // Deep clone to avoid modifying original data
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // List of fields to sanitize
  const sensitiveFields = [
    'password', 'token', 'secret', 'authorization', 'cookie', 
    'session', 'email', 'phone', 'postcode', 'dateOfBirth'
  ];
  
  // Recursive function to sanitize objects
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      // Check if this is a sensitive field
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        // Recursively sanitize nested objects
        sanitizeObject(obj[key]);
      }
    });
  };
  
  sanitizeObject(sanitized);
  return sanitized;
};

// Create the logger instance
const logger = createLogger({
  level: level(),
  levels,
  format: customFormat,
  defaultMeta: { service: 'edpsych-platform' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to combined.log
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Add console transport in development environment
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

// Create request logger middleware
export const requestLogger = (req: NextApiRequest, res, next: () => void) => {
  // Extract relevant request information
  const { method, url, headers, query, body } = req;
  
  // Sanitize request data
  const sanitizedQuery = sanitizeData(query);
  const sanitizedBody = sanitizeData(body);
  const sanitizedHeaders = sanitizeData(headers);
  
  // Log request
  logger.http({
    message: `API Request: ${method} ${url}`,
    method,
    url,
    query: sanitizedQuery,
    body: sanitizedBody,
    headers: sanitizedHeaders,
    ip: headers['x-forwarded-for'] || req.socket.remoteAddress,
  });
  
  // Continue processing
  if (next) next();
};

// Create response logger middleware
export const responseLogger = (req: NextApiRequest, res, data) => {
  // Extract relevant response information
  const { method, url } = req;
  const { statusCode } = res;
  
  // Sanitize response data
  const sanitizedData = sanitizeData(data);
  
  // Log response
  logger.http({
    message: `API Response: ${statusCode} ${method} ${url}`,
    method,
    url,
    statusCode,
    responseData: sanitizedData,
  });
};

// Export logger functions
export const logError = (message: string, error?: Error, context?) => {
  logger.error({
    message,
    error: error ? { message: error.message, stack: error.stack } : undefined,
    context: sanitizeData(context),
  });
};

export const logWarn = (message: string, context?) => {
  logger.warn({
    message,
    context: sanitizeData(context),
  });
};

export const logInfo = (message: string, context?) => {
  logger.info({
    message,
    context: sanitizeData(context),
  });
};

export const logDebug = (message: string, context?) => {
  logger.debug({
    message,
    context: sanitizeData(context),
  });
};

export const logHttp = (message: string, context?) => {
  logger.http({
    message,
    context: sanitizeData(context),
  });
};

// Export the logger instance
export default {
  logger,
  requestLogger,
  responseLogger,
  logError,
  logWarn,
  logInfo,
  logDebug,
  logHttp,
};
