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
    const accessibility = searchParams.get('accessibility') || undefined;

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

    if (accessibility) {
      where.accessibility = {
        has: accessibility
      };
    }

    // Get immersive learning experiences with pagination
    const experiences = await prisma.immersiveExperience.findMany({
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
    const transformedExperiences = experiences.map(exp => {
      const reviewCount = exp.reviews.length;
      const averageRating = reviewCount > 0 
        ? exp.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
        : null;
      
      return {
        ...exp,
        reviewCount,
        averageRating,
        reviews: undefined,
      };
    });

    // Get total count for pagination
    const totalExperiences = await prisma.immersiveExperience.count({ where });
    const totalPages = Math.ceil(totalExperiences / limit);

    return NextResponse.json({
      experiences: transformedExperiences,
      pagination: {
        page,
        limit,
        totalExperiences,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching immersive experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch immersive experiences' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create an immersive experience' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    
    // Extract experience metadata
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string;
    const keyStage = formData.get('keyStage') as string;
    const type = formData.get('type') as string;
    const duration = parseInt(formData.get('duration') as string);
    const accessibilityString = formData.get('accessibility') as string;
    const accessibility = accessibilityString ? JSON.parse(accessibilityString) : [];
    
    // Validate required fields
    if (!title || !description || !subject || !keyStage || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get files
    const thumbnail = formData.get('thumbnail') as File;
    const contentFile = formData.get('contentFile') as File;
    
    if (!contentFile) {
      return NextResponse.json(
        { error: 'Content file is required' },
        { status: 400 }
      );
    }

    // In a real implementation, files would be uploaded to storage
    // and their URLs would be saved in the database
    
    // For now, we'll create an experience without actual file storage
    const experience = await prisma.immersiveExperience.create({
      data: {
        title,
        description,
        subject,
        keyStage,
        type,
        duration: duration || 0,
        accessibility,
        contentUrl: 'placeholder-url',
        thumbnailUrl: thumbnail ? 'placeholder-thumbnail-url' : null,
        author: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error('Error creating immersive experience:', error);
    return NextResponse.json(
      { error: 'Failed to create immersive experience' },
      { status: 500 }
    );
  }
}
