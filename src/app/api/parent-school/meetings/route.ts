import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for meeting validation
const meetingSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.string(),
  time: z.string(),
  duration: z.number().min(5).max(120), // in minutes
  teacherId: z.string(),
  studentId: z.string(),
  location: z.string(),
  description: z.string().optional(),
  agenda: z.array(z.string()).optional(),
  isVirtual: z.boolean().default(false),
  meetingLink: z.string().optional(),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    data: z.string().optional(), // Base64 encoded file data or URL
  })).optional(),
});

// Schema for meeting update
const meetingUpdateSchema = z.object({
  meetingId: z.string(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']).optional(),
  notes: z.string().optional(),
  newDate: z.string().optional(),
  newTime: z.string().optional(),
  newDuration: z.number().min(5).max(120).optional(),
  newLocation: z.string().optional(),
  newMeetingLink: z.string().optional(),
  attendees: z.array(z.string()).optional(),
});

// Schema for meeting notes
const meetingNotesSchema = z.object({
  meetingId: z.string(),
  notes: z.string(),
  actionItems: z.array(z.object({
    description: z.string(),
    assignedTo: z.string(),
    dueDate: z.string().optional(),
  })).optional(),
  followUpDate: z.string().optional(),
});

// Mock database for demonstration
const MOCK_MEETINGS = [
  {
    id: 'meet1',
    title: 'Parent-Teacher Conference',
    date: '2025-05-25',
    time: '16:00-16:30',
    duration: 30,
    teacher: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Class Teacher',
      avatar: '/avatars/teacher1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    location: 'Virtual',
    status: 'Scheduled',
    description: 'Regular end-of-term progress discussion focusing on literacy and numeracy development.',
    agenda: [
      'Review of current progress',
      'Discussion of recent assessments',
      'Setting goals for next term',
      'Any concerns or questions'
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Term Progress Report.pdf',
        url: '/documents/term-progress-report.pdf'
      }
    ],
    isVirtual: true,
    meetingLink: 'https://zoom.us/j/123456789',
    notes: '',
    actionItems: [],
    attendees: []
  },
  // Additional mock meetings would be here
];

/**
 * GET handler for retrieving meetings
 * Supports filtering by teacher, student, date range, and status
 */
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const isVirtual = searchParams.get('isVirtual') === 'true' ? true : 
                      searchParams.get('isVirtual') === 'false' ? false : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // In a real implementation, these would be used to query a database
    // For now, we'll just return the mock data with basic filtering
    
    let filteredMeetings = [...MOCK_MEETINGS];
    
    if (teacherId) {
      filteredMeetings = filteredMeetings.filter(
        meeting => meeting.teacher.id === teacherId
      );
    }
    
    if (studentId) {
      filteredMeetings = filteredMeetings.filter(
        meeting => meeting.student.id === studentId
      );
    }
    
    if (status) {
      filteredMeetings = filteredMeetings.filter(
        meeting => meeting.status === status
      );
    }
    
    if (fromDate) {
      const from = new Date(fromDate);
      filteredMeetings = filteredMeetings.filter(
        meeting => new Date(meeting.date) >= from
      );
    }
    
    if (toDate) {
      const to = new Date(toDate);
      filteredMeetings = filteredMeetings.filter(
        meeting => new Date(meeting.date) <= to
      );
    }
    
    if (isVirtual !== undefined) {
      filteredMeetings = filteredMeetings.filter(
        meeting => meeting.isVirtual === isVirtual
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalMeetings = filteredMeetings.length;
    const totalPages = Math.ceil(totalMeetings / limit);
    
    return NextResponse.json({
      meetings: paginatedMeetings,
      pagination: {
        total: totalMeetings,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for scheduling a new meeting
 */
async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = meetingSchema.parse(body);
    
    // In a real implementation, this would save to a database
    // and handle calendar integration
    
    // Mock response for demonstration
    const newMeeting = {
      id: `meet${Date.now()}`,
      title: validatedData.title,
      date: validatedData.date,
      time: validatedData.time,
      duration: validatedData.duration,
      teacher: {
        id: validatedData.teacherId,
        name: 'Teacher Name', // This would be looked up from the database
        role: 'Teacher Role',
        avatar: '/avatars/default.png'
      },
      student: {
        id: validatedData.studentId,
        name: 'Student Name', // This would be looked up from the database
        year: 'Year X'
      },
      location: validatedData.location,
      status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled',
      description: validatedData.description || '',
      agenda: validatedData.agenda || [],
      documents: validatedData.documents?.map((doc, index) => ({
        id: `doc${Date.now()}_${index}`,
        name: doc.name,
        url: `/documents/${doc.name.toLowerCase().replace(/\s+/g, '-')}`
      })) || [],
      isVirtual: validatedData.isVirtual,
      meetingLink: validatedData.meetingLink || '',
      notes: '',
      actionItems: [],
      attendees: []
    };
    
    // In a real implementation, we would save the meeting to the database
    // and potentially send calendar invites and notifications
    
    return NextResponse.json({
      message: 'Meeting scheduled successfully',
      data: newMeeting
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meeting data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating meeting status, rescheduling, or adding attendees
 */
async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = meetingUpdateSchema.parse(body);
    
    // In a real implementation, this would update the meeting in the database
    // and handle calendar updates
    
    // Mock response for demonstration
    return NextResponse.json({
      message: `Meeting ${validatedData.meetingId} updated successfully`,
      data: {
        id: validatedData.meetingId,
        status: validatedData.status,
        newDate: validatedData.newDate,
        newTime: validatedData.newTime,
        newLocation: validatedData.newLocation,
        newMeetingLink: validatedData.newMeetingLink,
        attendees: validatedData.attendees
      }
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meeting update data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for adding notes and action items after a meeting
 */
async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = meetingNotesSchema.parse(body);
    
    // In a real implementation, this would update the meeting in the database
    // and potentially create tasks for action items
    
    // Mock response for demonstration
    return NextResponse.json({
      message: `Notes added to meeting ${validatedData.meetingId}`,
      data: {
        id: validatedData.meetingId,
        notes: validatedData.notes,
        actionItems: validatedData.actionItems,
        followUpDate: validatedData.followUpDate
      }
    });
  } catch (error) {
    console.error('Error adding meeting notes:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid meeting notes data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add meeting notes' },
      { status: 500 }
    );
  }
}

export { GET, POST, PATCH, PUT };
