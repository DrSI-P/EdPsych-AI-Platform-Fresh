import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';

/**
 * User authentication status component for EdPsych Connect
 * Displays login/register buttons or user profile menu based on authentication status
 */
const AuthStatus = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Handle sign out
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ redirect: true, callbackUrl: '/' });
  };
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }
  
  // User is not authenticated
  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/auth/login">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white">
            Log In
          </span>
        </Link>
        <Link href="/auth/register">
          <span className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90">
            Register
          </span>
        </Link>
      </div>
    );
  }
  
  // User is authenticated
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
          {session.user?.name?.split(' ')[0] || 'User'}
        </span>
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {session.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session.user?.email || ''}
            </p>
          </div>
          
          <Link href="/profile">
            <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <User className="inline-block h-4 w-4 mr-2" />
              Your Profile
            </span>
          </Link>
          
          <Link href="/settings">
            <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="inline-block h-4 w-4 mr-2" />
              Settings
            </span>
          </Link>
          
          <Link href="/help">
            <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <HelpCircle className="inline-block h-4 w-4 mr-2" />
              Help Center
            </span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="inline-block h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
