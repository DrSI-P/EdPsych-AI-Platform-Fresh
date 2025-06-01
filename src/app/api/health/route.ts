/**
 * API Route for Health Checks
 * 
 * This API route provides health check functionality for the EdPsych-AI-Education-Platform.
 * It returns the current health status of the system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthChecks } from '@/lib/monitoring';

/**
 * Health check API handler
 * 
 * @param req - Next.js request
 * @returns Next.js response with health check result
 */
export async function GET(req: NextRequest) {
  try {
    const result = await healthChecks.performHealthCheck();
    
    // Set appropriate status code based on health status
    const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503;
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    return NextResponse.json({
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
    }, { status: 500 });
  }
}
