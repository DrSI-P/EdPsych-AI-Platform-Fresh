import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerUser } from '@/lib/auth/users';
import { userSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const validatedData = userSchema.parse(body);
    
    // Register user
    const user = await registerUser(validatedData);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully',
      user 
    }, { status: 201 });
    
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
