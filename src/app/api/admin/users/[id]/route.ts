import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for user ID validation
const userIdSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
});

// Schema for updating user
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

// GET handler for fetching a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Validate user ID
    const parsed = userIdSchema.safeParse({ id: params.id });
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Fetch user
    const user = await db.user.findById(params.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the user' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Validate user ID
    const parsedId = userIdSchema.safeParse({ id: params.id });
    
    if (!parsedId.success) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, role } = parsed.data;
    
    // Check if user exists
    const existingUser = await db.user.findById(params.id);
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if email is already used by another user
    if (email !== existingUser.email) {
      const emailExists = await db.user.findByEmail(email);
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already in use by another user' },
          { status: 409 }
        );
      }
    }
    
    // Update user
    const updatedUser = await db.user.update(params.id, {
      name,
      email,
      role,
    });
    
    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the user' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Validate user ID
    const parsed = userIdSchema.safeParse({ id: params.id });
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db.user.findById(params.id);
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prevent deleting the last admin user
    if (existingUser.role === 'admin') {
      const adminCount = await db.prisma.user.count({
        where: { role: 'admin' },
      });
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }
    }
    
    // Delete user
    await db.user.delete(params.id);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the user' },
      { status: 500 }
    );
  }
}
