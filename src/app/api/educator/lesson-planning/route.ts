import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for lesson plan request validation
const LessonPlanRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  yearGroup: z.string().min(1, "Year group is required"),
  templateId: z.string().min(1, "Template ID is required"),
  duration: z.string().optional(),
  objectives: z.string().optional(),
  content: z.record(z.string(), z.string()),
  learningStyles: z.array(z.string()).optional(),
  specialNeeds: z.array(z.string()).optional(),
  userId: z.string().optional(),
  metadata: z.object({
    priorKnowledge: z.string().optional(),
    keyVocabulary: z.string().optional(),
    resources: z.string().optional(),
    notes: z.string().optional()
  }).optional()
});

// Schema for lesson plan retrieval request
const GetLessonPlanSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  subject: z.string().optional(),
  yearGroup: z.string().optional(),
  searchTerm: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = LessonPlanRequestSchema.parse(body);
    
    // In a real implementation, this would save to the database
    // For now, we'll simulate a successful response
    
    const newLessonPlan = {
      id: `plan_${Date.now()}`,
      title: validatedData.title,
      subject: validatedData.subject,
      yearGroup: validatedData.yearGroup,
      templateId: validatedData.templateId,
      duration: validatedData.duration || '60',
      objectives: validatedData.objectives || '',
      content: validatedData.content,
      learningStyles: validatedData.learningStyles || [],
      specialNeeds: validatedData.specialNeeds || [],
      userId: validatedData.userId || 'anonymous',
      metadata: validatedData.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      message: "Lesson plan saved successfully",
      data: newLessonPlan
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save lesson plan" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Extract query parameters
    const params = {
      userId: url.searchParams.get('userId') || undefined,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10,
      offset: url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0,
      subject: url.searchParams.get('subject') || undefined,
      yearGroup: url.searchParams.get('yearGroup') || undefined,
      searchTerm: url.searchParams.get('searchTerm') || undefined
    };
    
    // Validate parameters
    const validatedParams = GetLessonPlanSchema.parse(params);
    
    // In a real implementation, this would query the database
    // For now, we'll return mock data
    
    const mockLessonPlans = [
      {
        id: 'plan_1',
        title: 'Introduction to Fractions',
        subject: 'Mathematics',
        yearGroup: 'Year 4',
        templateId: 'standard',
        duration: '60',
        objectives: 'Students will be able to identify and represent fractions as parts of a whole.',
        learningStyles: ['visual', 'kinesthetic'],
        specialNeeds: [],
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          priorKnowledge: 'Basic understanding of whole numbers and division',
          keyVocabulary: 'Fraction, numerator, denominator, equal parts, whole',
          resources: 'Fraction circles, worksheets, interactive whiteboard'
        },
        createdAt: '2025-05-15T09:30:00Z',
        updatedAt: '2025-05-15T09:30:00Z'
      },
      {
        id: 'plan_2',
        title: 'Romeo and Juliet: Introduction',
        subject: 'English',
        yearGroup: 'Year 10',
        templateId: 'inquiry',
        duration: '90',
        objectives: 'Students will understand the historical context of Shakespeare\'s Romeo and Juliet and identify key themes.',
        learningStyles: ['visual', 'auditory', 'reading'],
        specialNeeds: ['dyslexia'],
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          priorKnowledge: 'Basic understanding of Shakespeare and Elizabethan era',
          keyVocabulary: 'Tragedy, sonnet, iambic pentameter, dramatic irony',
          resources: 'Copies of the play, video clips, character maps'
        },
        createdAt: '2025-05-14T11:15:00Z',
        updatedAt: '2025-05-14T11:15:00Z'
      },
      {
        id: 'plan_3',
        title: 'States of Matter Experiments',
        subject: 'Science',
        yearGroup: 'Year 7',
        templateId: 'station',
        duration: '120',
        objectives: 'Students will investigate the properties of solids, liquids, and gases through hands-on experiments.',
        learningStyles: ['kinesthetic', 'visual'],
        specialNeeds: ['adhd'],
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          priorKnowledge: 'Basic understanding of particles',
          keyVocabulary: 'Solid, liquid, gas, particles, state change, melting, freezing, evaporation, condensation',
          resources: 'Lab equipment, safety goggles, worksheets, digital thermometers'
        },
        createdAt: '2025-05-13T13:45:00Z',
        updatedAt: '2025-05-13T13:45:00Z'
      }
    ];
    
    // Filter by subject if specified
    let filteredPlans = mockLessonPlans;
    if (validatedParams.subject) {
      filteredPlans = filteredPlans.filter(plan => plan.subject === validatedParams.subject);
    }
    
    // Filter by year group if specified
    if (validatedParams.yearGroup) {
      filteredPlans = filteredPlans.filter(plan => plan.yearGroup === validatedParams.yearGroup);
    }
    
    // Search by term if specified
    if (validatedParams.searchTerm) {
      const term = validatedParams.searchTerm.toLowerCase();
      filteredPlans = filteredPlans.filter(plan =>
        plan.title.toLowerCase().includes(term) ||
        (plan.objectives?.toLowerCase() || '').includes(term) ||
        (plan.metadata.keyVocabulary?.toLowerCase() || '').includes(term)
      );
    }
    
    // Apply pagination
    const paginatedPlans = filteredPlans.slice(
      validatedParams.offset ?? 0,
      (validatedParams.offset ?? 0) + (validatedParams.limit ?? 10)
    );
    
    return NextResponse.json({ 
      success: true, 
      data: paginatedPlans,
      total: filteredPlans.length,
      limit: validatedParams.limit,
      offset: validatedParams.offset
    });
    
  } catch (error) {
    console.error('Error retrieving lesson plans:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to retrieve lesson plans" 
    }, { status: 500 });
  }
}
