import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for progress monitoring settings
 * 
 * This endpoint handles saving and retrieving user progress monitoring settings
 * across the platform, providing tools to track intervention effectiveness.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's progress monitoring settings
    const monitoringSettings = await prisma.progressMonitoring.findUnique({
      where: {
        userId: session.user.id
      }
    });

    // If no settings exist yet, return default settings
    if (!monitoringSettings) {
      return NextResponse.json({
        success: true,
        settings: {
          enabled: false,
          monitoringFrequency: 'weekly',
          automaticReminders: true,
          dataVisualization: true,
          progressReports: true,
          goalTracking: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        enabled: monitoringSettings.enabled,
        monitoringFrequency: monitoringSettings.monitoringFrequency,
        automaticReminders: monitoringSettings.automaticReminders,
        dataVisualization: monitoringSettings.dataVisualization,
        progressReports: monitoringSettings.progressReports,
        goalTracking: monitoringSettings.goalTracking,
        interventionId: monitoringSettings.interventionId
      }
    });
  } catch (error) {
    console.error('Progress monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress monitoring settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    // Validate settings
    const validatedSettings = {
      enabled: Boolean(settings.enabled),
      monitoringFrequency: ['daily', 'weekly', 'biweekly', 'monthly'].includes(settings.monitoringFrequency)
        ? settings.monitoringFrequency
        : 'weekly',
      automaticReminders: settings.automaticReminders !== undefined 
        ? Boolean(settings.automaticReminders) 
        : true,
      dataVisualization: settings.dataVisualization !== undefined 
        ? Boolean(settings.dataVisualization) 
        : true,
      progressReports: settings.progressReports !== undefined 
        ? Boolean(settings.progressReports) 
        : true,
      goalTracking: settings.goalTracking !== undefined 
        ? Boolean(settings.goalTracking) 
        : true,
      interventionId: settings.interventionId || null
    };

    // Save settings to database (upsert to create or update)
    const updatedSettings = await prisma.progressMonitoring.upsert({
      where: {
        userId: session.user.id
      },
      update: validatedSettings,
      create: {
        userId: session.user.id,
        ...validatedSettings
      }
    });

    // Log the progress monitoring settings update for analytics
    await prisma.monitoringLog.create({
      data: {
        userId: session.user.id,
        action: 'settings_update',
        details: JSON.stringify(validatedSettings),
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Progress monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress monitoring settings' },
      { status: 500 }
    );
  }
}
