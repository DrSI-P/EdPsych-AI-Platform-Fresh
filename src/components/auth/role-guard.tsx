import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

/**
 * Role-based access control component for EdPsych Connect
 * Restricts access to pages based on user roles
 */

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth/login' 
}: RoleGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  
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
    
    // Check if user has required role
    const userRole = session.user?.role || 'user';
    const hasRequiredRole = allowedRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to unauthorized page
      router.push('/unauthorized');
      return;
    }
    
    // User is authorized
    setIsAuthorized(true);
  }, [session, status, router, allowedRoles, redirectTo]);
  
  // Show loading state while checking authorization
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authorization...</p>
        </div>
      </div>
    );
  }
  
  // User is authorized, render children
  return <>{children}</>;
};

export default RoleGuard;
