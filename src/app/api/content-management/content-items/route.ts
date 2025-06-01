import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { ContentItem, ReviewStatus } from '@/lib/content-management/types';

// Mock database for demonstration purposes
let contentItems: ContentItem[] = [];

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // In a real application, this would fetch from a database
    return NextResponse.json(contentItems);
  } catch (error) {
    console.error('Error fetching content items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    // In a real application, this would check proper authentication
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'You must be logged in to create content' },
    //     { status: 401 }
    //   );
    // }

    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.subject || !body.keyStage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new content item
    const newItem: ContentItem = {
      ...body,
      id: `content-${Date.now()}`,
      reviewStatus: body.reviewStatus || ReviewStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real application, this would save to a database
    contentItems.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating content item:', error);
    return NextResponse.json(
      { error: 'Failed to create content item' },
      { status: 500 }
    );
  }
}
