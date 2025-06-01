import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

/**
 * Authentication guard component for EdPsych Connect
 * Protects routes that require authentication
 */

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ 
  children, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    // Still loading session
    if (status === 'loading') {
      return;
    }
    
    // No session, redirect to login
    if (!session) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }
    
    // User is authenticated
    setIsAuthenticated(true);
  }, [session, status, router, redirectTo]);
  
  // Show loading state while checking authentication
  if (status === 'loading' || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
