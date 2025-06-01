import { NextRequest } from 'next/server';

// Mock session data
const mockSession = {
  user: {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com',
    role: 'USER'
  }
};

// Mock auth function
export const auth = async () => {
  return mockSession;
};

// Mock GET handler
export const GET = async (req: NextRequest): Promise<Response> => {
  return new Response(JSON.stringify({ error: 'Mock auth handler' }), { status: 200 });
};

// Mock POST handler
export const POST = async (req: NextRequest): Promise<Response> => {
  return new Response(JSON.stringify({ error: 'Mock auth handler' }), { status: 200 });
};

// Export everything else that might be needed
export const signIn = async () => {
  return { error: 'Mock sign in' };
};

export const signOut = async () => {
  return { error: 'Mock sign out' };
};