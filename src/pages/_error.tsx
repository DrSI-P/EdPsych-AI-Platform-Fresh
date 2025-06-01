import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

/**
 * Custom error page for EdPsych Connect
 * 
 * This component provides a user-friendly error page with different
 * messages based on the error status code.
 */
const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  const router = useRouter();

  // Log error to monitoring system
  useEffect(() => {
    // Only log in production
    if (process.env.NODE_ENV === 'production') {
      // Send error to monitoring service
      console.error(`Error ${statusCode} occurred on ${router.asPath}`);
      
      // You could add more sophisticated error logging here
      // e.g., Sentry, LogRocket, etc.
    }
  }, [statusCode, router.asPath]);

  // Determine error message based on status code
  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return "We couldn't find the page you're looking for.";
      case 500:
        return "Our server encountered an error. We're working to fix the issue.";
      case 403:
        return "You don't have permission to access this resource.";
      default:
        return "An unexpected error occurred.";
    }
  };

  // Determine error title based on status code
  const getErrorTitle = () => {
    switch (statusCode) {
      case 404:
        return "Page Not Found";
      case 500:
        return "Server Error";
      case 403:
        return "Access Denied";
      default:
        return `Error ${statusCode}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{getErrorTitle()} | EdPsych Connect</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-indigo-600 mb-2">{statusCode}</h1>
            <h2 className="text-2xl font-semibold mb-4">{getErrorTitle()}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{getErrorMessage()}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Return Home
              </Link>
              
              {statusCode === 404 && (
                <Link 
                  href="/resources"
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
                >
                  Browse Resources
                </Link>
              )}
              
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
          
          {statusCode === 404 && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2">Looking for something specific?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Try searching or check out these popular sections:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link href="/blog" className="text-indigo-600 hover:underline">Blog</Link>
                <Link href="/resources" className="text-indigo-600 hover:underline">Resources</Link>
                <Link href="/courses" className="text-indigo-600 hover:underline">Courses</Link>
                <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default ErrorPage;