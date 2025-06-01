import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for celebration validation
const celebrationSchema = z.object({
  studentId: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  category: z.string(),
  date: z.string(),
  media: z.array(z.object({
    type: z.enum(['image', 'document', 'video', 'audio']),
    name: z.string(),
    caption: z.string().optional(),
    data: z.string().optional(), // Base64 encoded file data or URL
    mimeType: z.string().optional(),
    size: z.number().optional(),
  })).optional(),
  isPublic: z.boolean().default(false),
});

// Schema for celebration comment
const commentSchema = z.object({
  celebrationId: z.string(),
  content: z.string().min(1),
  authorId: z.string(),
});

// Schema for celebration reaction
const reactionSchema = z.object({
  celebrationId: z.string(),
  type: z.enum(['like', 'heart', 'celebration']),
  userId: z.string(),
});

// Mock database for demonstration
const MOCK_CELEBRATIONS = [
  {
    id: 'cel1',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Star Mathematician Award',
    description: 'Emma received the Star Mathematician award for her excellent progress with multiplication tables and problem-solving skills.',
    date: '2025-05-15',
    category: 'Academic Achievement',
    postedBy: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: [
      {
        id: 'med1',
        type: 'image',
        url: '/celebrations/star-mathematician.jpg',
        caption: 'Emma receiving her certificate in assembly'
      }
    ],
    reactions: {
      likes: 12,
      hearts: 8,
      celebrations: 5
    },
    comments: [
      {
        id: 'com1',
        author: {
          id: 'parent1',
          name: 'Mr. Smith',
          role: 'Parent',
          avatar: '/avatars/parent1.png'
        },
        content: 'We\'re so proud of Emma! She\'s been working really hard on her times tables at home.',
        timestamp: '2025-05-15T14:30:00Z'
      },
      {
        id: 'com2',
        author: {
          id: 'teacher1',
          name: 'Ms. Johnson',
          role: 'Teacher',
          avatar: '/avatars/teacher1.png'
        },
        content: 'Emma\'s dedication is really showing in her work. She\'s becoming very confident with problem-solving too.',
        timestamp: '2025-05-15T15:45:00Z'
      }
    ],
    isPublic: true
  },
  // Additional mock celebrations would be here
];

/**
 * GET handler for retrieving celebrations
 * Supports filtering by student, category, date range, and visibility
 */
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const studentId = searchParams.get('studentId');
    const category = searchParams.get('category');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const isPublic = searchParams.get('isPublic') === 'true' ? true : 
                     searchParams.get('isPublic') === 'false' ? false : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // In a real implementation, these would be used to query a database
    // For now, we'll just return the mock data with basic filtering
    
    let filteredCelebrations = [...MOCK_CELEBRATIONS];
    
    if (studentId) {
      filteredCelebrations = filteredCelebrations.filter(
        celebration => celebration.student.id === studentId
      );
    }
    
    if (category) {
      filteredCelebrations = filteredCelebrations.filter(
        celebration => celebration.category === category
      );
    }
    
    if (fromDate) {
      const from = new Date(fromDate);
      filteredCelebrations = filteredCelebrations.filter(
        celebration => new Date(celebration.date) >= from
      );
    }
    
    if (toDate) {
      const to = new Date(toDate);
      filteredCelebrations = filteredCelebrations.filter(
        celebration => new Date(celebration.date) <= to
      );
    }
    
    if (isPublic !== undefined) {
      filteredCelebrations = filteredCelebrations.filter(
        celebration => celebration.isPublic === isPublic
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCelebrations = filteredCelebrations.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalCelebrations = filteredCelebrations.length;
    const totalPages = Math.ceil(totalCelebrations / limit);
    
    return NextResponse.json({
      celebrations: paginatedCelebrations,
      pagination: {
        total: totalCelebrations,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching celebrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch celebrations' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new celebration
 */
async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = celebrationSchema.parse(body);
    
    // In a real implementation, this would save to a database
    // and handle media uploads
    
    // Mock response for demonstration
    const newCelebration = {
      id: `cel${Date.now()}`,
      student: {
        id: validatedData.studentId,
        name: 'Student Name', // This would be looked up from the database
        year: 'Year X'
      },
      title: validatedData.title,
      description: validatedData.description,
      date: validatedData.date,
      category: validatedData.category,
      postedBy: {
        id: 'current_user', // This would be the authenticated user
        name: 'Current User',
        role: 'Teacher',
        avatar: '/avatars/default.png'
      },
      media: validatedData.media?.map((item, index) => ({
        id: `med${Date.now()}_${index}`,
        type: item.type,
        url: `/celebrations/${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        caption: item.caption
      })) || [],
      reactions: {
        likes: 0,
        hearts: 0,
        celebrations: 0
      },
      comments: [],
      isPublic: validatedData.isPublic
    };
    
    // In a real implementation, we would save the celebration to the database
    // and handle media storage
    
    return NextResponse.json({
      message: 'Celebration created successfully',
      data: newCelebration
    });
  } catch (error) {
    console.error('Error creating celebration:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid celebration data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create celebration' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for adding a comment to a celebration
 */
async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = commentSchema.parse(body);
    
    // In a real implementation, this would update the celebration in the database
    
    // Mock response for demonstration
    const newComment = {
      id: `com${Date.now()}`,
      author: {
        id: validatedData.authorId,
        name: 'Comment Author', // This would be looked up from the database
        role: 'Parent',
        avatar: '/avatars/default.png'
      },
      content: validatedData.content,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: `Comment added to celebration ${validatedData.celebrationId}`,
      data: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid comment data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for adding a reaction to a celebration
 */
async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = reactionSchema.parse(body);
    
    // In a real implementation, this would update the celebration in the database
    
    // Mock response for demonstration
    return NextResponse.json({
      message: `Reaction added to celebration ${validatedData.celebrationId}`,
      data: {
        celebrationId: validatedData.celebrationId,
        reactionType: validatedData.type,
        userId: validatedData.userId
      }
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reaction data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}

export { GET, POST, PATCH, PUT };
