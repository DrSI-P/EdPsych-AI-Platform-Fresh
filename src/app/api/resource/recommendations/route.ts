import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// Remove unused import
// import prisma from '@/lib/prisma';

// Schema for resource recommendation request
const resourceRecommendationRequestSchema = z.object({
  contextSource: z.enum(['lesson-plan', 'meeting-notes', 'student-profile', 'manual']),
  contextId: z.string().optional(),
  contextContent: z.string().optional(),
  manualQuery: z.string().optional(),
  filters: z.object({
    resourceTypes: z.array(z.string()).optional(),
    ageRange: z.string().optional(),
    subject: z.string().optional(),
    curriculum: z.string().optional(),
  }).optional(),
  limit: z.number().optional(),
});

// Define interface for recommendation data
interface ResourceRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  file?: string;
  url?: string;
  tags: any[];
  ageRange: string;
  subject: string;
  curriculum: string;
  relevanceScore: number;
  relevanceReason: string;
  createdAt: string;
  updatedAt: string;
}

// Define interface for request data
interface RecommendationRequestData {
  contextSource: 'lesson-plan' | 'meeting-notes' | 'student-profile' | 'manual';
  contextId?: string;
  contextContent?: string;
  manualQuery?: string;
  filters?: {
    resourceTypes?: string[];
    ageRange?: string;
    subject?: string;
    curriculum?: string;
  };
  limit?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = resourceRecommendationRequestSchema.parse(body);
    
    // In a real implementation, this would:
    // 1. Extract key topics and concepts from the context
    // 2. Match these with resources in the database
    // 3. Rank resources by relevance
    // 4. Return the top recommendations
    
    // For now, we'll return mock recommendations
    const mockRecommendations = generateMockRecommendations(validatedData);
    
    return NextResponse.json(mockRecommendations);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error processing resource recommendations:', error);
    return NextResponse.json({ error: 'Failed to process resource recommendations' }, { status: 500 });
  }
}

