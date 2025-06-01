import { auth } from '@/lib/auth/auth-compat';
import { getUserById, updateUserProfile } from '@/lib/auth/users';
import { profileSchema } from '@/lib/validations/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// GET user profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const user = await getUserById(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      user 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    }, { status: 500 });
  }
}

// PUT update user profile
export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const validatedData = profileSchema.parse(body);
    
    // Update user profile
    const updatedUser = await updateUserProfile(session.user.id, validatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser 
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
