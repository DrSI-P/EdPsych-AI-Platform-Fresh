import { auth as nextAuth, GET as nextAuthGET, POST as nextAuthPOST } from './auth';

// Create mock handlers for development
const mockGET = () => new Response(JSON.stringify({ error: 'Mock auth handler' }), { status: 200 });
const mockPOST = () => new Response(JSON.stringify({ error: 'Mock auth handler' }), { status: 200 });

// Export the handlers with fallbacks
export const GET = (() => {
  try {
    return nextAuthGET || mockGET;
  } catch (error) {
    console.warn('Auth GET handler failed, using mock handler:', error);
    return mockGET;
  }
})();

export const POST = (() => {
  try {
    return nextAuthPOST || mockPOST;
  } catch (error) {
    console.warn('Auth POST handler failed, using mock handler:', error);
    return mockPOST;
  }
})();

// Create a wrapper for the auth function that handles the case when it's not available
export const auth = async () => {
  try {
    // Try to use the real auth function
    return await nextAuth();
  } catch (error) {
    console.warn('Auth function failed, using mock session:', error);
    
    // In development or when auth fails, return a mock session
    if (process.env.NODE_ENV !== 'production') {
      return {
        user: {
          id: 'mock-user-id',
          name: 'Mock User',
          email: 'mock@example.com',
          role: 'USER'
        }
      };
    }
    
    // In production, return null to indicate no session
    return null;
  }
};
