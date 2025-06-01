import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { randomBytes } from 'crypto';

// Schema for request validation
const requestVerificationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: "Verification token is required" }),
});

// Request email verification
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const { email } = requestVerificationSchema.parse(body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return NextResponse.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a verification link' 
      });
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json({ 
        success: true, 
        message: 'Your email is already verified' 
      });
    }
    
    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours from now
    
    // Store verification token in database
    // First, try to find an existing token for this email
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email
      }
    });
    
    if (existingToken) {
      // If token exists, delete it first
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: existingToken.identifier,
            token: existingToken.token
          }
        }
      });
    }
    
    // Create a new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: verificationTokenExpiry,
      }
    });
    
    // In a real application, send email with verification link
    // For now, just return the token (this would be removed in production)
    console.log(`Verification token for ${email}: ${verificationToken}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'If your email is registered, you will receive a verification link',
      // Remove in production:
      debug: { verificationToken, verificationUrl: `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}` }
    });
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      }, { status: 400 });
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    }, { status: 500 });
  }
}

// Verify email with token
export async function PUT(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const { token } = verifyEmailSchema.parse(body);
    
    // Find verification token
    const verificationRecord = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: { gt: new Date() }, // Token must not be expired
      },
    });
    
    if (!verificationRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired verification token' 
      }, { status: 400 });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationRecord.identifier },
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Update user email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
    
    // Delete used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationRecord.identifier,
          token: verificationRecord.token
        }
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email has been verified successfully' 
    });
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      }, { status: 400 });
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    }, { status: 500 });
  }
}
