import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/auth';

// Types for session data
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

export interface Session {
  user: SessionUser;
}

// Get the current session
export async function getSession(): Promise<Session | null> {
  const session = await auth();
  return session as Session | null;
}

// Check if the user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

// Check if the user has the required role
export async function hasRole(requiredRoles: string | string[]): Promise<boolean> {
  const session = await getSession();
  
  if (!session) {
    return false;
  }
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(session.user.role);
}

// Middleware to protect routes
export async function authMiddleware(request: NextRequest) {
  const session = await auth();
  
  // If the user is not authenticated, redirect to the login page
  if (!session) {
    return Response.redirect(new URL('/auth/signin', request.url));
  }
  
  return null;
}

// Middleware to protect routes by role
export async function roleMiddleware(request: NextRequest, requiredRoles: string[]) {
  const session = await auth();
  
  // If the user is not authenticated, redirect to the login page
  if (!session) {
    return Response.redirect(new URL('/auth/signin', request.url));
  }
  
  // If the user doesn't have the required role, redirect to the unauthorized page
  if (!requiredRoles.includes((session as Session).user.role)) {
    return Response.redirect(new URL('/unauthorized', request.url));
  }
  
  return null;
}
