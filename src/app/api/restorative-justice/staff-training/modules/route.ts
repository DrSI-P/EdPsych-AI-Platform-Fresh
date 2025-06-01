import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for module validation
const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  sections: z.array(
    z.object({
      title: z.string().min(1, "Section title is required"),
      type: z.enum(["video", "text", "quiz", "activity", "reflection"]),
      content: z.string(),
      duration: z.string()
    })
  ),
  resources: z.array(
    z.object({
      title: z.string().min(1, "Resource title is required"),
      type: z.enum(["pdf", "video", "link", "template"]),
      url: z.string().url("Valid URL is required"),
      description: z.string()
    })
  )
});

// Define interfaces for request data
interface User {
  id: string;
  role?: string;
}

interface TrainingModuleSection {
  id: string;
  title: string;
  type: string;
  content: string;
  duration: string;
  order: number;
}

interface TrainingModuleResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  order: number;
  sections: any[];
  resources: any[];
}

// GET handler for retrieving modules
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get modules from database
    const modules = await prisma.restorativeTrainingModule.findMany({
      include: {
        sections: true,
        resources: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    // Format modules for frontend
    const formattedModules = modules.map(moduleItem => ({
      id: moduleItem.id,
      title: moduleItem.title,
      description: moduleItem.description,
      duration: moduleItem.duration,
      level: moduleItem.level,
      order: moduleItem.order,
      sections: moduleItem.sections.map(section => ({
        id: section.id,
        title: section.title,
        type: section.type,
        content: section.content,
        duration: section.duration,
        order: section.order
      })).sort((a, b) => a.order - b.order),
      resources: moduleItem.resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        description: resource.description
      }))
    }));
    
    return NextResponse.json(formattedModules);
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to retrieve modules' }, { status: 500 });
  }
}

// POST handler for creating a new module
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    }) as User | null;
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const validatedData = moduleSchema.parse(body);
      
      // Create module in database
      const createdModule = await prisma.restorativeTrainingModule.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          duration: validatedData.duration,
          level: validatedData.level,
          order: body.order || 0,
          sections: {
            create: validatedData.sections.map((section, index) => ({
              title: section.title,
              type: section.type,
              content: section.content,
              duration: section.duration,
              order: index
            }))
          },
          resources: {
            create: validatedData.resources.map(resource => ({
              title: resource.title,
              type: resource.type,
              url: resource.url,
              description: resource.description
            }))
          }
        },
        include: {
          sections: true,
          resources: true
        }
      }) as TrainingModule;
      
      return NextResponse.json(createdModule, { status: 201 });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: validationError.errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

// PUT handler for updating a module
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    }) as User | null;
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    try {
      const validatedData = moduleSchema.parse(data);
      
      // Update module in database
      const updatedModule = await prisma.restorativeTrainingModule.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          duration: validatedData.duration,
          level: validatedData.level,
          order: body.order || 0,
          sections: {
            deleteMany: {},
            create: validatedData.sections.map((section, index) => ({
              title: section.title,
              type: section.type,
              content: section.content,
              duration: section.duration,
              order: index
            }))
          },
          resources: {
            deleteMany: {},
            create: validatedData.resources.map(resource => ({
              title: resource.title,
              type: resource.type,
              url: resource.url,
              description: resource.description
            }))
          }
        },
        include: {
          sections: true,
          resources: true
        }
      }) as TrainingModule;
      
      return NextResponse.json(updatedModule);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: validationError.errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

// DELETE handler for removing a module
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    }) as User | null;
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get module ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    // Delete module from database
    await prisma.restorativeTrainingModule.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
