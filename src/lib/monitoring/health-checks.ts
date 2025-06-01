/**
 * Health Checks Configuration
 * 
 * This module configures health checks for the EdPsych-AI-Education-Platform.
 * It provides endpoints and utilities for monitoring system health and availability.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { logInfo, logError } from './logger';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define health check types
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    [key: string]: {
      status: HealthStatus;
      message?: string;
      latency?: number;
    };
  };
}

/**
 * Perform a database health check
 * 
 * @returns Health check result for database
 */
export async function checkDatabase(): Promise<{
  status: HealthStatus;
  message?: string;
  latency?: number;
}> {
  const startTime = Date.now();
  
  try {
    // Execute a simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    const latency = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      latency,
    };
  } catch (error) {
    logError('Database health check failed', error as Error);
    
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${(error as Error).message}`,
      latency: Date.now() - startTime,
    };
  }
}

/**
 * Perform an API health check
 * 
 * @param endpoint - API endpoint to check
 * @returns Health check result for API
 */
export async function checkApi(endpoint: string): Promise<{
  status: HealthStatus;
  message?: string;
  latency?: number;
}> {
  const startTime = Date.now();
  
  try {
    // Make a request to the API endpoint
    const response = await fetch(endpoint);
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      return {
        status: 'healthy',
        message: `API endpoint ${endpoint} is available`,
        latency,
      };
    } else {
      return {
        status: 'degraded',
        message: `API endpoint ${endpoint} returned status ${response.status}`,
        latency,
      };
    }
  } catch (error) {
    logError(`API health check failed for ${endpoint}`, error as Error);
    
    return {
      status: 'unhealthy',
      message: `API endpoint ${endpoint} is unavailable: ${(error as Error).message}`,
      latency: Date.now() - startTime,
    };
  }
}

/**
 * Perform a memory usage health check
 * 
 * @returns Health check result for memory usage
 */
export function checkMemoryUsage(): {
  status: HealthStatus;
  message?: string;
  latency?: number;
} {
  const startTime = Date.now();
  
  try {
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const usedHeapSize = memoryUsage.heapUsed / 1024 / 1024;
    const totalHeapSize = memoryUsage.heapTotal / 1024 / 1024;
    const heapUsagePercentage = (usedHeapSize / totalHeapSize) * 100;
    
    const latency = Date.now() - startTime;
    
    // Determine status based on heap usage
    let status: HealthStatus = 'healthy';
    if (heapUsagePercentage > 90) {
      status = 'unhealthy';
    } else if (heapUsagePercentage > 70) {
      status = 'degraded';
    }
    
    return {
      status,
      message: `Memory usage: ${usedHeapSize.toFixed(2)}MB / ${totalHeapSize.toFixed(2)}MB (${heapUsagePercentage.toFixed(2)}%)`,
      latency,
    };
  } catch (error) {
    logError('Memory usage health check failed', error as Error);
    
    return {
      status: 'unhealthy',
      message: `Memory usage check failed: ${(error as Error).message}`,
      latency: Date.now() - startTime,
    };
  }
}

/**
 * Perform a comprehensive health check
 * 
 * @returns Comprehensive health check result
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Perform individual checks
  const [databaseCheck, memoryCheck] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemoryUsage()),
  ]);
  
  // Determine overall status
  let overallStatus: HealthStatus = 'healthy';
  
  if (databaseCheck.status === 'unhealthy' || memoryCheck.status === 'unhealthy') {
    overallStatus = 'unhealthy';
  } else if (databaseCheck.status === 'degraded' || memoryCheck.status === 'degraded') {
    overallStatus = 'degraded';
  }
  
  // Create health check result
  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || 'development',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: databaseCheck,
      memory: memoryCheck,
    },
  };
  
  // Log health check result
  logInfo('Health check performed', {
    duration: Date.now() - startTime,
    status: result.status,
  });
  
  return result;
}

/**
 * Health check API handler
 * 
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export async function healthCheckHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await performHealthCheck();
    
    // Set appropriate status code based on health status
    const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(result);
  } catch (error) {
    logError('Health check handler failed', error as Error);
    
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || 'development',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        error: {
          status: 'unhealthy',
          message: `Health check failed: ${(error as Error).message}`,
        },
      },
    });
  }
}

export default {
  checkDatabase,
  checkApi,
  checkMemoryUsage,
  performHealthCheck,
  healthCheckHandler,
};
