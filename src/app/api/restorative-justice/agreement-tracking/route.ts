import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Schema for agreement creation/update
const AgreementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["behavioural", "interpersonal", "reparative", "academic", "attendance"]),
  participants: z.array(z.string()),
  facilitator: z.string().optional(),
  terms: z.array(z.object({
    description: z.string().min(3, "Term description must be at least 3 characters"),
    responsibleParty: z.string(),
    dueDate: z.string(),
    status: z.enum(["pending", "in-progress", "completed", "at-risk"]),
    notes: z.string().optional()
  })),
  followUpDate: z.string(),
  notes: z.string().optional()
});

// Schema for term status update
const TermUpdateSchema = z.object({
  termId: z.string(),
  status: z.enum(["pending", "in-progress", "completed", "at-risk"]),
  notes: z.string().optional()
});

// Define interfaces for request data
interface AgreementFilters {
  userId: string;
  status?: string;
  type?: string;
}

// GET handler for retrieving agreements
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const userId = session.user.id;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    // Build query filters
    const filters: AgreementFilters = { userId };
    
    if (status && status !== 'all') {
      filters.status = status;
    }
    
    if (type && type !== 'all') {
      filters.type = type;
    }
    
    // Fetch agreements from database
    const agreements = await prisma.restorativeAgreement.findMany({
      where: filters,
      include: {
        terms: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(agreements);
  } catch (error) {
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to fetch agreements' }, { status: 500 });
  }
}

// POST handler for creating a new agreement
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = AgreementSchema.parse(body);
    
    // Calculate initial progress (0% for new agreements)
    const progress = 0;
    
    // Create agreement in database
    const agreement = await prisma.restorativeAgreement.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        type: validatedData.type,
        status: 'active' as 'active' | 'completed' | 'at-risk',
        participants: validatedData.participants,
        facilitator: validatedData.facilitator || '',
        followUpDate: new Date(validatedData.followUpDate),
        progress,
        notes: validatedData.notes || '',
        user: {
          connect: {
            id: session.user.id
          }
        },
        terms: {
          create: validatedData.terms.map(term => ({
            description: term.description,
            responsibleParty: term.responsibleParty,
            dueDate: new Date(term.dueDate),
            status: term.status,
            notes: term.notes || ''
          }))
        },
        updates: {
          create: {
            content: 'Agreement created',
            author: session.user.name || 'System'
          }
        }
      },
      include: {
        terms: true,
        updates: true
      }
    });
    
    return NextResponse.json(agreement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
  }
}

// PATCH handler for updating term status
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { agreementId, ...updateData } = body;
    const validatedData = TermUpdateSchema.parse(updateData);
    
    // Verify agreement exists and belongs to user
    const agreement = await prisma.restorativeAgreement.findFirst({
      where: {
        id: agreementId,
        userId: session.user.id
      },
      include: {
        terms: true
      }
    });
    
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }
    
    // Update term status
    await prisma.restorativeAgreementTerm.update({
      where: {
        id: validatedData.termId
      },
      data: {
        status: validatedData.status,
        completedDate: validatedData.status === 'completed' ? new Date() : null,
        notes: validatedData.notes || undefined
      }
    });
    
    // Calculate new progress
    const completedTerms = agreement.terms.filter(term => 
      term.id === validatedData.termId ? 
        validatedData.status === 'completed' : 
        term.status === 'completed'
    ).length;
    
    const progress = Math.round((completedTerms / agreement.terms.length) * 100);
    
    // Determine if agreement status should change
    let status = agreement.status;
    if (progress === 100) {
      status = 'completed';
    } else if (agreement.terms.some(term => 
      term.id === validatedData.termId ? 
        validatedData.status === 'at-risk' : 
        term.status === 'at-risk'
    )) {
      status = 'at-risk';
    }
    
    // Update agreement progress and status
    const updatedAgreement = await prisma.restorativeAgreement.update({
      where: {
        id: agreementId
      },
      data: {
        progress,
        status,
        updates: {
          create: {
            content: `Term "${agreement.terms.find(t => t.id === validatedData.termId)?.description}" status updated to ${validatedData.status}.${validatedData.notes ? ` Notes: ${validatedData.notes}` : ''}`,
            author: session.user.name || 'System'
          }
        }
      },
      include: {
        terms: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    return NextResponse.json(updatedAgreement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    // Using type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to update term status' }, { status: 500 });
  }
}