function generateMockRecommendations(data: RecommendationRequestData): ResourceRecommendation[] {
  const { contextSource, contextContent, manualQuery } = data;
  
  // Base set of resources
  const resources: any[] = [
    {
      id: 'rec-1',
      title: 'Fractions Visual Models Collection',
      description: 'A comprehensive set of visual models for teaching fractions, including fraction bars, number lines, and area models.',
      type: 'document',
      file: '/resources/fractions_visual_models.pdf',
      tags: ['mathematics', 'fractions', 'visual models', 'primary'],
      ageRange: 'primary',
      subject: 'mathematics',
      curriculum: 'UK National Curriculum',
      relevanceScore: 0.95,
      relevanceReason: 'Directly supports visual learning of fractions for Year 5 students',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z'
    },
    {
      id: 'rec-2',
      title: 'Equivalent Fractions Interactive Game',
      description: 'An engaging digital game that helps students practise identifying equivalent fractions through visual comparisons.',
      type: 'link',
      url: 'https://example.com/games/equivalent-fractions',
      tags: ['mathematics', 'fractions', 'interactive', 'game', 'primary'],
      ageRange: 'primary',
      subject: 'mathematics',
      curriculum: 'UK National Curriculum',
      relevanceScore: 0.89,
      relevanceReason: 'Interactive tool for practicing equivalent fractions concepts',
      createdAt: '2025-02-10T14:30:00Z',
      updatedAt: '2025-02-10T14:30:00Z'
    },
    {
      id: 'rec-5',
      title: 'Communication Strategies for SEND Students',
      description: 'A comprehensive guide to supporting students with communication difficulties in the classroom.',
      type: 'document',
      file: '/resources/communication_strategies_send.pdf',
      tags: ['SEND', 'communication', 'strategies', 'inclusion'],
      ageRange: 'all',
      subject: 'special educational needs',
      curriculum: 'UK SEND Code of Practise',
      relevanceScore: 0.94,
      relevanceReason: 'Directly addresses communication difficulties mentioned in EHCNA meeting',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z'
    },
    {
      id: 'rec-8',
      title: 'Science Texts with Dyslexia-Friendly Formatting',
      description: 'Science reading materials specifically formatted for students with dyslexia, featuring appropriate fonts, spacing, and layout.',
      type: 'document',
      file: '/resources/dyslexia_friendly_science.pdf',
      tags: ['science', 'dyslexia', 'accessible', 'secondary'],
      ageRange: 'secondary',
      subject: 'science',
      curriculum: 'UK National Curriculum',
      relevanceScore: 0.97,
      relevanceReason: 'Specifically designed for Year 8 students with dyslexia who enjoy science',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z'
    },
    {
      id: 'rec-11',
      title: 'Mathematics Curriculum Guide',
      description: 'Comprehensive guide to the UK mathematics curriculum with teaching strategies and resources.',
      type: 'document',
      file: '/resources/mathematics_curriculum_guide.pdf',
      tags: ['mathematics', 'curriculum', 'teaching guide'],
      ageRange: 'all',
      subject: 'mathematics',
      curriculum: 'UK National Curriculum',
      relevanceScore: 0.88,
      relevanceReason: 'Matches mathematics query with comprehensive curriculum coverage',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z'
    },
    {
      id: 'rec-13',
      title: 'Literacy Development Framework',
      description: 'Structured framework for developing literacy skills across age groups and abilities.',
      type: 'document',
      file: '/resources/literacy_framework.pdf',
      tags: ['literacy', 'reading', 'writing', 'framework'],
      ageRange: 'all',
      subject: 'english',
      curriculum: 'UK National Curriculum',
      relevanceScore: 0.90,
      relevanceReason: 'Comprehensive literacy resource matching query terms',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z'
    }
  ];
  
  // Filter resources based on context
  let filteredResources = [...resources];
  
  if (contextSource === 'lesson-plan') {
    // Filter for lesson plan context
    const content = contextContent?.toLowerCase() || '';
    if (content.includes('math') || content.includes('fraction')) {
      filteredResources = resources.filter(r => 
        r.subject === 'mathematics' || 
        r.tags.some(tag => ['mathematics', 'fractions'].includes(tag))
      );
    } else if (content.includes('literacy') || content.includes('reading')) {
      filteredResources = resources.filter(r => 
        r.subject === 'english' || 
        r.tags.some(tag => ['literacy', 'reading', 'writing'].includes(tag))
      );
    }
  } else if (contextSource === 'meeting-notes') {
    // Filter for meeting notes context
    const content = contextContent?.toLowerCase() || '';
    if (content.includes('ehcna') || content.includes('send') || content.includes('communication')) {
      filteredResources = resources.filter(r => 
        r.subject === 'special educational needs' || 
        r.tags.some(tag => ['SEND', 'communication', 'inclusion'].includes(tag))
      );
    }
  } else if (contextSource === 'student-profile') {
    // Filter for student profile context
    const content = contextContent?.toLowerCase() || '';
    if (content.includes('dyslexia')) {
      filteredResources = resources.filter(r => 
        r.tags.includes('dyslexia') || 
        r.tags.includes('accessible')
      );
    } else if (content.includes('science')) {
      filteredResources = resources.filter(r => 
        r.subject === 'science'
      );
    }
  } else if (contextSource === 'manual') {
    // Filter for manual query
    const query = manualQuery?.toLowerCase() || '';
    if (query) {
      filteredResources = resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.subject.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
  }
  
  // Apply any additional filters
  if (data.filters) {
    if (data.filters.resourceTypes && data.filters.resourceTypes.length > 0) {
      filteredResources = filteredResources.filter(r => 
        data.filters?.resourceTypes?.includes(r.type)
      );
    }
    
    if (data.filters.ageRange) {
      filteredResources = filteredResources.filter(r => 
        r.ageRange === data.filters?.ageRange || r.ageRange === 'all'
      );
    }
    
    if (data.filters.subject) {
      filteredResources = filteredResources.filter(r => 
        r.subject === data.filters?.subject
      );
    }
    
    if (data.filters.curriculum) {
      filteredResources = filteredResources.filter(r => 
        r.curriculum === data.filters?.curriculum
      );
    }
  }
  
  // Sort by relevance score
  filteredResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Limit results if specified
  if (data.limit && data.limit > 0) {
    filteredResources = filteredResources.slice(0, data.limit);
  }
  
  return filteredResources;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const contextSource = url.searchParams.get('contextSource') || 'manual';
    const contextId = url.searchParams.get('contextId');
    const contextContent = url.searchParams.get('contextContent');
    const manualQuery = url.searchParams.get('query');
    const resourceType = url.searchParams.get('type');
    const ageRange = url.searchParams.get('ageRange');
    const subject = url.searchParams.get('subject');
    
    // Validate parameters
    if (!['lesson-plan', 'meeting-notes', 'student-profile', 'manual'].includes(contextSource)) {
      return NextResponse.json({ error: 'Invalid context source' }, { status: 400 });
    }
    
    // Construct request data
    const requestData: RecommendationRequestData = {
      contextSource: contextSource as 'lesson-plan' | 'meeting-notes' | 'student-profile' | 'manual',
      contextId,
      contextContent,
      manualQuery,
      filters: {
        resourceTypes: resourceType ? [resourceType] : undefined,
        ageRange,
        subject,
      }
    };
    
    // Generate recommendations
    const recommendations = generateMockRecommendations(requestData);
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching resource recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch resource recommendations' }, { status: 500 });
  }
}
