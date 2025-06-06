import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for the question form
const questionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
  category: z.string().min(1, 'Category is required'),
  question: z.string().min(10, 'Question must be at least 10 characters long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = questionSchema.parse(body);
    
    // Here you would typically:
    // 1. Save the question to your database
    // 2. Send an email notification to Dr. Scott
    // 3. Send a confirmation email to the user
    
    // For now, we'll simulate a successful submission
    console.log('Question submitted:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      message: 'Your question has been submitted successfully. Dr. Scott will review it and respond within 24-48 hours.',
      submissionId: `ASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    
  } catch (error) {
    console.error('Error processing question submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Please check your form data and try again.',
        errors: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'An error occurred while submitting your question. Please try again later.',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Ask Dr. Scott API endpoint is working',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}

