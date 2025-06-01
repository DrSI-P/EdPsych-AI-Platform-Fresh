/**
 * Auth Compatibility Layer for Build Process
 * 
 * This file provides mock implementations of auth functions for the build process.
 * It's used to avoid client/server component boundary issues during build.
 */

// Mock session data for build
const mockSession = {
  user: {
    id: "mock-user-id",
    name: "Mock User",
    email: "mock@example.com",
    role: "USER",
  }
};

// Mock auth function that returns the mock session
export const auth = async () => {
  return mockSession;
};

// Mock sign in function
export const signIn = async () => {
  return { ok: true, error: null };
};

// Mock sign out function
export const signOut = async () => {
  return { ok: true };
};

// Mock handlers for API routes
export const handlers = {
  GET: async () => new Response(JSON.stringify({ success: true })),
  POST: async () => new Response(JSON.stringify({ success: true }))
};