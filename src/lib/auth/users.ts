'use client';

import { hash, compare } from 'bcryptjs';
import { db } from '../db-wrapper';

// Export individual functions needed by API routes
export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  [key: string]: any;
}) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findByEmail(userData.email);
    
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }
    
    // Hash password
    const hashedPassword = await hash(userData.password, 10);
    
    // Create user with hashed password
    const newUser = await db.user.create({
      ...userData,
      password: hashedPassword
    });
    
    return { 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Failed to register user' };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.user.findById(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Exclude sensitive information like password
      }
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return { success: false, message: 'Failed to retrieve user' };
  }
}

export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  [key: string]: any;
}) {
  try {
    const user = await db.user.findById(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Ensure password is not updated through this function
    const { password, ...updateData } = profileData;
    
    // Update user profile
    const updatedUser = await db.user.update(userId, updateData);
    
    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

export async function getUsersByRole(role: string) {
  try {
    // Use the db utility to find users by role
    const users = await db.user.findMany({
      where: { role }
    });
    
    // Map users to remove sensitive information
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    
    return { 
      success: true, 
      users: safeUsers
    };
  } catch (error) {
    console.error('Error getting users by role:', error);
    return { success: false, message: 'Failed to retrieve users' };
  }
}

export async function changeUserRole(userId: string, newRole: string) {
  try {
    const user = await db.user.findById(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Update user role
    const updatedUser = await db.user.update(userId, { role: newRole });
    
    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    };
  } catch (error) {
    console.error('Error changing user role:', error);
    return { success: false, message: 'Failed to change role' };
  }
}

export async function verifyPassword(email: string, password: string) {
  try {
    const user = await db.user.findByEmail(email);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (!user.password) {
      return { success: false, message: 'Invalid user credentials' };
    }
    
    // In a real implementation, this would use bcrypt.compare
    // For now, we'll simulate password verification
    const isValid = await compare(password, user.password);
    
    if (!isValid) {
      return { success: false, message: 'Invalid password' };
    }
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error verifying password:', error);
    return { success: false, message: 'Authentication error' };
  }
}

// User authentication functions
export const users = {
  // Verify password for a user
  verifyPassword,
  
  // Create a new user
  createUser: registerUser,
  
  // Update user password
  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
      const user = await db.user.findById(userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      if (!user.password) {
        return { success: false, message: 'Invalid user credentials' };
      }
      
      // Verify current password
      const isValid = await compare(currentPassword, user.password);
      
      if (!isValid) {
        return { success: false, message: 'Current password is incorrect' };
      }
      
      // Hash new password
      const hashedPassword = await hash(newPassword, 10);
      
      // Update user with new password
      await db.user.update(userId, {
        password: hashedPassword
      });
      
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, message: 'Failed to update password' };
    }
  }
};

export default users;
