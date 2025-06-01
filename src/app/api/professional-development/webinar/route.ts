import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for webinar creation
const webinarCreateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  presenterId: z.string(),
  date: z.string().datetime(),
  duration: z.number().int().positive(),
  capacity: z.number().int().positive(),
  topics: z.array(z.string()),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']),
  recordingEnabled: z.boolean().default(true),
});

// Schema for webinar registration
const registrationSchema = z.object({
  userId: z.string(),
  webinarId: z.string(),
  addToCalendar: z.boolean().default(false),
});

// Schema for webinar feedback
const feedbackSchema = z.object({
  userId: z.string(),
  webinarId: z.string(),
  rating: z.number().min(1).max(5),
  comments: z.string().optional(),
});

// Define interfaces for request data
interface WebinarCreateData {
  title: string;
  description: string;
  presenterId: string;
  date: string;
  duration: number;
  capacity: number;
  topics: any[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  recordingEnabled: boolean;
}

interface RegistrationData {
  userId: string;
  webinarId: string;
  addToCalendar: boolean;
}

interface FeedbackData {
  userId: string;
  webinarId: string;
  rating: number;
  comments?: string;
}

interface RecordingUploadData {
  webinarId: string;
  recordingUrl: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'createWebinar':
        return handleCreateWebinar(body);
      case 'registerForWebinar':
        return handleRegistration(body);
      case 'submitFeedback':
        return handleFeedback(body);
      case 'uploadRecording':
        return handleRecordingUpload(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in webinar API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCreateWebinar(body: WebinarCreateData): Promise<NextResponse> {
  try {
    const webinarData = webinarCreateSchema.parse(body);

    const webinar = await prisma.webinar.create({
      data: {
        ...webinarData,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Webinar created successfully', webinar },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid webinar data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleRegistration(body: RegistrationData): Promise<NextResponse> {
  try {
    const { userId, webinarId, addToCalendar } = registrationSchema.parse(body);

    // Check if webinar exists and has capacity
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    if (webinar._count.registrations >= webinar.capacity) {
      return NextResponse.json(
        { error: 'Webinar is fully booked' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.webinarRegistration.findUnique({
      where: {
        userId_webinarId: {
          userId,
          webinarId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'User is already registered for this webinar' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.webinarRegistration.create({
      data: {
        userId,
        webinarId,
        registeredAt: new Date(),
        addedToCalendar: addToCalendar,
      },
    });

    // If addToCalendar is true, integrate with calendar system
    if (addToCalendar) {
      // In a real implementation, this would call a calendar integration service
      console.log(`Adding webinar ${webinarId} to calendar for user ${userId}`);
    }

    return NextResponse.json(
      { message: 'Registration successful', registration },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleFeedback(body: FeedbackData): Promise<NextResponse> {
  try {
    const { userId, webinarId, rating, comments } = feedbackSchema.parse(body);

    // Check if webinar exists
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
    });

    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    // Check if user attended the webinar
    const registration = await prisma.webinarRegistration.findUnique({
      where: {
        userId_webinarId: {
          userId,
          webinarId,
        },
      },
    });

    if (!registration || !registration.attended) {
      return NextResponse.json(
        { error: 'User did not attend this webinar' },
        { status: 400 }
      );
    }

    // Create or update feedback
    const feedback = await prisma.webinarFeedback.upsert({
      where: {
        userId_webinarId: {
          userId,
          webinarId,
        },
      },
      update: {
        rating,
        comments,
        updatedAt: new Date(),
      },
      create: {
        userId,
        webinarId,
        rating,
        comments,
        submittedAt: new Date(),
      },
    });

    // Update webinar average rating
    const allFeedback = await prisma.webinarFeedback.findMany({
      where: { webinarId },
      select: { rating: true },
    });

    const averageRating = allFeedback.reduce((sum, item) => sum + item.rating, 0) / allFeedback.length;

    await prisma.webinar.update({
      where: { id: webinarId },
      data: { averageRating },
    });

    return NextResponse.json(
      { message: 'Feedback submitted successfully', feedback },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleRecordingUpload(body: RecordingUploadData): Promise<NextResponse> {
  // In a real implementation, this would handle secure upload of webinar recordings
  // For now, we'll just simulate the process
  try {
    const { webinarId, recordingUrl } = body;

    if (!webinarId || !recordingUrl) {
      return NextResponse.json(
        { error: 'Webinar ID and recording URL are required' },
        { status: 400 }
      );
    }

    // Update webinar with recording information
    await prisma.webinar.update({
      where: { id: webinarId },
      data: {
        recordingUrl,
        recordingAvailable: true,
        recordingAddedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Recording uploaded successfully' },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const webinarId = url.searchParams.get('webinarId');
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type') || 'upcoming';

    switch (type) {
      case 'upcoming':
        return getUpcomingWebinars();
      case 'past':
        return getPastWebinars();
      case 'myWebinars':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required for my webinars' },
            { status: 400 }
          );
        }
        return getUserWebinars(userId);
      case 'webinarDetails':
        if (!webinarId) {
          return NextResponse.json(
            { error: 'Webinar ID is required for webinar details' },
            { status: 400 }
          );
        }
        return getWebinarDetails(webinarId);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in webinar API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUpcomingWebinars(): Promise<NextResponse> {
  const now = new Date();
  
  const webinars = await prisma.webinar.findMany({
    where: {
      date: {
        gte: now,
      },
    },
    include: {
      presenter: {
        select: {
          id: true,
          name: true,
          role: true,
          image: true,
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return NextResponse.json({ webinars }, { status: 200 });
}

async function getPastWebinars(): Promise<NextResponse> {
  const now = new Date();
  
  const webinars = await prisma.webinar.findMany({
    where: {
      date: {
        lt: now,
      },
    },
    include: {
      presenter: {
        select: {
          id: true,
          name: true,
          role: true,
          image: true,
        },
      },
      _count: {
        select: {
          registrations: true,
          attendees: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json({ webinars }, { status: 200 });
}

async function getUserWebinars(userId: string): Promise<NextResponse> {
  const now = new Date();
  
  const registrations = await prisma.webinarRegistration.findMany({
    where: {
      userId,
    },
    include: {
      webinar: {
        include: {
          presenter: {
            select: {
              id: true,
              name: true,
              role: true,
              image: true,
            },
          },
        },
      },
    },
  });

  // Separate upcoming and attended webinars
  const upcomingWebinars = registrations
    .filter(reg => new Date(reg.webinar.date) >= now)
    .map(reg => ({
      ...reg.webinar,
      addedToCalendar: reg.addedToCalendar,
      status: 'upcoming',
    }));

  const attendedWebinars = registrations
    .filter(reg => new Date(reg.webinar.date) < now && reg.attended)
    .map(reg => ({
      ...reg.webinar,
      certificateAvailable: reg.certificateIssued,
      status: 'attended',
    }));

  return NextResponse.json({ 
    upcomingWebinars, 
    attendedWebinars 
  }, { status: 200 });
}

async function getWebinarDetails(webinarId: string): Promise<NextResponse> {
  const webinar = await prisma.webinar.findUnique({
    where: {
      id: webinarId,
    },
    include: {
      presenter: {
        select: {
          id: true,
          name: true,
          role: true,
          image: true,
        },
      },
      _count: {
        select: {
          registrations: true,
          attendees: true,
        },
      },
    },
  });

  if (!webinar) {
    return NextResponse.json(
      { error: 'Webinar not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ webinar }, { status: 200 });
}
