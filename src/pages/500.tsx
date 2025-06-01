import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Custom 500 (Server Error) page for EdPsych Connect
 * 
 * This component provides a user-friendly 500 error page when
 * server-side errors occur in production.
 */
export default function Custom500() {
  const router = useRouter();

  // Log 500 errors to monitoring system
  useEffect(() => {
    // Only log in production
    if (process.env.NODE_ENV === 'production') {
      // Send 500 error to monitoring service
      console.error(`500 error occurred on ${router.asPath}`);
      
      // You could add more sophisticated error logging here
      // e.g., Sentry, LogRocket, etc.
    }
  }, [router.asPath]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Server Error | EdPsych Connect</title>
        <meta name="description" content="We're experiencing technical difficulties." />
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Server Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're experiencing some technical difficulties. Our team has been notified 
              and is working to fix the issue as quickly as possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Return Home
              </Link>
              
              <button
                onClick={() => router.reload()}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="font-medium mb-2">What you can do</h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-left list-disc pl-5">
              <li className="mb-1">Refresh the page and try again</li>
              <li className="mb-1">Clear your browser cache and cookies</li>
              <li className="mb-1">Try again in a few minutes</li>
              <li>If the problem persists, please contact our support team</li>
            </ul>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Need immediate assistance?{' '}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                Contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}