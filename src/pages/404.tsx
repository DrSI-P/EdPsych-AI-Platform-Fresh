import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Custom 404 (Not Found) page for EdPsych Connect
 * 
 * This component provides a user-friendly 404 page with helpful
 * navigation options and suggestions for users who have reached
 * a non-existent page.
 */
export default function Custom404() {
  const router = useRouter();

  // Log 404 errors to monitoring system
  useEffect(() => {
    // Only log in production
    if (process.env.NODE_ENV === 'production') {
      // Send 404 error to monitoring service
      console.error(`404 error occurred on ${router.asPath}`);
      
      // You could add more sophisticated error logging here
      // e.g., Sentry, LogRocket, etc.
    }
  }, [router.asPath]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Page Not Found | EdPsych Connect</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="mb-6">
              <svg 
                className="w-24 h-24 mx-auto text-indigo-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find the page you're looking for. It might have been moved, 
              deleted, or perhaps the URL was mistyped.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Return Home
              </Link>
              
              <Link 
                href="/resources"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
              >
                Browse Resources
              </Link>
              
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="font-medium mb-2">Looking for something specific?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Try checking out these popular sections:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/blog" className="text-indigo-600 hover:underline">Blog</Link>
              <Link href="/resources" className="text-indigo-600 hover:underline">Resources</Link>
              <Link href="/courses" className="text-indigo-600 hover:underline">Courses</Link>
              <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}