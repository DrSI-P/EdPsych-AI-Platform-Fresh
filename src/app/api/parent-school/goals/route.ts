import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for goal validation
const goalSchema = z.object({
  studentId: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  category: z.string(),
  subject: z.string().optional(),
  startDate: z.string(),
  targetDate: z.string(),
  schoolActions: z.array(z.string()),
  homeActions: z.array(z.string()),
});

// Schema for goal update validation
const goalUpdateSchema = z.object({
  goalId: z.string(),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'On Hold']).optional(),
  updateContent: z.string().optional(),
  newSchoolActions: z.array(z.string()).optional(),
  newHomeActions: z.array(z.string()).optional(),
  completedActions: z.array(z.string()).optional(),
});

// Schema for evidence validation
const evidenceSchema = z.object({
  goalId: z.string(),
  type: z.enum(['document', 'image', 'audio', 'video', 'link']),
  name: z.string(),
  description: z.string().optional(),
  data: z.string().optional(), // Base64 encoded file data or URL
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

// Mock database for demonstration
const MOCK_GOALS = [
  {
    id: 'goal1',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Improve reading comprehension',
    description: 'Work on understanding and analysing more complex texts, focusing on inference and prediction skills.',
    category: 'Academic',
    subject: 'English',
    startDate: '2025-04-01',
    targetDate: '2025-06-30',
    status: 'In Progress',
    progress: 65,
    schoolActions: [
      'Provide targeted reading materials',
      'Weekly guided reading sessions',
      'Comprehension exercises with feedback'
    ],
    homeActions: [
      'Daily reading for 20 minutes',
      'Discussion about stories and characters',
      'Use of provided comprehension questions'
    ],
    updates: [
      {
        date: '2025-04-15',
        content: 'Emma is showing good progress with literal comprehension questions.',
        author: 'Ms. Johnson (Teacher)'
      },
      {
        date: '2025-05-01',
        content: 'We\'ve been reading together every evening and discussing the stories.',
        author: 'Mr. Smith (Parent)'
      },
      {
        date: '2025-05-10',
        content: 'Emma is now beginning to make predictions about what might happen next in stories.',
        author: 'Ms. Johnson (Teacher)'
      }
    ],
    evidence: [
      {
        id: 'ev1',
        type: 'document',
        name: 'Reading Assessment - April.pdf',
        date: '2025-04-10',
        url: '/evidence/reading-assessment-april.pdf'
      },
      {
        id: 'ev2',
        type: 'document',
        name: 'Reading Assessment - May.pdf',
        date: '2025-05-08',
        url: '/evidence/reading-assessment-may.pdf'
      }
    ]
  },
  // Additional mock goals would be here
];

/**
 * GET handler for retrieving goals
 * Supports filtering by student, category, status, and date range
 */
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const studentId = searchParams.get('studentId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const subject = searchParams.get('subject');
    const startDateAfter = searchParams.get('startDateAfter');
    const targetDateBefore = searchParams.get('targetDateBefore');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // In a real implementation, these would be used to query a database
    // For now, we'll just return the mock data with basic filtering
    
    let filteredGoals = [...MOCK_GOALS];
    
    if (studentId) {
      filteredGoals = filteredGoals.filter(
        goal => goal.student.id === studentId
      );
    }
    
    if (category) {
      filteredGoals = filteredGoals.filter(
        goal => goal.category === category
      );
    }
    
    if (status) {
      filteredGoals = filteredGoals.filter(
        goal => goal.status === status
      );
    }
    
    if (subject) {
      filteredGoals = filteredGoals.filter(
        goal => goal.subject === subject
      );
    }
    
    if (startDateAfter) {
      const startDate = new Date(startDateAfter);
      filteredGoals = filteredGoals.filter(
        goal => new Date(goal.startDate) >= startDate
      );
    }
    
    if (targetDateBefore) {
      const targetDate = new Date(targetDateBefore);
      filteredGoals = filteredGoals.filter(
        goal => new Date(goal.targetDate) <= targetDate
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedGoals = filteredGoals.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalGoals = filteredGoals.length;
    const totalPages = Math.ceil(totalGoals / limit);
    
    return NextResponse.json({
      goals: paginatedGoals,
      pagination: {
        total: totalGoals,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new goal
 */
async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = goalSchema.parse(body);
    
    // In a real implementation, this would save to a database
    
    // Mock response for demonstration
    const newGoal = {
      id: `goal${Date.now()}`,
      student: {
        id: validatedData.studentId,
        name: 'Student Name', // This would be looked up from the database
        year: 'Year X'
      },
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      subject: validatedData.subject,
      startDate: validatedData.startDate,
      targetDate: validatedData.targetDate,
      status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed' | 'On Hold',
      progress: 0,
      schoolActions: validatedData.schoolActions,
      homeActions: validatedData.homeActions,
      updates: [],
      evidence: ''
    };
    
    // In a real implementation, we would save the goal to the database
    // and potentially trigger notifications
    
    return NextResponse.json({
      message: 'Goal created successfully',
      data: newGoal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating goal progress, status, or adding updates
 */
async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = goalUpdateSchema.parse(body);
    
    // In a real implementation, this would update the goal in the database
    
    // Mock response for demonstration
    return NextResponse.json({
      message: `Goal ${validatedData.goalId} updated successfully`,
      data: {
        id: validatedData.goalId,
        progress: validatedData.progress,
        status: validatedData.status,
        update: validatedData.updateContent ? {
          date: new Date().toISOString(),
          content: validatedData.updateContent,
          author: 'Current User' // This would be the authenticated user
        } : null
      }
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal update data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for adding evidence to a goal
 */
async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = evidenceSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Save the file to storage if data is provided
    // 2. Create a record in the database linking the evidence to the goal
    
    // Mock response for demonstration
    const newEvidence = {
      id: `ev${Date.now()}`,
      type: validatedData.type,
      name: validatedData.name,
      description: validatedData.description || '',
      date: new Date().toISOString(),
      url: validatedData.data?.startsWith('http') 
        ? validatedData.data 
        : `/evidence/${validatedData.name.toLowerCase().replace(/\s+/g, '-')}`
    };
    
    return NextResponse.json({
      message: `Evidence added to goal ${validatedData.goalId}`,
      data: newEvidence
    });
  } catch (error) {
    console.error('Error adding evidence:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid evidence data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add evidence' },
      { status: 500 }
    );
  }
}

export { GET, POST, PATCH, PUT };
