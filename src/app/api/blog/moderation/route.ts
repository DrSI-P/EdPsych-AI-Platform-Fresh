import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for comment moderation
const ModerationActionSchema = z.object({
  commentId: z.string(),
  action: z.enum(["approve", "reject", "flag", "delete"]),
  reason: z.string().optional(),
  moderatorId: z.string()
});

// Schema for comment reporting
const ReportSchema = z.object({
  commentId: z.string(),
  reason: z.enum(["inappropriate", "spam", "harassment", "misinformation", "other"]),
  details: z.string().optional(),
  reporterId: z.string()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    
    // Mock data for pending moderation comments
    const mockComments = [
      {
        id: '101',
        postId: '1',
        content: 'This article provides valuable insights! I\'ve been struggling with effective differentiation in my Year 4 class, especially with the wide range of abilities. I\'m going to look into the LiteracyLens platform mentioned - has anyone here had experience with it?',
        author: {
          id: '201',
          name: 'Jane Smith',
          avatar: '/avatars/jane-smith.jpg',
          role: 'Primary Teacher'
        },
        publishedAt: '2025-05-16T09:23:00',
        status: 'pending',
        flags: 0,
        reports: []
      },
      {
        id: '102',
        postId: '1',
        content: 'As a SENCO, I\'m both excited and cautious about AI-powered differentiation. The potential benefits are clear, but I worry about over-reliance on technology and the potential loss of teacher intuition in the differentiation process. How do we ensure we\'re using these tools to enhance rather than replace professional judgment?',
        author: {
          id: '202',
          name: 'Robert Johnson',
          avatar: '/avatars/robert-johnson.jpg',
          role: 'SENCO'
        },
        publishedAt: '2025-05-16T11:42:00',
        status: 'pending',
        flags: 0,
        reports: []
      },
      {
        id: '103',
        postId: '1',
        content: 'Check out my website for more information on AI tools for education! [spam link removed]',
        author: {
          id: '203',
          name: 'Marketing Bot',
          avatar: '/avatars/default.jpg',
          role: 'User'
        },
        publishedAt: '2025-05-16T14:30:00',
        status: 'pending',
        flags: 2,
        reports: [
          {
            id: '301',
            reason: 'spam',
            details: 'Contains promotional links',
            reporterId: '201',
            createdAt: '2025-05-16T14:35:00'
          }
        ]
      }
    ];
    
    // Filter by status
    const filteredComments = mockComments.filter(c => c.status === status && c.postId === postId);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);
    
    return NextResponse.json({
      comments: paginatedComments,
      pagination: {
        total: filteredComments.length,
        page,
        limit,
        pages: Math.ceil(filteredComments.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching comments for moderation:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle comment reporting
    if (body.isReport) {
      try {
        const validatedData = ReportSchema.parse(body);
        
        // Mock report creation response
        return NextResponse.json({
          success: true,
          report: {
            id: Math.floor(Math.random() * 1000).toString(),
            ...validatedData,
            createdAt: new Date().toISOString(),
            status: 'pending' as 'pending' | 'approved' | 'rejected'
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Handle moderation action
    try {
      const validatedData = ModerationActionSchema.parse(body);
      
      // Mock moderation action response
      return NextResponse.json({
        success: true,
        moderation: {
          id: Math.floor(Math.random() * 1000).toString(),
          ...validatedData,
          actionedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing moderation action:', error);
    return NextResponse.json({ error: 'Failed to process moderation action' }, { status: 500 });
  }
}
