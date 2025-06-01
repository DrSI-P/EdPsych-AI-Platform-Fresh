import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Define interfaces for request data
interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  completedSections: any[];
  certificateIssued?: boolean;
}

interface TrainingModule {
  id: string;
  title: string;
  sections: Array<{
    id: string;
  }>;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { userId, moduleId } = body;
    
    // Check if user is requesting their own certificate or has admin role
    if (userId !== session.user.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      }) as User | null;
      
      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // Verify module completion
    const progress = await prisma.restorativeTrainingProgress.findFirst({
      where: {
        userId,
        moduleId
      }
    }) as TrainingProgress | null;
    
    if (!progress) {
      return NextResponse.json({ error: 'No progress found for this module' }, { status: 404 });
    }
    
    const trainingModule = await prisma.restorativeTrainingModule.findUnique({
      where: { id: moduleId },
      include: { sections: true }
    }) as TrainingModule | null;
    
    if (!trainingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    
    // Check if all sections are completed
    if (progress.completedSections.length !== trainingModule.sections.length) {
      return NextResponse.json({ error: 'Module not fully completed' }, { status: 400 });
    }
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    }) as User | null;
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Create PDF certificate
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    
    // Add fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set up page
    const { width, height } = page.getSize();
    
    // Add border
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.1, 0.4, 0.7),
      borderWidth: 2,
    });
    
    // Add header
    page.drawText('CERTIFICATE OF COMPLETION', {
      x: width / 2 - 180,
      y: height - 80,
      size: 28,
      font: helveticaBold,
      color: rgb(0.1, 0.4, 0.7),
    });
    
    // Add EdPsych-AI-Education-Platform text
    page.drawText('EdPsych-AI-Education-Platform', {
      x: width / 2 - 120,
      y: height - 120,
      size: 18,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Add certificate text
    page.drawText('This is to certify that', {
      x: width / 2 - 80,
      y: height - 180,
      size: 16,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Add user name
    const displayName = user.name || user.email || "Certificate Recipient";
    page.drawText(displayName, {
      x: width / 2 - (displayName.length * 6),
      y: height - 220,
      size: 24,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Add completion text
    page.drawText('has successfully completed the training module', {
      x: width / 2 - 160,
      y: height - 260,
      size: 16,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Add module title
    const moduleTitle = trainingModule.title;
    page.drawText(moduleTitle, {
      x: width / 2 - (moduleTitle.length * 5),
      y: height - 300,
      size: 20,
      font: helveticaBold,
      color: rgb(0.1, 0.4, 0.7),
    });
    
    // Add date
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    page.drawText(`Issued on ${currentDate}`, {
      x: width / 2 - 80,
      y: height - 340,
      size: 14,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Add signature line
    page.drawLine({
      start: { x: width / 2 - 100, y: 120 },
      end: { x: width / 2 + 100, y: 120 },
      thickness: 1,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    page.drawText('Authorized Signature', {
      x: width / 2 - 60,
      y: 100,
      size: 12,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Add certificate ID
    const certificateId = `CERT-${moduleId.substring(0, 8)}-${userId.substring(0, 8)}`;
    page.drawText(`Certificate ID: ${certificateId}`, {
      x: width - 200,
      y: 40,
      size: 8,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    
    // Update progress to mark certificate as issued
    await prisma.restorativeTrainingProgress.update({
      where: { id: progress.id },
      data: { certificateIssued: true }
    });
    
    // Return PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${trainingModule.title.replace(/\s+/g, '_')}_Certificate.pdf"`,
      },
    });
  } catch (error) {
    // Using a type guard instead of console.error
    if (error instanceof Error) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
