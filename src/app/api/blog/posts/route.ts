import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for blog post validation
const blogPostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  summary: z.string().max(500).optional(),
  featuredImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  curriculumArea: z.string().optional().nullable(),
  keyStage: z.string().optional().nullable(),
});

// GET handler for retrieving blog posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const status = searchParams.get('status');
    const author = searchParams.get('author');
    const curriculumArea = searchParams.get('curriculumArea');
    const keyStage = searchParams.get('keyStage');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build where clause based on query parameters
    const where = {};
    
    if (id) {
      where.id = id;
    }
    
    if (slug) {
      where.slug = slug;
    }
    
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }
    
    if (tag) {
      where.tags = {
        has: tag,
      };
    }
    
    if (status) {
      where.status = status;
    } else {
      // Default to published posts only
      where.status = 'published';
    }
    
    if (author) {
      where.author = {
        id: author,
      };
    }
    
    if (curriculumArea) {
      where.curriculumArea = curriculumArea;
    }
    
    if (keyStage) {
      where.keyStage = keyStage;
    }
    
    // Check if user is authenticated to determine if they can see drafts
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;
    
    // If fetching a single post by ID or slug
    if (id || slug) {
      const post = await prisma.blogPost.findFirst({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
      
      // If post not found or not published and user is not authenticated
      if (!post || (post.status !== 'published' && !isAuthenticated)) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      
      // Format post for frontend
      const formattedPost = {
        ...post,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
      
      return NextResponse.json({
        post: formattedPost,
      });
    }
    
    // For listing posts, only show published unless user is authenticated
    if (!isAuthenticated) {
      where.status = 'published';
    }
    
    // Count total posts for pagination
    const totalPosts = await prisma.blogPost.count({ where });
    
    // Fetch posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    });
    
    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      commentCount: post._count.comments,
    }));
    
    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: totalPosts,
        page,
        limit,
        pages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog post
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
    const { categoryIds, ...postData } = body;
    
    // Validate with Zod schema
    const validationResult = blogPostSchema.safeParse(postData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid blog post data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Create slug from title
    let slug = validationResult.data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Check if slug already exists
    const slugExists = await prisma.blogPost.findFirst({
      where: { slug },
    });
    
    // If slug exists, append a unique identifier
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }
    
    // Set published date if status is published
    const publishedAt = validationResult.data.status === 'published' ? new Date() : null;
    
    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        ...validationResult.data,
        slug,
        publishedAt,
        authorId: session.user.id,
        // Connect categories if provided
        ...(categoryIds && categoryIds.length > 0 && {
          categories: {
            create: categoryIds.map((categoryId: string) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog post
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
    const { id, categoryIds, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }
    
    // Validate update data
    const validationResult = blogPostSchema.partial().safeParse(updateData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid blog post data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Check if post exists and user has permission to update it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: true },
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Only the author, teachers, or admins can update posts
    if (
      existingPost.authorId !== session.user.id &&
      !['teacher', 'admin'].includes(session.user.role as string)
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Set published date if status is changing to published
    let publishedAt = existingPost.publishedAt;
    if (updateData.status === 'published' && existingPost.status !== 'published') {
      publishedAt = new Date();
    }
    
    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validationResult.data,
        publishedAt,
        // Update categories if provided
        ...(categoryIds && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId: string) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a blog post
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
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }
    
    // Check if post exists and user has permission to delete it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Only the author or admins can delete posts
    if (
      existingPost.authorId !== session.user.id &&
      session.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
