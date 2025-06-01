import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for discussion creation
const discussionCreateSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  title: z.string().min(5).max(200),
  content: z.string().min(10),
});

// Schema for reply creation
const replyCreateSchema = z.object({
  userId: z.string(),
  discussionId: z.string(),
  content: z.string().min(1),
});

// Define interfaces for request data
interface DiscussionCreateData {
  userId: string;
  courseId: string;
  title: string;
  content: string;
}

interface ReplyCreateData {
  userId: string;
  discussionId: string;
  content: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'createDiscussion':
        return handleCreateDiscussion(body);
      case 'createReply':
        return handleCreateReply(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in community API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCreateDiscussion(body: DiscussionCreateData): Promise<NextResponse> {
  try {
    const { userId, courseId, title, content } = discussionCreateSchema.parse(body);

    const discussion = await prisma.courseDiscussion.create({
      data: {
        userId,
        courseId,
        title,
        content,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Discussion created successfully', discussion },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid discussion data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleCreateReply(body: ReplyCreateData): Promise<NextResponse> {
  try {
    const { userId, discussionId, content } = replyCreateSchema.parse(body);

    const reply = await prisma.discussionReply.create({
      data: {
        userId,
        discussionId,
        content,
        createdAt: new Date(),
      },
    });

    // Update the discussion's last activity timestamp
    await prisma.courseDiscussion.update({
      where: { id: discussionId },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json(
      { message: 'Reply created successfully', reply },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reply data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get('courseId');
    const discussionId = url.searchParams.get('discussionId');
    const type = url.searchParams.get('type') || 'discussions';

    switch (type) {
      case 'discussions':
        if (!courseId) {
          return NextResponse.json(
            { error: 'Course ID is required for discussions' },
            { status: 400 }
          );
        }
        return await getCourseDiscussions(courseId);
      case 'replies':
        if (!discussionId) {
          return NextResponse.json(
            { error: 'Discussion ID is required for replies' },
            { status: 400 }
          );
        }
        return await getDiscussionReplies(discussionId);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in community API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getCourseDiscussions(courseId: string): Promise<NextResponse> {
  const discussions = await prisma.courseDiscussion.findMany({
    where: {
      courseId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      lastActivityAt: 'desc',
    },
  });

  return NextResponse.json({ discussions }, { status: 200 });
}

async function getDiscussionReplies(discussionId: string): Promise<NextResponse> {
  const replies = await prisma.discussionReply.findMany({
    where: {
      discussionId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({ replies }, { status: 200 });
}
