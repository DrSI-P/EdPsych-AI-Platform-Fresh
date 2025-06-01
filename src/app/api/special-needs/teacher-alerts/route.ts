import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for alert creation/update
const AlertSchema = z.object({
  studentId: z.string(),
  type: z.enum(['emotional', 'behavioural', 'academic', 'attendance', 'social']),
  description: z.string().min(5),
  date: z.string(),
  time: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  status: z.enum(['new', 'in-progress', 'resolved']),
  patterns: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

// Schema for ABCC record creation/update
const ABCCRecordSchema = z.object({
  studentId: z.string(),
  date: z.string(),
  time: z.string(),
  setting: z.string().optional(),
  antecedent: z.string().min(5),
  behaviour: z.string().min(5),
  consequence: z.string().min(5),
  communication: z.string().optional(),
  intensity: z.enum(['low', 'medium', 'high']),
  duration: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for alert settings
const AlertSettingsSchema = z.object({
  emotionalThreshold: z.number().min(1).max(5),
  behavioralThreshold: z.number().min(1).max(5),
  academicThreshold: z.number().min(1).max(5),
  attendanceThreshold: z.number().min(1).max(5),
  notificationMethods: z.array(z.enum(['email', 'dashboard', 'sms'])),
  autoGenerateReports: z.boolean(),
  alertFrequency: z.enum(['immediate', 'daily', 'weekly']),
});

// GET handler for retrieving alerts
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    // Build filter object
    const filter = {};
    
    if (studentId) filter.studentId = studentId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.gte = dateFrom;
      if (dateTo) filter.date.lte = dateTo;
    }
    
    // Query database
    const alerts = await prisma.teacherAlert.findMany({
      where: filter,
      orderBy: {
        date: 'desc',
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            year: true,
            class: true,
          },
        },
      },
    });
    
    return NextResponse.json(alerts);
    
  } catch (error) {
    console.error('Error retrieving alerts:', error);
    return NextResponse.json({ error: 'Failed to retrieve alerts' }, { status: 500 });
  }
}

// POST handler for creating alerts
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Determine if this is an alert or ABCC record based on the payload
    if (body.antecedent && body.behaviour && body.consequence) {
      // This is an ABCC record
      const validatedData = ABCCRecordSchema.parse(body);
      
      const abccRecord = await prisma.aBCCRecord.create({
        data: {
          ...validatedData,
          createdBy: session.user.id,
        },
      });
      
      // Log the activity
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'create',
          resourceType: 'ABCCRecord',
          resourceId: abccRecord.id,
          details: `Created ABCC record for student ${validatedData.studentId}`,
        },
      });
      
      return NextResponse.json(abccRecord, { status: 201 });
      
    } else {
      // This is an alert
      const validatedData = AlertSchema.parse(body);
      
      const alert = await prisma.teacherAlert.create({
        data: {
          ...validatedData,
          createdBy: session.user.id,
          patterns: validatedData.patterns || [],
          recommendations: validatedData.recommendations || [],
        },
      });
      
      // Log the activity
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'create',
          resourceType: 'TeacherAlert',
          resourceId: alert.id,
          details: `Created ${validatedData.type} alert for student ${validatedData.studentId}`,
        },
      });
      
      return NextResponse.json(alert, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error creating record:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

// PATCH handler for updating alert settings
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = AlertSettingsSchema.parse(body);
    
    // Update or create settings
    const settings = await prisma.teacherAlertSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: validatedData,
      create: {
        ...validatedData,
        userId: session.user.id,
      },
    });
    
    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'update',
        resourceType: 'TeacherAlertSettings',
        resourceId: settings?.id,
        details: 'Updated teacher alert settings',
      },
    });
    
    return NextResponse.json(settings);
    
  } catch (error) {
    console.error('Error updating alert settings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update alert settings' }, { status: 500 });
  }
}
