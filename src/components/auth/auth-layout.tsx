import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

/**
 * Authentication layout component for EdPsych Connect
 * Provides consistent layout for all authentication pages
 */
const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="py-4 px-6 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="flex items-center">
              <img 
                className="h-8 w-auto" 
                src={theme === 'dark' ? "/images/logo-white.svg" : "/images/logo.svg"} 
                alt="EdPsych Connect Logo" 
              />
              <span className="ml-2 text-xl font-bold text-primary dark:text-white">
                EdPsych Connect
              </span>
            </span>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    Help
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EdPsych Connect. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy">
              <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white">
                Terms of Service
              </span>
            </Link>
            <Link href="/accessibility">
              <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white">
                Accessibility
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
