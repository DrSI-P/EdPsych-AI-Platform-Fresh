import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { ContentItem, ContentSearchFilters } from '@/lib/content-management/types';

// Mock database for demonstration purposes
// In a real application, this would be a database
let contentItems: ContentItem[] = [];

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query') || '';
    const subjects = searchParams.getAll('subjects[]');
    const keyStages = searchParams.getAll('keyStages[]');
    const contentTypes = searchParams.getAll('contentTypes[]');
    const learningStyles = searchParams.getAll('learningStyles[]');
    const difficultyLevels = searchParams.getAll('difficultyLevels[]');
    const tags = searchParams.getAll('tags[]');
    const reviewStatus = searchParams.getAll('reviewStatus[]');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Filter content items based on search parameters
    let filteredItems = [...contentItems];
    
    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply subject filter
    if (subjects.length > 0) {
      filteredItems = filteredItems.filter(item => 
        subjects.includes(item.subject)
      );
    }
    
    // Apply key stage filter
    if (keyStages.length > 0) {
      filteredItems = filteredItems.filter(item => 
        keyStages.includes(item.keyStage)
      );
    }
    
    // Apply content type filter
    if (contentTypes.length > 0) {
      filteredItems = filteredItems.filter(item => 
        contentTypes.includes(item.type)
      );
    }
    
    // Apply learning style filter
    if (learningStyles.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.content.some(variant => 
          learningStyles.includes(variant.learningStyle)
        )
      );
    }
    
    // Apply difficulty level filter
    if (difficultyLevels.length > 0) {
      filteredItems = filteredItems.filter(item => 
        difficultyLevels.includes(item.difficulty)
      );
    }
    
    // Apply tags filter
    if (tags.length > 0) {
      filteredItems = filteredItems.filter(item => 
        tags.some(tag => item.tags.includes(tag))
      );
    }
    
    // Apply review status filter
    if (reviewStatus.length > 0) {
      filteredItems = filteredItems.filter(item => 
        reviewStatus.includes(item.reviewStatus)
      );
    }
    
    // Apply sorting
    filteredItems.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'subject') {
        return sortOrder === 'asc'
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      } else {
        return 0;
      }
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    return NextResponse.json({
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit
    });
  } catch (error) {
    console.error('Error searching content items:', error);
    return NextResponse.json(
      { error: 'Failed to search content items' },
      { status: 500 }
    );
  }
}
