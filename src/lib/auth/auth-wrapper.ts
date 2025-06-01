import { auth as nextAuth } from './auth';

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