import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth-compat';
import { getUsersByRole, changeUserRole } from '@/lib/auth/users';
import { z } from 'zod';

// GET users by role
export async function GET(
  request: Request,
  { params }: { params: { role: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const { role } = params;
    const users = await getUsersByRole(role);
    
    return NextResponse.json({ 
      success: true, 
      users 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    }, { status: 500 });
  }
}

// PUT change user role
export async function PUT(
  request: Request,
  { params }: { params: { role: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate with Zod schema
    const schema = z.object({
      userId: z.string(),
    });
    
    const { userId } = schema.parse(body);
    const { role } = params;
    
    // Change user role
    const updatedUser = await changeUserRole(userId, role);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User role updated successfully',
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
