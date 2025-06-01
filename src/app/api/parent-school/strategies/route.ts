import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for strategy validation
const strategySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  category: z.string(),
  ageRange: z.string(),
  format: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  file: z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    data: z.string().optional(), // Base64 encoded file data or URL
  }),
});

// Schema for strategy rating
const ratingSchema = z.object({
  strategyId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  userId: z.string(),
});

// Schema for strategy search
const searchSchema = z.object({
  query: z.string().optional(),
  categories: z.array(z.string()).optional(),
  ageRanges: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  minRating: z.number().min(1).max(5).optional(),
  formats: z.array(z.string()).optional(),
});

// Mock database for demonstration
const MOCK_STRATEGIES = [
  {
    id: 'strat1',
    title: 'Reading Comprehension Strategies',
    description: 'Techniques to help your child understand and engage with texts more deeply.',
    category: 'Literacy',
    ageRange: '7-9 years',
    format: 'PDF Guide',
    thumbnail: '/thumbnails/reading-comprehension.jpg',
    rating: 4.8,
    downloads: 156,
    dateAdded: '2025-03-10',
    tags: ['reading', 'comprehension', 'literacy', 'KS2'],
    file: {
      name: 'Reading Comprehension Strategies.pdf',
      size: '2.4 MB',
      url: '/strategies/reading-comprehension-strategies.pdf'
    }
  },
  // Additional mock strategies would be here
];

/**
 * GET handler for retrieving strategies
 * Supports filtering by category, age range, tags, and rating
 */
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const ageRange = searchParams.get('ageRange');
    const tag = searchParams.get('tag');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const format = searchParams.get('format');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // In a real implementation, these would be used to query a database
    // For now, we'll just return the mock data with basic filtering
    
    let filteredStrategies = [...MOCK_STRATEGIES];
    
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredStrategies = filteredStrategies.filter(
        strategy => 
          strategy.title.toLowerCase().includes(searchQuery) ||
          strategy.description.toLowerCase().includes(searchQuery) ||
          strategy.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }
    
    if (category) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.category === category
      );
    }
    
    if (ageRange) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.ageRange === ageRange
      );
    }
    
    if (tag) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.tags.includes(tag)
      );
    }
    
    if (minRating !== undefined) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.rating >= minRating
      );
    }
    
    if (format) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.format === format
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedStrategies = filteredStrategies.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalStrategies = filteredStrategies.length;
    const totalPages = Math.ceil(totalStrategies / limit);
    
    return NextResponse.json({
      strategies: paginatedStrategies,
      pagination: {
        total: totalStrategies,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategies' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new strategy
 */
async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = strategySchema.parse(body);
    
    // In a real implementation, this would save to a database
    // and handle file uploads
    
    // Mock response for demonstration
    const newStrategy = {
      id: `strat${Date.now()}`,
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      ageRange: validatedData.ageRange,
      format: validatedData.format,
      thumbnail: validatedData.thumbnail || '/thumbnails/default.jpg',
      rating: 0,
      downloads: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      tags: validatedData.tags,
      file: {
        name: validatedData.file.name,
        size: `${Math.round(validatedData.file.size / 1024 / 1024 * 10) / 10} MB`,
        url: `/strategies/${validatedData.file.name.toLowerCase().replace(/\s+/g, '-')}`
      }
    };
    
    // In a real implementation, we would save the strategy to the database
    // and handle file storage
    
    return NextResponse.json({
      message: 'Strategy created successfully',
      data: newStrategy
    });
  } catch (error) {
    console.error('Error creating strategy:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid strategy data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create strategy' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for rating a strategy
 */
async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = ratingSchema.parse(body);
    
    // In a real implementation, this would update the strategy rating in the database
    
    // Mock response for demonstration
    return NextResponse.json({
      message: `Strategy ${validatedData.strategyId} rated successfully`,
      data: {
        id: validatedData.strategyId,
        rating: validatedData.rating,
        feedback: validatedData.feedback
      }
    });
  } catch (error) {
    console.error('Error rating strategy:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid rating data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to rate strategy' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for advanced search of strategies
 */
async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = searchSchema.parse(body);
    
    // In a real implementation, this would perform an advanced search in the database
    
    // For demonstration, we'll just filter the mock data
    let filteredStrategies = [...MOCK_STRATEGIES];
    
    if (validatedData.query) {
      const searchQuery = validatedData.query.toLowerCase();
      filteredStrategies = filteredStrategies.filter(
        strategy => 
          strategy.title.toLowerCase().includes(searchQuery) ||
          strategy.description.toLowerCase().includes(searchQuery) ||
          strategy.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }
    
    if (validatedData.categories && validatedData.categories.length > 0) {
      filteredStrategies = filteredStrategies.filter(
        strategy => validatedData.categories!.includes(strategy.category)
      );
    }
    
    if (validatedData.ageRanges && validatedData.ageRanges.length > 0) {
      filteredStrategies = filteredStrategies.filter(
        strategy => validatedData.ageRanges!.includes(strategy.ageRange)
      );
    }
    
    if (validatedData.tags && validatedData.tags.length > 0) {
      filteredStrategies = filteredStrategies.filter(
        strategy => validatedData.tags!.some(tag => strategy.tags.includes(tag))
      );
    }
    
    if (validatedData.minRating !== undefined) {
      filteredStrategies = filteredStrategies.filter(
        strategy => strategy.rating >= validatedData.minRating!
      );
    }
    
    if (validatedData.formats && validatedData.formats.length > 0) {
      filteredStrategies = filteredStrategies.filter(
        strategy => validatedData.formats!.includes(strategy.format)
      );
    }
    
    return NextResponse.json({
      strategies: filteredStrategies,
      total: filteredStrategies.length
    });
  } catch (error) {
    console.error('Error searching strategies:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to search strategies' },
      { status: 500 }
    );
  }
}

export { GET, POST, PATCH, PUT };
