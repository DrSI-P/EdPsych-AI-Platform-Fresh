import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Schema for circle template validation
const circleTemplateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ageGroup: z.enum(["all", "primary", "secondary"]),
  purpose: z.enum(["community-building", "problem-solving", "celebration", "conflict-resolution", "academic", "other"]),
  structure: z.object({
    openingCeremony: z.string(),
    checkIn: z.string(),
    mainActivity: z.string(),
    checkOut: z.string(),
    closingCeremony: z.string()
  }),
  questions: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string())
    })
  ),
  materials: z.array(z.string()),
  timeRequired: z.string(),
  spaceSetup: z.string()
});

// GET handler for retrieving circle templates
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const ageGroup = url.searchParams.get('ageGroup');
    const purpose = url.searchParams.get('purpose');
    
    // Build query filters
    const filters = {
      userId: session.user.id
    };
    
    if (ageGroup && ageGroup !== 'all') {
      filters.ageGroup = ageGroup;
    }
    
    if (purpose && purpose !== 'all') {
      filters.purpose = purpose;
    }
    
    // Fetch templates from database
    const templates = await db.circleTemplate.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching circle templates:', error);
    return NextResponse.json(
      { error: "Failed to fetch circle templates" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new circle template
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = circleTemplateSchema.parse(body);
    
    // Create template in database
    const template = await db.circleTemplate.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    });
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating circle template:', error);
    return NextResponse.json(
      { error: "Failed to create circle template" },
      { status: 500 }
    );
  }
}

// PUT handler for updating an existing circle template
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }
    
    // Validate request body
    const validatedData = circleTemplateSchema.parse(body);
    
    // Check if template exists and belongs to user
    const existingTemplate = await db.circleTemplate.findUnique({
      where: {
        id: body.id
      }
    });
    
    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }
    
    if (existingTemplate.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Update template
    const updatedTemplate = await db.circleTemplate.update({
      where: {
        id: body.id
      },
      data: validatedData
    });
    
    return NextResponse.json(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating circle template:', error);
    return NextResponse.json(
      { error: "Failed to update circle template" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a circle template
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }
    
    // Check if template exists and belongs to user
    const existingTemplate = await db.circleTemplate.findUnique({
      where: {
        id: id
      }
    });
    
    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }
    
    if (existingTemplate.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Delete template
    await db.circleTemplate.delete({
      where: {
        id: id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting circle template:', error);
    return NextResponse.json(
      { error: "Failed to delete circle template" },
      { status: 500 }
    );
  }
}
