import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || undefined;
    const keyStage = searchParams.get('keyStage') || undefined;
    const type = searchParams.get('type') || undefined;

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subject) {
      where.subject = subject;
    }

    if (keyStage) {
      where.keyStage = keyStage;
    }

    if (type) {
      where.type = type;
    }

    // Get immersive learning tools with pagination
    const tools = await prisma.immersiveTool.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
    });

    // Transform data to include calculated fields
    const transformedTools = tools.map(tool => {
      const reviewCount = tool.reviews.length;
      const averageRating = reviewCount > 0 
        ? tool.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
        : null;
      
      return {
        ...tool,
        reviewCount,
        averageRating,
        reviews: undefined,
      };
    });

    // Get total count for pagination
    const totalTools = await prisma.immersiveTool.count({ where });
    const totalPages = Math.ceil(totalTools / limit);

    return NextResponse.json({
      tools: transformedTools,
      pagination: {
        page,
        limit,
        totalTools,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching immersive tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch immersive tools' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create an immersive tool' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    
    // Extract tool metadata
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string;
    const keyStage = formData.get('keyStage') as string;
    const type = formData.get('type') as string;
    const featuresString = formData.get('features') as string;
    const features = featuresString ? JSON.parse(featuresString) : [];
    
    // Validate required fields
    if (!title || !description || !subject || !keyStage || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get files
    const thumbnail = formData.get('thumbnail') as File;
    const toolFile = formData.get('toolFile') as File;
    
    if (!toolFile) {
      return NextResponse.json(
        { error: 'Tool file is required' },
        { status: 400 }
      );
    }

    // In a real implementation, files would be uploaded to storage
    // and their URLs would be saved in the database
    
    // For now, we'll create a tool without actual file storage
    const tool = await prisma.immersiveTool.create({
      data: {
        title,
        description,
        subject,
        keyStage,
        type,
        features,
        toolUrl: 'placeholder-url',
        thumbnailUrl: thumbnail ? 'placeholder-thumbnail-url' : null,
        author: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error('Error creating immersive tool:', error);
    return NextResponse.json(
      { error: 'Failed to create immersive tool' },
      { status: 500 }
    );
  }
}
