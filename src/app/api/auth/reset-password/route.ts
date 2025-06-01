import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { hash, compare } from 'bcrypt';
import { randomBytes } from 'crypto';

// Schema for request validation
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

// Request password reset
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const { email } = requestResetSchema.parse(body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return NextResponse.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }
    
    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Store reset token in database
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: resetToken,
        expires: resetTokenExpiry,
      },
      create: {
        userId: user.id,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });
    
    // In a real application, send email with reset link
    // For now, just return the token (this would be removed in production)
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'If your email is registered, you will receive a password reset link',
      // Remove in production:
      debug: { resetToken, resetUrl: `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}` }
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

// Reset password with token
export async function PUT(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const { token, password } = resetPasswordSchema.parse(body);
    
    // Find reset token
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token,
        expires: { gt: new Date() }, // Token must not be expired
      },
      include: {
        user: true,
      },
    });
    
    if (!resetRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      }, { status: 400 });
    }
    
    // Hash new password
    const hashedPassword = await hash(password, 10);
    
    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });
    
    // Delete used reset token
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
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
