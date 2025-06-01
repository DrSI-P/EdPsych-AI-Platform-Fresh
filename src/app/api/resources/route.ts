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
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
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

    // Determine sort order
    let orderBy = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        orderBy = { downloads: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get resources with pagination
    const resources = await (prisma as any).teachingResource.findMany({
      where,
      orderBy,
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
      },
    });

    // Get total count for pagination
    const totalResources = await (prisma as any).teachingResource.count({ where });
    const totalPages = Math.ceil(totalResources / limit);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        totalResources,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create a resource' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    
    // Extract resource metadata
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string;
    const keyStage = formData.get('keyStage') as string;
    const type = formData.get('type') as string;
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const isPublic = formData.get('isPublic') === 'true';
    const allowDownload = formData.get('allowDownload') === 'true';
    const requireAttribution = formData.get('requireAttribution') === 'true';

    // Validate required fields
    if (!title || !description || !subject || !keyStage || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get files
    const files = formData.getAll('files') as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // In a real implementation, files would be uploaded to storage
    // and their URLs would be saved in the database
    
    // For now, we'll create a resource without actual file storage
    const resource = await (prisma as any).teachingResource.create({
      data: {
        title,
        description,
        subject,
        keyStage,
        type,
        tags,
        isPublic,
        allowDownload,
        requireAttribution,
        author: {
          connect: { id: session.user.id },
        },
        // In a real implementation, we would store file URLs here
        files: [],
        thumbnail: '',
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
