import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { ContentSearchFilters } from '@/lib/curriculum-content/types';

/**
 * GET /api/curriculum-content/search
 * Search curriculum content with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // Extract search filters from query params
    const filters: ContentSearchFilters = {};
    
    // Handle array parameters
    const keyStages = searchParams.getAll('keyStage[]');
    if (keyStages.length > 0) filters.keyStage = keyStages;
    
    const subjects = searchParams.getAll('subject[]');
    if (subjects.length > 0) filters.subject = subjects;
    
    const contentTypes = searchParams.getAll('contentType[]');
    if (contentTypes.length > 0) filters.contentType = contentTypes;
    
    const difficultyLevels = searchParams.getAll('difficultyLevel[]');
    if (difficultyLevels.length > 0) filters.difficultyLevel = difficultyLevels;
    
    const statuses = searchParams.getAll('status[]');
    if (statuses.length > 0) filters.status = statuses;
    
    const regions = searchParams.getAll('region[]');
    if (regions.length > 0) filters.region = regions;
    
    // Handle single value parameters
    const createdBy = searchParams.get('createdBy');
    if (createdBy) filters.createdBy = createdBy;
    
    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) filters.dateFrom = dateFrom;
    
    const dateTo = searchParams.get('dateTo');
    if (dateTo) filters.dateTo = dateTo;
    
    // Handle text search
    const searchTerm = searchParams.get('searchTerm');
    
    // Build query
    let query: any = {};
    
    // Add filters to query
    if (filters.keyStage?.length) {
      query.metadata = {
        ...query.metadata,
        keyStage: { in: filters.keyStage }
      };
    }
    
    if (filters.subject?.length) {
      query.metadata = {
        ...query.metadata,
        subject: { in: filters.subject }
      };
    }
    
    if (filters.contentType?.length) {
      query.metadata = {
        ...query.metadata,
        contentType: { in: filters.contentType }
      };
    }
    
    if (filters.difficultyLevel?.length) {
      query.metadata = {
        ...query.metadata,
        difficultyLevel: { in: filters.difficultyLevel }
      };
    }
    
    if (filters.status?.length) {
      query.metadata = {
        ...query.metadata,
        status: { in: filters.status }
      };
    }
    
    if (filters.region?.length) {
      query.metadata = {
        ...query.metadata,
        region: { in: filters.region }
      };
    }
    
    if (filters.createdBy) {
      query.metadata = {
        ...query.metadata,
        createdBy: filters.createdBy
      };
    }
    
    // Date range
    if (filters.dateFrom || filters.dateTo) {
      query.metadata = {
        ...query.metadata,
        updatedAt: {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo })
        }
      };
    }
    
    // Text search
    if (searchTerm) {
      query.OR = [
        { metadata: { title: { contains: searchTerm, mode: 'insensitive' } } },
        { metadata: { description: { contains: searchTerm, mode: 'insensitive' } } },
        { metadata: { topics: { has: searchTerm } } },
        { metadata: { keywords: { has: searchTerm } } }
      ];
    }
    
    // Get total count
    const totalCount = await db.curriculumContent.count({ where: query });
    
    // Get paginated results
    const contents = await db.curriculumContent.findMany({
      where: query,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { 'metadata.updatedAt': 'desc' },
      select: {
        id: true,
        metadata: true
      }
    });
    
    return NextResponse.json({
      totalResults: totalCount,
      page,
      pageSize,
      results: contents.map(content => content.metadata)
    });
  } catch (error) {
    console.error('Error searching curriculum content:', error);
    return NextResponse.json({ error: 'Failed to search curriculum content' }, { status: 500 });
  }
}
