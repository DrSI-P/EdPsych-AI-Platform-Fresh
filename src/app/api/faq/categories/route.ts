import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for FAQ category
const faqCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return specific category
    if (id) {
      const category = await prisma.fAQCategory.findUnique({
        where: { id },
        include: {
          questions: {
            where: { isPublished: true },
            select: {
              id: true,
              question: true,
              keyStage: true,
              curriculumArea: true,
              viewCount: true,
            },
          },
        },
      });
      
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      
      return NextResponse.json(category);
    }
    
    // Otherwise, return all categories
    const categories = await prisma.fAQCategory.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ categories' }, { status: 500 });
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
    const validatedData = faqCategorySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if slug is already in use
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { slug: validatedData.data.slug },
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
    }
    
    // Create new category
    const category = await prisma.fAQCategory.create({
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ category:', error);
    return NextResponse.json({ error: 'Failed to create FAQ category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = faqCategorySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if category exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if slug is already in use by another category
    if (validatedData.data.slug !== existingCategory.slug) {
      const slugExists = await prisma.fAQCategory.findUnique({
        where: { slug: validatedData.data.slug },
      });
      
      if (slugExists) {
        return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
      }
    }
    
    // Update category
    const updatedCategory = await prisma.fAQCategory.update({
      where: { id },
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error('Error updating FAQ category:', error);
    return NextResponse.json({ error: 'Failed to update FAQ category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    // Check if category exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if category has questions
    if (existingCategory._count.questions > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with questions. Please move or delete the questions first.',
        questionCount: existingCategory._count.questions
      }, { status: 400 });
    }
    
    // Delete category
    await prisma.fAQCategory.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ category:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ category' }, { status: 500 });
  }
}
