import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for blog comment validation
const blogCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  content: z.string().min(3, 'Comment must be at least 3 characters'),
  parentId: z.string().optional(),
});

// GET handler for retrieving blog comments
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const postId = searchParams.get('postId');
    const status = searchParams.get('status') || 'approved';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // If ID is provided, return a single comment
    if (id) {
      const comment = await prisma.blogComment.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            where: { status: 'approved' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      return NextResponse.json(comment);
    }

    // If no post ID is provided, return an error
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Build query filters
    const where = {
      postId,
      parentId: null, // Only get top-level comments
    };
    
    // Check if user is admin or teacher to view pending/rejected comments
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      where.status = 'approved';
    } else if (status !== 'all') {
      where.status = status;
    }

    // Get comments with pagination
    const [comments, total] = await Promise.all([
      prisma.blogComment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            where: { status: 'approved' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogComment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog comments' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog comment
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

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogCommentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid comment data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const commentData = validationResult.data;
    
    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: commentData.postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if parent comment exists if parentId is provided
    if (commentData.parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: commentData.parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }

      // Ensure parent comment is for the same post
      if (parentComment.postId !== commentData.postId) {
        return NextResponse.json(
          { error: 'Parent comment does not belong to the specified post' },
          { status: 400 }
        );
      }
    }

    // Auto-approve comments from teachers and admins
    const status = ['teacher', 'admin'].includes(session.user.role) 
      ? 'approved' 
      : 'pending';

    // Create the comment
    const comment = await prisma.blogComment.create({
      data: {
        ...commentData,
        authorId: session.user.id,
        status,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      comment,
      message: status === 'pending' 
        ? 'Comment submitted and awaiting approval' 
        : 'Comment posted successfully',
    });
  } catch (error) {
    console.error('Error creating blog comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog comment status
export async function PUT(req: NextRequest) {
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
    const { id, status, content } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Check if comment exists
    const existingComment = await prisma.blogComment.findUnique({
      where: { id },
      include: { post: true },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Determine update permissions
    let canUpdate = false;
    let canUpdateStatus = false;

    // Comment author can update content but not status
    if (existingComment.authorId === session.user.id) {
      canUpdate = true;
    }

    // Teachers and admins can update status
    if (['teacher', 'admin'].includes(session.user.role)) {
      canUpdate = true;
      canUpdateStatus = true;
    }

    // Post author can update comment status
    if (existingComment.post.authorId === session.user.id) {
      canUpdate = true;
      canUpdateStatus = true;
    }

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {};

    // Only allow status update if user has permission
    if (status && canUpdateStatus) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Only allow content update if user is the author
    if (content && existingComment.authorId === session.user.id) {
      updateData.content = content;
    }

    // If no valid updates, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid update parameters provided' },
        { status: 400 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.blogComment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Error updating blog comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a blog comment
export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Check if comment exists
    const existingComment = await prisma.blogComment.findUnique({
      where: { id },
      include: { post: true },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Determine delete permissions
    let canDelete = false;

    // Comment author can delete their own comment
    if (existingComment.authorId === session.user.id) {
      canDelete = true;
    }

    // Post author can delete comments on their post
    if (existingComment.post.authorId === session.user.id) {
      canDelete = true;
    }

    // Admins can delete any comment
    if (session.user.role === 'admin') {
      canDelete = true;
    }

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.blogComment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
