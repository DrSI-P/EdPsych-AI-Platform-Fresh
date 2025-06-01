import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for validating sensory regulation settings
const sensorySettingsSchema = z.object({
  userId: z.string(),
  visualStimulation: z.number().min(0).max(100).default(50),
  auditoryStimulation: z.number().min(0).max(100).default(50),
  tactileStimulation: z.number().min(0).max(100).default(50),
  vestibularStimulation: z.number().min(0).max(100).default(50),
  proprioceptiveStimulation: z.number().min(0).max(100).default(50),
  environmentalControls: z.boolean().default(true),
  sensoryBreaks: z.boolean().default(true),
  sensoryProfile: z.string().default('balanced'),
  alertnessLevel: z.string().default('optimal'),
});

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const includeActivities = searchParams.get('includeActivities') === 'true';

    // Fetch sensory settings from database
    const sensorySettings = await prisma.sensoryRegulationSettings.findUnique({
      where: {
        userId: userId,
      },
      include: {
        activities: includeActivities,
      },
    });

    // If no settings exist, return default settings
    if (!sensorySettings) {
      return NextResponse.json({
        userId: userId,
        visualStimulation: 50,
        auditoryStimulation: 50,
        tactileStimulation: 50,
        vestibularStimulation: 50,
        proprioceptiveStimulation: 50,
        environmentalControls: true,
        sensoryBreaks: true,
        sensoryProfile: 'balanced',
        alertnessLevel: 'optimal',
        activities: [],
      });
    }

    // Return sensory settings
    return NextResponse.json(sensorySettings);
  } catch (error) {
    console.error('Error fetching sensory regulation settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensory regulation settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await req.json();
    body.userId = userId;

    // Validate request body
    const validatedData = sensorySettingsSchema.parse(body);

    // Create or update sensory settings in database
    const sensorySettings = await prisma.sensoryRegulationSettings.upsert({
      where: {
        userId: userId,
      },
      update: {
        visualStimulation: validatedData.visualStimulation,
        auditoryStimulation: validatedData.auditoryStimulation,
        tactileStimulation: validatedData.tactileStimulation,
        vestibularStimulation: validatedData.vestibularStimulation,
        proprioceptiveStimulation: validatedData.proprioceptiveStimulation,
        environmentalControls: validatedData.environmentalControls,
        sensoryBreaks: validatedData.sensoryBreaks,
        sensoryProfile: validatedData.sensoryProfile,
        alertnessLevel: validatedData.alertnessLevel,
      },
      create: {
        userId: userId,
        visualStimulation: validatedData.visualStimulation,
        auditoryStimulation: validatedData.auditoryStimulation,
        tactileStimulation: validatedData.tactileStimulation,
        vestibularStimulation: validatedData.vestibularStimulation,
        proprioceptiveStimulation: validatedData.proprioceptiveStimulation,
        environmentalControls: validatedData.environmentalControls,
        sensoryBreaks: validatedData.sensoryBreaks,
        sensoryProfile: validatedData.sensoryProfile,
        alertnessLevel: validatedData.alertnessLevel,
      },
    });

    // Log the settings update
    await prisma.sensoryRegulationLog.create({
      data: {
        userId: userId,
        action: 'update_settings',
        details: JSON.stringify(validatedData),
      },
    });

    // Return sensory settings
    return NextResponse.json(sensorySettings);
  } catch (error) {
    console.error('Error saving sensory regulation settings:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save sensory regulation settings' },
      { status: 500 }
    );
  }
}
