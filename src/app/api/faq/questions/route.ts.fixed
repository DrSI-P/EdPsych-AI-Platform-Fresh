import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for FAQ question
const faqQuestionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category ID is required'),
  isPublished: z.boolean().default(true),
  keywords: z.array(z.string()).default([]),
  keyStage: z.string().optional().nullable(),
  curriculumArea: z.string().optional().nullable(),
  isTrainingData: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const keyStage = searchParams.get('keyStage');
    const curriculumArea = searchParams.get('curriculumArea');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // If ID is provided, return specific question
    if (id) {
      const question = await prisma.fAQQuestion.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });
      
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      
      // Increment view count
      await prisma.fAQQuestion.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      
      return NextResponse.json(question);
    }
    
    // Build where clause for filtering
    const where: any = {
      isPublished: true,
    };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { keywords: { has: search } },
      ];
    }
    
    if (keyStage) {
      where.keyStage = keyStage;
    }
    
    if (curriculumArea) {
      where.curriculumArea = curriculumArea;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.fAQQuestion.count({ where });
    
    // Get questions with pagination
    const questions = await prisma.fAQQuestion.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      skip,
      take: limit,
    });
    
    return NextResponse.json({
      questions,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching FAQ questions:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ questions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = faqQuestionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { id: validatedData.data.categoryId },
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }
    
    // Create new question
    const question = await prisma.fAQQuestion.create({
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Question created successfully', question }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ question:', error);
    return NextResponse.json({ error: 'Failed to create FAQ question' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = faqQuestionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if question exists
    const existingQuestion = await prisma.fAQQuestion.findUnique({
      where: { id },
    });
    
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // Check if category exists
    if (validatedData.data.categoryId) {
      const category = await prisma.fAQCategory.findUnique({
        where: { id: validatedData.data.categoryId },
      });
      
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 400 });
      }
    }
    
    // Update question
    const updatedQuestion = await prisma.fAQQuestion.update({
      where: { id },
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    console.error('Error updating FAQ question:', error);
    return NextResponse.json({ error: 'Failed to update FAQ question' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    
    // Check if question exists
    const existingQuestion = await prisma.fAQQuestion.findUnique({
      where: { id },
    });
    
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // Delete question
    await prisma.fAQQuestion.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ question:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ question' }, { status: 500 });
  }
}
